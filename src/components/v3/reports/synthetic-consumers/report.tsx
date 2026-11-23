// ============================================================================
// File Path: src/components/v3/reports/synthetic-consumers/report.tsx
// Why: Report 10, "The Synthetic Shopper", for /reports/… and /fa/reports/….
//      Maier et al. (2025), arXiv:2510.08338 (preprint), made readable and
//      playable: the SSR trick, three ways to ask, what "90%" is measured
//      against, the persona seesaw, who the AI imitates well, a human-or-
//      synthetic game, a founder's reading, cautions and sources. One
//      component for both locales; a server component.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import type { ReactNode } from "react"
import { Check, X } from "lucide-react"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { formatReportDate, type ReportMeta } from "@/lib/reports"
import { Beam, Card, Headline, Kicker, Lead, Reveal, Spotlight, V3Button, V3Page } from "@/components/v3/kit"
import { ReadingProgress } from "@/components/v3/reading-progress"
import { ReportColophon } from "../colophon"
import { Photo } from "../photo"
import { reportJsonLd } from "../report-route"
import { COPY } from "./copy"
import { MIRRORED } from "./data"
import { MedalCase } from "./medals"
import { PHOTOS } from "./photos"
import { CeilingBars, HumanOrAi, MethodsChart, PersonaSeesaw, SsrPlayground } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const FA = "۰۱۲۳۴۵۶۷۸۹"
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"
const KPI_TONE = ["text-v3-bone", "text-v3-light", "text-v3-light", "text-v3-bone"]

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

