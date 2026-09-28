// ============================================================================
// File Path: src/app/fa/(public)/reports/page.tsx
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

const TITLE = "گزارش‌ها: عددهایی که چک کردم، بعد به تصویر کشیدم | فرجاد"
const DESCRIPTION =
  "گزارش‌های کوتاه و مستند فرجاد درباره‌ی هوش مصنوعی، استارتاپ و اقتصاد، با نمودارهای تعاملی."

export const metadata: Metadata = {
  alternates: localeAlternates("/reports", "fa"),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: absoluteUrl("/fa/reports"),
    siteName: "Farjad",
    title: TITLE,
    description: DESCRIPTION,
    locale: "fa_IR",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

export default function ReportsPage() {
  return <ReportsIndex locale="fa" />
}
