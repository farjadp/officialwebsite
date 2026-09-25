"use client";

// ============================================================================
// File Path: src/components/sales-funnel-score/tool.tsx
// Why: The Sales Funnel Health Score flow (intro → six stages of questions →
//      optional lead step → result). Bilingual: every string comes from
//      src/data/sales-funnel-score (config / config.fa / ui), the scoring and
//      the two fetch calls are identical in both locales.
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react";
import { SalesFunnelLocale } from "@/data/sales-funnel-score/config";
import {
    AssessmentAnswers,
    calculateSalesFunnelScore,
    FinalResult,
    getSalesFunnelContent,
} from "@/data/sales-funnel-score/logic";
import { getSalesFunnelUiStrings } from "@/data/sales-funnel-score/ui";
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

export function SalesFunnelScoreTool({ locale = "en" }: { locale?: SalesFunnelLocale }) {
    const content = getSalesFunnelContent(locale);
    const ui = getSalesFunnelUiStrings(locale);
    const isRtl = content.dir === "rtl";
    const categories = content.categories;
    const totalQuestions = categories.reduce((acc, c) => acc + c.questions.length, 0);

    const NextArrow = isRtl ? ArrowLeft : ArrowRight;
    const PrevArrow = isRtl ? ArrowRight : ArrowLeft;

    const [step, setStep] = useState<Step>("intro");
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [answers, setAnswers] = useState<AssessmentAnswers>({});
    const [result, setResult] = useState<FinalResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [skipLead, setSkipLead] = useState(false);

    const currentCategory = categories[currentCategoryIndex];
    const answeredCount = Object.keys(answers).length;
    const progressPct = Math.round((answeredCount / totalQuestions) * 100);
    const isCategoryComplete = currentCategory.questions.every((q) => answers[q.id] !== undefined);

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentCategoryIndex < categories.length - 1) {
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

        const finalResult = calculateSalesFunnelScore(answers, locale);

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
                kicker={ui.kicker}
                title={<>{ui.titleLead}<br /><span className="text-v3-light">{ui.titleAccent}</span></>}
                lead={ui.lead}
                action={
                    <div className="flex w-full flex-col items-start gap-10">
                        <dl className="grid w-full grid-cols-1 border-y border-v3-line/70 sm:grid-cols-3">
                            {ui.stats.map((item) => (
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
                            {ui.startButton}
                            <Play className="h-4 w-4 rtl:-scale-x-100" fill="currentColor" aria-hidden />
                        </ToolButton>
                    </div>
                }
                meta={ui.meta}
            />
        );
    }

    // ── RESULT ─────────────────────────────────────────────────────────────────
    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} locale={locale} />;
    }

    // ── LEAD CAPTURE ───────────────────────────────────────────────────────────
    if (step === "lead") {
        return (
            <div className="mx-auto max-w-lg py-8 md:py-16">
                <ToolPanel>
                    <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-v3-light/60 text-v3-light">
                        <TrendingUp className="h-5 w-5" aria-hidden />
                    </div>
                    <h2 className="mb-3 font-v3-display text-3xl font-light leading-tight rtl:leading-snug">{ui.leadTitle}</h2>
                    <p className="mb-8 leading-relaxed text-v3-soft rtl:leading-loose">
                        {ui.leadBody}
                    </p>

                    <form onSubmit={(e) => handleCalculateResult(e, false)} className="flex flex-col gap-5">
                        <ToolField
                            label={ui.nameLabel}
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={ui.namePlaceholder}
                        />
                        <ToolField
                            label={ui.emailLabel}
                            type="email"
                            dir="ltr"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={ui.emailPlaceholder}
                        />

                        <ToolButton
                            type="submit"
                            className="mt-2 w-full"
                            loading={isCalculating && !skipLead}
                            disabled={isCalculating || !email.trim()}
                        >
                            {isCalculating && !skipLead ? ui.submitting : ui.submit}
                        </ToolButton>

                        <ToolButton
                            variant="quiet"
                            className="w-full text-sm"
                            onClick={() => { setSkipLead(true); handleCalculateResult(undefined, true); }}
                            loading={isCalculating && skipLead}
                            disabled={isCalculating}
                        >
                            {isCalculating && skipLead ? ui.skipping : ui.skip}
                        </ToolButton>
                    </form>

                    <p className="mt-6 text-center text-xs text-v3-mute">{ui.noSpam}</p>
                </ToolPanel>
            </div>
        );
    }

    // ── QUESTIONS ──────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col">
            <ToolProgress
                label={ui.stageLabel(currentCategoryIndex + 1, categories.length)}
                percent={progressPct}
                percentLabel={ui.percentLabel(progressPct)}
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
                        locale={locale}
                    />
                ))}
            </StepIn>

            <div className="flex items-center justify-between gap-4 pt-8">
                <ToolButton variant="quiet" onClick={handlePrevious} disabled={currentCategoryIndex === 0}>
                    <PrevArrow className="h-4 w-4" aria-hidden /> {ui.previous}
                </ToolButton>
                <ToolButton onClick={handleNext} disabled={!isCategoryComplete}>
                    {currentCategoryIndex === categories.length - 1 ? ui.complete : ui.nextStage}
                    <NextArrow className="h-4 w-4" aria-hidden />
                </ToolButton>
            </div>
        </div>
    );
}
