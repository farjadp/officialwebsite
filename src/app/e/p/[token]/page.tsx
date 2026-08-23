// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Preference center — a downgrade path that isn't "unsubscribe from all"
// Env / Identity: React Server Component
// ============================================================================

import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { updatePreferences } from "@/lib/email/preferences-action"

export const dynamic = "force-dynamic"

export default async function PreferenceCenter({
    params,
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params

    const contact = await prisma.contact.findUnique({
        where: { unsubToken: token },
        include: { memberships: true },
    })
    if (!contact) notFound()

    const lists = await prisma.contactList.findMany({
        where: { isDynamic: false },
        orderBy: { name: "asc" },
    })
    const joined = new Set(contact.memberships.map((m) => m.listId))

    return (
        <div className="grid min-h-screen place-items-center bg-zinc-50 p-6 dark:bg-zinc-950">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-9 dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Email preferences
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{contact.email}</p>

                <form action={updatePreferences} className="mt-7 space-y-6">
                    <input type="hidden" name="token" value={token} />

                    {lists.length > 0 && (
                        <fieldset className="space-y-3">
                            <legend className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                What you want to hear about
                            </legend>
                            {lists.map((list) => (
                                <label
                                    key={list.id}
                                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                                >
                                    <input
                                        type="checkbox"
                                        name="lists"
                                        value={list.id}
                                        defaultChecked={joined.has(list.id)}
                                        className="mt-0.5 h-4 w-4 accent-violet-600"
                                    />
                                    <span>
                                        <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            {list.name}
                                        </span>
                                        {list.description && (
                                            <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                                                {list.description}
                                            </span>
                                        )}
                                    </span>
                                </label>
                            ))}
                        </fieldset>
                    )}

                    <fieldset className="space-y-2">
                        <legend className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            How often
                        </legend>
                        {[
                            { value: "normal", label: "Every campaign" },
                            { value: "monthly", label: "At most once a month" },
                            { value: "pause90", label: "Pause everything for 90 days" },
                        ].map((option) => (
                            <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                                <input
                                    type="radio"
                                    name="frequency"
                                    value={option.value}
                                    defaultChecked={
                                        ((contact.attributes as Record<string, unknown>)?.frequency ?? "normal") ===
                                        option.value
                                    }
                                    className="h-4 w-4 accent-violet-600"
                                />
                                {option.label}
                            </label>
                        ))}
                    </fieldset>

                    <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                        <button
                            type="submit"
                            name="intent"
                            value="save"
                            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
                        >
                            Save preferences
                        </button>
                        <button
                            type="submit"
                            name="intent"
                            value="unsubscribe"
                            className="text-sm text-zinc-500 underline underline-offset-4 transition-colors hover:text-rose-600 dark:text-zinc-400"
                        >
                            Unsubscribe from everything
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
