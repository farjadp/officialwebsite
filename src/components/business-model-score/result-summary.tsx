"use client";

import { BmsLocale } from "@/data/business-model-score/config";
import { FinalResult } from "@/data/business-model-score/logic";
import { getBmsUiStrings } from "@/data/business-model-score/ui";
import { Meter, ResultList, ScoreRing, StepIn, ToolButton } from "@/components/v3/tool-kit";
import { localePath } from "@/lib/nav";
import { ArrowRight, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ResultSummaryProps {
    result: FinalResult;
    onReset: () => void;
    locale?: BmsLocale;
}

export function ResultSummary({ result, onReset, locale = "en" }: ResultSummaryProps) {
    const ui = getBmsUiStrings(locale);
    const isRtl = locale === "fa";
    const CtaArrow = isRtl ? ArrowLeft : ArrowRight;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const text = [
            ui.copyScoreLine(result.totalScore),
            ui.copyLevelLine(result.healthLevel),
            "",
            result.summarySentence,
            "",
            ui.copyCategoriesHeading,
            ...result.categoryResults.map((c) => `${c.title}: ${c.score}/${c.maxScore}`),
            "",
            ui.copyRisksHeading,
            ...result.weaknesses.map((w) => `• ${w.title}`),
            "",
            ui.copyNextStepsHeading,
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
                <p className="text-sm text-v3-light">{ui.resultKicker}</p>
                <ScoreRing locale={locale} score={result.totalScore} max={100} />
                <h2 className="font-v3-display text-3xl font-light leading-tight text-v3-bone md:text-4xl rtl:leading-snug">
                    {result.healthLevel}
                </h2>
                <p className="max-w-2xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{result.summarySentence}</p>
            </StepIn>


            {/* ── Readiness Breakdown ─────────────────────────────────────────── */}
            <section className="flex flex-col gap-6 rounded-2xl border border-v3-line/80 bg-v3-raise p-7 md:p-8">
                <h3 className="font-v3-display text-2xl font-light">{ui.breakdownTitle}</h3>
                <div className="flex flex-col gap-6">
                    {result.categoryResults.map((cat) => (
                        <Meter locale={locale} key={cat.categoryId} label={cat.title} value={cat.score} max={cat.maxScore} />
                    ))}
                </div>
            </section>

            {/* ── Strengths + Gaps ────────────────────────────────────────────── */}
            <ResultList
                title={ui.strengthsTitle}
                tone="strength"
                items={result.strengths.map((s) => ({ title: s.title, body: s.description }))}
            />
            <ResultList
                title={ui.risksTitle}
                tone="risk"
                items={result.weaknesses.map((w) => ({ title: w.title, body: w.description }))}
            />


            {/* ── Recommended Next Steps ──────────────────────────────────────── */}
            <section className="flex flex-col gap-8 rounded-3xl border border-v3-line/80 bg-v3-raise p-7 shadow-[0_40px_120px_-60px_rgba(232,196,138,0.35)] md:p-10">
                <div className="flex flex-col gap-2">
                    <h3 className="font-v3-display text-3xl font-light leading-tight rtl:leading-snug">{ui.nextStepsTitle}</h3>
                    <p className="max-w-xl leading-relaxed text-v3-soft rtl:leading-loose">{ui.nextStepsBody}</p>
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
                        <h4 className="text-lg font-medium text-v3-bone">{ui.ctaTitle}</h4>
                        <p className="text-sm text-v3-mute">{ui.ctaBody}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <ToolButton variant="secondary" onClick={onReset}>
                            {ui.retake}
                        </ToolButton>
                        <ToolButton variant="secondary" onClick={handleCopy} aria-live="polite">
                            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                            {copied ? ui.copied : ui.copy}
                        </ToolButton>
                        <Link
                            href={localePath(locale, "/booking")}
                            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink"
                        >
                            {ui.ctaButton}
                            <CtaArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
