import { localeAlternates } from "@/lib/seo"
import type { Metadata } from "next";
import BusinessModelStressTestTool from "@/components/business-model-stress-test/tool";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/business-model-stress-test", "fa"),
    title: "تست فشار مدل کسب‌وکار",
    description:
        "بسنجید مدل کسب‌وکارتان در برابر آینده‌هایی که می‌توانند آن را بشکنند چقدر دوام می‌آورد. بر پایه‌ی روش داوری‌شده‌ی Haaker، Bouwman، Janssen و De Reuver (Futures، ۲۰۱۷).",
};

export default function BusinessModelStressTestFaPage() {
    return <BusinessModelStressTestTool locale="fa" />;
}
