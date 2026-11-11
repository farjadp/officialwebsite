// ============================================================================
// Hardware Source: monthly-review.ts
// Version: 1.0.0 — 2026-11-10
// Why: The numbers for one 30-day review cycle, read from the job tables, the
//      usage table and the activity log. The rules that judge them live in
//      monthly-review-rules.ts.
// ============================================================================

import { prisma } from "@/lib/prisma"
import { JOBS_LOG_SOURCE } from "./activity"
import { loadCaps } from "./budget"
import type { Cycle, ReviewNumbers } from "./monthly-review-rules"
import { USAGE_TIMEZONE } from "./usage"

export type Breakdown = { key: string; strong: number; applied: number; interviews: number }

export type MonthlyReview = {
    numbers: ReviewNumbers
    byLane: Breakdown[]
    byBoard: Breakdown[]
    dailyCapCents: number
}

const n = (value: unknown) => Number(value ?? 0)

export async function loadMonthlyReview(cycle: Cycle): Promise<MonthlyReview> {
    const { from, to } = cycle
    const caps = await loadCaps()

    const [usage] = await prisma.$queryRaw<{ total: number | null; resume: number | null; score: number | null }[]>`
        SELECT sum("costCents") AS total,
               sum("costCents") FILTER (WHERE agent = 'jobs.resume') AS resume,
               sum("costCents") FILTER (WHERE agent = 'jobs.score') AS score
        FROM "JobUsage" WHERE "createdAt" >= ${from} AND "createdAt" < ${to}`

    const days = await prisma.$queryRaw<{ cents: number }[]>`
        SELECT sum("costCents") AS cents FROM "JobUsage"
        WHERE "createdAt" >= ${from} AND "createdAt" < ${to}
        GROUP BY date_trunc('day', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${USAGE_TIMEZONE})`

    const [docs] = await prisma.$queryRaw<{ total: bigint; edited: bigint; fixed: bigint }[]>`
        SELECT count(*) AS total,
               count(*) FILTER (WHERE "editedAt" IS NOT NULL) AS edited,
               count(*) FILTER (WHERE cardinality(notes) > 0) AS fixed
        FROM "JobDocument" WHERE "createdAt" >= ${from} AND "createdAt" < ${to}`

    const [postings] = await prisma.$queryRaw<{ fresh: bigint; scored: bigint; strong: bigint; applied: bigint }[]>`
        SELECT count(*) FILTER (WHERE "firstSeenAt" >= ${from} AND "firstSeenAt" < ${to}) AS fresh,
               count(*) FILTER (WHERE "scoredAt" >= ${from} AND "scoredAt" < ${to}) AS scored,
               count(*) FILTER (WHERE "scoredAt" >= ${from} AND "scoredAt" < ${to} AND score >= 70) AS strong,
               count(*) FILTER (WHERE "appliedAt" >= ${from} AND "appliedAt" < ${to}) AS applied
        FROM "JobPosting"`

    // Status moves come from the activity log: it is the only place their dates live.
    const [moves] = await prisma.$queryRaw<
        {
            shortlisted: bigint
            interviews: bigint
            offers: bigint
            responses: bigint
            dismissed: bigint
            closed: bigint
        }[]
    >`
        SELECT count(DISTINCT data->>'postingId') FILTER (WHERE data->>'to' = 'SHORTLISTED') AS shortlisted,
               count(DISTINCT data->>'postingId') FILTER (WHERE data->>'to' = 'INTERVIEW') AS interviews,
               count(DISTINCT data->>'postingId') FILTER (WHERE data->>'to' = 'OFFER') AS offers,
               count(DISTINCT data->>'postingId') FILTER (WHERE data->>'to' IN ('INTERVIEW', 'OFFER', 'REJECTED')) AS responses,
               count(DISTINCT data->>'postingId') FILTER (WHERE data->>'to' = 'DISMISSED') AS dismissed,
               count(DISTINCT data->>'postingId') FILTER (WHERE data->>'to' = 'DISMISSED' AND data->>'note' ILIKE '%closed%') AS closed
        FROM "SystemLog"
        WHERE source = ${JOBS_LOG_SOURCE} AND path = 'jobs/status' AND "createdAt" >= ${from} AND "createdAt" < ${to}`

    const [runs] = await prisma.$queryRaw<{ runs: bigint; failed: bigint }[]>`
        SELECT count(*) FILTER (WHERE message LIKE 'Run finished%') AS runs,
               count(*) FILTER (WHERE level = 'error') AS failed
        FROM "SystemLog"
        WHERE source = ${JOBS_LOG_SOURCE} AND path = 'jobs/run' AND "createdAt" >= ${from} AND "createdAt" < ${to}`

    const breakdown = async (column: "lane" | "board") => {
        const rows =
            column === "lane"
                ? await prisma.$queryRaw<{ key: string | null; strong: bigint; applied: bigint }[]>`
                    SELECT lane AS key,
                           count(*) FILTER (WHERE score >= 70 AND "scoredAt" >= ${from} AND "scoredAt" < ${to}) AS strong,
                           count(*) FILTER (WHERE "appliedAt" >= ${from} AND "appliedAt" < ${to}) AS applied
                    FROM "JobPosting" GROUP BY lane`
                : await prisma.$queryRaw<{ key: string | null; strong: bigint; applied: bigint }[]>`
                    SELECT b.label AS key,
                           count(*) FILTER (WHERE p.score >= 70 AND p."scoredAt" >= ${from} AND p."scoredAt" < ${to}) AS strong,
                           count(*) FILTER (WHERE p."appliedAt" >= ${from} AND p."appliedAt" < ${to}) AS applied
                    FROM "JobPosting" p JOIN "JobBoard" b ON b.id = p."boardId" GROUP BY b.label`
        const interviews =
            column === "lane"
                ? await prisma.$queryRaw<{ key: string | null; interviews: bigint }[]>`
                    SELECT p.lane AS key, count(DISTINCT p.id) AS interviews
                    FROM "SystemLog" l JOIN "JobPosting" p ON p.id = l.data->>'postingId'
                    WHERE l.source = ${JOBS_LOG_SOURCE} AND l.path = 'jobs/status' AND l.data->>'to' = 'INTERVIEW'
                      AND l."createdAt" >= ${from} AND l."createdAt" < ${to}
                    GROUP BY p.lane`
                : await prisma.$queryRaw<{ key: string | null; interviews: bigint }[]>`
                    SELECT b.label AS key, count(DISTINCT p.id) AS interviews
                    FROM "SystemLog" l JOIN "JobPosting" p ON p.id = l.data->>'postingId'
                    JOIN "JobBoard" b ON b.id = p."boardId"
                    WHERE l.source = ${JOBS_LOG_SOURCE} AND l.path = 'jobs/status' AND l.data->>'to' = 'INTERVIEW'
                      AND l."createdAt" >= ${from} AND l."createdAt" < ${to}
                    GROUP BY b.label`
        const interviewsByKey = new Map(interviews.map((row) => [row.key ?? "—", n(row.interviews)]))
        return rows
            .map((row) => {
                const key = row.key ?? "—"
                return { key, strong: n(row.strong), applied: n(row.applied), interviews: interviewsByKey.get(key) ?? 0 }
            })
            .filter((row) => row.strong > 0 || row.applied > 0 || row.interviews > 0)
            .sort((a, b) => b.applied - a.applied || b.strong - a.strong)
    }

    const [byLane, byBoard] = await Promise.all([breakdown("lane"), breakdown("board")])

    const dailyCapCents = caps.dailyCents
    const numbers: ReviewNumbers = {
        spendCents: Math.round(n(usage?.total)),
        resumeCostCents: Math.round(n(usage?.resume)),
        scoreCostCents: Math.round(n(usage?.score)),
        resumes: n(docs?.total),
        resumesEdited: n(docs?.edited),
        resumesGuardFixed: n(docs?.fixed),
        newPostings: n(postings?.fresh),
        scored: n(postings?.scored),
        strongMatches: n(postings?.strong),
        applied: n(postings?.applied),
        shortlisted: n(moves?.shortlisted),
        interviews: n(moves?.interviews),
        offers: n(moves?.offers),
        responses: n(moves?.responses),
        dismissedTotal: n(moves?.dismissed),
        dismissedClosed: n(moves?.closed),
        runs: n(runs?.runs),
        failedRuns: n(runs?.failed),
        daysAtDailyCap: days.filter((day) => dailyCapCents > 0 && n(day.cents) >= dailyCapCents * 0.95).length,
    }

    return { numbers, byLane, byBoard, dailyCapCents }
}
