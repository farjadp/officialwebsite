import { ReadinessResult } from "@/data/startup-readiness/logic";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ResultSummaryProps {
    result: ReadinessResult;
    onReset: () => void;
}

export function ResultSummary({ result, onReset }: ResultSummaryProps) {
    // Determine color based on score
    let scoreColorClass = "text-indigo-600";
    let bgScoreClass = "bg-indigo-50 border-indigo-100";

    if (result.totalScore >= 75) {
        scoreColorClass = "text-emerald-600";
        bgScoreClass = "bg-emerald-50 border-emerald-100";
    } else if (result.totalScore < 50) {
        scoreColorClass = "text-amber-600";
        bgScoreClass = "bg-amber-50 border-amber-100";
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header & Main Score */}
            <div className={cn("text-center p-8 sm:p-12 rounded-3xl border-2", bgScoreClass)}>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">Your Startup Readiness Score</p>
                <div className="flex items-end justify-center gap-2 mb-4">
                    <span className={cn("text-6xl sm:text-8xl font-bold tracking-tight", scoreColorClass)}>
                        {result.totalScore}
                    </span>
                    <span className="text-2xl sm:text-3xl font-medium text-slate-400 mb-2 sm:mb-4">/ 100</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">{result.readinessLevel}</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">{result.summarySentence}</p>
            </div>

            {/* Two Column Layout for Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Col: Category Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-slate-400" />
                        <h3 className="text-xl font-bold text-slate-800">Category Breakdown</h3>
                    </div>

                    <div className="space-y-6">
                        {result.categoryResults.map((cat) => (
                            <div key={cat.categoryId} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="font-medium text-slate-700">{cat.title}</span>
                                    <span className="text-sm font-bold text-slate-900">{cat.score} <span className="text-slate-400 font-normal">/ {cat.maxScore}</span></span>
                                </div>
                                <Progress value={cat.percentage} className="h-2.5" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Strengths & Weaknesses */}
                <div className="space-y-8">

                    {/* Strengths */}
                    <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6 sm:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-xl font-bold text-slate-800">Key Strengths</h3>
                        </div>
                        <ul className="space-y-4">
                            {result.strengths.map((str, i) => (
                                <li key={i} className="flex flex-col">
                                    <span className="font-semibold text-slate-800">{str.title}</span>
                                    <span className="text-slate-600 text-sm mt-1">{str.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses / Risks */}
                    <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-6 sm:p-8">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <h3 className="text-xl font-bold text-slate-800">Primary Risks</h3>
                        </div>
                        <ul className="space-y-4">
                            {result.weaknesses.map((weak, i) => (
                                <li key={i} className="flex flex-col">
                                    <span className="font-semibold text-slate-800">{weak.title}</span>
                                    <span className="text-slate-600 text-sm mt-1">{weak.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-2">Recommended Next Steps</h3>
                <p className="text-slate-400 mb-8 max-w-2xl">Based on your lowest scoring areas, here is what you should focus on next to improve your readiness.</p>

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

                {/* CTA Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
                    <div>
                        <h4 className="text-lg font-bold mb-1">Want a deeper startup review?</h4>
                        <p className="text-sm text-slate-400">Book a strategy session to discuss these results and get a custom roadmap.</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="text-slate-900 border-white hover:bg-slate-100 flex-1 sm:flex-none" asChild>
                            <Link href="/contact">
                                Book a Strategy Session
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
