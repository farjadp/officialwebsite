// ============================================================================
// Route: /admin/jobs/usage
// Role: What the job search has spent on models: tokens and estimated dollars
//       by day, by week, by kind of call, and in all.
// Note: Owner only (see ../layout.tsx). Estimates from the provider layer's
//       rate table; the provider's own billing page is the bill.
// ============================================================================

import { format } from "date-fns"
import { USAGE_TIMEZONE, usageByAgent, usageByDay, usageByWeek, usageTotal, type UsageRow } from "@/lib/jobs/usage"

export const dynamic = "force-dynamic"

const AGENT_LABEL: Record<string, string> = {
    "jobs.score": "Scoring postings",
    "jobs.resume": "Writing résumés",
    "jobs.assist": "AI help in the editor",
    "jobs.review": "ATS and AI review",
}

// Periods come back as Toronto-local midnights carried in a UTC Date, so they
// are read in UTC; "now" is read in Toronto. Neither depends on the server's zone.
const periodLabel = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-CA", { ...options, timeZone: "UTC" }).format(date)
const dayKey = (date: Date, timeZone: string) =>
    new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone }).format(date)

const dollars = (cents: number) => `$${(cents / 100).toFixed(cents < 100 ? 3 : 2)}`
const tokens = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n))

function Table({ rows, label }: { rows: (UsageRow & { name: string })[]; label: string }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs text-slate-500">
                    <tr>
                        <th scope="col" className="px-5 py-3 font-semibold">{label}</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold">Calls</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold">Tokens in</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold">Tokens out</th>
                        <th scope="col" className="px-5 py-3 text-right font-semibold">Cost</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 tabular-nums">
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-5 py-6 text-center text-slate-500">Nothing yet.</td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr key={row.name}>
                                <td className="px-5 py-3 font-medium text-slate-900">{row.name}</td>
                                <td className="px-5 py-3 text-right">{row.calls}</td>
                                <td className="px-5 py-3 text-right">{tokens(row.inputTokens)}</td>
                                <td className="px-5 py-3 text-right">{tokens(row.outputTokens)}</td>
                                <td className="px-5 py-3 text-right font-semibold text-slate-900">{dollars(row.costCents)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default async function UsagePage() {
    const [days, weeks, agents, total] = await Promise.all([usageByDay(14), usageByWeek(8), usageByAgent(), usageTotal()])
    const todayKey = dayKey(new Date(), USAGE_TIMEZONE)
    const today = days.find((row) => dayKey(row.period, "UTC") === todayKey)
    // The newest week is this week only if something ran in it.
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000
    const thisWeek = weeks[0] && weeks[0].period.getTime() > weekAgo - 24 * 3600 * 1000 ? weeks[0] : undefined

    return (
        <div className="space-y-6">
            <dl className="grid gap-4 sm:grid-cols-3">
                {[
                    ["Today", today?.costCents ?? 0, (today?.inputTokens ?? 0) + (today?.outputTokens ?? 0)],
                    ["This week", thisWeek?.costCents ?? 0, (thisWeek?.inputTokens ?? 0) + (thisWeek?.outputTokens ?? 0)],
                    ["All time", total.costCents, total.inputTokens + total.outputTokens],
                ].map(([label, cents, count]) => (
                    <div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <dt className="text-xs text-slate-500">{label}</dt>
                        <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{dollars(Number(cents))}</dd>
                        <dd className="text-xs tabular-nums text-slate-500">{tokens(Number(count))} tokens</dd>
                    </div>
                ))}
            </dl>

            <Table label="By kind of call, all time" rows={agents.map((row) => ({ ...row, name: AGENT_LABEL[row.agent] ?? row.agent }))} />
            <Table label="By day, last 14 days" rows={days.map((row) => ({ ...row, name: periodLabel(row.period, { weekday: "short", day: "numeric", month: "short" }) }))} />
            <Table label="By week, last 8 weeks" rows={weeks.map((row) => ({ ...row, name: `Week of ${periodLabel(row.period, { day: "numeric", month: "short" })}` }))} />

            <p className="text-xs leading-relaxed text-slate-500">
                Estimated from token counts and the published price per model, in US dollars; your OpenAI billing page is the
                actual bill. Counting started {total.since ? format(total.since, "d MMM yyyy, HH:mm") : "with the first call after this page shipped"}.
                About $2.50 was spent on scoring on 1 Oct 2026 before this ledger existed and is not included.
            </p>
        </div>
    )
}
