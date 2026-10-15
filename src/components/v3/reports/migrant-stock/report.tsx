// ============================================================================
// File Path: src/components/v3/reports/migrant-stock/report.tsx
// Why: Report 05, "304 million", for /reports/… and /fa/reports/…. One
//      component for both locales. A server component: every sentence is in
//      the HTML; the figures and the game come from ./widgets and ./game, and
//      the passport (./passport) floats over the page collecting a stamp per
//      interactive section. Order follows Farjad's draft: the paradox, the
//      flipped ranking, gender, the game, the caveats; with the hundred
//      people, the regions, the explorer and the two close-ups added.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import type { ReactNode } from "react"
import { AlertTriangle, ArrowLeftRight, Globe2, Plane, Users2, Venus } from "lucide-react"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { formatReportDate, type ReportMeta } from "@/lib/reports"
import { Beam, Card, CountUp, Headline, Kicker, Lead, Reveal, Spotlight, V3Button, V3Page } from "@/components/v3/kit"
import { ReadingProgress } from "@/components/v3/reading-progress"
import { ReportColophon } from "../colophon"
import { Photo } from "../photo"
import { reportJsonLd } from "../report-route"
import { COPY } from "./copy"
import { MigrantGame } from "./game"
import { Passport } from "./passport"
import { PHOTOS } from "./photos"
import { CountVsShare, CountryExplorer, GenderStrip, HundredPeople, RankFlip, RegionSplit } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const FA = "۰۱۲۳۴۵۶۷۸۹"
const CARE_ICONS = [ArrowLeftRight, Users2, Plane, AlertTriangle]
const HERO_ICONS = [Plane, Globe2, Venus]

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

