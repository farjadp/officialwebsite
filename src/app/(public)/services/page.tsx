// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Main entry page for the route
// Env / Identity: React Server Component
// ============================================================================

import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SERVICES, PROCESS_STEPS, CREDIBILITY_BULLETS, FAQS } from "./data";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Services | Farjad Advisory",
  description: "Strategic advisory for startup founders, immigrant entrepreneurs, and SMEs.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans selection:bg-[#1B4B43] selection:text-white">
      {/* Texture Overlay (Grain) */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="relative z-10">
        {/* --- A. Hero Section --- */}
        <section className="pt-24 pb-20 px-6 md:px-12 max-w-5xl mx-auto text-center border-b border-stone-200">
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] text-[#111827] mb-6">
            Clarity for the builder.<br />
            <span className="italic text-stone-500 font-light">Structure for the business.</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 font-light max-w-2xl mx-auto leading-relaxed mb-10">
            Advisory and mentorship for serious founders who value direct feedback over hype.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="#contact" className="w-full sm:w-auto">
              <Button className="w-full bg-[#1B4B43] hover:bg-[#133832] text-white rounded-none px-8 h-12 md:h-14 text-base font-medium transition-all">
                Book a Strategy Call
              </Button>
            </Link>
            <Link href="#services" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full rounded-none border-stone-300 text-stone-700 hover:bg-stone-100 hover:text-stone-900 px-8 h-12 md:h-14 text-base font-normal transition-all">
                See Services
              </Button>
            </Link>
          </div>
        </section>

        {/* --- B. Who I Work With --- */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-stone-200">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">Audience Fit</h2>
              <div className="h-0.5 w-12 bg-[#1B4B43] mx-auto mt-6" />
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
              {/* Best Fit */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="p-2 bg-green-50 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-[#1B4B43]" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#111827]">Best Fit</h3>
                </div>
                <ul className="space-y-4 text-stone-600">
                  <li className="flex gap-3"><span className="text-[#1B4B43] mt-0.5">•</span><span><strong className="font-medium text-stone-900">Early-stage Founders:</strong> Needing product strategy and structure.</span></li>
                  <li className="flex gap-3"><span className="text-[#1B4B43] mt-0.5">•</span><span><strong className="font-medium text-stone-900">Immigrant Entrepreneurs:</strong> Especially those launching in Canada.</span></li>
                  <li className="flex gap-3"><span className="text-[#1B4B43] mt-0.5">•</span><span><strong className="font-medium text-stone-900">SUV Candidates:</strong> Requiring business readiness and market positioning.</span></li>
                  <li className="flex gap-3"><span className="text-[#1B4B43] mt-0.5">•</span><span><strong className="font-medium text-stone-900">SME Owners:</strong> Seeking digital and AI system improvements.</span></li>
                </ul>
              </div>

              {/* Not Fit */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="p-2 bg-red-50 rounded-full">
                    <XCircle className="w-6 h-6 text-red-700" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#111827]">Not a Fit</h3>
                </div>
                <ul className="space-y-4 text-stone-600">
                  <li className="flex gap-3"><span className="text-red-700 mt-0.5">•</span><span><strong className="font-medium text-stone-900">Want "Yes Men":</strong> If you prefer validation over hard truths.</span></li>
                  <li className="flex gap-3"><span className="text-red-700 mt-0.5">•</span><span><strong className="font-medium text-stone-900">Looking for Proxies:</strong> I advise; I don't run your company for you.</span></li>
                  <li className="flex gap-3"><span className="text-red-700 mt-0.5">•</span><span><strong className="font-medium text-stone-900">Get-Rich-Quick Seekers:</strong> Building real businesses takes time.</span></li>
                  <li className="flex gap-3"><span className="text-red-700 mt-0.5">•</span><span><strong className="font-medium text-stone-900">Just Need a Visa:</strong> I build businesses, not immigration applications.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- C. Services (4 Pillars) --- */}
        <section id="services" className="py-24 px-6 md:px-12 bg-[#FDFCF8] border-b border-stone-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">Core Services</h2>
              <div className="h-0.5 w-12 bg-[#1B4B43] mx-auto mt-6" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {SERVICES.map((service) => (
                <div key={service.id} className="bg-white border border-stone-200 hover:border-stone-300 p-8 md:p-10 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group">
                  {service.isLimited && (
                    <div className="absolute top-0 right-0 p-4">
                      <Badge variant="secondary" className="bg-stone-100 text-[#111827] font-semibold rounded-none text-[10px] tracking-widest uppercase border border-stone-200 group-hover:bg-[#111827] group-hover:text-white transition-colors">
                        Limited Capacity
                      </Badge>
                    </div>
                  )}

                  <div className="mb-8 inline-flex p-4 bg-stone-50 border border-stone-100 group-hover:bg-[#1B4B43]/5 transition-colors">
                    <service.icon className="w-8 h-8 text-[#1B4B43]" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-3xl font-serif text-[#111827] mb-4">{service.title}</h3>
                  <p className="text-stone-500 text-base md:text-lg mb-8 italic pb-6 border-b border-stone-100">
                    "{service.for}"
                  </p>

                  <div className="space-y-8 flex-grow">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">What You Get</h4>
                      <ul className="space-y-3">
                        {service.whatYouGet.map((item, i) => (
                          <li key={i} className="flex gap-3 text-stone-700 text-base">
                            <span className="text-stone-300 font-serif -mt-1 text-lg">›</span> <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#1B4B43]/70 mb-4">Outcomes</h4>
                      <ul className="space-y-3">
                        {service.outcomes.map((item, i) => (
                          <li key={i} className="flex gap-3 text-[#111827] text-base font-medium">
                            <span className="text-[#1B4B43] mt-0.5">↳</span> <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-10 mt-auto flex">
                    <Link href="#contact" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-[#111827] border-b-2 border-transparent hover:border-[#1B4B43] transition-colors pb-1 group-hover:text-[#1B4B43]">
                      Request Details <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- D. How I Work (Process) --- */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">The Process</h2>
              <div className="h-0.5 w-12 bg-[#1B4B43] mt-6" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
              {PROCESS_STEPS.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-2 text-[120px] font-black text-stone-50 leading-none select-none z-0 group-hover:text-[#1B4B43]/5 transition-colors duration-500">
                    {step.step}
                  </div>
                  <div className="relative z-10 pt-8 pl-4 border-t-2 border-[#111827] mt-8 group-hover:border-[#1B4B43] transition-colors">
                    <h3 className="text-2xl font-serif text-[#111827] mb-4">{step.title}</h3>
                    <p className="text-stone-600 text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- E. Credibility / Proof --- */}
        <section className="py-24 px-6 md:px-12 bg-[#FDFCF8] border-b border-stone-200">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">Why Me?</h2>
              <div className="h-0.5 w-12 bg-[#1B4B43] mt-6" />
            </div>

            <div className="bg-white border border-stone-200 p-8 md:p-16 relative shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 border-b border-l border-stone-200 rounded-bl-[100px] -z-0"></div>

              <div className="relative z-10">
                <p className="text-stone-500 mb-10 text-xl font-light italic border-l-2 border-[#1B4B43] pl-6 py-2">No inflated claims. Just the track record.</p>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                  {CREDIBILITY_BULLETS.map((bullet, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <span className="w-1.5 h-1.5 bg-[#1B4B43] rounded-full mt-2.5 shrink-0 opacity-80" />
                      <span className="text-stone-700 leading-relaxed">{bullet}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-10 border-stone-200" />

                <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-bold uppercase tracking-widest text-stone-400">
                  <a href="#" className="hover:text-[#111827] transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-[#111827] transition-colors">YouTube</a>
                  <a href="#" className="hover:text-[#111827] transition-colors">X / Twitter</a>
                  <a href="#" className="hover:text-[#111827] transition-colors">Telegram</a>
                  <a href="#" className="hover:text-[#111827] transition-colors">GitHub</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- F. FAQ --- */}
        <section className="py-24 px-6 md:px-12 bg-white border-b border-stone-200">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl text-[#111827]">Frequent Questions</h2>
              <div className="h-0.5 w-12 bg-[#1B4B43] mx-auto mt-6" />
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-stone-200 px-6 rounded-none bg-stone-50/50 data-[state=open]:bg-white data-[state=open]:border-stone-300 transition-colors">
                  <AccordionTrigger className="text-left text-lg font-serif text-[#111827] hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 leading-relaxed text-base pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* --- G. Final CTA --- */}
        <section id="contact" className="py-32 px-6 md:px-12 bg-[#111827] text-white text-center flex flex-col items-center relative overflow-hidden">
          {/* Dark abstract circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full max-w-2xl">
            <h2 className="font-serif text-4xl md:text-6xl mb-6 leading-tight">Ready to work?</h2>
            <p className="text-stone-400 text-xl mx-auto mb-12 font-light leading-relaxed">
              If you’re tired of generic advice and want structured, strategic growth, let’s talk.
            </p>
            <Button className="w-full sm:w-auto bg-white hover:bg-stone-200 text-[#111827] rounded-none px-12 h-16 text-lg font-bold">
              Book a Strategy Call
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}