// ============================================================================
// Hardware Source: generate.ts
// Version: 1.0.0 — 2026-10-01
// Why: The one place a résumé is actually written: ask the model, check the
//      draft, send it back once if it invented a figure, and keep the result.
// Env / Identity: Server only. One or two model calls and one insert.
// ============================================================================

import { prisma } from "@/lib/prisma"
import { complete } from "@/lib/content/provider"
import {
    assemble,
    buildDocumentPrompt,
    DOCUMENT_SYSTEM,
    DraftSchema,
    draftText,
    inventedFigures,
    missingForDocuments,
    sourceText,
} from "./documents"
import { loadProfile } from "./profile"
import { droppedQualifiers } from "./review"

export type GenerateResult = { ok: true; documentId: string } | { ok: false; error: string }

export async function generateDocuments(postingId: string): Promise<GenerateResult> {
    const profile = await loadProfile()
    const missing = missingForDocuments(profile)
    if (missing.length) return { ok: false, error: `The profile needs ${missing.join(", ")} first` }

    const posting = await prisma.jobPosting.findUnique({
        where: { id: postingId },
        select: { id: true, title: true, company: true, location: true, remote: true, description: true },
    })
    if (!posting) return { ok: false, error: "That posting no longer exists" }

    const source = sourceText(profile)
    const prompt = buildDocumentPrompt(profile, posting)
    let costCents = 0

    let feedback = ""
    for (let attempt = 0; attempt < 2; attempt++) {
        const result = await complete({
            agent: "jobs.resume",
            system: DOCUMENT_SYSTEM,
            user: prompt + feedback,
            schema: DraftSchema,
            schemaName: "tailored_resume",
            maxTokens: 4_000,
        })
        costCents += result.costCents

        const text = draftText(result.data)
        const invented = inventedFigures(text, source)
        if (invented.length) {
            feedback = `\n\nYour previous draft used figures that are not in <candidate>: ${invented.join(", ")}. Rewrite it without them.`
            continue
        }
        const dropped = droppedQualifiers(text, source)
        if (dropped.length && attempt === 0) {
            feedback = `\n\nYour previous draft stated these figures without the qualifier <candidate> gives them ("nearly", "more than"…): ${dropped.join(", ")}. Keep the qualifiers.`
            continue
        }

        const documents = assemble(profile, result.data)
        if (dropped.length) documents.notes.push(`Check the wording around ${dropped.join(", ")}: the profile qualifies these figures`)
        const saved = await prisma.jobDocument.create({
            data: {
                postingId: posting.id,
                resume: documents.resume,
                coverLetter: documents.coverLetter,
                notes: documents.notes,
                model: result.model,
                costCents,
            },
        })
        return { ok: true, documentId: saved.id }
    }

    return {
        ok: false,
        error: "The model invented figures twice and nothing was saved. Try again, or add the figure to your career history if it is real.",
    }
}
