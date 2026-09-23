// ============================================================================
// File: src/components/perks/perks-page.tsx
// Role: The perk-partner call, rendered for either locale.
// Why:  /lab/perks and /fa/lab/perks are the same page in two languages. One
//       component means a change to the terms cannot land in one language only.
// ============================================================================

import { ArrowDown, FileText, Mail, Send } from "lucide-react";
import type { Locale } from "@/lib/perk-offer";
import { PerkForm } from "./perk-form";

export const CONTACT_EMAIL = "its@farjadp.info";
export const TELEGRAM_HANDLE = "FarjadTalks";

const COPY = {
    en: {
        eyebrow: "Astaneh · Founder Development Lab, cohort one",
        title: "Partner with Astaneh — for perk providers",
        introA: "Astaneh is an eight-week mentorship programme for five startup teams, from idea to pre-MVP. The programme runs on one simple path:",
        compass: ["Assumption", "Evidence", "Decision"],
        compassAria: "Assumption, then evidence, then decision",
        introB: "I am inviting companies and startups, inside and outside Iran, to give these teams something that makes building cheaper or faster.",
        ctaForm: "Send an offer",
        ctaTerms: "Terms",
        asksTitleA: "What helps",
        asksTitleB: "these teams?",
        asksNote: "A few examples. If you have something else in mind, write that instead.",
        asks: [
            ["Infrastructure credits", "Cloud, servers, databases, or any service teams build a product on."],
            ["Free tool access", "A software subscription for the length of the programme or longer."],
            ["An advisory session", "One or more sessions with your specialist: legal, financial, technical or sales."],
            ["Design and marketing work", "A UX review, brand design, or help with the first customer experiments."],
            ["Co-working space", "A desk or a meeting room for the days teams need to be together."],
        ],
        getsTitleA: "In return,",
        getsTitleB: "what do you get?",
        gets: [
            ["Real users who give honest feedback", "Astaneh teams build an assumption every week and test it against evidence. They apply that same habit to your product: their feedback is structured and does not flatter."],
            ["Credit as an Astaneh cohort one partner", "Your name and logo alongside the programme, as one of the companies that backed the teams from day one."],
        ],
        termsTitleA: "Terms,",
        termsTitleB: "plainly.",
        termsNote: "A perk is a gift, not a trade. These rules are the same for every partner.",
        terms: [
            ["Equity", "None. A perk buys you no share of the teams or of the programme."],
            ["Obligation to buy", "None. Teams are under no obligation to buy your product after the programme."],
            ["Cost to the organiser", "None. I take no payment for an introduction or a partnership."],
            ["Where it can be used", "A perk is only offered to a team whose country of operation permits its use."],
        ],
        contactTitle: "Whichever way suits you.",
        contacts: { form: "The form on this page", formNote: "Takes about five minutes", email: "Email", telegram: "Telegram" },
        formTitle: "Perk offer form",
        formNote: "The more precisely you describe it, the faster I can get the perk to the right team.",
    },
    fa: {
        eyebrow: "آستانه · کوهورت اول Founder Development Lab",
        title: "همکاری با آستانه — برای ارائه‌دهندگان Perk",
        introA: "آستانه یک برنامه‌ی ۸ هفته‌ای منتورشیپ برای پنج تیم استارتاپی در مرحله‌ی ایده تا پیش از MVP است. قطب‌نمای برنامه یک مسیر ساده است:",
        compass: ["فرض", "شاهد", "تصمیم"],
        compassAria: "فرض، سپس شاهد، سپس تصمیم",
        introB: "از شرکت‌ها و استارتاپ‌های ایرانی، داخل و خارج از ایران، دعوت می‌کنم چیزی به این تیم‌ها بدهند که ساختن را برایشان ارزان‌تر یا سریع‌تر کند.",
        ctaForm: "ثبت پیشنهاد",
        ctaTerms: "شرایط همکاری",
        asksTitleA: "چه چیزی",
        asksTitleB: "به کار تیم‌ها می‌آید؟",
        asksNote: "چند نمونه. اگر چیز دیگری در ذهن دارید، همان را بنویسید.",
        asks: [
            ["اعتبار زیرساخت", "کلاد، سرور، دیتابیس یا هر سرویسی که تیم‌ها با آن محصول می‌سازند."],
            ["دسترسی رایگان به ابزار", "اشتراک نرم‌افزار برای طول دوره یا بیشتر."],
            ["جلسه‌ی مشاوره", "یک یا چند جلسه با متخصص شما: حقوقی، مالی، فنی یا فروش."],
            ["خدمات طراحی و مارکتینگ", "بررسی UX، طراحی برند، یا کمک در اولین آزمایش‌های جذب مشتری."],
            ["فضای کار اشتراکی", "میز یا اتاق جلسه برای روزهایی که تیم‌ها باید کنار هم باشند."],
        ],
        getsTitleA: "در عوض،",
        getsTitleB: "چه می‌گیرید؟",
        gets: [
            ["کاربر واقعی با بازخورد صادقانه", "تیم‌های آستانه هر هفته فرض می‌سازند و با شاهد آزمایشش می‌کنند. همین عادت را روی محصول شما هم پیاده می‌کنند: بازخوردشان ساختارمند است و تعارف ندارد."],
            ["معرفی به‌عنوان شریک کوهورت اول آستانه", "نام و لوگوی شما کنار برنامه، به‌عنوان یکی از شرکت‌هایی که از روز اول پشت تیم‌ها بوده‌اند."],
        ],
        termsTitleA: "شرایط،",
        termsTitleB: "رک و راست.",
        termsNote: "Perk هدیه است، نه معامله. این قاعده‌ها برای همه‌ی شریک‌ها یکسان است.",
        terms: [
            ["سهام", "هیچ. در ازای Perk هیچ سهمی از تیم‌ها یا از برنامه به شما نمی‌رسد."],
            ["تعهد خرید", "ندارد. تیم‌ها بعد از دوره هیچ تعهدی برای خرید محصول شما ندارند."],
            ["هزینه برای برگزارکننده", "هیچ. من بابت معرفی یا همکاری پولی نمی‌گیرم."],
            ["محل استفاده", "هر Perk فقط به تیمی معرفی می‌شود که قوانین کشور محل فعالیتش اجازه‌ی استفاده از آن را بدهد."],
        ],
        contactTitle: "از هر راهی که راحت‌ترید.",
        contacts: { form: "فرم همین صفحه", formNote: "پنج دقیقه وقت می‌گیرد", email: "ایمیل", telegram: "تلگرام" },
        formTitle: "فرم پیشنهاد Perk",
        formNote: "هرچه دقیق‌تر بنویسید، سریع‌تر می‌توانم Perk را به تیم مناسب برسانم.",
    },
} as const;

