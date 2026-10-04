// ============================================================================
// File Path: src/components/v3/reports/direct-to-cell/report.tsx
// Why: Report 03, "Starlink on an ordinary phone in Iran?", for /reports/…
//      and /fa/reports/…. One component for both locales. A server component:
//      every sentence is in the HTML; the globe and the interactive figures
//      come from ./globe and ./widgets. The order follows Farjad's text: the
//      verdict first, then what the technology is, where it runs, Iran, and
//      the physics that decides what it can carry.
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
import { DtcGlobe } from "./globe"
import { PHOTOS } from "./photos"
import { BeamCalculator, ClaimCards, Generations, JammingDiagram, SignalGauge, Switchboard } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const FA = "۰۱۲۳۴۵۶۷۸۹"

function Block({ id, kicker, title, lead, children, tone }: { id?: string; kicker: string; title: string; lead?: string; children?: ReactNode; tone?: "beam" }) {
  return (
    <section id={id} className={`relative isolate overflow-hidden border-b border-v3-line/70`}>
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
      {paras.map((p, i) => (
        <Reveal key={i} delay={i * 0.05}>
          <p className="text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{p}</p>
        </Reveal>
      ))}
    </div>
  )
}

function Pull({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <p className="my-12 max-w-4xl border-s-2 border-v3-light ps-6 font-v3-display text-3xl font-light leading-snug text-v3-bone md:text-5xl rtl:leading-relaxed">
        {children}
      </p>
    </Reveal>
  )
}

