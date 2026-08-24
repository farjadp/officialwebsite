// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: DNS checklist, warm-up curve, suppression list and list hygiene
// Env / Identity: React Server Component
// ============================================================================

import { prisma } from "@/lib/prisma"
import { DnsChecklist } from "@/components/email/dns-checklist"
import { SendingHistory } from "@/components/email/sending-stats"
import { getSendingStats } from "@/lib/email/stats"
import { fetchDomainStatus, dmarcRecord, RECORD_NOTES, checkPublicUrl } from "@/lib/email/domain-status"
import { SunsetControls } from "@/components/email/sunset-controls"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default async function DeliverabilityPage() {
    const fromAddress =
        process.env.EMAIL_MARKETING_FROM || process.env.EMAIL_FROM || "hello@mail.farjadp.info"
    const domain = fromAddress.split("@")[1]?.replace(/>$/, "") ?? "mail.farjadp.info"

    const [suppressions, byReason, statusCounts, domainStatus, publicUrl, sending] = await Promise.all([
        prisma.suppression.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
        prisma.suppression.groupBy({ by: ["reason"], _count: true }),
        prisma.contact.groupBy({ by: ["status"], _count: true }),
        fetchDomainStatus(domain),
        checkPublicUrl(),
        getSendingStats(30),
    ])


    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-lg font-semibold text-slate-900">Deliverability</h1>
                <p className="text-sm text-slate-500">
                    Inbox placement is earned by authentication, volume discipline and list hygiene — in that order.
                </p>
            </div>

            {!publicUrl.ok && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
                    <h2 className="text-sm font-semibold text-rose-900">
                        Tracking URL is not the canonical host
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-rose-800">
                        <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">{publicUrl.baseUrl}</code>{" "}
                        {publicUrl.redirectsTo
                            ? <>redirects to <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">{publicUrl.redirectsTo}</code>.</>
                            : <>could not be reached: {publicUrl.error}.</>}{" "}
                        Mail clients do not follow redirects when they POST to the one-click unsubscribe URL, so readers
                        who unsubscribe stay subscribed — and report spam instead. Set{" "}
                        <code className="rounded bg-white px-1 py-0.5 font-mono text-xs">EMAIL_PUBLIC_URL</code> to the
                        host that answers directly.
                    </p>
                </div>
            )}

            <DnsChecklist
                domain={domain}
                fromAddress={fromAddress}
                status={domainStatus}
                dmarc={dmarcRecord(domain)}
                notes={RECORD_NOTES}
            />

            <SendingHistory stats={sending} />

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h2 className="text-sm font-semibold text-slate-900">List composition</h2>
                    <dl className="mt-4 space-y-2">
                        {statusCounts.map((entry) => (
                            <div key={entry.status} className="flex items-center justify-between text-sm">
                                <dt className="text-slate-600">{entry.status}</dt>
                                <dd className="font-semibold tabular-nums text-slate-900">
                                    {entry._count.toLocaleString()}
                                </dd>
                            </div>
                        ))}
                        {statusCounts.length === 0 && <p className="text-sm text-slate-400">No contacts yet.</p>}
                    </dl>

                    <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Suppressions by reason
                    </h3>
                    <dl className="mt-2 space-y-2">
                        {byReason.map((entry) => (
                            <div key={entry.reason} className="flex items-center justify-between text-sm">
                                <dt className="text-slate-600">{entry.reason.replace("_", " ").toLowerCase()}</dt>
                                <dd className="font-semibold tabular-nums text-slate-900">{entry._count}</dd>
                            </div>
                        ))}
                        {byReason.length === 0 && <p className="text-sm text-slate-400">Nothing suppressed yet.</p>}
                    </dl>
                </div>
            </div>

            <SunsetControls />

            <div className="rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-5 py-3">
                    <h2 className="text-sm font-semibold text-slate-900">Suppression list</h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        These addresses are excluded from every send and every import, permanently.
                    </p>
                </div>
                {suppressions.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-slate-400">Empty — nothing has bounced yet.</p>
                ) : (
                    <ul className="divide-y divide-slate-50">
                        {suppressions.map((entry) => (
                            <li key={entry.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                                <span
                                    className={cn(
                                        "w-28 shrink-0 rounded px-1.5 py-0.5 text-center text-[10px] font-semibold uppercase",
                                        entry.reason === "COMPLAINT"
                                            ? "bg-rose-100 text-rose-800"
                                            : entry.reason === "HARD_BOUNCE"
                                              ? "bg-rose-50 text-rose-700"
                                              : "bg-slate-100 text-slate-600"
                                    )}
                                >
                                    {entry.reason.replace("_", " ")}
                                </span>
                                <span className="min-w-0 flex-1 truncate text-slate-700">{entry.email}</span>
                                <span className="shrink-0 text-xs text-slate-400">
                                    {entry.createdAt.toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
