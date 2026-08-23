// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Email marketing overview — list health, sending health, recent campaigns
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getTodayStat } from "@/lib/email/provider"
import { Users, Send, MousePointerClick, AlertTriangle, TrendingUp, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

function percent(numerator: number, denominator: number): string {
    if (!denominator) return "—"
    return `${Math.round((numerator / denominator) * 1000) / 10}%`
}

function Stat({
    label,
    value,
    sub,
    icon: Icon,
    tone = "default",
}: {
    label: string
    value: string | number
    sub?: string
    icon: typeof Users
    tone?: "default" | "good" | "warn" | "bad"
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
                <Icon className="h-4 w-4 text-slate-300" />
            </div>
            <div
                className={cn(
                    "mt-2 text-2xl font-bold tabular-nums",
                    tone === "good" && "text-emerald-600",
                    tone === "warn" && "text-amber-600",
                    tone === "bad" && "text-rose-600",
                    tone === "default" && "text-slate-900"
                )}
            >
                {value}
            </div>
            {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
        </div>
    )
}

export default async function NewsletterOverview() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000)

    const [
        active,
        pending,
        unsubscribed,
        suppressed,
        engaged,
        campaigns,
        recentCampaigns,
        todayStat,
        totals,
    ] = await Promise.all([
        prisma.contact.count({ where: { status: "ACTIVE" } }),
        prisma.contact.count({ where: { status: "PENDING" } }),
        prisma.contact.count({ where: { status: "UNSUBSCRIBED" } }),
        prisma.suppression.count(),
        prisma.contact.count({ where: { status: "ACTIVE", lastOpenedAt: { gte: thirtyDaysAgo } } }),
        prisma.campaign.count(),
        prisma.campaign.findMany({
            where: { status: { in: ["SENT", "SENDING"] } },
            orderBy: { createdAt: "desc" },
            take: 6,
        }),
        getTodayStat(),
        prisma.campaign.aggregate({
            where: { status: "SENT" },
            _sum: {
                sentCount: true,
                uniqueOpenCount: true,
                uniqueClickCount: true,
                bounceCount: true,
                complaintCount: true,
            },
        }),
    ])

    const sent = totals._sum.sentCount ?? 0
    const bounceRate = sent ? (totals._sum.bounceCount ?? 0) / sent : 0
    const complaintRate = sent ? (totals._sum.complaintCount ?? 0) / sent : 0

    return (
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat
                    label="Active contacts"
                    value={active.toLocaleString()}
                    sub={`${pending} pending confirmation`}
                    icon={Users}
                />
                <Stat
                    label="Engaged (30d)"
                    value={active ? percent(engaged, active) : "—"}
                    sub={`${engaged.toLocaleString()} opened recently`}
                    icon={TrendingUp}
                    tone={active && engaged / active > 0.25 ? "good" : "warn"}
                />
                <Stat
                    label="Open rate (all time)"
                    value={percent(totals._sum.uniqueOpenCount ?? 0, sent)}
                    sub={`${sent.toLocaleString()} emails sent`}
                    icon={Mail}
                />
                <Stat
                    label="Click rate (all time)"
                    value={percent(totals._sum.uniqueClickCount ?? 0, sent)}
                    sub={`${campaigns} campaigns created`}
                    icon={MousePointerClick}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 className="text-sm font-semibold text-slate-900">Today&apos;s sending window</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Volume ramps automatically and holds flat after an unhealthy day.
                    </p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tabular-nums text-slate-900">
                            {todayStat.sent.toLocaleString()}
                        </span>
                        <span className="text-sm text-slate-400">/ {todayStat.dailyCap.toLocaleString()} cap</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-violet-600 transition-all"
                            style={{ width: `${Math.min(100, (todayStat.sent / todayStat.dailyCap) * 100)}%` }}
                        />
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 className="text-sm font-semibold text-slate-900">Reputation signals</h2>
                    <dl className="mt-4 space-y-3">
                        {[
                            { label: "Bounce rate", value: bounceRate, ceiling: 0.02, format: percent(totals._sum.bounceCount ?? 0, sent) },
                            { label: "Complaint rate", value: complaintRate, ceiling: 0.0008, format: percent(totals._sum.complaintCount ?? 0, sent) },
                        ].map((metric) => (
                            <div key={metric.label} className="flex items-center justify-between">
                                <dt className="text-sm text-slate-600">{metric.label}</dt>
                                <dd
                                    className={cn(
                                        "text-sm font-semibold tabular-nums",
                                        metric.value > metric.ceiling ? "text-rose-600" : "text-emerald-600"
                                    )}
                                >
                                    {metric.format}
                                </dd>
                            </div>
                        ))}
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-slate-600">Suppressed addresses</dt>
                            <dd className="text-sm font-semibold tabular-nums text-slate-900">{suppressed}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-slate-600">Unsubscribed</dt>
                            <dd className="text-sm font-semibold tabular-nums text-slate-900">{unsubscribed}</dd>
                        </div>
                    </dl>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
                    <div className="mt-4 space-y-2">
                        {[
                            { href: "/admin/newsletter/campaigns", label: "New campaign", icon: Send },
                            { href: "/admin/newsletter/import", label: "Import contacts", icon: Users },
                            { href: "/admin/newsletter/deliverability", label: "Check DNS & warm-up", icon: AlertTriangle },
                        ].map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-violet-400 hover:text-violet-700"
                            >
                                <action.icon className="h-4 w-4" />
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">Recent campaigns</h2>
                </div>
                {recentCampaigns.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-slate-400">
                        Nothing sent yet.{" "}
                        <Link href="/admin/newsletter/campaigns" className="text-violet-600 underline">
                            Create your first campaign
                        </Link>
                        .
                    </p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                <th className="px-5 py-2.5 font-medium">Campaign</th>
                                <th className="px-3 py-2.5 font-medium">Sent</th>
                                <th className="px-3 py-2.5 font-medium">Opens</th>
                                <th className="px-3 py-2.5 font-medium">Clicks</th>
                                <th className="px-3 py-2.5 font-medium">Bounces</th>
                                <th className="px-5 py-2.5 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                                    <td className="px-5 py-3">
                                        <Link
                                            href={`/admin/newsletter/campaigns/${campaign.id}/report`}
                                            className="font-medium text-slate-900 hover:text-violet-700"
                                        >
                                            {campaign.name}
                                        </Link>
                                        <p className="text-xs text-slate-400">{campaign.subject}</p>
                                    </td>
                                    <td className="px-3 py-3 tabular-nums text-slate-600">{campaign.sentCount}</td>
                                    <td className="px-3 py-3 tabular-nums text-slate-600">
                                        {percent(campaign.uniqueOpenCount, campaign.sentCount)}
                                    </td>
                                    <td className="px-3 py-3 tabular-nums text-slate-600">
                                        {percent(campaign.uniqueClickCount, campaign.sentCount)}
                                    </td>
                                    <td className="px-3 py-3 tabular-nums text-slate-600">{campaign.bounceCount}</td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={cn(
                                                "rounded-full px-2 py-0.5 text-xs font-medium",
                                                campaign.status === "SENT" && "bg-emerald-50 text-emerald-700",
                                                campaign.status === "SENDING" && "bg-violet-50 text-violet-700"
                                            )}
                                        >
                                            {campaign.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
