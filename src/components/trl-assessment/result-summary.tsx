import { TrlResult } from "@/data/trl-assessment/logic";
import { trlPhases } from "@/data/trl-assessment/config";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Landmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ResultSummaryProps {
    result: TrlResult;
    onReset: () => void;
}

export function ResultSummary({ result, onReset }: ResultSummaryProps) {
    let scoreColorClass = "text-indigo-600";
    let bgScoreClass = "bg-indigo-50 border-indigo-100";

    if (result.trl >= 7) {
        scoreColorClass = "text-emerald-600";
        bgScoreClass = "bg-emerald-50 border-emerald-100";
    } else if (result.trl <= 3) {
        scoreColorClass = "text-amber-600";
        bgScoreClass = "bg-amber-50 border-amber-100";
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header & TRL Badge */}
            <div className={cn("text-center p-8 sm:p-12 rounded-3xl border-2", bgScoreClass)}>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Your Technology Readiness Level</p>
                <div className="flex items-end justify-center gap-2 mb-4">
                    <span className={cn("text-6xl sm:text-8xl font-bold tracking-tight", scoreColorClass)}>
                        {result.trlLabel}
                    </span>
                    {result.trl > 0 && (
                        <span className="text-2xl sm:text-3xl font-medium text-slate-400 mb-2 sm:mb-4">/ 9</span>
                    )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">{result.levelName}</h2>
                <p className="text-sm text-slate-500 italic max-w-2xl mx-auto mb-4">NASA definition: {result.nasaDefinition}</p>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">{result.summarySentence}</p>
            </div>

            {/* TRL Ladder */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6">The TRL Ladder</h3>
                <div className="space-y-6">
                    {trlPhases.map((phase) => (
                        <div key={phase.id}>
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="font-semibold text-slate-700">{phase.title}</span>
                                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{phase.trlRange}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {phase.levels.map((lvl) => {
                                    const lr = result.levelResults[lvl - 1];
                                    const isCurrent = lvl === result.trl;
                                    return (
                                        <div
                                            key={lvl}
                                            className={cn(
                                                "rounded-lg border p-3 text-center transition-all",
                                                isCurrent
                                                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                                    : lr.achieved
                                                        ? "border-emerald-200 bg-emerald-50"
                                                        : "border-slate-100 bg-slate-50 opacity-70"
                                            )}
                                        >
                                            <div className={cn(
                                                "text-lg font-bold",
                                                isCurrent ? "text-primary" : lr.achieved ? "text-emerald-600" : "text-slate-400"
                                            )}>
                                                {lvl}
                                            </div>
                                            <div className="text-[11px] leading-tight text-slate-500 mt-1">{lr.name}</div>
                                            <div className="text-[10px] font-mono text-slate-400 mt-1">{lr.percentage}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">
                    TRL is a ladder: your level is the highest one where every lower level&apos;s evidence is substantially in place. Evidence claimed above an unmet level doesn&apos;t count yet.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Gaps at working level */}
                <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-6 sm:p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <h3 className="text-xl font-bold text-slate-800">
                            {result.workingLevel ? `Gaps to TRL ${result.workingLevel.level}` : "No Gaps Remaining"}
                        </h3>
                    </div>
                    {result.workingLevel ? (
                        <>
                            <p className="text-sm text-slate-600 mb-4">
                                To reach <span className="font-semibold">{result.workingLevel.name}</span>, this evidence is still missing or incomplete:
                            </p>
                            <ul className="space-y-3">
                                {(result.workingLevelGaps.length > 0 ? result.workingLevelGaps : ["All criteria are close — tighten the evidence at your lower levels to pass the gate."]).map((gap, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                        {gap}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-sm text-slate-600">
                            Your technology is proven in operations. The remaining risks are commercial, not technical.
                        </p>
                    )}
                </div>

                {/* Funding context */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Landmark className="w-5 h-5 text-slate-500" />
                        <h3 className="text-xl font-bold text-slate-800">Funding Context</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{result.fundingNote}</p>
                </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-2">Recommended Next Steps</h3>
                <p className="text-slate-400 mb-8 max-w-2xl">The fastest way up the ladder is closing the evidence gaps at your working level.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {result.recommendations.map((rec, i) => (
                        <div key={i} className="bg-white/10 border border-white/10 rounded-xl p-5 flex items-start gap-4">
                            <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                                {i + 1}
                            </div>
                            <p className="text-slate-200 text-sm leading-relaxed">{rec}</p>
                        </div>
                    ))}
                </div>

                {/* TRL is not the whole picture */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-10 flex items-start gap-4">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300 leading-relaxed">
                        <span className="font-semibold text-white">TRL measures technology maturity only.</span>{" "}
                        Research on startup readiness shows technology, market, and investment maturity move independently — check the other two with the{" "}
                        <Link href="/tools/startup-readiness" className="underline text-primary hover:text-white transition-colors">Startup Readiness Score</Link>{" "}
                        and the{" "}
                        <Link href="/tools/investor-readiness" className="underline text-primary hover:text-white transition-colors">Investor Readiness Score</Link>.
                    </div>
                </div>

                {/* CTA Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
                    <div>
                        <h4 className="text-lg font-bold mb-1">Want a technology-to-market roadmap?</h4>
                        <p className="text-sm text-slate-400">Book a strategy session to plan how to advance your next two TRLs.</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="text-slate-900 border-white hover:bg-slate-100 flex-1 sm:flex-none" asChild>
                            <Link href="/contact">
                                Book a Strategy Session
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                        <Button className="flex-1 sm:flex-none" onClick={onReset}>
                            Retake Assessment
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
