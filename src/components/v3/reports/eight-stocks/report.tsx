// ============================================================================
// File Path: src/components/v3/reports/eight-stocks/report.tsx
// Why: Report 01, "Eight Stocks, Twenty Economies", for /reports/… and
//      /fa/reports/…. One component for both locales. A server component:
//      every sentence is in the HTML, and the interactive figures come from
//      ./widgets. The order follows Farjad's original post.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { absoluteUrl } from "@/lib/seo"
import { formatReportDate, type ReportMeta } from "@/lib/reports"
import { reportJsonLd } from "../report-route"
import { Beam, Card, Headline, Kicker, Lead, Reveal, Spotlight, V3Button, V3Page } from "@/components/v3/kit"
import { ReadingProgress } from "@/components/v3/reading-progress"
import { num, times, usd } from "../fmt"
import { COPY } from "./copy"
import { COMPANIES, COUNTRIES, TOTAL_CAP } from "./data"
import { Flag, Mark } from "./marks"
import {
  BasketComparator,
  CompanyStack,
  EuropeStacker,
  FlowFigure,
  LayerMap,
  MegaFigure,
  NvidiaRace,
  ShareBar,
  StockFigure,
  TopFourVsBigFive,
} from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"

function Block({ id, kicker, title, lead, children }: { id?: string; kicker: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <section id={id} className="border-b border-v3-line/70">
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

export function EightStocksReport({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const path = localePath(locale, `/reports/${meta.slug}`)
  const minutes = locale === "fa" ? `${num(meta.readMinutes, locale)} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: COMPANIES.map((x) => x.name),
    citation: c.method.sources,
    about:
      locale === "fa"
        ? ["هوش مصنوعی", "ارزش بازار", "اقتصاد اروپا", "تولید ناخالص داخلی"]
        : ["Artificial intelligence", "Market capitalization", "Economy of Europe", "Gross domestic product"],
  })

  return (
    <V3Page>
      {jsonLd.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
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

          <Reveal immediate delay={0.06} className="flex flex-col gap-4">
            <Headline as="h1" size="hero" accent={<span className="mt-2 block">{m.tagline}</span>} className="max-w-5xl">
              {m.title}
            </Headline>
          </Reveal>

          <Reveal immediate delay={0.12} className="flex max-w-3xl flex-col gap-2 text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">
            {c.hero.hook.map((h, i) => (
              <p key={i} className={i === c.hero.hook.length - 1 ? "text-v3-bone" : undefined}>{h}</p>
            ))}
          </Reveal>

          <Reveal immediate delay={0.16}>
            <p className="max-w-3xl border-s-2 border-v3-light/70 ps-5 text-lg leading-relaxed text-v3-bone md:text-xl rtl:leading-loose">
              {c.hero.summary}
            </p>
          </Reveal>

          <Reveal immediate delay={0.2} className="flex flex-col gap-3">
            <p className="flex flex-wrap items-baseline gap-x-5 font-v3-display font-light leading-none">
              <span className="text-[clamp(5rem,17vw,14rem)] tracking-[-0.03em] text-v3-light drop-shadow-[0_0_60px_rgb(var(--v3-glow)/0.35)]">
                <MegaFigure locale={locale} />
              </span>
              <span className="text-3xl text-v3-bone md:text-5xl">{c.hero.megaUnit}{locale === "fa" ? " دلار" : " USD"}</span>
            </p>
            <p className="max-w-2xl text-v3-soft">{c.hero.megaLabel}</p>
          </Reveal>

          <Reveal immediate delay={0.28}>
            <CompanyStack locale={locale} />
          </Reveal>
          <p className="text-xs text-v3-mute">{c.hero.asOf}</p>
        </div>
      </header>

      {/* ── Key findings ─────────────────────────────────────────────── */}
      <section className="border-b border-v3-line/70">
        <div className={`${WRAP} py-20 md:py-24`}>
          <Reveal className="mb-10 flex flex-col gap-3">
            <Kicker>{c.findings.kicker}</Kicker>
            <Headline className="max-w-3xl">{c.findings.title}</Headline>
          </Reveal>
          <ol className="grid gap-x-12 gap-y-1 lg:grid-cols-2">
            {c.findings.items.map((f, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <li className="flex gap-5 border-b border-v3-line/60 py-5">
                  <span className="mt-1 shrink-0 font-v3-display text-xl text-v3-light tabular-nums">
                    {locale === "fa" ? ["۰۱", "۰۲", "۰۳", "۰۴", "۰۵"][i] : `0${i + 1}`}
                  </span>
                  <span className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{f}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Basket vs Europe ─────────────────────────────────────────── */}
      <Block kicker={c.basket.kicker} title={c.basket.title} lead={c.basket.lead}>
        <BasketComparator locale={locale} />
      </Block>

      {/* ── Stacking Europe ──────────────────────────────────────────── */}
      <Block kicker={c.stack.kicker} title={c.stack.title} lead={c.stack.lead}>
        <EuropeStacker locale={locale} />
      </Block>

      {/* ── NVIDIA ───────────────────────────────────────────────────── */}
      <Block kicker={c.nvidia.kicker} title={c.nvidia.title} lead={c.nvidia.lead}>
        <NvidiaRace locale={locale} />
      </Block>

      {/* ── Top four ─────────────────────────────────────────────────── */}
      <Block kicker={c.top4.kicker} title={c.top4.title} lead={c.top4.lead}>
        <TopFourVsBigFive locale={locale} />
      </Block>

      {/* ── Stock vs flow ────────────────────────────────────────────── */}
      <section className="border-b border-v3-line/70">
        <div className={`${WRAP} flex flex-col gap-12 py-20 md:py-28`}>
          <Reveal className="flex flex-col gap-6">
            <Kicker>{c.stockFlow.kicker}</Kicker>
            <p className="max-w-4xl border-s-2 border-v3-light ps-6 font-v3-display text-3xl font-light leading-snug text-v3-bone md:text-5xl rtl:leading-relaxed">
              {c.stockFlow.claim} <span className="text-v3-mute">{c.stockFlow.claimAfter}</span>
            </p>
          </Reveal>
          <Reveal>
            <Headline size="card">{c.stockFlow.title}</Headline>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {([
              [c.stockFlow.stock, <StockFigure key="s" mark={c.stockFlow.stock.mark} />],
              [c.stockFlow.flow, <FlowFigure key="f" mark={c.stockFlow.flow.mark} />],
            ] as const).map(([k, fig], i) => (
              <Reveal key={k.term} delay={i * 0.1}>
                <Card tone="raised">
                  <span className="text-sm text-v3-mute">{k.term}</span>
                  <h3 className="font-v3-display text-2xl text-v3-bone md:text-3xl">{k.title}</h3>
                  {fig}
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">{k.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why ──────────────────────────────────────────────────────── */}
      <Block kicker={c.why.kicker} title={c.why.title}>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-6 lg:col-span-5">
            {c.why.body.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{p}</p>
            ))}
            <p className="border-s border-v3-line ps-5 text-v3-mute leading-relaxed rtl:leading-loose">{c.why.aside}</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {c.why.onlys.map((o, i) => (
              <Reveal key={o.key} delay={i * 0.08}>
                <Card className="group transition-colors duration-500 hover:border-v3-light/60 hover:bg-v3-raise">
                  <span dir="ltr" className="flex items-center gap-3 self-start font-v3-display text-2xl text-v3-bone">
                    <Mark company={o.key} className="text-xl text-v3-light" />
                    {COMPANIES.find((x) => x.key === o.key)!.name}
                  </span>
                  <span className="text-v3-mute transition-colors duration-500 group-hover:text-v3-light">{o.was}</span>
                  <span className="leading-relaxed text-v3-bone rtl:leading-loose">{o.is}</span>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Block>

      {/* ── Layers ───────────────────────────────────────────────────── */}
      <Block kicker={c.layers.kicker} title={c.layers.title} lead={c.layers.lead}>
        <LayerMap locale={locale} />
      </Block>

      {/* ── The question ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-v3-line/70">
        <Beam className="[animation-delay:-8s]" />
        <div className={`${WRAP} flex flex-col gap-10 py-24 md:py-32`}>
          <Reveal className="flex flex-col gap-6">
            <Kicker>{c.question.kicker}</Kicker>
            <p className="max-w-3xl text-lg text-v3-mute rtl:leading-loose">{c.question.old}</p>
            <Headline className="max-w-5xl md:text-6xl">{c.question.title}</Headline>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {[c.question.yes, c.question.no].map((f, i) => (
              <Reveal key={f.tag} delay={i * 0.1}>
                <Card tone={i === 0 ? "lit" : "raised"}>
                  <span className={`self-start rounded-full border px-3 py-1 text-xs ${i === 0 ? "border-v3-light text-v3-light" : "border-v3-soft/60 text-v3-soft"}`}>
                    {f.tag}
                  </span>
                  <p className="text-xl leading-relaxed text-v3-bone rtl:leading-loose">{f.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="font-v3-display text-3xl text-v3-light md:text-4xl">{c.question.closing}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Method and sources ───────────────────────────────────────── */}
      <Block kicker={c.method.kicker} title={c.method.title}>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="flex flex-col gap-10 lg:col-span-5">
            <ul className="flex flex-col">
              {c.method.notes.map((n, i) => (
                <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 text-v3-soft leading-relaxed last:border-b-0 rtl:leading-loose">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3">
              <h3 className="text-sm text-v3-mute">{c.method.sourcesTitle}</h3>
              <ol className="flex list-decimal flex-col gap-2 ps-5 text-sm text-v3-soft marker:text-v3-mute">
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
          <div className="lg:col-span-7">
            <h3 className="mb-4 text-sm text-v3-mute">{c.method.tableTitle}</h3>
            <div className="overflow-x-auto rounded-2xl border border-v3-line/80">
              <table className="w-full text-sm">
                <thead className="bg-v3-raise text-v3-mute">
                  <tr>
                    <th className="px-4 py-3 text-start font-normal">{c.method.th.rank}</th>
                    <th className="px-4 py-3 text-start font-normal">{c.method.th.country}</th>
                    <th className="px-4 py-3 text-end font-normal">{c.method.th.gdp}</th>
                    <th className="px-4 py-3 text-end font-normal">{c.method.th.ratio}</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRIES.map((k, i) => (
                    <tr key={k.key} className="border-t border-v3-line/50">
                      <td className="px-4 py-2.5 tabular-nums text-v3-mute">{num(i + 1, locale)}</td>
                      <td className="px-4 py-2.5 text-v3-bone"><Flag code={k.key} className="me-2" />{c.countries[k.key]}</td>
                      <td className="px-4 py-2.5 text-end tabular-nums text-v3-soft"><bdi dir="ltr">{usd(k.gdp, locale)}</bdi></td>
                      <td className="px-4 py-2.5 text-end tabular-nums text-v3-light"><bdi dir="ltr">{times(TOTAL_CAP / k.gdp, locale, 2)}</bdi></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Block>

      {/* ── Colophon ─────────────────────────────────────────────────── */}
      <footer className={`${WRAP} flex flex-col gap-12 py-20 md:py-24`}>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-v3-mute">{c.colophon.by}</span>
            <span className="font-v3-display text-4xl text-v3-bone">{c.colophon.name}</span>
            <span className="text-v3-soft">{c.colophon.bio}</span>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-v3-soft" dir="ltr">
              {[
                ["farjadp.info", "https://www.farjadp.info"],
                ["LinkedIn", "https://www.linkedin.com/in/farjadpourmohammad"],
                ["Telegram", "https://t.me/FarjadTalks"],
                ["Instagram", "https://instagram.com/FarjadTalks"],
                ["YouTube", "https://youtube.com/@FarjadTalks"],
              ].map(([l, h]) => (
                <a key={h} href={h} target="_blank" rel="noopener noreferrer" className="underline decoration-v3-line underline-offset-4 hover:text-v3-light hover:decoration-v3-light">
                  {l}
                </a>
              ))}
            </div>
          </div>
          <ShareBar locale={locale} url={absoluteUrl(path)} title={`${m.title} · ${m.tagline}`} />
        </div>
        <p className="border-t border-v3-line/70 pt-6 text-sm leading-relaxed text-v3-mute rtl:leading-loose">{c.colophon.rights}</p>
        <div className="flex flex-wrap gap-3">
          <V3Button href={localePath(locale, "/reports")} variant="secondary" locale={locale}>{c.colophon.back}</V3Button>
          <V3Button href={localePath(locale, "/booking")} locale={locale}>{c.colophon.more}</V3Button>
        </div>
      </footer>
    </V3Page>
  )
}
