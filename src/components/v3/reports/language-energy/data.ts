// ============================================================================
// File Path: src/components/v3/reports/language-energy/data.ts
// Why: The figures report 09 rests on, from Deng et al. (2026), "The
//      Language–Energy Divide: Measuring Energy Costs of Multilingual LLM
//      Inference", EMNLP 2026, pp. 48057–48075. Table 1, 3 and 4 are typed
//      from the paper (8 languages each); Table 5 (122 languages) is
//      generated into languages.ts. Every derived number on the page (per
//      answer, × English, the two penalties) is computed here, so the page
//      shows its working and the tests check it. Pure data: no React.
// ============================================================================

import { SCRIPTS, TABLE5, type LangRow } from "./languages"

/** Requests per language in the Belebele runs. */
export const REQUESTS = 900

export type Lang = {
  code: string
  en: string
  fa: string
  script: string
  high: boolean
  /** J per output token (steady state). */
  jtok: number
  /** Output tokens per answer (table total / 900). */
  tokPerAnswer: number
  /** Energy per answer in J (table total / 900). */
  jPerAnswer: number
  acc: number
}

const toLang = ([code, en, fa, script, res, jtok, tokens, energy, acc]: LangRow): Lang => ({
  code,
  en,
  fa,
  script,
  high: res === "H",
  jtok,
  tokPerAnswer: tokens / REQUESTS,
  jPerAnswer: energy / REQUESTS,
  acc,
})

export const LANGS: Lang[] = TABLE5.map(toLang)

export const lang = (code: string): Lang => {
  const l = LANGS.find((x) => x.code === code)
  if (!l) throw new Error(`Unknown language ${code}`)
  return l
}

export const ENGLISH = lang("eng_Latn")
export const PERSIAN = lang("pes_Arab")

/** Script label, with clearer names than ICU's for the Chinese and Japanese entries. */
export function scriptName(code: string, locale: "en" | "fa") {
  const over: Record<string, { en: string; fa: string }> = {
    Hans: { en: "Simplified Han", fa: "هان ساده‌شده" },
    Hant: { en: "Traditional Han", fa: "هان سنتی" },
    Jpan: { en: "Japanese (kanji + kana)", fa: "ژاپنی (کانجی و کانا)" },
    Beng: { en: "Bengali", fa: "بنگالی" },
  }
  return (over[code] ?? SCRIPTS[code] ?? { en: code, fa: code })[locale]
}

/** Within Table 5, relative to English. */
export const vsEnglish = (l: Lang) => ({
  tokens: l.tokPerAnswer / ENGLISH.tokPerAnswer,
  perToken: l.jtok / ENGLISH.jtok,
  energy: l.jPerAnswer / ENGLISH.jPerAnswer,
})

/** 3,600 J = 1 Wh. */
export const wh = (j: number) => j / 3600

// ── Headline figures, as the paper states them ──────────────────────────────

export const HEADLINE = {
  languages: 122,
  high: 56,
  low: 66,
  /** Max/min energy per output token across languages, Qwen3-8B (abstract, §4.1). */
  perTokenGap: 8.3,
  /** Pashto vs English, total energy for the 900 requests (abstract, Table 1). */
  totalGap: 179,
  englishTotalKJ: 17.6,
  pashtoTotalKJ: 3147,
  /** Energy per response (§4.1, Figure 3). */
  englishPerResponse: 19.5,
  pashtoPerResponse: 3496,
  /** Hardware counters' accuracy (§3). */
  counterError: 0.05,
}

// ── Table 1: the eight-language subset, measured (Qwen3-8B, Belebele) ───────

export type T1Row = { code: string; jtok: number; tokPerResponse: number; totalJ: number; xEn: number; acc: number }

export const TABLE1: T1Row[] = [
  { code: "eng_Latn", jtok: 0.1, tokPerResponse: 186, totalJ: 17588, xEn: 1.0, acc: 94.6 },
  { code: "zho_Hans", jtok: 0.1, tokPerResponse: 403, totalJ: 36983, xEn: 2.1, acc: 89.6 },
  { code: "fra_Latn", jtok: 0.11, tokPerResponse: 288, totalJ: 29420, xEn: 1.7, acc: 91.7 },
  { code: "rus_Cyrl", jtok: 0.12, tokPerResponse: 411, totalJ: 43560, xEn: 2.5, acc: 90.9 },
  { code: "tir_Ethi", jtok: 0.73, tokPerResponse: 3695, totalJ: 2413328, xEn: 137, acc: 25.3 },
  { code: "shn_Mymr", jtok: 0.7, tokPerResponse: 4667, totalJ: 2948722, xEn: 168, acc: 10.6 },
  { code: "bod_Tibt", jtok: 0.85, tokPerResponse: 3937, totalJ: 3002867, xEn: 171, acc: 21.9 },
  { code: "pbt_Arab", jtok: 0.84, tokPerResponse: 4164, totalJ: 3146541, xEn: 179, acc: 40.4 },
]

/** The two penalties for a Table 1 language: tokens × per-token cost ≈ total. */
export function penalties(code: string) {
  const en = TABLE1[0]
  const r = TABLE1.find((x) => x.code === code)
  if (!r) throw new Error(`Not in Table 1: ${code}`)
  const tokens = r.tokPerResponse / en.tokPerResponse
  const total = r.totalJ / en.totalJ
  // The per-token factor implied by the measured totals (the rounded J/tok in
  // the table would make the product drift by a few per cent).
  const perToken = total / tokens
  return { tokens, perToken, total }
}

