// ============================================================================
// File Path: src/app/(public)/reports/page.tsx
// Why: The reports index. The page is components/v3/reports/reports-index.tsx,
//      shared by both locales; this file only supplies metadata. The Open
//      Graph block is spelled out because a page that declares one replaces
//      the layout's entirely — left implicit, this page advertised the home
//      page's title, description and URL to every social crawler.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { absoluteUrl, localeAlternates } from "@/lib/seo"
import { ReportsIndex } from "@/components/v3/reports/reports-index"

const TITLE = "Reports: numbers I checked, then drew | Farjad"
const DESCRIPTION =
  "Short data reports on AI, startups and the economy by Farjad. Each claim is checked against named sources and turned into interactive figures."

export const metadata: Metadata = {
  alternates: localeAlternates("/reports", "en"),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: absoluteUrl("/reports"),
    siteName: "Farjad",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["fa_IR"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

export default function ReportsPage() {
  return <ReportsIndex locale="en" />
}
