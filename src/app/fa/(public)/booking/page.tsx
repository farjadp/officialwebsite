// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — Booking Page
// Why: Online consultation booking with charity donation flow
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next"
import { localeAlternates } from "@/lib/seo"
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    Clock,
    Video,
    FileText,
    Link as LinkIcon,
    MapPin,
    Globe,
    ShieldAlert,
    Handshake,
    Scale
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
    {
        q: "می‌توانم هم‌بنیان‌گذارم را هم بیاورم؟",
        a: "بله. اتفاقاً تشویق می‌کنیم همه‌ی تصمیم‌گیرنده‌های کلیدی (تا سه نفر) در جلسه باشند تا همه یک تصویر مشترک داشته باشند."
    },
    {
        q: "اگر هنوز رسید کمک خیریه ندارم چه؟",
        a: "می‌توانید اول زمان را رزرو کنید تا از دست نرود، ولی برای قطعی شدن باید ظرف ۶ ساعت رسید را بفرستید."
    },
    {
        q: "مبلغ قابل بازگشت است؟",
        a: "چون کمک مستقیم به خیریه است، بازگشتی نیست. ولی اگر ۲۴ ساعت قبل خبر دهید، جلسه را جابه‌جا می‌کنیم."
    },
    {
        q: "جلسه به فارسی برگزار می‌شود؟",
        a: "بله. جلسه به هر زبانی که راحت‌ترید برگزار می‌شود، فارسی یا انگلیسی."
    },
];

export const metadata: Metadata = {
    alternates: localeAlternates("/booking", "fa"),
    title: "رزرو جلسه استراتژی | مشاوره ۳۰ دقیقه‌ای",
    description:
        "یک جلسه ۳۰ دقیقه‌ای با فرجاد رزرو کنید؛ مسئله اصلی را تشخیص دهید و گام بعدی را تعیین کنید.",
}

