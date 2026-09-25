// ============================================================================
// UI strings for the Sales Funnel Health Score components, per locale.
// Same shape as src/data/trl-assessment/ui.ts: the components read strings
// from here and never hold a sentence of their own.
// ============================================================================

import { SalesFunnelLocale } from "./config";

/** ۰۱۲۳۴۵۶۷۸۹ — Persian prose uses Persian digits. */
export function faDigits(input: string | number): string {
    return String(input).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export interface SalesFunnelUiStrings {
    /** Digit shaping for numbers rendered inside this locale's chrome. */
    num: (value: string | number) => string;

    // Intro
    kicker: string;
    titleLead: string;
    titleAccent: string;
    lead: string;
    stats: { label: string; sub: string }[];
    startButton: string;
    meta: string;

    // Questions
    stageLabel: (current: number, total: number) => string;
    percentLabel: (percent: number) => string;
    scaleLabels: [string, string, string, string, string];
    previous: string;
    nextStage: string;
    complete: string;

    // Lead step
    leadTitle: string;
    leadBody: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    skip: string;
    skipping: string;
    noSpam: string;

    // Result
    resultKicker: string;
    primaryLeak: (stage: string) => string;
    breakdownTitle: string;
    strengthsTitle: string;
    bottlenecksTitle: string;
    recommendationsTitle: string;
    recommendationsBody: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    ctaHref: string;
    copy: string;
    copied: string;
    retake: string;

    // Clipboard export
    copyScoreLine: (score: number) => string;
    copyLevelLine: (level: string) => string;
    copyLeakLine: (stage: string) => string;
    copyBreakdownHeading: string;
    copyBottlenecksHeading: string;
    copyRecommendationsHeading: string;
}

const en: SalesFunnelUiStrings = {
    num: (v) => String(v),

    kicker: "Sales Diagnostic Tool",
    titleLead: "Sales Funnel",
    titleAccent: "Health Score",
    lead: "Find out exactly where your funnel is leaking revenue. Most businesses don't have a lead problem — they have a conversion problem. This diagnostic shows you which stage is costing you the most.",
    stats: [
        { label: "6 Stages", sub: "From lead gen to closing" },
        { label: "30 Questions", sub: "Covering the full sales cycle" },
        { label: "4–5 Minutes", sub: "Instant funnel bottleneck report" },
    ],
    startButton: "Diagnose My Funnel",
    meta: "Free • No login required",

    stageLabel: (c, t) => `Stage ${c} / ${t}`,
    percentLabel: (p) => `${p}% complete`,
    scaleLabels: ["Not true at all", "Mostly false", "Partly true", "Mostly true", "Completely true"],
    previous: "Previous",
    nextStage: "Next Stage",
    complete: "Complete Diagnostic",

    leadTitle: "Your funnel report is ready",
    leadBody: "Leave your email to receive a copy of your sales funnel diagnostic report. Completely optional — you can skip directly to your results.",
    nameLabel: "Name (optional)",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    submit: "Get My Funnel Report",
    submitting: "Analyzing Funnel...",
    skip: "Skip and view results directly →",
    skipping: "Calculating...",
    noSpam: "No spam. No sales calls. Unsubscribe any time.",

    resultKicker: "Sales Funnel Health Score",
    primaryLeak: (stage) => `Primary Leak: ${stage}`,
    breakdownTitle: "Funnel Breakdown",
    strengthsTitle: "Funnel Strengths",
    bottlenecksTitle: "Funnel Bottlenecks",
    recommendationsTitle: "Recommended Improvements",
    recommendationsBody: "Focus on these specific actions to fix the biggest leaks and increase conversions — without necessarily generating more leads.",
    ctaTitle: "Want a full sales funnel audit?",
    ctaBody: "Get a tailored session to diagnose your specific funnel gaps and build a conversion improvement plan.",
    ctaButton: "Book Funnel Audit",
    ctaHref: "/booking",
    copy: "Copy Results",
    copied: "Copied",
    retake: "Retake Assessment",

    copyScoreLine: (s) => `Sales Funnel Health Score: ${s}/100`,
    copyLevelLine: (l) => `Health Level: ${l}`,
    copyLeakLine: (stage) => `⚠ Primary Leak Stage: ${stage}`,
    copyBreakdownHeading: "— Funnel Breakdown —",
    copyBottlenecksHeading: "— Funnel Bottlenecks —",
    copyRecommendationsHeading: "— Recommended Improvements —",
};

const fa: SalesFunnelUiStrings = {
    num: faDigits,

    kicker: "ابزار تشخیص فروش",
    titleLead: "امتیاز سلامت",
    titleAccent: "قیف فروش",
    lead: "دقیقاً ببینید قیف فروش شما کجا درآمد را نشت می‌دهد. بیشتر کسب‌وکارها مشکل مشتری بالقوه ندارند؛ مشکل تبدیل دارند. این ابزار تشخیصی نشان می‌دهد کدام مرحله بیشترین هزینه را به شما تحمیل می‌کند.",
    stats: [
        { label: "۶ مرحله", sub: "از جذب مشتری بالقوه تا بستن معامله" },
        { label: "۳۰ پرسش", sub: "پوشش کل چرخه‌ی فروش" },
        { label: "۴ تا ۵ دقیقه", sub: "گزارش فوری گلوگاه قیف" },
    ],
    startButton: "قیف من را تشخیص بده",
    meta: "رایگان • بدون نیاز به ورود",

    stageLabel: (c, t) => `مرحله‌ی ${faDigits(c)} از ${faDigits(t)}`,
    percentLabel: (p) => `${faDigits(p)}٪ تکمیل‌شده`,
    scaleLabels: ["اصلاً درست نیست", "بیشتر نادرست است", "تا حدی درست است", "بیشتر درست است", "کاملاً درست است"],
    previous: "قبلی",
    nextStage: "مرحله‌ی بعد",
    complete: "پایان تشخیص",

    leadTitle: "گزارش قیف شما آماده است",
    leadBody: "اگر می‌خواهید نسخه‌ای از گزارش تشخیص قیف فروش‌تان را دریافت کنید، ایمیل‌تان را بگذارید. کاملاً اختیاری است؛ می‌توانید مستقیم به نتیجه بروید.",
    nameLabel: "نام (اختیاری)",
    namePlaceholder: "نام شما",
    emailLabel: "ایمیل",
    emailPlaceholder: "you@company.com",
    submit: "گزارش قیف من را بده",
    submitting: "در حال تحلیل قیف...",
    skip: "رد کن و مستقیم نتیجه را ببین ←",
    skipping: "در حال محاسبه...",
    noSpam: "بدون هرزنامه. بدون تماس فروش. هر وقت خواستید لغو عضویت کنید.",

    resultKicker: "امتیاز سلامت قیف فروش",
    primaryLeak: (stage) => `نشت اصلی: ${stage}`,
    breakdownTitle: "تفکیک قیف",
    strengthsTitle: "نقطه‌های قوت قیف",
    bottlenecksTitle: "گلوگاه‌های قیف",
    recommendationsTitle: "بهبودهای پیشنهادی",
    recommendationsBody: "روی همین کارهای مشخص تمرکز کنید تا بزرگ‌ترین نشت‌ها بسته شود و تبدیل بالا برود، بی‌آنکه لزوماً مشتری بالقوه‌ی بیشتری جذب کنید.",
    ctaTitle: "ممیزی کامل قیف فروش می‌خواهید؟",
    ctaBody: "یک جلسه‌ی اختصاصی بگیرید تا شکاف‌های دقیق قیف‌تان را تشخیص دهیم و برنامه‌ی بهبود نرخ تبدیل بسازیم.",
    ctaButton: "رزرو ممیزی قیف فروش",
    ctaHref: "/fa/booking",
    copy: "کپی نتیجه",
    copied: "کپی شد",
    retake: "ارزیابی دوباره",

    copyScoreLine: (s) => `امتیاز سلامت قیف فروش: ${faDigits(s)} از ۱۰۰`,
    copyLevelLine: (l) => `وضعیت قیف: ${l}`,
    copyLeakLine: (stage) => `⚠ نشت اصلی: ${stage}`,
    copyBreakdownHeading: "تفکیک قیف:",
    copyBottlenecksHeading: "گلوگاه‌های قیف:",
    copyRecommendationsHeading: "بهبودهای پیشنهادی:",
};

export function getSalesFunnelUiStrings(locale: SalesFunnelLocale): SalesFunnelUiStrings {
    return locale === "fa" ? fa : en;
}
