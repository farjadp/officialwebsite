// src/app/api/admin/backups/route.ts
// GET: list all backups | POST: trigger a new backup | DELETE: remove log entry

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { execFile } from 'child_process'
import { resolve } from 'path'

export async function GET() {
    try {
        const logs = await prisma.backupLog.findMany({
            orderBy: { date: 'desc' },
            take: 60,
        })

        const serialized = logs.map((l) => ({
            ...l,
            dbSizeBytes: l.dbSizeBytes?.toString() ?? null,
            codeSizeBytes: l.codeSizeBytes?.toString() ?? null,
        }))

        return NextResponse.json({ success: true, data: serialized })
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}))
        const type = (body.type as string) || 'full'

        const scriptPath = resolve(process.cwd(), 'scripts', 'backup.mjs')
        const nodeBin = process.execPath

        // Fire and forget — runs in background
        const child = execFile(nodeBin, [scriptPath, type], {
            env: { ...process.env },
            cwd: process.cwd(),
        })

        child.on('error', (err: Error) => {
            console.error('[Backup API] Background script error:', err.message)
        })

        return NextResponse.json({ success: true, message: `Backup started (${type})` })
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

        await prisma.backupLog.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}
