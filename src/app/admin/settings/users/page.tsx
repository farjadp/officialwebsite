import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UsersTable } from "@/components/admin/users-table"

export const metadata = { title: "User Management | Admin" }
export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if (!dbUser || (dbUser.role !== "OWNER" && dbUser.role !== "EDITOR")) redirect("/admin")

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true, name: true, email: true, role: true,
            isActive: true, emailVerified: true, createdAt: true, image: true,
        },
    })

    const stats = {
        total: users.length,
        owners: users.filter(u => u.role === "OWNER").length,
        editors: users.filter(u => u.role === "EDITOR").length,
        regular: users.filter(u => u.role === "USER").length,
        verified: users.filter(u => u.emailVerified).length,
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-slate-400 mt-1">Manage all registered users, roles, and account status.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total Users", value: stats.total, color: "text-white" },
                    { label: "Owners", value: stats.owners, color: "text-violet-400" },
                    { label: "Editors", value: stats.editors, color: "text-blue-400" },
                    { label: "Members", value: stats.regular, color: "text-slate-400" },
                    { label: "Verified", value: stats.verified, color: "text-emerald-400" },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <UsersTable users={users} isOwner={dbUser.role === "OWNER"} />
        </div>
    )
}
