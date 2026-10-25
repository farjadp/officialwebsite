// ============================================================================
// File Path: src/components/v3/reports/vienna-1683/report.tsx
// Why: Report 06, "300,000 against 12,000?", for /reports/… and /fa/reports/….
//      The Siege of Vienna (1683) read as a lesson in strategic thinking:
//      power is effective resources, not total resources. One component for
//      both locales; a server component, so every sentence is in the HTML.
//      Order follows Farjad's analysis: fix the numbers, the scarce
//      resources, the opportunity cost of each choice (played as a game), why
//      the defenders held, the charge, a critical view, then the transfer to
//      business and a mirror for the reader. Medals (./medals) float over
//      the page, one per interactive section.
// Env / Identity: React Server Component
// ============================================================================

import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { Brain, CalendarClock, Crosshair, Wheat } from "lucide-react"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { formatReportDate, type ReportMeta } from "@/lib/reports"
import { Beam, Card, Headline, Kicker, Lead, Parallax, Reveal, Spotlight, V3Button, V3Page } from "@/components/v3/kit"
import { ReadingProgress } from "@/components/v3/reading-progress"
import { ReportColophon } from "../colophon"
import { Photo, type ReportPhoto } from "../photo"
import { reportJsonLd } from "../report-route"
import { KahlenbergCharge } from "./charge"
import { COPY } from "./copy"
import { WarCouncil } from "./council"
import { MedalCase } from "./medals"
import { PHOTOS } from "./photos"
import { InteriorLines, Multipliers, MythCards, Mirror, NumbersFigure, SiegeClock } from "./widgets"

const WRAP = "mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-14"
const FA = "۰۱۲۳۴۵۶۷۸۹"
const RESOURCE_ICONS = [CalendarClock, Crosshair, Wheat, Brain]
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"

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

/** A full-bleed painting that drifts with the scroll, with its credit under it. */
function Cinema({ photo, locale, height = "h-[56vh]" }: { photo: ReportPhoto; locale: Locale; height?: string }) {
  return (
    <figure className="border-b border-v3-line/70">
      <Parallax className={`${height} min-h-80 w-full`}>
        <Image src={photo.src} alt={photo.alt[locale]} fill sizes="100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-v3-ink via-transparent to-v3-ink/40" />
      </Parallax>
      <figcaption className={`${WRAP} flex flex-col gap-1 py-4 text-sm text-v3-soft`}>
        <span>{photo.caption[locale]}</span>
        <span className={`text-xs text-v3-mute ${LATIN} rtl:text-right`} dir="ltr">
          {photo.credit} · {photo.license} ·{" "}
          <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-v3-line underline-offset-2 hover:text-v3-light">
            Wikimedia Commons
          </a>
        </span>
      </figcaption>
    </figure>
  )
}

