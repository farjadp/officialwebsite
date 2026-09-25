// ============================================================================
// File Path: src/app/fa/(public)/work/page.tsx
// Version: 2.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/work.tsx, shared
//      by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { WorkPage as WorkView } from "@/components/v3/pages/work"

export const metadata: Metadata = {
    alternates: localeAlternates("/work", "fa"),
    title: "کارها و کسب‌وکارها | پروژه‌های فعال و آزمایش‌های گذشته",
    description:
        "نگاهی شفاف به کسب‌وکارهای فعال، پروژه‌های گذشته و آزمایش‌های در جریان؛ صادقانه درباره‌ی آنچه جواب داد و آنچه نداد.",
}

export default function WorkPage() {
  return <WorkView locale="fa" />
}
