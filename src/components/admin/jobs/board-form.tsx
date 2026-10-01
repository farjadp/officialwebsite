"use client"

import { useActionState } from "react"
import { addBoard, type BoardFormState } from "@/lib/jobs/actions"
import { BOARD_KINDS, BOARD_KIND_LABEL } from "@/lib/jobs/types"

const INPUT =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1B4B43] focus:outline-none focus:ring-1 focus:ring-[#1B4B43]"

export function BoardForm() {
    const [state, action, isPending] = useActionState<BoardFormState, FormData>(addBoard, {})

    return (
        <form action={action} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-[11rem_1fr_1fr]">
                <div>
                    <label htmlFor="kind" className="mb-1.5 block text-xs font-semibold text-slate-700">Board type</label>
                    <select id="kind" name="kind" defaultValue="GREENHOUSE" className={INPUT}>
                        {BOARD_KINDS.map((kind) => (
                            <option key={kind} value={kind}>{BOARD_KIND_LABEL[kind]}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="label" className="mb-1.5 block text-xs font-semibold text-slate-700">Name</label>
                    <input id="label" name="label" required maxLength={120} placeholder="Company name" className={INPUT} />
                </div>
                <div>
                    <label htmlFor="token" className="mb-1.5 block text-xs font-semibold text-slate-700">Token</label>
                    <input id="token" name="token" required maxLength={80} placeholder="company-slug" className={INPUT} />
                </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
                The token is the company’s slug in its careers URL: <code>boards.greenhouse.io/<b>slug</b></code>,{" "}
                <code>jobs.lever.co/<b>slug</b></code>, <code>jobs.ashbyhq.com/<b>slug</b></code>. For a Remotive
                search it is the phrase to search for. The board is fetched before it is saved, so a wrong slug is
                refused here.
            </p>
            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-[#1B4B43] px-4 py-2 text-sm font-semibold text-white hover:bg-[#153b35] disabled:opacity-50"
                >
                    {isPending ? "Checking the board…" : "Add board"}
                </button>
                {state.error && <p role="alert" className="text-sm text-rose-700">{state.error}</p>}
                {state.ok && <p role="status" className="text-sm text-emerald-700">{state.ok}</p>}
            </div>
        </form>
    )
}
