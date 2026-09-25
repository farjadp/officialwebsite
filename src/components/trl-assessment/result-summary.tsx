"use client";

// ============================================================================
// File Path: src/components/trl-assessment/result-summary.tsx
// Why: The TRL result in v3: the level inside a ring of light, the nine-rung
//      ladder as meters, the gaps to the next level, funding context and the
//      next steps. One accent only — achieved vs not-yet is told by a filled
//      or hollow mark and by the words, never by red/green.
// Env / Identity: Client Component
// ============================================================================

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TrlResult, getTrlContent } from "@/data/trl-assessment/logic";
import { TrlLocale } from "@/data/trl-assessment/config";
import { getTrlUiStrings } from "@/data/trl-assessment/ui";
import { localDigits } from "@/lib/digits";
import { Meter, ResultList, ScoreRing, StepIn, ToolButton } from "@/components/v3/tool-kit";

interface ResultSummaryProps {
    result: TrlResult;
    onReset: () => void;
    locale?: TrlLocale;
}

const LINK_PRIMARY =
    "group inline-flex min-h-12 flex-1 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink sm:flex-none";
const INLINE_LINK =
    "text-v3-light underline decoration-v3-light/40 underline-offset-4 transition-colors hover:text-v3-bone hover:decoration-v3-bone";

