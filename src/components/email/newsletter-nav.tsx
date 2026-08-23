"use client"

// ============================================================================
// Hardware Source: newsletter-nav.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Tab navigation across the email marketing sections
// Env / Identity: Client Component
// ============================================================================

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const TABS = [
    { href: "/admin/newsletter", label: "Overview", exact: true },
    { href: "/admin/newsletter/campaigns", label: "Campaigns" },
    { href: "/admin/newsletter/templates", label: "Templates" },
    { href: "/admin/newsletter/contacts", label: "Contacts" },
    { href: "/admin/newsletter/lists", label: "Lists & Segments" },
    { href: "/admin/newsletter/import", label: "Import" },
    { href: "/admin/newsletter/automations", label: "Automations" },
    { href: "/admin/newsletter/deliverability", label: "Deliverability" },
]

export function NewsletterNav() {
    const pathname = usePathname()

    return (
        <nav className="-mb-px mt-5 flex gap-1 overflow-x-auto">
            {TABS.map((tab) => {
                const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                                ? "border-violet-600 text-violet-700"
                                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                        )}
                    >
                        {tab.label}
                    </Link>
                )
            })}
        </nav>
    )
}
