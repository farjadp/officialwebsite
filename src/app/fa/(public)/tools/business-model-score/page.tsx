import { BusinessModelScoreTool } from "@/components/business-model-score/tool";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Business Model Strength Score | Free Diagnostic Tool",
    description: "Evaluate whether your business model is logical, revenue-capable, scalable, and defensible. Get an instant diagnostic report across 6 critical dimensions.",
};

export default function BusinessModelScorePage() {
    return (
        <main className="min-h-screen bg-[#FAFAF9] text-slate-900">

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[5%] right-[5%] w-[50%] h-[50%] rounded-full bg-[#1B4B43]/4 blur-3xl opacity-60" />
                <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-stone-200/50 blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
                <BusinessModelScoreTool />
            </div>
        </main>
    );
}
