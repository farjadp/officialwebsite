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

function formatFaTime(date: Date, timeZone: string): string {
    return new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
    }).format(date)
}

// شهرها/مناطقی که اعضای دورهمی معمولاً از آن‌جا وصل می‌شوند
const SESSION_TIMEZONES = [
    { emoji: "🇮🇷", label: "ایران", zone: "Asia/Tehran" },
    { emoji: "🇨🇦", label: "کانادا (تورنتو)", zone: "America/Toronto" },
    { emoji: "🇺🇸", label: "غرب آمریکا", zone: "America/Los_Angeles" },
    { emoji: "🇪🇺", label: "اروپا (مرکزی)", zone: "Europe/Berlin" },
]

function TimezoneRow({ date, className = "" }: { date: Date; className?: string }) {
    return (
        <div className={`mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm ${className}`}>
            {SESSION_TIMEZONES.map((tz) => (
                <span key={tz.zone} className="flex items-center gap-1.5">
                    <span aria-hidden>{tz.emoji}</span>
                    {tz.label}: <strong className="font-bold">{formatFaTime(date, tz.zone)}</strong>
                </span>
            ))}
        </div>
    )
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
                        <p className="mt-5 border-t border-[#B08D57]/20 pt-4 text-sm leading-relaxed text-[#8D7B6F]">
                            🎙️ تمامی جلسات کتاب‌خوانی ضبط می‌شوند و خلاصه هر جلسه در گروه تلگرامی «مشروطه‌خوانی» قرار می‌گیرد.
                        </p>
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
                            {formatFaDate(nextSession.sessionDate)}
                        </p>
                        <TimezoneRow date={nextSession.sessionDate} className="text-[#F7F0E3]/90" />
                        <p className="flex items-center gap-2 text-[#F7F0E3]/60">
                            <Video className="h-5 w-5" />
                            لینک Google Meet با دعوت‌نامه کلندر برایت ارسال می‌شود.
                        </p>
                        {nextSession.readingAssignment && (
                            <div className="mt-2 w-full max-w-2xl rounded-2xl border border-[#F7F0E3]/20 bg-[#F7F0E3]/10 p-6 text-right">
                                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-[#B08D57]">
                                    📖 برای این جلسه بخوانید
                                </p>
                                <p className="text-lg font-medium leading-relaxed">
                                    {nextSession.readingAssignment}
                                </p>
                                <p className="mt-3 text-sm leading-relaxed text-[#F7F0E3]/70">
                                    این صفحه‌ها را با همان <strong className="font-bold text-[#F7F0E3]">نگاه محافظه‌کارانه</strong>‌ای بررسی می‌کنیم که در کارگاه‌های دکتر داروین صبوری آموختیم: تاریخ به‌مثابهٔ تداوم، نه گسست.
                                </p>
                            </div>
                        )}
                        <p className="text-sm text-[#F7F0E3]/60">
                            🎙️ همه جلسات ضبط می‌شوند و خلاصه هر جلسه در گروه تلگرامی «مشروطه‌خوانی» منتشر می‌شود.
                        </p>
                    </div>
                </section>
            )}

            {/* ---------- داستان مشروطه ---------- */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 text-center">
                        <h2 className="font-serif text-4xl font-bold text-[#2B1B12]">داستان مشروطه، به کوتاهی</h2>
                        <Ornament />
                    </div>
                    <p className="mx-auto mb-14 max-w-2xl text-center text-lg font-light leading-relaxed text-[#5C4A3D]">
                        مشروطه فقط یک «واقعه» نبود؛ نخستین بار بود که ایرانیان از پادشاه نه نان،
                        که <strong className="font-bold text-[#7B2D26]">قانون</strong> خواستند.
                        این خط زمانی، نقشه راه گفت‌وگوهای ماست.
                    </p>

                    <div className="relative space-y-12 before:absolute before:right-[19px] before:top-2 before:h-[calc(100%-2rem)] before:w-0.5 before:bg-[#B08D57]/40 md:before:right-[27px]">
                        {[
                            {
                                emoji: "🌿",
                                date: "۱۲۷۰ خورشیدی — ۱۸۹۱ میلادی",
                                title: "جنبش تنباکو",
                                text: "ناصرالدین‌شاه امتیاز انحصار توتون و تنباکو را به یک کمپانی انگلیسی می‌فروشد. فتوای تحریم تنباکو از سوی میرزای شیرازی، شاه را به عقب‌نشینی وا می‌دارد — نخستین بار که «اراده عمومی» در ایران پیروز می‌شود و تمرینی برای مشروطه.",
                            },
                            {
                                emoji: "⚖️",
                                date: "آذر ۱۲۸۴ — دسامبر ۱۹۰۵",
                                title: "به چوب بستن بازرگانان و آغاز اعتراض‌ها",
                                text: "حاکم تهران بازرگانان قند را به بهانه گرانی به فلک می‌بندد. بازار می‌بندد، علما و مردم در حرم شاه عبدالعظیم بست می‌نشینند (مهاجرت صغری) و خواسته‌ای تازه سر بر می‌آورد: «عدالت‌خانه».",
                            },
                            {
                                emoji: "🕊️",
                                date: "تابستان ۱۲۸۵ — ۱۹۰۶",
                                title: "مهاجرت کبری و تحصن بزرگ",
                                text: "علما به قم مهاجرت می‌کنند و هزاران تن از مردم تهران در باغ سفارت انگلیس بست می‌نشینند. این‌بار خواسته صریح است: مجلس شورای ملی.",
                            },
                            {
                                emoji: "📜",
                                date: "۱۳ مرداد ۱۲۸۵ — ۵ اوت ۱۹۰۶",
                                title: "امضای فرمان مشروطیت",
                                text: "مظفرالدین‌شاه قاجار، بیمار و در واپسین ماه‌های عمر، فرمان مشروطیت را امضا می‌کند. ایران نخستین کشور آسیایی‌ست که با جنبشی مردمی صاحب قانون اساسی و پارلمان می‌شود.",
                                image: "/book-club/farman-mashrutiyat.jpg",
                                caption: "دست‌خط فرمان مشروطیت، مرداد ۱۲۸۵",
                            },
                            {
                                emoji: "🏛️",
                                date: "۱۴ مهر ۱۲۸۵ — اکتبر ۱۹۰۶",
                                title: "گشایش نخستین مجلس شورای ملی",
                                text: "مجلس اول در عمارت بهارستان گشوده می‌شود؛ بازرگانان و روحانیون و اصناف کنار هم. قانون اساسی تدوین و چند روز پیش از مرگ شاه امضا می‌شود. مطبوعات آزاد جان می‌گیرند — از جمله «صور اسرافیل» با قلم تند و طنز درخشان علی‌اکبر دهخدا.",
                                image: "/book-club/majles-aval.jpg",
                                caption: "نمایندگان نخستین مجلس شورای ملی",
                            },
                            {
                                emoji: "🔥",
                                date: "۲ تیر ۱۲۸۷ — ۲۳ ژوئن ۱۹۰۸",
                                title: "به توپ بستن مجلس",
                                text: "محمدعلی‌شاه، دشمن مشروطه، به فرماندهی کلنل لیاخوف روسی مجلس را به توپ می‌بندد. میرزا جهانگیرخان صور اسرافیل و شماری از آزادی‌خواهان در باغشاه کشته می‌شوند. «استبداد صغیر» آغاز می‌شود.",
                                image: "/book-club/bombardment-majles.jpg",
                                caption: "عمارت بهارستان پس از گلوله‌باران بریگاد قزاق، ۱۲۸۷",
                            },
                            {
                                emoji: "⚔️",
                                date: "۱۲۸۷–۱۲۸۸ — ۱۹۰۸–۱۹۰۹",
                                title: "ایستادگی تبریز",
                                text: "در حالی که تهران خاموش شده، تبریز یازده ماه در محاصره می‌ایستد. ستارخان (سردار ملی) و باقرخان (سالار ملی) از محله‌های امیرخیز و خیابان، پرچم مشروطه را برافراشته نگه می‌دارند.",
                                image: "/book-club/sattar-bagher.jpg",
                                caption: "ستارخان و باقرخان در میان مجاهدان تبریز",
                            },
                            {
                                emoji: "🦁",
                                date: "۲۵ تیر ۱۲۸۸ — ۱۶ ژوئیه ۱۹۰۹",
                                title: "فتح تهران و بازگشت مشروطه",
                                text: "مجاهدان گیلان و سواران بختیاری تهران را می‌گشایند. محمدعلی‌شاه به سفارت روسیه پناه می‌برد و از سلطنت خلع می‌شود. مجلس دوم گشوده می‌شود — و پرسشی که هنوز با ماست آغاز می‌شود: با قانون چه باید کرد؟",
                            },
                        ].map((event) => (
                            <div key={event.title} className="relative flex gap-6 pr-0 md:gap-8">
                                <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#B08D57]/60 bg-[#FDFAF3] text-lg md:h-14 md:w-14 md:text-2xl">
                                    {event.emoji}
                                </div>
                                <div className="flex-1 pb-2">
                                    <p className="text-sm font-bold text-[#B08D57]">{event.date}</p>
                                    <h3 className="mt-1 font-serif text-2xl font-bold text-[#2B1B12]">{event.title}</h3>
                                    <p className="mt-2 leading-relaxed text-[#5C4A3D]">{event.text}</p>
                                    {event.image && (
                                        <figure className="mt-5 overflow-hidden rounded-2xl border-4 border-[#FDFAF3] shadow-lg shadow-[#3E2723]/15 ring-1 ring-[#B08D57]/40">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={event.image}
                                                alt={event.caption}
                                                loading="lazy"
                                                className="max-h-96 w-full bg-[#EDE3CE] object-cover object-top sepia-[0.25]"
                                            />
                                            <figcaption className="bg-[#FDFAF3] px-4 py-2.5 text-xs text-[#8D7B6F]">
                                                {event.caption} — آرشیو ویکی‌مدیا (مالکیت عمومی)
                                            </figcaption>
                                        </figure>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- روزنامه صور اسرافیل — نوار تزئینی ---------- */}
            <section className="border-y border-[#B08D57]/20 bg-[#EDE3CE]/60 px-6 py-12">
                <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/book-club/soure-esrafil.jpg"
                        alt="سرلوحه روزنامه صور اسرافیل"
                        loading="lazy"
                        className="w-full max-w-xl mix-blend-multiply opacity-90"
                    />
                    <p className="max-w-xl text-sm leading-relaxed text-[#8D7B6F]">
                        سرلوحه «صور اسرافیل» 🗞️ — پرخواننده‌ترین روزنامه عصر مشروطه؛ جایی که «چرند و پرند» دهخدا
                        نثر فارسی را برای همیشه عوض کرد.
                    </p>
                </div>
            </section>

            {/* ---------- آموزه‌های مشروطه (از درس‌گفتارهای دوره) ---------- */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-6 text-center">
                        <h2 className="font-serif text-4xl font-bold text-[#2B1B12]">آموزه‌های مشروطه</h2>
                        <p className="mt-3 text-[#5C4A3D]">
                            جان‌مایه گفت‌وگوهای ما — از دل جلسات و درس‌گفتارهای دوره 💬
                        </p>
                        <Ornament />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {[
                            {
                                emoji: "🌱",
                                title: "تنباکو؛ نخستین تجربه اراده ملی",
                                text: "جنبش تنباکو نخستین باری بود که ایرانیان دریافتند می‌توانند اراده قدرت سیاسی را تغییر دهند. واقعه، به تجربه بدل شد و تجربه، به معنا — و همین حافظه بود که پانزده سال بعد راه مشروطه را هموار کرد.",
                            },
                            {
                                emoji: "⚖️",
                                title: "ظلم؛ از شخص تا ساختار",
                                text: "میرزا رضا کرمانی می‌پنداشت با کشتن شاه، ظلم برمی‌افتد. شکست این راه، درس بزرگ مشروطه شد: ظلم صفتِ یک شخص نیست، یک ساختار است — و پاسخ ساختار، نه ترور که «قانون» و «عدالت‌خانه» است.",
                            },
                            {
                                emoji: "🧭",
                                title: "سیر آگاهی ملی؛ از آزادی تا دولت",
                                text: "دغدغه جمعی ایرانیان مرحله‌به‌مرحله پوست انداخت: ۱۲۸۵ آزادی (حریت)، ۱۲۹۰ حفظ مشروطه، ۱۲۹۵ بقای ایران، و ۱۳۰۰ به بعد ضرورت دولت مقتدر. در نوزده سال، بیش از پنجاه کابینه آمد و رفت — و آگاهی جمعی آموخت که بدون دولت توانمند، قانون اجرا نمی‌شود.",
                            },
                            {
                                emoji: "🏗️",
                                title: "روشنفکر مشروطه؛ نهادساز بود",
                                text: "روشنفکر مشروطه می‌پرسید «چگونه بسازیم؟» — قانون، عدلیه، مدرسه، ارتش، مجلس. رویکردش ایجابی بود و امر ملی را واحد رهایی می‌دانست؛ از مستشارالدوله و «یک کلمه»‌اش تا کسروی که می‌گفت نهادها را باید اصلاح کرد، نه ویران.",
                            },
                            {
                                emoji: "🕯️",
                                title: "حافظه تاریخی؛ توشه راه آینده",
                                text: "حافظه تاریخی یعنی توانایی یک ملت برای حمل تجربه‌هایش به آینده. نهادی که تاریخ تأسیس خود را فراموش کند، حافظه‌اش را می‌بلعد. مشروطه را می‌خوانیم تا این حافظه، گسسته نشود.",
                            },
                            {
                                emoji: "🎓",
                                title: "انقلابی نخبگانی، مسئله‌ای همگانی",
                                text: "مشروطه اساساً انقلابی نخبگانی بود؛ روشنفکران و علما و بازرگانان پیش‌قراولش بودند و نقش توده مردم کمرنگ‌تر. اما پرسشی که پیش کشید — نسبت ما با قانون — همچنان پرسش همه ماست.",
                            },
                        ].map((card) => (
                            <div
                                key={card.title}
                                className="rounded-2xl border border-[#B08D57]/30 bg-[#FDFAF3] p-7 transition-shadow hover:shadow-lg hover:shadow-[#3E2723]/10"
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#B08D57]/40 bg-[#F7F0E3] text-xl" aria-hidden>
                                        {card.emoji}
                                    </span>
                                    <h3 className="font-serif text-xl font-bold text-[#2B1B12]">{card.title}</h3>
                                </div>
                                <p className="leading-relaxed text-[#5C4A3D]">{card.text}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-center text-sm text-[#8D7B6F]">
                        برگرفته از یادداشت‌های جلسات دوره «زوال و زایش آگاهی ملی» در کارگاه‌های دکتر داروین صبوری
                    </p>
                </div>
            </section>

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

            {/* ---------- پرسش‌هایی که دنبال می‌کنیم ---------- */}
            <section className="border-y border-[#B08D57]/20 bg-[#EDE3CE]/50 px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <div className="mb-6 text-center">
                        <h2 className="font-serif text-4xl font-bold text-[#2B1B12]">پرسش‌هایی که دنبال می‌کنیم</h2>
                        <p className="mt-3 text-[#5C4A3D]">
                            خواندن با پرسش پیش می‌رود، نه با جمع‌آوری اطلاعات 🔎
                        </p>
                        <Ornament />
                    </div>

                    <div className="space-y-5">
                        {[
                            {
                                n: "۱",
                                q: "آیا مشروطه واکنشی ناگهانی بود، یا پروژه‌ای چهل‌ساله؟",
                                a: "مستشارالدوله در «یک کلمه» (۱۲۴۹ ش) نوشت که آن یک کلمه، «قانون» است — و حتی پیشنهاد کرد حفظ قانون به «مجلسی مخصوص و مستقل» سپرده شود. یعنی طرح مجلس، چهل سال پیش از مجلس، روی کاغذ بود.",
                            },
                            {
                                n: "۲",
                                q: "چرا سه روایت متضاد به یک نتیجهٔ مشترک می‌رسند؟",
                                a: "کسروی از موضع ضددینی، آدمیت از موضع سکولار ملی، و مقدمهٔ ۱۳۷۱ بر «بیداری ایرانیان» از موضعی کاملاً مخالف — هر سه از ناسازگاری ساختاری مشروطه و شریعت می‌گویند. در حالی که نائینی و آخوند خراسانی از درون همان سنت، این را انکار می‌کنند.",
                            },
                            {
                                n: "۳",
                                q: "خلع محمدعلی‌شاه زور بود یا حق؟",
                                a: "اصل ۳۵ متمم قانون اساسی: «سلطنت ودیعه‌ای است که از جانب ملت به شخص تفویض می‌شود» — و ملت می‌تواند پس بگیرد. مشروطه‌خواهان در ۱۲۸۸ به متنی استناد کردند که خودشان دو سال پیش‌تر نوشته بودند.",
                            },
                            {
                                n: "۴",
                                q: "پرسش درست چیست؟ «چرا مشروطه شکست خورد» نیست.",
                                a: "در آذر ۱۲۸۶ شاه با حدود ۷٬۰۰۰ نیرو به مجلس حمله کرد و در برابر ۱٬۵۰۰ مدافع باخت. شش ماه بعد، با نیروی کمتر، برد و مجلس را به توپ بست. پس بپرسیم: در آن شش ماه چه چیزی عوض شد؟",
                            },
                        ].map((item) => (
                            <div
                                key={item.n}
                                className="flex gap-5 rounded-2xl border border-[#B08D57]/30 bg-[#FDFAF3] p-6"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7B2D26] font-serif text-lg font-bold text-[#FDFAF3]">
                                    {item.n}
                                </span>
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-[#2B1B12]">{item.q}</h3>
                                    <p className="mt-2 leading-relaxed text-[#5C4A3D]">{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- آشنایی با کسروی و کتابش ---------- */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-6 text-center">
                        <h2 className="font-serif text-4xl font-bold text-[#2B1B12]">راوی ما کیست؟</h2>
                        <p className="mt-3 text-[#5C4A3D]">
                            پیش از آنکه کتاب را باز کنید، با نویسنده‌اش آشنا شوید 🖋️
                        </p>
                        <Ornament />
                    </div>

                    {/* معرفی کسروی */}
                    <div className="mb-8 grid items-center gap-8 rounded-3xl border border-[#B08D57]/30 bg-[#FDFAF3] p-8 md:grid-cols-[220px_1fr]">
                        <figure className="mx-auto w-full max-w-[220px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/book-club/kasravi.jpg"
                                alt="احمد کسروی، تاریخ‌نگار"
                                loading="lazy"
                                className="w-full rounded-2xl border-4 border-[#F7F0E3] object-cover shadow-lg shadow-[#3E2723]/15 ring-1 ring-[#B08D57]/40 sepia-[0.2]"
                            />
                            <figcaption className="mt-3 text-center text-xs text-[#8D7B6F]">
                                احمد کسروی (۱۲۶۹–۱۳۲۴) — آرشیو ویکی‌مدیا
                            </figcaption>
                        </figure>

                        <div className="space-y-4 text-[#5C4A3D]">
                            <h3 className="font-serif text-2xl font-bold text-[#2B1B12]">احمد کسروی</h3>
                            <p className="leading-relaxed">
                                تاریخ‌نگار، زبان‌شناس و حقوقدان اهل تبریز. هنگام مشروطه نوجوانی بود که ایستادگی
                                یازده‌ماههٔ شهرش را با چشم خود دید — و همین، «تاریخ مشروطهٔ ایران» را از یک کتاب
                                تاریخ معمولی جدا می‌کند.
                            </p>
                            <p className="leading-relaxed">
                                او برای نوشتن کتاب به روزنامه‌های همان سال‌ها، اسناد انجمن‌ها و گفت‌وگو با
                                شاهدان زنده تکیه کرد. نثرش تند و داوری‌هایش صریح است؛ کسروی پنهان نمی‌کند که
                                کجا ایستاده.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* واژه‌نامه */}
                        <div className="rounded-2xl border border-[#B08D57]/30 bg-[#FDFAF3] p-7">
                            <h3 className="mb-3 font-serif text-xl font-bold text-[#2B1B12]">
                                📕 واژه‌های کسروی
                            </h3>
                            <p className="mb-4 text-sm leading-relaxed text-[#5C4A3D]">
                                کسروی به پالایش زبان فارسی باور داشت و واژه‌های خودساخته به کار می‌برد.
                                اگر جایی در متن گیر کردید، احتمالاً یکی از این‌هاست:
                            </p>
                            <ul className="space-y-2 text-[#5C4A3D]">
                                {[
                                    ["آخشیج", "ضد"],
                                    ["سکالیدن", "شور کردن، مشورت"],
                                    ["هناییدن", "تأثیر کردن"],
                                    ["پیکره", "عکس"],
                                    ["دستینه", "امضا"],
                                ].map(([word, meaning]) => (
                                    <li
                                        key={word}
                                        className="flex items-baseline gap-3 border-b border-[#B08D57]/15 pb-2 last:border-0"
                                    >
                                        <strong className="font-bold text-[#7B2D26]">{word}</strong>
                                        <span className="text-sm text-[#8D7B6F]">←</span>
                                        <span>{meaning}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* درباره کتاب */}
                        <div className="rounded-2xl border border-[#B08D57]/30 bg-[#FDFAF3] p-7">
                            <h3 className="mb-3 font-serif text-xl font-bold text-[#2B1B12]">
                                📗 دربارهٔ این کتاب
                            </h3>
                            <ul className="space-y-4 text-[#5C4A3D]">
                                <li>
                                    <strong className="text-[#2B1B12]">کجا آغاز و کجا تمام می‌شود؟</strong>
                                    <p className="mt-1 text-sm leading-relaxed">
                                        از زمینه‌های پیش از مشروطه تا سال ۱۲۸۸. فتح تهران و آنچه پس از آن آمد
                                        در کتاب دیگر او، «تاریخ هجده‌سالهٔ آذربایجان»، دنبال می‌شود.
                                    </p>
                                </li>
                                <li>
                                    <strong className="text-[#2B1B12]">از کدام زاویه نوشته شده؟</strong>
                                    <p className="mt-1 text-sm leading-relaxed">
                                        کسروی مشروطه‌خواه است و پنهانش نمی‌کند. این نه عیب کتاب است و نه فضیلتش —
                                        فقط باید بدانیم داریم ماجرا را از کدام پنجره می‌بینیم.
                                    </p>
                                </li>
                                <li>
                                    <strong className="text-[#2B1B12]">چطور بخوانیم؟</strong>
                                    <p className="mt-1 text-sm leading-relaxed">
                                        آرام و با تقویم کنار دست. تاریخ‌ها در متن گاه قمری‌اند و گاه خورشیدی؛
                                        همین یک نکته جلوی بیشترِ سردرگمی‌ها را می‌گیرد.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* دو روی سکه */}
                    <div className="mt-8 overflow-hidden rounded-3xl border border-[#B08D57]/30 bg-[#FDFAF3]">
                        <figure>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/book-club/nouri-behbahani.jpg"
                                alt="شیخ فضل‌الله نوری و سید عبدالله بهبهانی"
                                loading="lazy"
                                className="max-h-[420px] w-full bg-[#EDE3CE] object-cover object-top sepia-[0.25]"
                            />
                            <figcaption className="px-6 py-3 text-center text-xs text-[#8D7B6F]">
                                شیخ فضل‌الله نوری و سید عبدالله بهبهانی، ۱۲۸۵ — آرشیو ویکی‌مدیا (مالکیت عمومی)
                            </figcaption>
                        </figure>
                        <div className="border-t border-[#B08D57]/20 p-7 text-center">
                            <h3 className="mb-2 font-serif text-xl font-bold text-[#2B1B12]">
                                دو روحانی، دو راه
                            </h3>
                            <p className="mx-auto max-w-2xl leading-relaxed text-[#5C4A3D]">
                                هر دو از علمای بزرگ پایتخت بودند و هر دو در آغاز، همراه جنبش. اما یکی
                                («مشروطهٔ مشروعه») در برابر متمم قانون اساسی ایستاد و دیگری تا پایان کنار
                                مشروطه ماند. فهمِ این دوراهی — نه محکوم کردن یک طرف — کار ماست.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- منابع و لینک‌های مفید ---------- */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-5xl">
                    <div className="mb-12 text-center">
                        <h2 className="font-serif text-4xl font-bold text-[#2B1B12]">منابع و لینک‌های مفید</h2>
                        <p className="mt-3 text-[#5C4A3D]">برای آنکه پیش از هر جلسه، عمیق‌تر بیاییم 📚</p>
                        <Ornament />
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* کتاب‌های مرجع */}
                        <div className="rounded-2xl border border-[#B08D57]/30 bg-[#FDFAF3] p-8">
                            <h3 className="mb-5 flex items-center gap-2 font-serif text-2xl font-bold text-[#2B1B12]">
                                📖 کتاب‌های مرجع
                            </h3>
                            <ul className="space-y-4 text-[#5C4A3D]">
                                <li className="border-r-2 border-[#B08D57]/50 pr-4">
                                    <strong className="text-[#2B1B12]">تاریخ مشروطه ایران</strong> — احمد کسروی
                                    <p className="mt-0.5 text-sm text-[#8D7B6F]">روایت کلاسیک و دست‌اول؛ کسروی خود شاهد وقایع تبریز بود.</p>
                                </li>
                                <li className="border-r-2 border-[#B08D57]/50 pr-4">
                                    <strong className="text-[#2B1B12]">تاریخ بیداری ایرانیان</strong> — ناظم‌الاسلام کرمانی
                                    <p className="mt-0.5 text-sm text-[#8D7B6F]">وقایع‌نگاری روزبه‌روز مشروطه به قلم کسی که خودش در میانه ماجرا بود؛ از مهم‌ترین اسناد دست‌اول این دوره.</p>
                                </li>
                                <li className="border-r-2 border-[#B08D57]/50 pr-4">
                                    <strong className="text-[#2B1B12]">مشروطه ایرانی</strong> — ماشاءالله آجودانی
                                    <p className="mt-0.5 text-sm text-[#8D7B6F]">چرا مفهوم «مشروطه» در ترجمه به فرهنگ ما دگرگون شد؟</p>
                                </li>
                                <li className="border-r-2 border-[#B08D57]/50 pr-4">
                                    <strong className="text-[#2B1B12]">ایدئولوژی نهضت مشروطیت ایران</strong> — فریدون آدمیت
                                    <p className="mt-0.5 text-sm text-[#8D7B6F]">ریشه‌های فکری مشروطه و اندیشه ترقی.</p>
                                </li>
                                <li className="border-r-2 border-[#B08D57]/50 pr-4">
                                    <strong className="text-[#2B1B12]">تبریز مه‌آلود</strong> — محمدسعید اردوبادی
                                    <p className="mt-0.5 text-sm text-[#8D7B6F]">رمانی درباره ایستادگی تبریز؛ برای آن‌که تاریخ را قصه‌وار بخواند.</p>
                                </li>
                                <li className="border-r-2 border-[#B08D57]/50 pr-4">
                                    <strong className="text-[#2B1B12]">The Iranian Constitutional Revolution</strong> — Janet Afary
                                    <p className="mt-0.5 text-sm text-[#8D7B6F]">نگاه پژوهشی به نقش شوراها، زنان و دموکراسی مردمی (انگلیسی).</p>
                                </li>
                            </ul>
                        </div>

                        {/* لینک‌های آنلاین */}
                        <div className="rounded-2xl border border-[#B08D57]/30 bg-[#FDFAF3] p-8">
                            <h3 className="mb-5 flex items-center gap-2 font-serif text-2xl font-bold text-[#2B1B12]">
                                🔗 آنلاین بخوانید
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    {
                                        title: "جنبش مشروطه ایران — ویکی‌پدیای فارسی",
                                        href: "https://fa.wikipedia.org/wiki/%D8%AC%D9%86%D8%A8%D8%B4_%D9%85%D8%B4%D8%B1%D9%88%D8%B7%D9%87_%D8%A7%DB%8C%D8%B1%D8%A7%D9%86",
                                        note: "نقطه شروع خوب با ارجاع‌های فراوان.",
                                    },
                                    {
                                        title: "Constitutional Revolution — Encyclopædia Iranica",
                                        href: "https://www.iranicaonline.org/articles/constitutional-revolution-index/",
                                        note: "مجموعه مقالات پژوهشی معتبر (انگلیسی).",
                                    },
                                    {
                                        title: "The Persian Revolution of 1905–1909 — Edward Browne",
                                        href: "https://archive.org/details/persianrevolutio00browuoft",
                                        note: "گزارش دست‌اول ادوارد براون؛ متن کامل و رایگان در Internet Archive.",
                                    },
                                    {
                                        title: "اسناد و عکس‌های مشروطه — Wikimedia Commons",
                                        href: "https://commons.wikimedia.org/wiki/Category:Persian_Constitutional_Revolution",
                                        note: "آرشیو عکس‌ها و اسناد اصل دوره مشروطه.",
                                    },
                                    {
                                        title: "روزنامه صور اسرافیل — نسخه‌های اصل",
                                        href: "https://fa.wikipedia.org/wiki/%D8%B5%D9%88%D8%B1_%D8%A7%D8%B3%D8%B1%D8%A7%D9%81%DB%8C%D9%84",
                                        note: "درباره روزنامه و «چرند و پرند» دهخدا.",
                                    },
                                ].map((link) => (
                                    <li key={link.href} className="border-r-2 border-[#1B4B43]/40 pr-4">
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 font-bold text-[#1B4B43] hover:text-[#7B2D26]"
                                        >
                                            {link.title}
                                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                        </a>
                                        <p className="mt-0.5 text-sm text-[#8D7B6F]">{link.note}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* خواندنی‌های جانبی */}
                    <div className="mt-8 rounded-2xl border border-dashed border-[#B08D57]/50 bg-[#F7F0E3] p-8">
                        <h3 className="mb-2 flex items-center gap-2 font-serif text-2xl font-bold text-[#2B1B12]">
                            🧭 خواندنی‌های جانبی
                        </h3>
                        <p className="mb-5 text-sm text-[#8D7B6F]">
                            مستقیم درباره مشروطه نیستند، اما زمینه تاریخی گفت‌وگوهای ما را کامل می‌کنند.
                        </p>
                        <ul className="grid gap-4 md:grid-cols-2">
                            <li className="border-r-2 border-[#B08D57]/50 pr-4">
                                <strong className="text-[#2B1B12]">Iran Under the Safavids</strong> — Roger Savory
                                <p className="mt-0.5 text-sm text-[#8D7B6F]">ایران عصر صفوی؛ ریشه‌های دولت متمرکز و پیوند دین و سلطنت که مشروطه با میراثش دست‌وپنجه نرم کرد (انگلیسی).</p>
                            </li>
                            <li className="border-r-2 border-[#B08D57]/50 pr-4">
                                <strong className="text-[#2B1B12]">تاریخ ایران مدرن</strong> — یرواند آبراهامیان
                                <p className="mt-0.5 text-sm text-[#8D7B6F]">نگاه فشرده به دو قرن اخیر؛ جای مشروطه را در قاب بزرگ‌تر تاریخ معاصر نشان می‌دهد.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

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
