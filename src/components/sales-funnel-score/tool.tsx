"use client";

import { useState } from "react";
import { salesFunnelCategories, SF_TOTAL_QUESTIONS } from "@/data/sales-funnel-score/config";
import { AssessmentAnswers, calculateSalesFunnelScore, FinalResult } from "@/data/sales-funnel-score/logic";
import { QuestionCard } from "./question-card";
import { ResultSummary } from "./result-summary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Play } from "lucide-react";

type Step = "intro" | "questions" | "lead" | "result";

export function SalesFunnelScoreTool() {
    const [step, setStep] = useState<Step>("intro");
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [answers, setAnswers] = useState<AssessmentAnswers>({});
    const [result, setResult] = useState<FinalResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [skipLead, setSkipLead] = useState(false);

    const currentCategory = salesFunnelCategories[currentCategoryIndex];
    const answeredCount = Object.keys(answers).length;
    const progressPct = Math.round((answeredCount / SF_TOTAL_QUESTIONS) * 100);
    const isCategoryComplete = currentCategory.questions.every((q) => answers[q.id] !== undefined);

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentCategoryIndex < salesFunnelCategories.length - 1) {
            setCurrentCategoryIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            setStep("lead");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevious = () => {
        if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleCalculateResult = async (e?: React.FormEvent, skipped = false) => {
        if (e) e.preventDefault();
        setIsCalculating(true);

        await new Promise((resolve) => setTimeout(resolve, 1800));

        const finalResult = calculateSalesFunnelScore(answers);

        fetch("/api/tool-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toolId: "sales-funnel-score", score: finalResult.totalScore }),
        }).catch(() => {});

        const hasEmail = !skipped && email.trim();
        if (hasEmail) {
            try {
                await fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email.trim(),
                        name: name.trim() || undefined,
                        toolId: "sales-funnel-score",
                        score: finalResult.totalScore,
                        answers,
                    }),
                });
            } catch { /* non-blocking */ }
        }
        setResult(finalResult);
        setIsCalculating(false);
        setStep("result");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentCategoryIndex(0);
        setStep("intro");
        setResult(null);
        setEmail("");
        setName("");
        setSkipLead(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── INTRO ──────────────────────────────────────────────────────────────────
    if (step === "intro") {
        return (
            <div className="max-w-3xl mx-auto text-center space-y-8 py-12 px-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                    Sales Diagnostic Tool
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                    Sales Funnel<br />Health Score
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Find out exactly where your funnel is leaking revenue. Most businesses don't have a lead problem — they have a conversion problem. This diagnostic shows you which stage is costing you the most.
                </p>

                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-left pt-4">
                    {[
                        { label: "6 Stages", sub: "From lead gen to closing" },
                        { label: "30 Questions", sub: "Covering the full sales cycle" },
                        { label: "4–5 Minutes", sub: "Instant funnel bottleneck report" },
                    ].map((item) => (
                        <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                            <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <Button
                        size="lg"
                        className="h-14 px-10 text-lg rounded-full bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
                        onClick={() => setStep("questions")}
                    >
                        Diagnose My Funnel
                        <Play className="ml-2 w-5 h-5" fill="currentColor" />
                    </Button>
                    <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-wider">Free • No login required</p>
                </div>
            </div>
        );
    }

    // ── RESULT ─────────────────────────────────────────────────────────────────
    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} />;
    }

    // ── LEAD CAPTURE ───────────────────────────────────────────────────────────
    if (step === "lead") {
        return (
            <div className="max-w-lg mx-auto bg-white border border-slate-200 shadow-2xl shadow-slate-900/5 rounded-3xl p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">📈</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Your funnel report is ready</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Leave your email to receive a copy of your sales funnel diagnostic report. Completely optional — you can skip directly to your results.
                </p>

                <form onSubmit={(e) => handleCalculateResult(e, false)} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Name (optional)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                            placeholder="Your name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                            placeholder="you@company.com"
                        />
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 mt-2"
                        disabled={isCalculating || !email.trim()}
                    >
                        {isCalculating && !skipLead ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Funnel...</>
                        ) : (
                            "Get My Funnel Report"
                        )}
                    </Button>

                    <button
                        type="button"
                        onClick={() => { setSkipLead(true); handleCalculateResult(undefined, true); }}
                        disabled={isCalculating}
                        className="w-full text-sm text-slate-400 hover:text-slate-600 py-2 transition-colors"
                    >
                        {isCalculating && skipLead ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Calculating...
                            </span>
                        ) : (
                            "Skip and view results directly →"
                        )}
                    </button>
                </form>

                <p className="text-[10px] text-slate-300 mt-6 uppercase tracking-wider">No spam. No sales calls. Unsubscribe any time.</p>
            </div>
        );
    }

    // ── QUESTIONS ──────────────────────────────────────────────────────────────
    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

            <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm pt-5 pb-5 border-b border-slate-200">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    <span>Stage {currentCategoryIndex + 1} / {salesFunnelCategories.length}</span>
                    <span className="text-emerald-600">{progressPct}% complete</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                        className="h-1.5 rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-5 tracking-tight">{currentCategory.title}</h2>
            </div>

            <div className="space-y-4 pt-2">
                {currentCategory.questions.map((q, i) => (
                    <QuestionCard
                        key={q.id}
                        index={i}
                        question={q}
                        value={answers[q.id]}
                        onChange={(val) => handleAnswer(q.id, val)}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentCategoryIndex === 0}
                    className="text-slate-500"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Previous
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!isCategoryComplete}
                    className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-500"
                >
                    {currentCategoryIndex === salesFunnelCategories.length - 1 ? "Complete Diagnostic" : "Next Stage"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
