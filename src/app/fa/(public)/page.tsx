import React from 'react';
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  CheckCircle2, 
  Target, 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowUpRight, 
  TrendingUp, 
  Network, 
  ArrowDown, 
  Users 
} from "lucide-react";

export const metadata: Metadata = {
  title: "فرجاد | مشاور استراتژیک و طراح سیستم",
  description: "کمک به بنیان‌گذاران جدی برای ساخت کسب‌وکار مقیاس‌پذیر و سیستم‌سازی دیجیتال.",
};

export default function PersianHomePage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans selection:bg-[#1B4B43] selection:text-white" dir="rtl">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-10 opacity-50" />
        
        <div className="max-w-5xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B4B43] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1B4B43]"></span>
              </span>
              ظرفیت پذیرش محدود برای فصل جاری
            </div>

            <h1 className="font-serif text-6xl md:text-8xl font-bold text-[#111827] leading-[1.1] tracking-tight">
              معماری <span className="text-[#1B4B43]">نظم</span> در <br /> قلب آشفتگی.
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-600 leading-relaxed font-light mx-auto max-w-3xl">
              من به بنیان‌گذاران کمک می‌کنم تا فراتر از «تلاش سخت» بروند. 
              ما با <span className="text-[#111827] font-semibold border-b-2 border-[#1B4B43]/30">سیستم‌سازی دقیق</span> و استراتژی، موتور رشد کسب‌وکارتان را مهندسی می‌کنیم.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
              <Link href="/fa/contact" className="group">
                <Button className="bg-[#111827] hover:bg-[#1B4B43] text-white h-16 px-10 text-lg font-bold rounded-full transition-all duration-300 group-hover:scale-105">
                  شروع همکاری استراتژیک
                  <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </Button>
              </Link>
            </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION (بازطراحی شده مطابق تصویر) */}
      <section className="py-24 bg-white px-6 border-y border-stone-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          {/* بخش متنی (سمت راست در نسخه دسکتاپ - چپ در تصویر شما) */}
          <div className="space-y-8 order-2 md:order-1">
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#111827] leading-[1.1]">
              چرا اکثر بیزنس‌ها در <br />
              تله رشد متوقف می‌شوند؟
            </h2>
            
            <div className="space-y-6 text-xl text-stone-600 font-light leading-relaxed">
              <p>
                رشد بدون سیستم، فقط آشفتگی بزرگتری ایجاد می‌کند. وقتی ساختار نباشد، بنیان‌گذار تبدیل به گلوگاه (Bottleneck) می‌شود.
              </p>
              <p className="text-[#111827] font-bold italic border-r-4 border-[#1B4B43] pr-4">
                سخت‌تر کار کردن راه حل نیست؛ مهندسی مجدد راه حل است.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 pt-6">
               <ArrowDown className="w-8 h-8 text-[#1B4B43] animate-bounce" />
               <Button variant="ghost" className="text-[#111827] p-0 text-lg font-bold hover:bg-transparent group">
                 بیشتر بدانید (Learn More)
                 <div className="h-0.5 w-full bg-[#1B4B43] scale-x-0 group-hover:scale-x-100 transition-transform origin-right"></div>
               </Button>
            </div>
          </div>

          {/* بخش گرافیکی (سمت چپ در دسکتاپ - راست در تصویر شما) */}
          <div className="relative order-1 md:order-2 px-4">
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl shadow-stone-200/50 border border-stone-100 aspect-square relative bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]">
              
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* کارت فرآیندها */}
                <div className="bg-[#FDFCF8] rounded-3xl p-6 border border-stone-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <Network className="w-8 h-8 text-[#1B4B43]" />
                  <div>
                    <h4 className="font-bold text-[#111827]">فرآیندها</h4>
                    <p className="text-xs text-stone-500">سیستم‌سازی</p>
                  </div>
                </div>

                {/* کارت عملکرد (تصویر) */}
                <div className="bg-stone-200 rounded-3xl overflow-hidden relative group">
                  <div className="absolute inset-0 bg-[#1B4B43]/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src="/api/placeholder/400/400" alt="عملکرد" className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-[#111827] text-white text-[10px] px-2 py-1 rounded-md z-20">عملکرد</div>
                </div>

                {/* کارت عریض پایین */}
                <div className="col-span-2 bg-[#FDFCF8] rounded-3xl p-6 border border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-stone-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111827]">تیم‌سازی صحیح</h4>
                      <p className="text-xs text-stone-500">جریان داده شفاف</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* کارت‌های شناور */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-2xl border border-stone-100 w-56 rotate-[-2deg]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-stone-400">سود و هزینه‌ها</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="h-12 flex items-end gap-1">
                  <div className="flex-1 bg-stone-100 h-1/2 rounded-sm"></div>
                  <div className="flex-1 bg-stone-200 h-3/4 rounded-sm"></div>
                  <div className="flex-1 bg-[#1B4B43] h-full rounded-sm"></div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl border border-stone-100 max-w-[220px] rotate-[4deg]">
                <p className="text-[#111827] font-bold text-center text-sm leading-relaxed">
                  آشفتگی عملیاتی بزرگترین قاتل سودآوری است.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-32 bg-[#111827] px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <h2 className="font-serif text-5xl font-bold text-white">حوزه‌های تمرکز</h2>
              <p className="text-stone-400 text-xl font-light">خدماتی برای ساختن یک دارایی واقعی، نه فقط یک شغل.</p>
            </div>
            <div className="text-[#1B4B43] font-mono text-sm tracking-widest uppercase">Expertise / 01-03</div>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-stone-900/40 p-10 rounded-[2.5rem] border border-white/5 hover:border-[#1B4B43]/50 transition-all group">
              <Target className="w-10 h-10 text-[#1B4B43] mb-8" />
              <h3 className="text-3xl font-bold text-white mb-4">مشاوره استراتژیک اختصاصی</h3>
              <p className="text-stone-400 text-lg leading-relaxed max-w-xl">
                ما مدل کسب‌وکار شما را کالبدشکافی می‌کنیم تا گره‌های تصمیم‌گیری باز شوند. هدف ما طراحی نقشه راهی است که در دنیای واقعی کار کند.
              </p>
              <ArrowUpRight className="mt-10 text-stone-600 group-hover:text-white transition-colors" />
            </div>

            <div className="md:col-span-4 bg-[#1B4B43] p-10 rounded-[2.5rem] group hover:bg-[#1B4B43]/90 transition-all">
              <Zap className="w-10 h-10 text-white/50 mb-8" />
              <h3 className="text-3xl font-bold text-white mb-4">هوش مصنوعی و اتوماسیون</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                ادغام ابزارهای مدرن برای حذف کارهای تکراری و آزاد کردن زمان شما.
              </p>
            </div>

            <div className="md:col-span-4 bg-stone-50 p-10 rounded-[2.5rem] border border-stone-200">
               <ShieldCheck className="w-10 h-10 text-[#1B4B43] mb-8" />
               <h3 className="text-2xl font-bold text-[#111827] mb-4">استراتژی ویزا (کانادا)</h3>
               <p className="text-stone-600">تطبیق بیزنس با استانداردهای مارکت بین‌المللی.</p>
            </div>

            <div className="md:col-span-8 bg-stone-900/40 p-10 rounded-[2.5rem] border border-white/5 flex items-center justify-center">
                <p className="text-stone-500 font-serif italic text-2xl text-center">
                  "سیستم‌ها اجازه می‌دهند آدم‌های معمولی، نتایج غیرمعمولی خلق کنند."
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST SECTION */}
      <section className="py-32 bg-[#FDFCF8] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[4rem] p-8 md:p-20 shadow-sm border border-stone-100 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#1B4B43] rounded-[3rem] rotate-6 group-hover:rotate-3 transition-transform duration-500"></div>
                <div className="relative w-64 h-80 rounded-[3rem] overflow-hidden border-2 border-white shadow-2xl bg-stone-100">
                   <img src="/images/farjad.png" alt="Farjad" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                </div>
              </div>
              
              <div className="flex-1 space-y-8">
                <h2 className="font-serif text-4xl font-bold text-[#111827]">تجربه عملیاتی، <br />نه توصیه‌های تئوریک.</h2>
                <div className="grid gap-6">
                  {[
                    "بیش از یک دهه مهندسی ساختارهای بیزنسی",
                    "تجربه مستقیم در اکوسیستم استارتاپی کانادا و ایران",
                    "متمرکز بر بهینه‌سازی عملیات (Operations Optimization)"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 text-stone-700 text-lg">
                      <div className="w-6 h-6 rounded-full bg-[#1B4B43]/10 flex items-center justify-center text-[#1B4B43]">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="pb-32 pt-10 px-6">
        <div className="max-w-5xl mx-auto bg-[#1B4B43] rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-[#1B4B43]/20">
          <div className="relative z-10 space-y-10">
            <h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight">
              آماده‌اید بیزنس خود را <br /> دوباره مهندسی کنید؟
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/fa/contact">
                <Button className="bg-white text-[#1B4B43] hover:bg-stone-100 h-16 px-12 text-xl font-bold rounded-full shadow-xl transition-all hover:scale-105">
                  رزرو تایم استراتژی
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}