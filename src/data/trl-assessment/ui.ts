// UI strings for the TRL assessment components, per locale.

import { TrlLocale } from "./config";

export interface TrlUiStrings {
    badge: string;
    introTitleLead: string;   // plain part of the h1
    introTitleAccent: string; // accent-colored part of the h1
    introBody: string;
    startButton: string;
    durationLine: string;
    honestyNote: string;

    phaseOf: (current: number, total: number) => string;
    completed: (pct: number) => string;
    previous: string;
    nextPhase: string;
    finish: string;
    answerNo: string;
    answerPartially: string;
    answerYes: string;

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
    outOfNine: string;
    nasaPrefix: string;
    ladderTitle: string;
    ladderNote: string;
    gapsTitle: (level: number) => string;
    gapsTitleDone: string;
    gapsIntro: (name: string) => string;
    gapsNone: string;
    gapsDoneBody: string;
    fundingTitle: string;
    nextStepsTitle: string;
    nextStepsSub: string;
    trlOnlyLead: string;
    trlOnlyBody: string;
    trlOnlyStartupLink: string;
    trlOnlyInvestorLink: string;
    trlOnlyAnd: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    retake: string;
    startupReadinessHref: string;
    investorReadinessHref: string;
    contactHref: string;
}

const en: TrlUiStrings = {
    badge: "Diagnostic Tool",
    introTitleLead: "How mature is your",
    introTitleAccent: "technology, really?",
    introBody: "Locate your technology on the NASA 1–9 readiness scale — the same scale government innovation programs use to decide what to fund. Answer evidence questions, get your TRL, the gaps to the next level, and the funding context for your stage.",
    startButton: "Start Free Assessment",
    durationLine: "Takes about 4-6 minutes • 27 evidence checks",
    honestyNote: "Answer honestly and only claim “Yes” where you could show the evidence to a reviewer. TRL is a ladder — skipped levels don’t count.",

    phaseOf: (c, t) => `Phase ${c} of ${t}`,
    completed: (p) => `${p}% Completed`,
    previous: "Previous",
    nextPhase: "Next Phase",
    finish: "Finish Assessment",
    answerNo: "No",
    answerPartially: "Partially",
    answerYes: "Yes, with evidence",

    leadTitle: "Analyzing your evidence...",
    leadBody: "Your TRL has been calculated. Enter your info below to see your level, the gaps to the next one, and the funding context for your stage.",
    nameLabel: "First Name (Optional)",
    namePlaceholder: "Grace",
    emailLabel: "Work Email",
    emailPlaceholder: "grace@deeptech.co",
    submit: "Reveal My TRL & Roadmap",
    generating: "Generating Report...",
    noSpam: "We respect your inbox. No spam, just value.",

    resultKicker: "Your Technology Readiness Level",
    outOfNine: "/ 9",
    nasaPrefix: "NASA definition:",
    ladderTitle: "The TRL Ladder",
    ladderNote: "TRL is a ladder: your level is the highest one where every lower level’s evidence is substantially in place. Evidence claimed above an unmet level doesn’t count yet.",
    gapsTitle: (l) => `Gaps to TRL ${l}`,
    gapsTitleDone: "No Gaps Remaining",
    gapsIntro: (n) => `To reach “${n}”, this evidence is still missing or incomplete:`,
    gapsNone: "All criteria are close — tighten the evidence at your lower levels to pass the gate.",
    gapsDoneBody: "Your technology is proven in operations. The remaining risks are commercial, not technical.",
    fundingTitle: "Funding Context",
    nextStepsTitle: "Recommended Next Steps",
    nextStepsSub: "The fastest way up the ladder is closing the evidence gaps at your working level.",
    trlOnlyLead: "TRL measures technology maturity only.",
    trlOnlyBody: "Research on startup readiness shows technology, market, and investment maturity move independently — check the other two with the",
    trlOnlyStartupLink: "Startup Readiness Score",
    trlOnlyInvestorLink: "Investor Readiness Score",
    trlOnlyAnd: "and the",
    ctaTitle: "Want a technology-to-market roadmap?",
    ctaBody: "Book a strategy session to plan how to advance your next two TRLs.",
    ctaButton: "Book a Strategy Session",
    retake: "Retake Assessment",
    startupReadinessHref: "/tools/startup-readiness",
    investorReadinessHref: "/tools/investor-readiness",
    contactHref: "/contact",
};

