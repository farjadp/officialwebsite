// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-10-01
// Why: Once a day, read every enabled job board and score what is new. The
//      owner opens /admin/jobs to a ranked list instead of to a button.
// Env / Identity: Server Route Handler (Vercel Cron). Auth as /api/cron/email.
// ============================================================================

import { NextResponse } from "next/server"
import { runJobSearch } from "@/lib/jobs/operations"

export const dynamic = "force-dynamic"
export const maxDuration = 300

/** Vercel Cron signs its requests; anything else must present the shared secret. */
function authorize(request: Request): boolean {
    const secret = process.env.CRON_SECRET
    if (!secret) return process.env.NODE_ENV !== "production"

    const header = request.headers.get("authorization")
    return header === `Bearer ${secret}`
}

export async function GET(request: Request) {
    if (!authorize(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // `?scoreOnly=1` works through a scoring backlog without reading the
    // boards again — Adzuna's free tier counts every search.
    const scoreOnly = new URL(request.url).searchParams.get("scoreOnly") === "1"
    const result = await runJobSearch("cron", { scoreOnly })
    if (!result.ok) {
        return result.paused
            ? NextResponse.json({ skipped: "paused from /admin/jobs" })
            : NextResponse.json({ error: result.error }, { status: 500 })
    }

    const { boards, scoring } = result
    return NextResponse.json({
        // Board names are the owner's target list: counts only in the response.
        boards: boards.length,
        fetched: boards.reduce((sum, board) => sum + board.fetched, 0),
        created: boards.reduce((sum, board) => sum + board.created, 0),
        closed: boards.reduce((sum, board) => sum + board.closed, 0),
        failedBoards: boards.filter((board) => board.error).length,
        scoring,
    })
}
