// ============================================================================
// File: src/lib/seo.ts
// Role: Single source of truth for canonical host + per-page canonical/hreflang
// Why: The root layout used to hardcode one absolute canonical, which every
//      page inherited — telling search engines that all 212 sitemap URLs were
//      the homepage. Canonicals must be per-page, so they live here.
// ============================================================================

import type { Metadata } from "next"

/**
 * The canonical origin. Production serves the site on www — the bare host
 * answers 307 → www — so every canonical, sitemap entry and hreflang target
 * must carry the www or it points at a redirect.
 */
export const SITE_URL = "https://www.farjadp.info"

/** Normalise "" | "/" | "about" | "/about" into "" | "/about". */
function normalizePath(path: string): string {
    const trimmed = path.trim()
    if (!trimmed || trimmed === "/") return ""
    return trimmed.startsWith("/") ? trimmed.replace(/\/+$/, "") : `/${trimmed.replace(/\/+$/, "")}`
}

/** Absolute URL on the canonical origin for an English (default-locale) path. */
export function absoluteUrl(path: string): string {
    return `${SITE_URL}${normalizePath(path)}`
}

/**
 * Canonical + hreflang for a page that exists in both locales.
 *
 * `path` is always the English path ("/tools/trl-assessment"); the Persian
 * twin is the same path under /fa. Pass the locale of the page being rendered
 * so its canonical points at itself, not at its translation.
 */
export function localeAlternates(path: string, locale: "en" | "fa" = "en"): Metadata["alternates"] {
    const clean = normalizePath(path)
    const en = `${SITE_URL}${clean}`
    const fa = `${SITE_URL}/fa${clean}`

    return {
        canonical: locale === "fa" ? fa : en,
        languages: {
            en,
            fa,
            "x-default": en,
        },
    }
}

/** Canonical for a page that exists in one locale only (no hreflang pair). */
export function canonicalOnly(path: string): Metadata["alternates"] {
    return { canonical: absoluteUrl(path) }
}

/**
 * Keep a route out of the index.
 *
 * Used for private surfaces (profile, scorecard, tokenised email views), auth
 * screens, and pages that are still placeholder content. `follow` is kept on so
 * link equity still flows through to the real pages these link to.
 */
export const NOINDEX: Metadata["robots"] = {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
}

/**
 * Routes that must never appear in the sitemap or be crawled. Consumed by both
 * robots.ts and sitemap.ts so the two can never drift apart.
 */
export const DISALLOWED_PATHS = [
    "/admin/",
    "/fa/admin/",
    "/api/",
    "/profile/",
    "/fa/profile/",
    "/scorecard",
    "/fa/scorecard",
    "/e/",          // tokenised per-recipient email views
    "/login",
    "/fa/login",
    "/register",
    "/fa/register",
] as const
