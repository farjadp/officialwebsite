// ============================================================================
// File Path: src/app/fa/(public)/page.tsx
// Version: 4.0.0 — 2026-09-25
// Why: The Persian home, v3 "Light". Same component as the English home,
//      so structure and motion stay identical across locales; the words
//      live in components/home/v3/copy.ts. No writing section: the
//      Persian blog is closed (see the Notion page, SEO batch 3).
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { HomeV3 } from "@/components/home/v3/home-v3"

export const metadata: Metadata = {
  alternates: localeAlternates("/", "fa"),
  title: "فرجاد | استراتژیست هوش مصنوعی، منتور استارتاپ و کوچ کسب‌وکار",
  description:
    "استراتژی هوش مصنوعی که ارزش واقعی می‌سازد، منتورشیپ استارتاپ از ایده تا اولین مشتری، و کوچینگ آرام و رک برای بنیان‌گذاران. ۲۲+ سال ساختن شرکت در ایران و کانادا.",
}

export default function PersianHomePage() {
  return <HomeV3 locale="fa" />
}
