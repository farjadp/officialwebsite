import type { Metadata } from "next";
import AiWebsiteReadinessTool from "@/components/ai-website-readiness/tool";

export const metadata: Metadata = {
  title: "AI Website Readiness Audit | Ashavid",
  description:
    "Test whether AI crawlers can access, understand, and cite your website. Get a free readiness score and prioritized fixes.",
};

export default function AiWebsiteReadinessPage() {
  return <AiWebsiteReadinessTool />;
}
