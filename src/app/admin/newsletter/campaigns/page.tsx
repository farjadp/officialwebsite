// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Campaign index with creation entry point
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { createCampaign } from "@/lib/actions/email"
import { CampaignRowActions } from "@/components/email/campaign-row-actions"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const STATUS_STYLES: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-600",
    SCHEDULED: "bg-blue-50 text-blue-700",
    SENDING: "bg-violet-50 text-violet-700",
    PAUSED: "bg-amber-50 text-amber-700",
    SENT: "bg-emerald-50 text-emerald-700",
    FAILED: "bg-rose-50 text-rose-700",
}

function percent(n: number, d: number): string {
    return d ? `${Math.round((n / d) * 1000) / 10}%` : "—"
}

export default async function CampaignsPage() {
    const [campaigns, templates, lists] = await Promise.all([
        prisma.campaign.findMany({ include: { list: true }, orderBy: { createdAt: "desc" } }),
        prisma.emailTemplate.findMany({ orderBy: { name: "asc" } }),
        prisma.contactList.findMany({ orderBy: { name: "asc" } }),
    ])

    return (
        <div className="space-y-5">
            <form
                action={createCampaign}
                className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
                <label className="min-w-[200px] flex-1 space-y-1.5">
                    <span className="text-xs font-medium text-slate-700">Campaign name</span>
                    <input
                        name="name"
                        required
                        placeholder="August founder update"
                        className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                </label>
                <label className="space-y-1.5">
                    <span className="text-xs font-medium text-slate-700">Start from</span>
                    <select name="templateId" className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm">
                        <option value="">Blank canvas</option>
                        {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="space-y-1.5">
                    <span className="text-xs font-medium text-slate-700">Audience</span>
                    <select name="listId" className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm">
                        <option value="">Choose later</option>
                        {lists.map((list) => (
                            <option key={list.id} value={list.id}>
                                {list.name}
                            </option>
                        ))}
                    </select>
                </label>
                <button
                    type="submit"
                    className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                    Create campaign
                </button>
            </form>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                            <th className="px-5 py-2.5 font-medium">Campaign</th>
                            <th className="px-3 py-2.5 font-medium">Audience</th>
                            <th className="px-3 py-2.5 font-medium">Sent</th>
                            <th className="px-3 py-2.5 font-medium">Open</th>
                            <th className="px-3 py-2.5 font-medium">Click</th>
                            <th className="px-3 py-2.5 font-medium">Spam score</th>
                            <th className="px-3 py-2.5 font-medium">Status</th>
                            <th className="px-5 py-2.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-5 py-12 text-center text-sm text-slate-400">
                                    No campaigns yet.
                                </td>
                            </tr>
                        )}
                        {campaigns.map((campaign) => (
                            <tr key={campaign.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                                <td className="px-5 py-3">
                                    <Link
                                        href={
                                            campaign.status === "DRAFT"
                                                ? `/admin/newsletter/campaigns/${campaign.id}`
                                                : `/admin/newsletter/campaigns/${campaign.id}/report`
                                        }
                                        className="font-medium text-slate-900 hover:text-violet-700"
                                    >
                                        {campaign.name}
                                    </Link>
                                    <p className="text-xs text-slate-400">{campaign.subject || "No subject yet"}</p>
                                </td>
                                <td className="px-3 py-3 text-slate-600">{campaign.list?.name ?? "—"}</td>
                                <td className="px-3 py-3 tabular-nums text-slate-600">
                                    {campaign.sentCount}
                                    {campaign.totalRecipients > 0 && (
                                        <span className="text-slate-300"> / {campaign.totalRecipients}</span>
                                    )}
                                </td>
                                <td className="px-3 py-3 tabular-nums text-slate-600">
                                    {percent(campaign.uniqueOpenCount, campaign.sentCount)}
                                </td>
                                <td className="px-3 py-3 tabular-nums text-slate-600">
                                    {percent(campaign.uniqueClickCount, campaign.sentCount)}
                                </td>
                                <td className="px-3 py-3">
                                    {campaign.spamScore == null ? (
                                        <span className="text-slate-300">—</span>
                                    ) : (
                                        <span
                                            className={cn(
                                                "font-semibold tabular-nums",
                                                campaign.spamScore >= 80
                                                    ? "text-emerald-600"
                                                    : campaign.spamScore >= 55
                                                      ? "text-amber-600"
                                                      : "text-rose-600"
                                            )}
                                        >
                                            {campaign.spamScore}
                                        </span>
                                    )}
                                </td>
                                <td className="px-3 py-3">
                                    <span
                                        className={cn(
                                            "rounded-full px-2 py-0.5 text-xs font-medium",
                                            STATUS_STYLES[campaign.status]
                                        )}
                                    >
                                        {campaign.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                    <CampaignRowActions
                                        id={campaign.id}
                                        name={campaign.name}
                                        status={campaign.status}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
