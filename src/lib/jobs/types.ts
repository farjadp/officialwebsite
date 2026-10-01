// ============================================================================
// Hardware Source: types.ts
// Version: 1.0.0 — 2026-10-01
// Why: The vocabulary of the job search: which boards can be read, what one
//      posting looks like once it has been read, and the states it moves
//      through. Everything else in this folder speaks these words.
// Env / Identity: Pure. No database, no network.
// ============================================================================

export const BOARD_KINDS = ["ADZUNA", "HIMALAYAS", "JOOBLE", "REMOTIVE", "GREENHOUSE", "LEVER", "ASHBY"] as const
export type BoardKind = (typeof BOARD_KINDS)[number]

export const BOARD_KIND_LABEL: Record<BoardKind, string> = {
    ADZUNA: "Adzuna search",
    HIMALAYAS: "Himalayas search (remote)",
    JOOBLE: "Jooble search",
    GREENHOUSE: "Greenhouse",
    LEVER: "Lever",
    ASHBY: "Ashby",
    REMOTIVE: "Remotive search",
}

export const JOB_STATUSES = [
    "NEW",
    "SHORTLISTED",
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
    "DISMISSED",
] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

/** `NA` is a posting open to both Canada and the United States. */
export const COUNTRIES = ["CA", "US", "NA", "OTHER"] as const
export type Country = (typeof COUNTRIES)[number]

export const AUTHORISATIONS = ["OK", "NEEDS_SPONSORSHIP", "UNCLEAR"] as const
export type Authorisation = (typeof AUTHORISATIONS)[number]

/** One posting as read from a board, before anything is decided about it. */
export type RawPosting = {
    externalId: string
    title: string
    company: string
    location: string | null
    /** What the board itself says about remote work, when it says anything. */
    remoteHint: boolean | null
    department: string | null
    url: string
    description: string
    postedAt: Date | null
}

export function fingerprint(kind: BoardKind, token: string, externalId: string): string {
    return `${kind}:${token.toLowerCase()}:${externalId}`
}
