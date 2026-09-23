// ============================================================================
// Route: /lab
// Role: English introduction to the Founder Development Lab (cohort one:
//       Astaneh). The Persian twin is /fa/lab.
// Why:  The Lab had no English page, so the programme was invisible to the
//       English side of the site even though it is run in English and Persian.
// Note: Every claim here mirrors the Persian page. The Telegram poll cards on
//       that page are Persian-channel artefacts and are linked rather than
//       translated, so nothing is put in quotation marks that was not said in
//       that language.
// ============================================================================

import { localeAlternates, SITE_URL } from "@/lib/seo"
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, CheckCircle2, Gift, Linkedin, Send, Youtube } from "lucide-react";
import { ApplicationForm } from "@/components/lab/application-form";

export const metadata: Metadata = {
    alternates: localeAlternates("/lab", "en"),
    title: "Founder Development Lab | Farjad Pourmohammad",
    description:
        "Eight weeks of real work on your startup — five teams, free. From idea to evidence, mentored directly by Farjad Pourmohammad.",
    openGraph: {
        title: "Founder Development Lab — from idea to evidence",
        description: "Eight weeks, five teams, free. Every week we work on your startup's real problem.",
        images: [{ url: "/images/og-logo.png", width: 1200, height: 630, alt: "Founder Development Lab" }],
    },
};

const WEEKS = [
    { n: "1", title: "The Founder & The Thesis", desc: "Separating what we know, what we believe, and what we still do not know.", out: "Venture Thesis v0.1" },
    { n: "2", title: "Problem Deconstruction", desc: "Breaking the problem into trigger, frequency, severity and cost.", out: "Problem Map + 5 critical assumptions" },
    { n: "3", title: "Customer Discovery", desc: "Talking to real customers properly, instead of asking questions that invite a yes.", out: "Customer Hypothesis + Evidence Log" },
    { n: "4", title: "Market Reality", desc: "Seeing the market as it is — competitors, alternatives, and doing nothing.", out: "Market Map + Thesis v0.2" },
    { n: "5", title: "Solution & Value", desc: "The smallest solution that makes the core value testable.", out: "Solution Hypothesis + what we will not build" },
    { n: "6", title: "Business Model & Kill Risks", desc: "Who pays, why, how much — and the three risks that could kill all of it.", out: "Kill-Risk Map" },
    { n: "7", title: "The Critical Experiment", desc: "The cheapest valid experiment for the riskiest assumption.", out: "Experiment + Evidence" },
    { n: "8", title: "Founder Decision Board", desc: "What we believed, what we learned, what was wrong — and the decision for the next 90 days.", out: "Decision + 90-day plan" },
];

const TRACK_RECORD = [
    "Over twenty years in Iran's IT industry",
    "Over seven years alongside Iranian startups",
    "Three years in Canada's startup ecosystem",
    "Mentored more than 50 startup teams",
    "Helped raise over $10M in micro-funding for startup teams",
];

const SOCIALS = [
    { label: "Telegram — A Mentor's Hero Journey", href: "https://t.me/Heros_Journey", Icon: Send },
    { label: "YouTube — Farjad Talks", href: "https://youtube.com/@FarjadTalks", Icon: Youtube },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/farjadpourmohammad/", Icon: Linkedin },
];

const PHOTOS = [
    { src: "/images/lab/council.jpg", alt: "Presenting programme results to York Regional Council", caption: "York Regional Council — presenting the teams' results", span: "col-span-2 md:col-span-2 md:row-span-2" },
    { src: "/images/lab/online-session.jpg", alt: "Online mentorship session with Iranian founders", caption: "An online session with Iranian founders" },
    { src: "/images/lab/cohort.jpg", alt: "Cohort teams at the York Region building", caption: "The last day of a cohort" },
    { src: "/images/lab/panel.jpg", alt: "Closing panel of the Digital Transformation programme", caption: "Closing panel — Toronto" },
    { src: "/images/lab/accelerator.jpg", alt: "End-of-programme celebration with the accelerator team", caption: "End of a cohort, with the accelerator team" },
];

