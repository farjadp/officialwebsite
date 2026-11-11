// ============================================================================
// Hardware Source: operations.ts
// Version: 1.0.0 — 2026-11-10
// Why: The job-search work that three callers share — the owner's screens
//      (server actions), the daily cron and the job-hunter agent's API — done
//      once, with every step written to the activity log.
// Note: Not a "use server" file on purpose: nothing here checks who is asking.
//      Each caller authorises first (assertOwner, or the cron/agent secret).
// ============================================================================

import { prisma } from "@/lib/prisma"
import { logActivity } from "./activity"
import { isPaused } from "./control"
import { generateDocuments, type GenerateResult } from "./generate"
import { runIngest, type BoardReport } from "./ingest"
import { scorePending, type ScoreReport } from "./score"
import { JOB_STATUSES, type JobStatus } from "./types"

export type Trigger = "cron" | "owner" | "agent"

export type RunResult =
    | { ok: true; boards: BoardReport[]; scoring: ScoreReport }
    | { ok: false; error: string; paused?: boolean }

function message(error: unknown): string {
    return error instanceof Error ? error.message : String(error)
}

/** Read the enabled boards (unless `scoreOnly`) and score what is new. */
export async function runJobSearch(trigger: Trigger, options: { scoreOnly?: boolean } = {}): Promise<RunResult> {
    if (await isPaused()) {
        await logActivity("run", "info", `Run skipped (${trigger}): the job search is paused`)
        return { ok: false, paused: true, error: "The job search is paused. Resume it to read the sources." }
    }

    await logActivity("run", "info", `Run started (${trigger})${options.scoreOnly ? ", scoring only" : ""}`)
    try {
        const boards = options.scoreOnly ? [] : await runIngest()
        for (const board of boards) {
            if (board.error) {
                await logActivity("ingest", "warn", `${board.board}: could not be read`, { error: board.error })
            } else if (board.created || board.closed) {
                await logActivity(
                    "ingest",
                    "info",
                    `${board.board}: ${board.created} new, ${board.closed} closed (${board.fetched} read)`,
                    { ...board },
                )
            }
        }

        const scoring = await scorePending()
        await logActivity(
            "score",
            scoring.failed || scoring.stopped ? "warn" : "info",
            `Scored ${scoring.scored}${scoring.failed ? `, ${scoring.failed} failed` : ""}` +
                ` — about $${(scoring.costCents / 100).toFixed(3)}` +
                (scoring.stopped ? `; stopped: ${scoring.stopped}` : ""),
            { ...scoring },
        )

        const totals = {
            boards: boards.length,
            fetched: boards.reduce((sum, board) => sum + board.fetched, 0),
            created: boards.reduce((sum, board) => sum + board.created, 0),
            closed: boards.reduce((sum, board) => sum + board.closed, 0),
            failedBoards: boards.filter((board) => board.error).length,
        }
        await logActivity(
            "run",
            totals.failedBoards ? "warn" : "info",
            `Run finished (${trigger}): ${totals.created} new postings, ${totals.closed} closed, ${scoring.scored} scored`,
            totals,
        )
        return { ok: true, boards, scoring }
    } catch (error) {
        await logActivity("run", "error", `Run failed (${trigger}): ${message(error)}`)
        return { ok: false, error: message(error) }
    }
}

/** Write a tailored résumé and cover letter for one posting. */
export async function prepareDocuments(postingId: string, trigger: Trigger): Promise<GenerateResult> {
    const posting = await prisma.jobPosting.findUnique({
        where: { id: postingId },
        select: { title: true, company: true },
    })
    const label = posting ? `${posting.title} at ${posting.company}` : postingId

    try {
        const result = await generateDocuments(postingId)
        if (result.ok) {
            await logActivity("documents", "info", `Résumé and cover letter written (${trigger}): ${label}`, {
                postingId,
                documentId: result.documentId,
            })
        } else {
            await logActivity("documents", "warn", `Résumé not written (${trigger}): ${label} — ${result.error}`, {
                postingId,
            })
        }
        return result
    } catch (error) {
        await logActivity("documents", "error", `Résumé failed (${trigger}): ${label} — ${message(error)}`, { postingId })
        return { ok: false, error: message(error) }
    }
}

export function isJobStatus(value: unknown): value is JobStatus {
    return typeof value === "string" && (JOB_STATUSES as readonly string[]).includes(value)
}

/** Move a posting to a new status; the first APPLIED date is kept for good. */
export async function updateStatus(
    id: string,
    status: JobStatus,
    trigger: Trigger,
    note?: string,
): Promise<{ ok: boolean; error?: string }> {
    const current = await prisma.jobPosting.findUnique({
        where: { id },
        select: { appliedAt: true, status: true, title: true, company: true, notes: true },
    })
    if (!current) return { ok: false, error: "No such posting" }

    const cleanNote = note?.trim().slice(0, 2_000)
    const stamped = cleanNote ? `[${new Date().toISOString().slice(0, 10)} ${trigger}] ${cleanNote}` : null

    await prisma.jobPosting.update({
        where: { id },
        data: {
            status,
            ...(status === "APPLIED" && !current.appliedAt ? { appliedAt: new Date() } : {}),
            ...(stamped ? { notes: [current.notes, stamped].filter(Boolean).join("\n").slice(-10_000) } : {}),
        },
    })

    if (current.status !== status || stamped) {
        await logActivity(
            "status",
            "info",
            `${current.title} at ${current.company}: ${current.status} → ${status} (${trigger})`,
            { postingId: id, from: current.status, to: status, ...(cleanNote ? { note: cleanNote } : {}) },
        )
    }
    return { ok: true }
}
