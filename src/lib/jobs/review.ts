// ============================================================================
// Hardware Source: review.ts
// Version: 1.0.0 — 2026-10-01
// Why: The checks a résumé can get instantly, with no model and no cost, while
//      it is being edited: what an applicant-tracking system needs, the stock
//      phrases that make a recruiter think "a model wrote this", and claims
//      that drifted from the record (a figure that is not in it, or "nearly
//      $5M" turned into "$5M").
//
//      None of this detects AI writing — nothing reliably does. It finds the
//      tells a human reader notices.
// Env / Identity: Pure. Runs in the browser as well as on the server.
// ============================================================================

import { figures } from "./documents"
import type { Resume } from "./documents"

export type Check = { level: "ok" | "warn" | "fail"; label: string; detail?: string }

/** Words and phrases that read as machine-written, or as résumé filler. */
export const AI_TELLS: string[] = [
    "spearheaded", "leveraged", "leveraging", "leverage", "utilized", "utilize", "synergy", "synergies",
    "passionate", "results-driven", "results driven", "detail-oriented", "dynamic", "visionary", "world-class",
    "cutting-edge", "cutting edge", "state-of-the-art", "seamless", "seamlessly", "robust", "holistic",
    "innovative solutions", "proven track record", "track record of", "fast-paced", "thought leader",
    "game-changer", "game changer", "best-in-class", "delve", "tapestry", "pivotal", "paramount", "meticulous",
    "orchestrated", "championed", "fostered", "showcasing", "testament to", "navigate the complexities",
    "in today's", "ever-evolving", "drive impactful", "impactful", "unlock", "empower", "empowering",
    "strategic thinker", "go-getter", "self-starter", "excited to apply", "i am writing to express",
    "align with your", "thrilled",
]

const QUALIFIERS = ["nearly", "almost", "about", "around", "approximately", "roughly", "more than", "over", "up to", "close to", "~"]

export function resumeText(resume: Resume): string {
    return [
        resume.headline,
        resume.summary,
        ...resume.roles.flatMap((role) => [role.title, ...role.bullets]),
        resume.skills.join(", "),
    ].join("\n")
}

/** Each stock phrase found, with how often. Whole words only. */
export function findTells(text: string): { phrase: string; count: number }[] {
    const lower = text.toLowerCase()
    return AI_TELLS.map((phrase) => {
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const count = (lower.match(new RegExp(`(^|[^a-z])${escaped}(?=$|[^a-z])`, "g")) ?? []).length
        return { phrase, count }
    }).filter((hit) => hit.count > 0)
}

/**
 * Figures the record qualifies ("nearly 5", "more than 50") that the text
 * states bare. "$5M" is a different, larger claim than "nearly $5M".
 */
export function droppedQualifiers(written: string, source: string): string[] {
    const qualified = new Set<string>()
    const pattern = new RegExp(`(${QUALIFIERS.map((q) => q.replace(/[~]/g, "\\~")).join("|")})\\s*\\$?(\\d[\\d,]*(\\.\\d+)?)`, "gi")
    for (const match of source.matchAll(pattern)) qualified.add(match[2].replace(/,/g, ""))

    const dropped = new Set<string>()
    for (const match of written.matchAll(/(\S+\s+\S+\s+)?\$?(\d[\d,]*(\.\d+)?)/g)) {
        const figure = match[2].replace(/,/g, "")
        if (!qualified.has(figure)) continue
        const before = (match[1] ?? "").toLowerCase()
        if (!QUALIFIERS.some((q) => before.includes(q))) dropped.add(figure)
    }
    return [...dropped]
}

/** Lower-case words of a keyword, so "Next.js" matches "next.js" and "NextJS" does not falsely match "next". */
function normalise(text: string): string {
    return ` ${text.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").replace(/\.(\s|$)/g, " ")} `
}

