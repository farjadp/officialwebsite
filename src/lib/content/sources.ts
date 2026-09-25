// ============================================================================
// Hardware Source: sources.ts
// Version: 1.0.0 — 2026-09-25
// Why: The only place the content engine touches the outside world. Five kinds
//      of source, one shape out. Trend sources (RSS, Hacker News, Reddit) yield
//      signals; reference sources (a page, a PDF Farjad uploads) yield text for
//      the brief and never trend — a document does not trend.
// Env / Identity: Server only. Network egress. Every fetch is time-boxed and a
//      failure is returned, never thrown out of the loop: one dead feed must
//      not stop the scout.
// ============================================================================

import type { ContentSource } from "@prisma/client"
import { XMLParser } from "fast-xml-parser"
import { extractText } from "unpdf"
import { safeFetch } from "./safe-url"

export const SOURCE_KINDS = ["RSS", "HN", "REDDIT", "URL", "PDF"] as const
export type SourceKind = (typeof SOURCE_KINDS)[number]

/** Trend sources produce signals; the other two are reference material. */
export const TREND_KINDS: readonly SourceKind[] = ["RSS", "HN", "REDDIT"]

export type RawSignal = {
    title: string
    url: string
    summary?: string
    author?: string
    publishedAt?: Date
    /** Upvotes, comments or claps where the source reports them; 0 otherwise. */
    engagement: number
}

const FETCH_TIMEOUT_MS = 15_000
const MAX_ITEMS_PER_SOURCE = 30

/**
 * Reddit asks for a descriptive User-Agent and rate-limits generic ones.
 * Medium and Substack also serve RSS more reliably with a real agent.
 */
const USER_AGENT = "farjadp.info content engine (+https://www.farjadp.info)"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * One time-boxed GET, with a single retry when the host asks us to wait.
 *
 * Reddit rate-limits its feeds hard — two calls to the same subreddit inside a
 * minute earns a 429 — and a daily scout hitting several subreddits in a row
 * runs straight into it. One polite retry costs seconds and turns a dead source
 * into a live one; a second failure is a real failure and is reported.
 */
async function get(url: string, accept: string, retryOn429 = true): Promise<Response> {
    // Every address here came from an admin-entered row; safeFetch refuses
    // private and local hosts on the first request and on every redirect.
    const response = await safeFetch(url, {
        headers: { "user-agent": USER_AGENT, accept },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (response.status === 429 && retryOn429) {
        const askedFor = Number(response.headers.get("retry-after"))
        const waitMs = Math.min(Number.isFinite(askedFor) && askedFor > 0 ? askedFor * 1000 : 3_000, 10_000)
        await sleep(waitMs)
        return get(url, accept, false)
    }

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} from ${new URL(url).host}`)
    }
    return response
}

// ─── Dispatch ───────────────────────────────────────────────────────────────

/**
 * Signals from one trend source. Reference sources return none by design —
 * `referenceText` is how their content reaches a brief.
 */
export async function fetchSource(source: ContentSource): Promise<RawSignal[]> {
    const kind = source.kind as SourceKind
    if (!TREND_KINDS.includes(kind)) return []
    if (!source.url) throw new Error(`Source "${source.label}" (${kind}) has no url`)

    switch (kind) {
        case "RSS":
            return fetchRss(source.url)
        case "HN":
            return fetchHackerNews(source.url)
        case "REDDIT":
            return fetchReddit(source.url)
        default:
            return []
    }
}

// ─── RSS and Atom ───────────────────────────────────────────────────────────

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
})

type XmlNode = Record<string, unknown>

function asArray(value: unknown): XmlNode[] {
    if (Array.isArray(value)) return value as XmlNode[]
    if (value && typeof value === "object") return [value as XmlNode]
    return []
}

/** RSS text nodes arrive as a string, a number, or `{ "#text": ... }`. */
function text(value: unknown): string | undefined {
    if (typeof value === "string") return value.trim() || undefined
    if (typeof value === "number") return String(value)
    if (value && typeof value === "object" && "#text" in value) {
        return text((value as XmlNode)["#text"])
    }
    return undefined
}

const NAMED_ENTITIES: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    hellip: "\u2026",
    mdash: "\u2014",
    ndash: "\u2013",
    lsquo: "\u2018",
    rsquo: "\u2019",
    ldquo: "\u201C",
    rdquo: "\u201D",
}

/**
 * Feeds hand us entity-encoded text, and titles are the worst offenders —
 * "Amazon&#8217;s Moat" reached the signal table verbatim on the first real
 * run. Titles become brief input and eventually slugs, so decode them.
 */
export function decodeEntities(value: string): string {
    return value
        .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
        .replace(/&([a-z]+);/gi, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match)
}

function stripTags(value: string | undefined, limit = 600): string | undefined {
    if (!value) return undefined
    const plain = decodeEntities(value.replace(/<[^>]*>/g, " "))
        .replace(/\s+/g, " ")
        .trim()
    return plain ? plain.slice(0, limit) : undefined
}

function parseDate(value: unknown): Date | undefined {
    const raw = text(value)
    if (!raw) return undefined
    const date = new Date(raw)
    return Number.isNaN(date.getTime()) ? undefined : date
}

/** Atom links are attribute-bearing nodes, and often several per entry. */
function atomLink(entry: XmlNode): string | undefined {
    const links = asArray(entry.link)
    const alternate = links.find((l) => !l["@_rel"] || l["@_rel"] === "alternate") ?? links[0]
    const href = alternate?.["@_href"]
    return typeof href === "string" ? href : text(entry.link)
}

export async function fetchRss(url: string): Promise<RawSignal[]> {
    const body = await (await get(url, "application/rss+xml, application/atom+xml, application/xml, text/xml")).text()
    const doc = parser.parse(body) as XmlNode

    const rssItems = asArray((doc.rss as XmlNode)?.channel as XmlNode).flatMap((channel) =>
        asArray(channel.item),
    )
    const atomEntries = asArray((doc.feed as XmlNode)?.entry)

    const items = [...rssItems, ...atomEntries].slice(0, MAX_ITEMS_PER_SOURCE)

    return items.flatMap((item) => {
        const title = text(item.title)
        const link = text(item.link) ?? atomLink(item)
        if (!title || !link) return []
        return [
            {
                title: decodeEntities(title),
                url: link,
                summary: stripTags(
                    text(item.description) ??
                        text(item["content:encoded"]) ??
                        text(item.summary) ??
                        text(item.content),
                ),
                author:
                    text(item["dc:creator"]) ??
                    text(item.author) ??
                    text((item.author as XmlNode)?.name),
                publishedAt: parseDate(item.pubDate ?? item.published ?? item.updated),
                // Neither Medium nor Substack publishes counts in RSS; these
                // signals rank on recency and their source's weight.
                engagement: 0,
            },
        ]
    })
}

// ─── Hacker News (Algolia) ──────────────────────────────────────────────────

type AlgoliaHit = {
    objectID: string
    title?: string
    story_title?: string
    url?: string
    story_url?: string
    author?: string
    points?: number
    num_comments?: number
    created_at?: string
}

/** `url` on an HN source holds the search query, not an address. */
export async function fetchHackerNews(query: string): Promise<RawSignal[]> {
    const endpoint = new URL("https://hn.algolia.com/api/v1/search")
    endpoint.searchParams.set("query", query)
    endpoint.searchParams.set("tags", "story")
    endpoint.searchParams.set("hitsPerPage", String(MAX_ITEMS_PER_SOURCE))
    // A week's window, so the scout sees what is current rather than all-time.
    const weekAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)
    endpoint.searchParams.set("numericFilters", `created_at_i>${weekAgo},points>20`)

    const data = (await (await get(endpoint.toString(), "application/json")).json()) as {
        hits?: AlgoliaHit[]
    }

    return (data.hits ?? []).flatMap((hit) => {
        const title = hit.title ?? hit.story_title
        // Ask HN and similar have no external link; the discussion is the story.
        const url = hit.url ?? hit.story_url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`
        if (!title) return []
        return [
            {
                title,
                url,
                author: hit.author,
                publishedAt: hit.created_at ? new Date(hit.created_at) : undefined,
                engagement: (hit.points ?? 0) + (hit.num_comments ?? 0),
                summary: `${hit.points ?? 0} points, ${hit.num_comments ?? 0} comments on Hacker News`,
            },
        ]
    })
}

