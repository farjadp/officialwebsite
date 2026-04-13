import { InvestorReadinessTool } from "@/components/investor-readiness/tool";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Investor Readiness Score | Ashavid",
    description: "Evaluate your startup's fundability before pitching to angel investors and VC firms. Get a professional diagnostic report measuring 6 critical readiness areas.",
};

export default function InvestorReadinessPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">

            {/* Decorative Background - slightly more serious/muted for investors vs general startup */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[60%] h-[60%] rounded-full bg-slate-200/40 blur-3xl opacity-50" />
                <div className="absolute -bottom-[20%] right-[5%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
                <InvestorReadinessTool />
            </div>

        </main>
    );
}
