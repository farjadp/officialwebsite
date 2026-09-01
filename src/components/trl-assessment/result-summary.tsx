"use client";

import { useEffect, useState } from "react";
import { TrlResult, getTrlContent } from "@/data/trl-assessment/logic";
import { TrlLocale } from "@/data/trl-assessment/config";
import { getTrlUiStrings } from "@/data/trl-assessment/ui";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Landmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ResultSummaryProps {
    result: TrlResult;
    onReset: () => void;
    locale?: TrlLocale;
}

// Semicircle gauge geometry: arc of radius 90 from (10,105) to (190,105)
const GAUGE_ARC_LENGTH = Math.PI * 90;

function TrlGauge({ trl, label, outOfNine }: { trl: number; label: string; outOfNine: string }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const raf = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    const fraction = trl / 9;
    const offset = mounted ? GAUGE_ARC_LENGTH * (1 - fraction) : GAUGE_ARC_LENGTH;

    // 8 tick marks separating the 9 segments
    const ticks = Array.from({ length: 8 }, (_, i) => {
        const angle = Math.PI * (1 - (i + 1) / 9); // radians, from left (π) to right (0)
        const cx = 100 + 90 * Math.cos(angle);
        const cy = 105 - 90 * Math.sin(angle);
        return { cx, cy };
    });

    return (
        <div className="relative w-64 sm:w-80 mx-auto" dir="ltr">
            <svg viewBox="0 0 200 112" className="w-full overflow-visible">
                {/* Track */}
                <path
                    d="M10 105 A90 90 0 0 1 190 105"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="10"
                    strokeLinecap="round"
                />
                {/* Fill */}
                <path
                    d="M10 105 A90 90 0 0 1 190 105"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={GAUGE_ARC_LENGTH}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s" }}
                />
                {/* Segment ticks */}
                {ticks.map((t, i) => (
                    <circle key={i} cx={t.cx} cy={t.cy} r="2" fill="#0F3F35" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                ))}
            </svg>
            {/* Number in the middle of the arc */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-0">
                <div
                    className={cn(
                        "flex items-end gap-1 transition-all duration-700 delay-500",
                        mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-90"
                    )}
                >
                    <span className="font-serif text-5xl sm:text-7xl tracking-tight text-white leading-none">{label}</span>
                    {trl > 0 && <span className="text-lg sm:text-xl font-medium text-white/40 mb-1">{outOfNine}</span>}
                </div>
            </div>
        </div>
    );
}

function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const raf = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(raf);
    }, []);
    return mounted;
}

