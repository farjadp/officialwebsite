// ============================================================================
// File Path: src/app/fa/(public)/tools/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". Persian tools hub; the page lives in
//      components/v3/pages/tools-index.tsx, shared with the English hub.
//      Only TRL is a genuinely Persian tool today — the other nine render the
//      shared English component under a Persian title.
// Env / Identity: React Server Component
// ============================================================================

import { localeAlternates } from "@/lib/seo"
import { ToolsIndex } from "@/components/v3/pages/tools-index"

export const metadata = {
    alternates: localeAlternates("/tools", "fa"),
    title: "ابزارها و چارچوب‌های رایگان",
    description: "سیستم‌ها، ابزارهای تشخیصی و چارچوب‌هایی برای اینکه بنیان‌گذاران بدون هیاهو بسازند و رشد کنند.",
}

export default function ToolsFaPage() {
    return <ToolsIndex locale="fa" />
}
