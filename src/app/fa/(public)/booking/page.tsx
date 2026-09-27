// ============================================================================
// File Path: src/app/fa/(public)/booking/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/booking.tsx, shared
//      by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { BookingPage } from "@/components/v3/pages/booking"

export const metadata: Metadata = {
  alternates: localeAlternates("/booking", "fa"),
  title: "رزرو گفت‌وگوی اول | جلسه‌ی ۶۰ تا ۹۰ دقیقه‌ای با فرجاد",
  description:
    "یک گفت‌وگوی ۶۰ تا ۹۰ دقیقه‌ای با فرجاد، به فارسی: مسئله‌ی اصلی کارتان روشن می‌شود و با برنامه‌ی قدم بعدی بیرون می‌روید. هزینه‌ی جلسه به خیریه می‌رسد.",
}

export default function Page() {
  return <BookingPage locale="fa" />
}
