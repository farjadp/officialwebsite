"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

const STATUSES = ["NEW", "CONTACTED", "ARCHIVED"] as const

const COLOR_MAP: Record<string, string> = {
    NEW: "text-blue-600 bg-blue-50 border-blue-200",
    CONTACTED: "text-emerald-600 bg-emerald-50 border-emerald-200",
    ARCHIVED: "text-slate-500 bg-slate-100 border-slate-200",
}

export function StatusSelect({ id, status }: { id: string; status: string; colorClass?: string }) {
    const [current, setCurrent] = useState(status)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const onChange = (next: string) => {
        setCurrent(next)
        startTransition(async () => {
            const res = await fetch(`/api/admin/lab-applications/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: next }),
            })
            if (!res.ok) {
                setCurrent(status)
                return
            }
            router.refresh()
        })
    }

    return (
        <select
            value={current}
            disabled={isPending}
            onChange={(e) => onChange(e.target.value)}
            className={`text-xs font-bold px-2.5 py-1.5 rounded-full border outline-none cursor-pointer disabled:opacity-50 ${COLOR_MAP[current] ?? COLOR_MAP.NEW}`}
        >
            {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
            ))}
        </select>
    )
}
