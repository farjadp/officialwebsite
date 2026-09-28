"use client"

// ============================================================================
// File Path: src/components/v3/intro/hero-chat.tsx
// Why: The /fa/intro hero shows AI automation instead of naming it. A
//      customer writes to a hair salon late at night, an assistant answers,
//      books the slot and the owner gets a calendar entry. The script loops.
//      Labelled as a demonstration: it is not a live bot.
//      Reduced motion renders the whole conversation at once.
// Env / Identity: Client Component
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { CalendarCheck, Moon, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

type Line = { from: "customer" | "ai"; text: string }

const SCRIPT: Line[] = [
  { from: "customer", text: "سلام، فردا برای کوتاهی مو وقت خالی دارید؟" },
  { from: "ai", text: "سلام! فردا ساعت ۱۰ صبح و ۲:۳۰ بعدازظهر خالی است. کدام را برایتان رزرو کنم؟" },
  { from: "customer", text: "۲:۳۰ لطفاً. اسمم سارا است." },
  { from: "ai", text: "رزرو شد، سارا جان. فردا ساعت ۹ صبح یک پیامک یادآوری برایتان می‌فرستم." },
]

// How long each beat stays before the next one arrives (ms).
const BEAT = 1900
const TYPING = 1100
const HOLD_END = 4200

export function HeroChat() {
  const reduce = useReducedMotion()
  // step = how many lines are visible; SCRIPT.length + 1 shows the calendar toast.
  const [step, setStep] = useState(0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (reduce) {
      setStep(SCRIPT.length + 1)
      return
    }
    let t: ReturnType<typeof setTimeout>
    if (step <= SCRIPT.length - 1) {
      const next = SCRIPT[step]
      if (next.from === "ai") {
        setTyping(true)
        t = setTimeout(() => {
          setTyping(false)
          setStep((s) => s + 1)
        }, TYPING)
      } else {
        t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 700 : BEAT)
      }
    } else if (step === SCRIPT.length) {
      t = setTimeout(() => setStep((s) => s + 1), 900)
    } else {
      t = setTimeout(() => setStep(0), HOLD_END)
    }
    return () => clearTimeout(t)
  }, [step, reduce])

  const visible = SCRIPT.slice(0, Math.min(step, SCRIPT.length))
  const booked = step > SCRIPT.length

  return (
    <div className="relative mx-auto w-full max-w-md" aria-label="نمایش یک گفت‌وگوی خودکار با مشتری" role="img">
      {/* phone */}
      <div className="relative overflow-hidden rounded-[2rem] border border-v3-line bg-v3-raise p-4 shadow-[0_40px_120px_-40px_rgb(var(--v3-glow)/0.35)]">
        <div className="flex items-center justify-between border-b border-v3-line/70 px-2 pb-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-v3-light/15 text-v3-light">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-v3-bone">سالن زیبایی نمونه</span>
              <span className="flex items-center gap-1.5 text-xs text-v3-mute">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                دستیار هوشمند · همیشه آنلاین
              </span>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-v3-line px-2.5 py-1 text-xs text-v3-mute">
            <Moon className="h-3 w-3" aria-hidden />
            ۱۱:۴۲ شب
          </span>
        </div>

        <div className="flex min-h-[25rem] flex-col gap-3 px-1 pb-16 pt-4">
          <AnimatePresence initial={false}>
            {visible.map((line, i) => (
              <motion.div
                key={`${i}-${line.text}`}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                  line.from === "customer"
                    ? "self-start rounded-ss-md bg-v3-line/70 text-v3-bone"
                    : "self-end rounded-se-md bg-v3-light text-v3-ink"
                }`}
              >
                {line.text}
              </motion.div>
            ))}
            {typing && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-1 self-end rounded-2xl rounded-se-md bg-v3-light/20 px-4 py-3"
              >
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-v3-light"
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* what the owner sees */}
      <AnimatePresence>
        {booked && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-10 -start-4 flex max-w-[18rem] items-start gap-3 rounded-2xl border border-v3-light/50 bg-v3-ink/95 p-4 shadow-2xl backdrop-blur md:-start-12"
          >
            <CalendarCheck className="mt-0.5 h-5 w-5 shrink-0 text-v3-light" aria-hidden />
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-v3-bone">در تقویم شما ثبت شد</span>
              <span className="leading-relaxed text-v3-mute">سارا · فردا ۲:۳۰ · کوتاهی مو. شما خواب بودید و کار انجام شد.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
