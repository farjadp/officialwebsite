// ============================================================================
// Hardware Source: brief.ts
// Version: 1.0.0 — 2026-09-25
// Why: The step that decides whether anything downstream is worth paying for.
//      A trend handed straight to a writer produces the generic article about
//      the trend; the brief's job is to find the one argument Farjad can make
//      about it that nobody else is making, file it under a real category,
//      and stop the job outright if the blog already has that article.
// Env / Identity: Server only. One model call (agent "brief"), plus reads of
//      signals, reference sources, categories and existing posts.
// ============================================================================

import type { ContentJob } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import type { Handler } from "./engine"
import type { Outcome } from "./states"
import { complete, ProviderBadOutput } from "./provider"
import { FACTS, VOICE, factsForPrompt } from "./brand"
import { loadTaxonomy, resolveCategory, taxonomyForPrompt } from "./taxonomy"
import { findNearDuplicate } from "./duplicates"
import { referenceText } from "./sources"
import { readNumber } from "./settings"

// ─── The contract ───────────────────────────────────────────────────────────
// No .optional(), .min() or .max(): OpenAI's strict structured output rejects
// them. Absence is `.nullable()`, and counts are enforced in code below.

export const BriefSchema = z.object({
    workingTitle: z.string().describe("A specific, arguable headline. Not a question, not a listicle."),
    angle: z.string().describe("The one claim this article makes, in two or three sentences — something a reasonable reader could disagree with."),
    whyNow: z.string().describe("Which of the supplied signals make this timely this week, named."),
    reader: z.string().describe("Who this is for, and what they will do differently after reading it."),
    categoryName: z.string().describe("Exactly one top-level category name from the supplied tree."),
    subcategoryName: z.string().nullable().describe("Exactly one child of that category, or null only if it has none."),
    primaryKeywordEn: z.string().describe("The English search phrase a founder would actually type."),
    primaryKeywordFa: z.string().describe("The Persian search phrase a Persian-speaking founder would actually type. NOT a literal translation of the English keyword."),
    mustCover: z.array(z.string()).describe("Three to six points the article must make."),
    mustAvoid: z.array(z.string()).describe("Claims the verified facts cannot support, and ways this could slide into restating the source."),
    faLocalisation: z.string().describe("How the Persian article should differ: examples, context and references that land for a Persian-speaking founder in Iran or the diaspora."),
    sourceUrls: z.array(z.string()).describe("The URLs of the signals this brief actually draws on."),
})

export type Brief = z.infer<typeof BriefSchema>

/** What is stored on the job: the model's brief plus what code decided about it. */
export type StoredBrief = Brief & {
    categoryId: string
    subcategoryId: string | null
    model: string
}

const MIN_POINTS = 3
const MAX_POINTS = 6
const MAX_REFERENCES = 3
const REFERENCE_CHARS = 4_000
const RECENT_TITLES = 40

// ─── Prompt ─────────────────────────────────────────────────────────────────

const SYSTEM = `
You are the editor-in-chief of farjadp.info. You do not write articles. You decide
which single argument is worth one, and you hand the writer a brief precise enough
that the article cannot come out generic.

${VOICE}

The only facts you may assert about Farjad (anything else about his life is invented):
${factsForPrompt()}

How to choose:
- One argument, never a roundup. "Five things about X" is a failed brief.
- The angle must be a claim someone could disagree with. "AI is changing startups" is
  not an angle; "most founders adding AI agents are automating a process they never
  understood" is.
- The signals are prompts for a point of view, not content to summarise. An article
  that restates its source is worse than no article.
- Tie the argument to Farjad's experience only through the facts above. When a topic
  has no honest link to them, take a mentor's vantage point instead — never invent a
  story, a client or a number to create one.
- Choose a topic the blog has not already covered; the recent titles are listed.
- The Persian keyword is how a Persian-speaking founder would search, not a translation.
`.trim()

type SignalRow = { title: string; url: string; summary: string | null; source: { label: string } }

function describeSignals(signals: SignalRow[]): string {
    return signals
        .map(
            (signal, i) =>
                `[${i + 1}] ${signal.title}\n    source: ${signal.source.label}\n    url: ${signal.url}` +
                (signal.summary ? `\n    summary: ${signal.summary.slice(0, 500)}` : ""),
        )
        .join("\n\n")
}