export function ResultSummary({ result, onReset, locale = "en" }: ResultSummaryProps) {
    const content = getTrlContent(locale);
    const ui = getTrlUiStrings(locale);
    const isRtl = content.dir === "rtl";
    const CtaArrow = isRtl ? ArrowLeft : ArrowRight;
    const mounted = useMounted();

    // Staggered section entrance
    const section = () =>
        cn(
            "transition-all duration-700 ease-out",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        );
    const sectionStyle = (delayMs: number) => ({ transitionDelay: `${delayMs}ms` });

    return (
        <div dir={content.dir} className="w-full max-w-4xl mx-auto space-y-8">

            {/* Hero: gauge + TRL on brand green */}
            <div className={cn("relative overflow-hidden text-center px-8 pt-10 pb-12 sm:px-14 sm:pt-14 rounded-3xl bg-[#0F3F35] text-white shadow-2xl", section())} style={sectionStyle(0)}>
                {/* Ambient decoration */}
                <div className="absolute -top-16 -end-16 w-56 h-56 rounded-full bg-white/5 animate-pulse [animation-duration:6s]" />
                <div className="absolute -bottom-24 -start-16 w-72 h-72 rounded-full bg-[#D97706]/10 animate-pulse [animation-duration:8s]" />
                <div className="absolute top-1/3 start-8 w-3 h-3 rounded-full bg-[#D97706]/40 animate-ping [animation-duration:3s]" />
                <div className="absolute top-1/4 end-10 w-2 h-2 rounded-full bg-white/30 animate-ping [animation-duration:4s]" />

                <div className="relative z-10">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D97706] mb-8">{ui.resultKicker}</p>

                    <TrlGauge trl={result.trl} label={result.trlLabel} outOfNine={ui.outOfNine} />

                    <h2 className={cn("text-2xl sm:text-3xl font-bold text-white mt-6 mb-3 transition-all duration-700", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: "900ms" }}>
                        {result.levelName}
                    </h2>
                    <p className={cn("text-sm text-white/50 italic max-w-2xl mx-auto mb-5 transition-opacity duration-700", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: "1100ms" }}>
                        {ui.nasaPrefix} {result.nasaDefinition}
                    </p>
                    <p className={cn("text-lg text-white/85 max-w-2xl mx-auto leading-relaxed transition-opacity duration-700", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: "1300ms" }}>
                        {result.summarySentence}
                    </p>
                </div>
            </div>

            {/* TRL Ladder */}
            <div className={cn("bg-white rounded-3xl border border-stone-200 p-6 sm:p-8", section())} style={sectionStyle(150)}>
                <h3 className="font-serif text-2xl text-[#0F3F35] mb-1">{ui.ladderTitle}</h3>
                <div className="w-8 h-1 bg-[#D97706] mb-6" />
                <div className="space-y-6">
                    {content.phases.map((phase) => (
                        <div key={phase.id}>
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="font-semibold text-[#1C1917]">{phase.title}</span>
                                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">{phase.trlRange}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {phase.levels.map((lvl) => {
                                    const lr = result.levelResults[lvl - 1];
                                    const isCurrent = lvl === result.trl;
                                    return (
                                        <div
                                            key={lvl}
                                            className={cn(
                                                "relative overflow-hidden rounded-xl border p-3 pb-4 text-center transition-all duration-500",
                                                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                                                isCurrent
                                                    ? "border-[#D97706] bg-[#D97706]/10 ring-2 ring-[#D97706]/30 shadow-lg shadow-[#D97706]/10"
                                                    : lr.achieved
                                                        ? "border-[#0F3F35]/20 bg-[#0F3F35]/5"
                                                        : "border-stone-100 bg-stone-50 opacity-60"
                                            )}
                                            style={{ transitionDelay: `${300 + lvl * 90}ms` }}
                                        >
                                            {isCurrent && (
                                                <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-[#D97706] animate-ping" />
                                            )}
                                            <div className={cn(
                                                "text-lg font-bold",
                                                isCurrent ? "text-[#B45309]" : lr.achieved ? "text-[#0F3F35]" : "text-stone-400"
                                            )}>
                                                {lvl}
                                            </div>
                                            <div className="text-[11px] leading-tight text-stone-500 mt-1">{lr.name}</div>
                                            <div className="text-[10px] font-mono text-stone-400 mt-1">{lr.percentage}%</div>
                                            {/* Evidence fill bar */}
                                            <div className="absolute bottom-0 inset-x-0 h-1 bg-stone-100">
                                                <div
                                                    className={cn("h-full", isCurrent ? "bg-[#D97706]" : lr.achieved ? "bg-[#0F3F35]" : "bg-stone-300")}
                                                    style={{
                                                        width: mounted ? `${lr.percentage}%` : "0%",
                                                        transition: `width 900ms cubic-bezier(0.22, 1, 0.36, 1) ${500 + lvl * 90}ms`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-stone-400 mt-5 leading-relaxed">{ui.ladderNote}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Gaps at working level */}
                <div className={cn("bg-[#D97706]/5 rounded-3xl border border-[#D97706]/20 p-6 sm:p-8", section())} style={sectionStyle(300)}>
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-[#D97706]" />
                        <h3 className="text-xl font-bold text-[#1C1917]">
                            {result.workingLevel ? ui.gapsTitle(result.workingLevel.level) : ui.gapsTitleDone}
                        </h3>
                    </div>
                    {result.workingLevel ? (
                        <>
                            <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                                {ui.gapsIntro(result.workingLevel.name)}
                            </p>
                            <ul className="space-y-3">
                                {(result.workingLevelGaps.length > 0 ? result.workingLevelGaps : [ui.gapsNone]).map((gap, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-stone-700 leading-relaxed">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                                        {gap}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="text-sm text-stone-600 leading-relaxed">{ui.gapsDoneBody}</p>
                    )}
                </div>

                {/* Funding context */}
                <div className={cn("bg-white rounded-3xl border border-stone-200 p-6 sm:p-8", section())} style={sectionStyle(400)}>
                    <div className="flex items-center gap-2 mb-4">
                        <Landmark className="w-5 h-5 text-[#0F3F35]" />
                        <h3 className="text-xl font-bold text-[#1C1917]">{ui.fundingTitle}</h3>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{result.fundingNote}</p>
                </div>
            </div>

            {/* Recommended Next Steps */}
            <div className={cn("relative overflow-hidden bg-[#0F3F35] rounded-3xl p-8 sm:p-12 text-white shadow-xl", section())} style={sectionStyle(500)}>
                <div className="absolute -top-20 -start-20 w-64 h-64 rounded-full bg-white/5" />
                <div className="relative z-10">
                    <h3 className="font-serif text-3xl mb-2">{ui.nextStepsTitle}</h3>
                    <p className="text-white/60 mb-8 max-w-2xl leading-relaxed">{ui.nextStepsSub}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {result.recommendations.map((rec, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4 transition-all duration-500 hover:bg-white/10 hover:border-[#D97706]/40",
                                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                                )}
                                style={{ transitionDelay: `${700 + i * 120}ms` }}
                            >
                                <div className="bg-[#D97706] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">
                                    {i + 1}
                                </div>
                                <p className="text-white/85 text-sm leading-relaxed">{rec}</p>
                            </div>
                        ))}
                    </div>

                    {/* TRL is not the whole picture */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-10 flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                        <div className="text-sm text-white/75 leading-relaxed">
                            <span className="font-semibold text-white">{ui.trlOnlyLead}</span>{" "}
                            {ui.trlOnlyBody}{" "}
                            <Link href={ui.startupReadinessHref} className="underline text-[#D97706] hover:text-white transition-colors">{ui.trlOnlyStartupLink}</Link>{" "}
                            {ui.trlOnlyAnd}{" "}
                            <Link href={ui.investorReadinessHref} className="underline text-[#D97706] hover:text-white transition-colors">{ui.trlOnlyInvestorLink}</Link>.
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
                        <div>
                            <h4 className="text-lg font-bold mb-1">{ui.ctaTitle}</h4>
                            <p className="text-sm text-white/60">{ui.ctaBody}</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Link
                                href={ui.contactHref}
                                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-[#0F3F35] font-bold hover:bg-stone-100 transition-all hover:scale-105 flex-1 sm:flex-none"
                            >
                                {ui.ctaButton}
                                <CtaArrow className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={onReset}
                                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[#D97706] text-white font-bold hover:bg-[#B45309] transition-all hover:scale-105 flex-1 sm:flex-none"
                            >
                                {ui.retake}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
