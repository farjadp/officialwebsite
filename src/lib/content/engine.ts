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
import { briefHandler } from "./brief"
import { ProviderKeyMissing } from "./provider"

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

/** What one model call cost, as `complete()` reports it. */
export type CallRecord = {
    agent: string
    model: string
    inputTokens: number
    outputTokens: number
    costCents: number
    ms: number
}

export type HandlerContext = {
    settings: Record<string, string>
    /** Record work as it happens, so a crash still leaves evidence. */
    trace: (entry: Omit<TraceEntry, "at" | "state">) => Promise<void>
    /**
     * Add a model call's cost to the job and trace it. Called straight after
     * each call rather than at the end of the handler, so money spent before a
     * later failure is still counted against the monthly budget.
     */
    charge: (call: CallRecord, note?: string) => Promise<void>
}

export type Handler = (job: ContentJob, ctx: HandlerContext) => Promise<Outcome>

/**
 * One handler per non-terminal state. Filled in task by task; until then a
 * tick that reaches an unimplemented state records the fact and fails the job
 * rather than pretending to have done the work.
 */
export const HANDLERS: Partial<Record<JobState, Handler>> = {
    SCOUTED: briefHandler,
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
        // Least recently touched first, not oldest first. A job parked on a
        // missing key is touched every time it is tried, so it drops to the
        // back of the queue instead of being picked again by every tick while
        // runnable jobs behind it starve.
        orderBy: { updatedAt: "asc" },
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
            const trace: HandlerContext["trace"] = (entry) =>
                appendTrace(job.id, { ...entry, at: new Date().toISOString(), state: from })
            outcome = await handler(job, {
                settings,
                trace,
                charge: async (call, note) => {
                    await prisma.contentJob.update({
                        where: { id: job.id },
                        data: { costCents: { increment: call.costCents } },
                    })
                    await trace({
                        agent: call.agent,
                        model: call.model,
                        tokens: call.inputTokens + call.outputTokens,
                        costCents: call.costCents,
                        ms: call.ms,
                        note,
                    })
                },
            })
        } catch (error) {
            failure = error instanceof Error ? `${error.name}: ${error.message}` : String(error)

            // A missing key is configuration, not a fault in this job. Counting
            // it as an attempt would kill every queued job on the day the key
            // is absent, and they would stay dead after it is added. Park the
            // job instead: no attempt spent, no state change, one trace line.
            if (error instanceof ProviderKeyMissing) {
                const firstTime = job.error !== failure
                await prisma.contentJob.update({
                    where: { id: job.id },
                    data: { error: failure, lockedAt: null },
                })
                if (firstTime) {
                    await appendTrace(job.id, {
                        at: new Date().toISOString(),
                        state: from,
                        note: `waiting: ${failure}`,
                    })
                }
                return { jobId: job.id, from, note: `blocked: ${failure}` }
            }

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
