// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Per-campaign analytics with link breakdown and AI post-mortem
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CampaignAnalysis } from "@/components/email/campaign-analysis"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

function rate(numerator: number, denominator: number): number {
    return denominator ? (numerator / denominator) * 100 : 0
}

function format(value: number): string {
    return `${Math.round(value * 10) / 10}%`
}

/** Benchmarks for a warm B2B founder list — what "good" actually looks like. */
const BENCHMARKS = {
    open: { good: 35, warn: 20 },
    click: { good: 3, warn: 1 },
    bounce: { good: 0.5, warn: 2, inverted: true },
    complaint: { good: 0.05, warn: 0.08, inverted: true },
    unsub: { good: 0.2, warn: 0.5, inverted: true },
}

function tone(value: number, benchmark: { good: number; warn: number; inverted?: boolean }) {
    if (benchmark.inverted) {
        if (value <= benchmark.good) return "text-emerald-600"
        return value <= benchmark.warn ? "text-amber-600" : "text-rose-600"
    }
    if (value >= benchmark.good) return "text-emerald-600"
    return value >= benchmark.warn ? "text-amber-600" : "text-rose-600"
}

export default async function CampaignReport({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
            list: true,
            variants: true,
            links: { orderBy: { clickCount: "desc" }, take: 12 },
        },
    })
    if (!campaign) notFound()

    const [recentEvents, topOpeners] = await Promise.all([
        prisma.emailEvent.findMany({
            where: { campaignId: id, type: { in: ["OPENED", "CLICKED", "BOUNCED", "COMPLAINED", "UNSUBSCRIBED"] } },
            orderBy: { createdAt: "desc" },
            take: 25,
        }),
        prisma.campaignRecipient.findMany({
            where: { campaignId: id, clickedAt: { not: null } },
            include: { contact: { select: { email: true, engagementScore: true } } },
            orderBy: { clickedAt: "desc" },
            take: 15,
        }),
    ])

    const sent = campaign.sentCount
    const metrics = [
        { label: "Delivered", value: rate(campaign.deliveredCount, sent), raw: campaign.deliveredCount, benchmark: BENCHMARKS.open },
        { label: "Unique opens", value: rate(campaign.uniqueOpenCount, sent), raw: campaign.uniqueOpenCount, benchmark: BENCHMARKS.open },
        { label: "Unique clicks", value: rate(campaign.uniqueClickCount, sent), raw: campaign.uniqueClickCount, benchmark: BENCHMARKS.click },
        { label: "Bounces", value: rate(campaign.bounceCount, sent), raw: campaign.bounceCount, benchmark: BENCHMARKS.bounce },
        { label: "Complaints", value: rate(campaign.complaintCount, sent), raw: campaign.complaintCount, benchmark: BENCHMARKS.complaint },
        { label: "Unsubscribes", value: rate(campaign.unsubCount, sent), raw: campaign.unsubCount, benchmark: BENCHMARKS.unsub },
    ]

    const clickToOpen = campaign.uniqueOpenCount
        ? (campaign.uniqueClickCount / campaign.uniqueOpenCount) * 100
        : 0

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">{campaign.name}</h1>
                    <p className="text-sm text-slate-500">
                        {campaign.subject} · {campaign.list?.name ?? "All active"} ·{" "}
                        {campaign.sentAt ? campaign.sentAt.toLocaleString() : campaign.status}
                    </p>
                </div>
                <Link
                    href={`/admin/newsletter/campaigns/${campaign.id}`}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-violet-400"
                >
                    Open in editor
                </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{metric.label}</div>
                        <div className={cn("mt-1.5 text-xl font-bold tabular-nums", tone(metric.value, metric.benchmark))}>
                            {format(metric.value)}
                        </div>
                        <div className="text-xs text-slate-400">{metric.raw.toLocaleString()} of {sent.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 className="text-sm font-semibold text-slate-900">Click-to-open rate</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        The truest measure of whether the content delivered on the subject line&apos;s promise.
                    </p>
                    <div className="mt-4 text-3xl font-bold tabular-nums text-slate-900">{format(clickToOpen)}</div>
                    <p className="mt-1 text-xs text-slate-400">
                        Above 10% means the body matched the expectation the subject set.
                    </p>
                </div>

                {campaign.abEnabled && campaign.variants.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
                        <h2 className="text-sm font-semibold text-slate-900">A/B result</h2>
                        <div className="mt-3 space-y-2">
                            {campaign.variants.map((variant) => {
                                const openRate = rate(variant.openCount, variant.sentCount)
                                const isWinner = campaign.abWinnerVariantId === variant.id
                                return (
                                    <div
                                        key={variant.id}
                                        className={cn(
                                            "rounded-lg border p-3",
                                            isWinner ? "border-emerald-300 bg-emerald-50" : "border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-medium text-slate-900">
                                                {variant.label}. {variant.subject}
                                            </span>
                                            {isWinner && (
                                                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                    WINNER
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {variant.sentCount} sent · {format(openRate)} open ·{" "}
                                            {format(rate(variant.clickCount, variant.sentCount))} click
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            <CampaignAnalysis campaignId={campaign.id} />

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-900">Links by clicks</h2>
                    </div>
                    {campaign.links.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-slate-400">No links tracked yet.</p>
                    ) : (
                        <ul className="divide-y divide-slate-50">
                            {campaign.links.map((link) => (
                                <li key={link.id} className="flex items-center justify-between gap-3 px-5 py-3">
                                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700" title={link.url}>
                                        {link.url}
                                    </span>
                                    <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">
                                        {link.clickCount}
                                        <span className="ml-1 text-xs font-normal text-slate-400">
                                            ({link.uniqueCount} unique)
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-900">Who clicked</h2>
                    </div>
                    {topOpeners.length === 0 ? (
                        <p className="px-5 py-8 text-center text-sm text-slate-400">No clicks yet.</p>
                    ) : (
                        <ul className="divide-y divide-slate-50">
                            {topOpeners.map((recipient) => (
                                <li key={recipient.id} className="flex items-center justify-between gap-3 px-5 py-2.5">
                                    <span className="truncate text-sm text-slate-700">{recipient.contact.email}</span>
                                    <span className="shrink-0 text-xs text-slate-400">
                                        score {recipient.contact.engagementScore}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-3">
                    <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
                </div>
                <ul className="divide-y divide-slate-50">
                    {recentEvents.length === 0 && (
                        <li className="px-5 py-8 text-center text-sm text-slate-400">Nothing recorded yet.</li>
                    )}
                    {recentEvents.map((event) => (
                        <li key={event.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                            <span
                                className={cn(
                                    "w-24 shrink-0 rounded px-1.5 py-0.5 text-center text-[10px] font-semibold uppercase",
                                    event.type === "CLICKED" && "bg-violet-50 text-violet-700",
                                    event.type === "OPENED" && "bg-blue-50 text-blue-700",
                                    event.type === "BOUNCED" && "bg-rose-50 text-rose-700",
                                    event.type === "COMPLAINED" && "bg-rose-100 text-rose-800",
                                    event.type === "UNSUBSCRIBED" && "bg-slate-100 text-slate-600"
                                )}
                            >
                                {event.type}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-slate-700">{event.email}</span>
                            {event.linkUrl && (
                                <span className="hidden max-w-[220px] truncate text-xs text-slate-400 sm:block">
                                    {event.linkUrl}
                                </span>
                            )}
                            <span className="shrink-0 text-xs text-slate-400">
                                {event.createdAt.toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
