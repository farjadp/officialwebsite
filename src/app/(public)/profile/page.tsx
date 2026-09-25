// ============================================================================
// File Path: src/app/(public)/profile/page.tsx
// Why: v3 "Light". The page lives in components/v3/pages/portal-profile.tsx,
//      shared by both locales; this file keeps the session check, the
//      Prisma query and the noindex metadata.
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { NOINDEX } from "@/lib/seo"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PortalProfile } from "@/components/v3/pages/portal-profile"

export const dynamic = "force-dynamic"

export const metadata: Metadata = { robots: NOINDEX }

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

    return <PortalProfile locale="en" user={user} isPrivileged={isPrivileged} />
}
