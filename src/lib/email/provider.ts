// ============================================================================
// Hardware Source: provider.ts
// Version: 1.0.0 — 2026-08-23
// Why: Resend transport with warm-up ceiling, throttling and suppression guard
// Env / Identity: Server module
// ============================================================================

import { Resend } from "resend"
import { prisma } from "@/lib/prisma"

let client: Resend | null = null

export function getResend(): Resend {
    if (!client) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error("Missing RESEND_API_KEY environment variable")
        }
        client = new Resend(process.env.RESEND_API_KEY)
    }
    return client
}

export function marketingBaseUrl(): string {
    return (
        process.env.EMAIL_PUBLIC_URL ||
        process.env.NEXTAUTH_URL ||
        "https://farjadp.info"
    ).replace(/\/$/, "")
}

/** Display name on outgoing mail. Configurable so it never needs a code change. */
export function senderName(): string {
    return process.env.EMAIL_FROM_NAME || "Farjad PMD"
}

/** Marketing mail must not share a subdomain with transactional mail. */
export function marketingFrom(name: string, email?: string): string {
    const address =
        email ||
        process.env.EMAIL_MARKETING_FROM ||
        process.env.EMAIL_FROM ||
        "hello@mail.farjadp.info"
    // Accept a pre-formatted "Name <addr>" value from env untouched
    if (address.includes("<")) return address
    return `${name} <${address}>`
}

export interface SendArgs {
    to: string
    from: string
    replyTo?: string
    subject: string
    html: string
    text: string
    unsubscribeUrl: string
    /** Groups messages in Resend's dashboard and aids bounce triage */
    tags?: { name: string; value: string }[]
}

export interface SendResult {
    ok: boolean
    id?: string
    error?: string
    suppressed?: boolean
}

/** Never send to an address we already know bounced, complained or opted out. */
export async function isSuppressed(email: string): Promise<boolean> {
    const hit = await prisma.suppression.findUnique({
        where: { email: email.toLowerCase() },
        select: { id: true },
    })
    return !!hit
}

export async function suppress(
    email: string,
    reason: "HARD_BOUNCE" | "COMPLAINT" | "UNSUBSCRIBE" | "MANUAL" | "INVALID",
    detail?: string
): Promise<void> {
    const lower = email.toLowerCase()
    await prisma.suppression.upsert({
        where: { email: lower },
        create: { email: lower, reason, detail },
        update: { reason, detail },
    })

    const statusByReason = {
        HARD_BOUNCE: "BOUNCED",
        COMPLAINT: "COMPLAINED",
        UNSUBSCRIBE: "UNSUBSCRIBED",
        MANUAL: "UNSUBSCRIBED",
        INVALID: "BOUNCED",
    } as const

    await prisma.contact.updateMany({
        where: { email: lower },
        data: { status: statusByReason[reason] },
    })
}

export async function sendOne(args: SendArgs): Promise<SendResult> {
    if (await isSuppressed(args.to)) {
        return { ok: false, suppressed: true, error: "suppressed" }
    }

    try {
        const { data, error } = await getResend().emails.send({
            from: args.from,
            to: args.to,
            replyTo: args.replyTo,
            subject: args.subject,
            html: args.html,
            text: args.text,
            headers: {
                // RFC 8058 one-click unsubscribe. Gmail and Yahoo have required this
                // for bulk senders since 2024 — without it, bulk mail is throttled.
                "List-Unsubscribe": `<${args.unsubscribeUrl}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
            tags: args.tags,
        })

        if (error) return { ok: false, error: error.message }
        return { ok: true, id: data?.id }
    } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) }
    }
}

// ── Warm-up ────────────────────────────────────────────────────────────────
// A new sending domain that pushes thousands of messages on day one gets
// filtered wholesale. Volume ramps geometrically and only on healthy days.

const WARMUP_START = Number(process.env.EMAIL_WARMUP_START ?? 50)
const WARMUP_MULTIPLIER = 1.5
const WARMUP_CEILING = Number(process.env.EMAIL_DAILY_CAP ?? 20_000)

function today(): Date {
    const d = new Date()
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

export async function getTodayStat() {
    const day = today()
    const existing = await prisma.sendingStat.findUnique({ where: { day } })
    if (existing) return existing

    const previous = await prisma.sendingStat.findFirst({
        where: { day: { lt: day } },
        orderBy: { day: "desc" },
    })

    let cap = WARMUP_START
    if (previous) {
        const bounceRate = previous.sent ? previous.bounced / previous.sent : 0
        const complaintRate = previous.sent ? previous.complained / previous.sent : 0
        // Hold volume flat when yesterday looked unhealthy; back off hard on complaints.
        if (complaintRate > 0.001 || bounceRate > 0.03) {
            cap = Math.max(WARMUP_START, Math.floor(previous.dailyCap * 0.5))
        } else if (previous.sent >= previous.dailyCap * 0.8) {
            cap = Math.min(WARMUP_CEILING, Math.floor(previous.dailyCap * WARMUP_MULTIPLIER))
        } else {
            cap = previous.dailyCap
        }
    }

    return prisma.sendingStat.create({ data: { day, dailyCap: cap } })
}

export async function remainingDailyQuota(): Promise<number> {
    const stat = await getTodayStat()
    return Math.max(0, stat.dailyCap - stat.sent)
}

export async function recordSend(delivered = false): Promise<void> {
    const day = today()
    await prisma.sendingStat.upsert({
        where: { day },
        create: { day, sent: 1, delivered: delivered ? 1 : 0, dailyCap: WARMUP_START },
        update: { sent: { increment: 1 }, delivered: delivered ? { increment: 1 } : undefined },
    })
}

export async function recordFailure(kind: "bounced" | "complained"): Promise<void> {
    const day = today()
    await prisma.sendingStat.upsert({
        where: { day },
        create: { day, [kind]: 1, dailyCap: WARMUP_START },
        update: { [kind]: { increment: 1 } },
    })
}

/** Spacing between messages so a batch does not arrive as a burst. */
export function throttleDelayMs(perHour: number): number {
    if (!perHour || perHour <= 0) return 0
    return Math.max(0, Math.floor(3_600_000 / perHour))
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
