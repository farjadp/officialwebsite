// ============================================================================
// Hardware Source: prefilter.ts
// Version: 1.0.0 — 2026-10-01
// Why: A company board lists hundreds of postings and a handful are relevant.
//      This decides which ones are worth a model call, from the title and the
//      location alone, and says why it turned the rest away. It is the whole
//      cost control of the pipeline.
// Env / Identity: Pure.
// ============================================================================

import type { Place } from "./location"
import type { Profile } from "./profile"

export type Verdict =
    | { verdict: "PASS"; lane: string; reason: null }
    | { verdict: "REJECT"; lane: null; reason: string }

function containsPhrase(title: string, phrase: string): boolean {
    const escaped = phrase.trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")
    return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, "i").test(title)
}

export function prefilter(title: string, place: Place, profile: Profile): Verdict {
    if (profile.lanes.length === 0) {
        return { verdict: "REJECT", lane: null, reason: "No lanes in the profile yet" }
    }

    const excluded = profile.excludeTitleKeywords.find((word) => containsPhrase(title, word))
    if (excluded) {
        return { verdict: "REJECT", lane: null, reason: `Title contains "${excluded}"` }
    }

    const lane = profile.lanes.find((candidate) =>
        candidate.keywords.some((keyword) => containsPhrase(title, keyword)),
    )
    if (!lane) return { verdict: "REJECT", lane: null, reason: "Title matches no lane" }

    if (place.country === "OTHER") {
        return { verdict: "REJECT", lane: null, reason: "Outside Canada and the United States" }
    }
    // A named place in either country passes on-site or remote. No named place
    // passes only when the posting is remote: the scorer reads the description
    // to find out who it is open to.
    if (place.country === null && !place.remote) {
        return { verdict: "REJECT", lane: null, reason: "No location given" }
    }

    return { verdict: "PASS", lane: lane.key, reason: null }
}
