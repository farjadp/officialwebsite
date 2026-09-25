// ============================================================================
// File Path: src/components/v3/pages/stats.tsx
// Why: /stats and /fa/stats in the v3 "Light" look, one component for both
//      locales so they cannot drift apart. Every word and every figure is the
//      pages' own, carried over verbatim from the v2 files; only the look
//      changed. Plain numbers count up (CountUp) with their original prefixes
//      and suffixes kept around them, so the rendered text is unchanged.
//      Fixed on the way:
//        - the meetings grid was drawn with Math.random(), so it changed on
//          every render; it is now a fixed pattern (it never carried data).
//        - the Persian CTA already pointed at /fa/contact; it now goes through
//          localePath like every other v3 link.
//        - the remote noise texture (grainy-gradients.vercel.app) is gone.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import { Coffee } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { CountUp, CtaBand, Headline, PageHero, Reveal, Section, V3Button, V3Page } from "@/components/v3/kit"

/**
 * A figure. Rendered as `pre` + CountUp(`cp` + to + `cs`) + `post`, which
 * reads exactly as the original string did. Words stay outside the counter
 * so Persian text keeps its own direction.
 */
type Num = { pre?: string; cp?: string; to: number; cs?: string; post?: string }

type Copy = {
  kicker: string
  title: string
  accent: string
  lead: string
  meta: { label: string; value: string }[]
  capital: { badge: string; num: Num; plus: string; body: string }
  self: { label: string; num: Num; body: string }
  funnel: { title: string; stages: { label: string; num: Num; bar: Num }[]; quote: string }
  sectors: { title: string; items: { num: Num; share: number; label: string }[] }
  tz: { title: string; sub: string; from: string; to: string; calls: string; num: Num; label: string }
  meetings: { num: Num; label: string; share: Num; shareLabel: string }
  output: { title: string; items: { num: Num; label: string }[] }
  failure: { title: string; num: Num; label: string; quote: string }
  truths: { title: string; rows: { label: string; num: Num }[]; note: string }
  coffee: { num: Num; label: string; cups: string; tea: string; quote: [string, string] }
  closing: { title: string; accent: string; cta: string }
}

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "The Unfiltered Log",
    title: "7 Years in the",
    accent: "Trenches.",
    lead: "Startups are not built on Instagram. They are built on caffeine, uncomfortable truths, and thousands of hours of unglamorous work. Here is the receipt.",
    meta: [
      { label: "Data Source", value: "Internal Logs" },
      { label: "Last Update", value: "March 2026" },
    ],
    capital: {
      badge: "Ecosystem Impact",
      num: { cp: "$", to: 3, cs: "M" },
      plus: "+",
      body: "Capital raised by teams I have mentored or advised. Real runway for real companies.",
    },
    self: {
      label: "Self-Funded (Iran)",
      num: { cp: "~$", to: 70, cs: "k" },
      body: "Bootstrapped from zero in a sanctioned economy. Money I personally risked and invested.",
    },
    funnel: {
      title: "Selection Criteria (The Funnel)",
      stages: [
        { label: "Applications Reviewed", num: { to: 500, cs: "+" }, bar: { to: 100, cs: "%", post: " Volume" } },
        { label: "First Interviews", num: { cp: "~", to: 50 }, bar: { to: 10, cs: "%", post: " Qualified" } },
        { label: "Active Mentees", num: { to: 5 }, bar: { to: 1, cs: "%", post: " Selected" } },
      ],
      quote: "\"I say no to 99% so I can give 100% to the few.\"",
    },
    sectors: {
      title: "Sector Experience",
      items: [
        { num: { to: 40, cs: "%" }, share: 40, label: "SaaS & B2B" },
        { num: { to: 30, cs: "%" }, share: 30, label: "AI & Data" },
        { num: { to: 20, cs: "%" }, share: 20, label: "Health & Bio" },
        { num: { to: 10, cs: "%" }, share: 10, label: "Deep Tech" },
      ],
    },
    tz: {
      title: "The Time Zone Bridge",
      sub: "Working while the world sleeps.",
      from: "Toronto (EST)",
      to: "Tehran/Dubai (+3.5/4)",
      calls: "4 AM Calls",
      num: { to: 4, cs: ",000+" },
      label: "Hours of Overlap",
    },
    meetings: {
      num: { to: 3, cs: ",000+" },
      label: "Online Meetings (4 Years)",
      share: { to: 90, cs: "%" },
      shareLabel: "Google Meet",
    },
    output: {
      title: "Output",
      items: [
        { num: { to: 150, cs: "k+" }, label: "Words Written (Essays)" },
        { num: { to: 50, cs: "+" }, label: "Mental Models Documented" },
      ],
    },
    failure: {
      title: "The Failure Rate",
      num: { cp: "~", to: 10, cs: "%" },
      label: "Project Mortality",
      quote: "\"Not every venture survives. I don't hide the graveyard; I teach from it.\"",
    },
    truths: {
      title: "Hard Truths",
      rows: [
        { label: "Arguments with Founders", num: { to: 12, cs: "+" } },
        { label: "Pivots Forced", num: { to: 8 } },
      ],
      note: "*Arguments usually result in saving months of wasted dev time.",
    },
    coffee: {
      num: { to: 5, cs: " : 1" },
      label: "Daily Coffee vs Tea",
      cups: "5 Cups of Coffee",
      tea: "Tea",
      quote: ["\"The engine runs on espresso.", "The strategy runs on patience.\""],
    },
    closing: { title: "Numbers don't lie.", accent: "Neither do I.", cta: "Let's Talk Business" },
  },
  fa: {
    kicker: "گزارش بی‌سانسور",
    title: "هفت سال در",
    accent: "سنگر",
    lead: "استارتاپ روی اینستاگرام ساخته نمی‌شود. با کافئین ساخته می‌شود، با حقیقت‌های ناخوشایند و هزاران ساعت کار بی‌زرق‌وبرق. این هم صورت‌حسابش.",
    meta: [
      { label: "منبع داده", value: "لاگ‌های داخلی" },
      { label: "آخرین به‌روزرسانی", value: "اسفند ۱۴۰۴" },
    ],
    capital: {
      badge: "اثر بر اکوسیستم",
      num: { to: 3, post: " میلیون دلار" },
      plus: "+",
      body: "سرمایه‌ای که تیم‌های زیر منتورشیپ یا مشاوره‌ی من جذب کرده‌اند. رانوِی واقعی برای شرکت‌های واقعی.",
    },
    self: {
      label: "سرمایه‌ی شخصی (ایران)",
      num: { pre: "حدود ", to: 70, post: " هزار دلار" },
      body: "از صفر و در اقتصادی تحریم‌شده بوت‌استرپ شد. پولی که خودم به خطر انداختم و سرمایه‌گذاری کردم.",
    },
    funnel: {
      title: "معیار انتخاب (قیف)",
      stages: [
        { label: "درخواست بررسی‌شده", num: { to: 500, cs: "+" }, bar: { to: 100, cs: "٪", post: " حجم ورودی" } },
        { label: "مصاحبه‌ی اول", num: { pre: "حدود ", to: 50 }, bar: { to: 10, cs: "٪", post: " واجد شرایط" } },
        { label: "منتی فعال", num: { to: 5 }, bar: { to: 1, cs: "٪", post: " انتخاب‌شده" } },
      ],
      quote: "«به ۹۹ درصد نه می‌گویم تا به آن چند نفر ۱۰۰ درصد بدهم.»",
    },
    sectors: {
      title: "تجربه‌ی صنعتی",
      items: [
        { num: { to: 40, cs: "٪" }, share: 40, label: "SaaS و B2B" },
        { num: { to: 30, cs: "٪" }, share: 30, label: "هوش مصنوعی و داده" },
        { num: { to: 20, cs: "٪" }, share: 20, label: "سلامت و زیست‌فناوری" },
        { num: { to: 10, cs: "٪" }, share: 10, label: "دیپ‌تک" },
      ],
    },
    tz: {
      title: "پل میان دو تایم‌زون",
      sub: "کار کردن وقتی دنیا خواب است.",
      from: "تورنتو (EST)",
      to: "تهران و دبی (‎+۳:۳۰‎ / ‎+۴‎)",
      calls: "جلسه‌های ۴ صبح",
      num: { to: 4, cs: "٬۰۰۰+" },
      label: "ساعت هم‌پوشانی",
    },
    meetings: {
      num: { to: 3, cs: "٬۰۰۰+" },
      label: "جلسه‌ی آنلاین (۴ سال)",
      share: { to: 90, cs: "٪" },
      shareLabel: "Google Meet",
    },
    output: {
      title: "خروجی",
      items: [
        { num: { pre: "‏", to: 150, post: " هزار+" }, label: "کلمه‌ی نوشته‌شده (یادداشت‌ها)" },
        { num: { to: 50, cs: "+" }, label: "مدل ذهنی مستندشده" },
      ],
    },
    failure: {
      title: "نرخ شکست",
      num: { pre: "حدود ", to: 10, cs: "٪" },
      label: "مرگ‌ومیر پروژه‌ها",
      quote: "«هر کسب‌وکاری زنده نمی‌ماند. گورستان را پنهان نمی‌کنم؛ از رویش درس می‌دهم.»",
    },
    truths: {
      title: "حقیقت‌های تلخ",
      rows: [
        { label: "بحث جدی با بنیان‌گذاران", num: { to: 12, cs: "+" } },
        { label: "پیوت تحمیل‌شده", num: { to: 8 } },
      ],
      note: "* این بحث‌ها معمولاً ماه‌ها توسعه‌ی هدررفته را نجات می‌دهند.",
    },
    coffee: {
      num: { to: 5, cs: " : ۱" },
      label: "قهوه به چای در روز",
      cups: "۵ فنجان قهوه",
      tea: "چای",
      quote: ["«موتور با اسپرسو کار می‌کند.", "استراتژی با صبر.»"],
    },
    closing: { title: "عددها دروغ نمی‌گویند.", accent: "من هم نمی‌گویم.", cta: "درباره‌ی کار حرف بزنیم" },
  },
}