export function keywordCoverage(keywords: string[], text: string): { matched: string[]; missing: string[] } {
    const haystack = normalise(text)
    const matched: string[] = []
    const missing: string[] = []
    for (const keyword of keywords) {
        const needle = normalise(keyword).trim()
        if (!needle) continue
        const plural = needle.endsWith("s") ? needle.slice(0, -1) : `${needle}s`
        if (haystack.includes(` ${needle} `) || haystack.includes(` ${plural} `)) matched.push(keyword)
        else missing.push(keyword)
    }
    return { matched, missing }
}

/** Everything that can be said without a model. */
export function instantChecks(resume: Resume, coverLetter: string, source: string): Check[] {
    const checks: Check[] = []
    const body = resumeText(resume)
    const words = body.split(/\s+/).filter(Boolean).length
    const bullets = resume.roles.flatMap((role) => role.bullets)

    checks.push(
        resume.contact.some((part) => /@/.test(part)) && resume.contact.some((part) => /\d{3}/.test(part))
            ? { level: "ok", label: "Email and phone in the header" }
            : { level: "fail", label: "Email or phone missing", detail: "ATS parsers and recruiters both look for them at the top." },
    )
    checks.push({ level: "ok", label: "Single column, standard section headings, real text", detail: "The layout itself is ATS-safe." })

    checks.push(
        words < 250
            ? { level: "warn", label: `Short: ${words} words`, detail: "Under about 250 words reads thin for a senior role." }
            : words > 850
              ? { level: "warn", label: `Long: ${words} words`, detail: "Over about 850 words usually runs past two pages." }
              : { level: "ok", label: `Length: ${words} words` },
    )

    const long = bullets.filter((bullet) => bullet.length > 170)
    if (long.length) checks.push({ level: "warn", label: `${long.length} bullet${long.length === 1 ? "" : "s"} over two lines`, detail: long[0].slice(0, 90) + "…" })

    const firstWords = bullets.map((bullet) => bullet.split(/\s+/)[0]?.toLowerCase()).filter(Boolean)
    const repeated = [...new Set(firstWords.filter((word, i) => firstWords.indexOf(word) !== i && firstWords.filter((w) => w === word).length >= 3))]
    if (repeated.length) checks.push({ level: "warn", label: `Bullets keep opening with: ${repeated.join(", ")}`, detail: "Varied verbs read as written by a person." })

    if (bullets.length >= 6) {
        const lengths = bullets.map((bullet) => bullet.length)
        const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length
        const spread = Math.sqrt(lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / lengths.length)
        if (spread / mean < 0.18) {
            checks.push({ level: "warn", label: "Every bullet is about the same length", detail: "Uniform rhythm is a common sign of generated text." })
        }
    }

    const dashes = (body.match(/—/g) ?? []).length + (coverLetter.match(/—/g) ?? []).length
    if (dashes >= 3) checks.push({ level: "warn", label: `${dashes} em dashes`, detail: "Heavy em-dash use is a frequently noticed AI tell." })

    const tells = findTells(`${body}\n${coverLetter}`)
    checks.push(
        tells.length
            ? { level: "warn", label: `Stock phrases: ${tells.map((t) => (t.count > 1 ? `${t.phrase} ×${t.count}` : t.phrase)).join(", ")}` }
            : { level: "ok", label: "No stock AI phrases found" },
    )

    const all = `${body}\n${coverLetter}`
    const known = new Set(figures(source))
    const invented = [...new Set(figures(all).filter((figure) => !known.has(figure)))]
    if (invented.length) checks.push({ level: "fail", label: `Figures not in your profile: ${invented.join(", ")}`, detail: "Remove them, or add them to the profile if they are real." })

    const dropped = droppedQualifiers(all, source)
    if (dropped.length) {
        checks.push({ level: "fail", label: `Qualifier dropped on: ${dropped.join(", ")}`, detail: "Your profile says “nearly” or “more than” for these. Stated bare, the claim is bigger than the record." })
    }

    const letterWords = coverLetter.split(/\s+/).filter(Boolean).length
    if (letterWords > 320) checks.push({ level: "warn", label: `Cover letter is ${letterWords} words`, detail: "Under 250 gets read." })

    return checks
}
