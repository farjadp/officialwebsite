"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Bot, TrendingUp, BarChart2, Briefcase, Rocket, Sparkles } from "lucide-react"

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
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Select a random tool when the component mounts
        setToolIndex(Math.floor(Math.random() * AVAILABLE_TOOLS.length))
    }, [])

    if (!mounted) return null

    const tool = AVAILABLE_TOOLS[toolIndex]
    const Icon = tool.icon

    return (
        <div 
            className="group relative w-full overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-500 hover:border-[#D97706] hover:shadow-2xl hover:shadow-[#D97706]/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Glow Effect - highly premium & dynamic */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#0F3F35] to-[#1a5b4e] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10" />
            
            {/* Dark Accent corner */}
            <div className="absolute -right-16 -top-16 z-0 h-40 w-40 rounded-full bg-[#0F3F35]/5 transition-transform duration-700 ease-out group-hover:scale-[2.5]" />
            <div className="absolute -bottom-8 -left-8 z-0 h-32 w-32 rounded-full bg-[#D97706]/5 transition-transform duration-700 ease-out group-hover:scale-150" />

            <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
                
                {/* Left side: Icon & Text */}
                <div className="flex-1 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                    {/* Icon Box with animated ping */}
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 rounded-2xl bg-[#D97706]/20 animate-ping opacity-75" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3F35] to-[#15342d] text-[#FDFBF7] shadow-lg shadow-[#0F3F35]/20 ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                            <Icon className="h-7 w-7" strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D97706]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#D97706] ring-1 ring-[#D97706]/20">
                            <Sparkles className="h-3 w-3" />
                            Free Builder Tool
                        </div>
                        
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#0F3F35] leading-title tracking-tight">
                            {tool.name}
                        </h3>
                        
                        <p className="max-w-xl text-[15px] leading-relaxed text-stone-600 font-medium">
                            {tool.desc}
                        </p>
                    </div>
                </div>

                {/* Right side: Action Button */}
                <div className="shrink-0 pt-2 w-full md:w-auto flex justify-center md:justify-end">
                    <Link
                        href={tool.href}
                        className="group/btn relative inline-flex h-12 w-full md:w-auto items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#0F3F35] px-8 text-sm font-bold text-white shadow-lg shadow-[#0F3F35]/20 transition-all hover:bg-[#15342d] hover:shadow-xl hover:shadow-[#0F3F35]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F3F35]"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
                        <span className="relative z-10">{tool.action}</span>
                        <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                </div>

            </div>
        </div>
    )
}
