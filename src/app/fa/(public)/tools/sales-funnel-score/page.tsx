import { localeAlternates } from "@/lib/seo"
import { SalesFunnelScoreTool } from "@/components/sales-funnel-score/tool";
import { Metadata } from "next";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/sales-funnel-score", "fa"),
    title: "امتیاز سلامت قیف فروش | ابزار تشخیص رایگان فروش",
    description: "قیف فروشتان کجا نشت می‌کند؟ مرحله‌به‌مرحله امتیاز بگیرید و نقطه‌ای را که بیشترین ضرر را می‌زند پیدا کنید.",
};

export default function SalesFunnelScorePage() {
    return (
        <main className="min-h-screen bg-[#F7FAF8] text-slate-900">

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[5%] right-[5%] w-[50%] h-[50%] rounded-full bg-emerald-500/4 blur-3xl opacity-60" />
                <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-slate-200/50 blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
                <SalesFunnelScoreTool />
            </div>
        </main>
    );
}
