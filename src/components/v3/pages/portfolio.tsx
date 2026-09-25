// ============================================================================
// File Path: src/components/v3/pages/portfolio.tsx
// Why: /portfolio and /fa/portfolio in the v3 "Light" look, one component
//      for both locales so they cannot drift apart. The words are the v2
//      pages' own, carried over as they were; the entries still come from
//      each route's own data.ts. Only the look changed.
//      The interface copy is per-locale (COPY below): hero, field labels,
//      category names and the visibility chip. `category` and `visibility`
//      stay English in both data files because they are keys, not copy.
//      All panels are now rendered on the server (v2 rendered only the active
//      one on the client); ./portfolio-tabs just toggles which is visible.
// Env / Identity: React Server Component; client leaves in ./portfolio-tabs
// ============================================================================

import Link from "next/link"
import type { ReactNode } from "react"
import { Activity, Briefcase, Github, Globe, Lock, Target, Terminal, Zap } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { Arrow, Card, Chip, Headline, LightRule, PageHero, Reveal, V3Page } from "@/components/v3/kit"
import { PortfolioTabs } from "./portfolio-tabs"
import {
  CATEGORIES as CATEGORIES_EN,
  FOUNDER_JOURNEY as JOURNEY_EN,
  PORTFOLIO_ITEMS as ITEMS_EN,
  type PortfolioCategory,
} from "@/app/(public)/portfolio/data"
import {
  CATEGORIES as CATEGORIES_FA,
  FOUNDER_JOURNEY as JOURNEY_FA,
  PORTFOLIO_ITEMS as ITEMS_FA,
} from "@/app/fa/(public)/portfolio/data"

type Copy = {
  kicker: string
  title: string
  accent: string
  lead: string
  role: string
  context: string
  contribution: string
  outcome: string
  source: string
  visit: string
  caseStudy: string
  categories: Record<PortfolioCategory, string>
  visibility: Record<"Public" | "Private", string>
}

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "Systems & Outcomes",
    title: "Selected Works &",
    accent: "Honest Execution",
    lead: "A curated archive of companies launched, systems architected, and technical projects shipped. Zero fluff.",
    role: "Role:",
    context: "The Context",
    contribution: "Contribution",
    outcome: "Outcome",
    source: "Source",
    visit: "Visit",
    caseStudy: "Case Study",
    categories: {
      "My Startups": "My Startups",
      "Companies & Ventures": "Companies & Ventures",
      "GitHub Projects": "GitHub Projects",
    },
    visibility: { Public: "Public", Private: "Private" },
  },
  fa: {
    kicker: "سامانه‌ها و نتیجه‌ها",
    title: "کارهای منتخب و",
    accent: "اجرای صادقانه",
    lead: "آرشیوی گزیده از شرکت‌هایی که راه افتادند، سامانه‌هایی که معماری شدند و پروژه‌های فنی‌ای که به سرانجام رسیدند. بدون حرف اضافه.",
    role: "نقش:",
    context: "زمینه",
    contribution: "مشارکت",
    outcome: "نتیجه",
    source: "کد منبع",
    visit: "مشاهده",
    caseStudy: "بررسی موردی",
    categories: {
      "My Startups": "استارتاپ‌های من",
      "Companies & Ventures": "شرکت‌ها و کسب‌وکارها",
      "GitHub Projects": "پروژه‌های GitHub",
    },
    visibility: { Public: "عمومی", Private: "خصوصی" },
  },
}

const DATA = {
  en: { categories: CATEGORIES_EN, journey: JOURNEY_EN, items: ITEMS_EN },
  fa: { categories: CATEGORIES_FA, journey: JOURNEY_FA, items: ITEMS_FA },
}

const JOURNEY: PortfolioCategory = "My Startups"

function CategoryIcon({ category, className }: { category: PortfolioCategory; className?: string }) {
  switch (category) {
    case "My Startups":
      return <Activity className={className} aria-hidden />
    case "GitHub Projects":
      return <Terminal className={className} aria-hidden />
    default:
      return <Briefcase className={className} aria-hidden />
  }
}

/** One labelled block inside a project card: context, contribution, outcome. */
function Note({ icon, label, children, lit = false }: { icon: ReactNode; label: string; children: ReactNode; lit?: boolean }) {
  return (
    <div className={`flex flex-col gap-2 border-s pt-0.5 ps-4 ${lit ? "border-v3-light/60" : "border-v3-line"}`}>
      <p className={`flex items-center gap-2 text-xs font-medium ${lit ? "text-v3-light" : "text-v3-mute"}`}>
        {icon}
        {label}
      </p>
      <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{children}</p>
    </div>
  )
}

const ICON_LINK =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-v3-line px-4 text-sm text-v3-soft transition-colors duration-300 hover:border-v3-light/60 hover:text-v3-light"

