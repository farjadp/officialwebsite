import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import Link from "next/link"
import { ShieldCheck, User, Mail, Calendar, Lock, ArrowRight } from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const userData = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        select: { createdAt: true, role: true, emailVerified: true, isActive: true }
    })

    const isPrivileged = userData?.role === "OWNER" || userData?.role === "EDITOR"

    const roleColors = {
        OWNER: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
        EDITOR: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
        USER: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
    }
    const roleColor = roleColors[(userData?.role as keyof typeof roleColors) ?? "USER"]

    return (
        <div className="min-h-screen bg-[#030712] relative overflow-hidden flex items-start justify-center pt-16 pb-16 px-4">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-700/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-violet-700/8 rounded-full blur-3xl" />
                <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            </div>

            <div className="relative z-10 w-full max-w-2xl space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-indigo-400 text-sm font-medium mb-1">Account</p>
                        <h1 className="text-3xl font-bold text-white">Your Profile</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage your account details and session.</p>
                    </div>
                    {isPrivileged && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium hover:bg-indigo-600/30 transition-all">
                            <ShieldCheck className="w-4 h-4" />Admin Panel
                        </Link>
                    )}
                </div>

                {/* Avatar Card */}
                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {(session.user.name || session.user.email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white text-xl font-bold">{session.user.name || "No Name"}</p>
                        <p className="text-slate-400 text-sm">{session.user.email}</p>
                        <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${roleColor}`}>
                            {userData?.role || "USER"}
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">Account Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {[
                            { icon: User, label: "Full Name", value: session.user.name || "Not set" },
                            { icon: Mail, label: "Email Address", value: session.user.email || "" },
                            { icon: ShieldCheck, label: "Verification", value: userData?.emailVerified ? "Email verified" : "Not verified" },
                            { icon: Calendar, label: "Member Since", value: userData?.createdAt ? format(new Date(userData.createdAt), "MMMM d, yyyy") : "Unknown" },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Icon className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                                    <p className="text-white text-sm font-medium">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 space-y-3">
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">Actions</h2>
                    <Link href="/forgot-password" className="flex items-center justify-between group p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">Change Password</p>
                                <p className="text-slate-500 text-xs">Update your account password via email</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                    </Link>
                </div>

                {/* Logout */}
                <div className="rounded-2xl border border-red-500/10 bg-red-950/10 p-6">
                    <h2 className="text-sm font-semibold text-red-400/70 uppercase tracking-widest mb-3">Danger Zone</h2>
                    <p className="text-slate-500 text-sm mb-4">Sign out from your current session on this device.</p>
                    <LogoutButton className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-sm font-medium transition-all">
                        <span className="flex items-center gap-2">Sign Out Securely</span>
                    </LogoutButton>
                </div>
            </div>
        </div>
    )
}
