// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Template editing surface
// Env / Identity: React Server Component
// ============================================================================

import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import type { Block, EmailTheme } from "@/lib/email/blocks"
import { DEFAULT_THEME } from "@/lib/email/blocks"
import { TemplateEditor } from "@/components/email/template-editor"

export const dynamic = "force-dynamic"

export default async function TemplateEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const template = await prisma.emailTemplate.findUnique({ where: { id } })
    if (!template) notFound()

    return (
        <TemplateEditor
            id={template.id}
            name={template.name}
            blocks={(template.blocks as unknown as Block[]) ?? []}
            theme={{ ...DEFAULT_THEME, ...((template.theme as unknown as EmailTheme) ?? {}) }}
        />
    )
}
