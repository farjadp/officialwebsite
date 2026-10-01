"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const TABS = [
    { href: "/admin/jobs", label: "Postings" },
    { href: "/admin/jobs/boards", label: "Boards" },
    { href: "/admin/jobs/profile", label: "Profile" },
]

export function JobsNav() {
    const pathname = usePathname()
    const active = (href: string) =>
        href === "/admin/jobs"
            ? pathname === href || !TABS.slice(1).some((tab) => pathname.startsWith(tab.href))
            : pathname.startsWith(href)

    return (
        <nav aria-label="Job search sections" className="flex gap-1 border-b border-slate-200">
            {TABS.map((tab) => (
                <Link
                    key={tab.href}
                    href={tab.href}
                    aria-current={active(tab.href) ? "page" : undefined}
                    className={cn(
                        "-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
                        active(tab.href)
                            ? "border-[#1B4B43] text-[#1B4B43]"
                            : "border-transparent text-slate-500 hover:text-slate-800",
                    )}
                >
                    {tab.label}
                </Link>
            ))}
        </nav>
    )
}
