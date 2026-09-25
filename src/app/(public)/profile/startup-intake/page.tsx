// ============================================================================
// File Path: src/app/(public)/profile/startup-intake/page.tsx
// Why: v3 "Light". The view lives in
//      components/v3/pages/portal-startup-intake.tsx, shared by both
//      locales; this file keeps the session check, the Prisma query and
//      the noindex metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { NOINDEX } from "@/lib/seo"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PortalStartupIntakeList } from "@/components/v3/pages/portal-startup-intake"

export const dynamic = "force-dynamic"

export const metadata: Metadata = { robots: NOINDEX }

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

    return <PortalStartupIntakeList locale="en" isPrivileged={isPrivileged} intakes={intakes} />
}
