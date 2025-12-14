// ============================================================================
// File Path: src/app/work/page.tsx
// Version: 1.0.0 — The "Project Log" Page
// Identity: Sage / Creator.
// Vibe: Transparent, Organized, "Work in Public".
// Design: "Scholar's Desk" — Structured cards, Status indicators, Clear typography.
// 
// Key Sections:
// 1. The Ledger (Intro)
// 2. Active Ventures (Current Focus - Highlighted)
// 3. The Archive (Past Projects - Muted/Grayscale)
// 4. Advisory Scope (Mentorship context)
// 5. The Lab (Small bets & Experiments)
// ============================================================================

import React from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Building2, 
  ArrowUpRight, 
  History, 
  FlaskConical, 
  Briefcase, 
  Users,
  LayoutTemplate
} from "lucide-react"
import Link from "next/link"

// --- Mock Data: Active Ventures ---
const ACTIVE_VENTURES = [
  {
    id: 1,
    role: "Founder & Lead Mentor",
    name: "The Immigrant Founder's Circle",
    year: "2023 — Present",
    description: "A private mentorship program for founders navigating the Canadian startup ecosystem.",
    tags: ["Education", "Community"],
    status: "Scaling",
    link: "#"
  },
  {
    id: 2,
    role: "Principal Consultant",
    name: "SME Digital Systems",
    year: "2022 — Present",
    description: "Helping traditional small businesses transition from paper/chaos to digital workflows and AI.",
    tags: ["Consulting", "Automation"],
    status: "Active",
    link: "#"
  },
  {
    id: 3,
    role: "Writer & Creator",
    name: "Farjad.co (The Library)",
    year: "2021 — Present",
    description: "This content hub. A personal library of mental models, essays, and frameworks for builders.",
    tags: ["Media", "Writing"],
    status: "Ongoing",
    link: "/"
  }
];

// --- Mock Data: Past Projects ---
const PAST_PROJECTS = [
  {
    id: 101,
    name: "Tehran Tech Events",
    role: "Co-Organizer",
    years: "2016 — 2019",
    outcome: "Built a community of 500+ developers.",
    lesson: "Learned that community is about consistency, not venue size.",
    status: "Completed"
  },
  {
    id: 102,
    name: "Project 'Alpha' SaaS",
    role: "Co-Founder",
    years: "2018 — 2020",
    outcome: "Failed to find PMF. Closed after 18 months.",
    lesson: "Learned that 'cool tech' does not equal a 'business problem'.",
    status: "Sunsetted" // Honest language
  }
];

// --- Mock Data: Experiments ---
const EXPERIMENTS = [
  { title: "AI for Visa Docs", type: "Prototype", desc: "Testing LLMs for summarizing legal jargon." },
  { title: "The 3-Minute Journal", type: "Content Series", desc: "A framework for busy founders." },
  { title: "No-Code CRM", type: "Tool", desc: "Template for service agencies." },
];

