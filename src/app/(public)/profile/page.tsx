import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import Link from "next/link"
import { ShieldCheck, User, Mail, Calendar } from "lucide-react"
import { ProfileForm } from "@/components/auth/profile-form"
import { ChangePasswordForm } from "@/components/auth/change-password-form"
import { UserPortalNav } from "@/components/auth/user-portal-nav"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            bio: true,
            phone: true,
            role: true,
            createdAt: true,
            emailVerified: true,
            isActive: true,
        },
    })

    if (!user) redirect("/login")

    const isPrivileged = user.role === "OWNER" || user.role === "EDITOR"

    const roleColors = {
        OWNER: "bg-iran-hennaei/20 text-iran-khaki border border-iran-hennaei/30",
        EDITOR: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
        USER: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
    }
    const roleColor = roleColors[(user.role as keyof typeof roleColors) ?? "USER"]

    return (
        <div className="min-h-screen bg-[#010B19] relative overflow-hidden flex items-start justify-center pt-16 pb-16 px-4">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-iran-lajvard/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-iran-hennaei/15 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-6xl space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
                    <UserPortalNav locale="en" activeItem="profile" isPrivileged={isPrivileged} />

                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-iran-firouzeh text-sm font-medium mb-1">Account</p>
                                <h1 className="text-3xl font-bold text-white">Your Portal</h1>
                                <p className="text-slate-500 text-sm mt-1">Manage your profile and account details.</p>
                            </div>
                            {isPrivileged && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-iran-lajvard/20 border border-iran-lajvard/40 text-iran-firouzeh text-sm font-medium hover:bg-iran-lajvard/30 transition-all"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    Admin Panel
                                </Link>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                            {/* Left Column (Forms) */}
                            <div className="space-y-6">
                                {/* Edit Profile */}
                                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
                                        Edit Profile
                                    </h2>
                                    <ProfileForm
                                        locale="en"
                                        initialUser={{
                                            id: user.id,
                                            name: user.name,
                                            email: user.email,
                                            bio: user.bio,
                                            phone: user.phone,
                                            image: user.image,
                                            role: user.role,
                                        }}
                                    />
                                </div>

                                {/* Change Password */}
                                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
                                        Change Password
                                    </h2>
                                    <ChangePasswordForm locale="en" userEmail={user.email} />
                                </div>
                            </div>

                            {/* Account Summary */}
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
                                        Account Details
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Mail className="w-4 h-4 text-iran-firouzeh" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Email Address</p>
                                                <p className="text-white text-sm font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <User className="w-4 h-4 text-iran-firouzeh" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Role</p>
                                                <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${roleColor}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Calendar className="w-4 h-4 text-iran-firouzeh" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-0.5">Member Since</p>
                                                <p className="text-white text-sm font-medium">
                                                    {user.createdAt ? format(new Date(user.createdAt), "MMMM d, yyyy") : "Unknown"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
