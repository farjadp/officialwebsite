// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-11-10
// Why: The job-hunter agent (a Claude Code agent on the owner's computer) works
//      through this: read the shortlist, run the search, write résumés, record
//      what was applied to, and log its own steps to the live activity page.
//      Production holds the AI keys and the budget; the agent holds neither.
// Env / Identity: Server Route Handler. Bearer CRON_SECRET, as the cron routes.
//      The agent never submits an application here — Farjad does that.
// ============================================================================

import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { isActivityKind, isActivityLevel, listActivity, logActivity } from "@/lib/jobs/activity"
import { budgetState } from "@/lib/jobs/budget"
import { isPaused } from "@/lib/jobs/control"
import { isJobStatus, prepareDocuments, runJobSearch, updateStatus } from "@/lib/jobs/operations"

export const dynamic = "force-dynamic"
export const maxDuration = 300

function authorize(request: Request): boolean {
    const secret = process.env.CRON_SECRET
    if (!secret) return process.env.NODE_ENV !== "production"
    const header = request.headers.get("authorization") ?? ""
    const expected = `Bearer ${secret}`
    const a = Buffer.from(header)
    const b = Buffer.from(expected)
    return a.length === b.length && timingSafeEqual(a, b)
}

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 })
const bad = (error: string) => NextResponse.json({ error }, { status: 400 })

const clampInt = (value: string | null, fallback: number, min: number, max: number) => {
    const n = Number.parseInt(value ?? "", 10)
    return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback
}

// ─── Reads ──────────────────────────────────────────────────────────────────

async function shortlist(params: URLSearchParams) {
    const limit = clampInt(params.get("limit"), 10, 1, 50)
    const minScore = clampInt(params.get("minScore"), 70, 0, 100)
    const includeShortlisted = params.get("includeShortlisted") !== "0"
    // Search boards (Adzuna, Himalayas, Jooble) drop a filled job from results long
    // before two missed runs close it; recently seen is the better "still open" signal.
    const seenWithinDays = clampInt(params.get("seenWithinDays"), 3, 1, 60)

    const postings = await prisma.jobPosting.findMany({
        where: {
            closedAt: null,
            lastSeenAt: { gte: new Date(Date.now() - seenWithinDays * 86_400_000) },
            score: { gte: minScore },
            status: { in: includeShortlisted ? ["NEW", "SHORTLISTED"] : ["NEW"] },
        },
        // Strongest first; among equals the newest by the board's own date.
        orderBy: [{ score: "desc" }, { postedAt: { sort: "desc", nulls: "last" } }, { firstSeenAt: "desc" }],
        take: limit,
        select: {
            id: true,
            title: true,
            company: true,
            location: true,
            country: true,
            remote: true,
            url: true,
            lane: true,
            score: true,
            scoreNotes: true,
            status: true,
            firstSeenAt: true,
            lastSeenAt: true,
            postedAt: true,
            documents: { select: { id: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 1 },
        },
    })

    return postings.map(({ documents, ...posting }) => ({
        ...posting,
        documentId: documents[0]?.id ?? null,
        documentsUrl: `/admin/jobs/${posting.id}/documents`,
    }))
}

async function documentFor(postingId: string) {
    return prisma.jobDocument.findFirst({
        where: { postingId },
        orderBy: { createdAt: "desc" },
        select: { id: true, resume: true, coverLetter: true, notes: true, createdAt: true, editedAt: true },
    })
}

export async function GET(request: Request) {
    if (!authorize(request)) return unauthorized()
    const params = new URL(request.url).searchParams
    const action = params.get("action")

    try {
        switch (action) {
            case "state": {
                const [paused, budget] = await Promise.all([isPaused(), budgetState()])
                return NextResponse.json({ paused, budget })
            }
            case "shortlist":
                return NextResponse.json({ postings: await shortlist(params) })
            case "posting": {
                const id = params.get("postingId")
                if (!id) return bad("postingId is required")
                const posting = await prisma.jobPosting.findUnique({ where: { id } })
                if (!posting) return NextResponse.json({ error: "No such posting" }, { status: 404 })
                return NextResponse.json({ posting, document: await documentFor(id) })
            }
            case "activity": {
                const kind = params.get("kind")
                const level = params.get("level")
                const entries = await listActivity({
                    after: params.get("after") ?? undefined,
                    kind: isActivityKind(kind) ? kind : undefined,
                    level: isActivityLevel(level) ? level : undefined,
                    limit: clampInt(params.get("limit"), 50, 1, 200),
                })
                return NextResponse.json({ entries })
            }
            default:
                return bad("action must be state, shortlist, posting or activity")
        }
    } catch (error) {
        console.error("[api/jobs/agent] GET failed", error)
        return NextResponse.json({ error: "Request failed" }, { status: 500 })
    }
}

// ─── Writes ─────────────────────────────────────────────────────────────────

const PostSchema = z.discriminatedUnion("action", [
    z.object({ action: z.literal("run"), scoreOnly: z.boolean().optional() }),
    z.object({ action: z.literal("prepare"), postingId: z.string().min(1) }),
    z.object({
        action: z.literal("status"),
        postingId: z.string().min(1),
        status: z.string().refine(isJobStatus, "Unknown status"),
        note: z.string().max(2_000).optional(),
    }),
    z.object({
        action: z.literal("log"),
        level: z.enum(["info", "warn", "error"]).default("info"),
        message: z.string().min(1).max(500),
        data: z.record(z.string(), z.unknown()).optional(),
    }),
])

export async function POST(request: Request) {
    if (!authorize(request)) return unauthorized()

    let body: unknown
    try {
        body = await request.json()
    } catch {
        return bad("Body must be JSON")
    }
    const parsed = PostSchema.safeParse(body)
    if (!parsed.success) return bad(parsed.error.issues.map((issue) => issue.message).join("; "))
    const input = parsed.data

    try {
        switch (input.action) {
            case "run": {
                const result = await runJobSearch("agent", { scoreOnly: input.scoreOnly })
                if (!result.ok) return NextResponse.json(result, { status: result.paused ? 409 : 500 })
                return NextResponse.json({
                    ok: true,
                    created: result.boards.reduce((sum, board) => sum + board.created, 0),
                    closed: result.boards.reduce((sum, board) => sum + board.closed, 0),
                    failedBoards: result.boards.filter((board) => board.error).length,
                    scoring: result.scoring,
                })
            }
            case "prepare": {
                const result = await prepareDocuments(input.postingId, "agent")
                return NextResponse.json(result, { status: result.ok ? 200 : 422 })
            }
            case "status": {
                const status = input.status
                if (!isJobStatus(status)) return bad("Unknown status")
                const result = await updateStatus(input.postingId, status, "agent", input.note)
                return NextResponse.json(result, { status: result.ok ? 200 : 404 })
            }
            case "log":
                await logActivity("agent", input.level, input.message, input.data)
                return NextResponse.json({ ok: true })
        }
    } catch (error) {
        console.error("[api/jobs/agent] POST failed", error)
        return NextResponse.json({ error: "Request failed" }, { status: 500 })
    }
}