export function MigrantStockReport({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const digits = (s: string) => (fa ? s.replace(/\d/g, (x) => FA[Number(x)]) : s)
  const minutes = fa ? `${digits(String(meta.readMinutes))} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: ["United Nations Department of Economic and Social Affairs", "UNHCR"],
    citation: c.method.sources.map((s) => ({ label: s.label, href: s.href })),
    about: fa
      ? ["مهاجرت بین‌المللی", "موجودی مهاجران", "پناهندگان", "سازمان ملل"]
      : ["International migration", "International migrant stock", "Refugees", "United Nations"],
  })

  return (
    <V3Page>
      {jsonLd.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
      <ReadingProgress />
      <Passport locale={locale} />

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

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="flex flex-col gap-8 lg:col-span-7">
              <Reveal immediate delay={0.06}>
                <Headline as="h1" size="hero" accent={<span className="mt-2 block">{m.tagline}</span>} className="max-w-5xl">
                  {m.title}
                </Headline>
              </Reveal>
              <Reveal immediate delay={0.12}>
                <p className="max-w-3xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{c.hero.lead}</p>
              </Reveal>
              <Reveal immediate delay={0.18}>
                <dl className="grid grid-cols-3 gap-3 md:gap-5">
                  {c.hero.stats.map((st, i) => {
                    const I = HERO_ICONS[i]
                    return (
                      <div key={st.label} className={`flex flex-col gap-2 rounded-2xl border p-4 md:p-5 ${i === 0 ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}>
                        <I className={`h-5 w-5 ${i === 0 ? "text-v3-light" : "text-v3-mute"}`} aria-hidden />
                        <dt className="order-last text-xs leading-snug text-v3-soft md:text-sm">{st.label}</dt>
                        <dd className={`font-v3-display text-4xl leading-none tabular-nums md:text-6xl ${i === 0 ? "text-v3-light drop-shadow-[0_0_40px_rgb(var(--v3-glow)/0.4)]" : "text-v3-bone"}`}>
                          {i === 0 ? <CountUp to={304} locale={locale} /> : st.value}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </Reveal>
            </div>
            <Reveal immediate delay={0.24} className="lg:col-span-5">
              <Photo photo={PHOTOS.hero} locale={locale} ratio="4/3" priority sizes="(min-width: 1024px) 40vw, 100vw" />
            </Reveal>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-v3-light">{c.hero.scroll}</p>
            <p className="text-xs text-v3-mute">{c.hero.asOf}</p>
          </div>
        </div>
      </header>

      {/* ── Count vs share ───────────────────────────────────────────── */}
      <Block id="paradox" kicker={c.paradox.kicker} title={c.paradox.title} lead={c.paradox.lead}>
        <CountVsShare locale={locale} />
        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Card tone="lit">
              <h3 className="font-v3-display text-2xl text-v3-bone">{c.paradox.why.title}</h3>
              <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{c.paradox.why.body}</p>
            </Card>
          </Reveal>
          <div className="grid gap-3 lg:col-span-5">
            {c.paradox.math.map((k, i) => (
              <Reveal key={k.label} delay={i * 0.08}>
                <div className="flex items-baseline justify-between gap-4 rounded-2xl border border-v3-line/80 px-5 py-4">
                  <span className="text-sm text-v3-mute">{k.label}</span>
                  <span className={`font-v3-display text-3xl tabular-nums ${i === 0 ? "text-v3-light" : "text-v3-bone"}`}>{k.value}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Block>

      {/* ── 100 people ───────────────────────────────────────────────── */}
      <Block id="hundred" kicker={c.hundred.kicker} title={c.hundred.title} lead={c.hundred.lead} tone="beam">
        <HundredPeople locale={locale} />
      </Block>

      {/* ── Regions ──────────────────────────────────────────────────── */}
      <Block id="regions" kicker={c.regions.kicker} title={c.regions.title} lead={c.regions.lead}>
        <RegionSplit locale={locale} />
      </Block>

      {/* ── Ranking flip ─────────────────────────────────────────────── */}
      <Block id="flip" kicker={c.flip.kicker} title={c.flip.title} lead={c.flip.lead}>
        <RankFlip locale={locale} />
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6">
            <Photo photo={PHOTOS.gulf} locale={locale} sizes="(min-width: 1024px) 45vw, 100vw" />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-6">
            <Card tone="raised">
              <h3 className="font-v3-display text-2xl text-v3-bone">{c.flip.gulf.title}</h3>
              <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{c.flip.gulf.body}</p>
            </Card>
          </Reveal>
        </div>
      </Block>

      {/* ── Explorer ─────────────────────────────────────────────────── */}
      <Block id="explorer" kicker={c.explorer.kicker} title={c.explorer.title} lead={c.explorer.lead} tone="beam">
        <CountryExplorer locale={locale} />
      </Block>

      {/* ── Iran and Canada ──────────────────────────────────────────── */}
      <Block id="close-ups" kicker={c.spot.kicker} title={c.spot.title}>
        <div className="grid gap-6 lg:grid-cols-2">
          {([c.spot.iran, c.spot.canada] as const).map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <Card tone={i === 0 ? "lit" : "raised"}>
                <h3 className="font-v3-display text-3xl text-v3-bone">
                  <span aria-hidden className="me-3">
                    {i === 0 ? "🇮🇷" : "🇨🇦"}
                  </span>
                  {s.title}
                </h3>
                {s.body.map((p, k) => (
                  <p key={k} className={`leading-relaxed rtl:leading-loose ${k === 0 ? "text-lg text-v3-bone" : "text-v3-soft"}`}>
                    {p}
                  </p>
                ))}
                {i === 1 && <Photo photo={PHOTOS.canada} locale={locale} ratio="16/9" className="mt-2" sizes="(min-width: 1024px) 40vw, 100vw" />}
              </Card>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* ── Gender ───────────────────────────────────────────────────── */}
      <Block id="gender" kicker={c.gender.kicker} title={c.gender.title} lead={c.gender.lead}>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <GenderStrip locale={locale} />
          </div>
          <Reveal className="lg:col-span-5">
            <Photo photo={PHOTOS.helpers} locale={locale} ratio="4/3" sizes="(min-width: 1024px) 38vw, 100vw" />
          </Reveal>
        </div>
      </Block>

      {/* ── Game ─────────────────────────────────────────────────────── */}
      <Block id="game" kicker={c.game.kicker} title={c.game.title} lead={c.game.lead} tone="beam">
        <MigrantGame locale={locale} />
      </Block>

      {/* ── Before you quote ─────────────────────────────────────────── */}
      <Block id="care" kicker={c.care.kicker} title={c.care.title}>
        <div className="grid gap-5 md:grid-cols-2">
          {c.care.items.map((it, i) => {
            const I = CARE_ICONS[i]
            return (
              <Reveal key={it.t} delay={i * 0.06}>
                <Card tone="raised">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-v3-light/60 text-v3-light">
                    <I className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="font-v3-display text-2xl text-v3-bone">{it.t}</h3>
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">{it.b}</p>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Block>

      {/* ── Method ───────────────────────────────────────────────────── */}
      <Block id="method" kicker={c.method.kicker} title={c.method.title}>
        <div className="grid gap-14 lg:grid-cols-2">
          <ul className="flex flex-col">
            {c.method.notes.map((note, i) => (
              <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 leading-relaxed text-v3-soft last:border-b-0 rtl:leading-loose">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" aria-hidden />
                {note}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm text-v3-mute">{c.method.sourcesTitle}</h3>
            <ol className="flex list-decimal flex-col gap-2.5 ps-5 text-sm text-v3-soft marker:text-v3-mute font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!" dir="ltr">
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
