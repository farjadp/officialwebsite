// ============================================================================
// File Path: src/components/v3/pages/work.tsx
// Why: /work and /fa/work in the v3 "Light" look, one component for both
//      locales so they cannot drift apart. The copy is the pages' own,
//      carried over word for word from the v2 files; only the look changed.
//      Fixed on the way:
//        - the Persian "Library" venture linked to "/" (the English home);
//          internal links now go through localePath.
//        - two ventures had `link: "#"`, a "View Project" link to nowhere;
//          the link is shown only when there is somewhere to go.
//        - the English footer linked /essays, which only exists as a
//          redirect to /blog; it now links /blog directly. There is no
//          Persian blog (see hasRoute in lib/nav), so /fa/work keeps
//          pointing at the English /blog, as it did before.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { hasRoute, localePath } from "@/lib/nav"
import {
  Card,
  Chip,
  CtaBand,
  Headline,
  LightRule,
  PageHero,
  Reveal,
  Section,
  V3Button,
  V3Page,
} from "@/components/v3/kit"

type Venture = {
  id: number
  role: string
  name: string
  year: string
  description: string
  tags: string[]
  status: string
  link: string
}
type PastProject = {
  id: number
  name: string
  role: string
  years: string
  outcome: string
  lesson: string
  status: string
}
type Experiment = { title: string; type: string; desc: string }

