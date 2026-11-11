// ============================================================================
// File Path: src/components/v3/reports/reports-index.tsx
// Why: /reports and /fa/reports. Farjad's data reports: a short written
//      argument, checked against sources, turned into figures a reader can
//      play with. Newest first. Reads lib/reports.ts, so publishing a report
//      is one entry there plus its component (and a preview in previews.tsx).
//
//      Layout "Figure Sheet" (2026-11-10, replacing a single text column that
//      read like a newspaper): a ruled grid, no boxed cards. The newest report
//      is large, with its cover photo and summary; every report shows its own
//      small chart and headline figure, so the page is scanned by numbers.
//      Each card is one stretched link (the title), so the photo credit can
//      keep its own links without nesting anchors.
// Env / Identity: React Server Component
// ============================================================================

import Image from "next/image"
import Link from "next/link"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { localDigits } from "@/lib/digits"
import { formatReportDate, reportsByDate, type ReportMeta } from "@/lib/reports"
import { absoluteUrl } from "@/lib/seo"
import { Arrow, Beam, PageHero, V3Page } from "@/components/v3/kit"
import type { ReportPhoto } from "./photo"
import { PreviewMotion } from "./preview-motion"
import { REPORT_PREVIEWS } from "./previews"
import { PHOTOS as P02 } from "./deep-time-pain/photos"
import { PHOTOS as P03 } from "./direct-to-cell/photos"
import { PHOTOS as P04 } from "./imessage-sms/photos"
import { PHOTOS as P05 } from "./migrant-stock/photos"
import { PHOTOS as P06 } from "./vienna-1683/photos"
import { PHOTOS as P07 } from "./startup-concentration/photos"
import { PHOTOS as P08 } from "./undecided-fifth/photos"

const COPY = {
  en: {
    kicker: "Reports",
    title: "Numbers I checked,",
    accent: "then drew.",
    lead: "Short reports on AI, startups and the economy. Each one starts with a claim, checks it against the sources, and turns the result into figures you can explore.",
    read: "Read the report",
    min: (n: number) => `${n} min`,
    count: (n: number) => `${n} ${n === 1 ? "report" : "reports"}`,
    latest: "Latest",
    note: "Every figure on this page was checked against its source before it was drawn.",
    credit: "Image credit:",
  },
  fa: {
    kicker: "گزارش‌ها",
    title: "عددهایی که چک کردم،",
    accent: "بعد به تصویر کشیدم.",
    lead: "گزارش‌های کوتاه درباره‌ی هوش مصنوعی، استارتاپ و اقتصاد. هر گزارش با یک ادعا شروع می‌شود، با منابع چک می‌شود و نتیجه‌اش به نمودارهایی تبدیل می‌شود که خودتان می‌توانید با آن‌ها کار کنید.",
    read: "خواندن گزارش",
    min: (n: number) => `${localDigits(n, "fa")} دقیقه`,
    count: (n: number) => `${localDigits(n, "fa")} گزارش`,
    latest: "تازه‌ترین",
    note: "هر عدد این صفحه پیش از رسم شدن با منبعش چک شده است.",
    credit: "اعتبار تصویر:",
  },
}

/** The photo a report shows when it is the featured (newest) one. 01 has none: its chart stands in. */
const COVERS: Record<string, ReportPhoto | undefined> = {
  "deep-time-pain": P02.shanidarCave,
  "starlink-direct-to-cell-iran": P03.hero,
  "imessage-hidden-sms-cost": P04.hero,
  "international-migrants-304-million": P05.hero,
  "siege-of-vienna-1683-scarce-resources": P06.hero,
  "startup-ecosystems-2026-concentration": P07.hero,
  "undecided-fifth-2026-midterms": P08.hero,
}

const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"
const EASE = "ease-[cubic-bezier(.16,1,.3,1)]"

function figureFor(r: ReportMeta, locale: Locale) {
  return locale === "fa" ? r.figureFa ?? localDigits(r.figure, "fa").replace(".", "٫") : r.figure
}

