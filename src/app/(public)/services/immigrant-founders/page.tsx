// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-03-07
// Why: Immigrant Founders Service Page
// Env / Identity: React Server Component
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    CheckCircle2,
    XCircle,
    LineChart,
    MapPin,
    Landmark,
    Compass,
    ChevronRight,
    ShieldCheck,
    AlertTriangle,
    Lightbulb,
    Building2,
    Scale
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'For Immigrant Founders | Strategy & Navigation | Ashavid',
    description:
        'Business-first mentorship for immigrant entrepreneurs building real companies in Canada. Clarify positioning, navigate the ecosystem, and build credibility.',
};

// --- DATA ARRAYS ---
const coreProblems = [
    {
        title: 'Market Misunderstanding',
        icon: LineChart,
        desc: 'Many founders assume that markets behave the same everywhere. They don’t. Customer expectations, pricing logic, and trust dynamics can be very different.',
    },
    {
        title: 'Weak Positioning',
        icon: MapPin,
        desc: 'Founders often bring strong technical ideas but struggle to explain them clearly in the new market. A weak story makes even a good startup look risky.',
    },
    {
        title: 'Ecosystem Confusion',
        icon: Landmark,
        desc: 'Canada’s startup ecosystem includes incubators, accelerators, investors, immigration programs, and government initiatives. Without guidance, founders waste time chasing the wrong ones.',
    },
    {
        title: 'Cultural Misalignment',
        icon: Compass,
        desc: 'Business culture in Canada emphasizes credibility, transparency, realistic planning, and relationship building. Founders who ignore these signals struggle to build trust.',
    },
];

const workAreas = [
    {
        title: 'Founder Positioning',
        items: [
            'Clarifying your professional narrative',
            'Building credibility in a new market',
            'Communicating your background effectively',
        ],
    },
    {
        title: 'Business Model Direction',
        items: [
            'Validating whether your idea makes sense locally',
            'Adapting your business model to the Canadian market',
            'Identifying realistic opportunities',
        ],
    },
    {
        title: 'Market Entry Strategy',
        items: [
            'Defining your first customer segment',
            'Deciding where to focus your early efforts',
            'Avoiding premature scaling',
        ],
    },
    {
        title: 'Startup Visa Readiness',
        items: [
            'Strengthening your business concept',
            'Improving how you present your startup',
            'Aligning the business model with realistic expectations',
        ],
    },
    {
        title: 'Strategic Decision-Making',
        items: [
            'Evaluating opportunities',
            'Choosing partnerships carefully',
            'Avoiding distractions',
        ],
    },
];

const processSteps = [
    {
        step: '1',
        title: 'Diagnose',
        desc: 'We examine your current situation honestly: business idea, experience, market assumptions, risks, and blind spots.',
    },
    {
        step: '2',
        title: 'Clarify',
        desc: 'We identify the most important strategic questions. Often the problem is not the idea itself, but how it is framed.',
    },
    {
        step: '3',
        title: 'Structure',
        desc: 'We build a clear roadmap for the next stage. This might include repositioning your startup, redefining your target market, or improving your strategic narrative.',
    },
    {
        step: '4',
        title: 'Execute and Refine',
        desc: 'You move forward with clearer priorities. We review what works, what does not, and refine the approach.',
    },
];

const faqs = [
    {
        q: 'Is this immigration consulting?',
        a: 'No. This service focuses on business strategy for immigrant founders. It does not replace immigration legal advice.',
    },
    {
        q: 'Do you guarantee immigration outcomes?',
        a: 'No. No ethical professional should promise immigration outcomes. What I provide is strategic guidance to help founders build credible businesses.',
    },
    {
        q: 'Can early-stage founders apply?',
        a: 'Yes. Many founders begin working together at the idea or concept stage. Early clarity can prevent expensive mistakes later.',
    },
    {
        q: 'Do you only work with tech startups?',
        a: 'No. I work primarily with startups and innovative businesses, but the key factor is the seriousness of the founder, not the specific industry.',
    },
    {
        q: 'Do I need to already be in Canada?',
        a: 'Not necessarily. Some founders begin working together before relocating, especially when planning their strategy.',
    },
];

