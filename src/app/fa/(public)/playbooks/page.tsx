// ============================================================================
// File Path: src/app/fa/(public)/playbooks/page.tsx
// Why: The playbooks index. The page is components/v3/playbooks/playbooks-index.tsx,
//      shared by both locales; this file only supplies metadata, Open Graph
//      spelled out so it does not inherit the home page's.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { absoluteUrl, localeAlternates } from "@/lib/seo"
import { PlaybooksIndex } from "@/components/v3/playbooks/playbooks-index"

const TITLE = "پلی‌بوک‌ها: راهی که خودم رفتم، قدم‌به‌قدم | فرجاد"
const DESCRIPTION =
  "راهنماهای قدم‌به‌قدم فرجاد درباره‌ی گردش کار هوش مصنوعی برای بنیان‌گذاران و تولیدکننده‌های محتوا. هر دستور آزموده شده و هر قیمت با تاریخ بررسی آمده است."

export const metadata: Metadata = {
  alternates: localeAlternates("/playbooks", "fa"),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: absoluteUrl("/fa/playbooks"),
    siteName: "Farjad",
    title: TITLE,
    description: DESCRIPTION,
    locale: "fa_IR",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

export default function PlaybooksPage() {
  return <PlaybooksIndex locale="fa" />
}