function Card({ r, locale, featured, className }: { r: ReportMeta; locale: Locale; featured?: boolean; className?: string }) {
  const t = COPY[locale]
  const m = r.copy[locale]
  const Preview = REPORT_PREVIEWS[r.slug]
  const cover = featured ? COVERS[r.slug] : undefined
  const meta = (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-v3-mute">
      <span className="tabular-nums text-v3-light">{localDigits(String(r.number).padStart(2, "0"), locale)}</span>
      {featured && <span className="text-v3-bone">{t.latest}</span>}
      <span>{m.topic}</span>
      <time dateTime={r.published}>{formatReportDate(r.published, locale)}</time>
      <span>{t.min(r.readMinutes)}</span>
    </p>
  )
  const body = (
    <>
      {Preview && (
        <div className={featured ? "w-full max-w-md" : "w-full"}>
          <Preview locale={locale} />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <span dir="ltr" className={`font-v3-display font-light leading-none tabular-nums text-v3-light rtl:text-right ${featured ? "text-6xl md:text-7xl" : "text-4xl md:text-5xl"}`}>
          {figureFor(r, locale)}
        </span>
        <span className="text-sm leading-snug text-v3-soft rtl:leading-relaxed">{m.figureLabel}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className={`font-v3-display font-light leading-tight text-v3-bone transition-colors duration-500 group-hover/card:text-v3-light rtl:leading-snug ${featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
          <Link
            href={localePath(locale, `/reports/${r.slug}`)}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {m.title}
          </Link>
        </h2>
        <p className={`text-base leading-relaxed text-v3-soft rtl:leading-loose ${featured ? "" : "hidden md:block"}`}>{m.tagline}</p>
        {featured && <p className="mt-2 hidden max-w-2xl text-base leading-relaxed text-v3-soft md:block rtl:leading-loose">{m.summary}</p>}
      </div>
      <span aria-hidden className="mt-auto hidden items-center gap-3 pt-2 text-sm text-v3-bone md:inline-flex">
        {t.read}
        <Arrow locale={locale} className="h-4 w-4 transition-transform duration-300 group-hover/card:translate-x-1 rtl:group-hover/card:-translate-x-1" />
      </span>
    </>
  )
  return (
    <li
      data-preview-card
      className={`group/card relative flex flex-col gap-4 bg-v3-ink p-5 transition-colors duration-500 hover:bg-v3-raise has-[a:focus-visible]:bg-v3-raise has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-v3-light md:gap-6 md:p-8 ${className ?? ""}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-v3-light transition-transform duration-700 ${EASE} group-hover/card:scale-x-100 group-has-[a:focus-visible]/card:scale-x-100 rtl:origin-right`}
      />
      {meta}
      {cover ? (
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          <figure className="flex flex-col gap-2 lg:col-span-5">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-v3-line/70 lg:aspect-[4/5]">
              <Image
                src={cover.src}
                alt={cover.alt[locale]}
                fill
                priority
                sizes="(min-width: 1024px) 28vw, 100vw"
                className={`object-cover grayscale transition-[filter,transform] duration-700 ${EASE} group-hover/card:scale-[1.02] group-hover/card:grayscale-0`}
              />
            </div>
            <figcaption className={`relative z-10 text-xs text-v3-mute rtl:text-right ${LATIN}`} dir="ltr">
              <span className="sr-only">{t.credit} </span>
              {cover.credit} ·{" "}
              {cover.licenseUrl ? (
                <a href={cover.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline decoration-v3-line underline-offset-2 hover:text-v3-light">
                  {cover.license}
                </a>
              ) : (
                cover.license
              )}{" "}
              ·{" "}
              <a href={cover.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-v3-line underline-offset-2 hover:text-v3-light">
                Wikimedia Commons
              </a>
            </figcaption>
          </figure>
          <div className="flex flex-col gap-4 md:gap-6 lg:col-span-7">{body}</div>
        </div>
      ) : (
        body
      )}
    </li>
  )
}

export function ReportsIndex({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const reports = reportsByDate()
  const url = absoluteUrl(localePath(locale, "/reports"))

  // A collection with its members named, so an answer engine can see what the
  // section holds without crawling every report, plus the two-level trail.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: t.kicker,
      description: t.lead,
      url,
      inLanguage: locale === "fa" ? "fa-IR" : "en",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: reports.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: reports.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: r.copy[locale].title,
          url: absoluteUrl(localePath(locale, `/reports/${r.slug}`)),
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: locale === "fa" ? "خانه" : "Home", item: absoluteUrl(localePath(locale, "/")) },
        { "@type": "ListItem", position: 2, name: t.kicker, item: url },
      ],
    },
  ]

  // Grid bookkeeping: the sheet's rules are the 1px gaps of a line-coloured
  // grid, so an unfilled cell at the end would show as a solid block. A
  // closing note fills the 3-up row on wide screens; a blank fills the 2-up.
  const [first, ...rest] = reports
  const lgLeft = (rest.length - 2) % 3
  const lgFill = lgLeft === 0 ? "" : lgLeft === 1 ? "lg:col-span-8" : "lg:col-span-4"
  const mdFill = rest.length % 2 === 1

  return (
    <V3Page>
      {jsonLd.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
      <PageHero kicker={t.kicker} title={t.title} accent={t.accent} lead={t.lead} />
      <PreviewMotion />
      <section className="relative isolate overflow-hidden">
        <Beam className="[animation-delay:-5s]" />
        <div className="mx-auto w-full max-w-[1600px] px-5 py-16 md:px-10 md:py-24 lg:px-14">
          <p className="mb-6 text-sm text-v3-mute">{t.count(reports.length)}</p>
          <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-v3-line bg-v3-line md:grid-cols-2 lg:grid-cols-12">
            {first && <Card r={first} locale={locale} featured className="md:col-span-2 lg:col-span-8 lg:row-span-2" />}
            {rest.map((r) => (
              <Card key={r.slug} r={r} locale={locale} className="lg:col-span-4" />
            ))}
            {lgFill && (
              <li aria-hidden className={`hidden items-end bg-v3-ink p-8 lg:flex ${lgFill}`}>
                <p className="max-w-xs text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.note}</p>
              </li>
            )}
            {mdFill && <li aria-hidden className="hidden bg-v3-ink md:block lg:hidden" />}
          </ol>
        </div>
      </section>
    </V3Page>
  )
}
