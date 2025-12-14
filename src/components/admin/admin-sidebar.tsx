"use client"

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
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Posts",
        href: "/admin/posts",
        icon: FileText,
    },
    {
        title: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
    },
    {
        title: "Tags",
        href: "/admin/tags",
        icon: Tag,
    },
    {
        title: "Series",
        href: "/admin/series",
        icon: Layers,
    },
    {
        title: "Topics",
        href: "/admin/topics",
        icon: Hash,
    },
    {
        title: "Pages",
        href: "/admin/pages",
        icon: PenTool,
    },
    {
        title: "Media",
        href: "/admin/media",
        icon: ImageIcon,
    },
    {
        title: "Newsletter",
        href: "/admin/newsletter",
        icon: Users,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight">Content Hub</h1>
                <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
            </div>
            <div className="flex-1 px-4 py-2 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    )
                })}
            </div>
            <div className="p-4 border-t border-slate-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
