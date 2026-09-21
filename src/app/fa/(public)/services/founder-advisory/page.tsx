import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import React from "react";
import Link from "next/link";
import { ArrowLeft, Target, ShieldAlert, SplitSquareHorizontal, EyeOff, BrainCircuit, Columns, Filter, CheckCircle2, XCircle, LineChart, Network, ListOrdered, MoveRight, ActivitySquare } from "lucide-react";
import { ServiceCta } from "@/components/public/service-cta";

export const metadata: Metadata = {
    alternates: canonicalOnly("/fa/services/founder-advisory"),
    title: "مشاوره استراتژیک و اجرای صفر تا یک",
    description:
        "همراهی با بنیان‌گذاران از ایده‌ی مبهم تا محصولی که در واقعیت دوام می‌آورد: استراتژی، مسیر ورود به بازار و اجرا.",
}

export default function FounderAdvisoryPage() {
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
        
        {/* 1. HERO (The Shift) */}
        <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-6 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-stone-100 border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#D97706] font-bold mb-8">
            <Target className="w-3 h-3" />
            مشاوره‌ی استراتژیک بنیان‌گذار
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6rem] tracking-tight text-[#111827] leading-[1.05] max-w-5xl">
            مشکل شما <span className="italic text-[#D97706]">استراتژی بهتر</span> نیست. <br/>
            فکر شفاف‌تر لازم دارید.
          </h1>
          
          <div className="mt-10 text-xl md:text-2xl text-stone-500 font-light max-w-2xl leading-relaxed">
            <p className="font-medium text-[#111827]">
بنیان‌گذاران کمبود گزینه ندارند. زیر بار گزینه‌ها له شده‌اند.
            </p>
            <p className="mt-3 text-lg">
              بعد از کار با تیم‌های مرحله‌ی اولیه و مرحله‌ی رشد، یک الگو مدام تکرار می‌شود:
              مسئله به‌ندرت کمبود ایده است. ناتوانی در گرفتن تصمیم سخت زیر سایه‌ی ابهام است.
            </p>
          </div>
          
          <div className="mt-16 animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-stone-300 to-transparent mx-auto" />
          </div>
        </section>

        {/* 2. THE PROBLEM (Noise Disguised as Opportunity) */}
        <section className="py-24 bg-[#111827] text-white relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D97706] rounded-full blur-[150px] opacity-10 pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <ShieldAlert className="w-12 h-12 text-[#D97706] mb-6" />
              <h2 className="font-serif text-4xl leading-tight mb-6">
                نویزی که لباس <span className="text-[#D97706] italic">فرصت</span> پوشیده است.
              </h2>
              <p className="text-stone-400 font-light text-lg mb-8 leading-relaxed">
در مراحل اولیه همه‌چیز مهم به نظر می‌رسد: قابلیت تازه، بازار تازه، شراکت تازه، و هر هفته ایده‌ی تازه. مشکل نبودِ جهت نیست. <strong className="text-white">مشکل زیادی بودنِ جهت‌هاست.</strong>
              </p>
              
              <div className="p-6 border-s-2 border-[#D97706] bg-white/5 backdrop-blur-sm rounded-e-lg mb-8">
                <p className="text-xl font-serif text-white mb-2">
                  «نبود تمرکز یکی از اصلی‌ترین دلایل شکست استارتاپ‌هاست.»
                </p>
                <p className="text-sm font-sans text-stone-500 uppercase tracking-widest" dir="ltr">CB Insights</p>
              </div>

              <p className="text-stone-300">
بیشتر بنیان‌گذاران این را «نبود تمرکز» نمی‌بینند. این‌طور تجربه‌اش می‌کنند: <em className="text-[#A7F3D0]">«داریم گزینه‌ها را بررسی می‌کنیم... انعطاف داریم... نمی‌خواهیم فرصتی را از دست بدهیم.»</em> منطقی به نظر می‌رسد، تا وقتی که اجرا را می‌کشد.
              </p>
            </div>

            <div className="grid gap-6">
              {/* The Founder's Trap Bento */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-[#D97706]/50 transition-colors">
                 <div className="absolute -end-4 -bottom-4 opacity-10"><Network className="w-48 h-48" /></div>
                 <h3 className="text-[#D97706] uppercase tracking-widest text-xs font-bold mb-6">تله‌ی بنیان‌گذار</h3>
                 <p className="text-2xl font-serif text-white mb-4">شلوغی به‌جای شفافیت.</p>
                 <p className="text-stone-400 font-light leading-relaxed mb-6">
وقتی همه‌چیز مبهم می‌شود، بیشتر بنیان‌گذاران فعالیت را زیاد می‌کنند: جلسه‌ی بیشتر، طوفان فکری بیشتر، آزمایش بیشتر. ولی فعالیت پیشرفت نیست. اغلب فرار است.
                 </p>
                 <div className="pt-4 border-t border-white/10">
                   <p className="text-sm font-bold text-stone-300 uppercase tracking-wider mb-3">فرار از تصمیم‌های سختی مثل:</p>
                   <ul className="text-[#A7F3D0] space-y-2 opacity-80">
                     <li>← چه چیزی را <strong>نسازیم</strong></li>
                     <li>← سراغ چه کسی <strong>نرویم</strong></li>
                     <li>← کدام جهت را نادیده بگیریم</li>
                   </ul>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHAT STRATEGIC ADVISORY ACTUALLY MEANS (5 Focus Areas) */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
             <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-6">دقیقاً چه کاری می‌کنیم</h2>
             <p className="text-xl text-stone-500 font-light">
تعریف مبهم را کنار بگذاریم. مشاوره یعنی نصیحت کلی نیست، تماس انگیزشی نیست، و حرف‌های بلندپروازانه درباره‌ی «چشم‌انداز» هم نیست. <strong className="text-[#111827]">تفکر ساختارمند است که روی تصمیم‌های واقعی اعمال می‌شود.</strong>
             </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Problem Framing */}
            <div className="bg-white border-2 border-[#111827] rounded-3xl p-8 shadow-[6px_6px_0px_0px_#111827] hover:-translate-y-2 transition-transform duration-300">
               <SplitSquareHorizontal className="w-10 h-10 text-[#111827] mb-6" />
               <h3 className="font-serif text-2xl font-bold text-[#111827] mb-4">۱. قاب‌بندی مسئله</h3>
               <p className="text-stone-600 font-light mb-6">
بیشتر بنیان‌گذاران سراغ حل مسئله‌ی اشتباه می‌روند. قبل از استراتژی، این‌ها را تعریف می‌کنیم:
               </p>
               <ul className="space-y-3 text-sm font-medium text-stone-700">
                 <li className="flex gap-3"><span className="text-[#D97706]">✓</span> محدودیت واقعی چیست؟</li>
                 <li className="flex gap-3"><span className="text-[#D97706]">✓</span> همین حالا واقعاً چه چیزی مهم است؟</li>
                 <li className="flex gap-3"><span className="text-[#D97706]">✓</span> کدام نویز است و کدام سیگنال؟</li>
               </ul>
            </div>

            {/* 2. Decision Clarity */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
               <Filter className="w-10 h-10 text-stone-400 mb-6" />
               <h3 className="font-serif text-2xl font-bold text-[#111827] mb-4">۲. شفافیت تصمیم</h3>
               <p className="text-stone-600 font-light mb-6">
استراتژی یک سند نیست. زنجیره‌ای از تصمیم‌هاست. تمرکز ما روی این‌هاست:
               </p>
               <ul className="space-y-3 text-sm font-medium text-stone-700">
                 <li className="flex gap-3"><span className="text-stone-400">•</span> اولویت‌بندی</li>
                 <li className="flex gap-3"><span className="text-stone-400">•</span> بده‌بستان‌ها</li>
                 <li className="flex gap-3"><span className="text-stone-400">•</span> ترتیب اجرا</li>
               </ul>
               <div className="mt-6 pt-4 border-t border-stone-200">
                 <p className="text-xs font-bold text-[#D97706] uppercase tracking-wider">اگر همه‌چیز مهم باشد، هیچ‌چیز انجام نمی‌شود.</p>
               </div>
            </div>

            {/* 3. Stress-Testing */}
            <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300">
               <ActivitySquare className="w-10 h-10 text-stone-400 mb-6" />
               <h3 className="font-serif text-2xl font-bold text-[#111827] mb-4">۳. تست فشار</h3>
               <p className="text-stone-600 font-light mb-6">
ایده‌ها در خلأ خوب به نظر می‌رسند. زیر فشار می‌شکنند. آزمایششان می‌کنیم:
               </p>
               <ul className="space-y-3 text-sm font-medium text-stone-700">
                 <li className="flex gap-3"><span className="text-stone-400">•</span> فرض‌ها و منطق</li>
                 <li className="flex gap-3"><span className="text-stone-400">•</span> پتانسیل درآمد</li>
                 <li className="flex gap-3"><span className="text-stone-400">•</span> مقیاس‌پذیری و وابستگی‌ها</li>
               </ul>
               <div className="mt-6 pt-4 border-t border-stone-200">
                 <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">قبل از اینکه بازار این کار را برایتان بکند.</p>
               </div>
            </div>

            {/* 4. GTM Reality */}
            <div className="bg-[#1B4B43] border-2 border-[#1B4B43] rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(27,75,67,0.3)] hover:-translate-y-2 transition-transform duration-300 text-white md:col-span-2 lg:col-span-1">
               <LineChart className="w-10 h-10 text-[#34D399] mb-6" />
               <h3 className="font-serif text-2xl font-bold text-white mb-4">۴. محک واقعیت در ورود به بازار</h3>
               <p className="text-[#A7F3D0] font-light mb-6">
بنیان‌گذاران در ساختن شکست نمی‌خورند. در توزیع شکست می‌خورند. به این‌ها جواب می‌دهیم:
               </p>
               <ul className="space-y-3 text-sm font-medium text-stone-100">
                 <li className="flex gap-3"><span className="text-[#34D399]">←</span> واقعاً چه کسی می‌خرد؟</li>
                 <li className="flex gap-3"><span className="text-[#34D399]">←</span> چرا همین حالا؟</li>
                 <li className="flex gap-3"><span className="text-[#34D399]">←</span> از کدام کانال؟</li>
               </ul>
               <div className="mt-6 pt-4 border-t border-white/20">
                 <p className="text-xs font-medium text-stone-300 italic">نه در تئوری، در واقعیت.</p>
               </div>
            </div>

            {/* 5. Frameworks */}
            <div className="bg-[#D97706] border-2 border-[#D97706] rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(217,119,6,0.3)] hover:-translate-y-2 transition-transform duration-300 text-white md:col-span-2 lg:col-span-2">
               <ListOrdered className="w-10 h-10 text-[#FEF3C7] mb-6" />
               <h3 className="font-serif text-2xl font-bold text-white mb-4">۵. چارچوب‌های اولویت‌بندی</h3>
               <p className="text-[#FEF3C7] font-light mb-6">
اجرا از همین‌جا عوض می‌شود. چارچوب‌هایی ساده ولی سختگیر معرفی می‌کنیم تا روشن شود چه کاری الان انجام شود، چه کاری عقب بیفتد و چه کاری کنار گذاشته شود.
               </p>
               <div className="p-4 bg-white/10 rounded-xl">
                 <p className="text-lg font-serif">استراتژی به همان اندازه که درباره‌ی جهت است، درباره‌ی حذف کردن است.</p>
               </div>
            </div>
            
          </div>
        </section>

        {/* 4. THE ROLE OF THE ADVISOR (Glassmorphism & Contrast) */}
        <section className="py-32 bg-stone-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 relative z-10 items-center">
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#1B4B43] rounded-full blur-[100px] opacity-30 pointer-events-none" />
              
              <h2 className="font-serif text-4xl text-white mb-6 relative z-10">چرا به‌تنهایی از پسش برنمی‌آیید</h2>
              <p className="text-stone-300 text-lg font-light leading-relaxed mb-8 relative z-10">
چون بنیان‌گذار بیش از حد به مسئله نزدیک است. شما از نظر عاطفی درگیرید، ذهنتان پر است، و تصمیم‌های گذشته سوگیری ایجاد کرده‌اند.
              </p>
              
              <blockquote className="border-s-2 border-[#1B4B43] ps-6 py-2 mb-8 text-xl font-serif text-white relative z-10">
                «نگاه بیرونی با کم کردن سوگیری شناختی، کیفیت تصمیم را بالا می‌برد.»<br/>
                <span className="text-xs font-sans text-stone-500 uppercase tracking-widest mt-2 block" dir="ltr">MIT Sloan Management Review</span>
              </blockquote>
            </div>

            <div className="bg-[#111827] border-2 border-stone-800 rounded-3xl p-10 md:p-14 shadow-2xl">
                <BrainCircuit className="w-12 h-12 text-[#D97706] mb-8" />
                <h3 className="font-bold text-stone-400 uppercase tracking-widest text-xs mb-4">نقش مشاور</h3>
                <p className="text-3xl font-serif text-white leading-snug mb-8">
                  نه دادن جواب. <br/>
                  <span className="text-stone-500 line-through">نه آسان کردن فکر کردن.</span>
                </p>
                <div className="space-y-4">
                  {[
                    "به چالش کشیدن فرض‌های شما",
                    "شفاف کردن مسیر فکرتان",
                    "وادار کردن به تصمیم‌های سخت",
                    "کنار زدن توهم‌ها"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      <span className="text-lg text-stone-200">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-6 border-t border-stone-800">
                  <p className="text-xl font-bold text-[#D97706]">تیزتر کردن فکر کردن.</p>
                </div>
            </div>
            
          </div>
        </section>

        {/* 5. A REAL EXAMPLE (Before & After Slider Concept) */}
        <section className="py-24 bg-[#F5F5F4] border-y border-stone-200">
           <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
             <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827] text-white rounded-full text-[10px] uppercase tracking-widest mb-6">
                 یک مثال ساده
               </div>
               <h2 className="font-serif text-3xl md:text-5xl text-[#111827] mb-6">شفافیت در عمل</h2>
               <p className="text-stone-500 font-light text-lg mb-8">وقتی نویز را کنار بزنید و روی واقعیت‌های استراتژیک تمرکز کنید، چه چیزی عوض می‌شود.</p>
               
               <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6 relative overflow-hidden">
                  <div className="absolute start-0 top-0 bottom-0 w-1 bg-red-500" />
                  <h4 className="font-bold text-stone-800 mb-2">قبل: سردرگمی</h4>
                  <ul className="text-stone-500 text-sm space-y-2">
                    <li>• سه جهت محصولیِ متناقض</li>
                    <li>• دو بازار هدف متفاوت</li>
                    <li>• مدل درآمدی مبهم</li>
                    <li>• بحث دائمی، بدون اجرا</li>
                  </ul>
               </div>

             </div>

             <div className="space-y-6">
               <div className="bg-white p-8 rounded-3xl border-2 border-[#D97706] shadow-[8px_8px_0px_0px_rgba(217,119,6,0.1)]">
                  <h4 className="font-serif text-2xl text-[#111827] mb-4 flex items-center gap-3">
                    <Columns className="w-6 h-6 text-[#D97706]" /> کاری که می‌کنیم
                  </h4>
                  <ol className="text-stone-600 space-y-3 mb-6 relative z-10">
                    <li><strong>۱.</strong> تعریف محدودیت: زمان، منابع، واقعیت</li>
                    <li><strong>۲.</strong> حذف فوری جهت‌های ضعیف</li>
                    <li><strong>۳.</strong> تمرکز روی <strong>یک</strong> مسیر ورود به بازارِ کاملاً قابل‌اجرا</li>
                    <li><strong>۴.</strong> هم‌راستا کردن کل اجرا حول همان مسیر</li>
                  </ol>
                  
                  <div className="pt-6 border-t border-stone-100">
                    <h5 className="font-bold text-xs uppercase tracking-widest text-[#34D399] mb-3">نتیجه: تمرکز</h5>
                    <ul className="text-[#111827] font-medium space-y-2">
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399] rtl:rotate-180" /> سردرگمی کمتر</li>
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399] rtl:rotate-180" /> تصمیم‌های سریع‌تر</li>
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399] rtl:rotate-180" /> اجرای شفاف‌تر</li>
                    </ul>
                  </div>
               </div>
               <p className="text-center font-serif italic text-stone-500 text-lg">
                 «بنیان‌گذارها باهوش‌تر نمی‌شوند. قاطع می‌شوند.»
               </p>
             </div>
           </div>
        </section>

        {/* 6. AUDIENCE & EXCLUSION */}
        <section className="py-24 bg-white border-t border-stone-200">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-serif text-3xl text-[#111827] mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-[#1B4B43]" /> این کار برای چه کسی است
              </h2>
              <ul className="space-y-4">
                {[
                  "بنیان‌گذاران مرحله‌ی اولیه که گزینه‌هایشان زیادی زیاد است",
                  "تیم‌هایی که در حلقه‌های بی‌پایان تصمیم‌گیری گیر کرده‌اند",
                  "بنیان‌گذارانی که جدی خود را برای رشد یا جذب سرمایه آماده می‌کنند",
                  "کسانی که حس می‌کنند «مشغولیم ولی جلو نمی‌رویم»"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-center p-4 bg-[#FDFCF8] border border-stone-200 rounded-xl shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[#1B4B43]" /> 
                    <span className="text-stone-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
               <h2 className="font-serif text-3xl text-stone-400 mb-6 flex items-center gap-3">
                <XCircle className="w-8 h-8 text-stone-300" /> این کار برای چه کسی نیست
              </h2>
               <ul className="space-y-4 opacity-70 mb-8">
                {[
                  "کسانی که دنبال تأیید هستند، نه چالش",
                  "بنیان‌گذارانی که حاضر به بده‌بستان سخت نیستند",
                  "تیم‌هایی که منتظرند جواب آماده کف دستشان گذاشته شود"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-center p-4 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="text-stone-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="p-4 border-s-4 border-[#D97706] bg-amber-50 rounded-e-lg">
                <p className="text-stone-800 font-bold text-sm uppercase tracking-widest mb-1">پیش‌نیازها:</p>
                <p className="text-[#D97706] font-serif text-xl italic">صداقت، نظم، اجرا.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. REALITY CHECK & CONCLUSION */}
        <section className="py-32 bg-[#111827] text-white text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[#0d121c] opacity-50 z-0 mix-blend-multiply transition-opacity pointer-events-none" />
           <div className="relative z-10 max-w-4xl mx-auto px-6">
             <h2 className="font-serif text-4xl md:text-5xl mb-12 text-stone-300">یک تشخیص ساده</h2>
             
             <div className="grid sm:grid-cols-2 gap-4 mb-16 text-start">
                {[
                  "می‌توانید اولویت سی روز آینده‌تان را شفاف توضیح دهید؟",
                  "دقیقاً می‌دانید چه کاری را انجام نمی‌دهید؟",
                  "مدل کسب‌وکارتان تست فشار شده یا فقط فرض شده؟",
                  "تصمیم‌هایتان واکنشی است یا آگاهانه؟"
                ].map((q, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                    <p className="font-medium text-white">{q}</p>
                  </div>
                ))}
             </div>

             <div className="space-y-6">
                <p className="text-2xl font-light text-stone-400 mb-2">اگر این جواب‌ها روشن نیست، مشکل شما استراتژی نیست.</p>
                <p className="font-serif text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-[#D97706]">
                  مشکل شما شفافیت است.
                </p>
                <div className="max-w-2xl mx-auto pt-16 mt-16 border-t border-white/10">
                  <p className="text-lg font-light italic opacity-80 mb-6">
                    «بنیان‌گذارانی که جلو می‌روند بهترین ایده را ندارند. کسانی‌اند که تصمیم روشن می‌گیرند و پایش می‌ایستند.»
                  </p>
                  <p className="text-2xl font-serif text-[#D97706]">استراتژی یعنی بیشتر دانستن نیست.<br/> یعنی بهتر انتخاب کردن.</p>
                </div>
             </div>
           </div>
        </section>

        {/* 8. CTA */}
        <ServiceCta locale="fa" />
        
      </div>
    </div>
  );
}
