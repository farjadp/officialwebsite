import React from "react";
import Link from "next/link";
import { ArrowLeft, Target, ShieldAlert, SplitSquareHorizontal, EyeOff, BrainCircuit, Columns, Filter, CheckCircle2, XCircle, LineChart, Network, ListOrdered, MoveRight, ActivitySquare } from "lucide-react";
import { ServiceCta } from "@/components/public/service-cta";

export default function FounderAdvisoryPage() {
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
        
        {/* 1. HERO (The Shift) */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-100 border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#D97706] font-bold mb-8">
            <Target className="w-3 h-3" />
            Founder Strategic Advisory
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight text-[#111827] leading-[1.05] max-w-5xl">
            You don’t need <span className="italic text-[#D97706]">better strategy.</span> <br/>
            You need clearer thinking.
          </h1>
          
          <div className="mt-10 text-xl md:text-2xl text-stone-500 font-light max-w-2xl leading-relaxed">
            <p className="font-medium text-[#111827]">
              Founders are not short on options. They are overwhelmed by them.
            </p>
            <p className="mt-3 text-lg">
              After working with early-stage and growth-stage teams, one pattern keeps repeating:
              The issue is rarely lack of ideas. It’s the inability to make hard decisions under uncertainty.
            </p>
          </div>
          
          <div className="mt-16 animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-stone-300 to-transparent mx-auto" />
          </div>
        </section>

        {/* 2. THE PROBLEM (Noise Disguised as Opportunity) */}
        <section className="py-24 bg-[#111827] text-white relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D97706] rounded-full blur-[150px] opacity-10 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <ShieldAlert className="w-12 h-12 text-[#D97706] mb-6" />
              <h2 className="font-serif text-4xl leading-tight mb-6">
                Noise disguised as <span className="text-[#D97706] italic">opportunity.</span>
              </h2>
              <p className="text-stone-400 font-light text-lg mb-8 leading-relaxed">
                At early stages, everything looks important: New features, new markets, new partnerships, new ideas every week. The problem is not lack of direction. <strong className="text-white">The problem is too many directions.</strong>
              </p>
              
              <div className="p-6 border-l-2 border-[#D97706] bg-white/5 backdrop-blur-sm rounded-r-lg mb-8">
                <p className="text-xl font-serif text-white mb-2">
                  "Lack of focus is one of the top reasons startups fail."
                </p>
                <p className="text-sm font-sans text-stone-500 uppercase tracking-widest">— CB Insights</p>
              </div>

              <p className="text-stone-300">
                Most founders don’t experience this as "lack of focus." They experience it as: <em className="text-[#A7F3D0]">"We're exploring options... we're being flexible... we don't want to miss opportunities."</em> Which sounds reasonable — until it kills execution.
              </p>
            </div>

            <div className="grid gap-6">
              {/* The Founder's Trap Bento */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-[#D97706]/50 transition-colors">
                 <div className="absolute -right-4 -bottom-4 opacity-10"><Network className="w-48 h-48" /></div>
                 <h3 className="text-[#D97706] uppercase tracking-widest text-xs font-bold mb-6">The Founder's Trap</h3>
                 <p className="text-2xl font-serif text-white mb-4">Activity Over Clarity.</p>
                 <p className="text-stone-400 font-light leading-relaxed mb-6">
                   When things feel uncertain, most founders increase activity: more meetings, more brainstorming, more experiments. But activity is not progress. It’s often avoidance.
                 </p>
                 <div className="pt-4 border-t border-white/10">
                   <p className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-3">Avoidance of making hard decisions like:</p>
                   <ul className="text-[#A7F3D0] space-y-2 opacity-80">
                     <li>→ What NOT to build</li>
                     <li>→ Who NOT to target</li>
                     <li>→ Which direction to ignore</li>
                   </ul>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHAT STRATEGIC ADVISORY ACTUALLY MEANS (5 Focus Areas) */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
             <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-6">What We Actually Do</h2>
             <p className="text-xl text-stone-500 font-light">
               Let's remove the vague definition. Advisory is not generic advice, motivational calls, or high-level "vision talk." <strong className="text-[#111827]">It is structured thinking applied to real decisions.</strong>
             </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Problem Framing */}
            <div className="bg-white border-2 border-[#111827] rounded-3xl p-8 shadow-[6px_6px_0px_0px_#111827] hover:-translate-y-2 transition-transform duration-300">
               <SplitSquareHorizontal className="w-10 h-10 text-[#111827] mb-6" />
               <h3 className="font-serif text-2xl font-bold text-[#111827] mb-4">1. Problem Framing</h3>
               <p className="text-stone-600 font-light mb-6">
                 Most founders try to solve the wrong problem. Before strategy, we define:
               </p>
               <ul className="space-y-3 text-sm font-medium text-stone-700">
                 <li className="flex gap-3"><span className="text-[#D97706]">✓</span> What is the real constraint?</li>
                 <li className="flex gap-3"><span className="text-[#D97706]">✓</span> What actually matters right now?</li>
                 <li className="flex gap-3"><span className="text-[#D97706]">✓</span> What is noise vs. signal?</li>
               </ul>
            </div>

            {/* 2. Decision Clarity */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
               <Filter className="w-10 h-10 text-stone-400 mb-6" />
               <h3 className="font-serif text-2xl font-bold text-[#111827] mb-4">2. Decision Clarity</h3>
               <p className="text-stone-600 font-light mb-6">
                 Strategy is not a document. It is a series of decisions. We focus on:
               </p>
               <ul className="space-y-3 text-sm font-medium text-stone-700">
                 <li className="flex gap-3"><span className="text-stone-400">•</span> Prioritization</li>
                 <li className="flex gap-3"><span className="text-stone-400">•</span> Trade-offs</li>
                 <li className="flex gap-3"><span className="text-stone-400">•</span> Sequencing</li>
               </ul>
               <div className="mt-6 pt-4 border-t border-stone-200">
                 <p className="text-xs font-bold text-[#D97706] uppercase tracking-wider">If everything is important, nothing gets done.</p>
               </div>
            </div>

            {/* 3. Stress-Testing */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
               <ActivitySquare className="w-10 h-10 text-stone-400 mb-6" />
               <h3 className="font-serif text-2xl font-bold text-[#111827] mb-4">3. Stress-Testing</h3>
               <p className="text-stone-600 font-light mb-6">
                 Ideas sound good in isolation. They break under pressure. We test them:
               </p>
               <ul className="space-y-3 text-sm font-medium text-stone-700">
                 <li className="flex gap-3"><span className="text-stone-400">•</span> Assumptions & Logic</li>
                 <li className="flex gap-3"><span className="text-stone-400">•</span> Revenue potential</li>
                 <li className="flex gap-3"><span className="text-stone-400">•</span> Scalability & Dependencies</li>
               </ul>
               <div className="mt-6 pt-4 border-t border-stone-200">
                 <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Before the market does it for you.</p>
               </div>
            </div>

            {/* 4. GTM Reality */}
            <div className="bg-[#1B4B43] border-2 border-[#1B4B43] rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(27,75,67,0.3)] hover:-translate-y-2 transition-transform duration-300 text-white md:col-span-2 lg:col-span-1">
               <LineChart className="w-10 h-10 text-[#34D399] mb-6" />
               <h3 className="font-serif text-2xl font-bold text-white mb-4">4. GTM Reality Check</h3>
               <p className="text-[#A7F3D0] font-light mb-6">
                 Founders don’t fail in building. They fail in distribution. We answer:
               </p>
               <ul className="space-y-3 text-sm font-medium text-stone-100">
                 <li className="flex gap-3"><span className="text-[#34D399]">→</span> Who actually buys?</li>
                 <li className="flex gap-3"><span className="text-[#34D399]">→</span> Why now?</li>
                 <li className="flex gap-3"><span className="text-[#34D399]">→</span> Through which channel?</li>
               </ul>
               <div className="mt-6 pt-4 border-t border-white/20">
                 <p className="text-xs font-medium text-stone-300 italic">Not in theory — in reality.</p>
               </div>
            </div>

            {/* 5. Frameworks */}
            <div className="bg-[#D97706] border-2 border-[#D97706] rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(217,119,6,0.3)] hover:-translate-y-2 transition-transform duration-300 text-white md:col-span-2 lg:col-span-2">
               <ListOrdered className="w-10 h-10 text-[#FEF3C7] mb-6" />
               <h3 className="font-serif text-2xl font-bold text-white mb-4">5. Prioritization Frameworks</h3>
               <p className="text-[#FEF3C7] font-light mb-6">
                 This is where execution changes. We introduce simple but strict frameworks to decide what to do now, what to delay, and what to ignore.
               </p>
               <div className="p-4 bg-white/10 rounded-xl">
                 <p className="text-lg font-serif">Strategy is as much about exclusion as it is about direction.</p>
               </div>
            </div>
            
          </div>
        </section>

        {/* 4. THE ROLE OF THE ADVISOR (Glassmorphism & Contrast) */}
        <section className="py-32 bg-stone-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 relative z-10 items-center">
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#1B4B43] rounded-full blur-[100px] opacity-30 pointer-events-none" />
              
              <h2 className="font-serif text-4xl text-white mb-6 relative z-10">Why you can't do this alone</h2>
              <p className="text-stone-300 text-lg font-light leading-relaxed mb-8 relative z-10">
                Because founders are too close to the problem. You are emotionally invested, cognitively overloaded, and biased by past decisions.
              </p>
              
              <blockquote className="border-l-2 border-[#1B4B43] pl-6 py-2 mb-8 text-xl font-serif text-white relative z-10">
                "External perspective improves decision quality by reducing cognitive bias."<br/>
                <span className="text-xs font-sans text-stone-500 uppercase tracking-widest mt-2 block">— MIT Sloan Management Review</span>
              </blockquote>
            </div>

            <div className="bg-[#111827] border-2 border-stone-800 rounded-3xl p-10 md:p-14 shadow-2xl">
                <BrainCircuit className="w-12 h-12 text-[#D97706] mb-8" />
                <h3 className="font-bold text-stone-400 uppercase tracking-widest text-xs mb-4">The Role of an Advisor</h3>
                <p className="text-3xl font-serif text-white leading-snug mb-8">
                  Not to give answers. <br/>
                  <span className="text-stone-500 line-through">To make thinking easier.</span>
                </p>
                <div className="space-y-4">
                  {[
                    "To challenge your assumptions",
                    "To clarify your thinking",
                    "To force hard decisions",
                    "To remove illusions"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      <span className="text-lg text-stone-200">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-6 border-t border-stone-800">
                  <p className="text-xl font-bold text-[#D97706]">To make thinking sharper.</p>
                </div>
            </div>
            
          </div>
        </section>

        {/* 5. A REAL EXAMPLE (Before & After Slider Concept) */}
        <section className="py-24 bg-[#F5F5F4] border-y border-stone-200">
           <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
             <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827] text-white rounded-full text-[10px] uppercase tracking-widest mb-6">
                 A Simple Example
               </div>
               <h2 className="font-serif text-3xl md:text-5xl text-[#111827] mb-6">Clarity In Action</h2>
               <p className="text-stone-500 font-light text-lg mb-8">What changes when you strip away the noise and focus on strategic realities.</p>
               
               <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                  <h4 className="font-bold text-stone-800 mb-2">Before: Confusion</h4>
                  <ul className="text-stone-500 text-sm space-y-2">
                    <li>• 3 conflicting product directions</li>
                    <li>• 2 different target markets</li>
                    <li>• Unclear revenue model</li>
                    <li>• Constant debate, no execution</li>
                  </ul>
               </div>

             </div>

             <div className="space-y-6">
               <div className="bg-white p-8 rounded-3xl border-2 border-[#D97706] shadow-[8px_8px_0px_0px_rgba(217,119,6,0.1)]">
                  <h4 className="font-serif text-2xl text-[#111827] mb-4 flex items-center gap-3">
                    <Columns className="w-6 h-6 text-[#D97706]" /> What We Do
                  </h4>
                  <ol className="text-stone-600 space-y-3 mb-6 relative z-10">
                    <li><strong>1.</strong> Define constraint (time, resources, reality)</li>
                    <li><strong>2.</strong> Eliminate weak directions instantly</li>
                    <li><strong>3.</strong> Focus on ONE highly viable GTM path</li>
                    <li><strong>4.</strong> Align execution completely around it</li>
                  </ol>
                  
                  <div className="pt-6 border-t border-stone-100">
                    <h5 className="font-bold text-xs uppercase tracking-widest text-[#34D399] mb-3">Result: Focus</h5>
                    <ul className="text-[#111827] font-medium space-y-2">
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399]" /> Less confusion</li>
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399]" /> Faster decisions</li>
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399]" /> Clearer execution</li>
                    </ul>
                  </div>
               </div>
               <p className="text-center font-serif italic text-stone-500 text-lg">
                 "Founders don't become smarter. They become decisive."
               </p>
             </div>
           </div>
        </section>

        {/* 6. AUDIENCE & EXCLUSION */}
        <section className="py-24 bg-white border-t border-stone-200">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-3xl text-[#111827] mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-[#1B4B43]" /> Who This Is For
              </h2>
              <ul className="space-y-4">
                {[
                  "Early-stage founders with too many options",
                  "Teams stuck in endless decision loops",
                  "Founders actively preparing for growth or fundraising",
                  "People who feel 'busy but not moving forward'"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-center p-4 bg-[#FDFCF8] border border-stone-200 rounded-xl shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#1B4B43]" /> 
                    <span className="text-stone-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
               <h2 className="font-serif text-3xl text-stone-400 mb-6 flex items-center gap-3">
                <XCircle className="w-8 h-8 text-stone-300" /> Who This Is Not For
              </h2>
               <ul className="space-y-4 opacity-70 mb-8">
                {[
                  "People looking for validation, not challenge",
                  "Founders unwilling to make hard trade-offs",
                  "Teams expecting ready-made answers on a silver platter"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-center p-4 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="text-stone-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 border-l-4 border-[#D97706] bg-amber-50 rounded-r-lg">
                <p className="text-stone-800 font-bold text-sm uppercase tracking-widest mb-1">Requirements:</p>
                <p className="text-[#D97706] font-serif text-xl italic">Honesty. Discipline. Execution.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. REALITY CHECK & CONCLUSION */}
        <section className="py-32 bg-[#111827] text-white text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[#0d121c] opacity-50 z-0 mix-blend-multiply transition-opacity pointer-events-none" />
           <div className="relative z-10 max-w-4xl mx-auto px-6">
             <h2 className="font-serif text-4xl md:text-5xl mb-12 text-stone-300">A Simple Diagnostic</h2>
             
             <div className="grid sm:grid-cols-2 gap-4 mb-16 text-left">
                {[
                  "Can you clearly explain your priority for the next 30 days?",
                  "Do you know exactly what you are NOT doing?",
                  "Is your business model stress-tested — or assumed?",
                  "Are your decisions reactive or intentional?"
                ].map((q, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                    <p className="font-medium text-white">{q}</p>
                  </div>
                ))}
             </div>

             <div className="space-y-6">
                <p className="text-2xl font-light text-stone-400 mb-2">If these answers are unclear, you don’t have a strategy problem.</p>
                <p className="font-serif text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-[#D97706]">
                  You have a clarity problem.
                </p>
                <div className="max-w-2xl mx-auto pt-16 mt-16 border-t border-white/10">
                  <p className="text-lg font-light italic opacity-80 mb-6">
                    "The founders who move forward are not the ones with the best ideas. They are the ones who make clear decisions — and commit to them."
                  </p>
                  <p className="text-2xl font-serif text-[#D97706]">Strategy is not about knowing more.<br/> It’s about choosing better.</p>
                </div>
             </div>
           </div>
        </section>

        {/* 8. CTA */}
        <ServiceCta />
        
      </div>
    </div>
  );
}
