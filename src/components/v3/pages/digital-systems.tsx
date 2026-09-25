// ============================================================================
// File Path: src/components/v3/pages/digital-systems.tsx
// Why: /services/digital-systems and /fa/services/digital-systems in the v3
//      "Light" look, one component for both locales so they cannot drift
//      apart. The copy is the pages' own, carried over word for word from
//      the v2 files; only the look changed. Dropped as purely decorative:
//      the dot-grid and noise backgrounds, the bouncing scroll cue, and the
//      bullet characters in the "Before" list.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import { Copy as CopyIcon, MoveRight, Network, Orbit, SplitSquareHorizontal } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { ServiceCta } from "@/components/public/service-cta"
import { Card, Checklist, CountUp, Headline, Kicker, PageHero, Reveal, Section, V3Page } from "@/components/v3/kit"
import { BackLink } from "./service-detail"

type Copy = {
  back: string
  hero: { kicker: string; pre: string; accent: string; post: string; clarity: [string, string]; body: string }
  illusion: {
    title: string
    body: string
    quote: string
    source: string
    why: string
    whyStrong: string
    thinkTitle: string
    think: string[]
    needTitle: string
    need: string[]
    note: string
  }
  fragmented: {
    title: string
    lead: string
    leadEm: string
    items: string[]
    stat: { pre: string; value: number; post: string; source: string; punch: string }
  }
  ai: {
    title: string
    p1: string
    quote: string
    source: string
    p2: string
    mistakeLabel: string
    mistake: string
    mistakeSub: string
    fixTitle: string
    fixBody: string
  }
  means: { title: string; lead: string; leadStrong: string; steps: { num: string; title: string; desc: string; alert: string }[] }
  example: {
    kicker: string
    title: string
    lead: string
    beforeTitle: string
    before: string[]
    changedTitle: string
    changed: { n: string; t: string }[]
    resultTitle: string
    results: string[]
    quote: string
  }
  audience: {
    advantageTitle: string
    advantageBody: string
    advantages: string[]
    deloitte: string
    forTitle: string
    forIntro: string
    forItems: string[]
    notTitle: string
    notIntro: string
    notItems: string[]
    requiresLabel: string
    requires: string
  }
  reality: { title: string; questions: string[]; unclear: string; punch: string; quote: string; close: string }
}

