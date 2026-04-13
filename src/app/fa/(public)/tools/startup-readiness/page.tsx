import { StartupReadinessTool } from "@/components/startup-readiness/tool";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Startup Readiness Score Assessment | Ashavid",
    description: "Evaluate your startup idea across 6 critical dimensions in under 5 minutes. Find out instantly if you're ready to launch, raise money, or if you need to pivot.",
};

export default function StartupReadinessPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">

            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl opacity-50" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
                <StartupReadinessTool />
            </div>

        </main>
    );
}
