"use client";

// ============================================================================
// Hardware Source: page.tsx
// Version: 2.0.0 — 2026-02-24
// Why: Main entry page for the route - Redesigned
// Env / Identity: Client Component
// ============================================================================

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Github, ExternalLink, Activity, Target, Layers, Briefcase, Zap, BookOpen, Lock, Globe, Star, GitFork } from "lucide-react";
import {
    CATEGORIES,
    Category,
    STARTUPS_FOUNDED,
    STRATEGIC_ENGAGEMENTS,
    TECHNICAL_PROJECTS,
    GITHUB_REPOS,
    AI_SYSTEMS,
    EXPERIMENTAL_LAB
} from "./data";
import { cn } from "@/lib/utils";

export default function PortfolioPageV2() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0C0A09] text-stone-300 font-sans selection:bg-[#D97706] selection:text-white pb-32 overflow-x-hidden">

            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1B4B43] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D97706] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>

                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBWMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-50"></div>
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-400 to-stone-600 font-light italic">Built Architecture</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-stone-400 font-light leading-relaxed max-w-2xl">
                            A curated archive of companies founded, systems architected, and strategic engagements executed. No fluff.
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

                    {/* --- 3. Startups I Founded --- */}
                    {(activeCategory === "All" || activeCategory === "Startups I Founded") && (
                        <section className="animate-fade-in-up">
                            <div className="mb-12 flex items-center gap-4">
                                <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="font-serif text-3xl md:text-5xl text-white">Startups Founded</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {STARTUPS_FOUNDED.map((startup) => (
                                    <div key={startup.id} className="group relative bg-stone-900/50 border border-stone-800 p-8 rounded-2xl hover:bg-stone-800/50 transition-all duration-500 overflow-hidden">
                                        {/* Hover Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#1B4B43]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-3xl font-serif text-white mb-2">{startup.name}</h3>
                                                    <span className="text-xs font-bold uppercase tracking-widest text-[#D97706]">{startup.role}</span>
                                                </div>
                                                <a href={startup.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-stone-800 rounded-full text-stone-400 hover:text-white hover:bg-stone-700 transition-all group-hover:rotate-45">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </a>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {startup.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="bg-stone-950/50 border border-stone-800 text-stone-300 font-normal">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="space-y-6 flex-grow">
                                                <div className="transform transition-transform duration-500 group-hover:translate-x-2">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">The Problem</h4>
                                                    <p className="text-stone-300 text-sm leading-relaxed">{startup.problem}</p>
                                                </div>
                                                <div className="transform transition-transform duration-500 group-hover:translate-x-2 delay-75">
                                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">What Was Built</h4>
                                                    <p className="text-stone-300 text-sm leading-relaxed">{startup.built}</p>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-stone-800/50 transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1B4B43] mb-2 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1B4B43] animate-pulse"></div> Outcome
                                                </h4>
                                                <p className="text-white font-medium text-sm leading-relaxed border-l-2 border-[#1B4B43]/50 pl-3">{startup.outcome}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- 4. Strategic Engagements --- */}
                    {(activeCategory === "All" || activeCategory === "Strategic Engagements") && (
                        <section className="animate-fade-in-up delay-100">
                            <div className="mb-12 flex items-center gap-4">
                                <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="font-serif text-3xl md:text-5xl text-white">Strategic Engagements</h2>
                            </div>

                            <div className="space-y-6">
                                {STRATEGIC_ENGAGEMENTS.map((engagement) => (
                                    <div key={engagement.id} className="group flex flex-col md:flex-row gap-6 md:gap-12 p-8 bg-stone-900/30 border border-stone-800/50 rounded-2xl hover:border-[#D97706]/50 hover:bg-stone-900/80 transition-all duration-500">
                                        <div className="md:w-1/3 shrink-0">
                                            <h3 className="text-2xl font-serif text-white mb-2">{engagement.organization}</h3>
                                            <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-4">{engagement.role}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {engagement.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="bg-transparent border border-stone-700 text-stone-400 font-mono text-[10px]">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="md:w-2/3 space-y-6 md:border-l md:border-stone-800 md:pl-12">
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">The Challenge</h4>
                                                <p className="text-stone-300 text-sm leading-relaxed">{engagement.challenge}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Contribution</h4>
                                                <p className="text-stone-300 text-sm leading-relaxed">{engagement.contribution}</p>
                                            </div>
                                            <div className="pt-2">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D97706] mb-2">Outcome</h4>
                                                <p className="text-white text-sm leading-relaxed">{engagement.outcome}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- 5. Technical Software / AI & Automation --- */}
                    {(activeCategory === "All" || activeCategory === "Technical Software" || activeCategory === "AI & Automation Systems") && (
                        <section className="animate-fade-in-up delay-200">
                            <div className="mb-12 flex items-center gap-4">
                                <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="font-serif text-3xl md:text-5xl text-white">Technical Systems & AI</h2>
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {[...TECHNICAL_PROJECTS, ...AI_SYSTEMS]
                                    .filter(proj => {
                                        if (activeCategory === "All") return true;
                                        if (activeCategory === "Technical Software" && TECHNICAL_PROJECTS.some(p => p.id === proj.id)) return true;
                                        if (activeCategory === "AI & Automation Systems" && AI_SYSTEMS.some(p => p.id === proj.id)) return true;
                                        return false;
                                    })
                                    .map((project) => (
                                        <div key={project.id} className="group relative bg-[#111111] border border-stone-800 p-8 rounded-2xl flex flex-col h-full hover:border-stone-600 transition-colors">
                                            {/* Glowing Top Border effect */}
                                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1B4B43] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                            <div className="flex justify-between items-start mb-6">
                                                <h3 className="text-xl font-serif text-white pr-4">{project.name}</h3>
                                                <div className="flex gap-2">
                                                    {project.github !== "#" && (
                                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-stone-900 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
                                                            <Github className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    {project.demo !== "#" && (
                                                        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="p-2 bg-stone-900 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-stone-400 text-sm leading-relaxed mb-6 font-light">{project.description}</p>

                                            <div className="mb-6 flex-grow">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1B4B43] mb-2 font-mono">{`// Problem_Solved`}</h4>
                                                <p className="text-stone-300 text-sm leading-relaxed border-l border-stone-800 pl-3">{project.problem}</p>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-stone-800/50">
                                                <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-widest text-stone-500">
                                                    {project.techStack.map((tech, i) => (
                                                        <span key={i} className="bg-stone-900 border border-stone-800 px-2 py-1 rounded">{tech}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </section>
                    )}

                    {/* --- 6. GitHub Repositories --- */}
                    {(activeCategory === "All" || activeCategory === "GitHub Repositories") && (
                        <section className="animate-fade-in-up delay-[250ms]">
                            <div className="mb-12 flex items-center justify-between border-b border-stone-800 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                                        <Github className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="font-serif text-3xl md:text-5xl text-white">GitHub Repositories</h2>
                                </div>
                                <span className="hidden md:flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Source Code
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {GITHUB_REPOS.map((repo) => (
                                    <a
                                        key={repo.id}
                                        href={repo.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative flex flex-col justify-between bg-stone-900/40 border border-stone-800/60 p-6 md:p-8 rounded-2xl hover:bg-stone-800/50 transition-all duration-300 hover:border-stone-600 block shadow-sm hover:shadow-lg overflow-hidden"
                                    >
                                        {/* Subtle Hover Gradient Background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-stone-950 border border-stone-800 rounded-lg shrink-0 group-hover:border-stone-700 transition-colors mt-0.5">
                                                        <BookOpen className="w-5 h-5 text-stone-400 group-hover:text-stone-300" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-serif text-xl sm:text-2xl text-blue-400 group-hover:text-blue-300 transition-colors break-words line-clamp-2 leading-tight mb-1">
                                                            <span className="text-stone-500 font-sans text-sm block mb-1">farjadp / </span>
                                                            <span className="font-bold">{repo.name}</span>
                                                        </h3>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className={cn(
                                                    "flex items-center gap-1.5 rounded-full border shrink-0 text-[10px] ml-4 font-mono font-normal tracking-wide px-2 py-0.5",
                                                    repo.visibility === "Private"
                                                        ? "border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706]"
                                                        : "border-stone-700 bg-stone-950 text-stone-400"
                                                )}>
                                                    {repo.visibility === "Private" ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                                    {repo.visibility}
                                                </Badge>
                                            </div>
                                            <p className="text-stone-400 text-sm leading-relaxed mb-8 font-light line-clamp-3">
                                                {repo.description}
                                            </p>
                                        </div>

                                        <div className="relative z-10 flex items-center gap-6 mt-auto pt-5 border-t border-stone-800/50">
                                            {repo.language && (
                                                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-stone-400">
                                                    <span className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        repo.language === "TypeScript" ? "bg-blue-500" :
                                                            repo.language === "JavaScript" ? "bg-yellow-400" :
                                                                repo.language === "Python" ? "bg-blue-300" : "bg-stone-500"
                                                    )}></span>
                                                    {repo.language}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4 text-xs font-mono text-stone-500 ml-auto">
                                                <span className="flex items-center gap-1.5 hover:text-stone-300 transition-colors"><Star className="w-3.5 h-3.5" /> </span>
                                                <span className="flex items-center gap-1.5 hover:text-stone-300 transition-colors"><GitFork className="w-3.5 h-3.5" /> </span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* --- 7. Experimental Lab --- */}
                    {(activeCategory === "All" || activeCategory === "Experimental Lab") && (
                        <section className="animate-fade-in-up delay-300">
                            <div className="mb-12 flex items-center justify-between border-b border-stone-800 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-stone-900 border border-stone-800 rounded-xl">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="font-serif text-3xl md:text-5xl text-white">Experimental Lab</h2>
                                </div>
                                <span className="hidden md:flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Prototypes
                                </span>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {EXPERIMENTAL_LAB.map((project) => (
                                    <div key={project.id} className="relative bg-transparent border border-dashed border-stone-700 p-8 rounded-2xl flex flex-col h-full hover:bg-stone-900/30 transition-colors group">
                                        <div className="absolute top-0 right-0 px-3 py-1 bg-stone-800 text-[10px] font-mono uppercase tracking-widest text-stone-400 rounded-bl-xl rounded-tr-xl">Alpha</div>

                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-2xl font-serif text-white">{project.name}</h3>
                                            {project.github !== "#" && (
                                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-stone-900 rounded-full text-stone-400 hover:text-white transition-colors">
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-stone-400 text-sm leading-relaxed mb-6 font-light">{project.description}</p>
                                        <div className="mb-6 flex-grow">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2 font-mono">{`> Rationale`}</h4>
                                            <p className="text-stone-300 text-sm leading-relaxed font-mono text-xs">{project.problem}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-dashed border-stone-800">
                                            <div className="flex flex-wrap gap-2 text-[10px] font-mono text-stone-500">
                                                {project.techStack.map((tech, i) => (
                                                    <span key={i} className="px-2 py-1 bg-stone-900 rounded">{tech}</span>
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
