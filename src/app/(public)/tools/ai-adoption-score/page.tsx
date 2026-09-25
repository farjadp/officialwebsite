import { localeAlternates } from "@/lib/seo"
import { AIAdoptionScoreTool } from "@/components/ai-adoption-score/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/ai-adoption-score", "en"),
    title: "AI Adoption Readiness Score | Free Business Diagnostic",
    description: "Find out whether your business is structurally ready to adopt AI — or whether you still need foundational work first. A 6-dimension readiness diagnostic for founders, managers, and business owners.",
};

export default function AIAdoptionScorePage() {
    return (
        <ToolShell>
            <AIAdoptionScoreTool />
        </ToolShell>
    );
}
