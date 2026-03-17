import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { withApiLogging } from '@/lib/api-logger'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getHandler(req: NextRequest) {
    const session = await auth()
    if (!session?.user || !['OWNER', 'EDITOR'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const level = searchParams.get('level') || undefined
        const q = searchParams.get('q') || undefined
        const takeRaw = parseInt(searchParams.get('take') || '200', 10)
        const take = Math.max(1, Math.min(200, takeRaw))

        const logs = await prisma.systemLog.findMany({
            where: {
                ...(level ? { level } : {}),
                ...(q ? { message: { contains: q, mode: 'insensitive' } } : {}),
            },
            orderBy: { createdAt: 'desc' },
            take,
        })

        return NextResponse.json({ success: true, data: logs })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load logs' }, { status: 500 })
    }
}

async function deleteHandler(req: NextRequest) {
    const session = await auth()
    if (!session?.user || !['OWNER', 'EDITOR'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

        await prisma.systemLog.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete log entry' }, { status: 500 })
    }
}

export const GET = withApiLogging('GET', getHandler)
export const DELETE = withApiLogging('DELETE', deleteHandler)
