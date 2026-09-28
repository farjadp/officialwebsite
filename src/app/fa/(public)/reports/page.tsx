// ============================================================================
// File Path: src/app/fa/(public)/reports/page.tsx
// Why: The reports index. The page is components/v3/reports/reports-index.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { ReportsIndex } from "@/components/v3/reports/reports-index"

export const metadata: Metadata = {
  alternates: localeAlternates("/reports", "fa"),
  title: { absolute: "گزارش‌ها | عددهایی که چک کردم، بعد به تصویر کشیدم | فرجاد" },
  description: "گزارش‌های کوتاه و مستند فرجاد درباره‌ی هوش مصنوعی، استارتاپ و اقتصاد، با نمودارهای تعاملی.",
}

export default function ReportsPage() {
  return <ReportsIndex locale="fa" />
}