// ─── Inputs ─────────────────────────────────────────────────────────────────

async function loadSignals(job: ContentJob): Promise<SignalRow[]> {
    const rows = await prisma.contentSignal.findMany({
        where: { id: { in: job.signalIds } },
        select: { title: true, url: true, summary: true, source: { select: { label: true } } },
    })
    if (rows.length === 0) throw new Error(`Job ${job.id} has no signals left to brief from`)
    return rows
}

/**
 * Up to three reference documents Farjad has added, as excerpts.
 * A reference that fails to load is noted and skipped — it is context, not a
 * requirement, and must never be the reason a job stalls.
 */
async function loadReferences(note: (text: string) => Promise<void>): Promise<string> {
    const sources = await prisma.contentSource.findMany({
        where: { enabled: true, isReference: true },
        orderBy: { weight: "desc" },
        take: MAX_REFERENCES,
    })
    const parts: string[] = []
    for (const source of sources) {
        try {
            const body = await referenceText(source)
            if (body) parts.push(`## ${source.label}\n${body.slice(0, REFERENCE_CHARS)}`)
        } catch (error) {
            await note(`reference "${source.label}" skipped: ${(error as Error).message}`)
        }
    }
    return parts.join("\n\n")
}

// ─── The handler ────────────────────────────────────────────────────────────

/** SCOUTED → BRIEFED, or → FAILED when the blog already has this article. */
export const briefHandler: Handler = async (job, ctx): Promise<Outcome> => {
    const note = (text: string) => ctx.trace({ agent: "brief", note: text })

    const [signals, tree, recent, references] = await Promise.all([
        loadSignals(job),
        loadTaxonomy(),
        prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            take: RECENT_TITLES,
            select: { title: true },
        }),
        loadReferences(note),
    ])

    const user = [
        `# Signals this week\n${describeSignals(signals)}`,
        references ? `# Farjad's reference material\n${references}` : "",
        `# Categories — choose from these names exactly\n${taxonomyForPrompt(tree)}`,
        `# Recent titles already on the blog — do not repeat them\n${recent.map((post) => `- ${post.title}`).join("\n")}`,
    ]
        .filter(Boolean)
        .join("\n\n")

    const call = await complete({
        agent: "brief",
        system: SYSTEM,
        user,
        schema: BriefSchema,
        schemaName: "article_brief",
        maxTokens: 4_000,
        settings: ctx.settings,
    })
    await ctx.charge({ agent: "brief", ...call }, `brief: "${call.data.workingTitle}"`)

    const brief = call.data

    // A category that is not a real row is a model error worth a retry, not a
    // post that silently loses its category — the old writer's bug.
    const category = resolveCategory(tree, brief.categoryName, brief.subcategoryName ?? undefined)
    if (!category) {
        throw new ProviderBadOutput(
            "brief",
            call.model,
            `category "${brief.categoryName}" / "${brief.subcategoryName}" is not in the Category table`,
        )
    }

    if (brief.mustCover.length < MIN_POINTS || brief.mustCover.length > MAX_POINTS) {
        throw new ProviderBadOutput(
            "brief",
            call.model,
            `mustCover has ${brief.mustCover.length} points; expected ${MIN_POINTS}–${MAX_POINTS}`,
        )
    }

    const duplicate = await findNearDuplicate(
        { title: brief.workingTitle, angle: brief.angle },
        readNumber(ctx.settings, "content.duplicate.threshold"),
    )
    if (duplicate) {
        await note(
            `duplicate of "${duplicate.title}" (/blog/${duplicate.slug}) — ` +
                `${duplicate.method} similarity ${duplicate.score.toFixed(2)}; stopping before any writing`,
        )
        return { kind: "duplicate" }
    }

    const stored: StoredBrief = {
        ...brief,
        categoryId: category.categoryId,
        subcategoryId: category.subcategoryId ?? null,
        model: call.model,
    }
    await prisma.contentJob.update({ where: { id: job.id }, data: { brief: stored as never } })

    return { kind: "ok" }
}

/** Exposed for the admin page, which shows what the brief was allowed to assert. */
export const BRIEF_FACTS = FACTS
