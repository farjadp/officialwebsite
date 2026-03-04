// ============================================================================
// File Path: src/app/stats/page.tsx
// Version: 3.0.0 — The "Complete Dashboard"
// Style: Data Journalism / Dense & Rich.
// New Features: The Filter (Funnel), Intellectual Output, Failure Rate, Time Zones.
// ============================================================================

import React from 'react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ArrowRight, 
  BarChart3, 
  Coffee, 
  Activity, 
  TrendingUp, 
  Users, 
  Video, 
  DollarSign, 
  Swords, 
  HeartHandshake,
  AlertCircle,
  Filter,
  Clock,
  Globe,
  PenTool,
  Layers,
  AlertTriangle
} from "lucide-react"

export default function StatisticsPage() {
    return (
        // ROOT: Warm Paper Background
        <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white pb-24 overflow-x-hidden">

            {/* Background Texture (Dot Grid) */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.4]" 
                style={{ backgroundImage: 'radial-gradient(#E7E5E4 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>
            {/* Noise Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <main className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto py-16 md:py-24">

                {/* --- 1. HEADER: THE MANIFESTO --- */}
                <section className="mb-24 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border-b border-[#1B4B43] text-[#1B4B43] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                        The Unfiltered Log
                    </div>
                    <h1 className="font-serif text-5xl md:text-8xl text-[#111827] leading-[0.9] mb-8 tracking-tighter">
                        7 Years in <br/>
                        the <span className="italic text-stone-400 font-light">Trenches.</span>
                    </h1>
                    <div className="flex flex-col md:flex-row gap-8 items-start border-t border-stone-200 pt-8">
                        <p className="text-xl text-stone-600 font-light leading-relaxed max-w-xl">
                            Startups are not built on Instagram. They are built on caffeine, uncomfortable truths, and thousands of hours of unglamorous work. Here is the receipt.
                        </p>
                        <div className="flex gap-4 text-xs font-mono uppercase tracking-widest text-stone-400">
                             <div>
                                <span className="block text-[#1B4B43] font-bold">Data Source</span>
                                <span>Internal Logs</span>
                             </div>
                             <div>
                                <span className="block text-[#1B4B43] font-bold">Last Update</span>
                                <span>March 2026</span>
                             </div>
                        </div>
                    </div>
                </section>

                {/* --- 2. BENTO GRID (DATA VIZ) --- */}
                <section className="grid md:grid-cols-12 gap-6 mb-16 auto-rows-[minmax(200px,auto)]">

                    {/* --- ROW 1: MONEY --- */}

                    {/* ITEM: CAPITAL RAISED (Hero Card) */}
                    <div className="md:col-span-8 bg-[#1B4B43] text-white p-10 relative overflow-hidden group rounded-sm shadow-xl shadow-[#1B4B43]/10">
                        <div className="absolute bottom-0 right-0 w-full h-32 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg viewBox="0 0 100 20" className="w-full h-full fill-current">
                                <path d="M0 20 L0 15 Q10 10 20 18 T40 10 T60 14 T80 5 L100 0 V20 Z" />
                            </svg>
                        </div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <Badge className="bg-white/10 hover:bg-white/20 text-white border-none uppercase tracking-widest text-[10px]">Ecosystem Impact</Badge>
                                <DollarSign className="w-6 h-6 opacity-50" />
                            </div>
                            <div className="mt-8">
                                <h2 className="text-6xl md:text-8xl font-serif font-black tracking-tighter mb-2">
                                    $3M<span className="text-[#F2B95E] text-5xl">+</span>
                                </h2>
                                <p className="text-stone-300 font-light text-lg max-w-md leading-relaxed border-l border-white/20 pl-4 mt-4">
                                    Capital raised by teams I have mentored or advised. Real runway for real companies.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ITEM: PERSONAL SKIN IN THE GAME */}
                    <div className="md:col-span-4 bg-[#F5F5F4] p-10 relative group rounded-sm border border-stone-200 hover:border-[#1B4B43] transition-colors">
                        <div className="absolute top-4 right-4 text-stone-300 group-hover:text-[#1B4B43] transition-colors">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="h-full flex flex-col justify-between">
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Self-Funded (Iran)</span>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#111827] mb-2">~$70k</h3>
                                <p className="text-xs text-stone-500 font-mono mt-2 leading-relaxed">
                                    Bootstrapped from zero in a sanctioned economy. Money I personally risked and invested.
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* --- ROW 2: SELECTIVITY & SCOPE (NEW) --- */}

                    {/* ITEM: THE FILTER (FUNNEL) */}
                    <div className="md:col-span-6 bg-white border border-stone-200 p-8 rounded-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-8">
                            <Filter className="w-5 h-5 text-[#1B4B43]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Selection Criteria (The Funnel)</span>
                        </div>
                        
                        <div className="space-y-6 max-w-md mx-auto">
                            {/* Stage 1 */}
                            <div className="relative">
                                <div className="flex justify-between text-xs font-mono text-stone-500 mb-1">
                                    <span>Applications Reviewed</span>
                                    <span>500+</span>
                                </div>
                                <div className="w-full h-8 bg-stone-100 rounded-sm flex items-center px-3 text-[10px] text-stone-400">100% Volume</div>
                            </div>

                            {/* Stage 2 */}
                            <div className="relative px-8">
                                <div className="flex justify-between text-xs font-mono text-stone-500 mb-1">
                                    <span>First Interviews</span>
                                    <span>~50</span>
                                </div>
                                <div className="w-full h-8 bg-stone-200 rounded-sm flex items-center px-3 text-[10px] text-stone-500">10% Qualified</div>
                                {/* Funnel Lines */}
                                <div className="absolute top-[-24px] left-0 w-px h-6 bg-stone-200 -z-10 transform skew-x-[30deg] origin-bottom"></div>
                                <div className="absolute top-[-24px] right-0 w-px h-6 bg-stone-200 -z-10 transform -skew-x-[30deg] origin-bottom"></div>
                            </div>

                            {/* Stage 3 */}
                            <div className="relative px-16">
                                <div className="flex justify-between text-sm font-bold text-[#1B4B43] mb-1">
                                    <span>Active Mentees</span>
                                    <span>5</span>
                                </div>
                                <div className="w-full h-10 bg-[#1B4B43] rounded-sm flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-[#1B4B43]/20">
                                    1% Selected
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-stone-400 mt-6 italic text-center border-t border-stone-100 pt-4">
                            "I say no to 99% so I can give 100% to the few."
                        </p>
                    </div>

                    {/* ITEM: SECTOR DIVERSITY (NEW) */}
                    <div className="md:col-span-6 bg-white border border-stone-200 p-8 rounded-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-8">
                            <Layers className="w-5 h-5 text-[#1B4B43]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Sector Experience</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 h-full pb-6">
                            <div className="p-4 bg-stone-50 rounded-sm flex flex-col justify-center">
                                <span className="text-2xl font-serif font-bold text-[#111827]">40%</span>
                                <span className="text-xs uppercase tracking-wider text-stone-500 mt-1">SaaS & B2B</span>
                            </div>
                            <div className="p-4 bg-stone-50 rounded-sm flex flex-col justify-center">
                                <span className="text-2xl font-serif font-bold text-[#111827]">30%</span>
                                <span className="text-xs uppercase tracking-wider text-stone-500 mt-1">AI & Data</span>
                            </div>
                            <div className="p-4 bg-stone-50 rounded-sm flex flex-col justify-center">
                                <span className="text-2xl font-serif font-bold text-[#111827]">20%</span>
                                <span className="text-xs uppercase tracking-wider text-stone-500 mt-1">Health & Bio</span>
                            </div>
                            <div className="p-4 bg-[#1B4B43]/10 border border-[#1B4B43]/20 rounded-sm flex flex-col justify-center">
                                <span className="text-2xl font-serif font-bold text-[#1B4B43]">10%</span>
                                <span className="text-xs uppercase tracking-wider text-[#1B4B43] mt-1">Deep Tech</span>
                            </div>
                        </div>
                    </div>


                    {/* --- ROW 3: TIME & EFFORT --- */}

                    {/* ITEM: TIME ZONE BRIDGE (NEW) */}
                    <div className="md:col-span-12 bg-[#111827] text-white p-8 rounded-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                         {/* Background Gradient */}
                         <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#1B4B43] to-[#0F172A] opacity-20" />
                         
                         <div className="relative z-10 flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-full">
                                <Globe className="w-6 h-6 text-stone-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold">The Time Zone Bridge</h3>
                                <p className="text-sm text-stone-400">Working while the world sleeps.</p>
                            </div>
                         </div>

                         {/* Timeline Visual */}
                         <div className="relative z-10 flex-1 w-full max-w-2xl px-4">
                             <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-2">
                                <span>Toronto (EST)</span>
                                <span>Tehran/Dubai (+3.5/4)</span>
                             </div>
                             <div className="h-4 w-full bg-stone-800 rounded-full overflow-hidden flex relative">
                                 {/* Night */}
                                 <div className="h-full w-1/3 bg-[#0F172A]"></div>
                                 {/* The Grind (Overlap) */}
                                 <div className="h-full w-1/3 bg-[#D97706] animate-pulse relative group cursor-help">
                                     <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded whitespace-nowrap">4 AM Calls</div>
                                 </div>
                                 {/* Day */}
                                 <div className="h-full w-1/3 bg-stone-600"></div>
                             </div>
                         </div>

                         <div className="relative z-10 text-right">
                             <span className="block text-2xl font-bold text-white">4,000+</span>
                             <span className="text-xs text-stone-500 uppercase">Hours of Overlap</span>
                         </div>
                    </div>

                    {/* ITEM: MEETINGS (Existing) */}
                    <div className="md:col-span-8 bg-white border border-stone-200 p-10 rounded-sm hover:shadow-lg transition-all duration-500 group">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h3 className="text-5xl font-serif font-bold text-[#111827]">3,000+</h3>
                                <p className="text-sm text-stone-500 font-mono mt-2 uppercase tracking-wider">Online Meetings (4 Years)</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-2 justify-end text-[#1B4B43] font-bold">
                                    <Video className="w-4 h-4" /> 90%
                                </div>
                                <span className="text-[10px] text-stone-400 uppercase">Google Meet</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-20 gap-1 h-16 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                            {Array.from({ length: 80 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`rounded-[1px] ${Math.random() > 0.3 ? 'bg-[#1B4B43]' : 'bg-stone-100'}`}
                                    style={{ opacity: Math.random() * 0.8 + 0.2 }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ITEM: INTELLECTUAL OUTPUT (NEW) */}
                    <div className="md:col-span-4 bg-white border border-stone-200 p-8 rounded-sm flex flex-col justify-center">
                         <div className="flex items-center gap-2 mb-6 text-stone-400">
                             <PenTool className="w-5 h-5" />
                             <span className="text-xs font-bold uppercase tracking-widest">Output</span>
                         </div>
                         <div className="space-y-6">
                             <div>
                                 <span className="text-3xl font-serif font-bold text-[#111827] block">150k+</span>
                                 <span className="text-xs text-stone-500">Words Written (Essays)</span>
                             </div>
                             <div>
                                 <span className="text-3xl font-serif font-bold text-[#111827] block">50+</span>
                                 <span className="text-xs text-stone-500">Mental Models Documented</span>
                             </div>
                         </div>
                    </div>


                    {/* --- ROW 4: REALITY CHECK --- */}

                    {/* ITEM: THE FAILURE RATE (NEW) */}
                    <div className="md:col-span-6 bg-stone-100 p-8 rounded-sm border border-stone-200 flex flex-col justify-center relative overflow-hidden">
                        <AlertTriangle className="absolute -bottom-4 -right-4 w-24 h-24 text-stone-200" />
                        
                        <div className="relative z-10">
                            <h3 className="font-bold text-[#111827] text-lg mb-2">The Failure Rate</h3>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-serif font-black text-stone-400">~10%</span>
                                <span className="text-xs text-stone-500 mb-2 font-mono">Project Mortality</span>
                            </div>
                            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-4">
                                <div className="w-[10%] h-full bg-stone-400" />
                            </div>
                            <p className="text-xs text-stone-500 italic">
                                "Not every venture survives. I don't hide the graveyard; I teach from it."
                            </p>
                        </div>
                    </div>

                    {/* ITEM: CONFLICT (Existing) */}
                    <div className="md:col-span-6 bg-white border border-stone-200 p-8 rounded-sm flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-6">
                            <Swords className="w-5 h-5 text-red-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Hard Truths</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-stone-600 font-medium">Arguments with Founders</span>
                            <span className="text-2xl font-serif font-bold text-[#111827]">12+</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-stone-600 font-medium">Pivots Forced</span>
                            <span className="text-2xl font-serif font-bold text-[#111827]">8</span>
                        </div>
                        <p className="text-[10px] text-stone-400 mt-6 pt-4 border-t border-stone-100">
                            *Arguments usually result in saving months of wasted dev time.
                        </p>
                    </div>

{/* ITEM: COFFEE VS TEA (VISUALIZED) */}
                    <div className="md:col-span-12 bg-[#FFF8F0] border border-[#D97706]/20 p-10 rounded-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                        
                        {/* Background Decor */}
                        <Coffee className="absolute -bottom-10 -right-10 w-64 h-64 text-[#D97706] opacity-5 rotate-12 pointer-events-none transition-transform group-hover:rotate-6" />

                        {/* Left: The Ratio */}
                        <div className="flex items-center gap-6 relative z-10">
                             <div className="p-4 bg-[#D97706] text-white rounded-full shadow-lg shadow-[#D97706]/20">
                                <Coffee className="w-8 h-8" strokeWidth={2.5} />
                             </div>
                             <div>
                                <h3 className="text-4xl md:text-5xl font-serif font-black text-[#92400E] leading-none">5 : 1</h3>
                                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#92400E]/60 mt-2">Daily Coffee vs Tea</p>
                             </div>
                        </div>
                        
                        {/* Center: The Visual Icons */}
                        <div className="flex-1 hidden md:flex items-center justify-center gap-8 relative z-10">
                             {/* 5 Coffees */}
                             <div className="flex gap-3" title="5 Cups of Coffee">
                                {[...Array(5)].map((_, i) => (
                                    <Coffee 
                                        key={`coffee-${i}`} 
                                        className="w-7 h-7 text-[#92400E] fill-[#92400E]/10 drop-shadow-sm" 
                                        strokeWidth={2}
                                    />
                                ))}
                             </div>
                             
                             {/* Separator */}
                             <div className="h-8 w-px bg-[#D97706]/30 rotate-12"></div>
                             
                             {/* 1 Tea (Green) */}
                             <div className="flex flex-col items-center gap-1 group/tea cursor-help">
                                <Coffee className="w-7 h-7 text-[#1B4B43] fill-[#1B4B43]/10 drop-shadow-sm" strokeWidth={2} />
                                <span className="text-[9px] font-bold uppercase text-[#1B4B43] opacity-0 group-hover/tea:opacity-100 transition-opacity absolute -bottom-4">Tea</span>
                             </div>
                        </div>

                        {/* Right: The Quote */}
                        <div className="text-center md:text-right max-w-xs relative z-10">
                             <p className="text-sm text-[#92400E] font-medium leading-relaxed italic">
                                 "The engine runs on espresso.<br/>The strategy runs on patience."
                             </p>
                        </div>
                    </div>

                </section>

                {/* --- 3. FOOTER CTA --- */}
                <section className="text-center pt-16 border-t border-stone-200">
                    <p className="font-serif text-2xl text-[#111827] mb-8">
                        Numbers don't lie. Neither do I.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-[#1C1917] hover:bg-[#000000] text-white h-14 px-10 text-base font-bold rounded-sm shadow-xl">
                            Let's Talk Business <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </section>

            </main>
        </div>
    )
}