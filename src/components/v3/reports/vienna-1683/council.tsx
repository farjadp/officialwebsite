"use client"

// ============================================================================
// File Path: src/components/v3/reports/vienna-1683/council.tsx
// Why: "You are Kara Mustafa": the five decisions he actually made, played
//      one at a time. Each pick shows the option it gives up (opportunity
//      cost) and then what history did. The meter scores how often the
//      player protected the scarce resource (time, and cover against the
//      second threat): the lesson's measure, not a counterfactual.
// Env / Identity: Client Component (framer-motion)
// ============================================================================

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { RotateCcw, ScrollText, Swords } from "lucide-react"
import { useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"
import { DILEMMAS } from "./data"
import { medal } from "./medals"
import { dg } from "./widgets"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function WarCouncil({ locale }: { locale: Locale }) {
  const t = COPY[locale].council
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [picks, setPicks] = useState<(0 | 1 | null)[]>(DILEMMAS.map(() => null))
  const done = step >= DILEMMAS.length
  const score = picks.reduce<number>((s, p, i) => s + (p === DILEMMAS[i].protects ? 1 : 0), 0)
  const answered = picks.filter((p) => p !== null).length
  const verdict = score <= 1 ? 0 : score <= 3 ? 1 : 2

  const pick = (o: 0 | 1) => {
    if (picks[step] !== null) return
    setPicks((p) => p.map((v, i) => (i === step ? o : v)))
  }
  const next = () => {
    if (step + 1 >= DILEMMAS.length) medal("council")
    setStep((s) => s + 1)
  }
  const restart = () => {
    setStep(0)
    setPicks(DILEMMAS.map(() => null))
  }

  const d = DILEMMAS[Math.min(step, DILEMMAS.length - 1)]
  const c = t.dilemmas[d.key]
  const chosen = picks[step]

  return (
    <div className="overflow-hidden rounded-3xl border border-v3-line bg-v3-ink">
      <div className="flex flex-wrap items-center gap-4 border-b border-v3-line bg-v3-raise px-5 py-4 md:px-7">
        <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-v3-light text-v3-light">
          <Swords className="h-5 w-5" aria-hidden />
        </span>
        <p className="min-w-0 flex-1 text-sm leading-relaxed text-v3-soft rtl:leading-loose">{t.youAre}</p>
        <div className="flex w-full flex-col gap-1.5 sm:w-56">
          <span className="text-xs text-v3-mute">{t.meter}</span>
          <div className="flex gap-1" aria-hidden>
            {DILEMMAS.map((x, i) => (
              <span
                key={x.key}
                className={`h-2 flex-1 rounded-full transition-colors ${picks[i] === null ? "bg-v3-line" : picks[i] === x.protects ? "bg-v3-light" : "bg-v3-mute/60"}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[24rem] px-5 py-7 md:px-8">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, x: locale === "fa" ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: locale === "fa" ? 30 : -30 }}
              transition={{ duration: 0.35, ease: ARRIVE }}
              className="flex flex-col gap-6"
            >
              <p className="text-xs tabular-nums text-v3-mute">{t.step(dg(String(step + 1), locale), dg(String(DILEMMAS.length), locale))}</p>
              <p className="max-w-3xl font-v3-display text-3xl leading-snug text-v3-bone">{c.q}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {([0, 1] as const).map((o) => {
                  const mine = chosen === o
                  const isHistory = d.history === o
                  return (
                    <motion.button
                      key={o}
                      type="button"
                      disabled={chosen !== null}
                      onClick={() => pick(o)}
                      whileHover={chosen !== null || reduce ? undefined : { y: -3 }}
                      whileTap={chosen !== null || reduce ? undefined : { scale: 0.98 }}
                      className={`flex flex-col gap-3 rounded-2xl border-2 p-5 text-start transition-colors ${
                        mine ? "border-v3-light bg-v3-light/10" : chosen !== null ? "border-v3-line opacity-70" : "border-v3-line bg-v3-raise hover:border-v3-light/70"
                      }`}
                    >
                      <span className="text-lg text-v3-bone">{c.options[o]}</span>
                      {chosen !== null && (
                        <motion.span initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1 text-sm">
                          <span className="text-xs text-v3-mute">{t.cost}</span>
                          <span className="text-v3-soft">{c.cost[o]}</span>
                        </motion.span>
                      )}
                      {chosen !== null && isHistory && (
                        <span className="flex items-center gap-1.5 self-start rounded-full border border-v3-mute/60 px-2.5 py-0.5 text-xs text-v3-mute">
                          <ScrollText className="h-3 w-3" aria-hidden /> {t.history}
                        </span>
                      )}
                    </motion.button>
                  )
                })}
              </div>
              {chosen !== null && (
                <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-3xl flex-col gap-4">
                  <div className="rounded-2xl border border-v3-line bg-v3-raise p-4" role="status">
                    <p className="flex items-center gap-2 text-sm font-semibold text-v3-light">
                      <ScrollText className="h-4 w-4" aria-hidden /> {t.history}
                    </p>
                    <p className="mt-1 leading-relaxed text-v3-soft rtl:leading-loose">{c.history}</p>
                  </div>
                  <button type="button" onClick={next} autoFocus className="self-start rounded-full bg-v3-light px-5 py-2.5 text-sm font-semibold text-v3-ink">
                    {step + 1 >= DILEMMAS.length ? t.finish : t.next}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div key="done" initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-start gap-5">
              <motion.p
                initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 13 }}
                className="font-v3-display text-7xl tabular-nums text-v3-light drop-shadow-[0_0_40px_rgb(var(--v3-glow)/0.5)]"
              >
                {dg(String(score), locale)}/{dg(String(DILEMMAS.length), locale)}
              </motion.p>
              <p className="text-lg text-v3-bone">{t.result(dg(String(score), locale), dg(String(answered), locale))}</p>
              <p className="max-w-3xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">{t.verdicts[verdict]}</p>
              <p className="max-w-3xl text-sm leading-relaxed text-v3-mute rtl:leading-loose">{t.lesson}</p>
              <button type="button" onClick={restart} className="flex items-center gap-2 rounded-full border border-v3-line px-5 py-2.5 text-sm text-v3-bone hover:border-v3-light">
                <RotateCcw className="h-4 w-4" aria-hidden /> {t.restart}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
