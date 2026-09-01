import { TrlAssessmentTool } from "@/components/trl-assessment/tool";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ارزیابی TRL — محاسبه‌گر سطح آمادگی فناوری | آشاوید",
    description: "جایگاه فناوری‌تان را روی مقیاس ۱ تا ۹ ناسا پیدا کنید؛ همان مقیاسی که برنامه‌های نوآوری دولتی برای تأمین مالی به‌کار می‌برند. محاسبه‌گر مبتنی بر شواهد با تحلیل شکاف و بستر تأمین مالی.",
};

export default function TrlAssessmentFaPage() {
    return (
        <main dir="rtl" className="min-h-screen bg-[#FDFBF7] text-[#1C1917] selection:bg-[#0F3F35] selection:text-white">

            {/* Decorative Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#0F3F35]/5 blur-3xl opacity-60" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#D97706]/5 blur-3xl opacity-60" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
                <TrlAssessmentTool locale="fa" />
            </div>

        </main>
    );
}
