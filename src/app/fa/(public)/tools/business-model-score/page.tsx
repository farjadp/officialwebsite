import { localeAlternates } from "@/lib/seo"
import { BusinessModelScoreTool } from "@/components/business-model-score/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/business-model-score", "fa"),
    title: "امتیاز استحکام مدل کسب‌وکار | ابزار تشخیص رایگان",
    description: "مدل کسب‌وکارتان را روی محورهایی که واقعاً تعیین‌کننده‌اند امتیاز بگیرید و ببینید کدام بخش شکننده است.",
};

export default function BusinessModelScorePage() {
    return (
        <ToolShell>
            <BusinessModelScoreTool />
        </ToolShell>
    );
}
