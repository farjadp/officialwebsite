"use client"

// ============================================================================
// File Path: src/app/(public)/tools/impossible-trinity-simulator/simulator-client.tsx
// Why: The Impossible Trinity simulator in the v3 "Light" look. Restyle only:
//      the three sliders, the thresholds, the crash timing and every word are
//      as they were. The stress bar and slider fills are framer-motion scales
//      (no inline widths), the glitch shake is framer-motion and is skipped
//      under reduced motion. Shared by /tools and /fa/tools: `locale` picks
//      the strings below AND keeps the internal links inside the visitor's
//      locale. The thresholds, the crash timing and the maths are identical
//      in both languages.
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

// ── Copy ──────────────────────────────────────────────────────────────────────
// Every visible word of the simulator, per locale. The Persian side is
// written, not translated word for word: formal but human, Persian digits,
// no em dashes.

interface TrinityStrings {
    backToTools: string;
    kicker: string;
    titleLead: string;
    titleAccent: string;
    tagline: string;
    stressLabel: string;
    diagnosticsLabel: string;
    statusCritical: string;
    statusWarning: string;
    statusStable: string;
    crashTitle: string;
    crashBody: string;
    reboot: string;
    sliderProfit: string;
    sliderSafety: string;
    sliderSpeed: string;
    philosophyTitle: string;
    philosophyLeadIn: string;
    philosophyTrinity: string;
    philosophyMiddle: string;
    constraintSpeed: string;
    constraintSafety: string;
    constraintProfit: string;
    philosophyTail: string;
    philosophyBody: string;
    npiTitle: string;
    npiBody: string;
    npiCta: string;
    aiTitle: string;
    aiBody: string;
    aiCta: string;
    trendingTitle: string;
    readArticle: string;
    articles: { tag: string; title: string }[];
}

