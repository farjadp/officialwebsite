// ============================================================================
// File Path: src/app/fa/(public)/services/startup-visa/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/startup-visa.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { StartupVisa } from "@/components/v3/pages/startup-visa"

export const metadata: Metadata = {
  alternates: localeAlternates("/services/startup-visa", "fa"),
  title: "استراتژی استارتاپ ویزای کانادا",
  description:
    "آماده‌سازی کسب‌وکار برای برنامه‌ی استارتاپ ویزای کانادا: منطق کسب‌وکار، شواهد بازار و روایتی که زیر سؤال دوام می‌آورد.",
}

export default function StartupVisaPage() {
  return <StartupVisa locale="fa" />
}
