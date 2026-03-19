import React from "react";
import { notFound } from "next/navigation";
import { SERVICES } from "../data";
import { ServiceCta } from "@/components/public/service-cta";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find((s) => s.id === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans overflow-x-hidden selection:bg-[#1B4B43] selection:text-white">
      {/* Background Assets */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(#E7E5E4 1px, transparent 1px), linear-gradient(to right, #E7E5E4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <div className="relative z-10">
        
        {/* Navigation / Back */}
        <div className="pt-32 pb-6 px-6 md:px-12 max-w-5xl mx-auto">
          <Link href="/services" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#1B4B43] hover:translate-x-[-2px] transition-all font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </div>

        {/* HERO SECTION */}
        <section className="px-6 md:px-12 pb-20 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-[#1B4B43]/10 rounded-xl">
              <service.icon className="w-8 h-8 text-[#1B4B43]" />
            </div>
            {service.isLimited && (
              <span className="bg-[#D97706] text-white text-[10px] uppercase font-bold px-2 py-1 tracking-widest rounded-sm">
                Limited Availability
              </span>
            )}
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl text-[#111827] tracking-tight mb-6 leading-[1.1]">
            {service.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-stone-600 font-light max-w-3xl leading-relaxed">
            {service.for}
          </p>
        </section>

        {/* DETAILS SECTION */}
        <section className="py-24 bg-white border-y border-stone-200">
          <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16">
            {/* What You Get */}
            <div>
              <h2 className="font-serif text-3xl text-[#111827] mb-8 pb-4 border-b border-stone-100">
                What You Get
              </h2>
              <ul className="space-y-6">
                {(service.whatYouGet || []).map((item: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start group">
                    <CheckCircle2 className="w-6 h-6 text-stone-300 group-hover:text-[#1B4B43] shrink-0 mt-0.5 transition-colors" />
                    <span className="text-stone-700 text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outcomes */}
            <div className="bg-[#F5F5F4] p-8 md:p-10 rounded-2xl border border-stone-200">
              <h2 className="font-serif text-2xl text-[#111827] mb-6">
                Direct Outcomes
              </h2>
              <div className="h-1 w-12 bg-[#1B4B43] mb-8" />
              <ul className="space-y-6">
                {(service.outcomes || []).map((item: string, i: number) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-[#1B4B43] mt-2.5 shrink-0" />
                    <span className="text-stone-700 text-lg font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* DYNAMIC CTA SECTION */}
        <ServiceCta />
      </div>
    </div>
  );
}
