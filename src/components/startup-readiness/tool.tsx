"use client";

import { useState } from "react";
import { readinessCategories, TOTAL_QUESTIONS } from "@/data/startup-readiness/config";
import { AssessmentAnswers, calculateReadinessScore, ReadinessResult } from "@/data/startup-readiness/logic";
import { QuestionCard } from "./question-card";
import { ResultSummary } from "./result-summary";
import { ToolButton, ToolField, ToolIntro, ToolPanel, ToolProgress } from "@/components/v3/tool-kit";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Scroll to the top; instant when the visitor prefers reduced motion. */
function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

export function StartupReadinessTool() {
    const [step, setStep] = useState<"intro" | "questions" | "lead" | "result">("intro");
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [answers, setAnswers] = useState<AssessmentAnswers>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<ReadinessResult | null>(null);

    // Email Lead capture state
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const currentCategory = readinessCategories[currentCategoryIndex];

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentCategoryIndex < readinessCategories.length - 1) {
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

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const finalResult = calculateReadinessScore(answers);

        fetch("/api/tool-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toolId: "startup-readiness", score: finalResult.totalScore }),
        }).catch(() => {});

        if (email) {
            try {
                await fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email.trim(),
                        name: name.trim() || undefined,
                        toolId: "startup-readiness",
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
    const progressPercentage = (answeredQuestionsCount / TOTAL_QUESTIONS) * 100;

    if (step === "intro") {
        return (
            <ToolIntro
                title="Startup Readiness Assessment"
                lead={<>Evaluate your startup idea across 6 critical dimensions. Find out instantly if you&apos;re ready to launch, raise money, or if you need to go back to the drawing board.</>}
                action={
                    <ToolButton onClick={() => setStep("questions")}>
                        Start Free Assessment
                        <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                    </ToolButton>
                }
                meta="Takes about 3-5 minutes • 30 Questions"
            />
        );
    }

    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} />;
    }

    if (step === "lead") {
        return (
            <ToolPanel className="mx-auto max-w-xl">
                <h2 className="font-v3-display text-3xl font-light leading-tight text-v3-bone rtl:leading-snug">Analyzing your results...</h2>
                <p className="mt-3 leading-relaxed text-v3-soft rtl:leading-loose">
                    Your readiness score has been calculated. Enter your info below to see your detailed breakdown and custom action plan.
                </p>

                <form onSubmit={handleCalculateResult} className="mt-8 flex flex-col gap-5">
                    <ToolField
                        id="name"
                        label="First Name (Optional)"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Elon"
                    />
                    <ToolField
                        id="email"
                        label="Work Email"
                        type="email"
                        dir="ltr"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elon@mars.com"
                    />

                    <ToolButton type="submit" className="mt-3 w-full" loading={isCalculating} disabled={!email}>
                        {isCalculating ? "Generating Report..." : "Reveal My Score & Roadmap"}
                    </ToolButton>
                    <p className="text-center text-xs text-v3-mute">
                        We respect your inbox. No spam, just value.
                    </p>
                </form>
            </ToolPanel>
        );
    }

    // "questions" step
    return (
        <div>
            <ToolProgress
                label={`Category ${currentCategoryIndex + 1} of ${readinessCategories.length}`}
                percent={progressPercentage}
                percentLabel={`${Math.round(progressPercentage)}% Completed`}
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
                    {currentCategoryIndex === readinessCategories.length - 1 ? "Finish Assessment" : "Next Category"}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                </ToolButton>
            </div>
        </div>
    );
}
