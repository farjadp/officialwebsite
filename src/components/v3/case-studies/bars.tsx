"use client"

// ============================================================================
// File: src/components/v3/case-studies/bars.tsx
// Role: A horizontal bar list that grows into place the first time it is
//       seen. The final widths are server-rendered, so it reads correctly
//       without JavaScript and with reduced motion.
// ============================================================================

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"

export type Bar = { label: string; value: number; display: string; highlight?: boolean }

export function Bars({ bars, max }: { bars: Bar[]; max?: number }) {
    const ref = useRef<HTMLUListElement>(null)
    const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
    const reduce = useReducedMotion()
    const [armed, setArmed] = useState(false)
    useEffect(() => {
        if (!reduce) setArmed(true)
    }, [reduce])

    const top = max ?? Math.max(...bars.map((b) => b.value))
    return (
        <ul ref={ref} className="flex flex-col gap-4">
            {bars.map((b, i) => {
                const width = `${Math.max(1.5, (b.value / top) * 100)}%`
                return (
                    <li key={b.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2">
                        <span className="text-[15px] text-v3-soft">{b.label}</span>
                        <span className={`text-[15px] tabular-nums ${b.highlight ? "text-v3-light" : "text-v3-bone"}`}>{b.display}</span>
                        <span className="col-span-2 block h-2 overflow-hidden rounded-full bg-v3-line/50">
                            <span
                                className={`block h-full rounded-full transition-[width] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                    b.highlight ? "bg-v3-light shadow-[0_0_14px_rgb(var(--v3-glow)/0.6)]" : "bg-v3-bone/70"
                                }`}
                                style={{ width: armed && !inView ? "0%" : width, transitionDelay: `${i * 70}ms` }}
                            />
                        </span>
                    </li>
                )
            })}
        </ul>
    )
}
