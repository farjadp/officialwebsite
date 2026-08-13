import { UserPortalNav } from "@/components/auth/user-portal-nav"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Lock } from "lucide-react"

export default async function FinanceInvoicesPage() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    })
    if (!user) redirect("/login")
    const isPrivileged = user.role === "OWNER" || user.role === "EDITOR"

    return (
        <div className="min-h-screen bg-[#010B19] relative overflow-hidden pt-16 pb-16 px-4">
            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
                    <UserPortalNav locale="en" activeItem="finance-invoices" isPrivileged={isPrivileged} />

                    <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                            <Lock className="w-8 h-8 text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                        <p className="text-slate-400">You do not have permission to access this section.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
