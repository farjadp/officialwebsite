// ============================================================================
// File Path: src/app/services/page.tsx
// Version: 1.0.0 — The "Sage" Services Page
// Identity: Strict Mentor. No Hype. High Clarity.
// Design: "Scholar's Desk" — Text-focused, structured, paper-like.
// 
// Key Sections:
// 1. The Philosophy (Hero)
// 2. The 3 Pillars (Services Grid)
// 3. The Anti-Pitch (What I don't do - Dark Section)
// 4. The Process (How we work)
// ============================================================================

import React from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Brain, 
  Target, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Briefcase,
  Lightbulb,
  Cpu
} from "lucide-react"
import Link from "next/link"

// --- Content Data ---
const SERVICES = [
  {
    id: 'founders',
    icon: <Briefcase className="w-6 h-6" />,
    title: "For Founders & SUV Teams",
    target: "Early-stage startups seeking investment or immigration.",
    points: [
      "Refining the 'Story' & Pitch Deck logic.",
      "Stress-testing the Business Model.",
      "Preparing for Incubator/Angel interviews.",
      "Reality-checking your North American strategy."
    ]
  },
  {
    id: 'immigrants',
    icon: <Lightbulb className="w-6 h-6" />,
    title: "For Immigrant Entrepreneurs",
    target: "Newcomers who want to build, not just survive.",
    points: [
      "Turning vague ideas into testable offers.",
      "Understanding Canadian business culture.",
      "Designing a realistic MVP or Pilot.",
      "Networking strategy that actually works."
    ]
  },
  {
    id: 'smes',
    icon: <Cpu className="w-6 h-6" />,
    title: "Digital Systems for SMEs",
    target: "Traditional businesses ready to modernize.",
    points: [
      "Operational Audit (Where are you losing time?).",
      "Implementing practical AI workflows.",
      "Setting up CRM and Automation.",
      "Training teams to think in 'Systems'."
    ]
  }
];

