// ============================================================================
// Hardware Source: stats.ts
// Version: 1.0.0 — 2026-08-24
// Why: One honest view of sending volume and health, today and over time
// Env / Identity: Server module
// ============================================================================

import { prisma } from "@/lib/prisma"
import { getTodayStat, startOfUtcDay, isWarmupEnabled } from "./provider"

export interface CampaignUsage {
    id: string
    name: string
    status: string
    used: number
    /** null when there is no daily ceiling */
    remaining: number | null
    queued: number
    /** Held back because the reader was mailed by another campaign too recently */
    deferred: number
}

export interface DayStat {
    day: string
    sent: number
    delivered: number
    bounced: number
    complained: number
    cap: number
    bounceRate: number
    complaintRate: number
}

export interface SendingStats {
    today: {
        /** null when warm-up is off */
        cap: number | null
        warmupEnabled: boolean
        /** Every campaign shares this ceiling, each with its own allowance */
        domainSent: number
        campaigns: CampaignUsage[]
    }
    history: DayStat[]
    allTime: {
        sent: number
        delivered: number
        bounced: number
        complained: number
        opened: number
        clicked: number
        unsubscribed: number
        bounceRate: number
        complaintRate: number
        openRate: number
        clickRate: number
        days: number
    }
}

const MIN_HOURS_BETWEEN_SENDS = Number(process.env.EMAIL_MIN_HOURS_BETWEEN_SENDS ?? 24)

export async function getSendingStats(historyDays = 30): Promise<SendingStats> {
    const stat = await getTodayStat()
    const warmup = isWarmupEnabled()
    const dayStart = startOfUtcDay()
    const recentCutoff = new Date(Date.now() - MIN_HOURS_BETWEEN_SENDS * 3_600_000)

    // Campaigns that are running, or that already sent something today
    const active = await prisma.campaign.findMany({
        where: {
            OR: [
                { status: { in: ["SENDING", "PAUSED", "SCHEDULED"] } },
                { recipients: { some: { sentAt: { gte: dayStart } } } },
            ],
        },
        select: { id: true, name: true, status: true },
        orderBy: { createdAt: "desc" },
    })

    const campaigns: CampaignUsage[] = []
    for (const campaign of active) {
        const [used, queued, deferred] = await Promise.all([
            prisma.campaignRecipient.count({
                where: { campaignId: campaign.id, sentAt: { gte: dayStart } },
            }),
            prisma.campaignRecipient.count({
                where: { campaignId: campaign.id, status: "QUEUED" },
            }),
            prisma.campaignRecipient.count({
                where: {
                    campaignId: campaign.id,
                    status: "QUEUED",
                    contact: { lastSentAt: { gte: recentCutoff } },
                },
            }),
        ])
        campaigns.push({
            id: campaign.id,
            name: campaign.name,
            status: campaign.status,
            used,
            remaining: warmup ? Math.max(0, stat.dailyCap - used) : null,
            queued,
            deferred,
        })
    }

    const since = new Date(dayStart.getTime() - historyDays * 86_400_000)
    const rows = await prisma.sendingStat.findMany({
        where: { day: { gte: since } },
        orderBy: { day: "asc" },
    })

    const history: DayStat[] = rows.map((row) => ({
        day: row.day.toISOString().slice(0, 10),
        sent: row.sent,
        delivered: row.delivered,
        bounced: row.bounced,
        complained: row.complained,
        cap: row.dailyCap,
        bounceRate: row.sent ? (row.bounced / row.sent) * 100 : 0,
        complaintRate: row.sent ? (row.complained / row.sent) * 100 : 0,
    }))

    // All-time totals come from the campaigns themselves, including any still in
    // flight — a campaign that is mid-send has already reached real inboxes.
    const totals = await prisma.campaign.aggregate({
        where: { status: { in: ["SENT", "SENDING", "PAUSED"] } },
        _sum: {
            sentCount: true,
            deliveredCount: true,
            bounceCount: true,
            complaintCount: true,
            uniqueOpenCount: true,
            uniqueClickCount: true,
            unsubCount: true,
        },
    })

    const sent = totals._sum.sentCount ?? 0
    const rate = (value: number | null) => (sent ? ((value ?? 0) / sent) * 100 : 0)

    return {
        today: {
            cap: warmup ? stat.dailyCap : null,
            warmupEnabled: warmup,
            domainSent: stat.sent,
            campaigns,
        },
        history,
        allTime: {
            sent,
            delivered: totals._sum.deliveredCount ?? 0,
            bounced: totals._sum.bounceCount ?? 0,
            complained: totals._sum.complaintCount ?? 0,
            opened: totals._sum.uniqueOpenCount ?? 0,
            clicked: totals._sum.uniqueClickCount ?? 0,
            unsubscribed: totals._sum.unsubCount ?? 0,
            bounceRate: rate(totals._sum.bounceCount),
            complaintRate: rate(totals._sum.complaintCount),
            openRate: rate(totals._sum.uniqueOpenCount),
            clickRate: rate(totals._sum.uniqueClickCount),
            days: rows.length,
        },
    }
}
