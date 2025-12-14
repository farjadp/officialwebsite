import React from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, BookOpen, Anchor, MapPin, ArrowUpRight, Feather } from "lucide-react"
import Link from "next/link"

// --- 1. Content Data (Curated & Serious) ---

const FEATURED_COLLECTIONS = [
  {
    id: 'c1',
    label: "Essential Guide",
    title: "The Immigrant Founder's Playbook",
    description: "Navigating the psychological warfare of building a business while your visa is ticking.",
    stats: "8 Essays",
    theme: "bg-[#1B4B43] text-white", // Dark Jungle Green
    link: "/series/immigrant-founder"
  },
  {
    id: 'c2',
    label: "Mental Models",
    title: "Thinking in Chaos",
    description: "Tools to separate signal from noise when everything is burning.",
    stats: "12 Notes",
    theme: "bg-[#F0EFEA] text-[#1C1917]", // Paper color
    link: "/series/mental-models"
  },
  {
    id: 'c3',
    label: "System",
    title: "Startup Visa Reality",
    description: "For investors & co-founders. The unsexy truth about compliance and PR.",
    stats: "Documentation",
    theme: "bg-[#E7E5E4] text-[#1C1917]", // Stone-200
    link: "/series/startup-visa"
  }
]

const ESSAYS = [
  {
    id: 'e1',
    date: 'Nov 02',
    year: '2023',
    title: 'Why "Passion" is a Dangerous Metric',
    excerpt: 'In the trenches of a startup, discipline and customer obsession outlast raw emotion every time.',
    tag: 'Psychology',
    readTime: '6 min read'
  },
  {
    id: 'e2',
    date: 'Oct 24',
    year: '2023',
    title: 'The Loneliness of Scale',
    excerpt: 'As your team grows, your circle of honest peers shrinks. How to handle the isolation.',
    tag: 'Leadership',
    readTime: '8 min read'
  },
  {
    id: 'e3',
    date: 'Sep 15',
    year: '2023',
    title: 'Writing Code vs. Writing Prose',
    excerpt: 'Why every engineer should write essays, and why every writer should learn logic.',
    tag: 'Craft',
    readTime: '5 min read'
  }
]

