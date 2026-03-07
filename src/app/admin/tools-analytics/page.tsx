import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { Activity, Globe, Cpu, BarChart3, Users } from "lucide-react"

const TOOL_LABELS: Record<string, string> = {
    "business-model-score": "Business Model Score",
    "ai-adoption-score": "AI Adoption Score",
    "sales-funnel-score": "Sales Funnel Score",
    "investor-readiness": "Investor Readiness",
    "startup-readiness": "Startup Readiness",
}

const TOOL_COLORS: Record<string, string> = {
    "business-model-score": "bg-stone-100 text-stone-700",
    "ai-adoption-score": "bg-indigo-50 text-indigo-700",
    "sales-funnel-score": "bg-emerald-50 text-emerald-700",
    "investor-readiness": "bg-blue-50 text-blue-700",
    "startup-readiness": "bg-purple-50 text-purple-700",
}

const SCORE_COLOR = (score: number) => {
    if (score >= 75) return "text-emerald-600 bg-emerald-50"
    if (score >= 60) return "text-amber-600 bg-amber-50"
    return "text-rose-600 bg-rose-50"
}

export default async function ToolsAnalyticsPage() {
    const usage = await prisma.toolUsage.findMany({
        orderBy: { createdAt: "desc" },
        take: 500,
    })

    const total = usage.length
    const avgScore = total > 0 ? Math.round(usage.reduce((a, b) => a + b.score, 0) / total) : 0

    // Per-tool counts
    const byTool = usage.reduce<Record<string, number>>((acc, u) => {
        acc[u.toolId] = (acc[u.toolId] || 0) + 1
        return acc
    }, {})

    // Top countries
    const byCountry = usage.reduce<Record<string, number>>((acc, u) => {
        const c = u.country ?? "Unknown"
        acc[c] = (acc[c] || 0) + 1
        return acc
    }, {})
    const topCountries = Object.entries(byCountry)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

    return (
        <div className="max-w-6xl space-y-8">

            {/* Header */}
            <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-slate-400" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tools Analytics</h1>
                    <p className="text-sm text-slate-500 mt-0.5">All tool sessions — including anonymous users who didn't submit an email</p>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{total}</p>
                        <p className="text-xs text-slate-500">Total Sessions</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{avgScore}</p>
                        <p className="text-xs text-slate-500">Avg Score / 100</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{Object.keys(byTool).length}</p>
                        <p className="text-xs text-slate-500">Active Tools</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{Object.keys(byCountry).filter(c => c !== "Unknown").length}</p>
                        <p className="text-xs text-slate-500">Countries</p>
                    </div>
                </div>
            </div>

            {/* Per-tool + Top countries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">Sessions by Tool</h3>
                    <div className="space-y-3">
                        {Object.entries(byTool).sort((a, b) => b[1] - a[1]).map(([toolId, count]) => (
                            <div key={toolId} className="flex items-center justify-between">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TOOL_COLORS[toolId] ?? "bg-slate-100 text-slate-600"}`}>
                                    {TOOL_LABELS[toolId] ?? toolId}
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 bg-slate-100 rounded-full h-1.5">
                                        <div
                                            className="h-1.5 rounded-full bg-slate-400"
                                            style={{ width: `${Math.round((count / total) * 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 w-6 text-right">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">Top Countries</h3>
                    {topCountries.length === 0 ? (
                        <p className="text-sm text-slate-400">No location data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {topCountries.map(([country, count]) => (
                                <div key={country} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700">{country}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-slate-100 rounded-full h-1.5">
                                            <div
                                                className="h-1.5 rounded-full bg-indigo-400"
                                                style={{ width: `${Math.round((count / total) * 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 w-6 text-right">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sessions table */}
            {usage.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <Activity className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="font-semibold text-slate-500">No sessions recorded yet</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Tool</th>
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Score</th>
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Country</th>
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">IP</th>
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usage.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${i === usage.length - 1 ? "border-0" : ""}`}
                                    >
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TOOL_COLORS[row.toolId] ?? "bg-slate-100 text-slate-600"}`}>
                                                {TOOL_LABELS[row.toolId] ?? row.toolId}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${SCORE_COLOR(row.score)}`}>
                                                {row.score} / 100
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-600 text-xs">
                                            {row.country ?? <span className="text-slate-300">—</span>}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">
                                            {row.ip ?? <span className="text-slate-300">—</span>}
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                                            {format(new Date(row.createdAt), "MMM d · HH:mm")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
