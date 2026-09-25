// ============================================================================
// File Path: src/app/(public)/services/startup-visa/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/startup-visa.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { StartupVisa } from "@/components/v3/pages/startup-visa"

export const metadata: Metadata = {
  alternates: localeAlternates("/services/startup-visa", "en"),
  title: "Startup Visa Advisory | Canada Business Immigration",
  description:
    "Strategic advisory for entrepreneurs pursuing Canada's Startup Visa. Build a real, qualifying business — not just a visa application.",
  openGraph: {
    title: "Startup Visa Advisory | Farjad .P",
    description: "Strategic advisory for entrepreneurs pursuing Canada's Startup Visa. Build a real, qualifying business.",
    images: ["/images/og-default.png"],
  },
}

export default function StartupVisaPage() {
  return <StartupVisa locale="en" />
}
