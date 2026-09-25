import { localeAlternates } from "@/lib/seo"
import { BusinessModelScoreTool } from "@/components/business-model-score/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/business-model-score", "en"),
    title: "Business Model Strength Score | Free Diagnostic Tool",
    description: "Evaluate whether your business model is logical, revenue-capable, scalable, and defensible. Get an instant diagnostic report across 6 critical dimensions.",
};

export default function BusinessModelScorePage() {
    return (
        <ToolShell>
            <BusinessModelScoreTool />
        </ToolShell>
    );
}
