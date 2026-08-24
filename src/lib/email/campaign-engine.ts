// ============================================================================
// Hardware Source: campaign-engine.ts
// Version: 1.0.0 — 2026-08-23
// Why: Build audience, queue recipients, drain the queue with warm-up limits
// Env / Identity: Server module
// ============================================================================

import { prisma } from "@/lib/prisma"
import type { Block, EmailTheme } from "./blocks"
import { renderEmail } from "./render"
import { applyMergeTags, rewriteLinksForTracking, extractLinks } from "./merge"
import { buildContactWhere, combineFilters, type SegmentFilter } from "./segment"
import {
    marketingBaseUrl,
    marketingFrom,
    sendOne,
    recordSend,
    remainingDailyQuota,
    throttleDelayMs,
    sleep,
} from "./provider"

export function unsubscribeUrl(token: string): string {
    return `${marketingBaseUrl()}/e/u/${token}`
}
export function preferencesUrl(token: string): string {
    return `${marketingBaseUrl()}/e/p/${token}`
}
function pixelUrl(campaignId: string, recipientId: string): string {
    return `${marketingBaseUrl()}/e/o/${campaignId}/${recipientId}.png`
}

/**
 * Resolves the audience and writes one CampaignRecipient row per contact.
 * Materializing the queue up front makes sends resumable: a crashed or paused
 * run picks up exactly where it stopped instead of re-sending.
 */
export async function buildAudience(campaignId: string): Promise<number> {
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { list: true },
    })
    if (!campaign) throw new Error("Campaign not found")

    const filter = combineFilters(
        (campaign.list?.filter as SegmentFilter | null) ?? null,
        (campaign.segmentFilter as SegmentFilter | null) ?? null,
        campaign.list?.isDynamic ? null : campaign.listId
    )

    const contacts = await prisma.contact.findMany({
        where: buildContactWhere(filter, { sendableOnly: true }),
        select: { id: true, email: true, bestSendHour: true },
    })

    // Drop anyone on the suppression list even if their contact row looks active
    const suppressed = await prisma.suppression.findMany({
        where: { email: { in: contacts.map((c) => c.email.toLowerCase()) } },
        select: { email: true },
    })
    const blocked = new Set(suppressed.map((s) => s.email))
    const eligible = contacts.filter((c) => !blocked.has(c.email.toLowerCase()))

    if (!eligible.length) {
        await prisma.campaign.update({
            where: { id: campaignId },
            data: { totalRecipients: 0 },
        })
        return 0
    }

    // A/B split: only the test slice is divided; the remainder waits for a winner.
    const testSize = campaign.abEnabled
        ? Math.max(2, Math.floor((eligible.length * campaign.abTestPercent) / 100))
        : 0

    const base = campaign.scheduledAt ?? new Date()
    const rows = eligible.map((contact, index) => {
        let variantLabel = "A"
        if (campaign.abEnabled && index < testSize) {
            variantLabel = index % 2 === 0 ? "A" : "B"
        } else if (campaign.abEnabled) {
            variantLabel = "HOLD" // released once a winner is picked
        }

        let scheduledFor = base
        if (campaign.optimizeSendTime && contact.bestSendHour != null) {
            const when = new Date(base)
            when.setUTCHours(contact.bestSendHour, 0, 0, 0)
            if (when < base) when.setUTCDate(when.getUTCDate() + 1)
            scheduledFor = when
        }

        return {
            campaignId,
            contactId: contact.id,
            variantLabel,
            scheduledFor,
        }
    })

    await prisma.campaignRecipient.createMany({ data: rows, skipDuplicates: true })
    await prisma.campaign.update({
        where: { id: campaignId },
        data: { totalRecipients: rows.length },
    })

    return rows.length
}

/** Compiles the campaign body once; per-recipient work is only merge + tracking. */
async function compileCampaign(campaignId: string, variantLabel: string) {
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { variants: true },
    })
    if (!campaign) throw new Error("Campaign not found")

    const variant = campaign.variants.find((v) => v.label === variantLabel)
    const blocks =
        ((variant?.blocks as unknown as Block[] | null) ??
            (campaign.blocks as unknown as Block[])) ||
        []
    const subject = variant?.subject || campaign.subject
    const preheader = variant?.preheader || campaign.preheader

    return { campaign, blocks, subject, preheader }
}

export interface DrainResult {
    processed: number
    sent: number
    failed: number
    skipped: number
    quotaExhausted: boolean
    remainingQueued: number
}

/**
 * Sends up to `limit` queued recipients. Designed to be called repeatedly by a
 * cron tick rather than run as one long request — serverless functions time out,
 * and the daily warm-up cap means a large campaign is meant to span days.
 */
