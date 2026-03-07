import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { Inbox, TrendingUp, Users, BarChart3 } from "lucide-react"

const TOOL_LABELS: Record<string, string> = {
    "business-model-score": "Business Model Score",
    "investor-readiness": "Investor Readiness",
    "startup-readiness": "Startup Readiness",
    "unknown": "Unknown Tool",
}

const SCORE_COLOR = (score: number) => {
    if (score >= 75) return "text-emerald-600 bg-emerald-50"
    if (score >= 60) return "text-amber-600 bg-amber-50"
    return "text-rose-600 bg-rose-50"
}

export default async function AdminLeadsPage() {
    const leads = await prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
    })

    const totalLeads = leads.length
    const avgScore = totalLeads > 0 ? Math.round(leads.reduce((a, b) => a + b.score, 0) / totalLeads) : 0
    const toolCounts = leads.reduce<Record<string, number>>((acc, l) => {
        acc[l.toolId] = (acc[l.toolId] || 0) + 1
        return acc
    }, {})

    return (
        <div className="max-w-6xl space-y-8">

            {/* Header */}
            <div className="flex items-center gap-3">
                <Inbox className="w-6 h-6 text-slate-400" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Tool Leads</h1>
                    <p className="text-sm text-slate-500 mt-0.5">People who submitted their email through the free assessment tools</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-[#1B4B43]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#1B4B43]" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
                        <p className="text-xs text-slate-500">Total Leads</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{avgScore}</p>
                        <p className="text-xs text-slate-500">Avg Score / 100</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{Object.keys(toolCounts).length}</p>
                        <p className="text-xs text-slate-500">Active Tools</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            {leads.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="font-semibold text-slate-500">No leads yet</p>
                    <p className="text-sm text-slate-400 mt-1">Leads will appear here when users submit their email in any tool.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Email</th>
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Name</th>
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Tool</th>
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Score</th>
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Segment</th>
                                    <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead, i) => (
                                    <tr
                                        key={lead.id}
                                        className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${i === leads.length - 1 ? "border-0" : ""}`}
                                    >
                                        <td className="px-5 py-4 font-medium text-slate-800">{lead.email}</td>
                                        <td className="px-5 py-4 text-slate-500">{lead.name || <span className="text-slate-300">—</span>}</td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-semibold bg-[#1B4B43]/8 text-[#1B4B43] px-2.5 py-1 rounded-full">
                                                {TOOL_LABELS[lead.toolId] ?? lead.toolId}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${SCORE_COLOR(lead.score)}`}>
                                                {lead.score} / 100
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-500 text-xs">{lead.segment}</td>
                                        <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                                            {format(new Date(lead.createdAt), "MMM d, yyyy · HH:mm")}
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