const fa: TrlUiStrings = {
    badge: "ابزار تشخیصی",
    introTitleLead: "فناوری شما واقعاً",
    introTitleAccent: "چقدر بالغ است؟",
    introBody: "جایگاه فناوری‌تان را روی مقیاس ۱ تا ۹ ناسا پیدا کنید — همان مقیاسی که برنامه‌های نوآوری دولتی برای تصمیم‌گیری درباره‌ی تأمین مالی به‌کار می‌برند. به پرسش‌های مبتنی بر شواهد پاسخ دهید و TRL خود، شکاف‌ها تا سطح بعدی و بستر تأمین مالی مرحله‌تان را ببینید.",
    startButton: "شروع ارزیابی رایگان",
    durationLine: "حدود ۴ تا ۶ دقیقه • ۲۷ سنجه‌ی شواهد",
    honestyNote: "صادقانه پاسخ دهید و فقط جایی «بله» بگویید که بتوانید شواهدش را به یک داور نشان دهید. TRL یک نردبان است — پله‌های پریده حساب نمی‌شوند.",

    phaseOf: (c, t) => `فاز ${c} از ${t}`,
    completed: (p) => `${p}٪ تکمیل‌شده`,
    previous: "قبلی",
    nextPhase: "فاز بعدی",
    finish: "پایان ارزیابی",
    answerNo: "خیر",
    answerPartially: "تا حدی",
    answerYes: "بله، با شواهد",

    leadTitle: "در حال تحلیل شواهد شما...",
    leadBody: "سطح TRL شما محاسبه شده است. برای دیدن سطح‌تان، شکاف‌ها تا سطح بعدی و بستر تأمین مالی مرحله‌تان، اطلاعات زیر را وارد کنید.",
    nameLabel: "نام (اختیاری)",
    namePlaceholder: "مریم",
    emailLabel: "ایمیل کاری",
    emailPlaceholder: "maryam@deeptech.co",
    submit: "نمایش TRL و نقشه‌ی راه من",
    generating: "در حال ساخت گزارش...",
    noSpam: "به صندوق ورودی‌تان احترام می‌گذاریم. بدون اسپم.",

    resultKicker: "سطح آمادگی فناوری شما",
    outOfNine: "/ ۹",
    nasaPrefix: "تعریف ناسا:",
    ladderTitle: "نردبان TRL",
    ladderNote: "TRL یک نردبان است: سطح شما بالاترین سطحی است که شواهد همه‌ی سطح‌های پایین‌ترش هم به‌طور اساسی فراهم باشد. شواهدِ ادعاشده بالاتر از یک سطحِ ناتمام هنوز حساب نمی‌شوند.",
    gapsTitle: (l) => `شکاف‌ها تا TRL ${l}`,
    gapsTitleDone: "شکافی باقی نمانده",
    gapsIntro: (n) => `برای رسیدن به «${n}» این شواهد هنوز ناقص یا غایب است:`,
    gapsNone: "همه‌ی سنجه‌ها نزدیک‌اند — شواهد سطح‌های پایین‌تر را محکم کنید تا از گیت عبور کنید.",
    gapsDoneBody: "فناوری شما در بهره‌برداری اثبات شده است. ریسک‌های باقی‌مانده تجاری‌اند، نه فنی.",
    fundingTitle: "بستر تأمین مالی",
    nextStepsTitle: "گام‌های بعدی پیشنهادی",
    nextStepsSub: "سریع‌ترین راه بالا رفتن از نردبان، بستن شکاف‌های شواهد در سطحِ در حالِ کارتان است.",
    trlOnlyLead: "TRL فقط بلوغ فناوری را می‌سنجد.",
    trlOnlyBody: "پژوهش‌های آمادگی استارتاپ نشان می‌دهند بلوغ فناوری، بازار و سرمایه مستقل از هم حرکت می‌کنند — دوتای دیگر را بسنجید با",
    trlOnlyStartupLink: "امتیاز آمادگی استارتاپ",
    trlOnlyInvestorLink: "امتیاز آمادگی جذب سرمایه",
    trlOnlyAnd: "و",
    ctaTitle: "نقشه‌ی راهِ فناوری-تا-بازار می‌خواهید؟",
    ctaBody: "یک جلسه‌ی استراتژی رزرو کنید تا برای پیشروی دو سطح بعدی TRL برنامه بریزیم.",
    ctaButton: "رزرو جلسه‌ی استراتژی",
    retake: "ارزیابی دوباره",
    startupReadinessHref: "/fa/tools/startup-readiness",
    investorReadinessHref: "/fa/tools/investor-readiness",
    contactHref: "/contact",
};

export function getTrlUiStrings(locale: TrlLocale): TrlUiStrings {
    return locale === "fa" ? fa : en;
}
