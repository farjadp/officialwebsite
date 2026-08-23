// ============================================================================
// Hardware Source: segment.ts
// Version: 1.0.0 — 2026-08-23
// Why: Translate a saved segment filter into a Prisma where clause
// Env / Identity: Server module
// ============================================================================

import type { Prisma } from "@prisma/client"

export interface SegmentFilter {
    status?: ("PENDING" | "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED" | "COMPLAINED" | "SUNSET")[]
    listIds?: string[]
    excludeListIds?: string[]
    sources?: string[]
    locales?: string[]
    engagementMin?: number
    engagementMax?: number
    /** Opened at least one email in the last N days */
    openedWithinDays?: number
    /** Has NOT opened anything in the last N days — the re-engagement segment */
    notOpenedForDays?: number
    clickedWithinDays?: number
    joinedAfter?: string
    joinedBefore?: string
    /** Never received anything from us */
    neverSent?: boolean
    search?: string
}

function daysAgo(days: number): Date {
    return new Date(Date.now() - days * 86_400_000)
}

/**
 * Builds the audience query. ACTIVE-only is the default: sending to unconfirmed,
 * bounced or complained addresses is the single fastest way to lose domain
 * reputation, so it has to be opt-out rather than opt-in.
 */
export function buildContactWhere(
    filter: SegmentFilter | null | undefined,
    opts: { sendableOnly?: boolean } = {}
): Prisma.ContactWhereInput {
    const f = filter ?? {}
    const and: Prisma.ContactWhereInput[] = []

    if (opts.sendableOnly) {
        and.push({ status: "ACTIVE" })
    } else if (f.status?.length) {
        and.push({ status: { in: f.status } })
    }

    if (f.listIds?.length) {
        and.push({ memberships: { some: { listId: { in: f.listIds } } } })
    }
    if (f.excludeListIds?.length) {
        and.push({ memberships: { none: { listId: { in: f.excludeListIds } } } })
    }
    if (f.sources?.length) and.push({ source: { in: f.sources } })
    if (f.locales?.length) and.push({ locale: { in: f.locales } })

    if (f.engagementMin != null) and.push({ engagementScore: { gte: f.engagementMin } })
    if (f.engagementMax != null) and.push({ engagementScore: { lte: f.engagementMax } })

    if (f.openedWithinDays != null) {
        and.push({ lastOpenedAt: { gte: daysAgo(f.openedWithinDays) } })
    }
    if (f.notOpenedForDays != null) {
        and.push({
            OR: [
                { lastOpenedAt: null },
                { lastOpenedAt: { lt: daysAgo(f.notOpenedForDays) } },
            ],
        })
    }
    if (f.clickedWithinDays != null) {
        and.push({ lastClickedAt: { gte: daysAgo(f.clickedWithinDays) } })
    }

    if (f.joinedAfter) and.push({ createdAt: { gte: new Date(f.joinedAfter) } })
    if (f.joinedBefore) and.push({ createdAt: { lte: new Date(f.joinedBefore) } })
    if (f.neverSent) and.push({ sendCount: 0 })

    if (f.search?.trim()) {
        const q = f.search.trim()
        and.push({
            OR: [
                { email: { contains: q, mode: "insensitive" } },
                { firstName: { contains: q, mode: "insensitive" } },
                { lastName: { contains: q, mode: "insensitive" } },
                { company: { contains: q, mode: "insensitive" } },
            ],
        })
    }

    return and.length ? { AND: and } : {}
}

/** Merges a list's own filter with a campaign-level refinement. */
export function combineFilters(
    listFilter: SegmentFilter | null | undefined,
    campaignFilter: SegmentFilter | null | undefined,
    listId?: string | null
): SegmentFilter {
    const merged: SegmentFilter = { ...(listFilter ?? {}), ...(campaignFilter ?? {}) }
    if (listId && !listFilter) {
        merged.listIds = [...new Set([...(merged.listIds ?? []), listId])]
    }
    return merged
}

export const SEGMENT_PRESETS: { name: string; description: string; filter: SegmentFilter }[] = [
    {
        name: "Highly engaged",
        description: "Opened something in the last 30 days — safest audience to warm a domain with",
        filter: { engagementMin: 60, openedWithinDays: 30 },
    },
    {
        name: "Never sent",
        description: "Brand new contacts who have not received anything yet",
        filter: { neverSent: true },
    },
    {
        name: "Re-engagement",
        description: "Silent for 90 days — send one win-back, then sunset",
        filter: { notOpenedForDays: 90 },
    },
    {
        name: "Sunset candidates",
        description: "Silent for 180 days and low score — remove before they cost you inbox placement",
        filter: { notOpenedForDays: 180, engagementMax: 25 },
    },
    {
        name: "Clickers",
        description: "Clicked in the last 60 days — your buying intent pool",
        filter: { clickedWithinDays: 60 },
    },
]
