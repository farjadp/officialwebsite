"use client";

import { ReadinessResult } from "@/data/startup-readiness/logic";
import { ReadinessLocale } from "@/data/startup-readiness/config";
import { getReadinessUiStrings } from "@/data/startup-readiness/ui";
import { localePath } from "@/lib/nav";
import { Meter, ResultList, ScoreRing, StepIn, ToolButton } from "@/components/v3/tool-kit";
import Link from "next/link";

interface ResultSummaryProps {
    result: ReadinessResult;
    onReset: () => void;
    locale?: ReadinessLocale;
}

const LINK_BASE =
    "group inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-full px-7 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink sm:flex-none";
const LINK_SECONDARY = `${LINK_BASE} border border-v3-bone/60 font-medium text-v3-bone hover:border-v3-light hover:text-v3-light`;

// One accent for every band: the level is told by its words, not by colour.
export function ResultSummary({ result, onReset, locale = "en" }: ResultSummaryProps) {
    const t = getReadinessUiStrings(locale);
    return (
        <div className="flex flex-col gap-12">

            {/* Header & Main Score */}
            <StepIn className="flex flex-col items-center gap-6 pt-4 text-center">
                <p className="text-sm text-v3-light">{t.resultKicker}</p>
                <ScoreRing locale={locale} score={result.totalScore} max={100} />
                <h2 className="font-v3-display text-3xl font-light leading-tight text-v3-bone md:text-4xl rtl:leading-snug">{result.readinessLevel}</h2>
                <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{result.summarySentence}</p>
            </StepIn>

            {/* Category Breakdown */}
            <StepIn delay={0.1} className="flex flex-col gap-6 rounded-2xl border border-v3-line/80 p-7 md:p-8">
                <h3 className="font-v3-display text-2xl font-light">{t.breakdownTitle}</h3>
                <div className="flex flex-col gap-6">
                    {result.categoryResults.map((cat) => (
                        <Meter
                            locale={locale}
                            key={cat.categoryId}
                            label={cat.title}
                            value={cat.percentage}
                            max={100}
                            display={`${cat.score} / ${cat.maxScore}`}
                        />
                    ))}
                </div>
            </StepIn>

            {/* Strengths & Weaknesses */}
            <StepIn delay={0.15} className="grid grid-cols-1 gap-6">
                <ResultList
                    title={t.strengthsTitle}
                    tone="strength"
                    items={result.strengths.map((str) => ({ title: str.title, body: str.description }))}
                />
                <ResultList
                    title={t.risksTitle}
                    tone="risk"
                    items={result.weaknesses.map((weak) => ({ title: weak.title, body: weak.description }))}
                />
            </StepIn>

            {/* Recommended Next Steps */}
            <StepIn delay={0.2} className="rounded-3xl border border-v3-line/80 bg-v3-raise p-7 md:p-10">
                <h3 className="font-v3-display text-3xl font-light leading-tight rtl:leading-snug">{t.nextStepsTitle}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-v3-soft rtl:leading-loose">{t.nextStepsSub}</p>

                <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-4 rounded-xl border border-v3-line/80 p-5">
                            <span className="shrink-0 font-v3-display text-2xl leading-none text-v3-light">{i + 1}</span>
                            <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{rec}</p>
                        </li>
                    ))}
                </ol>

                {/* CTA Section */}
                <div className="mt-10 flex flex-col gap-6 border-t border-v3-line/80 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h4 className="text-lg font-medium text-v3-bone">{t.ctaTitle}</h4>
                        <p className="mt-1 text-sm text-v3-mute">{t.ctaBody}</p>
                    </div>
                    <div className="flex w-full gap-3 sm:w-auto">
                        <Link href={localePath(locale, "/contact")} className={LINK_SECONDARY}>
                            {t.ctaButton}
                        </Link>
                        <ToolButton variant="primary" className="flex-1 sm:flex-none" onClick={onReset}>
                            {t.retake}
                        </ToolButton>
                    </div>
                </div>
            </StepIn>

        </div>
    );
}
