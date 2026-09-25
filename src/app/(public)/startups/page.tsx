// ============================================================================
// File Path: src/app/(public)/startups/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/startups.tsx,
//      shared by both locales; this file supplies metadata and the query.
// Env / Identity: React Server Component
// ============================================================================

import { localeAlternates } from "@/lib/seo"
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma"
import { StartupsIndex } from "@/components/v3/pages/startups"

export const metadata: Metadata = {
    alternates: localeAlternates("/startups", "en"),
    title: "Mentored Startups",
    description: "A portfolio of the 25+ startups I have mentored, advised, and helped scale.",
};

// --- DATA: NOW FETCHED DYNAMICALLY FROM DATABASE ---
export default async function MentoredStartupsPage() {
    const MENTORED_STARTUPS = await prisma.mentoredStartup.findMany({
        orderBy: { order: 'asc' }
    });

    return <StartupsIndex locale="en" startups={MENTORED_STARTUPS} />
}
