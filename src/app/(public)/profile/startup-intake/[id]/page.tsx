// ============================================================================
// File Path: src/app/(public)/profile/startup-intake/[id]/page.tsx
// Why: v3 "Light". The frame lives in
//      components/v3/pages/portal-startup-intake.tsx, shared by both
//      locales; this file keeps the session check, the ownership check,
//      the Prisma query and the noindex metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { NOINDEX } from "@/lib/seo"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PortalStartupIntakeForm } from "@/components/v3/pages/portal-startup-intake"
import type { IntakeCountry } from "@/data/startup-intake/config"

export const dynamic = "force-dynamic"

export const metadata: Metadata = { robots: NOINDEX }

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
        <PortalStartupIntakeForm
            locale="en"
            isPrivileged={isPrivileged}
            initialData={initialData as any}
            submitEndpoint="/api/profile/intake"
            uploadEndpoint="/api/profile/intake/upload"
        />
    )
}
