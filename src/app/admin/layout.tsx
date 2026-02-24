// ============================================================================
// Hardware Source: layout.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Routing layout constraint
// Env / Identity: React Server Component
// ============================================================================

import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-slate-50">
            <aside className="hidden md:block">
                <AdminSidebar />
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
