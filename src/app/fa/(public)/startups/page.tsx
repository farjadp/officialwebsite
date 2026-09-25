// ============================================================================
// File Path: src/app/fa/(public)/startups/page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: v3 "Light". The page lives in components/v3/pages/startups.tsx,
//      shared by both locales; this file supplies metadata and the query.
//      MentoredStartup has no locale column, so the cards show the same
//      database text as the English page.
// Env / Identity: React Server Component
// ============================================================================

import { localeAlternates } from "@/lib/seo"
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma"
import { StartupsIndex } from "@/components/v3/pages/startups"

export const metadata: Metadata = {
    alternates: localeAlternates("/startups", "fa"),
    title: "استارتاپ‌های منتورشده",
    description: "کارنامه‌ای از بیش از ۲۵ استارتاپی که به آن‌ها منتورشیپ، مشاوره و کمک به رشد داده‌ام.",
};

// --- DATA: NOW FETCHED DYNAMICALLY FROM DATABASE ---
export default async function MentoredStartupsPage() {
    const MENTORED_STARTUPS = await prisma.mentoredStartup.findMany({
        orderBy: { order: 'asc' }
    });

    return <StartupsIndex locale="fa" startups={MENTORED_STARTUPS} />
}
