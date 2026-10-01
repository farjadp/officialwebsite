// ============================================================================
// Hardware Source: profile.ts
// Version: 1.0.0 — 2026-10-01
// Why: One description of the candidate that the prefilter and the scorer both
//      read, so they cannot disagree about who is looking for what. It lives in
//      a single AppSetting row: this repository is public, and a career profile
//      is not something to commit.
// Env / Identity: The schema and the parsers are pure; load/save touch Postgres.
// ============================================================================

import { z } from "zod"

export const PROFILE_KEY = "jobs.profile"

export const LaneSchema = z.object({
    key: z.string().min(1),
    label: z.string().min(1),
    /** A posting belongs to this lane when its title contains one of these. */
    keywords: z.array(z.string().min(1)).min(1),
})
export type Lane = z.infer<typeof LaneSchema>

export const ProfileSchema = z.object({
    headline: z.string().default(""),
    /** Free text the scorer reads: experience, strengths, what is wanted. */
    summary: z.string().default(""),
    authorisation: z
        .object({ CA: z.string().default(""), US: z.string().default("") })
        .default({ CA: "", US: "" }),
    lanes: z.array(LaneSchema).default([]),
    /** A title containing any of these is rejected whatever lane it matches. */
    excludeTitleKeywords: z.array(z.string().min(1)).default([]),
})
export type Profile = z.infer<typeof ProfileSchema>

export const EMPTY_PROFILE: Profile = ProfileSchema.parse({})

export function laneKey(label: string): string {
    return label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}

function splitList(text: string): string[] {
    return [...new Set(text.split(/[,\n]/).map((part) => part.trim()).filter(Boolean))]
}

/**
 * The admin edits lanes as text, one per line: `Label: keyword, keyword`.
 * Returns the lanes, or the lines that could not be read.
 */
export function parseLanes(text: string): { lanes: Lane[]; errors: string[] } {
    const lanes: Lane[] = []
    const errors: string[] = []
    for (const raw of text.split("\n")) {
        const line = raw.trim()
        if (!line) continue
        const colon = line.indexOf(":")
        const label = colon === -1 ? "" : line.slice(0, colon).trim()
        const keywords = colon === -1 ? [] : splitList(line.slice(colon + 1))
        const key = laneKey(label)
        if (!key || keywords.length === 0) {
            errors.push(`Cannot read "${line}" — expected "Label: keyword, keyword"`)
        } else if (lanes.some((lane) => lane.key === key)) {
            errors.push(`Two lanes are called "${label}"`)
        } else {
            lanes.push({ key, label, keywords })
        }
    }
    return { lanes, errors }
}

export function formatLanes(lanes: Lane[]): string {
    return lanes.map((lane) => `${lane.label}: ${lane.keywords.join(", ")}`).join("\n")
}

export function parseKeywordList(text: string): string[] {
    return splitList(text)
}

/** A stored value that no longer fits the schema reads as an empty profile. */
export function parseProfile(stored: string | null | undefined): Profile {
    if (!stored) return EMPTY_PROFILE
    try {
        const parsed = ProfileSchema.safeParse(JSON.parse(stored))
        return parsed.success ? parsed.data : EMPTY_PROFILE
    } catch {
        return EMPTY_PROFILE
    }
}

export async function loadProfile(): Promise<Profile> {
    const { prisma } = await import("@/lib/prisma")
    const row = await prisma.appSetting.findUnique({ where: { key: PROFILE_KEY } })
    return parseProfile(row?.value)
}

export async function saveProfile(profile: Profile): Promise<void> {
    const { prisma } = await import("@/lib/prisma")
    const value = JSON.stringify(ProfileSchema.parse(profile))
    await prisma.appSetting.upsert({
        where: { key: PROFILE_KEY },
        create: { key: PROFILE_KEY, value },
        update: { value },
    })
}
