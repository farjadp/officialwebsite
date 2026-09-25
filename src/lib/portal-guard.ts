// ============================================================================
// File Path: src/lib/portal-guard.ts
// Why: The portal's placeholder routes all ran the same three lines — read
//      the session, look the user up, bounce to login if either is missing —
//      copied into eighteen files. This is that code, unchanged, in one
//      place, so the pages themselves are only their look.
//
//      `loginPath` stays a parameter because each route already has its own
//      (the Persian meetings pages send you to /fa/login, the Persian
//      finance pages to /login). Nothing about that behaviour changed here.
// Env / Identity: Server-only module (no "use client")
// ============================================================================

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export async function requirePortalUser(loginPath: string): Promise<{ role: string; isPrivileged: boolean }> {
    const session = await auth()
    if (!session?.user?.email) redirect(loginPath)

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true },
    })
    if (!user) redirect(loginPath)

    return { role: user.role, isPrivileged: user.role === "OWNER" || user.role === "EDITOR" }
}
