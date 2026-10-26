"use client"

// ============================================================================
// File Path: src/components/v3/playbooks/shared.tsx
// Why: The parts every playbook uses: copyable commands and prompts, the
//      boxed notes, the fix for Latin runs inside Persian text, and a
//      checklist whose ticks stay in the reader's browser. Lifted out of
//      playbook 01 when playbook 02 needed the same pieces.
// Env / Identity: Client Components (framer-motion)
// ============================================================================

import { motion } from "framer-motion"
import { Check, Copy } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import type { Locale } from "@/lib/nav"
import { localDigits } from "@/lib/digits"

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const LATIN = "font-(family-name:--font-instrument)! **:font-(family-name:--font-instrument)!"

const UI = {
  en: { copy: "Copy", copied: "Copied", copyPrompt: "Copy prompt", show: "Show all", hide: "Collapse" },
  fa: { copy: "کپی", copied: "کپی شد", copyPrompt: "کپی پرامپت", show: "نمایش کامل", hide: "بستن" },
}

export function useCopy(text: string) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return { copied, copy }
}

/** A command or two, left to right, with a copy button. */
export function CodeBlock({ code, locale, label }: { code: string; locale: Locale; label?: string }) {
  const { copied, copy } = useCopy(code)
  const t = UI[locale]
  return (
    <div className="overflow-hidden rounded-xl border border-v3-line/80 bg-v3-raise">
      <div className="flex items-center justify-between gap-3 border-b border-v3-line/60 px-4 py-2">
        <span className="text-xs text-v3-mute">{label}</span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs text-v3-soft transition-colors hover:text-v3-light"
        >
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <pre dir="ltr" className={`overflow-x-auto px-4 py-4 text-left font-mono text-[13px] leading-relaxed text-v3-bone ${LATIN}`}>
        <code className="font-mono!">{code}</code>
      </pre>
    </div>
  )
}

const LATIN_RUN = /([A-Za-z0-9#~/.@:_\-+=→"'*×°()]*[A-Za-z0-9][A-Za-z0-9#~/.@:_\-+=→"'*×°()]*(?:[ ]+[A-Za-z0-9#~/.@:_\-+=→"'*×°]+)*)/

export function Mixed({ text, locale }: { text: string; locale: Locale }) {
  if (locale !== "fa") return <>{text}</>
  return (
    <>
      {text.split(LATIN_RUN).map((part, i) =>
        i % 2 === 1 ? (
          <bdi key={i} dir="ltr" className="font-(family-name:--font-instrument)!">
            {part}
          </bdi>
        ) : (
          part
        ),
      )}
    </>
  )
}

/** A long prompt: folded to a few lines until opened, always copyable whole. */
export function PromptBox({ text, locale, title }: { text: string; locale: Locale; title: string }) {
  const { copied, copy } = useCopy(text)
  const [open, setOpen] = useState(false)
  const t = UI[locale]
  return (
    <div className="overflow-hidden rounded-2xl border border-v3-light/40 bg-v3-raise shadow-[0_0_60px_-30px_rgb(var(--v3-glow)/0.5)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-v3-line/60 px-5 py-3">
        <span className="text-sm text-v3-light">{title}</span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-v3-bone px-5 text-sm font-semibold text-v3-ink transition-colors hover:bg-v3-light"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? t.copied : t.copyPrompt}
        </button>
      </div>
      <div className="relative">
        <pre
          className={`whitespace-pre-wrap px-5 py-5 font-v3-body text-[15px] leading-relaxed text-v3-soft rtl:leading-loose ${open ? "" : "max-h-72 overflow-hidden"}`}
        >
          {text.split("\n").map((line, i) => (
            <span key={i} className="block min-h-[1lh]">
              <Mixed text={line} locale={locale} />
            </span>
          ))}
        </pre>
        {!open && <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-v3-raise to-transparent" />}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full border-t border-v3-line/60 px-5 py-3 text-sm text-v3-soft transition-colors hover:text-v3-light"
      >
        {open ? t.hide : t.show}
      </button>
    </div>
  )
}

export function Checklist({
  items,
  storeKey,
  reset,
  locale,
}: {
  items: string[]
  /** localStorage key; one per playbook. */
  storeKey: string
  reset: string
  locale: Locale
}) {
  const t = { items }
  const [done, setDone] = useState<boolean[]>(() => t.items.map(() => false))

  // Read after mount so the server HTML and the first client render agree.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storeKey)
      if (!raw) return
      const saved = JSON.parse(raw) as unknown
      if (Array.isArray(saved)) setDone(t.items.map((_, i) => saved[i] === true))
    } catch {
      // Storage blocked or corrupt: start empty.
    }
  }, [t.items, storeKey])

  const save = (next: boolean[]) => {
    setDone(next)
    try {
      window.localStorage.setItem(storeKey, JSON.stringify(next))
    } catch {
      // Private mode: ticks last for this visit only.
    }
  }

  const count = done.filter(Boolean).length
  const pct = count / t.items.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-v3-light" aria-live="polite">
          {locale === "fa" ? `${localDigits(count, "fa")} از ${localDigits(t.items.length, "fa")} انجام شده` : `${count} of ${t.items.length} done`}
        </span>
        <button type="button" onClick={() => save(t.items.map(() => false))} className="min-h-11 text-sm text-v3-mute underline underline-offset-4 hover:text-v3-light">
          {reset}
        </button>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-v3-line">
        <motion.div
          className="h-full origin-left bg-v3-light shadow-[0_0_12px_rgb(var(--v3-glow)/0.8)] rtl:origin-right"
          animate={{ scaleX: pct }}
          initial={false}
          transition={{ duration: 0.6, ease: ARRIVE }}
        />
      </div>
      <ol className="grid gap-x-10 md:grid-cols-2">
        {t.items.map((item, i) => (
          <li key={i} className="border-b border-v3-line/60">
            <label className="flex cursor-pointer items-start gap-4 py-4">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={done[i]}
                onChange={() => save(done.map((v, j) => (j === i ? !v : v)))}
              />
              <span
                aria-hidden
                className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-v3-light ${done[i] ? "border-v3-light bg-v3-light text-v3-ink" : "border-v3-mute"}`}
              >
                {done[i] && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className={`leading-relaxed transition-colors rtl:leading-loose ${done[i] ? "text-v3-mute line-through decoration-v3-mute/60" : "text-v3-bone"}`}>
                <span className="me-2 tabular-nums text-v3-mute">{localDigits(i + 1, locale)}.</span>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** A short boxed note: "for Persian", "correction", "from experience". */
export function Note({ kind, title, children, locale }: { kind: "local" | "fix" | "lesson" | "warn"; title: string; children: ReactNode; locale?: Locale }) {
  const tone = {
    local: "border-v3-line/80 bg-v3-raise",
    fix: "border-v3-bone/40 bg-v3-raise",
    lesson: "border-v3-light/50 bg-v3-raise shadow-[0_0_60px_-30px_rgb(var(--v3-glow)/0.5)]",
    warn: "border-v3-light bg-v3-raise shadow-[0_0_80px_-30px_rgb(var(--v3-glow)/0.6)]",
  }[kind]
  return (
    <aside className={`flex flex-col gap-2 rounded-2xl border p-6 ${tone}`}>
      <span className={`text-sm ${kind === "fix" ? "text-v3-bone" : "text-v3-light"}`}>{title}</span>
      <div className="leading-relaxed text-v3-soft rtl:leading-loose">{locale && typeof children === "string" ? <Mixed text={children} locale={locale} /> : children}</div>
    </aside>
  )
}
