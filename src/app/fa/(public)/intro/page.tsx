// ============================================================================
// File Path: src/app/fa/(public)/intro/page.tsx
// Version: 1.0.0 — 2026-09-26
// Why: A plain-language introduction for Persian speakers in Canada. Persian
//      only, so the canonical carries no hreflang pair. The page itself is
//      components/v3/pages/intro-fa.tsx.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import { IntroFaPage } from "@/components/v3/pages/intro-fa"

export const metadata: Metadata = {
  alternates: canonicalOnly("/fa/intro"),
  title: { absolute: "فرجاد، به زبان ساده | کمک به کسب‌وکار ایرانی‌ها در کانادا" },
  description:
    "ایده دارید یا کسب‌وکاری که گیر کرده؟ فرجاد ۲۲ سال است شرکت می‌سازد و کنار بیش از ۵۰ تیم بوده. به زبان ساده توضیح می‌دهد چه کاری از دستش برمی‌آید و چطور شروع کنید.",
}

export default function IntroFaRoute() {
  return <IntroFaPage />
}
