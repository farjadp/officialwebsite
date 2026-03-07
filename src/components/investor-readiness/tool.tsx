"use client";

import { useState } from "react";
import { investorCategories, INVESTOR_TOTAL_QUESTIONS } from "@/data/investor-readiness/config";
import { AssessmentAnswers, calculateInvestorScore, FinalResult } from "@/data/investor-readiness/logic";
import { QuestionCard } from "./question-card";
import { ResultSummary } from "./result-summary";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Play } from "lucide-react";

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
    const progressPercentage = (answeredQuestionsCount / INVESTOR_TOTAL_QUESTIONS) * 100;

    if (step === "intro") {
        return (
            <div className="max-w-3xl mx-auto text-center space-y-8 py-12 px-6 font-sans">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                    Investor Readiness Score
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Evaluate how prepared your startup is to raise funding from angel investors or venture capital firms. Receive a professional diagnostic report measuring your fundability across 6 critical areas.
                </p>
                <div className="pt-8">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20" onClick={() => setStep("questions")}>
                        Begin Evaluation
                        <Play className="ml-2 w-5 h-5" fill="currentColor" />
                    </Button>
                    <p className="text-sm font-medium text-slate-500 mt-5">4–6 minutes • 30 Diagnostic Questions</p>
                </div>
            </div>
        );
    }

    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} />;
    }

    if (step === "lead") {
        return (
            <div className="max-w-xl mx-auto bg-white border border-slate-200 shadow-2xl shadow-blue-900/5 rounded-3xl p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Generating Readiness Report...</h2>
                <p className="text-slate-600 mb-8">
                    Your diagnostic score is ready. Enter your information below to unlock the full investor evaluation breakdown and recommended next steps.
                </p>

                <form onSubmit={handleCalculateResult} className="space-y-5 text-left">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold text-slate-700">Founder Name (Optional)</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-slate-700">Work Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                            placeholder="founder@startup.com"
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl mt-6 shadow-md" disabled={isCalculating || !email}>
                        {isCalculating ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Finalizing Audit...
                            </>
                        ) : (
                            "Reveal Investor Readiness Score"
                        )}
                    </Button>
                    <p className="text-xs font-medium text-slate-400 text-center mt-4 uppercase tracking-wider">
                        Strictly Confidential & Secure
                    </p>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Progress Header */}
            <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md pt-4 pb-4 border-b border-slate-200">
                <div className="flex justify-between text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    <span>Section {currentCategoryIndex + 1} / {investorCategories.length}</span>
                    <span className="text-primary">{Math.round(progressPercentage)}% Evaluated</span>
                </div>
                <Progress value={progressPercentage} className="h-2 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-900 mt-6 tracking-tight">{currentCategory.title}</h2>
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
                    className="text-slate-500 font-medium"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Previous
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={!isCurrentCategoryComplete()}
                    className="rounded-full px-8 shadow-sm"
                >
                    {currentCategoryIndex === investorCategories.length - 1 ? "Complete Evaluation" : "Next Section"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>

        </div>
    );
}
