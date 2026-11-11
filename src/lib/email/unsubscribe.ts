// ============================================================================
// Hardware Source: unsubscribe.ts
// Version: 1.0.0 — 2026-11-11
// Why: Unsubscribe must be a deliberate act. Opening the link (GET) only shows
//      a confirmation page; security scanners and link previews open every URL
//      in an email and were unsubscribing people who never asked to leave.
// Env / Identity: Pure helpers (no I/O) shared by /e/u/[token]
// ============================================================================

/** The hidden form field the confirmation page posts back. */
export const CONFIRM_FIELD = "confirm"

/**
 * How a POST to the unsubscribe URL should be answered.
 * - "page": a person pressed the button on our confirmation page → show HTML.
 * - "json": a mail client's one-click request (RFC 8058, body
 *   `List-Unsubscribe=One-Click`) or any other POST → answer silently.
 * Both unsubscribe; only the response differs.
 */
export function postResponseKind(form: URLSearchParams | null): "page" | "json" {
    return form?.get(CONFIRM_FIELD) === "1" ? "page" : "json"
}

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

/** Shows enough of the address to recognise it, not enough to harvest it. */
export function maskEmail(email: string): string {
    const [local, domain] = email.split("@")
    if (!domain) return "***"
    const head = local.slice(0, Math.min(2, local.length))
    return `${head}${"*".repeat(Math.max(1, local.length - head.length))}@${domain}`
}

type Page = { title: string; titleFa: string; body: string }

export function confirmPage(email: string, actionUrl: string, prefsUrl: string): Page {
    return {
        title: "Unsubscribe?",
        titleFa: "لغو اشتراک؟",
        body: `<p><strong>${escapeHtml(maskEmail(email))}</strong></p>
<p>Press the button to stop receiving emails from Farjad.</p>
<p dir="rtl" lang="fa">برای اینکه دیگر ایمیلی از فرجاد نگیرید، دکمه را بزنید.</p>
<form method="post" action="${escapeHtml(actionUrl)}" style="margin:22px 0 6px;">
<input type="hidden" name="${CONFIRM_FIELD}" value="1" />
<button type="submit">Unsubscribe · لغو اشتراک</button>
</form>
<p style="margin-top:18px;">Prefer fewer emails instead? <a href="${escapeHtml(prefsUrl)}">Update your preferences</a>.</p>`,
    }
}

export function donePage(email: string, prefsUrl: string): Page {
    return {
        title: "You're unsubscribed",
        titleFa: "اشتراک شما لغو شد",
        body: `<p><strong>${escapeHtml(maskEmail(email))}</strong> has been removed. You will not receive further emails.</p>
<p dir="rtl" lang="fa">نشانی شما حذف شد و دیگر ایمیلی دریافت نمی‌کنید.</p>
<p style="margin-top:18px;">Changed your mind? <a href="${escapeHtml(prefsUrl)}">Update your preferences</a>.</p>`,
    }
}

export function invalidPage(): Page {
    return {
        title: "Link not recognised",
        titleFa: "این لینک معتبر نیست",
        body: "<p>This unsubscribe link is invalid or has expired.</p>",
    }
}
