// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/part1/report.tsx
// Why: Report 11, "Eight in a Hundred, and Two" — part 1 of the Gen Z
//      series, for /reports/… and /fa/reports/…. Electric Twin's survey
//      (Oct 2026): strong views per hundred, how tightly views hang
//      together, the find-a-twin rooms, the left and right camps by country,
//      and the issues where the generations differ in degree. One component
//      for both locales; a server component.
// Env / Identity: React Server Component
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { ReportMeta } from "@/lib/reports"
import { Card, Reveal } from "@/components/v3/kit"
import { Block, Callout, GenZPage, Prose } from "../frame"
import { PHOTOS } from "../photos"
import { COPY } from "./copy"
import { BundleBars, Camps, IssuesChart, IssuesGame, RoomOf100, TwinRooms } from "./widgets"

export function GenZPart1Report({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const fa = locale === "fa"
  return (
    <GenZPage
      locale={locale}
      meta={meta}
      part={0}
      hero={c.hero}
      photo={PHOTOS.part1}
      mentions={["Electric Twin", "London School of Economics"]}
      about={fa ? ["نسل زد", "قطبی‌شدن سیاسی", "نظرسنجی", "نسل‌ها"] : ["Generation Z", "Political polarisation", "Survey research", "Generations"]}
    >
      <Block id="room" kicker={c.room.kicker} title={c.room.title} lead={c.room.lead} tone="beam">
        <RoomOf100 locale={locale} />
        <div className="mt-12">
          <Prose paras={c.room.body} />
        </div>
      </Block>

      <Block id="bundles" kicker={c.bundle.kicker} title={c.bundle.title} lead={c.bundle.lead}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <BundleBars locale={locale} />
          </div>
          <div className="lg:col-span-6">
            <Prose paras={[c.bundle.body[0]]} />
          </div>
        </div>
        <div className="mt-12">
          <TwinRooms locale={locale} />
        </div>
        <div className="mt-12">
          <Prose paras={[c.bundle.body[1]]} />
        </div>
      </Block>

      <Block id="camps" kicker={c.camps.kicker} title={c.camps.title} lead={c.camps.lead} tone="beam">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Camps locale={locale} />
          </div>
          <div className="lg:col-span-5">
            <Prose paras={c.camps.body} />
          </div>
        </div>
        <Callout title={c.camps.callout.title} body={c.camps.callout.body} />
      </Block>

      <Block id="issues" kicker={c.issues.kicker} title={c.issues.title} lead={c.issues.lead}>
        <IssuesGame locale={locale} />
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <IssuesChart locale={locale} />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5">
            <Prose paras={c.issues.body} />
            <Reveal>
              <Card tone="raised">
                <h3 className="font-v3-display text-xl text-v3-bone">{c.issues.abortion.title}</h3>
                <p className="leading-relaxed text-v3-soft rtl:leading-loose">{c.issues.abortion.body}</p>
              </Card>
            </Reveal>
          </div>
        </div>
      </Block>

      <Block id="reading" kicker={c.reading.kicker} title={c.reading.title} lead={c.reading.lead} tone="beam">
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