export function Vienna1683Report({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const c = COPY[locale]
  const m = meta.copy[locale]
  const fa = locale === "fa"
  const digits = (s: string) => (fa ? s.replace(/\d/g, (x) => FA[Number(x)]) : s)
  const minutes = fa ? `${digits(String(meta.readMinutes))} دقیقه مطالعه` : `${meta.readMinutes} min read`
  const [qo, qc] = fa ? ["«", "»"] : ["\u201c", "\u201d"]
  const portraits = [PHOTOS.karaMustafa, PHOTOS.starhemberg, PHOTOS.sobieski]

  const jsonLd = reportJsonLd({
    locale,
    slug: meta.slug,
    mentions: ["Kara Mustafa Pasha", "Ernst Rüdiger von Starhemberg", "John III Sobieski", "Battle of Vienna"],
    citation: c.method.sources.map((s) => ({ label: s.label, href: s.href })),
    about: fa ? ["تفکر استراتژیک", "محاصره‌ی وین", "هزینه‌ی فرصت", "محدودیت منابع"] : ["Strategic thinking", "Siege of Vienna", "Opportunity cost", "Resource constraints"],
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

          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="flex flex-col gap-8 lg:col-span-7">
              <Reveal immediate delay={0.04}>
                <figure className="border-s-2 border-v3-light ps-5">
                  <p className="font-v3-display text-2xl leading-snug text-v3-bone md:text-3xl">{qo}
                    {c.hero.quote}
                    {qc}</p>
                  <figcaption className="mt-2 text-sm text-v3-mute">{c.hero.quoteBy}</figcaption>
                </figure>
              </Reveal>
              <Reveal immediate delay={0.1}>
                <Headline as="h1" size="hero" accent={<span className="mt-2 block">{m.tagline}</span>} className="max-w-5xl">
                  {m.title}
                </Headline>
              </Reveal>
              <Reveal immediate delay={0.16}>
                <p className="max-w-3xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{c.hero.lead}</p>
              </Reveal>
            </div>
            <Reveal immediate delay={0.22} className="lg:col-span-5">
              <Photo photo={PHOTOS.hero} locale={locale} ratio="4/3" priority sizes="(min-width: 1024px) 40vw, 100vw" />
            </Reveal>
          </div>

          <Reveal immediate delay={0.28}>
            <dl className="grid gap-3 sm:grid-cols-3 md:gap-5">
              {c.hero.stats.map((st, i) => (
                <div key={st.label} className={`flex flex-col gap-2 rounded-2xl border p-5 ${i === 0 ? "border-v3-light/50 bg-v3-raise" : "border-v3-line/80"}`}>
                  <dt className="order-last text-sm leading-snug text-v3-soft">{st.label}</dt>
                  <dd className={`font-v3-display text-5xl leading-none tabular-nums md:text-6xl ${i === 0 ? "text-v3-light drop-shadow-[0_0_40px_rgb(var(--v3-glow)/0.4)]" : "text-v3-bone"}`}>{st.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <p className="text-sm text-v3-light">{c.hero.medals}</p>
        </div>
      </header>

      {/* ── The numbers ──────────────────────────────────────────────── */}
      <Block id="numbers" kicker={c.numbers.kicker} title={c.numbers.title} lead={c.numbers.lead}>
        <NumbersFigure locale={locale} />
        <Reveal className="mt-14 max-w-4xl">
          <Card tone="lit">
            <h3 className="font-v3-display text-2xl text-v3-bone">{c.numbers.verdict.title}</h3>
            <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{c.numbers.verdict.body}</p>
          </Card>
        </Reveal>
      </Block>

      {/* ── The cast ─────────────────────────────────────────────────── */}
      <Block id="cast" kicker={c.cast.kicker} title={c.cast.title} tone="beam">
        <div className="grid gap-6 md:grid-cols-3">
          {c.cast.people.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <Card tone={i === 1 ? "lit" : "raised"}>
                <Photo photo={portraits[i]} locale={locale} ratio="4/5" sizes="(min-width: 768px) 30vw, 100vw" />
                <h3 className="font-v3-display text-2xl text-v3-bone">{p.name}</h3>
                <p className="text-sm text-v3-mute">{p.role}</p>
                <p className="leading-relaxed text-v3-bone rtl:leading-loose">{p.aim}</p>
                <p className="mt-auto border-t border-v3-line/70 pt-3 text-sm text-v3-soft">{p.force}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* ── Scarce resources ─────────────────────────────────────────── */}
      <Block id="resources" kicker={c.resources.kicker} title={c.resources.title} lead={c.resources.lead}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {c.resources.cards.map((r, i) => {
              const I = RESOURCE_ICONS[i]
              return (
                <Reveal key={r.name} delay={i * 0.06}>
                  <Card tone="raised">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-v3-light/60 text-v3-light">
                      <I className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="font-v3-display text-2xl text-v3-bone">{r.name}</h3>
                    <p className="leading-relaxed text-v3-soft rtl:leading-loose">{r.state}</p>
                  </Card>
                </Reveal>
              )
            })}
          </div>
          <Reveal className="lg:col-span-4">
            <Photo photo={PHOTOS.cannonball} locale={locale} ratio="4/5" sizes="(min-width: 1024px) 28vw, 100vw" />
          </Reveal>
        </div>
        <Reveal className="mt-12">
          <p className="max-w-3xl font-v3-display text-3xl leading-snug text-v3-light">{c.resources.conclusion}</p>
        </Reveal>
      </Block>

      {/* ── The siege clock ──────────────────────────────────────────── */}
      <Block id="clock" kicker={c.clock.kicker} title={c.clock.title} lead={c.clock.lead} tone="beam">
        <SiegeClock locale={locale} />
      </Block>

      {/* ── The war council ──────────────────────────────────────────── */}
      <Block id="council" kicker={c.council.kicker} title={c.council.title} lead={c.council.lead}>
        <WarCouncil locale={locale} />
      </Block>

      {/* ── Why they held ────────────────────────────────────────────── */}
      <Block id="defence" kicker={c.defence.kicker} title={c.defence.title} lead={c.defence.lead} tone="beam">
        <Multipliers locale={locale} />
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <InteriorLines locale={locale} />
          </div>
          <Reveal className="lg:col-span-4">
            <Photo photo={PHOTOS.plan} locale={locale} ratio="1/1" sizes="(min-width: 1024px) 38vw, 100vw" />
          </Reveal>
        </div>
      </Block>

      {/* ── The heights and the charge ───────────────────────────────── */}
      <Cinema photo={PHOTOS.battle} locale={locale} />
      <section id="charge" className="relative border-b border-v3-line/70">
        <div className={`${WRAP} pt-20 md:pt-28`}>
          <Reveal className="mb-10 flex flex-col gap-4">
            <Kicker>{c.charge.kicker}</Kicker>
            <Headline className="max-w-4xl">{c.charge.title}</Headline>
            <Lead className="mt-2">{c.charge.lead}</Lead>
          </Reveal>
          <div className="mb-10 grid gap-6 md:grid-cols-3">
            {[PHOTOS.heights, PHOTOS.kossak, PHOTOS.armour].map((ph, i) => (
              <Reveal key={ph.src} delay={i * 0.08}>
                <Photo photo={ph} locale={locale} ratio="4/5" sizes="(min-width: 768px) 30vw, 100vw" />
              </Reveal>
            ))}
          </div>
          <KahlenbergCharge locale={locale} />
          <p className="mt-4 text-xs leading-relaxed text-v3-mute lg:hidden rtl:leading-loose">{c.charge.scale}</p>
          <div className="h-16" aria-hidden />
        </div>
      </section>

      {/* ── Myths ────────────────────────────────────────────────────── */}
      <Block id="myths" kicker={c.myths.kicker} title={c.myths.title} lead={c.myths.lead}>
        <MythCards locale={locale} />
      </Block>

      {/* ── Business ─────────────────────────────────────────────────── */}
      <Block id="business" kicker={c.business.kicker} title={c.business.title} lead={c.business.lead} tone="beam">
        <div className="overflow-hidden rounded-3xl border border-v3-line">
          <div className="grid grid-cols-2 border-b border-v3-line bg-v3-raise text-sm">
            <span className="px-5 py-3 text-v3-mute">{c.business.bigLabel}</span>
            <span className="border-s border-v3-line px-5 py-3 text-v3-light">{c.business.smallLabel}</span>
          </div>
          {c.business.rows.map((r, i) => (
            <Reveal key={r.big} delay={i * 0.06}>
              <div className="grid grid-cols-2 border-b border-v3-line/60 last:border-b-0">
                <span className="px-5 py-4 leading-relaxed text-v3-soft rtl:leading-loose">{r.big}</span>
                <span className="border-s border-v3-line/60 px-5 py-4 leading-relaxed text-v3-bone rtl:leading-loose">{r.small}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Block>

      {/* ── Mirror ───────────────────────────────────────────────────── */}
      <Block id="mirror" kicker={c.mirror.kicker} title={c.mirror.title} lead={c.mirror.lead}>
        <Mirror locale={locale} />
      </Block>

      {/* ── Takeaway ─────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-v3-line/70">
        <Beam />
        <div className={`${WRAP} flex flex-col gap-6 py-24 md:py-32`}>
          <Kicker>{c.takeaway.kicker}</Kicker>
          <Reveal>
            <p className="max-w-5xl font-v3-display text-4xl leading-tight text-v3-bone md:text-6xl rtl:leading-snug">{qo}
              {c.takeaway.quote}
              {qc}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-3xl text-xl text-v3-light">{c.takeaway.tail}</p>
          </Reveal>
        </div>
      </section>

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
            <ol className={`flex list-decimal flex-col gap-2.5 ps-5 text-sm text-v3-soft marker:text-v3-mute ${LATIN}`} dir="ltr">
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
