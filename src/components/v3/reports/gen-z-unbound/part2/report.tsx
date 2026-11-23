// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/part2/report.tsx
// Why: Report 12, "One Generation, Four Countries" — part 2 of the Gen Z
//      series, for /reports/… and /fa/reports/…. Electric Twin's survey
//      (Oct 2026): how far apart the four countries sit per question,
//      guessing a country from someone's views, cultural distance (CFST),
//      finding a match abroad and the shared stars. One component for both
//      locales; a server component.
// Env / Identity: React Server Component
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { ReportMeta } from "@/lib/reports"
import { Card, Reveal } from "@/components/v3/kit"
import { Block, Callout, GenZPage, Prose } from "../frame"
import { PHOTOS } from "../photos"
import { COPY } from "./copy"
import { CfstBars, GuessCountry, MatchAbroad, SpreadBars, StarsGame } from "./widgets"

export function GenZPart2Report({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const fa = locale === "fa"
  return (
    <GenZPage
      locale={locale}
      meta={meta}
      part={1}
      hero={c.hero}
      photo={PHOTOS.part2}
      mentions={["Electric Twin", "London School of Economics"]}
      about={fa ? ["نسل زد", "فرهنگ جهانی", "فاصله‌ی فرهنگی", "نظرسنجی"] : ["Generation Z", "Global culture", "Cultural distance", "Survey research"]}
    >
      <Block id="spread" kicker={c.spread.kicker} title={c.spread.title} lead={c.spread.lead} tone="beam">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <SpreadBars locale={locale} />
          </div>
          <div className="lg:col-span-6">
            <Prose paras={c.spread.body} />
          </div>
        </div>
      </Block>

      <Block id="guess" kicker={c.guess.kicker} title={c.guess.title} lead={c.guess.lead}>
        <GuessCountry locale={locale} />
        <div className="mt-12">
          <Prose paras={c.guess.body} />
        </div>
      </Block>

      <Block id="distance" kicker={c.distance.kicker} title={c.distance.title} lead={c.distance.lead} tone="beam">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <CfstBars locale={locale} />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Reveal>
              <Card tone="raised">
                <h3 className="font-v3-display text-xl text-v3-bone">{c.distance.what.title}</h3>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{c.distance.what.body}</p>
              </Card>
            </Reveal>
            <Prose paras={c.distance.body} />
          </div>
        </div>
      </Block>

      <Block id="abroad" kicker={c.abroad.kicker} title={c.abroad.title} lead={c.abroad.lead}>
        <MatchAbroad locale={locale} />
        <div className="mt-12">
          <Prose paras={c.abroad.body} />
        </div>
      </Block>

      <Block id="stars" kicker={c.stars.kicker} title={c.stars.title} lead={c.stars.lead} tone="beam">
        <StarsGame locale={locale} />
        <div className="mt-12">
          <Prose paras={c.stars.body} />
        </div>
        <Callout title={c.means.title} body={c.means.body} />
      </Block>

      <Block id="reading" kicker={c.reading.kicker} title={c.reading.title} lead={c.reading.lead}>
        <ol className="grid gap-6 md:grid-cols-2">
          {c.reading.items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.05}>
              <li className="flex h-full flex-col gap-2 border-t-2 border-v3-light/60 pt-4">
                <span className="text-sm tabular-nums text-v3-light">{fa ? `۰${"۱۲۳۴"[i]}` : `0${i + 1}`}</span>
                <h3 className="font-v3-display text-xl text-v3-bone">{it.t}</h3>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{it.b}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Block>
    </GenZPage>
  )
}
