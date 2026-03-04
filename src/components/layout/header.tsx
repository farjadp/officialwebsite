"use client"

// ============================================================================
// Hardware Source: header.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Global layout shell component
// Env / Identity: Client Component
// ============================================================================

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
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
                    <Link href="/services" className="hover:text-[#1B4B43] transition-colors">Services</Link>

                    {/* Proof of Work Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-[#1B4B43] transition-colors outline-none pb-6 -mb-6">
                            Proof of Work <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                        </button>
                        <div className="absolute top-full left-0 pt-0 hidden group-hover:block w-64 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white border border-[#E7E5E4] rounded-sm shadow-xl p-2 flex flex-col gap-1">
                                <Link
                                    href="/portfolio"
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">Business Ventures</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">Active portfolio companies</div>
                                </Link>
                                <div className="h-px w-full bg-[#E7E5E4]/50 my-1"></div>
                                <Link
                                    href="/startups"
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">Mentorship Portfolio</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">Startups I've advised</div>
                                </Link>
                                <div className="h-px w-full bg-[#E7E5E4]/50 my-1"></div>
                                <Link
                                    href="/stats"
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">Stats & Reality</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">By the numbers</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link href="/blog" className="hover:text-[#1B4B43] transition-colors">Essays</Link>
                    <Link href="/about" className="hover:text-[#1B4B43] transition-colors">About</Link>
                    <Link href="/contact" className="ml-4 px-4 py-2 rounded-full border border-stone-300 hover:border-[#1B4B43] hover:text-[#1B4B43] transition-all text-xs uppercase tracking-wider font-bold bg-[#1B4B43] text-white hover:bg-[#133832] hover:text-white">
                        Let's Talk
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
                            <Link href="/services" onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                Services
                            </Link>

                            {/* Mobile Proof of Work Group */}
                            <div className="flex flex-col gap-4">
                                <span className="text-xl font-serif text-[#111827]">Proof of Work</span>
                                <div className="flex flex-col gap-4 pl-4 border-l-2 border-[#1B4B43]/20 ml-2">
                                    <Link href="/portfolio" onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        Business Ventures
                                    </Link>
                                    <Link href="/startups" onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        Mentorship Portfolio
                                    </Link>
                                    <Link href="/stats" onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        Stats & Reality
                                    </Link>
                                </div>
                            </div>

                            <Link href="/blog" onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                Essays
                            </Link>
                            <Link href="/about" onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                About
                            </Link>
                            <Link href="/contact" onClick={() => setIsOpen(false)} className="mt-4 px-4 py-3 text-center rounded-full border border-[#1B4B43] bg-[#1B4B43] text-white hover:bg-[#133832] transition-all text-sm uppercase tracking-wider font-bold">
                                Let's Talk
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
