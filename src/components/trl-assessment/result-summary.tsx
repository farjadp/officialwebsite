import { TrlResult, getTrlContent } from "@/data/trl-assessment/logic";
import { TrlLocale } from "@/data/trl-assessment/config";
import { getTrlUiStrings } from "@/data/trl-assessment/ui";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Landmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ResultSummaryProps {
    result: TrlResult;
    onReset: () => void;
    locale?: TrlLocale;
}

export function ResultSummary({ result, onReset, locale = "en" }: ResultSummaryProps) {
    const content = getTrlContent(locale);
    const ui = getTrlUiStrings(locale);
    const isRtl = content.dir === "rtl";
    const CtaArrow = isRtl ? ArrowLeft : ArrowRight;

    return (
        <div dir={content.dir} className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Hero: TRL Badge on brand green */}
            <div className="relative overflow-hidden text-center p-8 sm:p-14 rounded-3xl bg-[#0F3F35] text-white">
                <div className="absolute -top-16 -end-16 w-56 h-56 rounded-full bg-white/5" />
                <div className="absolute -bottom-24 -start-16 w-72 h-72 rounded-full bg-[#D97706]/10" />
                <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D97706] mb-4">{ui.resultKicker}</p>
                    <div className="flex items-end justify-center gap-2 mb-4">
                        <span className="font-serif text-6xl sm:text-8xl tracking-tight text-white">
                            {result.trlLabel}
                        </span>
                        {result.trl > 0 && (
                            <span className="text-2xl sm:text-3xl font-medium text-white/40 mb-2 sm:mb-3">{ui.outOfNine}</span>
                        )}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{result.levelName}</h2>
                    <p className="text-sm text-white/50 italic max-w-2xl mx-auto mb-5">{ui.nasaPrefix} {result.nasaDefinition}</p>
                    <p className="text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">{result.summarySentence}</p>
                </div>
            </div>

            {/* TRL Ladder */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8">
                <h3 className="font-serif text-2xl text-[#0F3F35] mb-1">{ui.ladderTitle}</h3>
                <div className="w-8 h-1 bg-[#D97706] mb-6" />
                <div className="space-y-6">
                    {content.phases.map((phase) => (
                        <div key={phase.id}>
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="font-semibold text-[#1C1917]">{phase.title}</span>
                                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">{phase.trlRange}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {phase.levels.map((lvl) => {
                                    const lr = result.levelResults[lvl - 1];
                                    const isCurrent = lvl === result.trl;
                                    return (
                                        <div
                                            key={lvl}
                                            className={cn(
                                                "rounded-xl border p-3 text-center transition-all",
                                                isCurrent
                                                    ? "border-[#D97706] bg-[#D97706]/10 ring-2 ring-[#D97706]/30"
                                                    : lr.achieved
                                                        ? "border-[#0F3F35]/20 bg-[#0F3F35]/5"
                                                        : "border-stone-100 bg-stone-50 opacity-60"
                                            )}
                                        >
                                            <div className={cn(
                                                "text-lg font-bold",
                                                isCurrent ? "text-[#B45309]" : lr.achieved ? "text-[#0F3F35]" : "text-stone-400"
                                            )}>
                                                {lvl}
                                            </div>
                                            <div className="text-[11px] leading-tight text-stone-500 mt-1">{lr.name}</div>
                                            <div className="text-[10px] font-mono text-stone-400 mt-1">{lr.percentage}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-stone-400 mt-5 leading-relaxed">{ui.ladderNote}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Gaps at working level */}
                <div className="bg-[#D97706]/5 rounded-3xl border border-[#D97706]/20 p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-[#D97706]" />
                        <h3 className="text-xl font-bold text-[#1C1917]">
                            {result.workingLevel ? ui.gapsTitle(result.workingLevel.level) : ui.gapsTitleDone}
                        </h3>
                    </div>
                    {result.workingLevel ? (
                        <>
                            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                                {ui.gapsIntro(result.workingLevel.name)}
                            </p>
                            <ul className="space-y-3">
                                {(result.workingLevelGaps.length > 0 ? result.workingLevelGaps : [ui.gapsNone]).map((gap, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-700 leading-relaxed">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                                        {gap}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-sm text-stone-600 leading-relaxed">{ui.gapsDoneBody}</p>
                    )}
                </div>

                {/* Funding context */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Landmark className="w-5 h-5 text-[#0F3F35]" />
                        <h3 className="text-xl font-bold text-[#1C1917]">{ui.fundingTitle}</h3>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{result.fundingNote}</p>
                </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="bg-[#0F3F35] rounded-3xl p-8 sm:p-12 text-white shadow-xl">
                <h3 className="font-serif text-3xl mb-2">{ui.nextStepsTitle}</h3>
                <p className="text-white/60 mb-8 max-w-2xl leading-relaxed">{ui.nextStepsSub}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {result.recommendations.map((rec, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4">
                            <div className="bg-[#D97706] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">
                                {i + 1}
                            </div>
                            <p className="text-white/85 text-sm leading-relaxed">{rec}</p>
                        </div>
                    ))}
                </div>

                {/* TRL is not the whole picture */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-10 flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                    <div className="text-sm text-white/75 leading-relaxed">
                        <span className="font-semibold text-white">{ui.trlOnlyLead}</span>{" "}
                        {ui.trlOnlyBody}{" "}
                        <Link href={ui.startupReadinessHref} className="underline text-[#D97706] hover:text-white transition-colors">{ui.trlOnlyStartupLink}</Link>{" "}
                        {ui.trlOnlyAnd}{" "}
                        <Link href={ui.investorReadinessHref} className="underline text-[#D97706] hover:text-white transition-colors">{ui.trlOnlyInvestorLink}</Link>.
                    </div>
                </div>

                {/* CTA Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
                    <div>
                        <h4 className="text-lg font-bold mb-1">{ui.ctaTitle}</h4>
                        <p className="text-sm text-white/60">{ui.ctaBody}</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link
                            href={ui.contactHref}
                            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[#0F3F35] font-bold hover:bg-stone-100 transition-colors flex-1 sm:flex-none"
                        >
                            {ui.ctaButton}
                            <CtaArrow className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={onReset}
                            className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#D97706] text-white font-bold hover:bg-[#B45309] transition-colors flex-1 sm:flex-none"
                        >
                            {ui.retake}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
