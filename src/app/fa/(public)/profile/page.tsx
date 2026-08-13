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
        OWNER: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
        EDITOR: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
        USER: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
    }
    const roleColor = roleColors[(user.role as keyof typeof roleColors) ?? "USER"]

    return (
        <div className="min-h-screen bg-[#030712] relative overflow-hidden flex items-start justify-center pt-16 pb-16 px-4" dir="rtl">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-700/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-violet-700/8 rounded-full blur-3xl" />
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
                    <UserPortalNav locale="fa" activeItem="profile" isPrivileged={isPrivileged} />

                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-indigo-400 text-sm font-medium mb-1">حساب کاربری</p>
                                <h1 className="text-3xl font-bold text-white">پرتال شما</h1>
                                <p className="text-slate-500 text-sm mt-1">پروفایل و جزئیات حسابتان را مدیریت کنید.</p>
                            </div>
                            {isPrivileged && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium hover:bg-indigo-600/30 transition-all"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    پنل ادمین
                                </Link>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                            {/* Left Column (Forms) */}
                            <div className="space-y-6">
                                {/* Edit Profile */}
                                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 text-right">
                                        ویرایش پروفایل
                                    </h2>
                                    <ProfileForm
                                        locale="fa"
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
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 text-right">
                                        تغییر رمز عبور
                                    </h2>
                                    <ChangePasswordForm locale="fa" userEmail={user.email} />
                                </div>
                            </div>

                            {/* Account Summary */}
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
                                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5 text-right">
                                        جزئیات حساب
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 flex-row-reverse">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Mail className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <div className="text-right flex-1">
                                                <p className="text-xs text-slate-500 mb-0.5">آدرس ایمیل</p>
                                                <p className="text-white text-sm font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 flex-row-reverse">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <User className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <div className="text-right flex-1">
                                                <p className="text-xs text-slate-500 mb-0.5">نقش</p>
                                                <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${roleColor}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 flex-row-reverse">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Calendar className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <div className="text-right flex-1">
                                                <p className="text-xs text-slate-500 mb-0.5">عضو از</p>
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
