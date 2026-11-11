// ============================================================================
// File Path: src/components/v3/reports/undecided-fifth/report.tsx
// Why: Report 08, "The Undecided Fifth", for /reports/… and /fa/reports/….
//      What Pew Research Center's last major survey before the 2026 U.S.
//      midterms actually measured, read past its eight-point headline: the
//      whole chart, where the lead came from, the uncommitted fifth, each
//      party's consolidation, the engagement reversal, a clearly labelled
//      what-if model with a guessing game, two fair readings, the takeaway,
//      cautions and sources. Follows Farjad's own analysis. One component for
//      both locales; a server component, so every sentence is in the HTML.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import type { ReactNode } from "react"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { formatReportDate, type ReportMeta } from "@/lib/reports"
import { Beam, Card, Headline, Kicker, Lead, Reveal, Spotlight, V3Button, V3Page } from "@/components/v3/kit"
import { ReadingProgress } from "@/components/v3/reading-progress"
import { ReportColophon } from "../colophon"
import { Photo } from "../photo"
import { reportJsonLd } from "../report-route"
import { COPY } from "./copy"
import { MedalCase } from "./medals"
import { PHOTOS } from "./photos"
import { BreakSlider, Engagement, GuessGame, MarginPlot, PartyStacks, PreferenceChart, SwingExplorer, UndecidedRank } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const FA = "۰۱۲۳۴۵۶۷۸۹"
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"
const KPI_TONE = ["text-v3-dem", "text-v3-rep", "text-v3-light", "text-v3-bone"]

