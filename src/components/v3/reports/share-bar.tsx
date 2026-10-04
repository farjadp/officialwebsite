"use client"

// ============================================================================
// File Path: src/components/v3/reports/share-bar.tsx
// Why: The share row at the foot of every report. Lifted out of report 01 so
//      the second report does not carry a second copy of it.
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react"
import type { Locale } from "@/lib/nav"

const COPY = {
  en: { share: "Share this report", copy: "Copy link", copied: "Link copied" },
  fa: { share: "این گزارش را به اشتراک بگذارید", copy: "کپی لینک", copied: "لینک کپی شد" },
}

export function ShareBar({ locale, url, title }: { locale: Locale; url: string; title: string }) {
  const t = COPY[locale]
  const [copied, setCopied] = useState(false)
  const u = encodeURIComponent(url)
  const tx = encodeURIComponent(title)
  const links = [
    { label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${tx}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "X", href: `https://x.com/intent/post?url=${u}&text=${tx}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${tx}%20${u}` },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm text-v3-mute">{t.share}</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copy}
          className="min-h-11 rounded-full bg-v3-bone px-5 text-sm font-semibold text-v3-ink transition-colors hover:bg-v3-light"
          aria-live="polite"
        >
          {copied ? t.copied : t.copy}
        </button>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border border-v3-line px-5 text-sm text-v3-soft transition-colors hover:border-v3-light hover:text-v3-light"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  )
}
