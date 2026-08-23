"use client"

// ============================================================================
// Hardware Source: dmarc-upload.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Drag-and-drop ingestion for the compressed XML receivers send
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"
import { Upload, Loader2, Check, AlertTriangle, Trash2, FileArchive } from "lucide-react"
import { uploadDmarcReports, clearDmarcReports, type UploadSummary } from "@/lib/actions/dmarc"
import { cn } from "@/lib/utils"

export function DmarcUpload({ hasReports }: { hasReports: boolean }) {
    const router = useRouter()
    const input = useRef<HTMLInputElement>(null)
    const [pending, startTransition] = useTransition()
    const [dragging, setDragging] = useState(false)
    const [summary, setSummary] = useState<UploadSummary | null>(null)
    const [error, setError] = useState<string | null>(null)

    const submit = (files: FileList | null) => {
        if (!files?.length) return
        const formData = new FormData()
        for (const file of Array.from(files)) formData.append("files", file)

        startTransition(async () => {
            setError(null)
            setSummary(null)
            const result = await uploadDmarcReports(formData)
            if (result.success && result.data) {
                setSummary(result.data)
                router.refresh()
            } else {
                setError(result.error ?? "Upload failed")
            }
        })
    }

    return (
        <div className="space-y-3">
            <div
                onDragOver={(event) => {
                    event.preventDefault()
                    setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                    event.preventDefault()
                    setDragging(false)
                    submit(event.dataTransfer.files)
                }}
                className={cn(
                    "rounded-xl border-2 border-dashed p-8 text-center transition-colors",
                    dragging ? "border-violet-500 bg-violet-50" : "border-slate-300 bg-white"
                )}
            >
                <FileArchive className="mx-auto h-6 w-6 text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-900">
                    Drop DMARC reports here
                </p>
                <p className="mx-auto mt-1 max-w-xl text-xs leading-relaxed text-slate-500">
                    Reports arrive as email attachments at your <code className="font-mono">rua</code> address,
                    usually <code className="font-mono">.xml.gz</code> from Google and{" "}
                    <code className="font-mono">.zip</code> from Microsoft and Yahoo. Save the attachments and drop
                    them in — several at once is fine, and re-uploading the same report is harmless.
                </p>

                <button
                    type="button"
                    onClick={() => input.current?.click()}
                    disabled={pending}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                >
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {pending ? "Parsing…" : "Choose files"}
                </button>

                <input
                    ref={input}
                    type="file"
                    multiple
                    accept=".xml,.gz,.zip,application/gzip,application/zip,text/xml"
                    className="hidden"
                    onChange={(event) => {
                        submit(event.target.files)
                        event.target.value = ""
                    }}
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            {summary && (
                <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                        <Check className="h-4 w-4" />
                        Imported {summary.imported} report{summary.imported === 1 ? "" : "s"} covering{" "}
                        {summary.messages.toLocaleString()} messages
                        {summary.duplicates > 0 && ` · ${summary.duplicates} already on file`}
                    </div>
                    {summary.failed.length > 0 && (
                        <ul className="space-y-1 text-xs text-rose-700">
                            {summary.failed.map((failure) => (
                                <li key={failure.file}>
                                    <span className="font-medium">{failure.file}</span>: {failure.error}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {hasReports && (
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                        if (!window.confirm("Delete every stored DMARC report? The originals in your mailbox are untouched.")) return
                        startTransition(async () => {
                            await clearDmarcReports()
                            setSummary(null)
                            router.refresh()
                        })
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-rose-600"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear stored reports
                </button>
            )}
        </div>
    )
}
