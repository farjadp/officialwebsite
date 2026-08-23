// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Automation sequences — welcome, re-engagement, nurture
// Env / Identity: React Server Component
// ============================================================================

import { prisma } from "@/lib/prisma"
import { AutomationsManager } from "@/components/email/automations-manager"

export const dynamic = "force-dynamic"

export default async function AutomationsPage() {
    const [automations, lists] = await Promise.all([
        prisma.automation.findMany({
            include: {
                steps: { orderBy: { order: "asc" } },
                _count: { select: { enrollments: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.contactList.findMany({ orderBy: { name: "asc" } }),
    ])

    return (
        <AutomationsManager
            automations={automations.map((automation) => ({
                id: automation.id,
                name: automation.name,
                description: automation.description,
                trigger: automation.trigger,
                isActive: automation.isActive,
                enrollmentCount: automation._count.enrollments,
                steps: automation.steps.map((step) => ({
                    order: step.order,
                    delayHours: step.delayHours,
                    subject: step.subject,
                    preheader: step.preheader,
                })),
            }))}
            lists={lists.map((l) => ({ id: l.id, name: l.name }))}
        />
    )
}
