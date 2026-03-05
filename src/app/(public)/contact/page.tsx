// ============================================================================
// File Path: src/app/contact/page.tsx
// Version: 3.0.0 — The "Hub" Redesign
// Why: Centralizes all digital footprints into a cohesive, high-design interface.
// Style: Modern Editorial / Bento Grid.
// Colors: 
//    - Background: #FDFCF8 (Warm Paper)
//    - Text: #1C1917 (Dark Stone)
//    - Accent: #1B4B43 (Deep Jungle Green)
//    - Highlight: #D97706 (Burnt Orange)
// ============================================================================

import React from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for mentorship, consulting, or speaking engagements.",
};
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  MapPin,
  ArrowRight,
  Globe,
  Phone,
  Send,
  Youtube,
  Instagram,
  Linkedin,
  Quote,
  TrendingUp,
  Briefcase,
  Users,
  ExternalLink,
  MessageCircle
} from "lucide-react"
import Link from "next/link"

// --- DATA ---
const SOCIAL_LINKS = [
  { name: "Hero's Journey", url: "https://t.me/Heros_Journey", icon: Send, color: "text-[#229ED9]", bg: "bg-[#229ED9]/10" },
  { name: "Farjad Talks (TG)", url: "https://t.me/FarjadTalks", icon: Send, color: "text-[#229ED9]", bg: "bg-[#229ED9]/10" },
  { name: "Farjad Talks (IG)", url: "https://instagram.com/FarjadTalks", icon: Instagram, color: "text-[#E1306C]", bg: "bg-[#E1306C]/10" },
  { name: "Farjad Talks (YT)", url: "https://youtube.com/@FarjadTalks", icon: Youtube, color: "text-[#FF0000]", bg: "bg-[#FF0000]/10" },
  { name: "LinkedIn Profile", url: "https://www.linkedin.com/in/farjadpourmohammad/", icon: Linkedin, color: "text-[#0077B5]", bg: "bg-[#0077B5]/10" },
];

const VENTURES = [
  { name: "Startup Visa Roads", url: "https://www.startupvisaroads.ca", role: "Consulting", desc: "Strategic immigration for founders." },
  { name: "AshaVid", url: "https://www.AshaVid.ca", role: "Advisory", desc: "Digital transformation & tech services." },
  { name: "NorthRoad VC", url: "https://www.NorthRoad.vc", role: "Investment", desc: "Venture capital for new pathways." },
  { name: "FarjadP.com", url: "https://www.farjadp.com", role: "Personal", desc: "Farsi content hub." },
];

const STATS = [
  { value: "22+", label: "Years Exp.", icon: Briefcase },
  { value: "100+", label: "Founders", icon: Users },
  { value: "5", label: "Ventures", icon: Globe },
  { value: "Real", label: "Results", icon: TrendingUp },
];

