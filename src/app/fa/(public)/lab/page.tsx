import type { Metadata } from "next";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check,
  X,
  Lightbulb,
  User,
  Users,
  MapPin,
  Globe,
  Mail,
  Target,
  Brain,
  ShieldCheck,
  Zap,
  Search,
  Flame,
  ArrowLeft,
  Sparkles,
  BookOpen,
  TrendingUp,
  Eye,
} from "lucide-react";
import { ApplicationForm } from "./application-form";

export const metadata: Metadata = {
  title: "Founder Development Lab | Farjad .P",
  description: "یک برنامه ۸ هفته‌ای منتورشیپ برای Founderها و تیم‌های بسیار اولیه",
};

export default function FounderLabPage() {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Founder Development Lab",
    "description": "یک برنامه ۸ هفته‌ای منتورشیپ برای Founderها و تیم‌های بسیار اولیه (از ایده تا شواهد).",
    "provider": {
      "@type": "Person",
      "name": "Farjad Pourmohammad",
      "url": "https://farjadp.info"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Blended",
      "location": "Toronto / Online"
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FDFCF8] text-[#1C1917] selection:bg-[#1B4B43] selection:text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-20 px-6">
        {/* subtle dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_60%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-8 text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B4B43]/10 border border-[#1B4B43]/20 text-[#1B4B43] text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B4B43] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B4B43]"></span>
              </span>
              ظرفیت محدود — ۵ تیم در این Cohort
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-black text-[#111827] leading-[1.15] tracking-tight">
                Founder<br />
                <span className="text-[#1B4B43]">Development</span><br />
                Lab
              </h1>
              <p className="text-2xl font-bold text-stone-500">از ایده تا شواهد</p>
            </div>

            <p className="text-lg text-stone-600 leading-loose max-w-lg">
              یک برنامه ۸ هفته‌ای منتورشیپ برای Founderها و تیم‌های بسیار اولیه.
              نه سخنرانی، نه مدرک — فقط تصمیم‌های واقعی‌تر.
            </p>

            <div className="flex flex-row-reverse gap-4 flex-wrap">
              <a href="#apply" className="group px-8 py-4 bg-[#111827] text-white font-bold rounded-full text-base hover:bg-[#1B4B43] transition-all duration-300 hover:scale-105 flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                درخواست ورود به برنامه
              </a>
              <a href="#program" className="px-8 py-4 bg-white text-[#111827] font-bold rounded-full text-base border border-stone-200 hover:border-[#1B4B43]/40 transition-all duration-300 hover:bg-stone-50">
                بیشتر بخوانید ↓
              </a>
            </div>

            {/* Stats Row */}
            <div className="flex gap-8 pt-4 border-t border-stone-200">
              {[
                { n: "۸", l: "هفته" },
                { n: "۵", l: "تیم" },
                { n: "+۲۰", l: "سال تجربه" },
              ].map((s) => (
                <div key={s.l} className="text-right">
                  <div className="text-2xl font-black text-[#1B4B43]">{s.n}</div>
                  <div className="text-sm text-stone-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl border border-stone-200/60 bg-[#FDFCF8]">
              <Image
                src="/images/founder-lab-hero.png"
                alt="مسیر ایده تا شواهد"
                fill
                className="object-contain p-8"
                priority
              />
              {/* floating badge */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-stone-200 px-4 py-2 rounded-2xl shadow-lg">
                <p className="text-xs text-stone-500">نتیجه</p>
                <p className="text-sm font-bold text-[#1B4B43]">ابهام → وضوح</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALLOUT ──────────────────────────────────────────── */}
      <section className="px-6 mb-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 md:p-8 flex items-start gap-5">
            <div className="bg-amber-100 p-3 rounded-2xl shrink-0">
              <Lightbulb className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-1">فرصت محدود</h3>
              <p className="text-amber-800 leading-relaxed">
                تنها ۵ تیم پذیرفته می‌شوند. پس از پایان دوره، امکان ادامه منتورشیپ بلندمدت با ۲ یا ۳ تیم منتخب وجود دارد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS THIS ─────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 text-[#1B4B43] text-sm font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> درباره برنامه
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] leading-tight">
              این برنامه<br />دقیقاً چیست؟
            </h2>
          </div>
          <div className="md:col-span-3 space-y-6 text-base leading-loose text-stone-600">
            <p>
              اگر در مرحله ایده یا Pre-MVP هستید، مشکل اصلی شما کمبود اطلاعات نیست. مشکل، حجم زیادی از فرضیه‌ها، تصمیم‌های ناتمام و ابهام درباره مشتری، بازار، محصول و مدل کسب‌وکار است.
            </p>
            <div className="bg-[#1B4B43]/8 border-r-4 border-[#1B4B43] pr-6 py-4 rounded-l-xl">
              <p className="font-bold text-[#1B4B43] text-lg mb-2">این دوره برای ساختن Pitch Deck نیست.</p>
              <p className="text-stone-600 leading-relaxed">
                قرار است در ۸ هفته، مهم‌ترین فرض‌های کسب‌وکار را روشن کنیم، ابهام را کاهش دهیم و مشخص کنیم که قدم بعدی استارتاپ واقعاً چیست.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FIT CARDS ────────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-emerald-100 p-3 rounded-2xl">
                <Check className="w-6 h-6 text-emerald-700" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">مناسب چه کسانی است؟</h2>
            </div>
            <ul className="space-y-5">
              {[
                "در مرحله Idea، Validation یا Pre-MVP قرار دارید.",
                "ایده‌ای مشخص دارید، اما مسیر نهایی روشن نیست.",
                "آماده‌اید فرض‌های خود را زیر سؤال ببرید.",
                "بین جلسات واقعاً کار می‌کنید.",
                "می‌خواهید بدانید قدم واقعی بعدی چیست.",
              ].map((t, i) => (
                <li key={i} className="flex gap-4 items-start text-stone-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  </div>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-red-100 p-3 rounded-2xl">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">مناسب چه کسانی نیست؟</h2>
            </div>
            <ul className="space-y-5">
              {[
                "کسی که فقط دنبال مدرک یا جلسات انگیزشی است.",
                "تیمی که انتظار دارد Mentor برایش مشتری فراهم کند.",
                "فاندری که فقط دنبال تأیید ایده‌اش است.",
              ].map((t, i) => (
                <li key={i} className="flex gap-4 items-start text-stone-500">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  </div>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 8-WEEK JOURNEY ───────────────────────────────────── */}
      <section id="program" className="px-6 py-20 bg-stone-50/60 border-y border-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-[#1B4B43] text-sm font-bold uppercase tracking-widest mb-4">
              <TrendingUp className="w-4 h-4" /> مسیر برنامه
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#111827] mb-4">مسیر ۸ هفته‌ای</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
              هر هفته حداقل یک عدم‌قطعیت مهم کمتر می‌شود — حتی اگر پیشرفت به معنی کشف یک اشتباه باشد.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-4 md:p-8 shadow-sm">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {[
                { w: 1, title: "The Founder & The Thesis", out: "Venture Thesis v0.1 + Founder Baseline", desc: "تفکیک آنچه می‌دانیم، آنچه باور داریم و آنچه هنوز نمی‌دانیم. ساخت نسخه اولیه Venture Thesis و مشخص‌کردن مهم‌ترین ابهام‌ها.", icon: <Target className="w-5 h-5" /> },
                { w: 2, title: "Problem Deconstruction", out: "Problem Map + Top 5 Critical Assumptions", desc: "شکستن مسئله به Trigger، Frequency، Severity و Cost. پیدا کردن فرض‌های خطرناکی که اگر غلط باشند، کل ایده را زیر سؤال می‌برند.", icon: <Search className="w-5 h-5" /> },
                { w: 3, title: "Customer Discovery", out: "Customer Hypothesis + Evidence Log", desc: "شناخت مشتری واقعی و یادگیری گفت‌وگوی درست با مشتری؛ فهم رفتار، تجربه و مسئله واقعی به‌جای پرسیدن سؤال‌های تأییدی.", icon: <Users className="w-5 h-5" /> },
                { w: 4, title: "Market Reality & Positioning", out: "Market Map + Venture Thesis v0.2", desc: "دیدن بازار همان‌طور که هست: رقبا، جایگزین‌ها، Doing Nothing، موانع ورود و دلیل واقعی انتخاب شدن.", icon: <Eye className="w-5 h-5" /> },
              ].map((week) => (
                <AccordionItem key={week.w} value={`week-${week.w}`} className="border border-stone-100 bg-stone-50/50 hover:bg-white transition-colors rounded-2xl overflow-hidden">
                  <AccordionTrigger className="hover:no-underline px-5 py-4 data-[state=open]:text-[#1B4B43]">
                    <div className="flex items-center gap-4 text-right w-full">
                      <div className="bg-[#1B4B43]/10 text-[#1B4B43] p-2 rounded-xl shrink-0">{week.icon}</div>
                      <span className="font-mono text-stone-400 text-xs shrink-0">W0{week.w}</span>
                      <span className="font-bold text-lg">{week.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pt-1 text-base leading-relaxed text-stone-600">
                    <p className="mb-4">{week.desc}</p>
                    <div className="bg-[#1B4B43]/8 px-4 py-3 rounded-xl flex flex-col md:flex-row gap-2 md:items-center border border-[#1B4B43]/10">
                      <span className="text-[#1B4B43] font-bold text-xs uppercase tracking-widest shrink-0">Output</span>
                      <span className="font-medium text-[#1B4B43]">{week.out}</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* mid separator */}
              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
                <span className="relative bg-amber-50 border border-amber-200 text-amber-700 px-5 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                  نیمه دوم: راه‌حل، مدل درآمدی و تصمیم نهایی
                </span>
              </div>

              {[
                { w: 5, title: "Solution & Value Proposition", out: "Solution Hypothesis + What We Will NOT Build", desc: "طراحی کوچک‌ترین راه‌حلی که ارزش اصلی را قابل آزمایش کند. تصمیم مهم: چه چیزی را فعلاً نسازیم.", icon: <Zap className="w-5 h-5" /> },
                { w: 6, title: "Business Model & Kill Risks", out: "Business Model Hypothesis + Kill-Risk Map", desc: "بررسی اینکه چه کسی پول می‌دهد، چرا، چقدر. سپس شناسایی سه ریسک که می‌توانند کسب‌وکار را بکشند.", icon: <Flame className="w-5 h-5" /> },
                { w: 7, title: "The Critical Experiment", out: "Critical Experiment + Evidence", desc: "انتخاب پرریسک‌ترین فرض و طراحی ارزان‌ترین آزمایش معتبر برای نزدیک‌شدن به حقیقت.", icon: <Brain className="w-5 h-5" /> },
                { w: 8, title: "Founder Decision Board", out: "Decision + 90-Day Execution Plan", desc: "مرور چیزی که باور داشتیم، چیزی که یاد گرفتیم، چیزی که اشتباه بود و تصمیم ۹۰ روز بعد. Demo Day نداریم؛ Decision Day داریم.", icon: <ShieldCheck className="w-5 h-5" /> },
              ].map((week) => (
                <AccordionItem key={week.w} value={`week-${week.w}`} className="border border-stone-100 bg-stone-50/50 hover:bg-white transition-colors rounded-2xl overflow-hidden">
                  <AccordionTrigger className="hover:no-underline px-5 py-4 data-[state=open]:text-[#1B4B43]">
                    <div className="flex items-center gap-4 text-right w-full">
                      <div className="bg-[#1B4B43]/10 text-[#1B4B43] p-2 rounded-xl shrink-0">{week.icon}</div>
                      <span className="font-mono text-stone-400 text-xs shrink-0">W0{week.w}</span>
                      <span className="font-bold text-lg">{week.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-5 pt-1 text-base leading-relaxed text-stone-600">
                    <p className="mb-4">{week.desc}</p>
                    <div className="bg-[#1B4B43]/8 px-4 py-3 rounded-xl flex flex-col md:flex-row gap-2 md:items-center border border-[#1B4B43]/10">
                      <span className="text-[#1B4B43] font-bold text-xs uppercase tracking-widest shrink-0">Output</span>
                      <span className="font-medium text-[#1B4B43]">{week.out}</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ─── FOUNDER FOCUS 2×2 ────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="md:grid md:grid-cols-5 gap-12 mb-16 items-end">
            <div className="md:col-span-3 space-y-4">
              <div className="inline-flex items-center gap-2 text-[#1B4B43] text-sm font-bold uppercase tracking-widest">
                <Eye className="w-4 h-4" /> فراتر از ایده
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#111827] leading-tight">
                Founder هم زیر نور قرار می‌گیرد
              </h2>
            </div>
            <p className="md:col-span-2 text-stone-500 leading-relaxed md:text-right">
              اگر قرار باشد یک سال کنار تیمی بمانم، کیفیت Founder از جذابیت اولیه ایده مهم‌تر است.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: <Search className="w-7 h-7 text-[#1B4B43]" />, title: "Truth", bg: "bg-emerald-50", border: "border-emerald-100", desc: "وقتی شواهد برخلاف باور Founder است، آیا آن را می‌پذیرد یا برای حفظ ایده توجیه می‌سازد؟" },
              { icon: <Zap className="w-7 h-7 text-amber-600" />, title: "Agency", bg: "bg-amber-50", border: "border-amber-100", desc: "بین جلسات واقعاً اقدام می‌کند یا منتظر شرایط کامل، مشتری آماده یا دستور بعدی می‌ماند؟" },
              { icon: <Brain className="w-7 h-7 text-blue-600" />, title: "Learning", bg: "bg-blue-50", border: "border-blue-100", desc: "آیا اطلاعات جدید واقعاً باعث تغییر نظر و تصمیم می‌شود یا فقط به فایل‌ها اضافه می‌شود؟" },
              { icon: <ShieldCheck className="w-7 h-7 text-purple-600" />, title: "Self-Awareness", bg: "bg-purple-50", border: "border-purple-100", desc: "آیا Founder می‌تواند ضعف رفتاری خودش را ببیند یا مشکل همیشه بیرون از خودش است؟" },
            ].map((c) => (
              <div key={c.title} className={`${c.bg} border ${c.border} p-8 rounded-3xl hover:shadow-md transition-shadow group`}>
                <div className="bg-white/70 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {c.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#111827] mb-3">{c.title}</h3>
                <p className="text-stone-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── JOURNAL + PRESSURE ───────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#1B4B43]/10 p-3 rounded-2xl">
                <BookOpen className="w-6 h-6 text-[#1B4B43]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111827]">Founder Journal هفتگی</h2>
            </div>
            <div className="space-y-5">
              {[
                "این هفته چه چیزی را باور داشتم؟",
                "چه شواهدی آن را به چالش کشید؟",
                "چه تصمیمی را عوض کردم؟",
                "از انجام چه کاری فرار کردم؟",
              ].map((q, i) => (
                <div key={i} className="flex gap-5 items-center p-4 bg-stone-50 rounded-2xl">
                  <span className="font-black text-2xl text-stone-300 shrink-0">0{i + 1}</span>
                  <p className="font-medium text-[#111827]">{q}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-900 text-white rounded-3xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#1B4B43]/30 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-red-500/20 p-3 rounded-2xl">
                  <Flame className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold">Pressure Moments</h2>
              </div>
              <p className="text-stone-300 leading-relaxed mb-8 text-base">
                بعضی هفته‌ها عمداً یک تصمیم یا اقدام واقعی وجود دارد: صحبت با آدم واقعی، حذف Feature محبوب، یا اجرای آزمایشی که ممکن است نشان دهد فرض اصلی غلط بوده است.
              </p>
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 font-bold p-4 rounded-2xl text-base">
                هدف فشار مصنوعی نیست — دیدن رفتار Founder در موقعیت واقعی است.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FORMAT ───────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-stone-50/60 border-y border-stone-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-[#111827]">فرمت اجرا</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-stone-200 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-2xl"><Users className="w-6 h-6 text-blue-600" /></div>
                <h3 className="text-xl font-bold text-[#111827]">جلسات گروهی — هفتگی ۹۰ دقیقه</h3>
              </div>
              <div className="space-y-4">
                {[["۲۰ دقیقه", "Concept"], ["۵۰ دقیقه", "Hot Seat"], ["۲۰ دقیقه", "Decision & Next Move"]].map(([t, l]) => (
                  <div key={l} className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl">
                    <span className="font-bold text-[#1B4B43] shrink-0">{t}</span>
                    <span className="text-stone-600">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-2xl"><User className="w-6 h-6 text-purple-600" /></div>
                <h3 className="text-xl font-bold text-[#111827]">جلسات خصوصی ۱:۱</h3>
              </div>
              <p className="text-stone-600 leading-relaxed">
                در هفته‌های ۲، ۴، ۶ و ۸، هر تیم تا ۶۰ دقیقه جلسه 1:1 برای بررسی عمیق‌تر مسئله و تصمیم‌های همان مرحله دارد.
              </p>
              <div className="mt-6 grid grid-cols-4 gap-3">
                {["۲", "۴", "۶", "۸"].map((w) => (
                  <div key={w} className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
                    <span className="font-bold text-purple-700">W0{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OUTPUTS 3-COL ────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-4">در پایان ۸ هفته چه خواهید داشت؟</h2>
            <p className="text-stone-500 max-w-xl mx-auto">سه خروجی مشخص، قابل استفاده و متعلق به شما</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {[
              { n: "۰۱", title: "Venture Thesis", icon: <Target className="w-8 h-8 text-[#1B4B43]" />, bg: "bg-emerald-50 border-emerald-100", desc: "سند زنده از Problem، Customer، Market، Solution، Business Model، Risks و Evidence." },
              { n: "۰۲", title: "Evidence Book", icon: <BookOpen className="w-8 h-8 text-blue-600" />, bg: "bg-blue-50 border-blue-100", desc: "مجموع تحقیق، مصاحبه، آزمایش، فرض‌های ردشده و نشانه‌هایی که تصمیم‌های شما را تغییر داده‌اند." },
              { n: "۰۳", title: "برنامه ۹۰ روزه", icon: <TrendingUp className="w-8 h-8 text-amber-600" />, bg: "bg-amber-50 border-amber-100", desc: "سه اولویت مشخص برای ۹۰ روز بعد، معیارها، آزمایش‌های بعدی و ریتم اجرای هفتگی." },
            ].map((o) => (
              <div key={o.n} className={`${o.bg} border rounded-3xl p-8 md:p-10 flex flex-col h-full hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-white/80 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">{o.icon}</div>
                  <span className="font-mono font-black text-3xl text-black/10">{o.n}</span>
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-3">{o.title}</h3>
                <p className="text-stone-600 leading-relaxed mt-auto">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APPLICATION FORM ──────────────────────────────────── */}
      <section id="apply" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Top CTA Banner */}
          <div className="relative bg-[#111827] text-white rounded-[40px] p-10 md:p-14 mb-8 overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-[#1B4B43]/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-right">
                <h2 className="text-3xl md:text-4xl font-black leading-tight">
                  آماده‌اید ایده‌تان را<br />
                  <span className="text-[#4ade80]">واقعاً زیر سؤال ببرید؟</span>
                </h2>
                <p className="text-stone-300 leading-relaxed max-w-md">
                  فرم زیر را پر کنید. ۵ دقیقه وقت می‌برد و جواب صادقانه مهم‌تر از جواب کامل است.
                </p>
              </div>
              <div className="bg-white/10 border border-white/10 rounded-2xl p-5 text-right shrink-0 space-y-3 text-sm text-stone-300">
                <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[#4ade80] shrink-0" /> Toronto, Canada</p>
                <p className="flex items-center gap-3"><Globe className="w-4 h-4 text-[#4ade80] shrink-0" /> www.farjadp.info</p>
                <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#4ade80] shrink-0" /> its@farjadp.info</p>
                <div className="bg-[#4ade80]/10 text-[#4ade80] font-mono text-xs px-3 py-1 rounded-full inline-block border border-[#4ade80]/20">COHORT &apos;26</div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="mb-8 pb-6 border-b border-stone-100">
              <h3 className="text-2xl font-black text-[#111827] mb-1">فرم درخواست ورود</h3>
              <p className="text-stone-500 text-sm">همه فیلدها اجباری هستند — صادقانه پاسخ دهید، کامل بودن مهم نیست.</p>
            </div>
            <ApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
