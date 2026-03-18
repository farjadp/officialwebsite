"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { useState } from "react"

interface LogoutButtonProps {
    className?: string
    children?: React.ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
    const [loading, setLoading] = useState(false)

    async function handleLogout() {
        setLoading(true)
        await signOut({ callbackUrl: "/login" })
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={className}
        >
            {children ?? (
                <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    {loading ? "Signing out..." : "Sign Out"}
                </span>
            )}
        </button>
    )
}
