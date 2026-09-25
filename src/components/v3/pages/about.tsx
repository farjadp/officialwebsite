// ============================================================================
// File Path: src/components/v3/pages/about.tsx
// Why: /about and /fa/about in the v3 "Light" look, one component for both
//      locales so they cannot drift apart. Every word is carried over from
//      the v2 pages; education and certifications still come from each
//      route's own data.ts. Only the look changed.
//      Removed on the way: the Unsplash texture behind the narrative and the
//      grainy-gradients.vercel.app noise overlay (third-party remote images).
//      The hero now shows the portrait; the team photograph moved down to
//      the narrative, where it is a real room rather than a headshot.
// Env / Identity: React Server Component; client leaves in ../motion
// ============================================================================

import Image from "next/image"
import type { ReactNode } from "react"
import { Camera, Globe2, Layers } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import {
  Arrow,
  Card,
  Checklist,
  Chip,
  CountUp,
  CtaBand,
  Headline,
  LightRule,
  PageHero,
  Parallax,
  Reveal,
  Section,
  V3Button,
  V3Page,
} from "@/components/v3/kit"
import { EDUCATION as EDUCATION_EN, CERTIFICATIONS as CERTIFICATIONS_EN } from "@/app/(public)/about/data"
import { EDUCATION as EDUCATION_FA, CERTIFICATIONS as CERTIFICATIONS_FA } from "@/app/fa/(public)/about/data"

type Copy = {
  hero: {
    kicker: string
    title: string
    accent: string
    lead: string
    services: string
    call: string
    portraitAlt: string
    basedLabel: string
    basedValue: string
  }
  stats: { years: { to: number; suffix: string; label: string }; items: { value: string; label: string }[] }
  short: {
    title: string
    origin: { title: string; body: string }
    focus: { title: string; items: string[] }
    dont: { title: string; items: string[] }
  }
  story: { kicker: string; title: string; paragraphs: ReactNode[]; quoteIndex: number; photoAlt: string }
  domains: { title: string; more: string; items: { href: string; title: string; body: string }[] }
  education: { title: string; lead: string; education: string; development: string }
  beyond: { title: string; body: ReactNode }
  closing: { title: string; accent: string; body: string; services: string; tools: string }
}

const Strong = ({ children }: { children: ReactNode }) => <strong className="font-medium text-v3-bone">{children}</strong>

