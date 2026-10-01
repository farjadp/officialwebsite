// ============================================================================
// Hardware Source: sources.ts
// Version: 1.0.0 — 2026-10-01
// Why: The only place the job search touches the outside world. Four kinds of
//      board, one shape out. Every endpoint here is the board's own public,
//      unauthenticated posting API — nothing is scraped and nothing is read
//      from behind a login.
// Env / Identity: Server only. Network egress through `safeFetch`. The
//      normalisers are pure and are what the tests exercise.
// ============================================================================

import { safeFetch } from "@/lib/content/safe-url"
import { decodeEntities, htmlToText } from "./text"
import type { BoardKind, RawPosting } from "./types"

const FETCH_TIMEOUT_MS = 25_000
const USER_AGENT = "farjadp.info job search (+https://www.farjadp.info)"

/** A board token is a slug or a search phrase — never a path or a URL. */
export function isValidToken(kind: BoardKind, token: string): boolean {
    if (kind === "REMOTIVE") return /^[\w .+#&-]{2,60}$/.test(token)
    return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,80}$/.test(token)
}

export function boardUrl(kind: BoardKind, token: string): string {
    const slug = encodeURIComponent(token)
    switch (kind) {
        case "GREENHOUSE":
            return `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`
        case "LEVER":
            return `https://api.lever.co/v0/postings/${slug}?mode=json`
        case "ASHBY":
            return `https://api.ashbyhq.com/posting-api/job-board/${slug}`
        case "REMOTIVE":
            return `https://remotive.com/api/remote-jobs?search=${slug}`
    }
}

// ─── Reading untyped JSON without trusting it ───────────────────────────────

type Json = Record<string, unknown>

const isObject = (value: unknown): value is Json => typeof value === "object" && value !== null && !Array.isArray(value)
const text = (value: unknown): string | null => (typeof value === "string" && value.trim() ? value.trim() : null)
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

function date(value: unknown): Date | null {
    if (typeof value !== "string" && typeof value !== "number") return null
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

/** Only http(s) links are kept; anything else would be rendered as a link. */
function link(value: unknown): string | null {
    const raw = text(value)
    if (!raw) return null
    try {
        const url = new URL(raw)
        return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
    } catch {
        return null
    }
}

function keep(postings: (RawPosting | null)[]): RawPosting[] {
    return postings.filter((posting): posting is RawPosting => posting !== null)
}

// ─── Normalisers ────────────────────────────────────────────────────────────

export function normalizeGreenhouse(payload: unknown, label: string): RawPosting[] {
    if (!isObject(payload)) throw new Error("Greenhouse: unexpected response shape")
    return keep(
        list(payload.jobs).map((job) => {
            if (!isObject(job)) return null
            const title = text(job.title)
            const url = link(job.absolute_url)
            if (job.id == null || !title || !url) return null
            const department = list(job.departments).map((d) => (isObject(d) ? text(d.name) : null)).find(Boolean) ?? null
            return {
                externalId: String(job.id),
                title,
                company: text(job.company_name) ?? label,
                location: isObject(job.location) ? text(job.location.name) : null,
                remoteHint: null,
                department,
                url,
                // Greenhouse entity-escapes its HTML: decode once, then strip.
                description: htmlToText(decodeEntities(text(job.content) ?? "")),
                postedAt: date(job.first_published) ?? date(job.updated_at),
            }
        }),
    )
}

export function normalizeLever(payload: unknown, label: string): RawPosting[] {
    if (!Array.isArray(payload)) throw new Error("Lever: unexpected response shape")
    return keep(
        payload.map((job) => {
            if (!isObject(job)) return null
            const id = text(job.id)
            const title = text(job.text)
            const url = link(job.hostedUrl)
            if (!id || !title || !url) return null
            const categories = isObject(job.categories) ? job.categories : {}
            const sections = list(job.lists)
                .map((section) =>
                    isObject(section) ? `${text(section.text) ?? ""}\n${htmlToText(text(section.content) ?? "")}` : "",
                )
                .filter(Boolean)
            const workplace = text(job.workplaceType)
            return {
                externalId: id,
                title,
                company: label,
                location: text(categories.location),
                remoteHint: workplace ? workplace.toLowerCase() === "remote" : null,
                department: text(categories.department) ?? text(categories.team),
                url,
                description: [text(job.descriptionPlain) ?? "", ...sections, text(job.additionalPlain) ?? ""]
                    .filter(Boolean)
                    .join("\n\n"),
                postedAt: date(job.createdAt),
            }
        }),
    )
}

export function normalizeAshby(payload: unknown, label: string): RawPosting[] {
    if (!isObject(payload)) throw new Error("Ashby: unexpected response shape")
    return keep(
        list(payload.jobs).map((job) => {
            if (!isObject(job) || job.isListed === false) return null
            const id = text(job.id)
            const title = text(job.title)
            const url = link(job.jobUrl)
            if (!id || !title || !url) return null
            const others = list(job.secondaryLocations)
                .map((place) => (isObject(place) ? text(place.location) : null))
                .filter(Boolean)
            return {
                externalId: id,
                title,
                company: label,
                location: [text(job.location), ...others].filter(Boolean).join("; ") || null,
                remoteHint: typeof job.isRemote === "boolean" ? job.isRemote : null,
                department: text(job.department) ?? text(job.team),
                url,
                description: text(job.descriptionPlain) ?? htmlToText(text(job.descriptionHtml) ?? ""),
                postedAt: date(job.publishedAt),
            }
        }),
    )
}

export function normalizeRemotive(payload: unknown): RawPosting[] {
    if (!isObject(payload)) throw new Error("Remotive: unexpected response shape")
    return keep(
        list(payload.jobs).map((job) => {
            if (!isObject(job)) return null
            const title = text(job.title)
            const url = link(job.url)
            if (job.id == null || !title || !url) return null
            return {
                externalId: String(job.id),
                title,
                company: text(job.company_name) ?? "Unknown",
                // Remotive lists who may apply, not where the office is.
                location: text(job.candidate_required_location),
                remoteHint: true,
                department: text(job.category),
                url,
                description: htmlToText(text(job.description) ?? ""),
                postedAt: date(job.publication_date),
            }
        }),
    )
}

export function normalize(kind: BoardKind, payload: unknown, label: string): RawPosting[] {
    switch (kind) {
        case "GREENHOUSE":
            return normalizeGreenhouse(payload, label)
        case "LEVER":
            return normalizeLever(payload, label)
        case "ASHBY":
            return normalizeAshby(payload, label)
        case "REMOTIVE":
            return normalizeRemotive(payload)
    }
}

// ─── Fetch ──────────────────────────────────────────────────────────────────

/** Every posting currently on one board. Throws with a message fit to show. */
export async function fetchBoard(kind: BoardKind, token: string, label: string): Promise<RawPosting[]> {
    if (!isValidToken(kind, token)) throw new Error(`"${token}" is not a valid ${kind} token`)

    const response = await safeFetch(boardUrl(kind, token), {
        headers: { "user-agent": USER_AGENT, accept: "application/json" },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (response.status === 404) throw new Error(`No ${kind} board is called "${token}"`)
    if (!response.ok) throw new Error(`${response.status} ${response.statusText} from ${kind}`)

    return normalize(kind, await response.json(), label)
}