export function SyntheticConsumersReport({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const digits = (s: string) => (fa ? s.replace(/\d/g, (x) => FA[Number(x)]) : s)
  const minutes = fa ? `${digits(String(meta.readMinutes))} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: ["arXiv", "PyMC Labs", "Colgate-Palmolive", "GPT-4o", "Gemini 2.0 Flash"],
    citation: c.method.sources.map((s) => ({ label: s.label, href: s.href })),
    about: fa ? ["تحقیقات بازار", "مصرف‌کننده‌ی مصنوعی", "مدل‌های زبانی بزرگ", "نظرسنجی"] : ["Market research", "Synthetic consumers", "Large language models", "Survey methodology"],
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
            <p className="inline-flex self-start rounded-full border border-v3-light/50 px-3 py-1 text-xs text-v3-light">{c.hero.status}</p>
          </Reveal>
          <Reveal immediate delay={0.18}>
            <Photo photo={PHOTOS.hero} locale={locale} ratio="21/8" priority sizes="100vw" />
          </Reveal>
          <Reveal immediate delay={0.24}>
            <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {c.hero.kpis.map((k, i) => (
                <div key={k.l} className={`flex flex-col gap-1.5 rounded-2xl border p-4 md:p-5 ${i === 2 ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}>
                  <dt className="order-2 text-sm leading-snug text-v3-bone">{k.l}</dt>
                  <dd className={`order-1 font-v3-display text-3xl leading-none tabular-nums md:text-4xl ${KPI_TONE[i]}`}>{k.n}</dd>
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

      {/* ── 1. SSR ───────────────────────────────────────────────────── */}
      <Block id="ssr" kicker={c.ssr.kicker} title={c.ssr.title} lead={c.ssr.lead} tone="beam">
        <ol className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {c.ssr.steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06}>
              <li className="flex h-full flex-col gap-2 border-t-2 border-v3-light/60 pt-4">
                <span className="text-sm tabular-nums text-v3-light">{digits(String(i + 1).padStart(2, "0"))}</span>
                <h3 className="font-v3-display text-xl text-v3-bone">{s.t}</h3>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{s.b}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <SsrPlayground locale={locale} />
      </Block>

      {/* ── 2. Methods ───────────────────────────────────────────────── */}
      <Block id="methods" kicker={c.methods.kicker} title={c.methods.title} lead={c.methods.lead}>
        <MethodsChart locale={locale} />
        <div className="mt-12">
          <Prose paras={c.methods.body} />
        </div>
      </Block>

      {/* ── 3. Ceiling ───────────────────────────────────────────────── */}
      <Block id="ceiling" kicker={c.ceiling.kicker} title={c.ceiling.title} lead={c.ceiling.lead} tone="beam">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <CeilingBars locale={locale} />
          </div>
          <div className="lg:col-span-5">
            <Prose paras={c.ceiling.explain} />
          </div>
        </div>
        <Reveal className="mt-12 max-w-4xl">
          <Card tone="lit">
            <h3 className="font-v3-display text-2xl text-v3-bone">{c.ceiling.callout.title}</h3>
            <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{c.ceiling.callout.body}</p>
          </Card>
        </Reveal>
      </Block>

      {/* ── 4. Persona ───────────────────────────────────────────────── */}
      <Block id="persona" kicker={c.persona.kicker} title={c.persona.title} lead={c.persona.lead}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <PersonaSeesaw locale={locale} />
          </div>
          <div className="lg:col-span-6">
            <Prose paras={[c.persona.body]} />
          </div>
        </div>
        <Reveal className="mt-12 max-w-4xl">
          <Card tone="lit">
            <h3 className="font-v3-display text-2xl text-v3-bone">{c.persona.callout.title}</h3>
            <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{c.persona.callout.body}</p>
          </Card>
        </Reveal>
      </Block>

      {/* ── 5. Mirrored ──────────────────────────────────────────────── */}
      <Block id="mirror" kicker={c.mirror.kicker} title={c.mirror.title} lead={c.mirror.lead} tone="beam">
        <div className="grid gap-8 md:grid-cols-2">
          {[
            { title: c.mirror.yesTitle, keys: MIRRORED.yes, ok: true },
            { title: c.mirror.noTitle, keys: MIRRORED.no, ok: false },
          ].map((col) => (
            <Reveal key={col.title}>
              <div className={`flex h-full flex-col gap-4 rounded-3xl border border-v3-line border-t-4 bg-v3-raise p-6 ${col.ok ? "border-t-v3-light" : "border-t-v3-mute"}`}>
                <h3 className="font-v3-display text-2xl text-v3-bone">{col.title}</h3>
                <ul className="flex flex-col gap-3">
                  {col.keys.map((k) => (
                    <li key={k} className="flex gap-3 leading-relaxed text-v3-soft rtl:leading-loose">
                      {col.ok ? <Check className="mt-1 h-4 w-4 shrink-0 text-v3-light" aria-hidden /> : <X className="mt-1 h-4 w-4 shrink-0 text-v3-mute" aria-hidden />}
                      <span>{c.mirror.items[k]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 max-w-3xl">
          <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose">{c.mirror.note}</p>
        </Reveal>
      </Block>

      {/* ── 6. Game ──────────────────────────────────────────────────── */}
      <Block id="game" kicker={c.game.kicker} title={c.game.title} lead={c.game.lead}>
        <HumanOrAi locale={locale} />
      </Block>

      {/* ── 7. Founders ──────────────────────────────────────────────── */}
      <Block id="founders" kicker={c.founders.kicker} title={c.founders.title} lead={c.founders.lead} tone="beam">
        <div className="grid gap-8 md:grid-cols-2">
          {[
            { title: c.founders.doTitle, items: c.founders.dos, ok: true },
            { title: c.founders.dontTitle, items: c.founders.donts, ok: false },
          ].map((col) => (
            <Reveal key={col.title}>
              <div className="flex h-full flex-col gap-4">
                <h3 className={`font-v3-display text-2xl ${col.ok ? "text-v3-light" : "text-v3-bone"}`}>{col.title}</h3>
                <ul className="flex flex-col gap-3">
                  {col.items.map((it) => (
                    <li key={it} className="flex gap-3 border-b border-v3-line/60 pb-3 leading-relaxed text-v3-soft last:border-b-0 rtl:leading-loose">
                      {col.ok ? <Check className="mt-1 h-4 w-4 shrink-0 text-v3-light" aria-hidden /> : <X className="mt-1 h-4 w-4 shrink-0 text-v3-mute" aria-hidden />}
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
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
