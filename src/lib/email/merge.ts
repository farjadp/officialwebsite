// ============================================================================
// Hardware Source: merge.ts
// Version: 1.0.0 — 2026-08-23
// Why: Personalization tokens + per-recipient link tracking rewrite
// Env / Identity: Server module
// ============================================================================

import { escapeHtml } from "./sanitize"

export interface MergeContext {
    firstName?: string | null
    lastName?: string | null
    email: string
    company?: string | null
    attributes?: Record<string, unknown>
    unsubscribeUrl?: string
    preferencesUrl?: string
}

export const MERGE_TAGS = [
    { tag: "{{first_name}}", label: "First name", fallback: "there" },
    { tag: "{{last_name}}", label: "Last name", fallback: "" },
    { tag: "{{full_name}}", label: "Full name", fallback: "there" },
    { tag: "{{email}}", label: "Email", fallback: "" },
    { tag: "{{company}}", label: "Company", fallback: "your company" },
    { tag: "{{unsubscribe_url}}", label: "Unsubscribe link", fallback: "#" },
    { tag: "{{preferences_url}}", label: "Preferences link", fallback: "#" },
    { tag: "{{custom.key}}", label: "Custom attribute", fallback: "" },
] as const

/**
 * Replaces `{{token}}` and `{{token|fallback}}`. Values are HTML-escaped except
 * for URL tokens, which are already safe URLs we generated ourselves.
 */
export function applyMergeTags(input: string, ctx: MergeContext): string {
    if (!input) return ""

    const first = ctx.firstName?.trim() || ""
    const last = ctx.lastName?.trim() || ""

    const values: Record<string, string> = {
        first_name: first,
        last_name: last,
        full_name: [first, last].filter(Boolean).join(" "),
        email: ctx.email,
        company: ctx.company?.trim() || "",
        unsubscribe_url: ctx.unsubscribeUrl || "#",
        preferences_url: ctx.preferencesUrl || "#",
    }

    return input.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*(?:\|\s*([^}]*?)\s*)?\}\}/g, (_m, rawKey, fallback) => {
        const key = String(rawKey)
        let value: string | undefined

        if (key.startsWith("custom.")) {
            const raw = ctx.attributes?.[key.slice(7)]
            value = raw == null ? "" : String(raw)
        } else {
            value = values[key]
        }

        const resolved = value && value.length ? value : (fallback ?? "")
        // URLs must not be entity-escaped or the href breaks
        return key.endsWith("_url") ? resolved : escapeHtml(resolved)
    })
}

/**
 * Rewrites every outbound href through our own click-tracking endpoint. Using our
 * domain rather than a third-party redirector keeps link reputation with us and
 * avoids the shared-shortener blocklists that sink deliverability.
 */
export function rewriteLinksForTracking(
    html: string,
    baseUrl: string,
    campaignId: string,
    recipientId: string
): string {
    return html.replace(/href="([^"]+)"/g, (match, rawUrl) => {
        const url = String(rawUrl)
        // Never rewrite unsubscribe, mailto, anchors or tokens — one-click unsub
        // must resolve directly or Gmail's List-Unsubscribe check fails.
        if (
            !/^https?:\/\//i.test(url) ||
            url.includes("/e/u/") ||
            url.includes("/e/p/") ||
            url.includes("{{")
        ) {
            return match
        }
        const target = `${baseUrl}/e/c/${campaignId}/${recipientId}?u=${encodeURIComponent(url)}`
        return `href="${target}"`
    })
}

/** Extracts unique outbound URLs so we can pre-register them for click reporting. */
export function extractLinks(html: string): string[] {
    const urls = new Set<string>()
    const re = /href="(https?:\/\/[^"]+)"/g
    let m: RegExpExecArray | null
    while ((m = re.exec(html)) !== null) {
        if (!m[1].includes("{{")) urls.add(m[1])
    }
    return [...urls]
}
