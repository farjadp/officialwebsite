// ============================================================================
// File Path: src/app/services/page.tsx
// Version: 2.0.0 — The "Bento Sage" Redesign
// Why: Increases engagement using Bento grids, interactive cards, and rich typography.
// ============================================================================

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Compass,
  Lightbulb,
  Zap,
  Key,
  Briefcase,
  Globe2,
  Award,
  GraduationCap,
  ChevronDown
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// --- DATA DEFINITIONS (Included here for copy-paste ease) ---
const SERVICES = [
  {
    id: "startup-visa",
    title: "Startup Visa Strategy",
    for: "Immigrant founders needing a business case, not just a form filler.",
    icon: Compass,
    details: [
      "Audit concept against SUV criteria.",
      "Roadmap to early traction.",
      "Mock incubator interviews."
    ],
    outcome: "A defensible business case that stands up to scrutiny."
  },
  {
    id: "founder-advisory",
    title: "Strategic Advisory",
    for: "Early-stage founders who need a sparring partner.",
    icon: Lightbulb,
    details: [
      "GTM Strategy validation.",
      "Business Model stress-testing.",
      "Prioritization frameworks."
    ],
    outcome: "Stop building features nobody wants. Focus on revenue."
  },
  {
    id: "digital-systems",
    title: "Digital Systems & AI",
    for: "SMEs bottlenecked by manual work.",
    icon: Zap,
    details: [
      "Operational workflow audit.",
      "AI integration architecture.",
      "Tech stack selection."
    ],
    outcome: "Reclaim 10+ hours/week and reduce human error."
  },
  {
    id: "private-mentorship",
    title: "Private Mentorship",
    for: "High-potential founders.",
    icon: Key,
    isLimited: true,
    details: [
      "Weekly 1:1 strategy calls.",
      "Async access (WhatsApp).",
      "Document review."
    ],
    outcome: "A trusted co-pilot to navigate chaos."
  }
];

const CREDIBILITY_BENTO = [
  {
    title: "Current Role",
    desc: "Founder & CSO at AshaVid",
    sub: "Toronto, Since 2025",
    icon: Briefcase,
    col: "md:col-span-2",
    bg: "bg-[#1B4B43] text-white"
  },
  {
    title: "Exit / Past",
    desc: "Founder & Director at DPF",
    sub: "Data Processing (17 Years)",
    icon: Award,
    col: "md:col-span-1",
    bg: "bg-stone-100 text-[#1C1917]"
  },
  {
    title: "Tech Leadership",
    desc: "Former CTO",
    sub: "Iran's Gov-backed Cloud Firm",
    icon: Zap,
    col: "md:col-span-1",
    bg: "bg-white text-[#1C1917] border border-stone-200"
  },
  {
    title: "Education",
    desc: "MSc Software , MA, MSc and PHD at Anthropology, DBA Branding",
    sub: "Rare mix of Code & Culture",
    icon: GraduationCap,
    col: "md:col-span-2",
    bg: "bg-stone-900 text-stone-200"
  },
  {
    title: "Global Reach",
    desc: "Based in Newmarket, ON",
    sub: "Serving Global Founders",
    icon: Globe2,
    col: "md:col-span-1",
    bg: "bg-[#D97706] text-white"
  },
  {
    title: "Certification",
    desc: "ISO 27001 Lead Auditor",
    sub: "Information Security",
    icon: Key,
    col: "md:col-span-1",
    bg: "bg-white text-[#1C1917] border border-stone-200"
  }
];

const FAQS = [
  { q: "Do you guarantee immigration results?", a: "No. I am not a lawyer. I help you build a real business that meets the criteria, but the outcome is never guaranteed." },
  { q: "How do we start?", a: "Book a strategy call. We diagnose the problem in 30 minutes. If it fits, we move forward." },
  { q: "What is your hourly rate?", a: "I generally work on a retainer or project basis to ensure outcomes, not just hours spent." },
  { q: "Do you work with non-tech businesses?", a: "Yes, specifically for digital transformation and systemizing operations." },
];

