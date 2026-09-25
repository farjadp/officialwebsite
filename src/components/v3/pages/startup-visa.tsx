// ============================================================================
// File Path: src/components/v3/pages/startup-visa.tsx
// Why: /services/startup-visa and /fa/services/startup-visa in the v3 "Light"
//      look, one component for both locales so they cannot drift apart. The
//      copy is the pages' own, carried over word for word from the v2 files;
//      only the look changed. Decorative icons, the grid/noise backgrounds and
//      the colour blocks were dropped. The closing block stays the shared
//      <ServiceCta />.
//      Fixed on the way: the English "Back to Services" link was a hardcoded
//      "/services"; every internal link now goes through localePath.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import Link from "next/link"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { ServiceCta } from "@/components/public/service-cta"
import {
  Arrow,
  Card,
  Checklist,
  Chip,
  Headline,
  Kicker,
  LightRule,
  PageHero,
  Reveal,
  Section,
  V3Page,
} from "@/components/v3/kit"

const WRAP = "mx-auto w-full max-w-[1600px] px-5 md:px-10 lg:px-14"

type Copy = {
  back: string
  hero: { kicker: string; title: string; accent: string; lead: string; body: string }
  misconception: {
    title: string
    notFor: string
    excluded: string[]
    quote: string
    quoteSource: string
    compareTitle: string
    applicantsLabel: string
    applicantsQuote: string
    tags: string[]
  }
  rejected: { title: string; lead: string; items: { title: string; desc: string }[] }
  hidden: {
    title: string
    mythTitle: string
    myth: string[]
    realityTitle: string
    reality: ReactNode[]
    work: { pre: string; accent: string; post: string }
  }
  steps: { title: string; lead: ReactNode; items: { n: string; title: string; body: ReactNode; key?: boolean }[] }
  clear: {
    title: string
    not: string
    isTitle: string
    isBody: string
    gains: string[]
    patternsTitle: string
    cases: { title: string; body: string; outcome: string; tag?: string }[]
  }
  audience: { yesTitle: string; yes: string[]; noTitle: string; no: string[]; note: string }
  reality: { title: string; questions: string[]; warning: string; quote: string; ask: string }
}

const B = ({ children }: { children: ReactNode }) => <strong className="font-semibold text-v3-bone">{children}</strong>

