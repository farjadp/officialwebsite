// UI strings for the investor readiness components, per locale.
// The English strings are copied verbatim out of the components they replaced.

import { InvestorLocale } from "./config";

/** Latin digits to Persian digits, so counters read as Persian prose. */
function faDigits(value: number | string): string {
    return String(value).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export interface InvestorUiStrings {
    introTitle: string;
    introLead: string;
    startButton: string;
    durationLine: string;

    sectionOf: (current: number, total: number) => string;
    evaluated: (pct: number) => string;
    previous: string;
    nextSection: string;
    finish: string;
    scaleLabels: [string, string, string, string, string]; // 1 → 5

    leadTitle: string;
    leadBody: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    generating: string;
    confidentialNote: string;

    resultKicker: string;
    breakdownTitle: string;
    strengthsTitle: string;
    risksTitle: string;
    nextStepsTitle: string;
    nextStepsSub: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    retake: string;
}

const en: InvestorUiStrings = {
    introTitle: "Investor Readiness Score",
    introLead: "Evaluate how prepared your startup is to raise funding from angel investors or venture capital firms. Receive a professional diagnostic report measuring your fundability across 6 critical areas.",
    startButton: "Begin Evaluation",
    durationLine: "4–6 minutes • 30 Diagnostic Questions",

    sectionOf: (c, t) => `Section ${c} / ${t}`,
    evaluated: (p) => `${p}% Evaluated`,
    previous: "Previous",
    nextSection: "Next Section",
    finish: "Complete Evaluation",
    scaleLabels: ["Not at all true", "Mostly false", "Partially true", "Mostly true", "Completely true"],

    leadTitle: "Generating Readiness Report...",
    leadBody: "Your diagnostic score is ready. Enter your information below to unlock the full investor evaluation breakdown and recommended next steps.",
    nameLabel: "Founder Name (Optional)",
    namePlaceholder: "Full Name",
    emailLabel: "Work Email",
    emailPlaceholder: "founder@startup.com",
    submit: "Reveal Investor Readiness Score",
    generating: "Finalizing Audit...",
    confidentialNote: "Strictly Confidential & Secure",

    resultKicker: "Investor Readiness Score",
    breakdownTitle: "Category Breakdown",
    strengthsTitle: "Investor Strength Signals",
    risksTitle: "Key Investor Concerns",
    nextStepsTitle: "Recommended Next Steps",
    nextStepsSub: "Before pitching to investors or opening a round, focus on resolving these critical gaps to maximize your valuation and closing probability.",
    ctaTitle: "Schedule a Pitch Review",
    ctaBody: "Get a professional audit of your deck and narrative before you raise.",
    ctaButton: "Book Pitch Review",
    retake: "Retake Assessment",
};

const fa: InvestorUiStrings = {
    introTitle: "امتیاز آمادگی جذب سرمایه",
    introLead: "بسنجید استارتاپ شما چقدر برای جذب سرمایه از فرشتگان سرمایه‌گذار یا صندوق‌های سرمایه‌گذاری خطرپذیر آماده است. گزارشی تشخیصی و حرفه‌ای می‌گیرید که سرمایه‌پذیری شما را در ۶ حوزه‌ی کلیدی اندازه می‌گیرد.",
    startButton: "شروع ارزیابی",
    durationLine: "۴ تا ۶ دقیقه • ۳۰ پرسش تشخیصی",

    sectionOf: (c, t) => `بخش ${faDigits(c)} از ${faDigits(t)}`,
    evaluated: (p) => `${faDigits(p)}٪ ارزیابی‌شده`,
    previous: "قبلی",
    nextSection: "بخش بعدی",
    finish: "پایان ارزیابی",
    scaleLabels: ["اصلاً درست نیست", "بیشتر نادرست", "تا حدی درست", "بیشتر درست", "کاملاً درست"],

    leadTitle: "در حال ساخت گزارش آمادگی...",
    leadBody: "امتیاز تشخیصی شما آماده است. برای دیدن تفکیک کامل ارزیابی سرمایه‌گذار و گام‌های بعدی پیشنهادی، اطلاعات زیر را وارد کنید.",
    nameLabel: "نام بنیان‌گذار (اختیاری)",
    namePlaceholder: "نام و نام خانوادگی",
    emailLabel: "ایمیل کاری",
    emailPlaceholder: "founder@startup.com",
    submit: "نمایش امتیاز آمادگی جذب سرمایه",
    generating: "در حال نهایی کردن بررسی...",
    confidentialNote: "کاملاً محرمانه و امن",

    resultKicker: "امتیاز آمادگی جذب سرمایه",
    breakdownTitle: "تفکیک دسته‌ها",
    strengthsTitle: "نشانه‌های قوت برای سرمایه‌گذار",
    risksTitle: "نگرانی‌های کلیدی سرمایه‌گذار",
    nextStepsTitle: "گام‌های بعدی پیشنهادی",
    nextStepsSub: "پیش از ارائه به سرمایه‌گذار یا باز کردن راند، روی بستن این شکاف‌های حیاتی تمرکز کنید تا ارزش‌گذاری و احتمال بستن راند را بالا ببرید.",
    ctaTitle: "رزرو جلسه‌ی بررسی پیچ",
    ctaBody: "پیش از جذب سرمایه، پیچ‌دک و روایت‌تان را حرفه‌ای بررسی کنید.",
    ctaButton: "رزرو بررسی پیچ",
    retake: "ارزیابی دوباره",
};

export function getInvestorUiStrings(locale: InvestorLocale): InvestorUiStrings {
    return locale === "fa" ? fa : en;
}
