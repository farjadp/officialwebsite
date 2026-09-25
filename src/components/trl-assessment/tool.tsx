"use client";

// ============================================================================
// File Path: src/components/trl-assessment/tool.tsx
// Why: The TRL assessment flow (intro → three phases of evidence questions →
//      optional lead step → result) in the v3 "Light" look. Questions,
//      scoring, lead capture and usage tracking are unchanged — they live in
//      src/data/trl-assessment and the two fetch calls below.
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { TOTAL_CRITERIA, TrlLocale } from "@/data/trl-assessment/config";
import { TrlAnswers, calculateTrl, getTrlContent, TrlResult } from "@/data/trl-assessment/logic";
import { getTrlUiStrings } from "@/data/trl-assessment/ui";
import {
    QuestionBlock,
    ScaleOptions,
    StepIn,
    ToolButton,
    ToolField,
    ToolIntro,
    ToolPanel,
    ToolProgress,
} from "@/components/v3/tool-kit";
import { ResultSummary } from "./result-summary";

/** Jump back to the top of the tool; instant when the visitor asks for less motion. */
function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
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
            scrollToTop();
        } else {
            setStep("lead");
            scrollToTop();
        }
    };

    const handlePrevious = () => {
        if (currentPhaseIndex > 0) {
            setCurrentPhaseIndex((prev) => prev - 1);
            scrollToTop();
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
        scrollToTop();
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentPhaseIndex(0);
        setStep("intro");
        setResult(null);
        scrollToTop();
    };

    const isCurrentPhaseComplete = () =>
        currentLevels.every((level) => level.criteria.every((c) => answers[c.id] !== undefined));

    const answeredCount = Object.keys(answers).length;
    const progressPercentage = (answeredCount / TOTAL_CRITERIA) * 100;

    if (step === "intro") {
        return (
            <div dir={content.dir}>
                <ToolIntro
                    kicker={ui.badge}
                    title={
                        <>
                            {ui.introTitleLead}{" "}
                            <em className="text-v3-light not-italic ltr:italic">{ui.introTitleAccent}</em>
                        </>
                    }
                    lead={ui.introBody}
                    action={
                        <ToolButton onClick={() => setStep("questions")}>
                            {ui.startButton}
                            <Play className="h-4 w-4 rtl:rotate-180" aria-hidden />
                        </ToolButton>
                    }
                    meta={ui.durationLine}
                />
                <StepIn delay={0.32} className="flex flex-col gap-8 pb-8">
                    <ol className="grid gap-3 sm:grid-cols-3">
                        {content.phases.map((phase) => (
                            <li
                                key={phase.id}
                                className="flex flex-col gap-2 rounded-2xl border border-v3-line/80 bg-v3-raise p-5"
                            >
                                <span className="text-sm tabular-nums text-v3-light" dir="ltr">
                                    {phase.trlRange}
                                </span>
                                <span className="font-v3-display text-xl font-light text-v3-bone">{phase.title}</span>
                                <span className="text-sm leading-relaxed text-v3-mute rtl:leading-loose">
                                    {phase.description}
                                </span>
                            </li>
                        ))}
                    </ol>
                    <p className="max-w-2xl border-s border-v3-light/50 ps-4 text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                        {ui.honestyNote}
                    </p>
                </StepIn>
            </div>
        );
    }

    if (step === "result" && result) {
        return <ResultSummary result={result} onReset={handleReset} locale={locale} />;
    }

    if (step === "lead") {
        return (
            <div dir={content.dir} className="mx-auto max-w-xl py-8">
                <ToolPanel>
                    <h2 className="font-v3-display text-3xl font-light leading-tight rtl:leading-snug">{ui.leadTitle}</h2>
                    <p className="mt-3 leading-relaxed text-v3-soft rtl:leading-loose">{ui.leadBody}</p>

                    <form onSubmit={handleCalculateResult} className="mt-8 flex flex-col gap-5">
                        <ToolField
                            id="trl-name"
                            label={ui.nameLabel}
                            type="text"
                            autoComplete="given-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={ui.namePlaceholder}
                        />
                        <ToolField
                            id="trl-email"
                            label={ui.emailLabel}
                            type="email"
                            dir="ltr"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={ui.emailPlaceholder}
                        />

                        <ToolButton type="submit" loading={isCalculating} className="mt-3 w-full">
                            {isCalculating ? ui.generating : ui.submit}
                        </ToolButton>
                        <p className="text-center text-xs text-v3-mute">{ui.noSpam}</p>
                    </form>
                </ToolPanel>
            </div>
        );
    }

    // "questions" step
    return (
        <div dir={content.dir}>
            <ToolProgress
                label={ui.phaseOf(currentPhaseIndex + 1, content.phases.length)}
                percent={progressPercentage}
                percentLabel={ui.completed(Math.round(progressPercentage))}
                title={
                    <>
                        {currentPhase.title}{" "}
                        <span className="font-v3-body text-lg text-v3-mute" dir="ltr">
                            ({currentPhase.trlRange})
                        </span>
                    </>
                }
            />
            <p className="mt-4 text-sm leading-relaxed text-v3-mute rtl:leading-loose">{currentPhase.description}</p>

            <div className="flex flex-col gap-16 pt-10">
                {currentLevels.map((level) => (
                    <section key={level.level} aria-labelledby={`trl-level-${level.level}`}>
                        <StepIn className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-baseline gap-3">
                                <span className="rounded-full border border-v3-light/60 px-3 py-1 text-xs tabular-nums text-v3-light" dir="ltr">
                                    TRL {level.level}
                                </span>
                                <h3 id={`trl-level-${level.level}`} className="font-v3-display text-2xl font-light text-v3-bone">
                                    {level.name}
                                </h3>
                            </div>
                            <p className="border-s border-v3-light/40 ps-3 text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                                {level.startupTranslation}
                            </p>
                        </StepIn>
                        <div>
                            {level.criteria.map((c, index) => (
                                <QuestionBlock key={c.id} locale={locale} index={`${index + 1}.`} text={c.text}>
                                    <ScaleOptions
                                        locale={locale}
                                        options={answerOptions}
                                        value={answers[c.id]}
                                        onChange={(val) => handleAnswer(c.id, val)}
                                        label={c.text}
                                    />
                                </QuestionBlock>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between gap-4 border-t border-v3-line/70 pt-8">
                <ToolButton variant="quiet" onClick={handlePrevious} disabled={currentPhaseIndex === 0}>
                    <PrevArrow className="h-4 w-4" aria-hidden />
                    {ui.previous}
                </ToolButton>

                <ToolButton onClick={handleNext} disabled={!isCurrentPhaseComplete()}>
                    {currentPhaseIndex === content.phases.length - 1 ? ui.finish : ui.nextPhase}
                    <NextArrow className="h-4 w-4" aria-hidden />
                </ToolButton>
            </div>
        </div>
    );
}
