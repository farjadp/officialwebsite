// ============================================================================
// File Path: src/components/v3/reports/startup-concentration/report.tsx
// Why: Report 07, "Concentration, Not Diversification", for /reports/… and
//      /fa/reports/…. What the 2026 startup-ecosystem reports (StartupBlink,
//      Startup Genome) actually say once a summary of them is fact-checked.
//      Follows Farjad's own report: the fact-check comes first (as a game),
//      then the top-heavy recovery, the AI dollar trail, growth versus base,
//      unicorns, the structural shifts, the reads with their falsifiers, a
//      founder's round picker, data notes and sources. One component for
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
import { CatchUp, DollarTrail, FactCheckGame, Gains, Reads, RoundPicker, ScoreBars, StageSplit, UnicornGrid } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const FA = "۰۱۲۳۴۵۶۷۸۹"
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"
const MOVE_PHOTOS = [PHOTOS.riyadh, PHOTOS.wafer, PHOTOS.drone]

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

export function StartupConcentrationReport({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const digits = (s: string) => (fa ? s.replace(/\d/g, (x) => FA[Number(x)]) : s)
  const minutes = fa ? `${digits(String(meta.readMinutes))} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: ["StartupBlink", "Startup Genome", "Crunchbase"],
    citation: c.method.sources.map((s) => ({ label: s.label, href: s.href })),
    about: fa ? ["اکوسیستم استارتاپی", "سرمایه‌گذاری خطرپذیر", "یونیکورن", "راستی‌آزمایی"] : ["Startup ecosystems", "Venture capital", "Unicorns", "Fact-checking"],
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
          <Reveal immediate delay={0.12}>
            <p className="max-w-3xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{c.hero.lead}</p>
          </Reveal>
          <Reveal immediate delay={0.18}>
            <Photo photo={PHOTOS.hero} locale={locale} ratio="21/8" priority sizes="100vw" />
          </Reveal>
          <Reveal immediate delay={0.24}>
            <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {c.hero.kpis.map((k, i) => (
                <div key={k.l} className={`flex flex-col gap-1.5 rounded-2xl border p-4 md:p-5 ${i === 1 || i === 2 ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}>
                  <dt className="order-2 text-sm leading-snug text-v3-bone">{k.l}</dt>
                  <dd className={`order-1 font-v3-display text-4xl leading-none tabular-nums md:text-5xl ${i === 1 || i === 2 ? "text-v3-light" : "text-v3-bone"}`}>{k.n}</dd>
                  <dd className="order-3 text-xs text-v3-mute">{k.d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <p className="text-sm text-v3-light">{c.hero.medals}</p>
        </div>
      </header>

      {/* ── Fact-check game ──────────────────────────────────────────── */}
      <Block id="check" kicker={c.check.kicker} title={c.check.title} lead={c.check.lead} tone="beam">
        <FactCheckGame locale={locale} />
      </Block>

      {/* ── 1. Top-heavy recovery ────────────────────────────────────── */}
      <Block id="recovery" kicker={c.stage.kicker} title={c.stage.title} lead={c.stage.lead}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <StageSplit locale={locale} />
          </div>
          <Reveal className="lg:col-span-4">
            <Photo photo={PHOTOS.sandHill} locale={locale} ratio="4/3" sizes="(min-width: 1024px) 30vw, 100vw" />
          </Reveal>
        </div>
        <Callout title={c.stage.signal.title} body={c.stage.signal.body} tone="raised" />
        <Callout title={c.stage.callout.title} body={c.stage.callout.body} />
      </Block>

      {/* ── 2. The dollar trail ──────────────────────────────────────── */}
      <Block id="ai" kicker={c.dollar.kicker} title={c.dollar.title} lead={c.dollar.lead} tone="beam">
        <DollarTrail locale={locale} />
        <Callout title={c.dollar.callout.title} body={c.dollar.callout.body} />
      </Block>

      {/* ── 3. Fast growth, small base ───────────────────────────────── */}
      <Block id="base" kicker={c.base.kicker} title={c.base.title} lead={c.base.lead}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <ScoreBars locale={locale} />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <Gains locale={locale} />
            <Reveal>
              <Photo photo={PHOTOS.singapore} locale={locale} ratio="3/2" sizes="(min-width: 1024px) 38vw, 100vw" />
            </Reveal>
          </div>
        </div>
        <div className="mt-14">
          <CatchUp locale={locale} />
        </div>
        <Callout title={c.base.callout.title} body={c.base.callout.body} />
      </Block>

      {/* ── 4. Unicorns ──────────────────────────────────────────────── */}
      <Block id="unicorns" kicker={c.unicorns.kicker} title={c.unicorns.title} lead={c.unicorns.lead} tone="beam">
        <UnicornGrid locale={locale} />
        <Callout title={c.unicorns.callout.title} body={c.unicorns.callout.body} tone="raised" />
      </Block>

      {/* ── 5. Where the map moves ───────────────────────────────────── */}
      <Block id="moves" kicker={c.moves.kicker} title={c.moves.title} lead={c.moves.lead}>
        <div className="grid gap-6 md:grid-cols-3">
          {c.moves.items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08}>
              <Card tone={i === 0 ? "lit" : "raised"}>
                <Photo photo={MOVE_PHOTOS[i]} locale={locale} ratio="4/3" sizes="(min-width: 768px) 30vw, 100vw" />
                <h3 className="font-v3-display text-2xl text-v3-bone">{it.title}</h3>
                <p className="font-v3-display text-3xl text-v3-light">{it.stat}</p>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{it.data}</p>
                <p className="mt-auto border-t border-v3-line/70 pt-3 text-sm leading-relaxed text-v3-bone rtl:leading-loose">{it.why}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* ── 6. Reads ─────────────────────────────────────────────────── */}
      <Block id="reads" kicker={c.reads.kicker} title={c.reads.title} lead={c.reads.lead} tone="beam">
        <Reads locale={locale} />
      </Block>

      {/* ── For founders ─────────────────────────────────────────────── */}
      <Block id="round" kicker={c.round.kicker} title={c.round.title} lead={c.round.lead}>
        <RoundPicker locale={locale} />
      </Block>

      {/* ── Data notes and sources ───────────────────────────────────── */}
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
