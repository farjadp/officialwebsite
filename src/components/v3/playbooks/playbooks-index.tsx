// ============================================================================
// File Path: src/components/v3/playbooks/playbooks-index.tsx
// Why: /playbooks and /fa/playbooks. Step-by-step guides Farjad has run
//      himself: what you end up with, what it costs, and the day every
//      command was last checked. Newest first. Reads lib/playbooks.ts, so
//      publishing one is an entry there plus its component.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { localDigits } from "@/lib/digits"
import { formatReportDate } from "@/lib/reports"
import { playbooksByDate } from "@/lib/playbooks"
import { absoluteUrl } from "@/lib/seo"
import { Arrow, Beam, PageHero, Reveal, V3Page } from "@/components/v3/kit"

const COPY = {
  en: {
    kicker: "Playbooks",
    title: "Done it myself,",
    accent: "here is how.",
    lead: "Step-by-step guides to things I have set up and run. Each one says what you end up with, what it costs and what to copy, and carries the date every command and price was last checked.",
    open: "Open the playbook",
    min: (n: number) => `${n} min`,
    verified: (d: string) => `Checked ${d}`,
    count: (n: number) => `${n} ${n === 1 ? "playbook" : "playbooks"}`,
    outcome: "You end up with",
  },
  fa: {
    kicker: "پلی‌بوک‌ها",
    title: "راهی که خودم رفتم،",
    accent: "قدم‌به‌قدم.",
    lead: "راهنماهای قدم‌به‌قدم برای کارهایی که خودم راه انداخته‌ام و اجرا کرده‌ام. هر کدام می‌گوید آخرش چه چیزی دستت است، چقدر هزینه دارد و چه چیزی را کپی کنی، و تاریخ آخرین بررسی دستورها و قیمت‌ها را هم دارد.",
    open: "باز کردن پلی‌بوک",
    min: (n: number) => `${localDigits(n, "fa")} دقیقه`,
    verified: (d: string) => `بررسی‌شده در ${d}`,
    count: (n: number) => `${localDigits(n, "fa")} پلی‌بوک`,
    outcome: "آخرش دستت است",
  },
}

export function PlaybooksIndex({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const playbooks = playbooksByDate()
  const url = absoluteUrl(localePath(locale, "/playbooks"))

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
        numberOfItems: playbooks.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: playbooks.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.copy[locale].title,
          url: absoluteUrl(localePath(locale, `/playbooks/${p.slug}`)),
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
          <p className="mb-8 text-sm text-v3-mute">{t.count(playbooks.length)}</p>
          <ol className="flex flex-col">
            {playbooks.map((p, i) => {
              const m = p.copy[locale]
              const figure = locale === "fa" ? p.figureFa ?? localDigits(p.figure, "fa") : p.figure
              return (
                <li key={p.slug}>
                  <Reveal delay={i * 0.08}>
                    <Link
                      href={localePath(locale, `/playbooks/${p.slug}`)}
                      className="group grid gap-8 border-t border-v3-line/70 py-12 transition-colors duration-500 hover:border-v3-light/60 md:grid-cols-12 md:items-end"
                    >
                      <div className="flex flex-col gap-5 md:col-span-8">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-v3-mute">
                          <span className="tabular-nums text-v3-light">{localDigits(String(p.number).padStart(2, "0"), locale)}</span>
                          <span>{m.topic}</span>
                          <span>{t.verified(formatReportDate(p.verified, locale))}</span>
                          <span>{t.min(p.readMinutes)}</span>
                        </div>
                        <h2 className="font-v3-display text-4xl font-light leading-tight text-v3-bone transition-colors duration-500 group-hover:text-v3-light md:text-6xl rtl:leading-snug">
                          {m.title} <span className="mt-1 block text-v3-mute">{m.tagline}</span>
                        </h2>
                        <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{m.summary}</p>
                        <p className="max-w-2xl border-s-2 border-v3-light/60 ps-4 leading-relaxed text-v3-bone rtl:leading-loose">
                          <span className="block text-sm text-v3-light">{t.outcome}</span>
                          {m.outcome}
                        </p>
                        <span className="inline-flex items-center gap-3 text-v3-bone">
                          {t.open}
                          <Arrow locale={locale} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 md:col-span-4 md:items-end">
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
