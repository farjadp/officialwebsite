// ============================================================================
// File Path: src/app/fa/(public)/resume/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/resume.tsx, shared
//      by both locales; this file only supplies metadata. Every entry, date
//      and bullet is the English page's, nothing added.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { ResumePage } from "@/components/v3/pages/resume"

export const metadata: Metadata = {
  alternates: localeAlternates("/resume", "fa"),
  title: "رزومه‌ی فرجاد پورمحمد | استراتژیست و سازنده‌ی سیستم",
  description:
    "رزومه‌ی کامل فرجاد پورمحمد: بنیان‌گذار، مدیر ارشد فنی، منتور استارتاپ، ممیز ارشد ISO 27001 و سازنده‌ی سیستم، با بیش از ۲۲ سال تجربه در ایران و کانادا.",
}

export default function ResumeFaRoute() {
  return <ResumePage locale="fa" />
}
