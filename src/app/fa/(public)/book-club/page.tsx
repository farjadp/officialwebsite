// ============================================================================
// Hardware Source: page.tsx
// Version: 3.0.0 — 2026-09-25
// Why: دورهمی کتاب‌خوانی مشروطه — public page (signup, sessions, books).
//      v3 "Light". The page body lives in components/v3/pages/book-club.tsx;
//      this file fetches the sessions and books and supplies metadata.
// Env / Identity: React Server Component
// ============================================================================

import { canonicalOnly } from "@/lib/seo"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BookClubPage as BookClubView } from "@/components/v3/pages/book-club"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    alternates: canonicalOnly("/fa/book-club"),
    title: "دورهمی کتاب‌خوانی مشروطه | فرجاد",
    description:
        "دورهمی آنلاین کتاب‌خوانی درباره جنبش مشروطه ایران — هر جلسه یک گفت‌وگو، یک کتاب، یک قدم به فهم تاریخ.",
}

export default async function BookClubPage() {
    const now = new Date()
    const [upcomingSessions, pastSessions, books] = await Promise.all([
        prisma.bookClubSession.findMany({
            where: { status: "UPCOMING", sessionDate: { gte: now } },
            orderBy: { sessionDate: "asc" },
        }),
        prisma.bookClubSession.findMany({
            where: { OR: [{ status: "DONE" }, { sessionDate: { lt: now } }], NOT: { status: "CANCELED" } },
            orderBy: { sessionDate: "desc" },
        }),
        prisma.bookClubBook.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    ])

    return <BookClubView nextSession={upcomingSessions[0]} pastSessions={pastSessions} books={books} />
}
