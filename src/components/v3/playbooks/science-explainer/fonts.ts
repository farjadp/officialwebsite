// ============================================================================
// File Path: src/components/v3/playbooks/science-explainer/fonts.ts
// Why: Fredoka 600/700, the prompt's only typeface, loaded once for the
//      player and the demos (SIL OFL, from Google Fonts via next/font).
// ============================================================================

import { Fredoka } from "next/font/google"

export const fredoka = Fredoka({ weight: ["600", "700"], subsets: ["latin"], display: "swap" })
