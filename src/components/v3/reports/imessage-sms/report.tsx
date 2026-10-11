// ============================================================================
// File Path: src/components/v3/reports/imessage-sms/report.tsx
// Why: Report 04, "The hidden cost of iMessage on an Iranian phone bill", for
//      /reports/… and /fa/reports/…. One component for both locales. A server
//      component: every sentence is in the HTML; the interactive figures come
//      from ./widgets. Order follows the case file: verdict first, mechanism,
//      the loop, the arithmetic, the claims, visibility, the fix, the AI
//      review, the ready-to-post text, then sources.
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
import { PHOTOS } from "./photos"
import { BillSimulator, ClaimCards, CopyBox, FixSteps, Pill, RetryLoop, TwoPaths, VisibilityMatrix } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const FA = "۰۱۲۳۴۵۶۷۸۹"

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

export function ImessageSmsReport({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const digits = (s: string) => (fa ? s.replace(/\d/g, (x) => FA[Number(x)]) : s)
  const minutes = fa ? `${digits(String(meta.readMinutes))} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: ["Apple", "iMessage", "FaceTime", "MCI (Hamrah-e Aval)"],
    citation: c.method.sources.map((s) => ({ label: s.label, href: s.href })),
    about: fa
      ? ["iMessage", "پیامک بین‌الملل", "همراه اول", "رمزنگاری سرتاسری", "بازرسی عمیق بسته"]
      : ["iMessage", "International SMS", "MCI", "End-to-end encryption", "Deep packet inspection"],
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

          <Reveal immediate delay={0.12}>
            <p className="max-w-3xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{c.hero.lead}</p>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <Reveal immediate delay={0.18} className="lg:col-span-7">
              <Card tone="lit">
                <h2 className="font-v3-display text-2xl text-v3-bone">{c.hero.verdictTitle}</h2>
                <ol className="flex flex-col divide-y divide-v3-line/60">
                  {c.hero.verdict.map((v) => (
                    <li key={v.label} className="grid gap-2 py-4 sm:grid-cols-[7rem_1fr] sm:gap-4">
                      <span>
                        <Pill kind={v.kind}>{v.label}</Pill>
                      </span>
                      <p className="leading-relaxed text-v3-bone rtl:leading-loose">{v.text}</p>
                    </li>
                  ))}
                </ol>
              </Card>
            </Reveal>
            <Reveal immediate delay={0.24} className="lg:col-span-5">
              <Photo photo={PHOTOS.hero} locale={locale} ratio="4/5" priority sizes="(min-width: 1024px) 40vw, 100vw" />
            </Reveal>
          </div>

          <Reveal immediate delay={0.3} className="flex flex-col gap-3">
            <p className="flex flex-wrap items-baseline gap-x-5 font-v3-display font-light leading-none">
              <span className="text-[clamp(5rem,15vw,12rem)] tracking-[-0.03em] text-v3-light drop-shadow-[0_0_60px_rgb(var(--v3-glow)/0.35)]">{c.hero.mega}</span>
              <span className="text-3xl text-v3-bone md:text-5xl">{c.hero.megaUnit}</span>
            </p>
            <p className="max-w-2xl text-v3-soft">{c.hero.megaLabel}</p>
          </Reveal>
          <p className="text-xs text-v3-mute">{c.hero.asOf}</p>
        </div>
      </header>

      {/* ── Two paths ────────────────────────────────────────────────── */}
      <Block id="paths" kicker={c.paths.kicker} title={c.paths.title} lead={c.paths.lead}>
        <TwoPaths locale={locale} />
      </Block>

      {/* ── Retry loop ───────────────────────────────────────────────── */}
      <Block id="loop" kicker={c.loop.kicker} title={c.loop.title} lead={c.loop.lead} tone="beam">
        <RetryLoop locale={locale} />
        <Reveal className="mt-14">
          <Card tone="raised" className="max-w-4xl">
            <span className="text-sm text-v3-light">{c.loop.hypothesis.title}</span>
            <p className="text-lg leading-relaxed text-v3-bone rtl:leading-loose">{c.loop.hypothesis.body}</p>
          </Card>
        </Reveal>
      </Block>

      {/* ── Simulator + arithmetic ───────────────────────────────────── */}
      <Block id="bill" kicker={c.sim.kicker} title={c.sim.title} lead={c.sim.lead}>
        <BillSimulator locale={locale} />
        <div className="mt-24 flex flex-col gap-8">
          <Reveal className="flex flex-col gap-3">
            <h3 className="font-v3-display text-3xl text-v3-bone md:text-4xl">{c.sim.arithmetic.title}</h3>
            <Lead>{c.sim.arithmetic.lead}</Lead>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {c.sim.arithmetic.cards.map((k, i) => (
              <Reveal key={k.eq} delay={i * 0.08}>
                <Card tone={i === 2 ? "lit" : "raised"}>
                  <span className="text-sm text-v3-mute">{k.label}</span>
                  <bdi dir="ltr" className="self-start font-mono text-sm tabular-nums text-v3-soft">{k.eq}</bdi>
                  <span className={`font-v3-display text-3xl ${i === 2 ? "text-v3-light" : "text-v3-bone"}`}>{k.res}</span>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="max-w-3xl text-xl leading-relaxed text-v3-bone rtl:leading-loose">{c.sim.arithmetic.conclusion}</p>
          </Reveal>
        </div>
      </Block>

      {/* ── Claims ───────────────────────────────────────────────────── */}
      <Block id="claims" kicker={c.claims.kicker} title={c.claims.title}>
        <ClaimCards locale={locale} />
      </Block>

      {/* ── Visibility ───────────────────────────────────────────────── */}
      <Block id="visibility" kicker={c.visibility.kicker} title={c.visibility.title} lead={c.visibility.lead}>
        <VisibilityMatrix locale={locale} />
      </Block>

      {/* ── Fix ──────────────────────────────────────────────────────── */}
      <Block id="fix" kicker={c.fix.kicker} title={c.fix.title} lead={c.fix.lead} tone="beam">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8">
            <FixSteps locale={locale} />
          </div>
          <Reveal className="lg:col-span-4">
            <Photo photo={PHOTOS.sim} locale={locale} ratio="4/5" sizes="(min-width: 1024px) 30vw, 100vw" />
          </Reveal>
        </div>
      </Block>

      {/* ── The technical answer ────────────────────────────────────────────────── */}
      <Block id="review" kicker={c.review.kicker} title={c.review.title} lead={c.review.lead}>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card tone="lit">
              <h3 className="text-lg text-v3-light">{c.review.ok.title}</h3>
              <ul className="flex flex-col">
                {c.review.ok.items.map((x, i) => (
                  <li key={i} className="flex gap-4 border-b border-v3-line/60 py-3 leading-relaxed text-v3-bone last:border-b-0 rtl:leading-loose">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" />
                    {x}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card tone="raised">
              <h3 className="text-lg text-v3-soft">{c.review.no.title}</h3>
              <ul className="flex flex-col">
                {c.review.no.items.map((x, i) => (
                  <li key={i} className="flex gap-4 border-b border-v3-line/60 py-3 leading-relaxed text-v3-soft last:border-b-0 rtl:leading-loose">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-mute" />
                    {x}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Block>

      {/* ── Ready to post ────────────────────────────────────────────── */}
      <Block id="post" kicker={c.post.kicker} title={c.post.title} lead={c.post.lead}>
        <div className="max-w-3xl">
          <CopyBox locale={locale} />
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
                  <span className="me-2 text-xs text-v3-mute">{s.grade}</span>
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
