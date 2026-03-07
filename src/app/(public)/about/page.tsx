// ============================================================================
// Hardware Source: page.tsx
// Version: 2.0.0 — 2026-03-07
// Why: Main entry page for the route - Redesigned for strategic clarity & proof
// Env / Identity: React Server Component
// ============================================================================

import React from 'react';
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Terminal,
  ArrowRight,
  MousePointer2,
  Layers,
  Briefcase,
  Globe2,
  Camera,
  Cpu,
  GraduationCap,
  Award
} from "lucide-react"

import { EDUCATION, CERTIFICATIONS } from "./data";

export const metadata: Metadata = {
  title: "About Farjad | Founder, Mentor, Systems Builder",
  description: "Founder, mentor, and systems builder helping immigrant founders and serious business owners build with clarity in Canada.",
};

export default function AboutPageInteractive() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#0F3F35] selection:text-white overflow-x-hidden">
      <main className="pt-20">

        {/* --- 1. HERO SECTION (Clear Positioning) --- */}
        <section className="relative min-h-[85vh] grid md:grid-cols-2">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center px-6 md:px-20 py-20 order-2 md:order-1">
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-xs font-bold uppercase tracking-widest animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                The Operator
              </div>

              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-[#0F3F35]">
                Stop dreaming. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-[#b45309]">Start building.</span>
              </h1>

              <p className="text-xl text-stone-600 leading-relaxed font-medium">
                I am Farjad. I help immigrant founders and serious business owners build real companies in Canada with strategy, systems, and honest execution.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[#0F3F35] hover:bg-[#092822] text-white text-base transition-transform hover:scale-105 shadow-xl shadow-[#0F3F35]/20">
                  <Link href="/services">View Services</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-stone-300 hover:border-[#D97706] hover:text-[#D97706] text-base transition-colors bg-transparent">
                  <Link href="/contact">Book a Strategy Call</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Founder Portrait */}
          <div className="relative h-[50vh] md:h-auto bg-stone-200 overflow-hidden order-1 md:order-2 group">
            <Image
              src="/images/BusinessConsultant-Team.jpg"
              alt="Farjad Pour Mohammad"
              fill
              className="object-cover transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-[#0F3F35]/20 group-hover:bg-transparent transition-colors duration-700" />

            {/* Authority Tag */}
            <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md px-6 py-4 shadow-2xl border-l-4 border-[#0F3F35] transform transition-transform duration-500 hover:-translate-y-2">
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#D97706] mb-1">
                Based In
              </p>
              <p className="font-serif text-xl tracking-tight text-[#0F3F35]">
                Toronto / Newmarket, CA
              </p>
            </div>
          </div>
        </section>

        {/* --- 2. CREDIBILITY STRIP (Proof) --- */}
        <section className="bg-[#0F3F35] py-12 border-y border-[#0F3F35]/80 relative overflow-hidden">
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-stone-700/50 md:divide-x">
              <div className="flex flex-col items-center justify-center space-y-2 px-4">
                <span className="text-4xl font-serif text-[#D97706] leading-none">15+</span>
                <span className="text-[11px] uppercase tracking-widest text-stone-300 font-bold">Years Building Systems</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 px-4">
                <span className="text-lg font-bold text-white uppercase tracking-wider">AshaVid</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400">Founder & CSO</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 px-4">
                <span className="text-lg font-bold text-white uppercase tracking-wider">DPF & HoFin</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400">Founder / Co-Founder</span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-1 px-4">
                <span className="text-lg font-bold text-white uppercase tracking-wider">VisaRoads</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400">Startup Mentor</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. THE CONTEXT (Positioning) --- */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-serif text-4xl text-[#0F3F35]">The Short Version</h2>
            <span className="hidden md:block text-stone-400 font-mono text-sm">{"/// CONTEXT_LOADED"}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1: Origin - Dark Green */}
            <div className="group bg-[#0F3F35] text-white p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#0F3F35]/30 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
              <MapPin className="w-10 h-10 mb-6 text-[#D97706]" />
              <h3 className="text-2xl font-bold mb-2">Origin: Iran to CA</h3>
              <p className="text-stone-300 leading-relaxed text-sm">
                Born in a culture that values deep, resilient work. Now operating in the Greater Toronto Area, bridging the execution gap for immigrant founders.
              </p>
            </div>

            {/* Card 2: Strategic Focus - Clean */}
            <div className="group bg-white border border-stone-200 p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:border-[#D97706] hover:shadow-xl hover:-translate-y-1">
              <Terminal className="w-10 h-10 mb-6 text-[#0F3F35]" />
              <h3 className="text-2xl font-bold mb-2 text-[#0F3F35]">Current Focus</h3>
              <ul className="space-y-3 text-stone-600 mt-4 text-sm font-medium">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full" /> Software Architecture & IT Systems</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full" /> Startup SUV Mentorship</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full" /> Digital Transformation for SMEs</li>
              </ul>
            </div>

            {/* Card 3: Anti-Goals - Burnt Orange Accent */}
            <div className="group bg-[#FFF8F0] border border-[#D97706]/20 p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                <MousePointer2 className="w-40 h-40 text-[#D97706]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#9A3412]">What I Don&apos;t Do</h3>
              <p className="text-[#9A3412]/80 font-medium leading-relaxed relative z-10 text-sm">
                I don&apos;t sell &quot;guaranteed&quot; PR. <br />
                I don&apos;t use fake traction numbers. <br />
                I don&apos;t work with tourists looking for shortcuts or fake business shells.
              </p>
            </div>
          </div>
        </section>

        {/* --- 4. THE NARRATIVE (Concrete Story) --- */}
        <section className="py-24 bg-[#1C1917] text-stone-200 relative overflow-hidden">
          {/* Abstract Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
            fill
            className="object-cover opacity-10 mix-blend-overlay pointer-events-none"
            alt="Abstract Texture"
          />

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <Badge className="bg-[#D97706] text-white border-none mb-6 pointer-events-none">The Trajectory</Badge>
              <h2 className="font-serif text-4xl md:text-5xl text-white">Why I chose the hard path.</h2>
            </div>

            <div className="space-y-10 text-lg md:text-xl leading-relaxed font-light text-stone-300">
              <p>
                My background is an intersection of <strong className="text-white font-medium">technology and anthropology</strong>. Having worked as a CTO and built startups across both Iran and Canada, I learned early on that code alone doesn&apos;t solve human problems.
              </p>

              <p className="text-white font-medium pl-6 py-2 border-l-2 border-[#D97706] bg-[#D97706]/5 rounded-r">
                When I moved to Canada, I saw brilliant immigrant founders failing—not because their ideas were bad, but because they didn&apos;t understand the cultural and operational landscape. Worse, I saw serious people losing their life savings to consultants selling &quot;easy visas&quot; rather than building real companies.
              </p>

              <p>
                I realized that <strong>clarity</strong> is what people were missing. The industry is saturated with &quot;motivation&quot; and hype, but severely lacking in practical, engineering-grade <strong>systems</strong>.
              </p>

              <p>
                So I stopped trying to please everyone. I dedicated my work to bridging the execution gap. I only work with the builders—the ones who care about the craft, the actual product, and building something enduring in a new country.
              </p>
            </div>
          </div>
        </section>

        {/* --- 5. SELECTED WORK DOMAINS --- */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-stone-200">
          <h2 className="font-serif text-4xl text-[#0F3F35] mb-12">Selected Work Domains</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Domain 1 */}
            <Link href="/services/founder-mentorship" className="group block p-8 rounded-2xl border border-stone-200 bg-white hover:border-[#0F3F35] hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#0F3F35]/5 flex items-center justify-center text-[#0F3F35] mb-6 group-hover:bg-[#0F3F35] group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F3F35] mb-3">Founder Mentorship</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Pre-seed strategy, product-market validation, and mental sparring for early-stage teams aiming to scale.
              </p>
              <span className="text-sm font-bold text-[#D97706] flex items-center group-hover:translate-x-1 transition-transform">
                Read More <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>

            {/* Domain 2 */}
            <Link href="/services/immigrant-founders" className="group block p-8 rounded-2xl border border-stone-200 bg-white hover:border-[#0F3F35] hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#0F3F35]/5 flex items-center justify-center text-[#0F3F35] mb-6 group-hover:bg-[#0F3F35] group-hover:text-white transition-colors">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F3F35] mb-3">Startup Visa Strategy</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Guiding immigrant founders to build legitimate, high-growth companies in Canada—not shell corporations.
              </p>
              <span className="text-sm font-bold text-[#D97706] flex items-center group-hover:translate-x-1 transition-transform">
                Read More <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>

            {/* Domain 3 */}
            <Link href="/services/business-automation" className="group block p-8 rounded-2xl border border-stone-200 bg-white hover:border-[#0F3F35] hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#0F3F35]/5 flex items-center justify-center text-[#0F3F35] mb-6 group-hover:bg-[#0F3F35] group-hover:text-white transition-colors">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F3F35] mb-3">Systems & AI</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Digital transformation, workflow automation, and custom AI integration for modernizing local SMEs.
              </p>
              <span className="text-sm font-bold text-[#D97706] flex items-center group-hover:translate-x-1 transition-transform">
                Read More <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </Link>

          </div>
        </section>

        {/* --- 6. EDUCATION & PROFESSIONAL DEVELOPMENT --- */}
        <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto border-b border-stone-200">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl text-[#0F3F35] mb-6">Education & Development</h2>
            <p className="text-lg text-stone-600 leading-relaxed font-medium">
              My academic background in anthropology shaped the way I understand founders, systems, and human behavior inside organizations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">

            {/* Education Timeline */}
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-lg bg-[#0F3F35]/5 flex items-center justify-center text-[#0F3F35]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl text-[#0F3F35]">Education</h3>
              </div>

              <div className="space-y-10 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:ml-[5px] md:before:translate-x-0 before:h-full before:w-[2px] before:bg-stone-200">
                {EDUCATION.map((edu, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full bg-[#0F3F35] ring-4 ring-[#FDFBF7]" />
                    <h4 className="font-bold text-lg text-[#0F3F35] mb-1 leading-tight">{edu.degree}</h4>
                    <p className="text-stone-600 font-medium text-sm mb-1">{edu.institution}</p>
                    <p className="font-mono text-xs text-[#D97706] mb-3">{edu.years}</p>
                    <p className="text-stone-500 text-sm leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Certifications */}
            <div>
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-lg bg-[#D97706]/10 flex items-center justify-center text-[#D97706]">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl text-[#0F3F35]">Professional Development</h3>
              </div>

              <div className="space-y-8">
                {CERTIFICATIONS.map((cert, idx) => (
                  <div key={idx} className="group p-6 rounded-2xl border border-stone-200 bg-white hover:border-[#D97706]/30 hover:shadow-md transition-all">
                    <h4 className="font-bold text-[#0F3F35] mb-2 leading-tight">{cert.title}</h4>
                    <p className="text-stone-600 text-sm mb-3">{cert.institution}</p>
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-stone-100 rounded text-xs font-mono text-stone-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400" /> {cert.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* --- 7. THE HUMAN LAYER (Beyond Work) --- */}
        <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-[#0F3F35] mb-6">Beyond the Architecture</h2>
          <div className="w-16 h-1 bg-[#D97706] mx-auto mb-10" />

          <p className="text-lg text-stone-600 leading-relaxed font-medium mb-12">
            I don&apos;t just view the world through lines of code. The best systems are built by understanding human nature.
            My work is heavily informed by <strong className="text-[#0F3F35]">anthropology</strong>, documenting life through <strong className="text-[#0F3F35]">photography</strong>,
            and the profound responsibility of <strong className="text-[#0F3F35]">fatherhood</strong>. I believe in cross-cultural lenses—taking the deep-rooted resilience of Iran and combining it with the structured opportunity of Canada.
          </p>

          <div className="flex justify-center gap-6 text-stone-400">
            <Camera className="w-8 h-8 opacity-50" />
            <Layers className="w-8 h-8 opacity-50" />
            <Globe2 className="w-8 h-8 opacity-50" />
          </div>
        </section>

        {/* --- 8. FOOTER / CTA --- */}
        <section className="py-20 bg-[#F5F5F4] border-t border-stone-200 text-center">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-serif text-3xl text-[#0F3F35] mb-6">Ready to do the work?</h2>
            <p className="text-stone-600 mb-8 text-lg">
              The library is open. No subscription fees, no hidden agenda. Just read, think, and build.
              Or, if you are ready to accelerate, let&apos;s talk.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild className="rounded-full bg-[#0F3F35] h-12 px-8 text-white hover:bg-[#092822]">
                <Link href="/services">See How I Can Help</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full h-12 px-8 border-stone-300 text-stone-600 hover:text-[#D97706] bg-white">
                <Link href="/tools">Access Free Tools</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}