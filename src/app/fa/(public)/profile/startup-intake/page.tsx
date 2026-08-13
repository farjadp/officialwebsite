import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { IntakeWizard } from "@/components/startup-intake/intake-wizard"
import { UserPortalNav } from "@/components/auth/user-portal-nav"
import type { IntakeCountry } from "@/data/startup-intake/config"

export const dynamic = "force-dynamic"

export default async function StartupIntakePage() {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true },
    })
    if (!user) redirect("/login")

    const intake = await prisma.startupIntake.findUnique({
        where: { userId: user.id },
    })

    const isPrivileged = user.role === "OWNER" || user.role === "EDITOR"

    const initialData = intake
        ? {
              startupName: intake.startupName,
              website: intake.website ?? "",
              country: intake.country as IntakeCountry,
              founders: intake.founders as any,
              answers: intake.answers as Record<string, string>,
              files: intake.files as Record<string, unknown>,
          }
        : undefined

    return (
        <div className="min-h-screen bg-[#030712] relative overflow-hidden pt-16 pb-16 px-4" dir="rtl">
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

            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
                    <UserPortalNav locale="fa" activeItem="startup-intake" isPrivileged={isPrivileged} />

                    <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 md:p-8">
                        <IntakeWizard
                            mode="user"
                            initialData={initialData as any}
                            submitEndpoint="/api/profile/intake"
                            uploadEndpoint="/api/profile/intake/upload"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
