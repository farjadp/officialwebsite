// ============================================================================
// Hardware Source: sources.ts
// Version: 1.0.0 — 2026-10-01
// Why: The only place the job search touches the outside world. Five kinds of
//      source, one shape out. Four are a company's own public posting API; one,
//      Adzuna, is a search across the Canadian or US market by title, through
//      its official API and the owner's own key. Nothing is scraped and nothing
//      is read from behind a login.
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
    if (kind === "ADZUNA") return /^(ca|us)(\/[a-z-]{2,40})?:[\w .+#&-]{2,60}$/i.test(token)
    if (kind === "HIMALAYAS") return /^(ca|us|ww):[\w .+#&-]{2,60}$/i.test(token)
    if (kind === "JOOBLE") return /^(ca|us):[\w .+#&-]{2,60}$/i.test(token)
    if (kind === "REMOTIVE") return /^[\w .+#&-]{2,60}$/.test(token)
    return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,80}$/.test(token)
}

/**
 * "ca:product manager" → country and phrase. An optional Adzuna category tag
 * narrows a phrase that means different things in different trades:
 * "ca/it-jobs:project manager" leaves out construction and events.
 */
export function adzunaSearch(token: string): { country: "ca" | "us"; category: string | null; what: string } {
    const colon = token.indexOf(":")
    const [country, category] = token.slice(0, colon).toLowerCase().split("/")
    return { country: country === "us" ? "us" : "ca", category: category || null, what: token.slice(colon + 1).trim() }
}

const ADZUNA_PAGES = 2
const ADZUNA_PER_PAGE = 50
const ADZUNA_MAX_DAYS = 21

/** The Adzuna URL without credentials; `fetchBoard` adds them, so they are never shown or logged. */
export function adzunaUrl(token: string, page: number): string {
    const { country, category, what } = adzunaSearch(token)
    const query = new URLSearchParams({
        what_phrase: what,
        results_per_page: String(ADZUNA_PER_PAGE),
        max_days_old: String(ADZUNA_MAX_DAYS),
        sort_by: "date",
        "content-type": "application/json",
    })
    if (category) query.set("category", category)
    return `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${query}`
}

/** "ca:product manager" → country (ca, us, or ww for worldwide-remote) and phrase. */
function searchParts(token: string): { country: string; what: string } {
    const colon = token.indexOf(":")
    return { country: token.slice(0, colon).toLowerCase(), what: token.slice(colon + 1).trim() }
}

const HIMALAYAS_PAGES = 3

export function himalayasUrl(token: string, page: number): string {
    const { country, what } = searchParts(token)
    const query = new URLSearchParams({ q: what, page: String(page) })
    if (country === "ww") query.set("worldwide", "true")
    else query.set("country", country.toUpperCase())
    return `https://himalayas.app/jobs/api/search?${query}`
}

export function boardUrl(kind: BoardKind, token: string): string {
    const slug = encodeURIComponent(token)
    switch (kind) {
        case "ADZUNA":
            return adzunaUrl(token, 1)
        case "HIMALAYAS":
            return himalayasUrl(token, 1)
        case "JOOBLE":
            return "https://jooble.org/api/"
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

export function normalizeAdzuna(payload: unknown, country: "ca" | "us"): RawPosting[] {
    if (!isObject(payload)) throw new Error("Adzuna: unexpected response shape")
    const countryName = country === "ca" ? "Canada" : "United States"
    return keep(
        list(payload.results).map((job) => {
            if (!isObject(job)) return null
            const title = text(job.title)
            const url = link(job.redirect_url)
            if (job.id == null || !title || !url) return null
            const place = isObject(job.location) ? text(job.location.display_name) : null
            return {
                externalId: String(job.id),
                // Adzuna wraps matched words in <strong>.
                title: htmlToText(title),
                company: (isObject(job.company) ? text(job.company.display_name) : null) ?? "Unknown",
                // The search is per country, so the country is known even when
                // the place name alone ("Ottawa") would not say it.
                location: place ? (place.includes(countryName) ? place : `${place}, ${countryName}`) : countryName,
                remoteHint: null,
                department: isObject(job.category) ? text(job.category.label) : null,
                url,
                // Adzuna returns a snippet of about 500 characters, not the full text.
                description: htmlToText(text(job.description) ?? ""),
                postedAt: date(job.created),
            }
        }),
    )
}

/** "Remote (Canada)", or for a long list "Remote (Canada, United States and 38 more)". */
export function remotePlaces(places: string[]): string {
    if (places.length === 0) return "Remote, anywhere"
    if (places.length <= 4) return `Remote (${places.join(", ")})`
    // Name the two countries the search is about first, so the location reader still sees them.
    const first = [...places.filter((p) => p === "Canada" || p === "United States"), ...places.filter((p) => p !== "Canada" && p !== "United States")].slice(0, 2)
    return `Remote (${first.join(", ")} and ${places.length - first.length} more)`
}

export function normalizeHimalayas(payload: unknown): RawPosting[] {
    if (!isObject(payload)) throw new Error("Himalayas: unexpected response shape")
    return keep(
        list(payload.jobs).map((job) => {
            if (!isObject(job)) return null
            const title = text(job.title)
            const url = link(job.applicationLink) ?? link(job.guid)
            const id = text(job.guid) ?? url
            if (!id || !title || !url) return null
            const places = list(job.locationRestrictions).map(text).filter((place): place is string => Boolean(place))
            const published = typeof job.pubDate === "number" || typeof job.pubDate === "string" ? Number(job.pubDate) : NaN
            return {
                externalId: id,
                title,
                company: text(job.companyName) ?? "Unknown",
                // Himalayas lists only remote jobs; the restriction is who may apply.
                location: remotePlaces(places),
                remoteHint: true,
                department: list(job.parentCategories).map(text).find(Boolean) ?? null,
                url,
                description: htmlToText(text(job.description) ?? text(job.excerpt) ?? ""),
                postedAt: Number.isFinite(published) ? new Date(published * 1000) : null,
            }
        }),
    )
}

export function normalizeJooble(payload: unknown, country: string): RawPosting[] {
    if (!isObject(payload)) throw new Error("Jooble: unexpected response shape")
    const countryName = country === "us" ? "United States" : "Canada"
    return keep(
        list(payload.jobs).map((job) => {
            if (!isObject(job)) return null
            const title = text(job.title)
            const url = link(job.link)
            if (job.id == null || !title || !url) return null
            const place = text(job.location)
            return {
                externalId: String(job.id),
                title: htmlToText(title),
                company: text(job.company) ?? "Unknown",
                location: place ? (place.includes(countryName) ? place : `${place}, ${countryName}`) : countryName,
                remoteHint: null,
                department: text(job.type),
                url,
                // A snippet, like Adzuna's: Jooble does not return full postings.
                description: htmlToText(text(job.snippet) ?? ""),
                postedAt: date(job.updated),
            }
        }),
    )
}

export function normalize(kind: BoardKind, payload: unknown, label: string): RawPosting[] {
    switch (kind) {
        case "ADZUNA":
        case "JOOBLE":
            throw new Error(`${kind} pages are read by fetchBoard`)
        case "HIMALAYAS":
            return normalizeHimalayas(payload)
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
    if (kind === "ADZUNA") return fetchAdzuna(token)
    if (kind === "HIMALAYAS") return fetchHimalayas(token)
    if (kind === "JOOBLE") return fetchJooble(token)

    const response = await safeFetch(boardUrl(kind, token), {
        headers: { "user-agent": USER_AGENT, accept: "application/json" },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (response.status === 404) throw new Error(`No ${kind} board is called "${token}"`)
    if (!response.ok) throw new Error(`${response.status} ${response.statusText} from ${kind}`)

    return normalize(kind, await response.json(), label)
}

async function fetchAdzuna(token: string): Promise<RawPosting[]> {
    const id = process.env.ADZUNA_APP_ID?.trim()
    const key = process.env.ADZUNA_APP_KEY?.trim()
    if (!id || !key) throw new Error("Adzuna is not set up: ADZUNA_APP_ID and ADZUNA_APP_KEY are missing")

    const { country } = adzunaSearch(token)
    const all: RawPosting[] = []
    for (let page = 1; page <= ADZUNA_PAGES; page++) {
        const url = `${adzunaUrl(token, page)}&app_id=${encodeURIComponent(id)}&app_key=${encodeURIComponent(key)}`
        const response = await safeFetch(url, {
            headers: { "user-agent": USER_AGENT, accept: "application/json" },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        })
        // Never echo the URL: it carries the key.
        if (response.status === 401 || response.status === 400) throw new Error("Adzuna refused the key")
        if (!response.ok) throw new Error(`${response.status} ${response.statusText} from Adzuna`)
        const found = normalizeAdzuna(await response.json(), country)
        all.push(...found)
        if (found.length < ADZUNA_PER_PAGE) break
    }
    return all
}

async function fetchHimalayas(token: string): Promise<RawPosting[]> {
    const all: RawPosting[] = []
    for (let page = 1; page <= HIMALAYAS_PAGES; page++) {
        const response = await safeFetch(himalayasUrl(token, page), {
            headers: { "user-agent": USER_AGENT, accept: "application/json" },
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        })
        if (!response.ok) throw new Error(`${response.status} ${response.statusText} from Himalayas`)
        const found = normalizeHimalayas(await response.json())
        all.push(...found)
        if (found.length < 20) break
    }
    return all
}

const JOOBLE_PAGES = 2

async function fetchJooble(token: string): Promise<RawPosting[]> {
    const key = process.env.JOOBLE_API_KEY?.trim()
    if (!key) throw new Error("Jooble is not set up: JOOBLE_API_KEY is missing")
    const { country, what } = searchParts(token)

    const all: RawPosting[] = []
    for (let page = 1; page <= JOOBLE_PAGES; page++) {
        // The key is part of the path: never echo this URL.
        const response = await safeFetch(`https://jooble.org/api/${encodeURIComponent(key)}`, {
            method: "POST",
            headers: { "user-agent": USER_AGENT, accept: "application/json", "content-type": "application/json" },
            body: JSON.stringify({ keywords: what, location: country === "us" ? "United States" : "Canada", page: String(page) }),
            signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        })
        if (response.status === 403 || response.status === 401) throw new Error("Jooble refused the key")
        if (!response.ok) throw new Error(`${response.status} ${response.statusText} from Jooble`)
        const found = normalizeJooble(await response.json(), country)
        all.push(...found)
        if (found.length < 20) break
    }
    return all
}
