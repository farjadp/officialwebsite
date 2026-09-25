"use client";

import { useState } from "react";
import { InvestorLocale, INVESTOR_TOTAL_QUESTIONS } from "@/data/investor-readiness/config";
import { AssessmentAnswers, calculateInvestorScore, FinalResult, getInvestorCategories } from "@/data/investor-readiness/logic";
import { getInvestorUiStrings } from "@/data/investor-readiness/ui";
import { QuestionCard } from "./question-card";
import { ResultSummary } from "./result-summary";
import { ToolButton, ToolField, ToolIntro, ToolPanel, ToolProgress } from "@/components/v3/tool-kit";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Scroll to the top; instant when the visitor prefers reduced motion. */
function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

export function InvestorReadinessTool({ locale = "en" }: { locale?: InvestorLocale } = {}) {
    const t = getInvestorUiStrings(locale);
    const investorCategories = getInvestorCategories(locale);

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

        const finalResult = calculateInvestorScore(answers, locale);

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
                title={t.introTitle}
                lead={t.introLead}
                action={
                    <ToolButton onClick={() => setStep("questions")}>
                        {t.startButton}
                        <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                    </ToolButton>
                }
                meta={t.durationLine}
            />
        );
    }

    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} locale={locale} />;
    }

    if (step === "lead") {
        return (
            <ToolPanel className="mx-auto max-w-xl">
                <h2 className="font-v3-display text-3xl font-light leading-tight text-v3-bone rtl:leading-snug">{t.leadTitle}</h2>
                <p className="mt-3 leading-relaxed text-v3-soft rtl:leading-loose">
                    {t.leadBody}
                </p>

                <form onSubmit={handleCalculateResult} className="mt-8 flex flex-col gap-5">
                    <ToolField
                        id="name"
                        label={t.nameLabel}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                    />
                    <ToolField
                        id="email"
                        label={t.emailLabel}
                        type="email"
                        dir="ltr"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                    />

                    <ToolButton type="submit" className="mt-3 w-full" loading={isCalculating} disabled={!email}>
                        {isCalculating ? t.generating : t.submit}
                    </ToolButton>
                    <p className="text-center text-xs text-v3-mute">
                        {t.confidentialNote}
                    </p>
                </form>
            </ToolPanel>
        );
    }

    return (
        <div>
            <ToolProgress
                label={t.sectionOf(currentCategoryIndex + 1, investorCategories.length)}
                percent={progressPercentage}
                percentLabel={t.evaluated(Math.round(progressPercentage))}
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
                        locale={locale}
                    />
                ))}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between gap-4 pt-8">
                <ToolButton variant="quiet" onClick={handlePrevious} disabled={currentCategoryIndex === 0}>
                    <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                    {t.previous}
                </ToolButton>

                <ToolButton onClick={handleNext} disabled={!isCurrentCategoryComplete()}>
                    {currentCategoryIndex === investorCategories.length - 1 ? t.finish : t.nextSection}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                </ToolButton>
            </div>
        </div>
    );
}
