// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Contact browser with search, status filter and inline management
// Env / Identity: React Server Component
// ============================================================================

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { buildContactWhere, type SegmentFilter } from "@/lib/email/segment"
import { ContactsTable } from "@/components/email/contacts-table"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 50

export default async function ContactsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; status?: string; list?: string; page?: string }>
}) {
    const params = await searchParams
    const page = Math.max(1, Number(params.page ?? 1))

    const filter: SegmentFilter = {
        search: params.q,
        status: params.status ? [params.status as never] : undefined,
        listIds: params.list ? [params.list] : undefined,
    }
    const where = buildContactWhere(filter)

    const [contacts, total, lists] = await Promise.all([
        prisma.contact.findMany({
            where,
            include: { memberships: { include: { list: true } } },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.contact.count({ where }),
        prisma.contactList.findMany({ where: { isDynamic: false }, orderBy: { name: "asc" } }),
    ])

    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900">Contacts</h1>
                    <p className="text-sm text-slate-500">{total.toLocaleString()} matching this view</p>
                </div>
                <Link
                    href="/admin/newsletter/import"
                    className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
                >
                    Import contacts
                </Link>
            </div>

            <ContactsTable
                contacts={contacts.map((contact) => ({
                    id: contact.id,
                    email: contact.email,
                    name: [contact.firstName, contact.lastName].filter(Boolean).join(" "),
                    company: contact.company,
                    status: contact.status,
                    source: contact.source,
                    engagementScore: contact.engagementScore,
                    openCount: contact.openCount,
                    clickCount: contact.clickCount,
                    sendCount: contact.sendCount,
                    lastOpenedAt: contact.lastOpenedAt?.toISOString() ?? null,
                    lists: contact.memberships.map((m) => ({ id: m.list.id, name: m.list.name, color: m.list.color })),
                }))}
                lists={lists.map((l) => ({ id: l.id, name: l.name }))}
                page={page}
                pageCount={pageCount}
                query={params.q ?? ""}
                status={params.status ?? ""}
                listId={params.list ?? ""}
            />
        </div>
    )
}
