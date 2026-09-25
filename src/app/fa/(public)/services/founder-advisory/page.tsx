// ============================================================================
// File Path: src/app/fa/(public)/services/founder-advisory/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/founder-advisory.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import { FounderAdvisory } from "@/components/v3/pages/founder-advisory"

export const metadata: Metadata = {
  alternates: canonicalOnly("/fa/services/founder-advisory"),
  title: "مشاوره استراتژیک و اجرای صفر تا یک",
  description:
    "همراهی با بنیان‌گذاران از ایده‌ی مبهم تا محصولی که در واقعیت دوام می‌آورد: استراتژی، مسیر ورود به بازار و اجرا.",
}

export default function FounderAdvisoryPage() {
  return <FounderAdvisory locale="fa" />
}
