// ============================================================================
// Hardware Source: not-found.tsx
// Version: 1.0.0
// Why: Custom 404 page
// Env / Identity: React Server Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
    ArrowLeft,
    Map,
    Compass,
    Search,
    BookOpen,
    CalendarDays
} from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white">

            {/* Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <Header />

            <main className="flex-1 w-full relative z-10 flex flex-col items-center justify-center py-20 px-6">

                <div className="max-w-3xl w-full text-center space-y-8 relative">

                    {/* Abstract Floating Emojis Background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 blur-sm">
                        <span className="text-8xl absolute -top-10 -left-10 transform -rotate-12">🏜️</span>
                        <span className="text-8xl absolute top-20 -right-12 transform rotate-12">🛸</span>
                        <span className="text-7xl absolute -bottom-10 left-20 transform -rotate-12">🕵️‍♂️</span>
                    </div>

                    <div className="relative z-10">
                        <Badge className="mb-8 bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 border border-[#D97706]/20 uppercase tracking-widest px-4 py-1.5 rounded-sm text-xs font-mono">
                            Error 404
                        </Badge>

                        <h1 className="font-serif text-7xl md:text-9xl font-bold text-[#111827] leading-none mb-4">
                            Lost? <span className="opacity-50">👀</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-stone-600 font-light max-w-xl mx-auto leading-relaxed mb-12">
                            It seems you've wandered off the map. This page doesn't exist, or it was moved to the archives.
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">

                            {/* Option 1: Home */}
                            <Link href="/" className="group bg-white border border-stone-200 p-6 rounded-sm hover:border-[#1B4B43] hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 bg-[#1B4B43]/10 text-[#1B4B43] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Compass className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-[#111827] mb-2 font-serif text-lg">Return Home</h3>
                                <p className="text-sm text-stone-500 mb-4">Go back to the main starting point.</p>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#1B4B43] flex items-center gap-1 group-hover:underline">
                                    Take me there <ArrowLeft className="w-3 h-3 rotate-180" />
                                </span>
                            </Link>

                            {/* Option 2: Essays */}
                            <Link href="/series" className="group bg-white border border-stone-200 p-6 rounded-sm hover:border-[#D97706] hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 bg-[#D97706]/10 text-[#D97706] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-[#111827] mb-2 font-serif text-lg">The Library</h3>
                                <p className="text-sm text-stone-500 mb-4">Read the latest thoughts and frameworks.</p>
                                <span className="text-xs font-bold uppercase tracking-widest text-[#D97706] flex items-center gap-1 group-hover:underline">
                                    Read essays <ArrowLeft className="w-3 h-3 rotate-180" />
                                </span>
                            </Link>

                            {/* Option 3: Booking */}
                            <Link href="/booking" className="group sm:col-span-2 lg:col-span-1 bg-[#1B4B43] text-white border border-[#1B4B43] p-6 rounded-sm hover:bg-[#153e37] hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                                <div className="absolute right-[-20%] bottom-[-20%] text-7xl opacity-10">🗓️</div>
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <CalendarDays className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold mb-2 font-serif text-lg">Strategy Session</h3>
                                    <p className="text-sm text-white/80 mb-4">Looking to talk? Book a direct session.</p>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#F2B95E] flex items-center gap-1 group-hover:underline">
                                        Secure slot <ArrowLeft className="w-3 h-3 rotate-180" />
                                    </span>
                                </div>
                            </Link>

                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
