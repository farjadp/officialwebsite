// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-08-23
// Why: Drives sending, automations and list hygiene on a schedule
// Env / Identity: Server Route Handler (Vercel Cron)
// ============================================================================

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { drainQueue } from "@/lib/email/campaign-engine"
import { enrollContacts, runDueSteps } from "@/lib/email/automation-engine"
import { runSunsetPolicy } from "@/lib/email/tracking"

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

    const report = {
        campaigns: [] as { id: string; sent: number; failed: number; remaining: number }[],
        automationsEnrolled: 0,
        automationsSent: 0,
        sunset: { decayed: 0, sunset: 0 },
    }

    // 1. Push queued campaign mail, oldest campaign first
    const sending = await prisma.campaign.findMany({
        where: { status: "SENDING" },
        select: { id: true },
        orderBy: { createdAt: "asc" },
        take: 5,
    })

    for (const campaign of sending) {
        const result = await drainQueue(campaign.id, 100)
        report.campaigns.push({
            id: campaign.id,
            sent: result.sent,
            failed: result.failed,
            remaining: result.remainingQueued,
        })
        if (result.quotaExhausted) break
    }

    // 2. Release scheduled campaigns whose time has come
    await prisma.campaign.updateMany({
        where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } },
        data: { status: "SENDING" },
    })

    // 3. Automations
    try {
        report.automationsEnrolled = await enrollContacts()
        const stepResult = await runDueSteps(100)
        report.automationsSent = stepResult.sent
    } catch (error) {
        console.error("Automation tick failed:", error)
    }

    // 4. List hygiene — run once a day, at the top of the hour after midnight UTC
    if (new Date().getUTCHours() === 3) {
        report.sunset = await runSunsetPolicy()
    }

    return NextResponse.json({ ok: true, ...report })
}
