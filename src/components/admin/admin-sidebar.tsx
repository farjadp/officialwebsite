"use client"

// ============================================================================
// Hardware Source: admin-sidebar.tsx
// Version: 2.0.0 — 2026-08-23
// Why: Navigation rebuild — reachable routes, collapsible groups, quick filter
// Env / Identity: Client Component
// ============================================================================

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard, FileText, Layers, Hash, Image as ImageIcon, Users, Settings,
    LogOut, FolderTree, Share2, BarChart3, Sparkles, Inbox, Activity, BookOpen,
    HardDrive, MessageSquareQuote, FolderGit2, Mail, Rocket, ScanSearch,
    ClipboardList, Search, ChevronDown, ScrollText, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavItem {
    title: string
    href: string
    icon: typeof LayoutDashboard
    /** Extra path prefixes that should also light this item up */
    match?: string[]
}

interface NavGroup {
    title: string
    items: NavItem[]
}

/**
 * Every entry here resolves to a page that actually exists. The previous version
 * linked to /admin/pages, which was never built, while seven real pages under
 * /admin/settings had no link anywhere in the UI and could only be reached by
 * typing the URL.
 */
const NAV_GROUPS: NavGroup[] = [
    {
        title: "Overview",
        items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
        title: "Content",
        items: [
            { title: "Posts", href: "/admin/posts", icon: FileText },
            { title: "Series", href: "/admin/series", icon: Layers },
            { title: "Media", href: "/admin/settings/media", icon: ImageIcon },
            { title: "Categories", href: "/admin/settings/categories", icon: FolderTree },
            { title: "Tags", href: "/admin/settings/tags", icon: Hash },
            { title: "Topics", href: "/admin/settings/topics", icon: BookOpen },
        ],
    },
    {
        title: "Growth",
        items: [
            { title: "Email Marketing", href: "/admin/newsletter", icon: Mail },
            { title: "Leads", href: "/admin/leads", icon: Inbox },
            { title: "NPI Leads", href: "/admin/npi-leads", icon: Activity },
            { title: "Waterfall", href: "/admin/waterfall", icon: Share2 },
            { title: "AI Studio", href: "/admin/ai-tools", icon: Sparkles },
        ],
    },
    {
        title: "Business",
        items: [
            { title: "Inbox", href: "/admin/inbox", icon: Mail },
            { title: "Projects", href: "/admin/portfolio", icon: FolderGit2 },
            { title: "Startups", href: "/admin/startups", icon: Rocket },
            { title: "Startup Intake", href: "/admin/intake", icon: ClipboardList },
            { title: "Lab Applications", href: "/admin/lab-applications", icon: ClipboardList },
            { title: "Book Club", href: "/admin/book-club", icon: BookOpen },
            { title: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
        ],
    },
    {
        title: "Insights",
        items: [
            { title: "Publish Report", href: "/admin/publish-report", icon: BarChart3 },
            { title: "Tools Analytics", href: "/admin/tools-analytics", icon: Activity },
            { title: "Website Audits", href: "/admin/website-audits", icon: ScanSearch },
        ],
    },
    {
        title: "System",
        items: [
            { title: "Settings", href: "/admin/settings", icon: Settings },
            { title: "Users", href: "/admin/settings/users", icon: Users },
            { title: "Logs", href: "/admin/settings/logs", icon: ScrollText },
            { title: "Backups", href: "/admin/settings/backups", icon: HardDrive, match: ["/admin/backups"] },
        ],
    },
]

const STORAGE_KEY = "admin-sidebar-collapsed"

/**
 * `/admin` would prefix-match every page, and `/admin/settings` would swallow all
 * of Content, so the deepest matching href wins instead of the first.
 */
function useActiveHref(pathname: string): string | null {
    return useMemo(() => {
        const candidates = NAV_GROUPS.flatMap((group) =>
            group.items.flatMap((item) => [item.href, ...(item.match ?? [])].map((href) => ({ item, href })))
        )

        let best: { href: string; length: number } | null = null
        for (const { item, href } of candidates) {
            const hit = pathname === href || pathname.startsWith(`${href}/`)
            if (hit && (!best || href.length > best.length)) {
                best = { href: item.href, length: href.length }
            }
        }
        return best?.href ?? null
    }, [pathname])
}

export function AdminSidebar() {
    const pathname = usePathname()
    const activeHref = useActiveHref(pathname)
    const [query, setQuery] = useState("")
    const [collapsed, setCollapsed] = useState<string[]>([])
    const [ready, setReady] = useState(false)

    // Read persisted state after mount so server and client markup agree
    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY)
            if (stored) setCollapsed(JSON.parse(stored) as string[])
        } catch {
            // A corrupt value should not break navigation
        }
        setReady(true)
    }, [])

    const toggleGroup = (title: string) => {
        setCollapsed((current) => {
            const next = current.includes(title)
                ? current.filter((t) => t !== title)
                : [...current, title]
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            } catch {
                // Persistence is a convenience, not a requirement
            }
            return next
        })
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return NAV_GROUPS
        return NAV_GROUPS.map((group) => ({
            ...group,
            items: group.items.filter(
                (item) =>
                    item.title.toLowerCase().includes(q) || group.title.toLowerCase().includes(q)
            ),
        })).filter((group) => group.items.length > 0)
    }, [query])

    const searching = query.trim().length > 0
    const totalMatches = filtered.reduce((sum, group) => sum + group.items.length, 0)

    return (
        <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950 text-white shadow-xl">
            <div className="px-5 pb-4 pt-7">
                <Link href="/admin" className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-lg shadow-violet-900/50">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-base font-bold tracking-tight text-slate-100">
                            Content Hub
                        </h1>
                        <p className="text-[11px] font-medium text-slate-500">Admin Workspace</p>
                    </div>
                </Link>

                <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Jump to…"
                        aria-label="Filter navigation"
                        className="w-full rounded-lg border border-slate-800 bg-slate-900/80 py-1.5 pl-8 pr-7 text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/40"
                    />
                    {searching && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="Clear filter"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-500 hover:text-slate-200"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-3">
                {searching && totalMatches === 0 && (
                    <p className="px-3 py-6 text-center text-xs text-slate-500">
                        Nothing matches “{query}”.
                    </p>
                )}

                {filtered.map((group) => {
                    // Filtering opens everything — a hidden match is a broken search
                    const isCollapsed = ready && !searching && collapsed.includes(group.title)

                    return (
                        <div key={group.title} className="pb-1">
                            <button
                                type="button"
                                onClick={() => toggleGroup(group.title)}
                                aria-expanded={!isCollapsed}
                                className="group flex w-full items-center gap-1 rounded px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-300"
                            >
                                {group.title}
                                <ChevronDown
                                    className={cn(
                                        "ml-auto h-3 w-3 transition-transform duration-200",
                                        isCollapsed && "-rotate-90"
                                    )}
                                />
                            </button>

                            {!isCollapsed && (
                                <div className="mt-0.5 space-y-0.5">
                                    {group.items.map((item) => {
                                        const isActive = item.href === activeHref
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                aria-current={isActive ? "page" : undefined}
                                                className={cn(
                                                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                                                    isActive
                                                        ? "bg-violet-600 text-white shadow-md shadow-violet-900/20"
                                                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        "h-4 w-4 shrink-0 transition-colors",
                                                        isActive
                                                            ? "text-violet-200"
                                                            : "text-slate-500 group-hover:text-slate-300"
                                                    )}
                                                />
                                                <span className="truncate">{item.title}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>

            <div className="border-t border-slate-800/50 bg-slate-950/50 p-3">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
