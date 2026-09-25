// ============================================================================
// File Path: src/components/v3/pages/founder-advisory.tsx
// Why: /services/founder-advisory and /fa/services/founder-advisory in the v3
//      "Light" look, one component for both locales so they cannot drift
//      apart. The copy is the pages' own, carried over word for word from the
//      v2 files; only the look changed. Decorative icons, grid/noise textures
//      and the coloured bento blocks were dropped.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
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
  PageHero,
  Reveal,
  Section,
  V3Button,
  V3Page,
} from "@/components/v3/kit"

/** A headline whose accent sits mid-sentence: lead + accent + tail. */
type Split = { lead: string; accent: string; tail: string }

type FocusArea = {
  title: string
  intro: string
  items: string[]
  note?: string
  statement?: string
}

type Copy = {
  back: string
  hero: { kicker: string; title: Split; line2: string; strong: string; body: string }
  problem: {
    title: Split
    body: ReactNode
    quote: string
    cite: string
    experience: string
    voice: string
    after: string
    trap: { kicker: string; title: string; body: string; avoidTitle: string; avoid: ReactNode[] }
  }
  what: { title: string; lead: ReactNode; areas: FocusArea[] }
  alone: { title: string; body: string; quote: string; cite: string }
  role: { kicker: string; not: string; struck: string; items: string[]; sharper: string }
  example: {
    chip: string
    title: string
    lead: string
    beforeTitle: string
    before: string[]
    doTitle: string
    steps: { n: string; text: ReactNode }[]
    resultTitle: string
    results: string[]
    quote: string
  }
  audience: { yesTitle: string; yes: string[]; noTitle: string; no: string[]; reqTitle: string; req: string }
  diagnostic: { title: string; questions: string[]; unclear: string; clarity: string; quote: string; close: string[] }
}

