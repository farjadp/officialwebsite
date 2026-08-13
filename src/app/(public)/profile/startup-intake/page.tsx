import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserPortalNav } from "@/components/auth/user-portal-nav"
import Link from "next/link"
import { Plus, Rocket, Clock, CheckCircle2, ChevronLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function StartupIntakeDashboard() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true },
    })
    if (!user) redirect("/login")

    const intakes = await prisma.startupIntake.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
    })

    const isPrivileged = user.role === "OWNER" || user.role === "EDITOR"

    return (
        <div className="min-h-screen bg-[#010B19] relative overflow-hidden pt-16 pb-16 px-4">
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

            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
                    <UserPortalNav locale="en" activeItem="startup-intake" isPrivileged={isPrivileged} />

                    <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 md:p-8 min-h-[500px]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Rocket className="w-6 h-6 text-iran-firouzeh" />
                                    استارتاپ‌های شما
                                </h1>
                                <p className="text-slate-400 mt-1">مدیریت استارتاپ‌های ثبت شده جهت بررسی</p>
                            </div>
                            
                            <Link 
                                href="/profile/startup-intake/new"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-iran-lajvard hover:bg-[#003380] px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-iran-lajvard/30 w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4" />
                                ثبت استارتاپ جدید
                            </Link>
                        </div>

                        {intakes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                                <div className="w-16 h-16 bg-iran-lajvard/10 rounded-2xl flex items-center justify-center mb-4">
                                    <Rocket className="w-8 h-8 text-iran-firouzeh" />
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2">هنوز استارتاپی ثبت نکردید!</h2>
                                <p className="text-slate-400 max-w-md mb-6">شما می‌توانید چندین استارتاپ مختلف را در پروفایل خود ثبت و پیگیری کنید.</p>
                                <Link 
                                    href="/profile/startup-intake/new"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    اولین استارتاپ خود را ثبت کنید
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {intakes.map((intake) => {
                                    const isSubmitted = intake.status === "SUBMITTED"
                                    const isDraft = intake.status === "DRAFT"
                                    
                                    return (
                                        <Link 
                                            href={`/profile/startup-intake/${intake.id}`} 
                                            key={intake.id}
                                            className="group block bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-bold text-white group-hover:text-iran-firouzeh transition-colors">
                                                    {intake.startupName || "بدون نام"}
                                                </h3>
                                                <div className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 ${isSubmitted ? 'bg-iran-yashm/15 text-iran-yashm border border-iran-yashm/30' : 'bg-iran-mashi/15 text-iran-mashi border border-iran-mashi/30'}`}>
                                                    {isSubmitted ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            ارسال شده
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-3.5 h-3.5" />
                                                            پیش‌نویس
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="text-sm text-slate-400 flex items-center justify-between">
                                                <span>آخرین ویرایش: {new Date(intake.updatedAt).toLocaleDateString('fa-IR')}</span>
                                                <ChevronLeft className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
