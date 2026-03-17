import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withApiLogging } from '@/lib/api-logger'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function clampText(input: string, max: number) {
    if (!input) return ''
    return input.length > max ? `${input.slice(0, max)}…` : input
}

async function postHandler(req: NextRequest) {
    try {
        const body = await req.json()
        const level = ['info', 'warn', 'error'].includes(body.level) ? body.level : 'error'
        const message = clampText(String(body.message || 'Client log'), 500)
        const source = clampText(String(body.source || 'client'), 50)
        const data = body.data ?? undefined

        await prisma.systemLog.create({
            data: {
                level,
                message,
                source,
                data,
                path: body.path ? clampText(String(body.path), 200) : undefined,
                userAgent: body.userAgent ? clampText(String(body.userAgent), 300) : undefined,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to log client error' }, { status: 500 })
    }
}

export const POST = withApiLogging('POST', postHandler)
