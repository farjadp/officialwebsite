"use client"

// ============================================================================
// File Path: src/components/auth/logout-button.tsx
// Why: The portal's sign-out control. The action is untouched — signOut()
//      still returns the visitor to "/". All styling comes from the caller,
//      so the v3 look lives in user-portal-nav.
//
//      Note: a stray copy of this file exists as "logout-button (1).tsx".
//      Nothing imports it; this is the one in use.
// Env / Identity: Client Component
// ============================================================================

import { signOut } from "next-auth/react"
import { ReactNode } from "react"

interface LogoutButtonProps {
    className?: string
    children?: ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
    return (
        <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className={className}
        >
            {children || "Sign Out"}
        </button>
    )
}
