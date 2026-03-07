// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-03-07
// Why: Founder Mentorship Service Page
// Env / Identity: React Server Component
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import {
    CheckCircle2,
    XCircle,
    Brain,
    MessageSquare,
    Crosshair,
    Network,
    Globe2,
    Terminal,
    Activity,
    Layers,
    ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Founder Mentorship | Strategic Guidance | Ashavid',
    description:
        'Strategic guidance for early-stage founders, immigrant entrepreneurs, and serious operators. Clarity, structure, and honest execution.',
};

// --- DATA ARRAYS ---
const focusAreas = [
    {
        title: 'Founder Clarity',
        icon: Brain,
        description: 'When you know too many things, your mind can become your own enemy.',
        bullets: [
            'Clarifying the real problem',
            'Separating noise from signal',
            'Identifying the true bottleneck',
            'Reducing decision fatigue',
            'Turning scattered ideas into a working plan',
        ],
    },
    {
        title: 'Business Model Direction',
        icon: Layers,
        description: 'A good founder with a weak business model is still in danger.',
        bullets: [
            'Business model structure',
            'Offer design',
            'Value proposition clarity',
            'Pricing logic',
            'Target customer definition',
            'Commercial realism',
        ],
    },
    {
        title: 'Positioning and Messaging',
        icon: MessageSquare,
        description: 'A weak message makes a strong startup look weak.',
        bullets: [
            'Who you serve',
            'What problem you actually solve',
            'How to describe your product clearly',
            'How to sound credible in the market',
            'How to avoid confusing investors & partners',
        ],
    },
    {
        title: 'Go-to-Market Thinking',
        icon: Crosshair,
        description: 'Many founders build first and think later. That is expensive.',
        bullets: [
            'First audience selection',
            'Market entry logic',
            'Traction priorities',
            'Early validation strategy',
            'Distribution thinking',
            'Practical next steps instead of abstract talk',
        ],
    },
    {
        title: 'Founder Decision-Making',
        icon: Activity,
        description: 'Some founders do not need more information. They need better judgment.',
        bullets: [
            'Prioritization',
            'Timing',
            'Trade-offs',
            'Co-founder questions',
            'Opportunity evaluation',
            'When to persist and when to stop',
        ],
    },
    {
        title: 'Immigrant Founder Reality',
        icon: Globe2,
        description: 'Building in a new country creates extra friction.',
        bullets: [
            'Adapting to Canadian market expectations',
            'Credibility building',
            'Cultural differences in business behavior',
            'Realistic sequencing',
            'Separating business strategy from visa fantasy',
        ],
    },
];

const processSteps = [
    {
        step: '1',
        title: 'Diagnose',
        desc: 'Understanding your current reality. Stage, blockers, confusion, and unseen risks. The goal is not to impress me. The goal is truth.',
    },
    {
        step: '2',
        title: 'Clarify',
        desc: 'Identifying the real problem behind the visible problem. Sometimes it is not traction—it is a founder solving the wrong problem.',
    },
    {
        step: '3',
        title: 'Structure',
        desc: 'Turning insight into a plan. A new decision framework, priority mapping, revised positioning, and 2-to-6 week tactical focus areas.',
    },
    {
        step: '4',
        title: 'Execute and Refine',
        desc: 'You implement. We review what changed. We refine as reality responds. This is where real progress happens.',
    },
];

const formats = [
    {
        name: 'Single Strategic Session',
        target: 'Founders who need sharp clarity on one issue.',
        bestFor: ['Idea review', 'Direction reset', 'Offer or positioning review', 'One major strategic question'],
    },
    {
        name: 'Short-Term Mentorship',
        target: 'A structured engagement over several weeks.',
        bestFor: ['Founders in transition', 'Market entry preparation', 'Startup visa readiness thinking', 'Business model refinement'],
    },
    {
        name: 'Ongoing Private Mentorship',
        target: 'High-trust, selective support for building over a longer period.',
        bestFor: ['Serious founders making repeated strategic decisions', 'Immigrant founders building in Canada', 'Leaders who want continuity'],
    },
];

const faqs = [
    {
        q: 'Do you guarantee results?',
        a: 'No. I do not guarantee funding, traction, immigration outcomes, or startup success. Anyone who does is either careless or dishonest. What I do provide is strategic clarity, direct feedback, and a stronger decision-making process.',
    },
    {
        q: 'Do you work only with Startup Visa founders?',
        a: 'No. I work with Startup Visa founders, immigrant entrepreneurs, and other serious early-stage founders. The common factor is not the visa path. The common factor is the need for clarity and structure.',
    },
    {
        q: 'Do you help with the business side or the founder side?',
        a: 'Both. A founder’s confusion always shows up in the business. A weak business model creates pressure on the founder. We work across both where needed.',
    },
    {
        q: 'I am still at the idea stage. Is this too early?',
        a: 'Not necessarily. Early-stage founders can benefit a lot from mentorship if they are serious and open to challenge. In many cases, early clarity prevents expensive mistakes later.',
    },
    {
        q: 'Do you write the business for me?',
        a: 'No. I do not replace the founder. I guide, challenge, and structure. You still have to build the company.',
    },
    {
        q: 'How do I know if I am a fit?',
        a: 'If you are serious, honest, open to feedback, and willing to do the work, there is a good chance this can help. If you want a shortcut, a guarantee, or a performance of confidence, it is not the right fit.',
    },
];

