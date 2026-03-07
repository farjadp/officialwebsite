"use client";

import { FinalResult } from "@/data/sales-funnel-score/logic";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowRight, Copy, Check, Target } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ResultSummaryProps {
    result: FinalResult;
    onReset: () => void;
}

export function ResultSummary({ result, onReset }: ResultSummaryProps) {
    const [copied, setCopied] = useState(false);

    let scoreColor = "text-amber-600";
    let scoreBg = "bg-amber-50 border-amber-100";

    if (result.totalScore >= 75) {
        scoreColor = "text-emerald-600";
        scoreBg = "bg-emerald-50 border-emerald-100";
    } else if (result.totalScore <= 39) {
        scoreColor = "text-rose-600";
        scoreBg = "bg-rose-50 border-rose-100";
    } else if (result.totalScore <= 59) {
        scoreColor = "text-orange-600";
        scoreBg = "bg-orange-50 border-orange-100";
    }

    const handleCopy = () => {
        const text = [
            `Sales Funnel Health Score: ${result.totalScore}/100`,
            `Health Level: ${result.healthLevel}`,
            "",
            result.summarySentence,
            "",
            ...(result.primaryLeakStage ? [`⚠ Primary Leak Stage: ${result.primaryLeakStage}`, ""] : []),
            "— Funnel Breakdown —",
            ...result.categoryResults.map((c) => `${c.title}: ${c.score}/${c.maxScore}`),
            "",
            "— Funnel Bottlenecks —",
            ...result.bottlenecks.map((b) => `• [${b.stage}] ${b.title}`),
            "",
            "— Recommended Improvements —",
            ...result.recommendations.map((r, i) => `${i + 1}. ${r}`),
        ].join("\n");

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* ── Headline Score ──────────────────────────────────────────────── */}
            <div className={cn("text-center p-10 sm:p-14 rounded-3xl border-2 shadow-sm", scoreBg)}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    Sales Funnel Health Score
                </p>
                <div className="flex items-end justify-center gap-2 mb-4">
                    <span className={cn("text-8xl font-black tracking-tighter leading-none", scoreColor)}>
                        {result.totalScore}
                    </span>
                    <span className="text-3xl font-bold text-slate-300 mb-3">/ 100</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{result.healthLevel}</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">{result.summarySentence}</p>

                {/* Primary leak badge */}
                {result.primaryLeakStage && (
                    <div className="inline-flex items-center gap-2 mt-6 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-bold">
                        <Target className="w-4 h-4" />
                        Primary Leak: {result.primaryLeakStage}
                    </div>
                )}
            </div>

            {/* ── Two Column ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Funnel Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-2 mb-7 pb-4 border-b border-slate-100">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <h3 className="text-lg font-bold text-slate-900">Funnel Breakdown</h3>
                    </div>
                    <div className="space-y-5">
                        {result.categoryResults.map((cat) => (
                            <div key={cat.categoryId} className="space-y-1.5">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-semibold text-slate-700 max-w-[68%] leading-snug">{cat.title}</span>
                                    <span className="text-sm font-bold text-slate-900 shrink-0 ml-2">
                                        {cat.score}
                                        <span className="text-slate-300 font-normal"> / {cat.maxScore}</span>
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className={cn("h-2 rounded-full transition-all duration-700",
                                            cat.percentage >= 75 ? "bg-emerald-500" :
                                            cat.percentage >= 50 ? "bg-amber-400" : "bg-rose-400"
                                        )}
                                        style={{ width: `${cat.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Strengths + Bottlenecks */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-lg font-bold text-slate-900">Funnel Strengths</h3>
                        </div>
                        <ul className="space-y-4">
                            {result.strengths.map((s, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm leading-snug">{s.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center gap-2 mb-5">
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                            <h3 className="text-lg font-bold text-slate-900">Funnel Bottlenecks</h3>
                        </div>
                        <ul className="space-y-5">
                            {result.bottlenecks.map((b, i) => (
                                <li key={i}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">{b.stage}</span>
                                    </div>
                                    <p className="font-bold text-slate-900 text-sm mb-1">{b.title}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">{b.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* ── Recommended Improvements ─────────────────────────────────────── */}
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
                <h3 className="text-2xl font-bold tracking-tight mb-2">Recommended Improvements</h3>
                <p className="text-slate-400 mb-8 max-w-xl">Focus on these specific actions to fix the biggest leaks and increase conversions — without necessarily generating more leads.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {result.recommendations.map((rec, i) => (
                        <div key={i} className="bg-slate-800 border border-slate-700/60 rounded-xl p-5 flex items-start gap-4">
                            <div className="bg-emerald-500/20 text-emerald-400 rounded-full w-7 h-7 flex items-center justify-center shrink-0 text-sm font-bold">
                                {i + 1}
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">{rec}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-slate-800">
                    <div>
                        <h4 className="text-lg font-bold mb-1">Want a full sales funnel audit?</h4>
                        <p className="text-sm text-slate-400">Get a tailored session to diagnose your specific funnel gaps and build a conversion improvement plan.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            className="text-white border-slate-700 bg-slate-800 hover:bg-slate-700"
                            onClick={onReset}
                        >
                            Retake Assessment
                        </Button>
                        <Button
                            variant="outline"
                            className="text-white border-slate-700 bg-slate-800 hover:bg-slate-700"
                            onClick={handleCopy}
                        >
                            {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                            {copied ? "Copied" : "Copy Results"}
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-500" asChild>
                            <Link href="/booking">
                                Book Funnel Audit
                                <ArrowRight className="w-4 h-4 ml-1.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
