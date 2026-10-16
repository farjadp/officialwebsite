// ============================================================================
// File Path: src/app/(public)/playbooks/page.tsx
// Why: The playbooks index. The page is components/v3/playbooks/playbooks-index.tsx,
//      shared by both locales; this file only supplies metadata, Open Graph
//      spelled out so it does not inherit the home page's.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { absoluteUrl, localeAlternates } from "@/lib/seo"
import { PlaybooksIndex } from "@/components/v3/playbooks/playbooks-index"

const TITLE = "Playbooks: done it myself, here is how | Farjad"
const DESCRIPTION =
  "Step-by-step playbooks by Farjad on AI workflows for founders and creators. Every command is tested and every price checked, with the date it was checked."

export const metadata: Metadata = {
  alternates: localeAlternates("/playbooks", "en"),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: absoluteUrl("/playbooks"),
    siteName: "Farjad",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["fa_IR"],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

export default function PlaybooksPage() {
  return <PlaybooksIndex locale="en" />
}
