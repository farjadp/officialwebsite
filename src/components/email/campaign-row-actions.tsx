"use client"

// ============================================================================
// Hardware Source: campaign-row-actions.tsx
// Version: 1.0.0 — 2026-08-24
// Why: Delete a campaign, saying plainly what goes with it
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { deleteCampaign, describeCampaignRemoval, type CampaignRemoval } from "@/lib/actions/email"

export function CampaignRowActions({
    id,
    name,
    status,
}: {
    id: string
    name: string
    status: string
}) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [removal, setRemoval] = useState<CampaignRemoval | null>(null)
    const [error, setError] = useState<string | null>(null)

    const isSending = status === "SENDING"

    const open = () =>
        startTransition(async () => {
            setError(null)
            const result = await describeCampaignRemoval(id)
            if (result.success && result.data) setRemoval(result.data)
            else setError(result.error ?? "Could not read the campaign")
        })

    const confirm = () =>
        startTransition(async () => {
            const result = await deleteCampaign(id)
            if (result.success) {
                setRemoval(null)
                router.refresh()
            } else {
                setError(result.error ?? "Delete failed")
            }
        })

    return (
        <>
            {/* Surfaced outside the dialog too: if opening it is what failed,
                an error rendered only inside would never be seen */}
            {error && !removal && (
                <span className="mr-2 text-xs text-rose-600" role="alert">
                    {error}
                </span>
            )}
            <button
                type="button"
                onClick={open}
                disabled={pending || isSending}
                title={isSending ? "Pause the campaign before deleting it" : `Delete "${name}"`}
                aria-label={`Delete ${name}`}
                className="rounded p-1.5 text-slate-300 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-300"
            >
                {pending && !removal ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
            </button>

            {removal && (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) setRemoval(null)
                    }}
                >
                    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
                        <h2 className="text-base font-semibold text-slate-900">Delete “{removal.name}”?</h2>

                        {removal.sentCount > 0 ? (
                            <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                <p className="text-xs leading-relaxed text-amber-900">
                                    This campaign already reached{" "}
                                    <strong>{removal.sentCount.toLocaleString()} real inboxes</strong>. Deleting it
                                    destroys its report — opens, clicks and bounces included — and that cannot be
                                    recovered. The people who received it keep their send history, so the frequency
                                    cap and engagement scores stay correct.
                                </p>
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-slate-600">
                                Nothing was ever sent from this campaign, so there is no reporting to lose.
                            </p>
                        )}

                        <ul className="mt-3 space-y-1 text-xs text-slate-500">
                            <li>· {removal.recipients.toLocaleString()} queued or sent recipient records</li>
                            <li>· {removal.events.toLocaleString()} tracked events</li>
                            <li>· link click totals and any A/B variants</li>
                        </ul>

                        {error && (
                            <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700">
                                {error}
                            </p>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setRemoval(null)}
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-slate-300"
                            >
                                Keep it
                            </button>
                            <button
                                type="button"
                                disabled={pending}
                                onClick={confirm}
                                className="flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                            >
                                {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                Delete permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
