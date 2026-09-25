import { localeAlternates } from "@/lib/seo"
import type { Metadata } from "next";
import AiWebsiteReadinessTool from "@/components/ai-website-readiness/tool";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/ai-website-readiness", "fa"),
    title: "ممیزی آمادگی وب‌سایت برای هوش مصنوعی",
    description:
        "بسنجید خزنده‌های هوش مصنوعی می‌توانند سایت شما را بخوانند، بفهمند و به آن ارجاع دهند یا نه. امتیاز آمادگی رایگان به‌همراه فهرست اولویت‌بندی‌شده‌ی اصلاحات.",
};

export default function AiWebsiteReadinessFaPage() {
    return (
        <ToolShell wide>
            <AiWebsiteReadinessTool locale="fa" />
        </ToolShell>
    );
}