export default function FarjadEditorialHome() {
  return (
    // Base: "Paper" Background with subtle noise texture
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white">
      
      {/* Texture Overlay (Grain) */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* --- Header / Nav --- */}
      <header className="relative z-10 pt-8 pb-8 px-6 md:px-12 border-b border-[#E7E5E4]/60">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo / Name */}
          <div className="flex flex-col">
            <span className="font-serif font-bold text-2xl tracking-tight leading-none text-[#1B4B43]">Farjad.</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-1">Idea Library</span>
          </div>

          {/* Minimal Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <Link href="/essays" className="hover:text-[#1B4B43] transition-colors">Essays</Link>
            <Link href="/series" className="hover:text-[#1B4B43] transition-colors">Series</Link>
            <Link href="/about" className="hover:text-[#1B4B43] transition-colors">About</Link>
            <Link href="/newsletter" className="ml-4 px-4 py-2 rounded-full border border-stone-300 hover:border-[#1B4B43] hover:text-[#1B4B43] transition-all text-xs uppercase tracking-wider font-bold">
              Subscribe
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 px-6 md:px-12 max-w-6xl mx-auto">

        {/* --- 1. Editorial Hero Section --- */}
        <section className="py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left: The Manifesto */}
          <div className="md:col-span-8 space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1B4B43]/80 border-b border-[#1B4B43]/20 pb-1">
              <MapPin className="w-3 h-3" /> Toronto, CA
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-[#111827]">
              Building a real life <br />
              <span className="italic text-stone-500 font-light">requires</span> honest work.
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-600 leading-relaxed max-w-2xl font-light">
              A personal library for founders and immigrants who are tired of fantasies. 
              Here, I write about the <strong className="font-medium text-[#1B4B43]">systems</strong>, <strong className="font-medium text-[#1B4B43]">psychology</strong>, and <strong className="font-medium text-[#1B4B43]">trade-offs</strong> of building a business.
            </p>

            <div className="pt-6 flex gap-6">
              <Button className="bg-[#1B4B43] hover:bg-[#133832] text-white rounded-none px-8 h-14 text-base tracking-wide font-medium shadow-xl shadow-[#1B4B43]/10">
                Start Reading
              </Button>
              <Button variant="link" className="text-stone-600 hover:text-[#1B4B43] h-14 text-base font-normal underline decoration-stone-300 underline-offset-4 decoration-1">
                Explore Topics
              </Button>
            </div>
          </div>

          {/* Right: "Current Status" Card */}
          <div className="md:col-span-4 mt-8 md:mt-4">
             <div className="bg-white border border-stone-200 p-6 shadow-[8px_8px_0px_0px_rgba(231,229,228,0.5)] rotate-1 hover:rotate-0 transition-transform duration-500">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Current Focus</h3>
                <ul className="space-y-4 text-sm text-stone-700">
                  <li className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 bg-[#1B4B43] rounded-full mt-1.5 shrink-0" />
                    <span>Mentoring 3 immigrant-led startups on GTM strategy.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="w-1.5 h-1.5 bg-stone-300 rounded-full mt-1.5 shrink-0" />
                    <span>Writing a deep-dive on "Survivor Bias".</span>
                  </li>
                </ul>
             </div>
          </div>
        </section>


        {/* --- 2. Bento Grid Collections --- */}
        <section className="py-16 border-t border-stone-200">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">Curated Collections</h2>
            <span className="hidden md:block text-stone-400 text-sm font-mono">/ SELECTED WORKS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[400px]">
            {/* Main Featured Item */}
            <Link href={FEATURED_COLLECTIONS[0].link} className={`md:col-span-2 relative group overflow-hidden p-8 flex flex-col justify-between ${FEATURED_COLLECTIONS[0].theme} transition-all duration-500 hover:shadow-2xl`}>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <Badge variant="outline" className="border-white/20 text-white/80 font-normal tracking-wider mb-4">
                  {FEATURED_COLLECTIONS[0].label}
                </Badge>
                <h3 className="font-serif text-3xl md:text-5xl leading-tight mb-4">
                  {FEATURED_COLLECTIONS[0].title}
                </h3>
              </div>
              <p className="text-white/80 max-w-md text-lg leading-relaxed">
                {FEATURED_COLLECTIONS[0].description}
              </p>
            </Link>

            {/* Side Items */}
            <div className="flex flex-col gap-4 h-full">
              {FEATURED_COLLECTIONS.slice(1).map((col) => (
                 <Link key={col.id} href={col.link} className={`flex-1 p-6 flex flex-col justify-between group transition-colors duration-300 ${col.theme} hover:brightness-95`}>
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">{col.label}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl mb-2 font-medium">{col.title}</h3>
                      <p className="text-sm opacity-70 leading-snug">{col.description}</p>
                    </div>
                 </Link>
              ))}
            </div>
          </div>
        </section>


        {/* --- 3. The Essay List (Minimalist) --- */}
        <section className="py-24 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-[#111827] mb-4">Latest Writings</h2>
            <div className="h-1 w-12 bg-[#1B4B43] mx-auto" />
          </div>

          <div className="space-y-12">
            {ESSAYS.map((essay) => (
              <article key={essay.id} className="group relative grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline border-b border-stone-200 pb-12 last:border-0 hover:opacity-100 transition-opacity">
                {/* Date Side */}
                <div className="md:col-span-2 text-stone-400 font-mono text-sm text-right md:pr-4">
                  <span className="block text-stone-900 font-bold">{essay.date}</span>
                  <span>{essay.year}</span>
                </div>

                {/* Content Side */}
                <div className="md:col-span-10 space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B4B43] bg-[#1B4B43]/5 px-2 py-1 rounded-sm">
                      {essay.tag}
                    </span>
                    <span className="text-xs text-stone-400 font-serif italic">{essay.readTime}</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl md:text-3xl text-[#111827] group-hover:text-[#1B4B43] transition-colors cursor-pointer">
                    <Link href={`/essay/${essay.id}`}>{essay.title}</Link>
                  </h3>
                  
                  <p className="text-stone-600 text-lg leading-relaxed max-w-2xl">
                    {essay.excerpt}
                  </p>
                  
                  <div className="pt-2">
                    <Link href={`/essay/${essay.id}`} className="inline-flex items-center text-sm font-bold text-[#111827] border-b border-[#111827] pb-0.5 hover:text-[#1B4B43] hover:border-[#1B4B43] transition-colors">
                      Read Essay
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-none border-stone-300 hover:bg-stone-50 text-stone-600">
              View Archive
            </Button>
          </div>
        </section>


        {/* --- 4. The "Personal Letter" Footer (Newsletter) --- */}
        <section className="py-24 border-t border-stone-200">
          <div className="bg-[#111827] text-stone-200 p-8 md:p-16 relative overflow-hidden">
             {/* Abstract shape */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div>
                   <Feather className="w-8 h-8 text-stone-400 mb-6" />
                   <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                     Join the inner circle.
                   </h2>
                   <p className="text-stone-400 text-lg leading-relaxed max-w-md">
                     I send one email a week. It contains honest notes on building businesses and mental models for life. No spam.
                   </p>
                </div>

                <div className="bg-white/5 p-6 backdrop-blur-sm border border-white/10 rounded-sm">
                  <form className="flex flex-col gap-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Email Address</label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="founder@example.com" 
                        className="bg-transparent border-white/20 text-white placeholder:text-stone-600 h-12 focus-visible:ring-stone-500"
                      />
                      <Button className="bg-white text-black hover:bg-stone-200 h-12 px-6">
                        Send
                      </Button>
                    </div>
                    <p className="text-xs text-stone-500 mt-2">
                      "Honesty is the only currency that matters."
                    </p>
                  </form>
                </div>
             </div>
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400 uppercase tracking-widest font-medium">
            <span>© 2024 Farjad — Toronto, Canada.</span>
            <div className="flex gap-6 mt-4 md:mt-0">
               <Link href="#" className="hover:text-[#1B4B43]">Twitter</Link>
               <Link href="#" className="hover:text-[#1B4B43]">LinkedIn</Link>
               <Link href="#" className="hover:text-[#1B4B43]">RSS</Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}