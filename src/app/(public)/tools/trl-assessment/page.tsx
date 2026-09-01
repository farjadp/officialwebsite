import { TrlAssessmentTool } from "@/components/trl-assessment/tool";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "TRL Assessment — Technology Readiness Level Calculator | Ashavid",
    description: "Locate your technology on the NASA TRL 1-9 scale used by government innovation programs. Evidence-based calculator with gap analysis and funding context for your stage.",
};

export default function TrlAssessmentPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#0F3F35] selection:text-white">

            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#0F3F35]/5 blur-3xl opacity-60" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#D97706]/5 blur-3xl opacity-60" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
                <TrlAssessmentTool locale="en" />
            </div>

        </main>
    );
}
