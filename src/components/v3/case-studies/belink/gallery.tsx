// ============================================================================
// File: src/components/v3/case-studies/belink/gallery.tsx
// Role: Screens of the private Belink panel, captured with every company-level
//       field replaced by grey bars BEFORE capture (headless Chrome, a DOM
//       redaction script, and a check that no @, phone or URL text remained).
//       The images hold no names, contacts, addresses or per-company scores.
// ============================================================================

import Image from "next/image"
import type { Locale } from "@/components/home/v3/copy"
import { Kicker, Reveal } from "@/components/v3/kit"
import { COPY } from "./copy"

const SHOTS = [
    { key: "overview", w: 1800, h: { fa: 568, en: 595 } },
    { key: "filters-table", w: 1800, h: { fa: 1275, en: 1316 } },
] as const

export function BelinkPanelGallery({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
    const g = COPY[locale].gallery
    const shots = compact ? SHOTS.slice(0, 1) : SHOTS
    return (
        <section className="border-b border-v3-line/70">
            <div className="mx-auto w-full max-w-[1600px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
                <Reveal className="mb-12 flex max-w-3xl flex-col gap-4 md:mb-16">
                    <Kicker>{g.kicker}</Kicker>
                    <h2 className="font-v3-display text-4xl font-light leading-tight md:text-6xl rtl:leading-snug">{g.title}</h2>
                    <p className="text-lg leading-relaxed text-v3-soft md:text-xl rtl:leading-loose">{g.lead}</p>
                </Reveal>
                <div className="flex flex-col gap-14">
                    {shots.map((s, i) => (
                        <Reveal key={s.key} delay={i * 0.08}>
                            <figure className="flex flex-col gap-4">
                                <div className="group relative overflow-hidden rounded-2xl border border-v3-line/80 bg-v3-raise shadow-[0_40px_120px_-60px_rgb(var(--v3-glow)/0.45)] transition-transform duration-700 hover:-translate-y-1">
                                    <Image
                                        src={`/case-studies/belink/panel-${s.key}-${locale}.webp`}
                                        alt={s.key === "overview" ? g.overview : g.table}
                                        width={s.w}
                                        height={s.h[locale]}
                                        sizes="(min-width: 1600px) 1500px, 100vw"
                                        className="h-auto w-full"
                                    />
                                    <span className="absolute end-4 top-4 rounded-full border border-v3-line bg-v3-ink/85 px-3 py-1 text-xs text-v3-light backdrop-blur">
                                        {g.redacted}
                                    </span>
                                </div>
                                <figcaption className="max-w-3xl text-[15px] leading-relaxed text-v3-mute rtl:leading-loose">
                                    {s.key === "overview" ? g.overview : g.table}
                                </figcaption>
                            </figure>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}
