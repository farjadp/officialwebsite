// ============================================================================
// File Path: src/data/scorecard/ui.ts
// Why: Chrome strings for the Business Autonomy Score widget, per locale, plus
//      the getters that hand the widget the right question set and tiers.
//      The English strings are copied verbatim out of the widget they left.
// ============================================================================

import { localDigits } from "@/lib/digits";
import { ScorecardLocale, ScorecardQuestion, ScorecardTier, scorecardQuestions, scorecardTiers } from "./config";
import { scorecardQuestionsFa, scorecardTiersFa } from "./config.fa";

export interface ScorecardUiStrings {
    introBadge: string;
    introTitle: string;
    introLead: string;
    startButton: string;

    questionOf: (current: number, total: number) => string;
    completed: (pct: number) => string;
    progressLabel: string;

    leadTitle: string;
    leadBody: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    submitError: string;
    noSpam: string;

    resultKicker: string;
    profileLabel: (title: string) => string;
    resultCta: string;
}

const en: ScorecardUiStrings = {
    introBadge: "Diagnostic Tool",
    introTitle: "Is your business ready for AI?",
    introLead: "Take this 2-minute assessment to find out if your operations are built for massive scale, or if you are quietly losing capital to manual chaos.",
    startButton: "Start the Assessment",

    questionOf: (c, t) => `Question ${c} of ${t}`,
    completed: (p) => `${p}% Completed`,
    progressLabel: "Assessment progress",

    leadTitle: "Analysis Complete",
    leadBody: "Where should we send your detailed technical blueprint?",
    emailLabel: "Work Email Address",
    emailPlaceholder: "founder@company.com",
    submit: "Unlock My Score",
    submitting: "Calculating Results...",
    submitError: "Something went wrong. Please try again.",
    noSpam: "We respect your privacy. No spam.",

    resultKicker: "Your Autonomy Score",
    profileLabel: (title) => `Profile: ${title}`,
    resultCta: "Schedule a Strategy Call",
};

const fa: ScorecardUiStrings = {
    introBadge: "ابزار تشخیص",
    introTitle: "کسب‌وکار شما آماده‌ی هوش مصنوعی است؟",
    introLead: "این ارزیابی دو دقیقه‌ای را انجام دهید تا ببینید عملیات‌تان برای رشد بزرگ ساخته شده است یا بی‌سروصدا سرمایه‌تان را خرج آشفتگی دستی می‌کنید.",
    startButton: "شروع ارزیابی",

    questionOf: (c, t) => `پرسش ${localDigits(c, "fa")} از ${localDigits(t, "fa")}`,
    completed: (p) => `${localDigits(p, "fa")}٪ تکمیل‌شده`,
    progressLabel: "پیشرفت ارزیابی",

    leadTitle: "تحلیل کامل شد",
    leadBody: "نقشه‌ی فنی تفصیلی شما را کجا بفرستیم؟",
    emailLabel: "ایمیل کاری",
    emailPlaceholder: "founder@company.com",
    submit: "نمایش امتیاز من",
    submitting: "در حال محاسبه‌ی نتایج...",
    submitError: "مشکلی پیش آمد. دوباره تلاش کنید.",
    noSpam: "به حریم خصوصی شما احترام می‌گذاریم. بدون اسپم.",

    resultKicker: "امتیاز خودگردانی شما",
    profileLabel: (title) => `نیم‌رخ: ${title}`,
    resultCta: "رزرو جلسه‌ی استراتژی",
};

export function getScorecardUiStrings(locale: ScorecardLocale): ScorecardUiStrings {
    return locale === "fa" ? fa : en;
}

export function getScorecardQuestions(locale: ScorecardLocale): ScorecardQuestion[] {
    return locale === "fa" ? scorecardQuestionsFa : scorecardQuestions;
}

export function getScorecardTiers(locale: ScorecardLocale): ScorecardTier[] {
    return locale === "fa" ? scorecardTiersFa : scorecardTiers;
}
