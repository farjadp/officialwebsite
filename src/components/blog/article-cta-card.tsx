// ============================================================================
// File Path: src/components/blog/article-cta-card.tsx
// Why: The closing invitation under an article, in the v3 "Light" look — a
//      v3 card on the warm charcoal ground with one accent, instead of the
//      old near-black slab with its green and amber glows.
//
//      The copy is the v2 card's, verbatim in both languages. Internal links
//      go through localePath so the Persian card never leaks to /booking.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import { Calendar, Linkedin, ArrowLeft, ArrowRight } from "lucide-react"
import { localePath } from "@/lib/nav"
import { Reveal } from "@/components/v3/motion"

interface ArticleCtaCardProps {
    locale?: "en" | "fa"
}

export function ArticleCtaCard({ locale = "en" }: ArticleCtaCardProps) {
    const isFa = locale === "fa"

    const content = {
        en: {
            badge: "Let's Collaborate",
            headline: "Ready to build something real?",
            description: "I work with a small number of founding teams each quarter to launch products, mentor engineers, and integrate custom AI systems. Let's determine if we are a fit.",
            bookBtn: "Book a Strategy Session",
            linkedinBtn: "Connect on LinkedIn",
            footerText: "Direct & selective advisory • Limited slots available"
        },
        fa: {
            badge: "شروع همکاری",
            headline: "برای ساختن یک کسب‌وکار واقعی آماده‌اید؟",
            description: "من در هر فصل با تعداد محدودی از تیم‌های بنیان‌گذار برای لانچ محصولات، مشاوره به مهندسین و سیستم‌سازی اختصاصی با هوش مصنوعی همکاری می‌کنم. بیایید بررسی کنیم آیا برای هم مناسب هستیم یا خیر.",
            bookBtn: "رزرو جلسه استراتژی",
            linkedinBtn: "ارتباط در لینکدین",
            footerText: "همکاری مستقیم و گزینشی • ظرفیت پذیرش محدود"
        }
    }

    const dict = isFa ? content.fa : content.en
    const Arrow = isFa ? ArrowLeft : ArrowRight

    return (
        <Reveal className="my-16">
            <div
                dir={isFa ? "rtl" : "ltr"}
                className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-v3-line/80 bg-v3-raise p-8 text-start transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 md:flex-row md:items-center md:p-12"
            >
                <div className="flex max-w-xl flex-col gap-4">
                    <span className="inline-flex w-fit rounded-full border border-v3-light/40 px-3.5 py-1 text-[10px] uppercase tracking-[0.18em] text-v3-light">
                        {dict.badge}
                    </span>
                    <h3 className="font-v3-display text-3xl font-light leading-tight tracking-[-0.015em] text-v3-bone md:text-4xl rtl:leading-snug rtl:tracking-normal">
                        {dict.headline}
                    </h3>
                    <p className="text-base leading-relaxed text-v3-soft md:text-lg rtl:leading-loose">
                        {dict.description}
                    </p>
                    <p className="pt-2 text-xs tracking-wider text-v3-mute">
                        {dict.footerText}
                    </p>
                </div>

                <div className="flex w-full shrink-0 flex-col gap-3 md:w-auto">
                    <Link
                        href={localePath(locale, "/booking")}
                        className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-v3-bone px-8 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink"
                    >
                        <Calendar className="h-4 w-4" aria-hidden />
                        {dict.bookBtn}
                        <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                    </Link>
                    <a
                        href="https://www.linkedin.com/in/farjadpourmohammad/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full border border-v3-bone/60 px-8 font-medium text-v3-bone transition-all duration-300 hover:-translate-y-0.5 hover:border-v3-light hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink"
                    >
                        <Linkedin className="h-4 w-4" aria-hidden />
                        {dict.linkedinBtn}
                    </a>
                </div>
            </div>
        </Reveal>
    )
}
