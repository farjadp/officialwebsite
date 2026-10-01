"use client"

import { useState, useTransition } from "react"
import { saveNotes } from "@/lib/jobs/actions"

export function NotesForm({ id, notes }: { id: string; notes: string }) {
    const [value, setValue] = useState(notes)
    const [state, setState] = useState<"idle" | "saved" | "failed">("idle")
    const [isPending, startTransition] = useTransition()

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()
                startTransition(async () => {
                    try {
                        await saveNotes(id, value)
                        setState("saved")
                    } catch {
                        setState("failed")
                    }
                })
            }}
            className="space-y-3"
        >
            <label htmlFor="notes" className="block text-sm font-semibold text-slate-900">
                Notes
            </label>
            <textarea
                id="notes"
                value={value}
                onChange={(event) => {
                    setValue(event.target.value)
                    setState("idle")
                }}
                rows={6}
                placeholder="Who you spoke to, what to mention, when to follow up."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B4B43] focus:outline-none focus:ring-1 focus:ring-[#1B4B43]"
            />
            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
                >
                    {isPending ? "Saving…" : "Save notes"}
                </button>
                <span role="status" className={`text-xs ${state === "failed" ? "text-rose-600" : "text-slate-500"}`}>
                    {state === "saved" ? "Saved" : state === "failed" ? "Not saved" : ""}
                </span>
            </div>
        </form>
    )
}
