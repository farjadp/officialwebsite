// ============================================================================
// Hardware Source: route.ts
// Version: 1.0.0 — 2026-08-23
// Why: Ingest Resend delivery events; auto-suppress bounces and complaints
// Env / Identity: Server Route Handler
// ============================================================================

import { NextResponse } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { suppress, recordFailure, recordDelivered } from "@/lib/email/provider"
import type { EmailEventType } from "@prisma/client"

export const dynamic = "force-dynamic"

interface ResendWebhook {
    type: string
    created_at?: string
    data?: {
        email_id?: string
        to?: string[] | string
        subject?: string
        tags?: { name: string; value: string }[] | Record<string, string>
        bounce?: { type?: string; subType?: string; message?: string }
        click?: { link?: string; userAgent?: string }
        [key: string]: unknown
    }
}

/**
 * Svix signature verification. Resend signs every webhook; without this check
 * anyone who learns the URL could forge bounces and poison the suppression list.
 */
function verifySignature(payload: string, headers: Headers, secret: string): boolean {
    const id = headers.get("svix-id")
    const timestamp = headers.get("svix-timestamp")
    const signature = headers.get("svix-signature")
    if (!id || !timestamp || !signature) return false

    // Reject anything older than five minutes to block replay
    const age = Math.abs(Date.now() / 1000 - Number(timestamp))
    if (!Number.isFinite(age) || age > 300) return false

    const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64")
    const expected = crypto
        .createHmac("sha256", key)
        .update(`${id}.${timestamp}.${payload}`)
        .digest("base64")

    // The header may carry several space-separated "v1,<sig>" versions
    return signature.split(" ").some((part) => {
        const value = part.split(",")[1]
        if (!value) return false
        const a = Buffer.from(value)
        const b = Buffer.from(expected)
        return a.length === b.length && crypto.timingSafeEqual(a, b)
    })
}

const EVENT_MAP: Record<string, EmailEventType> = {
    "email.sent": "SENT",
    "email.delivered": "DELIVERED",
    "email.opened": "OPENED",
    "email.clicked": "CLICKED",
    "email.bounced": "BOUNCED",
    "email.complained": "COMPLAINED",
}

export async function POST(request: Request) {
    const payload = await request.text()
    const secret = process.env.RESEND_WEBHOOK_SECRET

    if (secret) {
        if (!verifySignature(payload, request.headers, secret)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
        }
    } else if (process.env.NODE_ENV === "production") {
        // Refuse to trust unsigned events in production rather than fail open
        console.error("RESEND_WEBHOOK_SECRET is not configured — rejecting webhook")
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    let event: ResendWebhook
    try {
        event = JSON.parse(payload)
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const type = EVENT_MAP[event.type]
    if (!type) return NextResponse.json({ ok: true, ignored: event.type })

    const rawTo = event.data?.to
    const email = (Array.isArray(rawTo) ? rawTo[0] : rawTo)?.toLowerCase()
    const providerId = event.data?.email_id

    // The recipient row is the authoritative link back to campaign and contact
    const recipient = providerId
        ? await prisma.campaignRecipient.findFirst({
              where: { providerId },
              include: { contact: true },
          })
        : null

    const contactId =
        recipient?.contactId ??
        (email
            ? (await prisma.contact.findUnique({ where: { email }, select: { id: true } }))?.id
            : undefined)

    const resolvedEmail = email ?? recipient?.contact.email
    if (!resolvedEmail) return NextResponse.json({ ok: true, ignored: "no recipient" })

    const campaignId = recipient?.campaignId ?? null

    await prisma.emailEvent.create({
        data: {
            type,
            campaignId,
            contactId,
            email: resolvedEmail,
            linkUrl: event.data?.click?.link,
            userAgent: event.data?.click?.userAgent?.slice(0, 400),
            meta: event.data ? (JSON.parse(JSON.stringify(event.data)) as object) : undefined,
        },
    })

    switch (type) {
        case "DELIVERED": {
            // Only campaign mail counts here. The daily "sent" figure counts
            // campaign sends alone, so folding seed tests into "delivered" would
            // push the ratio above 100%.
            if (recipient) {
                await recordDelivered()
                await prisma.campaignRecipient.update({
                    where: { id: recipient.id },
                    data: { status: "DELIVERED" },
                })
            }
            if (campaignId) {
                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { deliveredCount: { increment: 1 } },
                })
            }
            break
        }

        case "BOUNCED": {
            const bounceType = (event.data?.bounce?.type ?? "").toLowerCase()
            // Soft bounces are transient (full mailbox, greylisting) — suppressing
            // them would throw away deliverable addresses.
            const isHard = bounceType === "hard" || bounceType === "permanent" || !bounceType

            if (isHard) {
                await suppress(resolvedEmail, "HARD_BOUNCE", event.data?.bounce?.message)
            }
            await recordFailure("bounced")

            if (recipient) {
                await prisma.campaignRecipient.update({
                    where: { id: recipient.id },
                    data: { status: "BOUNCED", error: event.data?.bounce?.message?.slice(0, 500) },
                })
            }
            if (campaignId) {
                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { bounceCount: { increment: 1 } },
                })
            }
            break
        }

        case "COMPLAINED": {
            // A complaint is the most expensive signal there is — always suppress,
            // and zero the score so no automation can re-enroll them.
            await suppress(resolvedEmail, "COMPLAINT", "spam report")
            await recordFailure("complained")

            if (contactId) {
                await prisma.contact.update({
                    where: { id: contactId },
                    data: { engagementScore: 0 },
                })
            }
            if (campaignId) {
                await prisma.campaign.update({
                    where: { id: campaignId },
                    data: { complaintCount: { increment: 1 } },
                })
            }
            break
        }

        default:
            break
    }

    return NextResponse.json({ ok: true })
}
