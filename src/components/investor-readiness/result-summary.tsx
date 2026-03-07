import { FinalResult } from "@/data/investor-readiness/logic";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ResultSummaryProps {
    result: FinalResult;
    onReset: () => void;
}

export function ResultSummary({ result, onReset }: ResultSummaryProps) {
    // Investor Readiness uses slightly more muted/serious colors compared to general startup readiness
    let scoreColorClass = "text-blue-600";
    let bgScoreClass = "bg-blue-50 border-blue-100";

    if (result.totalScore >= 75) {
        scoreColorClass = "text-emerald-600";
        bgScoreClass = "bg-emerald-50 border-emerald-100";
    } else if (result.totalScore < 60) {
        scoreColorClass = "text-rose-600";
        bgScoreClass = "bg-rose-50 border-rose-100";
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header & Main Score */}
            <div className={cn("text-center p-8 sm:p-12 rounded-3xl border-2 shadow-sm font-sans", bgScoreClass)}>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Investor Readiness Score</p>
                <div className="flex items-end justify-center gap-2 mb-4 mt-2">
                    <span className={cn("text-7xl sm:text-8xl font-black tracking-tighter", scoreColorClass)}>
                        {result.totalScore}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-slate-400 mb-3 sm:mb-4">/ 100</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{result.readinessLevel}</h2>
                <p className="text-lg text-slate-700 max-w-2xl mx-auto font-medium">{result.summarySentence}</p>
            </div>

            {/* Two Column Layout for Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Col: Category Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-100">
                        <TrendingUp className="w-5 h-5 text-slate-400" />
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Category Breakdown</h3>
                    </div>

                    <div className="space-y-6">
                        {result.categoryResults.map((cat) => (
                            <div key={cat.categoryId} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="font-semibold text-slate-700 text-sm">{cat.title}</span>
                                    <span className="text-sm font-bold text-slate-900">{cat.score} <span className="text-slate-400 font-normal">/ {cat.maxScore}</span></span>
                                </div>
                                <Progress value={cat.percentage} className="h-2 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Col: Strengths & Weaknesses */}
                <div className="space-y-6">

                    {/* Strengths */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Investor Strength Signals</h3>
                        </div>
                        <ul className="space-y-4">
                            {result.strengths.map((str, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                    <span className="font-medium text-slate-700 leading-snug">{str.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses / Risks */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Key Investor Concerns</h3>
                        </div>
                        <ul className="space-y-5">
                            {result.weaknesses.map((weak, i) => (
                                <li key={i} className="flex flex-col">
                                    <span className="font-bold text-slate-900 text-sm mb-1">{weak.title}</span>
                                    <span className="text-slate-600 text-sm leading-relaxed">{weak.description}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            {/* Recommended Next Steps */}
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl mt-8">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Recommended Next Steps</h3>
                <p className="text-slate-400 mb-10 max-w-2xl text-lg">Before pitching to investors or opening a round, focus on resolving these critical gaps to maximize your valuation and closing probability.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                    {result.recommendations.map((rec, i) => (
                        <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-start gap-4 hover:bg-slate-800/80 transition-colors">
                            <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold">
                                {i + 1}
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium">{rec}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-800/50">
                    <div>
                        <h4 className="text-xl font-bold mb-1">Schedule a Pitch Review</h4>
                        <p className="text-sm text-slate-400">Get a professional audit of your deck and narrative before you raise.</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="text-white border-slate-700 bg-slate-800 hover:bg-slate-700 flex-1 sm:flex-none" onClick={onReset}>
                            Retake Assessment
                        </Button>
                        <Button className="flex-1 sm:flex-none" asChild>
                            <Link href="/contact">
                                Book Pitch Review
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
