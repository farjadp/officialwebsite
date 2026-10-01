// ============================================================================
// Hardware Source: layout.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Routing layout constraint
// Env / Identity: React Server Component
// ============================================================================

import { auth } from "@/auth"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    return (
        <div className="flex h-screen w-full bg-slate-50 print:block print:h-auto print:bg-white">
            <aside className="hidden md:block print:hidden">
                <AdminSidebar isOwner={session?.user?.role === "OWNER"} />
            </aside>
            <main className="flex-1 overflow-y-auto p-8 print:overflow-visible print:p-0">
                {children}
            </main>
        </div>
    )
}
