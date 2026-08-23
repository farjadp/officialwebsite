"use server"

// ============================================================================
// Hardware Source: preferences-action.ts
// Version: 1.0.0 — 2026-08-23
// Why: Handle preference-center submissions from the public form
// Env / Identity: Server Action
// ============================================================================

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { suppress } from "./provider"

export async function updatePreferences(formData: FormData) {
    const token = String(formData.get("token") ?? "")
    const intent = String(formData.get("intent") ?? "save")

    const contact = await prisma.contact.findUnique({
        where: { unsubToken: token },
        select: { id: true, email: true, attributes: true },
    })
    if (!contact) redirect("/")

    if (intent === "unsubscribe") {
        await suppress(contact.email, "UNSUBSCRIBE", "preference-center")
        await prisma.emailEvent.create({
            data: { type: "UNSUBSCRIBED", contactId: contact.id, email: contact.email },
        })
        redirect(`/e/u/${token}`)
    }

    const selected = formData.getAll("lists").map(String)
    const frequency = String(formData.get("frequency") ?? "normal")

    // Replace membership wholesale — the form always submits the full desired set
    await prisma.contactListMember.deleteMany({ where: { contactId: contact.id } })
    if (selected.length) {
        await prisma.contactListMember.createMany({
            data: selected.map((listId) => ({ contactId: contact.id, listId })),
            skipDuplicates: true,
        })
    }

    const attributes: Record<string, string> = {
        ...((contact.attributes as Record<string, string>) ?? {}),
        frequency,
    }
    if (frequency === "pause90") {
        attributes.pausedUntil = new Date(Date.now() + 90 * 86_400_000).toISOString()
    } else {
        delete attributes.pausedUntil
    }

    await prisma.contact.update({
        where: { id: contact.id },
        data: { attributes },
    })

    redirect(`/e/p/${token}?saved=1`)
}
