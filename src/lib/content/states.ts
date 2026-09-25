// ============================================================================
// Hardware Source: states.ts
// Version: 1.0.0 — 2026-09-25
// Why: The whole pipeline, as one readable table. Everything expensive or
//      irreversible in the content engine hangs off these transitions, so they
//      live apart from the code that talks to the database or to a vendor and
//      can be proven without either.
// Env / Identity: Pure. No database, no network, no clock.
// ============================================================================

export const JOB_STATES = [
    "SCOUTED", // signals clustered, no brief yet
    "BRIEFED", // the angle is decided
    "DRAFTED", // English article written
    "SEO_PASS", // SEO / AEO / GEO audited
    "REVIEW", // adversarial review
    "REVISING", // reviewer asked for changes
    "FA_DRAFT", // Persian article written from the brief, never translated
    "FA_REVIEW", // deterministic Persian gate, then the Persian reviewer
    "ART", // cover and body images
    "READY", // both posts exist as drafts
    "PUBLISHED", // end: at least the English post is live
    "NEEDS_HUMAN", // end: waiting on Farjad
    "FAILED", // end: unrecoverable, or a duplicate of an existing article
] as const

export type JobState = (typeof JOB_STATES)[number]

export const TERMINAL_STATES = ["PUBLISHED", "NEEDS_HUMAN", "FAILED"] as const satisfies readonly JobState[]

export function isTerminal(state: JobState): boolean {
    return (TERMINAL_STATES as readonly string[]).includes(state)
}

/** What a state's handler reports back. */
export type Outcome =
    | { kind: "ok" }
    /** Only REVIEW produces this. */
    | { kind: "review"; verdict: "PASS" | "REVISE" | "BLOCK" }
    /** Only FA_REVIEW produces this: the deterministic gate plus the reviewer. */
    | { kind: "persian"; pass: boolean }
    /** Only the brief produces this: the angle already exists on the blog. */
    | { kind: "duplicate" }
    /** Any state, once its retries are spent. */
    | { kind: "error" }

export type JobPosition = { state: JobState; iteration: number }

export type TransitionOptions = { maxRevisions: number }

/** Straight-line steps: one state, one successful successor. */
const LINEAR: Partial<Record<JobState, JobState>> = {
    SCOUTED: "BRIEFED",
    BRIEFED: "DRAFTED",
    DRAFTED: "SEO_PASS",
    SEO_PASS: "REVIEW",
    REVISING: "DRAFTED",
    FA_DRAFT: "FA_REVIEW",
    ART: "READY",
    READY: "PUBLISHED",
}

/**
 * Where a job goes next.
 *
 * Throws when the job has already finished, or when a state is handed an
 * outcome it cannot produce — a silent fallthrough there would publish an
 * unreviewed article.
 */
export function nextState(
    job: JobPosition,
    outcome: Outcome,
    options: TransitionOptions,
): JobState {
    if (isTerminal(job.state)) {
        throw new Error(`Job is in the terminal state ${job.state}; nothing follows it`)
    }

    // Failure short-circuits from anywhere. A duplicate is a failure we chose,
    // not a fault: it stops the job before any writing is paid for.
    if (outcome.kind === "error" || outcome.kind === "duplicate") return "FAILED"

    switch (job.state) {
        case "REVIEW": {
            if (outcome.kind !== "review") {
                throw new Error(`State REVIEW needs a review outcome, got "${outcome.kind}"`)
            }
            if (outcome.verdict === "PASS") return "FA_DRAFT"
            // A blocker is reputation damage, not a style note: no retry.
            if (outcome.verdict === "BLOCK") return "NEEDS_HUMAN"
            return job.iteration < options.maxRevisions ? "REVISING" : "NEEDS_HUMAN"
        }

        case "FA_REVIEW": {
            if (outcome.kind !== "persian") {
                throw new Error(`State FA_REVIEW needs a persian outcome, got "${outcome.kind}"`)
            }
            if (outcome.pass) return "ART"
            // Persian never blocks English. Out of rewrites, the Persian post
            // simply stays a draft and the job carries on.
            return job.iteration < options.maxRevisions ? "FA_DRAFT" : "ART"
        }

        default: {
            const successor = LINEAR[job.state]
            if (!successor) throw new Error(`No transition defined out of ${job.state}`)
            if (outcome.kind !== "ok") {
                throw new Error(`State ${job.state} cannot produce a "${outcome.kind}" outcome`)
            }
            return successor
        }
    }
}

/** True when entering `to` from `from` should increment the review counter. */
export function incrementsIteration(from: JobState, to: JobState): boolean {
    return (from === "REVIEW" && to === "REVISING") || (from === "FA_REVIEW" && to === "FA_DRAFT")
}
