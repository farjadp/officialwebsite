"use server"

// ============================================================================
// Hardware Source: actions.ts
// Version: 1.0.0 — 2026-10-01
// Why: Everything the job-search screens can change. Each action asks
//      `assertOwner` first: /admin lets editors in, and this section does not.
// Env / Identity: Server Actions
// ============================================================================

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { assist, reviewDocument, ASSIST_TARGETS, type AssistResult, type AssistTarget, type ModelReview } from "./assist"
import type { Resume } from "./documents"
import { applyEdit, EditSchema, type Edit } from "./editor"
import { isPaused, setPaused } from "./control"
import { generateDocuments as generate, type GenerateResult } from "./generate"
import { assertOwner } from "./guard"
import { parseEducation, parseHistory } from "./history"
import { runIngest, type BoardReport } from "./ingest"
import { ProfileSchema, loadProfile, parseKeywordList, parseLanes, saveProfile } from "./profile"
import { scorePending, type ScoreReport } from "./score"
import { fetchBoard, isValidToken } from "./sources"
import { BOARD_KINDS, JOB_STATUSES, type BoardKind, type JobStatus } from "./types"

const PATH = "/admin/jobs"

function message(error: unknown): string {
    return error instanceof Error ? error.message : String(error)
}

// ─── Postings ───────────────────────────────────────────────────────────────

export async function setStatus(id: string, status: string): Promise<{ ok: boolean }> {
    await assertOwner()
    if (!(JOB_STATUSES as readonly string[]).includes(status)) return { ok: false }
    const next = status as JobStatus

    const current = await prisma.jobPosting.findUnique({ where: { id }, select: { appliedAt: true } })
    if (!current) return { ok: false }

    await prisma.jobPosting.update({
        where: { id },
        data: {
            status: next,
            // The date of the first application is kept through later states.
            ...(next === "APPLIED" && !current.appliedAt ? { appliedAt: new Date() } : {}),
        },
    })
    revalidatePath(PATH)
    return { ok: true }
}

export async function saveNotes(id: string, notes: string): Promise<{ ok: boolean }> {
    await assertOwner()
    await prisma.jobPosting.update({ where: { id }, data: { notes: notes.trim().slice(0, 10_000) || null } })
    revalidatePath(`${PATH}/${id}`)
    return { ok: true }
}

// ─── Boards ─────────────────────────────────────────────────────────────────

export type BoardFormState = { error?: string; ok?: string }

function readBoardForm(formData: FormData): { kind: BoardKind; token: string; label: string } | { error: string } {
    const kind = String(formData.get("kind") ?? "")
    const token = String(formData.get("token") ?? "").trim()
    const label = String(formData.get("label") ?? "").trim().slice(0, 120)

    if (!(BOARD_KINDS as readonly string[]).includes(kind)) return { error: "Choose a board type" }
    if (!label) return { error: "Give the board a name" }
    if (!isValidToken(kind as BoardKind, token)) {
        return { error: "The token is the company's slug on that board — letters, digits, dots and dashes only" }
    }
    return { kind: kind as BoardKind, token, label }
}

/** Fetches the board first: a token that does not answer is never saved. */
export async function addBoard(_previous: BoardFormState, formData: FormData): Promise<BoardFormState> {
    await assertOwner()
    const form = readBoardForm(formData)
    if ("error" in form) return form

    const exists = await prisma.jobBoard.findUnique({ where: { kind_token: { kind: form.kind, token: form.token } } })
    if (exists) return { error: `That board is already here as "${exists.label}"` }

    let count: number
    try {
        count = (await fetchBoard(form.kind, form.token, form.label)).length
    } catch (error) {
        return { error: message(error) }
    }

    await prisma.jobBoard.create({ data: { ...form, lastCount: count } })
    revalidatePath(`${PATH}/boards`)
    return { ok: `Added "${form.label}" — ${count} posting${count === 1 ? "" : "s"} on it now. They are read on the next run.` }
}

export async function toggleBoard(id: string, enabled: boolean): Promise<void> {
    await assertOwner()
    await prisma.jobBoard.update({ where: { id }, data: { enabled } })
    revalidatePath(`${PATH}/boards`)
}

/** Removes the board and, by cascade, every posting found on it. */
export async function deleteBoard(id: string): Promise<void> {
    await assertOwner()
    await prisma.jobBoard.delete({ where: { id } })
    revalidatePath(PATH)
    revalidatePath(`${PATH}/boards`)
}

// ─── Profile ────────────────────────────────────────────────────────────────

export type ProfileFormState = { errors?: string[]; saved?: boolean }

