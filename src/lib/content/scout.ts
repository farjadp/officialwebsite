// ============================================================================
// Hardware Source: scout.ts
// Version: 1.0.0 — 2026-09-25
// Why: Decides what the engine could write about. Two pure decisions carry the
//      weight: what counts as the same story (the fingerprint) and which story
//      wins (the score). Everything else here is bookkeeping around them.
// Env / Identity: Server only. Network through sources.ts; writes signals and
//      at most one job per run.
// ============================================================================

import { createHash } from "node:crypto"
import { prisma } from "@/lib/prisma"
import { fetchSource, TREND_KINDS, type RawSignal, type SourceKind } from "./sources"

export type { RawSignal } from "./sources"

/** Parameters that identify a campaign, never a story. */
const TRACKING_PARAMS = [
    /^utm_/i,
    /^ref$/i,
    /^ref_src$/i,
    /^source$/i,
    /^fbclid$/i,
    /^gclid$/i,
    /^igshid$/i,
    /^mc_(cid|eid)$/i,
    /^ck_subscriber_id$/i,
    /^s$/i, // Substack's share token
    /^__twitter_impression$/i,
    /^_bhlid$/i,
    /^triedRedirect$/i,
]

/**
 * One address for one story.
 *
 * The same article reaches us from a tag feed, a newsletter and a link
 * aggregator, each with its own campaign parameters. Without this the blog
 * would happily write the same piece three times.
 */
export function canonicalUrl(raw: string): string {
    let url: URL
    try {
        url = new URL(raw)
    } catch {
        return raw // Not an address we can reason about; hash it as-is.
    }

    url.protocol = "https:"
    url.hash = ""
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, "")

    const kept = [...url.searchParams.entries()]
        .filter(([key]) => !TRACKING_PARAMS.some((pattern) => pattern.test(key)))
        .sort(([a], [b]) => a.localeCompare(b))

    url.search = ""
    for (const [key, value] of kept) url.searchParams.append(key, value)

    const pathname = url.pathname.replace(/\/+$/, "")
    return `${url.origin}${pathname}${url.search}`
}

export function fingerprint(raw: string): string {
    return createHash("sha256").update(canonicalUrl(raw)).digest("hex")
}

const HALF_LIFE_DAYS = 7

export type ScoreContext = {
    /** The source's multiplier — the operator's real dial. */
    weight: number
    /** The strongest engagement seen in THIS source's batch. */
    peakEngagement?: number
    now: Date
}

/**
 * How much a signal is worth right now.
 *
 * Engagement is normalised **within its own source**, never across sources.
 * The first run of the real scout made the reason obvious: Hacker News reports
 * points and comments while Medium and Substack RSS report nothing, so raw
 * engagement put all six leading signals on HN and a weight-3 Stratechery essay
 * could never lead. Comparing a story only against its own feed's best puts
 * every source on the same 1–2 scale and leaves `weight` as the thing that
 * actually decides which source outranks which — which is what Farjad edits.
 *
 * A seven-day half-life then means last month's argument loses to this week's.
 *
 * Engagement's share is deliberately small. Normalising alone was not enough:
 * at a full 2× swing, the busiest HN thread at weight 2 still beat a weight-3
 * essay, so the dial the operator turns was still losing to whichever feed
 * happened to publish counts. Keeping the share below `1 / maxWeight` makes
 * weight strictly decisive between sources — engagement only orders stories
 * *within* one source, which is the only comparison it is valid for. At 0.2
 * that holds for weights up to 4; raise the ceiling and this must come down.
 */
const ENGAGEMENT_SHARE = 0.2
export function scoreSignal(signal: RawSignal, context: ScoreContext): number {
    const peak = Math.max(0, context.peakEngagement ?? 0)
    const relative = peak > 0 ? Math.log1p(Math.max(0, signal.engagement)) / Math.log1p(peak) : 0

    const ageDays = signal.publishedAt
        ? (context.now.getTime() - signal.publishedAt.getTime()) / 86_400_000
        : 0
    // A future-dated item (a feed with a wrong clock) is treated as new, not
    // as worth more than everything else.
    const decay = 0.5 ** (Math.max(0, ageDays) / HALF_LIFE_DAYS)

    return (1 + ENGAGEMENT_SHARE * relative) * Math.max(0, context.weight) * decay
}

/** The peak engagement in one source's batch, for `scoreSignal`. */
export function peakEngagement(signals: RawSignal[]): number {
    return signals.reduce((peak, signal) => Math.max(peak, signal.engagement), 0)
}

// ─── The run ────────────────────────────────────────────────────────────────

/**
 * Pause between two sources on the same host.
 *
 * Reddit is in a class of its own: at four seconds apart, three of five
 * subreddits still answered 429. Twelve seconds keeps the whole set alive and
 * costs about a minute on a once-a-day run.
 */
const HOST_COURTESY_MS: Record<string, number> = { "reddit.com": 12_000 }
const DEFAULT_COURTESY_MS = 4_000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Which host a source talks to, for the courtesy pause between siblings. */
function hostOf(source: { kind: string; url: string | null }): string {
    if (source.kind === "REDDIT") return "reddit.com"
    if (source.kind === "HN") return "hn.algolia.com"
    try {
        return new URL(source.url ?? "").hostname.replace(/^www\./, "")
    } catch {
        return ""
    }
}

