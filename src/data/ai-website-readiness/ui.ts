// ============================================================================
// File Path: src/data/ai-website-readiness/ui.ts
// Why: The chrome of the AI website readiness audit — intro, form, loading and
//      error states, result headings, status labels and the footer note — in
//      both locales. The check sentences themselves come from the scanner and
//      live in ./scanner-strings.ts.
// Env / Identity: Pure data, imported by a Client Component.
// ============================================================================

import type { AiReadinessLocale } from "./scanner-strings";

export interface AiReadinessUiStrings {
  dir: "ltr" | "rtl";
  /** BCP-47 tag for formatting the scan timestamp. */
  dateLocale: string;

  backToTools: string;
  kicker: string;
  introTitleLead: string;
  introTitleAccent: string;
  introBody: string;

  auditCardTitle: string;
  auditCardSub: string;
  auditCardPoints: string[];

  urlLabel: string;
  urlPlaceholder: string;
  submit: string;
  submitting: string;
  formNoteLeft: string;
  formNoteRight: string;
  genericError: string;

  loadingTitle: string;
  loadingBody: string;

  reportTitle: string;
  scannedAt: (when: string) => string;
  scanAnother: string;
  notScored: string;
  outOf100: (score: number) => string;
  signalsChecked: (count: number) => string;
  prioritiesTitle: string;
  prioritiesSub: string;
  howToImprove: string;
  disclaimer: string;

  statusLabels: {
    passing: string;
    attention: string;
    missing: string;
    info: string;
    na: string;
  };
}

const en: AiReadinessUiStrings = {
  dir: "ltr",
  dateLocale: "en-CA",

  backToTools: "Back to Tools Library",
  kicker: "Live website diagnostic",
  introTitleLead: "Is your website ready",
  introTitleAccent: "for AI?",
  introBody:
    "See whether AI crawlers can access, understand, and cite your website—and get a prioritized plan to improve it.",

  auditCardTitle: "28-point audit",
  auditCardSub: "Technical + content signals",
  auditCardPoints: ["Crawler access", "Metadata", "Agent files", "Citability"],

  urlLabel: "Website URL",
  urlPlaceholder: "yourwebsite.com",
  submit: "Run free audit",
  submitting: "Scanning website…",
  formNoteLeft: "No signup required. Public pages only.",
  formNoteRight: "Usually takes 10–30 seconds.",
  genericError: "The scan could not be completed.",

  loadingTitle: "Reading public website signals",
  loadingBody: "Checking the homepage, robots rules, sitemap, metadata, and agent files…",

  reportTitle: "AI readiness report",
  scannedAt: (when) => `Scanned ${when}`,
  scanAnother: "Scan another site",
  notScored: "Not scored",
  outOf100: (score) => `${score}/100`,
  signalsChecked: (count) => `${count} signals checked`,
  prioritiesTitle: "Your highest-impact fixes",
  prioritiesSub: "Work through these first.",
  howToImprove: "How to improve: ",
  disclaimer:
    "This report is a point-in-time technical diagnostic, not a guarantee of ranking or inclusion in AI answers. AI visibility also depends on reputation, independent citations, source quality, and the policies of each model or search provider.",

  statusLabels: {
    passing: "Passing",
    attention: "Needs attention",
    missing: "Missing",
    info: "For your info",
    na: "N/A",
  },
};

const fa: AiReadinessUiStrings = {
  dir: "rtl",
  dateLocale: "fa-IR",

  backToTools: "بازگشت به کتابخانه‌ی ابزارها",
  kicker: "تشخیص زنده‌ی وب‌سایت",
  introTitleLead: "وب‌سایت شما برای هوش مصنوعی",
  introTitleAccent: "آماده است؟",
  introBody:
    "ببینید خزنده‌های هوش مصنوعی می‌توانند به وب‌سایت شما دسترسی پیدا کنند، آن را بفهمند و به آن ارجاع بدهند یا نه، و یک برنامه‌ی اولویت‌بندی‌شده برای بهبودش بگیرید.",

  auditCardTitle: "ممیزی ۲۸ سنجه‌ای",
  auditCardSub: "نشانه‌های فنی و محتوایی",
  auditCardPoints: [
    "دسترسی خزنده",
    "فراداده",
    "فایل‌های عامل",
    "قابلیت ارجاع",
  ],

  urlLabel: "نشانی وب‌سایت",
  urlPlaceholder: "yourwebsite.com",
  submit: "اجرای ممیزی رایگان",
  submitting: "در حال بررسی وب‌سایت…",
  formNoteLeft: "بدون نیاز به ثبت‌نام. فقط صفحه‌های عمومی.",
  formNoteRight: "معمولاً ۱۰ تا ۳۰ ثانیه طول می‌کشد.",
  genericError: "بررسی کامل نشد.",

  loadingTitle: "در حال خواندن نشانه‌های عمومی وب‌سایت",
  loadingBody:
    "صفحه‌ی اصلی، قواعد robots، نقشه‌ی سایت، فراداده و فایل‌های عامل در حال بررسی است…",

  reportTitle: "گزارش آمادگی برای هوش مصنوعی",
  scannedAt: (when) => `بررسی‌شده در ${when}`,
  scanAnother: "بررسی وب‌سایتی دیگر",
  notScored: "بدون امتیاز",
  outOf100: (score) => `${score}/100`,
  signalsChecked: (count) =>
    `${String(count).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])} نشانه بررسی شد`,
  prioritiesTitle: "اثرگذارترین اصلاح‌های شما",
  prioritiesSub: "اول سراغ این‌ها بروید.",
  howToImprove: "راه بهبود: ",
  disclaimer:
    "این گزارش یک تشخیص فنی در یک لحظه‌ی مشخص است، نه تضمین رتبه یا حضور در پاسخ‌های هوش مصنوعی. دیده‌شدن در هوش مصنوعی به اعتبار، ارجاع‌های مستقل، کیفیت منبع و سیاست هر مدل یا ارائه‌دهنده‌ی جست‌وجو هم بستگی دارد.",

  statusLabels: {
    passing: "قبول",
    attention: "نیازمند رسیدگی",
    missing: "موجود نیست",
    info: "برای اطلاع شما",
    na: "بی‌ربط",
  },
};

export function getAiReadinessUiStrings(
  locale: AiReadinessLocale = "en"
): AiReadinessUiStrings {
  return locale === "fa" ? fa : en;
}
