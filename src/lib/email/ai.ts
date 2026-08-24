// ============================================================================
// Hardware Source: ai.ts
// Version: 1.0.0 — 2026-08-23
// Why: AI assistance across the campaign lifecycle (brief → copy → audit → learn)
// Env / Identity: Server module
// ============================================================================

import OpenAI from "openai"
import type { Block } from "./blocks"
import { createBlock } from "./blocks"
import { auditEmail, type SpamAudit } from "./spam"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" })
const MODEL = process.env.OPENAI_EMAIL_MODEL || "gpt-4o"

const BRAND_VOICE = `
You write for Farjad — a startup founder and mentor writing to founders,
operators and technical people.

Voice rules:
- Direct. Lead with the point, never with throat-clearing.
- Concrete over abstract: a number, an example, or a name beats an adjective.
- No hype vocabulary: never "revolutionary", "game-changing", "unlock", "supercharge", "dive in".
- Short paragraphs. One idea per paragraph.
- Respect the reader's time; every sentence earns the next one.
- Never fabricate metrics, testimonials, dates, or case studies.
`.trim()

async function complete(system: string, user: string, json = true): Promise<string> {
    const response = await openai.chat.completions.create({
        model: MODEL,
        temperature: 0.7,
        response_format: json ? { type: "json_object" } : undefined,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    })
    return response.choices[0]?.message?.content ?? ""
}

function parseJson<T>(raw: string, fallback: T): T {
    try {
        const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "")
        return JSON.parse(cleaned) as T
    } catch {
        return fallback
    }
}

// ── Subject lines ──────────────────────────────────────────────────────────

export interface SubjectSuggestion {
    subject: string
    preheader: string
    angle: string
    predictedOpenRate: number
    risk: string | null
}

export async function generateSubjects(input: {
    goal: string
    audience: string
    bodySummary?: string
    count?: number
    locale?: string
}): Promise<SubjectSuggestion[]> {
    const raw = await complete(
        `${BRAND_VOICE}

You are an email subject line strategist. Return JSON: {"suggestions":[{"subject","preheader","angle","predictedOpenRate","risk"}]}.

Constraints:
- subject: 30-50 characters, sentence case, no more than one emoji and usually none.
- preheader: 40-90 characters that EXTEND the subject; never repeat it.
- angle: 2-4 words naming the psychological approach (e.g. "curiosity gap", "specific number", "direct benefit").
- predictedOpenRate: your integer estimate 15-60 for a warm B2B founder list.
- risk: a spam-filter or credibility risk if one exists, otherwise null.
- Vary the angles widely. Never produce two variants of the same idea.
- Write in ${input.locale === "fa" ? "Persian (Farsi)" : "English"}.`,
        JSON.stringify({
            goal: input.goal,
            audience: input.audience,
            bodySummary: input.bodySummary?.slice(0, 2000),
            count: input.count ?? 10,
        })
    )

    return parseJson<{ suggestions: SubjectSuggestion[] }>(raw, { suggestions: [] }).suggestions
}

// ── Full campaign draft ────────────────────────────────────────────────────

interface DraftBlockSpec {
    type: string
    text?: string
    html?: string
    level?: number
    label?: string
    href?: string
    alt?: string
    height?: number
}

