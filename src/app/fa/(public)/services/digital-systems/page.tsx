import React from "react";
import Link from "next/link";
import { ArrowLeft, Box, Network, Orbit, RefreshCw, TriangleAlert, BrainCircuit, ShieldAlert, CheckCircle2, XCircle, ActivitySquare, SplitSquareHorizontal, MoveRight, Copy } from "lucide-react";
import { ServiceCta } from "@/components/public/service-cta";

export default function DigitalSystemsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans overflow-x-hidden selection:bg-[#1B4B43] selection:text-white">
      {/* Background Assets */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(#E7E5E4 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Navigation */}
      <div className="absolute top-8 left-6 md:left-12 z-50">
        <Link href="/services" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-stone-200 rounded-full text-stone-600 hover:text-[#1B4B43] hover:bg-white transition-all font-medium text-sm shadow-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </Link>
      </div>

      <div className="relative z-10 w-full">
        
        {/* 1. THE STATEMENT (HERO) */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-8 overflow-hidden group">
            <span className="w-2 h-2 rounded-full bg-[#1B4B43] group-hover:animate-pulse" />
            Digital Systems & AI
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] text-[#111827] tracking-tighter leading-[0.9] max-w-5xl">
            You cannot <br />
            <span className="text-[#D97706] italic">automate</span> confusion.
          </h1>
          
          <div className="mt-12 text-xl md:text-2xl text-stone-500 font-light max-w-2xl leading-relaxed space-y-4">
            <p className="font-medium text-[#111827]">
              Most businesses today don’t have a technology problem.<br />
              They have a clarity problem.
            </p>
            <p className="text-lg">
              They jump into automation. They experiment with AI. They subscribe to tools. And still — nothing fundamentally improves. Work remains chaotic. Teams stay overloaded. Decisions are slow.
            </p>
          </div>
          
          <div className="mt-16 animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-stone-300 to-transparent mx-auto" />
          </div>
        </section>

        {/* 2. THE ILLUSION (Dark / Warning) */}
        <section className="py-32 bg-[#111827] text-white relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <ShieldAlert className="w-12 h-12 text-[#D97706]" />
               <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                 The Illusion of "Digital Transformation"
               </h2>
               <p className="text-stone-400 text-lg leading-relaxed font-light">
                 “Digital transformation” has become an overused term. In practice, it usually means adding more tools, dashboards, and AI features — while hiring someone to "handle automation."
               </p>
               <div className="p-6 border-l-2 border-red-500 bg-white/5 backdrop-blur-sm rounded-r-lg">
                 <p className="text-xl font-serif text-white mb-2">
                   "Over 70% of digital transformation initiatives fail."
                 </p>
                 <p className="text-sm font-sans text-stone-500 uppercase tracking-widest">— McKinsey, 2018–2022</p>
               </div>
               <p className="text-xl text-stone-300">
                 Why? <strong className="text-red-400">Because companies digitize existing chaos instead of redesigning how work actually happens.</strong>
               </p>
            </div>
            
            <div className="grid gap-6">
               {/* Think vs Actually Need Bento */}
               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm group hover:border-white/20 transition-all">
                  <h3 className="text-stone-500 uppercase tracking-widest text-xs font-bold mb-6">What businesses think they need</h3>
                  <ul className="space-y-4">
                    {["We need automation", "We need AI", "We need better tools"].map((t, i) => (
                      <li key={i} className="flex gap-4 items-center text-stone-300 line-through decoration-red-500/50">
                        <XCircle className="w-5 h-5 text-red-500/50" /> {t}
                      </li>
                    ))}
                  </ul>
               </div>

               <div className="bg-[#1B4B43]/20 border border-[#1B4B43]/40 p-8 rounded-3xl backdrop-blur-sm shadow-[0_0_40px_rgba(27,75,67,0.2)]">
                  <h3 className="text-[#34D399] uppercase tracking-widest text-xs font-bold mb-6">What they actually need</h3>
                  <ul className="space-y-4">
                    {["Clear workflows", "Defined responsibilities", "Structured data flow", "System-level thinking"].map((t, i) => (
                      <li key={i} className="flex gap-4 items-center text-white font-medium">
                        <CheckCircle2 className="w-5 h-5 text-[#34D399]" /> {t}
                      </li>
                    ))}
                  </ul>
               </div>
               <p className="text-center text-stone-400 text-sm mt-2 italic font-serif">Without this foundation, every tool becomes another layer of complexity.</p>
            </div>
          </div>
        </section>

        {/* 3. THE REAL PROBLEM (Visual Fragmenting) */}
        <section className="py-32 px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-6">Fragmented Operations</h2>
            <p className="text-xl text-stone-500 font-light">
              In most SMEs and startups, operations evolve organically. Sales uses one system. Marketing uses another. Operations runs on spreadsheets. <em className="text-[#1B4B43]">Founders connect everything manually.</em>
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-16">
            {[
              { title: "Duplicated Work", icon: Copy },
              { title: "Inconsistent Data", icon: Network },
              { title: "Communication Gaps", icon: SplitSquareHorizontal },
              { title: "Decision Delays", icon: Orbit },
            ].map((step, i) => (
              <div key={i} className="p-8 flex flex-col justify-between rounded-3xl bg-white border border-stone-200 text-stone-800 shadow-sm hover:-translate-y-1 transition-transform">
                <step.icon className="w-8 h-8 text-stone-300 mb-6" />
                <h3 className="font-serif text-xl font-medium">{step.title}</h3>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-[#F5F5F4] p-8 md:p-12 rounded-3xl border border-stone-200 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-300/20 rounded-full blur-3xl" />
            <h3 className="font-serif text-3xl md:text-4xl text-[#111827] leading-tight mb-4">
              Employees spend up to 60% of their time on "work about work"
            </h3>
            <p className="text-stone-500 uppercase tracking-widest text-xs mb-8">— Harvard Business Review, 2019</p>
            <p className="text-xl font-bold text-[#D97706]">That’s not inefficiency. That’s structural failure.</p>
          </div>
        </section>

        {/* 4. THE AI REALITY CHECK (Glassmorphism Bento) */}
        <section className="py-32 bg-stone-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 relative z-10">
            
            {/* Left AI Logic */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#D97706] rounded-full blur-[120px] opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none" />
              
              <BrainCircuit className="w-12 h-12 text-[#D97706] mb-8 relative z-10" />
              <h2 className="font-serif text-4xl text-white mb-6 relative z-10">Why AI Fails in Most Businesses</h2>
              
              <div className="space-y-6 text-stone-300 text-lg font-light leading-relaxed relative z-10">
                <p>AI is powerful. That’s not the problem. The problem is where and how it’s applied.</p>
                <blockquote className="border-l-2 border-[#D97706] pl-6 py-2 my-8 text-xl font-serif text-white">
                  "80% of AI projects fail to deliver meaningful ROI."<br/>
                  <span className="text-xs font-sans text-stone-500 uppercase tracking-widest mt-2 block">— Gartner AI Adoption Report, 2023</span>
                </blockquote>
                <p>Not because the models are weak. But because businesses apply AI without structured workflows, lack clean data, and expect AI to replace thinking.</p>
              </div>
            </div>

            {/* Right Approach comparison */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#111827] border border-stone-800 rounded-3xl p-10 flex-1 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/20 blur-3xl pointer-events-none" />
                <span className="text-red-400 font-bold tracking-widest uppercase text-xs mb-6">The Core Mistake</span>
                <p className="text-3xl font-serif text-white leading-snug mb-4">Most teams try to use AI as a shortcut.</p>
                <p className="text-xl text-stone-400 font-light">It only works as a multiplier.</p>
              </div>
              
              <div className="bg-[#1B4B43] border border-[#19403a] rounded-3xl p-10 flex-1 flex flex-col justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                <h3 className="text-2xl font-serif text-white leading-snug">
                  AI does not fix broken processes.
                </h3>
                <p className="text-[#A7F3D0] text-lg mt-4 font-light">
                  It amplifies whatever system already exists — good or bad.
                </p>
              </div>
            </div>
            
          </div>
        </section>

        {/* 5. WHAT IT ACTUALLY MEANS (Methodology Grid) */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-6">What "Digital Systems & AI" Actually Means</h2>
            <p className="text-lg text-stone-500 font-light">
              This is where most people misunderstand the work. It is not about installing tools, building random automations, or adding AI for the sake of it. <strong className="text-[#111827]">It is about designing how your business runs.</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                num: "01", 
                title: "Workflow Clarity Before Automation", 
                desc: "Before automating, we answer: What is the exact workflow? Where are the bottlenecks? Who owns each step?",
                alert: "If workflow is unclear, automation will fail." 
              },
              { 
                num: "02", 
                title: "System Design, Not Tool Selection", 
                desc: "Most start with tools. We start with structure. We define processes, dependencies, and decision points first.",
                alert: "Only then do we choose tools." 
              },
              { 
                num: "03", 
                title: "AI Integration as a Layer", 
                desc: "Not a foundation. We introduce AI only where it creates leverage: repetitive decisions, high volume, data-heavy flows.",
                alert: "Always within a defined system." 
              },
              { 
                num: "04", 
                title: "Reducing Complexity", 
                desc: "A good system feels simpler over time, not heavier. This means removing tools and consolidating workflows.",
                alert: "Complexity is the silent killer." 
              }
            ].map((step, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-4xl font-serif text-stone-200 block mb-6">{step.num}</span>
                  <h3 className="font-bold text-xl text-[#111827] mb-4">{step.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-6">{step.desc}</p>
                </div>
                <div className="pt-4 border-t border-stone-100 mt-auto">
                  <p className="text-xs font-bold text-[#D97706] uppercase tracking-wider">{step.alert}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. A REAL EXAMPLE (Before & After Slider Concept) */}
        <section className="py-24 bg-[#F5F5F4] border-y border-stone-200">
           <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
             <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827] text-white rounded-full text-[10px] uppercase tracking-widest mb-6">
                 Case Study
               </div>
               <h2 className="font-serif text-3xl md:text-5xl text-[#111827] mb-6">A Real Example</h2>
               <p className="text-stone-500 font-light text-lg mb-8">How a growing SME shifted from chaos to leverage utilizing structured systems.</p>
               
               <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                  <h4 className="font-bold text-stone-800 mb-2">Before: Chaos</h4>
                  <ul className="text-stone-500 text-sm space-y-2">
                    <li>• Using 6+ disconnected tools</li>
                    <li>• Manual reporting every week</li>
                    <li>• Founders stuck in daily operations</li>
                    <li>• Agonizingly slow decision-making</li>
                  </ul>
               </div>

             </div>

             <div className="space-y-6">
               <div className="bg-white p-8 rounded-3xl border-2 border-[#1B4B43] shadow-[8px_8px_0px_0px_rgba(27,75,67,0.1)]">
                  <h4 className="font-serif text-2xl text-[#111827] mb-4 flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-[#1B4B43]" /> What Changed
                  </h4>
                  <ol className="text-stone-600 space-y-3 mb-6 relative z-10">
                    <li><strong>1.</strong> Mapped actual workflows</li>
                    <li><strong>2.</strong> Removed redundant steps</li>
                    <li><strong>3.</strong> Integrated key tools cleanly</li>
                    <li><strong>4.</strong> Introduced AI for reporting & queries</li>
                  </ol>
                  
                  <div className="pt-6 border-t border-stone-100">
                    <h5 className="font-bold text-xs uppercase tracking-widest text-[#D97706] mb-3">Result: Leverage</h5>
                    <ul className="text-[#111827] font-medium space-y-2">
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399]" /> Faster decisions</li>
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399]" /> Reduced manual work</li>
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399]" /> Clearer accountability</li>
                    </ul>
                  </div>
               </div>
               <p className="text-center font-serif italic text-stone-500 text-lg">
                 "No fancy AI product. Just structured systems."
               </p>
             </div>
           </div>
        </section>

        {/* 7. STRATEGIC ADVANTAGE & AUDIENCE */}
        <section className="py-32 px-6 max-w-6xl mx-auto grid md:grid-cols-12 gap-16">
          <div className="md:col-span-5 relative">
            <div className="sticky top-24 bg-[#111827] p-10 rounded-3xl text-white overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#1B4B43] rounded-full blur-[80px] opacity-40 pointer-events-none" />
              <h3 className="font-serif text-3xl mb-6 relative z-10">The Strategic Advantage</h3>
              <p className="text-stone-300 font-light mb-8 relative z-10">Businesses that invest in robust systems gain massive leverage.</p>
              <ul className="space-y-4 mb-10 relative z-10 border-l-2 border-white/10 pl-4">
                <li className="text-white">Operational clarity</li>
                <li className="text-white">Faster execution</li>
                <li className="text-white">Lower dependency on individuals</li>
                <li className="text-white">Better scalability</li>
              </ul>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md relative z-10 text-xs text-stone-300 font-light italic">
                Deloitte: "Organizations with strong operational design outperform peers in both efficiency and employee satisfaction."
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-12">
            <div>
              <h2 className="font-serif text-3xl text-[#111827] mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-[#1B4B43]" /> Who This Is Actually For
              </h2>
              <p className="text-stone-500 mb-6">This work is not for everyone. It's for:</p>
              <ul className="space-y-4">
                {[
                  "Founders scaling beyond early chaos",
                  "SMEs stuck in operational inefficiency",
                  "Teams overwhelmed by manual processes",
                  "Companies trying (and failing) to use AI effectively"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-center p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
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
              <p className="text-stone-500 mb-6">Let's be clear.</p>
               <ul className="space-y-4 opacity-70">
                {[
                  "People looking for 'quick AI hacks'",
                  "Teams unwilling to change how they operate",
                  "Businesses without real workflows yet"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-center p-4 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="text-stone-600">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 border-l-4 border-[#D97706] bg-amber-50 rounded-r-lg">
                <p className="text-stone-800 font-bold">Because this work requires:</p>
                <p className="text-[#D97706] font-serif text-2xl mt-2 italic">Clarity. Discipline. Implementation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. REALITY CHECK & CONCLUSION */}
        <section className="py-32 bg-[#1B4B43] text-white text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[#0f2e29] opacity-50 z-0 mix-blend-multiply transition-opacity pointer-events-none" />
           <div className="relative z-10 max-w-4xl mx-auto px-6">
             <h2 className="font-serif text-4xl md:text-6xl mb-12 text-[#A7F3D0]">A Simple Reality Check</h2>
             
             <div className="grid sm:grid-cols-2 gap-4 mb-16 text-left">
                {[
                  "Are your operations dependent on specific people?",
                  "Do your tools actually reduce friction — or add it?",
                  "Can you clearly explain how work flows in your business?",
                  "Are you using AI — or just experimenting with it?"
                ].map((q, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl">
                    <p className="font-medium text-white/90">{q}</p>
                  </div>
                ))}
             </div>

             <div className="space-y-6">
                <p className="text-2xl font-light text-[#D1FAE5]">If these answers are unclear, your problem is not technology.</p>
                <p className="font-serif text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]">
                  It's structure.
                </p>
                <div className="max-w-xl mx-auto pt-16 mt-16 border-t border-white/20">
                  <p className="text-lg font-light italic opacity-80 mb-4">
                    "Teams don’t fail because they lack effort. They fail because they lack structure."
                  </p>
                  <p className="text-xl font-bold">And structure is not built by tools. It is designed.</p>
                </div>
             </div>
           </div>
        </section>

        {/* 9. CTA */}
        <ServiceCta />
        
      </div>
    </div>
  );
}
