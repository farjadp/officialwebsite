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
  title: "رزرو جلسه استراتژی | مشاوره ۳۰ دقیقه‌ای",
  description:
    "یک جلسه ۳۰ دقیقه‌ای با فرجاد رزرو کنید؛ مسئله اصلی را تشخیص دهید و گام بعدی را تعیین کنید.",
}

export default function Page() {
  return <BookingPage locale="fa" />
}
