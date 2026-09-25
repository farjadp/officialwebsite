"use client"

// ============================================================================
// File Path: src/components/public/tool-promo-widget.tsx
// Why: The "one free tool" card under an article, in the v3 "Light" look — a
//      v3 card on the warm charcoal ground with one accent, instead of the
//      old white slab with its green gradients, amber ping and shimmer.
//
//      The tool list and the random pick on mount are the v2 widget's,
//      untouched. Only the look changed.
// Env / Identity: Client Component (framer-motion)
// ============================================================================

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Bot, TrendingUp, BarChart2, Briefcase, Rocket } from "lucide-react"
import { Reveal } from "@/components/v3/motion"

// Hardcoded tools from tools/page.tsx
const AVAILABLE_TOOLS = [
    {
        name: "Sales Funnel Health Score",
        type: "Diagnostic Tool",
        desc: "Find out exactly where your funnel leaks revenue. Assess lead generation and conversion in 2 minutes.",
        action: "Diagnose Funnel",
        icon: TrendingUp,
        href: "/tools/sales-funnel-score",
    },
    {
        name: "AI Adoption Readiness",
        type: "Diagnostic Tool",
        desc: "Are you structurally ready for AI? Evaluates your current tech stack, data culture, and team readiness instantly.",
        action: "Take Assessment",
        icon: Bot,
        href: "/tools/ai-adoption-score",
    },
    {
        name: "Business Model Strength",
        type: "Diagnostic Tool",
        desc: "Assess if your business model is actually logical, scalable, and defensible across 6 critical dimensions.",
        action: "Take Assessment",
        icon: BarChart2,
        href: "/tools/business-model-score",
    },
    {
        name: "Investor Readiness Score",
        type: "Diagnostic Tool",
        desc: "Do you have the signals VCs are looking for? Find out instantly before you pitch your startup.",
        action: "Take Assessment",
        icon: Briefcase,
        href: "/tools/investor-readiness",
    },
    {
        name: "Startup Readiness Score",
        type: "Interactive Tool",
        desc: "Evaluate your startup idea across market, product, and team dimensions. Uncover deadly gaps early.",
        action: "Take Assessment",
        icon: Rocket,
        href: "/tools/startup-readiness",
    },
]

export function ToolPromoWidget() {
    const [mounted, setMounted] = useState(false)
    const [toolIndex, setToolIndex] = useState(0)

    useEffect(() => {
        setMounted(true)
        // Select a random tool when the component mounts
        setToolIndex(Math.floor(Math.random() * AVAILABLE_TOOLS.length))
    }, [])

    if (!mounted) return null

    const tool = AVAILABLE_TOOLS[toolIndex]
    const Icon = tool.icon

    return (
        <Reveal>
            <div className="group flex w-full flex-col items-start justify-between gap-8 rounded-2xl border border-v3-line/80 bg-v3-raise p-8 text-start transition-all duration-500 hover:-translate-y-1 hover:border-v3-light/60 md:flex-row md:items-center md:p-10">

                {/* Left side: Icon & Text */}
                <div className="flex flex-1 flex-col items-start gap-6 md:flex-row">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-v3-light/40 text-v3-light transition-transform duration-500 group-hover:-translate-y-0.5">
                        <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                    </div>

                    <div className="flex flex-col gap-3">
                        <span className="inline-flex w-fit rounded-full border border-v3-light/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-v3-light">
                            Free Builder Tool
                        </span>

                        <h3 className="font-v3-display text-2xl font-light leading-tight tracking-[-0.015em] text-v3-bone md:text-3xl rtl:leading-snug rtl:tracking-normal">
                            {tool.name}
                        </h3>

                        <p className="max-w-xl text-[15px] leading-relaxed text-v3-soft rtl:leading-loose">
                            {tool.desc}
                        </p>
                    </div>
                </div>

                {/* Right side: Action Button */}
                <div className="w-full shrink-0 md:w-auto">
                    <Link
                        href={tool.href}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-v3-bone px-8 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink md:w-auto"
                    >
                        {tool.action}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden />
                    </Link>
                </div>

            </div>
        </Reveal>
    )
}