export function PortfolioIndex({ locale }: { locale: Locale }) {
  const t = COPY[locale]
  const { categories, journey, items } = DATA[locale]

  // As v2: the founder journey always shows; other categories only when
  // they have entries.
  const shown = categories.filter((c) => c === JOURNEY || items.some((i) => i.category === c))

  const panels = shown.map((category) => (
    <section key={category}>
      <div className="mb-12 flex items-center gap-4 border-b border-v3-line/70 pb-6">
        <span className="rounded-xl border border-v3-line bg-v3-raise p-3">
          <CategoryIcon category={category} className="h-6 w-6 text-v3-light" />
        </span>
        <Headline as="h2" size="section" className="md:text-5xl">
          {t.categories[category]}
        </Headline>
      </div>

      {category === JOURNEY ? (
        <LightRule>
          <ol className="flex flex-col">
            {journey.map((s) => {
              const dot =
                s.status === "Active"
                  ? "bg-v3-light shadow-[0_0_12px_rgba(232,196,138,0.8)]"
                  : s.status === "Dead" || s.status === "Done"
                    ? "bg-v3-ink ring-1 ring-v3-mute"
                    : "bg-v3-bone"
              return (
                <li
                  key={s.name}
                  className="group relative grid grid-cols-[4.5rem_1fr] gap-6 py-8 md:grid-cols-[7.5rem_1fr] md:gap-10"
                >
                  <span className="text-sm tabular-nums text-v3-mute md:font-v3-display md:text-lg">
                    <span dir={locale === "fa" ? undefined : "ltr"}>{s.years}</span>
                  </span>
                  <span
                    aria-hidden
                    className={`absolute start-[4.5rem] top-[2.6rem] h-2.5 w-2.5 -translate-x-1/2 rounded-full md:start-[7.5rem] rtl:translate-x-1/2 ${dot}`}
                  />
                  <Reveal className="flex flex-col gap-4 ps-6 md:ps-10">
                    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-baseline md:gap-4">
                      <Headline as="h3" size="card">
                        {s.name}
                      </Headline>
                      <Chip
                        className={`self-start ${
                          s.status === "Active"
                            ? "border-v3-light/50 text-v3-light"
                            : s.status === "Dead"
                              ? "text-v3-mute"
                              : "border-v3-bone/40 text-v3-bone"
                        }`}
                      >
                        {s.statusLabel}
                      </Chip>
                    </div>
                    <p className="text-sm text-v3-soft">
                      {s.role}
                      <span className="mx-2 text-v3-line">/</span>
                      <span className="text-v3-mute">{s.years}</span>
                    </p>
                    <div className="flex max-w-2xl flex-col gap-4 rounded-2xl border border-v3-line/70 p-6 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:border-v3-light/40 group-hover:bg-v3-raise">
                      {s.description.map((p) => (
                        <p key={p} className="leading-relaxed text-v3-soft rtl:leading-loose">
                          {p}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                </li>
              )
            })}
          </ol>
        </LightRule>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {items
            .filter((item) => item.category === category)
            .map((item, i) => (
              <Reveal key={item.id} delay={(i % 2) * 0.08}>
                <Card
                  tone="raised"
                  className="gap-6 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-3">
                      <Headline as="h3" size="card">
                        {item.title}
                      </Headline>
                      <span className="self-start text-sm text-v3-light">
                        {t.role} {item.role}
                      </span>
                    </div>
                    {item.visibility && (
                      <Chip className={`shrink-0 gap-1.5 ${item.visibility === "Private" ? "text-v3-mute" : ""}`}>
                        {item.visibility === "Private" && <Lock className="h-3 w-3" aria-hidden />}
                        {t.visibility[item.visibility]}
                      </Chip>
                    )}
                  </div>

                  <p className="leading-relaxed text-v3-soft rtl:leading-loose">{item.summary}</p>

                  {(item.problem || item.contribution || item.outcome) && (
                    <div className="flex flex-col gap-5">
                      {item.problem && (
                        <Note icon={<Target className="h-3 w-3" aria-hidden />} label={t.context}>
                          {item.problem}
                        </Note>
                      )}
                      {item.contribution && (
                        <Note icon={<Activity className="h-3 w-3" aria-hidden />} label={t.contribution}>
                          {item.contribution}
                        </Note>
                      )}
                      {item.outcome && (
                        <Note icon={<Zap className="h-3 w-3" aria-hidden />} label={t.outcome} lit>
                          {item.outcome}
                        </Note>
                      )}
                    </div>
                  )}

                  <div className="mt-auto flex flex-col gap-5 border-t border-v3-line/70 pt-6">
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <Chip key={tag} className="text-xs text-v3-mute">
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.github && (
                        <a href={item.github} target="_blank" rel="noopener noreferrer" className={ICON_LINK}>
                          <Github className="h-4 w-4" aria-hidden />
                          {t.source}
                        </a>
                      )}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className={ICON_LINK}>
                          <Globe className="h-4 w-4" aria-hidden />
                          {t.visit}
                        </a>
                      )}
                      <Link
                        href={localePath(locale, `/portfolio/${item.id}`)}
                        className="group/cs ms-auto inline-flex min-h-10 items-center gap-2 rounded-full bg-v3-bone px-5 text-sm font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light"
                      >
                        {t.caseStudy}
                        <Arrow
                          locale={locale}
                          className="h-4 w-4 transition-transform duration-300 group-hover/cs:translate-x-1 rtl:group-hover/cs:-translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
        </div>
      )}
    </section>
  ))

  return (
    <V3Page>
      <PageHero kicker={t.kicker} title={t.title} accent={t.accent} lead={t.lead} />
      <div className="mx-auto w-full max-w-[1600px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
        <PortfolioTabs labels={shown.map((c) => t.categories[c])} panels={panels} />
      </div>
    </V3Page>
  )
}
