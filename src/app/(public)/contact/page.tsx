// ============================================================================
// File Path: src/app/contact/page.tsx
// Version: 3.0.0 — Corrected Identity: The "Scholar's Desk"
// Identity: Sage / Mentor / Personal Library.
// Vibe: "Writing a letter to a mentor", not "Submitting a ticket".
// Colors:
//    - Background: #FDFCF8 (Warm Paper)
//    - Ink: #1C1917 (Dark Stone)
//    - Accent: #1B4B43 (Deep Jungle Green - The Brand Signature)
//    - Paper Lines: #E7E5E4 (Subtle borders)
// ============================================================================

import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  MapPin, 
  ArrowRight, 
  Clock,
  PenTool,
  BookOpen
} from "lucide-react"
import Link from "next/link"

export default function ContactSageStyle() {
  return (
    // ROOT: Warm Paper Background with Noise Texture
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white">
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* --- HEADER (Consistent with About Page) --- */}
      <header className="relative z-10 pt-8 pb-8 px-6 md:px-12 border-b border-[#1B4B43]/10 bg-[#FDFCF8]/90 backdrop-blur-sm sticky top-0">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex flex-col group">
            <span className="font-serif font-bold text-2xl tracking-tight leading-none text-[#1B4B43] group-hover:opacity-80 transition-opacity">Farjad.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <Link href="/" className="hover:text-[#1B4B43] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[#1B4B43] transition-colors">About</Link>
            <span className="text-[#1B4B43] font-bold border-b border-[#1B4B43]">Correspondence</span>
          </nav>
        </div>
      </header>

      <main className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto py-16 md:py-24">

        {/* --- HERO SECTION --- */}
        <div className="mb-16 md:mb-24 max-w-2xl">
          <span className="font-mono text-xs text-[#1B4B43] uppercase tracking-widest mb-4 block">
            /// Correspondence
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#111827] leading-[1.1] mb-6">
            The door is open for <br/>
            <span className="italic text-stone-500 font-light">serious inquiries.</span>
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed font-light">
            I value clarity and brevity. Whether you are a founder seeking guidance or a business owner looking for systems, tell me specifically what you are building.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">
          
          {/* --- LEFT COLUMN: Context & Etiquette (The "Sage" Rules) --- */}
          <div className="md:col-span-5 space-y-12">
            
            {/* Box 1: Response Time */}
            <div className="bg-[#F5F5F4] p-8 border-l-2 border-[#1B4B43]">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-[#1B4B43]" />
                <h3 className="font-serif text-lg font-bold text-[#111827]">Response Time</h3>
              </div>
              <p className="text-sm text-stone-600 leading-relaxed">
                I review my inbox personally twice a week. If your message is clear and relevant, expect a reply within <strong>3-4 business days</strong>.
              </p>
            </div>

            {/* Box 2: The Filter (Polite but Firm) */}
            <div className="space-y-6">
              <h3 className="font-serif text-xl text-[#111827]">Before you write...</h3>
              <ul className="space-y-4">
                <li className="flex gap-4 items-start">
                  <span className="font-mono text-[#1B4B43] text-sm mt-1">01.</span>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    <strong>Be specific.</strong> Vague messages like "I have an idea" usually get archived. Tell me the problem, the context, and the ask.
                  </p>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="font-mono text-[#1B4B43] text-sm mt-1">02.</span>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    <strong>No "Coffee Chats".</strong> I reserve my deep work time strictly. I do not do brainstorming sessions over coffee with strangers.
                  </p>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="font-mono text-[#1B4B43] text-sm mt-1">03.</span>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    <strong>Visa Inquiries:</strong> If you are looking for a "guaranteed" visa, I am not your guy. If you want to build a compliant business, proceed.
                  </p>
                </li>
              </ul>
            </div>

            {/* Box 3: Physical Presence (Subtle) */}
            <div className="pt-8 border-t border-[#1B4B43]/10">
               <div className="flex items-center gap-3 text-stone-500 text-sm font-mono uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />
                  <span>Based in Toronto, CA</span>
               </div>
               <div className="flex items-center gap-3 text-stone-500 text-sm font-mono uppercase tracking-widest mt-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:hello@farjad.co" className="hover:text-[#1B4B43] transition-colors">hello@farjad.co</a>
               </div>
            </div>

          </div>


          {/* --- RIGHT COLUMN: The Letter Form --- */}
          <div className="md:col-span-7 bg-white p-8 md:p-12 border border-stone-200 shadow-[8px_8px_0px_0px_rgba(231,229,228,0.5)]">
            
            <form className="space-y-8">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-[#111827]">Send a note</h3>
                <p className="text-sm text-stone-400">Fields marked with * are required.</p>
              </div>

              {/* Name Field */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 group-focus-within:text-[#1B4B43] transition-colors">
                  Your Name *
                </label>
                <Input 
                  className="border-0 border-b border-stone-300 rounded-none px-0 h-12 bg-transparent focus-visible:ring-0 focus-visible:border-[#1B4B43] placeholder:text-stone-300 transition-colors text-lg" 
                  placeholder="e.g. Arash Kamali"
                />
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 group-focus-within:text-[#1B4B43] transition-colors">
                  Email Address *
                </label>
                <Input 
                  type="email"
                  className="border-0 border-b border-stone-300 rounded-none px-0 h-12 bg-transparent focus-visible:ring-0 focus-visible:border-[#1B4B43] placeholder:text-stone-300 transition-colors text-lg" 
                  placeholder="name@company.com"
                />
              </div>

              {/* Topic Selection */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 group-focus-within:text-[#1B4B43] transition-colors">
                  Subject *
                </label>
                <select className="w-full border-0 border-b border-stone-300 rounded-none px-0 h-12 bg-transparent focus:ring-0 focus:border-[#1B4B43] text-stone-600 text-lg cursor-pointer">
                  <option value="" disabled selected>Select a topic...</option>
                  <option value="mentorship">Founder Mentorship (Active Startups)</option>
                  <option value="immigration">Immigration Strategy / Startup Visa</option>
                  <option value="consulting">SME Digital Consulting</option>
                  <option value="other">General Inquiry</option>
                </select>
              </div>

              {/* Message Field */}
              <div className="group">
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 group-focus-within:text-[#1B4B43] transition-colors">
                  The Message *
                </label>
                <Textarea 
                  className="border-0 border-b border-stone-300 rounded-none px-0 min-h-[150px] bg-transparent focus-visible:ring-0 focus-visible:border-[#1B4B43] placeholder:text-stone-300 transition-colors text-lg resize-y leading-relaxed" 
                  placeholder="I am building X for Y. We are struggling with Z..."
                />
              </div>

              <div className="pt-6">
                <Button className="bg-[#1B4B43] hover:bg-[#133832] text-white h-14 px-8 text-base font-medium w-full md:w-auto shadow-xl shadow-[#1B4B43]/10">
                  Send Correspondence <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <p className="text-xs text-stone-400 mt-4 text-center md:text-left">
                  Honesty is the only currency here. No spam, ever.
                </p>
              </div>
            </form>

          </div>
        </div>

        {/* --- FOOTER SECTION --- */}
        <section className="mt-24 pt-10 border-t border-[#1B4B43]/10 text-center">
           <div className="inline-block p-4 bg-[#F5F5F4] rounded-full mb-6">
              <PenTool className="w-6 h-6 text-[#1B4B43] opacity-60" />
           </div>
           <p className="text-stone-500 max-w-lg mx-auto mb-8 font-light italic">
             "Writing is the process of discovering what you believe."
           </p>
           
           <div className="flex justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-stone-400">
             <Link href="#" className="hover:text-[#1B4B43]">Twitter / X</Link>
             <Link href="#" className="hover:text-[#1B4B43]">LinkedIn</Link>
             <Link href="#" className="hover:text-[#1B4B43]">RSS Feed</Link>
           </div>
           
           <p className="mt-8 text-[10px] text-stone-300 font-mono">
             © 2025 Farjad. Toronto, Canada.
           </p>
        </section>

      </main>
    </div>
  )
}