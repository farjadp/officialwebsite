"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Settings2, Users, Image as ImageIcon, FolderTree, Tag, Hash, HardDrive, NotebookText } from "lucide-react"

const settingsTabs = [
    { title: "General", href: "/admin/settings", icon: Settings2 },
    { title: "Users", href: "/admin/settings/users", icon: Users },
    { title: "Media", href: "/admin/settings/media", icon: ImageIcon, placeholder: true },
    { title: "Categories", href: "/admin/settings/categories", icon: FolderTree },
    { title: "Tags", href: "/admin/settings/tags", icon: Tag },
    { title: "Topics", href: "/admin/settings/topics", icon: Hash },
    { title: "Backup", href: "/admin/settings/backups", icon: HardDrive },
    { title: "Logs", href: "/admin/settings/logs", icon: NotebookText },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-100">
            {/* Header Area */}
            <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Settings2 className="h-8 w-8 text-violet-500" />
                    Settings
                </h1>
                <p className="text-slate-400 mt-2">
                    Manage global configuration, taxonomy, system backups, and user access.
                </p>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 mt-8 overflow-x-auto pb-2 custom-scrollbar">
                    {settingsTabs.map((tab) => {
                        const isActive = pathname === tab.href
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                    isActive
                                        ? "bg-violet-600 text-white shadow-md shadow-violet-900/20"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                )}
                            >
                                <tab.icon className={cn("h-4 w-4", isActive ? "text-violet-200" : "text-slate-500")} />
                                {tab.title}
                                {tab.placeholder && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded ml-1">
                                        WIP
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </div>
        </div>
    )
}