/** Generates a complete campaign as editor blocks — not as opaque HTML. */
export async function generateCampaign(input: {
    goal: string
    audience: string
    keyPoints?: string
    cta?: string
    ctaUrl?: string
    tone?: string
    locale?: string
    length?: "short" | "medium" | "long"
}): Promise<{ subject: string; preheader: string; blocks: Block[] }> {
    const raw = await complete(
        `${BRAND_VOICE}

Draft a marketing email as a structured block document.
Return JSON: {"subject","preheader","blocks":[...]}.

Allowed block objects:
{"type":"heading","text":"...","level":1|2|3}
{"type":"text","html":"<p>...</p>"}      — only <p> <strong> <em> <a href> <ul> <li> <blockquote>
{"type":"button","label":"...","href":"..."}
{"type":"divider"}
{"type":"spacer","height":24}
{"type":"quote","html":"<p>...</p>"}

Rules:
- Open with the point. No "I hope this email finds you well".
- ${input.length === "short" ? "120-180" : input.length === "long" ? "400-600" : "200-350"} words of body copy total.
- Exactly ONE button. Multiple CTAs split attention and lower clicks.
- Do not write a subscription footer or unsubscribe line — the renderer adds them.
- Write in ${input.locale === "fa" ? "Persian (Farsi)" : "English"}.`,
        JSON.stringify(input)
    )

    const parsed = parseJson<{ subject: string; preheader: string; blocks: DraftBlockSpec[] }>(raw, {
        subject: "",
        preheader: "",
        blocks: [],
    })

    const blocks: Block[] = []
    for (const spec of parsed.blocks ?? []) {
        const block = createBlock((spec.type as Block["type"]) ?? "text")
        Object.assign(block, {
            ...(spec.text != null && "text" in block ? { text: spec.text } : {}),
            ...(spec.html != null && "html" in block ? { html: spec.html } : {}),
            ...(spec.level != null && "level" in block ? { level: spec.level } : {}),
            ...(spec.label != null && "label" in block ? { label: spec.label } : {}),
            ...(spec.href != null && "href" in block ? { href: spec.href || input.ctaUrl || "#" } : {}),
            ...(spec.height != null && "height" in block ? { height: spec.height } : {}),
        })
        blocks.push(block)
    }

    return { subject: parsed.subject ?? "", preheader: parsed.preheader ?? "", blocks }
}

// ── Inline editing ─────────────────────────────────────────────────────────

export type RewriteMode =
    | "shorten" | "expand" | "punchier" | "warmer" | "formal"
    | "simplify" | "fix-grammar" | "translate-fa" | "translate-en"

const REWRITE_INSTRUCTIONS: Record<RewriteMode, string> = {
    shorten: "Cut it to roughly 60% of its length. Remove hedging and filler, keep every fact.",
    expand: "Add one concrete supporting detail or example. Do not pad with adjectives.",
    punchier: "Rewrite with shorter sentences and stronger verbs. Keep the same claims.",
    warmer: "Make it more personal and conversational without becoming informal or cute.",
    formal: "Make it more precise and professional. Remove contractions and slang.",
    simplify: "Rewrite at an 8th-grade reading level. Replace jargon with plain words.",
    "fix-grammar": "Fix grammar, spelling and punctuation only. Change nothing else.",
    "translate-fa": "Translate to natural, fluent Persian (Farsi). Keep proper nouns and URLs as-is.",
    "translate-en": "Translate to natural, fluent English. Keep proper nouns and URLs as-is.",
}

export async function rewriteText(input: {
    html: string
    mode: RewriteMode
    instruction?: string
}): Promise<string> {
    const raw = await complete(
        `${BRAND_VOICE}

Rewrite the supplied HTML fragment. Return JSON: {"html":"..."}.
Task: ${REWRITE_INSTRUCTIONS[input.mode]}
${input.instruction ? `Additional instruction from the author: ${input.instruction}` : ""}

Preserve the HTML structure and tags. Use only <p> <strong> <em> <u> <a href> <ul> <ol> <li> <blockquote> <h2> <h3>.
Never invent facts, numbers, names or links that are not already present.`,
        JSON.stringify({ html: input.html })
    )

    return parseJson<{ html: string }>(raw, { html: input.html }).html || input.html
}

// ── Pre-flight review ──────────────────────────────────────────────────────

export interface DeliverabilityReview {
    audit: SpamAudit
    aiScore: number
    verdict: string
    improvements: { area: string; problem: string; suggestion: string }[]
    rewrittenSubject?: string
}

/**
 * Combines the deterministic audit with a model review. The heuristic catches
 * mechanical faults; the model catches tone and credibility problems it can't see.
 */
export async function reviewDeliverability(input: {
    subject: string
    preheader: string
    html: string
    fromEmail?: string
    hasUnsubscribe?: boolean
    hasPlainText?: boolean
}): Promise<DeliverabilityReview> {
    const audit = auditEmail(input)

    const raw = await complete(
        `You are an email deliverability and conversion reviewer.
Return JSON: {"aiScore":0-100,"verdict":"one sentence","improvements":[{"area","problem","suggestion"}],"rewrittenSubject":"..."}.

Judge on: inbox placement risk, subject/preheader pairing, clarity of the single CTA,
credibility (unsupported claims), and whether a busy reader gets the point in five seconds.
Be specific and terse. At most five improvements. Omit rewrittenSubject if the subject is already strong.`,
        JSON.stringify({
            subject: input.subject,
            preheader: input.preheader,
            body: input.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 6000),
            heuristicIssues: audit.issues,
        })
    )

    const ai = parseJson<Omit<DeliverabilityReview, "audit">>(raw, {
        aiScore: audit.score,
        verdict: "Automated review unavailable.",
        improvements: [],
    })

    return { audit, ...ai }
}

