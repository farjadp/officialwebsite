// ============================================================================
// File: src/lib/case-study-consent.ts
// Role: Client-safe constants for the gated case-study form: the consent
//       wording (stored verbatim with every request) and the honeypot name.
// Why:  Kept apart from case-study-gate.ts, which uses node:crypto and must
//       never reach the browser bundle.
// ============================================================================

/** A field real visitors never see. Anything typed into it is a bot. */
export const HONEYPOT_FIELD = "website"

/**
 * The consent wording, stored verbatim with every request so the record shows
 * exactly what the person agreed to (CASL / PIPEDA). Change the version when
 * the text changes.
 */
export const CONSENT_VERSION = "2026-11-16"

export const CONSENT_TEXT = {
    delivery: {
        en: "Email me this case study. Farjad PMD will store my address to send it and will not share it.",
        fa: "این کیس‌استادی را برایم ایمیل کنید. فرجاد نشانی ایمیلم را برای ارسال آن نگه می‌دارد و در اختیار کسی نمی‌گذارد.",
    },
    marketing: {
        en: "Also send me Farjad's occasional emails — new reports, playbooks and case studies. I can unsubscribe at any time.",
        fa: "ایمیل‌های گاه‌به‌گاه فرجاد را هم برایم بفرستید: گزارش‌ها، راهنماها و کیس‌استادی‌های تازه. هر وقت بخواهم می‌توانم لغو کنم.",
    },
} as const

