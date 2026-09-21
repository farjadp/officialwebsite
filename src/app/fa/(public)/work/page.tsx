// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Main entry page for the route
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import React from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  ArrowUpRight,
  History,
  FlaskConical,
  Briefcase,
  Users,
  LayoutTemplate
} from "lucide-react"
import Link from "next/link"

// --- Mock Data: Active Ventures ---
const ACTIVE_VENTURES = [
  {
    id: 1,
    role: "بنیان‌گذار و منتور ارشد",
    name: "حلقه‌ی بنیان‌گذاران مهاجر",
    year: "۲۰۲۳ تا امروز",
    description: "یک برنامه‌ی منتورشیپ خصوصی برای بنیان‌گذارانی که در اکوسیستم استارتاپی کانادا مسیرشان را پیدا می‌کنند.",
    tags: ["آموزش", "اجتماع"],
    status: "در حال رشد",
    link: "#"
  },
  {
    id: 2,
    role: "مشاور ارشد",
    name: "سیستم‌های دیجیتال کسب‌وکارهای کوچک",
    year: "۲۰۲۲ تا امروز",
    description: "کمک به کسب‌وکارهای کوچک سنتی برای عبور از کاغذ و آشوب به گردش‌کار دیجیتال و هوش مصنوعی.",
    tags: ["مشاوره", "خودکارسازی"],
    status: "فعال",
    link: "#"
  },
  {
    id: 3,
    role: "نویسنده و سازنده",
    name: "کتابخانه‌ی فرجاد",
    year: "۲۰۲۱ تا امروز",
    description: "همین مرکز محتوا. کتابخانه‌ای شخصی از مدل‌های ذهنی، یادداشت‌ها و چارچوب‌ها برای سازندگان.",
    tags: ["رسانه", "نوشتن"],
    status: "در جریان",
    link: "/"
  }
];

// --- Mock Data: Past Projects ---
const PAST_PROJECTS = [
  {
    id: 101,
    name: "رویدادهای فناوری تهران",
    role: "هم‌برگزارکننده",
    years: "۲۰۱۶ تا ۲۰۱۹",
    outcome: "ساختن اجتماعی با بیش از ۵۰۰ توسعه‌دهنده.",
    lesson: "یاد گرفتم اجتماع را استمرار می‌سازد، نه بزرگی سالن.",
    status: "تمام‌شده"
  },
  {
    id: 102,
    name: "پروژه‌ی SaaS «آلفا»",
    role: "هم‌بنیان‌گذار",
    years: "۲۰۱۸ تا ۲۰۲۰",
    outcome: "به تناسب محصول و بازار نرسید. بعد از ۱۸ ماه تعطیل شد.",
    lesson: "یاد گرفتم «فناوری باحال» با «مسئله‌ی کسب‌وکار» یکی نیست.",
    status: "تعطیل‌شده" // Honest language
  }
];

// --- Mock Data: Experiments ---
const EXPERIMENTS = [
  { title: "هوش مصنوعی برای مدارک ویزا", type: "نمونه‌ی اولیه", desc: "آزمودن مدل‌های زبانی برای خلاصه کردن زبان حقوقی." },
  { title: "دفترچه‌ی سه‌دقیقه‌ای", type: "مجموعه‌ی محتوا", desc: "چارچوبی برای بنیان‌گذاران پرمشغله." },
  { title: "CRM بدون کدنویسی", type: "ابزار", desc: "قالبی برای آژانس‌های خدماتی." },
];

export const metadata: Metadata = {
    alternates: localeAlternates("/work", "fa"),
    title: "کارها و کسب‌وکارها | پروژه‌های فعال و آزمایش‌های گذشته",
    description:
        "نگاهی شفاف به کسب‌وکارهای فعال، پروژه‌های گذشته و آزمایش‌های در جریان؛ صادقانه درباره‌ی آنچه جواب داد و آنچه نداد.",
}

