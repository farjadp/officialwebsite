"use client"

// ============================================================================
// File Path: src/components/v3/reading-progress.tsx
// Why: A thin rule of light across the top of a long read. It sits under the
//      sticky header and follows it when it hides (.v3-under-header), and it
//      renders empty — not wrong — when motion is reduced.
// Env / Identity: Client Component (framer-motion)
// ============================================================================

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"

export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 })
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div
      aria-hidden
      className="v3-under-header pointer-events-none fixed inset-x-0 z-40 h-px origin-left bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.7)] rtl:origin-right"
      style={{ scaleX }}
    />
  )
}
