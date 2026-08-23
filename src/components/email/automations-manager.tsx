"use client"

// ============================================================================
// Hardware Source: automations-manager.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Create sequences, generate their steps with AI, toggle them live
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Plus, Trash2, Loader2, Sparkles, Play, Pause, Clock, AlertTriangle } from "lucide-react"
import type { Block } from "@/lib/email/blocks"
import {
    createAutomation, saveSequenceSteps, toggleAutomation, deleteAutomation,
} from "@/lib/actions/automations"
import { cn } from "@/lib/utils"

interface AutomationRow {
    id: string
    name: string
    description: string | null
    trigger: string
    isActive: boolean
    enrollmentCount: number
    steps: { order: number; delayHours: number; subject: string; preheader: string }[]
}

const TRIGGER_LABELS: Record<string, string> = {
    contact_created: "New contact added",
    list_joined: "Joined a list",
    no_open_days: "Gone quiet",
}

const inputClass =
    "w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

export function AutomationsManager({
    automations,
    lists,
}: {
    automations: AutomationRow[]
    lists: { id: string; name: string }[]
}) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const [trigger, setTrigger] = useState("contact_created")
    const [generating, setGenerating] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const generateSteps = async (automation: AutomationRow) => {
        const goal = window.prompt(
            "What should this sequence achieve?",
            automation.description ?? "Welcome new subscribers and get them to their first useful action"
        )
        if (!goal) return

        setGenerating(automation.id)
        setError(null)
        try {
            const response = await fetch("/api/email/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    task: "sequence",
                    goal,
                    audience: "Founders and operators on my list",
                    stepCount: 4,
                }),
            })
            const data = (await response.json()) as {
                steps?: { delayHours: number; subject: string; preheader: string; blocks: Block[] }[]
                error?: string
            }
            if (data.error) throw new Error(data.error)
            if (!data.steps?.length) throw new Error("The model returned no steps")

            const result = await saveSequenceSteps(automation.id, data.steps)
            if (!result.success) throw new Error(result.error ?? "Could not save the steps")
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Generation failed")
        } finally {
            setGenerating(null)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">Automations</h1>
                    <p className="text-sm text-slate-500">
                        Sequences run on the cron. Later steps stop automatically once a reader engages.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                    <Plus className="h-4 w-4" />
                    New sequence
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </div>
            )}

            {open && (
                <form
                    action={(formData) =>
                        startTransition(async () => {
                            const result = await createAutomation(formData)
                            if (result.success) {
                                setOpen(false)
                                router.refresh()
                            } else {
                                setError(result.error ?? "Could not create the sequence")
                            }
                        })
                    }
                    className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 md:grid-cols-2"
                >
                    <label className="space-y-1.5">
                        <span className="text-xs font-medium text-slate-700">Name</span>
                        <input name="name" required placeholder="Welcome series" className={inputClass} />
                    </label>
                    <label className="space-y-1.5">
                        <span className="text-xs font-medium text-slate-700">Trigger</span>
                        <select
                            name="trigger"
                            value={trigger}
                            onChange={(event) => setTrigger(event.target.value)}
                            className={inputClass}
                        >
                            {Object.entries(TRIGGER_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="space-y-1.5 md:col-span-2">
                        <span className="text-xs font-medium text-slate-700">Goal / description</span>
                        <input
                            name="description"
                            placeholder="Used as the brief when generating the sequence with AI"
                            className={inputClass}
                        />
                    </label>

                    {trigger === "list_joined" && (
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium text-slate-700">List</span>
                            <select name="listId" className={inputClass}>
                                {lists.map((list) => (
                                    <option key={list.id} value={list.id}>
                                        {list.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}

                    {trigger === "no_open_days" && (
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium text-slate-700">Silent for (days)</span>
                            <input name="days" type="number" defaultValue={90} className={inputClass} />
                        </label>
                    )}

                    <div className="flex gap-2 md:col-span-2">
                        <button
                            type="submit"
                            disabled={pending}
                            className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                        >
                            Create sequence
                        </button>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {automations.length === 0 && (
                    <p className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-400">
                        No sequences yet. A welcome series is usually the highest-return one to build first.
                    </p>
                )}

                {automations.map((automation) => (
                    <div key={automation.id} className="rounded-xl border border-slate-200 bg-white p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-semibold text-slate-900">{automation.name}</h2>
                                    <span
                                        className={cn(
                                            "rounded-full px-2 py-0.5 text-[11px] font-medium",
                                            automation.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                                        )}
                                    >
                                        {automation.isActive ? "Live" : "Paused"}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {TRIGGER_LABELS[automation.trigger] ?? automation.trigger} ·{" "}
                                    {automation.steps.length} steps · {automation.enrollmentCount} enrolled
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={generating === automation.id}
                                    onClick={() => void generateSteps(automation)}
                                    className="flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-400 disabled:opacity-50"
                                >
                                    {generating === automation.id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                                    )}
                                    {automation.steps.length ? "Regenerate steps" : "Generate steps"}
                                </button>
                                <button
                                    type="button"
                                    disabled={pending}
                                    onClick={() =>
                                        startTransition(async () => {
                                            const result = await toggleAutomation(automation.id, !automation.isActive)
                                            if (!result.success) setError(result.error ?? "Could not change the state")
                                            router.refresh()
                                        })
                                    }
                                    className={cn(
                                        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-white",
                                        automation.isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                                    )}
                                >
                                    {automation.isActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                                    {automation.isActive ? "Pause" : "Activate"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!window.confirm(`Delete "${automation.name}" and all its enrollments?`)) return
                                        startTransition(async () => {
                                            await deleteAutomation(automation.id)
                                            router.refresh()
                                        })
                                    }}
                                    className="rounded p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {automation.steps.length > 0 && (
                            <ol className="mt-4 space-y-2">
                                {automation.steps.map((step) => (
                                    <li
                                        key={step.order}
                                        className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5"
                                    >
                                        <span className="flex items-center gap-1 rounded bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-500">
                                            <Clock className="h-3 w-3" />
                                            {step.delayHours === 0 ? "immediately" : `+${step.delayHours}h`}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-900">{step.subject}</p>
                                            <p className="truncate text-xs text-slate-500">{step.preheader}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
