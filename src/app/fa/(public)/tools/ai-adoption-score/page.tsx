import { localeAlternates } from "@/lib/seo"
import { AIAdoptionScoreTool } from "@/components/ai-adoption-score/tool";
import { Metadata } from "next";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/ai-adoption-score", "fa"),
    title: "امتیاز آمادگی پذیرش هوش مصنوعی | تشخیص رایگان کسب‌وکار",
    description: "بسنجید کسب‌وکارتان واقعاً چقدر برای به‌کارگیری هوش مصنوعی آماده است و اول کدام شکاف را باید ببندید.",
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
