// ============================================================================
// File Path: src/app/(public)/reports/page.tsx
// Why: The reports index. The page is components/v3/reports/reports-index.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { ReportsIndex } from "@/components/v3/reports/reports-index"

export const metadata: Metadata = {
  alternates: localeAlternates("/reports", "en"),
  title: "Reports | Numbers I checked, then drew",
  description: "Short data reports on AI, startups and the economy by Farjad. Each claim is checked against sources and turned into interactive figures.",
}

export default function ReportsPage() {
  return <ReportsIndex locale="en" />
}
