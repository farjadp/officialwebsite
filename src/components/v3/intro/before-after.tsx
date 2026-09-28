"use client"

// ============================================================================
// File Path: src/components/v3/intro/before-after.tsx
// Why: What "website design" changes, seen instead of described. Two versions
//      of the same made-up bakery, built in HTML (no screenshots), with a
//      handle the reader drags across. A transparent range input over the
//      whole frame gives mouse, touch and keyboard control for free. The
//      handle nudges itself once on first view so people see it moves.
// Env / Identity: Client Component
// ============================================================================

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion"
import { MapPin, Phone, ShoppingBag, Star } from "lucide-react"
import { useEffect, useRef } from "react"

export function BeforeAfter() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" })
  const reduce = useReducedMotion()
  // Percentage of the frame, measured from the left, where the divider sits.
  const pos = useMotionValue(50)
  const clip = useTransform(pos, (p) => `inset(0 ${100 - p}% 0 0)`)
  const left = useTransform(pos, (p) => `${p}%`)

  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(pos, [50, 22, 78, 50], { duration: 2.4, ease: "easeInOut" })
    return () => c.stop()
  }, [inView, reduce, pos])

  return (
    <div className="flex flex-col gap-4">
      <div ref={ref} className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-3xl border border-v3-line sm:aspect-[16/10]">
        {/* AFTER — full frame */}
        <AfterSite />

        {/* BEFORE — clipped to the left of the divider */}
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <BeforeSite />
        </motion.div>

        {/* divider */}
        <motion.div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-v3-light shadow-[0_0_20px_rgb(var(--v3-glow)/0.9)]" style={{ left }}>
          <span className="absolute top-1/2 left-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-v3-light bg-v3-ink text-v3-light shadow-xl">
            <span aria-hidden dir="ltr" className="text-lg">‹ ›</span>
          </span>
        </motion.div>

        <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white">قبل</span>
        <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-v3-light px-3 py-1 text-xs font-semibold text-v3-ink">بعد</span>

        <input
          type="range"
          min={0}
          max={100}
          defaultValue={50}
          dir="ltr"
          aria-label="مقایسه‌ی سایت قدیمی و سایت جدید"
          onChange={(e) => pos.set(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <p className="text-sm text-v3-mute">دستگیره را بکشید. «نانوایی نمونه» ساختگی است؛ این فقط برای نشان دادن تفاوت است.</p>
    </div>
  )
}

/** The kind of site many small businesses still have. Deliberately dated. */
function BeforeSite() {
  return (
    <div className="flex h-full flex-col bg-[#e9e6dc] font-serif text-[#1a1a8c]" dir="rtl">
      <div className="bg-[#1a1a8c] px-3 py-2 text-center text-[11px] text-yellow-300 sm:text-sm">
        *** به وب سایت رسمی نانوایی نمونه خوش آمدید !!! ***
      </div>
      <div className="flex flex-1 gap-2 p-2 sm:p-3">
        <div className="hidden w-1/4 flex-col gap-1 border border-[#999] bg-white p-2 text-[11px] underline sm:flex">
          <span>صفحه اصلی</span>
          <span>درباره ما</span>
          <span>تاریخچه</span>
          <span>گالری تصاویر</span>
          <span>اخبار</span>
          <span>تماس با ما</span>
        </div>
        <div className="flex flex-1 flex-col gap-2 border border-[#999] bg-white p-2 text-[10px] leading-snug text-black sm:p-3 sm:text-xs">
          <p className="font-bold text-red-700">اطلاعیه: ساعت کاری در ایام تعطیل تغییر میکند</p>
          <p>
            نانوایی نمونه از سال ها پیش با بهترین کیفیت در خدمت مشتریان عزیز میباشد. محصولات ما شامل انواع نان سنگک و بربری و
            لواش و شیرینی جات میباشد. جهت اطلاعات بیشتر با ما تماس حاصل فرمایید. کلیه حقوق محفوظ است.
          </p>
          <div className="grid flex-1 grid-cols-3 gap-1">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border border-[#bbb] bg-[#ddd]" />
            ))}
          </div>
          <p className="text-[9px] text-[#666]">تلفن: در صفحه تماس با ما · آخرین بروزرسانی ۱۳۹۴</p>
        </div>
      </div>
    </div>
  )
}

/** The same bakery, designed. */
function AfterSite() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-[#faf6ee] text-[#2b2118]" dir="rtl">
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <span className="text-lg font-bold">نانوایی نمونه</span>
        <span className="flex items-center gap-1.5 rounded-full bg-[#2b2118] px-3.5 py-2 text-xs text-[#faf6ee]">
          <Phone className="h-3.5 w-3.5" aria-hidden />
          تماس با یک لمس
        </span>
      </div>
      <div className="grid flex-1 gap-5 px-5 pb-5 sm:grid-cols-2 sm:px-8 sm:pb-8">
        <div className="flex flex-col justify-center gap-4">
          <span className="flex items-center gap-1 text-xs text-[#a0671d]">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden />
            ))}
            <span className="ms-1 text-[#6b5a48]">۴٫۹ از ۳۱۲ نظر در گوگل</span>
          </span>
          <p className="text-2xl font-bold leading-snug sm:text-4xl">نان داغ، هر صبح از ساعت ۶.</p>
          <p className="text-sm leading-relaxed text-[#6b5a48]">سنگک، بربری و شیرینی خانگی. آنلاین سفارش بدهید، سر راه بردارید.</p>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-2 rounded-full bg-[#c8742a] px-5 py-3 text-sm font-semibold text-white shadow-lg">
              <ShoppingBag className="h-4 w-4" aria-hidden />
              سفارش آنلاین
            </span>
            <span className="flex items-center gap-2 rounded-full border border-[#2b2118]/20 px-4 py-3 text-sm">
              <MapPin className="h-4 w-4" aria-hidden />
              مسیریابی
            </span>
          </div>
        </div>
        <div className="relative hidden overflow-hidden rounded-3xl bg-linear-to-br from-[#e9b872] via-[#d08a3c] to-[#8a4b17] sm:block">
          <div className="absolute inset-6 rounded-[40%] bg-[#f4d6a2]/40 blur-2xl" />
          <div className="absolute bottom-5 start-5 rounded-2xl bg-white/90 px-4 py-3 text-xs text-[#2b2118] shadow-lg">
            الان باز است · تا ۸ شب
          </div>
        </div>
      </div>
    </div>
  )
}
