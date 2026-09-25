import { localeAlternates } from "@/lib/seo"
import { AIAdoptionScoreTool } from "@/components/ai-adoption-score/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/ai-adoption-score", "fa"),
    title: "امتیاز آمادگی پذیرش هوش مصنوعی | تشخیص رایگان کسب‌وکار",
    description: "بسنجید کسب‌وکارتان واقعاً چقدر برای به‌کارگیری هوش مصنوعی آماده است و اول کدام شکاف را باید ببندید.",
};

export default function AIAdoptionScorePage() {
    return (
        <ToolShell>
            <AIAdoptionScoreTool locale="fa" />
        </ToolShell>
    );
}
