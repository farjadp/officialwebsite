import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentored Startups",
    description: "A portfolio of the 25+ startups I have mentored, advised, and helped scale.",
};
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExternalLink, Linkedin, Globe, Star, Users, ArrowRight, TrendingUp, Calendar, CheckCircle2, CircleDashed } from "lucide-react"

// --- DATA: EXTRACTED FROM SCREENSHOTS ---
// The user has mentored numerous startups. Below are the names extracted from the provided list,
// alongside rich placeholder data to demonstrate the layout.
const MENTORED_STARTUPS = [
    "Imedica", "HubWeld", "SingularMind", "DocLast", "24 Care",
    "Heal Genix", "FlyChemix", "NorthRoad", "iRIS", "Distant",
    "Fekrooneh", "ZipKip", "ArtoKids", "Ganjeh", "Alfando",
    "Mirana", "Nazh", "REJ", "Prowl", "StruSmart",
    "HoloDesign", "Smart diet", "VoiceMed", "CRM 24", "Balou"
].map((name, index) => {
    // Generate deterministic but varied placeholder data based on index
    const industries = ["HealthTech", "SaaS", "FinTech", "EdTech", "AI/ML", "E-Commerce", "Logistics", "IoT"];
    const industry = industries[index % industries.length];

    const levels = ["98%", "99%", "100%", "95%", "97%"];
    const satisfaction = levels[index % levels.length];

    // Alternating founder photos for variety
    const founderImages = [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    ];

    const companyLogos = [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=150&h=150&fit=crop"
    ];

    // Status logic
    const statuses = ["Active Advisory", "Completed", "Successfully Exited"];
    const status = statuses[index % statuses.length];
    const isActive = status === "Active Advisory";

    // Date logic (Randomized placeholders)
    const startYear = 2018 + (index % 5);
    const startMonth = ["Jan", "Mar", "Jun", "Sep", "Nov"][index % 5];
    const startDate = `${startMonth} ${startYear}`;
    const endDate = isActive ? "Present" : `Dec ${startYear + 2}`;

    return {
        name,
        industry,
        satisfaction,
        status,
        isActive,
        startDate,
        endDate,
        website: `https://${name.toLowerCase().replace(/\s+/g, '')}.example.com`,
        linkedin: `https://linkedin.com/company/${name.toLowerCase().replace(/\s+/g, '')}`,
        logo: companyLogos[index % companyLogos.length],
        description: `A disruptive ${industry} startup focused on scalable solutions and rapid market entry. Guided from initial seed to strong product-market fit.`,
        founder: {
            name: `Founder of ${name}`,
            photo: founderImages[index % founderImages.length]
        }
    }
});