export async function drainQueue(
    campaignId: string,
    limit = 100
): Promise<DrainResult> {
    const result: DrainResult = {
        processed: 0, sent: 0, failed: 0, skipped: 0,
        quotaExhausted: false, remainingQueued: 0,
    }

    const quota = await remainingDailyQuota()
    if (quota <= 0) {
        result.quotaExhausted = true
        result.remainingQueued = await prisma.campaignRecipient.count({
            where: { campaignId, status: "QUEUED" },
        })
        return result
    }

    const batchSize = Math.min(limit, quota)
    const queued = await prisma.campaignRecipient.findMany({
        where: {
            campaignId,
            status: "QUEUED",
            variantLabel: { not: "HOLD" },
            OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }],
        },
        include: { contact: true },
        orderBy: { scheduledFor: "asc" },
        take: batchSize,
    })

    if (!queued.length) {
        result.remainingQueued = await prisma.campaignRecipient.count({
            where: { campaignId, status: "QUEUED" },
        })
        return result
    }

    const compiledCache = new Map<string, Awaited<ReturnType<typeof compileCampaign>>>()
    const baseUrl = marketingBaseUrl()

    for (const recipient of queued) {
        result.processed += 1

        let compiled = compiledCache.get(recipient.variantLabel)
        if (!compiled) {
            compiled = await compileCampaign(campaignId, recipient.variantLabel)
            compiledCache.set(recipient.variantLabel, compiled)
        }
        const { campaign, blocks, subject, preheader } = compiled
        const contact = recipient.contact

        const unsub = unsubscribeUrl(contact.unsubToken)
        const prefs = preferencesUrl(contact.unsubToken)

        const { html, text } = renderEmail(blocks, {
            theme: campaign.theme as Partial<EmailTheme>,
            preheader,
            unsubscribeUrl: unsub,
            preferencesUrl: prefs,
            postalAddress: process.env.EMAIL_POSTAL_ADDRESS,
            trackingPixelUrl: pixelUrl(campaignId, recipient.id),
            assetBaseUrl: baseUrl,
        })

        const ctx = {
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
            company: contact.company,
            attributes: (contact.attributes as Record<string, unknown>) ?? {},
            unsubscribeUrl: unsub,
            preferencesUrl: prefs,
        }

        const personalizedHtml = rewriteLinksForTracking(
            applyMergeTags(html, ctx),
            baseUrl,
            campaignId,
            recipient.id
        )

        const outcome = await sendOne({
            to: contact.email,
            from: marketingFrom(campaign.fromName, campaign.fromEmail || undefined),
            replyTo: campaign.replyTo || undefined,
            subject: applyMergeTags(subject, ctx),
            html: personalizedHtml,
            text: applyMergeTags(text, ctx),
            unsubscribeUrl: unsub,
            tags: [
                { name: "campaign", value: campaignId },
                { name: "variant", value: recipient.variantLabel },
            ],
        })

        if (outcome.suppressed) {
            result.skipped += 1
            await prisma.campaignRecipient.update({
                where: { id: recipient.id },
                data: { status: "SKIPPED", error: "suppressed" },
            })
            continue
        }

        if (outcome.ok) {
            result.sent += 1
            await prisma.$transaction([
                prisma.campaignRecipient.update({
                    where: { id: recipient.id },
                    data: { status: "SENT", providerId: outcome.id, sentAt: new Date() },
                }),
                prisma.contact.update({
                    where: { id: contact.id },
                    data: { sendCount: { increment: 1 }, lastSentAt: new Date() },
                }),
                prisma.campaign.update({
                    where: { id: campaignId },
                    data: { sentCount: { increment: 1 } },
                }),
                prisma.emailEvent.create({
                    data: { type: "SENT", campaignId, contactId: contact.id, email: contact.email },
                }),
            ])
            if (recipient.variantLabel !== "A" || campaign.abEnabled) {
                await prisma.campaignVariant.updateMany({
                    where: { campaignId, label: recipient.variantLabel },
                    data: { sentCount: { increment: 1 } },
                })
            }
            await recordSend()
        } else {
            result.failed += 1
            await prisma.campaignRecipient.update({
                where: { id: recipient.id },
                data: { status: "FAILED", error: outcome.error?.slice(0, 500) },
            })
        }

        const delay = throttleDelayMs(campaign.throttlePerHour)
        // Cap the in-request wait; the cron tick handles the longer spacing.
        if (delay > 0) await sleep(Math.min(delay, 2000))
    }

    result.remainingQueued = await prisma.campaignRecipient.count({
        where: { campaignId, status: "QUEUED" },
    })

    if (result.remainingQueued === 0) {
        const stillHeld = await prisma.campaignRecipient.count({
            where: { campaignId, variantLabel: "HOLD" },
        })
        if (stillHeld === 0) {
            await prisma.campaign.update({
                where: { id: campaignId },
                data: { status: "SENT", sentAt: new Date() },
            })
        }
    }

    return result
}

/**
 * Picks the winning A/B variant and releases the held-back majority to it.
 * Called once the test slice has had time to accumulate opens/clicks.
 */
export async function resolveAbWinner(campaignId: string): Promise<string | null> {
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { variants: true },
    })
    if (!campaign?.abEnabled || campaign.variants.length < 2) return null

    const metric = campaign.abWinnerMetric === "click" ? "clickCount" : "openCount"
    const scored = campaign.variants
        .map((v) => ({ v, rate: v.sentCount ? v[metric] / v.sentCount : 0 }))
        .sort((a, b) => b.rate - a.rate)

    const winner = scored[0].v

    await prisma.$transaction([
        prisma.campaign.update({
            where: { id: campaignId },
            data: { abWinnerVariantId: winner.id },
        }),
        prisma.campaignRecipient.updateMany({
            where: { campaignId, variantLabel: "HOLD" },
            data: { variantLabel: winner.label },
        }),
    ])

    return winner.label
}

/** Pre-registers outbound links so the report can name them before any click. */
export async function syncCampaignLinks(campaignId: string, html: string): Promise<void> {
    const urls = extractLinks(html)
    if (!urls.length) return

    const existing = await prisma.campaignLink.findMany({
        where: { campaignId },
        select: { url: true },
    })
    const known = new Set(existing.map((l) => l.url))
    const fresh = urls.filter((u) => !known.has(u))
    if (fresh.length) {
        await prisma.campaignLink.createMany({
            data: fresh.map((url) => ({ campaignId, url })),
        })
    }
}