const COPY: Record<Locale, Copy> = {
  en: {
    back: "Back to Services",
    hero: {
      kicker: "Startup Visa Strategy",
      title: "Why Most SUV Applications",
      accent: "Fail Before They Start.",
      lead: "Most people think the Canada Startup Visa is about paperwork. It’s not.",
      body: "It’s about building a business case strong enough to survive scrutiny. Immigration officers don't reject forms. They reject weak businesses.",
    },
    misconception: {
      title: 'The Program Is Not Designed For You to "Just Get In."',
      notFor: "Not for",
      excluded: ["Passive investors", "Template startups", "Copied business models"],
      quote: '"The Startup Visa program targets innovative, scalable businesses that can compete globally."',
      quoteSource: "— Government of Canada (IRCC)",
      compareTitle: "Applicant Reality vs. IRCC Expectation",
      applicantsLabel: "What Applicants Do:",
      applicantsQuote: '"I need an idea... I need an incubator... I need documents."',
      tags: ["Generic", "Local", "Weak Execution"],
    },
    rejected: {
      title: "Why Applications Get Rejected",
      lead: "Based on real patterns, not theory. This is where the filter catches you.",
      items: [
        { title: "Weak Business Logic", desc: "Ideas that sound good but don’t survive basic questioning." },
        { title: "Market Ignorance", desc: "No clear answer to 'Who is the customer?' and 'Why would they switch?'" },
        { title: "Over-Engineered Decks", desc: "Visually polished pitch decks that are strategically completely empty." },
        { title: "Incubator Misalignment", desc: "Founders blindly applying to the wrong designated organizations." },
        { title: "Credibility Gap", desc: "Zero logical connection between the founder’s background and the new business idea." },
      ],
    },
    hidden: {
      title: "The Hidden Reality of SUV",
      mythTitle: "The Myth (How people think it works)",
      myth: ["1. Build a pitch deck", "2. Apply to an incubator", "3. Get Approved"],
      realityTitle: "The Reality",
      reality: [
        "1. Validate business logic",
        "2. Align with the RIGHT incubator",
        "3. Pass REAL evaluation",
        "4. Then move forward",
      ],
      work: { pre: "The real work happens ", accent: "before", post: " the application." },
    },
    steps: {
      title: "What We Actually Do",
      lead: (
        <>
          This is not document preparation. This is <B>pre-approval strategy design.</B>
        </>
      ),
      items: [
        {
          n: "1.",
          title: "Concept Validation Against SUV Criteria",
          body: "We evaluate innovation level, scalability potential, and global market relevance. Not based on our opinion — based on what incubators actually accept.",
        },
        {
          n: "2.",
          title: "Founder–Startup Alignment",
          body: "One of the most ignored factors. We ask: Why YOU for THIS business? Does your background support this idea? Misalignment is the fastest way to get rejected.",
        },
        {
          n: "3.",
          title: "Incubator Targeting Strategy",
          body: "Not all designated organizations are the same. We match based on industry focus, risk tolerance, and evaluation style. Applying blindly reduces your chances to zero.",
          key: true,
        },
        {
          n: "4.",
          title: "Business Case Structuring",
          body: "Where most fail. We build clear problem-solution logic, realistic market positioning, and a credible growth narrative. No buzzwords. No inflated claims.",
        },
        {
          n: "5.",
          title: "Interview Preparation",
          body: "Getting attention is one thing. Passing evaluation is another. We prepare you for tough questions, logical gaps, and real-time pressure.",
        },
      ],
    },
    clear: {
      title: "Let's be very clear.",
      not: "This is NOT immigration consulting. This is NOT legal advice. This is NOT a document filing service.",
      isTitle: "This is Business Strategy",
      isBody: "designed exclusively for the high-stakes standard of immigration context.",
      gains: ["Stronger logic", "Higher probability", "Credible global positioning"],
      patternsTitle: "Real Patterns We See",
      cases: [
        { title: "Case 1: No Idea", body: "They want “any startup” to get PR.", outcome: "→ Wrong approach. Denied." },
        { title: "Case 2: Weak Idea", body: "They have something — but it’s not scalable.", outcome: "→ Needs massive restructuring." },
        {
          title: "Case 3: Strong Idea",
          tag: "Common",
          body: "Good foundation, but terrible presentation & positioning.",
          outcome: "→ Needs clarity, focus and alignment.",
        },
      ],
    },
    audience: {
      yesTitle: "Who This Is For",
      yes: [
        "Founders serious about building a real startup",
        "Applicants treating SUV as a business entry",
        "Teams preparing for deep incubator evaluation",
      ],
      noTitle: "Who This Is Not For",
      no: ["People looking for shortcuts to PR", 'Those who want "template-based" applications', "Passive investors with zero involvement"],
      note: "The SUV program is not designed for shortcuts.",
    },
    reality: {
      title: "A Simple Reality Check",
      questions: [
        "Is my idea truly scalable — or just 'good' locally?",
        "Can I defend my business logic under harsh pressure?",
        "Do I understand my global target market clearly?",
        "Am I building a company — or just an application?",
      ],
      warning: "If these answers are unclear, your risk of rapid rejection is high.",
      quote: '"I’ve seen too many people treat this program like a transaction. It’s not. It’s a filter."',
      ask: "Are you building something real — or just trying to pass?",
    },
  },
  fa: {
    back: "بازگشت به خدمات",
    hero: {
      kicker: "استراتژی استارتاپ ویزا",
      title: "چرا بیشتر پرونده‌های استارتاپ ویزا",
      accent: "قبل از شروع شکست می‌خورند",
      lead: "بیشتر آدم‌ها فکر می‌کنند استارتاپ ویزای کانادا یعنی کاغذبازی. این‌طور نیست.",
      body: "موضوع ساختن بیزینس‌کیسی است که زیر ذره‌بین دوام بیاورد. افسر مهاجرت فرم را رد نمی‌کند. کسب‌وکار ضعیف را رد می‌کند.",
    },
    misconception: {
      title: "این برنامه برای «فقط وارد شدن» طراحی نشده است.",
      notFor: "نه برای",
      excluded: ["سرمایه‌گذار منفعل", "استارتاپ قالبی", "مدل کسب‌وکار کپی‌شده"],
      quote: "«برنامه‌ی استارتاپ ویزا کسب‌وکارهای نوآور و مقیاس‌پذیری را هدف گرفته که بتوانند در سطح جهانی رقابت کنند.»",
      quoteSource: "دولت کانادا (IRCC)",
      compareTitle: "واقعیت متقاضی در برابر انتظار IRCC",
      applicantsLabel: "متقاضی‌ها چه می‌کنند:",
      applicantsQuote: "«یک ایده لازم دارم... یک انکوباتور لازم دارم... مدارک لازم دارم.»",
      tags: ["کلیشه‌ای", "محلی", "اجرای ضعیف"],
    },
    rejected: {
      title: "چرا پرونده‌ها رد می‌شوند",
      lead: "بر پایه‌ی الگوهای واقعی، نه تئوری. فیلتر دقیقاً همین‌جا شما را می‌گیرد.",
      items: [
        { title: "منطق ضعیف کسب‌وکار", desc: "ایده‌هایی که خوب به گوش می‌رسند ولی جلوی ساده‌ترین سؤال دوام نمی‌آورند." },
        { title: "ناآشنایی با بازار", desc: "جواب روشنی برای «مشتری کیست؟» و «چرا باید عوض کند؟» وجود ندارد." },
        { title: "پیچ‌دک بیش از حد صیقلی", desc: "اسلایدهایی که از نظر بصری بی‌نقص‌اند و از نظر استراتژیک کاملاً خالی." },
        { title: "انتخاب اشتباه انکوباتور", desc: "بنیان‌گذارانی که کورکورانه به سازمان‌های نامرتبط درخواست می‌دهند." },
        { title: "شکاف اعتبار", desc: "هیچ ارتباط منطقی‌ای میان پیشینه‌ی بنیان‌گذار و ایده‌ی جدید وجود ندارد." },
      ],
    },
    hidden: {
      title: "واقعیت پنهان استارتاپ ویزا",
      mythTitle: "افسانه (تصور رایج از روند کار)",
      myth: ["۱. پیچ‌دک بساز", "۲. به انکوباتور درخواست بده", "۳. تأیید بگیر"],
      realityTitle: "واقعیت",
      reality: [
        "۱. اعتبارسنجی منطق کسب‌وکار",
        <>
          ۲. هم‌راستا شدن با انکوباتور <B>درست</B>
        </>,
        <>
          ۳. عبور از ارزیابی <B>واقعی</B>
        </>,
        "۴. و بعد حرکت به جلو",
      ],
      work: { pre: "کار اصلی ", accent: "قبل از", post: " درخواست انجام می‌شود." },
    },
    steps: {
      title: "دقیقاً چه کاری می‌کنیم",
      lead: (
        <>
          این آماده‌سازی مدارک نیست. این <B>طراحی استراتژی پیش از تأیید</B> است.
        </>
      ),
      items: [
        {
          n: "۱.",
          title: "اعتبارسنجی ایده در برابر معیارهای SUV",
          body: "سطح نوآوری، ظرفیت مقیاس‌پذیری و ارتباط با بازار جهانی را می‌سنجیم. نه بر اساس نظر ما، بر اساس چیزی که انکوباتورها واقعاً می‌پذیرند.",
        },
        {
          n: "۲.",
          title: "تناسب بنیان‌گذار با استارتاپ",
          body: (
            <>
              یکی از نادیده‌گرفته‌شده‌ترین عامل‌ها. می‌پرسیم: چرا <B>شما</B> برای <B>این</B> کسب‌وکار؟ آیا پیشینه‌تان پشتیبان این ایده
              است؟ ناهم‌خوانی سریع‌ترین راه رد شدن است.
            </>
          ),
        },
        {
          n: "۳.",
          title: "استراتژی هدف‌گیری انکوباتور",
          body: "سازمان‌های تعیین‌شده مثل هم نیستند. بر اساس تمرکز صنعتی، تحمل ریسک و سبک ارزیابی تطبیق می‌دهیم. درخواست کورکورانه شانس شما را صفر می‌کند.",
          key: true,
        },
        {
          n: "۴.",
          title: "ساختاردهی بیزینس‌کیس",
          body: "جایی که بیشترشان می‌بازند. منطق روشن مسئله و راه‌حل، جایگاه واقع‌گرایانه در بازار و روایت رشدی باورپذیر می‌سازیم. بدون واژه‌های پرطمطراق و ادعای بادکرده.",
        },
        {
          n: "۵.",
          title: "آماده‌سازی مصاحبه",
          body: "جلب توجه یک چیز است و عبور از ارزیابی چیز دیگر. شما را برای سؤال‌های سخت، شکاف‌های منطقی و فشار لحظه‌ای آماده می‌کنیم.",
        },
      ],
    },
    clear: {
      title: "کاملاً روشن بگویم.",
      not: "این مشاوره‌ی مهاجرت نیست. مشاوره‌ی حقوقی نیست. خدمات تنظیم و ارسال مدارک هم نیست.",
      isTitle: "این استراتژی کسب‌وکار است",
      isBody: "که اختصاصاً برای استاندارد پرریسک فضای مهاجرت طراحی شده است.",
      gains: ["منطق محکم‌تر", "احتمال بالاتر", "جایگاه جهانی باورپذیر"],
      patternsTitle: "الگوهایی که واقعاً می‌بینیم",
      cases: [
        { title: "مورد ۱: بدون ایده", body: "«هر استارتاپی» می‌خواهند تا اقامت بگیرند.", outcome: "← رویکرد غلط. رد می‌شود." },
        { title: "مورد ۲: ایده‌ی ضعیف", body: "چیزی دارند، ولی مقیاس‌پذیر نیست.", outcome: "← بازسازی اساسی لازم دارد." },
        {
          title: "مورد ۳: ایده‌ی قوی",
          tag: "پرتکرار",
          body: "پایه‌ی خوبی دارد، ولی ارائه و جایگاه‌سازی‌اش افتضاح است.",
          outcome: "← به شفافیت، تمرکز و هم‌راستایی نیاز دارد.",
        },
      ],
    },
    audience: {
      yesTitle: "این کار برای چه کسی است",
      yes: [
        "بنیان‌گذارانی که جدی دنبال ساختن استارتاپ واقعی‌اند",
        "متقاضیانی که SUV را ورود به کسب‌وکار می‌بینند",
        "تیم‌هایی که خود را برای ارزیابی عمیق انکوباتور آماده می‌کنند",
      ],
      noTitle: "این کار برای چه کسی نیست",
      no: ["کسانی که دنبال میان‌بر برای اقامت هستند", "کسانی که پرونده‌ی «قالبی» می‌خواهند", "سرمایه‌گذاران منفعل بدون هیچ درگیری"],
      note: "برنامه‌ی استارتاپ ویزا برای میان‌بر طراحی نشده است.",
    },
    reality: {
      title: "یک محک ساده‌ی واقعیت",
      questions: [
        "ایده‌ام واقعاً مقیاس‌پذیر است یا فقط در سطح محلی «خوب» است؟",
        "می‌توانم زیر فشار سخت از منطق کسب‌وکارم دفاع کنم؟",
        "بازار هدف جهانی‌ام را شفاف می‌شناسم؟",
        "دارم شرکت می‌سازم یا فقط یک پرونده؟",
      ],
      warning: "اگر این جواب‌ها روشن نیست، احتمال رد شدن سریع پرونده‌تان بالاست.",
      quote: "«آدم‌های زیادی را دیده‌ام که با این برنامه مثل یک معامله برخورد می‌کنند. معامله نیست. فیلتر است.»",
      ask: "دارید چیز واقعی می‌سازید، یا فقط می‌خواهید رد شوید؟",
    },
  },
}

