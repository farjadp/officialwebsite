// ============================================================================
// File Path: src/app/fa/(public)/portfolio/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/portfolio.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { PortfolioIndex } from "@/components/v3/pages/portfolio"

export const metadata: Metadata = {
    alternates: localeAlternates("/portfolio", "fa"),
    title: "نمونه‌کارها | پروژه‌ها، استارتاپ‌ها و مطالعات موردی",
    description:
        "مروری گزیده بر پروژه‌های فرجاد: استارتاپ‌های ساخته‌شده، شرکت‌های مشاوره‌گرفته و سیستم‌های طراحی‌شده.",
}

export default function PortfolioPage() {
    return <PortfolioIndex locale="fa" />
}
