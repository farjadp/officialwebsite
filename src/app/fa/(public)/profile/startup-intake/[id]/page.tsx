import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { IntakeWizard } from "@/components/startup-intake/intake-wizard"
import { UserPortalNav } from "@/components/auth/user-portal-nav"
import type { IntakeCountry } from "@/data/startup-intake/config"

export const dynamic = "force-dynamic"

export default async function StartupIntakeFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, role: true },
    })
    if (!user) redirect("/login")

    const isNew = id === "new"
    let intake = null

    if (!isNew) {
        intake = await prisma.startupIntake.findUnique({
            where: { id },
        })
        
        // Ensure user owns this intake
        if (intake && intake.userId !== user.id) {
            redirect("/profile/startup-intake")
        }
    }

    const isPrivileged = user.role === "OWNER" || user.role === "EDITOR"

    const initialData = intake
        ? {
              id: intake.id,
              startupName: intake.startupName,
              website: intake.website ?? "",
              country: intake.country as IntakeCountry,
              founders: intake.founders as any,
              answers: intake.answers as Record<string, string>,
              files: intake.files as Record<string, unknown>,
          }
        : undefined

    return (
        <div dir="rtl" className="min-h-screen bg-[#010B19] relative overflow-hidden pt-16 pb-16 px-4">
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
