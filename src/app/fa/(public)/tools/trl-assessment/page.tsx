import { localeAlternates } from "@/lib/seo"
import { TrlAssessmentTool } from "@/components/trl-assessment/tool";
import { TrlReference } from "@/components/trl-assessment/trl-reference";
import { Metadata } from "next";
import { ToolShell } from "@/components/v3/tool-kit";

export const metadata: Metadata = {
    alternates: localeAlternates("/tools/trl-assessment", "fa"),
    title: "ارزیابی TRL — محاسبه‌گر سطح آمادگی فناوری | آشاوید",
    description: "جایگاه فناوری‌تان را روی مقیاس ۱ تا ۹ ناسا پیدا کنید؛ همان مقیاسی که برنامه‌های نوآوری دولتی برای تأمین مالی به‌کار می‌برند. محاسبه‌گر مبتنی بر شواهد با تحلیل شکاف و بستر تأمین مالی.",
};

export default function TrlAssessmentFaPage() {
    return (
        <ToolShell>
            <TrlAssessmentTool locale="fa" />
            <TrlReference locale="fa" />
        </ToolShell>
    );
}