// Static width classes so Tailwind can see them. Values are the chart's data.
const SHARE_WIDTH: Record<number, string> = { 1: "w-[1%]", 10: "w-[10%]", 20: "w-[20%]", 30: "w-[30%]", 40: "w-[40%]", 100: "w-full" }
// The funnel narrows stage by stage, as the original did with padding.
const FUNNEL_INSET = ["", "px-6 md:px-10", "px-12 md:px-20"]
// The meetings grid is decoration, not data: a fixed pattern (was Math.random).
const MEETING_CELLS = Array.from({ length: 80 }, (_, i) => {
  const h = (i * 37 + 11) % 10
  if (h < 3) return "bg-v3-line/60"
  return ["bg-v3-light/30", "bg-v3-light/50", "bg-v3-light/70", "bg-v3-light/90"][(i * 7) % 4]
})

const TILE =
  "group relative flex h-full flex-col gap-6 overflow-hidden rounded-2xl border border-v3-line/80 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/50 md:p-9"
const LABEL = "text-sm text-v3-mute"
const FIGURE = "font-v3-display font-light tabular-nums text-v3-bone"

function Figure({ n, locale, className }: { n: Num; locale: Locale; className?: string }) {
  return (
    <span className={className}>
      {n.pre}
      <CountUp to={n.to} prefix={n.cp} suffix={n.cs} locale={locale} />
      {n.post}
    </span>
  )
}

