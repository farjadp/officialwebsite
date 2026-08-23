"use client"

// ============================================================================
// Hardware Source: template-editor.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Thin wrapper putting the block editor behind a template name field
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import type { Block, EmailTheme } from "@/lib/email/blocks"
import { EmailEditor } from "./email-editor"
import { saveTemplate, deleteTemplate } from "@/lib/actions/email"

export function TemplateEditor({
    id,
    name: initialName,
    blocks,
    theme,
}: {
    id: string
    name: string
    blocks: Block[]
    theme: EmailTheme
}) {
    const router = useRouter()
    const [name, setName] = useState(initialName)
    const [pending, startTransition] = useTransition()

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="min-w-[220px] flex-1 border-0 bg-transparent p-0 text-lg font-semibold text-slate-900 outline-none"
                />
                <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                        if (!window.confirm(`Delete "${name}"? Campaigns already built from it are unaffected.`)) return
                        startTransition(async () => {
                            await deleteTemplate(id)
                            router.push("/admin/newsletter/templates")
                        })
                    }}
                    className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-600 hover:border-rose-300"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                </button>
            </div>

            <EmailEditor
                initialBlocks={blocks}
                initialTheme={theme}
                subject={name}
                preheader=""
                onSave={async (nextBlocks, nextTheme) => {
                    await saveTemplate(id, { name, blocks: nextBlocks, theme: nextTheme })
                    router.refresh()
                }}
            />
        </div>
    )
}
