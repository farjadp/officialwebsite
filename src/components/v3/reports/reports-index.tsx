// ============================================================================
// File Path: src/components/v3/reports/reports-index.tsx
// Why: /reports and /fa/reports. Farjad's data reports: a short written
//      argument, checked against sources, turned into figures a reader can
//      play with. Newest first. Reads lib/reports.ts, so publishing a report
//      is one entry there plus its component.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { localDigits } from "@/lib/digits"
import { formatReportDate, reportsByDate } from "@/lib/reports"
import { absoluteUrl } from "@/lib/seo"
import { Arrow, Beam, PageHero, Reveal, V3Page } from "@/components/v3/kit"

const COPY = {
  en: {
    kicker: "Reports",
    title: "Numbers I checked,",
    accent: "then drew.",
    lead: "Short reports on AI, startups and the economy. Each one starts with a claim, checks it against the sources, and turns the result into figures you can explore.",
    read: "Read the report",
    min: (n: number) => `${n} min`,
    count: (n: number) => `${n} ${n === 1 ? "report" : "reports"}`,
  },
  fa: {
    kicker: "گزارش‌ها",
    title: "عددهایی که چک کردم،",
    accent: "بعد به تصویر کشیدم.",
    lead: "گزارش‌های کوتاه درباره‌ی هوش مصنوعی، استارتاپ و اقتصاد. هر گزارش با یک ادعا شروع می‌شود، با منابع چک می‌شود و نتیجه‌اش به نمودارهایی تبدیل می‌شود که خودتان می‌توانید با آن‌ها کار کنید.",
    read: "خواندن گزارش",
    min: (n: number) => `${localDigits(n, "fa")} دقیقه`,
    count: (n: number) => `${localDigits(n, "fa")} گزارش`,
  },
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

  return (
    <V3Page>
      {jsonLd.map((node, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }} />
      ))}
      <PageHero kicker={t.kicker} title={t.title} accent={t.accent} lead={t.lead} />
      <section className="relative isolate overflow-hidden">
        <Beam className="[animation-delay:-5s]" />
        <div className="mx-auto w-full max-w-[1600px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <p className="mb-8 text-sm text-v3-mute">{t.count(reports.length)}</p>
          <ol className="flex flex-col">
            {reports.map((r, i) => {
              const m = r.copy[locale]
              const figure = locale === "fa" ? localDigits(r.figure, "fa").replace(".", "٫") : r.figure
              return (
                <li key={r.slug}>
                  <Reveal delay={i * 0.08}>
                    <Link
                      href={localePath(locale, `/reports/${r.slug}`)}
                      className="group grid gap-8 border-t border-v3-line/70 py-12 transition-colors duration-500 hover:border-v3-light/60 md:grid-cols-12 md:items-end"
                    >
                      <div className="flex flex-col gap-5 md:col-span-7">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-v3-mute">
                          <span className="tabular-nums text-v3-light">{localDigits(String(r.number).padStart(2, "0"), locale)}</span>
                          <span>{m.topic}</span>
                          <time dateTime={r.published}>{formatReportDate(r.published, locale)}</time>
                          <span>{t.min(r.readMinutes)}</span>
                        </div>
                        <h2 className="font-v3-display text-4xl font-light leading-tight text-v3-bone transition-colors duration-500 group-hover:text-v3-light md:text-6xl rtl:leading-snug">
                          {m.title} <span className="mt-1 block text-v3-mute">{m.tagline}</span>
                        </h2>
                        <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{m.summary}</p>
                        <span className="inline-flex items-center gap-3 text-v3-bone">
                          {t.read}
                          <Arrow locale={locale} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-5 md:items-end">
                        <span dir="ltr" className="font-v3-display text-7xl font-light tabular-nums text-v3-light drop-shadow-[0_0_40px_rgb(var(--v3-glow)/0.3)] md:text-9xl">
                          {figure}
                        </span>
                        <span className="text-sm text-v3-mute">{m.figureLabel}</span>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </V3Page>
  )
}
