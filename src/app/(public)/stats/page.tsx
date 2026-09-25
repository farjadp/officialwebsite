// ============================================================================
// File Path: src/app/(public)/stats/page.tsx
// Version: 4.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/stats.tsx, shared
//      by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { StatsPage } from "@/components/v3/pages/stats"

export const metadata: Metadata = {
    alternates: localeAlternates("/stats", "en"),
    title: "Site Stats | What Gets Read and What Gets Used",
    description:
        "Open numbers for this site: which articles get read, which diagnostics get finished, and what that says about what founders actually need.",
}

export default function StatisticsPage() {
    return <StatsPage locale="en" />
}
