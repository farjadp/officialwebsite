"use client"

// ============================================================================
// File Path: src/components/v3/reports/vienna-1683/charge.tsx
// Why: The Battle of the Kahlenberg, 12 September 1683, as a scroll-driven
//      schematic: the reader's scroll is the day. The heights in the west,
//      the Danube in the north, the city and the Ottoman camp in the plain.
//      The left wing comes down first, then the great cavalry charge, then
//      the camp breaks. A schematic, not a survey map: positions are
//      relative, after the standard accounts (Stoye, Wheatcroft).
// Env / Identity: Client Component (framer-motion useScroll)
// ============================================================================

import { motion, type MotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import type { Locale } from "@/lib/nav"
import { COPY } from "./copy"

const TENTS = Array.from({ length: 14 }, (_, i) => {
  const a = (-0.95 + (i / 13) * 1.9) * (Math.PI / 2)
  return { x: 560 - Math.cos(a) * 150, y: 250 + Math.sin(a) * 120, d: i }
})

export function KahlenbergCharge({ locale }: { locale: Locale }) {
  const t = COPY[locale].charge
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.4 })
  const [beat, setBeat] = useState(reduce ? 3 : 0)
  useMotionValueEvent(p, "change", (v) => setBeat(v < 0.22 ? 0 : v < 0.45 ? 1 : v < 0.75 ? 2 : 3))

  const left = useTransform(p, [0.02, 0.3], [0, 1])
  const cav = useTransform(p, [0.45, 0.78], [0, 1])
  const camp = useTransform(p, [0.72, 0.92], [1, 0.12])
  const scatter = useTransform(p, [0.72, 0.95], [0, 40])
  const glow = useTransform(p, [0.85, 1], [0, 1])
  const leftHead = useTransform(p, [0.27, 0.3], [0, 1])
  const cavHead = useTransform(p, [0.74, 0.78], [0, 1])
  const sky = useTransform(p, [0, 1], [0.15, 0.55])

  const L = reduce ? 1 : left
  const Cv = reduce ? 1 : cav

  return (
    <div ref={ref} className={reduce ? "" : "relative h-[320vh]"}>
      <div className={reduce ? "" : "sticky top-16 flex min-h-[calc(100vh-4rem)] items-center"}>
        <div className="grid w-full gap-4 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="relative overflow-hidden rounded-3xl border border-v3-line bg-v3-raise lg:col-span-8">
            <svg viewBox="0 0 800 460" className="block h-auto w-full" direction="ltr" role="img" aria-label={t.title}>
              <motion.rect width="800" height="460" className="fill-v3-light" style={{ opacity: reduce ? 0.2 : sky }} />
              <rect width="800" height="460" className="fill-v3-ink" opacity={0.82} />
              {/* The Danube */}
              <path d="M160,0 C260,60 380,70 520,110 S720,170 800,150" className="fill-none stroke-v3-mute/50" strokeWidth={14} strokeLinecap="round" />
              {/* The heights of the Vienna Woods */}
              {[0, 1, 2, 3].map((i) => (
                <path key={i} d={`M0,${70 + i * 70} C${70 + i * 10},${40 + i * 70} ${170 + i * 10},${60 + i * 70} ${250 - i * 10},${120 + i * 75}`} className="fill-none stroke-v3-bone/25" strokeWidth={2} />
              ))}
              <text x="40" y="34" className="fill-v3-soft text-[15px]">
                {locale === "fa" ? "کالنبرگ" : "Kahlenberg"}
              </text>
              {/* The city */}
              <polygon points="620,220 650,200 690,210 710,245 690,285 650,295 620,275 605,245" className="fill-v3-bone/15 stroke-v3-bone" strokeWidth={2} />
              <text x="700" y="120" className="fill-v3-mute text-[13px]">
                {locale === "fa" ? "دانوب" : "Danube"}
              </text>
              <text x="625" y="320" className="fill-v3-soft text-[15px]">
                {locale === "fa" ? "وین" : "Vienna"}
              </text>
              <motion.circle cx={660} cy={248} r={70} className="fill-none stroke-v3-light" strokeWidth={3} style={{ opacity: reduce ? 1 : glow }} />
              {/* The Ottoman camp */}
              {TENTS.map((tt) => (
                <Tent key={tt.d} x={tt.x} y={tt.y} i={tt.d} camp={camp} scatter={scatter} reduce={!!reduce} />
              ))}
              <text x="420" y="410" className="fill-v3-mute text-[14px]">
                {locale === "fa" ? "اردوی عثمانی" : "Ottoman camp"}
              </text>
              {/* Left wing, along the Danube */}
              <motion.path d="M230,110 C320,140 380,170 430,190" className="fill-none stroke-v3-bone" strokeWidth={6} strokeLinecap="round" style={{ pathLength: L }} />
              {/* Centre */}
              <motion.path d="M220,230 C300,235 350,240 410,245" className="fill-none stroke-v3-bone" strokeWidth={6} strokeLinecap="round" style={{ pathLength: L }} />
              {/* The great cavalry charge on the right */}
              <motion.path
                d="M120,380 C230,360 330,320 470,290"
                className="fill-none stroke-v3-light drop-shadow-[0_0_10px_rgb(var(--v3-glow)/0.9)]"
                strokeWidth={16}
                strokeLinecap="round"
                style={{ pathLength: Cv }}
              />
              <Head x={430} y={190} angle={22} size={14} tone="bone" show={reduce ? 1 : leftHead} />
              <Head x={410} y={245} angle={5} size={14} tone="bone" show={reduce ? 1 : leftHead} />
              <Head x={470} y={290} angle={-12} size={30} tone="light" show={reduce ? 1 : cavHead} />
            </svg>
          </div>
          <ol className="flex flex-col gap-3 lg:col-span-4">
            {t.beats.map((b, i) => (
              <motion.li
                key={b.time}
                animate={{ opacity: i <= beat ? 1 : 0.28 }}
                transition={{ duration: 0.4 }}
                className={`flex flex-col gap-1 rounded-2xl border p-4 ${i === beat ? "border-v3-light/60 bg-v3-light/10" : "border-v3-line max-lg:hidden"}`}
              >
                <span className="text-xs text-v3-light">{b.time}</span>
                <span className="leading-relaxed text-v3-bone rtl:leading-loose">{b.text}</span>
              </motion.li>
            ))}
            <li className="text-xs leading-relaxed text-v3-mute max-lg:hidden rtl:leading-loose">{t.scale}</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

/** One tent; it drifts east by a slightly different amount as the camp breaks. */
function Tent({ x, y, i, camp, scatter, reduce }: { x: number; y: number; i: number; camp: MotionValue<number>; scatter: MotionValue<number>; reduce: boolean }) {
  const dx = useTransform(scatter, (v) => v * (0.6 + (i % 5) * 0.15))
  return (
    <motion.path
      d={`M${x - 9},${y + 7} L${x},${y - 9} L${x + 9},${y + 7} Z`}
      className="fill-v3-mute"
      style={{ opacity: reduce ? 0.3 : camp, x: reduce ? 0 : dx }}
    />
  )
}

/** An arrowhead at (x, y) pointing along `angle` degrees; fades in when its line arrives. */
function Head({ x, y, angle, size, tone, show }: { x: number; y: number; angle: number; size: number; tone: "light" | "bone"; show: MotionValue<number> | number }) {
  return (
    <motion.polygon
      points={`0,0 ${-size},${-size * 0.55} ${-size * 0.7},0 ${-size},${size * 0.55}`}
      transform={`translate(${x} ${y}) rotate(${angle})`}
      className={tone === "light" ? "fill-v3-light" : "fill-v3-bone"}
      style={{ opacity: show }}
    />
  )
}
