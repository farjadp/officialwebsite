// ============================================================================
// File Path: src/app/about/page.tsx
// Version: 3.0.0 — The "Modern Editorial" Redesign
// Why: Adds visual richness, photography, and interaction while keeping the "Sage" trust.
// Style: High-end Magazine (Think: Monocle, HBR, The Atlantic).
// Features:
//    - Split-screen Hero with photography.
//    - "Grayscale to Color" hover effects (sophisticated interaction).
//    - Richer color palette (Deep Jungle, Burnt Orange, Warm Sand).
// ============================================================================

import React from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Terminal, 
  Compass, 
  Cpu, 
  ArrowRight, 
  Quote, 
  Layers,
  MousePointer2
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPageInteractive() {
  return (
    // Base: Warm "Alabaster" background for a premium feel
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#0F3F35] selection:text-white overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-[#0F3F35]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link href="/" className="font-serif font-black text-2xl tracking-tighter text-[#0F3F35]">
            FARJAD<span className="text-[#D97706]">.</span>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-bold tracking-wide uppercase text-stone-600">
            <Link href="/" className="hover:text-[#D97706] transition-colors">Home</Link>
            <Link href="/essays" className="hover:text-[#D97706] transition-colors">Essays</Link>
            <Link href="/about" className="text-[#0F3F35]">About</Link>
          </nav>
          <Button className="rounded-full bg-[#0F3F35] hover:bg-[#092822] text-white px-6">
            Get in touch
          </Button>
        </div>
      </header>

      <main className="pt-20">

        {/* --- 1. HERO SECTION (Split Screen + Image) --- */}
        <section className="relative min-h-[90vh] grid md:grid-cols-2">
          
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center px-6 md:px-20 py-20 order-2 md:order-1">
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706] text-xs font-bold uppercase tracking-widest animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse"/>
                The Philosophy
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl leading-[1] text-[#0F3F35]">
                Stop dreaming. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-[#b45309]">Start building.</span>
              </h1>
              
              <p className="text-xl text-stone-600 leading-relaxed font-medium">
                I am Farjad. I help immigrant founders and serious business owners navigate the chaos of building a life in a new country.
                <br className="mb-4 block"/>
                No hype. No fake numbers. Just engineering applied to reality.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 rounded-full bg-[#0F3F35] hover:bg-[#092822] text-white text-base transition-transform hover:scale-105 shadow-xl shadow-[#0F3F35]/20">
                  Read My Story
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 rounded-full border-stone-300 hover:border-[#D97706] hover:text-[#D97706] text-base transition-colors bg-transparent">
                  Explore Essays
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Interactive Image (Grayscale to Color) */}
          <div className="relative h-[50vh] md:h-auto bg-stone-200 overflow-hidden order-1 md:order-2 group">
            {/* Placeholder for Founder Portrait - Replace src with real image */}
            {/* Using an abstract architecture image for now to represent 'structure' */}
            <img 
              src="https://images.unsplash.com/photo-1485627941502-d2e6429fa2c0?q=80&w=2072&auto=format&fit=crop" 
              alt="Structure and Building"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#0F3F35]/20 group-hover:bg-transparent transition-colors duration-700" />
            
            {/* Floating Card */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 max-w-xs shadow-2xl border-l-4 border-[#D97706] transform transition-transform duration-500 hover:-translate-y-2">
              <Quote className="w-8 h-8 text-[#D97706] mb-2 opacity-50" />
              <p className="font-serif text-lg leading-tight text-[#0F3F35]">
                "Clarity is the most expensive asset for a founder."
              </p>
            </div>
          </div>
        </section>


        {/* --- 2. THE CONTEXT (Colorful Bento Grid) --- */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-serif text-4xl text-[#0F3F35]">The Short Version</h2>
            <span className="hidden md:block text-stone-400 font-mono text-sm">/// CONTEXT_LOADED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Origin - Dark Green */}
            <div className="group bg-[#0F3F35] text-white p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#0F3F35]/30 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
              <MapPin className="w-10 h-10 mb-6 text-[#D97706]" />
              <h3 className="text-2xl font-bold mb-2">Origin: Iran</h3>
              <p className="text-stone-300 leading-relaxed">
                Born and raised in a culture that values deep work. Now operating in Toronto, bridging the gap between two worlds.
              </p>
            </div>

            {/* Card 2: Focus - White/Clean */}
            <div className="group bg-white border border-stone-200 p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:border-[#D97706] hover:shadow-xl hover:-translate-y-1">
              <Terminal className="w-10 h-10 mb-6 text-[#0F3F35]" />
              <h3 className="text-2xl font-bold mb-2 text-[#0F3F35]">Current Focus</h3>
              <ul className="space-y-2 text-stone-600 mt-4">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full" /> Startup Mentorship</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full" /> Visa Strategy</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D97706] rounded-full" /> AI for SMEs</li>
              </ul>
            </div>

            {/* Card 3: Anti-Goals - Burnt Orange Accent */}
            <div className="group bg-[#FFF8F0] border border-[#D97706]/20 p-8 rounded-2xl relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                 <MousePointer2 className="w-40 h-40 text-[#D97706]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#9A3412]">What I Don't Do</h3>
              <p className="text-[#9A3412]/80 font-medium leading-relaxed relative z-10">
                I don't sell "guaranteed" PR. <br/>
                I don't use fake numbers. <br/>
                I don't work with tourists looking for shortcuts.
              </p>
            </div>
          </div>
        </section>


        {/* --- 3. THE NARRATIVE (Scrollytelling Vibe) --- */}
        <section className="py-24 bg-[#1C1917] text-stone-200 relative overflow-hidden">
           {/* Abstract Background Image */}
           <img 
             src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
             className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
             alt="Abstract Texture"
           />
           
           <div className="max-w-4xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                 <Badge className="bg-[#D97706] text-white border-none hover:bg-[#b45309] mb-6">The Journey</Badge>
                 <h2 className="font-serif text-4xl md:text-6xl text-white">Why I chose the hard path.</h2>
              </div>

              <div className="space-y-12 text-lg md:text-xl leading-relaxed font-light text-stone-300">
                <p>
                  When I moved to Canada, I saw the "Instagram version" of startup life: pitch competitions, hoodies, and endless coffee meetings.
                </p>
                <p className="text-white font-medium pl-6 border-l-2 border-[#D97706]">
                  But I also saw the brutal reality. Brilliant founders failing because they didn't understand the culture. Serious people losing their savings to consultants selling "easy visas."
                </p>
                <p>
                  I realized that <strong>clarity</strong> is what people were missing. Everyone was selling "motivation," but nobody was explaining the <strong>systems</strong>.
                </p>
                <p>
                  So I stopped trying to please everyone. I decided to work only with the builders. The ones who care about the craft, not just the exit.
                </p>
              </div>
           </div>
        </section>


        {/* --- 4. INTERACTIVE FOCUS AREAS (Image Reveal) --- */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl text-[#0F3F35] mb-12">How I can help.</h2>
          
          <div className="flex flex-col gap-4">
            {/* Item 1 */}
            <Link href="/mentorship" className="group relative h-40 md:h-52 w-full overflow-hidden rounded-2xl flex items-center px-8 md:px-16 border border-stone-200">
               {/* Background Image that appears on hover */}
               <img 
                 src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" 
                 className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500 scale-105 group-hover:scale-100"
                 alt="Meeting"
               />
               <div className="absolute inset-0 bg-[#0F3F35] opacity-0 group-hover:opacity-90 transition-opacity duration-500" />
               
               <div className="relative z-10 flex justify-between items-center w-full">
                 <div>
                   <h3 className="text-2xl md:text-4xl font-bold text-[#0F3F35] group-hover:text-white transition-colors duration-300">Founder Mentorship</h3>
                   <p className="text-stone-500 group-hover:text-stone-300 mt-2 transition-colors duration-300">Pre-seed strategy & mental sparring.</p>
                 </div>
                 <ArrowRight className="w-8 h-8 text-[#D97706] transform group-hover:translate-x-2 transition-transform duration-300" />
               </div>
            </Link>

            {/* Item 2 */}
            <Link href="/immigration" className="group relative h-40 md:h-52 w-full overflow-hidden rounded-2xl flex items-center px-8 md:px-16 border border-stone-200">
               <img 
                 src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" 
                 className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500 scale-105 group-hover:scale-100"
                 alt="Travel"
               />
               <div className="absolute inset-0 bg-[#0F3F35] opacity-0 group-hover:opacity-90 transition-opacity duration-500" />
               
               <div className="relative z-10 flex justify-between items-center w-full">
                 <div>
                   <h3 className="text-2xl md:text-4xl font-bold text-[#0F3F35] group-hover:text-white transition-colors duration-300">The Immigrant Path</h3>
                   <p className="text-stone-500 group-hover:text-stone-300 mt-2 transition-colors duration-300">Building real companies, not visa shells.</p>
                 </div>
                 <ArrowRight className="w-8 h-8 text-[#D97706] transform group-hover:translate-x-2 transition-transform duration-300" />
               </div>
            </Link>

            {/* Item 3 */}
            <Link href="/digital" className="group relative h-40 md:h-52 w-full overflow-hidden rounded-2xl flex items-center px-8 md:px-16 border border-stone-200">
               <img 
                 src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" 
                 className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-20 transition-opacity duration-500 scale-105 group-hover:scale-100"
                 alt="Technology"
               />
               <div className="absolute inset-0 bg-[#0F3F35] opacity-0 group-hover:opacity-90 transition-opacity duration-500" />
               
               <div className="relative z-10 flex justify-between items-center w-full">
                 <div>
                   <h3 className="text-2xl md:text-4xl font-bold text-[#0F3F35] group-hover:text-white transition-colors duration-300">Systems & AI</h3>
                   <p className="text-stone-500 group-hover:text-stone-300 mt-2 transition-colors duration-300">Modernizing SMEs with honest tech.</p>
                 </div>
                 <ArrowRight className="w-8 h-8 text-[#D97706] transform group-hover:translate-x-2 transition-transform duration-300" />
               </div>
            </Link>
          </div>
        </section>


        {/* --- 5. FOOTER / CTA --- */}
        <section className="py-20 bg-[#F5F5F4] border-t border-stone-200 text-center">
           <div className="max-w-2xl mx-auto px-6">
             <Layers className="w-12 h-12 text-[#D97706] mx-auto mb-6" />
             <h2 className="font-serif text-3xl text-[#0F3F35] mb-6">Ready to do the work?</h2>
             <p className="text-stone-600 mb-8 text-lg">
                The library is open. No subscription fees, no hidden agenda. Just read, think, and build.
             </p>
             <div className="flex justify-center gap-4">
               <Button className="rounded-full bg-[#0F3F35] h-12 px-8 text-white hover:bg-[#092822]">
                 Start Here
               </Button>
               <Button variant="outline" className="rounded-full h-12 px-8 border-stone-300 text-stone-600 hover:text-[#D97706]">
                 Read Newsletter
               </Button>
             </div>
             <p className="mt-16 text-xs text-stone-400 font-mono tracking-widest">
               © {new Date().getFullYear()} FARJAD — TORONTO, CA.
             </p>
           </div>
        </section>

      </main>
    </div>
  )
}