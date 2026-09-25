"use client";

import { FinalResult } from "@/data/ai-adoption-score/logic";
import { Meter, ResultList, ScoreRing, StepIn, ToolButton } from "@/components/v3/tool-kit";
import { ArrowRight, Copy, Check, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ResultSummaryProps {
    result: FinalResult;
    onReset: () => void;
}

export function ResultSummary({ result, onReset }: ResultSummaryProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = [
            `AI Adoption Readiness Score: ${result.totalScore}/100`,
            `Readiness Level: ${result.readinessLevel}`,
            "",
            result.summarySentence,
            "",
            ...(result.foundationWarning ? [`⚠ ${result.foundationWarning}`, ""] : []),
            "— Category Scores —",
            ...result.categoryResults.map((c) => `${c.title}: ${c.score}/${c.maxScore}`),
            "",
            "— Critical Gaps —",
            ...result.weaknesses.map((w) => `• ${w.title}`),
            "",
            "— Where AI Can Help First —",
            ...result.aiOpportunityAreas.map((a) => `• ${a.title}`),
            "",
            "— Recommended Next Steps —",
            ...result.recommendations.map((r, i) => `${i + 1}. ${r}`),
        ].join("\n");

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }).catch(() => { /* clipboard unavailable or denied — leave the button as is */ });
    };

    return (
        <div className="flex flex-col gap-10">

            {/* ── Headline Score ──────────────────────────────────────────────── */}
            <StepIn className="flex flex-col items-center gap-6 pt-4 text-center">
                <p className="text-sm text-v3-light">AI Adoption Readiness Score</p>
                <ScoreRing score={result.totalScore} max={100} />
                <h2 className="font-v3-display text-3xl font-light leading-tight text-v3-bone md:text-4xl rtl:leading-snug">
                    {result.readinessLevel}
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{result.summarySentence}</p>
            </StepIn>

            {/* ── Foundation Warning ──────────────────────────────────────────── */}
            {result.foundationWarning && (
                <StepIn delay={0.1} className="flex gap-4 rounded-2xl border border-v3-light/50 bg-v3-light/[0.06] p-6">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-v3-light" aria-hidden />
                    <p className="font-medium leading-relaxed text-v3-bone rtl:leading-loose">{result.foundationWarning}</p>
                </StepIn>
            )}

            {/* ── Readiness Breakdown ─────────────────────────────────────────── */}
            <section className="flex flex-col gap-6 rounded-2xl border border-v3-line/80 bg-v3-raise p-7 md:p-8">
                <h3 className="font-v3-display text-2xl font-light">Readiness Breakdown</h3>
                <div className="flex flex-col gap-6">
                    {result.categoryResults.map((cat) => (
                        <Meter key={cat.categoryId} label={cat.title} value={cat.score} max={cat.maxScore} />
                    ))}
                </div>
            </section>

            {/* ── Strengths + Gaps ────────────────────────────────────────────── */}
            <ResultList
                title="What Is Working"
                tone="strength"
                items={result.strengths.map((s) => ({ title: s.title, body: s.description }))}
            />
            <ResultList
                title="Critical Gaps"
                tone="risk"
                items={result.weaknesses.map((w) => ({ title: w.title, body: w.description }))}
            />

            {/* ── Where AI Can Help First ──────────────────────────────────── */}
            <section className="flex flex-col gap-6 rounded-2xl border border-v3-line/80 p-7 md:p-8">
                <div className="flex flex-col gap-1">
                    <h3 className="font-v3-display text-2xl font-light">Where AI Can Likely Help First</h3>
                    <span className="text-sm text-v3-mute">— based on your readiness signals</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {result.aiOpportunityAreas.map((area, i) => (
                        <div key={i} className="flex flex-col gap-2 rounded-xl border border-v3-line bg-v3-raise p-5">
                            <p className="font-medium text-v3-light">{area.title}</p>
                            <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">{area.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Recommended Next Steps ──────────────────────────────────────── */}
            <section className="flex flex-col gap-8 rounded-3xl border border-v3-line/80 bg-v3-raise p-7 shadow-[0_40px_120px_-60px_rgba(232,196,138,0.35)] md:p-10">
                <div className="flex flex-col gap-2">
                    <h3 className="font-v3-display text-3xl font-light leading-tight rtl:leading-snug">Recommended Next Steps</h3>
                    <p className="max-w-xl leading-relaxed text-v3-soft rtl:leading-loose">Before investing in AI tools or implementation, address these specific gaps to maximize your return and reduce execution risk.</p>
                </div>

                <ol className="flex flex-col">
                    {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-4 border-b border-v3-line/60 py-4 last:border-b-0">
                            <span className="w-6 shrink-0 font-v3-display text-xl leading-none text-v3-light tabular-nums">{i + 1}</span>
                            <p className="leading-relaxed text-v3-soft rtl:leading-loose">{rec}</p>
                        </li>
                    ))}
                </ol>

                {/* CTA */}
                <div className="flex flex-col gap-6 border-t border-v3-line pt-8">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-medium text-v3-bone">Need an AI readiness review?</h4>
                        <p className="text-sm text-v3-mute">Get a tailored AI strategy session based on your specific gaps and business context.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <ToolButton variant="secondary" onClick={onReset}>
                            Retake Assessment
                        </ToolButton>
                        <ToolButton variant="secondary" onClick={handleCopy} aria-live="polite">
                            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                            {copied ? "Copied" : "Copy Results"}
                        </ToolButton>
                        <Link
                            href="/booking"
                            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink"
                        >
                            Book AI Strategy Session
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" aria-hidden />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
