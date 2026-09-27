"use client"

// ============================================================================
// File Path: src/components/v3/intro/automation-picker.tsx
// Why: "Automation" means nothing until it is your own business. The reader
//      picks a trade and watches one routine job run by itself, step by
//      step, with a light travelling along the chain. Steps advance on a
//      timer; clicking a step jumps to it. Reduced motion lights all steps.
// Env / Identity: Client Component
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { localDigits } from "@/lib/digits"

type Trade = { key: string; label: string; job: string; saves: string; steps: string[] }

const TRADES: Trade[] = [
  {
    key: "salon",
    label: "آرایشگاه",
    job: "رزرو وقت",
    saves: "دیگر لازم نیست وسط کار به پیام‌ها جواب بدهید.",
    steps: [
      "مشتری در اینستاگرام یا سایت می‌پرسد: «فردا وقت دارید؟»",
      "دستیار هوشمند تقویم شما را نگاه می‌کند و ساعت‌های خالی را پیشنهاد می‌دهد.",
      "مشتری انتخاب می‌کند و وقت ثبت می‌شود.",
      "روز قبل، پیامک یادآوری خودکار فرستاده می‌شود و غیبت‌ها کم می‌شود.",
    ],
  },
  {
    key: "contractor",
    label: "تعمیرات و ساختمان",
    job: "گرفتن سفارش کار",
    saves: "تماس‌هایی که سر کار جواب نمی‌دادید دیگر از دست نمی‌رود.",
    steps: [
      "کسی زنگ می‌زند و شما روی داربست هستید.",
      "منشی صوتی هوشمند جواب می‌دهد، مشکل و آدرس را می‌پرسد.",
      "خلاصه‌ی کار با عکس‌هایی که مشتری فرستاده برایتان پیامک می‌شود.",
      "یک پیش‌فاکتور اولیه آماده است که فقط باید تأییدش کنید.",
    ],
  },
  {
    key: "realestate",
    label: "مشاور املاک",
    job: "پیگیری خریدار",
    saves: "هیچ خریداری فراموش نمی‌شود، حتی در شلوغ‌ترین هفته.",
    steps: [
      "خریداری فرم سایت را پر می‌کند.",
      "سیستم بودجه و محله‌ی دلخواهش را در فهرست مشتری‌ها ثبت می‌کند.",
      "هر وقت خانه‌ی مناسبی آمد، ایمیل شخصی‌شده برایش می‌رود.",
      "اگر جواب نداد، سه روز بعد یادآوری برای خود شما می‌آید.",
    ],
  },
  {
    key: "restaurant",
    label: "رستوران و کافه",
    job: "سفارش و نظر مشتری",
    saves: "سفارش‌ها مرتب می‌رسد و نظرهای بد زودتر به دستتان می‌رسد.",
    steps: [
      "مشتری از سایت خودتان سفارش می‌دهد، بدون کمیسیون اپ‌های واسطه.",
      "سفارش مستقیم روی صفحه‌ی آشپزخانه چاپ می‌شود.",
      "فردای آن روز یک پیام تشکر و درخواست نظر می‌رود.",
      "نظرهای منفی قبل از اینکه در گوگل ثبت شوند به شما خبر داده می‌شوند.",
    ],
  },
  {
    key: "shop",
    label: "فروشگاه اینترنتی",
    job: "جواب به سؤال خریدار",
    saves: "سؤال‌های تکراری ساعت ۲ شب هم جواب می‌گیرند.",
    steps: [
      "خریدار می‌پرسد: «این کفش سایز ۴۲ دارد؟ کی می‌رسد؟»",
      "دستیار موجودی انبار و زمان ارسال را نگاه می‌کند.",
      "جواب درست می‌دهد و لینک خرید را می‌فرستد.",
      "سؤال‌های سخت یا ناراضی‌ها مستقیم به شما ارجاع می‌شوند.",
    ],
  },
  {
    key: "office",
    label: "دفتر حسابداری یا بیمه",
    job: "جمع کردن مدارک",
    saves: "ساعت‌ها ایمیل رفت‌وبرگشتی برای یک مدرک جاافتاده حذف می‌شود.",
    steps: [
      "مشتری مدارکش را از روی گوشی عکس می‌گیرد و می‌فرستد.",
      "هوش مصنوعی مدرک را می‌خواند و نوعش را تشخیص می‌دهد.",
      "اطلاعات در پرونده‌ی درست ذخیره می‌شود.",
      "اگر مدرکی کم باشد، خودکار از مشتری خواسته می‌شود.",
    ],
  },
]

