import { localeAlternates } from "@/lib/seo"
import { NPIAssessmentTool } from "@/components/npi-assessment/tool";
import { Metadata } from "next";

// The tool itself is the shared English component. Only TRL has a Persian
// config today; making the rest truly Persian is separate, scheduled work.
export const metadata: Metadata = {
    alternates: localeAlternates("/tools/npi-assessment", "fa"),
    title: "ارزیابی برند شخصی NPI",
    description: "سه ستون اصلی برند شخصی‌تان را بسنجید: روایت، حضور و اثر. نقاط اهرمی‌تان را همان لحظه ببینید.",
};

export default function NPIAssessmentFaPage() {
    return (
        <main className="min-h-screen bg-[#FDFBF7] text-slate-900">
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] start-[0%] w-[50%] h-[50%] rounded-full bg-[#0F3F35]/5 blur-[120px] opacity-60" />
                <div className="absolute top-[20%] end-[0%] w-[40%] h-[40%] rounded-full bg-[#D97706]/5 blur-[120px] opacity-50" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
                <NPIAssessmentTool />
            </div>
        </main>
    );
}