function Tile({ children, className, delay = 0, raised = false }: { children: ReactNode; className?: string; delay?: number; raised?: boolean }) {
  return (
    <Reveal delay={delay} className={className}>
      <div className={`${TILE} ${raised ? "bg-v3-raise" : "hover:bg-v3-raise"}`}>{children}</div>
    </Reveal>
  )
}

export function StatsPage({ locale }: { locale: Locale }) {
  const t = COPY[locale]

  return (
    <V3Page>
      <PageHero
        kicker={t.kicker}
        title={t.title}
        accent={t.accent}
        lead={t.lead}
        actions={
          <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-v3-line/70 pt-6">
            {t.meta.map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <dt className="text-sm text-v3-light">{m.label}</dt>
                <dd className="text-sm text-v3-mute">{m.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-12">
          {/* ── Money ───────────────────────────────────────────────── */}
          <Tile className="md:col-span-8" raised>
            <svg aria-hidden viewBox="0 0 100 20" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full fill-current text-v3-light/10">
              <path d="M0 20 L0 15 Q10 10 20 18 T40 10 T60 14 T80 5 L100 0 V20 Z" />
            </svg>
            <span className="relative self-start rounded-full border border-v3-light/40 px-3 py-1.5 text-[13px] text-v3-light">{t.capital.badge}</span>
            <div className="relative mt-auto flex flex-col gap-5">
              <p className={`${FIGURE} text-7xl md:text-9xl`}>
                <Figure n={t.capital.num} locale={locale} />
                <span className="text-v3-light">{t.capital.plus}</span>
              </p>
              <p className="max-w-md border-s border-v3-line ps-4 text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.capital.body}</p>
            </div>
          </Tile>

          <Tile className="md:col-span-4" delay={0.08}>
            <span className={LABEL}>{t.self.label}</span>
            <div className="mt-auto flex flex-col gap-3">
              <Figure n={t.self.num} locale={locale} className={`${FIGURE} text-5xl md:text-6xl`} />
              <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.self.body}</p>
            </div>
          </Tile>

          {/* ── Selectivity & scope ─────────────────────────────────── */}
          <Tile className="md:col-span-6">
            <span className={LABEL}>{t.funnel.title}</span>
            <div className="flex flex-col gap-5">
              {t.funnel.stages.map((s, i) => {
                const last = i === t.funnel.stages.length - 1
                return (
                  <div key={s.label} className={FUNNEL_INSET[i]}>
                    <div className={`mb-2 flex justify-between gap-4 text-sm ${last ? "text-v3-light" : "text-v3-soft"}`}>
                      <span>{s.label}</span>
                      <Figure n={s.num} locale={locale} className="tabular-nums" />
                    </div>
                    <div
                      className={`flex h-10 items-center rounded-lg px-3 text-xs ${
                        last ? "justify-center bg-v3-light font-semibold text-v3-ink" : i === 0 ? "bg-v3-line/40 text-v3-mute" : "bg-v3-line/80 text-v3-soft"
                      }`}
                    >
                      <Figure n={s.bar} locale={locale} />
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-auto border-t border-v3-line/70 pt-5 text-center text-sm italic text-v3-mute rtl:not-italic">{t.funnel.quote}</p>
          </Tile>

          <Tile className="md:col-span-6" delay={0.08}>
            <span className={LABEL}>{t.sectors.title}</span>
            <ul className="flex flex-col gap-5">
              {t.sectors.items.map((s, i) => {
                const lit = i === t.sectors.items.length - 1
                return (
                  <li key={s.label} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <span className={`text-sm ${lit ? "text-v3-light" : "text-v3-soft"}`}>{s.label}</span>
                      <Figure n={s.num} locale={locale} className={`${FIGURE} text-3xl ${lit ? "text-v3-light" : ""}`} />
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-v3-line/60">
                      <div className={`h-full rounded-full ${SHARE_WIDTH[s.share]} ${lit ? "bg-v3-light" : "bg-v3-soft/70"}`} />
                    </div>
                  </li>
                )
              })}
            </ul>
          </Tile>

          {/* ── Time & effort ───────────────────────────────────────── */}
          <Tile className="md:col-span-12" raised>
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <Headline as="h3" size="card">{t.tz.title}</Headline>
                <p className="text-sm text-v3-mute">{t.tz.sub}</p>
              </div>
              <div className="w-full max-w-2xl flex-1">
                <div className="mb-3 flex justify-between gap-4 text-xs text-v3-mute">
                  <span>{t.tz.from}</span>
                  <span>{t.tz.to}</span>
                </div>
                <div className="flex h-4 w-full overflow-hidden rounded-full border border-v3-line">
                  <div className="h-full w-1/3 bg-v3-ink" />
                  <div className="h-full w-1/3 bg-v3-light" />
                  <div className="h-full w-1/3 bg-v3-line" />
                </div>
                <p className="mt-3 text-center text-xs text-v3-light">{t.tz.calls}</p>
              </div>
              <div className="flex flex-col gap-1 md:text-end">
                <Figure n={t.tz.num} locale={locale} className={`${FIGURE} text-4xl`} />
                <span className={LABEL}>{t.tz.label}</span>
              </div>
            </div>
          </Tile>

          <Tile className="md:col-span-8">
            <div className="flex items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <Figure n={t.meetings.num} locale={locale} className={`${FIGURE} text-5xl md:text-6xl`} />
                <p className={LABEL}>{t.meetings.label}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Figure n={t.meetings.share} locale={locale} className="text-xl font-semibold text-v3-light" />
                <span className="text-xs text-v3-mute">{t.meetings.shareLabel}</span>
              </div>
            </div>
            <div aria-hidden className="mt-auto grid h-16 w-full grid-cols-20 gap-1 opacity-70 transition-opacity duration-500 group-hover:opacity-100">
              {MEETING_CELLS.map((c, i) => (
                <div key={i} className={`rounded-[2px] ${c}`} />
              ))}
            </div>
          </Tile>

          <Tile className="md:col-span-4" delay={0.08}>
            <span className={LABEL}>{t.output.title}</span>
            <div className="mt-auto flex flex-col gap-6">
              {t.output.items.map((o) => (
                <div key={o.label} className="flex flex-col gap-1">
                  <Figure n={o.num} locale={locale} className={`${FIGURE} text-4xl`} />
                  <span className="text-sm text-v3-soft">{o.label}</span>
                </div>
              ))}
            </div>
          </Tile>

          {/* ── Reality check ───────────────────────────────────────── */}
          <Tile className="md:col-span-6">
            <Headline as="h3" size="card">{t.failure.title}</Headline>
            <div className="flex items-end gap-3">
              <Figure n={t.failure.num} locale={locale} className={`${FIGURE} text-5xl text-v3-mute`} />
              <span className="mb-2 text-sm text-v3-mute">{t.failure.label}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-v3-line/60">
              <div className="h-full w-[10%] rounded-full bg-v3-mute" />
            </div>
            <p className="text-sm italic text-v3-mute rtl:not-italic">{t.failure.quote}</p>
          </Tile>

          <Tile className="md:col-span-6" delay={0.08}>
            <span className={LABEL}>{t.truths.title}</span>
            <dl className="flex flex-col">
              {t.truths.rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-4 border-b border-v3-line/60 py-4 last:border-b-0">
                  <dt className="text-lg text-v3-soft">{r.label}</dt>
                  <dd>
                    <Figure n={r.num} locale={locale} className={`${FIGURE} text-3xl`} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-auto border-t border-v3-line/70 pt-4 text-xs text-v3-mute">{t.truths.note}</p>
          </Tile>

          <Tile className="md:col-span-12" raised>
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="flex items-center gap-6">
                <span className="rounded-full border border-v3-light/50 p-4 text-v3-light">
                  <Coffee className="h-8 w-8" aria-hidden />
                </span>
                <div className="flex flex-col gap-2">
                  <Figure n={t.coffee.num} locale={locale} className={`${FIGURE} text-5xl leading-none`} />
                  <p className={LABEL}>{t.coffee.label}</p>
                </div>
              </div>
              <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
                <div className="flex gap-3" title={t.coffee.cups}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Coffee key={i} className="h-7 w-7 text-v3-soft" aria-hidden />
                  ))}
                </div>
                <span aria-hidden className="h-8 w-px rotate-12 bg-v3-line" />
                <div className="flex flex-col items-center gap-1">
                  <Coffee className="h-7 w-7 text-v3-light" aria-hidden />
                  <span className="text-xs text-v3-light">{t.coffee.tea}</span>
                </div>
              </div>
              <p className="max-w-xs text-center text-sm italic leading-relaxed text-v3-soft md:text-end rtl:not-italic rtl:leading-loose">
                {t.coffee.quote[0]}
                <br />
                {t.coffee.quote[1]}
              </p>
            </div>
          </Tile>
        </div>
      </Section>

      <CtaBand
        title={t.closing.title}
        accent={t.closing.accent}
        action={
          <V3Button href={localePath(locale, "/contact")} locale={locale}>
            {t.closing.cta}
          </V3Button>
        }
      />
    </V3Page>
  )
}
