// ============================================================================
// Hardware Source: guard.ts
// Version: 1.0.0 — 2026-10-01
// Why: /admin admits EDITOR as well as OWNER (src/proxy.ts only turns USER
//      away). The job search is the owner's private business, so its pages and
//      every one of its actions ask this instead of trusting the route guard.
// Env / Identity: Server only.
// ============================================================================

import { redirect } from "next/navigation"
import { auth } from "@/auth"

type SessionLike = { user?: { role?: string | null } | null } | null | undefined

export function isOwner(session: SessionLike): boolean {
    return session?.user?.role === "OWNER"
}

export class NotOwner extends Error {
    constructor() {
        super("Only the owner can use the job search")
        this.name = "NotOwner"
    }
}

/** For pages: anyone but the owner is sent back to the dashboard. */
export async function requireOwnerPage(): Promise<void> {
    if (!isOwner(await auth())) redirect("/admin")
}

/** For server actions: anyone but the owner gets an error, not a redirect. */
export async function assertOwner(): Promise<void> {
    if (!isOwner(await auth())) throw new NotOwner()
}