function Block({ id, kicker, title, lead, children, tone }: { id?: string; kicker: string; title: string; lead?: string; children?: ReactNode; tone?: "beam" }) {
  return (
    <section id={id} className="relative isolate overflow-hidden border-b border-v3-line/70">
      {tone === "beam" && <Beam className="[animation-delay:-6s]" />}
      <div className={`${WRAP} py-20 md:py-28`}>
        <Reveal className="mb-12 flex flex-col gap-4 md:mb-16">
          <Kicker>{kicker}</Kicker>
          <Headline className="max-w-4xl">{title}</Headline>
          {lead && <Lead className="mt-2">{lead}</Lead>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

function Prose({ paras }: { paras: string[] }) {
  return (
    <div className="flex max-w-3xl flex-col gap-5">
      {paras.map((p) => (
        <Reveal key={p}>
          <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{p}</p>
        </Reveal>
      ))}
    </div>
  )
}

function Callout({ title, body, tone = "lit" }: { title: string; body: string; tone?: "lit" | "raised" }) {
  return (
    <Reveal className="mt-12 max-w-4xl">
      <Card tone={tone}>
        <h3 className="font-v3-display text-2xl text-v3-bone">{title}</h3>
        <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{body}</p>
      </Card>
    </Reveal>
  )
}

export function UndecidedFifthReport({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const digits = (s: string) => (fa ? s.replace(/\d/g, (x) => FA[Number(x)]) : s)
  const minutes = fa ? `${digits(String(meta.readMinutes))} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: ["Pew Research Center", "American Trends Panel", "The American Presidency Project"],
    citation: c.method.sources.map((s) => ({ label: s.label, href: s.href })),
    about: fa
      ? ["انتخابات میان‌دوره‌ای ۲۰۲۶ آمریکا", "نظرسنجی", "رأی‌دهندگان بی‌تصمیم", "سواد داده"]
      : ["2026 United States elections", "Opinion polling", "Undecided voters", "Data literacy"],
  })

  return (
    <V3Page>
      {jsonLd.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
      <ReadingProgress />
      <MedalCase locale={locale} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header className="relative isolate overflow-hidden border-b border-v3-line/70">
        <Beam />
        <Spotlight className="-z-10" />
        <div className={`${WRAP} flex flex-col gap-10 py-16 md:py-24`}>
          <Reveal immediate className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-v3-mute">
            <Link href={localePath(locale, "/reports")} className="text-v3-light hover:underline hover:underline-offset-4">
              {c.hero.kicker}
            </Link>
            <span aria-hidden>·</span>
            <span>{m.topic}</span>
            <span aria-hidden>·</span>
            <time dateTime={meta.published}>{formatReportDate(meta.published, locale)}</time>
            <span aria-hidden>·</span>
            <span>{minutes}</span>
          </Reveal>
          <Reveal immediate delay={0.06}>
            <Headline as="h1" size="hero" accent={<span className="mt-2 block">{m.tagline}</span>} className="max-w-5xl">
              {m.title}
            </Headline>
          </Reveal>
          <Reveal immediate delay={0.12} className="flex flex-col gap-3">
            <p className="max-w-3xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{c.hero.lead}</p>
            <p className="text-sm text-v3-mute">{c.hero.byline}</p>
          </Reveal>
          <Reveal immediate delay={0.18}>
            <Photo photo={PHOTOS.hero} locale={locale} ratio="21/8" priority sizes="100vw" />
          </Reveal>
          <Reveal immediate delay={0.24}>
            <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {c.hero.kpis.map((k, i) => (
                <div key={k.l} className={`flex flex-col gap-1.5 rounded-2xl border p-4 md:p-5 ${i === 2 ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}>
                  <dt className="order-2 text-sm leading-snug text-v3-bone">{k.l}</dt>
                  <dd className={`order-1 font-v3-display text-4xl leading-none tabular-nums md:text-5xl ${KPI_TONE[i]}`}>{k.n}</dd>
                  <dd className="order-3 text-xs leading-relaxed text-v3-mute">{k.d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal immediate delay={0.3} className="max-w-4xl">
            <Card tone="raised">
              <h2 className="font-v3-display text-xl text-v3-bone">{c.hero.timing.title}</h2>
              <p className="leading-relaxed text-v3-soft rtl:leading-loose">{c.hero.timing.body}</p>
            </Card>
          </Reveal>
          <p className="text-sm text-v3-light">{c.hero.medals}</p>
        </div>
      </header>

      {/* ── 1. The whole chart ───────────────────────────────────────── */}
      <Block id="chart" kicker={c.chart.kicker} title={c.chart.title} lead={c.chart.lead} tone="beam">
        <PreferenceChart locale={locale} />
      </Block>

      {/* ── 2. Where the lead came from ──────────────────────────────── */}
      <Block id="margins" kicker={c.margins.kicker} title={c.margins.title} lead={c.margins.lead}>
        <MarginPlot locale={locale} />
        <div className="mt-14">
          <Prose paras={[c.margins.intro]} />
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {c.margins.patterns.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <Card tone={i === 0 ? "lit" : "raised"}>
                <h3 className="font-v3-display text-2xl text-v3-bone">{p.title}</h3>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{p.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* ── 3. The undecided ─────────────────────────────────────────── */}
      <Block id="undecided" kicker={c.pool.kicker} title={c.pool.title} tone="beam">
        <Reveal className="mb-14 max-w-4xl">
          <figure className="border-s-4 border-v3-light bg-v3-light/10 px-6 py-5 font-v3-display text-2xl leading-snug text-v3-bone md:text-3xl rtl:leading-relaxed">{c.pool.pull}</figure>
        </Reveal>
        <Lead className="mb-10">{c.pool.lead}</Lead>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <UndecidedRank locale={locale} />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Prose paras={c.pool.body} />
            <Reveal>
              <Photo photo={PHOTOS.stickers} locale={locale} ratio="4/3" sizes="(min-width: 1024px) 38vw, 100vw" />
            </Reveal>
          </div>
        </div>
        <div className="mt-14">
          <BreakSlider locale={locale} />
        </div>
      </Block>

      {/* ── 4. Consolidation ─────────────────────────────────────────── */}
      <Block id="consolidation" kicker={c.consolidation.kicker} title={c.consolidation.title} lead={c.consolidation.lead}>
        <PartyStacks locale={locale} />
        <div className="mt-12">
          <Prose paras={c.consolidation.body} />
        </div>
        <Callout title={c.consolidation.callout.title} body={c.consolidation.callout.body} />
      </Block>

      {/* ── 5. Engagement ────────────────────────────────────────────── */}
      <Block id="engagement" kicker={c.engagement.kicker} title={c.engagement.title} lead={c.engagement.lead} tone="beam">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Engagement locale={locale} />
          </div>
          <Reveal className="flex flex-col gap-4 lg:col-span-5">
            <h3 className="text-sm text-v3-mute">{c.engagement.moodTitle}</h3>
            <dl className="grid grid-cols-2 gap-3">
              {c.engagement.mood.map((k) => (
                <div key={k.l} className="flex flex-col gap-1.5 rounded-2xl border border-v3-line/80 p-4">
                  <dt className="order-2 text-sm leading-snug text-v3-soft">{k.l}</dt>
                  <dd className="order-1 font-v3-display text-3xl text-v3-bone tabular-nums">{k.n}</dd>
                </div>
              ))}
            </dl>
            <p className="leading-relaxed text-v3-soft rtl:leading-loose">{c.engagement.moodNote}</p>
          </Reveal>
        </div>
      </Block>

      {/* ── 6. What if only one group voted? ─────────────────────────── */}
      <Block id="model" kicker={c.model.kicker} title={c.model.title} lead={c.model.lead}>
        <Reveal className="mb-14 max-w-4xl">
          <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-v3-light/70 p-5 md:p-6">
            <h3 className="font-semibold text-v3-light">{c.model.warn.title}</h3>
            <p className="leading-relaxed text-v3-soft rtl:leading-loose">{c.model.warn.method}</p>
            <p className="leading-relaxed text-v3-soft rtl:leading-loose">{c.model.warn.breaks}</p>
          </div>
        </Reveal>
        <div className="flex flex-col gap-4">
          <h3 className="font-v3-display text-3xl text-v3-bone">{c.model.gameTitle}</h3>
          <p className="max-w-3xl leading-relaxed text-v3-soft rtl:leading-loose">{c.model.gameLead}</p>
          <GuessGame locale={locale} />
        </div>
        <div className="mt-16 flex flex-col gap-4">
          <h3 className="font-v3-display text-3xl text-v3-bone">{c.model.explorerTitle}</h3>
          <SwingExplorer locale={locale} />
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Prose paras={[c.model.lessons]} />
          </div>
          <Reveal className="lg:col-span-5">
            <Photo photo={PHOTOS.line} locale={locale} ratio="4/3" sizes="(min-width: 1024px) 38vw, 100vw" />
          </Reveal>
        </div>
      </Block>

      {/* ── 7. Two fair readings ─────────────────────────────────────── */}
      <Block id="readings" kicker={c.readings.kicker} title={c.readings.title} tone="beam">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { r: c.readings.solid, tone: "border-t-v3-dem" },
            { r: c.readings.soft, tone: "border-t-v3-rep" },
          ].map(({ r, tone }, i) => (
            <Reveal key={r.title} delay={i * 0.08}>
              <div className={`flex h-full flex-col gap-4 rounded-3xl border border-v3-line border-t-4 bg-v3-raise p-6 ${tone}`}>
                <h3 className="font-v3-display text-2xl text-v3-bone">{r.title}</h3>
                <ul className="flex list-disc flex-col gap-2.5 ps-5 leading-relaxed text-v3-soft marker:text-v3-mute rtl:leading-loose">
                  {r.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Prose paras={[c.readings.after]} />
        </div>
      </Block>

      {/* ── Takeaway ─────────────────────────────────────────────────── */}
      <Block id="takeaway" kicker={c.takeaway.kicker} title={c.takeaway.title}>
        <Reveal className="max-w-4xl">
          <p className="font-v3-display text-xl leading-relaxed text-v3-bone md:text-2xl rtl:leading-loose">{c.takeaway.body}</p>
        </Reveal>
      </Block>

      {/* ── Cautions and sources ─────────────────────────────────────── */}
      <Block id="notes" kicker={c.notes.kicker} title={c.notes.title}>
        <div className="grid gap-14 lg:grid-cols-2">
          <ul className="flex flex-col">
            {c.notes.items.map((n) => (
              <li key={n.t} className="flex flex-col gap-1 border-b border-v3-line/60 py-4 last:border-b-0">
                <span className="text-v3-bone">{n.t}</span>
                <span className="leading-relaxed text-v3-soft rtl:leading-loose">{n.b}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm text-v3-mute">{c.method.sourcesTitle}</h3>
            <ol className={`flex list-decimal flex-col gap-2.5 ps-5 text-sm text-v3-soft marker:text-v3-mute ${LATIN}`} dir="ltr">
              {c.method.sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-v3-line underline-offset-4 hover:text-v3-light hover:decoration-v3-light">
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-v3-mute rtl:leading-loose">{c.method.footnote}</p>
          </div>
        </div>
      </Block>

      <ReportColophon
        locale={locale}
        path={`/reports/${meta.slug}`}
        shareTitle={c.colophon.shareTitle}
        disclaimer={c.colophon.disclaimer}
        action={
          <V3Button href={localePath(locale, "/booking")} locale={locale}>
            {c.colophon.cta}
          </V3Button>
        }
      />
    </V3Page>
  )
}
