import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, ShieldAlert, Landmark, FileX, Presentation, Users, BriefcaseBusiness, Route, CheckCircle2, Target, UsersRound, XCircle, SearchIcon, Crosshair } from "lucide-react";
import { ServiceCta } from "@/components/public/service-cta";

export const metadata: Metadata = {
    alternates: canonicalOnly("/fa/services/startup-visa"),
    title: "استراتژی استارتاپ ویزای کانادا",
    description:
        "آماده‌سازی کسب‌وکار برای برنامه‌ی استارتاپ ویزای کانادا: منطق کسب‌وکار، شواهد بازار و روایتی که زیر سؤال دوام می‌آورد.",
}

export default function StartupVisaPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans overflow-x-hidden selection:bg-[#D97706] selection:text-white">
      {/* Background Assets */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: "linear-gradient(#E7E5E4 1px, transparent 1px), linear-gradient(to right, #E7E5E4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Navigation */}
      <div className="absolute top-8 start-6 md:start-12 z-50">
        <Link href="/fa/services" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-stone-200 rounded-full text-stone-600 hover:text-[#D97706] hover:bg-white transition-all font-medium text-sm shadow-sm">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          بازگشت به خدمات
        </Link>
      </div>

      <div className="relative z-10 w-full">
        
        {/* 1. HERO (The Harsh Truth) */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6 pt-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-100 border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#D97706] font-bold mb-8 relative z-10">
            <Compass className="w-3 h-3" />
            استراتژی استارتاپ ویزا
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight text-[#111827] leading-[1.05] max-w-5xl relative z-10">
            چرا بیشتر پرونده‌های استارتاپ ویزا <br/>
            <span className="italic text-red-600/90 underline decoration-red-200 underline-offset-8">قبل از شروع شکست می‌خورند</span>
          </h1>
          
          <div className="mt-10 text-xl md:text-2xl text-stone-500 font-light max-w-3xl leading-relaxed relative z-10">
            <p className="font-medium text-[#111827]">
بیشتر آدم‌ها فکر می‌کنند استارتاپ ویزای کانادا یعنی کاغذبازی. این‌طور نیست.
            </p>
            <p className="mt-3 text-lg">
              موضوع ساختن بیزینس‌کیسی است که زیر ذره‌بین دوام بیاورد.
              افسر مهاجرت فرم را رد نمی‌کند. کسب‌وکار ضعیف را رد می‌کند.
            </p>
          </div>
          
          <div className="mt-16 animate-pulse relative z-10">
            <div className="w-px h-16 bg-gradient-to-b from-stone-300 to-transparent mx-auto" />
          </div>
        </section>

        {/* 2. THE BIGGEST MISCONCEPTION */}
        <section className="py-24 bg-[#111827] text-white relative">
          <div className="max-w-6xl mx-auto px-6 md:px-12 grid lg:grid-cols-5 gap-16 items-center">
            
            <div className="lg:col-span-3">
              <ShieldAlert className="w-12 h-12 text-[#D97706] mb-6" />
              <h2 className="font-serif text-4xl leading-tight mb-8">
                این برنامه برای «فقط وارد شدن» طراحی نشده است.
              </h2>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                {["سرمایه‌گذار منفعل", "استارتاپ قالبی", "مدل کسب‌وکار کپی‌شده"].map((item, i) => (
                  <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <XCircle className="w-6 h-6 text-red-400 mb-2" />
                    <span className="text-sm font-medium text-stone-300">نه برای {item}</span>
                  </div>
                ))}
              </div>

              <div className="p-6 border-s-2 border-[#D97706] bg-white/5 backdrop-blur-sm rounded-e-lg">
                <p className="text-lg font-serif text-white mb-2 leading-relaxed">
                  «برنامه‌ی استارتاپ ویزا کسب‌وکارهای نوآور و مقیاس‌پذیری را هدف گرفته که بتوانند در سطح جهانی رقابت کنند.»
                </p>
                <p className="text-sm font-sans text-stone-500 uppercase tracking-widest">دولت کانادا (IRCC)</p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-serif text-2xl text-stone-300 mb-4 border-b border-stone-800 pb-4">واقعیت متقاضی در برابر انتظار IRCC</h3>
              <div className="bg-[#1a2332] border border-stone-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 start-0 w-2 h-full bg-stone-700" />
                <p className="text-stone-400 text-sm uppercase tracking-wider mb-2 font-bold">متقاضی‌ها چه می‌کنند:</p>
                <p className="text-xl text-stone-300 italic mb-4">«یک ایده لازم دارم... یک انکوباتور لازم دارم... مدارک لازم دارم.»</p>
                <div className="flex gap-2">
                  <span className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded">کلیشه‌ای</span>
                  <span className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded">محلی</span>
                  <span className="bg-stone-800 text-stone-400 text-xs px-2 py-1 rounded">اجرای ضعیف</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 3. WHY APPLICATIONS GET REJECTED (The 5 Failures Grid) */}
        <section className="py-24 bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="font-serif text-4xl text-[#111827] mb-4">چرا پرونده‌ها رد می‌شوند</h2>
              <p className="text-xl text-stone-500 font-light">
بر پایه‌ی الگوهای واقعی، نه تئوری. فیلتر دقیقاً همین‌جا شما را می‌گیرد.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "منطق ضعیف کسب‌وکار", desc: "ایده‌هایی که خوب به گوش می‌رسند ولی جلوی ساده‌ترین سؤال دوام نمی‌آورند.", icon: FileX },
                { title: "ناآشنایی با بازار", desc: "جواب روشنی برای «مشتری کیست؟» و «چرا باید عوض کند؟» وجود ندارد.", icon: SearchIcon },
                { title: "پیچ‌دک بیش از حد صیقلی", desc: "اسلایدهایی که از نظر بصری بی‌نقص‌اند و از نظر استراتژیک کاملاً خالی.", icon: Presentation },
                { title: "انتخاب اشتباه انکوباتور", desc: "بنیان‌گذارانی که کورکورانه به سازمان‌های نامرتبط درخواست می‌دهند.", icon: Landmark },
                { title: "شکاف اعتبار", desc: "هیچ ارتباط منطقی‌ای میان پیشینه‌ی بنیان‌گذار و ایده‌ی جدید وجود ندارد.", icon: Users }
              ].map((item, i) => (
                <div key={i} className="bg-[#FDFCF8] border border-stone-200 rounded-3xl p-8 hover:border-red-200 transition-colors group">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-6 group-hover:bg-red-50 group-hover:text-red-600 text-stone-500 transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#111827] mb-3">{item.title}</h3>
                  <p className="text-stone-600 font-light text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. THE HIDDEN REALITY (The Process Flip) */}
        <section className="py-24 bg-[#F5F5F4] border-b border-stone-200">
           <div className="max-w-5xl mx-auto px-6 text-center">
              <h2 className="font-serif text-3xl md:text-5xl text-[#111827] mb-12">واقعیت پنهان استارتاپ ویزا</h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                 
                 {/* The Myth */}
                 <div className="w-full md:w-1/2 bg-white border border-stone-200 p-8 rounded-3xl opacity-60">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-6">افسانه (تصور رایج از روند کار)</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-500">۱. پیچ‌دک بساز</div>
                      <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-500">۲. به انکوباتور درخواست بده</div>
                      <div className="p-3 bg-stone-50 border border-stone-100 rounded-xl text-stone-500">۳. تأیید بگیر</div>
                    </div>
                 </div>

                 {/* The Reality */}
                 <div className="w-full md:w-1/2 bg-white border-2 border-[#1B4B43] p-8 rounded-3xl shadow-xl relative top-0 md:-top-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#1B4B43] mb-6">واقعیت</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-[#1B4B43]/5 border border-[#1B4B43]/20 rounded-xl text-[#111827] font-medium flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#1B4B43]" /> ۱. اعتبارسنجی منطق کسب‌وکار</div>
                      <div className="p-3 bg-[#1B4B43]/5 border border-[#1B4B43]/20 rounded-xl text-[#111827] font-medium flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#1B4B43]" /> ۲. هم‌راستا شدن با انکوباتور <strong>درست</strong></div>
                      <div className="p-3 bg-[#1B4B43]/5 border border-[#1B4B43]/20 rounded-xl text-[#111827] font-medium flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#1B4B43]" /> ۳. عبور از ارزیابی <strong>واقعی</strong></div>
                      <div className="p-3 bg-[#1B4B43]/5 border border-[#1B4B43]/20 rounded-xl text-[#111827] font-medium flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-[#1B4B43]" /> ۴. و بعد حرکت به جلو</div>
                    </div>
                 </div>

              </div>

              <div className="mt-16 inline-block bg-[#111827] text-white px-8 py-4 rounded-xl font-serif text-2xl shadow-lg">
کار اصلی <span className="text-[#D97706]">قبل از</span> درخواست انجام می‌شود.
              </div>
           </div>
        </section>

        {/* 5. THE STRATEGY DESIGN (Our 5 Steps) */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
             <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-6">دقیقاً چه کاری می‌کنیم</h2>
             <p className="text-xl text-stone-500 font-light">
این آماده‌سازی مدارک نیست. این <strong className="text-[#111827]">طراحی استراتژی پیش از تأیید</strong> است.
             </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 hover:border-[#D97706] transition-colors group">
               <div className="w-16 h-16 shrink-0 bg-stone-100 group-hover:bg-[#D97706]/10 rounded-2xl flex items-center justify-center transition-colors">
                 <Target className="w-8 h-8 text-stone-400 group-hover:text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-[#111827] mb-3">۱. اعتبارسنجی ایده در برابر معیارهای SUV</h3>
                 <p className="text-stone-600 font-light mb-4">
سطح نوآوری، ظرفیت مقیاس‌پذیری و ارتباط با بازار جهانی را می‌سنجیم. نه بر اساس نظر ما، بر اساس چیزی که انکوباتورها واقعاً می‌پذیرند.
                 </p>
               </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 hover:border-[#D97706] transition-colors group">
               <div className="w-16 h-16 shrink-0 bg-stone-100 group-hover:bg-[#D97706]/10 rounded-2xl flex items-center justify-center transition-colors">
                 <UsersRound className="w-8 h-8 text-stone-400 group-hover:text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-[#111827] mb-3">۲. تناسب بنیان‌گذار با استارتاپ</h3>
                 <p className="text-stone-600 font-light mb-4">
یکی از نادیده‌گرفته‌شده‌ترین عامل‌ها. می‌پرسیم: چرا <strong>شما</strong> برای <strong>این</strong> کسب‌وکار؟ آیا پیشینه‌تان پشتیبان این ایده است؟ ناهم‌خوانی سریع‌ترین راه رد شدن است.
                 </p>
               </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 bg-[#111827] p-6 md:p-8 rounded-3xl border-2 border-[#111827] shadow-[6px_6px_0px_0px_#D97706] text-white">
               <div className="w-16 h-16 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center">
                 <Crosshair className="w-8 h-8 text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-white mb-3">۳. استراتژی هدف‌گیری انکوباتور</h3>
                 <p className="text-stone-300 font-light mb-4">
سازمان‌های تعیین‌شده مثل هم نیستند. بر اساس تمرکز صنعتی، تحمل ریسک و سبک ارزیابی تطبیق می‌دهیم. درخواست کورکورانه شانس شما را صفر می‌کند.
                 </p>
               </div>
            </div>

             {/* Step 4 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 hover:border-[#D97706] transition-colors group">
               <div className="w-16 h-16 shrink-0 bg-stone-100 group-hover:bg-[#D97706]/10 rounded-2xl flex items-center justify-center transition-colors">
                 <BriefcaseBusiness className="w-8 h-8 text-stone-400 group-hover:text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-[#111827] mb-3">۴. ساختاردهی بیزینس‌کیس</h3>
                 <p className="text-stone-600 font-light mb-4">
جایی که بیشترشان می‌بازند. منطق روشن مسئله و راه‌حل، جایگاه واقع‌گرایانه در بازار و روایت رشدی باورپذیر می‌سازیم. بدون واژه‌های پرطمطراق و ادعای بادکرده.
                 </p>
               </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 hover:border-[#D97706] transition-colors group">
               <div className="w-16 h-16 shrink-0 bg-stone-100 group-hover:bg-[#D97706]/10 rounded-2xl flex items-center justify-center transition-colors">
                 <Presentation className="w-8 h-8 text-stone-400 group-hover:text-[#D97706]" />
               </div>
               <div>
                 <h3 className="font-serif text-2xl font-bold text-[#111827] mb-3">۵. آماده‌سازی مصاحبه</h3>
                 <p className="text-stone-600 font-light mb-4">
جلب توجه یک چیز است و عبور از ارزیابی چیز دیگر. شما را برای سؤال‌های سخت، شکاف‌های منطقی و فشار لحظه‌ای آماده می‌کنیم.
                 </p>
               </div>
            </div>

          </div>
        </section>

        {/* 6. WHAT MAKES THIS DIFFERENT (The Differentiation Moat) */}
        <section className="py-24 bg-[#111827] text-white">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl mb-6">کاملاً روشن بگویم.</h2>
              <p className="text-stone-400 text-lg mb-8">این مشاوره‌ی مهاجرت نیست. مشاوره‌ی حقوقی نیست. خدمات تنظیم و ارسال مدارک هم نیست.</p>
              
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border-s-4 border-[#34D399]">
                <p className="text-2xl font-bold text-[#34D399] mb-2">این استراتژی کسب‌وکار است</p>
                <p className="text-stone-200">که اختصاصاً برای استاندارد پرریسک فضای مهاجرت طراحی شده است.</p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border border-white/10 rounded-xl p-4 bg-white/5"><span className="text-[#34D399]">✓</span> منطق محکم‌تر</div>
                <div className="border border-white/10 rounded-xl p-4 bg-white/5"><span className="text-[#34D399]">✓</span> احتمال بالاتر</div>
                <div className="border border-white/10 rounded-xl p-4 bg-white/5 md:col-span-2"><span className="text-[#34D399]">✓</span> جایگاه جهانی باورپذیر</div>
              </div>
            </div>

            {/* REAL PATTERNS */}
            <div className="space-y-4">
              <h3 className="font-bold text-stone-500 uppercase tracking-widest text-xs mb-4">الگوهایی که واقعاً می‌بینیم</h3>
              
              <div className="bg-white p-5 rounded-2xl text-[#111827]">
                <p className="font-bold border-b border-stone-100 pb-2 mb-2">مورد ۱: بدون ایده</p>
                <p className="text-sm text-stone-600 mb-2">«هر استارتاپی» می‌خواهند تا اقامت بگیرند.</p>
                <p className="text-xs font-bold text-red-600 uppercase">← رویکرد غلط. رد می‌شود.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl text-[#111827]">
                <p className="font-bold border-b border-stone-100 pb-2 mb-2">مورد ۲: ایده‌ی ضعیف</p>
                <p className="text-sm text-stone-600 mb-2">چیزی دارند، ولی مقیاس‌پذیر نیست.</p>
                <p className="text-xs font-bold text-[#D97706] uppercase">← بازسازی اساسی لازم دارد.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl text-[#111827] border-2 border-[#1B4B43]">
                <p className="font-bold border-b border-stone-100 pb-2 mb-2 flex items-center justify-between">
                  مورد ۳: ایده‌ی قوی <span className="text-[10px] bg-[#1B4B43] text-white px-2 py-0.5 rounded-full">پرتکرار</span>
                </p>
                <p className="text-sm text-stone-600 mb-2">پایه‌ی خوبی دارد، ولی ارائه و جایگاه‌سازی‌اش افتضاح است.</p>
                <p className="text-xs font-bold text-[#1B4B43] uppercase">← به شفافیت، تمرکز و هم‌راستایی نیاز دارد.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. AUDIENCE & EXCLUSION */}
        <section className="py-24 bg-white border-b border-stone-200 text-center">
          <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12 text-start">
            <div>
              <h2 className="font-serif text-3xl text-[#111827] mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-[#1B4B43]" /> این کار برای چه کسی است
              </h2>
              <ul className="space-y-4 text-stone-700">
                <li className="flex gap-3"><span className="text-[#1B4B43]">✓</span> بنیان‌گذارانی که جدی دنبال ساختن استارتاپ واقعی‌اند</li>
                <li className="flex gap-3"><span className="text-[#1B4B43]">✓</span> متقاضیانی که SUV را ورود به کسب‌وکار می‌بینند</li>
                <li className="flex gap-3"><span className="text-[#1B4B43]">✓</span> تیم‌هایی که خود را برای ارزیابی عمیق انکوباتور آماده می‌کنند</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-3xl text-stone-400 mb-6 flex items-center gap-3">
                <XCircle className="w-8 h-8 text-stone-300" /> این کار برای چه کسی نیست
              </h2>
              <ul className="space-y-4 text-stone-500 line-through decoration-stone-300/50">
                <li>کسانی که دنبال میان‌بر برای اقامت هستند</li>
                <li>کسانی که پرونده‌ی «قالبی» می‌خواهند</li>
                <li>سرمایه‌گذاران منفعل بدون هیچ درگیری</li>
              </ul>
              <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-lg">
                <p className="text-sm font-semibold text-stone-700">برنامه‌ی استارتاپ ویزا برای میان‌بر طراحی نشده است.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. REALITY CHECK & CONCLUSION */}
        <section className="py-32 bg-[#F5F5F4] text-center px-6">
           <div className="max-w-4xl mx-auto">
             <h2 className="font-serif text-4xl mb-12 text-[#111827]">یک محک ساده‌ی واقعیت</h2>
             
             <div className="grid sm:grid-cols-2 gap-4 mb-16 text-start">
                {[
                  "ایده‌ام واقعاً مقیاس‌پذیر است یا فقط در سطح محلی «خوب» است؟",
                  "می‌توانم زیر فشار سخت از منطق کسب‌وکارم دفاع کنم؟",
                  "بازار هدف جهانی‌ام را شفاف می‌شناسم؟",
                  "دارم شرکت می‌سازم یا فقط یک پرونده؟"
                ].map((q, i) => (
                  <div key={i} className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm text-stone-700 font-medium">
                    {q}
                  </div>
                ))}
             </div>

             <div className="max-w-2xl mx-auto border-t border-stone-300 pt-16">
               <p className="text-xl font-light text-stone-500 mb-6">اگر این جواب‌ها روشن نیست، احتمال رد شدن سریع پرونده‌تان بالاست.</p>
               
               <p className="font-serif text-4xl text-[#111827] italic leading-relaxed mb-6">
                 «آدم‌های زیادی را دیده‌ام که با این برنامه مثل یک معامله برخورد می‌کنند. معامله نیست. فیلتر است.»
               </p>
               <p className="text-2xl font-bold text-red-600 bg-red-50 inline-block px-6 py-2 rounded-xl">
دارید چیز واقعی می‌سازید، یا فقط می‌خواهید رد شوید؟
               </p>
             </div>
           </div>
        </section>

        {/* 9. CTA */}
        <ServiceCta locale="fa" />
        
      </div>
    </div>
  );
}
