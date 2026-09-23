"use client"

// ============================================================================
// Hardware Source: header.tsx
// Version: 2.0.0 — 2026-09-21
// Why: Global layout shell component
// Env / Identity: Client Component
//
// Labels and hrefs come from @/lib/nav. They used to be hardcoded English,
// so on the Persian site every nav link threw the visitor back into the
// English site on their first click.
// ============================================================================

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    NAV,
    ROUTES,
    hasRoute,
    localePath,
    counterpartPath,
    type Locale,
} from "@/lib/nav"

export function Header({ locale = "en" }: { locale?: Locale }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const t = NAV[locale]
    const href = (path: string) => localePath(locale, path)
    const other: Locale = locale === "fa" ? "en" : "fa"
    const switchHref = counterpartPath(pathname ?? "/", other)
    const switchFlag = other === "fa" ? "/images/lion-sun.svg" : "/images/canada-flag.svg"

    return (
        <header className="relative z-50 border-b border-white/15 bg-[#0a0a0a] px-5 py-6 text-[#f2f0e9] md:px-10 lg:px-14">
            <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                {/* Logo / Name */}
                <Link href={href(ROUTES.home)} className="flex items-center gap-3">
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
                    <Link href={href(ROUTES.services)} className="hover:text-[#b9ff66] transition-colors">{t.services}</Link>

                    {/* Proof of Work Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-[#b9ff66] transition-colors outline-none pb-6 -mb-6">
                            {t.proofOfWork} <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                        </button>
                        <div className="absolute top-full start-0 pt-0 hidden group-hover:block w-64 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white border border-[#E7E5E4] rounded-sm shadow-xl p-2 flex flex-col gap-1">
                                <Link
                                    href={href(ROUTES.portfolio)}
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{t.portfolio}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{t.portfolioNote}</div>
                                </Link>
                                <div className="h-px w-full bg-[#E7E5E4]/50 my-1"></div>
                                <Link
                                    href={href(ROUTES.startups)}
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{t.startups}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{t.startupsNote}</div>
                                </Link>
                                <div className="h-px w-full bg-[#E7E5E4]/50 my-1"></div>
                                <Link
                                    href={href(ROUTES.stats)}
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{t.stats}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{t.statsNote}</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {hasRoute("blog", locale) && (
                        <Link href={href(ROUTES.blog)} className="hover:text-[#b9ff66] transition-colors">{t.blog}</Link>
                    )}
                    {hasRoute("bookClub", locale) && (
                        <Link href={href(ROUTES.bookClub)} className="hover:text-[#b9ff66] transition-colors">{t.bookClub}</Link>
                    )}
                    {/* Lab dropdown — the programme and its perk-partner call */}
                    {hasRoute("lab", locale) && (
                        <div className="relative group">
                            <button className="flex items-center gap-1 hover:text-[#b9ff66] transition-colors outline-none pb-6 -mb-6">
                                {t.lab} <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                            </button>
                            <div className="absolute top-full start-0 pt-0 hidden group-hover:block w-64 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                                <div className="bg-white border border-[#E7E5E4] rounded-sm shadow-xl p-2 flex flex-col gap-1">
                                    <Link
                                        href={href(ROUTES.lab)}
                                        className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                    >
                                        <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{t.labProgramme}</div>
                                        <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{t.labProgrammeNote}</div>
                                    </Link>
                                    <div className="h-px w-full bg-[#E7E5E4]/50 my-1"></div>
                                    <Link
                                        href={href(ROUTES.labPerks)}
                                        className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                    >
                                        <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{t.labPerks}</div>
                                        <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{t.labPerksNote}</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                    <Link href={href(ROUTES.tools)} className="hover:text-[#b9ff66] transition-colors">{t.tools}</Link>
                    <Link href={href(ROUTES.about)} className="hover:text-[#b9ff66] transition-colors">{t.about}</Link>
                    {hasRoute("resume", locale) && (
                        <Link href={href(ROUTES.resume)} className="hover:text-[#b9ff66] transition-colors">{t.resume}</Link>
                    )}

                    {/* User Portal Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-[#b9ff66] transition-colors outline-none pb-6 -mb-6">
                            {t.portal} <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                        </button>
                        <div className="absolute top-full start-0 pt-0 hidden group-hover:block w-56 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white border border-[#E7E5E4] rounded-sm shadow-xl p-2 flex flex-col gap-1">
                                <Link
                                    href={href(ROUTES.login)}
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{t.login}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{t.loginNote}</div>
                                </Link>
                                <div className="h-px w-full bg-[#E7E5E4]/50 my-1"></div>
                                <Link
                                    href={href(ROUTES.register)}
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{t.register}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{t.registerNote}</div>
                                </Link>
                                <div className="h-px w-full bg-[#E7E5E4]/50 my-1"></div>
                                <Link
                                    href={href(ROUTES.profile)}
                                    className="p-3 text-sm hover:bg-[#FDFCF8] hover:text-[#1B4B43] rounded-sm transition-colors text-stone-600 group/link"
                                >
                                    <div className="font-bold text-[#111827] group-hover/link:text-[#1B4B43] transition-colors">{t.profile}</div>
                                    <div className="text-[10px] text-stone-500 mt-1 uppercase tracking-widest leading-relaxed">{t.profileNote}</div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <a href={switchHref} className="hover:opacity-80 transition-opacity" title={t.switchLabel}>
                        <img src={switchFlag} alt={t.switchLabel} className="w-6 h-6 rounded-sm shadow-sm" />
                    </a>

                    <Link href={href(ROUTES.contact)} className="ms-2 border border-[#b9ff66] bg-[#b9ff66] px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-black transition-colors hover:bg-transparent hover:text-[#b9ff66]">
                        {t.cta}
                    </Link>
                </nav>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger className="md:hidden text-white hover:text-[#b9ff66] transition-colors">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">{t.menu}</span>
                    </SheetTrigger>
                    <SheetContent side={locale === "fa" ? "left" : "right"} className="bg-[#FDFCF8] border-[#E7E5E4]">
                        <div className="flex flex-col gap-6 mt-12 text-stone-600">
                            <Link href={href(ROUTES.services)} onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                {t.services}
                            </Link>

                            {/* Mobile Proof of Work Group */}
                            <div className="flex flex-col gap-4">
                                <span className="text-xl font-serif text-[#111827]">{t.proofOfWork}</span>
                                <div className="flex flex-col gap-4 ps-4 border-s-2 border-[#1B4B43]/20 ms-2">
                                    <Link href={href(ROUTES.portfolio)} onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        {t.portfolio}
                                    </Link>
                                    <Link href={href(ROUTES.startups)} onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        {t.startups}
                                    </Link>
                                    <Link href={href(ROUTES.stats)} onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        {t.stats}
                                    </Link>
                                </div>
                            </div>

                            {hasRoute("blog", locale) && (
                                <Link href={href(ROUTES.blog)} onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                    {t.blog}
                                </Link>
                            )}
                            {hasRoute("bookClub", locale) && (
                                <Link href={href(ROUTES.bookClub)} onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                    {t.bookClub}
                                </Link>
                            )}
                            {/* Mobile Lab group — matches the desktop dropdown */}
                            {hasRoute("lab", locale) && (
                                <div className="flex flex-col gap-4">
                                    <span className="text-xl font-serif text-[#111827]">{t.lab}</span>
                                    <div className="flex flex-col gap-4 ps-4 border-s-2 border-[#1B4B43]/20 ms-2">
                                        <Link href={href(ROUTES.lab)} onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                            {t.labProgramme}
                                        </Link>
                                        <Link href={href(ROUTES.labPerks)} onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                            {t.labPerks}
                                        </Link>
                                    </div>
                                </div>
                            )}
                            <Link href={href(ROUTES.tools)} onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                {t.tools}
                            </Link>
                            <Link href={href(ROUTES.about)} onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                {t.about}
                            </Link>
                            {hasRoute("resume", locale) && (
                                <Link href={href(ROUTES.resume)} onClick={() => setIsOpen(false)} className="text-xl font-serif hover:text-[#1B4B43] transition-colors">
                                    {t.resume}
                                </Link>
                            )}

                            {/* Mobile User Portal Group */}
                            <div className="flex flex-col gap-4">
                                <span className="text-xl font-serif text-[#111827]">{t.portalMobile}</span>
                                <div className="flex flex-col gap-4 ps-4 border-s-2 border-[#1B4B43]/20 ms-2">
                                    <Link href={href(ROUTES.login)} onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        {t.login}
                                    </Link>
                                    <Link href={href(ROUTES.register)} onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        {t.register}
                                    </Link>
                                    <Link href={href(ROUTES.profile)} onClick={() => setIsOpen(false)} className="text-lg font-serif text-stone-500 hover:text-[#1B4B43] transition-colors">
                                        {t.profile}
                                    </Link>
                                </div>
                            </div>

                            <a
                                href={switchHref}
                                className={`flex items-center gap-3 text-xl font-bold text-[#1B4B43] hover:opacity-80 transition-opacity ${other === "fa" ? "font-serif" : "font-sans"}`}
                                dir={other === "fa" ? "rtl" : "ltr"}
                            >
                                <img src={switchFlag} alt={t.switchLabel} className="w-6 h-6 rounded-sm shadow-sm" /> {t.switchTo}
                            </a>

                            <Link href={href(ROUTES.contact)} onClick={() => setIsOpen(false)} className="mt-4 px-4 py-3 text-center rounded-full border border-[#1B4B43] bg-[#1B4B43] text-white hover:bg-[#133832] transition-all text-sm uppercase tracking-wider font-bold">
                                {t.ctaMobile}
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