const COPY: Record<Locale, Copy> = {
  en: {
    back: "Back to Services",
    hero: {
      kicker: "Founder Strategic Advisory",
      title: { lead: "You don’t need ", accent: "better strategy.", tail: "" },
      line2: "You need clearer thinking.",
      strong: "Founders are not short on options. They are overwhelmed by them.",
      body: "After working with early-stage and growth-stage teams, one pattern keeps repeating: The issue is rarely lack of ideas. It’s the inability to make hard decisions under uncertainty.",
    },
    problem: {
      title: { lead: "Noise disguised as ", accent: "opportunity.", tail: "" },
      body: (
        <>
          At early stages, everything looks important: New features, new markets, new partnerships, new ideas every week. The problem is not lack of direction.{" "}
          <strong className="font-medium text-v3-bone">The problem is too many directions.</strong>
        </>
      ),
      quote: "\"Lack of focus is one of the top reasons startups fail.\"",
      cite: "— CB Insights",
      experience: "Most founders don’t experience this as \"lack of focus.\" They experience it as:",
      voice: "\"We're exploring options... we're being flexible... we don't want to miss opportunities.\"",
      after: "Which sounds reasonable — until it kills execution.",
      trap: {
        kicker: "The Founder's Trap",
        title: "Activity Over Clarity.",
        body: "When things feel uncertain, most founders increase activity: more meetings, more brainstorming, more experiments. But activity is not progress. It’s often avoidance.",
        avoidTitle: "Avoidance of making hard decisions like:",
        avoid: ["What NOT to build", "Who NOT to target", "Which direction to ignore"],
      },
    },
    what: {
      title: "What We Actually Do",
      lead: (
        <>
          Let&apos;s remove the vague definition. Advisory is not generic advice, motivational calls, or high-level &quot;vision talk.&quot;{" "}
          <strong className="font-medium text-v3-bone">It is structured thinking applied to real decisions.</strong>
        </>
      ),
      areas: [
        {
          title: "1. Problem Framing",
          intro: "Most founders try to solve the wrong problem. Before strategy, we define:",
          items: ["What is the real constraint?", "What actually matters right now?", "What is noise vs. signal?"],
        },
        {
          title: "2. Decision Clarity",
          intro: "Strategy is not a document. It is a series of decisions. We focus on:",
          items: ["Prioritization", "Trade-offs", "Sequencing"],
          note: "If everything is important, nothing gets done.",
        },
        {
          title: "3. Stress-Testing",
          intro: "Ideas sound good in isolation. They break under pressure. We test them:",
          items: ["Assumptions & Logic", "Revenue potential", "Scalability & Dependencies"],
          note: "Before the market does it for you.",
        },
        {
          title: "4. GTM Reality Check",
          intro: "Founders don’t fail in building. They fail in distribution. We answer:",
          items: ["Who actually buys?", "Why now?", "Through which channel?"],
          note: "Not in theory — in reality.",
        },
        {
          title: "5. Prioritization Frameworks",
          intro: "This is where execution changes. We introduce simple but strict frameworks to decide what to do now, what to delay, and what to ignore.",
          items: [],
          statement: "Strategy is as much about exclusion as it is about direction.",
        },
      ],
    },
    alone: {
      title: "Why you can't do this alone",
      body: "Because founders are too close to the problem. You are emotionally invested, cognitively overloaded, and biased by past decisions.",
      quote: "\"External perspective improves decision quality by reducing cognitive bias.\"",
      cite: "— MIT Sloan Management Review",
    },
    role: {
      kicker: "The Role of an Advisor",
      not: "Not to give answers.",
      struck: "To make thinking easier.",
      items: ["To challenge your assumptions", "To clarify your thinking", "To force hard decisions", "To remove illusions"],
      sharper: "To make thinking sharper.",
    },
    example: {
      chip: "A Simple Example",
      title: "Clarity In Action",
      lead: "What changes when you strip away the noise and focus on strategic realities.",
      beforeTitle: "Before: Confusion",
      before: ["3 conflicting product directions", "2 different target markets", "Unclear revenue model", "Constant debate, no execution"],
      doTitle: "What We Do",
      steps: [
        { n: "1.", text: "Define constraint (time, resources, reality)" },
        { n: "2.", text: "Eliminate weak directions instantly" },
        { n: "3.", text: "Focus on ONE highly viable GTM path" },
        { n: "4.", text: "Align execution completely around it" },
      ],
      resultTitle: "Result: Focus",
      results: ["Less confusion", "Faster decisions", "Clearer execution"],
      quote: "\"Founders don't become smarter. They become decisive.\"",
    },
    audience: {
      yesTitle: "Who This Is For",
      yes: [
        "Early-stage founders with too many options",
        "Teams stuck in endless decision loops",
        "Founders actively preparing for growth or fundraising",
        "People who feel 'busy but not moving forward'",
      ],
      noTitle: "Who This Is Not For",
      no: [
        "People looking for validation, not challenge",
        "Founders unwilling to make hard trade-offs",
        "Teams expecting ready-made answers on a silver platter",
      ],
      reqTitle: "Requirements:",
      req: "Honesty. Discipline. Execution.",
    },
    diagnostic: {
      title: "A Simple Diagnostic",
      questions: [
        "Can you clearly explain your priority for the next 30 days?",
        "Do you know exactly what you are NOT doing?",
        "Is your business model stress-tested — or assumed?",
        "Are your decisions reactive or intentional?",
      ],
      unclear: "If these answers are unclear, you don’t have a strategy problem.",
      clarity: "You have a clarity problem.",
      quote: "\"The founders who move forward are not the ones with the best ideas. They are the ones who make clear decisions — and commit to them.\"",
      close: ["Strategy is not about knowing more.", "It’s about choosing better."],
    },
  },
  fa: {
    back: "بازگشت به خدمات",
    hero: {
      kicker: "مشاوره‌ی استراتژیک بنیان‌گذار",
      title: { lead: "مشکل شما ", accent: "استراتژی بهتر", tail: " نیست." },
      line2: "فکر شفاف‌تر لازم دارید.",
      strong: "بنیان‌گذاران کمبود گزینه ندارند. زیر بار گزینه‌ها له شده‌اند.",
      body: "بعد از کار با تیم‌های مرحله‌ی اولیه و مرحله‌ی رشد، یک الگو مدام تکرار می‌شود: مسئله به‌ندرت کمبود ایده است. ناتوانی در گرفتن تصمیم سخت زیر سایه‌ی ابهام است.",
    },
    problem: {
      title: { lead: "نویزی که لباس ", accent: "فرصت", tail: " پوشیده است." },
      body: (
        <>
          در مراحل اولیه همه‌چیز مهم به نظر می‌رسد: قابلیت تازه، بازار تازه، شراکت تازه، و هر هفته ایده‌ی تازه. مشکل نبودِ جهت نیست.{" "}
          <strong className="font-medium text-v3-bone">مشکل زیادی بودنِ جهت‌هاست.</strong>
        </>
      ),
      quote: "«نبود تمرکز یکی از اصلی‌ترین دلایل شکست استارتاپ‌هاست.»",
      cite: "CB Insights",
      experience: "بیشتر بنیان‌گذاران این را «نبود تمرکز» نمی‌بینند. این‌طور تجربه‌اش می‌کنند:",
      voice: "«داریم گزینه‌ها را بررسی می‌کنیم... انعطاف داریم... نمی‌خواهیم فرصتی را از دست بدهیم.»",
      after: "منطقی به نظر می‌رسد، تا وقتی که اجرا را می‌کشد.",
      trap: {
        kicker: "تله‌ی بنیان‌گذار",
        title: "شلوغی به‌جای شفافیت.",
        body: "وقتی همه‌چیز مبهم می‌شود، بیشتر بنیان‌گذاران فعالیت را زیاد می‌کنند: جلسه‌ی بیشتر، طوفان فکری بیشتر، آزمایش بیشتر. ولی فعالیت پیشرفت نیست. اغلب فرار است.",
        avoidTitle: "فرار از تصمیم‌های سختی مثل:",
        avoid: [
          <>چه چیزی را <strong className="font-semibold">نسازیم</strong></>,
          <>سراغ چه کسی <strong className="font-semibold">نرویم</strong></>,
          "کدام جهت را نادیده بگیریم",
        ],
      },
    },
    what: {
      title: "دقیقاً چه کاری می‌کنیم",
      lead: (
        <>
          تعریف مبهم را کنار بگذاریم. مشاوره یعنی نصیحت کلی نیست، تماس انگیزشی نیست، و حرف‌های بلندپروازانه درباره‌ی «چشم‌انداز» هم نیست.{" "}
          <strong className="font-medium text-v3-bone">تفکر ساختارمند است که روی تصمیم‌های واقعی اعمال می‌شود.</strong>
        </>
      ),
      areas: [
        {
          title: "۱. قاب‌بندی مسئله",
          intro: "بیشتر بنیان‌گذاران سراغ حل مسئله‌ی اشتباه می‌روند. قبل از استراتژی، این‌ها را تعریف می‌کنیم:",
          items: ["محدودیت واقعی چیست؟", "همین حالا واقعاً چه چیزی مهم است؟", "کدام نویز است و کدام سیگنال؟"],
        },
        {
          title: "۲. شفافیت تصمیم",
          intro: "استراتژی یک سند نیست. زنجیره‌ای از تصمیم‌هاست. تمرکز ما روی این‌هاست:",
          items: ["اولویت‌بندی", "بده‌بستان‌ها", "ترتیب اجرا"],
          note: "اگر همه‌چیز مهم باشد، هیچ‌چیز انجام نمی‌شود.",
        },
        {
          title: "۳. تست فشار",
          intro: "ایده‌ها در خلأ خوب به نظر می‌رسند. زیر فشار می‌شکنند. آزمایششان می‌کنیم:",
          items: ["فرض‌ها و منطق", "پتانسیل درآمد", "مقیاس‌پذیری و وابستگی‌ها"],
          note: "قبل از اینکه بازار این کار را برایتان بکند.",
        },
        {
          title: "۴. محک واقعیت در ورود به بازار",
          intro: "بنیان‌گذاران در ساختن شکست نمی‌خورند. در توزیع شکست می‌خورند. به این‌ها جواب می‌دهیم:",
          items: ["واقعاً چه کسی می‌خرد؟", "چرا همین حالا؟", "از کدام کانال؟"],
          note: "نه در تئوری، در واقعیت.",
        },
        {
          title: "۵. چارچوب‌های اولویت‌بندی",
          intro: "اجرا از همین‌جا عوض می‌شود. چارچوب‌هایی ساده ولی سختگیر معرفی می‌کنیم تا روشن شود چه کاری الان انجام شود، چه کاری عقب بیفتد و چه کاری کنار گذاشته شود.",
          items: [],
          statement: "استراتژی به همان اندازه که درباره‌ی جهت است، درباره‌ی حذف کردن است.",
        },
      ],
    },
    alone: {
      title: "چرا به‌تنهایی از پسش برنمی‌آیید",
      body: "چون بنیان‌گذار بیش از حد به مسئله نزدیک است. شما از نظر عاطفی درگیرید، ذهنتان پر است، و تصمیم‌های گذشته سوگیری ایجاد کرده‌اند.",
      quote: "«نگاه بیرونی با کم کردن سوگیری شناختی، کیفیت تصمیم را بالا می‌برد.»",
      cite: "MIT Sloan Management Review",
    },
    role: {
      kicker: "نقش مشاور",
      not: "نه دادن جواب.",
      struck: "نه آسان کردن فکر کردن.",
      items: ["به چالش کشیدن فرض‌های شما", "شفاف کردن مسیر فکرتان", "وادار کردن به تصمیم‌های سخت", "کنار زدن توهم‌ها"],
      sharper: "تیزتر کردن فکر کردن.",
    },
    example: {
      chip: "یک مثال ساده",
      title: "شفافیت در عمل",
      lead: "وقتی نویز را کنار بزنید و روی واقعیت‌های استراتژیک تمرکز کنید، چه چیزی عوض می‌شود.",
      beforeTitle: "قبل: سردرگمی",
      before: ["سه جهت محصولیِ متناقض", "دو بازار هدف متفاوت", "مدل درآمدی مبهم", "بحث دائمی، بدون اجرا"],
      doTitle: "کاری که می‌کنیم",
      steps: [
        { n: "۱.", text: "تعریف محدودیت: زمان، منابع، واقعیت" },
        { n: "۲.", text: "حذف فوری جهت‌های ضعیف" },
        { n: "۳.", text: <>تمرکز روی <strong className="font-semibold text-v3-bone">یک</strong> مسیر ورود به بازارِ کاملاً قابل‌اجرا</> },
        { n: "۴.", text: "هم‌راستا کردن کل اجرا حول همان مسیر" },
      ],
      resultTitle: "نتیجه: تمرکز",
      results: ["سردرگمی کمتر", "تصمیم‌های سریع‌تر", "اجرای شفاف‌تر"],
      quote: "«بنیان‌گذارها باهوش‌تر نمی‌شوند. قاطع می‌شوند.»",
    },
    audience: {
      yesTitle: "این کار برای چه کسی است",
      yes: [
        "بنیان‌گذاران مرحله‌ی اولیه که گزینه‌هایشان زیادی زیاد است",
        "تیم‌هایی که در حلقه‌های بی‌پایان تصمیم‌گیری گیر کرده‌اند",
        "بنیان‌گذارانی که جدی خود را برای رشد یا جذب سرمایه آماده می‌کنند",
        "کسانی که حس می‌کنند «مشغولیم ولی جلو نمی‌رویم»",
      ],
      noTitle: "این کار برای چه کسی نیست",
      no: [
        "کسانی که دنبال تأیید هستند، نه چالش",
        "بنیان‌گذارانی که حاضر به بده‌بستان سخت نیستند",
        "تیم‌هایی که منتظرند جواب آماده کف دستشان گذاشته شود",
      ],
      reqTitle: "پیش‌نیازها:",
      req: "صداقت، نظم، اجرا.",
    },
    diagnostic: {
      title: "یک تشخیص ساده",
      questions: [
        "می‌توانید اولویت سی روز آینده‌تان را شفاف توضیح دهید؟",
        "دقیقاً می‌دانید چه کاری را انجام نمی‌دهید؟",
        "مدل کسب‌وکارتان تست فشار شده یا فقط فرض شده؟",
        "تصمیم‌هایتان واکنشی است یا آگاهانه؟",
      ],
      unclear: "اگر این جواب‌ها روشن نیست، مشکل شما استراتژی نیست.",
      clarity: "مشکل شما شفافیت است.",
      quote: "«بنیان‌گذارانی که جلو می‌روند بهترین ایده را ندارند. کسانی‌اند که تصمیم روشن می‌گیرند و پایش می‌ایستند.»",
      close: ["استراتژی یعنی بیشتر دانستن نیست.", "یعنی بهتر انتخاب کردن."],
    },
  },
}

