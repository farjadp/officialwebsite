import { localeAlternates } from "@/lib/seo"
import { InvestorReadinessTool } from "@/components/investor-readiness/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/investor-readiness", "fa"),
    title: "امتیاز آمادگی سرمایه‌پذیری",
    description: "پیش از رفتن سراغ سرمایه‌گذار بسنجید کجا ایستاده‌اید و چه شواهدی هنوز کم دارید.",
};

export default function InvestorReadinessPage() {
    return (
        <ToolShell>
            <InvestorReadinessTool locale="fa" />
        </ToolShell>
    );
}
