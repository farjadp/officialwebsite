// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-03-07
// Why: Business Automation Service Page
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
    Settings,
    Workflow,
    BarChart4,
    Cpu,
    Mail,
    Users,
    Database,
    ChevronRight,
    Zap,
    Activity,
    Layers,
    AlertTriangle
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Business Automation & AI Systems | Architecture | Ashavid',
    description:
        'Designing intelligent systems that remove operational chaos from growing businesses. Structured automation, CRM integrations, and AI workflow design in Canada.',
};

// --- DATA ARRAYS ---
const whatWeAutomate = [
    {
        title: 'Sales and CRM Systems',
        icon: Users,
        items: [
            'Automated lead capture',
            'CRM workflow automation',
            'Pipeline tracking',
            'Sales follow-up automation',
            'Reporting dashboards',
        ],
    },
    {
        title: 'Marketing Systems',
        icon: Mail,
        items: [
            'Automated email sequences',
            'Campaign tracking',
            'Lead scoring',
            'Customer segmentation',
            'Marketing analytics',
        ],
    },
    {
        title: 'Operations & Internal Workflows',
        icon: Workflow,
        items: [
            'Task automation',
            'Project workflow systems',
            'Internal notifications',
            'Data synchronization between tools',
        ],
    },
    {
        title: 'Customer Support',
        icon: Settings,
        items: [
            'Automated support ticket workflows',
            'Knowledge base integration',
            'Customer feedback collection',
            'Service analytics',
        ],
    },
    {
        title: 'Data and Reporting',
        icon: BarChart4,
        items: [
            'Real-time dashboards',
            'Automated reports',
            'Centralized data systems',
            'Decision-support tools',
        ],
    },
    {
        title: 'AI-Driven Processes',
        icon: Cpu,
        items: [
            'AI-assisted customer analysis',
            'Automated document processing',
            'Workflow intelligence',
            'AI-powered insights',
        ],
    },
];

const processSteps = [
    {
        step: '1',
        title: 'System Audit',
        desc: 'We examine your current systems and workflows. This includes tools currently used, operational bottlenecks, data flow, manual tasks, and growth constraints. The goal is to understand how the business actually runs.',
    },
    {
        step: '2',
        title: 'System Design',
        desc: 'Based on the audit, we design a clearer operational architecture. This includes defining automation opportunities, designing workflow logic, identifying integration points, and prioritizing high-impact improvements.',
    },
    {
        step: '3',
        title: 'Implementation',
        desc: 'Automation systems are implemented gradually. This may involve workflow automation tools, CRM configuration, API integrations, data pipelines, and AI workflow design. The goal is reliability, not complexity.',
    },
    {
        step: '4',
        title: 'Optimization',
        desc: 'After implementation, systems are refined. We monitor performance, user adoption, data accuracy, and operational impact. Automation should evolve with the business.',
    },
];

const exampleSystems = [
    {
        title: 'Sales Automation System',
        flow: 'Lead Capture → CRM Entry → Automation',
        bullets: [
            'Automated qualification',
            'Follow-up scheduling',
            'Pipeline analytics',
        ],
    },
    {
        title: 'Marketing Automation System',
        flow: 'Content Distrib. → Audience Seg. → Dashboards',
        bullets: [
            'Email campaigns',
            'Customer segmentation',
            'Performance tracking',
        ],
    },
    {
        title: 'Internal Workflow Automation',
        flow: 'Task Creation → Project Tracking → Reporting',
        bullets: [
            'Automated task assignments',
            'Sprint visibility',
            'Status notifications',
        ],
    },
    {
        title: 'AI-Enhanced Business Intelligence',
        flow: 'Data Aggregation → Pattern Detection → Insights',
        bullets: [
            'Predictive analytics',
            'Document processing',
            'Automated reporting',
        ],
    },
];

