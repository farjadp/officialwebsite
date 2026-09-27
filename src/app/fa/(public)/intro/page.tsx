// ============================================================================
// File Path: src/app/fa/(public)/intro/page.tsx
// Version: 1.0.0 — 2026-09-26
// Why: A plain-language introduction to web design, software and AI
//      automation, for Persian speakers in Canada. Persian
//      only, so the canonical carries no hreflang pair. The page itself is
//      components/v3/pages/intro-fa.tsx.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import { IntroFaPage } from "@/components/v3/pages/intro-fa"

export const metadata: Metadata = {
  alternates: canonicalOnly("/fa/intro"),
  title: { absolute: "فرجاد | طراحی سایت، برنامه‌نویسی و اتوماسیون با هوش مصنوعی، به زبان ساده" },
  description:
    "سایت، نرم‌افزار و اتوماسیون با هوش مصنوعی برای کسب‌وکارهای کوچک و متوسط در کانادا، به زبان ساده و فارسی. ببینید کارهای تکراری شما چطور خودکار می‌شود.",
}

export default function IntroFaRoute() {
  return <IntroFaPage />
}
