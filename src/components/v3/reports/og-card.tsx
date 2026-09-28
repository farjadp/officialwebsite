// ============================================================================
// File Path: src/components/v3/reports/og-card.tsx
// Why: The 1200×630 share card behind every report's opengraph-image route.
//      Reports are written to be shared on Telegram and LinkedIn, and the
//      site's default card says nothing about the report — so each one gets a
//      card carrying its own headline figure.
//
//      Rendered by Satori (next/og), which supports only a flexbox subset of
//      CSS and no Tailwind, so the styles here are inline by necessity and the
//      v3 palette is repeated as literals. Fonts are read from
//      src/assets/og-fonts as TTF because Satori cannot parse woff2.
//      Persian is set in Vazirmatn (SIL OFL) rather than the site's licensed
//      IRANYekanX, so no commercial font binary lives in this public repo.
// ============================================================================

import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { Locale } from "@/lib/nav"
import type { ReportMeta } from "@/lib/reports"

/**
 * Persian text for Satori.
 *
 * Satori has no bidi pass: it shapes each word correctly but lays the words
 * out left to right, so a Persian sentence comes out back to front. It also
 * breaks a word apart at a ZWNJ and swaps the halves. Verified against the
 * same strings rendered in Chromium, which is the reference here.
 *
 * So the order is done here instead: split on spaces, reverse, and let flex
 * lay the words out — each word is then a single run Satori gets right. The
 * ZWNJ inside a word becomes a hair space, the one separator that survives
 * with its order and its letter shapes intact.
 */
function Fa({ children, style }: { children: string; style?: React.CSSProperties }) {
  const words = children.split(/\s+/).filter(Boolean).reverse()
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "0.25em", ...style }}>
      {words.map((w, i) => (
        <div key={i} style={{ display: "flex" }}>
          {w.replace(/\u200C/g, "\u200A")}
        </div>
      ))}
    </div>
  )
}

/** One line of card text, in whichever script the locale needs. */
function T({ rtl, children, style }: { rtl: boolean; children: string; style?: React.CSSProperties }) {
  if (rtl) return <Fa style={style}>{children}</Fa>
  return <div style={{ display: "flex", ...style }}>{children}</div>
}

export const OG_SIZE = { width: 1200, height: 630 }

const INK = "#141312"
const BONE = "#ede8df"
const LIGHT = "#e8c48a"
const MUTE = "#a39c90"
const LINE = "#33302c"

const FONT_DIR = join(process.cwd(), "src/assets/og-fonts")

async function font(file: string) {
  return readFile(join(FONT_DIR, file))
}

/** The four faces the card needs, loaded once per render. */
export async function ogFonts(locale: Locale) {
  const [display, body] = await Promise.all([
    font("Newsreader-Light.ttf"),
    font(locale === "fa" ? "Vazirmatn-Regular.ttf" : "InstrumentSans-Medium.ttf"),
  ])
  return [
    { name: "Display", data: display, weight: 300 as const, style: "normal" as const },
    { name: "Body", data: body, weight: 400 as const, style: "normal" as const },
  ]
}

/**
 * The card. The headline figure is the point of it, so it is set at the size
 * it would be on a billboard; everything else supports it.
 */