export default function ImmigrantFoundersPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#0F3F35] selection:text-white pb-24">
            {/* --- 1. HERO SECTION --- */}
            <header className="relative pt-32 pb-24 border-b border-stone-200 overflow-hidden">
                {/* Background visual asset representing connection / journey */}
                <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none">
                    <Image
                        src="https://images.unsplash.com/photo-1576088277258-2f168fdd2cb7?q=80&w=2674&auto=format&fit=crop"
                        alt="Bridge Structure"
                        fill
                        className="object-cover object-right skew-x-12 scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FDFBF7]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#D97706]/5 text-[#D97706] text-xs font-bold uppercase tracking-widest mb-8">
                            Service Profile
                        </div>

                        <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-[#0F3F35] mb-8">
                            For Immigrant Founders <br />
                            <span className="text-[#D97706]">Building Real Companies.</span>
                        </h1>

                        <div className="text-xl md:text-2xl text-[#0F3F35] leading-relaxed font-medium max-w-2xl mb-10 pl-6 border-l-4 border-[#0F3F35]">
                            Moving to a new country and building a business at the same time is one of the hardest paths an entrepreneur can take.
                        </div>

                        <p className="text-lg text-stone-600 leading-relaxed max-w-3xl mb-12">
                            Different culture. Different market. Different expectations. Many founders arrive with talent and ambition but quickly realize that what worked before does not always work here.<br /><br />
                            I help immigrant founders navigate that complexity with clarity, structure, and honest business thinking.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-16">
                            <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[#0F3F35] hover:bg-[#092822] text-white text-base transition-transform hover:scale-105 shadow-xl shadow-[#0F3F35]/20">
                                <Link href="/contact">Book a Strategy Call</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-stone-300 hover:border-[#D97706] hover:text-[#D97706] text-base transition-colors bg-white">
                                <Link href="#how-it-works">See How It Works</Link>
                            </Button>
                        </div>

                        {/* Tone setting strip */}
                        <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm font-mono text-stone-500 uppercase tracking-widest border-t border-stone-200 pt-8">
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35]" /> No shortcuts</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35]" /> No immigration theater</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" /> Real companies built with discipline</div>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* --- 2. THE REALITY IMMIGRANT FOUNDERS FACE --- */}
                <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
                    <h2 className="font-serif text-3xl md:text-5xl text-[#0F3F35] mb-8">The Reality Immigrant Founders Face</h2>
                    <div className="text-lg text-stone-600 leading-relaxed space-y-6">
                        <p className="font-medium text-xl text-[#0F3F35]">Most immigrant founders face two battles at the same time: The first battle is building a company. The second battle is understanding a completely new ecosystem.</p>
                        <p>Many talented founders fail not because their ideas are weak, but because they underestimate how different the environment can be.</p>

                        <div className="bg-white p-8 rounded-2xl border border-stone-200 my-12">
                            <p className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">Common Challenges Include:</p>
                            <ul className="space-y-4">
                                {[
                                    'Misunderstanding how business culture works in Canada',
                                    'Weak positioning in a new market',
                                    'Unrealistic expectations about immigration programs',
                                    'Difficulty building trust with partners and investors',
                                    'Trying to run before learning how the system works'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <ChevronRight className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                                        <span className="text-[#0F3F35] font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p>These problems are normal. But ignoring them is expensive. <strong className="text-[#0F3F35]">This service exists to help founders adapt intelligently, not blindly.</strong></p>
                    </div>
                </section>

                {/* --- 3. POSITIONING BLOCK: VISUAL COMPARISON --- */}
                <section className="py-20 bg-[#0F3F35] text-white">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
                            <div>
                                <h2 className="font-serif text-3xl md:text-4xl mb-6">What This Service Is</h2>
                                <p className="text-xl text-[#D97706] mb-8 font-medium">Strategic guidance for immigrant entrepreneurs building businesses in Canada.</p>
                                <div className="space-y-4 text-stone-300">
                                    <p>In simple terms: I help founders translate their experience, skills, and ideas into a business that actually works in this market.</p>
                                    <p>This service focuses exclusively on the business side of the immigrant founder journey: building a credible company, understanding the environment, developing realistic strategies, and avoiding costly mistakes.</p>
                                </div>
                            </div>

                            {/* The "Anti-Visa Consulting" block */}
                            <div className="bg-[#1C1917] p-8 md:p-10 rounded-2xl border border-stone-700 relative overflow-hidden">
                                <div className="absolute -top-12 -right-12 text-stone-800 opacity-30 rotate-12">
                                    <Scale className="w-48 h-48" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="font-sans font-bold text-sm tracking-widest uppercase text-stone-400 mb-6 border-b border-stone-700 pb-4">Critical Distinction</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 text-stone-300">
                                            <XCircle className="w-6 h-6 text-[#9A3412] shrink-0" />
                                            <p>This is <strong className="text-white">not</strong> an immigration consulting service.</p>
                                        </div>
                                        <div className="flex items-start gap-4 text-stone-300">
                                            <XCircle className="w-6 h-6 text-[#9A3412] shrink-0" />
                                            <p>It is <strong className="text-white">not</strong> a visa application service.</p>
                                        </div>
                                        <div className="flex items-start gap-4 pt-4 border-t border-stone-700">
                                            <ShieldCheck className="w-6 h-6 text-[#D97706] shrink-0" />
                                            <p className="text-white font-medium">This is founder strategy for immigrant builders.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 4 & 5. WHO IT IS FOR / NOT FOR --- */}
                <section className="py-24 bg-white border-y border-stone-200">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 lg:gap-24">
                        {/* For */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <CheckCircle2 className="w-8 h-8 text-[#0F3F35]" />
                                <h3 className="font-serif text-3xl text-[#0F3F35]">Who This Is For</h3>
                            </div>
                            <ul className="space-y-4 text-stone-600">
                                {[
                                    'Immigrant founders launching a startup in Canada',
                                    'Startup Visa applicants who want to build a real business',
                                    'Entrepreneurs relocating from another country and entering a new market',
                                    'Founders with technical or business backgrounds who need local strategy guidance',
                                    'Operators who want honest feedback about their plans',
                                    'Serious builders willing to adapt their approach',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <ChevronRight className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            {/* Situation cards micro-block */}
                            <div className="mt-10 grid grid-cols-2 gap-4">
                                <div className="p-4 bg-stone-50 rounded-lg border border-stone-100 text-xs font-bold uppercase tracking-wide text-stone-500 text-center flex items-center justify-center">Relocating Organically</div>
                                <div className="p-4 bg-stone-50 rounded-lg border border-stone-100 text-xs font-bold uppercase tracking-wide text-stone-500 text-center flex items-center justify-center">Startup Visa Pathway</div>
                            </div>
                        </div>

                        {/* Not For */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <AlertTriangle className="w-8 h-8 text-[#9A3412]" />
                                <h3 className="font-serif text-3xl text-[#9A3412]">Who This Is Not For</h3>
                            </div>
                            <ul className="space-y-4 text-stone-600">
                                {[
                                    'People looking for guaranteed immigration results',
                                    'Individuals searching for “easy visa” strategies',
                                    'Founders who are unwilling to adapt their business model',
                                    'Anyone who is only focused on paperwork without building a real company',
                                    'People looking for shortcuts or cosmetic startup ideas',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <ChevronRight className="w-5 h-5 text-stone-300 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 p-6 bg-[#FFF8F0] border border-[#D97706]/20 rounded-xl">
                                <p className="text-[#9A3412] font-medium">The goal here is not to game immigration systems. The goal is to build a business that deserves to exist.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 6. CORE PROBLEMS (Icon Grid) --- */}
                <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl text-[#0F3F35] mb-4">Core Problems Immigrant Founders Face</h2>
                        <p className="text-stone-600 text-lg">Most founders who come to Canada struggle with similar challenges.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {coreProblems.map((prob, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex gap-6">
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#0F3F35]/5 flex items-center justify-center text-[#0F3F35]">
                                    <prob.icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#0F3F35] mb-3">{prob.title}</h3>
                                    <p className="text-stone-600 text-sm leading-relaxed">{prob.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 7. WHAT WE WORK ON TOGETHER --- */}
                <section className="py-24 bg-stone-100 border-t border-stone-200">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <h2 className="font-serif text-3xl md:text-4xl text-[#0F3F35] mb-12 text-center">What We Work On Together</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {workAreas.map((area, i) => (
                                <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                                    <h3 className="text-xl font-bold text-[#0F3F35] mb-6 pb-4 border-b border-stone-100">{area.title}</h3>
                                    <ul className="space-y-3">
                                        {area.items.map((item, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-stone-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35] shrink-0 mt-1.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 8. HOW I WORK (Timeline) --- */}
                <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="bg-[#D97706] text-white border-none mb-6 pointer-events-none">Mentorship Process</Badge>
                        <h2 className="font-serif text-4xl text-[#0F3F35] mb-4">How I Work</h2>
                        <p className="text-stone-600 text-lg">My mentorship process focuses on clarity and structure.</p>
                    </div>

                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-300 before:to-transparent">
                        {processSteps.map((step, i) => (
                            <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#0F3F35] text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md">
                                    {step.step}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-xl border border-stone-200 shadow-sm transition duration-300 hover:shadow-md hover:border-[#0F3F35]">
                                    <h3 className="font-bold text-xl text-[#0F3F35] mb-2">{step.title}</h3>
                                    <p className="text-stone-600 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 9. WHAT MAKES THIS DIFFERENT --- */}
                <section className="py-24 bg-[#0F3F35] text-white">
                    <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl mb-6">What Makes This Different</h2>
                            <p className="text-stone-300 mb-8 font-medium">Most services around immigration focus on documents and procedures. This service focuses on building a real business foundation.</p>
                            <div className="p-6 bg-[#1C1917] rounded-xl border-l-4 border-[#D97706]">
                                <p className="text-xl font-serif text-white italic">&quot;You are not treated as a client trying to obtain a visa. You are treated as a founder trying to build something meaningful.&quot;</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-6">Key Differences:</p>
                            <ul className="space-y-4">
                                {[
                                    'Business-first approach',
                                    'Honest feedback instead of promises',
                                    'Focus on long-term credibility',
                                    'Guidance shaped by real startup experience',
                                    'Understanding both immigrant reality and founder psychology'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                        <Lightbulb className="w-5 h-5 text-[#D97706]" />
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* --- 10 & 11. TYPICAL SITUATIONS & FAQ --- */}
                <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
                    {/* Typical Situations */}
                    <div>
                        <h2 className="font-serif text-3xl text-[#0F3F35] mb-6">Typical Situations</h2>
                        <p className="text-stone-600 mb-8">This mentorship is often useful when founders feel:</p>

                        <ul className="space-y-5">
                            {[
                                'Uncertain about their business direction in Canada',
                                'Confused about how to position themselves locally',
                                'Unsure whether their startup idea fits the market',
                                'Overwhelmed by conflicting advice',
                                'Concerned about wasting time on the wrong path'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Building2 className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
                                    <span className="text-stone-600">{item}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 p-6 bg-stone-100 rounded-lg">
                            <p className="text-[#0F3F35] font-medium">If any of these feel familiar, structured guidance can make a significant difference.</p>
                        </div>
                    </div>

                    {/* FAQ Accordion */}
                    <div>
                        <h2 className="font-serif text-3xl text-[#0F3F35] mb-10">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, i) => (
                                <AccordionItem key={i} value={`faq-${i}`} className="border-stone-200">
                                    <AccordionTrigger className="text-left text-lg font-bold text-[#0F3F35] hover:text-[#D97706] hover:no-underline py-5">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-stone-600 text-base leading-relaxed pb-6">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* --- 12. FINAL CTA --- */}
                <section className="py-24 bg-[#F5F5F4] border-t border-stone-200 text-center px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-serif text-4xl md:text-5xl text-[#0F3F35] mb-6">
                            Build your next chapter with clarity.
                        </h2>
                        <p className="text-stone-600 mb-10 text-lg leading-relaxed">
                            If you are an immigrant founder serious about building a real company in Canada, this mentorship can help you think more clearly, adapt faster, and avoid costly mistakes.
                        </p>
                        <div className="flex justify-center flex-wrap gap-4">
                            <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[#0F3F35] hover:bg-[#092822] text-white text-base">
                                <Link href="/contact">Book a Strategy Call</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-stone-300 bg-white text-stone-600 hover:text-[#D97706]">
                                <Link href="/services">Explore Other Services</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
