"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PERK_STATUSES } from "@/lib/perk-offer"

const COLOR_MAP: Record<string, string> = {
    NEW: "text-blue-600 bg-blue-50 border-blue-200",
    CONTACTED: "text-amber-600 bg-amber-50 border-amber-200",
    ACCEPTED: "text-emerald-600 bg-emerald-50 border-emerald-200",
    DECLINED: "text-slate-500 bg-slate-100 border-slate-200",
}

export function StatusSelect({ id, status }: { id: string; status: string }) {
    const [current, setCurrent] = useState(status)
    const [failed, setFailed] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const onChange = (next: string) => {
        const previous = current
        setCurrent(next)
        setFailed(false)
        startTransition(async () => {
            try {
                const res = await fetch(`/api/admin/perk-offers/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: next }),
                })
                if (!res.ok) throw new Error(String(res.status))
                router.refresh()
            } catch {
                // Roll back to what the server still holds, and say so — the
                // lab-applications version reverts silently, which looks like
                // the click simply did nothing.
                setCurrent(previous)
                setFailed(true)
            }
        })
    }

    return (
        <span className="inline-flex items-center gap-2">
            <select
                aria-label="Offer status"
                value={current}
                disabled={isPending}
                onChange={(e) => onChange(e.target.value)}
                className={`text-xs font-bold px-2.5 py-1.5 rounded-full border outline-none cursor-pointer disabled:opacity-50 ${COLOR_MAP[current] ?? COLOR_MAP.NEW}`}
            >
                {PERK_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
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
