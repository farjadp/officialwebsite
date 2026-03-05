// ============================================================================
// File Path: src/app/(public)/page.tsx
// Server Component — fetches real blog posts from the DB
// ============================================================================

import React from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export const revalidate = 60; // Revalidate at most every 60 seconds

import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  MessageCircle,
  ShieldCheck,
  Code2,
  Cpu,
  Rocket,
  ArrowRight,
  Clock
} from "lucide-react"

// --- Server-side data fetch: 3 latest PUBLISHED posts ---
// Promise.race ensures the page never hangs if the DB is unreachable locally
async function getLatestPosts() {
  const timeout = new Promise<never[]>((resolve) =>
    setTimeout(() => resolve([]), 3000)
  );
  const query = prisma.post
    .findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        readingTime: true,
        coverImage: true,
        categories: { select: { name: true }, take: 1 },
      },
    })
    .catch(() => [] as never[]);

  return Promise.race([query, timeout]);
}

export default async function HighConversionHome() {
  const latestPosts = await getLatestPosts();

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans selection:bg-[#1B4B43] selection:text-white overflow-x-hidden pb-24">

      {/* --- 1. HERO --- */}
      <section className="pt-28 md:pt-36 px-6 max-w-7xl mx-auto mb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-7 space-y-8">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none px-4 py-1.5 text-sm font-bold flex items-center gap-2 w-fit rounded-full shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Accepting New Teams for Q2
            </Badge>

            <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#111827] leading-[1.05] tracking-tight">
              Stop building <span className="line-through text-stone-300 decoration-red-400">dead software</span>.<br />
              Start building <span className="text-[#1B4B43]">scalable companies</span>. 🚀
            </h1>

            <p className="text-xl md:text-2xl text-stone-600 font-light leading-relaxed max-w-2xl">
              I am <span className="font-bold text-[#111827]">Farjad</span>. I help founders build businesses from scratch, mentor product teams, and engineer custom AI &amp; automation systems that actually generate revenue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="#services" className="w-full sm:w-auto">
                <Button className="w-full bg-[#1B4B43] hover:bg-[#111827] text-white h-16 px-10 text-lg font-bold rounded-2xl shadow-xl shadow-[#1B4B43]/20 hover:scale-105 transition-all">
                  See How I Can Help You 👇
                </Button>
              </Link>
              <Link href="/booking" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-2 border-stone-200 text-stone-700 h-16 px-10 text-lg font-bold rounded-2xl hover:bg-stone-100 transition-all flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Book a Discovery Call
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -top-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 flex items-center gap-3">
              <div className="text-3xl">⚙️</div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Tech Focus</p>
                <p className="font-bold text-[#111827] text-lg">AI &amp; Custom Systems</p>
              </div>
            </div>

            <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-stone-200 group">
              <img
                src="/images/farjad.png"
                alt="Farjad - Startup Advisor & Tech Mentor"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 z-20 bg-[#111827] text-white p-4 rounded-2xl shadow-xl border border-stone-800 flex items-center gap-3">
              <div className="text-3xl">🤝</div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Track Record</p>
                <p className="font-bold text-white text-lg">25+ Startups Mentored</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* --- 2. THE PROBLEM --- */}
      <section className="bg-white border-y border-stone-200 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#111827] mb-4">The &quot;Feature Factory&quot; Trap 🪤</h2>
            <p className="text-stone-500 text-lg">Most businesses fail because they build the wrong things, the wrong way.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
                <h3 className="text-xl font-bold text-red-900">What Agencies Sell You</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><span className="text-xl">💸</span> <span className="text-red-800 font-medium">Overpriced, bloated software.</span></li>
                <li className="flex items-start gap-3"><span className="text-xl">🤡</span> <span className="text-red-800 font-medium">&quot;Yes-Men&quot; who build features nobody wants.</span></li>
                <li className="flex items-start gap-3"><span className="text-xl">📉</span> <span className="text-red-800 font-medium">Messy code that breaks when you scale.</span></li>
                <li className="flex items-start gap-3"><span className="text-xl">🐢</span> <span className="text-red-800 font-medium">Manual, slow operations draining your time.</span></li>
              </ul>
            </div>

            <div className="bg-[#1B4B43] p-8 rounded-3xl border border-[#1B4B43] shadow-lg shadow-[#1B4B43]/10 text-white">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <h3 className="text-xl font-bold text-white">What I Build With You</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3"><span className="text-xl">🏗️</span> <span className="text-white/90 font-medium">Lean, defensible business models from day 1.</span></li>
                <li className="flex items-start gap-3"><span className="text-xl">🤖</span> <span className="text-white/90 font-medium">Custom AI to automate your manual workflows.</span></li>
                <li className="flex items-start gap-3"><span className="text-xl">🧠</span> <span className="text-white/90 font-medium">Tough-love mentorship to keep teams focused.</span></li>
                <li className="flex items-start gap-3"><span className="text-xl">⚡</span> <span className="text-white/90 font-medium">Scalable, secure custom tech architectures.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* --- 3. CORE SERVICES --- */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-200 border-none px-4 py-1 font-bold">Core Expertise 💼</Badge>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#111827]">Exactly how we can work together.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white border-2 border-stone-200 rounded-3xl p-8 hover:border-[#1B4B43] hover:shadow-xl transition-all duration-300 flex flex-col group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Rocket className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3">0-to-1 Business Launch</h3>
            <p className="text-stone-500 mb-6 flex-1">
              Have an idea or capital but no execution power? I act as your technical/strategic co-founder to build your business from scratch.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Product &amp; GTM Strategy</div>
              <div className="flex items-center gap-2 text-sm font-medium text-stone-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Technical Architecture</div>
              <div className="flex items-center gap-2 text-sm font-medium text-stone-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Team Hiring &amp; Setup</div>
            </div>
            <Link href="/services">
              <Button className="w-full bg-[#111827] text-white hover:bg-[#1B4B43] rounded-xl h-12 font-bold">Launch Your Idea</Button>
            </Link>
          </div>

          <div className="bg-[#111827] text-white border-2 border-[#111827] rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 flex flex-col relative shadow-2xl">
            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-[#D97706] text-white border-none font-bold uppercase tracking-widest px-4 py-1">Most Popular ⭐</Badge>
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-3">Team Mentorship</h3>
            <p className="text-stone-400 mb-6 flex-1">
              I become the strategic sparring partner for you and your team. High-intensity mentorship to fix bottlenecks and accelerate growth.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-300"><CheckCircle2 className="w-4 h-4 text-green-400" /> Weekly Team Strategy Calls</div>
              <div className="flex items-center gap-2 text-sm font-medium text-stone-300"><CheckCircle2 className="w-4 h-4 text-green-400" /> Product Roadmap Alignment</div>
              <div className="flex items-center gap-2 text-sm font-medium text-stone-300"><CheckCircle2 className="w-4 h-4 text-green-400" /> Async Problem Solving</div>
            </div>
            <Link href="/startups">
              <Button className="w-full bg-[#1B4B43] text-white hover:bg-green-600 rounded-xl h-12 font-bold">See Mentored Startups</Button>
            </Link>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-3xl p-8 hover:border-[#1B4B43] hover:shadow-xl transition-all duration-300 flex flex-col group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3">AI &amp; Custom Systems</h3>
            <p className="text-stone-500 mb-6 flex-1">
              Digital transformation for traditional SMEs. I replace manual chaos with bespoke software and AI-driven automation.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Workflow Automation</div>
              <div className="flex items-center gap-2 text-sm font-medium text-stone-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> Custom Software Development</div>
              <div className="flex items-center gap-2 text-sm font-medium text-stone-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> AI Integration (LLMs)</div>
            </div>
            <Link href="/services">
              <Button className="w-full bg-[#111827] text-white hover:bg-[#1B4B43] rounded-xl h-12 font-bold">Systemize My Business</Button>
            </Link>
          </div>
        </div>
      </section>


      {/* --- 4. WHY ME? --- */}
      <section className="py-20 px-6 bg-[#F5F5F4] border-y border-stone-200">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-4xl font-bold text-[#111827] mb-6">Why trust me with your product? 🤔</h2>
            <p className="text-stone-600 text-lg mb-8">
              I am not an agency salesman selling you hours. I am a former CTO, an engineer, and a builder who knows how to scale systems and people.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm"><Code2 className="w-6 h-6 text-[#D97706]" /></div>
                <div>
                  <h4 className="font-bold text-[#111827]">Technical Mastery</h4>
                  <p className="text-sm text-stone-500">Deep expertise in cloud architecture, AI integration, and custom codebases.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm"><ShieldCheck className="w-6 h-6 text-[#1B4B43]" /></div>
                <div>
                  <h4 className="font-bold text-[#111827]">ISO 27001 Lead Auditor</h4>
                  <p className="text-sm text-stone-500">I build systems that are secure, compliant, and ready for enterprise scale.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm"><TrendingUp className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h4 className="font-bold text-[#111827]">Real World Results</h4>
                  <p className="text-sm text-stone-500">17+ years in tech, $3M+ raised for mentored teams, and multiple successful product launches.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg text-center">
            <h3 className="text-6xl mb-4">🏆</h3>
            <h4 className="text-2xl font-bold text-[#111827] mb-2">17 Years in Tech</h4>
            <p className="text-stone-500 font-medium mb-6">MSc Software &amp; PhD in Anthropology</p>
            <div className="w-full h-px bg-stone-100 mb-6"></div>
            <p className="text-sm text-stone-400 italic">&quot;The rare mix of understanding how machines work, and how humans think.&quot;</p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1B4B43] hover:underline">
              Full Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      {/* --- 5. LATEST ARTICLES (Live from DB) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200 border-none px-4 py-1 font-bold">Writings &amp; Thoughts ✍️</Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#111827]">Inside my brain.</h2>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-[#111827] font-bold hover:text-[#1B4B43] group">
            View Entire Library <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {latestPosts.map((post) => {
              const categoryName = post.categories[0]?.name ?? "Essay";
              const formattedDate = post.publishedAt
                ? new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" }).format(new Date(post.publishedAt)).toUpperCase()
                : "";
              return (
                <Link href={`/blog/${post.slug}`} key={post.slug} className="bg-white border-2 border-stone-200 rounded-3xl overflow-hidden hover:border-[#1B4B43] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                  {/* Cover image */}
                  <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 shrink-0">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">
                        ✍️
                      </div>
                    )}
                    {/* Category pill over image */}
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-[#1B4B43] bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      {categoryName}
                    </span>
                    {post.readingTime && (
                      <span className="absolute top-3 right-3 text-[10px] text-stone-600 font-mono flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                        <Clock className="w-3 h-3" /> {post.readingTime} min
                      </span>
                    )}
                  </div>
                  {/* Text content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-xl font-bold text-[#111827] mb-2 group-hover:text-[#1B4B43] transition-colors leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-stone-500 flex-1 leading-relaxed text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto border-t border-stone-100 pt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-400 font-mono">{formattedDate}</span>
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-[#1B4B43] group-hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-stone-200 rounded-3xl">
            <p className="text-2xl mb-3">✍️</p>
            <p className="text-stone-500 font-medium">New essays coming soon.</p>
            <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1B4B43] hover:underline">
              Visit the Blog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>


      {/* --- 6. FINAL CTA --- */}
      <section id="contact" className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-[#1B4B43] rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 opacity-20 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-6">🎯</div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">Ready to execute?</h2>
            <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
              Stop wasting time on noise and bad code. Let&apos;s get on a 30-minute discovery call. We diagnose your bottleneck, and if we are a fit, we start building.
            </p>
            <Link href="/booking">
              <Button className="bg-white text-[#111827] hover:bg-stone-200 h-16 px-10 text-xl font-bold rounded-2xl w-full sm:w-auto shadow-lg hover:scale-105 transition-all">
                Book Your Discovery Call 📅
              </Button>
            </Link>
            <p className="text-xs text-white/50 mt-6 uppercase tracking-widest font-medium">No fluff. No agency BS. Just facts.</p>
          </div>
        </div>
      </section>

    </div>
  )
}