// ============================================================================
// File Path: src/components/layout/footer.tsx
// Version: 3.0.0 — The "Editorial" Footer, localised
// Style: Dark Mode "Book Cover" style.
// Why: Creates a strong visual anchor at the bottom.
//      Prioritizes the Newsletter (The Inner Circle).
//
// Copy and hrefs come from @/lib/nav. Every link here used to be a hardcoded
// English route with hardcoded English copy, so the Persian footer was an
// English footer bolted onto a Persian page.
// ============================================================================

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    Send,
    Instagram,
    Youtube,
    Linkedin,
    MapPin,
    Clock
} from "lucide-react"
import { FOOTER, ROUTES, hasRoute, localePath, type Locale } from "@/lib/nav"

export function Footer({ locale = "en" }: { locale?: Locale }) {
    const t = FOOTER[locale]
    const href = (path: string) => localePath(locale, path)

    return (
        <footer className="bg-[#111827] text-stone-300 font-sans border-t border-[#1B4B43] relative overflow-hidden">

            {/* Abstract Background Element (Subtle) */}
            <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-[#1B4B43] rounded-full blur-[150px] opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12 relative z-10">

                {/* --- TOP SECTION: Newsletter & Brand --- */}
                <div className="grid lg:grid-cols-2 gap-16 mb-20">

                    {/* Brand Manifesto */}
                    <div className="space-y-6">
                        <Link href={href(ROUTES.home)} className="inline-flex items-center gap-4">
                            <Image
                                src="/images/logo-mark-light.png"
                                alt=""
                                width={571}
                                height={556}
                                className="h-14 w-auto shrink-0"
                            />
                            <span className="font-serif font-black text-3xl tracking-tighter text-white" dir="ltr">
                                FARJAD<span className="text-[#D97706]">.</span>
                            </span>
                        </Link>
                        <p className="text-lg text-stone-400 leading-relaxed max-w-md font-light">
                            {t.manifesto}
                        </p>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1B4B43]">
                                <span className="w-2 h-2 bg-[#1B4B43] rounded-full animate-pulse" />
                                {t.available}
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Box */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm backdrop-blur-sm">
                        <h3 className="font-serif text-2xl text-white mb-2">{t.newsletterTitle}</h3>
                        <p className="text-sm text-stone-400 mb-6">
                            {t.newsletterBody}
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3">
                            <Input
                                placeholder={t.newsletterPlaceholder}
                                dir="ltr"
                                className="bg-white/10 border-white/10 text-white placeholder:text-stone-500 focus-visible:ring-[#1B4B43] h-12"
                            />
                            <Button className="bg-[#1B4B43] hover:bg-[#133832] text-white h-12 px-6 font-bold uppercase tracking-wider text-xs">
                                {t.subscribe}
                            </Button>
                        </form>
                    </div>
                </div>

                <Separator className="bg-white/10 mb-16" />

                {/* --- MIDDLE SECTION: The Index (Links) --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">

                    {/* Column 1 */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.colLibrary}</h4>
                        <ul className="space-y-3 text-sm">
                            {hasRoute("blog", locale) && (
                                <li><Link href={href(ROUTES.blog)} className="hover:text-[#D97706] transition-colors">{t.allEssays}</Link></li>
                            )}
                            {hasRoute("bookClub", locale) && (
                                <li><Link href={href(ROUTES.bookClub)} className="hover:text-[#D97706] transition-colors">{t.bookClub}</Link></li>
                            )}
                            {hasRoute("lab", locale) && (
                                <li><Link href={href(ROUTES.lab)} className="hover:text-[#D97706] transition-colors">{t.lab}</Link></li>
                            )}
                            {hasRoute("labPerks", locale) && (
                                <li><Link href={href(ROUTES.labPerks)} className="hover:text-[#D97706] transition-colors">{t.labPerks}</Link></li>
                            )}
                            <li><Link href={href(ROUTES.work)} className="hover:text-[#D97706] transition-colors">{t.work}</Link></li>
                            {hasRoute("resume", locale) && (
                                <li><Link href={href(ROUTES.resume)} className="hover:text-[#D97706] transition-colors">{t.resume}</Link></li>
                            )}
                            <li><Link href={href(ROUTES.about)} className="hover:text-[#D97706] transition-colors font-medium text-white">{t.startHere}</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.colPractice}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href={href(ROUTES.services)} className="hover:text-[#D97706] transition-colors">{t.advisory}</Link></li>
                            <li><Link href={href(ROUTES.portfolio)} className="hover:text-[#D97706] transition-colors">{t.portfolio}</Link></li>
                            <li><Link href={href(ROUTES.startups)} className="hover:text-[#D97706] transition-colors">{t.startups}</Link></li>
                            <li><Link href={href(ROUTES.stats)} className="hover:text-[#D97706] transition-colors">{t.stats}</Link></li>
                            <li><Link href={href(ROUTES.about)} className="hover:text-[#D97706] transition-colors">{t.aboutFarjad}</Link></li>
                            <li><Link href={href(ROUTES.contact)} className="hover:text-[#D97706] transition-colors">{t.contact}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.colResources}</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href={href(ROUTES.tools)} className="hover:text-[#D97706] transition-colors">{t.tools}</Link></li>
                            <li><Link href={href(ROUTES.booking)} className="hover:text-[#D97706] transition-colors">{t.booking}</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Socials */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.colConnect}</h4>
                        <div className="flex flex-wrap gap-4">
                            <a href="https://t.me/Heros_Journey" target="_blank" title="Hero's Journey" className="p-2 bg-white/5 rounded-full hover:bg-[#D97706] hover:text-white transition-all">
                                <Send className="w-5 h-5" />
                            </a>
                            <a href="https://t.me/FarjadTalks" target="_blank" title="Farjad Talks" className="p-2 bg-white/5 rounded-full hover:bg-[#D97706] hover:text-white transition-all">
                                <Send className="w-5 h-5" />
                            </a>
                            <a href="https://instagram.com/FarjadTalks" target="_blank" title="Instagram" className="p-2 bg-white/5 rounded-full hover:bg-[#D97706] hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://youtube.com/@FarjadTalks" target="_blank" title="YouTube" className="p-2 bg-white/5 rounded-full hover:bg-[#D97706] hover:text-white transition-all">
                                <Youtube className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com/in/farjadpourmohammad/" target="_blank" title="LinkedIn" className="p-2 bg-white/5 rounded-full hover:bg-[#D97706] hover:text-white transition-all">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM SECTION: Colophon --- */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-stone-500 font-mono">

                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center mb-4 md:mb-0">
                        <span>© {new Date().getFullYear()} Farjad Pourmohammad</span>
                        <div className="hidden md:block w-1 h-1 bg-stone-700 rounded-full" />
                        <Link href={href(ROUTES.privacy)} className="hover:text-stone-300">{t.privacy}</Link>
                        <Link href={href(ROUTES.terms)} className="hover:text-stone-300">{t.terms}</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-[#1B4B43]" />
                            <span>{t.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-[#1B4B43]" />
                            <span dir="ltr">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' })} EST</span>
                        </div>

                        <div className="flex items-center gap-4 border-s border-white/10 ps-6 ms-2" dir="ltr">
                            <a href="/" className={`flex items-center gap-2 text-xs font-bold font-sans ${locale === 'en' ? 'text-white' : 'text-stone-500 hover:text-white transition-colors'}`}>
                                <img src="/images/canada-flag.svg" alt="English" className={`w-5 h-5 rounded-sm ${locale === 'en' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`} /> EN
                            </a>
                            <a href="/fa" className={`flex items-center gap-2 text-xs font-bold font-serif ${locale === 'fa' ? 'text-white' : 'text-stone-500 hover:text-white transition-colors'}`}>
                                <img src="/images/lion-sun.svg" alt="Persian" className={`w-5 h-5 rounded-sm ${locale === 'fa' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`} /> فا
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    )
}
