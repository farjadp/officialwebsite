import { localeAlternates } from "@/lib/seo"
import { NPIAssessmentTool } from "@/components/npi-assessment/tool";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/npi-assessment", "fa"),
    title: "ارزیابی برند شخصی NPI",
    description: "سه ستون اصلی برند شخصی‌تان را بسنجید: روایت، حضور و اثر. نقاط اهرمی‌تان را همان لحظه ببینید.",
};

export default function NPIAssessmentFaPage() {
    return (
        <ToolShell>
            <NPIAssessmentTool locale="fa" />
        </ToolShell>
    );
}