export default function ServicesPageBento() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans selection:bg-[#1B4B43] selection:text-white overflow-x-hidden">

      {/* --- Background Assets --- */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.4]"
        style={{ backgroundImage: 'linear-gradient(#E7E5E4 1px, transparent 1px), linear-gradient(to right, #E7E5E4 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10">

        {/* --- 1. HERO: The Manifesto --- */}
        <section className="pt-32 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
          <Badge className="mb-6 bg-[#1B4B43]/10 text-[#1B4B43] hover:bg-[#1B4B43]/20 border-none uppercase tracking-widest px-3 py-1 rounded-sm">
            Advisory & Mentorship
          </Badge>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-[#111827] mb-8 tracking-tight">
            Clarity for the builder. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B4B43] to-stone-500 italic">
              Structure for the business.
            </span>
          </h1>

          <div className="grid md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-7">
              <p className="text-xl md:text-2xl text-stone-600 font-light leading-relaxed">
                I help immigrant founders and serious SMEs navigate the chaos of building.
                No hype. No fake numbers. Just direct, strategic engineering applied to your business.
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col sm:flex-row gap-4">
              <Link href="/booking" className="w-full">
                <Button className="w-full bg-[#1B4B43] hover:bg-[#133832] text-white rounded-sm h-14 text-lg font-medium shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                  Book Strategy Call
                </Button>
              </Link>
            </div>
          </div>
        </section>



        {/* --- 2. AUDIENCE FIT: The Filter --- */}
        <section className="py-24 border-y border-stone-200 bg-[#F5F5F4] relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 opacity-[0.03] pointer-events-none">
            <Compass className="w-[600px] h-[600px]" />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">

            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl text-[#111827] mb-4">Are we a match?</h2>
              <p className="text-stone-500 max-w-xl mx-auto text-lg font-light">
                I don't work with everyone. To protect both of our time, let's make sure our expectations align before we hop on a call.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">

              {/* THE FIT (YES) */}
              <div className="bg-white border-2 border-[#1B4B43] p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(27,75,67,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[6px_6px_0px_0px_rgba(27,75,67,1)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100">
                  <div className="p-3 bg-[#1B4B43]/10 text-[#1B4B43] rounded-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#111827]">Right Fit</h3>
                    <p className="text-sm text-stone-500 uppercase tracking-widest mt-1">Who this is for</p>
                  </div>
                </div>
                <ul className="space-y-6">
                  {[
                    "Founders who want to build a real company, not a visa shell.",
                    "Immigrants who need to understand the Canadian market code.",
                    "SME owners tired of manual chaos and ready for AI.",
                    "Leaders who value brutal honesty over polite lies."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start group">
                      <CheckCircle2 className="w-6 h-6 text-[#1B4B43] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-stone-700 text-lg leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* THE MISFIT (NO) */}
              <div className="bg-stone-100/50 border border-stone-200 p-8 md:p-10 hover:bg-white hover:border-red-200 hover:shadow-lg transition-all duration-500 group">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-200 group-hover:border-red-100 transition-colors">
                  <div className="p-3 bg-stone-200 text-stone-500 group-hover:bg-red-50 group-hover:text-red-500 transition-colors rounded-sm">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-600 group-hover:text-red-900 transition-colors">Wrong Fit</h3>
                    <p className="text-sm text-stone-400 uppercase tracking-widest mt-1 group-hover:text-red-400 transition-colors">Who this is NOT for</p>
                  </div>
                </div>
                <ul className="space-y-6 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  {[
                    "People looking for guaranteed PR or 'easy' visas.",
                    "Founders who want a 'Yes Man' to validate their ego.",
                    "Those looking for get-rich-quick shortcuts.",
                    "Anyone unwilling to do the heavy lifting themselves."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <XCircle className="w-6 h-6 text-stone-400 group-hover:text-red-400 shrink-0 mt-0.5 transition-colors" />
                      <span className="text-stone-500 group-hover:text-stone-700 text-lg leading-relaxed transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>



        {/* --- 3. SERVICES: Interactive Cards --- */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-4">Core Services</h2>
              <p className="text-stone-500 max-w-md">Four ways we can work together. Each designed for a specific stage of maturity.</p>
            </div>
            <div className="hidden md:block">
              <ArrowRight className="w-12 h-12 text-stone-200" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((service) => (
              <div key={service.id} className="group relative bg-white border border-stone-200 p-6 h-[420px] flex flex-col justify-between hover:border-[#1B4B43] transition-colors duration-300 overflow-hidden">

                {/* Background Hover Effect */}
                <div className="absolute inset-0 bg-[#1B4B43] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-stone-50 group-hover:bg-white/10 rounded-sm transition-colors">
                      <service.icon className="w-6 h-6 text-[#1B4B43] group-hover:text-white transition-colors" />
                    </div>
                    {service.isLimited && (
                      <Badge className="bg-[#D97706] text-white text-[10px] hover:bg-[#D97706]">LIMITED</Badge>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl text-[#111827] group-hover:text-white mb-3 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-stone-500 group-hover:text-white/80 transition-colors leading-relaxed">
                    {service.for}
                  </p>
                </div>

                {/* Reveal Content */}
                <div className="relative z-10 space-y-4">
                  <div className="h-px w-12 bg-stone-200 group-hover:bg-white/30" />
                  <ul className="space-y-2">
                    {service.details.map((d, i) => (
                      <li key={i} className="text-xs font-medium text-[#1B4B43] group-hover:text-white flex items-center gap-2">
                        <span className="w-1 h-1 bg-current rounded-full" /> {d}
                      </li>
                    ))}
                  </ul>
                  <Link href="/booking" className="block w-full py-3 text-center text-xs font-bold uppercase tracking-widest border border-stone-200 group-hover:border-white text-[#111827] group-hover:text-white mt-4 hover:bg-white hover:text-[#1B4B43] transition-all">
                    Inquire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 4. CREDIBILITY: The Bento Grid --- */}
        <section className="py-24 px-6 md:px-12 bg-[#F5F5F4] border-y border-stone-200">
          <div className="max-w-6xl mx-auto">

            {/* Minimal Header */}
            <div className="text-center mb-14">
              <h2 className="font-serif text-4xl text-[#111827] mb-4">The Track Record</h2>
              <div className="w-12 h-1 bg-[#1B4B43]/40 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
              {CREDIBILITY_BENTO.map((item, i) => (
                <div
                  key={i}
                  className={`${item.col} ${item.bg} p-6 md:p-8 rounded-xl relative group overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-black/5`}
                >
                  {/* Subtle Background Icon Animation */}
                  <div className="absolute -bottom-6 -right-6 opacity-[0.07] group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700 pointer-events-none">
                    <item.icon className="w-40 h-40" />
                  </div>

                  {/* Top Bar */}
                  <div className="relative z-10 flex justify-between items-start mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70 block">
                      {item.title}
                    </span>
                    <item.icon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Bottom Content */}
                  <div className="relative z-10 mt-auto">
                    <h3 className="font-serif text-2xl md:text-3xl font-medium leading-tight mb-5">
                      {item.desc}
                    </h3>

                    <div className="pt-4 border-t border-current border-opacity-15 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                      <p className="text-sm font-medium opacity-90">{item.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 5. FAQ: Split Layout --- */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-stone-100">
          <div className="grid lg:grid-cols-12 gap-16">

            {/* Left Side: Static Content */}
            <div className="lg:col-span-5 space-y-6">
              <Badge className="bg-[#1B4B43]/10 text-[#1B4B43] border-none uppercase tracking-[0.2em] px-3 py-1 rounded-sm text-[10px]">
                Knowledge Base
              </Badge>
              <h2 className="font-serif text-4xl md:text-5xl text-[#111827] leading-[1.1]">
                Common <br />
                <span className="italic text-stone-400">Questions</span>
              </h2>
              <p className="text-stone-500 text-lg font-light leading-relaxed max-w-sm">
                Everything you need to know about the process, expectations, and how we build together.
              </p>

              <div className="pt-8">
                <div className="inline-flex flex-col p-6 bg-stone-50 border border-stone-200 rounded-xl">
                  <p className="text-sm text-stone-600 mb-4">Still have questions?</p>
                  <Link href="mailto:your@email.com" className="text-[#1B4B43] font-bold flex items-center gap-2 group">
                    Send a direct message
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side: Interactive Accordions */}
            <div className="lg:col-span-7">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {FAQS.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-stone-200 bg-white rounded-xl px-6 py-2 data-[state=open]:border-[#1B4B43] data-[state=open]:shadow-sm transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left text-lg md:text-xl font-medium text-[#111827] hover:no-underline hover:text-[#1B4B43] transition-colors py-6">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-stone-600 pb-8 text-base md:text-lg leading-relaxed font-light">
                      <div className="pl-0 border-l-2 border-[#1B4B43]/20 pt-2 px-4">
                        {faq.a}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

          </div>
        </section>
        {/* --- 6. FINAL CTA --- */}
        <section id="contact" className="py-32 bg-[#111827] text-white text-center px-6 relative overflow-hidden">
          {/* Abstract Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1B4B43] rounded-full blur-[120px] opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-block mb-6 animate-bounce">
              <ArrowRight className="w-8 h-8 text-[#D97706] rotate-90" />
            </div>
            <h2 className="font-serif text-5xl md:text-6xl mb-6">Ready to work?</h2>
            <p className="text-stone-400 text-xl mb-10 font-light">
              I have limited capacity for new advisory clients.<br />
              If you are serious, let's determine if we are a fit.
            </p>
            <Link href="/booking">
              <Button className="bg-white text-[#111827] hover:bg-stone-200 h-16 px-10 text-lg font-bold rounded-sm w-full md:w-auto">
                Book Strategy Call
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}