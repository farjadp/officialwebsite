// ============================================================================
// File Path: src/components/v3/reports/synthetic-consumers/data.ts
// Why: The figures report 10 rests on, from Maier, Aslak, Fiaschi, Rismal,
//      Fletcher, Luhmann, Dow, Pappas & Wiecki (2025), "LLMs Reproduce Human
//      Purchase Intent via Semantic Similarity Elicitation of Likert
//      Ratings", arXiv:2510.08338 v3 (preprint, CC BY 4.0). Values are typed
//      from the paper's Table 1, §4 and Appendix D, each with its source in a
//      comment; the SSR mapping (Eq. 8–9) is implemented here so the page can
//      let readers try it. Pure data and maths: no React.
// ============================================================================

export const PAPER = {
  title: "LLMs Reproduce Human Purchase Intent via Semantic Similarity Elicitation of Likert Ratings",
  authors: ["Benjamin F. Maier", "Ulf Aslak", "Luca Fiaschi", "Nina Rismal", "Kemble Fletcher", "Christian C. Luhmann", "Robbie Dow", "Kli Pappas", "Thomas V. Wiecki"],
  arxiv: "2510.08338",
  version: "v3, 27 October 2025",
  abs: "https://arxiv.org/abs/2510.08338",
  pdf: "https://arxiv.org/pdf/2510.08338",
  code: "https://github.com/pymc-labs/semantic-similarity-rating",
  licence: "CC BY 4.0",
}

/** §3.1 / App. A.1 */
export const STUDY = { surveys: 57, people: 9300, minPerSurvey: 150, maxPerSurvey: 400, meanPI: 4.0, refSets: 6, anchorsPerSet: 5, samplesPerPersona: 2 }

export type Method = "dlr" | "flr" | "ssr"
export type Model = "gpt4o" | "gem2f"
export const METHODS: Method[] = ["dlr", "flr", "ssr"]
export const MODELS: Model[] = ["gpt4o", "gem2f"]
export const MODEL_NAME: Record<Model, string> = { gpt4o: "GPT-4o", gem2f: "Gemini 2.0 Flash" }

/**
 * Headline experiments: full demographics, image stimulus, T = 0.5, SSR
 * averaged over the six reference sets (Table 1). ρ = correlation
 * attainment (% of the human test–retest ceiling); K = mean KS similarity
 * of the response distributions (1 = identical).
 */
export const RESULTS: Record<Model, Record<Method, { rho: number; k: number }>> = {
  gpt4o: { dlr: { rho: 81.7, k: 0.26 }, flr: { rho: 84.7, k: 0.72 }, ssr: { rho: 90.2, k: 0.88 } },
  gem2f: { dlr: { rho: 80.2, k: 0.39 }, flr: { rho: 92.1, k: 0.59 }, ssr: { rho: 90.6, k: 0.8 } },
}

/**
 * The persona seesaw (Table 1, Gem-2f, image, T = 0.5, SSR averaged over the
 * six reference sets, like every other SSR figure here): with full
 * demographics vs with none. The paper's text quotes the best single sets
 * instead (92% vs 50%, sets 5 and 4), kept in PERSONA_BEST_SET.
 */
export const PERSONA = {
  withDemographics: { rho: 90.6, k: 0.8 },
  withoutDemographics: { rho: 15.5, k: 0.91 },
}
export const PERSONA_BEST_SET = { withDemographics: 92.4, withoutDemographics: 50.1 }

/** Table 1, text-only stimulus (product description, no image), T = 0.5, averaged sets. */
export const TEXT_STIMULUS = { gpt4o: { dlr: 89.6, ssr: 82.5 }, gem2f: { dlr: 67.5, ssr: 73.0 } }

/**
 * App. D: LightGBM trained on half the surveys (8 demographic and product-
 * category features; it never sees the concept itself), tested on the other
 * half, vs zero-shot LLMs on the same halves (GPT-4o, T = 0.5, image), 300
 * splits. These ρ are on 29-survey halves, so they differ from Table 1.
 */
export const BENCHMARK = [
  { key: "lightgbm", rho: 64.6, k: 0.797 },
  { key: "flr", rho: 83.2, k: 0.716 },
  { key: "ssr", rho: 88.3, k: 0.883 },
] as const

/** §4.4: a second question, "How relevant was the concept?" (Gem-2f). */
export const RELEVANCE = { ssr: { rho: 82, k: 0.81 }, flr: { rho: 91, k: 0.62 } }

/**
 * SSR, Eq. 8–9: similarities γ to the five anchors → minus the smallest →
 * plus ε at the minimum → normalise → raise to 1/T → normalise.
 * The paper uses ε = 0 and T = 1.
 */
export function ssrPmf(sims: number[], eps = 0, temp = 1): number[] {
  if (sims.length !== 5) throw new Error("SSR needs five similarities")
  const min = Math.min(...sims)
  const iMin = sims.indexOf(min)
  const raw = sims.map((s, i) => s - min + (i === iMin ? eps : 0))
  const sum = raw.reduce((a, b) => a + b, 0)
  const p = sum > 0 ? raw.map((v) => v / sum) : raw.map(() => 0.2)
  const t = p.map((v) => Math.pow(v, 1 / temp))
  const s2 = t.reduce((a, b) => a + b, 0)
  return s2 > 0 ? t.map((v) => v / s2) : t.map(() => 0.2)
}

export const mean = (pmf: number[]) => pmf.reduce((a, p, i) => a + p * (i + 1), 0)

/**
 * Example answers for the SSR playground, with illustrative similarities.
 * The texts are the paper's own example (App. A.4.3) and two in its style;
 * the similarity values are invented for the demo — they show how the
 * mapping behaves, not what text-embedding-3-small returns.
 */
export const EXAMPLES = [
  { key: "probably", sims: [0.71, 0.74, 0.78, 0.84, 0.82] },
  { key: "unsure", sims: [0.75, 0.79, 0.84, 0.8, 0.76] },
  { key: "unlikely", sims: [0.85, 0.82, 0.77, 0.73, 0.71] },
] as const

/** "Human or synthetic?" — short comments quoted in the paper's App. E. */
export const QUOTES: { key: string; synthetic: boolean }[] = [
  { key: "good", synthetic: false },
  { key: "ease", synthetic: true },
  { key: "steps", synthetic: false },
  { key: "highend", synthetic: true },
  { key: "bougie", synthetic: true },
  { key: "inexpensive", synthetic: false },
  { key: "microbiome", synthetic: true },
  { key: "trusted", synthetic: true },
]

/** What the synthetic panels did and did not mirror (§4.3, Fig. 4 and 8). */
export const MIRRORED = { yes: ["age", "income", "category", "source", "price"], no: ["gender", "region", "ethnicity"] } as const
