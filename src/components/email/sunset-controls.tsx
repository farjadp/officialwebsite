"use client"

// ============================================================================
// Hardware Source: sunset-controls.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Preview and apply the list hygiene policy
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Sunset, Loader2 } from "lucide-react"
import { previewSunset, applySunset } from "@/lib/actions/automations"

export function SunsetControls() {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [preview, setPreview] = useState<{ decayed: number; sunset: number } | null>(null)
    const [applied, setApplied] = useState<{ decayed: number; sunset: number } | null>(null)

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
                <div className="rounded-lg bg-amber-50 p-2">
                    <Sunset className="h-4 w-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-slate-900">Sunset policy</h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        Contacts silent for 60 days lose 5 points of engagement score; those silent for 180 days are
                        archived out of the sendable pool. A dead subscriber costs you inbox placement for every live
                        one — pruning is the highest-leverage deliverability action there is. The cron runs this daily;
                        this is the manual trigger.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            disabled={pending}
                            onClick={() =>
                                startTransition(async () => {
                                    const result = await previewSunset()
                                    if (result.success) setPreview(result.data ?? null)
                                })
                            }
                            className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-400 disabled:opacity-50"
                        >
                            {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Preview impact
                        </button>

                        {preview && (
                            <>
                                <span className="text-sm text-slate-600">
                                    {preview.decayed.toLocaleString()} would be decayed ·{" "}
                                    {preview.sunset.toLocaleString()} would be archived
                                </span>
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() => {
                                        if (!window.confirm(`Archive ${preview.sunset} disengaged contacts?`)) return
                                        startTransition(async () => {
                                            const result = await applySunset()
                                            if (result.success) {
                                                setApplied(result.data ?? null)
                                                setPreview(null)
                                                router.refresh()
                                            }
                                        })
                                    }}
                                    className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                                >
                                    Apply now
                                </button>
                            </>
                        )}

                        {applied && (
                            <span className="text-sm text-emerald-700">
                                Done — {applied.decayed} decayed, {applied.sunset} archived.
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
