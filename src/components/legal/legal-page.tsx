// ============================================================================
// File: src/components/legal/legal-page.tsx
// Role: Renders a LegalDocument for either locale, in the v3 "Light" look.
// Why:  /privacy and /terms were linked from the footer of every page and both
//       returned 404. Agents check these pages to decide whether a business is
//       real, so they are worth rendering properly rather than stubbing.
//       The look is now the v3 kit's; the wording is the data's, untouched.
//       Reading furniture added here: stable section anchors, a quiet sticky
//       table of contents beside the text, and a ~68ch measure.
// Env / Identity: React Server Component (the ToC is a client leaf)
// ============================================================================

import Link from "next/link"
import type { LegalDocument } from "@/data/legal/types"
import { localDigits } from "@/lib/digits"
import { localePath } from "@/lib/nav"
import { Headline, PageHero, Reveal, Section, V3Page } from "@/components/v3/kit"
import { LegalToc, type TocItem } from "./legal-toc"

const COPY = {
  en: {
    kicker: "Legal",
    updated: "Last updated",
    contents: "On this page",
    other: { privacy: "Privacy Policy", terms: "Terms of Service" },
    alsoRead: "Also on this site",
  },
  fa: {
    kicker: "سند حقوقی",
    updated: "آخرین بروزرسانی",
    contents: "در این صفحه",
    other: { privacy: "سیاست حریم خصوصی", terms: "شرایط استفاده" },
    alsoRead: "در همین سایت",
  },
} as const

/** Anchors are positional so they are identical in both locales and stable
 *  across wording edits: #section-1 … #section-n, plus #contact. */
const sectionId = (i: number) => `section-${i + 1}`
const CONTACT_ID = "contact"

export function LegalPage({ doc, locale }: { doc: LegalDocument; locale: "en" | "fa" }) {
  const isFa = locale === "fa"
  const t = COPY[locale]
  // `2026-09-08` parses as UTC midnight, so format in UTC too — otherwise a
  // server or reader west of Greenwich sees the day before the real date.
  const updated = new Date(doc.updated)
  const updatedLabel = new Intl.DateTimeFormat(isFa ? "fa-IR" : "en-CA", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(updated)

  const toc: TocItem[] = [
    ...doc.sections.map((section, i) => ({ id: sectionId(i), label: section.heading })),
    { id: CONTACT_ID, label: doc.contactHeading },
  ]

  // The companion document: privacy points at terms, terms points at privacy.
  const isPrivacy = /privacy|حریم/i.test(doc.title)
  const otherHref = localePath(locale, isPrivacy ? "/terms" : "/privacy")
  const otherLabel = isPrivacy ? t.other.terms : t.other.privacy

  const prose = "text-base leading-[1.85] text-v3-soft rtl:text-[15px] rtl:leading-[2.15]"

  return (
    <V3Page>
      <div dir={isFa ? "rtl" : "ltr"}>
        <PageHero
          kicker={t.kicker}
          title={doc.title}
          lead={doc.subtitle}
          actions={
            <p className="text-sm text-v3-mute">
              {t.updated}:{" "}
              <time dateTime={doc.updated} className="text-v3-soft">
                {updatedLabel}
              </time>
            </p>
          }
        />

        <Section bordered={false}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4 xl:col-span-3">
              <LegalToc items={toc} label={t.contents} locale={locale} />
            </div>

            <div className="lg:col-span-8 xl:col-span-9">
              <div className="max-w-[68ch]">
                <Reveal className="flex flex-col gap-5 border-b border-v3-line/70 pb-12">
                  {doc.intro.map((paragraph) => (
                    <p key={paragraph} className={`${prose} text-v3-bone`}>
                      {paragraph}
                    </p>
                  ))}
                </Reveal>

                <div className="flex flex-col">
                  {doc.sections.map((section, i) => (
                    <Reveal key={section.heading}>
                      <section id={sectionId(i)} className="scroll-mt-28 border-b border-v3-line/70 py-12">
                        <p className="mb-3 text-sm tabular-nums text-v3-light">
                          {localDigits(`${i + 1}`.padStart(2, "0"), locale)}
                        </p>
                        <Headline as="h2" size="card" className="mb-5 text-v3-bone">
                          {section.heading}
                        </Headline>
                        {section.body && section.body.length > 0 && (
                          <div className="flex flex-col gap-4">
                            {section.body.map((paragraph) => (
                              <p key={paragraph} className={prose}>
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        )}
                        {section.bullets && section.bullets.length > 0 && (
                          <ul className="mt-6 flex flex-col">
                            {section.bullets.map((bullet) => (
                              <li
                                key={bullet}
                                className="flex items-start gap-4 border-t border-v3-line/50 py-3.5 first:border-t-0 first:pt-0"
                              >
                                <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-v3-light" />
                                <span className={prose}>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    </Reveal>
                  ))}
                </div>

                <Reveal>
                  <section
                    id={CONTACT_ID}
                    className="mt-12 scroll-mt-28 rounded-2xl border border-v3-light/50 bg-v3-raise p-7 shadow-[0_0_60px_-30px_rgba(232,196,138,0.5)] md:p-8"
                  >
                    <Headline as="h2" size="card" className="mb-4 text-v3-bone">
                      {doc.contactHeading}
                    </Headline>
                    <p className={prose}>{doc.contactBody}</p>
                    <a
                      href={`mailto:${doc.contactEmail}`}
                      dir="ltr"
                      className="mt-6 inline-flex min-h-12 items-center text-v3-bone underline decoration-v3-line underline-offset-8 transition-colors hover:text-v3-light hover:decoration-v3-light"
                    >
                      {doc.contactEmail}
                    </a>
                  </section>
                </Reveal>

                <Reveal>
                  <p className="mt-12 text-sm text-v3-mute">
                    {t.alsoRead}:{" "}
                    <Link
                      href={otherHref}
                      className="text-v3-soft underline decoration-v3-line underline-offset-4 transition-colors hover:text-v3-light hover:decoration-v3-light"
                    >
                      {otherLabel}
                    </Link>
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </V3Page>
  )
}
