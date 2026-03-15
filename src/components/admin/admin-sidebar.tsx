"use client"

// ============================================================================
// Hardware Source: admin-sidebar.tsx
// Version: 1.1.0 — 2026-03-15
// Why: Reusable UI component + Backup Manager link
// Env / Identity: Client Component
// ============================================================================

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    FileText,
    Layers,
    Hash,
    Image as ImageIcon,
    Users,
    Settings,
    LogOut,
    PenTool,
    FolderTree,
    Tag,
    Share2,
    BarChart3,
    Sparkles,
    Inbox,
    Activity,
    BookOpen,
    Globe,
    HardDrive,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarGroups = [
    {
        title: "Overview",
        items: [
            { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { title: "Publish Report", href: "/admin/publish-report", icon: BarChart3 },
            { title: "Tools Analytics", href: "/admin/tools-analytics", icon: Activity },
            { title: "Waterfall", href: "/admin/waterfall", icon: Share2 },
        ]
    },
    {
        title: "Content",
        items: [
            { title: "Posts", href: "/admin/posts", icon: FileText },
            { title: "Series", href: "/admin/series", icon: Layers },
            { title: "Topics", href: "/admin/topics", icon: Hash },
            { title: "Categories", href: "/admin/categories", icon: FolderTree },
            { title: "Tags", href: "/admin/tags", icon: Tag },
            { title: "Pages", href: "/admin/pages", icon: PenTool, placeholder: true },
            { title: "Media", href: "/admin/media", icon: ImageIcon, placeholder: true },
        ]
    },
    {
        title: "Growth & AI",
        items: [
            { title: "Leads", href: "/admin/leads", icon: Inbox },
            { title: "Newsletter", href: "/admin/newsletter", icon: Inbox, placeholder: true },
            { title: "AI Studio", href: "/admin/ai-tools", icon: Sparkles },
        ]
    },
    {
        title: "System",
        items: [
            { title: "Users", href: "/admin/users", icon: Users },
            { title: "Backup Manager", href: "/admin/backups", icon: HardDrive },
            { title: "Settings", href: "/admin/settings", icon: Settings, placeholder: true },
        ]
    }
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-slate-950 text-white w-64 border-r border-slate-800 shadow-xl">
            <div className="px-6 py-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="h-8 w-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-900/50">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-100">Content Hub</h1>
                </div>
                <p className="text-xs text-slate-400 font-medium ml-11">Admin Workspace</p>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar">
                {sidebarGroups.map((group, i) => (
                    <div key={i}>
                        <h3 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                            {group.title}
                        </h3>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-violet-600 text-white shadow-md shadow-violet-900/20"
                                                : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={cn(
                                                "h-4 w-4 transition-colors", 
                                                isActive ? "text-violet-200" : "text-slate-500 group-hover:text-slate-300"
                                            )} />
                                            {item.title}
                                        </div>
                                        {item.placeholder && (
                                            <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded shadow-sm">
                                                WIP
                                            </span>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-4 border-t border-slate-800/50 bg-slate-950/50">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
