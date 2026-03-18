import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, Navigation, MessageCircle, Bot, Zap, ArrowRight, UserCircle2, Mail, Link as LinkIcon, Instagram, Youtube, Linkedin, MoveUpRight } from "lucide-react";

export function ServiceCta() {
  return (
    <section className="py-24 bg-[#111827] px-6 text-white relative overflow-hidden font-sans">
      {/* Abstract Glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#1B4B43] rounded-full blur-[140px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#D97706] rounded-full blur-[160px] opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Title Area */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="font-serif text-5xl md:text-6xl text-white tracking-tight leading-tight">
            Ready to build something that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] to-yellow-200">
              survives
            </span> real life?
          </h2>
          <p className="text-stone-400 text-lg md:text-xl font-light">
            I exist for founders who refuse to live on "what if".
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-1 md:gap-px bg-stone-800/40 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* LEFT PANEL: Assistant / Booking */}
          <div className="lg:col-span-5 bg-[#171717] p-8 md:p-10 flex flex-col justify-between relative group hover:bg-[#1a1a1a] transition-colors">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D97706]/20 text-[#FBBF24] border border-[#D97706]/30 rounded-full text-[10px] font-bold tracking-widest uppercase mb-8">
                <Zap className="w-3 h-3 fill-current" />
                Available Now
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl text-white font-medium mb-3">
                Strategic Fit Diagnostic
              </h3>
              <p className="text-stone-400 text-sm md:text-base leading-relaxed font-light pr-4">
                Instant triage, readiness scan, and next-step recommendations. We find out if we are a match.
              </p>
            </div>
            
            <Link href="/booking" className="mt-12 w-full block">
              <Button className="w-full h-14 bg-gradient-to-br from-[#D97706] to-[#B45309] hover:from-[#F59E0B] hover:to-[#D97706] text-white font-bold text-base rounded-xl flex justify-between items-center px-6 shadow-lg shadow-[#D97706]/20 transition-all hover:scale-[1.02]">
                <div className="flex items-center gap-2">
                  <UserCircle2 className="w-5 h-5" />
                  Book Strategy Call
                </div>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* RIGHT PANEL: Direct Chat / Social */}
          <div className="lg:col-span-7 bg-[#171717] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl text-white font-medium mb-3">
                    Farjad P.
                  </h3>
                  <p className="text-stone-400 text-sm md:text-base font-light leading-relaxed">
                    <span className="text-[#34D399] tracking-widest font-medium uppercase text-xs">عاشق وطن، مشتاق به استارتاپ</span><br />
                    An immigrant founder, patriot, and deeply passionate about building startups that survive reality.
                  </p>
                </div>
                
                {/* Online Indicator */}
                <div className="flex items-center bg-stone-900/50 border border-stone-800 rounded-lg p-2 gap-3 shrink-0">
                  <div className="flex -space-x-2">
                    <img src="https://ui-avatars.com/api/?name=Farjad&background=1B4B43&color=fff&bold=true" alt="Farjad" className="w-8 h-8 rounded-full border-2 border-[#171717]" />
                  </div>
                  <div className="text-[10px] leading-tight pr-2">
                    <span className="text-white font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse relative top-px" />
                      Online
                    </span>
                    <span className="text-stone-400">Ready to talk</span>
                  </div>
                </div>
              </div>

              {/* Social Ecosystem Links */}
              <div className="flex flex-wrap gap-2 mb-10">
                <Link href={"https://t.me/FarjadTalks"} target="_blank" className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-800/50 hover:bg-[#229ED9]/20 text-stone-400 hover:text-[#229ED9] transition-colors group">
                  <Navigation className="w-5 h-5 -rotate-45 ml-[-2px] mt-[2px] fill-current group-hover:scale-110 transition-transform" />
                </Link>
                <Link href={"https://instagram.com/FarjadTalks"} target="_blank" className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-800/50 hover:bg-[#E1306C]/20 text-stone-400 hover:text-[#E1306C] transition-colors group">
                  <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <Link href={"https://youtube.com/@FarjadTalks"} target="_blank" className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-800/50 hover:bg-[#FF0000]/20 text-stone-400 hover:text-[#FF0000] transition-colors group">
                  <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <Link href={"https://www.linkedin.com/in/farjadpourmohammad/"} target="_blank" className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-800/50 hover:bg-[#0A66C2]/20 text-stone-400 hover:text-[#0A66C2] transition-colors group">
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform fill-current" />
                </Link>
              </div>
            </div>

            {/* Direct Contact & Websites */}
            <div className="grid sm:grid-cols-2 gap-3">
              {/* WhatsApp */}
              <div className="group relative flex items-center justify-between p-4 bg-stone-900/40 border border-stone-800/60 rounded-xl hover:bg-green-950/20 hover:border-green-800/50 transition-all cursor-pointer">
                <Link href={"https://wa.me/14376611674"} target="_blank" className="absolute inset-0 z-10" />
                <div className="flex items-center gap-4 relative z-0">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">WhatsApp</p>
                    <p className="text-stone-500 text-xs">+1 (437) 661-1674</p>
                  </div>
                </div>
                <MoveUpRight className="w-4 h-4 text-stone-600 group-hover:text-[#25D366] transition-colors relative z-20" />
              </div>

              {/* Email */}
              <div className="group relative flex items-center justify-between p-4 bg-stone-900/40 border border-stone-800/60 rounded-xl hover:bg-stone-800/80 hover:border-stone-700 transition-all cursor-pointer">
                <Link href={"mailto:farjad@ashavid.ca"} className="absolute inset-0 z-10" />
                <div className="flex items-center gap-4 relative z-0">
                  <div className="w-10 h-10 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Direct Email</p>
                    <p className="text-stone-500 text-xs truncate max-w-[120px]">farjad@ashavid.ca</p>
                  </div>
                </div>
                <MoveUpRight className="w-4 h-4 text-stone-600 group-hover:text-white transition-colors relative z-20" />
              </div>

              {/* AshaVid */}
              <div className="group relative flex items-center justify-between p-4 bg-stone-900/40 border border-stone-800/60 rounded-xl hover:bg-[#1B4B43]/20 hover:border-[#1B4B43]/50 transition-all cursor-pointer">
                <Link href={"https://www.AshaVid.ca"} target="_blank" className="absolute inset-0 z-10" />
                <div className="flex items-center gap-4 relative z-0">
                  <div className="w-10 h-10 rounded-full bg-[#1B4B43]/20 text-[#34D399] flex items-center justify-center shrink-0">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">AshaVid</p>
                    <p className="text-stone-500 text-xs">Innovation & Systems</p>
                  </div>
                </div>
                <MoveUpRight className="w-4 h-4 text-stone-600 group-hover:text-[#34D399] transition-colors relative z-20" />
              </div>

              {/* NorthRoad VC */}
              <div className="group relative flex items-center justify-between p-4 bg-stone-900/40 border border-stone-800/60 rounded-xl hover:bg-[#D97706]/10 hover:border-[#D97706]/40 transition-all cursor-pointer">
                <Link href={"https://www.NorthRoad.vc"} target="_blank" className="absolute inset-0 z-10" />
                <div className="flex items-center gap-4 relative z-0">
                  <div className="w-10 h-10 rounded-full bg-[#D97706]/20 text-[#D97706] flex items-center justify-center shrink-0">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">NorthRoad VC</p>
                    <p className="text-stone-500 text-xs">Venture Capital</p>
                  </div>
                </div>
                <MoveUpRight className="w-4 h-4 text-stone-600 group-hover:text-[#D97706] transition-colors relative z-20" />
              </div>

            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
