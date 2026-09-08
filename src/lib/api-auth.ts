// ============================================================================
// File: src/lib/api-auth.ts
// Role: Authorization guard for admin API route handlers.
// Why:  src/proxy.ts protects the /admin *pages*, but its matcher is
//         '/((?!api|_next/static|...).*)'
//       which excludes every API route by design. Eleven handlers under
//       src/app/api/admin/ therefore had no auth of their own and answered
//       anyone on the internet. withApiLogging is a logger, not a guard.
//
//       This is deliberately enforced inside the handler rather than at the
//       edge: edge auth on API routes is easy to get subtly wrong, and a route
//       that refuses on its own stays safe even if the matcher changes again.
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

/** Roles that may reach the admin panel and its API. USER is not one of them. */
export const ADMIN_ROLES = ["OWNER", "EDITOR"] as const
export type AdminRole = (typeof ADMIN_ROLES)[number]

export type AdminActor = {
    id: string
    email: string
    role: AdminRole
}

type Handler = (req: NextRequest, ctx?: unknown) => Promise<NextResponse>
type GuardedHandler = (req: NextRequest, ctx: unknown, actor: AdminActor) => Promise<NextResponse>

/**
 * Resolve the caller and confirm they may act on the admin API.
 *
 * The role is re-read from the database rather than trusted from the session
 * token, so revoking someone's access takes effect on their next request
 * instead of whenever their JWT happens to be refreshed.
 */
export async function requireAdmin(
    allowed: readonly AdminRole[] = ADMIN_ROLES
): Promise<{ actor: AdminActor } | { response: NextResponse }> {
    const session = await auth()

    if (!session?.user?.email) {
        return {
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        }
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, role: true },
    })

    if (!user || !allowed.includes(user.role as AdminRole)) {
        return {
            response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        }
    }

    return { actor: { id: user.id, email: user.email, role: user.role as AdminRole } }
}

/**
 * Wrap an admin route handler so it refuses unauthenticated and non-admin
 * callers before any work happens.
 *
 * Compose it inside withApiLogging so refusals are still logged:
 *   export const POST = withApiLogging("POST", withAdminAuth(postHandler))
 */
export function withAdminAuth(
    handler: Handler | GuardedHandler,
    allowed: readonly AdminRole[] = ADMIN_ROLES
): Handler {
    return async (req: NextRequest, ctx?: unknown) => {
        const result = await requireAdmin(allowed)
        if ("response" in result) return result.response
        return (handler as GuardedHandler)(req, ctx, result.actor)
    }
}
