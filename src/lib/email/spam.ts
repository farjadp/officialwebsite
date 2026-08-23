// ============================================================================
// Hardware Source: spam.ts
// Version: 1.0.0 — 2026-08-23
// Why: Deterministic pre-flight deliverability audit (runs before AI review)
// Env / Identity: Shared module
// ============================================================================

import { htmlToText } from "./sanitize"

export interface SpamIssue {
    severity: "critical" | "warning" | "info"
    code: string
    message: string
    fix: string
}

export interface SpamAudit {
    /** 0-100, higher is safer */
    score: number
    issues: SpamIssue[]
    stats: {
        textLength: number
        imageCount: number
        linkCount: number
        textToImageRatio: number
        subjectLength: number
        capsRatio: number
        exclamations: number
    }
}

/**
 * Words that reliably move Bayesian filters. This is deliberately conservative —
 * flagging too much trains the user to ignore the audit.
 */
const TRIGGER_WORDS = [
    "free money", "risk free", "100% free", "act now", "limited time only",
    "click here now", "buy now", "order now", "cash bonus", "no credit check",
    "guaranteed", "winner", "congratulations you", "make money fast",
    "double your", "earn extra cash", "miracle", "no obligation",
    "this is not spam", "increase sales", "lowest price", "urgent",
    "credit card offer", "work from home", "weight loss", "viagra",
]

const SHORTENER_HOSTS = ["bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd", "buff.ly"]

