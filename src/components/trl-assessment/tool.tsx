"use client";

import { useState } from "react";
import { trlPhases, trlLevels, TOTAL_CRITERIA, TrlCriterion } from "@/data/trl-assessment/config";
import { TrlAnswers, calculateTrl, TrlResult } from "@/data/trl-assessment/logic";
import { ResultSummary } from "./result-summary";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const evidenceOptions = [
    { value: 0, label: "No" },
    { value: 1, label: "Partially" },
    { value: 2, label: "Yes, with evidence" },
];

function CriterionCard({
    criterion,
    index,
    value,
    onChange,
}: {
    criterion: TrlCriterion;
    index: number;
    value: number | undefined;
    onChange: (value: number) => void;
}) {
    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
            <h4 className="text-base sm:text-lg font-medium text-slate-800 mb-4">
                <span className="text-slate-400 mr-2">{index + 1}.</span>
                {criterion.text}
            </h4>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {evidenceOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex items-center justify-center p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-center text-sm font-medium",
                            value === option.value
                                ? "border-primary bg-primary/5 text-primary scale-[1.02]"
                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function TrlAssessmentTool() {
    const [step, setStep] = useState<"intro" | "questions" | "lead" | "result">("intro");
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
    const [answers, setAnswers] = useState<TrlAnswers>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [result, setResult] = useState<TrlResult | null>(null);

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const currentPhase = trlPhases[currentPhaseIndex];
    const currentLevels = currentPhase.levels.map((l) => trlLevels[l - 1]);

    const handleAnswer = (criterionId: string, value: number) => {
        setAnswers((prev) => ({ ...prev, [criterionId]: value }));
    };

    const handleNext = () => {
        if (currentPhaseIndex < trlPhases.length - 1) {
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

        const finalResult = calculateTrl(answers);

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
            <div className="max-w-3xl mx-auto text-center space-y-8 py-12 px-6">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                    Technology Readiness Level (TRL) Assessment
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Locate your technology on the NASA 1–9 readiness scale — the same scale government innovation programs use to decide what to fund. Answer evidence questions, get your TRL, the gaps to the next level, and the funding context for your stage.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
                    {trlPhases.map((phase) => (
                        <div key={phase.id} className="bg-white border border-slate-200 rounded-xl p-4">
                            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">{phase.trlRange}</div>
                            <div className="font-semibold text-slate-800 text-sm">{phase.title}</div>
                            <div className="text-xs text-slate-500 mt-1 leading-snug">{phase.description}</div>
                        </div>
                    ))}
                </div>
                <div className="pt-4">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full" onClick={() => setStep("questions")}>
                        Start Free Assessment
                        <Play className="ml-2 w-5 h-5" />
                    </Button>
                    <p className="text-sm text-slate-500 mt-4">Takes about 4-6 minutes • 27 evidence checks</p>
                    <p className="text-xs text-slate-400 mt-2 max-w-xl mx-auto">
                        Answer honestly and only claim &quot;Yes&quot; where you could show the evidence to a reviewer. TRL is a ladder — skipped levels don&apos;t count.
                    </p>
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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing your evidence...</h2>
                <p className="text-slate-600 mb-8">
                    Your TRL has been calculated. Enter your info below to see your level, the gaps to the next one, and the funding context for your stage.
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
                            placeholder="Grace"
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
                            placeholder="grace@deeptech.co"
                        />
                    </div>

                    <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-xl mt-6" disabled={isCalculating || !email}>
                        {isCalculating ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generating Report...
                            </>
                        ) : (
                            "Reveal My TRL & Roadmap"
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
                    <span>Phase {currentPhaseIndex + 1} of {trlPhases.length}</span>
                    <span className="text-primary">{Math.round(progressPercentage)}% Completed</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <h2 className="text-2xl font-bold text-slate-900 mt-6">{currentPhase.title} <span className="text-slate-400 font-normal">({currentPhase.trlRange})</span></h2>
                <p className="text-sm text-slate-500 mt-1">{currentPhase.description}</p>
            </div>

            {/* Levels & Criteria */}
            <div className="space-y-10 pt-4">
                {currentLevels.map((level) => (
                    <div key={level.level} className="space-y-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">TRL {level.level}</span>
                            <h3 className="text-xl font-bold text-slate-900">{level.name}</h3>
                        </div>
                        <p className="text-sm text-slate-500 italic">{level.startupTranslation}</p>
                        <div className="space-y-4">
                            {level.criteria.map((c, index) => (
                                <CriterionCard
                                    key={c.id}
                                    index={index}
                                    criterion={c}
                                    value={answers[c.id]}
                                    onChange={(val) => handleAnswer(c.id, val)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <Button
                    variant="ghost"
                    onClick={handlePrevious}
                    disabled={currentPhaseIndex === 0}
                    className="text-slate-500"
                >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Previous
                </Button>

                <Button
                    onClick={handleNext}
                    disabled={!isCurrentPhaseComplete()}
                    className="rounded-full px-8"
                >
                    {currentPhaseIndex === trlPhases.length - 1 ? "Finish Assessment" : "Next Phase"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>

        </div>
    );
}
