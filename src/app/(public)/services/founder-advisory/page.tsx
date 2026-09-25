// ============================================================================
// File Path: src/app/(public)/services/founder-advisory/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/founder-advisory.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import { FounderAdvisory } from "@/components/v3/pages/founder-advisory"

export const metadata: Metadata = {
  alternates: canonicalOnly("/services/founder-advisory"),
  title: "Founder Advisory | Strategic Mentorship for Early-Stage Founders",
  description: "1:1 strategic advisory for early-stage founders. Accountability, decision clarity, and structured thinking to help you build with less chaos.",
  openGraph: {
    title: "Founder Advisory | Farjad",
    description: "1:1 strategic advisory for early-stage founders. Accountability, decision clarity, and structured thinking.",
    images: ["/images/og-default.png"],
  },
}

export default function FounderAdvisoryPage() {
  return <FounderAdvisory locale="en" />
}
