// ============================================================================
// File Path: src/components/v3/reports/colophon.tsx
// Why: The byline, contact links, copyright and share row that close every
//      report. One copy, so the rights line cannot drift between reports.
// Env / Identity: React Server Component (ShareBar inside it is a client one)
// ============================================================================

import type { ReactNode } from "react"
import type { Locale } from "@/lib/nav"
import { localePath } from "@/lib/nav"
import { absoluteUrl } from "@/lib/seo"
import { V3Button } from "@/components/v3/kit"
import { ShareBar } from "./share-bar"

const LINKS: [string, string][] = [
  ["farjadp.info", "https://www.farjadp.info"],
  ["LinkedIn", "https://www.linkedin.com/in/farjadpourmohammad"],
  ["Telegram", "https://t.me/FarjadTalks"],
  ["Instagram", "https://instagram.com/FarjadTalks"],
  ["YouTube", "https://youtube.com/@FarjadTalks"],
]

const COPY = {
  en: {
    by: "Research and analysis",
    name: "Farjad",
    bio: "AI strategist, startup mentor and business coach, based in Toronto.",
    rights:
      "© 2026 Farjad (FarjadTalks). All rights reserved. You may quote or republish with credit and a link to this page.",
    back: "All reports",
  },
  fa: {
    by: "تهیه و تحلیل",
    name: "فرجاد",
    bio: "استراتژیست هوش مصنوعی، منتور استارتاپ و کوچ کسب‌وکار، ساکن تورنتو.",
    rights:
      "© ۲۰۲۶ فرجاد (FarjadTalks). همه‌ی حقوق محفوظ است. نقل و بازنشر با ذکر نام و لینک همین صفحه آزاد است.",
    back: "همه‌ی گزارش‌ها",
  },
}

export function ReportColophon({
  locale,
  path,
  shareTitle,
  disclaimer,
  action,
}: {
  locale: Locale
  /** The report's own path, without a locale prefix: "/reports/<slug>". */
  path: string
  shareTitle: string
  /** The one line that says what this particular report is and is not. */
  disclaimer: string
  action: ReactNode
}) {
  const t = COPY[locale]
  return (
    <footer className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-5 py-20 md:px-10 md:py-24 lg:px-14">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-v3-mute">{t.by}</span>
          <span className="font-v3-display text-4xl text-v3-bone">{t.name}</span>
          <span className="text-v3-soft">{t.bio}</span>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-v3-soft" dir="ltr">
            {LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-v3-line underline-offset-4 transition-colors hover:text-v3-light hover:decoration-v3-light"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <ShareBar locale={locale} url={absoluteUrl(localePath(locale, path))} title={shareTitle} />
      </div>
      <p className="border-t border-v3-line/70 pt-6 text-sm leading-relaxed text-v3-mute rtl:leading-loose">
        {t.rights} {disclaimer}
      </p>
      <div className="flex flex-wrap gap-3">
        <V3Button href={localePath(locale, "/reports")} variant="secondary" locale={locale}>
          {t.back}
        </V3Button>
        {action}
      </div>
    </footer>
  )
}
