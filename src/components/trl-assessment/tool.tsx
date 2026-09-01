"use client";

import { useState } from "react";
import { TOTAL_CRITERIA, TrlCriterion, TrlLocale } from "@/data/trl-assessment/config";
import { TrlAnswers, calculateTrl, getTrlContent, TrlResult } from "@/data/trl-assessment/logic";
import { getTrlUiStrings } from "@/data/trl-assessment/ui";
import { ResultSummary } from "./result-summary";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

function CriterionCard({
    criterion,
    index,
    value,
    onChange,
    options,
}: {
    criterion: TrlCriterion;
    index: number;
    value: number | undefined;
    onChange: (value: number) => void;
    options: { value: number; label: string }[];
}) {
    // Distinct selected states: No -> stone, Partially -> amber, Yes -> green
    const selectedClasses = [
        "border-stone-400 bg-stone-100 text-stone-700",
        "border-[#D97706] bg-[#D97706]/10 text-[#B45309]",
        "border-[#0F3F35] bg-[#0F3F35] text-white",
    ];

    return (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 transition-all hover:border-stone-300 hover:shadow-md">
            <h4 className="text-base sm:text-lg font-medium text-[#1C1917] mb-4 leading-relaxed">
                <span className="text-stone-400 me-2">{index + 1}.</span>
                {criterion.text}
            </h4>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-center text-sm font-medium",
                            value === option.value
                                ? selectedClasses[option.value]
                                : "border-stone-100 bg-[#FDFBF7] text-stone-500 hover:border-stone-300 hover:bg-stone-50"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function TrlAssessmentTool({ locale = "en" }: { locale?: TrlLocale }) {
    const content = getTrlContent(locale);
    const ui = getTrlUiStrings(locale);
    const isRtl = content.dir === "rtl";

    const [step, setStep] = useState<"intro" | "questions" | "lead" | "result">("intro");
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [answers, setAnswers] = useState<TrlAnswers>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<TrlResult | null>(null);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const currentPhase = content.phases[currentPhaseIndex];
    const currentLevels = currentPhase.levels.map((l) => content.levels[l - 1]);

    const answerOptions = [
        { value: 0, label: ui.answerNo },
        { value: 1, label: ui.answerPartially },
        { value: 2, label: ui.answerYes },
    ];

    const NextArrow = isRtl ? ArrowLeft : ArrowRight;
    const PrevArrow = isRtl ? ArrowRight : ArrowLeft;

    const handleAnswer = (criterionId: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [criterionId]: value }));
    };

    const handleNext = () => {
        if (currentPhaseIndex < content.phases.length - 1) {
            setCurrentPhaseIndex((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            setStep("lead");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevious = () => {
        if (currentPhaseIndex > 0) {
            setCurrentPhaseIndex((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleCalculateResult = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsCalculating(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const finalResult = calculateTrl(answers, locale);

        fetch("/api/tool-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toolId: "trl-assessment", score: finalResult.score }),
        }).catch(() => {});

        if (email) {
            try {
                await fetch("/api/leads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email.trim(),
                        name: name.trim() || undefined,
                        toolId: "trl-assessment",
                        score: finalResult.score,
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
        setCurrentPhaseIndex(0);
        setStep("intro");
        setResult(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const isCurrentPhaseComplete = () =>
        currentLevels.every((level) => level.criteria.every((c) => answers[c.id] !== undefined));

    const answeredCount = Object.keys(answers).length;
    const progressPercentage = (answeredCount / TOTAL_CRITERIA) * 100;

    if (step === "intro") {
        return (
            <div dir={content.dir} className="max-w-3xl mx-auto text-center space-y-8 py-12 px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#D97706]/5 text-[#D97706] text-xs font-bold uppercase tracking-widest">
                    {ui.badge}
                </div>
                <h1 className="font-serif text-4xl sm:text-6xl leading-[1.15] text-[#0F3F35]">
                    {ui.introTitleLead}{" "}
                    <span className="text-[#D97706]">{ui.introTitleAccent}</span>
                </h1>
                <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
                    {ui.introBody}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-start">
                    {content.phases.map((phase, i) => (
                        <div key={phase.id} className="bg-white border border-stone-200 rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 end-0 w-16 h-16 bg-[#0F3F35]/5 rounded-bl-full" />
                            <div className="text-xs font-mono uppercase tracking-widest text-[#D97706] mb-2">{phase.trlRange}</div>
                            <div className="font-bold text-[#0F3F35]">{phase.title}</div>
                            <div className="text-xs text-stone-500 mt-2 leading-relaxed">{phase.description}</div>
                            <div className="w-6 h-1 bg-[#D97706] mt-4" style={{ width: `${(i + 1) * 16}px` }} />
                        </div>
                    ))}
                </div>
                <div className="pt-4">
                    <button
                        onClick={() => setStep("questions")}
                        className="inline-flex items-center gap-2 h-14 px-10 text-lg font-bold rounded-full bg-[#0F3F35] text-white hover:bg-[#0F3F35]/90 transition-all duration-300 hover:scale-105"
                    >
                        {ui.startButton}
                        <Play className={cn("w-5 h-5", isRtl && "rotate-180")} />
                    </button>
                    <p className="text-sm text-stone-500 mt-4">{ui.durationLine}</p>
                    <p className="text-xs text-stone-400 mt-2 max-w-xl mx-auto leading-relaxed">
                        {ui.honestyNote}
                    </p>
                </div>
            </div>
        );
    }

    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} locale={locale} />;
    }

    if (step === "lead") {
        return (
            <div dir={content.dir} className="max-w-xl mx-auto bg-white border border-stone-200 shadow-xl rounded-3xl p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                <h2 className="font-serif text-3xl text-[#0F3F35] mb-3">{ui.leadTitle}</h2>
                <p className="text-stone-600 mb-8 leading-relaxed">{ui.leadBody}</p>

                <form onSubmit={handleCalculateResult} className="space-y-4 text-start">
                    <div className="space-y-2">
                        <label htmlFor="trl-name" className="text-sm font-medium text-stone-700">{ui.nameLabel}</label>
                        <input
                            id="trl-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3F35] focus:border-transparent transition-all"
                            placeholder={ui.namePlaceholder}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="trl-email" className="text-sm font-medium text-stone-700">{ui.emailLabel}</label>
                        <input
                            id="trl-email"
                            type="email"
                            dir="ltr"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cn(
                                "flex h-12 w-full rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3F35] focus:border-transparent transition-all",
                                isRtl && "text-right placeholder:text-left"
                            )}
                            placeholder={ui.emailPlaceholder}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isCalculating}
                        className="w-full h-14 text-lg font-bold rounded-xl mt-6 bg-[#0F3F35] text-white hover:bg-[#0F3F35]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
                    >
                        {isCalculating ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                {ui.generating}
                            </>
                        ) : (
                            ui.submit
                        )}
                    </button>
                    <p className="text-xs text-stone-400 text-center mt-4">{ui.noSpam}</p>
                </form>
            </div>
        );
    }

    // "questions" step
    return (
        <div dir={content.dir} className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* Progress Header */}
            <div className="sticky top-0 z-10 bg-[#FDFBF7]/90 backdrop-blur-md pt-4 pb-4 border-b border-stone-200">
                <div className="flex justify-between text-sm font-medium text-stone-500 mb-2">
                    <span>{ui.phaseOf(currentPhaseIndex + 1, content.phases.length)}</span>
                    <span className="text-[#D97706] font-bold">{ui.completed(Math.round(progressPercentage))}</span>
                </div>
                <Progress value={progressPercentage} className="h-2 [&>div]:bg-[#0F3F35]" />
                <h2 className="font-serif text-3xl text-[#0F3F35] mt-6">
                    {currentPhase.title} <span className="text-stone-400 text-xl font-sans">({currentPhase.trlRange})</span>
                </h2>
                <p className="text-sm text-stone-500 mt-1">{currentPhase.description}</p>
            </div>

            {/* Levels & Criteria */}
            <div className="space-y-12 pt-4">
                {currentLevels.map((level) => (
                    <div key={level.level} className="space-y-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-mono uppercase tracking-widest text-white bg-[#0F3F35] px-2.5 py-1 rounded">TRL {level.level}</span>
                            <h3 className="text-xl font-bold text-[#1C1917]">{level.name}</h3>
                        </div>
                        <p className="text-sm text-stone-500 leading-relaxed border-s-2 border-[#D97706]/40 ps-3">{level.startupTranslation}</p>
                        <div className="space-y-4">
                            {level.criteria.map((c, index) => (
                                <CriterionCard
                                    key={c.id}
                                    index={index}
                                    criterion={c}
                                    value={answers[c.id]}
                                    onChange={(val) => handleAnswer(c.id, val)}
                                    options={answerOptions}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-200">
                <button
                    onClick={handlePrevious}
                    disabled={currentPhaseIndex === 0}
                    className="inline-flex items-center gap-2 text-stone-500 hover:text-[#0F3F35] disabled:opacity-40 disabled:cursor-not-allowed font-medium px-4 py-2 transition-colors"
                >
                    <PrevArrow className="w-4 h-4" />
                    {ui.previous}
                </button>

                <button
                    onClick={handleNext}
                    disabled={!isCurrentPhaseComplete()}
                    className="inline-flex items-center gap-2 rounded-full px-8 h-12 font-bold bg-[#0F3F35] text-white hover:bg-[#0F3F35]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {currentPhaseIndex === content.phases.length - 1 ? ui.finish : ui.nextPhase}
                    <NextArrow className="w-4 h-4" />
                </button>
            </div>

        </div>
    );
}
