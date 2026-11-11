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
