import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { withApiLogging } from '@/lib/api-logger'
import { JOBS_LOG_SOURCE } from '@/lib/jobs/activity'

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
        const source = searchParams.get('source') || undefined
        const q = searchParams.get('q') || undefined
        const takeRaw = parseInt(searchParams.get('take') || '200', 10)
        const take = Math.max(1, Math.min(200, takeRaw))

        const searchFilter = q
            ? {
                  OR: [
                      { message: { contains: q, mode: 'insensitive' as const } },
                      { path: { contains: q, mode: 'insensitive' as const } },
                  ],
              }
            : {}

        // The job search is the owner's private business; editors never see its log lines.
        const ownerOnly =
            session.user.role === 'OWNER' ? {} : { NOT: { source: JOBS_LOG_SOURCE } }
        const where = {
            ...(level ? { level } : {}),
            ...(source ? { source } : {}),
            ...searchFilter,
            ...ownerOnly,
        }

        const [logs, levelCounts, sourceRows] = await Promise.all([
            prisma.systemLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take,
            }),
            // Counts respect source/q filters so the chips reflect the current view
            prisma.systemLog.groupBy({
                by: ['level'],
                where: { ...(source ? { source } : {}), ...searchFilter, ...ownerOnly },
                _count: { _all: true },
            }),
            prisma.systemLog.findMany({
                select: { source: true },
                where: ownerOnly,
                distinct: ['source'],
                take: 20,
            }),
        ])

        const counts: Record<string, number> = {}
        for (const row of levelCounts) counts[row.level] = row._count._all

        return NextResponse.json({
            success: true,
            data: logs,
            counts,
            sources: sourceRows.map((r) => r.source).filter(Boolean),
        })
    } catch {
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
        const olderThanDaysRaw = searchParams.get('olderThanDays')

        // Editors cannot remove the owner's job-search log lines either.
        const ownerOnly =
            session.user.role === 'OWNER' ? {} : { NOT: { source: JOBS_LOG_SOURCE } }

        if (id) {
            const result = await prisma.systemLog.deleteMany({ where: { id, ...ownerOnly } })
            return NextResponse.json({ success: result.count > 0 })
        }

        if (olderThanDaysRaw) {
            const days = Math.max(1, parseInt(olderThanDaysRaw, 10) || 7)
            const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            const result = await prisma.systemLog.deleteMany({
                where: { createdAt: { lt: cutoff }, ...ownerOnly },
            })
            return NextResponse.json({ success: true, deleted: result.count })
        }

        return NextResponse.json({ error: 'id or olderThanDays required' }, { status: 400 })
    } catch {
        return NextResponse.json({ error: 'Failed to delete log entries' }, { status: 500 })
    }
}

export const GET = withApiLogging('GET', getHandler)
export const DELETE = withApiLogging('DELETE', deleteHandler)
