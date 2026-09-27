"use client"

// ============================================================================
// File Path: src/components/v3/intro/time-calculator.tsx
// Why: Turns "automation saves time" into the reader's own number. They tick
//      the chores they do, set the hours and what an hour of their time is
//      worth, and choose how much of it they think could be automated. The
//      share is theirs to pick, never ours to promise; the result says so.
// Env / Identity: Client Component
// ============================================================================

import Link from "next/link"
import { animate, motion, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { localDigits } from "@/lib/digits"

const CHORES = [
  { key: "msg", label: "جواب دادن به پیام‌ها و ایمیل‌های تکراری", hours: 5 },
  { key: "book", label: "هماهنگی وقت و یادآوری به مشتری", hours: 3 },
  { key: "invoice", label: "نوشتن فاکتور و پیگیری پرداخت", hours: 2 },
  { key: "data", label: "وارد کردن اطلاعات در اکسل یا نرم‌افزار", hours: 3 },
  { key: "follow", label: "پیگیری مشتری‌هایی که جواب نداده‌اند", hours: 2 },
  { key: "social", label: "نوشتن پست و کپشن برای شبکه‌های اجتماعی", hours: 3 },
]

const SHARES = [25, 50, 75]
const WEEKS = 48

function fmt(n: number) {
  return localDigits(Math.round(n).toLocaleString("en-US"), "fa").replace(/,/g, "٬")
}

function Animated({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const from = useRef(value)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      el.textContent = fmt(value)
      return
    }
    const controls = animate(from.current, value, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = fmt(v)
      },
    })
    from.current = value
    return () => controls.stop()
  }, [value, reduce])
  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  )
}

export function TimeCalculator() {
  const [picked, setPicked] = useState<Record<string, number>>({ msg: 5, book: 3, invoice: 2 })
  const [rate, setRate] = useState(40)
  const [share, setShare] = useState(50)

  const weekly = Object.values(picked).reduce((a, b) => a + b, 0)
  const savedHours = (weekly * share * WEEKS) / 100
  const savedMoney = savedHours * rate
  const workDays = savedHours / 8

  const toggle = (key: string, hours: number) =>
    setPicked((p) => {
      const next = { ...p }
      if (key in next) delete next[key]
      else next[key] = hours
      return next
    })

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="flex flex-col gap-8 lg:col-span-7">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-4 text-lg text-v3-bone">۱. کدام کارها وقت شما را می‌گیرد؟</legend>
          {CHORES.map((c) => {
            const on = c.key in picked
            return (
              <div
                key={c.key}
                className={`flex flex-col gap-3 rounded-2xl border p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                  on ? "border-v3-light/60 bg-v3-light/5" : "border-v3-line"
                }`}
              >
                <label className="flex cursor-pointer items-center gap-3 text-v3-bone">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(c.key, c.hours)}
                    className="h-5 w-5 accent-v3-light"
                  />
                  {c.label}
                </label>
                {on && (
                  <motion.label
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 text-sm text-v3-mute"
                  >
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={picked[c.key]}
                      onChange={(e) => setPicked((p) => ({ ...p, [c.key]: Number(e.target.value) }))}
                      className="w-28 accent-v3-light"
                      aria-label={`ساعت در هفته برای ${c.label}`}
                    />
                    <span className="w-24 text-v3-bone">{localDigits(picked[c.key], "fa")} ساعت در هفته</span>
                  </motion.label>
                )}
              </div>
            )
          })}
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="flex flex-col gap-3">
            <span className="text-lg text-v3-bone">۲. هر ساعت از وقت شما چقدر می‌ارزد؟</span>
            <input
              type="range"
              min={20}
              max={150}
              step={5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="accent-v3-light"
            />
            <span className="text-v3-light">{localDigits(rate, "fa")} دلار در ساعت</span>
          </label>
          <div className="flex flex-col gap-3">
            <span className="text-lg text-v3-bone">۳. فکر می‌کنید چه سهمی از این کارها خودکار شود؟</span>
            <div className="flex gap-2">
              {SHARES.map((s) => (
                <button
                  key={s}
                  onClick={() => setShare(s)}
                  aria-pressed={share === s}
                  className={`min-h-11 flex-1 rounded-full border text-sm transition-colors ${
                    share === s ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-line text-v3-soft hover:border-v3-bone/50"
                  }`}
                >
                  {localDigits(s, "fa")}٪
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="sticky top-28 flex flex-col gap-6 overflow-hidden rounded-3xl border border-v3-light/50 bg-v3-raise p-8 shadow-[0_0_80px_-30px_rgba(232,196,138,0.5)]">
          <p className="text-v3-mute">در یک سال کاری ({localDigits(WEEKS, "fa")} هفته) پس می‌گیرید:</p>
          <div className="flex flex-col gap-1">
            <p className="flex items-baseline gap-3">
              <Animated value={savedHours} className="font-v3-display text-6xl font-light text-v3-light" />
              <span className="text-xl text-v3-bone">ساعت</span>
            </p>
            <p className="text-v3-soft">
              یعنی حدود <Animated value={workDays} className="text-v3-bone" /> روز کاری کامل
            </p>
          </div>
          <div className="h-px bg-v3-line" />
          <div className="flex flex-col gap-1">
            <p className="flex items-baseline gap-3">
              <Animated value={savedMoney} className="font-v3-display text-4xl font-light text-v3-bone" />
              <span className="text-lg text-v3-soft">دلار ارزش وقت شما</span>
            </p>
          </div>
          <p className="text-sm leading-loose text-v3-mute">
            این یک تخمین ساده با عددهای خود شماست، نه قول. در گفت‌وگوی اول دقیق نگاه می‌کنیم کدام کار واقعاً می‌ارزد خودکار شود و کدام نه.
          </p>
          <Link
            href="/fa/booking"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-v3-bone px-6 font-semibold text-v3-ink transition-colors hover:bg-v3-light"
          >
            بیایید دقیقش را حساب کنیم
          </Link>
        </div>
      </div>
    </div>
  )
}
