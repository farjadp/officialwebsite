"use client"

// ============================================================================
// File Path: src/components/layout/footer-motion.tsx
// Why: The footer's two live pieces. The wordmark rises into view and a
//      slow band of light passes across its letters; the clock shows the
//      real time in Toronto rather than the time the page was cached.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function FooterWordmark({ text }: { text: string }) {
    const reduce = useReducedMotion()
    return (
        <div className="overflow-hidden" aria-hidden>
            <motion.p
                initial={reduce ? false : { y: "60%", opacity: 0 }}
                whileInView={{ y: "0%", opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                transition={{ duration: 1.2, ease: ARRIVE }}
                className="v3-wordmark select-none whitespace-nowrap font-v3-display text-[clamp(5rem,21vw,20rem)] font-light leading-[0.85] tracking-[-0.04em] rtl:leading-[1.2] rtl:tracking-normal"
            >
                {text}
            </motion.p>
        </div>
    )
}

export function TorontoTime({ label }: { label: string }) {
    const [time, setTime] = useState<string | null>(null)

    useEffect(() => {
        const fmt = new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Toronto",
            timeZoneName: "short",
        })
        const tick = () => setTime(fmt.format(new Date()))
        tick()
        const id = window.setInterval(tick, 30_000)
        return () => window.clearInterval(id)
    }, [])

    return (
        <span className="inline-flex items-center gap-2">
            <span>{label}</span>
            <span dir="ltr" className="tabular-nums text-v3-soft">
                {time ?? "--:--"}
            </span>
        </span>
    )
}
