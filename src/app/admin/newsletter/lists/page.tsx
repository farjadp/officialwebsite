// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Manage static lists and dynamic segments
// Env / Identity: React Server Component
// ============================================================================

import { prisma } from "@/lib/prisma"
import { buildContactWhere, SEGMENT_PRESETS, type SegmentFilter } from "@/lib/email/segment"
import { ListsManager } from "@/components/email/lists-manager"

export const dynamic = "force-dynamic"

export default async function ListsPage() {
    const lists = await prisma.contactList.findMany({
        include: { _count: { select: { members: true, campaigns: true } } },
        orderBy: { createdAt: "desc" },
    })

    // Dynamic segments have no stored membership — resolve their size on read.
    const withCounts = await Promise.all(
        lists.map(async (list) => ({
            id: list.id,
            name: list.name,
            description: list.description,
            color: list.color,
            isDynamic: list.isDynamic,
            filter: (list.filter as SegmentFilter | null) ?? null,
            campaignCount: list._count.campaigns,
            memberCount: list.isDynamic
                ? await prisma.contact.count({
                      where: buildContactWhere(list.filter as SegmentFilter | null, { sendableOnly: true }),
                  })
                : list._count.members,
        }))
    )

    return <ListsManager lists={withCounts} presets={SEGMENT_PRESETS} />
}
