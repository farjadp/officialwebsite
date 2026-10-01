// ============================================================================
// Hardware Source: ingest.ts
// Version: 1.0.0 — 2026-10-01
// Why: Reads every enabled board and brings the postings table in line with
//      what the boards say today. One dead board must not stop the others, so
//      a failure is recorded on the board and the loop goes on.
// Env / Identity: Server only. Network egress and Postgres.
// ============================================================================

import { Prisma, type JobBoard } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { planIngest } from "./plan"
import { loadProfile, type Profile } from "./profile"
import { fetchBoard } from "./sources"
import { BOARD_KINDS, type BoardKind } from "./types"

export type BoardReport = {
    board: string
    fetched: number
    created: number
    passed: number
    closed: number
    error?: string
}

const CHUNK = 200

function chunks<T>(items: T[], size: number): T[][] {
    const out: T[][] = []
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
    return out
}

export async function ingestBoard(board: JobBoard, profile: Profile): Promise<BoardReport> {
    const report: BoardReport = { board: board.label, fetched: 0, created: 0, passed: 0, closed: 0 }
    const now = new Date()

    try {
        if (!(BOARD_KINDS as readonly string[]).includes(board.kind)) {
            throw new Error(`Unknown board kind "${board.kind}"`)
        }
        const kind = board.kind as BoardKind
        const fetched = await fetchBoard(kind, board.token, board.label)
        report.fetched = fetched.length

        const known = await prisma.jobPosting.findMany({
            where: { boardId: board.id },
            select: {
                id: true, fingerprint: true, prefilter: true, lane: true,
                country: true, remote: true, missedRuns: true, closedAt: true,
            },
        })
        const plan = planIngest(kind, board.token, fetched, known, profile)

        for (const batch of chunks(plan.create, CHUNK)) {
            const result = await prisma.jobPosting.createMany({
                data: batch.map((posting) => ({ ...posting, boardId: board.id })),
                skipDuplicates: true,
            })
            report.created += result.count
        }
        report.passed = plan.create.filter((posting) => posting.prefilter === "PASS").length

        // Most known postings only need "still here": one statement for all.
        const unchanged = plan.refresh.filter((item) => !item.changed).map((item) => item.id)
        for (const ids of chunks(unchanged, 1000)) {
            await prisma.jobPosting.updateMany({
                where: { id: { in: ids } },
                data: { lastSeenAt: now, missedRuns: 0, closedAt: null },
            })
        }

        // What was read differs from what is stored. A changed verdict also
        // drops a score that was given under the old one.
        for (const item of plan.refresh.filter((entry) => entry.changed)) {
            await prisma.jobPosting.update({
                where: { id: item.id },
                data: {
                    lastSeenAt: now,
                    missedRuns: 0,
                    closedAt: null,
                    country: item.data.country,
                    remote: item.data.remote,
                    description: item.data.description,
                    prefilter: item.data.prefilter,
                    prefilterReason: item.data.prefilterReason,
                    lane: item.data.lane,
                    ...(item.verdictChanged
                        ? { score: null, scoreNotes: Prisma.DbNull, scoredAt: null, scoreAttempts: 0 }
                        : {}),
                },
            })
            if (item.verdictChanged && item.data.prefilter === "PASS") report.passed++
        }

        const closing = plan.missed.filter((item) => item.close).map((item) => item.id)
        const waiting = plan.missed.filter((item) => !item.close).map((item) => item.id)
        if (waiting.length) {
            await prisma.jobPosting.updateMany({ where: { id: { in: waiting } }, data: { missedRuns: { increment: 1 } } })
        }
        if (closing.length) {
            await prisma.jobPosting.updateMany({
                where: { id: { in: closing } },
                data: { missedRuns: { increment: 1 }, closedAt: now },
            })
        }
        report.closed = closing.length

        await prisma.jobBoard.update({
            where: { id: board.id },
            data: { lastFetchedAt: now, lastError: null, lastCount: fetched.length },
        })
    } catch (error) {
        report.error = error instanceof Error ? error.message : String(error)
        await prisma.jobBoard.update({
            where: { id: board.id },
            data: { lastFetchedAt: now, lastError: report.error.slice(0, 500) },
        })
    }

    return report
}

export async function runIngest(): Promise<BoardReport[]> {
    const profile = await loadProfile()
    const boards = await prisma.jobBoard.findMany({ where: { enabled: true }, orderBy: { createdAt: "asc" } })
    const reports: BoardReport[] = []
    // One at a time: a personal tool has no reason to hit four APIs at once.
    for (const board of boards) reports.push(await ingestBoard(board, profile))
    return reports
}