export default function WorkPage() {
  return (
    // ROOT: Warm Paper Background
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white">

      {/* Texture Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>



      <main className="relative z-10 px-6 md:px-12 max-w-5xl mx-auto py-16 md:py-24">

        {/* --- 1. HERO: THE LEDGER --- */}
        <section className="mb-20 max-w-3xl">
          <Badge variant="outline" className="mb-6 border-[#1B4B43]/30 text-[#1B4B43] rounded-sm font-mono tracking-widest text-[10px] uppercase px-2 py-1 bg-[#1B4B43]/5">
            دفتر کل
          </Badge>
          <h1 className="font-serif text-5xl md:text-6xl text-[#111827] leading-[1.1] mb-8">
            واقعاً روی چه چیزی <br />
            <span className="italic text-stone-500 font-light">کار می‌کنم</span>
          </h1>
          <div className="prose prose-stone text-lg md:text-xl text-stone-600 leading-relaxed font-light">
            <p>
اینجا ویترین جایزه نیست. هر گپ سر قهوه یا تماس مشاوره‌ای را «پروژه» حساب نمی‌کنم.
            </p>
            <p>
              این صفحه گزارش کسب‌وکارهای فعال، درس‌های گذشته و آزمایش‌هایی است که همین حالا در جریان‌اند.
              مدرکی است بر اینکه چیز واقعی می‌سازم، نه فقط درباره‌اش حرف می‌زنم.
            </p>
          </div>
        </section>

        {/* --- 2. ACTIVE VENTURES (Cards) --- */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10 border-b border-[#1B4B43]/10 pb-4">
            <h2 className="font-serif text-3xl text-[#111827]">کسب‌وکارهای فعال</h2>
            <span className="font-mono text-xs text-[#1B4B43] uppercase tracking-widest">/// تمرکز فعلی</span>
          </div>

          <div className="grid gap-8">
            {ACTIVE_VENTURES.map((venture) => (
              <div key={venture.id} className="group bg-white border border-stone-200 p-8 rounded-sm hover:border-[#1B4B43]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#1B4B43]/5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-[#1B4B43] uppercase tracking-wide bg-[#1B4B43]/5 px-2 py-1 rounded-sm">
                        {venture.role}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">{venture.year}</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#111827] group-hover:text-[#1B4B43] transition-colors">
                      {venture.name}
                    </h3>
                  </div>
                  <div className="shrink-0">
                    <Badge className="bg-[#1B4B43] text-white hover:bg-[#153e37] rounded-full px-3 font-normal tracking-wide">
                      {venture.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mb-6">
                  {venture.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-100">
                  <div className="flex gap-2">
                    {venture.tags.map(tag => (
                      <span key={tag} className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link href={venture.link} className="flex items-center text-sm font-bold text-[#1B4B43] hover:underline underline-offset-4">
                    مشاهده‌ی پروژه <ArrowUpRight className="ms-1 w-4 h-4 rtl:-scale-x-100" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 3. THE ARCHIVE (Past Projects) --- */}
        <section className="mb-24">
          <div className="flex items-end justify-between mb-10 border-b border-stone-200 pb-4">
            <h2 className="font-serif text-3xl text-stone-500">آرشیو منتخب</h2>
            <span className="font-mono text-xs text-stone-400 uppercase tracking-widest">/// درس‌های گرفته‌شده</span>
          </div>

          <div className="space-y-6">
            {PAST_PROJECTS.map((project) => (
              <div key={project.id} className="flex flex-col md:flex-row gap-6 md:items-start p-6 bg-[#F5F5F4]/50 border border-stone-100 rounded-sm hover:bg-[#F5F5F4] transition-colors">
                <div className="md:w-1/4">
                  <h4 className="font-bold text-[#111827] text-lg">{project.name}</h4>
                  <p className="text-xs text-stone-400 font-mono mt-1">{project.years}</p>
                  <p className="text-xs text-stone-500 mt-1">{project.role}</p>
                </div>
                <div className="md:w-3/4 grid md:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">نتیجه</span>
                    <p className="text-sm text-stone-700 mt-1 leading-relaxed">{project.outcome}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-[#1B4B43] tracking-wider">درس</span>
                    <p className="text-sm text-stone-700 mt-1 leading-relaxed italic border-s-2 border-[#1B4B43]/20 ps-3">
                      «{project.lesson}»
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 4. ADVISORY & MENTORING CONTEXT --- */}
        <section className="mb-24 bg-[#111827] text-stone-200 p-8 md:p-12 rounded-sm relative overflow-hidden">
          {/* Decoration */}
          <div className="absolute -end-10 -bottom-10 w-64 h-64 bg-[#1B4B43] rounded-full blur-[80px] opacity-20" />

          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <div className="p-3 bg-white/10 w-fit rounded-full mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-serif text-3xl text-white mb-4">کار مشاوره‌ای</h2>
              <p className="text-stone-400 text-sm">
تجربه‌ی پروژه‌هایم مستقیماً به منتورشیپم شکل می‌دهد. از روی کتاب درسی نصیحت نمی‌کنم؛ از داخل سنگر حرف می‌زنم.
              </p>
            </div>
            <div className="md:w-2/3 grid gap-6">
              <div className="border-s border-white/20 ps-6">
                <h4 className="font-bold text-white mb-1">استارتاپ ویزا و مهاجرت</h4>
                <p className="text-stone-400 text-sm">مشاوره به بنیان‌گذاران برای هم‌راستا کردن مدل کسب‌وکارشان با الزامات مهاجرتی. حرکت از «تراکشن ساختگی» به درآمد واقعی.</p>
              </div>
              <div className="border-s border-white/20 ps-6">
                <h4 className="font-bold text-white mb-1">نوسازی کسب‌وکارهای کوچک</h4>
                <p className="text-stone-400 text-sm">کمک به صاحبان سنتی کسب‌وکار تا بفهمند هوش مصنوعی جادو نیست، فقط راه بهتری برای اداره‌ی داده و عملیات است.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. THE LAB (Small Bets) --- */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical className="w-6 h-6 text-[#1B4B43]" />
            <h2 className="font-serif text-2xl text-[#111827]">آزمایش‌ها و شرط‌های کوچک</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {EXPERIMENTS.map((exp, idx) => (
              <div key={idx} className="bg-white border border-stone-200 p-6 rounded-sm border-t-4 border-t-stone-200 hover:border-t-[#1B4B43] transition-all group">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3 group-hover:text-[#1B4B43]">
                  {exp.type}
                </div>
                <h4 className="font-bold text-[#111827] mb-2">{exp.title}</h4>
                <p className="text-sm text-stone-600 leading-snug">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- 6. FOOTER CONNECT --- */}
        <section className="border-t border-[#1B4B43]/10 pt-10 pb-10 text-center">
          <p className="text-stone-600 font-light text-lg mb-6">
هرچه در این پروژه‌ها یاد می‌گیرم سر از یادداشت‌هایم درمی‌آورد.
          </p>
          {/* /essays has never existed in either locale — this was a 404.
              Points at the English blog until the Persian one is built,
              then becomes /fa/blog. */}
          <Link href="/blog">
            <Button variant="link" className="text-[#1B4B43] text-base font-bold underline decoration-2 underline-offset-4 hover:text-[#111827]">
              یادداشت‌ها را بخوانید
            </Button>
          </Link>
        </section>

      </main>
    </div>
  )
}