// ─── Reddit ─────────────────────────────────────────────────────────────────

/** Accepts `startups`, `r/startups` or a full subreddit URL. */
export function subredditName(value: string): string {
    const match = value.match(/reddit\.com\/r\/([^/?#]+)/i) ?? value.match(/^\/?r\/([^/?#]+)/i)
    return (match?.[1] ?? value).replace(/^\/+|\/+$/g, "")
}

/**
 * Reddit through its Atom feed, not its JSON API.
 *
 * Checked on 25 Sep 2026: `www.reddit.com/r/<sub>/top.json` answers **403** to
 * an unauthenticated client, and `old.reddit.com`'s JSON returns "Not Found"
 * with a 200 — worse than an error, because a naive caller would store the
 * body. The Atom feed answers 200 with a full week of posts and needs no
 * credentials.
 *
 * The cost is that Atom carries no score or comment count, so Reddit signals
 * rank on recency and their source's weight, exactly like Medium and Substack.
 * If those counts ever matter enough, the fix is a Reddit OAuth app, not a
 * different scrape.
 */
export async function fetchReddit(source: string): Promise<RawSignal[]> {
    const sub = subredditName(source)
    return fetchRss(`https://www.reddit.com/r/${encodeURIComponent(sub)}/top.rss?t=week`)
}

// ─── Reference material ─────────────────────────────────────────────────────

const MAX_REFERENCE_CHARS = 40_000

/**
 * The readable text of a reference source, for the brief to draw on.
 *
 * Truncated: a brief needs the argument of a document, not every page of it,
 * and an unbounded paste would dominate the prompt.
 */
export async function referenceText(source: ContentSource): Promise<string> {
    const kind = source.kind as SourceKind

    if (kind === "PDF") {
        if (!source.fileUrl) throw new Error(`PDF source "${source.label}" has no fileUrl`)
        const buffer = await (await get(source.fileUrl, "application/pdf")).arrayBuffer()
        const { text: pages } = await extractText(new Uint8Array(buffer), { mergePages: true })
        const merged = Array.isArray(pages) ? pages.join("\n\n") : pages
        return merged.replace(/\s+\n/g, "\n").trim().slice(0, MAX_REFERENCE_CHARS)
    }

    if (kind === "URL") {
        if (!source.url) throw new Error(`URL source "${source.label}" has no url`)
        const html = await (await get(source.url, "text/html")).text()
        // Drop the parts of a page that are never the argument.
        const body = html
            .replace(/<(script|style|nav|footer|header|aside)[\s\S]*?<\/\1>/gi, " ")
            .replace(/<!--[\s\S]*?-->/g, " ")
        return (stripTags(body, MAX_REFERENCE_CHARS) ?? "").trim()
    }

    throw new Error(`Source kind ${kind} is not reference material`)
}
