// UI strings for the Business Model Strength Score components, per locale.
// English is copied verbatim out of the components; Persian is the translation.

import { BmsLocale } from "./config";

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
/** 42 → ۴۲. Used only inside the Persian strings. */
function fd(n: number | string): string {
    return String(n).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

export interface BmsStatItem {
    label: string;
    sub: string;
}

export interface BmsUiStrings {
    // Intro
    kicker: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
    meta: string;
    stats: BmsStatItem[];
    startButton: string;

    // Questions
    sectionLabel: (current: number, total: number) => string;
    percentLabel: (percent: number) => string;
    scaleLabels: [string, string, string, string, string];
    previous: string;
    nextSection: string;
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
    privacyNote: string;

    // Result chrome
    resultKicker: string;
    breakdownTitle: string;
    strengthsTitle: string;
    risksTitle: string;
    nextStepsTitle: string;
    nextStepsBody: string;
    ctaTitle: string;
    ctaBody: string;
    retake: string;
    copy: string;
    copied: string;
    ctaButton: string;

    // Copy-to-clipboard report
    copyScoreLine: (score: number) => string;
    copyLevelLine: (level: string) => string;
    copyCategoriesHeading: string;
    copyRisksHeading: string;
    copyNextStepsHeading: string;
}

const en: BmsUiStrings = {
    kicker: "Diagnostic Tool",
    titleLine1: "Business Model",
    titleLine2: "Strength Score",
    lead: "A structured diagnostic to evaluate whether your business model is logical, revenue-capable, scalable, and defensible. No hype. No generic advice.",
    meta: "Free • No login required",
    stats: [
        { label: "6 Categories", sub: "Covering all critical dimensions" },
        { label: "30 Questions", sub: "Calibrated for early-stage businesses" },
        { label: "4–6 Minutes", sub: "Full diagnostic in one session" },
    ],
    startButton: "Begin Evaluation",

    sectionLabel: (c, t) => `Section ${c} / ${t}`,
    percentLabel: (p) => `${p}% complete`,
    scaleLabels: [
        "Not true at all",
        "Mostly not true",
        "Partly true",
        "Mostly true",
        "Completely true",
    ],
    previous: "Previous",
    nextSection: "Next Section",
    complete: "Complete Evaluation",

    leadTitle: "Your results are ready",
    leadBody: "Leave your email to receive a copy of your diagnostic report. Entirely optional — you can skip directly to your results.",
    nameLabel: "Name (optional)",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "founder@company.com",
    submit: "Get My Score",
    submitting: "Calculating Score...",
    skip: "Skip and view results directly →",
    skipping: "Calculating...",
    privacyNote: "No spam. No sales calls. Unsubscribe any time.",

    resultKicker: "Business Model Strength Score",
    breakdownTitle: "Category Breakdown",
    strengthsTitle: "What Is Working",
    risksTitle: "Structural Risks",
    nextStepsTitle: "Recommended Next Steps",
    nextStepsBody: "Focus on these actions to strengthen the weakest parts of your model before scaling.",
    ctaTitle: "Want a deeper business model review?",
    ctaBody: "Book a strategy session to audit your model and build a plan.",
    retake: "Retake Assessment",
    copy: "Copy Results",
    copied: "Copied",
    ctaButton: "Book Strategy Session",

    copyScoreLine: (s) => `Business Model Strength Score: ${s}/100`,
    copyLevelLine: (l) => `Health Level: ${l}`,
    copyCategoriesHeading: "— Category Scores —",
    copyRisksHeading: "— Structural Risks —",
    copyNextStepsHeading: "— Recommended Next Steps —",
};

const fa: BmsUiStrings = {
    kicker: "ابزار تشخیصی",
    titleLine1: "امتیاز استحکام",
    titleLine2: "مدل کسب‌وکار",
    lead: "یک سنجش ساختارمند برای اینکه ببینید مدل کسب‌وکارتان منطقی، درآمدزا، مقیاس‌پذیر و قابل دفاع است یا نه. بدون هیاهو، بدون توصیه‌ی کلی.",
    meta: "رایگان • بدون نیاز به ورود",
    stats: [
        { label: "۶ محور", sub: "پوشش همه‌ی ابعاد حیاتی" },
        { label: "۳۰ پرسش", sub: "تنظیم‌شده برای کسب‌وکارهای نوپا" },
        { label: "۴ تا ۶ دقیقه", sub: "سنجش کامل در یک نشست" },
    ],
    startButton: "شروع ارزیابی",

    sectionLabel: (c, t) => `بخش ${fd(c)} از ${fd(t)}`,
    percentLabel: (p) => `${fd(p)}٪ تکمیل‌شده`,
    scaleLabels: [
        "اصلاً درست نیست",
        "بیشتر درست نیست",
        "تا حدی درست است",
        "بیشتر درست است",
        "کاملاً درست است",
    ],
    previous: "قبلی",
    nextSection: "بخش بعدی",
    complete: "پایان ارزیابی",

    leadTitle: "نتیجه‌ی شما آماده است",
    leadBody: "ایمیل‌تان را بگذارید تا نسخه‌ای از گزارش تشخیصی برایتان بیاید. کاملاً اختیاری است؛ می‌توانید مستقیم به نتیجه بروید.",
    nameLabel: "نام (اختیاری)",
    namePlaceholder: "نام شما",
    emailLabel: "ایمیل",
    emailPlaceholder: "founder@company.com",
    submit: "دریافت امتیاز من",
    submitting: "در حال محاسبه‌ی امتیاز...",
    skip: "← رفتن مستقیم به نتیجه",
    skipping: "در حال محاسبه...",
    privacyNote: "بدون اسپم. بدون تماس فروش. هر زمان خواستید لغو اشتراک کنید.",

    resultKicker: "امتیاز استحکام مدل کسب‌وکار",
    breakdownTitle: "تفکیک محورها",
    strengthsTitle: "آنچه کار می‌کند",
    risksTitle: "ریسک‌های ساختاری",
    nextStepsTitle: "گام‌های بعدی پیشنهادی",
    nextStepsBody: "پیش از مقیاس دادن، روی این کارها تمرکز کنید تا ضعیف‌ترین بخش‌های مدل‌تان محکم شود.",
    ctaTitle: "بازبینی عمیق‌تر مدل کسب‌وکار می‌خواهید؟",
    ctaBody: "یک جلسه‌ی استراتژی رزرو کنید تا مدل‌تان را بررسی کنیم و برنامه بسازیم.",
    retake: "ارزیابی دوباره",
    copy: "کپی نتایج",
    copied: "کپی شد",
    ctaButton: "رزرو جلسه‌ی استراتژی",

    copyScoreLine: (s) => `امتیاز استحکام مدل کسب‌وکار: ${fd(s)}/۱۰۰`,
    copyLevelLine: (l) => `سطح سلامت: ${l}`,
    copyCategoriesHeading: "امتیاز هر محور:",
    copyRisksHeading: "ریسک‌های ساختاری:",
    copyNextStepsHeading: "گام‌های بعدی پیشنهادی:",
};

export function getBmsUiStrings(locale: BmsLocale): BmsUiStrings {
    return locale === "fa" ? fa : en;
}
