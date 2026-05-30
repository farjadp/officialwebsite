import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Linkedin, ArrowRight } from "lucide-react"

interface ArticleCtaCardProps {
    locale?: "en" | "fa"
}

export function ArticleCtaCard({ locale = "en" }: ArticleCtaCardProps) {
    const isFa = locale === "fa"

    const content = {
        en: {
            badge: "Let's Collaborate",
            headline: "Ready to build something real?",
            description: "I work with a small number of founding teams each quarter to launch products, mentor engineers, and integrate custom AI systems. Let's determine if we are a fit.",
            bookBtn: "Book a Strategy Session",
            linkedinBtn: "Connect on LinkedIn",
            footerText: "Direct & selective advisory • Limited slots available"
        },
        fa: {
            badge: "شروع همکاری",
            headline: "برای ساختن یک کسب‌وکار واقعی آماده‌اید؟",
            description: "من در هر فصل با تعداد محدودی از تیم‌های بنیان‌گذار برای لانچ محصولات، مشاوره به مهندسین و سیستم‌سازی اختصاصی با هوش مصنوعی همکاری می‌کنم. بیایید بررسی کنیم آیا برای هم مناسب هستیم یا خیر.",
            bookBtn: "رزرو جلسه استراتژی",
            linkedinBtn: "ارتباط در لینکدین",
            footerText: "همکاری مستقیم و گزینشی • ظرفیت پذیرش محدود"
        }
    }

    const dict = isFa ? content.fa : content.en

    return (
        <div 
            className="my-16 bg-[#111827] text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-stone-800 relative overflow-hidden text-left"
            dir={isFa ? "rtl" : "ltr"}
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#1B4B43] rounded-full blur-[100px] opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#D97706] rounded-full blur-[80px] opacity-10 pointer-events-none -translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className={`space-y-4 max-w-xl ${isFa ? "text-right" : "text-left"}`}>
                    <span className="inline-block px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 rounded-full text-[#D97706]">
                        {dict.badge}
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                        {dict.headline}
                    </h3>
                    <p className="text-stone-400 text-base md:text-lg leading-relaxed font-light">
                        {dict.description}
                    </p>
                    <p className="text-xs text-stone-500 font-mono tracking-wider pt-2">
                        {dict.footerText}
                    </p>
                </div>

                <div className="flex flex-col gap-3.5 w-full md:w-auto shrink-0">
                    <Link href={isFa ? "/fa/booking" : "/booking"} className="w-full">
                        <Button className="w-full bg-[#1B4B43] hover:bg-[#133832] text-white h-14 px-8 text-base font-semibold rounded-2xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {dict.bookBtn}
                            {!isFa && <ArrowRight className="w-4 h-4" />}
                        </Button>
                    </Link>
                    <a 
                        href="https://www.linkedin.com/in/farjadpourmohammad/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full"
                    >
                        <Button 
                            variant="outline" 
                            className="w-full border-stone-800 text-stone-300 hover:text-white hover:bg-white/5 h-14 px-8 text-base font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
                        >
                            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                            {dict.linkedinBtn}
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    )
}
