// ============================================================================
// Hardware Source: page.tsx
// Version: 2.0.0 — 2026-09-21
// Why: Persian tools hub. Lists the same ten diagnostics as the English hub.
//      Previously five entries linked to the ENGLISH routes and five more were
//      href="#" placeholders for tools that do not exist; both are gone.
//      Only TRL is a genuinely Persian tool today — the other nine render the
//      shared English component under a Persian title.
// Env / Identity: React Server Component
// ============================================================================

import { localeAlternates } from "@/lib/seo"
import {
    Rocket,
    Briefcase,
    BarChart2,
    Bot,
    TrendingUp,
    ArrowLeft,
    Target,
    Gauge,
    Globe2,
    FlaskConical,
    Flame,
} from "lucide-react"
import Link from "next/link"

export const metadata = {
    alternates: localeAlternates("/tools", "fa"),
    title: "ابزارها و چارچوب‌های رایگان",
    description: "سیستم‌ها، ابزارهای تشخیصی و چارچوب‌هایی برای اینکه بنیان‌گذاران بدون هیاهو بسازند و رشد کنند.",
}

const TOOLS = [
    {
        name: "ارزیابی TRL",
        type: "ابزار تشخیصی",
        desc: "جایگاه فناوری‌تان را روی مقیاس ۱ تا ۹ ناسا پیدا کنید؛ همان مقیاسی که برنامه‌های نوآوری دولتی برای تأمین مالی به‌کار می‌برند. با تحلیل شکاف تا سطح بعدی.",
        action: "محاسبه‌ی TRL من",
        icon: Gauge,
        href: "/fa/tools/trl-assessment",
    },
    {
        name: "ممیزی آمادگی وب‌سایت برای هوش مصنوعی",
        type: "تشخیص زنده",
        desc: "سایتتان را اسکن کنید و ببینید خزنده‌های هوش مصنوعی می‌توانند آن را بخوانند، بفهمند و به آن ارجاع دهند یا نه. گزارش امتیازدهی‌شده با اصلاحات اولویت‌بندی‌شده.",
        action: "ممیزی وب‌سایت",
        icon: Globe2,
        href: "/fa/tools/ai-website-readiness",
    },
    {
        name: "تست فشار مدل کسب‌وکار",
        type: "تشخیص با هوش مصنوعی",
        desc: "مدل کسب‌وکارتان را در برابر آینده‌هایی بگذارید که می‌توانند آن را بشکنند. نقشه‌ی حرارتی از اینکه کدام اجزا از کار می‌افتند و اول باید چه چیزی را بازطراحی کرد.",
        action: "تست فشار مدل من",
        icon: FlaskConical,
        href: "/fa/tools/business-model-stress-test",
    },
    {
        name: "ارزیابی برند شخصی NPI",
        type: "ابزار تشخیصی",
        desc: "سه ستون اصلی برند شخصی‌تان را بسنجید: روایت، حضور و اثر. نقاط اهرمی‌تان را همان لحظه ببینید.",
        action: "شروع ارزیابی",
        icon: Target,
        href: "/fa/tools/npi-assessment",
    },
    {
        name: "امتیاز سلامت قیف فروش",
        type: "ابزار تشخیصی",
        desc: "دقیقاً پیدا کنید قیف فروشتان کجا درآمد را هدر می‌دهد. جذب سرنخ، صلاحیت‌سنجی، بستن قرارداد و پیگیری را پوشش می‌دهد.",
        action: "تشخیص قیف",
        icon: TrendingUp,
        href: "/fa/tools/sales-funnel-score",
    },
    {
        name: "آمادگی برای پذیرش هوش مصنوعی",
        type: "ابزار تشخیصی",
        desc: "بسنجید کسب‌وکارتان از نظر ساختاری برای یکپارچه‌سازی هوش مصنوعی آماده است، یا اول باید پایه‌ی داده‌ها را درست کنید.",
        action: "شروع ارزیابی",
        icon: Bot,
        href: "/fa/tools/ai-adoption-score",
    },
    {
        name: "قدرت مدل کسب‌وکار",
        type: "ابزار تشخیصی",
        desc: "بسنجید مدل کسب‌وکارتان در شش بُعد منطقی، درآمدزا، مقیاس‌پذیر و قابل‌دفاع هست یا نه.",
        action: "شروع ارزیابی",
        icon: BarChart2,
        href: "/fa/tools/business-model-score",
    },
    {
        name: "امتیاز آمادگی برای جذب سرمایه",
        type: "ابزار تشخیصی",
        desc: "آمادگی‌تان برای جذب سرمایه را بسنجید. همان لحظه ببینید سیگنال‌هایی که برای ارائه به فرشتگان یا VCها لازم است دارید یا نه.",
        action: "شروع ارزیابی",
        icon: Briefcase,
        href: "/fa/tools/investor-readiness",
    },
    {
        name: "امتیاز آمادگی استارتاپ",
        type: "ابزار تعاملی",
        desc: "ایده‌ی استارتاپ‌تان را در شش بُعد حیاتی بسنجید و شکاف‌های بازار، محصول و تیم را پیدا کنید.",
        action: "شروع ارزیابی",
        icon: Rocket,
        href: "/fa/tools/startup-readiness",
    },
    {
        name: "شبیه‌ساز مثلث ناممکن",
        type: "ابزار تعاملی",
        desc: "شبیه‌سازی فشاری که وقتی در یک قرارداد سود، سرعت و ایمنی را تا مرز می‌برید، به تیمتان وارد می‌شود.",
        action: "شروع شبیه‌سازی",
        icon: Flame,
        href: "/fa/tools/impossible-trinity-simulator",
    },
]

