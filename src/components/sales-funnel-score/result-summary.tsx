"use client";

import { FinalResult } from "@/data/sales-funnel-score/logic";
import { Meter, ResultList, ScoreRing, StepIn, ToolButton } from "@/components/v3/tool-kit";
import { ArrowRight, Copy, Check, Target } from "lucide-react";
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
            `Sales Funnel Health Score: ${result.totalScore}/100`,
            `Health Level: ${result.healthLevel}`,
            "",
            result.summarySentence,
            "",
            ...(result.primaryLeakStage ? [`⚠ Primary Leak Stage: ${result.primaryLeakStage}`, ""] : []),
            "— Funnel Breakdown —",
            ...result.categoryResults.map((c) => `${c.title}: ${c.score}/${c.maxScore}`),
            "",
            "— Funnel Bottlenecks —",
            ...result.bottlenecks.map((b) => `• [${b.stage}] ${b.title}`),
            "",
            "— Recommended Improvements —",
            ...result.recommendations.map((r, i) => `${i + 1}. ${r}`),
        ].join("\n");

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    return (
        <div className="flex flex-col gap-16 py-8 md:py-12">

            {/* ── Headline Score ──────────────────────────────────────────────── */}
            <StepIn className="flex flex-col items-center gap-6 text-center">
                <p className="text-sm text-v3-light">Sales Funnel Health Score</p>
                <ScoreRing score={result.totalScore} max={100} />
                <h2 className="font-v3-display text-4xl font-light leading-tight md:text-5xl rtl:leading-snug">{result.healthLevel}</h2>
                <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{result.summarySentence}</p>

                {/* Primary leak badge */}
                {result.primaryLeakStage && (
                    <p className="inline-flex items-center gap-2 rounded-full border border-v3-light/70 px-4 py-2 text-sm font-medium text-v3-light">
                        <Target className="h-4 w-4" aria-hidden />
                        Primary Leak: {result.primaryLeakStage}
                    </p>
                )}
            </StepIn>

            {/* ── Funnel Breakdown ───────────────────────────────────────────── */}
            <section className="flex flex-col gap-6">
                <h3 className="font-v3-display text-2xl font-light">Funnel Breakdown</h3>
                <div className="flex flex-col gap-6">
                    {result.categoryResults.map((cat) => (
                        <Meter
                            key={cat.categoryId}
                            label={cat.title}
                            value={cat.score}
                            max={cat.maxScore}
                            display={`${cat.score} / ${cat.maxScore}`}
                        />
                    ))}
                </div>
            </section>

            {/* ── Strengths + Bottlenecks ────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
                <ResultList
                    title="Funnel Strengths"
                    tone="strength"
                    items={result.strengths.map((s) => ({ title: s.title, body: s.description }))}
                />
                <ResultList
                    title="Funnel Bottlenecks"
                    tone="risk"
                    items={result.bottlenecks.map((b) => ({
                        title: (
                            <>
                                <span className="mb-1 block text-xs font-normal text-v3-light">{b.stage}</span>
                                {b.title}
                            </>
                        ),
                        body: b.description,
                    }))}
                />
            </div>

            {/* ── Recommended Improvements ─────────────────────────────────────── */}
            <section className="rounded-3xl border border-v3-line/80 bg-v3-raise p-7 md:p-10">
                <h3 className="mb-3 font-v3-display text-3xl font-light">Recommended Improvements</h3>
                <p className="mb-8 max-w-xl leading-relaxed text-v3-soft rtl:leading-loose">Focus on these specific actions to fix the biggest leaks and increase conversions — without necessarily generating more leads.</p>

                <ol className="mb-10 flex flex-col">
                    {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-5 border-b border-v3-line/60 py-5 last:border-b-0">
                            <span className="w-6 shrink-0 font-v3-display text-2xl leading-none text-v3-light">
                                {i + 1}
                            </span>
                            <p className="leading-relaxed text-v3-soft rtl:leading-loose">{rec}</p>
                        </li>
                    ))}
                </ol>

                {/* CTA */}
                <div className="flex flex-col gap-6 border-t border-v3-line pt-8">
                    <div>
                        <h4 className="mb-1 text-lg font-medium text-v3-bone">Want a full sales funnel audit?</h4>
                        <p className="text-sm text-v3-mute">Get a tailored session to diagnose your specific funnel gaps and build a conversion improvement plan.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/booking"
                            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink"
                        >
                            Book Funnel Audit
                            <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden />
                        </Link>
                        <ToolButton variant="secondary" onClick={handleCopy}>
                            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                            <span aria-live="polite">{copied ? "Copied" : "Copy Results"}</span>
                        </ToolButton>
                        <ToolButton variant="quiet" onClick={onReset}>
                            Retake Assessment
                        </ToolButton>
                    </div>
                </div>
            </section>
        </div>
    );
}
