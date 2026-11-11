"use client"

// ============================================================================
// File Path: src/components/v3/reports/preview-motion.tsx
// Why: Plays the /reports previews as each card enters the screen. The page
//      is server-rendered with every chart finished; after hydration this
//      sets data-state="armed" (the start state) on each card and flips it to
//      "in" when the card is a fifth on screen, once. With reduced motion,
//      or before this runs, the finished chart is what the reader sees — no
//      row ever waits dimmed for a script.
// Env / Identity: Client Component
// ============================================================================

import { useEffect } from "react"

export function PreviewMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!("IntersectionObserver" in window)) return
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-preview-card]"))
    for (const c of cards) c.dataset.state = "armed"
    // Commit the start state before any card can be marked "in".
    void document.body.offsetHeight
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          ;(e.target as HTMLElement).dataset.state = "in"
          io.unobserve(e.target)
        }
      },
      { threshold: 0.2 },
    )
    for (const c of cards) io.observe(c)
    return () => io.disconnect()
  }, [])
  return null
}
