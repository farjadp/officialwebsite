// ============================================================================
// Hardware Source: plan.ts
// Version: 1.0.0 — 2026-10-01
// Why: One fetch of one board has to become database writes: new postings to
//      insert, known ones to refresh, and vanished ones to count towards
//      closing. Deciding that is separate from doing it, so the decision can
//      be tested without a database.
// Env / Identity: Pure.
// ============================================================================

import { classifyLocation } from "./location"
import { prefilter } from "./prefilter"
import type { Profile } from "./profile"
import { fingerprint, type BoardKind, type RawPosting } from "./types"

/** A posting absent from this many consecutive fetches is closed. */
export const MISSES_TO_CLOSE = 2

/** Descriptions are capped: the scorer reads the top, and rows stay small. */
export const MAX_DESCRIPTION_CHARS = 12_000

export type Known = {
    id: string
    fingerprint: string
    prefilter: string
    lane: string | null
    country: string | null
    remote: boolean
    missedRuns: number
    closedAt: Date | null
}

export type Evaluated = {
    fingerprint: string
    externalId: string
    title: string
    company: string
    location: string | null
    country: string | null
    remote: boolean
    department: string | null
    url: string
    description: string | null
    postedAt: Date | null
    prefilter: "PASS" | "REJECT"
    prefilterReason: string | null
    lane: string | null
}

export type IngestPlan = {
    create: Evaluated[]
    /** Known postings still on the board, with their current evaluation. */
    refresh: {
        id: string
        data: Evaluated
        /** Something stored differs from what was just read. */
        changed: boolean
        /** The prefilter's answer differs: any earlier score no longer applies. */
        verdictChanged: boolean
    }[]
    /** Known postings missing from this fetch. */
    missed: { id: string; missedRuns: number; close: boolean }[]
}

export function evaluate(kind: BoardKind, token: string, raw: RawPosting, profile: Profile): Evaluated {
    const place = classifyLocation(raw.location, raw.remoteHint)
    const verdict = prefilter(raw.title, place, profile)
    return {
        fingerprint: fingerprint(kind, token, raw.externalId),
        externalId: raw.externalId,
        title: raw.title.slice(0, 300),
        company: raw.company.slice(0, 200),
        location: raw.location?.slice(0, 300) ?? null,
        country: place.country,
        remote: place.remote,
        department: raw.department?.slice(0, 200) ?? null,
        url: raw.url,
        // A rejected posting keeps no description: a large board is mostly
        // rejections, and nobody reads them.
        description: verdict.verdict === "PASS" ? raw.description.slice(0, MAX_DESCRIPTION_CHARS) : null,
        postedAt: raw.postedAt,
        prefilter: verdict.verdict,
        prefilterReason: verdict.reason,
        lane: verdict.lane,
    }
}

export function planIngest(
    kind: BoardKind,
    token: string,
    fetched: RawPosting[],
    known: Known[],
    profile: Profile,
): IngestPlan {
    const byFingerprint = new Map(known.map((row) => [row.fingerprint, row]))
    const seen = new Set<string>()
    const plan: IngestPlan = { create: [], refresh: [], missed: [] }

    for (const raw of fetched) {
        const data = evaluate(kind, token, raw, profile)
        // A board that lists the same id twice must not produce two inserts.
        if (seen.has(data.fingerprint)) continue
        seen.add(data.fingerprint)

        const existing = byFingerprint.get(data.fingerprint)
        if (!existing) {
            plan.create.push(data)
        } else {
            const verdictChanged = existing.prefilter !== data.prefilter || existing.lane !== data.lane
            plan.refresh.push({
                id: existing.id,
                data,
                verdictChanged,
                changed: verdictChanged || existing.country !== data.country || existing.remote !== data.remote,
            })
        }
    }

    for (const row of known) {
        if (seen.has(row.fingerprint) || row.closedAt) continue
        const missedRuns = row.missedRuns + 1
        plan.missed.push({ id: row.id, missedRuns, close: missedRuns >= MISSES_TO_CLOSE })
    }

    return plan
}
