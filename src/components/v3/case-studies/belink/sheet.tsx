// ============================================================================
// File: src/components/v3/case-studies/belink/sheet.tsx
// Role: The ten sample rows drawn as a spreadsheet — column letters, row
//       numbers, a formula bar and a lit cell — in the v3 palette. The teaser
//       shows the first rows under a fade; the full report shows all ten.
//       Contacts are already masked in sample.ts.
// ============================================================================

import type { Locale } from "@/components/home/v3/copy"
import { Kicker, Reveal } from "@/components/v3/kit"
import { COPY } from "./copy"
import { SECTORS } from "./data"
import { SAMPLE_ROWS } from "./sample"

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"]
const SOCIAL = { linkedin: "in", instagram: "ig", telegram: "tg" } as const

/** Belink's labels vary in spacing and half-spaces; compare without them. */
const norm = (v: string) => v.replace(/[\s\u200c]+/g, "")

function sectorLabel(fa: string, locale: Locale) {
    if (locale === "fa") return fa
    return SECTORS.find((s) => norm(s.fa) === norm(fa))?.en ?? fa
}

function num(n: number, locale: Locale) {
    return locale === "fa" ? String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]) : String(n)
}

export function BelinkSampleSheet({ locale, limit }: { locale: Locale; limit?: number }) {
    const t = COPY[locale].sheet
    const rows = limit ? SAMPLE_ROWS.slice(0, limit) : SAMPLE_ROWS
    const cols = [t.cols.name, t.cols.sector, t.cols.year, t.cols.website, t.cols.email, t.cols.phone, t.cols.social]
    const cell = "border-e border-b border-v3-line/60 px-3 py-2.5 whitespace-nowrap"

    return (
        <section className="border-b border-v3-line/70">
            <div className="mx-auto w-full max-w-[1600px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
                <Reveal className="mb-12 flex max-w-3xl flex-col gap-4 md:mb-16">
                    <Kicker>{t.kicker}</Kicker>
                    <h2 className="font-v3-display text-4xl font-light leading-tight md:text-6xl rtl:leading-snug">{t.title}</h2>
                    <p className="text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{t.lead}</p>
                </Reveal>

                <Reveal delay={0.08}>
                    <div className="overflow-hidden rounded-2xl border border-v3-line/80 bg-v3-raise shadow-[0_40px_120px_-60px_rgb(var(--v3-glow)/0.45)]">
                        {/* Title bar */}
                        <div className="flex items-center justify-between gap-4 border-b border-v3-line/70 px-4 py-3">
                            <span className="flex items-center gap-3 text-sm text-v3-soft">
                                <span aria-hidden className="grid h-6 w-6 place-items-center rounded-md bg-v3-light/90 text-[11px] font-bold text-v3-ink">X</span>
                                <span dir="ltr">{t.file}</span>
                            </span>
                            <span className="rounded-full border border-v3-line px-3 py-1 text-xs text-v3-light">
                                {num(SAMPLE_ROWS.length, locale)} / {new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(13636)}
                            </span>
                        </div>
                        {/* Formula bar */}
                        <div className="flex items-center gap-3 border-b border-v3-line/70 px-4 py-2 font-mono text-xs text-v3-mute" dir="ltr">
                            <span className="border-e border-v3-line/70 pe-3 text-v3-soft">A1</span>
                            <span className="italic text-v3-light">fx</span>
                            <span className="truncate font-mono!">=FILTER(belink, ISNUMBER(MATCH(sector, TOP10, 0)))</span>
                        </div>

                        <div className="relative overflow-x-auto">
                            <table className="w-full min-w-[880px] border-collapse text-start text-sm tabular-nums">
                                <thead>
                                    <tr className="bg-v3-ink/50 text-center text-xs text-v3-mute">
                                        <th className="w-10 border-e border-b border-v3-line/60 py-1.5" aria-hidden />
                                        {LETTERS.map((l) => (
                                            <th key={l} aria-hidden className="border-e border-b border-v3-line/60 py-1.5 font-normal">
                                                {l}
                                            </th>
                                        ))}
                                    </tr>
                                    <tr className="bg-v3-ink/30 text-start text-[13px] text-v3-light">
                                        <th className="w-10 border-e border-b border-v3-line/60 text-center text-xs font-normal text-v3-mute">1</th>
                                        {cols.map((c) => (
                                            <th key={c} scope="col" className={`${cell} text-start font-semibold`}>
                                                {c}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((r, i) => (
                                        <tr key={r.website} className="text-v3-bone transition-colors duration-300 hover:bg-v3-light/[0.06]">
                                            <td className="w-10 border-e border-b border-v3-line/60 bg-v3-ink/30 text-center text-xs text-v3-mute">{num(i + 2, locale)}</td>
                                            <td className={`${cell} ${i === 0 ? "outline-2 -outline-offset-2 outline-v3-light" : ""}`}>{r.name}</td>
                                            <td className={`${cell} text-v3-soft`}>{sectorLabel(r.sector, locale)}</td>
                                            <td className={cell}>{num(r.year, locale)}</td>
                                            <td className={cell} dir="ltr">
                                                <span className="font-v3-body! text-v3-light">{r.website}</span>
                                            </td>
                                            <td className={`${cell} font-mono! text-[13px] text-v3-soft`} dir="ltr">
                                                {r.email}
                                            </td>
                                            <td className={`${cell} font-mono! text-[13px] text-v3-soft`} dir="ltr">
                                                {r.phone}
                                            </td>
                                            <td className={cell}>
                                                <span className="flex gap-1.5" dir="ltr">
                                                    {r.social.length
                                                        ? r.social.map((s) => (
                                                              <span key={s} className="rounded border border-v3-line px-1.5 text-[11px] text-v3-soft">
                                                                  {SOCIAL[s]}
                                                              </span>
                                                          ))
                                                        : <span className="text-v3-mute">—</span>}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {limit && limit < SAMPLE_ROWS.length && (
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-20 items-end justify-center bg-linear-to-t from-v3-raise via-v3-raise/85 to-transparent pb-4">
                                    <span className="rounded-full border border-v3-light/50 bg-v3-ink/80 px-4 py-1.5 text-sm text-v3-light">
                                        {t.more}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-v3-mute">
                        {t.footnote} <span className="text-v3-soft">•••• = {t.masked}</span>
                    </p>
                </Reveal>
            </div>
        </section>
    )
}
