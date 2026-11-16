// ============================================================================
// File: src/lib/case-study-gate.ts
// Role: The pure parts of the email-gated case-study download — which case
//       studies are gated, the request schema, the consent wording, the
//       signed reading link and the per-address resend cooldown.
// Why:  A gated case study is never linked from the page. The visitor gives an
//       address, the site emails a signed link that expires, and the report
//       page refuses anything it did not sign. Keeping this logic free of
//       Prisma, Resend and React lets it be unit-tested on its own.
// Privacy: the address and the consent record (exact wording, time, locale)
//       are stored as a Lead. Marketing mail is a SEPARATE, unticked opt-in;
//       without it the address is used only to deliver the document.
// ============================================================================

import { createHmac, timingSafeEqual } from "node:crypto"
import { z } from "zod"
import { CONSENT_TEXT, CONSENT_VERSION, HONEYPOT_FIELD } from "./case-study-consent"

export { CONSENT_TEXT, CONSENT_VERSION, HONEYPOT_FIELD }

export type GateLocale = "en" | "fa"

/** Every gated case study. The slug is also the Lead's toolId suffix. */
export const GATED_CASE_STUDIES = {
    belink: {
        title: {
            en: "Mapping Iran's startup ecosystem — the Belink data system",
            fa: "نقشه‌ی اکوسیستم استارتاپی ایران — سامانه‌ی داده‌ی بلینک",
        },
        /** Path of the public page that carries the form. */
        pagePath: "/portfolio/belink",
        /** Path of the report the signed link opens. */
        reportPath: "/portfolio/belink/report",
        /**
         * The full dataset, contacts masked, in a PRIVATE Vercel Blob (anonymous
         * fetch → 403). Served only by /api/case-study/download with a valid link.
         * Built outside the repo; the raw data never enters git.
         */
        dataFile: {
            blobPath: "case-studies/belink/belink-ecosystem-2026-B5JTjeK0UpPUhMh8JfEOjQe9poOa7b.xlsx",
            filename: "belink-ecosystem-2026.xlsx",
            sizeLabel: "1.3 MB",
            rows: 13_636,
        },
    },
} as const

export type GatedSlug = keyof typeof GATED_CASE_STUDIES

export function isGatedSlug(value: unknown): value is GatedSlug {
    return typeof value === "string" && Object.prototype.hasOwnProperty.call(GATED_CASE_STUDIES, value)
}

/** The download URL for a signed link token. */
export function downloadPath(token: string) {
    return `/api/case-study/download?t=${encodeURIComponent(token)}`
}

export const leadToolId = (slug: GatedSlug) => `case-study:${slug}`

/** How long an emailed reading link stays valid. */
export const LINK_TTL_MS = 30 * 24 * 60 * 60 * 1000

/** One address gets at most this many deliveries in a rolling day… */
export const MAX_SENDS_PER_DAY = 3
/** …and never two within this gap (double clicks, impatient retries). */
export const RESEND_GAP_MS = 2 * 60 * 1000

export function requestSchema(locale: GateLocale) {
    const msg = {
        email: locale === "fa" ? "یک نشانی ایمیل درست وارد کنید." : "Enter a valid email address.",
        consent: locale === "fa" ? "برای ارسال، این گزینه لازم است." : "We need this to send it to you.",
    }
    return z.object({
        slug: z.string().refine(isGatedSlug),
        email: z
            .string()
            .trim()
            .toLowerCase()
            .max(254, msg.email)
            .email(msg.email),
        name: z.string().trim().max(120).optional().default(""),
        consent: z.literal(true, { message: msg.consent }),
        marketingOptIn: z.boolean().optional().default(false),
        locale: z.enum(["en", "fa"]),
    })
}

export type GateRequest = z.infer<ReturnType<typeof requestSchema>>

// ----------------------------------------------------------------------------
// Signed reading link
// ----------------------------------------------------------------------------

/** Derive a purpose-bound key so this token can never double as anything else. */
function key(secret: string) {
    return createHmac("sha256", secret).update("case-study-link/v1").digest()
}

function b64url(buf: Buffer | string) {
    return Buffer.from(buf).toString("base64url")
}

function sign(payload: string, secret: string) {
    return createHmac("sha256", key(secret)).update(payload).digest("base64url")
}

export type LinkClaims = { slug: GatedSlug; leadId: string; exp: number }

/** `<payload>.<signature>`, both base64url. Payload is slug|leadId|exp. */
export function signLink(claims: LinkClaims, secret: string): string {
    if (!secret) throw new Error("Missing signing secret")
    const payload = b64url(`${claims.slug}|${claims.leadId}|${claims.exp}`)
    return `${payload}.${sign(payload, secret)}`
}

export type VerifyResult =
    | { ok: true; claims: LinkClaims }
    | { ok: false; reason: "malformed" | "bad-signature" | "expired" | "wrong-study" }

export function verifyLink(token: string | undefined | null, expectedSlug: GatedSlug, secret: string, now = Date.now()): VerifyResult {
    if (!token || !secret || token.length > 512) return { ok: false, reason: "malformed" }
    const parts = token.split(".")
    if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, reason: "malformed" }
    const [payload, sig] = parts

    const expected = Buffer.from(sign(payload, secret))
    const given = Buffer.from(sig)
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
        return { ok: false, reason: "bad-signature" }
    }

    const fields = Buffer.from(payload, "base64url").toString("utf8").split("|")
    if (fields.length !== 3) return { ok: false, reason: "malformed" }
    const [slug, leadId, expRaw] = fields
    const exp = Number(expRaw)
    if (!isGatedSlug(slug) || !leadId || !Number.isFinite(exp)) return { ok: false, reason: "malformed" }
    if (slug !== expectedSlug) return { ok: false, reason: "wrong-study" }
    if (now > exp) return { ok: false, reason: "expired" }
    return { ok: true, claims: { slug, leadId, exp } }
}

// ----------------------------------------------------------------------------
// Resend cooldown
// ----------------------------------------------------------------------------

/**
 * Whether another delivery to the same address is allowed now, given the
 * timestamps (ms) of earlier deliveries. Callers always answer the visitor
 * with the same success message, so this never reveals who asked before.
 */
export function canSendAgain(previousSends: number[], now = Date.now()): boolean {
    const recent = previousSends.filter((t) => now - t < 24 * 60 * 60 * 1000)
    if (recent.length >= MAX_SENDS_PER_DAY) return false
    if (recent.some((t) => now - t < RESEND_GAP_MS)) return false
    return true
}

/** Read the send log out of a Lead's `answers` JSON, tolerating junk. */
export function sendsFromAnswers(answers: unknown): number[] {
    if (!answers || typeof answers !== "object") return []
    const sends = (answers as { sends?: unknown }).sends
    if (!Array.isArray(sends)) return []
    return sends
        .map((s) => (typeof s === "string" ? Date.parse(s) : typeof s === "number" ? s : NaN))
        .filter((n) => Number.isFinite(n))
}

/** The secret the links are signed with. Server only. */
export function linkSecret(): string {
    return process.env.CASE_STUDY_LINK_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || ""
}