// ── Natural-language segmentation ──────────────────────────────────────────

export async function describeSegment(prompt: string): Promise<Record<string, unknown>> {
    const raw = await complete(
        `Convert an audience description into a segment filter.
Return JSON matching exactly this shape, omitting keys that do not apply:
{"status":["ACTIVE"],"listIds":[],"sources":[],"locales":[],"engagementMin":0,"engagementMax":100,
"openedWithinDays":30,"notOpenedForDays":90,"clickedWithinDays":60,"neverSent":true,"search":"..."}

Only use the keys listed. Never invent keys or ids. If the request names a list by
name rather than id, put that name in "search" and leave listIds empty.`,
        prompt
    )

    return parseJson<Record<string, unknown>>(raw, {})
}

// ── Post-send analysis ─────────────────────────────────────────────────────

export async function analyzeResults(input: {
    campaignName: string
    subject: string
    stats: Record<string, number>
    topLinks: { url: string; clicks: number }[]
    benchmark?: Record<string, number>
}): Promise<{ summary: string; wins: string[]; problems: string[]; nextActions: string[] }> {
    const raw = await complete(
        `You are a growth analyst reviewing one email campaign.
Return JSON: {"summary","wins":[],"problems":[],"nextActions":[]}.

Reference points for a warm B2B founder list: 35-45% open, 2-5% click, under 0.5% bounce,
under 0.08% complaint, under 0.5% unsubscribe. Judge against these, not against vanity targets.
Be blunt about what underperformed. nextActions must be specific and testable — each one a change
that could be made to the next campaign, not general advice.`,
        JSON.stringify(input)
    )

    return parseJson(raw, { summary: "", wins: [], problems: [], nextActions: [] })
}

// ── Automation sequences ───────────────────────────────────────────────────

export async function generateSequence(input: {
    goal: string
    audience: string
    stepCount?: number
    locale?: string
}): Promise<{ name: string; steps: { delayHours: number; subject: string; preheader: string; blocks: Block[] }[] }> {
    const raw = await complete(
        `${BRAND_VOICE}

Design an email automation sequence. Return JSON:
{"name":"...","steps":[{"delayHours":0,"subject":"...","preheader":"...","blocks":[...]}]}

Block objects allowed: {"type":"heading","text","level"}, {"type":"text","html"},
{"type":"button","label","href"}, {"type":"divider"}, {"type":"spacer","height"}.

Rules:
- ${input.stepCount ?? 4} steps. First step delayHours 0; space the rest 48-96 hours apart.
- Each step must stand alone — assume the reader missed the previous ones.
- Each step delivers one specific piece of value BEFORE asking for anything.
- One CTA per step, at most.
- 150-250 words of body copy per step.
- Write in ${input.locale === "fa" ? "Persian (Farsi)" : "English"}.`,
        JSON.stringify(input)
    )

    const parsed = parseJson<{
        name: string
        steps: { delayHours: number; subject: string; preheader: string; blocks: DraftBlockSpec[] }[]
    }>(raw, { name: "", steps: [] })

    return {
        name: parsed.name,
        steps: (parsed.steps ?? []).map((step) => ({
            delayHours: step.delayHours ?? 48,
            subject: step.subject ?? "",
            preheader: step.preheader ?? "",
            blocks: (step.blocks ?? []).map((spec) => {
                const block = createBlock((spec.type as Block["type"]) ?? "text")
                Object.assign(block, {
                    ...(spec.text != null && "text" in block ? { text: spec.text } : {}),
                    ...(spec.html != null && "html" in block ? { html: spec.html } : {}),
                    ...(spec.level != null && "level" in block ? { level: spec.level } : {}),
                    ...(spec.label != null && "label" in block ? { label: spec.label } : {}),
                    ...(spec.href != null && "href" in block ? { href: spec.href } : {}),
                })
                return block
            }),
        })),
    }
}