export async function saveProfileAction(_previous: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
    await assertOwner()
    const field = (name: string) => String(formData.get(name) ?? "").trim()

    const { lanes, errors } = parseLanes(field("lanes"))
    const history = parseHistory(field("history"))
    if (errors.length || history.errors.length) return { errors: [...errors, ...history.errors] }

    const parsed = ProfileSchema.safeParse({
        headline: field("headline").slice(0, 300),
        summary: field("summary").slice(0, 8_000),
        authorisation: { CA: field("authCA").slice(0, 300), US: field("authUS").slice(0, 300) },
        lanes,
        excludeTitleKeywords: parseKeywordList(field("exclude")),
        contact: {
            name: field("name").slice(0, 120),
            email: field("email").slice(0, 200),
            phone: field("phone").slice(0, 60),
            location: field("location").slice(0, 120),
            links: parseKeywordList(field("links")).slice(0, 6),
        },
        history: history.roles,
        education: parseEducation(field("education")),
        certifications: field("certifications").split("\n").map((line) => line.trim()).filter(Boolean),
        skills: parseKeywordList(field("skills")),
    })
    if (!parsed.success) return { errors: parsed.error.issues.map((issue) => issue.message) }

    await saveProfile(parsed.data)
    revalidatePath(`${PATH}/profile`)
    return { saved: true }
}

// ─── Run ────────────────────────────────────────────────────────────────────

export type RunReport = { boards: BoardReport[]; scoring: ScoreReport } | { error: string }

/** The same work the daily cron does, on demand. */
export async function runNow(): Promise<RunReport> {
    await assertOwner()
    if (await isPaused()) return { error: "The job search is paused. Resume it to read the sources." }
    try {
        const boards = await runIngest()
        const scoring = await scorePending()
        revalidatePath(PATH)
        return { boards, scoring }
    } catch (error) {
        return { error: message(error) }
    }
}

// ─── Documents ──────────────────────────────────────────────────────────────

export async function generateDocumentsAction(postingId: string): Promise<GenerateResult> {
    await assertOwner()
    try {
        const result = await generate(postingId)
        if (result.ok) revalidatePath(`${PATH}/${postingId}`)
        return result
    } catch (error) {
        return { ok: false, error: message(error) }
    }
}

// ─── Editor ─────────────────────────────────────────────────────────────────

async function loadDocument(documentId: string) {
    return prisma.jobDocument.findUnique({
        where: { id: documentId },
        include: { posting: { select: { id: true, title: true, company: true, description: true } } },
    })
}

export async function saveDocumentAction(documentId: string, edit: Edit): Promise<{ ok: boolean; error?: string }> {
    await assertOwner()
    const parsed = EditSchema.safeParse(edit)
    if (!parsed.success) return { ok: false, error: "Something in the edit is too long or malformed" }

    const document = await loadDocument(documentId)
    if (!document) return { ok: false, error: "That document no longer exists" }

    const profile = await loadProfile()
    const { resume, error } = applyEdit(document.resume as unknown as Resume, parsed.data, profile.history)
    if (error) return { ok: false, error }

    await prisma.jobDocument.update({
        where: { id: documentId },
        data: { resume, coverLetter: parsed.data.coverLetter.trim(), editedAt: new Date() },
    })
    revalidatePath(`${PATH}/${document.postingId}`)
    return { ok: true }
}

export async function assistAction(input: {
    documentId: string
    target: string
    current: string | string[]
    instruction: string
    roleCompany?: string
}): Promise<AssistResult> {
    await assertOwner()
    if (!(ASSIST_TARGETS as readonly string[]).includes(input.target)) return { ok: false, error: "Unknown part" }
    const document = await loadDocument(input.documentId)
    if (!document) return { ok: false, error: "That document no longer exists" }
    try {
        return await assist({
            profile: await loadProfile(),
            posting: document.posting,
            target: input.target as AssistTarget,
            current: Array.isArray(input.current) ? input.current.slice(0, 8).map((b) => b.slice(0, 400)) : input.current.slice(0, 6_000),
            instruction: input.instruction.slice(0, 500),
            roleCompany: input.roleCompany,
        })
    } catch (error) {
        return { ok: false, error: message(error) }
    }
}

export async function reviewAction(
    documentId: string,
    resume: Resume,
    coverLetter: string,
): Promise<{ ok: true; review: ModelReview } | { ok: false; error: string }> {
    await assertOwner()
    const document = await loadDocument(documentId)
    if (!document) return { ok: false, error: "That document no longer exists" }
    try {
        // The unsaved text in the editor is what gets reviewed; the stored
        // document only supplies the posting.
        const review = await reviewDocument({ posting: document.posting, resume, coverLetter: coverLetter.slice(0, 6_000) })
        return { ok: true, review }
    } catch (error) {
        return { ok: false, error: message(error) }
    }
}

// ─── Pause ──────────────────────────────────────────────────────────────────

export async function setPausedAction(paused: boolean): Promise<void> {
    await assertOwner()
    await setPaused(paused)
    revalidatePath(PATH, "layout")
}