export default function ServicesPage() {
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
            <span className="text-[#1B4B43] font-bold border-b border-[#1B4B43]">Mentoring</span>
          </nav>
        </div>
      </header>

      <main className="relative z-10">

        {/* --- 1. HERO SECTION: The Philosophy --- */}
        <section className="px-6 md:px-12 py-20 md:py-32 max-w-5xl mx-auto">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 border-[#1B4B43]/30 text-[#1B4B43] rounded-sm font-mono tracking-widest text-[10px] uppercase px-2 py-1 bg-[#1B4B43]/5">
              Work with me
            </Badge>
            <h1 className="font-serif text-5xl md:text-6xl text-[#111827] leading-[1.1] mb-8">
              Real work for <br/>
              <span className="italic text-stone-500 font-light">serious builders.</span>
            </h1>
            <div className="prose prose-stone text-lg md:text-xl text-stone-600 leading-relaxed font-light space-y-6">
              <p>
                I am not an agency. I don't have a team of 50 interns hiding behind my name. 
                When we work together, you work with <strong>me</strong>.
              </p>
              <p>
                My role is to be the "Architect" in your corner. I provide the clarity, the frameworks, and the honest feedback you need to build a life and business in Canada.
              </p>
            </div>
          </div>
        </section>

        {/* --- 2. THE SERVICES GRID (3 Pillars) --- */}
        <section className="px-6 md:px-12 py-16 bg-[#F5F5F4]/50 border-y border-[#1B4B43]/5">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="font-serif text-3xl text-[#111827]">How I can help</h2>
              <p className="text-stone-500 mt-2 text-sm font-mono">/// AREAS OF FOCUS</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {SERVICES.map((service) => (
                <div key={service.id} className="bg-white border border-stone-200 p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full group">
                  <div className="mb-6 p-3 bg-[#FDFCF8] border border-stone-100 w-fit text-[#1B4B43] group-hover:bg-[#1B4B43] group-hover:text-white transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#111827] mb-3 group-hover:text-[#1B4B43] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-stone-500 text-sm mb-6 leading-relaxed min-h-[40px]">
                    {service.target}
                  </p>
                  <Separator className="bg-stone-100 mb-6" />
                  <ul className="space-y-3">
                    {service.points.map((point, idx) => (
                      <li key={idx} className="flex gap-3 items-start text-sm text-stone-700 leading-snug">
                        <CheckCircle2 className="w-4 h-4 text-[#1B4B43]/60 mt-0.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 3. THE ANTI-PITCH (Dark Section) --- */}
        <section className="bg-[#1B4B43] text-stone-100 py-20 px-6 md:px-12 relative overflow-hidden">
           {/* Abstract Decoration */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
           
           <div className="max-w-4xl mx-auto relative z-10">
             <div className="flex flex-col md:flex-row gap-12 items-start">
               <div className="md:w-1/3">
                 <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                   What I do <br/>
                   <span className="text-[#D97706] italic">NOT</span> do.
                 </h2>
                 <p className="text-stone-300 text-sm leading-relaxed">
                   To save us both time, please read this carefully. I am strict about these boundaries.
                 </p>
               </div>

               <div className="md:w-2/3 grid gap-6">
                 <div className="flex gap-4 items-start bg-white/5 p-4 rounded-sm border border-white/10">
                   <ShieldAlert className="w-6 h-6 text-[#D97706] shrink-0" />
                   <div>
                     <h4 className="font-bold text-white text-sm uppercase tracking-wide">No Legal Advice</h4>
                     <p className="text-stone-300 text-sm mt-1">I am a strategist, not an immigration lawyer. I help with the <em>business case</em>, not the legal filing.</p>
                   </div>
                 </div>
                 <div className="flex gap-4 items-start bg-white/5 p-4 rounded-sm border border-white/10">
                   <XCircle className="w-6 h-6 text-[#D97706] shrink-0" />
                   <div>
                     <h4 className="font-bold text-white text-sm uppercase tracking-wide">No Guaranteed Visas</h4>
                     <p className="text-stone-300 text-sm mt-1">Anyone promising you a guaranteed visa is selling a lie. We work on probability and compliance, not magic.</p>
                   </div>
                 </div>
                 <div className="flex gap-4 items-start bg-white/5 p-4 rounded-sm border border-white/10">
                   <XCircle className="w-6 h-6 text-[#D97706] shrink-0" />
                   <div>
                     <h4 className="font-bold text-white text-sm uppercase tracking-wide">No "Done-For-You" Startups</h4>
                     <p className="text-stone-300 text-sm mt-1">I don't build fake companies for you. If you aren't ready to run the business, we can't work together.</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </section>

        {/* --- 4. THE PROCESS (How we work) --- */}
        <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl text-[#111827]">Engagement Model</h2>
            <div className="h-1 w-12 bg-[#1B4B43] mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-stone-200 z-0" />

            {/* Step 1 */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white border-2 border-stone-200 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-serif font-bold text-[#1B4B43] shadow-sm">
                01
              </div>
              <h3 className="font-bold text-[#111827] mb-2">The Audit</h3>
              <p className="text-sm text-stone-600 px-4">
                We start with a paid strategy session or audit. We define the problem and see if we are a good fit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white border-2 border-stone-200 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-serif font-bold text-[#1B4B43] shadow-sm">
                02
              </div>
              <h3 className="font-bold text-[#111827] mb-2">The Roadmap</h3>
              <p className="text-sm text-stone-600 px-4">
                I design a custom plan (Narrative, MVP, or Systems). You get clear homework and milestones.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white border-2 border-stone-200 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-serif font-bold text-[#1B4B43] shadow-sm">
                03
              </div>
              <h3 className="font-bold text-[#111827] mb-2">Execution</h3>
              <p className="text-sm text-stone-600 px-4">
                We meet bi-weekly to unblock issues. I keep you accountable. You do the heavy lifting.
              </p>
            </div>
          </div>
        </section>

        {/* --- 5. CTA SECTION --- */}
        <section className="bg-[#F5F5F4] border-t border-stone-200 py-20 px-6 text-center">
           <div className="max-w-2xl mx-auto">
             <Brain className="w-10 h-10 text-[#1B4B43] mx-auto mb-6 opacity-80" />
             <h2 className="font-serif text-3xl text-[#111827] mb-6">Are you ready to commit?</h2>
             <p className="text-stone-600 text-lg mb-8 leading-relaxed">
               I have limited capacity for 1:1 work. I prioritize founders who have a clear problem and the will to solve it.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/contact">
                 <Button className="bg-[#1B4B43] hover:bg-[#133832] text-white h-14 px-8 text-base font-medium shadow-xl shadow-[#1B4B43]/10 w-full sm:w-auto">
                   Request a Conversation <ArrowRight className="ml-2 w-4 h-4" />
                 </Button>
               </Link>
               <Link href="/essays">
                 <Button variant="outline" className="border-stone-300 text-stone-600 hover:text-[#1B4B43] h-14 px-8 text-base w-full sm:w-auto">
                   Read my Philosophy first
                 </Button>
               </Link>
             </div>
             <p className="mt-8 text-xs text-stone-400 font-mono uppercase tracking-wider">
               Serious Inquiries Only. No Spam.
             </p>
           </div>
        </section>

      </main>
    </div>
  )
}