type Copy = {
  kicker: string
  title: string
  accent: string
  lead: [string, string]
  ventures: { title: string; note: string; view: string }
  archive: { title: string; note: string; outcome: string; lesson: string }
  advisory: { title: string; body: string; items: { title: string; body: string }[] }
  lab: { title: string }
  closing: { title: string; cta: string }
  // ------------------------------------------------------------------------
  // UNVERIFIED MOCK DATA. The v2 source labelled these arrays
  // "// --- Mock Data ---". They are carried over unchanged, but the owner
  // has not confirmed them: the names, years, outcomes and the
  // "Farjad.co (The Library)" venture (a domain the owner may not use) all
  // need checking before this page is trusted.
  // ------------------------------------------------------------------------
  activeVentures: Venture[]
  pastProjects: PastProject[]
  experiments: Experiment[]
}

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "The Ledger",
    title: "What I actually",
    accent: "work on.",
    lead: [
      "This is not a trophy room. I don't list every coffee chat or advisory call as a \"project.\"",
      "This page is a log of my active ventures, my past lessons, and the experiments I am running right now. It is the evidence that I build real things, not just talk about them.",
    ],
    ventures: { title: "Active Ventures", note: "/// Current Focus", view: "View Project" },
    archive: { title: "Selected Archive", note: "/// Lessons Learned", outcome: "Outcome", lesson: "The Lesson" },
    advisory: {
      title: "Advisory Work",
      body: "My project experience directly informs my mentoring. I don't give advice from a textbook; I give advice from the trenches.",
      items: [
        {
          title: "Startup Visa & Immigration",
          body: "Advising founders on aligning their business model with immigration compliance. Moving from \"fake traction\" to real revenue.",
        },
        {
          title: "Small Business Modernization",
          body: "Helping traditional owners understand that AI is not magic—it's just a better way to handle data and operations.",
        },
      ],
    },
    lab: { title: "Experiments & Small Bets" },
    closing: { title: "Everything I learn in these projects ends up in my essays.", cta: "Read the Essays" },

    // --- Mock Data (unverified): Active Ventures ---
    activeVentures: [
      {
        id: 1,
        role: "Founder & Lead Mentor",
        name: "The Immigrant Founder's Circle",
        year: "2023 — Present",
        description: "A private mentorship program for founders navigating the Canadian startup ecosystem.",
        tags: ["Education", "Community"],
        status: "Scaling",
        link: "#",
      },
      {
        id: 2,
        role: "Principal Consultant",
        name: "SME Digital Systems",
        year: "2022 — Present",
        description: "Helping traditional small businesses transition from paper/chaos to digital workflows and AI.",
        tags: ["Consulting", "Automation"],
        status: "Active",
        link: "#",
      },
      {
        id: 3,
        role: "Writer & Creator",
        name: "Farjad.co (The Library)",
        year: "2021 — Present",
        description: "This content hub. A personal library of mental models, essays, and frameworks for builders.",
        tags: ["Media", "Writing"],
        status: "Ongoing",
        link: "/",
      },
    ],
    // --- Mock Data (unverified): Past Projects ---
    pastProjects: [
      {
        id: 101,
        name: "Tehran Tech Events",
        role: "Co-Organizer",
        years: "2016 — 2019",
        outcome: "Built a community of 500+ developers.",
        lesson: "Learned that community is about consistency, not venue size.",
        status: "Completed",
      },
      {
        id: 102,
        name: "Project 'Alpha' SaaS",
        role: "Co-Founder",
        years: "2018 — 2020",
        outcome: "Failed to find PMF. Closed after 18 months.",
        lesson: "Learned that 'cool tech' does not equal a 'business problem'.",
        status: "Sunsetted", // Honest language
      },
    ],
    // --- Mock Data (unverified): Experiments ---
    experiments: [
      { title: "AI for Visa Docs", type: "Prototype", desc: "Testing LLMs for summarizing legal jargon." },
      { title: "The 3-Minute Journal", type: "Content Series", desc: "A framework for busy founders." },
      { title: "No-Code CRM", type: "Tool", desc: "Template for service agencies." },
    ],
  },
  fa: {
    kicker: "دفتر کل",
    title: "واقعاً روی چه چیزی",
    accent: "کار می‌کنم",
    lead: [
      "اینجا ویترین جایزه نیست. هر گپ سر قهوه یا تماس مشاوره‌ای را «پروژه» حساب نمی‌کنم.",
      "این صفحه گزارش کسب‌وکارهای فعال، درس‌های گذشته و آزمایش‌هایی است که همین حالا در جریان‌اند. مدرکی است بر اینکه چیز واقعی می‌سازم، نه فقط درباره‌اش حرف می‌زنم.",
    ],
    ventures: { title: "کسب‌وکارهای فعال", note: "/// تمرکز فعلی", view: "مشاهده‌ی پروژه" },
    archive: { title: "آرشیو منتخب", note: "/// درس‌های گرفته‌شده", outcome: "نتیجه", lesson: "درس" },
    advisory: {
      title: "کار مشاوره‌ای",
      body: "تجربه‌ی پروژه‌هایم مستقیماً به منتورشیپم شکل می‌دهد. از روی کتاب درسی نصیحت نمی‌کنم؛ از داخل سنگر حرف می‌زنم.",
      items: [
        {
          title: "استارتاپ ویزا و مهاجرت",
          body: "مشاوره به بنیان‌گذاران برای هم‌راستا کردن مدل کسب‌وکارشان با الزامات مهاجرتی. حرکت از «تراکشن ساختگی» به درآمد واقعی.",
        },
        {
          title: "نوسازی کسب‌وکارهای کوچک",
          body: "کمک به صاحبان سنتی کسب‌وکار تا بفهمند هوش مصنوعی جادو نیست، فقط راه بهتری برای اداره‌ی داده و عملیات است.",
        },
      ],
    },
    lab: { title: "آزمایش‌ها و شرط‌های کوچک" },
    closing: { title: "هرچه در این پروژه‌ها یاد می‌گیرم سر از یادداشت‌هایم درمی‌آورد.", cta: "یادداشت‌ها را بخوانید" },

    // --- Mock Data (unverified): Active Ventures ---
    activeVentures: [
      {
        id: 1,
        role: "بنیان‌گذار و منتور ارشد",
        name: "حلقه‌ی بنیان‌گذاران مهاجر",
        year: "۲۰۲۳ تا امروز",
        description: "یک برنامه‌ی منتورشیپ خصوصی برای بنیان‌گذارانی که در اکوسیستم استارتاپی کانادا مسیرشان را پیدا می‌کنند.",
        tags: ["آموزش", "اجتماع"],
        status: "در حال رشد",
        link: "#",
      },
      {
        id: 2,
        role: "مشاور ارشد",
        name: "سیستم‌های دیجیتال کسب‌وکارهای کوچک",
        year: "۲۰۲۲ تا امروز",
        description: "کمک به کسب‌وکارهای کوچک سنتی برای عبور از کاغذ و آشوب به گردش‌کار دیجیتال و هوش مصنوعی.",
        tags: ["مشاوره", "خودکارسازی"],
        status: "فعال",
        link: "#",
      },
      {
        id: 3,
        role: "نویسنده و سازنده",
        name: "کتابخانه‌ی فرجاد",
        year: "۲۰۲۱ تا امروز",
        description: "همین مرکز محتوا. کتابخانه‌ای شخصی از مدل‌های ذهنی، یادداشت‌ها و چارچوب‌ها برای سازندگان.",
        tags: ["رسانه", "نوشتن"],
        status: "در جریان",
        link: "/",
      },
    ],
    // --- Mock Data (unverified): Past Projects ---
    pastProjects: [
      {
        id: 101,
        name: "رویدادهای فناوری تهران",
        role: "هم‌برگزارکننده",
        years: "۲۰۱۶ تا ۲۰۱۹",
        outcome: "ساختن اجتماعی با بیش از ۵۰۰ توسعه‌دهنده.",
        lesson: "یاد گرفتم اجتماع را استمرار می‌سازد، نه بزرگی سالن.",
        status: "تمام‌شده",
      },
      {
        id: 102,
        name: "پروژه‌ی SaaS «آلفا»",
        role: "هم‌بنیان‌گذار",
        years: "۲۰۱۸ تا ۲۰۲۰",
        outcome: "به تناسب محصول و بازار نرسید. بعد از ۱۸ ماه تعطیل شد.",
        lesson: "یاد گرفتم «فناوری باحال» با «مسئله‌ی کسب‌وکار» یکی نیست.",
        status: "تعطیل‌شده", // Honest language
      },
    ],
    // --- Mock Data (unverified): Experiments ---
    experiments: [
      { title: "هوش مصنوعی برای مدارک ویزا", type: "نمونه‌ی اولیه", desc: "آزمودن مدل‌های زبانی برای خلاصه کردن زبان حقوقی." },
      { title: "دفترچه‌ی سه‌دقیقه‌ای", type: "مجموعه‌ی محتوا", desc: "چارچوبی برای بنیان‌گذاران پرمشغله." },
      { title: "CRM بدون کدنویسی", type: "ابزار", desc: "قالبی برای آژانس‌های خدماتی." },
    ],
  },
}

