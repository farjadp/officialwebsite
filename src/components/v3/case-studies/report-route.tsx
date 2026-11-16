// ============================================================================
// File: src/components/v3/case-studies/report-route.tsx
// Role: Shared server logic for /portfolio/[slug]/report and its /fa twin.
//       Renders a gated case study only for a valid, unexpired link signed by
//       this site whose lead still exists (deleting the Lead revokes it).
// ============================================================================

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { downloadPath, isGatedSlug, linkSecret, verifyLink } from "@/lib/case-study-gate"
import type { Locale } from "@/components/home/v3/copy"
import { BelinkCaseStudyReport, BelinkLinkExpired } from "./belink/report"

export const reportMetadata: Metadata = {
    title: "Case study",
    // Personal links: never index, never leak the token in a Referer header.
    robots: { index: false, follow: false },
    referrer: "no-referrer",
}

export async function renderGatedReport(slug: string, token: string | undefined, locale: Locale) {
    if (!isGatedSlug(slug)) notFound()

    const result = verifyLink(token, slug, linkSecret())
    let valid = result.ok
    if (result.ok) {
        try {
            const lead = await prisma.lead.findUnique({ where: { id: result.claims.leadId }, select: { id: true } })
            valid = Boolean(lead)
        } catch (err) {
            // A database hiccup should not lock out someone holding a valid signed link.
            console.error("[case-study] lead lookup failed — trusting signature:", err)
        }
    }

    if (!valid) return <BelinkLinkExpired locale={locale} />
    return <BelinkCaseStudyReport locale={locale} downloadHref={downloadPath(token!)} />
}
