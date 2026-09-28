// ============================================================================
// File Path: src/components/v3/reports/report-route.tsx
// Why: The shared body of /reports/[slug] and /fa/reports/[slug]: static
//      params, metadata (canonical + hreflang, article Open Graph) and the
//      page, plus the Report and BreadcrumbList JSON-LD every report carries.
//      The two route files only pass their locale.
//
//      The Open Graph block is spelled out because Next replaces the layout's
//      block wholesale when a page declares one — inheriting nothing. The
//      image itself comes from the sibling opengraph-image route.
// ============================================================================

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { SITE_URL, absoluteUrl, localeAlternates } from "@/lib/seo"
import { REPORTS, getReport, reportModified } from "@/lib/reports"
import { REPORT_COMPONENTS } from "./registry"

export function reportStaticParams() {
  return REPORTS.map((r) => ({ slug: r.slug }))
}

export function reportMetadata(slug: string, locale: Locale): Metadata {
  const r = getReport(slug)
  if (!r) return {}
  const m = r.copy[locale]
  const url = absoluteUrl(localePath(locale, `/reports/${r.slug}`))
  // The tagline belongs in the share card, not the browser tab: with it the
  // <title> runs past 60 characters and is cut off in results.
  const title = `${m.title} | ${locale === "fa" ? "فرجاد" : "Farjad"}`
  const social = `${m.title} · ${m.tagline}`

  return {
    alternates: localeAlternates(`/reports/${r.slug}`, locale),
    title: { absolute: title },
    description: m.summary,
    openGraph: {
      type: "article",
      url,
      siteName: "Farjad",
      title: social,
      description: m.summary,
      publishedTime: r.published,
      modifiedTime: reportModified(r),
      authors: [`${SITE_URL}/about`],
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
    },
    twitter: { card: "summary_large_image", title: social, description: m.summary },
  }
}

/**
 * Report + BreadcrumbList, as one array. `citation` carries the same sources
 * the page prints, so an answer engine quoting the report can follow them.
 */
export function reportJsonLd({
  locale,
  slug,
  mentions,
  citation,
  about,
}: {
  locale: Locale
  slug: string
  mentions: string[]
  citation: { label: string; href: string }[]
  about: string[]
}) {
  const r = getReport(slug)
  if (!r) return []
  const m = r.copy[locale]
  const url = absoluteUrl(localePath(locale, `/reports/${slug}`))

  return [
    {
      "@context": "https://schema.org",
      "@type": "Report",
      headline: `${m.title} · ${m.tagline}`,
      description: m.summary,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: r.published,
      dateModified: reportModified(r),
      temporalCoverage: r.dataAsOf,
      inLanguage: locale === "fa" ? "fa-IR" : "en",
      isAccessibleForFree: true,
      author: {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Farjad Pourmohammad",
        url: `${SITE_URL}/about`,
      },
      publisher: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Farjad Pourmohammad" },
      about: about.map((name) => ({ "@type": "Thing", name })),
      mentions: mentions.map((name) => ({ "@type": "Corporation", name })),
      citation: citation.map((c) => ({ "@type": "CreativeWork", name: c.label, url: c.href })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "fa" ? "خانه" : "Home",
          item: absoluteUrl(localePath(locale, "/")),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "fa" ? "گزارش‌ها" : "Reports",
          item: absoluteUrl(localePath(locale, "/reports")),
        },
        { "@type": "ListItem", position: 3, name: m.title, item: url },
      ],
    },
  ]
}

export function ReportRoute({ slug, locale }: { slug: string; locale: Locale }) {
  const meta = getReport(slug)
  const render = meta && REPORT_COMPONENTS[meta.slug]
  if (!meta || !render) notFound()
  return render({ locale, meta })
}
