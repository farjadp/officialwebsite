import { localeAlternates } from "@/lib/seo"
import { SalesFunnelScoreTool } from "@/components/sales-funnel-score/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/sales-funnel-score", "fa"),
    title: "امتیاز سلامت قیف فروش | ابزار تشخیص رایگان فروش",
    description: "قیف فروشتان کجا نشت می‌کند؟ مرحله‌به‌مرحله امتیاز بگیرید و نقطه‌ای را که بیشترین ضرر را می‌زند پیدا کنید.",
};

export default function SalesFunnelScorePage() {
    return (
        <ToolShell>
            <SalesFunnelScoreTool />
        </ToolShell>
    );
}