export function ResultSummary({ result, onReset, locale = "en" }: ResultSummaryProps) {
    const content = getTrlContent(locale);
    const ui = getTrlUiStrings(locale);
    const isRtl = content.dir === "rtl";
    const CtaArrow = isRtl ? ArrowLeft : ArrowRight;

    return (
        <div dir={content.dir} className="flex flex-col gap-12">

            {/* The level */}
            <StepIn className="flex flex-col items-center gap-6 pt-4 text-center">
                <p className="text-sm text-v3-light">{ui.resultKicker}</p>
                <ScoreRing
                    score={result.trl}
                    max={9}
                    label={<span dir="ltr">{result.trlLabel}</span>}
                    format={(n) => localDigits(n, locale)}
                />
                <h2 className="font-v3-display text-3xl font-light leading-tight text-v3-bone md:text-4xl rtl:leading-snug">
                    {result.levelName}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-v3-mute rtl:leading-loose">
                    {ui.nasaPrefix} {result.nasaDefinition}
                </p>
                <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{result.summarySentence}</p>
            </StepIn>

            {/* The ladder */}
            <StepIn delay={0.1} className="flex flex-col gap-8 rounded-2xl border border-v3-line/80 p-7 md:p-8">
                <h3 className="font-v3-display text-2xl font-light">{ui.ladderTitle}</h3>
                {content.phases.map((phase) => (
                    <div key={phase.id} className="flex flex-col gap-5">
                        <div className="flex items-baseline justify-between gap-4 border-b border-v3-line/60 pb-2">
                            <span className="font-medium text-v3-bone">{phase.title}</span>
                            <span className="text-xs tabular-nums text-v3-mute" dir="ltr">{phase.trlRange}</span>
                        </div>
                        <ol className="flex flex-col gap-5">
                            {phase.levels.map((lvl) => {
                                const lr = result.levelResults[lvl - 1];
                                const isCurrent = lvl === result.trl;
                                return (
                                    <li
                                        key={lvl}
                                        aria-current={isCurrent ? "step" : undefined}
                                        className={`flex items-start gap-4 ${
                                            isCurrent ? "-mx-3 rounded-xl border border-v3-light/60 bg-v3-light/5 px-3 py-3" : ""
                                        }`}
                                    >
                                        <span
                                            aria-hidden
                                            className={`mt-1 grid size-7 shrink-0 place-items-center rounded-full font-v3-display text-sm tabular-nums ${
                                                lr.achieved
                                                    ? "bg-v3-light text-v3-ink shadow-[0_0_12px_rgba(232,196,138,0.6)]"
                                                    : "border border-v3-line text-v3-mute"
                                            }`}
                                        >
                                            {localDigits(lvl, locale)}
                                        </span>
                                        <div className={`min-w-0 flex-1 ${lr.achieved || isCurrent ? "" : "opacity-70"}`}>
                                            <Meter label={lr.name} value={lr.percentage} max={100} display={`${lr.percentage}%`} />
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                ))}
                <p className="text-xs leading-relaxed text-v3-mute rtl:leading-loose">{ui.ladderNote}</p>
            </StepIn>

            <StepIn delay={0.15} className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Gaps at working level */}
                <div className="flex flex-col gap-5 rounded-2xl border border-v3-line/80 p-7 md:p-8">
                    <h3 className="font-v3-display text-2xl font-light">
                        {result.workingLevel ? ui.gapsTitle(result.workingLevel.level) : ui.gapsTitleDone}
                    </h3>
                    {result.workingLevel ? (
                        <>
                            <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                                {ui.gapsIntro(result.workingLevel.name)}
                            </p>
                            <ul className="flex flex-col">
                                {(result.workingLevelGaps.length > 0 ? result.workingLevelGaps : [ui.gapsNone]).map((gap, i) => (
                                    <li key={i} className="flex gap-4 border-b border-v3-line/60 py-3 last:border-b-0">
                                        <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full border border-v3-light" />
                                        <span className="text-sm leading-relaxed text-v3-bone rtl:leading-loose">{gap}</span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{ui.gapsDoneBody}</p>
                    )}
                </div>

                {/* Funding context */}
                <div className="flex flex-col gap-5 rounded-2xl border border-v3-line/80 p-7 md:p-8">
                    <h3 className="font-v3-display text-2xl font-light">{ui.fundingTitle}</h3>
                    <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{result.fundingNote}</p>
                </div>
            </StepIn>

            {/* Recommended next steps */}
            <StepIn delay={0.2} className="flex flex-col gap-8 rounded-3xl border border-v3-line/80 bg-v3-raise p-7 md:p-10">
                <div className="flex flex-col gap-2">
                    <h3 className="font-v3-display text-3xl font-light leading-tight rtl:leading-snug">{ui.nextStepsTitle}</h3>
                    <p className="max-w-2xl leading-relaxed text-v3-soft rtl:leading-loose">{ui.nextStepsSub}</p>
                </div>

                {result.recommendations.length > 0 && (
                    <ol className="flex flex-col">
                        {result.recommendations.map((rec, i) => (
                            <li key={i} className="flex gap-4 border-b border-v3-line/60 py-4 last:border-b-0">
                                <span className="w-6 shrink-0 font-v3-display text-xl leading-none text-v3-light tabular-nums">
                                    {localDigits(i + 1, locale)}
                                </span>
                                <span className="text-sm leading-relaxed text-v3-bone rtl:leading-loose">{rec}</span>
                            </li>
                        ))}
                    </ol>
                )}

                {/* TRL is not the whole picture */}
                <ResultList
                    tone="neutral"
                    title={ui.trlOnlyLead}
                    items={[
                        {
                            body: (
                                <>
                                    {ui.trlOnlyBody}{" "}
                                    <Link href={ui.startupReadinessHref} className={INLINE_LINK}>{ui.trlOnlyStartupLink}</Link>{" "}
                                    {ui.trlOnlyAnd}{" "}
                                    <Link href={ui.investorReadinessHref} className={INLINE_LINK}>{ui.trlOnlyInvestorLink}</Link>.
                                </>
                            ),
                        },
                    ]}
                />

                {/* CTA */}
                <div className="flex flex-col gap-6 border-t border-v3-line/70 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-medium text-v3-bone">{ui.ctaTitle}</h4>
                        <p className="text-sm text-v3-soft">{ui.ctaBody}</p>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <Link href={ui.contactHref} className={LINK_PRIMARY}>
                            {ui.ctaButton}
                            <CtaArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                        </Link>
                        <ToolButton variant="secondary" onClick={onReset} className="whitespace-nowrap">
                            {ui.retake}
                        </ToolButton>
                    </div>
                </div>
            </StepIn>
        </div>
    );
}
