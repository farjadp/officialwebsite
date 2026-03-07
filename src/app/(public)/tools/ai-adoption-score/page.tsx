import { AIAdoptionScoreTool } from "@/components/ai-adoption-score/tool";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Adoption Readiness Score | Free Business Diagnostic",
    description: "Find out whether your business is structurally ready to adopt AI — or whether you still need foundational work first. A 6-dimension readiness diagnostic for founders, managers, and business owners.",
};

export default function AIAdoptionScorePage() {
    return (
        <main className="min-h-screen bg-[#F8F9FC] text-slate-900">

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[5%] right-[5%] w-[50%] h-[50%] rounded-full bg-indigo-500/4 blur-3xl opacity-60" />
                <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-slate-200/50 blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
                <AIAdoptionScoreTool />
            </div>
        </main>
    );
}
