// ============================================================================
// File Path: src/components/v3/pages/tools-index.tsx
// Why: /tools and /fa/tools in the v3 "Light" look, one component for both
//      locales. The copy is the pages' own, carried over word for word from
//      the v2 files (the two lists were never identical: English also shows
//      five "Coming Soon" entries, Persian lists only the live tools). Every
//      link goes through localePath so the Persian hub stays in /fa.
//      Fixed on the way: "Coming Soon" cards were links to "#"; they are
//      plain cards now.
// Env / Identity: React Server Component
// ============================================================================

import type { LucideIcon } from "lucide-react"
import {
  BarChart2,
  BatteryWarning,
  Bot,
  Briefcase,
  Flame,
  FlaskConical,
  Gauge,
  Globe2,
  HeartPulse,
  Rocket,
  Share2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import type { Locale } from "@/components/home/v3/copy"
import { localePath } from "@/lib/nav"
import { Arrow, Card, Chip, PageHero, Reveal, Section, V3Page } from "@/components/v3/kit"

type Tool = {
  name: string
  type: string
  desc: string
  action: string
  icon: LucideIcon
  /** Locale-less path; null for tools that are not live yet. */
  path: string | null
}

type Copy = {
  kicker?: string
  title: string
  accent: string
  lead: string
  /** The badge on each card: the live/coming status (en) or the tool type (fa). */
  badge: "status" | "type"
  live: string
  soon: string
  tools: Tool[]
}

const COPY: Record<Locale, Copy> = {
  en: {
    kicker: "The Library",
    title: "Tools &",
    accent: "Frameworks.",
    lead: "No fluff. No hype. Just practical diagnostics and engineering systems applied to business building. Free for serious founders.",
    badge: "status",
    live: "Active Component",
    soon: "Coming Soon",
    tools: [
      {
        name: "AI Website Readiness",
        type: "Live Diagnostic",
        desc: "Scan your website to see whether AI crawlers can access, understand, and cite it. Get a scored report and prioritized fixes.",
        action: "Audit Website",
        icon: Globe2,
        path: "/tools/ai-website-readiness",
      },
      {
        name: "Business Model Stress Test",
        type: "AI Diagnostic",
        desc: "Put your business model against the futures that could break it. Get a heat map of which components stop being feasible, and what to redesign first.",
        action: "Stress Test My Model",
        icon: FlaskConical,
        path: "/tools/business-model-stress-test",
      },
      {
        name: "TRL Assessment",
        type: "Diagnostic Tool",
        desc: "Locate your technology on the NASA 1–9 readiness scale used by government innovation programs. Get your TRL, the evidence gaps to the next level, and funding context.",
        action: "Calculate My TRL",
        icon: Gauge,
        path: "/tools/trl-assessment",
      },
      {
        name: "NPI Brand Assessment",
        type: "Diagnostic Tool",
        desc: "Evaluate the 3 core pillars of your personal brand: Narrative, Presence, and Impact. Discover your leverage points instantly.",
        action: "Take Assessment",
        icon: Target,
        path: "/tools/npi-assessment",
      },
      {
        name: "Sales Funnel Health Score",
        type: "Diagnostic Tool",
        desc: "Locate exactly where your funnel is leaking revenue. Covers lead generation, qualification, closing, and tracking.",
        action: "Diagnose Funnel",
        icon: TrendingUp,
        path: "/tools/sales-funnel-score",
      },
      {
        name: "AI Adoption Readiness",
        type: "Diagnostic Tool",
        desc: "Determine if your business is structurally ready for AI integration, or if you need foundational data work first.",
        action: "Take Assessment",
        icon: Bot,
        path: "/tools/ai-adoption-score",
      },
      {
        name: "Business Model Strength",
        type: "Diagnostic Tool",
        desc: "Evaluate whether your business model is logical, revenue-capable, scalable, and defensible across 6 dimensions.",
        action: "Take Assessment",
        icon: BarChart2,
        path: "/tools/business-model-score",
      },
      {
        name: "Investor Readiness Score",
        type: "Diagnostic Tool",
        desc: "Evaluate your preparedness for raising capital. Find out instantly if you possess the signals needed to pitch angels or VCs.",
        action: "Take Assessment",
        icon: Briefcase,
        path: "/tools/investor-readiness",
      },
      {
        name: "Startup Readiness Score",
        type: "Interactive Tool",
        desc: "Evaluate your startup idea across 6 critical dimensions. Uncover the gaps in your market, product, and team.",
        action: "Take Assessment",
        icon: Rocket,
        path: "/tools/startup-readiness",
      },
      {
        name: "Impossible Trinity Simulator",
        type: "Interactive Tool",
        desc: "Simulate the pressure on your team when you push the limits of profit, speed, and safety in a contract.",
        action: "Start Simulation",
        icon: Flame,
        path: "/tools/impossible-trinity-simulator",
      },
      {
        name: "Product-Market Fit Score",
        type: "Diagnostic Tool",
        desc: "Evaluates whether a product truly matches a real market demand. Analyzes customer feedback, usage, retention, and willingness to pay.",
        action: "Coming Soon",
        icon: Target,
        path: null,
      },
      {
        name: "Founder Burnout Risk Test",
        type: "Diagnostic Tool",
        desc: "Measures the risk of burnout by evaluating workload intensity, decision fatigue, financial pressure, and emotional resilience.",
        action: "Coming Soon",
        icon: BatteryWarning,
        path: null,
      },
      {
        name: "Digital Marketing Maturity",
        type: "Diagnostic Tool",
        desc: "Evaluates how developed and structured your digital marketing capabilities are, measuring strategy clarity and automation.",
        action: "Coming Soon",
        icon: Share2,
        path: null,
      },
      {
        name: "Team Alignment Score",
        type: "Diagnostic Tool",
        desc: "Evaluates how aligned your startup team is around goals, responsibilities, and strategic direction to prevent internal friction.",
        action: "Coming Soon",
        icon: Users,
        path: null,
      },
      {
        name: "Startup Survival Probability",
        type: "Diagnostic Tool",
        desc: "Estimates the probability that a startup can survive the next 18–24 months by analyzing financial runway and market traction.",
        action: "Coming Soon",
        icon: HeartPulse,
        path: null,
      },
    ],
  },
  fa: {
    title: "ابزارها و",
    accent: "چارچوب‌ها.",
    lead: "بدون حرف اضافه، بدون هیاهو. فقط ابزارهای تشخیصی کاربردی و سیستم‌های مهندسی‌شده برای ساختن کسب‌وکار. رایگان، برای بنیان‌گذاران جدی.",
    badge: "type",
    live: "",
    soon: "",
    tools: [
      {
        name: "ارزیابی TRL",
        type: "ابزار تشخیصی",
        desc: "جایگاه فناوری‌تان را روی مقیاس ۱ تا ۹ ناسا پیدا کنید؛ همان مقیاسی که برنامه‌های نوآوری دولتی برای تأمین مالی به‌کار می‌برند. با تحلیل شکاف تا سطح بعدی.",
        action: "محاسبه‌ی TRL من",
        icon: Gauge,
        path: "/tools/trl-assessment",
      },
      {
        name: "ممیزی آمادگی وب‌سایت برای هوش مصنوعی",
        type: "تشخیص زنده",
        desc: "سایتتان را اسکن کنید و ببینید خزنده‌های هوش مصنوعی می‌توانند آن را بخوانند، بفهمند و به آن ارجاع دهند یا نه. گزارش امتیازدهی‌شده با اصلاحات اولویت‌بندی‌شده.",
        action: "ممیزی وب‌سایت",
        icon: Globe2,
        path: "/tools/ai-website-readiness",
      },
      {
        name: "تست فشار مدل کسب‌وکار",
        type: "تشخیص با هوش مصنوعی",
        desc: "مدل کسب‌وکارتان را در برابر آینده‌هایی بگذارید که می‌توانند آن را بشکنند. نقشه‌ی حرارتی از اینکه کدام اجزا از کار می‌افتند و اول باید چه چیزی را بازطراحی کرد.",
        action: "تست فشار مدل من",
        icon: FlaskConical,
        path: "/tools/business-model-stress-test",
      },
      {
        name: "ارزیابی برند شخصی NPI",
        type: "ابزار تشخیصی",
        desc: "سه ستون اصلی برند شخصی‌تان را بسنجید: روایت، حضور و اثر. نقاط اهرمی‌تان را همان لحظه ببینید.",
        action: "شروع ارزیابی",
        icon: Target,
        path: "/tools/npi-assessment",
      },
      {
        name: "امتیاز سلامت قیف فروش",
        type: "ابزار تشخیصی",
        desc: "دقیقاً پیدا کنید قیف فروشتان کجا درآمد را هدر می‌دهد. جذب سرنخ، صلاحیت‌سنجی، بستن قرارداد و پیگیری را پوشش می‌دهد.",
        action: "تشخیص قیف",
        icon: TrendingUp,
        path: "/tools/sales-funnel-score",
      },
      {
        name: "آمادگی برای پذیرش هوش مصنوعی",
        type: "ابزار تشخیصی",
        desc: "بسنجید کسب‌وکارتان از نظر ساختاری برای یکپارچه‌سازی هوش مصنوعی آماده است، یا اول باید پایه‌ی داده‌ها را درست کنید.",
        action: "شروع ارزیابی",
        icon: Bot,
        path: "/tools/ai-adoption-score",
      },
      {
        name: "قدرت مدل کسب‌وکار",
        type: "ابزار تشخیصی",
        desc: "بسنجید مدل کسب‌وکارتان در شش بُعد منطقی، درآمدزا، مقیاس‌پذیر و قابل‌دفاع هست یا نه.",
        action: "شروع ارزیابی",
        icon: BarChart2,
        path: "/tools/business-model-score",
      },
      {
        name: "امتیاز آمادگی برای جذب سرمایه",
        type: "ابزار تشخیصی",
        desc: "آمادگی‌تان برای جذب سرمایه را بسنجید. همان لحظه ببینید سیگنال‌هایی که برای ارائه به فرشتگان یا VCها لازم است دارید یا نه.",
        action: "شروع ارزیابی",
        icon: Briefcase,
        path: "/tools/investor-readiness",
      },
      {
        name: "امتیاز آمادگی استارتاپ",
        type: "ابزار تعاملی",
        desc: "ایده‌ی استارتاپ‌تان را در شش بُعد حیاتی بسنجید و شکاف‌های بازار، محصول و تیم را پیدا کنید.",
        action: "شروع ارزیابی",
        icon: Rocket,
        path: "/tools/startup-readiness",
      },
      {
        name: "شبیه‌ساز مثلث ناممکن",
        type: "ابزار تعاملی",
        desc: "شبیه‌سازی فشاری که وقتی در یک قرارداد سود، سرعت و ایمنی را تا مرز می‌برید، به تیمتان وارد می‌شود.",
        action: "شروع شبیه‌سازی",
        icon: Flame,
        path: "/tools/impossible-trinity-simulator",
      },
    ],
  },
}

export function ToolsIndex({ locale }: { locale: Locale }) {
  const t = COPY[locale]

  return (
    <V3Page>
      <PageHero kicker={t.kicker} title={t.title} accent={t.accent} lead={t.lead} />

      <Section bordered={false}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.tools.map((tool, i) => {
            const live = tool.path !== null
            const Icon = tool.icon
            const badge = t.badge === "type" ? tool.type : live ? t.live : t.soon
            return (
              <Reveal key={tool.name} delay={(i % 3) * 0.08}>
                <Card
                  href={live ? localePath(locale, tool.path as string) : undefined}
                  className={`min-h-[360px] ${live ? "" : "opacity-60"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl border border-v3-line bg-v3-raise transition-colors duration-500 ${
                        live ? "text-v3-light group-hover:border-v3-light/60" : "text-v3-mute"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <Chip className={live ? "border-v3-light/40 text-v3-light" : ""}>{badge}</Chip>
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    {t.badge === "status" && <span className="text-sm text-v3-mute">{tool.type}</span>}
                    <h3 className="font-v3-display text-2xl font-light leading-tight transition-colors duration-300 group-hover:text-v3-light rtl:leading-snug">
                      {tool.name}
                    </h3>
                    <span
                      aria-hidden
                      className="h-px w-8 bg-v3-light/70 transition-all duration-500 group-hover:w-16"
                    />
                    <p className="leading-relaxed text-v3-soft rtl:leading-loose">{tool.desc}</p>
                  </div>

                  <div
                    className={`mt-4 flex items-center justify-between gap-3 border-t border-v3-line/70 pt-5 text-sm font-medium ${
                      live ? "text-v3-bone group-hover:text-v3-light" : "text-v3-mute"
                    }`}
                  >
                    <span>{tool.action}</span>
                    {live && (
                      <Arrow
                        locale={locale}
                        className="h-4 w-4 text-v3-light transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                      />
                    )}
                  </div>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Section>
    </V3Page>
  )
}
