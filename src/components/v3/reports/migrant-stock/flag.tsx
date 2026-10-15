// ============================================================================
// File Path: src/components/v3/reports/migrant-stock/flag.tsx
// Why: A country's flag in report 05, sized to the surrounding text. Emoji
//      for every country except Iran: emoji fonts draw the Islamic Republic's
//      flag, and on this site Iran the country is shown with the Lion and Sun
//      (Farjad's rule). The regime's flag is used only where the subject is
//      the Islamic Republic itself, which this report never is.
// Env / Identity: Shared (server and client)
// ============================================================================

import { flag } from "./data"

export const IRAN_FLAG = "/images/flags/ir-lion-sun.webp"

export function CountryFlag({ iso, className }: { iso: string; className?: string }) {
  if (iso === "IR") {
    return (
      /* A tiny static image: next/image would add an optimiser request for no gain. */
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={IRAN_FLAG}
        alt=""
        aria-hidden
        width={1200}
        height={600}
        decoding="async"
        className={`inline-block h-[0.72em] w-auto shrink-0 rounded-[0.08em] align-[-0.05em] ring-1 ring-black/10 ${className ?? ""}`}
      />
    )
  }
  return (
    <span aria-hidden className={className}>
      {flag(iso)}
    </span>
  )
}