export function WorkPage({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const blog = hasRoute("blog", locale) ? localePath(locale, "/blog") : "/blog"

  return (
    <V3Page>
      <PageHero
        kicker={t.kicker}
        title={t.title}
        accent={t.accent}
        lead={
          <>
            <span className="block">{t.lead[0]}</span>
            <span className="mt-4 block">{t.lead[1]}</span>
          </>
        }
      />

      {/* ── Active ventures ─────────────────────────────────────────── */}
      <Section kicker={t.ventures.note} title={t.ventures.title}>
        <div className="grid gap-5">
          {t.activeVentures.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.08}>
              <Card className="transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm text-v3-light">{v.role}</span>
                      <span className="text-sm tabular-nums text-v3-mute">{v.year}</span>
                    </div>
                    <Headline as="h3" size="card">{v.name}</Headline>
                  </div>
                  <Chip className="shrink-0 self-start border-v3-light/50 text-v3-light">{v.status}</Chip>
                </div>
                <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{v.description}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-v3-line/70 pt-5">
                  <div className="flex flex-wrap gap-2">
                    {v.tags.map((tag) => (
                      <Chip key={tag}>#{tag}</Chip>
                    ))}
                  </div>
                  {v.link !== "#" && (
                    <Link
                      href={localePath(locale, v.link)}
                      className="group/link inline-flex min-h-11 items-center gap-2 text-sm font-medium text-v3-light underline decoration-transparent underline-offset-8 transition-colors hover:decoration-v3-light"
                    >
                      {t.ventures.view}
                      <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                    </Link>
                  )}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Archive: a ledger of years ──────────────────────────────── */}
      <Section kicker={t.archive.note} title={t.archive.title}>
        <LightRule>
          <ol className="flex flex-col">
            {t.pastProjects.map((p) => (
              <li key={p.id} className="relative grid grid-cols-[4.5rem_1fr] gap-6 py-8 md:grid-cols-[7.5rem_1fr] md:gap-10">
                <span className="pe-3 text-sm leading-snug tabular-nums text-v3-mute md:text-base">{p.years}</span>
                <span
                  aria-hidden
                  className="absolute start-[4.5rem] top-[2.6rem] h-2 w-2 -translate-x-1/2 rounded-full bg-v3-ink ring-1 ring-v3-light md:start-[7.5rem] rtl:translate-x-1/2"
                />
                <Reveal className="flex flex-col gap-5 ps-6 md:ps-10">
                  <div className="flex flex-col gap-1">
                    <Headline as="h3" size="card">{p.name}</Headline>
                    <span className="text-sm text-v3-mute">{p.role}</span>
                  </div>
                  <div className="grid max-w-4xl gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-v3-mute">{t.archive.outcome}</span>
                      <p className="leading-relaxed text-v3-soft rtl:leading-loose">{p.outcome}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-v3-light">{t.archive.lesson}</span>
                      <p className="border-s border-v3-light/40 ps-4 italic leading-relaxed text-v3-bone rtl:not-italic rtl:leading-loose">
                        {locale === "fa" ? `«${p.lesson}»` : `"${p.lesson}"`}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </LightRule>
      </Section>

      {/* ── Advisory ────────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-5 lg:col-span-4">
            <Headline>{t.advisory.title}</Headline>
            <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.advisory.body}</p>
          </Reveal>
          <div className="flex flex-col gap-5 lg:col-span-8">
            {t.advisory.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <Card tone="raised" className="transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60">
                  <Headline as="h3" size="card">{item.title}</Headline>
                  <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ── The lab ─────────────────────────────────────────────────── */}
      <Section title={t.lab.title}>
        <div className="grid gap-5 md:grid-cols-3">
          {t.experiments.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.08}>
              <Card className="group transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise">
                <span className="text-sm text-v3-mute transition-colors group-hover:text-v3-light">{e.type}</span>
                <Headline as="h3" size="card">{e.title}</Headline>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{e.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        title={t.closing.title}
        action={
          <V3Button href={blog} locale={locale}>
            {t.closing.cta}
          </V3Button>
        }
      />
    </V3Page>
  )
}