export default function ContactHub() {
  return (
    // ROOT: Warm Paper Background
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white pb-24 overflow-x-hidden">

      {/* Background Texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <main className="relative z-10 px-6 md:px-12 max-w-6xl mx-auto py-12 md:py-20">

        {/* --- 1. HEADER: THE PORTAL (Split with Portrait) --- */}
        <section className="mb-16 grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <div>
            <Badge variant="outline" className="mb-6 border-[#1B4B43]/30 text-[#1B4B43] rounded-full font-mono tracking-widest text-[10px] uppercase px-3 py-1 bg-[#1B4B43]/5">
              Connect & Explore
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl text-[#111827] leading-[1] mb-6 tracking-tight">
              The Digital <br />
              <span className="italic text-stone-500 font-light">Footprint.</span>
            </h1>
            <p className="text-xl text-stone-600 font-light leading-relaxed">
              Where to find me, follow my work, or get in touch directly.
            </p>
          </div>
          <div className="relative h-[300px] md:h-[350px] w-full rounded-sm overflow-hidden border border-stone-200 shadow-[8px_8px_0px_0px_rgba(27,75,67,0.1)] group">
            {/* Abstract Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity z-10" />
            {/* Placeholder Portrait Image */}
            <img
              src="/images/farjad-personalbranding.png"
              alt="Farjad Portrait Placeholder"
              className="object-cover object-center w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
          </div>
        </section>

        {/* --- 2. STATS GRID (Minimalist) --- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
          {STATS.map((stat, idx) => (
            <div key={idx} className="bg-white border border-stone-200 p-6 rounded-sm text-center flex flex-col items-center justify-center hover:border-[#1B4B43]/30 transition-colors group">
              <stat.icon className="w-5 h-5 text-stone-300 mb-3 group-hover:text-[#1B4B43] transition-colors" />
              <span className="font-serif text-3xl font-bold text-[#111827]">{stat.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">{stat.label}</span>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* --- LEFT COLUMN: CONTENT & VENTURES --- */}
          <div className="lg:col-span-7 space-y-12">

            {/* Inline Secondary Image */}
            <div className="relative h-[200px] w-full rounded-sm overflow-hidden border border-stone-200 shadow-sm group">
              {/* Placeholder Workspace/Lifestyle Image */}
              <img
                src="/images/farjad-mentorship.png"
                alt="Workspace Placeholder"
                className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-[#1B4B43]/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Social Channels */}
            <div>
              <div className="flex items-center gap-3 mb-8 border-b border-stone-200 pb-4">
                <MessageCircle className="w-6 h-6 text-[#1B4B43]" />
                <h2 className="font-serif text-2xl text-[#111827]">Social Channels</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {SOCIAL_LINKS.map((link, idx) => (
                  <Link key={idx} href={link.url} target="_blank" className="flex items-center p-4 bg-white border border-stone-200 rounded-sm hover:shadow-md hover:border-transparent transition-all group">
                    <div className={`p-3 rounded-full mr-4 ${link.bg} ${link.color}`}>
                      <link.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#111827] text-sm group-hover:text-[#1B4B43] transition-colors">{link.name}</h3>
                      <p className="text-xs text-stone-400 group-hover:text-stone-500">View Profile</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-stone-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Ventures List */}
            <div>
              <div className="flex items-center gap-3 mb-8 border-b border-stone-200 pb-4">
                <Globe className="w-6 h-6 text-[#1B4B43]" />
                <h2 className="font-serif text-2xl text-[#111827]">Ventures & Websites</h2>
              </div>
              <div className="space-y-4">
                {VENTURES.map((site, idx) => (
                  <Link key={idx} href={site.url} target="_blank" className="block group">
                    <div className="flex items-center justify-between p-6 bg-white border border-stone-200 rounded-sm hover:border-[#1B4B43] transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-serif text-xl font-bold text-[#111827] group-hover:text-[#1B4B43] transition-colors">{site.name}</h3>
                          <Badge variant="secondary" className="text-[10px] bg-stone-100 text-stone-500 group-hover:bg-[#1B4B43]/10 group-hover:text-[#1B4B43] border-none uppercase tracking-wider">{site.role}</Badge>
                        </div>
                        <p className="text-sm text-stone-500 font-light">{site.desc}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-[#1B4B43] group-hover:border-[#1B4B43] transition-all">
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-white -rotate-45 group-hover:rotate-0 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN: DIRECT CONTACT CARD --- */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">

            {/* Contact Card */}
            <div className="bg-[#111827] text-white p-8 md:p-10 rounded-sm shadow-2xl relative overflow-hidden group">
              {/* Abstract Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1B4B43] rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity" />

              <div className="relative z-10">
                <h2 className="font-serif text-3xl mb-2">Direct Contact</h2>
                <p className="text-stone-400 text-sm mb-8 leading-relaxed">
                  Physical and direct lines are open for serious inquiries regarding consulting, speaking, or investment.
                </p>

                <div className="space-y-8">
                  <div className="flex gap-4 items-start group/item">
                    <div className="p-3 bg-white/5 rounded-sm group-hover/item:bg-[#1B4B43] transition-colors">
                      <Phone className="w-5 h-5 text-stone-300 group-hover/item:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Direct Line / WhatsApp</p>
                      <p className="font-mono text-lg text-white group-hover/item:text-[#D97706] transition-colors">+1 (437) 661-1674</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start group/item">
                    <div className="p-3 bg-white/5 rounded-sm group-hover/item:bg-[#1B4B43] transition-colors">
                      <Mail className="w-5 h-5 text-stone-300 group-hover/item:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Primary Email</p>
                      <a href="mailto:farjad@ashavid.ca" className="font-mono text-lg text-white border-b border-white/20 hover:border-[#D97706] hover:text-[#D97706] transition-colors pb-0.5">
                        farjad@ashavid.ca
                      </a>
                      <p className="text-xs text-stone-500 mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Responds in English
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Snippet */}
            <div className="bg-[#F5F5F4] p-8 border-l-4 border-[#1B4B43] rounded-r-sm">
              <Quote className="w-8 h-8 text-[#1B4B43]/20 mb-4" />
              <p className="font-serif text-lg text-[#111827] italic leading-relaxed mb-4">
                "Farjad doesn't just give you a checklist. He completely restructures how you approach your business logic."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1B4B43] text-white rounded-full flex items-center justify-center font-bold font-serif text-sm">A</div>
                <div>
                  <p className="text-xs font-bold uppercase text-[#111827]">Amir S.</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-wide">SaaS Founder</p>
                </div>
              </div>
            </div>

            {/* YouTube Native Embed */}
            <div className="pt-8">
              <div className="flex items-center gap-3 mb-6 border-b border-stone-200 pb-4">
                <Youtube className="w-6 h-6 text-[#FF0000]" />
                <h2 className="font-serif text-2xl text-[#111827]">Latest from YouTube</h2>
              </div>
              {/* Embed Container (Aspect Ratio 16:9) */}
              <div className="relative w-full aspect-video rounded-sm overflow-hidden shadow-md border border-stone-200 bg-stone-100 group">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed?listType=playlist&list=UUKwrxko4YPDjWLsRSCTcTMg"
                  title="AshaVid Group YouTube"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-xs text-stone-500 text-center font-light mt-4">
                Watch full series on <a href="https://youtube.com/@ashavidgroup?si=elPYHivIRM87N3IN" target="_blank" className="font-bold text-[#111827] hover:text-[#FF0000] border-b border-transparent hover:border-[#FF0000] transition-colors">@ashavidgroup</a>
              </p>
            </div>

          </div>

        </div>

        {/* --- 3. BOOKING CTA (Full Width Bottom) --- */}
        <section className="mt-24 border-t border-stone-200 pt-16 md:pt-24 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center p-4 bg-[#1B4B43]/5 rounded-full mb-6">
            <Users className="w-8 h-8 text-[#1B4B43]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-6">
            Ready to dive deep?
          </h2>
          <p className="text-lg text-stone-600 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
            If you’re a founder looking to untangle your business model, structure for North America, or plan a strategic immigration pathway, we should talk.
          </p>
          <Link href="/booking">
            <Button className="bg-[#1B4B43] hover:bg-[#133832] text-white h-14 px-8 text-lg font-medium shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] hover:shadow-[2px_2px_0px_0px_rgba(217,119,6,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all">
              Book a Strategy Session <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-xs text-stone-400 mt-6 font-mono uppercase tracking-widest">
            Limited availability • Paid Sessions Only
          </p>
        </section>

      </main>
    </div>
  )
}