"use client"

import { useState, useTransition } from "react"
import { RefreshCw } from "lucide-react"
import { runNow, type RunReport } from "@/lib/jobs/actions"

function summarise(report: RunReport): { text: string; bad: boolean } {
    if ("error" in report) return { text: report.error, bad: true }

    const created = report.boards.reduce((sum, board) => sum + board.created, 0)
    const passed = report.boards.reduce((sum, board) => sum + board.passed, 0)
    const failed = report.boards.filter((board) => board.error)
    const parts = [
        `${report.boards.length} board${report.boards.length === 1 ? "" : "s"} read`,
        `${created} new posting${created === 1 ? "" : "s"}, ${passed} in your lanes`,
        `${report.scoring.scored} scored`,
    ]
    if (report.scoring.failed) parts.push(`${report.scoring.failed} could not be scored`)
    if (report.scoring.stopped) parts.push(`scoring stopped: ${report.scoring.stopped}`)
    if (failed.length) parts.push(`failed: ${failed.map((board) => `${board.board} (${board.error})`).join("; ")}`)

    return { text: parts.join(" · "), bad: failed.length > 0 || Boolean(report.scoring.stopped) }
}

export function RunButton({ disabled }: { disabled?: boolean }) {
    const [isPending, startTransition] = useTransition()
    const [result, setResult] = useState<{ text: string; bad: boolean } | null>(null)

    return (
        <div className="flex flex-col items-end gap-2">
            <button
                type="button"
                disabled={isPending || disabled}
                onClick={() =>
                    startTransition(async () => {
                        setResult(null)
                        try {
                            setResult(summarise(await runNow()))
                        } catch {
                            setResult({ text: "The run did not finish. Check Logs.", bad: true })
                        }
                    })
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#1B4B43] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#153b35] disabled:cursor-not-allowed disabled:opacity-50"
            >
                <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
                {isPending ? "Reading boards…" : "Run now"}
            </button>
            {result && (
                <p
                    role="status"
                    className={`max-w-md text-right text-xs ${result.bad ? "text-rose-700" : "text-slate-600"}`}
                >
                    {result.text}
                </p>
            )}
        </div>
    )
}
