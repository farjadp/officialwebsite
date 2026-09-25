import { localeAlternates } from "@/lib/seo"
import { StartupReadinessTool } from "@/components/startup-readiness/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/startup-readiness", "en"),
    title: "Startup Readiness Score Assessment",
    description: "Evaluate your startup idea across 6 critical dimensions in under 5 minutes. Find out instantly if you're ready to launch, raise money, or if you need to pivot.",
};

export default function StartupReadinessPage() {
    return (
        <ToolShell>
            <StartupReadinessTool />
        </ToolShell>
    );
}
