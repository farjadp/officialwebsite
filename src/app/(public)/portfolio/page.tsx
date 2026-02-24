"use client";

// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Main entry page for the route
// Env / Identity: Client Component
// ============================================================================

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Github, ExternalLink, Activity, Target, Layers, LayoutTemplate, Briefcase } from "lucide-react";
import {
    CATEGORIES,
    Category,
    STARTUPS_FOUNDED,
    STRATEGIC_ENGAGEMENTS,
    TECHNICAL_PROJECTS,
    AI_SYSTEMS,
    EXPERIMENTAL_LAB
} from "./data";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");

    return (
        <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans selection:bg-[#1B4B43] selection:text-white pb-32">
            {/* Texture Overlay (Grain) */}
            <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="relative z-10">

                {/* --- 1. Hero Section --- */}
                <section className="pt-24 pb-16 px-6 md:px-12 max-w-6xl mx-auto">
                    <div className="max-w-3xl">
                        <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-[#111827] mb-6">
                            Selected Work & <br />
                            <span className="italic text-stone-500 font-light">Built Systems</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-stone-600 font-light leading-relaxed mb-6">
                            A curated archive of companies founded, architectures built, and strategic engagements executed.
                        </p>
                        <div className="h-0.5 w-16 bg-[#1B4B43] mt-8" />
                    </div>
                </section>

                {/* --- 2. Filter Tabs --- */}
                <section className="sticky top-[86px] z-40 bg-[#FDFCF8]/90 backdrop-blur-md border-y border-stone-200 py-4 px-6 md:px-12 mb-16 shadow-sm">
                    <div className="max-w-6xl mx-auto flex gap-6 overflow-x-auto no-scrollbar scroll-smooth">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "whitespace-nowrap text-sm font-medium tracking-wide transition-colors pb-1",
                                    activeCategory === category
                                        ? "text-[#1B4B43] border-b-2 border-[#1B4B43]"
                                        : "text-stone-500 hover:text-[#111827]"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-32">

                    {/* --- 3. Startups I Founded --- */}
                    {(activeCategory === "All" || activeCategory === "Startups I Founded") && (
                        <section>
                            <div className="mb-10 flex items-center gap-4 border-b border-stone-200 pb-4">
                                <Briefcase className="w-6 h-6 text-[#1B4B43]" />
                                <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">Startups I Founded</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                                {STARTUPS_FOUNDED.map((startup) => (
                                    <div key={startup.id} className="bg-white border border-stone-200 p-8 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-serif text-[#111827] mb-1">{startup.name}</h3>
                                                <span className="text-sm font-bold uppercase tracking-widest text-[#1B4B43]">{startup.role}</span>
                                            </div>
                                            <a href={startup.link} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-[#111827] transition-colors">
                                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {startup.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="bg-stone-100 text-stone-600 font-normal rounded-sm">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="space-y-6 flex-grow">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">The Problem</h4>
                                                <p className="text-stone-700 text-sm leading-relaxed">{startup.problem}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">What Was Built</h4>
                                                <p className="text-stone-700 text-sm leading-relaxed">{startup.built}</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-stone-100">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1B4B43] mb-2">Outcome / Traction</h4>
                                            <p className="text-[#111827] font-medium text-sm leading-relaxed">{startup.outcome}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- 4. Strategic Engagements --- */}
                    {(activeCategory === "All" || activeCategory === "Strategic Engagements") && (
                        <section>
                            <div className="mb-10 flex items-center gap-4 border-b border-stone-200 pb-4">
                                <Target className="w-6 h-6 text-[#1B4B43]" />
                                <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">Strategic Engagements</h2>
                            </div>
                            <div className="space-y-8">
                                {STRATEGIC_ENGAGEMENTS.map((engagement) => (
                                    <div key={engagement.id} className="bg-white border border-stone-200 p-8 grid lg:grid-cols-12 gap-8 hover:border-[#1B4B43]/30 transition-colors">

                                        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-stone-100 pb-6 lg:pb-0 lg:pr-6">
                                            <h3 className="text-xl font-serif text-[#111827] mb-2">{engagement.organization}</h3>
                                            <p className="text-sm font-bold uppercase tracking-widest text-[#1B4B43] mb-6">{engagement.role}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {engagement.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="bg-stone-50 border border-stone-200 text-stone-600 font-normal rounded-sm text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="lg:col-span-8 space-y-6">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">The Challenge</h4>
                                                <p className="text-stone-700 text-sm leading-relaxed">{engagement.challenge}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">My Contribution</h4>
                                                <p className="text-stone-700 text-sm leading-relaxed">{engagement.contribution}</p>
                                            </div>
                                            <div className="pt-2">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1B4B43] mb-2">Outcome</h4>
                                                <p className="text-[#111827] font-medium text-sm leading-relaxed">{engagement.outcome}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- 5. Technical & GitHub Projects / AI & Automation --- */}
                    {(activeCategory === "All" || activeCategory === "Technical & GitHub Projects" || activeCategory === "AI & Automation Systems") && (
                        <section>
                            <div className="mb-10 flex items-center gap-4 border-b border-stone-200 pb-4">
                                <Layers className="w-6 h-6 text-[#1B4B43]" />
                                <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">Technical Systems & AI</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Aggregate Technical and AI Projects for display logic simplicity */}
                                {[...TECHNICAL_PROJECTS, ...AI_SYSTEMS]
                                    .filter(proj => {
                                        if (activeCategory === "All") return true;
                                        if (activeCategory === "Technical & GitHub Projects" && TECHNICAL_PROJECTS.some(p => p.id === proj.id)) return true;
                                        if (activeCategory === "AI & Automation Systems" && AI_SYSTEMS.some(p => p.id === proj.id)) return true;
                                        return false;
                                    })
                                    .map((project) => (
                                        <div key={project.id} className="bg-white border border-stone-200 p-8 flex flex-col h-full hover:shadow-lg transition-shadow group">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-serif text-[#111827] pr-4">{project.name}</h3>
                                                <div className="flex gap-3">
                                                    {project.github !== "#" && (
                                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-[#111827] transition-colors" title="View Source">
                                                            <Github className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                    {project.demo !== "#" && (
                                                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-[#111827] transition-colors" title="Live Demo">
                                                            <ExternalLink className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-stone-600 text-sm leading-relaxed mb-6">{project.description}</p>

                                            <div className="mb-6">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Problem Solved</h4>
                                                <p className="text-stone-700 text-sm leading-relaxed">{project.problem}</p>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-stone-100">
                                                <div className="flex flex-wrap gap-2 text-xs font-mono text-[#1B4B43]">
                                                    {project.techStack.map((tech, i) => (
                                                        <span key={i} className="bg-[#1B4B43]/5 px-2 py-1">{tech}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}

                    {/* --- 6. Experimental Lab --- */}
                    {(activeCategory === "All" || activeCategory === "Experimental Lab") && (
                        <section>
                            <div className="mb-10 flex items-center gap-4 border-b border-stone-200 pb-4">
                                <Activity className="w-6 h-6 text-[#1B4B43]" />
                                <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">Experimental Lab</h2>
                                <span className="hidden md:block ml-2 text-xs font-bold uppercase tracking-widest text-stone-400">Prototypes & Internal Tools</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                {EXPERIMENTAL_LAB.map((project) => (
                                    <div key={project.id} className="bg-stone-50 border border-stone-200 border-dashed p-8 flex flex-col h-full hover:border-stone-400 hover:bg-stone-100/50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-serif text-[#111827]">{project.name}</h3>
                                            {project.github !== "#" && (
                                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-[#111827] transition-colors">
                                                    <Github className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-stone-600 text-sm leading-relaxed mb-6">{project.description}</p>
                                        <div className="mb-6 flex-grow">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Why It Exists</h4>
                                            <p className="text-stone-700 text-sm leading-relaxed border-l-2 border-[#1B4B43]/30 pl-3">{project.problem}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-stone-200">
                                            <div className="flex flex-wrap gap-2 text-xs font-mono text-stone-500">
                                                {project.techStack.map((tech, i) => (
                                                    <span key={i} className="bg-stone-200 px-2 py-1">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </div>
            </div>
        </div>
    );
}
