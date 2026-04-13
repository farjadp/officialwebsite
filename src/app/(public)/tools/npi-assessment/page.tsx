import { NPIAssessmentTool } from "@/components/npi-assessment/tool";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "NPI Personal Brand Assessment | Ashavid",
    description: "Evaluate the 3 core pillars of your personal brand: Narrative, Presence, and Impact. Discover your leverage points instantly.",
};

export default function NPIAssessmentPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] text-slate-900">
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[0%] w-[50%] h-[50%] rounded-full bg-[#0F3F35]/5 blur-[120px] opacity-60" />
                <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] rounded-full bg-[#D97706]/5 blur-[120px] opacity-50" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
                <NPIAssessmentTool />
            </div>
        </main>
    );
}
