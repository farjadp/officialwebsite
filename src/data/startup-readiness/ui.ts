// UI strings for the startup readiness components, per locale.
// The English strings are copied verbatim out of the components they replaced.

import { ReadinessLocale } from "./config";

/** Latin digits to Persian digits, so counters read as Persian prose. */
function faDigits(value: number | string): string {
    return String(value).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export interface ReadinessUiStrings {
    introTitle: string;
    introLead: string;
    startButton: string;
    durationLine: string;

    categoryOf: (current: number, total: number) => string;
    completed: (pct: number) => string;
    previous: string;
    nextCategory: string;
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
    noSpam: string;

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

const en: ReadinessUiStrings = {
    introTitle: "Startup Readiness Assessment",
    introLead: "Evaluate your startup idea across 6 critical dimensions. Find out instantly if you're ready to launch, raise money, or if you need to go back to the drawing board.",
    startButton: "Start Free Assessment",
    durationLine: "Takes about 3-5 minutes • 30 Questions",

    categoryOf: (c, t) => `Category ${c} of ${t}`,
    completed: (p) => `${p}% Completed`,
    previous: "Previous",
    nextCategory: "Next Category",
    finish: "Finish Assessment",
    scaleLabels: ["Strongly No", "Mostly No", "Partly / Unclear", "Mostly Yes", "Strongly Yes"],

    leadTitle: "Analyzing your results...",
    leadBody: "Your readiness score has been calculated. Enter your info below to see your detailed breakdown and custom action plan.",
    nameLabel: "First Name (Optional)",
    namePlaceholder: "Elon",
    emailLabel: "Work Email",
    emailPlaceholder: "elon@mars.com",
    submit: "Reveal My Score & Roadmap",
    generating: "Generating Report...",
    noSpam: "We respect your inbox. No spam, just value.",

    resultKicker: "Your Startup Readiness Score",
    breakdownTitle: "Category Breakdown",
    strengthsTitle: "Key Strengths",
    risksTitle: "Primary Risks",
    nextStepsTitle: "Recommended Next Steps",
    nextStepsSub: "Based on your lowest scoring areas, here is what you should focus on next to improve your readiness.",
    ctaTitle: "Want a deeper startup review?",
    ctaBody: "Book a strategy session to discuss these results and get a custom roadmap.",
    ctaButton: "Book a Strategy Session",
    retake: "Retake Assessment",
};

const fa: ReadinessUiStrings = {
    introTitle: "ارزیابی آمادگی استارتاپ",
    introLead: "ایده‌ی استارتاپ‌تان را در ۶ بُعد کلیدی بسنجید. همان‌جا بفهمید آماده‌ی عرضه‌اید، آماده‌ی جذب سرمایه، یا باید به میز طراحی برگردید.",
    startButton: "شروع ارزیابی رایگان",
    durationLine: "حدود ۳ تا ۵ دقیقه • ۳۰ پرسش",

    categoryOf: (c, t) => `دسته‌ی ${faDigits(c)} از ${faDigits(t)}`,
    completed: (p) => `${faDigits(p)}٪ تکمیل‌شده`,
    previous: "قبلی",
    nextCategory: "دسته‌ی بعدی",
    finish: "پایان ارزیابی",
    scaleLabels: ["کاملاً خیر", "بیشتر خیر", "تا حدی یا نامشخص", "بیشتر بله", "کاملاً بله"],

    leadTitle: "در حال تحلیل نتایج شما...",
    leadBody: "امتیاز آمادگی شما محاسبه شده است. برای دیدن تفکیک کامل و برنامه‌ی اقدام اختصاصی‌تان، اطلاعات زیر را وارد کنید.",
    nameLabel: "نام (اختیاری)",
    namePlaceholder: "مریم",
    emailLabel: "ایمیل کاری",
    emailPlaceholder: "maryam@startup.co",
    submit: "نمایش امتیاز و نقشه‌ی راه من",
    generating: "در حال ساخت گزارش...",
    noSpam: "به صندوق ورودی‌تان احترام می‌گذاریم. بدون اسپم.",

    resultKicker: "امتیاز آمادگی استارتاپ شما",
    breakdownTitle: "تفکیک دسته‌ها",
    strengthsTitle: "نقاط قوت کلیدی",
    risksTitle: "ریسک‌های اصلی",
    nextStepsTitle: "گام‌های بعدی پیشنهادی",
    nextStepsSub: "بر پایه‌ی کم‌امتیازترین حوزه‌ها، این‌ها همان چیزهایی است که برای بهبود آمادگی‌تان باید روی آن تمرکز کنید.",
    ctaTitle: "بررسی عمیق‌تر استارتاپ می‌خواهید؟",
    ctaBody: "یک جلسه‌ی استراتژی رزرو کنید تا درباره‌ی این نتایج حرف بزنیم و نقشه‌ی راه اختصاصی‌تان را بسازیم.",
    ctaButton: "رزرو جلسه‌ی استراتژی",
    retake: "ارزیابی دوباره",
};

export function getReadinessUiStrings(locale: ReadinessLocale): ReadinessUiStrings {
    return locale === "fa" ? fa : en;
}
