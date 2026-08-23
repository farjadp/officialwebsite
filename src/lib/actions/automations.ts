"use server"

// ============================================================================
// Hardware Source: automations.ts
// Version: 1.0.0 — 2026-08-23
// Why: Server actions for automation sequences
// Env / Identity: Server Actions
// ============================================================================

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import type { Block } from "@/lib/email/blocks"
import { renderEmail } from "@/lib/email/render"
import { runSunsetPolicy } from "@/lib/email/tracking"

const ROOT = "/admin/newsletter/automations"

interface Result<T = undefined> {
    success: boolean
    error?: string
    data?: T
}

async function guard(): Promise<string | null> {
    const session = await auth()
    if (!session?.user || !["OWNER", "EDITOR"].includes(session.user.role)) return "Unauthorized"
    return null
}

export async function createAutomation(formData: FormData): Promise<Result<{ id: string }>> {
    const denied = await guard()
    if (denied) return { success: false, error: denied }

    const automation = await prisma.automation.create({
        data: {
            name: String(formData.get("name") ?? "").trim() || "Untitled sequence",
            description: String(formData.get("description") ?? "").trim() || null,
            trigger: String(formData.get("trigger") ?? "contact_created"),
            listId: String(formData.get("listId") ?? "") || null,
            triggerConfig: {
                withinHours: Number(formData.get("withinHours") ?? 72),
                days: Number(formData.get("days") ?? 90),
            },
        },
    })

    revalidatePath(ROOT)
    return { success: true, data: { id: automation.id } }
}

/** Writes an AI-generated sequence into an automation, replacing its steps. */
export async function saveSequenceSteps(
    automationId: string,
    steps: { delayHours: number; subject: string; preheader: string; blocks: Block[] }[]
): Promise<Result> {
    const denied = await guard()
    if (denied) return { success: false, error: denied }

    await prisma.automationStep.deleteMany({ where: { automationId } })
    await prisma.$transaction(
        steps.map((step, index) =>
            prisma.automationStep.create({
                data: {
                    automationId,
                    order: index,
                    delayHours: step.delayHours,
                    subject: step.subject,
                    preheader: step.preheader,
                    blocks: step.blocks as unknown as object,
                    html: renderEmail(step.blocks, { preheader: step.preheader }).html,
                    // Later steps stop firing once the reader has engaged
                    skipIfOpened: index > 0,
                },
            })
        )
    )

    revalidatePath(ROOT)
    return { success: true }
}

export async function toggleAutomation(id: string, isActive: boolean): Promise<Result> {
    const denied = await guard()
    if (denied) return { success: false, error: denied }

    if (isActive) {
        const stepCount = await prisma.automationStep.count({ where: { automationId: id } })
        if (!stepCount) return { success: false, error: "Add at least one step before activating" }
    }

    await prisma.automation.update({ where: { id }, data: { isActive } })
    revalidatePath(ROOT)
    return { success: true }
}

export async function deleteAutomation(id: string): Promise<Result> {
    const denied = await guard()
    if (denied) return { success: false, error: denied }

    await prisma.automation.delete({ where: { id } })
    revalidatePath(ROOT)
    return { success: true }
}

export async function previewSunset(): Promise<Result<{ decayed: number; sunset: number }>> {
    const denied = await guard()
    if (denied) return { success: false, error: denied }

    return { success: true, data: await runSunsetPolicy({ dryRun: true }) }
}

export async function applySunset(): Promise<Result<{ decayed: number; sunset: number }>> {
    const denied = await guard()
    if (denied) return { success: false, error: denied }

    const result = await runSunsetPolicy()
    revalidatePath("/admin/newsletter/deliverability")
    return { success: true, data: result }
}
