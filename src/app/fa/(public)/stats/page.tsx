// ============================================================================
// File Path: src/app/fa/(public)/stats/page.tsx
// Version: 4.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/stats.tsx, shared
//      by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { StatsPage } from "@/components/v3/pages/stats"

export const metadata: Metadata = {
    alternates: localeAlternates("/stats", "fa"),
    title: "آمار سایت | چه چیزی خوانده می‌شود و چه چیزی به کار می‌رود",
    description:
        "اعداد باز این سایت: کدام مقاله‌ها خوانده می‌شوند، کدام ابزارها تا آخر پیش می‌روند، و این‌ها چه می‌گویند.",
}

export default function StatisticsPage() {
    return <StatsPage locale="fa" />
}
