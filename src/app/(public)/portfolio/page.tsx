// ============================================================================
// File Path: src/app/(public)/portfolio/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/portfolio.tsx,
//      shared by both locales; this file only supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import { canonicalOnly } from "@/lib/seo"
import type { Metadata } from "next";
import { PortfolioIndex } from "@/components/v3/pages/portfolio";

export const metadata: Metadata = {
    alternates: canonicalOnly("/portfolio"),
  title: "Portfolio | Projects, Startups & Case Studies",
  description: "A curated look at Farjad's projects: startups built, companies advised, and systems designed. Real outcomes, honest about what worked.",
  openGraph: {
    title: "Portfolio | Farjad",
    description: "Startups built, companies advised, and systems designed. Real outcomes.",
    images: ["/images/og-default.png"],
  },
};

export default function PortfolioPage() {
  return <PortfolioIndex locale="en" />;
}
