"use client"

// ============================================================================
// File Path: src/components/v3/pages/portfolio-tabs.tsx
// Why: The one interactive piece of /portfolio — the category filter. Every
//      panel is rendered on the server and handed in as children, so all the
//      work is in the HTML; this only decides which panel is visible.
// Env / Identity: Client Component
// ============================================================================

import { useState, type ReactNode } from "react"

export function PortfolioTabs({
  labels,
  panels,
}: {
  labels: string[]
  panels: ReactNode[]
}) {
  const [active, setActive] = useState(0)

  return (
    <>
      <div className="sticky top-20 z-30 mb-16 md:top-24">
        <div className="inline-flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-full overflow-x-auto rounded-full border border-v3-line/80 bg-v3-ink/85 p-1.5 backdrop-blur-xl">
          <div className="flex min-w-max gap-1">
            {labels.map((label, i) => {
              const selected = i === active
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(i)}
                  className={`min-h-11 rounded-full px-5 text-sm font-medium transition-all duration-300 ${
                    selected ? "bg-v3-bone text-v3-ink" : "text-v3-mute hover:bg-v3-raise hover:text-v3-bone"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {panels.map((panel, i) => (
        <div key={labels[i]} hidden={i !== active}>
          {panel}
        </div>
      ))}
    </>
  )
}
