import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, ShieldAlert, Landmark, FileX, Presentation, Users, BriefcaseBusiness, Route, CheckCircle2, Target, UsersRound, XCircle, SearchIcon, Crosshair } from "lucide-react";
import { ServiceCta } from "@/components/public/service-cta";

export default function StartupVisaPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans overflow-x-hidden selection:bg-[#D97706] selection:text-white">
      {/* Background Assets */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: "linear-gradient(#E7E5E4 1px, transparent 1px), linear-gradient(to right, #E7E5E4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Navigation */}
      <div className="absolute top-8 left-6 md:left-12 z-50">
        <Link href="/services" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-stone-200 rounded-full text-stone-600 hover:text-[#D97706] hover:bg-white transition-all font-medium text-sm shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
      </div>

      <div className="relative z-10 w-full">
        
        {/* 1. HERO (The Harsh Truth) */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6 pt-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-100 border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#D97706] font-bold mb-8 relative z-10">
            <Compass className="w-3 h-3" />
            Startup Visa Strategy
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight text-[#111827] leading-[1.05] max-w-5xl relative z-10">
            Why Most SUV Applications <br/>
            <span className="italic text-red-600/90 underline decoration-red-200 underline-offset-8">Fail Before They Start.</span>
          </h1>
          
          <div className="mt-10 text-xl md:text-2xl text-stone-500 font-light max-w-3xl leading-relaxed relative z-10">
            <p className="font-medium text-[#111827]">
              Most people think the Canada Startup Visa is about paperwork. It’s not.
            </p>
            <p className="mt-3 text-lg">
              It’s about building a business case strong enough to survive scrutiny. 
              Immigration officers don't reject forms. They reject weak businesses.
            </p>
          </div>
          
          <div className="mt-16 animate-pulse relative z-10">
            <div className="w-px h-16 bg-gradient-to-b from-stone-300 to-transparent mx-auto" />
          </div>
        </section>

        {/* 2. THE BIGGEST MISCONCEPTION */}
        <section className="py-24 bg-[#111827] text-white relative">
          <div className="max-w-6xl mx-auto px-6 md:px-12 grid lg:grid-cols-5 gap-16 items-center">
            
            <div className="lg:col-span-3">
              <ShieldAlert className="w-12 h-12 text-[#D97706] mb-6" />
              <h2 className="font-serif text-4xl leading-tight mb-8">
                The Program Is Not Designed For You to "Just Get In."
              </h2>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                {["Passive investors", "Template startups", "Copied business models"].map((item, i) => (
                  <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <XCircle className="w-6 h-6 text-red-400 mb-2" />
                    <span className="text-sm font-medium text-stone-300">Not for {item}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 border-l-2 border-[#D97706] bg-white/5 backdrop-blur-sm rounded-r-lg">
                <p className="text-lg font-serif text-white mb-2 leading-relaxed">
                  "The Startup Visa program targets innovative, scalable businesses that can compete globally."
                </p>
                <p className="text-sm font-sans text-stone-500 uppercase tracking-widest">— Government of Canada (IRCC)</p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-serif text-2xl text-stone-300 mb-4 border-b border-stone-800 pb-4">Applicant Reality vs. IRCC Expectation</h3>
              <div className="bg-[#1a2332] border border-stone-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-stone-700" />
                <p className="text-stone-400 text-sm uppercase tracking-wider mb-2 font-bold">What Applicants Do:</p>
                <p className="text-xl text-stone-300 italic mb-4">"I need an idea... I need an incubator... I need documents."</p>
                <div className="flex gap-2">
                  <span className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded">Generic</span>
                  <span className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded">Local</span>
                  <span className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded">Weak Execution</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. WHY APPLICATIONS GET REJECTED (The 5 Failures Grid) */}
        <section className="py-24 bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="font-serif text-4xl text-[#111827] mb-4">Why Applications Get Rejected</h2>
              <p className="text-xl text-stone-500 font-light">
                Based on real patterns, not theory. This is where the filter catches you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Weak Business Logic", desc: "Ideas that sound good but don’t survive basic questioning.", icon: FileX },
                { title: "Market Ignorance", desc: "No clear answer to 'Who is the customer?' and 'Why would they switch?'", icon: SearchIcon },
                { title: "Over-Engineered Decks", desc: "Visually polished pitch decks that are strategically completely empty.", icon: Presentation },
                { title: "Incubator Misalignment", desc: "Founders blindly applying to the wrong designated organizations.", icon: Landmark },
                { title: "Credibility Gap", desc: "Zero logical connection between the founder’s background and the new business idea.", icon: Users }
              ].map((item, i) => (
                <div key={i} className="bg-[#FDFCF8] border border-stone-200 rounded-3xl p-8 hover:border-red-200 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-6 group-hover:bg-red-50 group-hover:text-red-600 text-stone-500 transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#111827] mb-3">{item.title}</h3>
                  <p className="text-stone-600 font-light text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. THE HIDDEN REALITY (The Process Flip) */}
        <section className="py-24 bg-[#F5F5F4] border-b border-stone-200">
           <div className="max-w-5xl mx-auto px-6 text-center">
              <h2 className="font-serif text-3xl md:text-5xl text-[#111827] mb-12">The Hidden Reality of SUV</h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                 
                 {/* The Myth */}
                 <div className="w-full md:w-1/2 bg-white border border-stone-200 p-8 rounded-3xl opacity-60">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">The Myth (How people think it works)</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-500">1. Build a pitch deck</div>
                      <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-500">2. Apply to an incubator</div>
                      <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-500">3. Get Approved</div>
                    </div>
                 </div>

                 {/* The Reality */}
                 <div className="w-full md:w-1/2 bg-white border-2 border-[#1B4B43] p-8 rounded-3xl shadow-xl relative top-0 md:-top-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#1B4B43] mb-6">The Reality</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-[#1B4B43]/5 border border-[#1B4B43]/20 rounded-xl text-[#111827] font-medium flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#1B4B43]" /> 1. Validate business logic</div>
                      <div className="p-3 bg-[#1B4B43]/5 border border-[#1B4B43]/20 rounded-xl text-[#111827] font-medium flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#1B4B43]" /> 2. Align with the RIGHT incubator</div>
                      <div className="p-3 bg-[#1B4B43]/5 border border-[#1B4B43]/20 rounded-xl text-[#111827] font-medium flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#1B4B43]" /> 3. Pass REAL evaluation</div>
                      <div className="p-3 bg-[#1B4B43]/5 border border-[#1B4B43]/20 rounded-xl text-[#111827] font-medium flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#1B4B43]" /> 4. Then move forward</div>
                    </div>
                 </div>

              </div>

              <div className="mt-16 inline-block bg-[#111827] text-white px-8 py-4 rounded-xl font-serif text-2xl shadow-lg">
                The real work happens <span className="text-[#D97706]">before</span> the application.
              </div>
           </div>
        </section>

        {/* 5. THE STRATEGY DESIGN (Our 5 Steps) */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
             <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-6">What We Actually Do</h2>
             <p className="text-xl text-stone-500 font-light">
               This is not document preparation. This is <strong className="text-[#111827]">pre-approval strategy design.</strong>
             </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 hover:border-[#D97706] transition-colors group">
               <div className="w-16 h-16 shrink-0 bg-stone-100 group-hover:bg-[#D97706]/10 rounded-2xl flex items-center justify-center transition-colors">
                 <Target className="w-8 h-8 text-stone-400 group-hover:text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-[#111827] mb-3">1. Concept Validation Against SUV Criteria</h3>
                 <p className="text-stone-600 font-light mb-4">
                   We evaluate innovation level, scalability potential, and global market relevance. Not based on our opinion — based on what incubators actually accept.
                 </p>
               </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 hover:border-[#D97706] transition-colors group">
               <div className="w-16 h-16 shrink-0 bg-stone-100 group-hover:bg-[#D97706]/10 rounded-2xl flex items-center justify-center transition-colors">
                 <UsersRound className="w-8 h-8 text-stone-400 group-hover:text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-[#111827] mb-3">2. Founder–Startup Alignment</h3>
                 <p className="text-stone-600 font-light mb-4">
                   One of the most ignored factors. We ask: Why YOU for THIS business? Does your background support this idea? Misalignment is the fastest way to get rejected.
                 </p>
               </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 bg-[#111827] p-6 md:p-8 rounded-3xl border-2 border-[#111827] shadow-[6px_6px_0px_0px_#D97706] text-white">
               <div className="w-16 h-16 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center">
                 <Crosshair className="w-8 h-8 text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-white mb-3">3. Incubator Targeting Strategy</h3>
                 <p className="text-stone-300 font-light mb-4">
                   Not all designated organizations are the same. We match based on industry focus, risk tolerance, and evaluation style. Applying blindly reduces your chances to zero.
                 </p>
               </div>
            </div>

             {/* Step 4 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 hover:border-[#D97706] transition-colors group">
               <div className="w-16 h-16 shrink-0 bg-stone-100 group-hover:bg-[#D97706]/10 rounded-2xl flex items-center justify-center transition-colors">
                 <BriefcaseBusiness className="w-8 h-8 text-stone-400 group-hover:text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-[#111827] mb-3">4. Business Case Structuring</h3>
                 <p className="text-stone-600 font-light mb-4">
                   Where most fail. We build clear problem-solution logic, realistic market positioning, and a credible growth narrative. No buzzwords. No inflated claims.
                 </p>
               </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 hover:border-[#D97706] transition-colors group">
               <div className="w-16 h-16 shrink-0 bg-stone-100 group-hover:bg-[#D97706]/10 rounded-2xl flex items-center justify-center transition-colors">
                 <Presentation className="w-8 h-8 text-stone-400 group-hover:text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-[#111827] mb-3">5. Interview Preparation</h3>
                 <p className="text-stone-600 font-light mb-4">
                   Getting attention is one thing. Passing evaluation is another. We prepare you for tough questions, logical gaps, and real-time pressure.
                 </p>
               </div>
            </div>

          </div>
        </section>

        {/* 6. WHAT MAKES THIS DIFFERENT (The Differentiation Moat) */}
        <section className="py-24 bg-[#111827] text-white">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl mb-6">Let's be very clear.</h2>
              <p className="text-stone-400 text-lg mb-8">This is NOT immigration consulting. This is NOT legal advice. This is NOT a document filing service.</p>
              
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border-l-4 border-[#34D399]">
                <p className="text-2xl font-bold text-[#34D399] mb-2">This is Business Strategy</p>
                <p className="text-stone-200">designed exclusively for the high-stakes standard of immigration context.</p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border border-white/10 rounded-xl p-4 bg-white/5"><span className="text-[#34D399]">✓</span> Stronger logic</div>
                <div className="border border-white/10 rounded-xl p-4 bg-white/5"><span className="text-[#34D399]">✓</span> Higher probability</div>
                <div className="border border-white/10 rounded-xl p-4 bg-white/5 md:col-span-2"><span className="text-[#34D399]">✓</span> Credible global positioning</div>
              </div>
            </div>

            {/* REAL PATTERNS */}
            <div className="space-y-4">
              <h3 className="font-bold text-stone-500 uppercase tracking-widest text-xs mb-4">Real Patterns We See</h3>
              
              <div className="bg-white p-5 rounded-2xl text-[#111827]">
                <p className="font-bold border-b border-stone-100 pb-2 mb-2">Case 1: No Idea</p>
                <p className="text-sm text-stone-600 mb-2">They want “any startup” to get PR.</p>
                <p className="text-xs font-bold text-red-600 uppercase">→ Wrong approach. Denied.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl text-[#111827]">
                <p className="font-bold border-b border-stone-100 pb-2 mb-2">Case 2: Weak Idea</p>
                <p className="text-sm text-stone-600 mb-2">They have something — but it’s not scalable.</p>
                <p className="text-xs font-bold text-[#D97706] uppercase">→ Needs massive restructuring.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl text-[#111827] border-2 border-[#1B4B43]">
                <p className="font-bold border-b border-stone-100 pb-2 mb-2 flex items-center justify-between">
                  Case 3: Strong Idea <span className="text-[10px] bg-[#1B4B43] text-white px-2 py-0.5 rounded-full">Common</span>
                </p>
                <p className="text-sm text-stone-600 mb-2">Good foundation, but terrible presentation & positioning.</p>
                <p className="text-xs font-bold text-[#1B4B43] uppercase">→ Needs clarity, focus and alignment.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. AUDIENCE & EXCLUSION */}
        <section className="py-24 bg-white border-b border-stone-200 text-center">
          <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12 text-left">
            <div>
              <h2 className="font-serif text-3xl text-[#111827] mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-[#1B4B43]" /> Who This Is For
              </h2>
              <ul className="space-y-4 text-stone-700">
                <li className="flex gap-3"><span className="text-[#1B4B43]">✓</span> Founders serious about building a real startup</li>
                <li className="flex gap-3"><span className="text-[#1B4B43]">✓</span> Applicants treating SUV as a business entry</li>
                <li className="flex gap-3"><span className="text-[#1B4B43]">✓</span> Teams preparing for deep incubator evaluation</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-3xl text-stone-400 mb-6 flex items-center gap-3">
                <XCircle className="w-8 h-8 text-stone-300" /> Who This Is Not For
              </h2>
              <ul className="space-y-4 text-stone-500 line-through decoration-stone-300/50">
                <li>People looking for shortcuts to PR</li>
                <li>Those who want "template-based" applications</li>
                <li>Passive investors with zero involvement</li>
              </ul>
              <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-lg">
                <p className="text-sm font-semibold text-stone-700">The SUV program is not designed for shortcuts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. REALITY CHECK & CONCLUSION */}
        <section className="py-32 bg-[#F5F5F4] text-center px-6">
           <div className="max-w-4xl mx-auto">
             <h2 className="font-serif text-4xl mb-12 text-[#111827]">A Simple Reality Check</h2>
             
             <div className="grid sm:grid-cols-2 gap-4 mb-16 text-left">
                {[
                  "Is my idea truly scalable — or just 'good' locally?",
                  "Can I defend my business logic under harsh pressure?",
                  "Do I understand my global target market clearly?",
                  "Am I building a company — or just an application?"
                ].map((q, i) => (
                  <div key={i} className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm text-stone-700 font-medium">
                    {q}
                  </div>
                ))}
             </div>

             <div className="max-w-2xl mx-auto border-t border-stone-300 pt-16">
               <p className="text-xl font-light text-stone-500 mb-6">If these answers are unclear, your risk of rapid rejection is high.</p>
               
               <p className="font-serif text-4xl text-[#111827] italic leading-relaxed mb-6">
                 "I’ve seen too many people treat this program like a transaction. It’s not. It’s a filter."
               </p>
               <p className="text-2xl font-bold text-red-600 bg-red-50 inline-block px-6 py-2 rounded-xl">
                 Are you building something real — or just trying to pass?
               </p>
             </div>
           </div>
        </section>

        {/* 9. CTA */}
        <ServiceCta />
        
      </div>
    </div>
  );
}