export default function BookingPage() {
    return (
        // ROOT: Warm Paper Background with Noise Texture (Matching other pages)
        <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white pb-24">

            {/* Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>



            <main className="relative z-10">

                {/* --- 1. HERO SECTION --- */}
                <section className="pt-24 pb-16 px-6 md:px-12 max-w-6xl mx-auto text-center border-b border-[#1B4B43]/10">
                    <Badge className="mb-6 bg-[#1B4B43]/10 text-[#1B4B43] hover:bg-[#1B4B43]/20 border-none uppercase tracking-widest px-3 py-1 rounded-sm text-xs">
                        جلسه‌ی استراتژی
                    </Badge>
                    <h1 className="font-serif text-5xl md:text-7xl text-[#111827] leading-[1.1] mb-6">
                        زمانتان را رزرو کنید
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-600 font-light leading-relaxed max-w-3xl mx-auto mb-16">
صد درصد هزینه‌ی جلسه به خیریه‌های معتبر اهدا می‌شود. تعهد برای ما از سود مهم‌تر است.
                    </p>

                    {/* Core Info Boxes */}
                    <div className="grid md:grid-cols-3 gap-6 text-start max-w-5xl mx-auto">

                        {/* Box 1: Fee */}
                        <div className="bg-white p-8 border border-stone-200 shadow-sm rounded-sm hover:border-[#1B4B43] hover:shadow-md transition-all">
                            <h3 className="font-serif text-xl font-bold text-[#111827] mb-2">هزینه‌ی اثر اجتماعی</h3>
                            <div className="my-6 p-4 bg-[#F5F5F4] rounded-sm text-center">
                                <p className="text-3xl font-bold text-[#1B4B43]">
                                    ۱۴۴ <span className="text-lg font-normal text-stone-500">دلار</span>
                                </p>
                            </div>
                            <p className="text-sm text-stone-500 leading-relaxed">
مستقیم به خیریه‌ای که خودتان انتخاب می‌کنید پرداخت کنید و رسیدش را برای ما بفرستید تا رزرو قطعی شود.
                            </p>
                        </div>

                        {/* Box 2: Details */}
                        <div className="bg-white p-8 border border-stone-200 shadow-sm rounded-sm hover:border-[#1B4B43] hover:shadow-md transition-all">
                            <h3 className="font-serif text-xl font-bold text-[#111827] mb-6">جزئیات جلسه</h3>
                            <ul className="space-y-4 text-sm text-stone-600">
                                <li className="flex justify-between items-center border-b border-stone-100 pb-2">
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#1B4B43]/70" /> مدت:</span>
                                    <strong className="text-[#111827]">۶۰ تا ۹۰ دقیقه</strong>
                                </li>
                                <li className="flex justify-between items-center border-b border-stone-100 pb-2">
                                    <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-[#1B4B43]/70" /> بستر:</span>
                                    <strong className="text-[#111827]">Google Meet</strong>
                                </li>
                                <li className="flex justify-between items-center border-b border-stone-100 pb-2">
                                    <span className="flex items-center gap-2"><Video className="w-4 h-4 text-[#1B4B43]/70" /> ضبط جلسه:</span>
                                    <strong className="text-[#111827]">دارد</strong>
                                </li>
                            </ul>
                        </div>

                        {/* Box 3: Tech Check */}
                        <div className="bg-[#1B4B43] text-white p-8 shadow-md rounded-sm relative overflow-hidden flex flex-col justify-between">
                            <div className="relative z-10 w-full">
                                <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                                    بررسی فنی
                                </h3>
                                <p className="text-sm font-bold mb-2 text-[#F2B95E]">تقویم بالا نمی‌آید؟</p>
                                <p className="text-sm leading-relaxed opacity-90 mb-6">
به دلیل محدودیت‌های اینترنت، احتمالاً برای دیدن تقویم گوگلِ پایین صفحه به <strong>وی‌پی‌ان</strong> نیاز دارید.
                                </p>
                                <Link
                                    href="https://t.me/startupvisamentor"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-sm font-bold border-b border-[#F2B95E] text-[#F2B95E] hover:text-white hover:border-white transition-colors pb-0.5"
                                >
                                    رزرو دستی از طریق تلگرام <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </Link>
                            </div>
                            <div className="absolute -bottom-4 -end-4 text-8xl opacity-10 rotate-12 pointer-events-none">
                                🗓️
                            </div>
                        </div>

                    </div>
                </section>

                {/* --- 2. THE CALENDAR EMBED --- */}
                <section className="py-16 px-6 md:px-12 bg-[#F5F5F4] border-b border-stone-200">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="sr-only">زمان جلسه را انتخاب کنید</h2>
                        <div className="bg-white rounded-md shadow-xl border border-stone-200 overflow-hidden h-[800px] relative">
                            <iframe
                                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0c9kl9WXgD2feLxqByk8S1fPcngsfXdvOISc-dWrbhXnhNx7uVuM1RyLJfWKkT2l5XX7I3wNLf?gv=true"
                                style={{ border: 0 }}
                                width="100%"
                                height="100%"
                                title="رزرو وقت در تقویم گوگل"
                                className="w-full h-full bg-white"
                            />
                        </div>
                        {/* Fallback link if iframe is blocked */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-stone-500">
تقویم درست نمایش داده نمی‌شود؟ <Link href="https://calendar.app.google/WNH5NUDujf7qDbAs6" target="_blank" className="font-bold text-[#1B4B43] hover:underline">در تب جدید باز کنید</Link>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- 3. THE WAR ROOM (Process) & PROTOCOLS --- */}
                <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* The War Room Process */}
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-[#111827]">داخل «اتاق جنگ»</h2>
                                <p className="text-stone-600 font-light mt-3 leading-relaxed text-lg">
این یک گپ دوستانه نیست. یک ممیزی استراتژیک ساختارمند است. تفکیک جلسه‌ی ۶۰ تا ۹۰ دقیقه‌ای این‌طور است:
                                </p>
                            </div>

                            {/* Timeline Items */}
                            <div className="space-y-8 relative ps-8 border-s-2 border-[#1B4B43]/20">

                                <div className="relative">
                                    <div className="absolute -start-[41px] top-1 w-5 h-5 rounded-full bg-[#1B4B43] border-4 border-[#FDFCF8] shadow-sm" />
                                    <h4 className="font-bold text-[#111827] text-lg">دقیقه‌ی ۰ تا ۱۵: تشخیص</h4>
                                    <p className="text-stone-600 mt-2 leading-relaxed">
وضعیت فعلی‌تان را زیر فشار می‌بریم: بررسی سرمایه، تحلیل ساختار تیم، و شناسایی «پرچم قرمز»های فوری در پرونده‌تان.
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -start-[41px] top-1 w-5 h-5 rounded-full bg-[#1B4B43] border-4 border-[#FDFCF8] shadow-sm" />
                                    <h4 className="font-bold text-[#111827] text-lg">دقیقه‌ی ۱۵ تا ۴۵: استراتژی پیوت</h4>
                                    <p className="text-stone-600 mt-2 leading-relaxed">
ایده‌ی کسب‌وکارتان را بازمهندسی می‌کنیم و دقیق توضیح می‌دهیم محصول را چطور جایگاه‌گذاری کنید تا با الزامات مشخص و شکاف‌های بازار جور دربیاید.
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -start-[41px] top-1 w-5 h-5 rounded-full bg-[#F2B95E] border-4 border-[#FDFCF8] shadow-sm" />
                                    <h4 className="font-bold text-[#111827] text-lg">دقیقه‌ی ۴۵ تا ۶۰: برنامه‌ی اجرا</h4>
                                    <p className="text-stone-600 mt-2 leading-relaxed">
با یک نقشه‌ی راه روشن از جلسه بیرون می‌آیید: کدام مسیر را بروید، پارامترهای مشخص بودجه، و زمان‌بندی تخمینی برای رسیدن به هدف‌هایتان.
                                    </p>
                                </div>

                            </div>

                            {/* What You Receive Card */}
                            <div className="bg-[#F5F5F4] p-8 border border-stone-200 mt-8">
                                <p className="text-xs font-bold text-[#1B4B43] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> چه چیزی تحویل می‌گیرید
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                                        <span className="text-[#1B4B43]">✓</span> فایل ویدیوی جلسه
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                                        <span className="text-[#1B4B43]">✓</span> متن پیاده‌شده‌ی صوت
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                                        <span className="text-[#1B4B43]">✓</span> برنامه‌ی عمل به‌صورت PDF
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                                        <span className="text-[#1B4B43]">✓</span> لینک منابع
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms of Engagement & NDA */}
                        <div className="space-y-8">

                            {/* NDA Card */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#F2B95E] transform rotate-1 rounded-sm opacity-20 transition-transform hover:rotate-2"></div>
                                <div className="bg-white p-8 rounded-sm border border-stone-200 shadow-xl relative z-10 transition-transform origin-bottom-left hover:-translate-y-1 rtl:hover:-translate-x-1 ltr:hover:translate-x-1">
                                    <div className="flex flex-col gap-2 border-b border-stone-100 pb-6 mb-6">
                                        <div className="w-12 h-12 bg-[#1B4B43]/10 rounded-full flex items-center justify-center mb-3">
                                            <ShieldAlert className="w-6 h-6 text-[#1B4B43]" />
                                        </div>
                                        <h3 className="text-2xl font-bold font-serif text-[#111827]">توافق محرمانگی دوطرفه</h3>
                                        <p className="text-sm font-medium tracking-widest uppercase text-stone-500">قرارداد عدم افشا</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <Video className="w-5 h-5 text-[#1B4B43] shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-[#111827] text-sm mb-1">کاملاً محرمانه</h4>
                                                <p className="text-sm text-stone-600 leading-relaxed">
فایل ضبط‌شده‌ی جلسه فقط <strong>برای مرور شخصی خودتان</strong> است. انتشار، اشتراک‌گذاری یا آپلود هر بخشی از این جلسه در شبکه‌های اجتماعی اکیداً ممنوع است.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Handshake className="w-5 h-5 text-[#1B4B43] shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-[#111827] text-sm mb-1">محرمانگی دوطرفه</h4>
                                                <p className="text-sm text-stone-600 leading-relaxed">
ما به اسرار تجاری شما احترام می‌گذاریم و در مقابل، شما به مالکیت فکری ما. ما داده‌های شما را جایی منتشر نمی‌کنیم و شما استراتژی‌های داخلی ما را علنی نمی‌کنید.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Scale className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-red-700 text-sm mb-1">پیامد حقوقی</h4>
                                                <p className="text-sm text-stone-600 leading-relaxed">
نقض این توافق از سوی هر یک از دو طرف، به پیگرد حقوقی فوری و حذف از همکاری‌های آینده منجر می‌شود.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                                        <p className="text-xs text-stone-400 font-mono tracking-wider">
با رزرو جلسه، این شرایط را پذیرفته‌اید.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Terms Box */}
                            <div className="bg-[#111827] text-white p-8 rounded-sm shadow-md">
                                <h3 className="font-serif text-xl font-bold mb-6 text-[#F2B95E]">قواعد همکاری</h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <span className="text-[#F2B95E] font-bold">۰۱.</span>
                                        <div>
                                            <strong className="block text-sm mb-1">غیبت بدون اطلاع</strong>
                                            <span className="text-sm text-stone-400">جلسه‌ای که بدون اطلاع ۲۴ ساعته از دست برود سوخته است و جابه‌جا نمی‌شود.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-[#F2B95E] font-bold">۰۲.</span>
                                        <div>
                                            <strong className="block text-sm mb-1">تأیید کمک خیریه</strong>
                                            <span className="text-sm text-stone-400">رسید خیریه را ظرف ۶ ساعت پس از رزرو با ایمیل یا تلگرام بفرستید تا رزرو خودکار لغو نشود.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- 4. FAQ: Accordions --- */}
                <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-stone-200">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl text-[#111827] mb-4">پرسش‌های رایج رزرو</h2>
                        <div className="w-12 h-1 bg-[#1B4B43]/40 mx-auto rounded-full mt-6"></div>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {FAQS.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-stone-200 bg-white rounded-md px-6 py-2 data-[state=open]:border-[#1B4B43] data-[state=open]:shadow-sm transition-all duration-300"
                            >
                                <AccordionTrigger className="text-start text-lg md:text-xl font-medium text-[#111827] hover:no-underline hover:text-[#1B4B43] transition-colors py-6">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-stone-600 pb-8 text-base md:text-lg leading-relaxed font-light">
                                    <div className="ps-0 border-s-2 border-[#1B4B43]/20 pt-2 px-4">
                                        {faq.a}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

            </main>
        </div>
    );
}
