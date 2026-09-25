// UI strings for the AI Adoption Readiness Score components, per locale.
// English is copied verbatim out of the components; Persian is the translation.

import { AiLocale } from "./config";

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
/** 42 → ۴۲. Used only inside the Persian strings. */
function fd(n: number | string): string {
    return String(n).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

export interface AiStatItem {
    label: string;
    sub: string;
}

export interface AiUiStrings {
    // Intro
    kicker: string;
    titleLine1: string;
    titleLine2: string;
    lead: string;
    meta: string;
    stats: AiStatItem[];
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
    gapsTitle: string;
    opportunitiesTitle: string;
    opportunitiesNote: string;
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
    copyGapsHeading: string;
    copyOpportunitiesHeading: string;
    copyNextStepsHeading: string;
}

const en: AiUiStrings = {
    kicker: "AI Readiness Diagnostic",
    titleLine1: "AI Adoption",
    titleLine2: "Readiness Score",
    lead: "Find out whether your business is structurally ready to adopt AI — or whether you still need foundational work before investing. Honest. Diagnostic. No hype.",
    meta: "Free • No login required",
    stats: [
        { label: "6 Dimensions", sub: "Business, data, team, tech & more" },
        { label: "30 Questions", sub: "Covering real implementation factors" },
        { label: "4–6 Minutes", sub: "Instant diagnostic with action plan" },
    ],
    startButton: "Begin Assessment",

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
    complete: "Complete Assessment",

    leadTitle: "Your AI readiness report is ready",
    leadBody: "Leave your email to receive a copy of your readiness report. Completely optional — skip directly to your results if you prefer.",
    nameLabel: "Name (optional)",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@company.com",
    submit: "Get My AI Readiness Report",
    submitting: "Generating Report...",
    skip: "Skip and view results directly →",
    skipping: "Calculating...",
    privacyNote: "No spam. No sales calls. Unsubscribe any time.",

    resultKicker: "AI Adoption Readiness Score",
    breakdownTitle: "Readiness Breakdown",
    strengthsTitle: "What Is Working",
    gapsTitle: "Critical Gaps",
    opportunitiesTitle: "Where AI Can Likely Help First",
    opportunitiesNote: "— based on your readiness signals",
    nextStepsTitle: "Recommended Next Steps",
    nextStepsBody: "Before investing in AI tools or implementation, address these specific gaps to maximize your return and reduce execution risk.",
    ctaTitle: "Need an AI readiness review?",
    ctaBody: "Get a tailored AI strategy session based on your specific gaps and business context.",
    retake: "Retake Assessment",
    copy: "Copy Results",
    copied: "Copied",
    ctaButton: "Book AI Strategy Session",

    copyScoreLine: (s) => `AI Adoption Readiness Score: ${s}/100`,
    copyLevelLine: (l) => `Readiness Level: ${l}`,
    copyCategoriesHeading: "— Category Scores —",
    copyGapsHeading: "— Critical Gaps —",
    copyOpportunitiesHeading: "— Where AI Can Help First —",
    copyNextStepsHeading: "— Recommended Next Steps —",
};

const fa: AiUiStrings = {
    kicker: "سنجش آمادگی هوش مصنوعی",
    titleLine1: "امتیاز آمادگی",
    titleLine2: "پذیرش هوش مصنوعی",
    lead: "ببینید کسب‌وکارتان از نظر ساختاری آماده‌ی پذیرش هوش مصنوعی است یا هنوز پیش از سرمایه‌گذاری به کار بنیادی نیاز دارد. صادقانه، تشخیصی، بدون هیاهو.",
    meta: "رایگان • بدون نیاز به ورود",
    stats: [
        { label: "۶ محور", sub: "کسب‌وکار، داده، تیم، فناوری و بیشتر" },
        { label: "۳۰ پرسش", sub: "درباره‌ی عوامل واقعی پیاده‌سازی" },
        { label: "۴ تا ۶ دقیقه", sub: "تشخیص فوری همراه با برنامه‌ی عمل" },
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

    leadTitle: "گزارش آمادگی هوش مصنوعی شما آماده است",
    leadBody: "ایمیل‌تان را بگذارید تا نسخه‌ای از گزارش آمادگی برایتان بیاید. کاملاً اختیاری است؛ اگر ترجیح می‌دهید، مستقیم به نتیجه بروید.",
    nameLabel: "نام (اختیاری)",
    namePlaceholder: "نام شما",
    emailLabel: "ایمیل",
    emailPlaceholder: "you@company.com",
    submit: "دریافت گزارش آمادگی هوش مصنوعی",
    submitting: "در حال ساخت گزارش...",
    skip: "← رفتن مستقیم به نتیجه",
    skipping: "در حال محاسبه...",
    privacyNote: "بدون اسپم. بدون تماس فروش. هر زمان خواستید لغو اشتراک کنید.",

    resultKicker: "امتیاز آمادگی پذیرش هوش مصنوعی",
    breakdownTitle: "تفکیک آمادگی",
    strengthsTitle: "آنچه کار می‌کند",
    gapsTitle: "شکاف‌های حیاتی",
    opportunitiesTitle: "هوش مصنوعی به احتمال زیاد نخست کجا کمک می‌کند",
    opportunitiesNote: "بر پایه‌ی نشانه‌های آمادگی شما",
    nextStepsTitle: "گام‌های بعدی پیشنهادی",
    nextStepsBody: "پیش از سرمایه‌گذاری روی ابزار یا پیاده‌سازی هوش مصنوعی، این شکاف‌های مشخص را ببندید تا بازگشت سرمایه بیشتر و ریسک اجرا کمتر شود.",
    ctaTitle: "به بازبینی آمادگی هوش مصنوعی نیاز دارید؟",
    ctaBody: "یک جلسه‌ی استراتژی هوش مصنوعی متناسب با شکاف‌ها و بستر کسب‌وکار خودتان بگیرید.",
    retake: "ارزیابی دوباره",
    copy: "کپی نتایج",
    copied: "کپی شد",
    ctaButton: "رزرو جلسه‌ی استراتژی هوش مصنوعی",

    copyScoreLine: (s) => `امتیاز آمادگی پذیرش هوش مصنوعی: ${fd(s)}/۱۰۰`,
    copyLevelLine: (l) => `سطح آمادگی: ${l}`,
    copyCategoriesHeading: "امتیاز هر محور:",
    copyGapsHeading: "شکاف‌های حیاتی:",
    copyOpportunitiesHeading: "هوش مصنوعی نخست کجا کمک می‌کند:",
    copyNextStepsHeading: "گام‌های بعدی پیشنهادی:",
};

export function getAiUiStrings(locale: AiLocale): AiUiStrings {
    return locale === "fa" ? fa : en;
}
