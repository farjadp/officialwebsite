"use client"

import { useState, useTransition } from "react"
import { Pause, Play } from "lucide-react"
import { setPausedAction } from "@/lib/jobs/actions"

export function PauseToggle({ paused }: { paused: boolean }) {
    const [isPending, startTransition] = useTransition()
    const [failed, setFailed] = useState(false)

    return (
        <div className="flex items-center gap-2">
            {failed && <span role="alert" className="text-xs font-semibold text-rose-600">Not changed</span>}
            <button
                type="button"
                disabled={isPending}
                onClick={() => {
                    if (!paused && !window.confirm("Pause the job search? The daily run stops reading sources and scoring until you resume.")) return
                    startTransition(async () => {
                        setFailed(false)
                        try {
                            await setPausedAction(!paused)
                        } catch {
                            setFailed(true)
                        }
                    })
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold disabled:opacity-50 ${
                    paused
                        ? "bg-[#1B4B43] text-white hover:bg-[#153b35]"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
            >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPending ? "…" : paused ? "Resume" : "Pause"}
            </button>
        </div>
    )
}