export function DirectToCellReport({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const digits = (s: string) => (fa ? s.replace(/\d/g, (x) => FA[Number(x)]) : s)
  const minutes = fa ? `${digits(String(meta.readMinutes))} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: ["SpaceX", "Starlink", "T-Mobile", "Beeline Kazakhstan"],
    citation: c.method.sources,
    about: fa
      ? ["استارلینک", "Direct to Cell", "اینترنت ماهواره‌ای", "قطع اینترنت در ایران", "شبکه‌ی غیرزمینی"]
      : ["Starlink", "Direct to Cell", "Satellite internet", "Internet shutdowns in Iran", "Non-terrestrial networks"],
  })

  return (
    <V3Page>
      {jsonLd.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
      <ReadingProgress />

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

          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="flex flex-col gap-8 lg:col-span-7">
              <Reveal immediate delay={0.12}>
                <p className="border-s-2 border-v3-light ps-6 font-v3-display text-2xl font-light leading-snug text-v3-bone md:text-3xl rtl:leading-relaxed">
                  {c.hero.verdict}
                </p>
              </Reveal>
              <Reveal immediate delay={0.18}>
                <p className="text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{c.hero.viral}</p>
              </Reveal>
              <Reveal immediate delay={0.22}>
                <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{c.hero.aiNote}</p>
              </Reveal>
            </div>
            <Reveal immediate delay={0.26} className="flex flex-col gap-6 lg:col-span-5">
              <Photo photo={PHOTOS.hero} locale={locale} ratio="4/5" priority sizes="(min-width: 1024px) 40vw, 100vw" />
            </Reveal>
          </div>

          <Reveal immediate delay={0.3} className="flex flex-col gap-3">
            <p className="flex flex-wrap items-baseline gap-x-5 font-v3-display font-light leading-none">
              <span className="text-[clamp(5rem,15vw,12rem)] tracking-[-0.03em] text-v3-light drop-shadow-[0_0_60px_rgb(var(--v3-glow)/0.35)]">
                {c.hero.mega}
              </span>
              <span className="text-3xl text-v3-bone md:text-5xl">{c.hero.megaUnit}</span>
            </p>
            <p className="max-w-2xl text-v3-soft">{c.hero.megaLabel}</p>
          </Reveal>
          <p className="text-xs text-v3-mute">{c.hero.asOf}</p>
        </div>
      </header>

      {/* ── Findings ─────────────────────────────────────────────────── */}
      <section className="border-b border-v3-line/70">
        <div className={`${WRAP} py-20 md:py-24`}>
          <Reveal className="mb-10 flex flex-col gap-3">
            <Kicker>{c.findings.kicker}</Kicker>
            <Headline className="max-w-3xl">{c.findings.title}</Headline>
          </Reveal>
          <ol className="grid gap-x-12 gap-y-1 lg:grid-cols-2">
            {c.findings.items.map((f, i) => (
              <li key={i} className="border-b border-v3-line/60">
                <Reveal delay={i * 0.06} className="flex gap-5 py-5">
                  <span className="mt-1 shrink-0 font-v3-display text-xl tabular-nums text-v3-light">{digits(`0${i + 1}`)}</span>
                  <span className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{f}</span>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What it is ───────────────────────────────────────────────── */}
      <Block id="what" kicker={c.what.kicker} title={c.what.title}>
        <Prose paras={c.what.body} />
        <Pull>{c.what.pull}</Pull>
        <Prose paras={c.what.body2} />
      </Block>

      {/* ── Globe ────────────────────────────────────────────────────── */}
      <Block id="map" kicker={fa ? "نقشه" : "The map"} title={c.globe.title} lead={c.globe.lead} tone="beam">
        <DtcGlobe locale={locale} />
      </Block>

      {/* ── Now ──────────────────────────────────────────────────────── */}
      <Block id="now" kicker={c.now.kicker} title={c.now.title}>
        <Prose paras={c.now.body} />
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {c.now.stats.map((st, i) => (
            <Reveal key={st.l} delay={i * 0.08} className="flex flex-col gap-2 border-t border-v3-line pt-6">
              <bdi dir="ltr" className="self-start font-v3-display text-5xl font-light text-v3-light md:text-6xl">{st.v}</bdi>
              <span className="text-v3-soft">{st.l}</span>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs text-v3-mute">{c.now.statsNote}</p>
        <Reveal className="mt-10">
          <ul className="flex flex-wrap gap-3">
            {c.now.uses.map((u) => (
              <li key={u} className="rounded-full border border-v3-light/50 bg-v3-light/10 px-5 py-2.5 text-v3-bone">
                {u}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="mt-10">
          <p className="max-w-3xl text-xl leading-relaxed text-v3-bone rtl:leading-loose">{c.now.closing}</p>
        </Reveal>
      </Block>

      {/* ── Iran ─────────────────────────────────────────────────────── */}
      <Block id="iran" kicker={c.iran.kicker} title={c.iran.title}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Prose paras={c.iran.body} />
          </div>
          <Reveal className="lg:col-span-5">
            <Photo photo={PHOTOS.tehran} locale={locale} ratio="1/1" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
        </div>
        <div className="mt-12 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Reveal>
            <Card tone="raised">
              <span className="text-sm text-v3-light">{fa ? "ممکن در نظریه" : "Possible in theory"}</span>
              <p className="font-v3-display text-2xl leading-snug text-v3-bone rtl:leading-relaxed">{c.iran.gapA}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.08} className="flex items-center justify-center">
            <span aria-hidden className="relative block h-px w-24 bg-[repeating-linear-gradient(90deg,var(--v3-mute)_0_6px,transparent_6px_12px)] md:h-full md:w-px md:bg-[repeating-linear-gradient(180deg,var(--v3-mute)_0_6px,transparent_6px_12px)]" />
          </Reveal>
          <Reveal delay={0.16}>
            <Card>
              <span className="text-sm text-v3-mute">{fa ? "امروز در ایران" : "Today, in Iran"}</span>
              <p className="font-v3-display text-2xl leading-snug text-v3-mute line-through decoration-v3-mute/50 rtl:leading-relaxed">{c.iran.gapB}</p>
            </Card>
          </Reveal>
        </div>
        <Reveal className="mt-8">
          <p className="text-xl text-v3-bone">{c.iran.gapNote}</p>
        </Reveal>
      </Block>

      {/* ── Pentagon ─────────────────────────────────────────────────── */}
      <Block id="washington" kicker={c.pentagon.kicker} title={c.pentagon.title}>
        <Prose paras={c.pentagon.body} />
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {[
            [c.pentagon.setup, c.pentagon.setupLabel],
            [c.pentagon.monthly, c.pentagon.monthlyLabel],
          ].map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.1} className="flex flex-col gap-2 border-t border-v3-line pt-6">
              <bdi dir="ltr" className="font-v3-display text-6xl font-light text-v3-light md:text-7xl">{v}</bdi>
              <span className="text-v3-soft">{l}</span>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-v3-mute rtl:leading-loose">{c.pentagon.disputed}</p>
        <Reveal className="mt-12">
          <p className="max-w-3xl text-xl leading-relaxed text-v3-bone rtl:leading-loose">{c.pentagon.butLabel}</p>
        </Reveal>
      </Block>

      {/* ── Switchboard ──────────────────────────────────────────────── */}
      <Block id="switches" kicker={c.switchboard.kicker} title={c.switchboard.title} lead={c.switchboard.lead}>
        <Switchboard locale={locale} />
      </Block>

      {/* ── Capacity ─────────────────────────────────────────────────── */}
      <Block id="capacity" kicker={c.capacity.kicker} title={c.capacity.title}>
        <Prose paras={c.capacity.body} />
        <Pull>{c.capacity.pull}</Pull>
        <SignalGauge locale={locale} />
      </Block>

      <Block id="calculator" kicker={c.calc.kicker} title={c.calc.title} lead={c.calc.lead} tone="beam">
        <BeamCalculator locale={locale} />
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <ul className="flex flex-col">
            {c.calc.good.map((g, i) => (
              <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 leading-relaxed text-v3-bone last:border-b-0 rtl:leading-loose">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" />
                {g}
              </li>
            ))}
          </ul>
          <Reveal>
            <p className="text-xl leading-relaxed text-v3-bone rtl:leading-loose">{c.calc.bad}</p>
          </Reveal>
        </div>
      </Block>

      {/* ── Uplink ───────────────────────────────────────────────────── */}
      <Block id="uplink" kicker={c.uplink.kicker} title={c.uplink.title}>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Prose paras={c.uplink.body} />
          </div>
          <Reveal className="lg:col-span-5">
            <Photo photo={PHOTOS.tower} locale={locale} ratio="4/5" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
        </div>
      </Block>

      {/* ── Jamming ──────────────────────────────────────────────────── */}
      <Block id="jamming" kicker={c.jamming.kicker} title={c.jamming.title} lead={c.jamming.lead}>
        <JammingDiagram locale={locale} />
        <Reveal className="mt-12">
          <Card tone="raised" className="max-w-4xl">
            <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose">{c.jamming.honest}</p>
          </Card>
        </Reveal>
      </Block>

      {/* ── LTE ──────────────────────────────────────────────────────── */}
      <Block id="protocol" kicker={c.lte.kicker} title={c.lte.title}>
        <Prose paras={c.lte.body} />
        <ol className="mt-10 grid gap-3 md:grid-cols-3">
          {c.lte.problems.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <li className="flex h-full flex-col gap-2 rounded-2xl border border-v3-line/80 p-5">
                <span className="font-v3-display text-xl tabular-nums text-v3-light">{digits(`0${i + 1}`)}</span>
                <span className="font-medium text-v3-bone">{p.name}</span>
                <span className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{p.body}</span>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-12">
          <p className="max-w-3xl text-xl leading-relaxed text-v3-bone rtl:leading-loose">{c.lte.finding}</p>
        </Reveal>
        <Pull>{c.lte.joke}</Pull>
      </Block>

      {/* ── Generations ──────────────────────────────────────────────── */}
      <Block id="next" kicker={c.generations.kicker} title={c.generations.title} lead={c.generations.lead}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <Generations locale={locale} />
          </div>
          <Reveal className="mx-auto w-full max-w-sm lg:col-span-4">
            <Photo photo={PHOTOS.launch} locale={locale} ratio="2/3" sizes="(min-width: 1024px) 30vw, 100vw" />
          </Reveal>
        </div>
      </Block>

      {/* ── Kazakhstan ───────────────────────────────────────────────── */}
      <Block id="kazakhstan" kicker={c.kazakhstan.kicker} title={c.kazakhstan.title}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-8 lg:col-span-7">
            <Prose paras={c.kazakhstan.body} />
            <ul className="flex flex-col">
              {c.kazakhstan.proves.map((p, i) => (
                <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 text-lg leading-relaxed text-v3-bone last:border-b-0 rtl:leading-loose">
                  <span aria-hidden className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="lg:col-span-5">
            <Photo photo={PHOTOS.kazakhstan} locale={locale} ratio="4/3" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
        </div>
        <Pull>{c.kazakhstan.button}</Pull>
      </Block>

      {/* ── Claims ───────────────────────────────────────────────────── */}
      <Block id="answers" kicker={c.claims.kicker} title={c.claims.title}>
        <ClaimCards locale={locale} />
      </Block>

      {/* ── Closing ──────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-v3-line/70">
        <Beam className="[animation-delay:-10s]" />
        <div className={`${WRAP} flex flex-col gap-10 py-24 md:py-32`}>
          <Reveal>
            <Kicker>{c.closing.kicker}</Kicker>
          </Reveal>
          <Prose paras={c.closing.body} />
          <Reveal>
            <p className="max-w-4xl font-v3-display text-3xl font-light leading-snug text-v3-bone md:text-4xl rtl:leading-relaxed">{c.closing.last}</p>
          </Reveal>
          <Reveal>
            <p className="font-v3-display text-4xl text-v3-light md:text-6xl">{c.closing.notYet}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Method ───────────────────────────────────────────────────── */}
      <Block id="method" kicker={c.method.kicker} title={c.method.title}>
        <div className="grid gap-14 lg:grid-cols-2">
          <ul className="flex flex-col">
            {c.method.notes.map((n, i) => (
              <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 leading-relaxed text-v3-soft last:border-b-0 rtl:leading-loose">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" aria-hidden />
                {n}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm text-v3-mute">{c.method.sourcesTitle}</h3>
            <ol
              className="flex list-decimal flex-col gap-2.5 ps-5 text-sm text-v3-soft marker:text-v3-mute font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"
              dir="ltr"
            >
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