export function OgCard({ locale, meta }: { locale: Locale; meta: ReportMeta }) {
  const m = meta.copy[locale]
  const rtl = locale === "fa"
  // Satori reorders bidirectional runs itself, so Persian needs no help with
  // word order — only with the digits, which must not stay Latin.
  const fa = (v: string) => v.replace(/\./g, "٫").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])
  const figure = rtl ? fa(meta.figure) : meta.figure
  const label = rtl ? `گزارش ${fa(String(meta.number).padStart(2, "0"))}` : `Report ${String(meta.number).padStart(2, "0")}`

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        color: BONE,
        padding: "64px 72px",
        fontFamily: "Body",
        position: "relative",
      }}
    >
      {/* The diagonal light, flattened into a static gradient. */}
      <div
        style={{
          position: "absolute",
          top: -180,
          left: rtl ? 520 : -180,
          width: 700,
          height: 1000,
          transform: "rotate(18deg)",
          background: `linear-gradient(90deg, rgba(232,196,138,0) 0%, rgba(232,196,138,0.10) 50%, rgba(232,196,138,0) 100%)`,
          display: "flex",
        }}
      />

      {/* Top rule */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          color: MUTE,
          flexDirection: rtl ? "row-reverse" : "row",
        }}
      >
        <T rtl={rtl} style={{ color: LIGHT }}>{label}</T>
        <div style={{ display: "flex" }}>farjadp.info</div>
      </div>

      {/* Headline + figure */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          alignItems: rtl ? "flex-end" : "flex-start",
          textAlign: rtl ? "right" : "left",
        }}
      >
        <T
          rtl={rtl}
          style={{
            fontFamily: "Display",
            fontSize: rtl ? 62 : 68,
            lineHeight: 1.15,
            letterSpacing: rtl ? 0 : "-0.02em",
            maxWidth: 1000,
          }}
        >
          {m.title}
        </T>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 22,
            flexDirection: rtl ? "row-reverse" : "row",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Display",
              fontSize: 168,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: LIGHT,
              direction: "ltr",
            }}
          >
            {figure}
          </div>
          <T rtl={rtl} style={{ fontSize: 30, color: MUTE, maxWidth: 420 }}>{m.figureLabel}</T>
        </div>
      </div>

      {/* Bottom rule */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${LINE}`,
          paddingTop: 26,
          fontSize: 25,
          color: MUTE,
          flexDirection: rtl ? "row-reverse" : "row",
        }}
      >
        <div style={{ display: "flex", color: BONE }}>{rtl ? "فرجاد" : "Farjad"}</div>
        <T rtl={rtl}>{m.tagline}</T>
      </div>
    </div>
  )
}

/** The card for the reports index: the section, not one report. */
export function OgIndexCard({ locale, count }: { locale: Locale; count: number }) {
  const rtl = locale === "fa"
  const faDigits = (v: string) => v.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)])
  const t = rtl
    ? { kicker: "گزارش‌ها", title: "عددهایی که چک کردم،\nبعد به تصویر کشیدم", foot: `${faDigits(String(count))} گزارش منتشر شده`, name: "فرجاد" }
    : { kicker: "Reports", title: "Numbers I checked,\nthen drew.", foot: `${count} published`, name: "Farjad" }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        color: BONE,
        padding: "64px 72px",
        fontFamily: "Body",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -180,
          left: rtl ? 520 : -180,
          width: 700,
          height: 1000,
          transform: "rotate(18deg)",
          background: "linear-gradient(90deg, rgba(232,196,138,0) 0%, rgba(232,196,138,0.10) 50%, rgba(232,196,138,0) 100%)",
          display: "flex",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          color: MUTE,
          flexDirection: rtl ? "row-reverse" : "row",
        }}
      >
        <T rtl={rtl} style={{ color: LIGHT }}>{t.kicker}</T>
        <div style={{ display: "flex" }}>farjadp.info/reports</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Display",
          fontSize: rtl ? 78 : 88,
          lineHeight: 1.25,
          letterSpacing: rtl ? 0 : "-0.02em",
          alignSelf: rtl ? "flex-end" : "flex-start",
          alignItems: rtl ? "flex-end" : "flex-start",
        }}
      >
        {t.title.split("\n").map((line, i) => (
          <T key={i} rtl={rtl}>
            {line}
          </T>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `1px solid ${LINE}`,
          paddingTop: 26,
          fontSize: 25,
          color: MUTE,
          flexDirection: rtl ? "row-reverse" : "row",
        }}
      >
        <div style={{ display: "flex", color: BONE }}>{t.name}</div>
        <T rtl={rtl}>{t.foot}</T>
      </div>
    </div>
  )
}