/** A card without a link that still lifts on hover. */
const LIFT = "transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise"

export function StartupVisa({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const href = (p: string) => localePath(locale, p)

  return (
    <V3Page>
      {/* ── Back ────────────────────────────────────────────────────── */}
      <nav className={`${WRAP} pt-8`}>
        <Link
          href={href("/services")}
          className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-v3-line px-4 py-2 text-sm text-v3-soft transition-colors duration-300 hover:border-v3-light hover:text-v3-light"
        >
          <Arrow
            locale={locale}
            className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
          />
          {t.back}
        </Link>
      </nav>

      <PageHero
        kicker={t.hero.kicker}
        title={t.hero.title}
        accent={t.hero.accent}
        lead={
          <>
            <span className="block text-v3-bone">{t.hero.lead}</span>
            <span className="mt-3 block">{t.hero.body}</span>
          </>
        }
      />

      {/* ── The misconception ───────────────────────────────────────── */}
      <Section className="bg-v3-raise" title={t.misconception.title}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-10 lg:col-span-7">
            <div className="grid gap-3 sm:grid-cols-3">
              {t.misconception.excluded.map((item, i) => (
                <Reveal key={item} delay={i * 0.08}>
                  <div className="flex h-full items-center gap-3 rounded-2xl border border-v3-line/80 bg-v3-ink px-5 py-4 text-v3-soft">
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-v3-mute/60" />
                    <span className="text-sm">
                      {t.misconception.notFor} {item}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <figure className="border-s-2 border-v3-light ps-6">
                <blockquote className="font-v3-display text-2xl font-light leading-snug text-v3-bone md:text-3xl rtl:leading-relaxed">
                  {t.misconception.quote}
                </blockquote>
                <figcaption className="mt-4 text-sm text-v3-mute">{t.misconception.quoteSource}</figcaption>
              </figure>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="flex flex-col gap-5 lg:col-span-5">
            <Headline as="h3" size="card" className="border-b border-v3-line/70 pb-5 text-v3-soft">
              {t.misconception.compareTitle}
            </Headline>
            <Card className="bg-v3-ink">
              <span className="text-sm text-v3-light">{t.misconception.applicantsLabel}</span>
              <p className="text-xl leading-relaxed text-v3-soft ltr:italic rtl:leading-loose">{t.misconception.applicantsQuote}</p>
              <div className="flex flex-wrap gap-2">
                {t.misconception.tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── Why applications get rejected ───────────────────────────── */}
      <Section title={t.rejected.title} lead={t.rejected.lead}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.rejected.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <Card className={LIFT}>
                <span className="font-v3-display text-lg text-v3-mute">{`0${i + 1}`}</span>
                <Headline as="h3" size="card">
                  {item.title}
                </Headline>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{item.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── The hidden reality ──────────────────────────────────────── */}
      <Section title={t.hidden.title}>
        <div className="grid gap-5 md:grid-cols-2 md:items-start">
          <Reveal>
            <Card>
              <span className="text-sm text-v3-mute">{t.hidden.mythTitle}</span>
              <ol className="flex flex-col">
                {t.hidden.myth.map((step) => (
                  <li key={step} className="border-b border-v3-line/60 py-4 text-lg text-v3-mute last:border-b-0">
                    {step}
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
          <Reveal delay={0.12} className="md:-mt-4">
            <Card tone="lit">
              <span className="text-sm text-v3-light">{t.hidden.realityTitle}</span>
              <Checklist items={t.hidden.reality} />
            </Card>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-14 md:mt-20">
          <p className="max-w-4xl font-v3-display text-3xl font-light leading-tight md:text-5xl rtl:leading-snug">
            {t.hidden.work.pre}
            <em className="text-v3-light not-italic ltr:italic">{t.hidden.work.accent}</em>
            {t.hidden.work.post}
          </p>
        </Reveal>
      </Section>

      {/* ── What we actually do ─────────────────────────────────────── */}
      <Section title={t.steps.title} lead={t.steps.lead}>
        <LightRule>
          <ol className="flex flex-col">
            {t.steps.items.map((step) => (
              <li
                key={step.title}
                className="relative grid grid-cols-[4.5rem_1fr] gap-6 border-b border-v3-line/50 py-8 last:border-b-0 md:grid-cols-[7.5rem_1fr] md:gap-10"
              >
                <span
                  className={`font-v3-display text-2xl tabular-nums md:text-3xl ${step.key ? "text-v3-light" : "text-v3-mute"}`}
                >
                  {step.n}
                </span>
                <span
                  aria-hidden
                  className={`absolute start-[4.5rem] top-[2.9rem] h-2 w-2 -translate-x-1/2 rounded-full ring-1 ring-v3-light md:start-[7.5rem] rtl:translate-x-1/2 ${
                    step.key ? "bg-v3-light" : "bg-v3-ink"
                  }`}
                />
                <Reveal className="flex flex-col gap-3 ps-6 md:ps-10">
                  <Headline as="h3" size="card" className={step.key ? "text-v3-light" : undefined}>
                    {step.title}
                  </Headline>
                  <p className="max-w-3xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{step.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </LightRule>
      </Section>

      {/* ── Let's be clear ──────────────────────────────────────────── */}
      <Section className="bg-v3-raise">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col gap-8">
            <Headline>{t.clear.title}</Headline>
            <p className="max-w-xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.clear.not}</p>
            <Card tone="lit" className="bg-v3-ink">
              <p className="font-v3-display text-2xl text-v3-light md:text-3xl">{t.clear.isTitle}</p>
              <p className="leading-relaxed text-v3-soft rtl:leading-loose">{t.clear.isBody}</p>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              {t.clear.gains.map((g, i) => (
                <div
                  key={g}
                  className={`flex items-center gap-3 rounded-2xl border border-v3-line/80 bg-v3-ink px-5 py-4 text-v3-bone ${
                    i === 2 ? "col-span-2" : ""
                  }`}
                >
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" />
                  {g}
                </div>
              ))}
            </div>
          </Reveal>

          <div className="flex flex-col gap-4">
            <Reveal>
              <Kicker className="mb-2">{t.clear.patternsTitle}</Kicker>
            </Reveal>
            {t.clear.cases.map((c, i) => (
              <Reveal key={c.title} delay={0.08 + i * 0.08}>
                <Card tone={c.tag ? "lit" : "plain"} className={`gap-3 bg-v3-ink ${LIFT}`}>
                  <div className="flex items-center justify-between gap-3 border-b border-v3-line/70 pb-3">
                    <span className="font-v3-display text-xl">{c.title}</span>
                    {c.tag && <Chip className="border-v3-light/50 text-v3-light">{c.tag}</Chip>}
                  </div>
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">{c.body}</p>
                  <p className={`text-sm font-medium ${c.tag ? "text-v3-light" : "text-v3-mute"}`}>{c.outcome}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Audience ────────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card tone="lit">
              <Headline as="h2" size="card" className="border-b border-v3-line/70 pb-5">
                {t.audience.yesTitle}
              </Headline>
              <Checklist items={t.audience.yes} />
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card>
              <Headline as="h2" size="card" className="border-b border-v3-line/70 pb-5 text-v3-soft">
                {t.audience.noTitle}
              </Headline>
              <Checklist items={t.audience.no} tone="no" />
              <p className="mt-auto rounded-xl border border-v3-line/80 bg-v3-raise px-5 py-4 text-sm font-medium text-v3-bone">
                {t.audience.note}
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── Reality check ───────────────────────────────────────────── */}
      <Section title={t.reality.title} bordered={false}>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.reality.questions.map((q, i) => (
            <Reveal key={q} delay={(i % 2) * 0.08 + Math.floor(i / 2) * 0.08}>
              <Card className={LIFT}>
                <span className="font-v3-display text-lg text-v3-light">{`0${i + 1}`}</span>
                <p className="text-lg font-medium leading-relaxed text-v3-bone rtl:leading-loose">{q}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex max-w-4xl flex-col gap-8 border-t border-v3-line/70 pt-16">
          <Reveal>
            <p className="text-xl leading-relaxed text-v3-mute rtl:leading-loose">{t.reality.warning}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <blockquote className="font-v3-display text-3xl font-light leading-snug text-v3-bone md:text-5xl ltr:italic rtl:leading-relaxed">
              {t.reality.quote}
            </blockquote>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="inline-block rounded-2xl border border-v3-light/50 px-6 py-4 text-xl font-semibold text-v3-light md:text-2xl">
              {t.reality.ask}
            </p>
          </Reveal>
        </div>
      </Section>

      <ServiceCta locale={locale} />
    </V3Page>
  )
}
