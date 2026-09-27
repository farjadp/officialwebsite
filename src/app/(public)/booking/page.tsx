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
  title: "Book a First Conversation | 60-90 Minutes with Farjad",
  description: "A 60-90 minute conversation with Farjad, in English or Farsi: the core problem in your work gets clear and you leave with a plan for the next step. The session fee goes to charity.",
  openGraph: {
    title: "Book a First Conversation | Farjad",
    description: "60-90 minutes to find the core problem and plan the next step. The session fee goes to charity.",
    images: ["/images/og-default.png"],
  },
}

export default function Page() {
  return <BookingPage locale="en" />
}