export function PerksPage({ locale }: { locale: Locale }) {
    const t = COPY[locale];
    const rtl = locale === "fa";

    const contacts = [
        { label: t.contacts.form, value: t.contacts.formNote, href: "#offer", Icon: FileText, external: false, ltr: false },
        { label: t.contacts.email, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, Icon: Mail, external: false, ltr: true },
        { label: t.contacts.telegram, value: `@${TELEGRAM_HANDLE}`, href: `https://t.me/${TELEGRAM_HANDLE}`, Icon: Send, external: true, ltr: true },
    ];

    return (
        <div
            dir={rtl ? "rtl" : "ltr"}
            className="lab-page min-h-screen bg-[#FDFCF8] text-[#1C1917] selection:bg-[#1B4B43] selection:text-white"
        >
            <style>{`
        @keyframes lab-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .lab-rise { animation: lab-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) { .lab-rise { animation: none; } }
        .lab-page a, .lab-page button, .lab-page input, .lab-page textarea, .lab-page select { outline: none; }
        .lab-page a:focus-visible, .lab-page button:focus-visible { box-shadow: 0 0 0 2px #FDFCF8, 0 0 0 4px #1B4B43; border-radius: 4px; }
        .lab-page input, .lab-page textarea { caret-color: #1B4B43; }
      `}</style>

            {/* ─── Hero ─────────────────────────────────────────────── */}
            <section className="px-6 pt-20 md:pt-28 pb-16">
                <div className="max-w-3xl mx-auto space-y-8 lab-rise">
                    <p className="text-sm font-semibold text-[#1B4B43] tracking-wide">{t.eyebrow}</p>

                    <h1 className="text-[2.2rem] md:text-5xl font-black leading-[1.25] text-[#111827] text-balance">
                        {t.title}
                    </h1>

                    <div className="space-y-5 text-lg leading-[2.1] text-stone-700">
                        <p>{t.introA}</p>
                        <p
                            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-2xl md:text-3xl font-black text-[#1B4B43]"
                            aria-label={t.compassAria}
                        >
                            <span>{t.compass[0]}</span>
                            <span aria-hidden="true" className="text-[#D97706]">{rtl ? "←" : "→"}</span>
                            <span>{t.compass[1]}</span>
                            <span aria-hidden="true" className="text-[#D97706]">{rtl ? "←" : "→"}</span>
                            <span>{t.compass[2]}</span>
                        </p>
                        <p>{t.introB}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 pt-2">
                        <a
                            href="#offer"
                            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#1B4B43] text-white font-bold rounded-full text-base transition-colors duration-300 hover:bg-[#123730]"
                        >
                            <Send className="w-4 h-4" />
                            {t.ctaForm}
                        </a>
                        <a
                            href="#terms"
                            className="inline-flex items-center gap-2 font-bold text-[#111827] border-b-2 border-[#D97706] pb-0.5 hover:text-[#1B4B43] transition-colors"
                        >
                            {t.ctaTerms}
                            <ArrowDown className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* ─── What helps ───────────────────────────────────────── */}
            <section className="px-6 py-20 border-t border-stone-200/70">
                <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
                    <div className="md:sticky md:top-28 self-start space-y-4">
                        <h2 className="text-3xl font-black text-[#111827] leading-snug">
                            {t.asksTitleA}
                            <br />
                            {t.asksTitleB}
                        </h2>
                        <p className="text-stone-600 leading-relaxed">{t.asksNote}</p>
                    </div>

                    <ul className="max-w-2xl w-full">
                        {t.asks.map(([title, body]) => (
                            <li key={title} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 border-b border-stone-200/70">
                                <span className="font-bold text-lg text-[#111827]">{title}</span>
                                <span className="text-stone-600 leading-relaxed">{body}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ─── What you get ─────────────────────────────────────── */}
            <section className="px-6 py-20 bg-[#f6f3ec] border-y border-stone-200/70">
                <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
                    <h2 className="text-3xl font-black text-[#111827] leading-snug md:sticky md:top-28 self-start">
                        {t.getsTitleA}
                        <br />
                        {t.getsTitleB}
                    </h2>

                    <div className="max-w-2xl w-full space-y-5">
                        {t.gets.map(([title, body]) => (
                            <article key={title} className="bg-white rounded-2xl border border-stone-200 shadow-[0_2px_12px_-4px_rgba(28,25,23,0.08)] p-6 space-y-2">
                                <h3 className="font-black text-lg text-[#1B4B43]">{title}</h3>
                                <p className="leading-[2] text-stone-700">{body}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Terms ────────────────────────────────────────────── */}
            <section id="terms" className="px-6 py-20 scroll-mt-24">
                <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
                    <div className="md:sticky md:top-28 self-start space-y-4">
                        <h2 className="text-3xl font-black text-[#111827] leading-snug">
                            {t.termsTitleA}
                            <br />
                            {t.termsTitleB}
                        </h2>
                        <p className="text-stone-600 leading-relaxed">{t.termsNote}</p>
                    </div>

                    <dl className="max-w-2xl w-full">
                        {t.terms.map(([term, body]) => (
                            <div
                                key={term}
                                className="grid grid-cols-[7.5rem_1fr] md:grid-cols-[11rem_1fr] gap-4 py-5 border-b border-stone-200/70 items-baseline"
                            >
                                <dt className="font-black text-[#1B4B43]">{term}</dt>
                                <dd className="leading-[1.9] text-stone-700">{body}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* ─── Ways to reach us ─────────────────────────────────── */}
            <section className="px-6 py-20 bg-[#f6f3ec] border-y border-stone-200/70">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-black text-[#111827] mb-10">{t.contactTitle}</h2>
                    <ul className="grid sm:grid-cols-3 gap-4">
                        {contacts.map(({ label, value, href, Icon, external, ltr }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                    className="flex h-full flex-col gap-3 bg-white rounded-2xl border border-stone-200 p-6 transition-colors hover:border-[#1B4B43]/50"
                                >
                                    <span className="w-10 h-10 rounded-full bg-[#1B4B43]/10 text-[#1B4B43] flex items-center justify-center">
                                        <Icon className="w-5 h-5" />
                                    </span>
                                    <span className="font-black text-lg text-[#111827]">{label}</span>
                                    <span dir={ltr ? "ltr" : undefined} className="self-start text-stone-600 break-all">
                                        {value}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ─── Form ─────────────────────────────────────────────── */}
            <section id="offer" className="px-6 pt-20 pb-28 scroll-mt-24">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-10 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-[#111827]">{t.formTitle}</h2>
                        <p className="text-lg text-stone-600 leading-[1.9] max-w-xl">{t.formNote}</p>
                    </div>

                    <div className="relative bg-white border border-stone-200 rounded-3xl p-6 md:p-10 shadow-[0_2px_16px_-6px_rgba(28,25,23,0.1)]">
                        <PerkForm locale={locale} />
                    </div>
                </div>
            </section>
        </div>
    );
}
