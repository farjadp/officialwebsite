// ============================================================================
// Hardware Source: automation-engine.ts
// Version: 1.0.0 — 2026-08-23
// Why: Enroll contacts into sequences and deliver each step on schedule
// Env / Identity: Server module
// ============================================================================

import { prisma } from "@/lib/prisma"
import type { Block, EmailTheme } from "./blocks"
import { DEFAULT_THEME } from "./blocks"
import { renderEmail } from "./render"
import { applyMergeTags } from "./merge"
import { unsubscribeUrl, preferencesUrl } from "./campaign-engine"
import { marketingFrom, sendOne, recordSend, remainingDailyQuota } from "./provider"

/** Finds contacts matching each active automation's trigger and enrolls them. */
export async function enrollContacts(): Promise<number> {
    const automations = await prisma.automation.findMany({
        where: { isActive: true },
        include: { steps: { orderBy: { order: "asc" }, take: 1 } },
    })

    let enrolled = 0

    for (const automation of automations) {
        if (!automation.steps.length) continue
        const config = (automation.triggerConfig as Record<string, unknown>) ?? {}

        let where: Record<string, unknown> = { status: "ACTIVE" }

        if (automation.trigger === "contact_created") {
            const withinHours = Number(config.withinHours ?? 72)
            where.createdAt = { gte: new Date(Date.now() - withinHours * 3_600_000) }
        } else if (automation.trigger === "list_joined" && automation.listId) {
            where.memberships = { some: { listId: automation.listId } }
        } else if (automation.trigger === "no_open_days") {
            const days = Number(config.days ?? 90)
            where = {
                ...where,
                sendCount: { gt: 3 },
                OR: [
                    { lastOpenedAt: null },
                    { lastOpenedAt: { lt: new Date(Date.now() - days * 86_400_000) } },
                ],
            }
        } else {
            continue
        }

        // Never enroll twice — the unique constraint plus this filter keeps a
        // contact from receiving the same sequence on every cron tick.
        where.enrollments = { none: { automationId: automation.id } }

        const candidates = await prisma.contact.findMany({
            where: where as never,
            select: { id: true },
            take: 500,
        })
        if (!candidates.length) continue

        const firstDelay = automation.steps[0].delayHours
        await prisma.automationEnrollment.createMany({
            data: candidates.map((c) => ({
                automationId: automation.id,
                contactId: c.id,
                nextRunAt: new Date(Date.now() + firstDelay * 3_600_000),
            })),
            skipDuplicates: true,
        })

        enrolled += candidates.length
    }

    return enrolled
}

export async function runDueSteps(limit = 100): Promise<{ sent: number; completed: number }> {
    const quota = await remainingDailyQuota()
    if (quota <= 0) return { sent: 0, completed: 0 }

    const due = await prisma.automationEnrollment.findMany({
        where: { completedAt: null, nextRunAt: { lte: new Date() } },
        include: {
            contact: true,
            automation: { include: { steps: { orderBy: { order: "asc" } } } },
        },
        take: Math.min(limit, quota),
    })

    let sent = 0
    let completed = 0

    for (const enrollment of due) {
        const steps = enrollment.automation.steps
        const step = steps[enrollment.currentStep]
        const contact = enrollment.contact

        // Stop the moment the sequence ends or the contact leaves the list
        if (!step || contact.status !== "ACTIVE") {
            await prisma.automationEnrollment.update({
                where: { id: enrollment.id },
                data: { completedAt: new Date(), nextRunAt: null },
            })
            completed += 1
            continue
        }

        const advance = async () => {
            const next = steps[enrollment.currentStep + 1]
            await prisma.automationEnrollment.update({
                where: { id: enrollment.id },
                data: next
                    ? {
                          currentStep: enrollment.currentStep + 1,
                          nextRunAt: new Date(Date.now() + next.delayHours * 3_600_000),
                      }
                    : { completedAt: new Date(), nextRunAt: null },
            })
            if (!next) completed += 1
        }

        // "Stop nagging someone who already responded" — the single biggest
        // reason automated sequences generate complaints.
        if (step.skipIfOpened && contact.lastOpenedAt && contact.lastOpenedAt > enrollment.createdAt) {
            await advance()
            continue
        }

        const unsub = unsubscribeUrl(contact.unsubToken)
        const { html, text } = renderEmail((step.blocks as unknown as Block[]) ?? [], {
            theme: DEFAULT_THEME as EmailTheme,
            preheader: step.preheader,
            unsubscribeUrl: unsub,
            preferencesUrl: preferencesUrl(contact.unsubToken),
            postalAddress: process.env.EMAIL_POSTAL_ADDRESS,
        })

        const ctx = {
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
            company: contact.company,
            attributes: (contact.attributes as Record<string, unknown>) ?? {},
            unsubscribeUrl: unsub,
        }

        const outcome = await sendOne({
            to: contact.email,
            from: marketingFrom("Farjad Pezeshk"),
            subject: applyMergeTags(step.subject, ctx),
            html: applyMergeTags(html, ctx),
            text: applyMergeTags(text, ctx),
            unsubscribeUrl: unsub,
            tags: [
                { name: "automation", value: enrollment.automationId },
                { name: "step", value: String(step.order) },
            ],
        })

        if (outcome.ok) {
            sent += 1
            await Promise.all([
                prisma.contact.update({
                    where: { id: contact.id },
                    data: { sendCount: { increment: 1 }, lastSentAt: new Date() },
                }),
                prisma.emailEvent.create({
                    data: { type: "SENT", contactId: contact.id, email: contact.email },
                }),
                recordSend(),
            ])
        }

        await advance()
    }

    return { sent, completed }
}
