// ============================================================================
// File Path: src/app/fa/(public)/about/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/about.tsx, shared
//      by both locales; this file only supplies metadata. Education and
//      certifications stay in ./data.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { AboutPage } from "@/components/v3/pages/about"

export const metadata: Metadata = {
  alternates: localeAlternates("/about", "fa"),
  title: "درباره فرجاد | بنیان‌گذار، منتور و معمار سیستم",
  description: "بنیان‌گذار، منتور و معمار سیستم. کمک به بنیان‌گذاران مهاجر و صاحبان کسب‌وکار جدی برای ساختن با وضوح در کانادا.",
}

export default function AboutPageRoute() {
  return <AboutPage locale="fa" />
}
