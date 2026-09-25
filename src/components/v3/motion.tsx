"use client"

// ============================================================================
// File Path: src/components/v3/motion.tsx
// Why: The v3 motion primitives, shared by the home and every v3 page. Pages stay server components
//      so every word is in the HTML; only these pieces run in the browser.
//      All of them respect prefers-reduced-motion and render their final,
//      readable state on the server.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import Link from "next/link"
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Locale, Role } from "@/components/home/v3/copy"
import { localDigits } from "@/lib/digits"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const ROTATE_MS = 6000
export function Arrow({ locale, className }: { locale: Locale; className?: string }) {
  const Icon = locale === "fa" ? ArrowLeft : ArrowRight
  return <Icon className={className} aria-hidden />
}

/**
 * The hero. Three roles, one visible at a time. It rotates on its own every
 * six seconds with a progress bar under the active tab, and stops for good
 * the moment a visitor chooses a tab — after that the page is theirs.
 * Hovering or focusing the hero pauses the rotation without ending it.
 */
export function RoleSwitcher({
  roles,
  label,
  locale,
}: {
  roles: Role[]
  label: string
  locale: Locale
}) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [chosen, setChosen] = useState(false)
  const [hovering, setHovering] = useState(false)
  const running = !chosen && !hovering && !reduce

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => setActive((i) => (i + 1) % roles.length), ROTATE_MS)
    return () => window.clearTimeout(id)
  }, [running, active, roles.length])

  const role = roles[active]

  return (
    <div
      className="flex flex-col gap-9"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div role="tablist" aria-label={label} className="grid grid-cols-3 gap-4 md:gap-5">
        {roles.map((r, i) => {
          const selected = i === active
          return (
            <button
              key={r.key}
              type="button"
              role="tab"
              id={`v3-tab-${r.key}`}
              aria-selected={selected}
              aria-controls="v3-role-panel"
              onClick={() => {
                setActive(i)
                setChosen(true)
              }}
              className={`group flex min-h-11 flex-col gap-2.5 text-start text-[13px] font-medium transition-colors md:text-[15px] ${
                selected ? "text-v3-bone" : "text-v3-mute hover:text-v3-bone"
              }`}
            >
              <span>
                <span className="me-2 hidden tabular-nums text-v3-mute sm:inline">
                  {localDigits(`0${i + 1}`, locale)}
                </span>
                {r.tab}
              </span>
              <span className="relative block h-0.5 overflow-hidden bg-v3-line" aria-hidden>
                {selected && (
                  <span
                    // Re-keyed on every change so the fill restarts.
                    key={`${active}-${running}`}
                    className={`absolute inset-0 origin-left bg-v3-light rtl:origin-right ${
                      running ? "v3-fill" : ""
                    }`}
                  />
                )}
              </span>
            </button>
          )
        })}
      </div>

      <div
        id="v3-role-panel"
        role="tabpanel"
        aria-labelledby={`v3-tab-${role.key}`}
        aria-live={chosen ? "polite" : "off"}
        className="grid min-h-[430px] md:min-h-[400px]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={role.key}
            className="col-start-1 row-start-1 flex flex-col gap-7"
            initial={reduce ? false : "hidden"}
            animate="shown"
            exit={reduce ? undefined : "gone"}
            variants={{
              hidden: {},
              shown: { transition: { staggerChildren: 0.09 } },
              gone: { opacity: 0, y: -12, transition: { duration: 0.25 } },
            }}
          >
            <motion.h1
              variants={RISE}
              className="font-v3-display text-[clamp(2.6rem,5.4vw,4.9rem)] font-light leading-[1.04] tracking-[-0.02em] rtl:font-light rtl:leading-[1.45] rtl:tracking-[-0.01em]"
            >
              {role.headline}
              <em className="text-v3-light not-italic ltr:italic">{role.accent}</em>
            </motion.h1>
            <motion.p variants={RISE} className="max-w-xl text-lg leading-relaxed text-v3-soft rtl:leading-loose">
              {role.body}
            </motion.p>
            <motion.ul variants={RISE} className="flex flex-wrap gap-2.5 text-[13px] text-v3-soft">
              {role.proof.map((p) => (
                <li key={p} className="rounded-full border border-v3-line px-3 py-1.5">
                  {p}
                </li>
              ))}
            </motion.ul>
            <motion.div variants={RISE} className="flex flex-wrap items-center gap-3">
              <Link
                href={role.cta.href}
                className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-v3-bone px-7 py-4 font-semibold text-v3-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                {role.cta.label}
                <Arrow locale={locale} className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link
                href={role.secondary.href}
                className="inline-flex min-h-12 items-center px-4 py-4 text-v3-bone underline decoration-v3-line underline-offset-8 transition-colors hover:text-v3-light hover:decoration-v3-light"
              >
                {role.secondary.label}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

const RISE = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ARRIVE } },
}

/**
 * A small pool of light that follows the pointer across its parent. Written
 * straight to CSS variables so moving the mouse never re-renders React.
 */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    const host = el?.parentElement
    if (!el || !host || reduce) return
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      el.style.setProperty("--x", `${e.clientX - r.left}px`)
      el.style.setProperty("--y", `${e.clientY - r.top}px`)
      el.style.setProperty("--o", "1")
    }
    const leave = () => el.style.setProperty("--o", "0")
    host.addEventListener("pointermove", move)
    host.addEventListener("pointerleave", leave)
    return () => {
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
    }
  }, [reduce])

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-[var(--o,0)] transition-opacity duration-700 [background:radial-gradient(420px_circle_at_var(--x,50%)_var(--y,50%),rgba(232,196,138,0.08),transparent_70%)] ${className ?? ""}`}
    />
  )
}

/** Counts to its value the first time it is seen; the final value is SSR'd. */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  locale,
  className,
}: {
  to: number
  prefix?: string
  suffix?: string
  locale: Locale
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
      duration: 1.6,
      ease: ARRIVE,
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [armed, inView, to])

  return (
    <span ref={ref} className={className} dir="ltr">
      {prefix}
      {localDigits(value, locale)}
      {suffix}
    </span>
  )
}

/** In-view rise for content below the fold. */
export function Reveal({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** Animate on mount instead of on scroll — for content at the top of a page. */
  immediate?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "0px 0px -12% 0px" } })}
      transition={{ duration: 0.75, delay, ease: ARRIVE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * The record. A rule of light draws down the ledger as it scrolls past —
 * the scroll is the passage of time.
 */
export function LightRule({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const scaleY = useTransform(smooth, [0, 1], [0, 1])
  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <div className="absolute inset-y-0 start-[4.5rem] md:start-[7.5rem]" aria-hidden>
        <div className="absolute inset-0 w-px bg-v3-line" />
        <motion.div
          className="absolute inset-0 w-px origin-top bg-v3-light shadow-[0_0_12px_rgba(232,196,138,0.6)]"
          style={{ scaleY: reduce ? 1 : scaleY }}
        />
      </div>
      {children}
    </div>
  )
}

/** A photograph that drifts a little slower than the page. */
export function Parallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"])
  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div className="absolute -inset-y-[8%] inset-x-0" style={{ y: reduce ? 0 : y }}>
        {children}
      </motion.div>
    </div>
  )
}
