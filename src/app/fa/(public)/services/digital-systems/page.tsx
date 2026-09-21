import type { Metadata } from "next"
import { canonicalOnly } from "@/lib/seo"
import React from "react";
import Link from "next/link";
import { ArrowLeft, Box, Network, Orbit, RefreshCw, TriangleAlert, BrainCircuit, ShieldAlert, CheckCircle2, XCircle, ActivitySquare, SplitSquareHorizontal, MoveRight, Copy } from "lucide-react";
import { ServiceCta } from "@/components/public/service-cta";

export const metadata: Metadata = {
    alternates: canonicalOnly("/fa/services/digital-systems"),
    title: "سیستم‌های دیجیتال و هوش مصنوعی سفارشی",
    description:
        "جایگزینی کارهای دستی، داده پراکنده و فرایندهای تکراری با سیستم‌هایی که خودشان کار می‌کنند.",
}

export default function DigitalSystemsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans overflow-x-hidden selection:bg-[#1B4B43] selection:text-white">
      {/* Background Assets */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(#E7E5E4 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      ></div>
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Navigation */}
      <div className="absolute top-8 start-6 md:start-12 z-50">
        <Link href="/fa/services" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-stone-200 rounded-full text-stone-600 hover:text-[#1B4B43] hover:bg-white transition-all font-medium text-sm shadow-sm">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          بازگشت به خدمات
        </Link>
      </div>

      <div className="relative z-10 w-full">
        
        {/* 1. THE STATEMENT (HERO) */}
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-8 overflow-hidden group">
            <span className="w-2 h-2 rounded-full bg-[#1B4B43] group-hover:animate-pulse" />
            سیستم‌های دیجیتال و هوش مصنوعی
          </div>
          
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[7rem] text-[#111827] tracking-tighter leading-[0.9] max-w-5xl">
            سردرگمی را نمی‌شود <br />
            <span className="text-[#D97706] italic">خودکار</span> کرد.
          </h1>
          
          <div className="mt-12 text-xl md:text-2xl text-stone-500 font-light max-w-2xl leading-relaxed space-y-4">
            <p className="font-medium text-[#111827]">
              مشکل بیشتر کسب‌وکارها امروز فناوری نیست.<br />
              مشکلشان شفافیت است.
            </p>
            <p className="text-lg">
می‌پرند وسط خودکارسازی. با هوش مصنوعی ور می‌روند. اشتراک ابزار می‌خرند. و باز هیچ‌چیز از بنیان بهتر نمی‌شود. کار آشفته می‌ماند، تیم زیر بار له است و تصمیم‌ها کند.
            </p>
          </div>
          
          <div className="mt-16 animate-bounce">
            <div className="w-px h-16 bg-gradient-to-b from-stone-300 to-transparent mx-auto" />
          </div>
        </section>

        {/* 2. THE ILLUSION (Dark / Warning) */}
        <section className="py-32 bg-[#111827] text-white relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <ShieldAlert className="w-12 h-12 text-[#D97706]" />
               <h2 className="font-serif text-4xl md:text-5xl leading-tight">
                 توهم «تحول دیجیتال»
               </h2>
               <p className="text-stone-400 text-lg leading-relaxed font-light">
«تحول دیجیتال» عبارتی است که آن‌قدر تکرار شده که معنایش را از دست داده. در عمل معمولاً یعنی ابزار بیشتر، داشبورد بیشتر و قابلیت هوش مصنوعی بیشتر، به‌علاوه‌ی استخدام کسی که «خودکارسازی را انجام دهد».
               </p>
               <div className="p-6 border-s-2 border-red-500 bg-white/5 backdrop-blur-sm rounded-e-lg">
                 <p className="text-xl font-serif text-white mb-2">
                   «بیش از ۷۰ درصد طرح‌های تحول دیجیتال شکست می‌خورند.»
                 </p>
                 <p className="text-sm font-sans text-stone-500 uppercase tracking-widest" dir="ltr">McKinsey, 2018–2022</p>
               </div>
               <p className="text-xl text-stone-300">
چرا؟ <strong className="text-red-400">چون شرکت‌ها به‌جای بازطراحی شکل واقعی انجام کار، آشوب موجود را دیجیتال می‌کنند.</strong>
               </p>
            </div>
            
            <div className="grid gap-6">
               {/* Think vs Actually Need Bento */}
               <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm group hover:border-white/20 transition-all">
                  <h3 className="text-stone-500 uppercase tracking-widest text-xs font-bold mb-6">کسب‌وکارها فکر می‌کنند به چه نیاز دارند</h3>
                  <ul className="space-y-4">
                    {["خودکارسازی لازم داریم", "هوش مصنوعی لازم داریم", "ابزار بهتر لازم داریم"].map((t, i) => (
                      <li key={i} className="flex gap-4 items-center text-stone-300 line-through decoration-red-500/50">
                        <XCircle className="w-5 h-5 text-red-500/50" /> {t}
                      </li>
                    ))}
                  </ul>
               </div>

               <div className="bg-[#1B4B43]/20 border border-[#1B4B43]/40 p-8 rounded-3xl backdrop-blur-sm shadow-[0_0_40px_rgba(27,75,67,0.2)]">
                  <h3 className="text-[#34D399] uppercase tracking-widest text-xs font-bold mb-6">واقعاً به چه نیاز دارند</h3>
                  <ul className="space-y-4">
                    {["گردش‌کار شفاف", "مسئولیت‌های تعریف‌شده", "جریان داده‌ی ساختارمند", "تفکر در سطح سیستم"].map((t, i) => (
                      <li key={i} className="flex gap-4 items-center text-white font-medium">
                        <CheckCircle2 className="w-5 h-5 text-[#34D399]" /> {t}
                      </li>
                    ))}
                  </ul>
               </div>
               <p className="text-center text-stone-400 text-sm mt-2 italic font-serif">بدون این پایه، هر ابزار تازه یک لایه‌ی پیچیدگی تازه است.</p>
            </div>
          </div>
        </section>

        {/* 3. THE REAL PROBLEM (Visual Fragmenting) */}
        <section className="py-32 px-6 md:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-6">عملیات تکه‌تکه</h2>
            <p className="text-xl text-stone-500 font-light">
در بیشتر کسب‌وکارهای کوچک و متوسط و استارتاپ‌ها، عملیات خودرو رشد می‌کند. فروش یک سیستم دارد، بازاریابی یکی دیگر، و عملیات روی صفحه‌گسترده می‌چرخد. <em className="text-[#1B4B43]">بنیان‌گذار همه را دستی به هم وصل می‌کند.</em>
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-16">
            {[
              { title: "کار تکراری", icon: Copy },
              { title: "داده‌ی ناسازگار", icon: Network },
              { title: "شکاف ارتباطی", icon: SplitSquareHorizontal },
              { title: "تأخیر در تصمیم", icon: Orbit },
            ].map((step, i) => (
              <div key={i} className="p-8 flex flex-col justify-between rounded-3xl bg-white border border-stone-200 text-stone-800 shadow-sm hover:-translate-y-1 transition-transform">
                <step.icon className="w-8 h-8 text-stone-300 mb-6" />
                <h3 className="font-serif text-xl font-medium">{step.title}</h3>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-[#F5F5F4] p-8 md:p-12 rounded-3xl border border-stone-200 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-300/20 rounded-full blur-3xl" />
            <h3 className="font-serif text-3xl md:text-4xl text-[#111827] leading-tight mb-4">
کارکنان تا ۶۰ درصد وقتشان را صرف «کار درباره‌ی کار» می‌کنند
            </h3>
            <p className="text-stone-500 uppercase tracking-widest text-xs mb-8" dir="ltr">Harvard Business Review, 2019</p>
            <p className="text-xl font-bold text-[#D97706]">این ناکارآمدی نیست. شکست ساختاری است.</p>
          </div>
        </section>

        {/* 4. THE AI REALITY CHECK (Glassmorphism Bento) */}
        <section className="py-32 bg-stone-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 relative z-10">
            
            {/* Left AI Logic */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14 backdrop-blur-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#D97706] rounded-full blur-[120px] opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none" />
              
              <BrainCircuit className="w-12 h-12 text-[#D97706] mb-8 relative z-10" />
              <h2 className="font-serif text-4xl text-white mb-6 relative z-10">چرا هوش مصنوعی در بیشتر کسب‌وکارها شکست می‌خورد</h2>
              
              <div className="space-y-6 text-stone-300 text-lg font-light leading-relaxed relative z-10">
                <p>هوش مصنوعی قدرتمند است. مشکل این نیست. مشکل این است که کجا و چطور به کار گرفته می‌شود.</p>
                <blockquote className="border-s-2 border-[#D97706] ps-6 py-2 my-8 text-xl font-serif text-white">
                  «۸۰ درصد پروژه‌های هوش مصنوعی بازگشت سرمایه‌ی معناداری تحویل نمی‌دهند.»<br/>
                  <span className="text-xs font-sans text-stone-500 uppercase tracking-widest mt-2 block" dir="ltr">Gartner AI Adoption Report, 2023</span>
                </blockquote>
                <p>نه به این دلیل که مدل‌ها ضعیف‌اند. به این دلیل که کسب‌وکارها هوش مصنوعی را بدون گردش‌کار ساختارمند به کار می‌گیرند، داده‌ی تمیز ندارند، و انتظار دارند هوش مصنوعی جای فکر کردن را بگیرد.</p>
              </div>
            </div>

            {/* Right Approach comparison */}
            <div className="flex flex-col gap-6">
              <div className="bg-[#111827] border border-stone-800 rounded-3xl p-10 flex-1 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/20 blur-3xl pointer-events-none" />
                <span className="text-red-400 font-bold tracking-widest uppercase text-xs mb-6">اشتباه اصلی</span>
                <p className="text-3xl font-serif text-white leading-snug mb-4">بیشتر تیم‌ها هوش مصنوعی را میان‌بر می‌بینند.</p>
                <p className="text-xl text-stone-400 font-light">ولی فقط به‌عنوان ضریب‌افزا کار می‌کند.</p>
              </div>
              
              <div className="bg-[#1B4B43] border border-[#19403a] rounded-3xl p-10 flex-1 flex flex-col justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                <h3 className="text-2xl font-serif text-white leading-snug">
                  هوش مصنوعی فرایند خراب را درست نمی‌کند.
                </h3>
                <p className="text-[#A7F3D0] text-lg mt-4 font-light">
هر سیستمی که از قبل هست را بزرگ‌تر می‌کند، خوب باشد یا بد.
                </p>
              </div>
            </div>
            
          </div>
        </section>

        {/* 5. WHAT IT ACTUALLY MEANS (Methodology Grid) */}
        <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl text-[#111827] mb-6">«سیستم‌های دیجیتال و هوش مصنوعی» دقیقاً یعنی چه</h2>
            <p className="text-lg text-stone-500 font-light">
بیشتر آدم‌ها همین‌جا کار را اشتباه می‌فهمند. موضوع نصب ابزار، ساختن خودکارسازی‌های پراکنده یا اضافه کردن هوش مصنوعی محض خودش نیست. <strong className="text-[#111827]">موضوع طراحی شکل کارکرد کسب‌وکار شماست.</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                num: "۰۱", 
                title: "شفافیت گردش‌کار پیش از خودکارسازی", 
                desc: "قبل از خودکارسازی به این‌ها جواب می‌دهیم: گردش‌کار دقیقاً چیست؟ گلوگاه‌ها کجایند؟ هر قدم مسئولش کیست؟",
                alert: "اگر گردش‌کار مبهم باشد، خودکارسازی شکست می‌خورد." 
              },
              { 
                num: "۰۲", 
                title: "طراحی سیستم، نه انتخاب ابزار", 
                desc: "بیشترشان از ابزار شروع می‌کنند. ما از ساختار شروع می‌کنیم. اول فرایندها، وابستگی‌ها و نقاط تصمیم را تعریف می‌کنیم.",
                alert: "ابزار را تازه بعد از آن انتخاب می‌کنیم." 
              },
              { 
                num: "۰۳", 
                title: "هوش مصنوعی به‌عنوان یک لایه", 
                desc: "نه به‌عنوان پایه. هوش مصنوعی را فقط جایی می‌آوریم که اهرم بسازد: تصمیم‌های تکراری، حجم بالا، جریان‌های داده‌سنگین.",
                alert: "همیشه درون یک سیستم تعریف‌شده." 
              },
              { 
                num: "۰۴", 
                title: "کم کردن پیچیدگی", 
                desc: "سیستم خوب با گذشت زمان ساده‌تر حس می‌شود، نه سنگین‌تر. یعنی حذف ابزار و یکپارچه کردن گردش‌کارها.",
                alert: "پیچیدگی قاتل خاموش است." 
              }
            ].map((step, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-4xl font-serif text-stone-200 block mb-6">{step.num}</span>
                  <h3 className="font-bold text-xl text-[#111827] mb-4">{step.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-6">{step.desc}</p>
                </div>
                <div className="pt-4 border-t border-stone-100 mt-auto">
                  <p className="text-xs font-bold text-[#D97706] uppercase tracking-wider">{step.alert}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. A REAL EXAMPLE (Before & After Slider Concept) */}
        <section className="py-24 bg-[#F5F5F4] border-y border-stone-200">
           <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
             <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111827] text-white rounded-full text-[10px] uppercase tracking-widest mb-6">
                 نمونه‌ی واقعی
               </div>
               <h2 className="font-serif text-3xl md:text-5xl text-[#111827] mb-6">یک مثال واقعی</h2>
               <p className="text-stone-500 font-light text-lg mb-8">چطور یک کسب‌وکار در حال رشد با سیستم‌های ساختارمند از آشوب به اهرم رسید.</p>
               
               <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6 relative overflow-hidden">
                  <div className="absolute start-0 top-0 bottom-0 w-1 bg-red-500" />
                  <h4 className="font-bold text-stone-800 mb-2">قبل: آشوب</h4>
                  <ul className="text-stone-500 text-sm space-y-2">
                    <li>• بیش از شش ابزار بی‌ارتباط با هم</li>
                    <li>• گزارش‌گیری دستی هر هفته</li>
                    <li>• بنیان‌گذار گیرافتاده در عملیات روزمره</li>
                    <li>• تصمیم‌گیری به‌طرز آزاردهنده‌ای کند</li>
                  </ul>
               </div>

             </div>

             <div className="space-y-6">
               <div className="bg-white p-8 rounded-3xl border-2 border-[#1B4B43] shadow-[8px_8px_0px_0px_rgba(27,75,67,0.1)]">
                  <h4 className="font-serif text-2xl text-[#111827] mb-4 flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-[#1B4B43]" /> چه چیزی عوض شد
                  </h4>
                  <ol className="text-stone-600 space-y-3 mb-6 relative z-10">
                    <li><strong>۱.</strong> نقشه‌برداری از گردش‌کارهای واقعی</li>
                    <li><strong>۲.</strong> حذف قدم‌های زائد</li>
                    <li><strong>۳.</strong> یکپارچه‌سازی تمیز ابزارهای کلیدی</li>
                    <li><strong>۴.</strong> آوردن هوش مصنوعی برای گزارش و پرس‌وجو</li>
                  </ol>
                  
                  <div className="pt-6 border-t border-stone-100">
                    <h5 className="font-bold text-xs uppercase tracking-widest text-[#D97706] mb-3">نتیجه: اهرم</h5>
                    <ul className="text-[#111827] font-medium space-y-2">
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399] rtl:rotate-180" /> تصمیم‌های سریع‌تر</li>
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399] rtl:rotate-180" /> کار دستی کمتر</li>
                      <li className="flex gap-2"><MoveRight className="w-5 h-5 text-[#34D399] rtl:rotate-180" /> پاسخ‌گویی شفاف‌تر</li>
                    </ul>
                  </div>
               </div>
               <p className="text-center font-serif italic text-stone-500 text-lg">
                 «هیچ محصول هوش مصنوعی پرزرق‌وبرقی در کار نبود. فقط سیستم ساختارمند.»
               </p>
             </div>
           </div>
        </section>

        {/* 7. STRATEGIC ADVANTAGE & AUDIENCE */}
        <section className="py-32 px-6 max-w-6xl mx-auto grid md:grid-cols-12 gap-16">
          <div className="md:col-span-5 relative">
            <div className="sticky top-24 bg-[#111827] p-10 rounded-3xl text-white overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#1B4B43] rounded-full blur-[80px] opacity-40 pointer-events-none" />
              <h3 className="font-serif text-3xl mb-6 relative z-10">مزیت استراتژیک</h3>
              <p className="text-stone-300 font-light mb-8 relative z-10">کسب‌وکارهایی که روی سیستم‌های محکم سرمایه‌گذاری می‌کنند اهرم بزرگی به دست می‌آورند.</p>
              <ul className="space-y-4 mb-10 relative z-10 border-s-2 border-white/10 ps-4">
                <li className="text-white">شفافیت عملیاتی</li>
                <li className="text-white">اجرای سریع‌تر</li>
                <li className="text-white">وابستگی کمتر به افراد</li>
                <li className="text-white">مقیاس‌پذیری بهتر</li>
              </ul>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md relative z-10 text-xs text-stone-300 font-light italic">
دیلویت: «سازمان‌هایی که طراحی عملیاتی قوی دارند، هم در کارایی و هم در رضایت کارکنان از رقبایشان جلوترند.»
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-12">
            <div>
              <h2 className="font-serif text-3xl text-[#111827] mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-[#1B4B43]" /> این کار دقیقاً برای چه کسی است
              </h2>
              <p className="text-stone-500 mb-6">این کار برای همه نیست. برای این‌هاست:</p>
              <ul className="space-y-4">
                {[
                  "بنیان‌گذارانی که از آشوب اولیه عبور کرده‌اند و در حال رشدند",
                  "کسب‌وکارهایی که در ناکارآمدی عملیاتی گیر کرده‌اند",
                  "تیم‌هایی که زیر بار فرایندهای دستی له شده‌اند",
                  "شرکت‌هایی که تلاش می‌کنند از هوش مصنوعی درست استفاده کنند و موفق نمی‌شوند"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-center p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
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
              <p className="text-stone-500 mb-6">روشن بگویم.</p>
               <ul className="space-y-4 opacity-70">
                {[
                  "کسانی که دنبال «ترفندهای سریع هوش مصنوعی» هستند",
                  "تیم‌هایی که حاضر نیستند شیوه‌ی کارشان را عوض کنند",
                  "کسب‌وکارهایی که هنوز گردش‌کار واقعی ندارند"
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-center p-4 bg-stone-50 border border-stone-200 rounded-xl">
                    <span className="text-stone-600">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 border-s-4 border-[#D97706] bg-amber-50 rounded-e-lg">
                <p className="text-stone-800 font-bold">چون این کار این‌ها را لازم دارد:</p>
                <p className="text-[#D97706] font-serif text-2xl mt-2 italic">شفافیت، نظم، پیاده‌سازی.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. REALITY CHECK & CONCLUSION */}
        <section className="py-32 bg-[#1B4B43] text-white text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[#0f2e29] opacity-50 z-0 mix-blend-multiply transition-opacity pointer-events-none" />
           <div className="relative z-10 max-w-4xl mx-auto px-6">
             <h2 className="font-serif text-4xl md:text-6xl mb-12 text-[#A7F3D0]">یک محک ساده‌ی واقعیت</h2>
             
             <div className="grid sm:grid-cols-2 gap-4 mb-16 text-start">
                {[
                  "عملیات شما به آدم‌های خاصی وابسته است؟",
                  "ابزارهایتان واقعاً اصطکاک را کم می‌کنند یا اضافه می‌کنند؟",
                  "می‌توانید شفاف توضیح دهید کار در کسب‌وکارتان چطور جریان دارد؟",
                  "از هوش مصنوعی استفاده می‌کنید یا فقط با آن ور می‌روید؟"
                ].map((q, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl">
                    <p className="font-medium text-white/90">{q}</p>
                  </div>
                ))}
             </div>

             <div className="space-y-6">
                <p className="text-2xl font-light text-[#D1FAE5]">اگر این جواب‌ها روشن نیست، مشکل شما فناوری نیست.</p>
                <p className="font-serif text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FBBF24] to-[#F59E0B]">
                  ساختار است.
                </p>
                <div className="max-w-xl mx-auto pt-16 mt-16 border-t border-white/20">
                  <p className="text-lg font-light italic opacity-80 mb-4">
                    «تیم‌ها به‌خاطر کم‌کاری شکست نمی‌خورند. به‌خاطر نداشتن ساختار شکست می‌خورند.»
                  </p>
                  <p className="text-xl font-bold">و ساختار را ابزار نمی‌سازد. ساختار طراحی می‌شود.</p>
                </div>
             </div>
           </div>
        </section>

        {/* 9. CTA */}
        <ServiceCta locale="fa" />
        
      </div>
    </div>
  );
}
