// ============================================================================
// Hardware Source: tracking.ts
// Version: 1.0.0 — 2026-08-23
// Why: Record engagement events and keep contact scores current
// Env / Identity: Server module
// ============================================================================

import { prisma } from "@/lib/prisma"

/**
 * Apple Mail Privacy Protection pre-fetches images, so a share of opens are
 * machine-generated. Opens still carry signal in aggregate, but clicks are
 * weighted far more heavily in the engagement score for exactly this reason.
 */
const APPLE_PROXY = /GoogleImageProxy|YahooMailProxy|Apple-?Mail|Mozilla\/5\.0 \(Macintosh.*\) AppleWebKit.*\(KHTML, like Gecko\)$/i

export function looksAutomated(userAgent: string | null): boolean {
    if (!userAgent) return true
    return APPLE_PROXY.test(userAgent) && !/Chrome|Safari\/[0-9]+\.[0-9]+ Version/.test(userAgent)
}

function clampScore(value: number): number {
    return Math.max(0, Math.min(100, value))
}

export async function recordOpen(
    campaignId: string,
    recipientId: string,
    userAgent: string | null
): Promise<void> {
    const recipient = await prisma.campaignRecipient.findUnique({
        where: { id: recipientId },
        include: { contact: true },
    })
    if (!recipient || recipient.campaignId !== campaignId) return

    const isFirstOpen = !recipient.openedAt
    const now = new Date()

    const writes: Promise<unknown>[] = [
        prisma.emailEvent.create({
            data: {
                type: "OPENED",
                campaignId,
                contactId: recipient.contactId,
                email: recipient.contact.email,
                userAgent: userAgent?.slice(0, 400),
                meta: { automated: looksAutomated(userAgent) },
            },
        }),
        prisma.campaign.update({
            where: { id: campaignId },
            data: {
                openCount: { increment: 1 },
                uniqueOpenCount: isFirstOpen ? { increment: 1 } : undefined,
            },
        }),
    ]

    if (isFirstOpen) {
        writes.push(
            prisma.campaignRecipient.update({
                where: { id: recipientId },
                data: { openedAt: now, status: "DELIVERED" },
            }),
            prisma.contact.update({
                where: { id: recipient.contactId },
                data: {
                    openCount: { increment: 1 },
                    lastOpenedAt: now,
                    // Learning the reader's habitual hour is what makes send-time
                    // optimization possible without asking them anything.
                    bestSendHour: now.getUTCHours(),
                    engagementScore: clampScore(recipient.contact.engagementScore + 3),
                },
            }),
            prisma.campaignVariant.updateMany({
                where: { campaignId, label: recipient.variantLabel },
                data: { openCount: { increment: 1 } },
            })
        )
    }

    await Promise.all(writes)
}

export async function recordClick(
    campaignId: string,
    recipientId: string,
    url: string,
    userAgent: string | null
): Promise<void> {
    const recipient = await prisma.campaignRecipient.findUnique({
        where: { id: recipientId },
        include: { contact: true },
    })
    if (!recipient || recipient.campaignId !== campaignId) return

    const isFirstClick = !recipient.clickedAt
    const now = new Date()

    await Promise.all([
        prisma.emailEvent.create({
            data: {
                type: "CLICKED",
                campaignId,
                contactId: recipient.contactId,
                email: recipient.contact.email,
                linkUrl: url,
                userAgent: userAgent?.slice(0, 400),
            },
        }),
        prisma.campaign.update({
            where: { id: campaignId },
            data: {
                clickCount: { increment: 1 },
                uniqueClickCount: isFirstClick ? { increment: 1 } : undefined,
            },
        }),
        prisma.contact.update({
            where: { id: recipient.contactId },
            data: {
                clickCount: { increment: 1 },
                lastClickedAt: now,
                // A click is a deliberate human action — worth far more than an open
                engagementScore: clampScore(recipient.contact.engagementScore + 8),
            },
        }),
        isFirstClick
            ? prisma.campaignRecipient.update({
                  where: { id: recipientId },
                  data: { clickedAt: now, openedAt: recipient.openedAt ?? now, status: "DELIVERED" },
              })
            : Promise.resolve(),
        prisma.campaignVariant.updateMany({
            where: { campaignId, label: recipient.variantLabel },
            data: { clickCount: { increment: 1 } },
        }),
        prisma.campaignLink.updateMany({
            where: { campaignId, url },
            data: { clickCount: { increment: 1 }, uniqueCount: isFirstClick ? { increment: 1 } : undefined },
        }),
    ])
}

/** Decays scores for silent contacts and archives the long-dead ones. */
export async function runSunsetPolicy(options: {
    decayAfterDays?: number
    sunsetAfterDays?: number
    dryRun?: boolean
} = {}): Promise<{ decayed: number; sunset: number }> {
    const decayAfter = options.decayAfterDays ?? 60
    const sunsetAfter = options.sunsetAfterDays ?? 180

    const decayCutoff = new Date(Date.now() - decayAfter * 86_400_000)
    const sunsetCutoff = new Date(Date.now() - sunsetAfter * 86_400_000)

    const staleWhere = {
        status: "ACTIVE" as const,
        sendCount: { gt: 3 },
        OR: [{ lastOpenedAt: null }, { lastOpenedAt: { lt: decayCutoff } }],
    }

    if (options.dryRun) {
        const [decayed, sunset] = await Promise.all([
            prisma.contact.count({ where: staleWhere }),
            prisma.contact.count({
                where: {
                    status: "ACTIVE",
                    sendCount: { gt: 5 },
                    OR: [{ lastOpenedAt: null }, { lastOpenedAt: { lt: sunsetCutoff } }],
                },
            }),
        ])
        return { decayed, sunset }
    }

    const decayed = await prisma.contact.updateMany({
        where: staleWhere,
        data: { engagementScore: { decrement: 5 } },
    })

    const sunset = await prisma.contact.updateMany({
        where: {
            status: "ACTIVE",
            sendCount: { gt: 5 },
            OR: [{ lastOpenedAt: null }, { lastOpenedAt: { lt: sunsetCutoff } }],
        },
        data: { status: "SUNSET" },
    })

    return { decayed: decayed.count, sunset: sunset.count }
}