export type ScoutReport = {
    fetched: number
    created: number
    duplicates: number
    errors: { source: string; message: string }[]
}

/**
 * Read every enabled trend source, store what is new, and record what broke.
 *
 * A failing source records its error and the run continues: one dead feed is a
 * maintenance note, not an outage.
 */
export async function runScout(now = new Date()): Promise<ScoutReport> {
    const sources = await prisma.contentSource.findMany({
        where: { enabled: true, isReference: false, kind: { in: [...TREND_KINDS] } },
        // Least-recently-fetched first. With a fixed order the same two
        // subreddits absorbed every rate-limit rejection run after run and
        // never contributed a signal; rotating means a source that lost
        // yesterday goes first today.
        orderBy: { lastFetchedAt: { sort: "asc", nulls: "first" } },
    })

    const report: ScoutReport = { fetched: 0, created: 0, duplicates: 0, errors: [] }

    // Reddit rate-limits a burst of subreddits hard: the first real run got a
    // 429 on four of five. Tracking the last time each host was contacted keeps
    // the spacing correct however the sources happen to be ordered — checking
    // only the previous source would leave a gap the moment a feed is added
    // between two subreddits.
    const lastContacted = new Map<string, number>()

    for (const source of sources) {
        const host = hostOf(source)
        if (host) {
            const courtesy = HOST_COURTESY_MS[host] ?? DEFAULT_COURTESY_MS
            const waitMs = (lastContacted.get(host) ?? 0) + courtesy - Date.now()
            if (waitMs > 0) await sleep(waitMs)
            lastContacted.set(host, Date.now())
        }

        try {
            const signals = await fetchSource(source)
            report.fetched += signals.length
            const peak = peakEngagement(signals)

            for (const signal of signals) {
                const created = await prisma.contentSignal.createMany({
                    data: [
                        {
                            sourceId: source.id,
                            fingerprint: fingerprint(signal.url),
                            title: signal.title.slice(0, 500),
                            url: signal.url,
                            summary: signal.summary,
                            author: signal.author,
                            publishedAt: signal.publishedAt,
                            engagement: signal.engagement,
                            score: scoreSignal(signal, { weight: source.weight, peakEngagement: peak, now }),
                        },
                    ],
                    // The fingerprint is unique; a story we already hold is the
                    // normal case, not an error.
                    skipDuplicates: true,
                })
                if (created.count === 1) report.created++
                else report.duplicates++
            }

            await prisma.contentSource.update({
                where: { id: source.id },
                data: { lastFetchedAt: now, lastError: null },
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            report.errors.push({ source: source.label, message })
            await prisma.contentSource.update({
                where: { id: source.id },
                data: { lastFetchedAt: now, lastError: message.slice(0, 500) },
            })
        }
    }

    return report
}

/** Sources that have not succeeded in a week, for the admin to see. */
export async function staleSources(now = new Date(), days = 7) {
    const cutoff = new Date(now.getTime() - days * 86_400_000)
    return prisma.contentSource.findMany({
        where: {
            enabled: true,
            isReference: false,
            OR: [{ lastFetchedAt: null }, { lastFetchedAt: { lt: cutoff } }, { lastError: { not: null } }],
        },
        select: { id: true, label: true, kind: true, lastFetchedAt: true, lastError: true },
    })
}

// ─── Cadence ────────────────────────────────────────────────────────────────

/** Jobs that are still moving. Two is the ceiling; see `maybeCreateJob`. */
const IN_FLIGHT_CEILING = 2

const TERMINAL = ["PUBLISHED", "NEEDS_HUMAN", "FAILED"]

/**
 * Start at most one job, and only when the pipeline is not already busy.
 *
 * This is the whole cadence control. At two to three articles a week there is
 * no scheduler: a daily scout that refuses to start a third concurrent job
 * lands on roughly that rate by itself.
 */
export async function maybeCreateJob(now = new Date()): Promise<string | null> {
    const inFlight = await prisma.contentJob.count({ where: { state: { notIn: TERMINAL } } })
    if (inFlight >= IN_FLIGHT_CEILING) return null

    // The freshest unused cluster wins. Signals without a cluster are their own
    // cluster until the brief groups them.
    const candidates = await prisma.contentSignal.findMany({
        where: { used: false },
        orderBy: { score: "desc" },
        take: 12,
    })
    if (candidates.length === 0) return null

    const leader = candidates[0]
    const cluster = leader.clusterKey
        ? candidates.filter((signal) => signal.clusterKey === leader.clusterKey)
        : [leader]

    const job = await prisma.contentJob.create({
        data: {
            state: "SCOUTED",
            signalIds: cluster.map((signal) => signal.id),
            trace: [
                {
                    at: now.toISOString(),
                    state: "SCOUTED",
                    note: `picked ${cluster.length} signal(s), lead: ${leader.title.slice(0, 120)}`,
                },
            ] as never,
        },
    })

    // Claimed now rather than at brief time, so a crash mid-brief cannot make
    // the same story the lead candidate again on the next run.
    await prisma.contentSignal.updateMany({
        where: { id: { in: cluster.map((signal) => signal.id) } },
        data: { used: true },
    })

    return job.id
}

export function isTrendKind(kind: string): kind is SourceKind {
    return (TREND_KINDS as readonly string[]).includes(kind)
}
