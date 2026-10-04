// ============================================================================
// File Path: src/components/v3/reports/photo.tsx
// Why: A photograph in a report, always with its credit. Every image in the
//      reports is freely licensed (public domain or Creative Commons), stored
//      in public/images/reports/<report>/ and attributed exactly as its
//      licence requires: author, licence with a link, and the source page.
//      The credit is part of the component so it cannot be left off. It is
//      set in the Latin face on purpose: the Persian face draws Latin digits
//      as Persian ones, which turns "CC BY-SA 4.0" into "۴٫۰".
// Env / Identity: React Server Component
// ============================================================================

import Image from "next/image"
import type { Locale } from "@/lib/nav"

export type ReportPhoto = {
  /** Path under /public. */
  src: string
  width: number
  height: number
  alt: Record<Locale, string>
  caption: Record<Locale, string>
  /** Author or institution, as the source asks to be credited. */
  credit: string
  /** e.g. "CC BY-SA 4.0" or "Public domain". */
  license: string
  licenseUrl?: string
  /** The file's page on Wikimedia Commons or the original archive. */
  sourceUrl: string
}

export function Photo({
  photo,
  locale,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  ratio,
}: {
  photo: ReportPhoto
  locale: Locale
  className?: string
  sizes?: string
  priority?: boolean
  /** Crop to a fixed aspect, e.g. "4/3". Omit to keep the photo's own. */
  ratio?: string
}) {
  const fa = locale === "fa"
  return (
    <figure className={`flex flex-col gap-3 ${className ?? ""}`}>
      <div
        className="relative overflow-hidden rounded-2xl border border-v3-line/70 bg-v3-raise"
        style={{ aspectRatio: ratio ?? `${photo.width}/${photo.height}` }}
      >
        <Image
          src={photo.src}
          alt={photo.alt[locale]}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover saturate-[0.85] transition-[filter,transform] duration-700 hover:scale-[1.02] hover:saturate-100"
        />
      </div>
      <figcaption className="flex flex-col gap-1 text-sm leading-relaxed text-v3-soft rtl:leading-loose">
        <span>{photo.caption[locale]}</span>
        <span className="text-xs text-v3-mute font-(family-name:--font-instrument) rtl:text-right" dir="ltr">
          <span className="sr-only">{fa ? "اعتبار تصویر:" : "Image credit:"} </span>
          {photo.credit} ·{" "}
          {photo.licenseUrl ? (
            <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline decoration-v3-line underline-offset-2 hover:text-v3-light">
              {photo.license}
            </a>
          ) : (
            photo.license
          )}{" "}
          ·{" "}
          <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-v3-line underline-offset-2 hover:text-v3-light">
            {photo.sourceUrl.includes("wikimedia") ? "Wikimedia Commons" : "source"}
          </a>
        </span>
      </figcaption>
    </figure>
  )
}