// ── Table 3: J per output token across five models (8 languages) ───────────

export type ModelKey = "q8" | "q14" | "q32" | "g27" | "l8"
export const MODELS: { key: ModelKey; name: string; ratio: number }[] = [
  { key: "q8", name: "Qwen3-8B", ratio: 8.3 },
  { key: "q14", name: "Qwen3-14B", ratio: 12.2 },
  { key: "q32", name: "Qwen3-32B", ratio: 9.0 },
  { key: "g27", name: "Gemma-3-27B", ratio: 8.2 },
  { key: "l8", name: "Llama-3.1-8B", ratio: 7.1 },
]
export const TABLE3: Record<string, Record<ModelKey, number>> = {
  eng_Latn: { q8: 0.1, q14: 0.17, q32: 0.51, g27: 0.59, l8: 0.09 },
  zho_Hans: { q8: 0.1, q14: 0.17, q32: 0.56, g27: 0.67, l8: 0.1 },
  rus_Cyrl: { q8: 0.12, q14: 0.2, q32: 0.7, g27: 0.72, l8: 0.1 },
  fra_Latn: { q8: 0.11, q14: 0.19, q32: 0.6, g27: 0.69, l8: 0.1 },
  pbt_Arab: { q8: 0.84, q14: 1.36, q32: 1.0, g27: 0.88, l8: 0.44 },
  tir_Ethi: { q8: 0.73, q14: 1.06, q32: 1.43, g27: 1.04, l8: 0.24 },
  shn_Mymr: { q8: 0.7, q14: 1.64, q32: 2.83, g27: 4.79, l8: 0.66 },
  bod_Tibt: { q8: 0.85, q14: 2.02, q32: 4.6, g27: 1.63, l8: 0.52 },
}

// ── Table 4: J per output token across three tasks (Qwen3-8B, 8 languages) ─

export type TaskKey = "reading" | "math" | "chat"
export const TASKS: { key: TaskKey; ratio: number }[] = [
  { key: "reading", ratio: 8.3 },
  { key: "math", ratio: 11.6 },
  { key: "chat", ratio: 10.6 },
]
export const TABLE4: Record<string, Record<TaskKey, number>> = {
  eng_Latn: { reading: 0.105, math: 0.086, chat: 0.097 },
  zho_Hans: { reading: 0.102, math: 0.087, chat: 0.098 },
  rus_Cyrl: { reading: 0.118, math: 0.089, chat: 0.105 },
  fra_Latn: { reading: 0.113, math: 0.091, chat: 0.107 },
  pbt_Arab: { reading: 0.84, math: 0.117, chat: 0.957 },
  tir_Ethi: { reading: 0.726, math: 0.872, chat: 0.946 },
  shn_Mymr: { reading: 0.702, math: 0.516, chat: 0.593 },
  bod_Tibt: { reading: 0.847, math: 0.99, chat: 1.023 },
}

/** The 8-language subset, high-resource first. */
export const SUBSET = ["eng_Latn", "zho_Hans", "fra_Latn", "rus_Cyrl", "pbt_Arab", "tir_Ethi", "shn_Mymr", "bod_Tibt"] as const

// ── Same script, different bills ────────────────────────────────────────────

/** Every Arabic-script language in Table 5, plus Tajik (Persian-family, Cyrillic). */
export const ARABIC_SCRIPT = LANGS.filter((l) => l.script === "Arab").sort((a, b) => a.jPerAnswer - b.jPerAnswer)
export const TAJIK = lang("tgk_Cyrl")

// ── The guessing game: which answer costs more energy? ──────────────────────

export const PAIRS: [string, string][] = [
  ["pes_Arab", "hin_Deva"],
  ["zho_Hans", "fra_Latn"],
  ["arz_Arab", "pes_Arab"],
  ["kor_Hang", "ell_Grek"],
  ["tur_Latn", "kat_Geor"],
  ["urd_Arab", "snd_Arab"],
  ["jpn_Jpan", "hun_Latn"],
  ["amh_Ethi", "swh_Latn"],
]

/** The costlier of a pair, by energy per answer in Table 5. */
export const costlier = ([a, b]: [string, string]) => (lang(a).jPerAnswer >= lang(b).jPerAnswer ? a : b)

// ── The paper ────────────────────────────────────────────────────────────────

export const PAPER = {
  title: "The Language–Energy Divide: Measuring Energy Costs of Multilingual LLM Inference",
  authors: ["Naihao Deng", "Alissa Shen", "Yiming Feng", "Joan Nwatu", "Jae-Won Chung", "Mosharaf Chowdhury", "Yulong Chen", "Rada Mihalcea"],
  venue: "EMNLP 2026",
  pages: "48057–48075",
  url: "https://aclanthology.org/2026.emnlp-main.2113.pdf",
  anthology: "https://aclanthology.org/2026.emnlp-main.2113/",
  project: "https://lit.eecs.umich.edu/language-energy-divide/",
  code: "https://github.com/MichiganNLP/language-energy-divide",
  data: "https://huggingface.co/datasets/MichiganNLP/language-energy-divide",
}