const faqs = [
    {
        q: 'Do you replace our current tools?',
        a: 'Not necessarily. In many cases, existing tools can be improved through better integration and workflow design.',
    },
    {
        q: 'Do we need technical staff internally?',
        a: 'Not always. Part of this service is designing systems that your team can actually maintain.',
    },
    {
        q: 'How long does an automation project take?',
        a: 'It depends on complexity. Some improvements can be implemented quickly, while larger systems require staged implementation.',
    },
    {
        q: 'Is this only for tech companies?',
        a: 'No. Automation can benefit many industries, including services, retail, consulting, and logistics.',
    },
    {
        q: 'Do you use AI in automation systems?',
        a: 'Yes, when it provides real value. AI should solve specific problems, not just be used as a buzzword.',
    },
];

export default function BusinessAutomationPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#0F3F35] selection:text-white pb-24">
            {/* --- 1. HERO SECTION --- */}
            <header className="relative pt-32 pb-24 border-b border-stone-200 overflow-hidden">
                {/* Background Visual (Abstract Systems/Tech Node) */}
                <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
                    <Image
                        src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
                        alt="Systems Architecture"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#0F3F35]/30 bg-[#0F3F35]/5 text-[#0F3F35] text-xs font-bold uppercase tracking-widest mb-8">
                            Service Profile
                        </div>

                        <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-[#0F3F35] mb-8">
                            Business Automation <br />
                            <span className="text-[#D97706]">&amp; AI Systems.</span>
                        </h1>

                        <div className="text-xl md:text-2xl text-[#0F3F35] leading-relaxed font-medium max-w-2xl mb-10 pl-6 border-l-4 border-[#0F3F35]">
                            Designing intelligent systems that remove operational chaos from growing businesses.
                        </div>

                        <div className="text-lg text-stone-600 leading-relaxed max-w-3xl mb-12 space-y-4">
                            <p>
                                Most companies today use dozens of tools. CRMs, spreadsheets, marketing platforms, support systems, dashboards.
                            </p>
                            <p>
                                But tools alone do not create efficiency. Without structure, businesses end up with disconnected systems, duplicated work, lost information, and slow decision making.
                            </p>
                            <p className="font-medium text-[#0F3F35]">
                                I help businesses design automation systems that actually work. Not just software installation. Real operational architecture.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-16">
                            <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[#0F3F35] hover:bg-[#092822] text-white text-base transition-transform hover:scale-105 shadow-xl shadow-[#0F3F35]/20">
                                <Link href="/contact">Request a Consultation</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-stone-300 hover:border-[#D97706] hover:text-[#D97706] text-base transition-colors bg-white">
                                <Link href="#architecture">See How It Works</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* --- 2. THE PROBLEM MODERN BUSINESSES FACE --- */}
                <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <h2 className="font-serif text-3xl md:text-5xl text-[#0F3F35] mb-6">The Problem Modern Businesses Face</h2>
                            <p className="text-2xl text-[#D97706] font-medium mb-8">
                                Many companies believe they need more technology. What they actually need is better system design.
                            </p>
                            <div className="text-lg text-stone-600 leading-relaxed space-y-4">
                                <p>
                                    Over time, operational chaos creates hidden costs: wasted time, lost opportunities, operational errors, and slow growth.
                                </p>
                                <p>
                                    Automation, when designed properly, removes this friction. <br />
                                    <strong className="text-[#0F3F35]">But automation must follow strategy, not the other way around.</strong>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
                            <p className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">In many businesses, daily operations look like this:</p>
                            <ul className="space-y-4">
                                {[
                                    'Customer data scattered across platforms',
                                    'Marketing campaigns running without feedback loops',
                                    'Teams manually moving data between systems',
                                    'Decision-making based on incomplete information',
                                    'Founders spending hours on operational tasks'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-[#9A3412] shrink-0 mt-0.5" />
                                        <span className="text-stone-600 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* --- 3. WHAT AUTOMATION REALLY MEANS --- */}
                <section className="py-24 bg-[#0F3F35] text-white">
                    <div className="max-w-4xl mx-auto px-6 md:px-12 text-center text-lg leading-relaxed space-y-8">
                        <h2 className="font-serif text-3xl md:text-5xl mb-6">What Business Automation Really Means</h2>
                        <p className="text-xl md:text-2xl font-medium text-[#D97706]">
                            Automation is not about replacing people. It is about removing repetitive operational friction so people can focus on meaningful work.
                        </p>
                        <p className="text-stone-300">
                            A well-designed automation system should reduce manual work, increase visibility across the business, improve data flow, support faster decisions, and make growth scalable.
                        </p>
                        <div className="p-6 mt-8 rounded-xl border border-white/20 bg-white/5 mx-auto max-w-2xl">
                            <p className="font-serif text-2xl italic">&quot;This requires thinking like a systems architect, not just a tool installer. My approach focuses on system design first, technology second.&quot;</p>
                        </div>
                    </div>
                </section>

                {/* --- 4 & 5. WHO IT IS FOR / NOT FOR --- */}
                <section className="py-24 bg-stone-100 border-y border-stone-200">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 lg:gap-24">
                        {/* For */}
                        <div className="bg-white p-8 md:p-12 rounded-2xl border border-stone-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <CheckCircle2 className="w-8 h-8 text-[#0F3F35]" />
                                <h3 className="font-serif text-3xl text-[#0F3F35]">Who This Is For</h3>
                            </div>
                            <ul className="space-y-4 text-stone-600">
                                {[
                                    'Growing small and medium businesses',
                                    'Startups scaling their operations',
                                    'Founders overwhelmed by operational complexity',
                                    'Companies using multiple disconnected tools',
                                    'Teams spending too much time on manual processes',
                                    'Organizations exploring AI integration',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <ChevronRight className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-8 text-sm font-medium text-stone-500 border-t border-stone-100 pt-6">
                                Especially useful for companies that want to modernize their operations without hiring large internal technical teams.
                            </p>
                        </div>

                        {/* Not For */}
                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-3 mb-8">
                                <XCircle className="w-8 h-8 text-[#9A3412]" />
                                <h3 className="font-serif text-3xl text-[#9A3412]">Who This Is Not For</h3>
                            </div>
                            <ul className="space-y-4 text-stone-600">
                                {[
                                    'Businesses that only want a quick software installation',
                                    'Companies expecting “instant automation”',
                                    'Organizations unwilling to change existing workflows',
                                    'Teams without clear operational processes',
                                    'Businesses looking for the cheapest tool setup',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-stone-300 shrink-0 mt-2" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 p-6 bg-white border border-[#9A3412]/20 rounded-xl">
                                <p className="text-[#9A3412] font-medium">Automation only works when leadership is willing to think about systems seriously.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 6. WHAT WE AUTOMATE (Grid) --- */}
                <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="font-serif text-4xl text-[#0F3F35] mb-4">What We Automate</h2>
                        <p className="text-stone-600 text-lg">Depending on the business, automation can include many functional areas. Automation should always serve business goals, not just technical curiosity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {whatWeAutomate.map((area, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:border-[#0F3F35]/30 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-[#0F3F35]/5 flex items-center justify-center text-[#0F3F35] mb-6">
                                    <area.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F3F35] mb-6 border-b border-stone-100 pb-4">{area.title}</h3>
                                <ul className="space-y-3">
                                    {area.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-stone-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0 mt-1.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 8. EXAMPLE AUTOMATION SYSTEMS (Cards) --- */}
                <section className="py-24 bg-[#0F3F35] text-white">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="mb-16 md:flex justify-between items-end">
                            <div className="max-w-2xl">
                                <h2 className="font-serif text-3xl md:text-5xl mb-4">Example Automation Systems</h2>
                                <p className="text-stone-300 text-lg">These systems help companies operate with more clarity and less operational friction.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {exampleSystems.map((sys, i) => (
                                <div key={i} className="bg-[#1C1917] p-8 rounded-2xl border border-stone-700">
                                    <h3 className="text-xl font-bold text-white mb-2">{sys.title}</h3>
                                    <div className="flex items-center gap-2 text-[#D97706] text-sm font-mono uppercase tracking-wider mb-6 pb-6 border-b border-stone-700">
                                        <Zap className="w-4 h-4" />
                                        <span>{sys.flow}</span>
                                    </div>
                                    <ul className="space-y-3">
                                        {sys.bullets.map((bullet, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                </div>
                                                <span className="text-stone-300">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- 7. HOW THE PROCESS WORKS (Timeline) --- */}
                <section id="architecture" className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="bg-[#D97706] text-white border-none mb-6 pointer-events-none tracking-widest uppercase">Methodology</Badge>
                        <h2 className="font-serif text-4xl text-[#0F3F35] mb-4">How the Process Works</h2>
                        <p className="text-stone-600 text-lg">Automation projects follow a structured approach.</p>
                    </div>

                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-300 before:to-transparent">
                        {processSteps.map((step, i) => (
                            <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#FDFBF7] bg-[#0F3F35] text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md">
                                    {step.step}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 md:p-8 rounded-xl border border-stone-200 shadow-sm transition duration-300 hover:shadow-md hover:border-[#D97706]">
                                    <h3 className="font-bold text-xl text-[#0F3F35] mb-3">{step.title}</h3>
                                    <p className="text-stone-600 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 9 & 10. TECH STACK & OUTCOMES --- */}
                <section className="py-24 bg-white border-y border-stone-200">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* Outcomes */}
                        <div>
                            <h2 className="font-serif text-3xl md:text-5xl text-[#0F3F35] mb-8">Expected Outcomes</h2>
                            <p className="text-lg text-stone-600 mb-8">
                                Automation is not magic. But when implemented correctly, it removes many hidden inefficiencies inside a business.
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                {[
                                    'Reduced operational workload',
                                    'Improved data visibility',
                                    'Faster decision making',
                                    'More consistent processes',
                                    'Scalable operations',
                                    'Better customer experience'
                                ].map((outcome, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                                        <span className="font-medium text-[#0F3F35]">{outcome}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stack */}
                        <div className="bg-stone-50 p-8 md:p-12 rounded-3xl border border-stone-200">
                            <div className="flex items-center gap-3 mb-6">
                                <Database className="w-6 h-6 text-stone-400" />
                                <h3 className="font-serif text-2xl text-[#0F3F35]">Technology Stack</h3>
                            </div>
                            <p className="text-stone-600 mb-6">
                                Technology choices always depend on business size, operational complexity, growth stage, and team capability. The focus is not on tools themselves, but on how they work together.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'CRM Platforms',
                                    'Workflow Automation Tools',
                                    'API Integrations',
                                    'Database Systems',
                                    'AI Services',
                                    'Analytics Dashboards'
                                ].map((tech, i) => (
                                    <Badge key={i} variant="secondary" className="bg-white border-stone-200 text-stone-600 hover:bg-stone-100 px-3 py-1.5 font-medium">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                            <div className="mt-8 pt-8 border-t border-stone-200">
                                <div className="flex items-center gap-4 text-[#0F3F35]/40 justify-between">
                                    <Layers className="w-8 h-8" />
                                    <Activity className="w-8 h-8" />
                                    <Workflow className="w-8 h-8" />
                                    <Cpu className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 11. FAQ ACCORDION --- */}
                <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl text-[#0F3F35] mb-4">Frequently Asked Questions</h2>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="border-stone-200 bg-white px-6 rounded-xl mb-4 border shadow-sm">
                                <AccordionTrigger className="text-left text-lg font-bold text-[#0F3F35] hover:text-[#D97706] hover:no-underline py-5">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-stone-600 text-base leading-relaxed pb-6">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

                {/* --- 12. FINAL CTA --- */}
                <section className="py-24 bg-[#F5F5F4] border-t border-stone-200 text-center px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-serif text-4xl md:text-5xl text-[#0F3F35] mb-6">
                            Remove operational friction.
                        </h2>
                        <p className="text-stone-600 mb-10 text-lg leading-relaxed">
                            If your company is growing but your systems feel chaotic, automation can help create structure and clarity. Well-designed systems allow businesses to scale without burning out their teams.
                        </p>
                        <div className="flex justify-center flex-wrap gap-4">
                            <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[#0F3F35] hover:bg-[#092822] text-white text-base">
                                <Link href="/contact">Request a Consultation</Link>
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
