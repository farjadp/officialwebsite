// ============================================================================
// File Path: src/lib/reports.ts
// Why: The register of published reports, for /reports and /fa/reports.
//      A plain data module (no React) so the sitemap, the nav and the route
//      pages can all read it. Every report exists in both locales.
//
//      To publish a report: add an entry here, add its component to
//      components/v3/reports/registry.tsx under the same slug. The index,
//      both routes, the sitemap and the language switcher pick it up.
// ============================================================================

import type { Locale } from "@/lib/nav"

export type ReportMeta = {
  slug: string
  /** Running number shown on the index: 01, 02, … */
  number: number
  /** Publication date, ISO. */
  published: string
  /** Date the figures were taken, ISO. */
  dataAsOf: string
  /** Set when a published report is corrected, so lastmod and dateModified move. */
  updated?: string
  readMinutes: number
  /** The one number the report is about, shown large on the index. */
  figure: string
  /** The Persian figure, when a digit swap of `figure` would read badly ("۵۰۰M"). */
  figureFa?: string
  copy: Record<Locale, { title: string; tagline: string; summary: string; topic: string; figureLabel: string }>
}

export const REPORTS: ReportMeta[] = [
  {
    slug: "eight-stocks-twenty-economies",
    number: 1,
    published: "2026-09-27",
    dataAsOf: "2026-09-25",
    readMinutes: 6,
    figure: "$25.7T",
    copy: {
      en: {
        title: "Eight Stocks, Twenty Economies",
        tagline: "Where does America stand?",
        summary:
          "Eight US tech companies are worth $25.7 trillion. Put that number next to Europe's economies and see what it says about capital, AI and expectations.",
        topic: "AI economy",
        figureLabel: "8 companies, one market value",
      },
      fa: {
        title: "آمریکا کجای دنیا ایستاده؟",
        tagline: "۸ سهم، ۲۰ اقتصاد",
        summary:
          "ارزش بازار ۸ شرکت تکنولوژی آمریکایی ۲۵٫۷ تریلیون دلار است؛ بیشتر از GDP سالانه‌ی کل اتحادیه‌ی اروپا. این عدد کنار اقتصاد ۲۰ کشور اروپایی.",
        topic: "اقتصاد هوش مصنوعی",
        figureLabel: "۸ شرکت، یک ارزش بازار",
      },
    },
  },
  {
    slug: "deep-time-pain",
    number: 2,
    published: "2026-10-03",
    dataAsOf: "2026-10-03",
    updated: "2026-10-04",
    readMinutes: 10,
    figure: "500M",
    figureFa: "۵۰۰",
    copy: {
      en: {
        title: "A Body That Postpones Pain",
        tagline: "500 million years of the stress response",
        summary:
          "The vertebrate stress axis is more than 500 million years old, and lampreys still run a version of it. Fossils of people who lived for years after crushing injuries point to something more.",
        topic: "Evolutionary biology",
        figureLabel: "years, at least, of the vertebrate stress axis",
      },
      fa: {
        title: "بدنی که درد را عقب می‌اندازد",
        tagline: "۵۰۰ میلیون سال واکنش استرس",
        summary:
          "محور استرس مهره‌داران بیش از ۵۰۰ میلیون سال قدمت دارد و لامپری‌ها هنوز نسخه‌ای از آن را دارند. فسیل انسان‌تبارهایی که سال‌ها با آسیب سنگین زنده ماندند، چیز بیشتری می‌گوید.",
        topic: "زیست‌شناسی تکاملی",
        figureLabel: "میلیون سال، دست‌کم؛ قدمت محور استرس مهره‌داران",
      },
    },
  },
]

export function getReport(slug: string): ReportMeta | undefined {
  return REPORTS.find((r) => r.slug === slug)
}

/** The day a report last changed: its correction date, else its publication. */
export function reportModified(r: ReportMeta): string {
  return r.updated ?? r.published
}

/** Newest first. */
export function reportsByDate(): ReportMeta[] {
  return [...REPORTS].sort((a, b) => b.published.localeCompare(a.published))
}

export function formatReportDate(iso: string, locale: Locale): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale === "fa" ? "fa-IR-u-ca-gregory" : "en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}
