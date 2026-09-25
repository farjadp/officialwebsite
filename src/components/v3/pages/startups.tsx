// ============================================================================
// File Path: src/components/v3/pages/startups.tsx
// Why: /startups and /fa/startups in the v3 "Light" look, one component for
//      both locales so they cannot drift apart. The page copy is the v2
//      pages' own, carried over word for word; the cards still come from the
//      MentoredStartup table, queried in each page.tsx exactly as before.
//      Only the look changed.
//      Known gap (not fixed here): MentoredStartup has no locale column, so
//      the Persian page shows the same database text as the English one.
//      Fixed on the way: the Persian CTA used a hardcoded "/fa/contact"
//      (now localePath); the Website / LinkedIn links fell back to "#" with
//      target=_blank and no rel — they now render only when a URL exists,
//      with rel="noopener noreferrer".
// Env / Identity: React Server Component; client leaves in ../motion
// ============================================================================

import type { MentoredStartup } from "@prisma/client"
import { Calendar, CheckCircle2, CircleDashed, Globe, Linkedin, Star } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { Card, Chip, CountUp, CtaBand, Headline, PageHero, Reveal, V3Button, V3Page } from "@/components/v3/kit"

type Stat = { to: number; suffix?: string; label: string; note: string; lit?: boolean; badge?: boolean }

type Copy = {
  kicker: string
  title: string
  accent: string
  lead: string
  stats: Stat[]
  logoAlt: (name: string) => string
  quote: (text: string) => string
  timeline: string
  status: string
  founder: string
  website: string
  linkedin: string
  closing: { title: string; body: string; action: string }
}

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "Mentorship & Advisory",
    title: "The Startup",
    accent: "Portfolio.",
    lead: "A curated list of ambitious ventures I’ve had the privilege of advising, mentoring, and helping scale across diverse industries.",
    stats: [
      { to: 25, label: "Total Ventures", note: "Mentored & Advised", lit: true },
      { to: 7, label: "Yrs Longest Eng.", note: "\"We basically grew up together.\"" },
      { to: 86, suffix: "%", label: "Survival Rate", note: "14% Pivoted Hard", badge: true },
      { to: 4, suffix: "k+", label: "Late Night Calls", note: "Plus an infinite amount of coffee." },
    ],
    logoAlt: (name) => `${name} Logo`,
    quote: (text) => `"${text}"`,
    timeline: "Timeline",
    status: "Status",
    founder: "Founder",
    website: "Website",
    linkedin: "LinkedIn",
    closing: {
      title: "Join the Portfolio.",
      body: "If you’re building something meaningful and need experienced guidance, let's explore how we can architect your success together.",
      action: "Get in Touch",
    },
  },
  fa: {
    kicker: "منتورشیپ و مشاوره",
    title: "پورتفولیوی",
    accent: "استارتاپ‌ها",
    lead: "فهرستی گزیده از کسب‌وکارهای جاه‌طلبی که افتخار مشاوره، منتورشیپ و همراهی در رشدشان را در صنایع مختلف داشته‌ام.",
    stats: [
      { to: 25, label: "مجموع کسب‌وکارها", note: "منتورشده و مشاوره‌گرفته", lit: true },
      { to: 7, label: "سال، طولانی‌ترین همکاری", note: "«عملاً با هم بزرگ شدیم.»" },
      { to: 86, suffix: "٪", label: "نرخ بقا", note: "۱۴٪ پیوت سنگین", badge: true },
      { to: 4, suffix: " هزار+", label: "تماس شبانه", note: "به‌علاوه‌ی مقدار بی‌نهایتی قهوه." },
    ],
    logoAlt: (name) => `لوگوی ${name}`,
    quote: (text) => `«${text}»`,
    timeline: "بازه‌ی زمانی",
    status: "وضعیت",
    founder: "بنیان‌گذار",
    website: "وب‌سایت",
    linkedin: "لینکدین",
    closing: {
      title: "به این پورتفولیو بپیوندید",
      body: "اگر چیز معناداری می‌سازید و به راهنمایی باتجربه نیاز دارید، بیایید ببینیم چطور می‌شود موفقیتتان را با هم معماری کرد.",
      action: "در تماس باشید",
    },
  },
}

const WRAP = "mx-auto w-full max-w-[1600px] px-5 md:px-10 lg:px-14"
const LINK =
  "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-v3-line text-sm text-v3-soft transition-colors duration-300 hover:border-v3-light/60 hover:text-v3-light"

