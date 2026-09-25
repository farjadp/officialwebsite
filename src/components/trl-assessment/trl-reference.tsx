// ============================================================================
// File: src/components/trl-assessment/trl-reference.tsx
// Role: Server-rendered reference for the nine Technology Readiness Levels.
// Why:  src/data/trl-assessment/config{,.fa}.ts hold ~31 KB of researched TRL
//       definitions, but the tool is a client component that starts on an intro
//       screen, so none of it reached the HTML. The page shipped ~150 words and
//       was uncitable: "what does TRL 4 mean" is exactly the question this data
//       answers, and neither search engines nor AI assistants could see it.
//       This is a server component on purpose — no "use client". The v3
//       Reveal / LightRule wrappers are client components rendered as
//       elements (never called), so every word stays in the server HTML.
// ============================================================================

import { trlLevels, trlPhases } from "@/data/trl-assessment/config"
import { trlLevelsFa, trlPhasesFa } from "@/data/trl-assessment/config.fa"
import type { TrlLocale } from "@/data/trl-assessment/config"
import { SITE_URL } from "@/lib/seo"
import { LightRule, Reveal } from "@/components/v3/motion"

const COPY = {
    en: {
        heading: "The nine Technology Readiness Levels",
        lede: "TRL is a 1–9 scale originally defined by NASA and now used by government innovation and funding programs to describe how far a technology has actually been proven. Each level below gives the canonical definition, what it looks like inside a venture, the evidence that level requires, and what it takes to leave it.",
        phasesHeading: "The three phases",
        definitionLabel: "Definition",
        ventureLabel: "What this looks like in a venture",
        evidenceLabel: "Evidence required at this level",
        advanceLabel: "To advance",
        levelWord: "TRL",
    },
    fa: {
        heading: "نه سطح آمادگی فناوری",
        lede: "TRL یک مقیاس ۱ تا ۹ است که در اصل ناسا تعریف کرده و امروز برنامه‌های نوآوری و تأمین مالی دولتی از آن برای توصیف اینکه یک فناوری واقعاً تا کجا اثبات شده استفاده می‌کنند. هر سطح در ادامه، تعریف مرجع، شکل بروز آن در یک کسب‌وکار، شواهدی که آن سطح لازم دارد، و آنچه برای عبور از آن نیاز است را می‌آورد.",
        phasesHeading: "سه فاز",
        definitionLabel: "تعریف",
        ventureLabel: "این در یک کسب‌وکار چه شکلی است",
        evidenceLabel: "شواهد لازم در این سطح",
        advanceLabel: "برای رفتن به سطح بعد",
        levelWord: "TRL",
    },
} as const

export function TrlReference({ locale }: { locale: TrlLocale }) {
    const isFa = locale === "fa"
    const levels = isFa ? trlLevelsFa : trlLevels
    const phases = isFa ? trlPhasesFa : trlPhases
    const t = COPY[locale]
    const path = isFa ? "/fa/tools/trl-assessment" : "/tools/trl-assessment"

    // DefinedTermSet is the honest shape for this: it is a glossary of nine
    // defined terms, not an FAQ and not a product.
    const schema = {
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        "@id": `${SITE_URL}${path}#trl-scale`,
        name: isFa ? "مقیاس سطح آمادگی فناوری (TRL) ۱ تا ۹" : "Technology Readiness Level (TRL) scale, 1–9",
        description: t.lede,
        inLanguage: locale,
        url: `${SITE_URL}${path}`,
        hasDefinedTerm: levels.map((level) => ({
            "@type": "DefinedTerm",
            "@id": `${SITE_URL}${path}#trl-${level.level}`,
            termCode: `TRL ${level.level}`,
            name: `TRL ${level.level} — ${level.name}`,
            description: `${level.nasaDefinition} ${level.startupTranslation}`,
            inDefinedTermSet: `${SITE_URL}${path}#trl-scale`,
        })),
    }

    return (
        <section
            dir={isFa ? "rtl" : "ltr"}
            aria-labelledby="trl-reference-heading"
            className="mt-24 border-t border-v3-line/70 pt-20"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <Reveal className="flex flex-col gap-5">
                <h2
                    id="trl-reference-heading"
                    className="font-v3-display text-4xl font-light leading-[1.05] tracking-[-0.015em] md:text-5xl rtl:leading-[1.4] rtl:tracking-normal"
                >
                    {t.heading}
                </h2>
                <p className="text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.lede}</p>
            </Reveal>

            <Reveal className="mt-14">
                <h3 className="text-sm text-v3-light">{t.phasesHeading}</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {phases.map((phase) => (
                        <div key={phase.id} className="flex flex-col gap-2 rounded-2xl border border-v3-line/80 bg-v3-raise p-5">
                            <div className="text-sm tabular-nums text-v3-light" dir="ltr">
                                {phase.trlRange}
                            </div>
                            <div className="font-v3-display text-xl font-light text-v3-bone">{phase.title}</div>
                            <p className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">{phase.description}</p>
                        </div>
                    ))}
                </div>
            </Reveal>

            <LightRule className="mt-16">
                <ol className="flex flex-col">
                    {levels.map((level) => (
                        <li
                            key={level.level}
                            id={`trl-${level.level}`}
                            className="relative grid scroll-mt-28 grid-cols-[4.5rem_1fr] gap-0 py-8 md:grid-cols-[7.5rem_1fr]"
                        >
                            <span aria-hidden className="whitespace-nowrap pe-4 pt-1 font-v3-display text-lg tabular-nums text-v3-mute md:text-2xl">
                                {t.levelWord} {level.level}
                            </span>
                            <span
                                aria-hidden
                                className="absolute start-[4.5rem] top-[2.85rem] h-2 w-2 -translate-x-1/2 rounded-full bg-v3-ink ring-1 ring-v3-light md:start-[7.5rem] rtl:translate-x-1/2"
                            />
                            <Reveal className="min-w-0 ps-6 md:ps-10">
                                <article>
                                    <h3 className="font-v3-display text-2xl font-light leading-tight text-v3-bone md:text-3xl rtl:leading-snug">
                                        {t.levelWord} {level.level} — {level.name}
                                    </h3>

                                    <dl className="mt-6 flex flex-col gap-5">
                                        <div>
                                            <dt className="text-sm text-v3-light">{t.definitionLabel}</dt>
                                            <dd className="mt-1 leading-relaxed text-v3-soft rtl:leading-loose">
                                                {level.nasaDefinition}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm text-v3-light">{t.ventureLabel}</dt>
                                            <dd className="mt-1 leading-relaxed text-v3-soft rtl:leading-loose">
                                                {level.startupTranslation}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm text-v3-light">{t.evidenceLabel}</dt>
                                            <dd className="mt-2">
                                                <ul className="flex flex-col gap-2">
                                                    {level.criteria.map((criterion) => (
                                                        <li
                                                            key={criterion.id}
                                                            className="relative ps-5 text-sm leading-relaxed text-v3-soft rtl:leading-loose before:absolute before:start-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:border before:border-v3-mute"
                                                        >
                                                            {criterion.text}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm text-v3-light">{t.advanceLabel}</dt>
                                            <dd className="mt-1 leading-relaxed text-v3-soft rtl:leading-loose">
                                                {level.advanceHint}
                                            </dd>
                                        </div>
                                    </dl>
                                </article>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </LightRule>
        </section>
    )
}
