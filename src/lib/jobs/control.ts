// ============================================================================
// Hardware Source: control.ts
// Version: 1.0.0 — 2026-10-01
// Why: One switch for the whole automatic pipeline. Paused, the daily cron
//      reads nothing and scores nothing, and "Run now" refuses; résumés can
//      still be written and edited by hand. Kept in AppSetting so it takes
//      effect on the next tick without a deploy.
// Env / Identity: Server only. Postgres.
// ============================================================================

import { prisma } from "@/lib/prisma"

const KEY = "jobs.paused"

export async function isPaused(): Promise<boolean> {
    const row = await prisma.appSetting.findUnique({ where: { key: KEY } })
    return row?.value === "true"
}

export async function setPaused(paused: boolean): Promise<void> {
    const value = paused ? "true" : "false"
    await prisma.appSetting.upsert({ where: { key: KEY }, create: { key: KEY, value }, update: { value } })
}
