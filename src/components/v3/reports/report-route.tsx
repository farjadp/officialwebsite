// ============================================================================
// File Path: src/components/v3/reports/report-route.tsx
// Why: The shared body of /reports/[slug] and /fa/reports/[slug]: static
//      params, metadata (canonical + hreflang, article Open Graph) and the
//      page. The two route files only pass their locale.
// ============================================================================

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "@/lib/nav"
import { localeAlternates } from "@/lib/seo"
import { REPORTS, getReport } from "@/lib/reports"
import { REPORT_COMPONENTS } from "./registry"

export function reportStaticParams() {
  return REPORTS.map((r) => ({ slug: r.slug }))
}

export function reportMetadata(slug: string, locale: Locale): Metadata {
  const r = getReport(slug)
  if (!r) return {}
  const m = r.copy[locale]
  const title = `${m.title} · ${m.tagline}`
  return {
    alternates: localeAlternates(`/reports/${r.slug}`, locale),
    title: { absolute: `${title} | ${locale === "fa" ? "فرجاد" : "Farjad"}` },
    description: m.summary,
    openGraph: {
      type: "article",
      title,
      description: m.summary,
      publishedTime: r.published,
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description: m.summary },
  }
}

export function ReportRoute({ slug, locale }: { slug: string; locale: Locale }) {
  const meta = getReport(slug)
  const render = meta && REPORT_COMPONENTS[meta.slug]
  if (!meta || !render) notFound()
  return render({ locale, meta })
}
