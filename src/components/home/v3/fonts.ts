// ============================================================================
// File Path: src/components/home/v3/fonts.ts
// Why: The v3 type for English: a calm serif for the voice (Newsreader)
//      and a plain sans for reading (Instrument Sans). Persian is set in
//      IRANYekanX throughout (iranyekan.css); see globals.css for how the
//      --v3-display / --v3-body variables switch under dir="rtl".
//      Loaded once in the root layout so the header and footer share them.
// ============================================================================

import { Instrument_Sans, Newsreader } from "next/font/google"

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
