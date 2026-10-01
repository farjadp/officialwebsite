"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"
import { generateDocumentsAction } from "@/lib/jobs/actions"

export function GenerateButton({ postingId, hasDocument }: { postingId: string; hasDocument: boolean }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    return (
        <div className="space-y-2">
            <button
                type="button"
                disabled={isPending}
                onClick={() =>
                    startTransition(async () => {
                        setError(null)
                        try {
                            const result = await generateDocumentsAction(postingId)
                            if (result.ok) router.push(`/admin/jobs/${postingId}/documents?doc=${result.documentId}`)
                            else setError(result.error)
                        } catch {
                            setError("It did not finish. Check Logs.")
                        }
                    })
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
            >
                <FileText className="h-4 w-4" />
                {isPending ? "Writing… about 30 seconds" : hasDocument ? "Write a new version" : "Write résumé and cover letter"}
            </button>
            {error && <p role="alert" className="text-xs text-rose-700">{error}</p>}
        </div>
    )
}
