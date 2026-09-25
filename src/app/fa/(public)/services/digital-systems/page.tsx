// ============================================================================
// File Path: src/app/fa/(public)/services/digital-systems/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/digital-systems.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { DigitalSystems } from "@/components/v3/pages/digital-systems"

export const metadata: Metadata = {
  alternates: localeAlternates("/services/digital-systems", "fa"),
  title: "سیستم‌های دیجیتال و هوش مصنوعی سفارشی",
  description:
    "جایگزینی کارهای دستی، داده پراکنده و فرایندهای تکراری با سیستم‌هایی که خودشان کار می‌کنند.",
}

export default function DigitalSystemsPage() {
  return <DigitalSystems locale="fa" />
}
