// ============================================================================
// File Path: src/components/home/v3/fonts.ts
// Why: The v3 home's type. A calm serif for the voice (Newsreader in
//      English, Naskh in Persian), a plain sans for reading. Persian body
//      text stays on Dana, the site's existing Persian face.
// ============================================================================

import { Instrument_Sans, Newsreader, Noto_Naskh_Arabic } from "next/font/google"

export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
})

export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
  display: "swap",
})

export const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-naskh",
  display: "swap",
})