export default function WorkPage() {
  return (
    // ROOT: Warm Paper Background
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white">
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 pt-8 pb-8 px-6 md:px-12 border-b border-[#1B4B43]/10 bg-[#FDFCF8]/90 backdrop-blur-sm sticky top-0">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex flex-col group">
            <span className="font-serif font-bold text-2xl tracking-tight leading-none text-[#1B4B43] group-hover:opacity-80 transition-opacity">Farjad.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <Link href="/" className="hover:text-[#1B4B43] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[#1B4B43] transition-colors">About</Link>
            <span className="text-[#1B4B43] font-bold border-b border-[#1B4B43]">Work</span>
          </nav>
        </div>
      </header>

      <main className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto py-16 md:py-24">

        {/* --- 1. HERO: THE LEDGER --- */}
        <section className="mb-20 max-w-3xl">
          <Badge variant="outline" className="mb-6 border-[#1B4B43]/30 text-[#1B4B43] rounded-sm font-mono tracking-widest text-[10px] uppercase px-2 py-1 bg-[#1B4B43]/5">
            The Ledger
          </Badge>
          <h1 className="font-serif text-5xl md:text-6xl text-[#111827] leading-[1.1] mb-8">
            What I actually <br/>
            <span className="italic text-stone-500 font-light">work on.</span>
          </h1>
          <div className="prose prose-stone text-lg md:text-xl text-stone-600 leading-relaxed font-light">
            <p>
              This is not a trophy room. I don't list every coffee chat or advisory call as a "project."
            </p>
            <p>
              This page is a log of my active ventures, my past lessons, and the experiments I am running right now. 
              It is the evidence that I build real things, not just talk about them.
            </p>
          </div>
        </section>

        {/* --- 2. ACTIVE VENTURES (Cards) --- */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10 border-b border-[#1B4B43]/10 pb-4">
             <h2 className="font-serif text-3xl text-[#111827]">Active Ventures</h2>
             <span className="font-mono text-xs text-[#1B4B43] uppercase tracking-widest">/// Current Focus</span>
          </div>

          <div className="grid gap-8">
            {ACTIVE_VENTURES.map((venture) => (
              <div key={venture.id} className="group bg-white border border-stone-200 p-8 rounded-sm hover:border-[#1B4B43]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#1B4B43]/5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-[#1B4B43] uppercase tracking-wide bg-[#1B4B43]/5 px-2 py-1 rounded-sm">
                        {venture.role}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">{venture.year}</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#111827] group-hover:text-[#1B4B43] transition-colors">
                      {venture.name}
                    </h3>
                  </div>
                  <div className="shrink-0">
                    <Badge className="bg-[#1B4B43] text-white hover:bg-[#153e37] rounded-full px-3 font-normal tracking-wide">
                      {venture.status}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mb-6">
                  {venture.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-100">
                  <div className="flex gap-2">
                    {venture.tags.map(tag => (
                      <span key={tag} className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link href={venture.link} className="flex items-center text-sm font-bold text-[#1B4B43] hover:underline underline-offset-4">
                    View Project <ArrowUpRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 3. THE ARCHIVE (Past Projects) --- */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10 border-b border-stone-200 pb-4">
             <h2 className="font-serif text-3xl text-stone-500">Selected Archive</h2>
             <span className="font-mono text-xs text-stone-400 uppercase tracking-widest">/// Lessons Learned</span>
          </div>

          <div className="space-y-6">
            {PAST_PROJECTS.map((project) => (
              <div key={project.id} className="flex flex-col md:flex-row gap-6 md:items-start p-6 bg-[#F5F5F4]/50 border border-stone-100 rounded-sm hover:bg-[#F5F5F4] transition-colors">
                <div className="md:w-1/4">
                   <h4 className="font-bold text-[#111827] text-lg">{project.name}</h4>
                   <p className="text-xs text-stone-400 font-mono mt-1">{project.years}</p>
                   <p className="text-xs text-stone-500 mt-1">{project.role}</p>
                </div>
                <div className="md:w-3/4 grid md:grid-cols-2 gap-6">
                   <div>
                     <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">Outcome</span>
                     <p className="text-sm text-stone-700 mt-1 leading-relaxed">{project.outcome}</p>
                   </div>
                   <div>
                     <span className="text-xs font-bold uppercase text-[#1B4B43] tracking-wider">The Lesson</span>
                     <p className="text-sm text-stone-700 mt-1 leading-relaxed italic border-l-2 border-[#1B4B43]/20 pl-3">
                       "{project.lesson}"
                     </p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 4. ADVISORY & MENTORING CONTEXT --- */}
        <section className="mb-24 bg-[#111827] text-stone-200 p-8 md:p-12 rounded-sm relative overflow-hidden">
           {/* Decoration */}
           <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#1B4B43] rounded-full blur-[80px] opacity-20" />
           
           <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/3">
                 <div className="p-3 bg-white/10 w-fit rounded-full mb-6">
                    <Users className="w-6 h-6 text-white" />
                 </div>
                 <h2 className="font-serif text-3xl text-white mb-4">Advisory Work</h2>
                 <p className="text-stone-400 text-sm">
                   My project experience directly informs my mentoring. I don't give advice from a textbook; I give advice from the trenches.
                 </p>
              </div>
              <div className="md:w-2/3 grid gap-6">
                 <div className="border-l border-white/20 pl-6">
                    <h4 className="font-bold text-white mb-1">Startup Visa & Immigration</h4>
                    <p className="text-stone-400 text-sm">Advising founders on aligning their business model with immigration compliance. Moving from "fake traction" to real revenue.</p>
                 </div>
                 <div className="border-l border-white/20 pl-6">
                    <h4 className="font-bold text-white mb-1">Small Business Modernization</h4>
                    <p className="text-stone-400 text-sm">Helping traditional owners understand that AI is not magic—it's just a better way to handle data and operations.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* --- 5. THE LAB (Small Bets) --- */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
             <FlaskConical className="w-6 h-6 text-[#1B4B43]" />
             <h2 className="font-serif text-2xl text-[#111827]">Experiments & Small Bets</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
             {EXPERIMENTS.map((exp, idx) => (
               <div key={idx} className="bg-white border border-stone-200 p-6 rounded-sm border-t-4 border-t-stone-200 hover:border-t-[#1B4B43] transition-all group">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 group-hover:text-[#1B4B43]">
                    {exp.type}
                  </div>
                  <h4 className="font-bold text-[#111827] mb-2">{exp.title}</h4>
                  <p className="text-sm text-stone-600 leading-snug">
                    {exp.desc}
                  </p>
               </div>
             ))}
          </div>
        </section>

        {/* --- 6. FOOTER CONNECT --- */}
        <section className="border-t border-[#1B4B43]/10 pt-10 pb-10 text-center">
           <p className="text-stone-600 font-light text-lg mb-6">
             Everything I learn in these projects ends up in my essays.
           </p>
           <Link href="/essays">
             <Button variant="link" className="text-[#1B4B43] text-base font-bold underline decoration-2 underline-offset-4 hover:text-[#111827]">
               Read the Essays
             </Button>
           </Link>
        </section>

      </main>
    </div>
  )
}