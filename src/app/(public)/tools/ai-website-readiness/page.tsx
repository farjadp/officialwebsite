import { localeAlternates } from "@/lib/seo"
import type { Metadata } from "next";
import AiWebsiteReadinessTool from "@/components/ai-website-readiness/tool";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/ai-website-readiness", "en"),
  title: "AI Website Readiness Audit",
  description:
    "Test whether AI crawlers can access, understand, and cite your website. Get a free readiness score and prioritized fixes.",
};

export default function AiWebsiteReadinessPage() {
  return (
    <ToolShell wide>
      <AiWebsiteReadinessTool />
    </ToolShell>
  );
}
