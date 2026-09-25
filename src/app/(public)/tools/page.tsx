// ============================================================================
// File Path: src/app/(public)/tools/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/tools-index.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import { localeAlternates } from "@/lib/seo"
import { ToolsIndex } from "@/components/v3/pages/tools-index"

export const metadata = {
    alternates: localeAlternates("/tools", "en"),
    title: "Free Tools & Frameworks",
    description: "Systems, diagnostics, and tools to help founders build and scale without the hype.",
}

export default function ToolsPage() {
    return <ToolsIndex locale="en" />
}