export default function MentoredStartupsPage() {
    return (
        // ROOT: Warm Paper Background
        <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white pb-24 overflow-x-hidden">

            {/* Background Texture */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <main className="relative z-10 px-6 md:px-12 max-w-7xl mx-auto py-16 md:py-24">

                {/* --- HEADER --- */}
                <section className="text-center mb-20 max-w-4xl mx-auto">
                    <Badge variant="outline" className="mb-6 border-[#1B4B43]/30 text-[#1B4B43] rounded-full font-mono tracking-widest text-[10px] uppercase px-3 py-1 bg-[#1B4B43]/5">
                        Mentorship & Advisory
                    </Badge>
                    <h1 className="font-serif text-5xl md:text-7xl text-[#111827] leading-[1.1] mb-6 tracking-tight">
                        The Startup <br className="hidden md:block" />
                        <span className="italic text-stone-500 font-light">Portfolio.</span>
                    </h1>
                    <p className="text-xl text-stone-600 font-light leading-relaxed">
                        A curated list of ambitious ventures I’ve had the privilege of advising, mentoring, and helping scale across diverse industries.
                    </p>
                </section>

                {/* --- STATS SECTION (Fun & Quantitative) --- */}
                <section className="mb-20">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {/* Stat 1 */}
                        <div className="bg-[#111827] text-white p-8 rounded-sm flex flex-col items-center justify-center text-center shadow-lg group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#1B4B43] rounded-full blur-[40px] opacity-30 group-hover:opacity-50 transition-opacity" />
                            <span className="font-serif text-5xl md:text-6xl font-bold text-[#D97706] mb-2 relative z-10">25</span>
                            <span className="text-xs uppercase tracking-widest text-stone-300 font-mono relative z-10">Total Ventures</span>
                            <span className="text-[10px] text-stone-400 mt-3 font-light relative z-10">Mentored & Advised</span>
                        </div>

                        {/* Stat 2 */}
                        <div className="border border-stone-200 bg-white p-8 rounded-sm flex flex-col items-center justify-center text-center group transition-colors hover:border-[#1B4B43]/30">
                            <span className="font-serif text-5xl md:text-6xl font-bold text-[#111827] mb-2 group-hover:text-[#1B4B43] transition-colors">7</span>
                            <span className="text-xs uppercase tracking-widest text-stone-500 font-mono">Yrs Longest Eng.</span>
                            <span className="text-[10px] text-stone-400 mt-3 font-light italic px-2">"We basically grew up together."</span>
                        </div>

                        {/* Stat 3 */}
                        <div className="border border-stone-200 bg-white p-8 rounded-sm flex flex-col items-center justify-center text-center group transition-colors hover:border-[#1B4B43]/30">
                            <span className="font-serif text-5xl md:text-6xl font-bold text-[#111827] mb-2 group-hover:text-[#1B4B43] transition-colors">86<span className="text-3xl">%</span></span>
                            <span className="text-xs uppercase tracking-widest text-stone-500 font-mono">Survival Rate</span>
                            <span className="text-[10px] text-[#D97706] mt-3 font-bold uppercase tracking-wide bg-[#D97706]/10 px-2 py-1 rounded-sm">14% Pivoted Hard</span>
                        </div>

                        {/* Stat 4 */}
                        <div className="border border-stone-200 bg-white p-8 rounded-sm flex flex-col items-center justify-center text-center group transition-colors hover:border-[#1B4B43]/30">
                            <span className="font-serif text-5xl md:text-6xl font-bold text-[#111827] mb-2 group-hover:text-[#1B4B43] transition-colors">4k<span className="text-3xl">+</span></span>
                            <span className="text-xs uppercase tracking-widest text-stone-500 font-mono">Late Night Calls</span>
                            <span className="text-[10px] text-stone-400 mt-3 font-light italic px-2">Plus an infinite amount of coffee.</span>
                        </div>
                    </div>
                </section>

                {/* --- PORTFOLIO GRID --- */}
                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MENTORED_STARTUPS.map((startup, idx) => (
                        <div key={idx} className="bg-white border border-stone-200 rounded-sm overflow-hidden hover:border-[#1B4B43]/40 hover:shadow-[8px_8px_0px_0px_rgba(27,75,67,0.1)] transition-all duration-300 group flex flex-col">

                            {/* Card Header (Logo & Basic Info) */}
                            <div className="p-6 border-b border-stone-100 flex items-start gap-4 bg-stone-50/50">
                                <div className="w-16 h-16 rounded-sm border border-stone-200 overflow-hidden shrink-0 bg-white">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={startup.logo} alt={`${startup.name} Logo`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-serif text-xl font-bold text-[#111827] truncate pr-2 group-hover:text-[#1B4B43] transition-colors">{startup.name}</h3>
                                        <div className="flex items-center gap-1 text-[#D97706] bg-[#D97706]/10 px-2 py-0.5 rounded-sm shrink-0">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-[10px] font-bold">{startup.satisfaction}</span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-[10px] bg-stone-100 text-stone-500 border-none uppercase tracking-wider font-mono">
                                        {startup.industry}
                                    </Badge>
                                </div>
                            </div>

                            {/* Card Body (Description & Founder) */}
                            <div className="p-6 flex-1 flex flex-col">
                                <p className="text-sm text-stone-600 font-light leading-relaxed mb-6">
                                    "{startup.description}"
                                </p>

                                {/* Metadata Grid (Dates, Status, Satisfaction) */}
                                <div className="grid grid-cols-2 gap-4 mb-8 bg-[#FDFCF8] p-4 rounded-sm border border-stone-100 flex-1">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Timeline</p>
                                        <p className="text-xs font-mono text-[#111827]">{startup.startDate} — {startup.endDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 flex items-center gap-1">
                                            {startup.isActive ? <CircleDashed className="w-3 h-3 animate-spin duration-[3000ms]" /> : <CheckCircle2 className="w-3 h-3" />}
                                            Status
                                        </p>
                                        <p className="text-xs font-medium text-[#111827]">{startup.status}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 mt-auto">

                                    {/* Founder Profile */}
                                    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-sm border border-stone-100">
                                        <div className="w-10 h-10 rounded-full border border-stone-200 overflow-hidden bg-white shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={startup.founder.photo} alt={startup.founder.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">Founder</p>
                                            <p className="text-xs font-medium text-[#111827] truncate">{startup.founder.name}</p>
                                        </div>
                                    </div>

                                    {/* Links Row */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                                        <Link href={startup.website} target="_blank" className="flex-1 flex items-center justify-center gap-2 p-2 text-xs font-semibold text-stone-600 hover:text-[#1B4B43] hover:bg-[#1B4B43]/5 rounded-sm transition-colors border border-transparent hover:border-[#1B4B43]/20">
                                            <Globe className="w-4 h-4" /> Website
                                        </Link>
                                        <div className="w-px h-6 bg-stone-200"></div>
                                        <Link href={startup.linkedin} target="_blank" className="flex-1 flex items-center justify-center gap-2 p-2 text-xs font-semibold text-stone-600 hover:text-[#0077B5] hover:bg-[#0077B5]/5 rounded-sm transition-colors border border-transparent hover:border-[#0077B5]/20">
                                            <Linkedin className="w-4 h-4" /> LinkedIn
                                        </Link>
                                    </div>

                                </div>
                            </div>

                        </div>
                    ))}
                </section>

                {/* --- CTA FOOTER --- */}
                <section className="mt-24 text-center max-w-4xl mx-auto border-t border-stone-200 pt-16">
                    <h2 className="font-serif text-3xl md:text-4xl text-[#111827] mb-6">
                        Join the Portfolio.
                    </h2>
                    <p className="text-lg text-stone-600 font-light mb-8 max-w-2xl mx-auto">
                        If you’re building something meaningful and need experienced guidance, let's explore how we can architect your success together.
                    </p>
                    <Link href="/contact">
                        <Button className="bg-[#1B4B43] hover:bg-[#133832] text-white h-12 px-8 text-base font-medium transition-all">
                            Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </section>

            </main>
        </div>
    )
}
