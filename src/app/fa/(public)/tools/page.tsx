// ============================================================================
// Hardware Source: page.tsx
// Version: 1.3.0 — 2026-03-07
// Why: Main entry page for the tools route - Aligned with Ashavid Brand
// Env / Identity: React Server Component
// ============================================================================

import { Button } from "@/components/ui/button"
import { Rocket, Briefcase, BarChart2, Bot, TrendingUp, ArrowRight, Target, BatteryWarning, Share2, Users, HeartPulse } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: "Free Tools & Frameworks | Ashavid",
    description: "Systems, diagnostics, and tools to help founders build and scale without the hype.",
}

export default function ToolsPage() {
    const tools = [
        {
            name: "Sales Funnel Health Score",
            type: "Diagnostic Tool",
            desc: "Locate exactly where your funnel is leaking revenue. Covers lead generation, qualification, closing, and tracking.",
            action: "Diagnose Funnel",
            icon: TrendingUp,
            href: "/tools/sales-funnel-score",
            available: true,
        },
        {
            name: "AI Adoption Readiness",
            type: "Diagnostic Tool",
            desc: "Determine if your business is structurally ready for AI integration, or if you need foundational data work first.",
            action: "Take Assessment",
            icon: Bot,
            href: "/tools/ai-adoption-score",
            available: true,
        },
        {
            name: "Business Model Strength",
            type: "Diagnostic Tool",
            desc: "Evaluate whether your business model is logical, revenue-capable, scalable, and defensible across 6 dimensions.",
            action: "Take Assessment",
            icon: BarChart2,
            href: "/tools/business-model-score",
            available: true,
        },
        {
            name: "Investor Readiness Score",
            type: "Diagnostic Tool",
            desc: "Evaluate your preparedness for raising capital. Find out instantly if you possess the signals needed to pitch angels or VCs.",
            action: "Take Assessment",
            icon: Briefcase,
            href: "/tools/investor-readiness",
            available: true,
        },
        {
            name: "Startup Readiness Score",
            type: "Interactive Tool",
            desc: "Evaluate your startup idea across 6 critical dimensions. Uncover the gaps in your market, product, and team.",
            action: "Take Assessment",
            icon: Rocket,
            href: "/tools/startup-readiness",
            available: true,
        },
        {
            name: "Product-Market Fit Score",
            type: "Diagnostic Tool",
            desc: "Evaluates whether a product truly matches a real market demand. Analyzes customer feedback, usage, retention, and willingness to pay.",
            action: "Coming Soon",
            icon: Target,
            href: "#",
            available: false,
        },
        {
            name: "Founder Burnout Risk Test",
            type: "Diagnostic Tool",
            desc: "Measures the risk of burnout by evaluating workload intensity, decision fatigue, financial pressure, and emotional resilience.",
            action: "Coming Soon",
            icon: BatteryWarning,
            href: "#",
            available: false,
        },
        {
            name: "Digital Marketing Maturity",
            type: "Diagnostic Tool",
            desc: "Evaluates how developed and structured your digital marketing capabilities are, measuring strategy clarity and automation.",
            action: "Coming Soon",
            icon: Share2,
            href: "#",
            available: false,
        },
        {
            name: "Team Alignment Score",
            type: "Diagnostic Tool",
            desc: "Evaluates how aligned your startup team is around goals, responsibilities, and strategic direction to prevent internal friction.",
            action: "Coming Soon",
            icon: Users,
            href: "#",
            available: false,
        },
        {
            name: "Startup Survival Probability",
            type: "Diagnostic Tool",
            desc: "Estimates the probability that a startup can survive the next 18–24 months by analyzing financial runway and market traction.",
            action: "Coming Soon",
            icon: HeartPulse,
            href: "#",
            available: false,
        }
    ]

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#0F3F35] selection:text-white pb-24">

            {/* Header Section */}
            <header className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-stone-200">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#D97706]/5 text-[#D97706] text-xs font-bold uppercase tracking-widest mb-8">
                        The Library
                    </div>

                    <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] text-[#0F3F35] mb-6">
                        Tools & <br />
                        <span className="text-[#D97706]">Frameworks.</span>
                    </h1>

                    <p className="text-xl text-stone-600 leading-relaxed font-medium max-w-2xl">
                        No fluff. No hype. Just practical diagnostics and engineering systems applied to business building. Free for serious founders.
                    </p>
                </div>
            </header>

            {/* Main Grid */}
            <main className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Link
                            key={tool.name}
                            href={tool.href}
                            className="group flex flex-col bg-white border border-stone-200 p-8 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-[#D97706] hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Decorative Accent strictly using brand colors */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F3F35]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                            <div className="mb-6 flex justify-between items-start relative z-10">
                                <div className="p-3 bg-stone-100 rounded-lg text-[#0F3F35] group-hover:bg-[#0F3F35] group-hover:text-white transition-colors duration-300">
                                    <tool.icon className="w-6 h-6" />
                                </div>
                                {!tool.available && (
                                    <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 bg-stone-100 px-2 py-1 rounded">
                                        Coming Soon
                                    </span>
                                )}
                                {tool.available && (
                                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#D97706] bg-[#D97706]/10 px-2 py-1 rounded">
                                        Active Component
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 relative z-10">
                                <h3 className="text-2xl font-bold text-[#0F3F35] mb-2 leading-tight">
                                    {tool.name}
                                </h3>
                                <div className="w-8 h-1 bg-[#D97706] mb-4 transition-all duration-300 group-hover:w-16" />
                                <p className="text-stone-600 leading-relaxed text-sm md:text-base">
                                    {tool.desc}
                                </p>
                            </div>

                            <div className="mt-10 flex items-center justify-between text-[#0F3F35] font-medium border-t border-stone-100 pt-6 relative z-10">
                                <span className="group-hover:text-[#D97706] transition-colors">{tool.action}</span>
                                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform text-[#D97706]" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

        </div>
    )
}
