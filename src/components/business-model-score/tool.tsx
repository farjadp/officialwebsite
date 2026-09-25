"use client";

import { useState } from "react";
import { businessModelCategories, BMS_TOTAL_QUESTIONS } from "@/data/business-model-score/config";
import { AssessmentAnswers, calculateBusinessModelScore, FinalResult } from "@/data/business-model-score/logic";
import { QuestionCard } from "./question-card";
import { ResultSummary } from "./result-summary";
import { ToolButton, ToolField, ToolIntro, ToolPanel, ToolProgress } from "@/components/v3/tool-kit";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

type Step = "intro" | "questions" | "lead" | "result";

/** Back to the top of the page — instant when the visitor prefers reduced motion. */
function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
}

export function BusinessModelScoreTool() {
    const [step, setStep] = useState<Step>("intro");
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [answers, setAnswers] = useState<AssessmentAnswers>({});
    const [result, setResult] = useState<FinalResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [skipLead, setSkipLead] = useState(false);

    const currentCategory = businessModelCategories[currentCategoryIndex];
    const answeredCount = Object.keys(answers).length;
    const progressPct = Math.round((answeredCount / BMS_TOTAL_QUESTIONS) * 100);
    const isCategoryComplete = currentCategory.questions.every((q) => answers[q.id] !== undefined);

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentCategoryIndex < businessModelCategories.length - 1) {
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

        const finalResult = calculateBusinessModelScore(answers);

        fetch("/api/tool-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toolId: "business-model-score", score: finalResult.totalScore }),
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
                        toolId: "business-model-score",
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
                kicker="Diagnostic Tool"
                title={<>Business Model<br />Strength Score</>}
                lead="A structured diagnostic to evaluate whether your business model is logical, revenue-capable, scalable, and defensible. No hype. No generic advice."
                meta="Free • No login required"
                action={
                    <>
                        <dl className="mb-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                            {[
                                { label: "6 Categories", sub: "Covering all critical dimensions" },
                                { label: "30 Questions", sub: "Calibrated for early-stage businesses" },
                                { label: "4–6 Minutes", sub: "Full diagnostic in one session" },
                            ].map((item) => (
                                <div key={item.label} className="flex flex-col gap-1 border-t border-v3-line pt-4">
                                    <dt className="font-v3-display text-xl text-v3-bone">{item.label}</dt>
                                    <dd className="text-sm leading-snug text-v3-mute">{item.sub}</dd>
                                </div>
                            ))}
                        </dl>
                        <ToolButton onClick={() => setStep("questions")} className="text-lg">
                            Begin Evaluation
                            <Play className="h-4 w-4 rtl:-scale-x-100" fill="currentColor" aria-hidden />
                        </ToolButton>
                    </>
                }
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
            <ToolPanel className="mx-auto max-w-lg">
                <div aria-hidden className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-v3-line bg-v3-ink">
                    <span className="text-2xl">📊</span>
                </div>
                <h2 className="mb-3 font-v3-display text-3xl font-light leading-tight text-v3-bone rtl:leading-snug">Your results are ready</h2>
                <p className="mb-8 leading-relaxed text-v3-soft rtl:leading-loose">
                    Leave your email to receive a copy of your diagnostic report. Entirely optional — you can skip directly to your results.
                </p>

                <form onSubmit={(e) => handleCalculateResult(e, false)} className="flex flex-col gap-5">
                    <ToolField
                        label="Name (optional)"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                    />
                    <ToolField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="founder@company.com"
                        autoComplete="email"
                        dir="ltr"
                    />

                    <ToolButton
                        type="submit"
                        className="mt-2 w-full"
                        disabled={isCalculating || !email.trim()}
                        loading={isCalculating}
                    >
                        {isCalculating ? "Calculating Score..." : "Get My Score"}
                    </ToolButton>

                    <ToolButton
                        variant="quiet"
                        className="w-full text-sm"
                        onClick={() => { setSkipLead(true); handleCalculateResult(undefined, true); }}
                        disabled={isCalculating}
                        loading={isCalculating && skipLead}
                    >
                        {isCalculating && skipLead ? "Calculating..." : "Skip and view results directly →"}
                    </ToolButton>
                </form>

                <p className="mt-6 text-center text-xs text-v3-mute">No spam. No sales calls. Unsubscribe any time.</p>
            </ToolPanel>
        );
    }

    // ── QUESTIONS ──────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col">
            <ToolProgress
                label={`Section ${currentCategoryIndex + 1} / ${businessModelCategories.length}`}
                percent={progressPct}
                percentLabel={`${progressPct}% complete`}
                title={currentCategory.title}
            />

            {/* Questions — keyed by section so each new section rises in */}
            <div key={currentCategory.id} className="pt-2">
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

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 pt-10">
                <ToolButton
                    variant="quiet"
                    onClick={handlePrevious}
                    disabled={currentCategoryIndex === 0}
                >
                    <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden /> Previous
                </ToolButton>
                <ToolButton
                    onClick={handleNext}
                    disabled={!isCategoryComplete}
                >
                    {currentCategoryIndex === businessModelCategories.length - 1 ? "Complete Evaluation" : "Next Section"}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                </ToolButton>
            </div>
        </div>
    );
}
