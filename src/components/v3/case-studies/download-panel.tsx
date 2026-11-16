// ============================================================================
// File: src/components/v3/case-studies/download-panel.tsx
// Role: The unmissable download on a gated report: a lit panel right under
//       the hero with the Excel button and Save-as-PDF, plus a floating Excel
//       button that stays on screen while the visitor reads.
// ============================================================================

import type { Locale } from "@/components/home/v3/copy"
import { Reveal } from "@/components/v3/kit"
import { PrintButton } from "./print-button"

export type DownloadCopy = { kicker: string; title: string; meta: string; button: string; note: string; floating: string }

function DownloadIcon({ className }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export function DownloadPanel({ href, t, printLabel }: { href: string; t: DownloadCopy; printLabel: string; locale: Locale }) {
    return (
        <section id="download" className="border-b border-v3-line/70 print:hidden">
            <div className="mx-auto w-full max-w-[1600px] px-5 py-10 md:px-10 md:py-14 lg:px-14">
                <Reveal immediate delay={0.2}>
                    <div className="relative isolate overflow-hidden rounded-3xl border border-v3-light/60 bg-v3-raise p-6 shadow-[0_0_90px_-30px_rgb(var(--v3-glow)/0.7)] md:p-10">
                        <div aria-hidden className="v3-beam pointer-events-none absolute -top-1/2 start-0 -z-10 h-[200%] w-72 bg-linear-to-r from-transparent via-v3-light/[0.10] to-transparent" />
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-start gap-5">
                                <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-v3-light text-xl font-bold text-v3-ink">
                                    X
                                </span>
                                <div className="flex flex-col gap-2">
                                    <p className="flex items-center gap-2 text-sm text-v3-light">
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-v3-light opacity-70" />
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-v3-light" />
                                        </span>
                                        {t.kicker}
                                    </p>
                                    <h2 className="font-v3-display text-3xl font-light leading-tight md:text-4xl rtl:leading-snug">{t.title}</h2>
                                    <p className="max-w-2xl text-[15px] leading-relaxed text-v3-soft rtl:leading-loose">{t.meta}</p>
                                    <p className="text-xs text-v3-mute">
                                        <span className="font-mono!" dir="ltr">belink-ecosystem-2026.xlsx</span> · {t.note}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 lg:shrink-0 lg:flex-col lg:items-stretch">
                                <a
                                    href={href}
                                    download
                                    rel="nofollow noreferrer"
                                    className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-v3-light px-8 py-4 text-lg font-semibold text-v3-ink shadow-[0_10px_40px_-10px_rgb(var(--v3-glow)/0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-bone"
                                >
                                    <DownloadIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
                                    {t.button}
                                </a>
                                <PrintButton label={printLabel} />
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

/** Stays in the corner while reading, so the file is never more than a tap away. */
export function FloatingDownload({ href, label }: { href: string; label: string }) {
    return (
        <a
            href={href}
            download
            rel="nofollow noreferrer"
            className="fixed bottom-5 end-5 z-40 inline-flex items-center gap-2 rounded-full bg-v3-light px-5 py-3.5 text-sm font-semibold text-v3-ink shadow-[0_10px_40px_-8px_rgb(var(--v3-glow)/0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-bone print:hidden"
        >
            <DownloadIcon className="h-4 w-4" />
            {label}
        </a>
    )
}