export default function ToolsFaPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans selection:bg-[#0F3F35] selection:text-white pb-24">

            {/* Header Section */}
            <header className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto border-b border-stone-200">
                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-7xl font-black leading-[1.1] text-[#0F3F35] mb-6">
                        ابزارها و <br />
                        <span className="text-[#D97706]">چارچوب‌ها.</span>
                    </h1>

                    <p className="text-xl text-stone-600 leading-relaxed font-medium max-w-2xl">
                        بدون حرف اضافه، بدون هیاهو. فقط ابزارهای تشخیصی کاربردی و سیستم‌های مهندسی‌شده برای ساختن کسب‌وکار. رایگان، برای بنیان‌گذاران جدی.
                    </p>
                </div>
            </header>

            {/* Main Grid */}
            <main className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TOOLS.map((tool) => (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="group flex flex-col bg-white border border-stone-200 p-8 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-[#D97706] hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="absolute top-0 end-0 w-24 h-24 bg-[#0F3F35]/5 rounded-es-full -me-4 -mt-4 transition-transform group-hover:scale-110" />

                            <div className="mb-6 flex justify-between items-start relative z-10">
                                <div className="p-3 bg-stone-100 rounded-lg text-[#0F3F35] group-hover:bg-[#0F3F35] group-hover:text-white transition-colors duration-300">
                                    <tool.icon className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] text-[#D97706] bg-[#D97706]/10 px-2 py-1 rounded">
                                    {tool.type}
                                </span>
                            </div>

                            <div className="flex-1 relative z-10">
                                <h3 className="text-2xl font-bold text-[#0F3F35] mb-2 leading-tight">
                                    {tool.name}
                                </h3>
                                <div className="w-8 h-1 bg-[#D97706] mb-4 transition-all duration-300 group-hover:w-16" />
                                <p className="text-stone-600 leading-relaxed text-sm md:text-base">
                                    {tool.desc}
                                </p>
                            </div>

                            <div className="mt-10 flex items-center justify-between text-[#0F3F35] font-medium border-t border-stone-100 pt-6 relative z-10">
                                <span className="group-hover:text-[#D97706] transition-colors">{tool.action}</span>
                                <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform text-[#D97706]" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

        </div>
    )
}
