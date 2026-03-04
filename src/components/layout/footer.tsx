// ============================================================================
// File Path: src/components/layout/footer.tsx
// Version: 2.0.0 — The "Editorial" Footer
// Style: Dark Mode "Book Cover" style.
// Why: Creates a strong visual anchor at the bottom. 
//      Prioritizes the Newsletter (The Inner Circle).
// ============================================================================

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    ArrowRight,
    Send,
    Instagram,
    Youtube,
    Linkedin,
    MapPin,
    Clock
} from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#111827] text-stone-300 font-sans border-t border-[#1B4B43] relative overflow-hidden">

            {/* Abstract Background Element (Subtle) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B4B43] rounded-full blur-[150px] opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-12 relative z-10">

                {/* --- TOP SECTION: Newsletter & Brand --- */}
                <div className="grid lg:grid-cols-2 gap-16 mb-20">

                    {/* Brand Manifesto */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="font-serif font-black text-3xl tracking-tighter text-white">
                                FARJAD<span className="text-[#D97706]">.</span>
                            </span>
                        </Link>
                        <p className="text-lg text-stone-400 leading-relaxed max-w-md font-light">
                            A personal library for founders and immigrants who are tired of the noise.
                            We focus on clarity, systems, and the engineering of a real business.
                        </p>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1B4B43]">
                                <span className="w-2 h-2 bg-[#1B4B43] rounded-full animate-pulse" />
                                Available for Advisory
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Box */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-sm backdrop-blur-sm">
                        <h3 className="font-serif text-2xl text-white mb-2">Join the Inner Circle</h3>
                        <p className="text-sm text-stone-400 mb-6">
                            One email a week. Mental models, essays, and honest notes. No spam.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3">
                            <Input
                                placeholder="founder@email.com"
                                className="bg-white/10 border-white/10 text-white placeholder:text-stone-500 focus-visible:ring-[#1B4B43] h-12"
                            />
                            <Button className="bg-[#1B4B43] hover:bg-[#133832] text-white h-12 px-6 font-bold uppercase tracking-wider text-xs">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                <Separator className="bg-white/10 mb-16" />

                {/* --- MIDDLE SECTION: The Index (Links) --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20">

                    {/* Column 1 */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">The Library</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/essays" className="hover:text-[#D97706] transition-colors">All Essays</Link></li>
                            <li><Link href="/series" className="hover:text-[#D97706] transition-colors">Curated Series</Link></li>
                            <li><Link href="/topics/mental-models" className="hover:text-[#D97706] transition-colors">Mental Models</Link></li>
                            <li><Link href="/start-here" className="hover:text-[#D97706] transition-colors font-medium text-white">Start Here</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">The Practice</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/services" className="hover:text-[#D97706] transition-colors">Advisory Services</Link></li>
                            <li><Link href="/portfolio" className="hover:text-[#D97706] transition-colors">Business Ventures</Link></li>
                            <li><Link href="/startups" className="hover:text-[#D97706] transition-colors">Mentored Startups</Link></li>
                            <li><Link href="/stats" className="hover:text-[#D97706] transition-colors">Stats & Reality</Link></li>
                            <li><Link href="/about" className="hover:text-[#D97706] transition-colors">About Farjad</Link></li>
                            <li><Link href="/contact" className="hover:text-[#D97706] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/tools" className="hover:text-[#D97706] transition-colors">Founder Tools</Link></li>
                            <li><Link href="/reading-list" className="hover:text-[#D97706] transition-colors">Bookshelf</Link></li>
                            <li><Link href="/newsletter" className="hover:text-[#D97706] transition-colors">Newsletter Archive</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Socials */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">Connect</h4>
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
                        <span>© {new Date().getFullYear()} Farjad Inc.</span>
                        <div className="hidden md:block w-1 h-1 bg-stone-700 rounded-full" />
                        <Link href="/privacy" className="hover:text-stone-300">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-stone-300">Terms of Service</Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-[#1B4B43]" />
                            <span>Toronto, Canada</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-[#1B4B43]" />
                            <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' })} EST</span>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    )
}