// ============================================================================
// Hardware Source: monthly-review-rules.ts
// Version: 1.0.0 — 2026-11-10
// Why: The 30-day review cycle and the rules that turn the month's numbers
//      into findings ("what went wrong, what to change next month"). Pure, so
//      the thresholds are tested and argued about here, not in SQL.
// ============================================================================

/** The first cycle starts the day the job-hunter agent went live. */
export const REVIEW_CYCLE_START = "2026-11-11"
export const REVIEW_CYCLE_DAYS = 30
export const MONTHLY_BUDGET_TARGET_CENTS = 1_300

const DAY_MS = 86_400_000

export type Cycle = { number: number; from: Date; to: Date; dueOn: Date }

/** Cycle `n` (1-based) runs [start + (n-1)·30d, start + n·30d). */
export function cycleFor(now: Date, n?: number): Cycle {
    const start = new Date(`${REVIEW_CYCLE_START}T00:00:00-05:00`)
    const elapsed = Math.floor((now.getTime() - start.getTime()) / (REVIEW_CYCLE_DAYS * DAY_MS))
    const number = Math.max(1, n ?? elapsed + 1)
    const from = new Date(start.getTime() + (number - 1) * REVIEW_CYCLE_DAYS * DAY_MS)
    const to = new Date(from.getTime() + REVIEW_CYCLE_DAYS * DAY_MS)
    return { number, from, to, dueOn: to }
}

export type ReviewNumbers = {
    spendCents: number
    resumeCostCents: number
    resumes: number
    scored: number
    scoreCostCents: number
    newPostings: number
    strongMatches: number // scored ≥ 70
    shortlisted: number
    applied: number
    responses: number // interview + offer + rejected after applying
    interviews: number
    offers: number
    dismissedClosed: number
    dismissedTotal: number
    resumesEdited: number
    resumesGuardFixed: number
    failedRuns: number
    runs: number
    daysAtDailyCap: number
}

export type Finding = { severity: "good" | "watch" | "fix"; area: string; text: string; nextMonth: string }

const pct = (part: number, whole: number) => (whole > 0 ? part / whole : 0)
const fmtPct = (value: number) => `${Math.round(value * 100)}%`
const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`

/** The rates the page shows next to the raw counts. */
export function rates(n: ReviewNumbers) {
    return {
        applyRate: pct(n.applied, n.shortlisted),
        responseRate: pct(n.responses, n.applied),
        interviewRate: pct(n.interviews, n.applied),
        editRate: pct(n.resumesEdited, n.resumes),
        guardRate: pct(n.resumesGuardFixed, n.resumes),
        closedRate: pct(n.dismissedClosed, n.dismissedTotal + n.shortlisted),
        strongRate: pct(n.strongMatches, n.scored),
        budgetUse: pct(n.spendCents, MONTHLY_BUDGET_TARGET_CENTS),
        costPerResume: n.resumes ? n.resumeCostCents / n.resumes : 0,
        costPerInterview: n.interviews ? n.spendCents / n.interviews : null,
    }
}

/** Findings ranked fix → watch → good. Thresholds are first guesses to revise each month. */
export function findings(n: ReviewNumbers): Finding[] {
    const r = rates(n)
    const out: Finding[] = []

    if (n.applied === 0) {
        out.push({
            severity: "fix",
            area: "Applications",
            text: "No applications were recorded this cycle.",
            nextMonth: "Mark each posting APPLIED when you submit, or the response numbers cannot be read.",
        })
    } else if (r.applyRate < 0.5) {
        out.push({
            severity: "watch",
            area: "Shortlist",
            text: `Only ${fmtPct(r.applyRate)} of shortlisted postings were applied to.`,
            nextMonth: "Ask why the rest were skipped; tighten the agent's picks or the lanes in the profile.",
        })
    }

    if (n.applied >= 10) {
        if (r.responseRate < 0.1) {
            out.push({
                severity: "fix",
                area: "Responses",
                text: `${fmtPct(r.responseRate)} of applications got any reply (${n.responses} of ${n.applied}).`,
                nextMonth: "Review the résumé and cover-letter prompts and the lanes; compare which lanes got replies.",
            })
        } else {
            out.push({
                severity: "good",
                area: "Responses",
                text: `${fmtPct(r.responseRate)} of applications got a reply; ${n.interviews} interview(s).`,
                nextMonth: "Keep the lanes that produce interviews; drop the ones that produce none.",
            })
        }
    }

    if (n.resumes > 0 && r.editRate > 0.5) {
        out.push({
            severity: "fix",
            area: "Résumé quality",
            text: `You edited ${fmtPct(r.editRate)} of the résumés before using them.`,
            nextMonth: "Collect the kinds of edits you made and fold them into the résumé prompt or the career record.",
        })
    }
    if (n.resumes > 0 && r.guardRate > 0.3) {
        out.push({
            severity: "watch",
            area: "Résumé accuracy",
            text: `The guards had to correct ${fmtPct(r.guardRate)} of résumés (invented or wrong details).`,
            nextMonth: "Add the missing facts to the career record so the model stops guessing.",
        })
    }

    if (r.closedRate > 0.3) {
        out.push({
            severity: "watch",
            area: "Freshness",
            text: `${fmtPct(r.closedRate)} of the agent's candidates were already closed when checked.`,
            nextMonth: "Run the sources more often, or weight newer postings higher.",
        })
    }

    if (n.scored >= 50 && r.strongRate < 0.05) {
        out.push({
            severity: "watch",
            area: "Sources",
            text: `Only ${fmtPct(r.strongRate)} of scored postings reached 70+.`,
            nextMonth: "Replace the boards and searches that bring weak matches.",
        })
    }

    if (r.budgetUse > 1) {
        out.push({
            severity: "fix",
            area: "Budget",
            text: `Spent ${dollars(n.spendCents)} against the ${dollars(MONTHLY_BUDGET_TARGET_CENTS)} target.`,
            nextMonth: "Lower scoring volume first; keep résumés on the strong model.",
        })
    } else if (n.daysAtDailyCap >= 5) {
        out.push({
            severity: "watch",
            area: "Budget",
            text: `The daily cap was hit on ${n.daysAtDailyCap} days.`,
            nextMonth: "Spread scoring over more days or move a little budget from scoring to the daily cap.",
        })
    } else {
        out.push({
            severity: "good",
            area: "Budget",
            text: `Spent ${dollars(n.spendCents)} of ${dollars(MONTHLY_BUDGET_TARGET_CENTS)} (${fmtPct(r.budgetUse)}).`,
            nextMonth:
                r.budgetUse < 0.6
                    ? "There is room: consider a stronger model for résumés if quality findings say so."
                    : "Hold the current settings.",
        })
    }

    if (n.runs > 0 && n.failedRuns / n.runs > 0.2) {
        out.push({
            severity: "fix",
            area: "Reliability",
            text: `${n.failedRuns} of ${n.runs} runs failed.`,
            nextMonth: "Open the Activity log filtered to problems and fix the top error.",
        })
    }

    const order = { fix: 0, watch: 1, good: 2 } as const
    return out.sort((a, b) => order[a.severity] - order[b.severity])
}
