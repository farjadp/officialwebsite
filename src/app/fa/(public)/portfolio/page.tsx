"use client";

// ============================================================================
// Hardware Source: page.tsx
// Version: 2.0.0 — 2026-02-24
// Why: Main entry page for the route - Redesigned
// Env / Identity: Client Component
// ============================================================================

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Github, ExternalLink, Activity, Target, Layers, Briefcase, Zap, BookOpen, Lock, Globe, Star, GitFork, Terminal } from "lucide-react";
import {
    CATEGORIES,
    PortfolioCategory,
    PORTFOLIO_ITEMS,
    FOUNDER_JOURNEY
} from "./data";
import { cn } from "@/lib/utils";

const CategoryIcon = ({ category, className }: { category: PortfolioCategory, className?: string }) => {
    switch (category) {
        case "My Startups": return <Activity className={className} />;
        case "Companies & Ventures": return <Briefcase className={className} />;
        case "GitHub Projects": return <Terminal className={className} />;
        default: return <Briefcase className={className} />;
    }
}

export default function PortfolioPageV3() {
    const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("My Startups");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const filterItems = (category: PortfolioCategory) => {
        return PORTFOLIO_ITEMS.filter((item) => item.category === category);
    };

    return (
        <div className="min-h-screen bg-[#0C0A09] text-stone-300 font-sans selection:bg-[#D97706] selection:text-white pb-32 overflow-x-hidden">

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1B4B43] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D97706] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>

                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDhoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBWMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-50"></div>
            </div>

            <div className="relative z-10">
                {/* --- 1. Hero Section --- */}
                <section className="pt-32 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-800 bg-stone-900/50 text-stone-400 text-xs font-mono uppercase tracking-widest mb-8">
                            <Zap className="w-3 h-3 text-[#D97706]" /> Systems & Outcomes
                        </div>
                        <h1 className="font-serif text-5xl md:text-8xl leading-[1.05] text-white mb-8 tracking-tight">
                            Selected Works & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-400 to-stone-600 font-light italic">Honest Execution</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-stone-400 font-light leading-relaxed max-w-2xl">
                            A curated archive of companies launched, systems architected, and technical projects shipped. Zero fluff.
                        </p>
                    </div>
                </section>

                {/* --- 2. Floating Filter Navigation --- */}
                <div className={cn(
                    "sticky top-24 z-50 px-6 md:px-12 max-w-6xl mx-auto transition-all duration-500 mb-20",
                    scrolled ? "top-6 md:top-8" : "top-24"
                )}>
                    <div className="bg-stone-900/80 backdrop-blur-xl border border-stone-800 p-2 rounded-full shadow-2xl inline-flex overflow-x-auto max-w-full no-scrollbar">
                        <div className="flex gap-1 min-w-max">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300",
                                        activeCategory === category
                                            ? "bg-white text-black shadow-md"
                                            : "text-stone-400 hover:text-white hover:bg-stone-800"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-32">
                    {CATEGORIES.map((category) => {
                        const isFounderJourney = category === "My Startups";
                        const items = filterItems(category);
                        if (!isFounderJourney && items.length === 0) return null;
                        if (activeCategory !== category) return null;

                        return (
                            <section key={category} className="animate-fade-in-up">
                                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800/50 pb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                                            <CategoryIcon category={category} className="w-6 h-6 text-white" />
                                        </div>
                                        <h2 className="font-serif text-3xl md:text-5xl text-white">{category}</h2>
                                    </div>
                                </div>

                                {isFounderJourney ? (
                                    <div className="space-y-16 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:ml-[5px] md:before:translate-x-0 before:h-full before:w-[2px] before:bg-stone-800">
                                        {FOUNDER_JOURNEY.map((startup, idx) => (
                                            <div key={idx} className="relative pl-8 md:pl-12 group">
                                                <div className={`absolute left-0 top-3 w-[11px] h-[11px] rounded-full ring-4 ring-[#0C0A09] transition-colors ${startup.status === 'Active' ? 'bg-[#D97706] ring-[#D97706]/20' : startup.status === 'Building' ? 'bg-[#10b981] ring-[#10b981]/20' : startup.status === 'Acquired' ? 'bg-[#10b981] ring-[#10b981]/20' : 'bg-stone-700'}`} />

                                                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-2">
                                                    <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight">{startup.name}</h3>
                                                    <div className={`inline-flex items-center px-2 py-0.5 rounded border font-mono text-[10px] tracking-wider uppercase ${startup.status === 'Active' ? 'border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706]' : startup.status === 'Dead' ? 'border-stone-800 bg-stone-900/50 text-stone-500' : 'border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]'}`}>
                                                        {startup.statusLabel}
                                                    </div>
                                                </div>

                                                <p className="font-mono text-xs text-stone-400 font-bold mb-4">
                                                    {startup.role} <span className="text-stone-700 font-normal mx-2">/</span> <span className="text-stone-500 font-normal">{startup.years}</span>
                                                </p>

                                                <div className="space-y-4 max-w-2xl bg-stone-900/30 p-6 rounded-2xl border border-stone-800/50 group-hover:bg-stone-800/50 group-hover:border-stone-700 transition-all">
                                                    {startup.description.map((p, pIdx) => (
                                                        <p key={pIdx} className="text-stone-400 text-sm md:text-base leading-relaxed font-light">{p}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {items.map((item) => (
                                            <div key={item.id} className="group relative bg-stone-900/50 border border-stone-800 p-8 rounded-2xl hover:bg-stone-800/50 transition-all duration-500 overflow-hidden flex flex-col h-full">
                                                <div className="absolute inset-0 bg-gradient-to-br from-stone-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                                <div className="relative z-10 flex flex-col flex-grow">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-stone-950 border border-stone-800 text-xs font-mono text-[#D97706]">
                                                                Role: {item.role}
                                                            </div>
                                                        </div>
                                                        {item.visibility && (
                                                            <Badge variant="outline" className={cn(
                                                                "font-mono text-[10px] uppercase tracking-wider",
                                                                item.visibility === "Public" ? "border-stone-700 text-stone-400" : "border-stone-800 text-stone-600"
                                                            )}>
                                                                {item.visibility === "Private" && <Lock className="w-3 h-3 mr-1" />}
                                                                {item.visibility}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <p className="text-stone-400 leading-relaxed mb-6 font-light">
                                                        {item.summary}
                                                    </p>

                                                    <div className="space-y-4 mb-8 flex-grow">
                                                        {item.problem && (
                                                            <div className="bg-stone-950/50 rounded-lg p-4 border border-stone-800/50">
                                                                <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                                    <Target className="w-3 h-3" /> The Context
                                                                </p>
                                                                <p className="text-sm text-stone-300 leading-relaxed">{item.problem}</p>
                                                            </div>
                                                        )}

                                                        {item.contribution && (
                                                            <div className="bg-[#0F3F35]/10 rounded-lg p-4 border border-[#0F3F35]/30">
                                                                <p className="text-xs font-bold text-[#0F3F35] uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                                    <Activity className="w-3 h-3" /> Contribution
                                                                </p>
                                                                <p className="text-sm text-stone-300 leading-relaxed">{item.contribution}</p>
                                                            </div>
                                                        )}

                                                        {item.outcome && (
                                                            <div className="bg-[#D97706]/5 rounded-lg p-4 border border-[#D97706]/20">
                                                                <p className="text-xs font-bold text-[#D97706] uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                                                    <Zap className="w-3 h-3" /> Outcome
                                                                </p>
                                                                <p className="text-sm text-stone-300 leading-relaxed">{item.outcome}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="relative z-10 pt-6 border-t border-stone-800 mt-auto flex items-center justify-between gap-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.tags?.map(tag => (
                                                            <span key={tag} className="text-[11px] font-mono text-stone-500 px-2.5 py-1 bg-stone-950 border border-stone-800 rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {item.github && (
                                                            <a href={item.github} target="_blank" rel="noopener noreferrer"
                                                                className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-colors tooltip group/link relative">
                                                                <Github className="w-4 h-4" />
                                                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stone-800 text-xs px-2 py-1 rounded opacity-0 group-hover/link:opacity-100 transition-opacity">Source</span>
                                                            </a>
                                                        )}
                                                        {item.link && (
                                                            <a href={item.link} target="_blank" rel="noopener noreferrer"
                                                                className="w-10 h-10 rounded-full bg-[#0F3F35] text-white flex items-center justify-center hover:bg-[#092822] transition-colors tooltip group/link relative">
                                                                <ArrowUpRight className="w-4 h-4" />
                                                                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0F3F35] text-xs px-2 py-1 rounded opacity-0 group-hover/link:opacity-100 transition-opacity">Visit</span>
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
