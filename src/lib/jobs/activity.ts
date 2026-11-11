// ============================================================================
// Hardware Source: activity.ts
// Version: 1.0.0 — 2026-11-10
// Why: One running log of everything the job search does — the daily run,
//      each board read, scoring, résumés written, status changes and the
//      job-hunter agent's own steps — so the owner can watch it live at
//      /admin/jobs/activity.
// Storage: SystemLog rows with source "jobs" and path "jobs/<kind>". The
//      general /admin/logs viewer hides this source from editors: company and
//      role names are the owner's private target list.
// ============================================================================

import type { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { isActivityLevel, kindFromPath, type ActivityEntry, type ActivityKind, type ActivityLevel } from "./activity-types"

export const JOBS_LOG_SOURCE = "jobs"

export {
    ACTIVITY_KINDS,
    ACTIVITY_LEVELS,
    isActivityKind,
    isActivityLevel,
    kindFromPath,
    type ActivityEntry,
    type ActivityKind,
    type ActivityLevel,
} from "./activity-types"

const MAX_MESSAGE = 500

/**
 * Write one activity line. Never throws: a log that fails must not stop the
 * work it describes.
 */
export async function logActivity(
    kind: ActivityKind,
    level: ActivityLevel,
    message: string,
    data?: Record<string, unknown>,
): Promise<void> {
    try {
        await prisma.systemLog.create({
            data: {
                source: JOBS_LOG_SOURCE,
                path: `jobs/${kind}`,
                level,
                message: message.slice(0, MAX_MESSAGE),
                ...(data ? { data: data as Prisma.InputJsonValue } : {}),
            },
        })
    } catch (error) {
        console.error("[jobs.activity] could not write a log line", error)
    }
}

export type ActivityQuery = {
    /** Only entries newer than this ISO time (for live polling). */
    after?: string
    kind?: ActivityKind
    level?: ActivityLevel
    limit?: number
}

export async function listActivity(query: ActivityQuery = {}): Promise<ActivityEntry[]> {
    const limit = Math.max(1, Math.min(500, query.limit ?? 200))
    const after = query.after ? new Date(query.after) : null

    const rows = await prisma.systemLog.findMany({
        where: {
            source: JOBS_LOG_SOURCE,
            ...(after && !Number.isNaN(after.getTime()) ? { createdAt: { gt: after } } : {}),
            ...(query.kind ? { path: `jobs/${query.kind}` } : {}),
            ...(query.level ? { level: query.level } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        select: { id: true, level: true, path: true, message: true, data: true, createdAt: true },
    })

    return rows.map((row) => ({
        id: row.id,
        level: isActivityLevel(row.level) ? row.level : "info",
        kind: kindFromPath(row.path),
        message: row.message,
        data: row.data,
        createdAt: row.createdAt.toISOString(),
    }))
}
