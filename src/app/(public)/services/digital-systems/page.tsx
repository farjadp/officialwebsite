// ============================================================================
// File Path: src/app/(public)/services/digital-systems/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/digital-systems.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { DigitalSystems } from "@/components/v3/pages/digital-systems"

export const metadata: Metadata = {
  alternates: localeAlternates("/services/digital-systems", "en"),
  title: "Digital Systems & AI Integration | Replace Manual Chaos",
  description: "Replace manual operations with AI-powered digital systems. CRM, automation, dashboards, and process design for SMEs that want to scale without chaos.",
  openGraph: {
    title: "Digital Systems & AI Integration | Farjad .P",
    description: "Replace manual operations with AI-powered digital systems for SMEs.",
    images: ["/images/og-default.png"],
  },
}

export default function DigitalSystemsPage() {
  return <DigitalSystems locale="en" />
}
