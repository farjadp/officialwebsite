// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/frame.tsx
// Why: The page frame the three Gen Z parts share: hero, section block,
//      prose, the series strip (which links a part only once its day has
//      come — the pages revalidate hourly), the cautions-and-sources block
//      and the colophon. Each part supplies only its own sections.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import type { ReactNode } from "react"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { findReport, formatReportDate, isLive, type ReportMeta } from "@/lib/reports"
import { Beam, Card, Headline, Kicker, Lead, Reveal, Spotlight, V3Button, V3Page } from "@/components/v3/kit"
import { ReadingProgress } from "@/components/v3/reading-progress"
import { ReportColophon } from "../colophon"
import { Photo, type ReportPhoto } from "../photo"
import { reportJsonLd } from "../report-route"
import { MedalCase } from "./medals"
import { SERIES, SERIES_SLUGS, type PartIndex } from "./series-copy"

export const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const FA = "۰۱۲۳۴۵۶۷۸۹"
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"
const KPI_TONE = ["text-v3-bone", "text-v3-light", "text-v3-light", "text-v3-bone"]

export const faDigits = (s: string, locale: Locale) => (locale === "fa" ? s.replace(/\d/g, (x) => FA[Number(x)]) : s)

export function Block({ id, kicker, title, lead, children, tone }: { id?: string; kicker: string; title: string; lead?: string; children?: ReactNode; tone?: "beam" }) {
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

export function Prose({ paras }: { paras: string[] }) {
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

export function Callout({ title, body }: { title: string; body: string }) {
  return (
    <Reveal className="mt-12 max-w-4xl">
      <Card tone="lit">
        <h3 className="font-v3-display text-2xl text-v3-bone">{title}</h3>
        <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{body}</p>
      </Card>
    </Reveal>
  )
}

/** The three parts, with the current one marked and future ones dated. */
export function SeriesStrip({ locale, part, compact }: { locale: Locale; part: PartIndex; compact?: boolean }) {
  const s = SERIES[locale]
  return (
    <nav aria-label={s.nav.title} className="flex flex-col gap-3">
      <p className="text-sm text-v3-mute">
        <span className="text-v3-light">{s.series}</span> · {s.nav.title}
      </p>
      <ol className={`grid gap-3 ${compact ? "md:grid-cols-3" : "md:grid-cols-3"}`}>
        {SERIES_SLUGS.map((slug, i) => {
          const r = findReport(slug)
          if (!r) return null
          const here = i === part
          const live = isLive(r)
          const inner = (
            <>
              <span className="flex items-center justify-between gap-2 text-xs text-v3-mute">
                <span>{s.partLabel(i + 1)}</span>
                <span className={here ? "text-v3-light" : ""}>{here ? s.nav.here : live ? s.nav.read : s.nav.soon(formatReportDate(r.published, locale))}</span>
              </span>
              <span className={`font-v3-display text-lg leading-snug ${here ? "text-v3-light" : live ? "text-v3-bone" : "text-v3-soft"}`}>{s.parts[i].title}</span>
              {!compact && <span className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{s.parts[i].teaser}</span>}
            </>
          )
          const cls = `flex h-full flex-col gap-1.5 rounded-2xl border p-4 ${here ? "border-v3-light/60 bg-v3-light/5" : live ? "border-v3-line hover:border-v3-light" : "border-dashed border-v3-line/70"}`
          return (
            <li key={slug}>
              {live && !here ? (
                <Link href={localePath(locale, `/reports/${slug}`)} className={`${cls} transition-colors`}>
                  {inner}
                </Link>
              ) : (
                <div className={cls} aria-current={here ? "page" : undefined}>
                  {inner}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export type HeroCopy = { lead: string; kpis: { n: string; l: string; d: string }[]; medals: string }

/** The page shell: JSON-LD, progress bar, badge case, hero, sections, notes, colophon. */
export function GenZPage({
  locale,
  meta,
  part,
  hero,
  photo,
  mentions,
  about,
  children,
  extraSources = [],
}: {
  locale: Locale
  meta: ReportMeta
  part: PartIndex
  hero: HeroCopy
  photo: ReportPhoto
  mentions: string[]
  about: string[]
  children: ReactNode
  extraSources?: { label: string; href: string }[]
}) {
  const s = SERIES[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const minutes = fa ? `${faDigits(String(meta.readMinutes), locale)} دقیقه مطالعه` : `${meta.readMinutes} min read`
  const sources = [...s.sources, ...extraSources]
  const parts = SERIES_SLUGS.map((slug) => findReport(slug)!)
  const live = parts.map((r) => isLive(r))
  const dates = parts.map((r) => formatReportDate(r.published, locale))

  const jsonLd = reportJsonLd({ locale, slug: meta.slug, mentions, citation: sources, about })

  return (
    <V3Page>
      {jsonLd.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
      <ReadingProgress />
      <MedalCase locale={locale} live={live} dates={dates} />

      <header className="relative isolate overflow-hidden border-b border-v3-line/70">
        <Beam />
        <Spotlight className="-z-10" />
        <div className={`${WRAP} flex flex-col gap-10 py-16 md:py-24`}>
          <Reveal immediate className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-v3-mute">
            <Link href={localePath(locale, "/reports")} className="text-v3-light hover:underline hover:underline-offset-4">
              {fa ? "گزارش‌ها" : "Reports"}
            </Link>
            <span aria-hidden>·</span>
            <span>
              {s.series} · {s.partLabel(part + 1)}
            </span>
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
            <p className="max-w-3xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{hero.lead}</p>
            <p className="text-sm text-v3-mute">{s.byline}</p>
            <p className="inline-flex self-start rounded-full border border-v3-light/50 px-3 py-1 text-xs text-v3-light">{s.status}</p>
          </Reveal>
          <Reveal immediate delay={0.18}>
            <Photo photo={photo} locale={locale} ratio="21/8" priority sizes="100vw" />
          </Reveal>
          <Reveal immediate delay={0.24}>
            <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {hero.kpis.map((k, i) => (
                <div key={k.l} className={`flex flex-col gap-1.5 rounded-2xl border p-4 md:p-5 ${i === 1 ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}>
                  <dt className="order-2 text-sm leading-snug text-v3-bone">{k.l}</dt>
                  <dd className={`order-1 font-v3-display text-3xl leading-none tabular-nums md:text-4xl ${KPI_TONE[i]}`}>{k.n}</dd>
                  <dd className="order-3 text-xs leading-relaxed text-v3-mute">{k.d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal immediate delay={0.3} className="max-w-4xl">
            <Card tone="raised">
              <h2 className="font-v3-display text-xl text-v3-bone">{s.scope.title}</h2>
              <p className="leading-relaxed text-v3-soft rtl:leading-loose">{s.scope.body}</p>
            </Card>
          </Reveal>
          <Reveal immediate delay={0.34}>
            <SeriesStrip locale={locale} part={part} compact />
          </Reveal>
          <p className="text-sm text-v3-light">{hero.medals}</p>
        </div>
      </header>

      {children}

      <section id="series" className="relative isolate overflow-hidden border-b border-v3-line/70">
        <div className={`${WRAP} py-16 md:py-20`}>
          <SeriesStrip locale={locale} part={part} />
        </div>
      </section>

      <Block id="notes" kicker={fa ? "پیش از استناد" : "Before you quote it"} title={fa ? "احتیاط‌ها و منابع" : "Cautions and sources"}>
        <div className="grid gap-14 lg:grid-cols-2">
          <ul className="flex flex-col">
            {s.notes.map((n) => (
              <li key={n.t} className="flex flex-col gap-1 border-b border-v3-line/60 py-4 last:border-b-0">
                <span className="text-v3-bone">{n.t}</span>
                <span className="leading-relaxed text-v3-soft rtl:leading-loose">{n.b}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm text-v3-mute">{s.sourcesTitle}</h3>
            <ol className={`flex list-decimal flex-col gap-2.5 ps-5 text-sm text-v3-soft marker:text-v3-mute ${LATIN}`} dir="ltr">
              {sources.map((src) => (
                <li key={src.href + src.label}>
                  <a href={src.href} target="_blank" rel="noopener noreferrer" className="underline decoration-v3-line underline-offset-4 hover:text-v3-light hover:decoration-v3-light">
                    {src.label}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-v3-mute rtl:leading-loose">{s.credit}</p>
          </div>
        </div>
      </Block>

      <ReportColophon
        locale={locale}
        path={`/reports/${meta.slug}`}
        shareTitle={`${m.title} · ${s.series}`}
        disclaimer={s.disclaimer}
        action={
          <V3Button href={localePath(locale, "/booking")} locale={locale}>
            {s.cta}
          </V3Button>
        }
      />
    </V3Page>
  )
}
