// ============================================================================
// Hardware Source: cost.ts
// Version: 1.0.0 — 2026-11-10
// Why: Small, pure rules that keep the job search's AI spend in check: the
//      agent's daily résumé limit and the 80% budget warning.
// ============================================================================

export const DEFAULT_AGENT_DOCUMENTS_PER_DAY = 10
const MAX_AGENT_DOCUMENTS_PER_DAY = 50
const WARN_AT = 0.8

/** The agent's daily résumé limit from the env value; bad or missing → default. */
export function agentDocumentsCap(raw: string | undefined): number {
    const n = Number.parseInt(raw ?? "", 10)
    if (!Number.isFinite(n) || n < 0) return DEFAULT_AGENT_DOCUMENTS_PER_DAY
    return Math.min(n, MAX_AGENT_DOCUMENTS_PER_DAY)
}

type Spend = { dailyCents: number; monthlyCents: number; todayCents: number; monthCents: number }

/**
 * Money scoring leaves untouched so the day's (and month's) résumés can still
 * be written: résumés are what Farjad applies with, so they come first.
 */
export const RESUME_RESERVE_DAY_CENTS = 20
export const RESUME_RESERVE_MONTH_CENTS = 150

/** Why scoring should stop now to protect the résumé reserve; null to go on. */
export function scoringStopReason(state: Spend): string | null {
    if (state.dailyCents > 0 && state.todayCents >= state.dailyCents - RESUME_RESERVE_DAY_CENTS) {
        return `Scoring paused for today: the last ${dollars(RESUME_RESERVE_DAY_CENTS)} of the daily budget is kept for résumés`
    }
    if (state.monthlyCents > 0 && state.monthCents >= state.monthlyCents - RESUME_RESERVE_MONTH_CENTS) {
        return `Scoring paused for the month: the last ${dollars(RESUME_RESERVE_MONTH_CENTS)} of the monthly budget is kept for résumés`
    }
    return null
}

const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`

/** A warning once spend passes 80% of a cap; null while there is room. */
export function budgetWarning(state: Spend): string | null {
    if (state.monthlyCents > 0 && state.monthCents >= state.monthlyCents * WARN_AT) {
        return `AI spend this month is ${dollars(state.monthCents)} of ${dollars(state.monthlyCents)} — over 80% of the cap`
    }
    if (state.dailyCents > 0 && state.todayCents >= state.dailyCents * WARN_AT) {
        return `AI spend today is ${dollars(state.todayCents)} of ${dollars(state.dailyCents)} — over 80% of the cap`
    }
    return null
}
