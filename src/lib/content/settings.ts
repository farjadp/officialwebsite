// ============================================================================
// Hardware Source: settings.ts
// Version: 1.0.0 — 2026-09-25
// Why: Thresholds, model choices, the kill switch and the budget are things
//      Farjad changes from the admin between cron ticks. They live in the
//      existing AppSetting key/value table under a `content.` prefix, so the
//      engine gains no settings model of its own.
// Env / Identity: Server only. Reads and writes Postgres through Prisma.
// ============================================================================

import { prisma } from "@/lib/prisma"
import { AGENT_NAMES, resolveAgentFrom, settingKey, type AgentName, type ResolvedAgent } from "./agents"

export const CONTENT_PREFIX = "content."

/** Defaults for everything that is not an agent's provider/model. */
export const CONTENT_DEFAULTS = {
    "content.enabled": "true",
    "content.threshold.en": "85",
    "content.threshold.fa": "95",
    "content.maxRevisions": "2",
    "content.budget.monthlyCents": "4000",
    "content.duplicate.threshold": "0.88",
} as const

export type ContentSettingKey = keyof typeof CONTENT_DEFAULTS

/**
 * Every `content.*` setting as a plain map.
 *
 * Deliberately uncached: the cron tick and the admin run in different
 * invocations, and a stale cache would mean an edit silently not taking effect
 * until the next deploy.
 */
export async function loadContentSettings(): Promise<Record<string, string>> {
    const rows = await prisma.appSetting.findMany({
        where: { key: { startsWith: CONTENT_PREFIX } },
        select: { key: true, value: true },
    })
    return Object.fromEntries(rows.map((row) => [row.key, row.value]))
}

export async function setSetting(key: string, value: string): Promise<void> {
    await prisma.appSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
    })
}

/** A `content.*` value, falling back to its documented default. */
export function readSetting(
    settings: Record<string, string>,
    key: ContentSettingKey,
): string {
    return settings[key]?.trim() || CONTENT_DEFAULTS[key]
}

export function readNumber(
    settings: Record<string, string>,
    key: ContentSettingKey,
): number {
    const raw = readSetting(settings, key)
    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) {
        throw new Error(`Setting "${key}" is not a number: ${JSON.stringify(raw)}`)
    }
    return parsed
}

export function readBoolean(
    settings: Record<string, string>,
    key: ContentSettingKey,
): boolean {
    return readSetting(settings, key).toLowerCase() === "true"
}

/** Resolve one agent against the live settings. */
export async function resolveAgent(agent: AgentName): Promise<ResolvedAgent> {
    return resolveAgentFrom(agent, await loadContentSettings())
}

/**
 * Resolve every agent at once, reporting rather than throwing on the ones whose
 * settings conflict — this is what the admin settings page renders.
 */
export function resolveAllAgents(
    settings: Record<string, string>,
): Record<AgentName, ResolvedAgent | { error: string }> {
    const out = {} as Record<AgentName, ResolvedAgent | { error: string }>
    for (const name of AGENT_NAMES) {
        try {
            out[name] = resolveAgentFrom(name, settings)
        } catch (error) {
            out[name] = { error: error instanceof Error ? error.message : String(error) }
        }
    }
    return out
}

export { settingKey }
