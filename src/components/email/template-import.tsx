"use client"

// ============================================================================
// Hardware Source: template-import.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Bring an existing HTML email template into the library
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { importHtmlTemplate } from "@/lib/actions/email"

export function TemplateImport() {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    return (
        <form
            action={(formData) =>
                startTransition(async () => {
                    setError(null)
                    const result = await importHtmlTemplate(formData)
                    if (result.success && result.data) {
                        router.push(`/admin/newsletter/templates/${result.data.id}`)
                    } else {
                        setError(result.error ?? "Import failed")
                    }
                })
            }
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"
        >
            <h2 className="font-semibold text-slate-900">Import an HTML template</h2>
            <p className="text-xs leading-relaxed text-slate-500">
                Upload an .html file or paste the markup. It lands as one custom-HTML block you can edit directly, with
                the surrounding document shell rebuilt so tracking, the unsubscribe footer and the plain-text part all
                still work.
            </p>
            <input
                name="name"
                placeholder="Template name"
                className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-400"
            />
            <input
                type="file"
                name="file"
                accept=".html,.htm,.txt"
                className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-violet-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-violet-700"
            />
            <textarea
                name="html"
                rows={4}
                placeholder="…or paste HTML here"
                className="w-full rounded-md border border-slate-200 p-2.5 font-mono text-xs outline-none focus:border-violet-400"
            />
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
                {pending ? "Importing…" : "Import template"}
            </button>
        </form>
    )
}