const COPY: Record<Locale, Copy> = {
  en: {
    back: "Back to Services",
    hero: {
      kicker: "Digital Systems & AI",
      pre: "You cannot",
      accent: "automate",
      post: "confusion.",
      clarity: ["Most businesses today don’t have a technology problem.", "They have a clarity problem."],
      body: "They jump into automation. They experiment with AI. They subscribe to tools. And still — nothing fundamentally improves. Work remains chaotic. Teams stay overloaded. Decisions are slow.",
    },
    illusion: {
      title: 'The Illusion of "Digital Transformation"',
      body: '“Digital transformation” has become an overused term. In practice, it usually means adding more tools, dashboards, and AI features — while hiring someone to "handle automation."',
      quote: '"Over 70% of digital transformation initiatives fail."',
      source: "— McKinsey, 2018–2022",
      why: "Why?",
      whyStrong: "Because companies digitize existing chaos instead of redesigning how work actually happens.",
      thinkTitle: "What businesses think they need",
      think: ["We need automation", "We need AI", "We need better tools"],
      needTitle: "What they actually need",
      need: ["Clear workflows", "Defined responsibilities", "Structured data flow", "System-level thinking"],
      note: "Without this foundation, every tool becomes another layer of complexity.",
    },
    fragmented: {
      title: "Fragmented Operations",
      lead: "In most SMEs and startups, operations evolve organically. Sales uses one system. Marketing uses another. Operations runs on spreadsheets.",
      leadEm: "Founders connect everything manually.",
      items: ["Duplicated Work", "Inconsistent Data", "Communication Gaps", "Decision Delays"],
      stat: {
        pre: "Employees spend up to ",
        value: 60,
        post: '% of their time on "work about work"',
        source: "— Harvard Business Review, 2019",
        punch: "That’s not inefficiency. That’s structural failure.",
      },
    },
    ai: {
      title: "Why AI Fails in Most Businesses",
      p1: "AI is powerful. That’s not the problem. The problem is where and how it’s applied.",
      quote: '"80% of AI projects fail to deliver meaningful ROI."',
      source: "— Gartner AI Adoption Report, 2023",
      p2: "Not because the models are weak. But because businesses apply AI without structured workflows, lack clean data, and expect AI to replace thinking.",
      mistakeLabel: "The Core Mistake",
      mistake: "Most teams try to use AI as a shortcut.",
      mistakeSub: "It only works as a multiplier.",
      fixTitle: "AI does not fix broken processes.",
      fixBody: "It amplifies whatever system already exists — good or bad.",
    },
    means: {
      title: 'What "Digital Systems & AI" Actually Means',
      lead: "This is where most people misunderstand the work. It is not about installing tools, building random automations, or adding AI for the sake of it.",
      leadStrong: "It is about designing how your business runs.",
      steps: [
        {
          num: "01",
          title: "Workflow Clarity Before Automation",
          desc: "Before automating, we answer: What is the exact workflow? Where are the bottlenecks? Who owns each step?",
          alert: "If workflow is unclear, automation will fail.",
        },
        {
          num: "02",
          title: "System Design, Not Tool Selection",
          desc: "Most start with tools. We start with structure. We define processes, dependencies, and decision points first.",
          alert: "Only then do we choose tools.",
        },
        {
          num: "03",
          title: "AI Integration as a Layer",
          desc: "Not a foundation. We introduce AI only where it creates leverage: repetitive decisions, high volume, data-heavy flows.",
          alert: "Always within a defined system.",
        },
        {
          num: "04",
          title: "Reducing Complexity",
          desc: "A good system feels simpler over time, not heavier. This means removing tools and consolidating workflows.",
          alert: "Complexity is the silent killer.",
        },
      ],
    },
    example: {
      kicker: "Case Study",
      title: "A Real Example",
      lead: "How a growing SME shifted from chaos to leverage utilizing structured systems.",
      beforeTitle: "Before: Chaos",
      before: [
        "Using 6+ disconnected tools",
        "Manual reporting every week",
        "Founders stuck in daily operations",
        "Agonizingly slow decision-making",
      ],
      changedTitle: "What Changed",
      changed: [
        { n: "1.", t: "Mapped actual workflows" },
        { n: "2.", t: "Removed redundant steps" },
        { n: "3.", t: "Integrated key tools cleanly" },
        { n: "4.", t: "Introduced AI for reporting & queries" },
      ],
      resultTitle: "Result: Leverage",
      results: ["Faster decisions", "Reduced manual work", "Clearer accountability"],
      quote: '"No fancy AI product. Just structured systems."',
    },
    audience: {
      advantageTitle: "The Strategic Advantage",
      advantageBody: "Businesses that invest in robust systems gain massive leverage.",
      advantages: ["Operational clarity", "Faster execution", "Lower dependency on individuals", "Better scalability"],
      deloitte:
        'Deloitte: "Organizations with strong operational design outperform peers in both efficiency and employee satisfaction."',
      forTitle: "Who This Is Actually For",
      forIntro: "This work is not for everyone. It's for:",
      forItems: [
        "Founders scaling beyond early chaos",
        "SMEs stuck in operational inefficiency",
        "Teams overwhelmed by manual processes",
        "Companies trying (and failing) to use AI effectively",
      ],
      notTitle: "Who This Is Not For",
      notIntro: "Let's be clear.",
      notItems: [
        "People looking for 'quick AI hacks'",
        "Teams unwilling to change how they operate",
        "Businesses without real workflows yet",
      ],
      requiresLabel: "Because this work requires:",
      requires: "Clarity. Discipline. Implementation.",
    },
    reality: {
      title: "A Simple Reality Check",
      questions: [
        "Are your operations dependent on specific people?",
        "Do your tools actually reduce friction — or add it?",
        "Can you clearly explain how work flows in your business?",
        "Are you using AI — or just experimenting with it?",
      ],
      unclear: "If these answers are unclear, your problem is not technology.",
      punch: "It's structure.",
      quote: "\"Teams don’t fail because they lack effort. They fail because they lack structure.\"",
      close: "And structure is not built by tools. It is designed.",
    },
  },
  fa: {
    back: "بازگشت به خدمات",
    hero: {
      kicker: "سیستم‌های دیجیتال و هوش مصنوعی",
      pre: "سردرگمی را نمی‌شود",
      accent: "خودکار",
      post: "کرد.",
      clarity: ["مشکل بیشتر کسب‌وکارها امروز فناوری نیست.", "مشکلشان شفافیت است."],
      body: "می‌پرند وسط خودکارسازی. با هوش مصنوعی ور می‌روند. اشتراک ابزار می‌خرند. و باز هیچ‌چیز از بنیان بهتر نمی‌شود. کار آشفته می‌ماند، تیم زیر بار له است و تصمیم‌ها کند.",
    },
    illusion: {
      title: "توهم «تحول دیجیتال»",
      body: "«تحول دیجیتال» عبارتی است که آن‌قدر تکرار شده که معنایش را از دست داده. در عمل معمولاً یعنی ابزار بیشتر، داشبورد بیشتر و قابلیت هوش مصنوعی بیشتر، به‌علاوه‌ی استخدام کسی که «خودکارسازی را انجام دهد».",
      quote: "«بیش از ۷۰ درصد طرح‌های تحول دیجیتال شکست می‌خورند.»",
      source: "McKinsey, 2018–2022",
      why: "چرا؟",
      whyStrong: "چون شرکت‌ها به‌جای بازطراحی شکل واقعی انجام کار، آشوب موجود را دیجیتال می‌کنند.",
      thinkTitle: "کسب‌وکارها فکر می‌کنند به چه نیاز دارند",
      think: ["خودکارسازی لازم داریم", "هوش مصنوعی لازم داریم", "ابزار بهتر لازم داریم"],
      needTitle: "واقعاً به چه نیاز دارند",
      need: ["گردش‌کار شفاف", "مسئولیت‌های تعریف‌شده", "جریان داده‌ی ساختارمند", "تفکر در سطح سیستم"],
      note: "بدون این پایه، هر ابزار تازه یک لایه‌ی پیچیدگی تازه است.",
    },
    fragmented: {
      title: "عملیات تکه‌تکه",
      lead: "در بیشتر کسب‌وکارهای کوچک و متوسط و استارتاپ‌ها، عملیات خودرو رشد می‌کند. فروش یک سیستم دارد، بازاریابی یکی دیگر، و عملیات روی صفحه‌گسترده می‌چرخد.",
      leadEm: "بنیان‌گذار همه را دستی به هم وصل می‌کند.",
      items: ["کار تکراری", "داده‌ی ناسازگار", "شکاف ارتباطی", "تأخیر در تصمیم"],
      stat: {
        pre: "کارکنان تا ",
        value: 60,
        post: " درصد وقتشان را صرف «کار درباره‌ی کار» می‌کنند",
        source: "Harvard Business Review, 2019",
        punch: "این ناکارآمدی نیست. شکست ساختاری است.",
      },
    },
    ai: {
      title: "چرا هوش مصنوعی در بیشتر کسب‌وکارها شکست می‌خورد",
      p1: "هوش مصنوعی قدرتمند است. مشکل این نیست. مشکل این است که کجا و چطور به کار گرفته می‌شود.",
      quote: "«۸۰ درصد پروژه‌های هوش مصنوعی بازگشت سرمایه‌ی معناداری تحویل نمی‌دهند.»",
      source: "Gartner AI Adoption Report, 2023",
      p2: "نه به این دلیل که مدل‌ها ضعیف‌اند. به این دلیل که کسب‌وکارها هوش مصنوعی را بدون گردش‌کار ساختارمند به کار می‌گیرند، داده‌ی تمیز ندارند، و انتظار دارند هوش مصنوعی جای فکر کردن را بگیرد.",
      mistakeLabel: "اشتباه اصلی",
      mistake: "بیشتر تیم‌ها هوش مصنوعی را میان‌بر می‌بینند.",
      mistakeSub: "ولی فقط به‌عنوان ضریب‌افزا کار می‌کند.",
      fixTitle: "هوش مصنوعی فرایند خراب را درست نمی‌کند.",
      fixBody: "هر سیستمی که از قبل هست را بزرگ‌تر می‌کند، خوب باشد یا بد.",
    },
    means: {
      title: "«سیستم‌های دیجیتال و هوش مصنوعی» دقیقاً یعنی چه",
      lead: "بیشتر آدم‌ها همین‌جا کار را اشتباه می‌فهمند. موضوع نصب ابزار، ساختن خودکارسازی‌های پراکنده یا اضافه کردن هوش مصنوعی محض خودش نیست.",
      leadStrong: "موضوع طراحی شکل کارکرد کسب‌وکار شماست.",
      steps: [
        {
          num: "۰۱",
          title: "شفافیت گردش‌کار پیش از خودکارسازی",
          desc: "قبل از خودکارسازی به این‌ها جواب می‌دهیم: گردش‌کار دقیقاً چیست؟ گلوگاه‌ها کجایند؟ هر قدم مسئولش کیست؟",
          alert: "اگر گردش‌کار مبهم باشد، خودکارسازی شکست می‌خورد.",
        },
        {
          num: "۰۲",
          title: "طراحی سیستم، نه انتخاب ابزار",
          desc: "بیشترشان از ابزار شروع می‌کنند. ما از ساختار شروع می‌کنیم. اول فرایندها، وابستگی‌ها و نقاط تصمیم را تعریف می‌کنیم.",
          alert: "ابزار را تازه بعد از آن انتخاب می‌کنیم.",
        },
        {
          num: "۰۳",
          title: "هوش مصنوعی به‌عنوان یک لایه",
          desc: "نه به‌عنوان پایه. هوش مصنوعی را فقط جایی می‌آوریم که اهرم بسازد: تصمیم‌های تکراری، حجم بالا، جریان‌های داده‌سنگین.",
          alert: "همیشه درون یک سیستم تعریف‌شده.",
        },
        {
          num: "۰۴",
          title: "کم کردن پیچیدگی",
          desc: "سیستم خوب با گذشت زمان ساده‌تر حس می‌شود، نه سنگین‌تر. یعنی حذف ابزار و یکپارچه کردن گردش‌کارها.",
          alert: "پیچیدگی قاتل خاموش است.",
        },
      ],
    },
    example: {
      kicker: "نمونه‌ی واقعی",
      title: "یک مثال واقعی",
      lead: "چطور یک کسب‌وکار در حال رشد با سیستم‌های ساختارمند از آشوب به اهرم رسید.",
      beforeTitle: "قبل: آشوب",
      before: [
        "بیش از شش ابزار بی‌ارتباط با هم",
        "گزارش‌گیری دستی هر هفته",
        "بنیان‌گذار گیرافتاده در عملیات روزمره",
        "تصمیم‌گیری به‌طرز آزاردهنده‌ای کند",
      ],
      changedTitle: "چه چیزی عوض شد",
      changed: [
        { n: "۱.", t: "نقشه‌برداری از گردش‌کارهای واقعی" },
        { n: "۲.", t: "حذف قدم‌های زائد" },
        { n: "۳.", t: "یکپارچه‌سازی تمیز ابزارهای کلیدی" },
        { n: "۴.", t: "آوردن هوش مصنوعی برای گزارش و پرس‌وجو" },
      ],
      resultTitle: "نتیجه: اهرم",
      results: ["تصمیم‌های سریع‌تر", "کار دستی کمتر", "پاسخ‌گویی شفاف‌تر"],
      quote: "«هیچ محصول هوش مصنوعی پرزرق‌وبرقی در کار نبود. فقط سیستم ساختارمند.»",
    },
    audience: {
      advantageTitle: "مزیت استراتژیک",
      advantageBody: "کسب‌وکارهایی که روی سیستم‌های محکم سرمایه‌گذاری می‌کنند اهرم بزرگی به دست می‌آورند.",
      advantages: ["شفافیت عملیاتی", "اجرای سریع‌تر", "وابستگی کمتر به افراد", "مقیاس‌پذیری بهتر"],
      deloitte: "دیلویت: «سازمان‌هایی که طراحی عملیاتی قوی دارند، هم در کارایی و هم در رضایت کارکنان از رقبایشان جلوترند.»",
      forTitle: "این کار دقیقاً برای چه کسی است",
      forIntro: "این کار برای همه نیست. برای این‌هاست:",
      forItems: [
        "بنیان‌گذارانی که از آشوب اولیه عبور کرده‌اند و در حال رشدند",
        "کسب‌وکارهایی که در ناکارآمدی عملیاتی گیر کرده‌اند",
        "تیم‌هایی که زیر بار فرایندهای دستی له شده‌اند",
        "شرکت‌هایی که تلاش می‌کنند از هوش مصنوعی درست استفاده کنند و موفق نمی‌شوند",
      ],
      notTitle: "این کار برای چه کسی نیست",
      notIntro: "روشن بگویم.",
      notItems: [
        "کسانی که دنبال «ترفندهای سریع هوش مصنوعی» هستند",
        "تیم‌هایی که حاضر نیستند شیوه‌ی کارشان را عوض کنند",
        "کسب‌وکارهایی که هنوز گردش‌کار واقعی ندارند",
      ],
      requiresLabel: "چون این کار این‌ها را لازم دارد:",
      requires: "شفافیت، نظم، پیاده‌سازی.",
    },
    reality: {
      title: "یک محک ساده‌ی واقعیت",
      questions: [
        "عملیات شما به آدم‌های خاصی وابسته است؟",
        "ابزارهایتان واقعاً اصطکاک را کم می‌کنند یا اضافه می‌کنند؟",
        "می‌توانید شفاف توضیح دهید کار در کسب‌وکارتان چطور جریان دارد؟",
        "از هوش مصنوعی استفاده می‌کنید یا فقط با آن ور می‌روید؟",
      ],
      unclear: "اگر این جواب‌ها روشن نیست، مشکل شما فناوری نیست.",
      punch: "ساختار است.",
      quote: "«تیم‌ها به‌خاطر کم‌کاری شکست نمی‌خورند. به‌خاطر نداشتن ساختار شکست می‌خورند.»",
      close: "و ساختار را ابزار نمی‌سازد. ساختار طراحی می‌شود.",
    },
  },
}

