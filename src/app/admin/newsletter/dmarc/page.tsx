// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Turn DMARC aggregate XML into one decision — can the policy be raised?
// Env / Identity: React Server Component
// ============================================================================

import { prisma } from "@/lib/prisma"
import { assessReadiness, describeSource } from "@/lib/email/dmarc"
import { DmarcUpload } from "@/components/email/dmarc-upload"
import { ShieldCheck, ShieldAlert, ShieldQuestion, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

interface SourceSummary {
    key: string
    sourceIp: string
    label: string | null
    total: number
    passed: number
    failed: number
    spfDomain: string | null
    dkimDomain: string | null
    dkimSelector: string | null
    dkimResult: string | null
    spfResult: string | null
    headerFrom: string | null
    dispositions: Set<string>
}

const VERDICT_STYLE = {
    ready: { icon: ShieldCheck, className: "border-emerald-200 bg-emerald-50", text: "text-emerald-900", accent: "text-emerald-600" },
    almost: { icon: Shield, className: "border-amber-200 bg-amber-50", text: "text-amber-900", accent: "text-amber-600" },
    "not-ready": { icon: ShieldAlert, className: "border-rose-200 bg-rose-50", text: "text-rose-900", accent: "text-rose-600" },
    "insufficient-data": { icon: ShieldQuestion, className: "border-slate-200 bg-slate-50", text: "text-slate-800", accent: "text-slate-500" },
} as const

export default async function DmarcPage() {
    const reports = await prisma.dmarcReport.findMany({
        include: { records: true },
        orderBy: { rangeBegin: "desc" },
    })

    // Aggregate identical sources across every report — one reporter's view of a
    // single sender is not evidence, agreement across reporters is.
    const sources = new Map<string, SourceSummary>()
    let totalMessages = 0
    let passCount = 0
    let earliest: Date | null = null
    let latest: Date | null = null

    for (const report of reports) {
        totalMessages += report.totalMessages
        passCount += report.passCount
        if (!earliest || report.rangeBegin < earliest) earliest = report.rangeBegin
        if (!latest || report.rangeEnd > latest) latest = report.rangeEnd

        for (const record of report.records) {
            const key = `${record.sourceIp}|${record.dkimSelector ?? ""}|${record.spfDomain ?? ""}`
            const existing = sources.get(key)
            const passed = record.dkimPolicy === "pass" || record.spfPolicy === "pass"

            if (existing) {
                existing.total += record.count
                if (passed) existing.passed += record.count
                else existing.failed += record.count
                existing.dispositions.add(record.disposition)
            } else {
                sources.set(key, {
                    key,
                    sourceIp: record.sourceIp,
                    label: describeSource(record),
                    total: record.count,
                    passed: passed ? record.count : 0,
                    failed: passed ? 0 : record.count,
                    spfDomain: record.spfDomain,
                    dkimDomain: record.dkimDomain,
                    dkimSelector: record.dkimSelector,
                    dkimResult: record.dkimResult,
                    spfResult: record.spfResult,
                    headerFrom: record.headerFrom,
                    dispositions: new Set([record.disposition]),
                })
            }
        }
    }

    const sourceList = [...sources.values()].sort((a, b) => b.total - a.total)
    const failingSources = sourceList.filter((s) => s.failed > 0).length

    const daysCovered =
        earliest && latest
            ? Math.max(1, Math.round((latest.getTime() - earliest.getTime()) / 86_400_000))
            : 0

    const readiness = assessReadiness({ totalMessages, passCount, failingSources, daysCovered })
    const style = VERDICT_STYLE[readiness.verdict]
    const Icon = style.icon

    const currentPolicy = reports[0]?.policyP ?? null

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-lg font-semibold text-slate-900">DMARC reports</h1>
                <p className="text-sm text-slate-500">
                    Receivers send these daily as compressed XML. Upload them here to see who is sending as
                    your domain and whether it authenticates.
                </p>
            </div>

            {reports.length > 0 && (
                <div className={cn("rounded-xl border p-5", style.className)}>
                    <div className="flex items-start gap-3">
                        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.accent)} />
                        <div className="min-w-0 flex-1">
                            <h2 className={cn("text-base font-semibold", style.text)}>{readiness.headline}</h2>
                            <p className={cn("mt-1 text-sm leading-relaxed", style.text)}>{readiness.detail}</p>
                            {readiness.verdict === "ready" && (
                                <code className="mt-3 inline-block rounded bg-white/70 px-2 py-1 font-mono text-xs text-slate-800">
                                    v=DMARC1; p=quarantine; rua=mailto:dmarc@farjadp.info; pct=100
                                </code>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {reports.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        { label: "Pass rate", value: `${readiness.passRate.toFixed(1)}%`, sub: "DKIM or SPF aligned" },
                        { label: "Messages", value: totalMessages.toLocaleString(), sub: `${reports.length} reports` },
                        { label: "Days covered", value: String(daysCovered), sub: "aim for 14+" },
                        { label: "Sources", value: String(sourceList.length), sub: `${failingSources} failing` },
                        { label: "Current policy", value: currentPolicy ? `p=${currentPolicy}` : "—", sub: "as receivers saw it" },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                                {stat.label}
                            </div>
                            <div className="mt-1.5 text-xl font-bold tabular-nums text-slate-900">{stat.value}</div>
                            <div className="text-xs text-slate-400">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            )}

            <DmarcUpload hasReports={reports.length > 0} />

            {sourceList.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-900">Sending sources</h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Anything failing is either a service of yours that is not set up, or someone spoofing
                            you. Both matter, and they are fixed very differently.
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                    <th className="px-5 py-2.5 font-medium">Source</th>
                                    <th className="px-3 py-2.5 font-medium">Volume</th>
                                    <th className="px-3 py-2.5 font-medium">DKIM</th>
                                    <th className="px-3 py-2.5 font-medium">SPF</th>
                                    <th className="px-5 py-2.5 font-medium">Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sourceList.map((source) => {
                                    const allPass = source.failed === 0
                                    return (
                                        <tr key={source.key} className="border-b border-slate-50 last:border-0">
                                            <td className="px-5 py-3">
                                                <div className="font-medium text-slate-900">
                                                    {source.label ?? "Unrecognised sender"}
                                                </div>
                                                <div className="font-mono text-xs text-slate-400">{source.sourceIp}</div>
                                                {source.headerFrom && (
                                                    <div className="text-xs text-slate-400">
                                                        From: {source.headerFrom}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 tabular-nums text-slate-600">
                                                {source.total.toLocaleString()}
                                                {source.failed > 0 && (
                                                    <span className="block text-xs text-rose-600">
                                                        {source.failed.toLocaleString()} failed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3">
                                                <span
                                                    className={cn(
                                                        "rounded px-1.5 py-0.5 text-xs font-medium",
                                                        source.dkimResult === "pass"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-slate-100 text-slate-500"
                                                    )}
                                                >
                                                    {source.dkimResult ?? "none"}
                                                </span>
                                                {source.dkimSelector && (
                                                    <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                                                        {source.dkimSelector}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-3 py-3">
                                                <span
                                                    className={cn(
                                                        "rounded px-1.5 py-0.5 text-xs font-medium",
                                                        source.spfResult === "pass"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-slate-100 text-slate-500"
                                                    )}
                                                >
                                                    {source.spfResult ?? "none"}
                                                </span>
                                                {source.spfDomain && (
                                                    <div className="mt-0.5 truncate font-mono text-[11px] text-slate-400">
                                                        {source.spfDomain}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <span
                                                    className={cn(
                                                        "rounded-full px-2 py-0.5 text-xs font-medium",
                                                        allPass
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-rose-50 text-rose-700"
                                                    )}
                                                >
                                                    {allPass ? "Passes DMARC" : "Fails DMARC"}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {reports.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 px-5 py-3">
                        <h2 className="text-sm font-semibold text-slate-900">Reports received</h2>
                    </div>
                    <ul className="divide-y divide-slate-50">
                        {reports.map((report) => (
                            <li key={report.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
                                <span className="font-medium text-slate-900">{report.orgName}</span>
                                <span className="text-xs text-slate-400">
                                    {report.rangeBegin.toLocaleDateString()} — {report.rangeEnd.toLocaleDateString()}
                                </span>
                                <span className="ml-auto tabular-nums text-slate-600">
                                    {report.totalMessages.toLocaleString()} messages
                                </span>
                                <span
                                    className={cn(
                                        "rounded px-1.5 py-0.5 text-xs font-medium tabular-nums",
                                        report.failCount === 0
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-rose-50 text-rose-700"
                                    )}
                                >
                                    {report.failCount === 0 ? "all passed" : `${report.failCount} failed`}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
