// ============================================================================
// File Path: src/components/v3/playbooks/playbook-route.tsx
// Why: The shared body of /playbooks/[slug] and /fa/playbooks/[slug]: static
//      params, metadata (canonical + hreflang, article Open Graph) and the
//      page, plus the HowTo and BreadcrumbList JSON-LD every playbook carries.
//      The two route files only pass their locale.
//
//      The Open Graph block is spelled out because Next replaces the layout's
//      block wholesale when a page declares one. The image comes from the
//      sibling opengraph-image route.
// ============================================================================

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { SITE_URL, absoluteUrl, localeAlternates } from "@/lib/seo"
import { PLAYBOOKS, getPlaybook, playbookModified } from "@/lib/playbooks"
import { PLAYBOOK_COMPONENTS } from "./registry"

export function playbookStaticParams() {
  return PLAYBOOKS.map((p) => ({ slug: p.slug }))
}

export function playbookMetadata(slug: string, locale: Locale): Metadata {
  const p = getPlaybook(slug)
  if (!p) return {}
  const m = p.copy[locale]
  const url = absoluteUrl(localePath(locale, `/playbooks/${p.slug}`))
  const title = `${m.title} | ${locale === "fa" ? "فرجاد" : "Farjad"}`
  const social = `${m.title} · ${m.tagline}`

  return {
    alternates: localeAlternates(`/playbooks/${p.slug}`, locale),
    title: { absolute: title },
    description: m.summary,
    openGraph: {
      type: "article",
      url,
      siteName: "Farjad",
      title: social,
      description: m.summary,
      publishedTime: p.published,
      modifiedTime: playbookModified(p),
      authors: [`${SITE_URL}/about`],
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? ["en_US"] : ["fa_IR"],
    },
    twitter: { card: "summary_large_image", title: social, description: m.summary },
  }
}

/**
 * HowTo + BreadcrumbList. `steps` are the stage names the page prints, so an
 * answer engine can lift the outline; `tools` are the projects it installs.
 */
export function playbookJsonLd({
  locale,
  slug,
  steps,
  tools,
  citation,
}: {
  locale: Locale
  slug: string
  steps: { name: string; text: string; anchor: string }[]
  tools: string[]
  citation: { label: string; href: string }[]
}) {
  const p = getPlaybook(slug)
  if (!p) return []
  const m = p.copy[locale]
  const url = absoluteUrl(localePath(locale, `/playbooks/${slug}`))

  return [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: m.title,
      description: m.summary,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: p.published,
      dateModified: playbookModified(p),
      inLanguage: locale === "fa" ? "fa-IR" : "en",
      isAccessibleForFree: true,
      author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Farjad Pourmohammad", url: `${SITE_URL}/about` },
      publisher: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Farjad Pourmohammad" },
      tool: tools.map((name) => ({ "@type": "HowToTool", name })),
      step: steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
        url: `${url}#${s.anchor}`,
      })),
      citation: citation.map((c) => ({ "@type": "CreativeWork", name: c.label, url: c.href })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: locale === "fa" ? "خانه" : "Home", item: absoluteUrl(localePath(locale, "/")) },
        { "@type": "ListItem", position: 2, name: locale === "fa" ? "پلی‌بوک‌ها" : "Playbooks", item: absoluteUrl(localePath(locale, "/playbooks")) },
        { "@type": "ListItem", position: 3, name: m.title, item: url },
      ],
    },
  ]
}

export function PlaybookRoute({ slug, locale }: { slug: string; locale: Locale }) {
  const meta = getPlaybook(slug)
  const render = meta && PLAYBOOK_COMPONENTS[meta.slug]
  if (!meta || !render) notFound()
  return render({ locale, meta })
}
