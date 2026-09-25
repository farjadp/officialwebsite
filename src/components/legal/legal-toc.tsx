"use client"

// ============================================================================
// File Path: src/components/legal/legal-toc.tsx
// Why: The quiet table of contents beside a legal document. A small client
//      leaf on purpose — the page itself stays a server component, so every
//      word of the document is in the HTML whether or not this ever runs.
//      It highlights the section you are reading with an IntersectionObserver
//      (no scroll handler, no layout thrash) and collapses on narrow screens.
// Env / Identity: Client Component
// ============================================================================

import { useEffect, useState } from "react"
import { localDigits } from "@/lib/digits"

export type TocItem = { id: string; label: string }

export function LegalToc({
  items,
  label,
  locale,
}: {
  items: TocItem[]
  label: string
  locale: "en" | "fa"
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null)
    if (nodes.length === 0) return

    const seen = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.intersectionRatio)
        // The section nearest the top of the reading band wins.
        const visible = nodes.filter((node) => (seen.get(node.id) ?? 0) > 0)
        if (visible.length > 0) setActive(visible[0].id)
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label={label} className="v3-under-header lg:sticky">
      <p className="mb-4 hidden text-sm text-v3-light lg:block">{label}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-12 w-full items-center justify-between gap-4 rounded-full border border-v3-line px-5 py-3 text-start text-sm text-v3-soft transition-colors hover:border-v3-light hover:text-v3-bone lg:hidden"
      >
        <span>{label}</span>
        <span aria-hidden className="text-v3-light">
          {open ? "−" : "+"}
        </span>
      </button>

      <ol className={`${open ? "mt-4 flex" : "hidden"} flex-col gap-0.5 lg:mt-0 lg:flex`}>
        {items.map((item, i) => {
          const current = active === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                aria-current={current ? "true" : undefined}
                className={`flex gap-3 border-s py-2 ps-4 text-[13px] leading-relaxed transition-colors rtl:leading-loose ${
                  current
                    ? "border-v3-light text-v3-bone"
                    : "border-v3-line/70 text-v3-mute hover:border-v3-light/60 hover:text-v3-soft"
                }`}
              >
                <span className="tabular-nums text-v3-mute">{localDigits(`${i + 1}`.padStart(2, "0"), locale)}</span>
                <span>{item.label}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
