import { localeAlternates } from "@/lib/seo"
import { InvestorReadinessTool } from "@/components/investor-readiness/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/investor-readiness", "en"),
    title: "Investor Readiness Score",
    description: "Evaluate your startup's fundability before pitching to angel investors and VC firms. Get a professional diagnostic report measuring 6 critical readiness areas.",
};

export default function InvestorReadinessPage() {
    return (
        <ToolShell>
            <InvestorReadinessTool />
        </ToolShell>
    );
}