const COPY: Record<Locale, TrinityStrings> = {
    en: {
        backToTools: 'Back to Tools Library',
        kicker: 'Interactive Diagnostic',
        titleLead: 'Impossible Trinity',
        titleAccent: 'Simulator',
        tagline: 'Break the constraints, but anticipate the consequences.',
        stressLabel: 'Structural Stress',
        diagnosticsLabel: 'Real-time Diagnostics',
        statusCritical: 'CRITICAL WARNING: Unsustainable pressure on the team. Complete project collapse is imminent!',
        statusWarning: 'Quality degradation detected. Resources are stretched, but the project is moving forward.',
        statusStable: 'Equilibrium maintained. The project scope is safe and logical.',
        crashTitle: 'System Collapsed',
        crashBody: 'You demanded the impossible. The framework shattered under compounding constraints before reaching deployment.',
        reboot: 'Reboot with Logic',
        sliderProfit: 'Profit Margin',
        sliderSafety: 'Risk Mitigation',
        sliderSpeed: 'Execution Velocity',
        philosophyTitle: 'The Philosophy of Constraints',
        philosophyLeadIn: 'In engineering and business logic, the ',
        philosophyTrinity: 'Impossible Trinity',
        philosophyMiddle: ' dictates that you can optimize for only two of three constraints: ',
        constraintSpeed: 'Speed',
        constraintSafety: 'Safety',
        constraintProfit: 'Profit',
        philosophyTail: '.',
        philosophyBody: 'When clients or stakeholders demand all three simultaneously—zero risk, maximum speed, and aggressive cost-cutting—the structural integrity of the project breaks down. This simulator visualizes the compounding pressure that leads to system collapse. True engineering leadership is having the courage to define trade-offs, not ignoring them.',
        npiTitle: 'NPI Brand Assessment',
        npiBody: 'Evaluate the 3 core pillars of your brand: Narrative, Presence, and Impact.',
        npiCta: 'Diagnose Brand',
        aiTitle: 'AI Adoption Readiness',
        aiBody: 'Determine if your business is structurally ready for true AI integration.',
        aiCta: 'Take Assessment',
        trendingTitle: 'Trending Insights',
        readArticle: 'Read Article',
        articles: [
            { tag: 'Engineering Systems', title: "Why Your MVP is Over-Engineered by Developers Who've Never Sold Anything" },
            { tag: 'Leadership', title: 'The True Cost of Avoiding Hard Technical Conversations with Clients' },
            { tag: 'Business Models', title: 'Stop Selling Features, Start Selling Leverage and Reliability' },
        ],
    },
    fa: {
        backToTools: 'بازگشت به کتابخانه‌ی ابزارها',
        kicker: 'ابزار تشخیصی تعاملی',
        titleLead: 'شبیه‌ساز',
        titleAccent: 'مثلث ناممکن',
        tagline: 'محدودیت‌ها را بشکنید، اما عاقبتش را از پیش ببینید.',
        stressLabel: 'فشار ساختاری',
        diagnosticsLabel: 'تشخیص لحظه‌ای',
        statusCritical: 'هشدار بحرانی: فشار روی تیم غیرقابل‌تحمل شده است. فروپاشی کامل پروژه نزدیک است!',
        statusWarning: 'افت کیفیت دیده می‌شود. منابع تا مرز کشش رفته‌اند، اما پروژه هنوز جلو می‌رود.',
        statusStable: 'تعادل برقرار است. دامنه‌ی پروژه امن و منطقی است.',
        crashTitle: 'سیستم فروپاشید',
        crashBody: 'چیزی خواستید که شدنی نبود. ساختار زیر فشار محدودیت‌های روی‌هم‌انباشته، پیش از رسیدن به استقرار شکست.',
        reboot: 'راه‌اندازی دوباره، این بار با منطق',
        sliderProfit: 'حاشیه‌ی سود',
        sliderSafety: 'کاهش ریسک',
        sliderSpeed: 'سرعت اجرا',
        philosophyTitle: 'فلسفه‌ی محدودیت‌ها',
        philosophyLeadIn: 'در مهندسی و منطق کسب‌وکار، ',
        philosophyTrinity: 'مثلث ناممکن',
        philosophyMiddle: ' می‌گوید فقط می‌توانید دو تا از سه محدودیت را بهینه کنید: ',
        constraintSpeed: 'سرعت',
        constraintSafety: 'ایمنی',
        constraintProfit: 'سود',
        philosophyTail: '.',
        philosophyBody: 'وقتی مشتری یا ذی‌نفع هر سه را هم‌زمان می‌خواهد (ریسک صفر، بیشترین سرعت و فشار تهاجمی روی هزینه)، انسجام ساختاری پروژه از هم می‌پاشد. این شبیه‌ساز همان فشار روی‌هم‌انباشته را نشان می‌دهد که کار را به فروپاشی می‌رساند. رهبری فنی واقعی یعنی جرئت تعریف کردن بده‌بستان‌ها، نه نادیده گرفتن آن‌ها.',
        npiTitle: 'ارزیابی برند NPI',
        npiBody: 'سه ستون اصلی برندتان را بسنجید: روایت، حضور و اثرگذاری.',
        npiCta: 'تشخیص برند',
        aiTitle: 'آمادگی پذیرش هوش مصنوعی',
        aiBody: 'ببینید کسب‌وکارتان از نظر ساختاری برای یکپارچه‌سازی واقعی هوش مصنوعی آماده است یا نه.',
        aiCta: 'شروع ارزیابی',
        trendingTitle: 'یادداشت‌های پرخواننده',
        readArticle: 'خواندن یادداشت',
        articles: [
            { tag: 'سیستم‌های مهندسی', title: 'چرا MVP شما را توسعه‌دهندگانی بیش از حد مهندسی کرده‌اند که هرگز چیزی نفروخته‌اند' },
            { tag: 'رهبری', title: 'هزینه‌ی واقعی فرار از گفت‌وگوهای فنی سخت با مشتری' },
            { tag: 'مدل کسب‌وکار', title: 'فروش ویژگی را کنار بگذارید؛ اهرم و اتکاپذیری بفروشید' },
        ],
    },
};

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
    const t = COPY[locale] ?? COPY.en;

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
    let statusTextClass = 'text-sm leading-relaxed rtl:leading-loose font-medium ';
    let statusText = '';
    let mainCardClass = 'relative w-full max-w-xl mx-auto bg-v3-raise border rounded-3xl p-8 md:p-10 transition-[border-color,box-shadow,scale] duration-300 ';
    let totalPillClass = '';

    if (total > DANGER_ZONE) {
        pressureBarClass += 'bg-v3-light shadow-[0_0_14px_rgba(232,196,138,0.9)]';
        statusBoxClass += 'bg-v3-light/10 border-v3-light';
        statusText = t.statusCritical;
        statusTextClass += 'text-v3-light font-bold';
        mainCardClass += 'border-v3-light shadow-[0_0_60px_-10px_rgba(232,196,138,0.45)] scale-[1.02] ';
        totalPillClass = 'bg-v3-light text-v3-ink';
    } else if (total > WARNING_ZONE) {
        pressureBarClass += 'bg-v3-light/70';
        statusBoxClass += 'bg-v3-light/5 border-v3-light/40';
        statusText = t.statusWarning;
        statusTextClass += 'text-v3-light';
        mainCardClass += 'border-v3-light/40 shadow-[0_40px_120px_-60px_rgba(232,196,138,0.35)] ';
        totalPillClass = 'border border-v3-light/50 text-v3-light';
    } else {
        pressureBarClass += 'bg-v3-soft';
        statusBoxClass += 'bg-v3-ink border-v3-line';
        statusText = t.statusStable;
        statusTextClass += 'text-v3-soft';
        mainCardClass += 'border-v3-line/80 shadow-[0_40px_120px_-60px_rgba(232,196,138,0.2)] ';
        totalPillClass = 'border border-v3-line text-v3-soft';
    }

    const href = (p: string) => localePath(locale, p);

    const sliders = [
        { id: 'profit', label: t.sliderProfit, icon: TrendingUp, value: profit, set: setProfit },
        { id: 'safety', label: t.sliderSafety, icon: ShieldAlert, value: safety, set: setSafety },
        { id: 'speed', label: t.sliderSpeed, icon: Zap, value: speed, set: setSpeed },
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
                        {t.backToTools}
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
                                        {t.crashTitle}
                                    </h2>
                                    <p className="text-v3-soft text-lg mb-10 max-w-sm leading-relaxed rtl:leading-loose">
                                        {t.crashBody}
                                    </p>
                                    <ToolButton onClick={resetSystem} autoFocus>
                                        <RefreshCcw className="w-5 h-5 transition-transform duration-500 group-hover:-rotate-180" aria-hidden />
                                        {t.reboot}
                                    </ToolButton>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="text-center mb-10">
                            <p className="text-sm text-v3-light mb-4">
                                {t.kicker}
                            </p>
                            <h1 className="font-v3-display font-light text-3xl md:text-4xl leading-tight text-v3-bone mb-3">
                                {t.titleLead} <em className="text-v3-light not-italic ltr:italic">{t.titleAccent}</em>
                            </h1>
                            <p className="text-v3-soft text-sm md:text-base max-w-sm mx-auto">
                                {t.tagline}
                            </p>
                        </div>

                        <div className="mb-10 bg-v3-ink p-6 rounded-2xl border border-v3-line/80">
                            <div className="flex justify-between items-center text-xs font-bold mb-3">
                                <span className="text-v3-mute uppercase tracking-wider flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-v3-light" aria-hidden />
                                    {t.stressLabel}
                                </span>
                                <span className={`tabular-nums tracking-widest px-2 py-1 rounded-md transition-colors duration-300 ${totalPillClass}`} dir="ltr" aria-live="polite">
                                    {total} / {CRITICAL_POINT}
                                </span>
                            </div>
                            <div
                                className="relative h-2 w-full bg-v3-line rounded-full overflow-hidden"
                                role="meter"
                                aria-label={t.stressLabel}
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
                                {t.diagnosticsLabel}
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
                        <h2 className="font-v3-display font-light text-2xl md:text-3xl text-v3-bone mb-6">{t.philosophyTitle}</h2>
                        <p className="text-v3-soft leading-relaxed text-sm md:text-base mb-4 rtl:leading-loose">
                            {t.philosophyLeadIn}<strong className="text-v3-bone">{t.philosophyTrinity}</strong>{t.philosophyMiddle}<strong className="text-v3-light">{t.constraintSpeed}</strong>{locale === 'fa' ? '، ' : ', '}<strong className="text-v3-light">{t.constraintSafety}</strong>{locale === 'fa' ? ' و ' : ', and '}<strong className="text-v3-light">{t.constraintProfit}</strong>{t.philosophyTail}
                        </p>
                        <p className="text-v3-soft leading-relaxed text-sm md:text-base rtl:leading-loose">
                            {t.philosophyBody}
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
                            <h3 className="font-v3-display text-xl text-v3-bone mb-2 leading-tight transition-colors group-hover:text-v3-light">{t.npiTitle}</h3>
                            <p className="text-v3-soft text-sm mb-6 leading-relaxed rtl:leading-loose">{t.npiBody}</p>
                            <div className="mt-auto flex items-center justify-between text-v3-bone font-medium text-sm border-t border-v3-line/70 pt-5">
                                <span className="group-hover:text-v3-light transition-colors">{t.npiCta}</span>
                                <ArrowRight className={arrowCls} aria-hidden />
                            </div>
                        </Link>
                    </StepIn>

                    <StepIn delay={0.28}>
                        <Link href={href('/tools/ai-adoption-score')} className={cardLink}>
                            <div className={iconBox}>
                                <Bot className="w-5 h-5" aria-hidden />
                            </div>
                            <h3 className="font-v3-display text-xl text-v3-bone mb-2 leading-tight transition-colors group-hover:text-v3-light">{t.aiTitle}</h3>
                            <p className="text-v3-soft text-sm mb-6 leading-relaxed rtl:leading-loose">{t.aiBody}</p>
                            <div className="mt-auto flex items-center justify-between text-v3-bone font-medium text-sm border-t border-v3-line/70 pt-5">
                                <span className="group-hover:text-v3-light transition-colors">{t.aiCta}</span>
                                <ArrowRight className={arrowCls} aria-hidden />
                            </div>
                        </Link>
                    </StepIn>
                </div>

                {/* Most Read Articles */}
                <StepIn delay={0.32}>
                    <div className="border border-v3-line/80 rounded-3xl p-8 md:p-10">
                        <h2 className="font-v3-display font-light text-2xl text-v3-bone mb-6">{t.trendingTitle}</h2>
                        <div className="space-y-3">
                            {t.articles.map((a) => (
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
                                        {t.readArticle} <ArrowRight className="w-3 h-3 rtl:-scale-x-100" aria-hidden />
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
