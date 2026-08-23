// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Bring contacts in from files, Mailchimp, or the site's own tables
// Env / Identity: React Server Component
// ============================================================================

import { prisma } from "@/lib/prisma"
import { ImportPanel } from "@/components/email/import-panel"

export const dynamic = "force-dynamic"

export default async function ImportPage() {
    const [lists, subscriberCount, leadCount] = await Promise.all([
        prisma.contactList.findMany({ where: { isDynamic: false }, orderBy: { name: "asc" } }),
        prisma.subscriber.count(),
        prisma.lead.count(),
    ])

    return (
        <ImportPanel
            lists={lists.map((l) => ({ id: l.id, name: l.name }))}
            siteCounts={{ subscribers: subscriberCount, leads: leadCount }}
            mailchimpConfigured={!!process.env.MAILCHIMP_API_KEY}
        />
    )
}
