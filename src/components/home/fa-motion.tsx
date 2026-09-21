"use client"

// ============================================================================
// File Path: src/components/home/fa-motion.tsx
// Why: Motion primitives for the Persian home page. The page itself stays a
//      server component so every word is in the HTML; only these leaves run
//      on the client. One motion idea carries the page: a single vertical
//      rule — the record — that draws itself from the hero down through the
//      dated ledger. Everything else is quiet feedback.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  animate,
} from "framer-motion"
import { useEffect, useRef, useState, type ReactNode } from "react"

// Confident arrival, exit faster than entrance. No bounce anywhere.
const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * The hero's authored moment. Children reveal in sequence: each line of the
 * headline is unmasked from its baseline, then the copy, then the CTA.
 * Pass `i` to control order; the stagger is capped so the page never waits.
 */
export function HeroLine({
  children,
  i = 0,
  className,
}: {
  children: ReactNode
  i?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block"
        // Same unit on both ends: framer cannot tween "110%" → 0, and left
        // the headline stuck at its server-rendered initial state.
        initial={reduce ? false : { y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.12 + i * 0.11, ease: ARRIVE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** Fade + rise on load, used for the hero's supporting elements. */
export function HeroFade({
  children,
  delay = 0.5,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: ARRIVE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * The portrait arrives as a photograph being developed: blurred and dim,
 * then sharp. Blur is bounded to keep the compositor happy.
 */
export function Develop({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, filter: "blur(14px)", scale: 1.03 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 1.1, delay: 0.25, ease: ARRIVE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * In-view reveal for content below the fold. Deliberately plain — the
 * hero owns the choreography; sections should simply be present.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: "div" | "li" | "section" | "figure"
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.65, delay, ease: ARRIVE }}
    >
      {children}
    </Tag>
  )
}

/**
 * The record. A vertical rule that draws down as the ledger scrolls into
 * view — the one piece of scroll-driven motion, because the scroll IS the
 * passage of time here.
 */
export function DrawnRule({
  children,
  ruleClassName,
  className,
}: {
  children: ReactNode
  ruleClassName?: string
  className?: string
}) {
  // The wrapper is both the scroll target and the positioned ancestor the
  // rule is measured against — useScroll warns otherwise.
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const scaleY = useTransform(smooth, [0, 1], [0, 1])
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <div className={`absolute inset-y-0 ${ruleClassName ?? ""}`} aria-hidden>
        <div className="absolute inset-0 w-px bg-white/10" />
        <motion.div
          className="absolute inset-0 w-px origin-top bg-emerald-400"
          style={{ scaleY: reduce ? 1 : scaleY }}
        />
      </div>
      {children}
    </div>
  )
}

/**
 * A number that counts to its value the first time it is seen. Renders the
 * final value on the server so the figure is in the HTML for crawlers and
 * for anyone with motion disabled.
 */
export function CountUp({
  to,
  suffix = "",
  className,
}: {
  to: number
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(to)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (reduce) return
    setValue(0)
    setArmed(true)
  }, [reduce])

  useEffect(() => {
    if (!armed || !inView) return
    const controls = animate(0, to, {
      duration: 1.4,
      ease: ARRIVE,
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [armed, inView, to])

  return (
    <span ref={ref} className={className} dir="ltr">
      {toPersianDigits(value)}
      {suffix}
    </span>
  )
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]
export function toPersianDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)])
}
