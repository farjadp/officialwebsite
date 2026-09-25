"use client";

import { useState } from "react";
import { investorCategories, INVESTOR_TOTAL_QUESTIONS } from "@/data/investor-readiness/config";
import { AssessmentAnswers, calculateInvestorScore, FinalResult } from "@/data/investor-readiness/logic";
import { QuestionCard } from "./question-card";
import { ResultSummary } from "./result-summary";
import { ToolButton, ToolField, ToolIntro, ToolPanel, ToolProgress } from "@/components/v3/tool-kit";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Scroll to the top; instant when the visitor prefers reduced motion. */
function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

export function InvestorReadinessTool() {
    const [step, setStep] = useState<"intro" | "questions" | "lead" | "result">("intro");
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [answers, setAnswers] = useState<AssessmentAnswers>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<FinalResult | null>(null);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const currentCategory = investorCategories[currentCategoryIndex];

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentCategoryIndex < investorCategories.length - 1) {
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

    const handleCalculateResult = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsCalculating(true);

        await new Promise((resolve) => setTimeout(resolve, 1800));

        const finalResult = calculateInvestorScore(answers);

        fetch("/api/tool-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toolId: "investor-readiness", score: finalResult.totalScore }),
        }).catch(() => {});

        if (email) {
            try {
                await fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email.trim(),
                        name: name.trim() || undefined,
                        toolId: "investor-readiness",
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
        scrollToTop();
    };

    const isCurrentCategoryComplete = () => {
        return currentCategory.questions.every((q) => answers[q.id] !== undefined);
    };

    const answeredQuestionsCount = Object.keys(answers).length;
    const progressPercentage = (answeredQuestionsCount / INVESTOR_TOTAL_QUESTIONS) * 100;

    if (step === "intro") {
        return (
            <ToolIntro
                title="Investor Readiness Score"
                lead="Evaluate how prepared your startup is to raise funding from angel investors or venture capital firms. Receive a professional diagnostic report measuring your fundability across 6 critical areas."
                action={
                    <ToolButton onClick={() => setStep("questions")}>
                        Begin Evaluation
                        <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                    </ToolButton>
                }
                meta="4–6 minutes • 30 Diagnostic Questions"
            />
        );
    }

    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} />;
    }

    if (step === "lead") {
        return (
            <ToolPanel className="mx-auto max-w-xl">
                <h2 className="font-v3-display text-3xl font-light leading-tight text-v3-bone rtl:leading-snug">Generating Readiness Report...</h2>
                <p className="mt-3 leading-relaxed text-v3-soft rtl:leading-loose">
                    Your diagnostic score is ready. Enter your information below to unlock the full investor evaluation breakdown and recommended next steps.
                </p>

                <form onSubmit={handleCalculateResult} className="mt-8 flex flex-col gap-5">
                    <ToolField
                        id="name"
                        label="Founder Name (Optional)"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                    />
                    <ToolField
                        id="email"
                        label="Work Email"
                        type="email"
                        dir="ltr"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="founder@startup.com"
                    />

                    <ToolButton type="submit" className="mt-3 w-full" loading={isCalculating} disabled={!email}>
                        {isCalculating ? "Finalizing Audit..." : "Reveal Investor Readiness Score"}
                    </ToolButton>
                    <p className="text-center text-xs text-v3-mute">
                        Strictly Confidential & Secure
                    </p>
                </form>
            </ToolPanel>
        );
    }

    return (
        <div>
            <ToolProgress
                label={`Section ${currentCategoryIndex + 1} / ${investorCategories.length}`}
                percent={progressPercentage}
                percentLabel={`${Math.round(progressPercentage)}% Evaluated`}
                title={currentCategory.title}
            />

            {/* Questions List */}
            <div>
                {currentCategory.questions.map((q, index) => (
                    <QuestionCard
                        key={q.id}
                        index={index}
                        question={q}
                        value={answers[q.id]}
                        onChange={(val) => handleAnswer(q.id, val)}
                    />
                ))}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between gap-4 pt-8">
                <ToolButton variant="quiet" onClick={handlePrevious} disabled={currentCategoryIndex === 0}>
                    <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                    Previous
                </ToolButton>

                <ToolButton onClick={handleNext} disabled={!isCurrentCategoryComplete()}>
                    {currentCategoryIndex === investorCategories.length - 1 ? "Complete Evaluation" : "Next Section"}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                </ToolButton>
            </div>
        </div>
    );
}
