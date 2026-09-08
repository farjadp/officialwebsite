// ============================================================================
// File: src/components/trl-assessment/trl-reference.tsx
// Role: Server-rendered reference for the nine Technology Readiness Levels.
// Why:  src/data/trl-assessment/config{,.fa}.ts hold ~31 KB of researched TRL
//       definitions, but the tool is a client component that starts on an intro
//       screen, so none of it reached the HTML. The page shipped ~150 words and
//       was uncitable: "what does TRL 4 mean" is exactly the question this data
//       answers, and neither search engines nor AI assistants could see it.
//       This is a server component on purpose — no "use client".
// ============================================================================

import { trlLevels, trlPhases } from "@/data/trl-assessment/config"
import { trlLevelsFa, trlPhasesFa } from "@/data/trl-assessment/config.fa"
import type { TrlLocale } from "@/data/trl-assessment/config"
import { SITE_URL } from "@/lib/seo"

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
            className="mx-auto mt-24 max-w-3xl border-t border-stone-200 pt-16"
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />

            <h2
                id="trl-reference-heading"
                className="font-serif text-3xl leading-tight text-[#0F3F35] sm:text-4xl"
            >
                {t.heading}
            </h2>
            <p className="mt-5 text-base leading-[1.9] text-stone-600">{t.lede}</p>

            <h3 className="mt-14 font-mono text-xs uppercase tracking-[0.2em] text-[#D97706]">
                {t.phasesHeading}
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {phases.map((phase) => (
                    <div key={phase.id} className="rounded-2xl border border-stone-200 bg-white p-5">
                        <div className="font-mono text-xs uppercase tracking-widest text-[#D97706]">
                            {phase.trlRange}
                        </div>
                        <div className="mt-2 font-bold text-[#0F3F35]">{phase.title}</div>
                        <p className="mt-2 text-xs leading-relaxed text-stone-500">{phase.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-14 space-y-12">
                {levels.map((level) => (
                    <article key={level.level} id={`trl-${level.level}`} className="scroll-mt-24">
                        <h3 className="font-serif text-2xl text-[#0F3F35]">
                            {t.levelWord} {level.level} — {level.name}
                        </h3>

                        <dl className="mt-4 space-y-4">
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                                    {t.definitionLabel}
                                </dt>
                                <dd className="mt-1 text-base leading-[1.9] text-stone-700">
                                    {level.nasaDefinition}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                                    {t.ventureLabel}
                                </dt>
                                <dd className="mt-1 text-base leading-[1.9] text-stone-700">
                                    {level.startupTranslation}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                                    {t.evidenceLabel}
                                </dt>
                                <dd className="mt-2">
                                    <ul className="space-y-2">
                                        {level.criteria.map((criterion) => (
                                            <li
                                                key={criterion.id}
                                                className="relative ps-5 text-sm leading-[1.8] text-stone-600 before:absolute before:start-0 before:top-[0.75em] before:h-1 before:w-1 before:rounded-full before:bg-[#0F3F35]/40"
                                            >
                                                {criterion.text}
                                            </li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                                    {t.advanceLabel}
                                </dt>
                                <dd className="mt-1 text-base leading-[1.9] text-stone-700">
                                    {level.advanceHint}
                                </dd>
                            </div>
                        </dl>
                    </article>
                ))}
            </div>
        </section>
    )
}
