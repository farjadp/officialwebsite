// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-20
// Why: Admin — Book Club (sessions, books, members)
// Env / Identity: React Server Component
// ============================================================================

import { prisma } from "@/lib/prisma"
import { BookClubManager } from "@/components/admin/book-club-manager"
import { isCalendarConfigured } from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

export default async function AdminBookClubPage() {
    const [sessions, books, members] = await Promise.all([
        prisma.bookClubSession.findMany({ orderBy: { sessionDate: "desc" } }),
        prisma.bookClubBook.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
        prisma.bookClubMember.findMany({ orderBy: { joinedAt: "desc" } }),
    ])

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Book Club — خوانش مشروطه</h1>
                <p className="text-sm text-slate-500">
                    Manage sessions, Google Calendar invites, session summaries, and books.
                    Public page: <code>/fa/book-club</code>
                </p>
            </div>
            <BookClubManager
                sessions={sessions.map((s) => ({
                    ...s,
                    sessionDate: s.sessionDate.toISOString(),
                }))}
                books={books}
                members={members.map((m) => ({
                    ...m,
                    joinedAt: m.joinedAt.toISOString(),
                }))}
                calendarConfigured={isCalendarConfigured()}
            />
        </div>
    )
}
