// ============================================================================
// Hardware Source: history.ts
// Version: 1.0.0 — 2026-10-01
// Why: Every tailored résumé is built from this one record. A company has ONE
//      start and ONE end date, used on every résumé, so two of them can never
//      show a recruiter two different timelines. What may vary is the title:
//      each role lists every title that was true for it, and a résumé picks
//      the one that fits the posting.
//
//      The owner edits it as plain text, because a form with nested repeating
//      fields is worse to edit than this:
//
//        ## Company | City | 2019-03 – present
//        titles: Founder & CEO, CTO
//        - What was done, with the real numbers
//
// Env / Identity: Pure.
// ============================================================================

import { z } from "zod"

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/

export const RoleSchema = z.object({
    company: z.string().min(1),
    location: z.string().default(""),
    start: z.string().regex(MONTH),
    /** YYYY-MM, or null for a role that is still current. */
    end: z.string().regex(MONTH).nullable(),
    titles: z.array(z.string().min(1)).min(1),
    facts: z.array(z.string().min(1)).default([]),
})
export type Role = z.infer<typeof RoleSchema>

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function formatMonth(month: string | null): string {
    if (!month) return "Present"
    const [year, index] = month.split("-")
    return `${MONTHS[Number(index) - 1]} ${year}`
}

export function formatSpan(role: Pick<Role, "start" | "end">): string {
    return `${formatMonth(role.start)} – ${formatMonth(role.end)}`
}

/** Newest first, current roles before ended ones. */
export function sortRoles(roles: Role[]): Role[] {
    return [...roles].sort((a, b) => (b.end ?? "9999-99").localeCompare(a.end ?? "9999-99") || b.start.localeCompare(a.start))
}

export function parseHistory(text: string): { roles: Role[]; errors: string[] } {
    const roles: Role[] = []
    const errors: string[] = []
    let current: { role: Partial<Role> & { facts: string[] }; header: string } | null = null

    const finish = () => {
        if (!current) return
        const parsed = RoleSchema.safeParse(current.role)
        if (parsed.success) roles.push(parsed.data)
        else if (!current.role.titles?.length) errors.push(`"${current.header}" has no "titles:" line`)
        else errors.push(`Cannot read "${current.header}"`)
        current = null
    }

    for (const raw of text.split("\n")) {
        const line = raw.trim()
        if (!line) continue

        if (line.startsWith("## ")) {
            finish()
            const header = line.slice(3).trim()
            const parts = header.split("|").map((part) => part.trim())
            const span = parts.length >= 2 ? parts[parts.length - 1] : ""
            const match = span.match(/^(\d{4}-\d{2})\s*[–—-]\s*(\d{4}-\d{2}|present|now|current)$/i)
            if (!match || parts.length < 2) {
                errors.push(`"${header}" should end with "| YYYY-MM – YYYY-MM" or "| YYYY-MM – present"`)
                current = null
                continue
            }
            const end = /^\d/.test(match[2]) ? match[2] : null
            if (end && end < match[1]) errors.push(`"${parts[0]}" ends before it starts`)
            current = {
                header,
                role: {
                    company: parts[0],
                    location: parts.length > 2 ? parts.slice(1, -1).join(", ") : "",
                    start: match[1],
                    end,
                    facts: [],
                },
            }
            continue
        }

        if (!current) {
            errors.push(`"${line}" is outside any role — start a role with "## "`)
            continue
        }
        if (/^titles?:/i.test(line)) {
            current.role.titles = line
                .replace(/^titles?:/i, "")
                .split(/[;,]/)
                .map((title) => title.trim())
                .filter(Boolean)
        } else if (line.startsWith("- ")) {
            current.role.facts.push(line.slice(2).trim())
        } else {
            errors.push(`"${line}" in ${current.role.company}: expected "titles:" or a "- " line`)
        }
    }
    finish()
    return { roles: sortRoles(roles), errors }
}

export function formatHistory(roles: Role[]): string {
    return sortRoles(roles)
        .map((role) =>
            [
                `## ${[role.company, role.location, `${role.start} – ${role.end ?? "present"}`].filter(Boolean).join(" | ")}`,
                `titles: ${role.titles.join(", ")}`,
                ...role.facts.map((fact) => `- ${fact}`),
            ].join("\n"),
        )
        .join("\n\n")
}

/** Lines of the form `Degree | School | Year`; the year is optional. */
export const EducationSchema = z.object({ degree: z.string().min(1), school: z.string().default(""), year: z.string().default("") })
export type Education = z.infer<typeof EducationSchema>

export function parseEducation(text: string): Education[] {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const [degree, school = "", year = ""] = line.split("|").map((part) => part.trim())
            return { degree, school, year }
        })
}

export function formatEducation(items: Education[]): string {
    return items.map((item) => [item.degree, item.school, item.year].filter(Boolean).join(" | ")).join("\n")
}
