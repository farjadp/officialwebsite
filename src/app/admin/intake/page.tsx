"use client"

// ============================================================================
// /admin/intake — user-specific startup intake submissions
// ============================================================================

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"
import { Eye, Inbox, Loader2 } from "lucide-react"
import { COUNTRIES } from "@/data/startup-intake/config"

interface Submission {
    id: string
    startupName: string
    country: string
    founders: { name: string }[]
    status: string
    createdAt: string
    user: { name: string | null; email: string } | null
}

function countryFlag(id: string) {
    return COUNTRIES.find((c) => c.id === id)?.flag ?? "🏳️"
}

export default function AdminIntakePage() {
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/intake/submissions")
            const data = await res.json()
            if (data.success) setSubmissions(data.data)
        } catch {
            toast.error("Failed to load intake data")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl space-y-10">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Inbox className="w-6 h-6 text-slate-400" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Startup Intake</h1>
                    <p className="text-sm text-slate-500 mt-0.5">User-specific onboarding questionnaire submissions</p>
                </div>
            </div>

            {/* Submissions */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-slate-400" />
                    <h2 className="font-bold text-slate-900">Submissions</h2>
                </div>

                {submissions.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
                        <Inbox className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">No submissions yet.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50">
                                        <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Startup</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Applicant</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Country</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Founders</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="text-left px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400">Date</th>
                                        <th className="text-right px-5 py-3.5 font-bold text-xs uppercase tracking-widest text-slate-400"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((s) => (
                                        <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors last:border-0">
                                            <td className="px-5 py-4 font-medium text-slate-800" dir="auto">{s.startupName}</td>
                                            <td className="px-5 py-4 text-slate-600 text-xs" dir="auto">
                                                {s.user?.name || <span className="text-slate-400">—</span>}
                                                <span className="block text-slate-400" dir="ltr">{s.user?.email}</span>
                                            </td>
                                            <td className="px-5 py-4 text-lg">{countryFlag(s.country)}</td>
                                            <td className="px-5 py-4 text-slate-500 text-xs" dir="auto">
                                                {Array.isArray(s.founders) ? s.founders.map((f) => f.name).filter(Boolean).join("، ") : "—"}
                                            </td>
                                            <td className="px-5 py-4">
                                                {s.status === "REVIEWED" ? (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">Reviewed</span>
                                                ) : s.status === "DRAFT" ? (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">Draft</span>
                                                ) : (
                                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">New</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">
                                                {format(new Date(s.createdAt), "MMM d, yyyy · HH:mm")}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end">
                                                    <Link
                                                        href={`/admin/intake/${s.id}`}
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4B43] hover:underline"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}