export function StartupsIndex({ locale, startups }: { locale: Locale; startups: MentoredStartup[] }) {
  const t = COPY[locale]

  return (
    <V3Page>
      <PageHero kicker={t.kicker} title={t.title} accent={t.accent} lead={t.lead} />

      {/* ── Figures ─────────────────────────────────────────────────── */}
      <section className="border-b border-v3-line/70">
        <div className={`${WRAP} py-16 md:py-20`}>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-v3-line/70 bg-v3-line/70 lg:grid-cols-4">
            {t.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.08}
                className={`flex h-full flex-col gap-3 p-7 transition-colors duration-500 hover:bg-v3-raise md:p-8 ${s.lit ? "bg-v3-raise" : "bg-v3-ink"}`}
              >
                <CountUp
                  to={s.to}
                  suffix={s.suffix}
                  locale={locale}
                  className={`font-v3-display text-5xl font-light md:text-6xl ${s.lit ? "text-v3-light" : "text-v3-bone"}`}
                />
                <span className="text-sm text-v3-soft">{s.label}</span>
                {s.badge ? (
                  <Chip className="self-start border-v3-light/50 text-v3-light">{s.note}</Chip>
                ) : (
                  <span className="text-sm text-v3-mute">{s.note}</span>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── The portfolio ───────────────────────────────────────────── */}
      <section className="border-b border-v3-line/70">
        <div className={`${WRAP} grid gap-5 py-20 md:grid-cols-2 md:py-28 lg:grid-cols-3`}>
          {startups.map((startup, idx) => (
            <Reveal key={startup.id} delay={(idx % 3) * 0.08}>
              <Card
                tone="raised"
                className="group gap-6 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60"
              >
                {/* Logo and name */}
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-v3-line bg-v3-ink">
                    {startup.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={startup.logo}
                        alt={t.logoAlt(startup.name)}
                        className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Headline as="h3" size="card" className="truncate transition-colors group-hover:text-v3-light">
                        {startup.name}
                      </Headline>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-v3-light/40 px-2 py-0.5 text-xs text-v3-light">
                        <Star className="h-3 w-3 fill-current" aria-hidden />
                        {startup.satisfaction}
                      </span>
                    </div>
                    <Chip className="self-start text-xs">{startup.industry}</Chip>
                  </div>
                </div>

                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{t.quote(startup.description)}</p>

                {/* Timeline and status */}
                <dl className="grid grid-cols-2 gap-4 border-y border-v3-line/70 py-5">
                  <div className="flex flex-col gap-1.5">
                    <dt className="flex items-center gap-1.5 text-xs text-v3-mute">
                      <Calendar className="h-3 w-3" aria-hidden />
                      {t.timeline}
                    </dt>
                    <dd className="text-sm tabular-nums text-v3-bone">
                      <span dir="ltr">
                        {startup.startDate} — {startup.endDate}
                      </span>
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <dt className="flex items-center gap-1.5 text-xs text-v3-mute">
                      {startup.isActive ? (
                        <CircleDashed className="h-3 w-3 text-v3-light motion-safe:animate-spin motion-safe:[animation-duration:3s]" aria-hidden />
                      ) : (
                        <CheckCircle2 className="h-3 w-3" aria-hidden />
                      )}
                      {t.status}
                    </dt>
                    <dd className="text-sm text-v3-bone">{startup.status}</dd>
                  </div>
                </dl>

                <div className="mt-auto flex flex-col gap-5">
                  {/* Founder */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-v3-line bg-v3-ink">
                      {startup.founderPhoto && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={startup.founderPhoto}
                          alt={startup.founderName}
                          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-v3-mute">{t.founder}</p>
                      <p className="truncate text-sm text-v3-bone">{startup.founderName}</p>
                    </div>
                  </div>

                  {/* Links */}
                  {(startup.website || startup.linkedin) && (
                    <div className="flex items-center gap-2">
                      {startup.website && (
                        <a href={startup.website} target="_blank" rel="noopener noreferrer" className={LINK}>
                          <Globe className="h-4 w-4" aria-hidden />
                          {t.website}
                        </a>
                      )}
                      {startup.linkedin && (
                        <a href={startup.linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
                          <Linkedin className="h-4 w-4" aria-hidden />
                          {t.linkedin}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title={t.closing.title}
        body={t.closing.body}
        action={
          <V3Button href={localePath(locale, "/contact")} locale={locale}>
            {t.closing.action}
          </V3Button>
        }
      />
    </V3Page>
  )
}