const LENS_QUESTIONS = [
    "How does this person think?",
    "How do they decide?",
    "What do they do when their own hypothesis turns out to be wrong?",
    "What do they do when the market does not answer?",
    "What do they do when they disagree with a co-founder?",
    "Do they execute?",
    "Do they make excuses?",
    "Do they manipulate the data?",
    "Do they understand the customer?",
    "Are they simply in love with their own product — with their eyes shut?",
];

const NOT_MENTORING = [
    ["Spotting the wrong problem", "before you spend six months on it"],
    ["Asking the right question", "the one you do not ask yourself"],
    ["Seeing the pattern", "what you are seeing for the first time, I am seeing for the hundredth"],
    ["Designing the experiment", "the cheapest way to find the truth"],
    ["Creating accountability", "next week I will ask whether you did it"],
    ["Pressure on execution", "ideas are cheap; execution is everything"],
];

const TERMS = [
    ["Capacity", "Five teams. No more, because I spend real time."],
    ["Length", "Eight weeks."],
    ["Group session", "90 minutes each week — 20 minutes concept, 50 minutes hot seat, 20 minutes decisions and next steps."],
    ["Private session", "1:1 with each team every second week — weeks 2, 4, 6 and 8."],
    ["Cost", "Free. No money and no equity changes hands during these eight weeks."],
    ["After week eight", "If I see growth, I enter a 12-month engagement with three teams — that is where 2.5% equity is agreed."],
    ["Demo Day", "There isn't one. There is a Decision Day — the day you decide, not the day you perform."],
];

