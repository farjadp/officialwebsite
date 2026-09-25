// ============================================================================
// File Path: src/app/(public)/about/page.tsx
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
  alternates: localeAlternates("/about", "en"),
  title: "About Farjad | Founder, Mentor, Systems Builder",
  description: "Founder, mentor, and systems builder helping immigrant founders and serious business owners build with clarity in Canada.",
}

export default function AboutPageRoute() {
  return <AboutPage locale="en" />
}