const FRAGMENT_ICONS = [CopyIcon, Network, SplitSquareHorizontal, Orbit]

/** A sourced quotation. The source is a Latin-script citation, isolated so it reads correctly inside Persian. */
function Quote({ quote, source, className }: { quote: ReactNode; source: string; className?: string }) {
  return (
    <figure className={`border-s border-v3-light ps-6 ${className ?? ""}`}>
      <blockquote className="font-v3-display text-2xl leading-snug text-v3-bone md:text-3xl rtl:leading-relaxed">{quote}</blockquote>
      <figcaption className="mt-3 text-sm text-v3-mute">
        <bdi>{source}</bdi>
      </figcaption>
    </figure>
  )
}

/** A small muted heading inside a card. */
function CardLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-sm text-v3-mute ${className ?? ""}`}>{children}</h3>
}

export function DigitalSystems({ locale }: { locale: Locale }) {
  const t = COPY[locale]

  return (
    <V3Page>
      <BackLink locale={locale} label={t.back} />

      {/* ── 1. The statement ─────────────────────────────────────────── */}
      <PageHero
        kicker={t.hero.kicker}
        title={
          <>
            {t.hero.pre} <em className="text-v3-light not-italic ltr:italic">{t.hero.accent}</em> {t.hero.post}
          </>
        }
        lead={
          <>
            <span className="text-v3-bone">{t.hero.clarity[0]}</span>
            <br />
            <span className="text-v3-bone">{t.hero.clarity[1]}</span>
          </>
        }
        aside={
          <p className="border-s border-v3-line ps-6 text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.hero.body}</p>
        }
      />

      {/* ── 2. The illusion ──────────────────────────────────────────── */}
      <Section title={t.illusion.title}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="flex flex-col gap-10 lg:col-span-6">
            <p className="text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{t.illusion.body}</p>
            <Quote quote={t.illusion.quote} source={t.illusion.source} />
            <p className="text-xl leading-relaxed text-v3-soft rtl:leading-loose">
              {t.illusion.why} <strong className="font-medium text-v3-bone">{t.illusion.whyStrong}</strong>
            </p>
          </Reveal>
          <div className="flex flex-col gap-5 lg:col-span-6">
            <Reveal delay={0.08}>
              <Card>
                <CardLabel>{t.illusion.thinkTitle}</CardLabel>
                <Checklist
                  tone="no"
                  items={t.illusion.think.map((x) => (
                    <span key={x} className="line-through decoration-v3-mute/60">
                      {x}
                    </span>
                  ))}
                />
              </Card>
            </Reveal>
            <Reveal delay={0.16}>
              <Card tone="lit">
                <CardLabel className="text-v3-light">{t.illusion.needTitle}</CardLabel>
                <Checklist items={t.illusion.need} />
              </Card>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="text-center font-v3-display text-lg italic text-v3-mute rtl:not-italic">{t.illusion.note}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ── 3. Fragmented operations ─────────────────────────────────── */}
      <Section
        title={t.fragmented.title}
        lead={
          <>
            {t.fragmented.lead} <em className="text-v3-bone not-italic ltr:italic">{t.fragmented.leadEm}</em>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.fragmented.items.map((title, i) => {
            const Icon = FRAGMENT_ICONS[i]
            return (
              <Reveal key={title} delay={i * 0.08}>
                <div className="group flex h-full min-h-48 flex-col justify-between gap-8 rounded-2xl border border-v3-line/80 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise md:p-8">
                  <Icon aria-hidden className="h-8 w-8 text-v3-mute transition-colors duration-500 group-hover:text-v3-light" />
                  <Headline as="h3" size="card">
                    {title}
                  </Headline>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.1} className="mt-5">
          <Card tone="lit" className="items-start gap-6 md:p-12">
            <h3 className="max-w-4xl font-v3-display text-3xl font-light leading-tight md:text-5xl rtl:leading-snug">
              {t.fragmented.stat.pre}
              <CountUp to={t.fragmented.stat.value} locale={locale} className="text-v3-light" />
              {t.fragmented.stat.post}
            </h3>
            <p className="text-sm text-v3-mute">
              <bdi>{t.fragmented.stat.source}</bdi>
            </p>
            <p className="text-xl font-medium text-v3-light">{t.fragmented.stat.punch}</p>
          </Card>
        </Reveal>
      </Section>

      {/* ── 4. The AI reality check ──────────────────────────────────── */}
      <Section title={t.ai.title}>
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <Card tone="raised" className="gap-8 md:p-12">
              <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.ai.p1}</p>
              <Quote quote={t.ai.quote} source={t.ai.source} />
              <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.ai.p2}</p>
            </Card>
          </Reveal>
          <div className="flex flex-col gap-5">
            <Reveal delay={0.08} className="flex-1">
              <Card className="justify-center">
                <span className="text-sm text-v3-mute">{t.ai.mistakeLabel}</span>
                <p className="font-v3-display text-3xl font-light leading-snug text-v3-bone rtl:leading-relaxed">{t.ai.mistake}</p>
                <p className="text-xl text-v3-soft">{t.ai.mistakeSub}</p>
              </Card>
            </Reveal>
            <Reveal delay={0.16} className="flex-1">
              <Card tone="lit" className="justify-center">
                <Headline as="h3" size="card">
                  {t.ai.fixTitle}
                </Headline>
                <p className="text-lg text-v3-light">{t.ai.fixBody}</p>
              </Card>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ── 5. What it actually means ────────────────────────────────── */}
      <Section
        title={t.means.title}
        lead={
          <>
            {t.means.lead} <strong className="font-medium text-v3-bone">{t.means.leadStrong}</strong>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {t.means.steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08}>
              <div className="group flex h-full flex-col gap-4 rounded-2xl border border-v3-line/80 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise md:p-8">
                <span className="font-v3-display text-4xl text-v3-mute transition-colors duration-500 group-hover:text-v3-light">
                  {step.num}
                </span>
                <Headline as="h3" size="card" className="md:text-2xl">
                  {step.title}
                </Headline>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{step.desc}</p>
                <p className="mt-auto border-t border-v3-line/70 pt-5 text-sm font-medium text-v3-light">{step.alert}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── 6. A real example ────────────────────────────────────────── */}
      <Section kicker={t.example.kicker} title={t.example.title} lead={t.example.lead}>
        <div className="grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <Card>
              <Headline as="h3" size="card" className="text-v3-soft">
                {t.example.beforeTitle}
              </Headline>
              <Checklist tone="no" items={t.example.before} />
            </Card>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <Card tone="lit" className="gap-6">
              <Headline as="h3" size="card">
                {t.example.changedTitle}
              </Headline>
              <ol className="flex flex-col">
                {t.example.changed.map((c) => (
                  <li key={c.n} className="flex items-baseline gap-4 border-b border-v3-line/60 py-4 last:border-b-0">
                    <span className="font-v3-display text-lg text-v3-light">{c.n}</span>
                    <span className="text-lg text-v3-bone">{c.t}</span>
                  </li>
                ))}
              </ol>
              <div className="flex flex-col gap-4 border-t border-v3-line/70 pt-6">
                <Kicker>{t.example.resultTitle}</Kicker>
                <ul className="flex flex-col gap-3">
                  {t.example.results.map((r) => (
                    <li key={r} className="flex items-center gap-3 text-lg font-medium text-v3-bone">
                      <MoveRight aria-hidden className="h-5 w-5 shrink-0 text-v3-light rtl:-scale-x-100" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="mt-12">
          <p className="text-center font-v3-display text-2xl italic text-v3-soft md:text-3xl rtl:not-italic">{t.example.quote}</p>
        </Reveal>
      </Section>

      {/* ── 7. Advantage & audience ──────────────────────────────────── */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-24">
              <Card tone="raised" className="gap-6 md:p-10">
                <Headline as="h3" size="card">
                  {t.audience.advantageTitle}
                </Headline>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{t.audience.advantageBody}</p>
                <Checklist items={t.audience.advantages} />
                <p className="rounded-xl border border-v3-line/80 p-4 text-sm italic leading-relaxed text-v3-soft rtl:not-italic rtl:leading-loose">
                  {t.audience.deloitte}
                </p>
              </Card>
            </Reveal>
          </div>

          <div className="flex flex-col gap-16 lg:col-span-7">
            <Reveal className="flex flex-col gap-4">
              <Headline>{t.audience.forTitle}</Headline>
              <p className="text-lg text-v3-soft">{t.audience.forIntro}</p>
              <Checklist items={t.audience.forItems} />
            </Reveal>

            <Reveal className="flex flex-col gap-4">
              <Headline className="text-v3-soft">{t.audience.notTitle}</Headline>
              <p className="text-lg text-v3-soft">{t.audience.notIntro}</p>
              <Checklist tone="no" items={t.audience.notItems} />
              <div className="mt-6 flex flex-col gap-2 border-s border-v3-light ps-6">
                <p className="font-medium text-v3-bone">{t.audience.requiresLabel}</p>
                <p className="font-v3-display text-3xl italic text-v3-light rtl:not-italic">{t.audience.requires}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ── 8. Reality check ─────────────────────────────────────────── */}
      <Section title={t.reality.title}>
        <div className="grid gap-4 sm:grid-cols-2">
          {t.reality.questions.map((q, i) => (
            <Reveal key={q} delay={i * 0.08}>
              <div className="flex h-full items-start gap-5 rounded-2xl border border-v3-line/80 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise">
                <span aria-hidden className="mt-1 font-v3-display text-lg text-v3-light">
                  ?
                </span>
                <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose">{q}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-8 text-center">
          <Reveal>
            <p className="text-xl text-v3-soft md:text-2xl">{t.reality.unclear}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-v3-display text-[clamp(2.75rem,6vw,5.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-v3-light italic rtl:not-italic rtl:leading-[1.4] rtl:tracking-[-0.01em]">
              {t.reality.punch}
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex max-w-xl flex-col gap-4 border-t border-v3-line/70 pt-12">
            <p className="text-lg italic text-v3-soft rtl:not-italic rtl:leading-loose">{t.reality.quote}</p>
            <p className="text-xl font-medium text-v3-bone">{t.reality.close}</p>
          </Reveal>
        </div>
      </Section>

      <ServiceCta locale={locale} />
    </V3Page>
  )
}
