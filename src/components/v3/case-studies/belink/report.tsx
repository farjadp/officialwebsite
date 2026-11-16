// ============================================================================
// File: src/components/v3/case-studies/belink/report.tsx
// Role: The full Belink case study, shown only behind a valid signed link
//       (see /portfolio/belink/report). Aggregates only — see data.ts.
//       Prints cleanly: `.v3-print` swaps the palette to ink-on-paper.
// ============================================================================

import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { Card, Checklist, Headline, Kicker, PageHero, Reveal, Section, V3Button, V3Page } from "@/components/v3/kit"
import { Bars } from "../bars"
import { PrintButton } from "../print-button"
import { COPY } from "./copy"
import { BelinkPanelGallery } from "./gallery"
import { COVERAGE, EMAIL_TYPES, ERAS, SECTORS, SECTOR_FIELDS, TOTAL, YEARS_VALID, pct } from "./data"

function num(n: number, locale: Locale) {
    return new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(n)
}
function percent(n: number, of: number, locale: Locale) {
    const v = pct(n, of)
    return locale === "fa" ? `${num(v, locale)}٪` : `${v}%`
}

export function BelinkCaseStudyReport({ locale }: { locale: Locale }) {
    const t = COPY[locale]
    const r = t.report
    const emailTotal = EMAIL_TYPES.corporate + EMAIL_TYPES.free
    const peakEra = ERAS.reduce((a, b) => (b.n > a.n ? b : a))

    return (
        <V3Page>
            <div className="v3-print">
                <PageHero kicker={t.kicker} title={t.title} accent={t.accent} lead={t.lead} actions={<PrintButton label={r.print} />} />

                <Section kicker={r.problemKicker} title={r.problemTitle}>
                    <div className="grid gap-8 md:grid-cols-2">
                        {r.problem.map((p, i) => (
                            <Reveal key={i} delay={i * 0.08}>
                                <p className="text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{p}</p>
                            </Reveal>
                        ))}
                    </div>
                </Section>

                <Section kicker={r.builtKicker} title={r.builtTitle}>
                    <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        {r.steps.map((s, i) => (
                            <Reveal key={s.title} delay={i * 0.07} className="h-full">
                                <li className="h-full list-none">
                                    <Card tone={i === r.steps.length - 1 ? "lit" : "raised"}>
                                        <span className="font-v3-display text-4xl font-light text-v3-light">{num(i + 1, locale)}</span>
                                        <h3 className="font-v3-display text-2xl font-light">{s.title}</h3>
                                        <p className="text-[15px] leading-relaxed text-v3-soft rtl:leading-loose">{s.body}</p>
                                    </Card>
                                </li>
                            </Reveal>
                        ))}
                    </ol>
                </Section>

                <BelinkPanelGallery locale={locale} />

                <Section kicker={r.dataKicker} title={r.dataTitle} lead={r.dataLead}>
                    <div className="grid gap-x-16 gap-y-16 lg:grid-cols-2">
                        <Reveal className="flex flex-col gap-6">
                            <h3 className="font-v3-display text-2xl font-light md:text-3xl">{r.coverageTitle}</h3>
                            <Bars
                                max={TOTAL}
                                bars={COVERAGE.map((c) => ({
                                    label: r.coverage[c.key],
                                    value: c.n,
                                    display: percent(c.n, TOTAL, locale),
                                    highlight: c.key === "sector",
                                }))}
                            />
                            <p className="text-sm text-v3-mute">
                                {r.of} {num(TOTAL, locale)} {r.companies}
                            </p>
                        </Reveal>

                        <Reveal delay={0.08} className="flex flex-col gap-6">
                            <h3 className="font-v3-display text-2xl font-light md:text-3xl">{r.erasTitle}</h3>
                            <Bars
                                bars={ERAS.map((e) => ({
                                    label: `${num(e.from, locale).replace(/[٬,]/g, "")}–${num(e.to, locale).replace(/[٬,]/g, "")}`,
                                    value: e.n,
                                    display: `${num(e.n, locale)} · ${percent(e.n, YEARS_VALID, locale)}`,
                                    highlight: e === peakEra,
                                }))}
                            />
                            <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{r.erasNote}</p>
                        </Reveal>

                        <Reveal className="flex flex-col gap-6">
                            <h3 className="font-v3-display text-2xl font-light md:text-3xl">{r.sectorsTitle}</h3>
                            <Bars bars={SECTORS.map((s, i) => ({ label: s[locale], value: s.n, display: num(s.n, locale), highlight: i === 0 }))} />
                            <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">
                                {r.sectorsNote.replace("384", num(SECTOR_FIELDS, locale))}
                            </p>
                        </Reveal>

                        <Reveal delay={0.08} className="flex flex-col gap-6">
                            <h3 className="font-v3-display text-2xl font-light md:text-3xl">{r.emailTitle}</h3>
                            <div className="flex h-14 overflow-hidden rounded-xl border border-v3-line/70" role="img" aria-label={`${r.emailCorporate} ${percent(EMAIL_TYPES.corporate, emailTotal, locale)}, ${r.emailFree} ${percent(EMAIL_TYPES.free, emailTotal, locale)}`}>
                                <div className="flex items-center bg-v3-light/90 px-4 text-sm font-semibold text-v3-ink" style={{ width: `${pct(EMAIL_TYPES.corporate, emailTotal, 1)}%` }}>
                                    {percent(EMAIL_TYPES.corporate, emailTotal, locale)}
                                </div>
                                <div className="flex flex-1 items-center justify-end bg-v3-raise px-4 text-sm text-v3-soft">{percent(EMAIL_TYPES.free, emailTotal, locale)}</div>
                            </div>
                            <ul className="flex flex-col gap-2 text-[15px] text-v3-soft">
                                <li className="flex items-center gap-3">
                                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-v3-light" />
                                    {r.emailCorporate} — {num(EMAIL_TYPES.corporate, locale)}
                                </li>
                                <li className="flex items-center gap-3">
                                    <span aria-hidden className="h-2.5 w-2.5 rounded-full border border-v3-soft" />
                                    {r.emailFree} — {num(EMAIL_TYPES.free, locale)}
                                </li>
                            </ul>
                        </Reveal>
                    </div>
                </Section>

                <Section kicker={r.findingsKicker} title={r.findingsTitle}>
                    <div className="grid gap-4 md:grid-cols-2">
                        {r.findings.map((f, i) => (
                            <Reveal key={f.title} delay={i * 0.07} className="h-full">
                                <Card tone="raised">
                                    <h3 className="font-v3-display text-2xl font-light md:text-3xl">{f.title}</h3>
                                    <p className="text-[17px] leading-relaxed text-v3-soft rtl:leading-loose">{f.body}</p>
                                </Card>
                            </Reveal>
                        ))}
                    </div>
                </Section>

                <Section kicker={r.lessonsKicker} title={r.lessonsTitle}>
                    <div className="max-w-4xl">
                        <Checklist items={r.lessons} />
                    </div>
                </Section>

                <Section>
                    <Reveal className="flex max-w-4xl flex-col gap-4">
                        <Kicker>{r.methodKicker}</Kicker>
                        <ul className="flex list-disc flex-col gap-2 ps-5 text-[15px] leading-relaxed text-v3-mute marker:text-v3-line rtl:leading-loose">
                            {r.method.map((m) => (
                                <li key={m}>{m}</li>
                            ))}
                        </ul>
                    </Reveal>
                </Section>

                <section className="relative isolate overflow-hidden print:hidden">
                    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-5 py-24 md:px-10 lg:px-14 lg:py-32">
                        <Reveal>
                            <Headline size="section" accent={r.ctaAccent} className="max-w-5xl">
                                {r.ctaTitle}
                            </Headline>
                        </Reveal>
                        <Reveal delay={0.1} className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                            <p className="max-w-xl text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{r.ctaBody}</p>
                            <V3Button href={localePath(locale, "/booking")} locale={locale}>
                                {r.ctaButton}
                            </V3Button>
                        </Reveal>
                    </div>
                </section>
            </div>
        </V3Page>
    )
}

/** Shown when the link is missing, tampered with or past its 30 days. */
export function BelinkLinkExpired({ locale }: { locale: Locale }) {
    const t = COPY[locale]
    return (
        <V3Page>
            <PageHero
                kicker={t.kicker}
                title={t.expired.title}
                lead={t.expired.body}
                actions={
                    <V3Button href={`${localePath(locale, "/portfolio/belink")}#get`} locale={locale}>
                        {t.expired.button}
                    </V3Button>
                }
            />
        </V3Page>
    )
}