export default function FounderLabPage() {
    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: "Founder Development Lab",
        description:
            "An eight-week mentorship programme for founders and very early teams — from idea to evidence.",
        provider: {
            "@type": "Person",
            name: "Farjad Pourmohammad",
            url: `${SITE_URL}/lab`,
        },
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Blended",
            location: "Toronto / Online",
        },
    };

    return (
        <div className="lab-page min-h-screen bg-[#FDFCF8] text-[#1C1917] selection:bg-[#1B4B43] selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
            />
            <style>{`
        @keyframes lab-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        .lab-rise { animation: lab-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @media (prefers-reduced-motion: reduce) { .lab-rise { animation: none; } }
        .lab-page a, .lab-page button, .lab-page input, .lab-page textarea { outline: none; }
        .lab-page a:focus-visible, .lab-page button:focus-visible { box-shadow: 0 0 0 2px #FDFCF8, 0 0 0 4px #1B4B43; border-radius: 4px; }
        .lab-page input, .lab-page textarea { caret-color: #1B4B43; }
      `}</style>

            {/* ─── The letter ───────────────────────────────────────── */}
            <section className="px-6 pt-20 md:pt-28 pb-16">
                <div className="max-w-5xl mx-auto grid md:grid-cols-[1fr_260px] gap-12 lg:gap-20 items-start lab-rise">
                    <div className="space-y-8">
                        <p className="text-sm font-semibold text-[#1B4B43] tracking-wide">
                            Founder Development Lab · from idea to evidence
                        </p>

                        <h1 className="text-[2.4rem] md:text-6xl font-black leading-[1.2] md:leading-[1.18] text-[#111827] text-balance">
                            A startup is not four pages of business plan and a pitch deck.
                        </h1>

                        <div className="space-y-5 text-lg leading-[2.1] text-stone-700 max-w-2xl">
                            <p>
                                After all these years working with founders — and my own time inside
                                a startup — I have come to one conclusion: you cannot pull a startup
                                out of books and frameworks. Filling in a lean canvas is not the same
                                as having a startup.
                            </p>
                            <p>
                                So I set up something small:{" "}
                                <strong className="font-bold text-[#111827]">eight weeks, five teams, free.</strong>{" "}
                                Every week we sit down and work on your startup's real problem — no
                                lectures, no certificate. At the end you either continue with
                                evidence, or you learn from evidence that you should not. Both are
                                progress.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-5 pt-2">
                            <a
                                href="#apply"
                                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#1B4B43] text-white font-bold rounded-full text-base transition-colors duration-300 hover:bg-[#123730]"
                            >
                                <Send className="w-4 h-4" />
                                Application form
                            </a>
                            <a
                                href="#terms"
                                className="inline-flex items-center gap-2 font-bold text-[#111827] border-b-2 border-[#D97706] pb-0.5 hover:text-[#1B4B43] transition-colors"
                            >
                                Terms
                                <ArrowDown className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Portrait + track record */}
                    <figure className="max-w-xs md:max-w-none">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-200">
                            <Image
                                src="/images/farjad-portrait.jpg"
                                alt="Farjad Pourmohammad"
                                fill
                                sizes="(max-width: 768px) 20rem, 260px"
                                className="object-cover"
                                priority
                            />
                        </div>
                        <figcaption className="mt-4">
                            <span className="block font-bold text-[#111827] text-base mb-3">Farjad Pourmohammad</span>
                            <ul className="space-y-2 text-sm leading-relaxed text-stone-600">
                                {TRACK_RECORD.map((t) => (
                                    <li key={t} className="border-s-2 border-[#D97706] ps-3">{t}</li>
                                ))}
                            </ul>
                            <ul className="mt-5 space-y-2.5 text-sm">
                                {SOCIALS.map(({ label, href, Icon }) => (
                                    <li key={href}>
                                        <a
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-stone-500 hover:text-[#1B4B43] transition-colors"
                                        >
                                            <Icon className="w-4 h-4 shrink-0" />
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </figcaption>
                    </figure>
                </div>
            </section>

            {/* ─── What mentoring is not ────────────────────────────── */}
            <section className="px-6 py-20 border-t border-stone-200/70">
                <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
                    <h2 className="text-3xl font-black text-[#111827] leading-snug md:sticky md:top-28 self-start">
                        Mentoring is not
                        <br />
                        <span className="text-stone-400">answering questions</span>.
                    </h2>

                    <div className="space-y-8 max-w-2xl">
                        <p className="text-lg leading-[2.1] text-stone-700">
                            Someone answering all of your questions is no guarantee that you reach
                            the right outcome. Answering questions is the job of a consultant or an
                            expert. What I do in these eight weeks is something else:
                        </p>

                        <ul className="space-y-0 text-lg font-medium text-[#111827]">
                            {NOT_MENTORING.map(([t, d]) => (
                                <li key={t} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 border-b border-stone-200/70">
                                    <span className="font-bold">{t}</span>
                                    <span className="text-sm font-normal text-stone-500">{d}</span>
                                </li>
                            ))}
                        </ul>

                        <p className="text-stone-600 leading-[1.9]">
                            I wrote all of this on my Telegram channel before this page existed.
                            It is in Persian, and it is{" "}
                            <a
                                href="https://t.me/Heros_Journey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[#1B4B43] border-b-2 border-[#D97706] pb-0.5 hover:text-[#123730] transition-colors"
                            >
                                open to read
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── Terms ────────────────────────────────────────────── */}
            <section id="terms" className="px-6 py-20 bg-[#f6f3ec] border-y border-stone-200/70 scroll-mt-24">
                <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
                    <div className="md:sticky md:top-28 self-start space-y-4">
                        <h2 className="text-3xl font-black text-[#111827] leading-snug">
                            Terms,
                            <br />
                            plainly.
                        </h2>
                        <p className="text-stone-600 leading-relaxed">
                            The same thing I wrote on the channel; no more, no less.
                        </p>
                    </div>

                    <dl className="max-w-2xl w-full">
                        {TERMS.map(([t, d]) => (
                            <div
                                key={t}
                                className="grid grid-cols-[7.5rem_1fr] md:grid-cols-[10rem_1fr] gap-4 py-5 border-b border-stone-300/50 items-baseline"
                            >
                                <dt className="font-black text-[#1B4B43]">{t}</dt>
                                <dd className="leading-[1.9] text-stone-700">{d}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* ─── Week by week ─────────────────────────────────────── */}
            <section className="px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="max-w-2xl mb-12 space-y-4">
                        <h2 className="text-3xl font-black text-[#111827]">What we do, week by week</h2>
                        <p className="text-stone-600 leading-[1.9]">
                            Every week at least one important uncertainty gets smaller — even when
                            progress means discovering a mistake. Each team also writes a weekly
                            Founder Journal: what I believed, what evidence challenged it, which
                            decision changed, and what I avoided doing.
                        </p>
                    </div>

                    <ol className="max-w-3xl">
                        {WEEKS.map((w) => (
                            <li key={w.n} className="grid grid-cols-[2.5rem_1fr] gap-5 py-5 border-b border-stone-200/70 items-baseline">
                                <span className="text-2xl font-black text-stone-300 tabular-nums text-center">{w.n}</span>
                                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                                    <h3 className="font-bold text-lg text-[#111827]">{w.title}</h3>
                                    <p className="text-stone-600 basis-full leading-relaxed">{w.desc}</p>
                                    <p className="text-sm font-semibold text-[#1B4B43]">Output: {w.out}</p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <p className="max-w-3xl mt-8 text-stone-600 leading-[1.9]">
                        Some weeks deliberately put a real action in the middle: talking to a real
                        person, cutting your favourite feature, or running an experiment that may
                        show the core assumption was wrong. The goal is not artificial pressure —
                        it is seeing how you behave in a real situation.
                    </p>
                </div>
            </section>

            {/* ─── The lens ─────────────────────────────────────────── */}
            <section className="px-6 py-24 bg-[#111827] text-white">
                <div className="max-w-5xl mx-auto grid md:grid-cols-[260px_1fr] gap-10 lg:gap-20">
                    <div className="md:sticky md:top-28 self-start space-y-4">
                        <h2 className="text-3xl font-black leading-snug">
                            I do not only
                            <br />
                            look at the idea.
                        </h2>
                        <p className="text-stone-300/90 leading-[1.9]">
                            If I am going to stay beside a team for a year, the quality of the
                            founder matters more than how attractive the idea is. Over these eight
                            weeks I am looking for answers to these questions:
                        </p>
                    </div>

                    <div className="max-w-2xl">
                        <ul className="text-xl md:text-2xl font-bold leading-relaxed space-y-0">
                            {LENS_QUESTIONS.map((q, i) => (
                                <li key={i} className="py-4 border-b border-white/10 last:border-0">{q}</li>
                            ))}
                        </ul>
                        <p className="mt-8 text-stone-300/80 leading-[1.9]">
                            I wrote these on the channel at the time too — even if you never work
                            with me, they are a good starting point on your own.
                        </p>
                    </div>
                </div>
            </section>

            {/* ─── Who it is for ────────────────────────────────────── */}
            <section className="px-6 py-20">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20">
                    <div className="space-y-5">
                        <h2 className="text-2xl font-black text-[#111827]">Come, if…</h2>
                        <ul className="space-y-3.5 text-lg leading-[1.9] text-stone-700">
                            <li>You are at idea, validation or pre-MVP stage.</li>
                            <li>You have a clear idea but the path is not clear.</li>
                            <li>You are ready to put your assumptions under question — really.</li>
                            <li>You work between the sessions, not only during them.</li>
                        </ul>
                    </div>
                    <div className="space-y-5">
                        <h2 className="text-2xl font-black text-stone-400">Do not come, if…</h2>
                        <ul className="space-y-3.5 text-lg leading-[1.9] text-stone-500">
                            <li>You are after a certificate or a motivational session.</li>
                            <li>You expect a mentor to bring you customers.</li>
                            <li>You only want someone to approve your idea.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ─── Photos ───────────────────────────────────────────── */}
            <section className="px-6 py-20 bg-[#f6f3ec] border-y border-stone-200/70">
                <div className="max-w-5xl mx-auto">
                    <div className="max-w-2xl mb-10 space-y-4">
                        <h2 className="text-3xl font-black text-[#111827]">I actually do this work.</h2>
                        <p className="text-stone-600 leading-[1.9]">
                            Not an online course recorded once. For several years I have done this
                            beside teams — in the weekly session, in the York Region council
                            chamber, and behind a microphone.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[9rem] md:auto-rows-[11rem] gap-3">
                        {PHOTOS.map((p) => (
                            <figure key={p.src} className={`relative rounded-2xl overflow-hidden bg-stone-300 group ${p.span ?? ""}`}>
                                <Image
                                    src={p.src}
                                    alt={p.alt}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                                <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs md:text-sm text-white font-medium bg-gradient-to-t from-black/75 via-black/40 to-transparent pt-10">
                                    {p.caption}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Perk partners ────────────────────────────────────── */}
            <section className="px-6 py-20">
                <div className="max-w-5xl mx-auto">
                    <Link
                        href="/lab/perks"
                        className="group flex flex-wrap items-center justify-between gap-6 bg-[#1B4B43] text-white rounded-3xl p-8 md:p-10 transition-colors duration-300 hover:bg-[#123730]"
                    >
                        <div className="flex items-start gap-4 max-w-2xl">
                            <span className="w-11 h-11 shrink-0 bg-white/15 rounded-full flex items-center justify-center">
                                <Gift className="w-5 h-5" />
                            </span>
                            <div className="space-y-1.5">
                                <h2 className="font-black text-xl md:text-2xl">Are you a company, not a founder?</h2>
                                <p className="text-emerald-100/90 leading-[1.9]">
                                    Offer a perk to the Astaneh teams — infrastructure credits, tool
                                    access, an advisory session — and get real users with honest,
                                    structured feedback. No equity, no cost.
                                </p>
                            </div>
                        </div>
                        <span className="inline-flex items-center gap-2 font-bold border-b-2 border-[#D97706] pb-0.5 whitespace-nowrap">
                            Perk partners
                            <ArrowDown className="w-4 h-4 -rotate-90 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>
            </section>

            {/* ─── Application form ─────────────────────────────────── */}
            <section id="apply" className="px-6 pb-28 scroll-mt-24">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 bg-[#1B4B43] text-white rounded-2xl p-6 md:p-8 flex items-start gap-4">
                        <div className="w-10 h-10 shrink-0 bg-white/15 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                            <p className="font-black text-lg md:text-xl">Cohort one — Astaneh — is closed</p>
                            <p className="text-emerald-100/90 leading-[1.9]">
                                Five teams were accepted and the work has started. If you fill in the
                                form below, you will be among my priorities for the next cohort — when
                                it opens, you will hear from me first.
                            </p>
                        </div>
                    </div>

                    <div className="mb-10 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-[#111827]">Apply for the next cohort</h2>
                        <p className="text-lg text-stone-600 leading-[1.9] max-w-xl">
                            It takes five minutes, and an honest answer matters more than a complete
                            one. When the next cohort opens these forms are reviewed first — this is
                            not the final application.
                        </p>
                    </div>

                    <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-10 shadow-[0_2px_16px_-6px_rgba(28,25,23,0.1)]">
                        <ApplicationForm locale="en" />
                    </div>

                    <div className="mt-14 flex flex-col items-center gap-4">
                        <Image
                            src="/images/logo-lockup.png"
                            alt="Farjad Pourmohammad — AI Strategist"
                            width={997}
                            height={821}
                            className="w-60 max-w-full"
                        />
                        <p className="text-sm text-stone-400 text-center">
                            Cohort ’26 · Toronto / Online ·{" "}
                            <a href="mailto:its@farjadp.info" className="underline hover:text-[#1B4B43] transition-colors" dir="ltr">
                                its@farjadp.info
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
