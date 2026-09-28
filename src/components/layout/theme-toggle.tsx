"use client"

// ============================================================================
// File Path: src/components/layout/theme-toggle.tsx
// Why: The site is dark by design, so light is an opt-in, not the system's
//      call: a visitor who has never chosen gets the design as drawn. The
//      choice is remembered and applied before first paint (see the inline
//      script in the root layout), so there is no flash of the wrong theme.
// Env / Identity: Client Component
// ============================================================================

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import type { Locale } from "@/lib/nav"

const LABELS: Record<Locale, { toLight: string; toDark: string }> = {
    en: { toLight: "Switch to the light theme", toDark: "Switch to the dark theme" },
    fa: { toLight: "رفتن به تم روشن", toDark: "رفتن به تم تیره" },
}

export function ThemeToggle({ locale = "en", className }: { locale?: Locale; className?: string }) {
    // Rendered dark on the server; the effect corrects it on mount from the
    // attribute the inline script already set, so the icon never lies.
    const [theme, setTheme] = useState<"dark" | "light">("dark")
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const current = document.documentElement.getAttribute("data-theme")
        setTheme(current === "light" ? "light" : "dark")
        setReady(true)
    }, [])

    const toggle = () => {
        const next = theme === "dark" ? "light" : "dark"
        setTheme(next)
        document.documentElement.setAttribute("data-theme", next)
        try {
            localStorage.setItem("v3-theme", next)
        } catch {
            // Private browsing or blocked storage: the choice simply does not persist.
        }
    }

    const t = LABELS[locale]
    const label = theme === "dark" ? t.toLight : t.toDark

    return (
        <button
            type="button"
            onClick={toggle}
            title={label}
            aria-label={label}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-v3-line text-v3-soft transition-colors duration-300 hover:border-v3-light hover:text-v3-light ${className ?? ""}`}
        >
            {/* Both icons ship; only the active one shows, so nothing shifts
                when the effect resolves the real theme. */}
            <Sun className={`h-[18px] w-[18px] ${ready && theme === "dark" ? "block" : "hidden"}`} aria-hidden />
            <Moon className={`h-[18px] w-[18px] ${ready && theme === "light" ? "block" : "hidden"}`} aria-hidden />
            <span className={ready ? "hidden" : "block h-[18px] w-[18px]"} aria-hidden />
        </button>
    )
}
