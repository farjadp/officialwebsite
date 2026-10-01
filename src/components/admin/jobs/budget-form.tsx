"use client"

import { useActionState } from "react"
import { saveBudgetAction, type BudgetFormState } from "@/lib/jobs/actions"

const INPUT =
    "w-28 rounded-lg border border-slate-300 bg-white py-2 pl-6 pr-3 text-sm tabular-nums text-slate-900 focus:border-[#1B4B43] focus:outline-none focus:ring-1 focus:ring-[#1B4B43]"

function Meter({ label, spent, cap }: { label: string; spent: number; cap: number }) {
    const share = cap > 0 ? Math.min(1, spent / cap) : 1
    const tone = share >= 1 ? "bg-rose-600" : share >= 0.8 ? "bg-amber-500" : "bg-[#1B4B43]"
    return (
        <div>
            <div className="flex items-baseline justify-between text-sm">
                <span className="font-semibold text-slate-800">{label}</span>
                <span className="tabular-nums text-slate-600">
                    ${(spent / 100).toFixed(2)} of ${(cap / 100).toFixed(2)}
                </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100" role="meter" aria-valuemin={0} aria-valuemax={cap} aria-valuenow={spent} aria-label={label}>
                <div className={`h-full rounded-full ${tone}`} style={{ width: `${share * 100}%` }} />
            </div>
        </div>
    )
}

export function BudgetForm({ dailyCents, monthlyCents, todayCents, monthCents, reason }: {
    dailyCents: number
    monthlyCents: number
    todayCents: number
    monthCents: number
    reason: string | null
}) {
    const [state, action, isPending] = useActionState<BudgetFormState, FormData>(saveBudgetAction, {})

    return (
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-base font-bold text-slate-900">AI budget</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    A hard ceiling. When either is reached, nothing in the job search calls a model — no scoring, no résumés, no
                    AI help — until midnight Toronto time, the first of the month, or until you raise it here.
                </p>
            </div>

            {reason && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{reason}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
                <Meter label="Today" spent={todayCents} cap={dailyCents} />
                <Meter label="This month" spent={monthCents} cap={monthlyCents} />
            </div>

            <form action={action} className="flex flex-wrap items-end gap-4">
                <label className="text-xs font-semibold text-slate-600">
                    <span className="mb-1 block">Per day</span>
                    <span className="relative block">
                        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                        <input name="daily" inputMode="decimal" defaultValue={(dailyCents / 100).toString()} className={INPUT} />
                    </span>
                </label>
                <label className="text-xs font-semibold text-slate-600">
                    <span className="mb-1 block">Per month</span>
                    <span className="relative block">
                        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                        <input name="monthly" inputMode="decimal" defaultValue={(monthlyCents / 100).toString()} className={INPUT} />
                    </span>
                </label>
                <button type="submit" disabled={isPending} className="rounded-lg bg-[#1B4B43] px-4 py-2 text-sm font-semibold text-white hover:bg-[#153b35] disabled:opacity-50">
                    {isPending ? "Saving…" : "Save budget"}
                </button>
                {state.saved && <span role="status" className="pb-2 text-sm text-emerald-700">Saved</span>}
                {state.error && <span role="alert" className="pb-2 text-sm text-rose-700">{state.error}</span>}
            </form>
            <p className="text-xs text-slate-500">
                A typical day: about 100 postings scored for 30–55¢, plus about 2¢ per résumé, review or AI edit. Set $0 to turn the AI off entirely.
            </p>
        </section>
    )
}
