import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM || "Farjad Pezeshk <onboarding@resend.dev>"
const BASE_URL = process.env.NEXTAUTH_URL || "https://farjadp.info"

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${BASE_URL}/reset-password?token=${token}`
    await resend.emails.send({
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
    await resend.emails.send({
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
    await resend.emails.send({
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
