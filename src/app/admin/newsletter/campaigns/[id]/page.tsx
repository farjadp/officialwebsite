// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Campaign composer — settings, editor, audience, send controls
// Env / Identity: React Server Component
// ============================================================================

import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import type { Block, EmailTheme } from "@/lib/email/blocks"
import { DEFAULT_THEME } from "@/lib/email/blocks"
import { CampaignComposer } from "@/components/email/campaign-composer"

export const dynamic = "force-dynamic"

export default async function CampaignEditorPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const [campaign, lists] = await Promise.all([
        prisma.campaign.findUnique({ where: { id }, include: { variants: true } }),
        prisma.contactList.findMany({ orderBy: { name: "asc" } }),
    ])
    if (!campaign) notFound()

    return (
        <CampaignComposer
            campaign={{
                id: campaign.id,
                name: campaign.name,
                subject: campaign.subject,
                preheader: campaign.preheader,
                fromName: campaign.fromName,
                fromEmail: campaign.fromEmail,
                replyTo: campaign.replyTo,
                listId: campaign.listId,
                status: campaign.status,
                blocks: (campaign.blocks as unknown as Block[]) ?? [],
                theme: { ...DEFAULT_THEME, ...((campaign.theme as unknown as EmailTheme) ?? {}) },
                abEnabled: campaign.abEnabled,
                abTestPercent: campaign.abTestPercent,
                abWinnerMetric: campaign.abWinnerMetric,
                optimizeSendTime: campaign.optimizeSendTime,
                throttlePerHour: campaign.throttlePerHour,
                scheduledAt: campaign.scheduledAt?.toISOString() ?? null,
                totalRecipients: campaign.totalRecipients,
                sentCount: campaign.sentCount,
                spamScore: campaign.spamScore,
                variants: campaign.variants.map((v) => ({
                    label: v.label,
                    subject: v.subject,
                    preheader: v.preheader,
                })),
            }}
            lists={lists.map((l) => ({ id: l.id, name: l.name }))}
            defaultFromEmail={process.env.EMAIL_MARKETING_FROM ?? ""}
        />
    )
}
