// ============================================================================
// Hardware Source: engine.ts
// Version: 1.0.0 — 2026-09-25
// Why: One cron tick advances one job by one state. A Vercel function cannot
//      hold the whole chain — scout, brief, write, audit, review, rewrite,
//      Persian, art, publish — so the chain lives in the database and this is
//      the crank that turns it.
// Env / Identity: Server only. Called by /api/cron/content; safe to call
//      concurrently — a job is claimed under a 5-minute lease.
// ============================================================================

import type { ContentJob } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
    isTerminal,
    incrementsIteration,
    nextState,
    type JobState,
    type Outcome,
} from "./states"
import { loadContentSettings, readBoolean, readNumber } from "./settings"

/** How long a claimed job may sit before another tick may take it over. */
const LEASE_MS = 5 * 60 * 1000

/** Transport failures tolerated on one state before the job is failed. */
const MAX_ATTEMPTS = 3

export type TraceEntry = {
    at: string
    state: JobState
    agent?: string
    model?: string
    tokens?: number
    costCents?: number
    ms?: number
    note?: string
}

export type TickResult = {
    jobId?: string
    from?: JobState
    to?: JobState
    note: string
}

export class NotImplemented extends Error {
    constructor(state: JobState) {
        super(`No handler for state ${state} yet`)
        this.name = "NotImplemented"
    }
}

export type HandlerContext = {
    settings: Record<string, string>
    /** Record work as it happens, so a crash still leaves evidence. */
    trace: (entry: Omit<TraceEntry, "at" | "state">) => Promise<void>
}

export type Handler = (job: ContentJob, ctx: HandlerContext) => Promise<Outcome>

/**
 * One handler per non-terminal state. Filled in task by task; until then a
 * tick that reaches an unimplemented state records the fact and fails the job
 * rather than pretending to have done the work.
 */
export const HANDLERS: Partial<Record<JobState, Handler>> = {
    // SCOUTED   → brief.ts        (task 4)
    // BRIEFED   → writer.ts       (task 5)
    // DRAFTED   → seo-audit.ts    (task 5)
    // SEO_PASS  → review.ts       (task 5)
    // REVIEW    → review verdict  (task 5)
    // REVISING  → writer.ts       (task 5)
    // FA_DRAFT  → writer.ts fa    (task 6)
    // FA_REVIEW → persian-gate.ts (task 6)
    // ART       → art.ts          (task 7)
    // READY     → publish.ts      (task 7)
}

// ─── Claiming ───────────────────────────────────────────────────────────────

/**
 * Take one runnable job under a lease.
 *
 * Two ticks running at once is normal — Vercel may overlap invocations — so the
 * claim is a conditional update: whoever's `updateMany` reports one row changed
 * owns the job, and the loser simply moves on.
 */
export async function claimJob(now = new Date()): Promise<ContentJob | null> {
    const staleBefore = new Date(now.getTime() - LEASE_MS)

    const candidates = await prisma.contentJob.findMany({
        where: {
            state: { notIn: ["PUBLISHED", "NEEDS_HUMAN", "FAILED"] },
            OR: [{ lockedAt: null }, { lockedAt: { lt: staleBefore } }],
        },
        orderBy: { createdAt: "asc" },
        take: 5,
        select: { id: true, lockedAt: true },
    })

    for (const candidate of candidates) {
        const claimed = await prisma.contentJob.updateMany({
            where: {
                id: candidate.id,
                OR: [{ lockedAt: null }, { lockedAt: { lt: staleBefore } }],
            },
            data: { lockedAt: now },
        })
        if (claimed.count === 1) {
            return prisma.contentJob.findUnique({ where: { id: candidate.id } })
        }
    }

    return null
}

export async function appendTrace(jobId: string, entry: TraceEntry): Promise<void> {
    const job = await prisma.contentJob.findUnique({
        where: { id: jobId },
        select: { trace: true },
    })
    const existing = Array.isArray(job?.trace) ? (job.trace as unknown[]) : []
    await prisma.contentJob.update({
        where: { id: jobId },
        data: { trace: [...existing, entry] as never },
    })
}

// ─── Budget ─────────────────────────────────────────────────────────────────

export async function spentThisMonthCents(now = new Date()): Promise<number> {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const result = await prisma.contentJob.aggregate({
        where: { createdAt: { gte: monthStart } },
        _sum: { costCents: true },
    })
    return result._sum.costCents ?? 0
}

// ─── The crank ──────────────────────────────────────────────────────────────

export async function tick(now = new Date()): Promise<TickResult> {
    const settings = await loadContentSettings()

    if (!readBoolean(settings, "content.enabled")) {
        return { note: "disabled: content.enabled is false" }
    }

    const budget = readNumber(settings, "content.budget.monthlyCents")
    const spent = await spentThisMonthCents(now)
    if (spent >= budget) {
        return { note: `over budget: ${spent}¢ spent of ${budget}¢ this month` }
    }

    const job = await claimJob(now)
    if (!job) return { note: "nothing to do" }

    const from = job.state as JobState
    const maxRevisions = readNumber(settings, "content.maxRevisions")

    const handler = HANDLERS[from]
    let outcome: Outcome
    let failure: string | undefined

    if (!handler) {
        failure = new NotImplemented(from).message
        outcome = { kind: "error" }
    } else {
        try {
            outcome = await handler(job, {
                settings,
                trace: (entry) => appendTrace(job.id, { ...entry, at: new Date().toISOString(), state: from }),
            })
        } catch (error) {
            failure = error instanceof Error ? `${error.name}: ${error.message}` : String(error)

            // A transport blip should cost a retry, not the article. Only once
            // the attempts are spent does the failure become the job's outcome.
            const attempts = job.attempts + 1
            if (attempts < MAX_ATTEMPTS) {
                await prisma.contentJob.update({
                    where: { id: job.id },
                    data: { attempts, error: failure, lockedAt: null },
                })
                await appendTrace(job.id, {
                    at: new Date().toISOString(),
                    state: from,
                    note: `attempt ${attempts}/${MAX_ATTEMPTS} failed: ${failure}`,
                })
                return { jobId: job.id, from, note: `retrying (${attempts}/${MAX_ATTEMPTS}): ${failure}` }
            }
            outcome = { kind: "error" }
        }
    }

    const to = nextState({ state: from, iteration: job.iteration }, outcome, { maxRevisions })

    await prisma.$transaction([
        prisma.contentJob.update({
            where: { id: job.id },
            data: {
                state: to,
                iteration: incrementsIteration(from, to) ? job.iteration + 1 : job.iteration,
                attempts: 0,
                error: failure ?? null,
                // A finished job keeps no lease; a continuing one is released
                // so the next tick can pick it straight up.
                lockedAt: null,
            },
        }),
    ])

    await appendTrace(job.id, {
        at: new Date().toISOString(),
        state: from,
        note: `${from} → ${to}${failure ? ` (${failure})` : ""}`,
    })

    return {
        jobId: job.id,
        from,
        to,
        note: isTerminal(to) ? `finished in ${to}` : `advanced to ${to}`,
    }
}
