import { localeAlternates } from "@/lib/seo"
import type { Metadata } from "next";
import BusinessModelStressTestTool from "@/components/business-model-stress-test/tool";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/business-model-stress-test", "en"),
    title: "Business Model Stress Test",
    description:
        "Test how robust your business model is against the futures that could break it. Based on the peer-reviewed stress testing method of Haaker, Bouwman, Janssen and De Reuver (Futures, 2017).",
};

export default function BusinessModelStressTestPage() {
    return <BusinessModelStressTestTool />;
}
