"use client"

// ============================================================================
// File Path: src/app/(public)/tools/impossible-trinity-simulator/simulator-client.tsx
// Why: The Impossible Trinity simulator in the v3 "Light" look. Restyle only:
//      the three sliders, the thresholds, the crash timing and every word are
//      as they were. The stress bar and slider fills are framer-motion scales
//      (no inline widths), the glitch shake is framer-motion and is skipped
//      under reduced motion. Shared by /tools and /fa/tools; `locale` only
//      keeps the internal links inside the visitor's locale.
// Env / Identity: Client Component
// ============================================================================

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ShieldAlert, TrendingUp, Zap, Activity, RefreshCcw, AlertTriangle, ArrowLeft, ArrowRight, Target, Bot } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '@/components/home/v3/copy';
import { localePath } from '@/lib/nav';
import { ToolShell, StepIn, ToolButton } from '@/components/v3/tool-kit';

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** A range input in v3: a hairline track, a fill of light, a bone thumb. */
function V3Slider({
    id,
    value,
    onChange,
    disabled,
    labelledBy,
}: {
    id: string;
    value: number;
    onChange: (v: number) => void;
    disabled: boolean;
    labelledBy: string;
}) {
    const reduce = useReducedMotion();
    return (
        <div className="relative flex h-6 items-center">
            <div aria-hidden className="absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-v3-line">
                <motion.div
                    className={`absolute inset-y-0 start-0 w-full origin-left rounded-full rtl:origin-right ${disabled ? 'bg-v3-mute' : 'bg-v3-light'}`}
                    initial={false}
                    animate={{ scaleX: value / 100 }}
                    transition={reduce ? { duration: 0 } : { type: 'tween', duration: 0.15, ease: 'easeOut' }}
                />
            </div>
            <input
                type="range"
                id={id}
                min="0"
                max="100"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                disabled={disabled}
                aria-labelledby={labelledBy}
                aria-valuetext={`${value}%`}
                className="relative h-6 w-full cursor-pointer appearance-none bg-transparent focus:outline-none disabled:cursor-not-allowed
                    [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:bg-transparent
                    [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-v3-ink [&::-webkit-slider-thumb]:bg-v3-bone [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(232,196,138,0.5)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
                    active:[&::-webkit-slider-thumb]:scale-125 active:[&::-webkit-slider-thumb]:bg-v3-light
                    focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-v3-light/50
                    disabled:[&::-webkit-slider-thumb]:bg-v3-mute disabled:[&::-webkit-slider-thumb]:shadow-none
                    [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:bg-transparent
                    [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-v3-ink [&::-moz-range-thumb]:bg-v3-bone [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(232,196,138,0.5)]
                    active:[&::-moz-range-thumb]:bg-v3-light
                    focus-visible:[&::-moz-range-thumb]:ring-4 focus-visible:[&::-moz-range-thumb]:ring-v3-light/50
                    disabled:[&::-moz-range-thumb]:bg-v3-mute"
            />
        </div>
    );
}

export default function ImpossibleTrinitySimulator({ locale = "en" }: { locale?: Locale }) {
    const [profit, setProfit] = useState(50);
    const [safety, setSafety] = useState(50);
    const [speed, setSpeed] = useState(50);
    const [isCrashed, setIsCrashed] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const reduce = useReducedMotion();

    const CRITICAL_POINT = 220;
    const DANGER_ZONE = 180;
    const WARNING_ZONE = 150;
    const total = profit + safety + speed;

    useEffect(() => {
        if (total >= CRITICAL_POINT && !isCrashed) {
            setIsGlitching(true);
            const timer = setTimeout(() => {
                setIsGlitching(false);
                setIsCrashed(true);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [total, isCrashed]);

    const resetSystem = () => {
        setIsCrashed(false);
        setIsGlitching(false);
        setProfit(50);
        setSafety(50);
        setSpeed(50);
    };

    const percentage = Math.min((total / CRITICAL_POINT) * 100, 100);

    let pressureBarClass = 'absolute inset-y-0 start-0 w-full origin-left rounded-full rtl:origin-right transition-colors duration-500 ';
    let statusBoxClass = 'mt-10 p-5 rounded-xl border transition-colors duration-300 ';
    let statusTextClass = 'text-sm leading-relaxed font-medium ';
    let statusText = '';
    let mainCardClass = 'relative w-full max-w-xl mx-auto bg-v3-raise border rounded-3xl p-8 md:p-10 transition-[border-color,box-shadow,scale] duration-300 ';
    let totalPillClass = '';

    if (total > DANGER_ZONE) {
        pressureBarClass += 'bg-v3-light shadow-[0_0_14px_rgba(232,196,138,0.9)]';
        statusBoxClass += 'bg-v3-light/10 border-v3-light';
        statusText = 'CRITICAL WARNING: Unsustainable pressure on the team. Complete project collapse is imminent!';
        statusTextClass += 'text-v3-light font-bold';
        mainCardClass += 'border-v3-light shadow-[0_0_60px_-10px_rgba(232,196,138,0.45)] scale-[1.02] ';
        totalPillClass = 'bg-v3-light text-v3-ink';
    } else if (total > WARNING_ZONE) {
        pressureBarClass += 'bg-v3-light/70';
        statusBoxClass += 'bg-v3-light/5 border-v3-light/40';
        statusText = 'Quality degradation detected. Resources are stretched, but the project is moving forward.';
        statusTextClass += 'text-v3-light';
        mainCardClass += 'border-v3-light/40 shadow-[0_40px_120px_-60px_rgba(232,196,138,0.35)] ';
        totalPillClass = 'border border-v3-light/50 text-v3-light';
    } else {
        pressureBarClass += 'bg-v3-soft';
        statusBoxClass += 'bg-v3-ink border-v3-line';
        statusText = 'Equilibrium maintained. The project scope is safe and logical.';
        statusTextClass += 'text-v3-soft';
        mainCardClass += 'border-v3-line/80 shadow-[0_40px_120px_-60px_rgba(232,196,138,0.2)] ';
        totalPillClass = 'border border-v3-line text-v3-soft';
    }

    const href = (p: string) => localePath(locale, p);

    const sliders = [
        { id: 'profit', label: 'Profit Margin', icon: TrendingUp, value: profit, set: setProfit },
        { id: 'safety', label: 'Risk Mitigation', icon: ShieldAlert, value: safety, set: setSafety },
        { id: 'speed', label: 'Execution Velocity', icon: Zap, value: speed, set: setSpeed },
    ];

    const cardLink = 'group relative flex flex-col rounded-3xl border border-v3-line/80 p-8 transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 hover:bg-v3-raise focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light';
    const iconBox = 'mb-6 flex size-12 items-center justify-center rounded-xl border border-v3-line bg-v3-raise text-v3-light transition-colors duration-500 group-hover:border-v3-light/60';
    const arrowCls = 'w-4 h-4 text-v3-light transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1';

    return (
        <ToolShell>
            <div className="space-y-12">
                {/* Back Button */}
                <StepIn>
                    <Link href={href('/tools')} className="inline-flex items-center gap-2 text-v3-mute hover:text-v3-light transition-colors font-medium text-sm group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light rounded">
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1" aria-hidden />
                        Back to Tools Library
                    </Link>
                </StepIn>

                {/* Simulator Card */}
                <StepIn delay={0.08}>
                    <motion.div
                        className={mainCardClass}
                        animate={
                            isGlitching && !reduce
                                ? { x: [0, -5, -5, 5, 5, 0], y: [0, 5, -5, 5, -5, 0], rotate: [0, -1, 1, -1, 1, 0] }
                                : { x: 0, y: 0, rotate: 0 }
                        }
                        transition={isGlitching && !reduce ? { duration: 0.2, ease: 'easeInOut', repeat: Infinity } : { duration: 0.2 }}
                    >
                        <AnimatePresence>
                            {isCrashed && (
                                <motion.div
                                    key="crash"
                                    role="alertdialog"
                                    aria-labelledby="trinity-crash-title"
                                    className="absolute inset-0 z-50 bg-v3-ink/95 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md rounded-3xl border border-v3-light/60"
                                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.3, ease: ARRIVE }}
                                >
                                    <AlertTriangle className="w-20 h-20 text-v3-light mb-6 drop-shadow-[0_0_15px_rgba(232,196,138,0.8)]" aria-hidden />
                                    <h2 id="trinity-crash-title" className="text-4xl md:text-5xl font-v3-display font-light text-v3-bone mb-4 tracking-tight">
                                        System Collapsed
                                    </h2>
                                    <p className="text-v3-soft text-lg mb-10 max-w-sm leading-relaxed">
                                        You demanded the impossible. The framework shattered under compounding constraints before reaching deployment.
                                    </p>
                                    <ToolButton onClick={resetSystem} autoFocus>
                                        <RefreshCcw className="w-5 h-5 transition-transform duration-500 group-hover:-rotate-180" aria-hidden />
                                        Reboot with Logic
                                    </ToolButton>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="text-center mb-10">
                            <p className="text-sm text-v3-light mb-4">
                                Interactive Diagnostic
                            </p>
                            <h1 className="font-v3-display font-light text-3xl md:text-4xl leading-tight text-v3-bone mb-3">
                                Impossible Trinity <em className="text-v3-light not-italic ltr:italic">Simulator</em>
                            </h1>
                            <p className="text-v3-soft text-sm md:text-base max-w-sm mx-auto">
                                Break the constraints, but anticipate the consequences.
                            </p>
                        </div>

                        <div className="mb-10 bg-v3-ink p-6 rounded-2xl border border-v3-line/80">
                            <div className="flex justify-between items-center text-xs font-bold mb-3">
                                <span className="text-v3-mute uppercase tracking-wider flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-v3-light" aria-hidden />
                                    Structural Stress
                                </span>
                                <span className={`tabular-nums tracking-widest px-2 py-1 rounded-md transition-colors duration-300 ${totalPillClass}`} dir="ltr" aria-live="polite">
                                    {total} / {CRITICAL_POINT}
                                </span>
                            </div>
                            <div
                                className="relative h-2 w-full bg-v3-line rounded-full overflow-hidden"
                                role="meter"
                                aria-label="Structural Stress"
                                aria-valuemin={0}
                                aria-valuemax={CRITICAL_POINT}
                                aria-valuenow={Math.min(total, CRITICAL_POINT)}
                            >
                                <motion.div
                                    className={pressureBarClass}
                                    initial={false}
                                    animate={{ scaleX: percentage / 100 }}
                                    transition={reduce ? { duration: 0 } : { duration: 0.5, ease: ARRIVE }}
                                />
                            </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                            {sliders.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div key={s.id} className="group">
                                        <div className="flex justify-between items-center mb-3">
                                            <label id={`${s.id}-label`} htmlFor={s.id} className="text-v3-bone font-bold text-sm flex items-center gap-2">
                                                <Icon className="w-4 h-4 text-v3-light" aria-hidden />
                                                {s.label}
                                            </label>
                                            <span className="tabular-nums font-bold bg-v3-ink text-v3-bone px-3 py-1 rounded-lg text-sm min-w-[3.5rem] text-center border border-v3-line transition-colors group-hover:border-v3-light/50" dir="ltr">
                                                {s.value}%
                                            </span>
                                        </div>
                                        <V3Slider id={s.id} value={s.value} onChange={s.set} disabled={isCrashed} labelledBy={`${s.id}-label`} />
                                    </div>
                                );
                            })}
                        </div>

                        <div className={statusBoxClass}>
                            <h3 className="text-xs font-bold text-v3-mute mb-2 uppercase tracking-wider flex items-center gap-2">
                                Real-time Diagnostics
                            </h3>
                            <p className={statusTextClass} aria-live="polite">
                                {statusText}
                            </p>
                        </div>
                    </motion.div>
                </StepIn>

                {/* Philosophy Section */}
                <StepIn delay={0.16}>
                    <div className="border border-v3-line/80 rounded-3xl p-8 md:p-10">
                        <h2 className="font-v3-display font-light text-2xl md:text-3xl text-v3-bone mb-6">The Philosophy of Constraints</h2>
                        <p className="text-v3-soft leading-relaxed text-sm md:text-base mb-4">
                            In engineering and business logic, the <strong className="text-v3-bone">Impossible Trinity</strong> dictates that you can optimize for only two of three constraints: <strong className="text-v3-light">Speed</strong>, <strong className="text-v3-light">Safety</strong>, and <strong className="text-v3-light">Profit</strong>.
                        </p>
                        <p className="text-v3-soft leading-relaxed text-sm md:text-base">
                            When clients or stakeholders demand all three simultaneously—zero risk, maximum speed, and aggressive cost-cutting—the structural integrity of the project breaks down. This simulator visualizes the compounding pressure that leads to system collapse. True engineering leadership is having the courage to define trade-offs, not ignoring them.
                        </p>
                    </div>
                </StepIn>

                {/* Other Tools Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StepIn delay={0.2}>
                        <Link href={href('/tools/npi-assessment')} className={cardLink}>
                            <div className={iconBox}>
                                <Target className="w-5 h-5" aria-hidden />
                            </div>
                            <h3 className="font-v3-display text-xl text-v3-bone mb-2 leading-tight transition-colors group-hover:text-v3-light">NPI Brand Assessment</h3>
                            <p className="text-v3-soft text-sm mb-6 leading-relaxed">Evaluate the 3 core pillars of your brand: Narrative, Presence, and Impact.</p>
                            <div className="mt-auto flex items-center justify-between text-v3-bone font-medium text-sm border-t border-v3-line/70 pt-5">
                                <span className="group-hover:text-v3-light transition-colors">Diagnose Brand</span>
                                <ArrowRight className={arrowCls} aria-hidden />
                            </div>
                        </Link>
                    </StepIn>

                    <StepIn delay={0.28}>
                        <Link href={href('/tools/ai-adoption-score')} className={cardLink}>
                            <div className={iconBox}>
                                <Bot className="w-5 h-5" aria-hidden />
                            </div>
                            <h3 className="font-v3-display text-xl text-v3-bone mb-2 leading-tight transition-colors group-hover:text-v3-light">AI Adoption Readiness</h3>
                            <p className="text-v3-soft text-sm mb-6 leading-relaxed">Determine if your business is structurally ready for true AI integration.</p>
                            <div className="mt-auto flex items-center justify-between text-v3-bone font-medium text-sm border-t border-v3-line/70 pt-5">
                                <span className="group-hover:text-v3-light transition-colors">Take Assessment</span>
                                <ArrowRight className={arrowCls} aria-hidden />
                            </div>
                        </Link>
                    </StepIn>
                </div>

                {/* Most Read Articles */}
                <StepIn delay={0.32}>
                    <div className="border border-v3-line/80 rounded-3xl p-8 md:p-10">
                        <h2 className="font-v3-display font-light text-2xl text-v3-bone mb-6">Trending Insights</h2>
                        <div className="space-y-3">
                            {[
                                { tag: 'Engineering Systems', title: "Why Your MVP is Over-Engineered by Developers Who've Never Sold Anything" },
                                { tag: 'Leadership', title: 'The True Cost of Avoiding Hard Technical Conversations with Clients' },
                                { tag: 'Business Models', title: 'Stop Selling Features, Start Selling Leverage and Reliability' },
                            ].map((a) => (
                                <Link
                                    key={a.title}
                                    href="/blog"
                                    className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-5 rounded-2xl border border-transparent transition-colors hover:bg-v3-raise hover:border-v3-line group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                                >
                                    <div className="mb-2 md:mb-0">
                                        <span className="text-[10px] font-bold tracking-widest text-v3-light uppercase mb-2 block">{a.tag}</span>
                                        <h4 className="font-bold text-v3-bone group-hover:text-v3-light transition-colors">{a.title}</h4>
                                    </div>
                                    <span className="shrink-0 text-xs font-bold text-v3-mute flex items-center gap-1 group-hover:text-v3-light transition-colors">
                                        Read Article <ArrowRight className="w-3 h-3 rtl:-scale-x-100" aria-hidden />
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </StepIn>
            </div>
        </ToolShell>
    );
}
