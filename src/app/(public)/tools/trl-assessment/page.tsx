import { localeAlternates } from "@/lib/seo"
import { TrlAssessmentTool } from "@/components/trl-assessment/tool";
import { TrlReference } from "@/components/trl-assessment/trl-reference";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/trl-assessment", "en"),
    title: "TRL Assessment — Technology Readiness Level Calculator",
    description: "Locate your technology on the NASA TRL 1-9 scale used by government innovation programs. Evidence-based calculator with gap analysis and funding context for your stage.",
};

export default function TrlAssessmentPage() {
    return (
        <ToolShell>
            <TrlAssessmentTool locale="en" />
            <TrlReference locale="en" />
        </ToolShell>
    );
}
