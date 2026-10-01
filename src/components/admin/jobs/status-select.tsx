"use client"

import { useState, useTransition } from "react"
import { setStatus } from "@/lib/jobs/actions"
import { JOB_STATUSES } from "@/lib/jobs/types"

const COLOR: Record<string, string> = {
    NEW: "text-blue-700 bg-blue-50 border-blue-200",
    SHORTLISTED: "text-violet-700 bg-violet-50 border-violet-200",
    APPLIED: "text-amber-700 bg-amber-50 border-amber-200",
    INTERVIEW: "text-teal-700 bg-teal-50 border-teal-200",
    OFFER: "text-emerald-700 bg-emerald-50 border-emerald-200",
    REJECTED: "text-rose-700 bg-rose-50 border-rose-200",
    DISMISSED: "text-slate-500 bg-slate-100 border-slate-200",
}

export function StatusSelect({ id, status }: { id: string; status: string }) {
    const [current, setCurrent] = useState(status)
    const [failed, setFailed] = useState(false)
    const [isPending, startTransition] = useTransition()

    const onChange = (next: string) => {
        const previous = current
        setCurrent(next)
        setFailed(false)
        startTransition(async () => {
            try {
                const result = await setStatus(id, next)
                if (!result.ok) throw new Error("not saved")
            } catch {
                setCurrent(previous)
                setFailed(true)
            }
        })
    }

    return (
        <span className="inline-flex items-center gap-2">
            <select
                aria-label="Posting status"
                value={current}
                disabled={isPending}
                onChange={(event) => onChange(event.target.value)}
                className={`cursor-pointer rounded-full border px-2.5 py-1.5 text-xs font-bold outline-none disabled:opacity-50 ${COLOR[current] ?? COLOR.NEW}`}
            >
                {JOB_STATUSES.map((value) => (
                    <option key={value} value={value}>
                        {value.charAt(0) + value.slice(1).toLowerCase()}
                    </option>
                ))}
            </select>
            {failed && (
                <span role="alert" className="text-xs font-semibold text-rose-600">
                    Not saved
                </span>
            )}
        </span>
    )
}
