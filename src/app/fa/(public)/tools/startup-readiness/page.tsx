import { localeAlternates } from "@/lib/seo"
import { StartupReadinessTool } from "@/components/startup-readiness/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/startup-readiness", "fa"),
    title: "ارزیابی امتیاز آمادگی استارتاپ",
    description: "سی پرسش برای سنجش اینکه استارتاپ شما واقعاً در چه مرحله‌ای است و گام بعدی‌اش چیست.",
};

export default function StartupReadinessPage() {
    return (
        <ToolShell>
            <StartupReadinessTool locale="fa" />
        </ToolShell>
    );
}
