// ============================================================================
// File Path: src/components/v3/reports/gen-z-unbound/part3/report.tsx
// Why: Report 13, "Trust You Can Check" — part 3 of the Gen Z series, for
//      /reports/… and /fa/reports/…. Electric Twin's survey (Oct 2026): how
//      people say their trust has changed, the trust that holds up, the
//      broadcast account and where the data stop, the feed experiments the
//      report cites, and what follows. The authors' interpretations carry a
//      visible tag so they are not read as findings. One component for both
//      locales; a server component.
// Env / Identity: React Server Component
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { ReportMeta } from "@/lib/reports"
import { Card, Reveal } from "@/components/v3/kit"
import { TRUSTED } from "../data"
import { Block, Callout, GenZPage, Prose, faDigits } from "../frame"
import { PHOTOS } from "../photos"
import { COPY } from "./copy"
import { FeedStudies, PlatformChart, TrustLedger, WhereDataStop } from "./widgets"

const STUDY_SOURCES = [
  {
    label: "Guess, A. M. et al. (2023). How do social media feed algorithms affect attitudes and behavior in an election campaign? Science 381(6656), 398–404.",
    href: "https://doi.org/10.1126/science.abp9364",
  },
  {
    label: "Nyhan, B. et al. (2023). Like-minded sources on Facebook are prevalent but not polarizing. Nature 620(7972), 137–144.",
    href: "https://doi.org/10.1038/s41586-023-06297-w",
  },
  {
    label: "Piccardi, T. et al. (2025). Reranking partisan animosity in algorithmic social media feeds alters affective polarization. Science 390(6776).",
    href: "https://doi.org/10.1126/science.adu5584",
  },
  {
    label: "Tocqueville, A. de (1840). Democracy in America, vol. 2, book 2, ch. 6: Of the relation between public associations and newspapers.",
    href: "https://en.wikisource.org/wiki/Democracy_in_America/Volume_2/Book_2/Chapter_6",
  },
  {
    label: "Texas Department of Transportation. TxDOT salutes 40 years of Don't Mess with Texas.",
    href: "https://www.txdot.gov/about/newsroom/statewide/txdot-salutes-40-years-of-dont-mess-with-texas.html",
  },
]

/** Marks a block as the report authors' interpretation, not a survey finding. */
function Interp({ label }: { label: string }) {
  return <span className="inline-flex self-start rounded-full border border-dashed border-v3-mute px-3 py-1 text-xs text-v3-mute">{label}</span>
}

export function GenZPart3Report({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const fa = locale === "fa"
  const n = (v: number) => faDigits(String(v), locale) + (fa ? "٪" : "%")
  return (
    <GenZPage
      locale={locale}
      meta={meta}
      part={2}
      hero={c.hero}
      photo={PHOTOS.part3}
      mentions={["Electric Twin", "London School of Economics", "CBS", "Facebook", "Instagram", "X"]}
      about={fa ? ["اعتماد به نهادها", "رسانه", "شبکه‌های اجتماعی", "نسل زد"] : ["Institutional trust", "Media", "Social media", "Generation Z"]}
      extraSources={STUDY_SOURCES}
    >
      <Block id="trust" kicker={c.trust.kicker} title={c.trust.title} lead={c.trust.lead} tone="beam">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <TrustLedger locale={locale} />
          </div>
          <div className="lg:col-span-5">
            <Prose paras={c.trust.body} />
          </div>
        </div>
        <Callout title={c.trust.callout.title} body={c.trust.callout.body} />
      </Block>

      <Block id="check" kicker={c.check.kicker} title={c.check.title} lead={c.check.lead}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: TRUSTED.doctor, l: c.check.trusted.doctor, gold: true },
                { v: TRUSTED.friendsFamily, l: c.check.trusted.family, gold: false },
              ].map((k) => (
                <Reveal key={k.l}>
                  <div className={`flex h-full flex-col gap-2 rounded-2xl border p-5 ${k.gold ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}>
                    <p className={`font-v3-display text-5xl leading-none tabular-nums ${k.gold ? "text-v3-light" : "text-v3-bone"}`}>{n(k.v)}</p>
                    <p className="text-sm leading-snug text-v3-soft">{k.l}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <ul className="flex flex-col">
              {c.check.reasons.map((r) => (
                <li key={r.t} className="flex items-baseline gap-4 border-b border-v3-line/60 py-3 last:border-b-0">
                  <span className="w-28 shrink-0 font-v3-display text-xl tabular-nums text-v3-bone">{r.n}</span>
                  <span className="leading-relaxed text-v3-soft rtl:leading-loose">{r.t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-6">
            <Prose paras={c.check.body} />
            <Reveal>
              <Card tone="raised">
                <Interp label={c.interp} />
                <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{c.check.interp}</p>
              </Card>
            </Reveal>
          </div>
        </div>
      </Block>

      <Block id="broadcast" kicker={c.broadcast.kicker} title={c.broadcast.title} lead={c.broadcast.lead} tone="beam">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Interp label={c.interp} />
            <Prose paras={c.broadcast.body} />
          </div>
          <div className="lg:col-span-7">
            <PlatformChart locale={locale} />
          </div>
        </div>
      </Block>

      <Block id="limits" kicker={c.unexplained.kicker} title={c.unexplained.title} lead={c.unexplained.lead}>
        <WhereDataStop locale={locale} />
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Prose paras={c.unexplained.body} />
          </div>
          <Reveal className="lg:col-span-5">
            <figure className="flex flex-col gap-3 border-s-2 border-v3-light/70 ps-5">
              <p className="font-v3-display text-2xl leading-snug text-v3-light md:text-3xl">{c.unexplained.verdict}</p>
              <figcaption className="text-sm text-v3-mute">{c.unexplained.verdictBy}</figcaption>
            </figure>
          </Reveal>
        </div>
      </Block>

      <Block id="studies" kicker={c.studies.kicker} title={c.studies.title} lead={c.studies.lead} tone="beam">
        <FeedStudies locale={locale} />
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Prose paras={c.studies.body} />
          </div>
          <Reveal className="flex flex-col gap-3 lg:col-span-5">
            <Interp label={c.interp} />
            <p className="font-v3-display text-2xl leading-snug text-v3-bone md:text-3xl">{c.studies.pull}</p>
          </Reveal>
        </div>
        <Callout title={c.studies.callout.title} body={c.studies.callout.body} />
      </Block>

      <Block id="follows" kicker={c.follows.kicker} title={c.follows.title} lead={c.follows.lead}>
        <div className="mb-8">
          <Interp label={c.interp} />
        </div>
        <Prose paras={c.follows.body} />
        <div className="mt-12 flex flex-col gap-6">
          <h3 className="font-v3-display text-2xl text-v3-bone">{c.follows.consequencesTitle}</h3>
          <ol className="grid gap-6 md:grid-cols-3">
            {c.follows.consequences.map((it, i) => (
              <Reveal key={it.t} delay={i * 0.05}>
                <li className="flex h-full flex-col gap-2 border-t-2 border-v3-mute/60 pt-4">
                  <span className="text-sm tabular-nums text-v3-mute">{fa ? `۰${"۱۲۳"[i]}` : `0${i + 1}`}</span>
                  <h4 className="font-v3-display text-xl text-v3-bone">{it.t}</h4>
                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">{it.b}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal className="mt-14 max-w-4xl">
          <Card tone="lit">
            <h3 className="font-v3-display text-2xl text-v3-bone">{c.follows.room.title}</h3>
            {c.follows.room.body.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">
                {p}
              </p>
            ))}
          </Card>
        </Reveal>
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