const COPY: Record<Locale, Copy> = {
  en: {
    hero: {
      kicker: "The Operator",
      title: "Stop dreaming.",
      accent: "Start building.",
      lead: "I am Farjad. I help immigrant founders and serious business owners build real companies in Canada with strategy, systems, and honest execution.",
      services: "View Services",
      call: "Book a Strategy Call",
      portraitAlt: "Farjad, portrait",
      basedLabel: "Based In",
      basedValue: "Toronto / Newmarket, CA",
    },
    stats: {
      years: { to: 22, suffix: "+", label: "Years Building Systems" },
      items: [
        { value: "AshaVid", label: "Founder & CSO" },
        { value: "DPF & HoFin", label: "Founder / Co-Founder" },
        { value: "VisaRoads", label: "Startup Mentor" },
      ],
    },
    short: {
      title: "The Short Version",
      origin: {
        title: "Origin: Iran to CA",
        body: "Born in a culture that values deep, resilient work. Now operating in the Greater Toronto Area, bridging the execution gap for immigrant founders.",
      },
      focus: {
        title: "Current Focus",
        items: ["Software Architecture & IT Systems", "Startup SUV Mentorship", "Digital Transformation for SMEs"],
      },
      dont: {
        title: "What I Don't Do",
        items: [
          "I don't sell \"guaranteed\" PR.",
          "I don't use fake traction numbers.",
          "I don't work with tourists looking for shortcuts or fake business shells.",
        ],
      },
    },
    story: {
      kicker: "The Trajectory",
      title: "Why I chose the hard path.",
      quoteIndex: 1,
      photoAlt: "Farjad with a team, around a meeting table",
      paragraphs: [
        <>
          My background is an intersection of <Strong>technology and anthropology</Strong>. Having worked as a CTO and built startups across both Iran and Canada, I learned early on that code alone doesn&apos;t solve human problems.
        </>,
        <>
          When I moved to Canada, I saw brilliant immigrant founders failing—not because their ideas were bad, but because they didn&apos;t understand the cultural and operational landscape. Worse, I saw serious people losing their life savings to consultants selling &quot;easy visas&quot; rather than building real companies.
        </>,
        <>
          I realized that <Strong>clarity</Strong> is what people were missing. The industry is saturated with &quot;motivation&quot; and hype, but severely lacking in practical, engineering-grade <Strong>systems</Strong>.
        </>,
        <>
          So I stopped trying to please everyone. I dedicated my work to bridging the execution gap. I only work with the builders—the ones who care about the craft, the actual product, and building something enduring in a new country.
        </>,
      ],
    },
    domains: {
      title: "Selected Work Domains",
      more: "Read More",
      items: [
        {
          href: "/services/founder-advisory",
          title: "Founder Mentorship",
          body: "Pre-seed strategy, product-market validation, and mental sparring for early-stage teams aiming to scale.",
        },
        {
          href: "/services/startup-visa",
          title: "Startup Visa Strategy",
          body: "Guiding immigrant founders to build legitimate, high-growth companies in Canada—not shell corporations.",
        },
        {
          href: "/services/digital-systems",
          title: "Systems & AI",
          body: "Digital transformation, workflow automation, and custom AI integration for modernizing local SMEs.",
        },
      ],
    },
    education: {
      title: "Education & Development",
      lead: "My academic background in anthropology shaped the way I understand founders, systems, and human behavior inside organizations.",
      education: "Education",
      development: "Professional Development",
    },
    beyond: {
      title: "Beyond the Architecture",
      body: (
        <>
          I don&apos;t just view the world through lines of code. The best systems are built by understanding human nature. My work is heavily informed by <Strong>anthropology</Strong>, documenting life through <Strong>photography</Strong>, and the profound responsibility of <Strong>fatherhood</Strong>. I believe in cross-cultural lenses—taking the deep-rooted resilience of Iran and combining it with the structured opportunity of Canada.
        </>
      ),
    },
    closing: {
      title: "Ready to",
      accent: "do the work?",
      body: "The library is open. No subscription fees, no hidden agenda. Just read, think, and build. Or, if you are ready to accelerate, let's talk.",
      services: "See How I Can Help",
      tools: "Access Free Tools",
    },
  },
  fa: {
    hero: {
      kicker: "اپراتور",
      title: "رؤیاپردازی بس است.",
      accent: "وقت ساختن است.",
      lead: "فرجاد هستم. به بنیان‌گذاران مهاجر و صاحبان کسب‌وکار جدی کمک می‌کنم در کانادا شرکت واقعی بسازند، با استراتژی روشن، سیستم‌های درست و اجرای بی‌تعارف.",
      services: "خدمات",
      call: "رزرو جلسه‌ی استراتژی",
      portraitAlt: "پرتره‌ی فرجاد",
      basedLabel: "محل فعالیت",
      basedValue: "نیومارکت / تورنتو، کانادا",
    },
    stats: {
      years: { to: 22, suffix: "+", label: "سال سیستم‌سازی" },
      items: [
        { value: "AshaVid", label: "بنیان‌گذار و مدیر ارشد استراتژی" },
        { value: "DPF & HoFin", label: "بنیان‌گذار و هم‌بنیان‌گذار" },
        { value: "VisaRoads", label: "منتور استارتاپ" },
      ],
    },
    short: {
      title: "خلاصه‌اش این است",
      origin: {
        title: "از ایران تا کانادا",
        body: "در فرهنگی بزرگ شدم که کار عمیق و تاب‌آور برایش ارزش است. حالا در تورنتوی بزرگ کار می‌کنم و فاصله‌ی میان ایده و اجرا را برای بنیان‌گذاران مهاجر پر می‌کنم.",
      },
      focus: {
        title: "تمرکز فعلی",
        items: [
          "معماری نرم‌افزار و سامانه‌های فناوری اطلاعات",
          "منتورشیپ استارتاپ ویزای کانادا",
          "تحول دیجیتال کسب‌وکارهای کوچک و متوسط",
        ],
      },
      dont: {
        title: "کاری که نمی‌کنم",
        items: [
          "اقامت دائم «تضمینی» نمی‌فروشم.",
          "عدد و رشد ساختگی نمی‌سازم.",
          "با کسی که دنبال میان‌بر یا شرکت روی کاغذ است کار نمی‌کنم.",
        ],
      },
    },
    story: {
      kicker: "مسیر",
      title: "چرا راه سخت را انتخاب کردم",
      quoteIndex: 1,
      photoAlt: "فرجاد در کنار یک تیم، دور میز جلسه",
      paragraphs: [
        <>
          پیشینه‌ی من تقاطع <Strong>فناوری و انسان‌شناسی</Strong> است. سال‌ها مدیر ارشد فنی بودم و در ایران و کانادا استارتاپ ساختم، و خیلی زود فهمیدم کد به‌تنهایی مسئله‌ی انسانی را حل نمی‌کند.
        </>,
        <>
          وقتی به کانادا آمدم، بنیان‌گذاران مهاجرِ درخشانی را دیدم که شکست می‌خوردند. نه به این دلیل که ایده‌شان بد بود، بلکه چون زمین بازی فرهنگی و عملیاتی را نمی‌شناختند. بدتر از آن، آدم‌های جدی را دیدم که پس‌انداز عمرشان را به مشاورانی می‌دادند که به‌جای ساختن شرکت واقعی، «ویزای آسان» می‌فروختند.
        </>,
        <>
          فهمیدم چیزی که کم داشتند <Strong>وضوح</Strong> بود. این صنعت پر است از «انگیزه» و هیاهو، و به‌شدت از <Strong>سیستم</Strong>‌های عملی و مهندسی‌شده خالی است.
        </>,
        <>
          برای همین دست از راضی نگه‌داشتن همه برداشتم و کارم را وقف پر کردن فاصله‌ی میان ایده و اجرا کردم. فقط با سازندگان کار می‌کنم؛ کسانی که به صنعتگری، به محصول واقعی و به ساختن چیزی ماندگار در کشوری تازه اهمیت می‌دهند.
        </>,
      ],
    },
    domains: {
      title: "حوزه‌های کاری",
      more: "بیشتر بخوانید",
      items: [
        {
          href: "/services/founder-advisory",
          title: "منتورشیپ بنیان‌گذار",
          body: "استراتژی پیش‌بذری، اعتبارسنجی تناسب محصول و بازار، و هم‌فکری رودررو برای تیم‌های مرحله‌ی اولیه که قصد رشد دارند.",
        },
        {
          href: "/services/startup-visa",
          title: "استراتژی استارتاپ ویزا",
          body: "راهنمایی بنیان‌گذاران مهاجر برای ساختن شرکت‌های واقعی و پررشد در کانادا، نه شرکت روی کاغذ.",
        },
        {
          href: "/services/digital-systems",
          title: "سیستم و هوش مصنوعی",
          body: "تحول دیجیتال، خودکارسازی گردش‌کار و یکپارچه‌سازی هوش مصنوعی سفارشی برای نوسازی کسب‌وکارهای کوچک و متوسط.",
        },
      ],
    },
    education: {
      title: "تحصیلات و توسعه‌ی حرفه‌ای",
      lead: "پیشینه‌ی دانشگاهی من در انسان‌شناسی، نگاهم به بنیان‌گذاران، سیستم‌ها و رفتار انسان درون سازمان را شکل داده است.",
      education: "تحصیلات",
      development: "توسعه‌ی حرفه‌ای",
    },
    beyond: {
      title: "پشت معماری",
      body: (
        <>
          جهان را فقط از پشت خطوط کد نمی‌بینم. بهترین سیستم‌ها از دل شناخت طبیعت انسان ساخته می‌شوند. کارم را <Strong>انسان‌شناسی</Strong>، ثبت زندگی از راه <Strong>عکاسی</Strong>، و مسئولیت عمیق <Strong>پدر بودن</Strong> شکل داده است. به نگاه میان‌فرهنگی باور دارم: تاب‌آوری ریشه‌دار ایران کنار فرصت ساختارمند کانادا.
        </>
      ),
    },
    closing: {
      title: "آماده‌ی کار کردن",
      accent: "هستید؟",
      body: "کتابخانه باز است. نه حق اشتراکی، نه نیت پنهانی. بخوانید، فکر کنید، بسازید. و اگر آماده‌اید سرعت بگیرید، با هم حرف بزنیم.",
      services: "ببینید چه کمکی از من برمی‌آید",
      tools: "ابزارهای رایگان",
    },
  },
}

