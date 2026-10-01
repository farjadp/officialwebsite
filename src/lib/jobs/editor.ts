// ============================================================================
// Hardware Source: editor.ts
// Version: 1.0.0 — 2026-10-01
// Why: What the owner may change in a saved résumé, decided on the server.
//      The wording is theirs to edit freely. The timeline is not: employers,
//      places and dates come from the stored document whatever the browser
//      sends, and a title must be one the profile lists for that role.
// Env / Identity: Pure.
// ============================================================================

import { z } from "zod"
import { formatSpan, type Role } from "./history"
import type { Resume } from "./documents"

export const EditSchema = z.object({
    headline: z.string().max(200),
    summary: z.string().max(2_000),
    roles: z.array(z.object({ title: z.string().max(120), bullets: z.array(z.string().max(400)).max(8) })),
    skills: z.array(z.string().max(60)).max(25),
    coverLetter: z.string().max(6_000),
})
export type Edit = z.infer<typeof EditSchema>

/** The titles a résumé role may carry: the profile's list for it, plus what it has now. */
export function allowedTitles(stored: Resume["roles"][number], history: Role[]): string[] {
    const match = history.find((role) => role.company === stored.company && formatSpan(role) === stored.span)
    return [...new Set([...(match?.titles ?? []), stored.title])]
}

export function applyEdit(stored: Resume, edit: Edit, history: Role[]): { resume: Resume; error?: string } {
    if (edit.roles.length !== stored.roles.length) {
        return { resume: stored, error: "The roles changed underneath the editor. Reload the page." }
    }
    const clean = (lines: string[]) => lines.map((line) => line.trim()).filter(Boolean)
    return {
        resume: {
            ...stored,
            headline: edit.headline.trim(),
            summary: edit.summary.trim(),
            roles: stored.roles.map((role, index) => {
                const wanted = edit.roles[index].title.trim()
                return {
                    ...role,
                    title: allowedTitles(role, history).includes(wanted) ? wanted : role.title,
                    bullets: clean(edit.roles[index].bullets),
                }
            }),
            skills: clean(edit.skills),
        },
    }
}