export function auditEmail(input: {
    subject: string
    preheader?: string
    html: string
    text?: string
    fromEmail?: string
    hasUnsubscribe?: boolean
    hasPlainText?: boolean
}): SpamAudit {
    const issues: SpamIssue[] = []
    const body = htmlToText(input.html)
    const imageCount = (input.html.match(/<img\b/gi) || []).length
    const links = input.html.match(/href="(https?:\/\/[^"]+)"/gi) || []
    const linkCount = links.length
    const subject = input.subject || ""

    const letters = subject.replace(/[^a-zA-Z]/g, "")
    const capsRatio = letters.length ? (subject.match(/[A-Z]/g) || []).length / letters.length : 0
    const exclamations = (subject.match(/!/g) || []).length
    const textLength = body.length
    const textToImageRatio = imageCount ? textLength / imageCount : textLength

    // ── Subject line ────────────────────────────────────────────────────────
    if (!subject.trim()) {
        issues.push({
            severity: "critical", code: "no_subject",
            message: "Subject line is empty.",
            fix: "Write a 30-50 character subject that states the value, not the topic.",
        })
    } else if (subject.length > 70) {
        issues.push({
            severity: "warning", code: "subject_long",
            message: `Subject is ${subject.length} characters — mobile clients truncate around 40.`,
            fix: "Front-load the point in the first 40 characters.",
        })
    }
    if (capsRatio > 0.5 && letters.length > 6) {
        issues.push({
            severity: "critical", code: "subject_caps",
            message: "Subject is mostly uppercase — a classic filter trigger.",
            fix: "Use sentence case.",
        })
    }
    if (exclamations > 1) {
        issues.push({
            severity: "warning", code: "subject_exclaim",
            message: "Multiple exclamation marks in the subject.",
            fix: "Keep at most one, ideally none.",
        })
    }
    if (/[\u{1F300}-\u{1FAFF}]/u.test(subject) && subject.match(/[\u{1F300}-\u{1FAFF}]/gu)!.length > 1) {
        issues.push({
            severity: "info", code: "subject_emoji",
            message: "More than one emoji in the subject.",
            fix: "One emoji reads as personality; several read as bulk mail.",
        })
    }

    // ── Preheader ───────────────────────────────────────────────────────────
    if (!input.preheader?.trim()) {
        issues.push({
            severity: "warning", code: "no_preheader",
            message: "No preview text — clients will scrape the first body line instead.",
            fix: "Add 40-90 characters that extend the subject rather than repeat it.",
        })
    }

    // ── Body composition ────────────────────────────────────────────────────
    if (textLength < 120) {
        issues.push({
            severity: "critical", code: "thin_content",
            message: "Very little text content relative to markup.",
            fix: "Filters treat near-empty bodies with images as suspicious. Add real copy.",
        })
    }
    if (imageCount > 0 && textToImageRatio < 200) {
        issues.push({
            severity: "critical", code: "image_heavy",
            message: "Image-heavy email with little text.",
            fix: "Aim for at least 60% text by weight. Never send an image-only email.",
        })
    }
    if (imageCount > 0 && /<img\b(?![^>]*\balt=)/i.test(input.html)) {
        issues.push({
            severity: "warning", code: "missing_alt",
            message: "One or more images have no alt text.",
            fix: "Most clients block images by default — alt text is what the reader sees first.",
        })
    }
    if (linkCount > 15) {
        issues.push({
            severity: "warning", code: "too_many_links",
            message: `${linkCount} links — dense linking correlates with bulk mail.`,
            fix: "Cut to one primary CTA plus a handful of supporting links.",
        })
    }
    if (linkCount === 0) {
        issues.push({
            severity: "info", code: "no_links",
            message: "No links at all.",
            fix: "Without a click target you cannot measure intent.",
        })
    }

    for (const host of SHORTENER_HOSTS) {
        if (input.html.includes(host)) {
            issues.push({
                severity: "critical", code: "url_shortener",
                message: `Uses the shortener ${host}.`,
                fix: "Shorteners share reputation with spammers. Link your own domain.",
            })
            break
        }
    }

    const lowerAll = (subject + " " + (input.preheader ?? "") + " " + body).toLowerCase()
    const hits = TRIGGER_WORDS.filter((w) => lowerAll.includes(w))
    if (hits.length) {
        issues.push({
            severity: hits.length > 2 ? "critical" : "warning",
            code: "trigger_words",
            message: `Spam trigger phrases found: ${hits.slice(0, 5).join(", ")}.`,
            fix: "Rewrite in plain, specific language.",
        })
    }

    if (/\$\d|\d+%\s*off/i.test(subject) && capsRatio > 0.3) {
        issues.push({
            severity: "warning", code: "promo_pattern",
            message: "Price/discount pattern combined with heavy capitalization.",
            fix: "Pick one — a number or emphasis, not both.",
        })
    }

    // ── Compliance and authentication ───────────────────────────────────────
    if (!input.hasUnsubscribe) {
        issues.push({
            severity: "critical", code: "no_unsubscribe",
            message: "No unsubscribe link.",
            fix: "Legally required, and its absence is the fastest route to a complaint.",
        })
    }
    if (input.hasPlainText === false) {
        issues.push({
            severity: "warning", code: "no_plaintext",
            message: "No plain-text alternative part.",
            fix: "HTML-only messages score worse. Always send multipart/alternative.",
        })
    }
    if (input.fromEmail && /@(gmail|yahoo|hotmail|outlook|aol)\./i.test(input.fromEmail)) {
        issues.push({
            severity: "critical", code: "freemail_from",
            message: "Sending from a free mailbox provider address.",
            fix: "DMARC on gmail.com rejects this outright. Send from your own authenticated domain.",
        })
    }

    // ── Score ───────────────────────────────────────────────────────────────
    let score = 100
    for (const issue of issues) {
        if (issue.severity === "critical") score -= 18
        else if (issue.severity === "warning") score -= 7
        else score -= 2
    }
    score = Math.max(0, Math.min(100, score))

    return {
        score,
        issues,
        stats: {
            textLength,
            imageCount,
            linkCount,
            textToImageRatio: Math.round(textToImageRatio),
            subjectLength: subject.length,
            capsRatio: Math.round(capsRatio * 100) / 100,
            exclamations,
        },
    }
}
