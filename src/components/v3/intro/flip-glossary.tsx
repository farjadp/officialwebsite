"use client"

// ============================================================================
// File Path: src/components/v3/intro/flip-glossary.tsx
// Why: The technical words a reader meets on the rest of the site, each on a
//      card that turns over to its everyday meaning. A card is a button, so
//      it flips on tap, click, Enter or Space.
// Env / Identity: Client Component
// ============================================================================

import { motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useState } from "react"

const WORDS = [
  { term: "وب‌سایت", en: "Website", body: "آدرس شما در اینترنت. جایی که مشتری قبل از تماس، شما را می‌سنجد و تصمیم می‌گیرد." },
  { term: "اتوماسیون", en: "Automation", body: "کاری که قبلاً دستی انجام می‌دادید، حالا خودش انجام می‌شود. مثل قبض‌هایی که خودکار پرداخت می‌شوند." },
  { term: "هوش مصنوعی", en: "AI", body: "نرم‌افزاری مثل ChatGPT که می‌خواند، می‌نویسد و جواب می‌دهد. ابزار است، نه جادو." },
  { term: "چت‌بات", en: "Chatbot", body: "دستیاری روی سایت یا اینستاگرام که به سؤال مشتری‌ها جواب می‌دهد، حتی نصفه‌شب." },
  { term: "ایجنت", en: "AI Agent", body: "چت‌باتی که فقط حرف نمی‌زند؛ کار هم انجام می‌دهد: وقت رزرو می‌کند، فاکتور می‌فرستد، فرم پر می‌کند." },
  { term: "CRM", en: "Customer Relationship Management", body: "دفترچه‌ی مشتری‌ها، ولی هوشمند: کی خرید کرده، کی باید پیگیری شود، چه گفته‌ایم." },
  { term: "API", en: "Application Programming Interface", body: "راهی که دو نرم‌افزار با هم حرف می‌زنند. مثلاً سایت شما و نرم‌افزار حسابداری‌تان." },
  { term: "سئو", en: "SEO", body: "کارهایی که باعث می‌شود وقتی کسی در گوگل «نانوایی نزدیک من» را جست‌وجو می‌کند، شما را پیدا کند." },
]

export function FlipGlossary() {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const reduce = useReducedMotion()

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {WORDS.map((w, i) => {
        const on = !!flipped[i]
        return (
          <li key={w.term} className="perspective-distant">
            <button
              onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
              aria-pressed={on}
              aria-label={`${w.term}: ${on ? w.body : "برای دیدن معنی بزنید"}`}
              className="relative block h-60 w-full text-start"
            >
              <motion.span
                className="relative block h-full w-full transform-3d"
                animate={{ rotateY: on ? 180 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* front */}
                <span className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-v3-line bg-v3-raise p-6 backface-hidden transition-colors hover:border-v3-light/60">
                  <span className="text-xs text-v3-mute" dir="ltr" lang="en">
                    {w.en}
                  </span>
                  <span className="font-v3-display text-3xl text-v3-bone">{w.term}</span>
                  <span className="text-sm text-v3-light">بزنید تا معنی ساده‌اش را ببینید</span>
                </span>
                {/* back */}
                <span className="absolute inset-0 flex rotate-y-180 flex-col justify-between rounded-2xl border border-v3-light/60 bg-v3-light/10 p-6 backface-hidden">
                  <span className="text-lg leading-loose text-v3-bone">{w.body}</span>
                  <span className="flex items-center gap-1.5 text-xs text-v3-mute">
                    <RotateCcw className="h-3 w-3" aria-hidden />
                    {w.term}
                  </span>
                </span>
              </motion.span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