const DATA = {
  en: { education: EDUCATION_EN, certifications: CERTIFICATIONS_EN },
  fa: { education: EDUCATION_FA, certifications: CERTIFICATIONS_FA },
} as const

export function AboutPage({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const { education, certifications } = DATA[locale]
  const href = (p: string) => localePath(locale, p)

  return (
    <V3Page>
      <PageHero
        kicker={t.hero.kicker}
        title={t.hero.title}
        accent={t.hero.accent}
        lead={t.hero.lead}
        actions={
          <>
            <V3Button href={href("/services")} locale={locale}>
              {t.hero.services}
            </V3Button>
            <V3Button href={href("/contact")} variant="secondary" locale={locale}>
              {t.hero.call}
            </V3Button>
          </>
        }
        aside={
          <figure className="relative aspect-[4/5] overflow-hidden rounded-sm bg-v3-raise">
            <Image
              src="/images/farjad-portrait.jpg"
              alt={t.hero.portraitAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="v3-drift object-cover object-[center_30%] grayscale"
            />
            <div aria-hidden className="absolute inset-0 bg-linear-to-t from-v3-ink/90 via-transparent to-transparent" />
            <figcaption className="absolute bottom-6 start-6 flex flex-col gap-1 rounded-2xl border border-v3-line bg-v3-ink/85 px-5 py-4 backdrop-blur-sm">
              <span className="text-sm text-v3-light">{t.hero.basedLabel}</span>
              <span className="font-v3-display text-xl text-v3-bone">{t.hero.basedValue}</span>
            </figcaption>
          </figure>
        }
      />

      {/* ── Proof strip ─────────────────────────────────────────────── */}
      <section className="border-b border-v3-line/70">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 px-5 md:grid-cols-4 md:px-10 lg:px-14">
          <Reveal className="flex flex-col gap-2 border-v3-line/70 py-10 md:py-14">
            <CountUp
              to={t.stats.years.to}
              suffix={t.stats.years.suffix}
              locale={locale}
              className="font-v3-display text-6xl font-light text-v3-bone md:text-7xl rtl:self-start"
            />
            <span className="text-v3-mute">{t.stats.years.label}</span>
          </Reveal>
          {t.stats.items.map((s, i) => (
            <Reveal
              key={s.value}
              delay={(i + 1) * 0.08}
              className="flex flex-col justify-end gap-2 border-v3-line/70 py-10 ps-0 md:border-s md:py-14 md:ps-8"
            >
              <span className="font-v3-display text-3xl text-v3-bone md:text-4xl">{s.value}</span>
              <span className="text-v3-mute">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── The short version ───────────────────────────────────────── */}
      <Section title={t.short.title}>
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal>
            <Card tone="lit">
              <Headline as="h3" size="card">{t.short.origin.title}</Headline>
              <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.short.origin.body}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card tone="raised">
              <Headline as="h3" size="card">{t.short.focus.title}</Headline>
              <Checklist items={t.short.focus.items} />
            </Card>
          </Reveal>
          <Reveal delay={0.16}>
            <Card>
              <Headline as="h3" size="card" className="text-v3-soft">{t.short.dont.title}</Headline>
              <Checklist items={t.short.dont.items} tone="no" />
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ── The narrative ───────────────────────────────────────────── */}
      <Section kicker={t.story.kicker} title={t.story.title}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="flex flex-col gap-8 lg:col-span-7">
            {t.story.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p
                  className={
                    i === t.story.quoteIndex
                      ? "border-s-2 border-v3-light ps-6 font-v3-display text-2xl leading-snug text-v3-bone md:text-3xl rtl:leading-relaxed"
                      : "text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose"
                  }
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <Parallax className="aspect-[4/3] rounded-sm bg-v3-raise lg:aspect-[4/5]">
              <Image
                src="/images/BusinessConsultant-Team.jpg"
                alt={t.story.photoAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-[20%_center] grayscale transition duration-700 hover:grayscale-0"
              />
            </Parallax>
          </Reveal>
        </div>
      </Section>

      {/* ── Work domains ────────────────────────────────────────────── */}
      <Section title={t.domains.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {t.domains.items.map((d, i) => (
            <Reveal key={d.href} delay={i * 0.08}>
              <Card href={href(d.href)} className="min-h-80">
                <span className="font-v3-display text-lg text-v3-mute">{`0${i + 1}`}</span>
                <Headline as="h3" size="card" className="transition-colors group-hover:text-v3-light">
                  {d.title}
                </Headline>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{d.body}</p>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-v3-light">
                  {t.domains.more}
                  <Arrow locale={locale} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Education & development ─────────────────────────────────── */}
      <Section title={t.education.title} lead={t.education.lead}>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Headline as="h3" size="card" className="mb-8">{t.education.education}</Headline>
            </Reveal>
            <LightRule>
              <ol className="flex flex-col">
                {education.map((e) => (
                  <li
                    key={e.degree}
                    className="relative grid grid-cols-[4.5rem_1fr] gap-6 py-6 md:grid-cols-[7.5rem_1fr] md:gap-10"
                  >
                    <span className="font-v3-display text-base tabular-nums text-v3-mute md:text-lg">{e.years}</span>
                    <span
                      aria-hidden
                      className="absolute start-[4.5rem] top-[2.1rem] h-2 w-2 -translate-x-1/2 rounded-full bg-v3-ink ring-1 ring-v3-light md:start-[7.5rem] rtl:translate-x-1/2"
                    />
                    <Reveal className="flex flex-col gap-1.5 ps-6 md:ps-10">
                      <h4 className="font-v3-display text-2xl leading-snug text-v3-bone">{e.degree}</h4>
                      <p className="text-v3-soft">{e.institution}</p>
                      <p className="max-w-xl leading-relaxed text-v3-mute rtl:leading-loose">{e.description}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </LightRule>
          </div>

          <div className="lg:col-span-5">
            <Reveal>
              <Headline as="h3" size="card" className="mb-8">{t.education.development}</Headline>
            </Reveal>
            <ul className="flex flex-col border-t border-v3-line/70">
              {certifications.map((c, i) => (
                <li key={c.title} className="border-b border-v3-line/70">
                  <Reveal delay={(i % 3) * 0.06} className="flex items-start justify-between gap-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-lg leading-snug text-v3-bone">{c.title}</h4>
                      <p className="text-sm text-v3-mute">{c.institution}</p>
                    </div>
                    <Chip className="shrink-0 tabular-nums">{c.year}</Chip>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Beyond work ─────────────────────────────────────────────── */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Headline>{t.beyond.title}</Headline>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-10 lg:col-span-8">
            <p className="max-w-3xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{t.beyond.body}</p>
            <div aria-hidden className="flex gap-6 text-v3-mute">
              <Camera className="h-7 w-7" />
              <Layers className="h-7 w-7" />
              <Globe2 className="h-7 w-7" />
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaBand
        title={t.closing.title}
        accent={t.closing.accent}
        body={t.closing.body}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <V3Button href={href("/services")} locale={locale}>
              {t.closing.services}
            </V3Button>
            <V3Button href={href("/tools")} variant="secondary" locale={locale}>
              {t.closing.tools}
            </V3Button>
          </div>
        }
      />
    </V3Page>
  )
}