export default function FounderMentorshipPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#0F3F35] selection:text-white pb-24">
            {/* --- 1. HERO SECTION --- */}
            <header className="relative pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-stone-200">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#D97706]/5 text-[#D97706] text-xs font-bold uppercase tracking-widest mb-8">
                        Service Profile
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] text-[#0F3F35] mb-6">
                        Founder <br />
                        <span className="text-[#D97706]">Mentorship.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-stone-600 leading-relaxed font-medium max-w-3xl mb-10">
                        Strategic guidance for founders who need clarity, structure, and honest execution.
                    </p>

                    <p className="text-lg text-stone-600 leading-relaxed max-w-3xl mb-12">
                        I work with early-stage founders, immigrant entrepreneurs, and serious operators who are building real companies and facing real uncertainty.
                        <strong> This is not motivational coaching.</strong> This is practical mentorship for people who need sharper thinking, better decisions, and a more disciplined path forward.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[#0F3F35] hover:bg-[#092822] text-white text-base transition-transform hover:scale-105 shadow-xl shadow-[#0F3F35]/20">
                            <Link href="/contact">Book a Strategy Call</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-stone-300 hover:border-[#D97706] hover:text-[#D97706] text-base transition-colors bg-white">
                            <Link href="#how-it-works">See How It Works</Link>
                        </Button>
                    </div>

                    {/* Micro-tone line */}
                    <div className="mt-12 flex items-center gap-3 text-sm font-mono text-stone-400 uppercase tracking-widest opacity-80">
                        <Terminal className="w-4 h-4" />
                        <span>Direct feedback. Clear thinking. No startup theater.</span>
                    </div>
                </div>
            </header>

            <main>
                {/* --- 2. INTRO --- */}
                <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
                    <h2 className="font-serif text-3xl md:text-4xl text-[#0F3F35] mb-8">What Founder Mentorship Actually Means</h2>
                    <div className="space-y-6 text-lg text-stone-600 leading-relaxed">
                        <p>Most founders do not fail because they are lazy.<br />They fail because they stay too long in confusion.</p>
                        <ul className="pl-6 border-l-2 border-[#D97706] space-y-2 py-2">
                            <li>They work on the wrong priorities.</li>
                            <li>They say yes to the wrong people.</li>
                            <li>They build without a clear market signal.</li>
                            <li>They waste time trying to look like founders instead of learning how to think like one.</li>
                        </ul>
                        <p><strong>Founder Mentorship is designed to solve that.</strong></p>
                        <p>
                            This service gives you a structured space to think clearly, challenge assumptions, and make better decisions across strategy, positioning, execution, and founder judgment.
                        </p>
                        <p className="text-[#0F3F35] font-medium text-xl">
                            We work on the business, but we also work on the founder behind the business. Because weak decision-making at the top creates chaos everywhere else.
                        </p>
                    </div>
                </section>

                {/* --- 3 & 4. WHO IT IS FOR / NOT FOR --- */}
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
                                    'Early-stage founders who need strategic clarity',
                                    'Startup Visa founders preparing to build a real company in Canada',
                                    'Immigrant entrepreneurs navigating a new market and a new system',
                                    'Founders stuck between idea, MVP, and traction',
                                    'Builders who need honest feedback, not applause',
                                    'Serious operators who want a thought partner with technical and business depth',
                                    'Founders dealing with confusion in positioning or product direction',
                                    'People who are capable, but currently scattered',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <ChevronRight className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Not For */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <XCircle className="w-8 h-8 text-[#9A3412]" />
                                <h3 className="font-serif text-3xl text-[#9A3412]">Who This Is Not For</h3>
                            </div>
                            <ul className="space-y-4 text-stone-600">
                                {[
                                    'People looking for guaranteed outcomes',
                                    'Founders who want praise instead of truth',
                                    'Anyone unwilling to do the work between sessions',
                                    'Those who are only chasing immigration without building a real business',
                                    'People who want shortcuts, templates, and fake confidence',
                                    'Founders who are not ready to be challenged',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <ChevronRight className="w-5 h-5 text-stone-300 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 p-6 bg-[#FFF8F0] border border-[#D97706]/20 rounded-xl">
                                <p className="text-[#9A3412] font-medium">This service works best when the founder is open, serious, and willing to think.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 5. WHAT WE WORK ON (6 Blocks) --- */}
                <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                    <h2 className="font-serif text-4xl text-[#0F3F35] mb-4">The Core Problems We Work On</h2>
                    <p className="text-stone-600 text-lg mb-12 max-w-2xl">Every founder comes with a different situation, but most engagements focus on one or more of these areas:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {focusAreas.map((area, i) => (
                            <div key={i} className="bg-white border border-stone-200 p-8 rounded-2xl hover:border-[#0F3F35] hover:shadow-xl transition-all flex flex-col h-full">
                                <div className="w-12 h-12 rounded-lg bg-[#0F3F35]/5 flex items-center justify-center text-[#0F3F35] mb-6">
                                    <area.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F3F35] mb-3">{i + 1}. {area.title}</h3>
                                <p className="text-stone-600 text-sm font-medium mb-6 min-h-[40px] italic">&quot;{area.description}&quot;</p>
                                <div className="mt-auto border-t border-stone-100 pt-6">
                                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">We work on:</p>
                                    <ul className="space-y-2">
                                        {area.bullets.map((bullet, j) => (
                                            <li key={j} className="flex items-start gap-2 text-sm text-stone-600">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0 mt-1.5" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 6. WHAT MENTORSHIP CAN INCLUDE --- */}
                <section className="py-24 bg-[#0F3F35] text-white">
                    <div className="max-w-4xl mx-auto px-6 md:px-12">
                        <h2 className="font-serif text-3xl md:text-4xl mb-12">What This Mentorship Can Include</h2>
                        <div className="grid md:grid-cols-2 gap-y-6 gap-x-12 mb-12">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Strategic reviews of your startup idea</span></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Business model refinement</span></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Positioning and messaging feedback</span></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Founder mindset and leadership pressure points</span></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Pitch review and investor-facing narrative</span></li>
                            </ul>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Startup visa readiness thinking</span></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Decision support during uncertain stages</span></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Go-to-market direction</span></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Product feedback from a user & systems lens</span></li>
                                <li className="flex items-start gap-3"><div className="w-2 h-2 bg-[#D97706] rounded-sm shrink-0 mt-2" /><span className="text-stone-300">Accountability on priorities and execution</span></li>
                            </ul>
                        </div>
                        <div className="p-6 bg-white/10 rounded-xl border border-white/20 text-center">
                            <p className="text-lg font-medium">Not every founder needs the same thing. That is the point.</p>
                            <p className="text-stone-400 mt-2">This is not a rigid coaching package. It is strategic mentorship shaped around your real situation.</p>
                        </div>
                    </div>
                </section>

                {/* --- 7. HOW I WORK (Process Timeline) --- */}
                <section id="how-it-works" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl text-[#0F3F35] mb-4">How I Work</h2>
                        <p className="text-stone-600 text-lg">My Process</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {processSteps.map((step, i) => (
                            <div key={i} className="relative">
                                {/* Visual Line connector for desktop */}
                                {i !== processSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[100%] h-[2px] bg-stone-200" />
                                )}

                                <div className="w-16 h-16 rounded-full bg-[#0F3F35] text-white flex items-center justify-center font-serif text-2xl font-bold mb-6 relative z-10 mx-auto md:mx-0 shadow-lg shadow-[#0F3F35]/20">
                                    {step.step}
                                </div>

                                <div className="text-center md:text-left">
                                    <h3 className="text-xl font-bold text-[#0F3F35] mb-3">{step.title}</h3>
                                    <p className="text-stone-600 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 8. MENTORSHIP FORMATS --- */}
                <section className="py-24 bg-stone-100 border-t border-stone-200">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <h2 className="font-serif text-4xl text-[#0F3F35] mb-4 text-center">Mentorship Format</h2>
                        <p className="text-stone-600 text-lg mb-16 text-center">How the engagement works</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {formats.map((format, i) => (
                                <div key={i} className="bg-white border border-stone-200 p-8 rounded-2xl flex flex-col">
                                    <div className="mb-8">
                                        <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-2">Option {String.fromCharCode(65 + i)}</p>
                                        <h3 className="text-2xl font-bold text-[#0F3F35] leading-tight">{format.name}</h3>
                                    </div>
                                    <p className="text-stone-600 mb-8 border-b border-stone-100 pb-8">{format.target}</p>

                                    <div className="mt-auto">
                                        <p className="text-sm font-bold text-stone-900 mb-4">Best for:</p>
                                        <ul className="space-y-3">
                                            {format.bestFor.map((item, j) => (
                                                <li key={j} className="flex items-start gap-2 text-sm text-stone-600">
                                                    <ChevronRight className="w-4 h-4 text-[#0F3F35] shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 9 & 10. WHAT YOU GET / OUTCOMES --- */}
                <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16">

                        {/* What you get */}
                        <div>
                            <h2 className="font-serif text-3xl text-[#0F3F35] mb-8">What You Get</h2>
                            <ul className="space-y-4 text-stone-600">
                                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35] shrink-0 mt-2" />Live strategy sessions</li>
                                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35] shrink-0 mt-2" />Direct and practical feedback</li>
                                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35] shrink-0 mt-2" />Clear next-step guidance</li>
                                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35] shrink-0 mt-2" />Challenge and pressure-testing of your assumptions</li>
                                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35] shrink-0 mt-2" />Honest responses, not polite noise</li>
                                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35] shrink-0 mt-2" />Session notes or summary points</li>
                                <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0F3F35] shrink-0 mt-2" />Strategic direction based on your stage and risk level</li>
                            </ul>
                        </div>

                        {/* Outcomes */}
                        <div>
                            <h2 className="font-serif text-3xl text-[#0F3F35] mb-4">What Changes</h2>
                            <p className="text-stone-500 mb-6 italic">What founders usually gain from this work</p>

                            <p className="text-stone-600 mb-6 font-medium">After strong mentorship, founders usually do not say, “Now everything is easy.” They say:</p>

                            <div className="space-y-4 mb-8">
                                <div className="bg-stone-100 p-4 rounded-lg border-l-4 border-[#D97706] text-[#0F3F35] font-medium">&quot;Now I know what matters.&quot;</div>
                                <div className="bg-stone-100 p-4 rounded-lg border-l-4 border-[#0F3F35] text-[#0F3F35] font-medium">&quot;Now I can explain my startup clearly.&quot;</div>
                                <div className="bg-stone-100 p-4 rounded-lg border-l-4 border-[#0F3F35] text-[#0F3F35] font-medium">&quot;Now I see the market more honestly.&quot;</div>
                            </div>

                            <p className="text-[#0F3F35] font-bold text-xl">The goal is not emotional comfort. <br />The goal is operational clarity.</p>
                        </div>
                    </div>
                </section>

                {/* --- 11 & 12. CREDIBILITY & PRINCIPLES --- */}
                <section className="py-24 bg-[#1C1917] text-white">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16">

                        {/* Why Work With Me */}
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Why Work With Me</h2>
                            <p className="text-[#D97706] mb-8 font-mono text-sm tracking-widest uppercase">Why founders come to me</p>

                            <p className="text-stone-300 leading-relaxed mb-6">
                                I bring a mix that is rare and useful: technical background, startup building experience, systems thinking, human understanding, and an immigrant founder perspective.
                            </p>

                            <p className="text-stone-300 leading-relaxed mb-6">
                                My path has moved through software, cloud, startups, brand thinking, founder support, and cross-cultural business reality. I do not look at founders only as business models. I look at the person, the system, the market, and the pressure between them.
                            </p>

                            <p className="text-white font-medium text-lg pt-4 border-t border-stone-800">
                                I can help you think at more than one level: strategic, operational, human, and structural.
                            </p>
                        </div>

                        {/* Principles */}
                        <div>
                            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Principles</h2>
                            <p className="text-[#D97706] mb-8 font-mono text-sm tracking-widest uppercase">How I mentor</p>

                            <ul className="space-y-6 text-stone-300">
                                <li className="flex items-start gap-4">
                                    <span className="font-mono text-white opacity-50">01</span>
                                    <span>Clarity is more valuable than excitement.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="font-mono text-white opacity-50">02</span>
                                    <span>Structure beats chaos.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="font-mono text-white opacity-50">03</span>
                                    <span>A founder must learn to think, not just react.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="font-mono text-white opacity-50">04</span>
                                    <span>Serious companies are built through discipline, not image.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="font-mono text-white opacity-50">05</span>
                                    <span>Immigrant founders need realism, not fantasy.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="font-mono text-white opacity-50">06</span>
                                    <span>Truth is more useful than encouragement when stakes are high.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* --- 13. FAQ --- */}
                <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl text-[#0F3F35] mb-4">Frequently Asked Questions</h2>
                        <p className="text-stone-600 text-lg">Practical Answers</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border-stone-200">
                                <AccordionTrigger className="text-left text-lg font-bold text-[#0F3F35] hover:text-[#D97706] hover:no-underline py-6">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-stone-600 text-base leading-relaxed pb-6">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

                {/* --- 14. FINAL CTA --- */}
                <section className="py-24 bg-[#F5F5F4] border-t border-stone-200 text-center px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-serif text-4xl md:text-5xl text-[#0F3F35] mb-6">
                            Build with more clarity.<br />Decide with less noise.
                        </h2>
                        <p className="text-stone-600 mb-10 text-lg leading-relaxed">
                            If you are serious about building something real, Founder Mentorship can help you think more clearly, move more deliberately, and stop wasting energy on the wrong battles.
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
