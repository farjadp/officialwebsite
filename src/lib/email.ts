import { Resend } from "resend"
import { escapeHtml } from "@/lib/email/sanitize"

const FROM =
    process.env.EMAIL_FROM ||
    `${process.env.EMAIL_FROM_NAME || "Farjad PMD"} <onboarding@resend.dev>`
const BASE_URL = process.env.NEXTAUTH_URL || "https://farjadp.info"

let resendInstance: Resend | null = null

function getResend() {
    if (!resendInstance) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("Missing RESEND_API_KEY environment variable")
        }
        resendInstance = new Resend(process.env.RESEND_API_KEY)
    }
    return resendInstance
}

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${BASE_URL}/reset-password?token=${token}`
    await getResend().emails.send({
        from: FROM,
        to: email,
        subject: "Reset Your Password — farjadp.info",
        html: `
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;border-radius:12px;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 32px;text-align:center;">
                    <h1 style="color:#fff;font-size:28px;margin:0;font-weight:700;">farjadp.info</h1>
                    <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:14px;">Personal Website</p>
                </div>
                <div style="padding:40px 32px;">
                    <h2 style="color:#fff;font-size:22px;margin:0 0 16px;font-weight:600;">Reset Your Password</h2>
                    <p style="color:#a0a0a0;line-height:1.6;margin:0 0 24px;">We received a request to reset your password. Click the button below to set a new one. This link will expire in <strong style="color:#e5e5e5;">1 hour</strong>.</p>
                    <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">Reset Password</a>
                    <p style="color:#555;font-size:12px;margin:24px 0 0;">If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border:none;border-top:1px solid #222;margin:32px 0;" />
                    <p style="color:#444;font-size:11px;margin:0;">Or copy this link: <span style="color:#6366f1;">${resetUrl}</span></p>
                </div>
            </div>
        `,
    })
}

export async function sendEmailVerificationEmail(email: string, token: string) {
    const verifyUrl = `${BASE_URL}/verify-email?token=${token}`
    await getResend().emails.send({
        from: FROM,
        to: email,
        subject: "Verify Your Email — farjadp.info",
        html: `
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;border-radius:12px;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 32px;text-align:center;">
                    <h1 style="color:#fff;font-size:28px;margin:0;font-weight:700;">farjadp.info</h1>
                    <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:14px;">Personal Website</p>
                </div>
                <div style="padding:40px 32px;">
                    <h2 style="color:#fff;font-size:22px;margin:0 0 16px;font-weight:600;">Verify Your Email</h2>
                    <p style="color:#a0a0a0;line-height:1.6;margin:0 0 24px;">Welcome! Please verify your email to activate your account. This link expires in <strong style="color:#e5e5e5;">24 hours</strong>.</p>
                    <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#10b981,#059669);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">Verify Email</a>
                    <hr style="border:none;border-top:1px solid #222;margin:32px 0;" />
                    <p style="color:#444;font-size:11px;margin:0;">Or copy this link: <span style="color:#10b981;">${verifyUrl}</span></p>
                </div>
            </div>
        `,
    })
}

export async function sendWelcomeEmail(email: string, name: string) {
    await getResend().emails.send({
        from: FROM,
        to: email,
        subject: "Welcome to farjadp.info!",
        html: `
            <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;border-radius:12px;overflow:hidden;">
                <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 32px;text-align:center;">
                    <h1 style="color:#fff;font-size:28px;margin:0;font-weight:700;">farjadp.info</h1>
                    <p style="color:rgba(255,255,255,0.6);margin:8px 0 0;font-size:14px;">Personal Website</p>
                </div>
                <div style="padding:40px 32px;">
                    <h2 style="color:#fff;font-size:22px;margin:0 0 16px;font-weight:600;">Welcome, ${name}! 🎉</h2>
                    <p style="color:#a0a0a0;line-height:1.6;">Your account has been created successfully. We're glad to have you here.</p>
                </div>
            </div>
        `,
    })
}

/**
 * Tells Farjad a company has offered a perk to the Astaneh teams (/fa/lab/perks).
 * Every value is submitter-supplied, so all of it is escaped. Reply-To is the
 * submitter, so answering the notification answers the partner.
 * Throws when no recipient or Resend is configured; the caller records that in `emailOk`.
 */
export async function sendPerkOfferNotification(offer: {
    id: string
    companyName: string
    website: string
    contactName: string
    email: string
    telegram: string
    country: string
    perkType: string
    description: string
    valueEstimate: string
    markets: string
    validity: string
}) {
    // Only PERK_NOTIFY_EMAIL. This used to fall back to ADMIN_EMAIL, which is the
    // OWNER account's LOGIN identity (admin@farjadp.info), not a mailbox — mail to it
    // hard-bounces. A login identity is never a delivery address.
    const to = process.env.PERK_NOTIFY_EMAIL?.trim()
    if (!to) throw new Error("Missing PERK_NOTIFY_EMAIL environment variable")

    // FROM falls back to onboarding@resend.dev, which Resend only delivers to the
    // account owner. Prefer the verified sending domain when EMAIL_FROM is unset.
    const marketingFrom = process.env.EMAIL_MARKETING_FROM?.trim()
    const from = process.env.EMAIL_FROM
        ? FROM
        : marketingFrom
            ? `${process.env.EMAIL_FROM_NAME || "Farjad PMD"} <${marketingFrom}>`
            : FROM

    const rows: [string, string][] = [
        ["شرکت", offer.companyName],
        ["وب‌سایت", offer.website],
        ["رابط", offer.contactName],
        ["ایمیل", offer.email],
        ["تلگرام", offer.telegram || "—"],
        ["کشور ثبت", offer.country],
        ["نوع Perk", offer.perkType],
        ["ارزش تقریبی", offer.valueEstimate || "—"],
        ["بازارها", offer.markets],
        ["اعتبار", offer.validity || "—"],
    ]

    const { error } = await getResend().emails.send({
        from,
        to,
        replyTo: offer.email,
        subject: `Perk جدید برای آستانه — ${offer.companyName.replace(/\s+/g, " ")}`,
        html: `
            <div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1C1917;line-height:1.9;">
                <h2 style="color:#1B4B43;margin:0 0 16px;">پیشنهاد Perk جدید برای آستانه</h2>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    ${rows
                        .map(
                            ([k, v]) =>
                                `<tr><td style="padding:6px 0;color:#78716c;width:120px;vertical-align:top;">${k}</td><td style="padding:6px 0;">${escapeHtml(v)}</td></tr>`
                        )
                        .join("")}
                </table>
                <h3 style="color:#1B4B43;margin:24px 0 8px;font-size:15px;">توضیح</h3>
                <p style="white-space:pre-wrap;margin:0;background:#f6f3ec;padding:12px 16px;border-radius:8px;">${escapeHtml(offer.description)}</p>
                <p style="color:#a8a29e;font-size:12px;margin-top:24px;">شناسه: ${escapeHtml(offer.id)} · با «پاسخ» مستقیم به ${escapeHtml(offer.contactName)} جواب می‌دهید.</p>
            </div>
        `,
    })
    if (error) throw new Error(`Resend rejected the perk notification: ${error.message}`)
}
