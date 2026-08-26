// ============================================================================
// Hardware Source: sending-stats.tsx
// Version: 1.0.0 — 2026-08-24
// Why: Show what was sent today, per campaign, and how the domain is trending
// Env / Identity: React Server Component
// ============================================================================

import type { SendingStats } from "@/lib/email/stats"
import { cn } from "@/lib/utils"

function Bar({ used, cap }: { used: number; cap: number | null }) {
    // With no ceiling there is nothing to fill toward, so the bar just shows
    // that sending is happening rather than pretending to measure progress
    const pct = cap ? Math.min(100, (used / cap) * 100) : used > 0 ? 100 : 0
    return (
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
                className={cn(
                    "h-full rounded-full transition-all",
                    pct >= 100 ? "bg-amber-500" : "bg-violet-600"
                )}
                style={{ width: `${pct}%` }}
            />
        </div>
    )
}

export function TodayUsage({ stats }: { stats: SendingStats }) {
    const { cap, warmupEnabled, domainSent, campaigns } = stats.today
    const { bounceRate, complaintRate } = stats.allTime

    // With the ceiling removed these numbers are the only thing left watching
    const bounceAlarm = bounceRate >= 5
    const bounceWarn = bounceRate >= 2
    const complaintAlarm = complaintRate >= 0.1

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">Today&apos;s sending</h2>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                        {warmupEnabled ? (
                            <>
                                Each campaign has its own allowance of {cap?.toLocaleString()}. The ceiling
                                still halves after a day with complaints or excess bounces.
                            </>
                        ) : (
                            <>
                                No daily limit. Volume is whatever the campaigns and their throttle produce,
                                so the bounce and complaint rates below are the only warning you get.
                            </>
                        )}
                    </p>
                </div>
                <div className="shrink-0 text-right">
                    <div className="text-2xl font-bold tabular-nums text-slate-900">
                        {domainSent.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400">sent from the domain</div>
                </div>
            </div>

            {!warmupEnabled && (bounceWarn || complaintAlarm) && (
                <div
                    className={cn(
                        "mt-4 rounded-lg border p-3 text-xs leading-relaxed",
                        bounceAlarm || complaintAlarm
                            ? "border-rose-200 bg-rose-50 text-rose-900"
                            : "border-amber-200 bg-amber-50 text-amber-900"
                    )}
                    role="alert"
                >
                    <strong>
                        {complaintAlarm
                            ? `Complaint rate is ${complaintRate.toFixed(3)}%.`
                            : `Bounce rate is ${bounceRate.toFixed(1)}%.`}
                    </strong>{" "}
                    {complaintAlarm
                        ? "Gmail's threshold is 0.1%. Above it, delivery degrades for everything sent from this domain."
                        : bounceAlarm
                          ? "Above 5% many providers suspend an account. There is no automatic ceiling to catch this now — pause and clean the list."
                          : "Healthy is under 2%. Worth watching now that nothing throttles automatically."}
                </div>
            )}

            {campaigns.length === 0 ? (
                <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                    Nothing sending right now.
                </p>
            ) : (
                <div className="mt-4 space-y-3">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id}>
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="truncate text-sm font-medium text-slate-800">
                                    {campaign.name}
                                </span>
                                <span className="shrink-0 text-xs tabular-nums text-slate-500">
                                    {campaign.used.toLocaleString()}
                                    {cap != null && ` / ${cap.toLocaleString()}`}
                                    {cap == null && " sent today"}
                                </span>
                            </div>
                            <div className="mt-1.5">
                                <Bar used={campaign.used} cap={cap} />
                            </div>
                            <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-slate-400">
                                <span>
                                    {campaign.remaining == null
                                        ? "no daily limit"
                                        : `${campaign.remaining.toLocaleString()} left today`}
                                </span>
                                <span>{campaign.queued.toLocaleString()} still queued</span>
                                {campaign.deferred > 0 && (
                                    <span className="text-amber-600">
                                        {campaign.deferred.toLocaleString()} waiting — mailed recently by
                                        another campaign
                                    </span>
                                )}
                                <span className="ml-auto uppercase tracking-wide">{campaign.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/** Thresholds worth reacting to, not vanity targets. */
function healthTone(value: number, warn: number, bad: number): string {
    if (value >= bad) return "text-rose-600"
    if (value >= warn) return "text-amber-600"
    return "text-emerald-600"
}

export function SendingHistory({ stats }: { stats: SendingStats }) {
    const { history, allTime } = stats
    const peak = Math.max(1, ...history.map((d) => Math.max(d.cap, d.sent)))

    return (
        <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-sm font-semibold text-slate-900">Sending history</h2>
                <p className="mt-0.5 text-xs text-slate-500">
                    Bars show what was actually sent against the ceiling for that day.
                </p>
            </div>

            <div className="p-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Sent all time", value: allTime.sent.toLocaleString(), sub: `${allTime.days} days recorded` },
                        { label: "Open rate", value: `${allTime.openRate.toFixed(1)}%`, sub: `${allTime.opened.toLocaleString()} opened` },
                        { label: "Bounce rate", value: `${allTime.bounceRate.toFixed(2)}%`, sub: "keep under 2%", tone: healthTone(allTime.bounceRate, 2, 5) },
                        { label: "Complaint rate", value: `${allTime.complaintRate.toFixed(3)}%`, sub: "Gmail's limit is 0.1%", tone: healthTone(allTime.complaintRate, 0.08, 0.1) },
                    ].map((item) => (
                        <div key={item.label} className="rounded-lg border border-slate-200 p-3">
                            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                {item.label}
                            </div>
                            <div className={cn("mt-1 text-xl font-bold tabular-nums", item.tone ?? "text-slate-900")}>
                                {item.value}
                            </div>
                            <div className="text-[11px] text-slate-400">{item.sub}</div>
                        </div>
                    ))}
                </div>

                {history.length === 0 ? (
                    <p className="mt-5 rounded-lg bg-slate-50 p-3 text-center text-xs text-slate-500">
                        No sending recorded yet.
                    </p>
                ) : (
                    <>
                        <div className="mt-6 flex h-28 items-end gap-1">
                            {history.map((day) => (
                                <div
                                    key={day.day}
                                    className="group relative flex-1"
                                    title={`${day.day} — ${day.sent} sent of ${day.cap} cap · ${day.bounced} bounced · ${day.complained} complaints`}
                                >
                                    <div
                                        className="w-full rounded-t bg-slate-100"
                                        style={{ height: `${(day.cap / peak) * 112}px` }}
                                    >
                                        <div
                                            className={cn(
                                                "w-full rounded-t",
                                                day.complained > 0
                                                    ? "bg-rose-500"
                                                    : day.bounceRate > 3
                                                      ? "bg-amber-500"
                                                      : "bg-violet-500"
                                            )}
                                            style={{
                                                height: `${(day.sent / peak) * 112}px`,
                                                marginTop: `${((day.cap - day.sent) / peak) * 112}px`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                        <th className="py-2 pr-3 font-medium">Day</th>
                                        <th className="px-3 py-2 font-medium">Sent</th>
                                        <th className="px-3 py-2 font-medium">Cap</th>
                                        <th className="px-3 py-2 font-medium">Delivered</th>
                                        <th className="px-3 py-2 font-medium">Bounced</th>
                                        <th className="py-2 pl-3 font-medium">Complaints</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...history].reverse().map((day) => (
                                        <tr key={day.day} className="border-b border-slate-50 last:border-0">
                                            <td className="py-2 pr-3 tabular-nums text-slate-700">{day.day}</td>
                                            <td className="px-3 py-2 tabular-nums text-slate-900">{day.sent}</td>
                                            <td className="px-3 py-2 tabular-nums text-slate-400">{day.cap}</td>
                                            <td className="px-3 py-2 tabular-nums text-slate-600">{day.delivered}</td>
                                            <td className={cn("px-3 py-2 tabular-nums", day.bounceRate > 3 ? "text-rose-600" : "text-slate-600")}>
                                                {day.bounced}
                                                {day.sent > 0 && (
                                                    <span className="ml-1 text-xs text-slate-400">
                                                        ({day.bounceRate.toFixed(1)}%)
                                                    </span>
                                                )}
                                            </td>
                                            <td className={cn("py-2 pl-3 tabular-nums", day.complained > 0 ? "text-rose-600" : "text-slate-600")}>
                                                {day.complained}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
