"use client"

import { useTransition } from "react"
import { deleteBoard, toggleBoard } from "@/lib/jobs/actions"

export function BoardRowActions({ id, label, enabled, postings }: {
    id: string
    label: string
    enabled: boolean
    postings: number
}) {
    const [isPending, startTransition] = useTransition()

    return (
        <div className="flex items-center justify-end gap-2">
            <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(() => toggleBoard(id, !enabled))}
                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
                {enabled ? "Pause" : "Resume"}
            </button>
            <button
                type="button"
                disabled={isPending}
                onClick={() => {
                    const warning = `Remove "${label}"? Its ${postings} posting${postings === 1 ? "" : "s"}, with their statuses and notes, go with it.`
                    if (window.confirm(warning)) startTransition(() => deleteBoard(id))
                }}
                className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
            >
                Remove
            </button>
        </div>
    )
}
