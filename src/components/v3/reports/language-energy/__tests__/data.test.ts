// Report 09: the data reproduces the paper's own numbers.
import { describe, expect, it } from "vitest"
import { ARABIC_SCRIPT, ENGLISH, LANGS, PAIRS, PERSIAN, TABLE1, TABLE3, TABLE4, TAJIK, costlier, lang, penalties, vsEnglish } from "../data"

describe("Table 5 (122 languages)", () => {
  it("has every Belebele language once, 56 high and 66 low", () => {
    expect(LANGS).toHaveLength(122)
    expect(new Set(LANGS.map((l) => l.code)).size).toBe(122)
    expect(LANGS.filter((l) => l.high)).toHaveLength(56)
  })
  it("reproduces the paper's measured totals (Table 1) from the unrounded data", () => {
    for (const r of TABLE1) expect(lang(r.code).jPerAnswer * 900).toBeCloseTo(r.totalJ, -1)
  })
  it("reproduces the headline gaps: 179x total, 8.3x per token", () => {
    expect(lang("pbt_Arab").jPerAnswer / ENGLISH.jPerAnswer).toBeCloseTo(178.9, 0)
    const jt = LANGS.map((l) => l.jtok)
    expect(Math.max(...jt) / Math.min(...jt)).toBeCloseTo(8.3, 1)
  })
  it("per response: English 19.5 J, Pashto 3,496 J", () => {
    expect(ENGLISH.jPerAnswer).toBeCloseTo(19.5, 1)
    expect(lang("pbt_Arab").jPerAnswer).toBeCloseTo(3496, -1)
  })
})

describe("Persian", () => {
  it("about 4x English per answer, 3x the tokens, 67.4% correct", () => {
    const x = vsEnglish(PERSIAN)
    expect(x.energy).toBeCloseTo(4.13, 2)
    expect(x.tokens).toBeCloseTo(3.02, 2)
    expect(PERSIAN.tokPerAnswer).toBeCloseTo(563, 0)
    expect(PERSIAN.acc).toBe(67.4)
  })
  it("Tajik costs about 2.7x Western Persian", () => {
    expect(TAJIK.jPerAnswer / PERSIAN.jPerAnswer).toBeCloseTo(2.69, 2)
  })
  it("the Arabic-script list runs from the cheap Arabic varieties to Pashto", () => {
    expect(ARABIC_SCRIPT.at(-1)!.code).toBe("pbt_Arab")
    expect(ARABIC_SCRIPT.map((l) => l.code)).toContain("pes_Arab")
  })
})

describe("Tables 1, 3, 4 and the game", () => {
  it("the two penalties multiply to the total", () => {
    for (const r of TABLE1.slice(1)) {
      const p = penalties(r.code)
      expect(p.tokens * p.perToken).toBeCloseTo(p.total, 6)
    }
    expect(penalties("pbt_Arab").total).toBeCloseTo(178.9, 0)
  })
  it("every subset language has model and task values", () => {
    for (const c of Object.keys(TABLE3)) {
      expect(Object.keys(TABLE3[c])).toHaveLength(5)
      expect(Object.keys(TABLE4[c])).toHaveLength(3)
    }
  })
  it("every game pair resolves and no pair is a tie", () => {
    for (const p of PAIRS) {
      expect(lang(p[0]).jPerAnswer).not.toBe(lang(p[1]).jPerAnswer)
      expect(p).toContain(costlier(p))
    }
  })
})
