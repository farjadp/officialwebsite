// ============================================================================
// File Path: src/components/v3/reports/deep-time-pain/report.tsx
// Why: Report 02, "A body that postpones pain", for /reports/… and
//      /fa/reports/…. One component for both locales. A server component:
//      every sentence is in the HTML, and the interactive figures come from
//      ./widgets. The order follows the original essay — scale, mechanism,
//      the modern human, the fossils, then what the bones cannot say.
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
import { reportJsonLd } from "../report-route"
import { COPY } from "./copy"
import { FOSSILS, eventAge, type EventKey } from "./data"
import { clockTime, digits, years } from "./fmt"
import { BeecherDots, CircuitRace, DeepTimeZoom, HeroClock, ShanidarBody, YearRuler } from "./widgets"
import { TimeSpiral } from "./spiral"
import { Photo } from "../photo"
import { PHOTOS } from "./photos"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"

const FOSSIL_PHOTO: Partial<Record<EventKey, keyof typeof PHOTOS>> = {
  dmanisi: "dmanisi",
  maba: "maba",
  qafzeh: "qafzeh",
  shanidar: "shanidar1",
}

function Block({ id, kicker, title, lead, children }: { id?: string; kicker: string; title: string; lead?: string; children?: ReactNode }) {
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

export function DeepTimePainReport({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const minutes = fa ? `${digits(String(meta.readMinutes), locale)} دقیقه مطالعه` : `${meta.readMinutes} min read`

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: [],
    citation: c.method.sources,
    about: fa
      ? ["پاسخ جنگ یا گریز", "بی‌دردی ناشی از استرس", "محور هیپوتالاموس–هیپوفیز–فوق‌کلیه", "دیرینه‌انسان‌شناسی", "نئاندرتال"]
      : ["Fight-or-flight response", "Stress-induced analgesia", "Hypothalamic–pituitary–adrenal axis", "Paleoanthropology", "Neanderthal"],
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

          <Reveal immediate delay={0.12} className="flex max-w-3xl flex-col gap-2 text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">
            {c.hero.hook.map((h, i) => (
              <p key={i} className={i === c.hero.hook.length - 1 ? "text-v3-bone" : undefined}>
                {h}
              </p>
            ))}
          </Reveal>

          <Reveal immediate delay={0.16}>
            <p className="max-w-3xl border-s-2 border-v3-light/70 ps-5 text-lg leading-relaxed text-v3-bone md:text-xl rtl:leading-loose">
              {c.hero.summary}
            </p>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <Reveal immediate delay={0.2} className="flex flex-col gap-3 lg:col-span-7">
            <p className="flex flex-wrap items-baseline gap-x-5 font-v3-display font-light leading-none">
              <span className="text-[clamp(5rem,17vw,14rem)] tracking-[-0.03em] text-v3-light drop-shadow-[0_0_60px_rgb(var(--v3-glow)/0.35)]">
                <bdi dir="ltr">{c.hero.mega}</bdi>
              </span>
              <span className="text-3xl text-v3-bone md:text-5xl">{c.hero.megaUnit}</span>
            </p>
            <p className="max-w-2xl text-v3-soft">{c.hero.megaLabel}</p>
          </Reveal>
          <Reveal immediate delay={0.24} className="lg:col-span-5">
            <Photo photo={PHOTOS.lamprey} locale={locale} ratio="1/1" priority sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
          </div>

          <Reveal immediate delay={0.28}>
            <HeroClock locale={locale} />
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
                  <span className="mt-1 shrink-0 font-v3-display text-xl tabular-nums text-v3-light">
                    {digits(`0${i + 1}`, locale)}
                  </span>
                  <span className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{f}</span>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Scale ────────────────────────────────────────────────────── */}
      <Block id="scale" kicker={c.scale.kicker} title={c.scale.title} lead={c.scale.lead}>
        <div className="mb-24 flex flex-col gap-8">
          <Reveal className="flex flex-col gap-3">
            <h3 className="font-v3-display text-3xl text-v3-bone md:text-4xl">{c.spiral.title}</h3>
            <Lead>{c.spiral.lead}</Lead>
          </Reveal>
          <TimeSpiral locale={locale} />
        </div>
        <Reveal className="mb-8 flex flex-col gap-3">
          <h3 className="font-v3-display text-3xl text-v3-bone md:text-4xl">{c.scale.dayLabel}</h3>
        </Reveal>
        <DeepTimeZoom locale={locale} />

        <div className="mt-24 flex flex-col gap-8">
          <Reveal className="flex flex-col gap-3">
            <h3 className="font-v3-display text-3xl text-v3-bone md:text-4xl">{c.scale.rulerTitle}</h3>
            <Lead>{c.scale.rulerLead}</Lead>
          </Reveal>
          <YearRuler locale={locale} />
          <p className="text-xs text-v3-mute">
            {fa ? "طول نوارها لگاریتمی است؛ در مقیاس خطی، ۸ سانتی‌متر کنار ۵۰۰ کیلومتر دیده نمی‌شد." : "Bar lengths are logarithmic; on a linear scale, 8 cm beside 500 km would not be visible."}
          </p>
          <Reveal>
            <p className="max-w-3xl border-s-2 border-v3-light ps-6 font-v3-display text-2xl font-light leading-snug text-v3-bone md:text-3xl rtl:leading-relaxed">
              {c.scale.rulerNote}
            </p>
          </Reveal>
        </div>
      </Block>

      {/* ── Circuits ─────────────────────────────────────────────────── */}
      <Block id="circuits" kicker={c.circuits.kicker} title={c.circuits.title} lead={c.circuits.lead}>
        <div className="grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-14">
          <Reveal className="mx-auto w-full max-w-[15rem] lg:mx-0">
            <Photo photo={PHOTOS.cannon} locale={locale} ratio="3/4" sizes="240px" />
          </Reveal>
          <CircuitRace locale={locale} />
        </div>
      </Block>

      {/* ── Beecher ──────────────────────────────────────────────────── */}
      <Block id="battlefield" kicker={c.beecher.kicker} title={c.beecher.title} lead={c.beecher.lead}>
        <Reveal className="mb-16">
          <Photo photo={PHOTOS.anzio} locale={locale} ratio="16/9" sizes="(min-width: 1280px) 1180px, 100vw" />
        </Reveal>
        <BeecherDots locale={locale} />
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <p className="text-xl leading-relaxed text-v3-bone rtl:leading-loose">{c.beecher.reading}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <Card tone="raised">
              <span className="text-sm text-v3-light">{fa ? "محدودیت" : "The limit"}</span>
              <p className="leading-relaxed text-v3-soft rtl:leading-loose">{c.beecher.caveat}</p>
            </Card>
          </Reveal>
        </div>
      </Block>

      {/* ── Fossils ──────────────────────────────────────────────────── */}
      <Block id="fossils" kicker={c.fossils.kicker} title={c.fossils.title} lead={c.fossils.lead}>
        <ol className="flex flex-col">
          {FOSSILS.map((k, i) => {
            const f = c.fossils.cases[k]
            const age = eventAge(k)
            return (
              <li key={k} className="border-b border-v3-line/60 first:border-t">
                <Reveal delay={i * 0.06} className="grid gap-6 py-10 md:grid-cols-[16rem_1fr] md:gap-12 lg:grid-cols-[14rem_1fr_20rem]">
                  <div className="flex flex-col gap-1">
                    <span className={`font-v3-display text-3xl ${k === "shanidar" ? "text-v3-light" : "text-v3-bone"}`}>
                      {c.fossils.ages[k] ?? `${years(age, locale)} ${fa ? "سال" : "years"}`}
                    </span>
                    <span className="text-sm text-v3-mute">{f.place}</span>
                    <span className="mt-2 text-xs text-v3-mute">
                      {fa ? "روی ساعت ۲۴ ساعته" : "on the 24-hour clock"} ·{" "}
                      <bdi dir="ltr" className="tabular-nums text-v3-soft">{clockTime(age, locale)}</bdi>
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-v3-display text-2xl text-v3-bone md:text-3xl">{f.title}</h3>
                    <p className="max-w-3xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{f.body}</p>
                  </div>
                  <Photo
                    photo={PHOTOS[FOSSIL_PHOTO[k] ?? "shanidar1"]}
                    locale={locale}
                    ratio="4/3"
                    sizes="(min-width: 1024px) 320px, 100vw"
                    className="md:col-span-2 lg:col-span-1"
                  />
                </Reveal>
              </li>
            )
          })}
        </ol>
      </Block>

      {/* ── Shanidar 1 ───────────────────────────────────────────────── */}
      <Block id="shanidar" kicker={c.shanidar.kicker} title={c.shanidar.title} lead={c.shanidar.lead}>
        <Reveal className="mb-16">
          <Photo photo={PHOTOS.shanidarCave} locale={locale} ratio="21/9" sizes="(min-width: 1280px) 1180px, 100vw" />
        </Reveal>
        <ShanidarBody locale={locale} />
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-v3-mute rtl:leading-loose">{c.shanidar.caveat}</p>
      </Block>

      {/* ── Limits ───────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-v3-line/70">
        <Beam className="[animation-delay:-8s]" />
        <div className={`${WRAP} flex flex-col gap-12 py-24 md:py-32`}>
          <Reveal className="flex flex-col gap-4">
            <Kicker>{c.limits.kicker}</Kicker>
            <Headline className="max-w-4xl">{c.limits.title}</Headline>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <Card tone="lit">
                <h3 className="text-lg text-v3-light">{c.limits.canTitle}</h3>
                <ul className="flex flex-col">
                  {c.limits.can.map((x, i) => (
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
                <h3 className="text-lg text-v3-soft">{c.limits.cannotTitle}</h3>
                <ul className="flex flex-col">
                  {c.limits.cannot.map((x, i) => (
                    <li key={i} className="flex gap-4 border-b border-v3-line/60 py-3 leading-relaxed text-v3-soft last:border-b-0 rtl:leading-loose">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-v3-mute" />
                      {x}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>
          <Reveal>
            <p className="max-w-4xl font-v3-display text-3xl font-light leading-snug text-v3-light md:text-4xl rtl:leading-relaxed">
              {c.limits.closing}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Method and sources ───────────────────────────────────────── */}
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
            <ol className="flex list-decimal flex-col gap-2.5 ps-5 text-sm text-v3-soft marker:text-v3-mute font-(family-name:--font-instrument)" dir="ltr">
              {c.method.sources.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-v3-line underline-offset-4 hover:text-v3-light hover:decoration-v3-light"
                  >
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
