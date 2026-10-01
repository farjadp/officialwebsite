// ============================================================================
// Hardware Source: budget.ts
// Version: 1.0.0 — 2026-10-01
// Why: A hard ceiling on what the job search may spend on models, per day and
//      per month, set by the owner on the Usage page. Every model call asks
//      first; once a ceiling is reached nothing calls a model until the day or
//      month turns over or the ceiling is raised. Scoring checks before each
//      batch of five, so a run can pass the line by at most one batch — a few
//      cents.
// Env / Identity: The verdict is pure; the reads touch Postgres.
// ============================================================================

import { prisma } from "@/lib/prisma"
import { USAGE_TIMEZONE } from "./usage"

const DAILY_KEY = "jobs.budget.dailyCents"
const MONTHLY_KEY = "jobs.budget.monthlyCents"

/** A day of scoring is about 50 cents; these leave room for résumés and reviews. */
export const DEFAULT_CAPS = { dailyCents: 300, monthlyCents: 4_000 }

export type Caps = { dailyCents: number; monthlyCents: number }
export type Spend = { todayCents: number; monthCents: number }
export type BudgetState = Caps & Spend & { ok: boolean; reason: string | null }

export class BudgetExceeded extends Error {
    constructor(reason: string) {
        super(reason)
        this.name = "BudgetExceeded"
    }
}

export function budgetVerdict(caps: Caps, spend: Spend): { ok: boolean; reason: string | null } {
    const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`
    if (spend.todayCents >= caps.dailyCents) {
        return { ok: false, reason: `Today's AI budget of ${dollars(caps.dailyCents)} is used up (${dollars(spend.todayCents)} spent). It resets at midnight Toronto time, or raise it on the Usage page.` }
    }
    if (spend.monthCents >= caps.monthlyCents) {
        return { ok: false, reason: `This month's AI budget of ${dollars(caps.monthlyCents)} is used up (${dollars(spend.monthCents)} spent). Raise it on the Usage page to continue.` }
    }
    return { ok: true, reason: null }
}

function readCents(value: string | undefined, fallback: number): number {
    const parsed = Number(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

export async function loadCaps(): Promise<Caps> {
    const rows = await prisma.appSetting.findMany({ where: { key: { in: [DAILY_KEY, MONTHLY_KEY] } } })
    const get = (key: string) => rows.find((row) => row.key === key)?.value
    return {
        dailyCents: readCents(get(DAILY_KEY), DEFAULT_CAPS.dailyCents),
        monthlyCents: readCents(get(MONTHLY_KEY), DEFAULT_CAPS.monthlyCents),
    }
}

export async function saveCaps(caps: Caps): Promise<void> {
    for (const [key, value] of [[DAILY_KEY, caps.dailyCents], [MONTHLY_KEY, caps.monthlyCents]] as const) {
        await prisma.appSetting.upsert({ where: { key }, create: { key, value: String(value) }, update: { value: String(value) } })
    }
}

export async function currentSpend(): Promise<Spend> {
    const [row] = await prisma.$queryRaw<{ today: number | null; month: number | null }[]>`
        SELECT
            sum("costCents") FILTER (WHERE date_trunc('day', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${USAGE_TIMEZONE})
                = date_trunc('day', now() AT TIME ZONE ${USAGE_TIMEZONE})) AS today,
            sum("costCents") FILTER (WHERE date_trunc('month', "createdAt" AT TIME ZONE 'UTC' AT TIME ZONE ${USAGE_TIMEZONE})
                = date_trunc('month', now() AT TIME ZONE ${USAGE_TIMEZONE})) AS month
        FROM "JobUsage"
        WHERE "createdAt" > now() - interval '32 days'`
    return { todayCents: Number(row?.today ?? 0), monthCents: Number(row?.month ?? 0) }
}

export async function budgetState(): Promise<BudgetState> {
    const [caps, spend] = await Promise.all([loadCaps(), currentSpend()])
    return { ...caps, ...spend, ...budgetVerdict(caps, spend) }
}

/** Ask before a model call. Throws `BudgetExceeded` with a message fit to show. */
export async function assertBudget(): Promise<void> {
    const state = await budgetState()
    if (!state.ok) throw new BudgetExceeded(state.reason ?? "AI budget reached")
}
