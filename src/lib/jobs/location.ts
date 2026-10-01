// ============================================================================
// Hardware Source: location.ts
// Version: 1.0.0 — 2026-10-01
// Why: Boards write a location as free text — "Toronto, ON", "Remote (US)",
//      "San Francisco, CA". The search is for Canada and the United States, so
//      something has to read that text and say which one it is. The trap is
//      ", CA": on a job board that is California, not Canada.
// Env / Identity: Pure.
// ============================================================================

import type { Country } from "./types"

const CA_WORDS = [
    "canada", "ontario", "quebec", "québec", "british columbia", "alberta", "manitoba",
    "saskatchewan", "nova scotia", "new brunswick", "newfoundland", "prince edward island",
    "toronto", "vancouver", "montreal", "montréal", "ottawa", "calgary", "edmonton",
    "waterloo", "kitchener", "mississauga", "markham", "newmarket", "winnipeg", "halifax",
    "victoria, bc", "hamilton, on", "london, on",
]
// ", CA" is deliberately absent: it is California.
const CA_CODES = ["ON", "QC", "BC", "AB", "MB", "SK", "NS", "NB", "NL", "PE"]

const US_WORDS = [
    "united states", "usa", "u.s.", "new york", "san francisco", "california", "seattle",
    "austin", "boston", "chicago", "los angeles", "denver", "atlanta", "washington",
    "texas", "florida", "massachusetts", "colorado", "bay area", "miami", "portland",
    "nyc", "sf", "amer",
]
const US_CODES = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
    "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
    "VA", "WA", "WV", "WI", "WY", "DC",
]

const BOTH_WORDS = ["north america", "northern america", "us or canada", "us/canada", "canada/us", "us & canada", "usa or canada", "americas"]

const OTHER_WORDS = [
    "united kingdom", "uk", "london", "ireland", "dublin", "germany", "berlin", "france", "paris",
    "india", "bangalore", "bengaluru", "singapore", "australia", "sydney", "japan", "tokyo",
    "netherlands", "amsterdam", "spain", "poland", "brazil", "mexico", "emea", "apac", "europe",
    "israel", "tel aviv", "sweden", "switzerland", "portugal", "romania", "latam", "philippines",
    "korea", "seoul", "china", "taiwan", "hong kong", "italy", "belgium", "denmark", "norway",
    "finland", "austria", "czech", "hungary", "turkey", "uae", "dubai", "saudi", "nigeria",
    "kenya", "south africa", "argentina", "colombia", "chile", "new zealand", "vietnam",
    "thailand", "indonesia", "malaysia", "pakistan", "ukraine", "bucharest", "lisbon", "madrid",
    "barcelona", "munich", "zurich", "stockholm", "warsaw", "prague", "melbourne", "mumbai",
]

function hasWord(haystack: string, word: string): boolean {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return new RegExp(`(^|[^a-z])${escaped}($|[^a-z])`, "i").test(haystack)
}

function hasCode(original: string, codes: string[]): boolean {
    // A state or province code only counts after a comma: "Austin, TX".
    return codes.some((code) => new RegExp(`,\\s*${code}(\\b|$)`).test(original))
}

function hasBareCountryCode(original: string, code: "US" | "CA"): boolean {
    // "Remote - US", "Remote (CA)", "US-Remote", "Remote in the US, …".
    const bare = new RegExp(`(^|[^A-Za-z])${code}($|[^A-Za-z])`).test(original)
    if (code === "US") return bare
    // ", CA" is California: a bare CA counts only where no comma leads into it.
    return bare && !/,\s*CA(\b|$)/.test(original)
}

export type Place = { country: Country | null; remote: boolean }

/**
 * Read a board's location text.
 *
 * `country` is null when the text names no place at all ("Remote", empty):
 * that is "cannot be told", which is different from `OTHER`.
 */
export function classifyLocation(location: string | null, remoteHint: boolean | null = null): Place {
    const text = (location ?? "").trim()
    const remote = remoteHint === true || /\bremote\b|work from home|distributed|anywhere|worldwide/i.test(text)
    if (!text) return { country: null, remote }

    const lower = text.toLowerCase()

    if (BOTH_WORDS.some((word) => lower.includes(word))) return { country: "NA", remote }

    const ca =
        CA_WORDS.some((word) => hasWord(lower, word)) ||
        hasCode(text, CA_CODES) ||
        hasBareCountryCode(text, "CA")
    const us =
        // "London, ON" is Canadian; do not let US words outvote an explicit province.
        US_WORDS.some((word) => hasWord(lower, word)) ||
        hasCode(text, US_CODES) ||
        hasBareCountryCode(text, "US")

    if (ca && us) return { country: "NA", remote }
    if (ca) return { country: "CA", remote }
    if (us) return { country: "US", remote }
    if (OTHER_WORDS.some((word) => hasWord(lower, word))) return { country: "OTHER", remote }

    // Names a place we do not recognise. With no remote signal that is
    // somewhere else; with one, it cannot be told.
    return { country: remote ? null : "OTHER", remote }
}
