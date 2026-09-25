// ============================================================================
// File Path: src/app/(public)/resume/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/resume.tsx, shared
//      by both locales; this file only supplies metadata. Printed / saved as
//      PDF via ./download-button (print styles in globals.css).
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import { ResumePage } from "@/components/v3/pages/resume"

export const metadata: Metadata = {
  alternates: canonicalOnly("/resume"),
  title: "Resume — Farjad P.D. | Strategy Thinker & Systems Builder",
  description:
    "Full professional resume of Farjad Pour Mohammad — Founder, CTO, Startup Mentor, ISO 27001 Lead Auditor, and Systems Builder with 22+ years of experience across Iran and Canada.",
}

export default function ResumeRoute() {
  return <ResumePage locale="en" />
}
