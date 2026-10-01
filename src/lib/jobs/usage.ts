// ============================================================================
// Hardware Source: usage.ts
// Version: 1.0.0 — 2026-10-01
// Why: What the job search has spent on models, by day, by week and in all.
//      Every model call writes one ledger row; the usage page sums them.
//      Costs are estimates from the provider layer's rate table, so they track
//      the real bill closely but are not the bill.
// Env / Identity: Server only. Postgres.
// ============================================================================

import { prisma } from "@/lib/prisma"
import { estimateCents } from "@/lib/content/provider"

/** Days and weeks are the owner's, not UTC's. */
export const USAGE_TIMEZONE = "America/Toronto"

/** Record one call. A ledger failure must never fail the work it describes. */
export async function recordUsage(agent: string, call: { model: string; inputTokens: number; outputTokens: number }): Promise<void> {
    try {
        await prisma.jobUsage.create({
            data: {
                agent,
                model: call.model,
                inputTokens: call.inputTokens,
                outputTokens: call.outputTokens,
                costCents: estimateCents(call.model, call.inputTokens, call.outputTokens),
            },
        })
    } catch (error) {
        console.error("[jobs] usage not recorded", error)
    }
}

export type UsageRow = { period: Date; calls: number; inputTokens: number; outputTokens: number; costCents: number }

type RawRow = { period: Date; calls: bigint; input: bigint | null; output: bigint | null; cents: number | null }

const toRow = (row: RawRow): UsageRow => ({
    period: row.period,
    calls: Number(row.calls),
    inputTokens: Number(row.input ?? 0),
    outputTokens: Number(row.output ?? 0),
    costCents: Number(row.cents ?? 0),
})

export async function usageByDay(days = 14): Promise<UsageRow[]> {
    const rows = await prisma.$queryRaw<RawRow[]>`
        SELECT date_trunc('day', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${USAGE_TIMEZONE}) AS period,
               count(*) AS calls, sum("inputTokens") AS input, sum("outputTokens") AS output, sum("costCents") AS cents
        FROM "JobUsage"
        WHERE "createdAt" > now() - make_interval(days => ${days})
        GROUP BY 1 ORDER BY 1 DESC`
    return rows.map(toRow)
}

export async function usageByWeek(weeks = 8): Promise<UsageRow[]> {
    const rows = await prisma.$queryRaw<RawRow[]>`
        SELECT date_trunc('week', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${USAGE_TIMEZONE}) AS period,
               count(*) AS calls, sum("inputTokens") AS input, sum("outputTokens") AS output, sum("costCents") AS cents
        FROM "JobUsage"
        WHERE "createdAt" > now() - make_interval(weeks => ${weeks})
        GROUP BY 1 ORDER BY 1 DESC`
    return rows.map(toRow)
}

export async function usageByAgent(): Promise<(UsageRow & { agent: string })[]> {
    const rows = await prisma.jobUsage.groupBy({
        by: ["agent"],
        _count: true,
        _sum: { inputTokens: true, outputTokens: true, costCents: true },
    })
    return rows
        .map((row) => ({
            agent: row.agent,
            period: new Date(0),
            calls: row._count,
            inputTokens: row._sum.inputTokens ?? 0,
            outputTokens: row._sum.outputTokens ?? 0,
            costCents: row._sum.costCents ?? 0,
        }))
        .sort((a, b) => b.costCents - a.costCents)
}

export async function usageTotal(): Promise<UsageRow & { since: Date | null }> {
    const total = await prisma.jobUsage.aggregate({
        _count: true,
        _sum: { inputTokens: true, outputTokens: true, costCents: true },
        _min: { createdAt: true },
    })
    return {
        period: new Date(0),
        since: total._min.createdAt,
        calls: total._count,
        inputTokens: total._sum.inputTokens ?? 0,
        outputTokens: total._sum.outputTokens ?? 0,
        costCents: total._sum.costCents ?? 0,
    }
}
