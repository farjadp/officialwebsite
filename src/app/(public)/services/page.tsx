// ============================================================================
// File Path: src/app/(public)/services/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/services-index.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { ServicesIndex, servicesFaqSchema } from "@/components/v3/pages/services-index"

export const metadata: Metadata = {
  alternates: localeAlternates("/services", "en"),
  title: "Services & Execution Partner",
  description: "Strategic advisory, 0-to-1 launch execution, and AI system design for ambitious founders and SMEs.",
}

export default function ServicesPage() {
  return (
    <>
      <ServicesIndex locale="en" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesFaqSchema("en")) }}
      />
    </>
  )
}
