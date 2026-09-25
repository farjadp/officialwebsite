// ============================================================================
// File Path: src/components/v3/pages/service-detail.tsx
// Why: The generic service page (/services/[slug] and /fa/services/[slug],
//      e.g. /services/private-mentorship) in the v3 "Light" look. One
//      component for both locales; the service itself comes from each
//      locale's services/data.ts, the page chrome from COPY below, carried
//      over word for word from the v2 files.
//      Also home of BackLink, the "Back to Services" link shared with the
//      other service pages.
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { ServiceCta } from "@/components/public/service-cta"
import { Arrow, Card, Checklist, Chip, Headline, PageHero, Reveal, Section, V3Page } from "@/components/v3/kit"

export type ServiceData = {
  id: string
  title: string
  for: string
  icon: LucideIcon
  isLimited?: boolean
  whatYouGet: string[]
  outcomes: string[]
}

const COPY: Record<Locale, { back: string; limited: string; whatYouGet: string; outcomes: string }> = {
  en: {
    back: "Back to Services",
    limited: "Limited Availability",
    whatYouGet: "What You Get",
    outcomes: "Direct Outcomes",
  },
  fa: {
    back: "بازگشت به خدمات",
    limited: "ظرفیت محدود",
    whatYouGet: "چه چیزی می‌گیرید",
    outcomes: "نتیجه‌ی مستقیم",
  },
}

/** "Back to Services", sitting above the hero. The arrow points backwards in either direction. */
export function BackLink({ locale, label }: { locale: Locale; label: string }) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-5 pt-10 md:px-10 lg:px-14">
      <Link
        href={localePath(locale, "/services")}
        className="group inline-flex min-h-11 items-center gap-2 text-sm text-v3-mute transition-colors duration-300 hover:text-v3-light"
      >
        <Arrow
          locale={locale}
          className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
        />
        {label}
      </Link>
    </div>
  )
}

export function ServiceDetail({ locale, service }: { locale: Locale; service: ServiceData }) {
  const t = COPY[locale]
  const Icon = service.icon

  return (
    <V3Page>
      <BackLink locale={locale} label={t.back} />

      <PageHero
        kicker={
          <span className="inline-flex items-center gap-3">
            <Icon className="h-6 w-6" aria-hidden />
            {service.isLimited && <Chip className="border-v3-light/50 text-v3-light">{t.limited}</Chip>}
          </span>
        }
        title={service.title}
        lead={service.for}
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Card>
              <div className="border-b border-v3-line/70 pb-5">
                <Headline as="h2" size="card">
                  {t.whatYouGet}
                </Headline>
              </div>
              <Checklist items={service.whatYouGet} />
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card tone="lit">
              <div className="flex flex-col gap-5 border-b border-v3-line/70 pb-5">
                <Headline as="h2" size="card">
                  {t.outcomes}
                </Headline>
                <span aria-hidden className="h-px w-12 bg-v3-light" />
              </div>
              <Checklist items={service.outcomes} />
            </Card>
          </Reveal>
        </div>
      </Section>

      <ServiceCta locale={locale} />
    </V3Page>
  )
}
