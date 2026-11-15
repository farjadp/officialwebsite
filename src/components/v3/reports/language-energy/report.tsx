// ============================================================================
// File Path: src/components/v3/reports/language-energy/report.tsx
// Why: Report 09, "The Language Tax", for /reports/… and /fa/reports/….
//      Deng et al. (2026), "The Language–Energy Divide" (EMNLP 2026), made
//      readable and playable: your language's energy bill, the two penalties
//      that multiply, all 122 languages, where Persian sits, the gap across
//      models and tasks, why it happens, a which-costs-more game, the
//      authors' recommendations, cautions and sources. One component for
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
import { AccuracyScatter, CostGame, EnergyStrip, LanguagePicker, Penalties, Persistence, ScriptBars } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const FA = "۰۱۲۳۴۵۶۷۸۹"
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"
const KPI_TONE = ["text-v3-light", "text-v3-bone", "text-v3-bone", "text-v3-light"]

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

export function LanguageEnergyReport({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const digits = (s: string) => (fa ? s.replace(/\d/g, (x) => FA[Number(x)]) : s)
  const minutes = fa ? `${digits(String(meta.readMinutes))} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: ["University of Michigan", "EMNLP 2026", "Qwen3", "Belebele", "ML.ENERGY"],
    citation: c.method.sources.map((s) => ({ label: s.label, href: s.href })),
    about: fa ? ["مصرف انرژی هوش مصنوعی", "مدل‌های زبانی بزرگ", "زبان‌های کم‌منبع", "زبان فارسی"] : ["AI energy use", "Large language models", "Low-resource languages", "Multilingual NLP"],
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
                <div key={k.l} className={`flex flex-col gap-1.5 rounded-2xl border p-4 md:p-5 ${i === 0 || i === 3 ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}>
                  <dt className="order-2 text-sm leading-snug text-v3-bone">{k.l}</dt>
                  <dd className={`order-1 font-v3-display text-4xl leading-none tabular-nums md:text-5xl ${KPI_TONE[i]}`}>{k.n}</dd>
                  <dd className="order-3 text-xs leading-relaxed text-v3-mute">{k.d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal immediate delay={0.3} className="max-w-4xl">
            <Card tone="raised">
              <h2 className="font-v3-display text-xl text-v3-bone">{c.hero.scope.title}</h2>
              <p className="leading-relaxed text-v3-soft rtl:leading-loose">{c.hero.scope.body}</p>
            </Card>
          </Reveal>
          <p className="text-sm text-v3-light">{c.hero.medals}</p>
        </div>
      </header>

      {/* ── 1. Your language ─────────────────────────────────────────── */}
      <Block id="picker" kicker={c.picker.kicker} title={c.picker.title} lead={c.picker.lead} tone="beam">
        <LanguagePicker locale={locale} />
      </Block>

      {/* ── 2. Two penalties ─────────────────────────────────────────── */}
      <Block id="penalties" kicker={c.penalties.kicker} title={c.penalties.title} lead={c.penalties.lead}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Penalties locale={locale} />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Prose paras={c.penalties.body} />
            <Reveal>
              <Photo photo={PHOTOS.sign} locale={locale} ratio="4/3" sizes="(min-width: 1024px) 38vw, 100vw" />
            </Reveal>
          </div>
        </div>
        <Reveal className="mt-12 max-w-4xl">
          <Card tone="lit">
            <h3 className="font-v3-display text-2xl text-v3-bone">{c.penalties.callout.title}</h3>
            <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{c.penalties.callout.body}</p>
          </Card>
        </Reveal>
      </Block>

      {/* ── 3. All 122 ───────────────────────────────────────────────── */}
      <Block id="all" kicker={c.all.kicker} title={c.all.title} lead={c.all.lead} tone="beam">
        <div className="flex flex-col gap-10">
          <EnergyStrip locale={locale} />
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <AccuracyScatter locale={locale} />
            </div>
            <div className="lg:col-span-5">
              <Prose paras={c.all.body} />
            </div>
          </div>
        </div>
      </Block>

      {/* ── 4. Persian ───────────────────────────────────────────────── */}
      <Block id="persian" kicker={c.persian.kicker} title={c.persian.title} lead={c.persian.lead}>
        <Reveal>
          <dl className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {c.persian.figures.map((k, i) => (
              <div key={k.l} className={`flex flex-col gap-1.5 rounded-2xl border p-4 md:p-5 ${i === 2 ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}>
                <dt className="order-2 text-sm leading-snug text-v3-soft">{k.l}</dt>
                <dd className={`order-1 font-v3-display text-4xl leading-none tabular-nums ${i === 2 ? "text-v3-light" : "text-v3-bone"}`}>{k.n}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <ScriptBars locale={locale} />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Reveal>
              <Photo photo={PHOTOS.nastaliq} locale={locale} ratio="1/1" sizes="(min-width: 1024px) 38vw, 100vw" />
            </Reveal>
            <Prose paras={[...c.persian.body, c.persian.tajik]} />
          </div>
        </div>
      </Block>

      {/* ── 5. Not one model's quirk ─────────────────────────────────── */}
      <Block id="persist" kicker={c.persist.kicker} title={c.persist.title} lead={c.persist.lead} tone="beam">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Persistence locale={locale} />
          </div>
          <div className="lg:col-span-5">
            <Prose paras={[c.persist.body]} />
          </div>
        </div>
      </Block>

      {/* ── 6. Why ───────────────────────────────────────────────────── */}
      <Block id="why" kicker={c.why.kicker} title={c.why.title} lead={c.why.lead}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {c.why.items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.08}>
              <Card tone={i === 0 ? "lit" : "raised"}>
                <p className="font-v3-display text-5xl leading-none text-v3-light tabular-nums">{it.stat}</p>
                <h3 className="font-v3-display text-2xl text-v3-bone">{it.t}</h3>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{it.b}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 max-w-3xl">
          <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose">{c.why.note}</p>
        </Reveal>
      </Block>

      {/* ── 7. Game ──────────────────────────────────────────────────── */}
      <Block id="game" kicker={c.game.kicker} title={c.game.title} lead={c.game.lead} tone="beam">
        <CostGame locale={locale} />
      </Block>

      {/* ── 8. Recommendations ───────────────────────────────────────── */}
      <Block id="fix" kicker={c.fix.kicker} title={c.fix.title} lead={c.fix.lead}>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {c.fix.items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.06}>
              <li className="flex h-full flex-col gap-3 border-t-2 border-v3-light/60 pt-5">
                <span className="text-sm tabular-nums text-v3-light">{digits(String(i + 1).padStart(2, "0"))}</span>
                <h3 className="font-v3-display text-2xl text-v3-bone">{it.t}</h3>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{it.b}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-14 max-w-4xl">
          <Card tone="lit">
            <h3 className="font-v3-display text-2xl text-v3-bone">{c.fix.whoPays.title}</h3>
            <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{c.fix.whoPays.body}</p>
          </Card>
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
            <p className="mt-4 text-sm leading-relaxed text-v3-mute rtl:leading-loose">{c.method.credit}</p>
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
