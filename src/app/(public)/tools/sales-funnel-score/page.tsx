import { localeAlternates } from "@/lib/seo"
import { SalesFunnelScoreTool } from "@/components/sales-funnel-score/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/sales-funnel-score", "en"),
    title: "Sales Funnel Health Score | Free Sales Diagnostic Tool",
    description: "Find out exactly where your sales funnel is leaking revenue. A 6-stage diagnostic covering lead generation, qualification, messaging, process, closing, and tracking.",
};

export default function SalesFunnelScorePage() {
    return (
        <ToolShell>
            <SalesFunnelScoreTool />
        </ToolShell>
    );
}
