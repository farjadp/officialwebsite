// ============================================================================
// File Path: src/app/fa/(public)/services/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/services-index.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { ServicesIndex, servicesFaqSchema } from "@/components/v3/pages/services-index"

export const metadata: Metadata = {
  alternates: localeAlternates("/services", "fa"),
  title: "خدمات و شریک اجرا",
  description: "مشاوره استراتژیک، اجرای پرتاب صفر تا یک، و طراحی سیستم‌های هوش مصنوعی برای فاندرها و کسب‌وکارهای کوچک و متوسط.",
}

export default function ServicesPage() {
  return (
    <>
      <ServicesIndex locale="fa" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesFaqSchema("fa")) }}
      />
    </>
  )
}
