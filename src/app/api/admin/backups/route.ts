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

        // Fire a GitHub Repository Dispatch event rather than running a background script
        const GITHUB_TOKEN = process.env.GITHUB_PAT
        const REPO_OWNER = 'farjadp'
        const REPO_NAME = 'officialwebsite'

        if (!GITHUB_TOKEN) {
            return NextResponse.json({ error: 'GitHub PAT is not configured in Vercel.' }, { status: 500 })
        }

        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'trigger-backup',
                client_payload: { type },
            }),
        });

        if (!response.ok) {
            const errBody = await response.text()
            console.error('[Backup API] GitHub Action trigger failed:', response.status, errBody)
            throw new Error(`GitHub Action trigger failed: ${response.status}`)
        }

        return NextResponse.json({ success: true, message: `Backup sent to GitHub Actions (${type})` })
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
