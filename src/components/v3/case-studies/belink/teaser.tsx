// ============================================================================
// File: src/components/v3/case-studies/belink/teaser.tsx
// Role: The public page of the Belink case study (/portfolio/belink and
//       /fa/portfolio/belink): what it is, three headline figures, what the
//       full study contains, and the email gate. The full study is reachable
//       only through the signed link the gate emails.
// ============================================================================

import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { Arrow, Card, Checklist, CountUp, Kicker, PageHero, Reveal, Section, V3Page } from "@/components/v3/kit"
import Link from "next/link"
import { CaseStudyGateForm } from "../gate-form"
import { COPY } from "./copy"
import { BelinkPanelGallery } from "./gallery"

export function BelinkCaseStudyTeaser({ locale }: { locale: Locale }) {
    const t = COPY[locale]
    return (
        <V3Page>
            <PageHero
                kicker={
                    <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <Link href={localePath(locale, "/portfolio")} className="group inline-flex items-center gap-2 text-v3-mute transition-colors hover:text-v3-light">
                            <Arrow locale={locale} className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5" />
                            {t.teaser.backToPortfolio}
                        </Link>
                        <span aria-hidden className="text-v3-line">/</span>
                        {t.kicker}
                    </span>
                }
                title={t.title}
                accent={t.accent}
                lead={t.lead}
            />

            <section className="border-b border-v3-line/70">
                <div className="mx-auto grid w-full max-w-[1600px] gap-px px-5 py-14 sm:grid-cols-3 md:px-10 md:py-20 lg:px-14">
                    {t.teaser.stats.map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.08} className="flex flex-col gap-3 border-v3-line/70 py-6 sm:border-s sm:px-8 sm:first:border-s-0 sm:first:ps-0">
                            <span className="font-v3-display text-5xl font-light text-v3-bone md:text-6xl">
                                <CountUp to={s.value} locale={locale} />
                                {s.suffix && <span className="text-v3-light">{s.suffix}</span>}
                            </span>
                            <span className="max-w-xs text-base leading-relaxed text-v3-soft rtl:leading-loose">{s.label}</span>
                        </Reveal>
                    ))}
                </div>
            </section>

            <BelinkPanelGallery locale={locale} compact />

            <Section id="get" bordered={false}>
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                    <Reveal className="flex flex-col gap-6 lg:col-span-6">
                        <Kicker>{t.teaser.insideKicker}</Kicker>
                        <h2 className="font-v3-display text-4xl font-light leading-tight md:text-5xl rtl:leading-snug">{t.teaser.insideTitle}</h2>
                        <Checklist items={t.teaser.inside} />
                        <Card tone="plain" className="mt-2 h-auto">
                            <p className="text-[15px] leading-relaxed text-v3-mute rtl:leading-loose">{t.teaser.privacy}</p>
                        </Card>
                    </Reveal>
                    <Reveal delay={0.1} className="flex flex-col gap-6 lg:col-span-6">
                        <Kicker>{t.form.kicker}</Kicker>
                        <h2 className="font-v3-display text-4xl font-light leading-tight md:text-5xl rtl:leading-snug">{t.form.title}</h2>
                        <p className="max-w-xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.form.body}</p>
                        <div className="relative">
                            <CaseStudyGateForm slug="belink" locale={locale} t={t.form} />
                        </div>
                    </Reveal>
                </div>
            </Section>
        </V3Page>
    )
}
