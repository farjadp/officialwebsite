import { localeAlternates } from "@/lib/seo"
import { NPIAssessmentTool } from "@/components/npi-assessment/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/npi-assessment", "en"),
    title: "NPI Personal Brand Assessment",
    description: "Evaluate the 3 core pillars of your personal brand: Narrative, Presence, and Impact. Discover your leverage points instantly.",
};

export default function NPIAssessmentPage() {
    return (
        <ToolShell>
            <NPIAssessmentTool />
        </ToolShell>
    );
}
