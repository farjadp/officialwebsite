// ============================================================================
// File: src/components/legal/legal-page.tsx
// Role: Renders a LegalDocument for either locale.
// Why:  /privacy and /terms were linked from the footer of every page and both
//       returned 404. Agents check these pages to decide whether a business is
//       real, so they are worth rendering properly rather than stubbing.
// ============================================================================

import type { LegalDocument } from "@/data/legal/types"

export function LegalPage({ doc, locale }: { doc: LegalDocument; locale: "en" | "fa" }) {
    const isFa = locale === "fa"
    const updated = new Date(doc.updated)
    const updatedLabel = isFa
        ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(updated)
        : new Intl.DateTimeFormat("en-CA", { dateStyle: "long" }).format(updated)

    return (
        <div
            dir={isFa ? "rtl" : "ltr"}
            className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans selection:bg-[#1B4B43] selection:text-white"
        >
            <div className="mx-auto max-w-3xl px-6 py-20 md:px-12 md:py-28">
                <header className="mb-14 border-b border-stone-200 pb-10">
                    <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1B4B43]">
                        {isFa ? "سند حقوقی" : "Legal"}
                    </p>
                    <h1 className="font-serif text-4xl leading-tight tracking-tight text-[#111827] md:text-6xl">
                        {doc.title}
                    </h1>
                    <p className="mt-5 text-lg font-light leading-relaxed text-stone-600">
                        {doc.subtitle}
                    </p>
                    <p className="mt-6 font-mono text-xs text-stone-500">
                        {isFa ? "آخرین بروزرسانی: " : "Last updated: "}
                        <time dateTime={doc.updated}>{updatedLabel}</time>
                    </p>
                </header>

                <div className="space-y-5">
                    {doc.intro.map((paragraph) => (
                        <p key={paragraph} className="text-base leading-[1.9] text-stone-700">
                            {paragraph}
                        </p>
                    ))}
                </div>

                <div className="mt-16 space-y-14">
                    {doc.sections.map((section) => (
                        <section key={section.heading}>
                            <h2 className="mb-5 font-serif text-2xl text-[#111827] md:text-3xl">
                                {section.heading}
                            </h2>
                            <div className="space-y-4">
                                {section.body?.map((paragraph) => (
                                    <p key={paragraph} className="text-base leading-[1.9] text-stone-700">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                            {section.bullets && (
                                <ul className="mt-5 space-y-3">
                                    {section.bullets.map((bullet) => (
                                        <li
                                            key={bullet}
                                            className="relative ps-6 text-base leading-[1.9] text-stone-700 before:absolute before:start-0 before:top-[0.85em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#D97706]"
                                        >
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>

                <section className="mt-20 rounded-2xl border border-[#1B4B43]/20 bg-[#1B4B43]/5 p-8">
                    <h2 className="mb-4 font-serif text-2xl text-[#111827]">{doc.contactHeading}</h2>
                    <p className="text-base leading-[1.9] text-stone-700">{doc.contactBody}</p>
                    <a
                        href={`mailto:${doc.contactEmail}`}
                        className="mt-5 inline-block font-mono text-sm font-bold text-[#1B4B43] underline underline-offset-4 hover:text-[#D97706]"
                        dir="ltr"
                    >
                        {doc.contactEmail}
                    </a>
                </section>
            </div>
        </div>
    )
}
