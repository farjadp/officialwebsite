"use client";

import { useState } from "react";
import { readinessCategories, TOTAL_QUESTIONS } from "@/data/startup-readiness/config";
import { AssessmentAnswers, calculateReadinessScore, ReadinessResult } from "@/data/startup-readiness/logic";
import { QuestionCard } from "./question-card";
import { ResultSummary } from "./result-summary";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Play } from "lucide-react";

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
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentCategoryIndex(0);
        setStep("intro");
        setResult(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const isCurrentCategoryComplete = () => {
        return currentCategory.questions.every((q) => answers[q.id] !== undefined);
    };

    const answeredQuestionsCount = Object.keys(answers).length;
    const progressPercentage = (answeredQuestionsCount / TOTAL_QUESTIONS) * 100;

    if (step === "intro") {
        return (
            <div className="max-w-3xl mx-auto text-center space-y-8 py-12 px-6">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                    Startup Readiness Assessment
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Evaluate your startup idea across 6 critical dimensions. Find out instantly if you&apos;re ready to launch, raise money, or if you need to go back to the drawing board.
                </p>
                <div className="pt-8">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full" onClick={() => setStep("questions")}>
                        Start Free Assessment
                        <Play className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-sm text-slate-500 mt-4">Takes about 3-5 minutes • 30 Questions</p>
                </div>
            </div>
        );
    }

    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} />;
    }

    if (step === "lead") {
        return (
            <div className="max-w-xl mx-auto bg-white border border-slate-200 shadow-xl rounded-3xl p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing your results...</h2>
                <p className="text-slate-600 mb-8">
                    Your readiness score has been calculated. Enter your info below to see your detailed breakdown and custom action plan.
                </p>

                <form onSubmit={handleCalculateResult} className="space-y-4 text-left">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-slate-700">First Name (Optional)</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="Elon"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-slate-700">Work Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="elon@mars.com"
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl mt-6" disabled={isCalculating || !email}>
                        {isCalculating ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generating Report...
                            </>
                        ) : (
                            "Reveal My Score & Roadmap"
                        )}
                    </Button>
                    <p className="text-xs text-slate-400 text-center mt-4">
                        We respect your inbox. No spam, just value.
                    </p>
                </form>
            </div>
        );
    }

    // "questions" step
    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Progress Header */}
            <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md pt-4 pb-4 border-b border-slate-200">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                    <span>Category {currentCategoryIndex + 1} of {readinessCategories.length}</span>
                    <span className="text-primary">{Math.round(progressPercentage)}% Completed</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <h2 className="text-2xl font-bold text-slate-900 mt-6">{currentCategory.title}</h2>
            </div>

            {/* Questions List */}
            <div className="space-y-6 pt-4">
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
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentCategoryIndex === 0}
                    className="text-slate-500"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Previous
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={!isCurrentCategoryComplete()}
                    className="rounded-full px-8"
                >
                    {currentCategoryIndex === readinessCategories.length - 1 ? "Finish Assessment" : "Next Category"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>

        </div>
    );
}
