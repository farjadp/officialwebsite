"use client"

// ============================================================================
// Hardware Source: campaign-analysis.tsx
// Version: 1.0.0 — 2026-08-23
// Why: AI post-mortem turning campaign numbers into next actions
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react"
import { Sparkles, Loader2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"

interface Analysis {
    summary: string
    wins: string[]
    problems: string[]
    nextActions: string[]
}

export function CampaignAnalysis({ campaignId }: { campaignId: string }) {
    const [analysis, setAnalysis] = useState<Analysis | null>(null)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const run = async () => {
        setBusy(true)
        setError(null)
        try {
            const response = await fetch("/api/email/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task: "analyze", campaignId }),
            })
            const data = (await response.json()) as Analysis & { error?: string }
            if (data.error) throw new Error(data.error)
            setAnalysis(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Analysis failed")
        } finally {
            setBusy(false)
        }
    }

    const sections = [
        { title: "What worked", items: analysis?.wins ?? [], icon: TrendingUp, className: "text-emerald-600" },
        { title: "What did not", items: analysis?.problems ?? [], icon: TrendingDown, className: "text-rose-600" },
        { title: "Do next", items: analysis?.nextActions ?? [], icon: ArrowRight, className: "text-violet-600" },
    ]

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                        AI post-mortem
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Judged against benchmarks for a warm B2B founder list, not vanity targets.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={run}
                    disabled={busy}
                    className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                >
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {analysis ? "Re-analyse" : "Analyse results"}
                </button>
            </div>

            {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

            {analysis && (
                <div className="mt-4 space-y-4">
                    <p className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{analysis.summary}</p>
                    <div className="grid gap-4 md:grid-cols-3">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    <section.icon className={`h-3.5 w-3.5 ${section.className}`} />
                                    {section.title}
                                </h3>
                                <ul className="mt-2 space-y-1.5">
                                    {section.items.map((item, index) => (
                                        <li key={index} className="text-sm leading-relaxed text-slate-700">
                                            • {item}
                                        </li>
                                    ))}
                                    {section.items.length === 0 && (
                                        <li className="text-sm text-slate-300">—</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
