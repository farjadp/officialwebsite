"use client"

// ============================================================================
// Hardware Source: header.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Global layout shell component
// Env / Identity: Client Component
// ============================================================================

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header({ locale = "en" }: { locale?: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="relative z-50 border-b border-white/15 bg-[#0a0a0a] px-5 py-6 text-[#f2f0e9] md:px-10 lg:px-14">
            <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                {/* Logo / Name */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/images/logo-mark-light.png"
                        alt=""
                        width={571}
                        height={556}
                        priority
                        className="h-10 w-auto shrink-0 md:h-11"
                    />
                    <span className="flex flex-col">
                        <span className="text-xl font-black uppercase tracking-[-0.04em] leading-none text-white">Farjad®</span>
                        <span className="mt-1 text-[9px] uppercase tracking-[0.24em] text-white/45">Build / Advise / Engineer</span>
                    </span>
                </Link>

                {/* Minimal Nav */}
                <nav className="hidden md:flex items-center gap-7 text-[11px] font-bold uppercase tracking-[0.12em] text-white/55">
                    <Link href="/services" className="hover:text-[#b9ff66] transition-colors">Services</Link>

                    {/* Proof of Work Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-[#b9ff66] transition-colors outline-none pb-6 -mb-6">
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

                    <Link href="/blog" className="hover:text-[#b9ff66] transition-colors">Essays</Link>
                    <Link href="/tools" className="hover:text-[#b9ff66] transition-colors">Tools</Link>
                    <Link href="/about" className="hover:text-[#b9ff66] transition-colors">About</Link>
                    <Link href="/resume" className="hover:text-[#b9ff66] transition-colors">Resume</Link>

                    {/* User Portal Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-[#b9ff66] transition-colors outline-none pb-6 -mb-6">
                            {locale === "fa" ? "پرتال" : "Portal"} <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                        </button>
                        <div className="absolute top-full left-0 pt-0 hidden group-hover:block w-56 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white border border-[#E7E5E4] rounded-sm shadow-xl p-2 flex flex-col gap-1">
                                <Link
                                    href="/login"
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{locale === "fa" ? "ورود" : "Login"}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{locale === "fa" ? "دسترسی به حساب کاربری" : "Access your account"}</div>
                                </Link>
                                <div className="h-px w-full bg-[#E7E5E4]/50 my-1"></div>
                                <Link
                                    href="/register"
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{locale === "fa" ? "ثبت‌نام" : "Register"}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{locale === "fa" ? "ایجاد حساب کاربری جدید" : "Create a new account"}</div>
                                </Link>
                                <div className="h-px w-full bg-[#E7E5E4]/50 my-1"></div>
                                <Link
                                    href="/profile"
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{locale === "fa" ? "پروفایل" : "Profile"}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{locale === "fa" ? "مدیریت حساب و آواتار" : "Manage account & avatar"}</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {locale === "en" ? (
                        <a href={process.env.NODE_ENV === "development" ? "http://fa.localhost:3000" : "https://fa.farjadp.info"} className="hover:opacity-80 transition-opacity" title="Persian">
                            <img src="/images/lion-sun.svg" alt="Persian" className="w-6 h-6 rounded-sm shadow-sm" />
                        </a>
                    ) : (
                        <a href={process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://farjadp.info"} className="hover:opacity-80 transition-opacity" title="English" dir="ltr">
                            <img src="/images/canada-flag.svg" alt="English" className="w-6 h-6 rounded-sm shadow-sm" />
                        </a>
                    )}

                    <Link href="/contact" className="ml-2 border border-[#b9ff66] bg-[#b9ff66] px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-transparent hover:text-[#b9ff66]">
                        Start a project ↗
                    </Link>
                </nav>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger className="md:hidden text-white hover:text-[#b9ff66] transition-colors">
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
                            <Link href="/tools" onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                Tools
                            </Link>
                            <Link href="/about" onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                About
                            </Link>
                            <Link href="/resume" onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                Resume
                            </Link>

                            {/* Mobile User Portal Group */}
                            <div className="flex flex-col gap-4">
                                <span className="text-xl font-serif text-[#111827]">{locale === "fa" ? "پرتال کاربر" : "User Portal"}</span>
                                <div className="flex flex-col gap-4 pl-4 border-l-2 border-[#1B4B43]/20 ml-2">
                                    <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        {locale === "fa" ? "ورود" : "Login"}
                                    </Link>
                                    <Link href="/register" onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        {locale === "fa" ? "ثبت‌نام" : "Register"}
                                    </Link>
                                    <Link href="/profile" onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        {locale === "fa" ? "پروفایل" : "Profile"}
                                    </Link>
                                </div>
                            </div>

                            {locale === "en" ? (
                                <a href={process.env.NODE_ENV === "development" ? "http://fa.localhost:3000" : "https://fa.farjadp.info"} className="flex items-center gap-3 text-xl font-serif text-[#1B4B43] font-bold hover:opacity-80 transition-opacity">
                                    <img src="/images/lion-sun.svg" alt="Persian" className="w-6 h-6 rounded-sm shadow-sm" /> فارسی
                                </a>
                            ) : (
                                <a href={process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://farjadp.info"} className="flex items-center gap-3 text-xl font-sans text-[#1B4B43] font-bold hover:opacity-80 transition-opacity" dir="ltr">
                                    <img src="/images/canada-flag.svg" alt="English" className="w-6 h-6 rounded-sm shadow-sm" /> English
                                </a>
                            )}

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
