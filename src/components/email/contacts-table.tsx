"use client"

// ============================================================================
// Hardware Source: contacts-table.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Interactive contact list — filter, bulk-assign, suppress
// Env / Identity: Client Component
// ============================================================================

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search, Loader2, UserMinus, Trash2 } from "lucide-react"
import { addContactsToList, suppressContact, deleteContact } from "@/lib/actions/email"
import { cn } from "@/lib/utils"

export interface ContactRow {
    id: string
    email: string
    name: string
    company: string | null
    status: string
    source: string | null
    engagementScore: number
    openCount: number
    clickCount: number
    sendCount: number
    lastOpenedAt: string | null
    lists: { id: string; name: string; color: string }[]
}

const STATUS_STYLES: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50 text-amber-700",
    UNSUBSCRIBED: "bg-slate-100 text-slate-600",
    BOUNCED: "bg-rose-50 text-rose-700",
    COMPLAINED: "bg-rose-100 text-rose-800",
    SUNSET: "bg-slate-100 text-slate-500",
}

export function ContactsTable({
    contacts,
    lists,
    page,
    pageCount,
    query,
    status,
    listId,
}: {
    contacts: ContactRow[]
    lists: { id: string; name: string }[]
    page: number
    pageCount: number
    query: string
    status: string
    listId: string
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [pending, startTransition] = useTransition()
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [search, setSearch] = useState(query)

    const navigate = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString())
        for (const [key, value] of Object.entries(updates)) {
            if (value) params.set(key, value)
            else params.delete(key)
        }
        if (!("page" in updates)) params.delete("page")
        startTransition(() => router.push(`/admin/newsletter/contacts?${params.toString()}`))
    }

    const toggle = (id: string) => {
        setSelected((current) => {
            const next = new Set(current)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        navigate({ q: search })
                    }}
                    className="relative min-w-[220px] flex-1"
                >
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search email, name or company"
                        className="w-full rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                </form>

                <select
                    value={status}
                    onChange={(event) => navigate({ status: event.target.value })}
                    className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700"
                >
                    <option value="">All statuses</option>
                    {Object.keys(STATUS_STYLES).map((key) => (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    ))}
                </select>

                <select
                    value={listId}
                    onChange={(event) => navigate({ list: event.target.value })}
                    className="rounded-md border border-slate-200 px-2.5 py-1.5 text-sm text-slate-700"
                >
                    <option value="">All lists</option>
                    {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                            {list.name}
                        </option>
                    ))}
                </select>

                {pending && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
            </div>

            {selected.size > 0 && (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 p-3">
                    <span className="text-sm font-medium text-violet-900">{selected.size} selected</span>
                    <select
                        defaultValue=""
                        onChange={(event) => {
                            const target = event.target.value
                            if (!target) return
                            startTransition(async () => {
                                await addContactsToList([...selected], target)
                                setSelected(new Set())
                                router.refresh()
                            })
                            event.target.value = ""
                        }}
                        className="rounded-md border border-violet-200 bg-white px-2.5 py-1.5 text-sm"
                    >
                        <option value="">Add to list…</option>
                        {lists.map((list) => (
                            <option key={list.id} value={list.id}>
                                {list.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => setSelected(new Set())}
                        className="ml-auto text-sm text-violet-700 underline"
                    >
                        Clear
                    </button>
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                            <th className="w-10 px-4 py-2.5">
                                <input
                                    type="checkbox"
                                    checked={contacts.length > 0 && selected.size === contacts.length}
                                    onChange={(event) =>
                                        setSelected(event.target.checked ? new Set(contacts.map((c) => c.id)) : new Set())
                                    }
                                    className="h-4 w-4 accent-violet-600"
                                />
                            </th>
                            <th className="px-3 py-2.5 font-medium">Contact</th>
                            <th className="px-3 py-2.5 font-medium">Lists</th>
                            <th className="px-3 py-2.5 font-medium">Score</th>
                            <th className="px-3 py-2.5 font-medium">Sent / Open / Click</th>
                            <th className="px-3 py-2.5 font-medium">Status</th>
                            <th className="px-4 py-2.5" />
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                                    No contacts match this view.
                                </td>
                            </tr>
                        )}
                        {contacts.map((contact) => (
                            <tr key={contact.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selected.has(contact.id)}
                                        onChange={() => toggle(contact.id)}
                                        className="h-4 w-4 accent-violet-600"
                                    />
                                </td>
                                <td className="px-3 py-3">
                                    <div className="font-medium text-slate-900">{contact.email}</div>
                                    <div className="text-xs text-slate-400">
                                        {[contact.name, contact.company, contact.source].filter(Boolean).join(" · ") || "—"}
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {contact.lists.map((list) => (
                                            <span
                                                key={list.id}
                                                className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
                                                style={{ backgroundColor: list.color }}
                                            >
                                                {list.name}
                                            </span>
                                        ))}
                                        {contact.lists.length === 0 && <span className="text-xs text-slate-300">—</span>}
                                    </div>
                                </td>
                                <td className="px-3 py-3">
                                    <span
                                        className={cn(
                                            "font-semibold tabular-nums",
                                            contact.engagementScore >= 60
                                                ? "text-emerald-600"
                                                : contact.engagementScore >= 30
                                                  ? "text-amber-600"
                                                  : "text-rose-600"
                                        )}
                                    >
                                        {contact.engagementScore}
                                    </span>
                                </td>
                                <td className="px-3 py-3 tabular-nums text-slate-600">
                                    {contact.sendCount} / {contact.openCount} / {contact.clickCount}
                                </td>
                                <td className="px-3 py-3">
                                    <span
                                        className={cn(
                                            "rounded-full px-2 py-0.5 text-xs font-medium",
                                            STATUS_STYLES[contact.status] ?? "bg-slate-100 text-slate-600"
                                        )}
                                    >
                                        {contact.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            title="Suppress — stops all future sends"
                                            onClick={() =>
                                                startTransition(async () => {
                                                    await suppressContact(contact.email)
                                                    router.refresh()
                                                })
                                            }
                                            className="rounded p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                                        >
                                            <UserMinus className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            title="Delete permanently"
                                            onClick={() => {
                                                if (!window.confirm(`Delete ${contact.email} and all its history?`)) return
                                                startTransition(async () => {
                                                    await deleteContact(contact.id)
                                                    router.refresh()
                                                })
                                            }}
                                            className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pageCount > 1 && (
                <div className="flex items-center justify-between text-sm text-slate-600">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => navigate({ page: String(page - 1) })}
                        className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <span>
                        Page {page} of {pageCount}
                    </span>
                    <button
                        type="button"
                        disabled={page >= pageCount}
                        onClick={() => navigate({ page: String(page + 1) })}
                        className="rounded-md border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