/** The accented words of a headline, in the one light colour. */
function Lit({ children }: { children: ReactNode }) {
  return <em className="text-v3-light not-italic ltr:italic">{children}</em>
}

function SplitTitle({ split }: { split: Split }) {
  return (
    <>
      {split.lead}
      <Lit>{split.accent}</Lit>
      {split.tail}
    </>
  )
}

/** A short list marked with the direction-aware arrow in the light colour. */
function ArrowList({ items, locale, className }: { items: ReactNode[]; locale: Locale; className?: string }) {
  return (
    <ul className={`flex flex-col gap-3 ${className ?? ""}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 leading-relaxed rtl:leading-loose">
          <Arrow locale={locale} className="mt-1.5 h-4 w-4 shrink-0 text-v3-light rtl:mt-2" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const LIFT = "transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60"

export function FounderAdvisory({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const href = (p: string) => localePath(locale, p)

  return (
    <V3Page>
      <PageHero
        kicker={t.hero.kicker}
        title={
          <>
            <SplitTitle split={t.hero.title} />
            <br />
            {t.hero.line2}
          </>
        }
        lead={
          <>
            <span className="block text-v3-bone">{t.hero.strong}</span>
            <span className="mt-3 block text-base md:text-lg">{t.hero.body}</span>
          </>
        }
        actions={
          <V3Button href={href("/services")} variant="quiet" locale={locale} className="px-0">
            {t.back}
          </V3Button>
        }
      />

      {/* ── The problem: noise disguised as opportunity ─────────────── */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <Reveal>
              <Headline>
                <SplitTitle split={t.problem.title} />
              </Headline>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="max-w-2xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{t.problem.body}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <blockquote className="border-s border-v3-light ps-6">
                <p className="font-v3-display text-2xl font-light leading-snug text-v3-bone rtl:leading-relaxed">{t.problem.quote}</p>
                <footer className="mt-3 text-sm text-v3-mute">
                  <bdi>{t.problem.cite}</bdi>
                </footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">
                {t.problem.experience} <em className="text-v3-bone italic rtl:not-italic">{t.problem.voice}</em> {t.problem.after}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="lg:col-span-5">
            <Card tone="lit" className={LIFT}>
              <Kicker>{t.problem.trap.kicker}</Kicker>
              <Headline as="h3" size="card">
                {t.problem.trap.title}
              </Headline>
              <p className="leading-relaxed text-v3-soft rtl:leading-loose">{t.problem.trap.body}</p>
              <div className="mt-2 flex flex-col gap-4 border-t border-v3-line/70 pt-5">
                <p className="text-sm text-v3-mute">{t.problem.trap.avoidTitle}</p>
                <ArrowList items={t.problem.trap.avoid} locale={locale} className="text-v3-bone" />
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── What we actually do: five focus areas ───────────────────── */}
      <Section title={t.what.title} lead={t.what.lead}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.what.areas.map((area, i) => {
            const last = i === t.what.areas.length - 1
            return (
              <Reveal
                key={area.title}
                delay={(i % 3) * 0.08}
                className={last ? "md:col-span-2 lg:col-span-2" : i === 3 ? "md:col-span-2 lg:col-span-1" : ""}
              >
                <Card tone={last ? "lit" : "raised"} className={`${LIFT} group`}>
                  <Headline as="h3" size="card" className="transition-colors duration-500 group-hover:text-v3-light">
                    {area.title}
                  </Headline>
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">{area.intro}</p>
                  {area.items.length > 0 && (
                    <ul className="flex flex-col gap-2.5 text-v3-bone">
                      {area.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-v3-light" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {area.note && (
                    <p className="mt-auto border-t border-v3-line/70 pt-5 text-sm italic text-v3-mute rtl:not-italic">{area.note}</p>
                  )}
                  {area.statement && (
                    <p className="mt-auto border-t border-v3-line/70 pt-5 font-v3-display text-2xl font-light leading-snug text-v3-light rtl:leading-relaxed">
                      {area.statement}
                    </p>
                  )}
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Section>

      {/* ── Why not alone, and the role of an advisor ───────────────── */}
      <Section>
        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <Reveal>
            <Card className={LIFT}>
              <Headline as="h2" size="card" className="md:text-4xl">
                {t.alone.title}
              </Headline>
              <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.alone.body}</p>
              <blockquote className="mt-auto border-s border-v3-light ps-6">
                <p className="font-v3-display text-xl font-light leading-snug text-v3-bone rtl:leading-relaxed">{t.alone.quote}</p>
                <footer className="mt-3 text-sm text-v3-mute">
                  <bdi>{t.alone.cite}</bdi>
                </footer>
              </blockquote>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card tone="raised" className={LIFT}>
              <Kicker>{t.role.kicker}</Kicker>
              <p className="font-v3-display text-3xl font-light leading-snug rtl:leading-relaxed">
                {t.role.not}
                <br />
                <s className="text-v3-mute decoration-v3-mute">{t.role.struck}</s>
              </p>
              <Checklist items={t.role.items} />
              <p className="border-t border-v3-line/70 pt-5 font-v3-display text-2xl text-v3-light">{t.role.sharper}</p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── A simple example: clarity in action ─────────────────────── */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-6">
            <Reveal className="flex flex-col gap-5">
              <Chip className="self-start">{t.example.chip}</Chip>
              <Headline>{t.example.title}</Headline>
              <p className="max-w-xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.example.lead}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Card className={LIFT}>
                <h3 className="font-v3-display text-xl text-v3-soft">{t.example.beforeTitle}</h3>
                <Checklist items={t.example.before} tone="no" />
              </Card>
            </Reveal>
          </div>

          <div className="flex flex-col gap-6">
            <Reveal delay={0.15}>
              <Card tone="lit" className={LIFT}>
                <Headline as="h3" size="card">
                  {t.example.doTitle}
                </Headline>
                <ol className="flex flex-col">
                  {t.example.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-4 border-b border-v3-line/60 py-3.5 last:border-b-0">
                      <strong className="shrink-0 font-v3-display text-lg font-normal text-v3-light">{step.n}</strong>
                      <span className="leading-relaxed text-v3-soft rtl:leading-loose">{step.text}</span>
                    </li>
                  ))}
                </ol>
                <div className="flex flex-col gap-4 border-t border-v3-line/70 pt-5">
                  <p className="text-sm text-v3-light">{t.example.resultTitle}</p>
                  <ArrowList items={t.example.results} locale={locale} className="text-v3-bone" />
                </div>
              </Card>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="text-center font-v3-display text-xl font-light italic text-v3-soft rtl:not-italic rtl:leading-relaxed">
                {t.example.quote}
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ── Who this is for / not for ───────────────────────────────── */}
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
          <Reveal delay={0.1} className="flex flex-col gap-5">
            <Card>
              <Headline as="h2" size="card" className="border-b border-v3-line/70 pb-5 text-v3-soft">
                {t.audience.noTitle}
              </Headline>
              <Checklist items={t.audience.no} tone="no" />
            </Card>
            <div className="border-s border-v3-light ps-6">
              <p className="text-sm text-v3-mute">{t.audience.reqTitle}</p>
              <p className="mt-1 font-v3-display text-2xl font-light italic text-v3-light rtl:not-italic">{t.audience.req}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── A simple diagnostic ─────────────────────────────────────── */}
      <Section title={t.diagnostic.title}>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.diagnostic.questions.map((q, i) => (
            <Reveal key={q} delay={i * 0.08}>
              <Card tone="raised" className={LIFT}>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.8)]" />
                <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose">{q}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-6 md:mt-28">
          <Reveal>
            <p className="max-w-3xl text-xl leading-relaxed text-v3-soft md:text-2xl rtl:leading-loose">{t.diagnostic.unclear}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Headline size="section" className="max-w-5xl md:text-7xl">
              <Lit>{t.diagnostic.clarity}</Lit>
            </Headline>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 max-w-2xl border-t border-v3-line/70 pt-10">
            <p className="text-lg italic leading-relaxed text-v3-soft rtl:not-italic rtl:leading-loose">{t.diagnostic.quote}</p>
            <p className="mt-6 font-v3-display text-2xl font-light leading-snug text-v3-light rtl:leading-relaxed">
              {t.diagnostic.close[0]}
              <br />
              {t.diagnostic.close[1]}
            </p>
          </Reveal>
        </div>
      </Section>

      <ServiceCta locale={locale} />
    </V3Page>
  )
}
