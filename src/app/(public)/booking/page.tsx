// ============================================================================
// File Path: src/app/(public)/booking/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/booking.tsx, shared
//      by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { BookingPage } from "@/components/v3/pages/booking"

export const metadata: Metadata = {
  alternates: localeAlternates("/booking", "en"),
  title: "Book a Strategy Call | 30-Minute Consultation",
  description: "Book a 30-minute strategy call with Farjad. Diagnose your core problem and decide on next steps. Session fee goes directly to charity.",
  openGraph: {
    title: "Book a Strategy Call | Farjad",
    description: "Diagnose your core problem in 30 minutes. Session fee goes to charity.",
    images: ["/images/og-default.png"],
  },
}

export default function Page() {
  return <BookingPage locale="en" />
}
