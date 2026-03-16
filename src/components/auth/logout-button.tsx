"use client"

import { signOut } from "next-auth/react"
import { ReactNode } from "react"

interface LogoutButtonProps {
    className?: string
    children?: ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={className}
        >
            {children || "Sign Out"}
        </button>
    )
}
