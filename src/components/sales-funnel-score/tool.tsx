"use client";

import { useState } from "react";
import { salesFunnelCategories, SF_TOTAL_QUESTIONS } from "@/data/sales-funnel-score/config";
import { AssessmentAnswers, calculateSalesFunnelScore, FinalResult } from "@/data/sales-funnel-score/logic";
import { QuestionCard } from "./question-card";
import { ResultSummary } from "./result-summary";
import { StepIn, ToolButton, ToolField, ToolIntro, ToolPanel, ToolProgress } from "@/components/v3/tool-kit";
import { ArrowLeft, ArrowRight, Play, TrendingUp } from "lucide-react";

type Step = "intro" | "questions" | "lead" | "result";

/** Back to the top of the tool; instant when the visitor prefers reduced motion. */
function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
}

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
            scrollToTop();
        } else {
            setStep("lead");
            scrollToTop();
        }
    };

    const handlePrevious = () => {
        if (currentCategoryIndex > 0) {
            setCurrentCategoryIndex((prev) => prev - 1);
            scrollToTop();
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
        scrollToTop();
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentCategoryIndex(0);
        setStep("intro");
        setResult(null);
        setEmail("");
        setName("");
        setSkipLead(false);
        scrollToTop();
    };

    // ── INTRO ──────────────────────────────────────────────────────────────────
    if (step === "intro") {
        return (
            <ToolIntro
                kicker="Sales Diagnostic Tool"
                title={<>Sales Funnel<br /><span className="text-v3-light">Health Score</span></>}
                lead="Find out exactly where your funnel is leaking revenue. Most businesses don't have a lead problem — they have a conversion problem. This diagnostic shows you which stage is costing you the most."
                action={
                    <div className="flex w-full flex-col items-start gap-10">
                        <dl className="grid w-full grid-cols-1 border-y border-v3-line/70 sm:grid-cols-3">
                            {[
                                { label: "6 Stages", sub: "From lead gen to closing" },
                                { label: "30 Questions", sub: "Covering the full sales cycle" },
                                { label: "4–5 Minutes", sub: "Instant funnel bottleneck report" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex flex-col gap-1 border-b border-v3-line/70 py-5 last:border-b-0 sm:border-b-0 sm:border-e sm:pe-6 sm:ps-6 sm:first:ps-0 sm:last:border-e-0"
                                >
                                    <dt className="font-v3-display text-2xl font-light text-v3-bone">{item.label}</dt>
                                    <dd className="text-sm leading-snug text-v3-mute">{item.sub}</dd>
                                </div>
                            ))}
                        </dl>
                        <ToolButton onClick={() => setStep("questions")}>
                            Diagnose My Funnel
                            <Play className="h-4 w-4 rtl:-scale-x-100" fill="currentColor" aria-hidden />
                        </ToolButton>
                    </div>
                }
                meta="Free • No login required"
            />
        );
    }

    // ── RESULT ─────────────────────────────────────────────────────────────────
    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} />;
    }

    // ── LEAD CAPTURE ───────────────────────────────────────────────────────────
    if (step === "lead") {
        return (
            <div className="mx-auto max-w-lg py-8 md:py-16">
                <ToolPanel>
                    <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-v3-light/60 text-v3-light">
                        <TrendingUp className="h-5 w-5" aria-hidden />
                    </div>
                    <h2 className="mb-3 font-v3-display text-3xl font-light leading-tight rtl:leading-snug">Your funnel report is ready</h2>
                    <p className="mb-8 leading-relaxed text-v3-soft rtl:leading-loose">
                        Leave your email to receive a copy of your sales funnel diagnostic report. Completely optional — you can skip directly to your results.
                    </p>

                    <form onSubmit={(e) => handleCalculateResult(e, false)} className="flex flex-col gap-5">
                        <ToolField
                            label="Name (optional)"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                        />
                        <ToolField
                            label="Email"
                            type="email"
                            dir="ltr"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                        />

                        <ToolButton
                            type="submit"
                            className="mt-2 w-full"
                            loading={isCalculating && !skipLead}
                            disabled={isCalculating || !email.trim()}
                        >
                            {isCalculating && !skipLead ? "Analyzing Funnel..." : "Get My Funnel Report"}
                        </ToolButton>

                        <ToolButton
                            variant="quiet"
                            className="w-full text-sm"
                            onClick={() => { setSkipLead(true); handleCalculateResult(undefined, true); }}
                            loading={isCalculating && skipLead}
                            disabled={isCalculating}
                        >
                            {isCalculating && skipLead ? "Calculating..." : "Skip and view results directly →"}
                        </ToolButton>
                    </form>

                    <p className="mt-6 text-center text-xs text-v3-mute">No spam. No sales calls. Unsubscribe any time.</p>
                </ToolPanel>
            </div>
        );
    }

    // ── QUESTIONS ──────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col">
            <ToolProgress
                label={<>Stage {currentCategoryIndex + 1} / {salesFunnelCategories.length}</>}
                percent={progressPct}
                percentLabel={`${progressPct}% complete`}
                title={currentCategory.title}
            />

            <StepIn key={currentCategory.id} className="flex flex-col">
                {currentCategory.questions.map((q, i) => (
                    <QuestionCard
                        key={q.id}
                        index={i}
                        question={q}
                        value={answers[q.id]}
                        onChange={(val) => handleAnswer(q.id, val)}
                    />
                ))}
            </StepIn>

            <div className="flex items-center justify-between gap-4 pt-8">
                <ToolButton variant="quiet" onClick={handlePrevious} disabled={currentCategoryIndex === 0}>
                    <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden /> Previous
                </ToolButton>
                <ToolButton onClick={handleNext} disabled={!isCategoryComplete}>
                    {currentCategoryIndex === salesFunnelCategories.length - 1 ? "Complete Diagnostic" : "Next Stage"}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                </ToolButton>
            </div>
        </div>
    );
}
