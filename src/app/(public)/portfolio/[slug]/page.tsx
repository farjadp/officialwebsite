import { notFound } from "next/navigation";
import { PORTFOLIO_ITEMS } from "../data";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Target, Activity, Zap, CheckCircle2, ChevronRight, Eye, Briefcase, Calendar, Globe, Code } from "lucide-react";
import { PremiumCaseStudyPage } from "@/components/portfolio/premium-case-study";

// Make it dynamic so view counter always runs on load
export const dynamic = "force-dynamic";

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = PORTFOLIO_ITEMS.find((p) => p.id === slug);

    if (!item) {
        notFound();
    }

    const currentPath = `/portfolio/${slug}`;

    // 1. Metric tracking logic
    let viewCount = 1;
    try {
        const updatedMetric = await prisma.routeMetric.upsert({
            where: { path: currentPath },
            update: { views: { increment: 1 } },
            create: { path: currentPath, views: 1 }
        });
        viewCount = updatedMetric.views;
    } catch (e) {
        // Silently fail if DB has issues
        console.error("View tracking error:", e);
    }

    if (slug === "herestate") {
        return <PremiumCaseStudyPage viewCount={viewCount} />;
    }

    return (
        <article className="min-h-screen bg-[#0C0A09] text-stone-300 font-sans selection:bg-[#D97706] selection:text-white pb-32 overflow-x-hidden relative">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1B4B43] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-32">
                
                {/* --- 1. Hero Section --- */}
                <div className="mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                    <Link href="/portfolio" className="inline-flex items-center text-sm font-mono text-stone-500 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-800 bg-stone-900/50 text-stone-400 text-xs font-mono uppercase tracking-widest mb-6">
                                {item.category}
                            </div>
                            <h1 className="font-serif text-5xl md:text-7xl text-white tracking-tight mb-4">{item.title}</h1>
                            <p className="text-xl md:text-2xl text-stone-400 font-light max-w-2xl leading-relaxed">{item.summary}</p>
                        </div>
                        <div className="flex items-center gap-2 text-stone-500 font-mono text-sm bg-stone-900/40 border border-stone-800 px-4 py-2 rounded-full shrink-0">
                            <Eye className="w-4 h-4" /> {viewCount.toLocaleString()} views
                        </div>
                    </div>
                </div>

                {/* --- 2. Snapshot Grid --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-px md:bg-stone-800 border border-stone-800 rounded-2xl md:p-px mb-24 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                    <div className="bg-[#0C0A09] p-6 rounded-2xl md:rounded-none">
                        <div className="flex items-center gap-2 text-stone-500 text-xs font-mono uppercase tracking-widest mb-2"><Briefcase className="w-3 h-3"/> Role</div>
                        <div className="text-white font-medium">{item.role}</div>
                    </div>
                    <div className="bg-[#0C0A09] p-6 rounded-2xl md:rounded-none">
                        <div className="flex items-center gap-2 text-stone-500 text-xs font-mono uppercase tracking-widest mb-2"><Calendar className="w-3 h-3"/> Timeline</div>
                        <div className="text-white font-medium">{item.yearRange || "Past"}</div>
                    </div>
                    <div className="bg-[#0C0A09] p-6 rounded-2xl md:rounded-none">
                        <div className="flex items-center gap-2 text-stone-500 text-xs font-mono uppercase tracking-widest mb-2"><Code className="w-3 h-3"/> Stack / Core</div>
                        <div className="flex flex-wrap gap-1">
                            {item.techStack ? item.techStack.join(", ") : item.tags?.join(", ") || "Strategy & Ops"}
                        </div>
                    </div>
                    <div className="bg-[#0C0A09] p-6 rounded-2xl md:rounded-none">
                        <div className="flex items-center gap-2 text-stone-500 text-xs font-mono uppercase tracking-widest mb-2"><Globe className="w-3 h-3"/> Status</div>
                        <div className="text-white font-medium">{item.visibility}</div>
                    </div>
                </div>

                {/* --- 3 & 4. The Challenge vs Diagnosis --- */}
                {(item.problem || item.diagnosis) && (
                    <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-24 items-start">
                        {item.problem && (
                            <div className="bg-stone-900/30 border border-stone-800 p-8 rounded-2xl hover:bg-stone-800/30 transition-colors">
                                <div className="text-stone-500 text-xs font-mono uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> The Premise / Problem</div>
                                <h3 className="text-2xl font-serif text-white mb-4">What was presented</h3>
                                <p className="text-stone-300 leading-relaxed font-light">{item.problem}</p>
                            </div>
                        )}
                        
                        {(item.diagnosis || item.contribution) && (
                            <div className="bg-[#0F3F35]/10 border border-[#0F3F35]/30 p-8 rounded-2xl hover:bg-[#0F3F35]/20 transition-colors">
                                <div className="text-[#0F3F35] text-xs font-mono uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> The Reality / Diagnosis</div>
                                <h3 className="text-2xl font-serif text-[#10b981] mb-4">Structural truth discovered</h3>
                                <p className="text-stone-300 leading-relaxed font-light">{item.diagnosis || item.contribution}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* --- 5 & 6. Strategy & Execution --- */}
                {(item.proposedStrategy || item.executionSteps) && (
                    <div className="mb-24 max-w-4xl mx-auto border-l border-stone-800 pl-8 md:pl-16 space-y-16">
                        {item.proposedStrategy && (
                            <div>
                                <h3 className="text-3xl font-serif text-white mb-8">Strategic Pillars</h3>
                                <ul className="space-y-4">
                                    {item.proposedStrategy.map((strat, i) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <CheckCircle2 className="w-5 h-5 text-[#D97706] shrink-0 mt-1" />
                                            <span className="text-lg text-stone-300 font-light leading-relaxed">{strat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {item.executionSteps && (
                            <div>
                                <h3 className="text-3xl font-serif text-white mb-8">Execution Framework</h3>
                                <div className="space-y-8">
                                    {item.executionSteps.map((step, i) => (
                                        <div key={i} className="bg-stone-900/50 border border-stone-800 p-6 rounded-xl hover:border-stone-700 transition-colors">
                                            <h4 className="text-xl font-medium text-white mb-2">Phase {i + 1}: {step.title}</h4>
                                            <p className="text-stone-400 leading-relaxed">{step.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- 7. Outcome & 8. Lessons --- */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    {item.outcome && (
                        <div className="bg-[#D97706]/5 border border-[#D97706]/20 p-8 md:p-12 rounded-3xl">
                            <div className="text-[#D97706] text-xs font-mono uppercase tracking-widest mb-6 flex items-center gap-2"><Zap className="w-4 h-4" /> The Outcome</div>
                            <p className="text-2xl md:text-3xl font-serif text-white leading-snug">{item.outcome}</p>
                        </div>
                    )}

                    {item.lessons && item.lessons.length > 0 && (
                        <div className="bg-stone-900 border border-stone-800 p-8 md:p-12 rounded-3xl">
                            <div className="text-stone-500 text-xs font-mono uppercase tracking-widest mb-6 flex items-center gap-2">Key Takeaways</div>
                            <ul className="space-y-6">
                                {item.lessons.map((lesson, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="text-stone-600 font-mono mt-1 text-sm">{(i + 1).toString().padStart(2, '0')}.</div>
                                        <p className="text-stone-300 leading-relaxed font-light">{lesson}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* --- 9. CTA --- */}
                <div className="border-t border-stone-800 pt-24 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Need similar clarity?</h2>
                    <p className="text-xl text-stone-400 font-light mb-10 max-w-xl mx-auto">
                        I help founders clarify product strategy and architect scalable digital business models.
                    </p>
                    <a href="mailto:contact@farjad.me" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-stone-200 transition-colors">
                        Book a Strategy Call <ChevronRight className="w-5 h-5" />
                    </a>
                </div>

            </div>
        </article>
    );
}
