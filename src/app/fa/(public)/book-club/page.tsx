// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-20
// Why: دورهمی کتاب‌خوانی مشروطه — public page (signup, sessions, books)
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { BookClubJoinForm } from "@/components/book-club/join-form"
import { BookOpen, CalendarDays, ExternalLink, Video } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "دورهمی کتاب‌خوانی مشروطه | فرجاد",
    description:
        "دورهمی آنلاین کتاب‌خوانی درباره جنبش مشروطه ایران — هر جلسه یک گفت‌وگو، یک کتاب، یک قدم به فهم تاریخ.",
}

function formatFaDate(date: Date): string {
    return new Intl.DateTimeFormat("fa-IR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date)
}

function formatFaTime(date: Date): string {
    return new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Toronto",
    }).format(date)
}

// جداکننده تزئینی الهام‌گرفته از حاشیه نسخه‌های چاپ سنگی دوره قاجار
function Ornament() {
    return (
        <div className="flex items-center justify-center gap-3 py-2 text-[#B08D57]" aria-hidden>
            <span className="h-px w-16 bg-gradient-to-l from-[#B08D57] to-transparent" />
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path
                    d="M14 2 L17 11 L26 14 L17 17 L14 26 L11 17 L2 14 L11 11 Z"
                    fill="currentColor"
                    opacity="0.85"
                />
                <circle cx="14" cy="14" r="3" fill="#7B2D26" />
            </svg>
            <span className="h-px w-16 bg-gradient-to-r from-[#B08D57] to-transparent" />
        </div>
    )
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

    const nextSession = upcomingSessions[0]

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[#F7F0E3] font-sans text-[#2B1B12] selection:bg-[#7B2D26] selection:text-[#F7F0E3]"
        >
            {/* ---------- HERO ---------- */}
            <section className="relative overflow-hidden border-b-4 border-double border-[#B08D57]/40 px-6 pb-20 pt-36">
                {/* بافت کاشی/ترنج محو در پس‌زمینه */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 25% 25%, #7B2D26 2px, transparent 2px), radial-gradient(circle at 75% 75%, #1B4B43 2px, transparent 2px)",
                        backgroundSize: "56px 56px",
                    }}
                />
                <div className="relative mx-auto max-w-4xl space-y-8 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#B08D57]/50 bg-[#FDFAF3] px-5 py-2 text-sm font-medium text-[#7B2D26]">
                        <BookOpen className="h-4 w-4" />
                        دورهمی کتاب‌خوانی — آنلاین و رایگان
                    </div>

                    <h1 className="font-serif text-5xl font-bold leading-[1.2] text-[#2B1B12] md:text-7xl">
                        خوانشِ <span className="text-[#7B2D26]">مشروطه</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-[#5C4A3D] md:text-2xl">
                        صد و اندی سال پیش، مردمی برای «قانون» به پا خاستند.
                        ما دور هم جمع می‌شویم تا آن قصه را — کتاب به کتاب — دوباره بخوانیم و درباره‌اش گفت‌وگو کنیم.
                    </p>

                    <Ornament />

                    {/* فرم ثبت‌نام */}
                    <div className="mx-auto max-w-2xl rounded-3xl border-2 border-[#B08D57]/40 bg-[#FDFAF3] p-8 shadow-xl shadow-[#3E2723]/5 text-right">
                        <h2 className="mb-1 font-serif text-2xl font-bold text-[#2B1B12]">
                            به جمع ما بپیوند
                        </h2>
                        <p className="mb-6 text-[#5C4A3D]">
                            ایمیلت را بگذار تا دعوت جلسه بعدی مستقیم به تقویمت بیاید.
                        </p>
                        <BookClubJoinForm />
                    </div>
                </div>
            </section>

            {/* ---------- جلسه بعدی ---------- */}
            {nextSession && (
                <section className="border-b border-[#B08D57]/20 bg-[#1B4B43] px-6 py-16 text-[#F7F0E3]">
                    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#F7F0E3]/10 px-4 py-1.5 text-sm">
                            <CalendarDays className="h-4 w-4" />
                            جلسه بعدی
                        </div>
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">{nextSession.title}</h2>
                        <p className="text-xl text-[#F7F0E3]/80">
                            {formatFaDate(nextSession.sessionDate)} — ساعت {formatFaTime(nextSession.sessionDate)} (به وقت تورنتو)
                        </p>
                        <p className="flex items-center gap-2 text-[#F7F0E3]/60">
                            <Video className="h-5 w-5" />
                            لینک Google Meet با دعوت‌نامه کلندر برایت ارسال می‌شود.
                        </p>
                    </div>
                </section>
            )}

            {/* ---------- کتاب‌ها ---------- */}
            {books.length > 0 && (
                <section className="px-6 py-20">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-12 text-center">
                            <h2 className="font-serif text-4xl font-bold text-[#2B1B12]">کتاب‌های ما</h2>
                            <Ornament />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    className="group flex gap-5 rounded-2xl border border-[#B08D57]/30 bg-[#FDFAF3] p-6 transition-shadow hover:shadow-lg hover:shadow-[#3E2723]/10"
                                >
                                    {book.coverUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={book.coverUrl}
                                            alt={book.title}
                                            className="h-32 w-24 shrink-0 rounded-lg border border-[#B08D57]/30 object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-32 w-24 shrink-0 items-center justify-center rounded-lg border border-[#B08D57]/30 bg-[#7B2D26]/10">
                                            <BookOpen className="h-8 w-8 text-[#7B2D26]" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <h3 className="font-serif text-xl font-bold text-[#2B1B12]">
                                            {book.title}
                                        </h3>
                                        {book.author && (
                                            <p className="mt-1 text-sm text-[#8D7B6F]">{book.author}</p>
                                        )}
                                        {book.description && (
                                            <p className="mt-2 text-sm leading-relaxed text-[#5C4A3D]">
                                                {book.description}
                                            </p>
                                        )}
                                        {book.link && (
                                            <a
                                                href={book.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-bold text-[#1B4B43] hover:text-[#7B2D26]"
                                            >
                                                دریافت کتاب
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ---------- خلاصه جلسات گذشته ---------- */}
            {pastSessions.length > 0 && (
                <section className="border-t border-[#B08D57]/20 bg-[#FDFAF3] px-6 py-20">
                    <div className="mx-auto max-w-3xl">
                        <div className="mb-12 text-center">
                            <h2 className="font-serif text-4xl font-bold text-[#2B1B12]">
                                آنچه گذشت
                            </h2>
                            <p className="mt-3 text-[#5C4A3D]">خلاصه گفت‌وگوهای جلسات پیشین</p>
                            <Ornament />
                        </div>
                        <div className="space-y-10">
                            {pastSessions.map((session) => (
                                <article
                                    key={session.id}
                                    className="rounded-2xl border-r-4 border-[#7B2D26] bg-[#F7F0E3] p-8"
                                >
                                    <p className="mb-2 text-sm font-medium text-[#B08D57]">
                                        {formatFaDate(session.sessionDate)}
                                    </p>
                                    <h3 className="mb-4 font-serif text-2xl font-bold text-[#2B1B12]">
                                        {session.title}
                                    </h3>
                                    {session.summary ? (
                                        <div
                                            className="prose prose-stone max-w-none leading-relaxed text-[#5C4A3D] prose-headings:font-serif prose-headings:text-[#2B1B12] prose-a:text-[#1B4B43]"
                                            dangerouslySetInnerHTML={{ __html: session.summary }}
                                        />
                                    ) : (
                                        <p className="italic text-[#8D7B6F]">
                                            خلاصه این جلسه به‌زودی منتشر می‌شود.
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ---------- پانوشت ---------- */}
            <section className="border-t-4 border-double border-[#B08D57]/40 px-6 py-14 text-center">
                <blockquote className="mx-auto max-w-2xl font-serif text-xl italic leading-relaxed text-[#5C4A3D]">
                    «هر کس باید بداند که حق چیست و قانون کدام است.»
                </blockquote>
                <p className="mt-3 text-sm text-[#8D7B6F]">— از روزنامه‌های عصر مشروطه</p>
            </section>
        </div>
    )
}
