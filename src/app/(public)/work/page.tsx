// ============================================================================
// File Path: src/app/(public)/work/page.tsx
// Version: 2.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/work.tsx, shared
//      by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import { WorkPage as WorkView } from "@/components/v3/pages/work"

export const metadata: Metadata = {
    alternates: canonicalOnly("/work"),
  title: "Work & Ventures | Active Projects and Past Experiments",
  description: "A transparent look at Farjad's active ventures, past projects, and ongoing experiments. Honest about what worked and what didn't.",
};

export default function WorkPage() {
  return <WorkView locale="en" />
}
