"use client"

// ============================================================================
// Hardware Source: header.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Global layout shell component
// Env / Identity: Client Component
// ============================================================================

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="relative z-50 pt-8 pb-8 px-6 md:px-12 border-b border-[#E7E5E4]/60 bg-[#FDFCF8] text-[#1C1917]">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* Logo / Name */}
                <Link href="/" className="flex flex-col">
                    <span className="font-serif font-bold text-2xl tracking-tight leading-none text-[#1B4B43]">Farjad.</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-1">Idea Library</span>
                </Link>

                {/* Minimal Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
                    <Link href="/blog" className="hover:text-[#1B4B43] transition-colors">Essays</Link>
                    <Link href="/series" className="hover:text-[#1B4B43] transition-colors">Series</Link>
                    <Link href="/about" className="hover:text-[#1B4B43] transition-colors">About</Link>
                    <Link href="/newsletter" className="ml-4 px-4 py-2 rounded-full border border-stone-300 hover:border-[#1B4B43] hover:text-[#1B4B43] transition-all text-xs uppercase tracking-wider font-bold">
                        Subscribe
                    </Link>
                </nav>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger className="md:hidden text-stone-600 hover:text-[#1B4B43] transition-colors">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-[#FDFCF8] border-[#E7E5E4]">
                        <div className="flex flex-col gap-6 mt-12 text-stone-600">
                            <Link href="/blog" onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                Essays
                            </Link>
                            <Link href="/series" onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                Series
                            </Link>
                            <Link href="/about" onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                About
                            </Link>
                            <Link href="/newsletter" onClick={() => setIsOpen(false)} className="mt-4 px-4 py-3 text-center rounded-full border border-stone-300 hover:border-[#1B4B43] hover:text-[#1B4B43] transition-all text-sm uppercase tracking-wider font-bold">
                                Subscribe
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