const STEP_MS = 2600

export function AutomationPicker() {
  const reduce = useReducedMotion()
  const [tradeIdx, setTradeIdx] = useState(0)
  const [step, setStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const trade = TRADES[tradeIdx]

  useEffect(() => {
    if (reduce || paused) return
    const t = setInterval(() => setStep((s) => (s + 1) % trade.steps.length), STEP_MS)
    return () => clearInterval(t)
  }, [reduce, paused, trade.steps.length])

  const pick = (i: number) => {
    setTradeIdx(i)
    setStep(0)
    setPaused(false)
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="flex flex-col gap-3 lg:col-span-4">
        <p className="text-v3-mute">کار شما چیست؟</p>
        <div className="flex flex-wrap gap-2 lg:flex-col">
          {TRADES.map((t, i) => (
            <button
              key={t.key}
              onClick={() => pick(i)}
              aria-pressed={i === tradeIdx}
              className={`group flex min-h-12 items-center justify-between gap-4 rounded-2xl border px-5 py-3 text-start text-lg transition-all duration-300 ${
                i === tradeIdx
                  ? "border-v3-light bg-v3-light/10 text-v3-bone"
                  : "border-v3-line text-v3-soft hover:border-v3-bone/40 hover:text-v3-bone"
              }`}
            >
              {t.label}
              <span
                aria-hidden
                className={`hidden h-2 w-2 rounded-full transition-all lg:block ${
                  i === tradeIdx ? "bg-v3-light shadow-[0_0_12px_rgba(232,196,138,0.9)]" : "bg-v3-line"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-v3-line bg-v3-raise p-6 md:p-10 lg:col-span-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={trade.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-v3-display text-2xl text-v3-bone md:text-3xl">
                {trade.label}: <span className="text-v3-light">{trade.job}</span>
              </h3>
              <span className="text-sm text-v3-mute">بدون اینکه شما دست به گوشی بزنید</span>
            </div>

            <ol className="flex flex-col">
              {trade.steps.map((s, i) => {
                const on = reduce || i <= step
                const current = !reduce && i === step
                const last = i === trade.steps.length - 1
                return (
                  <li key={s} className="relative pb-4 last:pb-0">
                    {!last && (
                      <span aria-hidden className="absolute bottom-0 start-5 top-11 w-px bg-v3-line">
                        <motion.span
                          className="absolute inset-0 origin-top bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.8)]"
                          initial={false}
                          animate={{ scaleY: reduce || i < step ? 1 : 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setStep(i)
                        setPaused(true)
                      }}
                      className="relative flex w-full items-start gap-5 rounded-2xl p-1 text-start"
                    >
                      <motion.span
                        className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm"
                        animate={{
                          borderColor: on ? "rgba(232,196,138,0.9)" : "rgba(51,48,44,1)",
                          backgroundColor: current ? "rgba(232,196,138,1)" : "rgba(20,19,18,1)",
                          color: current ? "rgba(20,19,18,1)" : on ? "rgba(232,196,138,1)" : "rgba(163,156,144,1)",
                          scale: current ? 1.08 : 1,
                        }}
                        transition={{ duration: 0.35 }}
                      >
                        {localDigits(i + 1, "fa")}
                      </motion.span>
                      <motion.span
                        className="pt-1.5 text-lg leading-loose"
                        animate={{ opacity: on ? 1 : 0.4, color: current ? "#ede8df" : "#cfc8bb" }}
                        transition={{ duration: 0.35 }}
                      >
                        {s}
                      </motion.span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <p className="rounded-2xl border border-v3-light/30 bg-v3-light/5 px-5 py-4 leading-loose text-v3-bone">
              <span className="text-v3-light">نتیجه: </span>
              {trade.saves}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
