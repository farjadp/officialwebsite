// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-09-25
// Why: Reads every enabled trend source once a day and, if the pipeline is not
//      already busy, starts one job from the strongest unused signal. This is
//      the whole cadence control: a daily run that refuses to start a third
//      concurrent job lands on two to three articles a week by itself.
// Env / Identity: Server Route Handler (Vercel Cron). Auth as /api/cron/email.
// ============================================================================

import { NextResponse } from "next/server"
import { maybeCreateJob, runScout, staleSources } from "@/lib/content/scout"
import { loadContentSettings, readBoolean } from "@/lib/content/settings"

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

    const settings = await loadContentSettings()
    if (!readBoolean(settings, "content.enabled")) {
        return NextResponse.json({ skipped: "content.enabled is false" })
    }

    const report = await runScout()
    const jobId = await maybeCreateJob()
    const stale = await staleSources()

    return NextResponse.json({
        ...report,
        jobCreated: jobId,
        // Surfaced rather than logged: a feed that has quietly changed shape is
        // only visible if someone is told about it.
        staleSources: stale.map((source) => ({
            label: source.label,
            lastFetchedAt: source.lastFetchedAt,
            lastError: source.lastError,
        })),
    })
}
