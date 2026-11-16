// ============================================================================
// File: src/lib/email/case-study-email.ts
// Role: Builds the email that delivers a gated case study (subject, HTML, text).
// Why:  Pure function so the wording, escaping and direction can be tested
//       without Resend. Look follows v3 "Light": bone page, charcoal text,
//       one light-gold rule and button. Inline styles only — email clients
//       ignore <style>. Persian is right-to-left end to end.
// Note: this is a requested, transactional message (the person asked for the
//       document), so it carries sender identification and the postal
//       address but no unsubscribe link of its own.
// ============================================================================

import { escapeHtml } from "./sanitize"
import type { GateLocale } from "@/lib/case-study-gate"

export type CaseStudyEmailInput = {
    locale: GateLocale
    title: string
    link: string
    name?: string
    expiresAt: Date
    postalAddress?: string
}

const COPY = {
    en: {
        subject: (t: string) => `Your case study: ${t}`,
        hello: (n?: string) => (n ? `Hi ${n},` : "Hi,"),
        body: "Here is the case study you asked for on farjadp.info. It opens in your browser, and you can save it as a PDF from there.",
        button: "Read the case study",
        expires: (d: string) => `The link is personal to you and works until ${d}.`,
        fallback: "If the button does not work, copy this address into your browser:",
        why: "You are receiving this one email because this address was entered on farjadp.info to request the document. If that was not you, ignore it — nothing else will be sent.",
        sign: "Farjad PMD — AI Strategist · Startup Mentor · Business Coach",
    },
    fa: {
        subject: (t: string) => `کیس‌استادی شما: ${t}`,
        hello: (n?: string) => (n ? `سلام ${n}،` : "سلام،"),
        body: "این همان کیس‌استادی‌ای است که در farjadp.info درخواست کردید. در مرورگر باز می‌شود و از همان‌جا می‌توانید آن را PDF کنید.",
        button: "خواندن کیس‌استادی",
        expires: (d: string) => `این لینک مخصوص شماست و تا ${d} کار می‌کند.`,
        fallback: "اگر دکمه کار نکرد، این نشانی را در مرورگر باز کنید:",
        why: "این ایمیل فقط یک بار برایتان فرستاده شد، چون این نشانی برای دریافت این سند در farjadp.info وارد شده بود. اگر شما نبودید، نادیده‌اش بگیرید؛ ایمیل دیگری نمی‌آید.",
        sign: "فرجاد — استراتژیست هوش مصنوعی، منتور استارتاپ و کوچ کسب‌وکار",
    },
} as const

function formatDate(d: Date, locale: GateLocale) {
    return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "America/Toronto",
    }).format(d)
}

export function buildCaseStudyEmail(input: CaseStudyEmailInput) {
    const c = COPY[input.locale]
    const rtl = input.locale === "fa"
    const dir = rtl ? "rtl" : "ltr"
    const align = rtl ? "right" : "left"
    const font = rtl ? "Tahoma,'Segoe UI',Arial,sans-serif" : "Georgia,'Times New Roman',serif"
    const bodyFont = rtl ? "Tahoma,'Segoe UI',Arial,sans-serif" : "'Helvetica Neue',Helvetica,Arial,sans-serif"

    const name = input.name?.trim() ? input.name.trim().slice(0, 60) : undefined
    const title = escapeHtml(input.title)
    const link = escapeHtml(input.link)
    const expires = formatDate(input.expiresAt, input.locale)
    const postal = input.postalAddress?.trim()

    const subject = c.subject(input.title)

    const html = `<!doctype html>
<html lang="${input.locale}" dir="${dir}">
<body style="margin:0;padding:0;background:#ede8df;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ede8df;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#faf7f2;border-radius:16px;" dir="${dir}">
<tr><td style="padding:36px 32px 8px;text-align:${align};">
<p style="margin:0 0 20px;font-family:${bodyFont};font-size:13px;letter-spacing:0.04em;color:#8a6a2f;">farjadp.info</p>
<h1 style="margin:0 0 24px;font-family:${font};font-weight:400;font-size:26px;line-height:1.35;color:#1c1917;">${title}</h1>
<div style="height:1px;background:#e8c48a;margin:0 0 24px;"></div>
<p style="margin:0 0 12px;font-family:${bodyFont};font-size:16px;line-height:1.8;color:#1c1917;">${escapeHtml(c.hello(name))}</p>
<p style="margin:0 0 28px;font-family:${bodyFont};font-size:16px;line-height:1.8;color:#44403c;">${c.body}</p>
<a href="${link}" style="display:inline-block;background:#1c1917;color:#faf7f2;text-decoration:none;padding:14px 28px;border-radius:999px;font-family:${bodyFont};font-size:15px;font-weight:600;">${c.button}</a>
<p style="margin:28px 0 8px;font-family:${bodyFont};font-size:13px;line-height:1.7;color:#78716c;">${escapeHtml(c.expires(expires))}</p>
<p style="margin:0 0 4px;font-family:${bodyFont};font-size:12px;line-height:1.7;color:#78716c;">${c.fallback}</p>
<p style="margin:0 0 28px;font-family:monospace;font-size:12px;line-height:1.6;color:#8a6a2f;word-break:break-all;" dir="ltr">${link}</p>
</td></tr>
<tr><td style="padding:20px 32px 32px;border-top:1px solid #e7e0d4;text-align:${align};">
<p style="margin:0 0 8px;font-family:${bodyFont};font-size:13px;line-height:1.7;color:#44403c;">${c.sign}</p>
<p style="margin:0 0 8px;font-family:${bodyFont};font-size:12px;line-height:1.7;color:#a8a29e;">${c.why}</p>
${postal ? `<p style="margin:0;font-family:${bodyFont};font-size:12px;line-height:1.7;color:#a8a29e;" dir="ltr">${escapeHtml(postal)}</p>` : ""}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`

    const text = [
        c.hello(name),
        "",
        c.body,
        "",
        `${c.button}: ${input.link}`,
        "",
        c.expires(expires),
        "",
        "—",
        c.sign,
        c.why,
        postal ?? "",
    ]
        .join("\n")
        .trim()

    return { subject, html, text }
}
