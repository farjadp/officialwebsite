// ============================================================================
// File Path: src/app/(public)/contact/page.tsx
// Version: 4.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/contact.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import { ContactPage } from "@/components/v3/pages/contact"

export const metadata: Metadata = {
  alternates: localeAlternates("/contact", "en"),
  title: "Contact",
  description: "Get in touch for mentorship, consulting, or speaking engagements.",
}

export default function Contact() {
  return <ContactPage locale="en" />
}
