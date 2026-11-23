// Report 10: the paper's numbers and the SSR formula.
import { describe, expect, it } from "vitest"
import { BENCHMARK, EXAMPLES, PERSONA, QUOTES, RESULTS, mean, ssrPmf } from "../data"
import { COPY } from "../copy"

describe("SSR mapping (Eq. 8–9)", () => {
  it("returns a probability distribution over 1–5", () => {
    for (const e of EXAMPLES) {
      const p = ssrPmf([...e.sims])
      expect(p).toHaveLength(5)
      expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10)
      expect(Math.min(...p)).toBeGreaterThanOrEqual(0)
    }
  })
  it("gives zero to the least similar anchor when eps = 0", () => {
    const p = ssrPmf([0.7, 0.8, 0.9, 0.85, 0.75])
    expect(p[0]).toBe(0)
  })
  it("a lower temperature sharpens, a higher one flattens", () => {
    const sims = [0.71, 0.74, 0.78, 0.84, 0.82]
    expect(Math.max(...ssrPmf(sims, 0, 0.5))).toBeGreaterThan(Math.max(...ssrPmf(sims, 0, 1)))
    expect(Math.max(...ssrPmf(sims, 0, 3))).toBeLessThan(Math.max(...ssrPmf(sims, 0, 1)))
  })
  it("the 'probably' example leans high, the 'unlikely' one low", () => {
    expect(mean(ssrPmf([...EXAMPLES[0].sims]))).toBeGreaterThan(3.5)
    expect(mean(ssrPmf([...EXAMPLES[2].sims]))).toBeLessThan(2.5)
  })
})

describe("the paper's figures", () => {
  it("SSR beats direct rating on distribution match for both models", () => {
    for (const m of ["gpt4o", "gem2f"] as const) expect(RESULTS[m].ssr.k).toBeGreaterThan(RESULTS[m].dlr.k)
  })
  it("'KS > 0.85' holds for GPT-4o only", () => {
    expect(RESULTS.gpt4o.ssr.k).toBeGreaterThan(0.85)
    expect(RESULTS.gem2f.ssr.k).toBeLessThan(0.85)
  })
  it("the persona seesaw: better shape, worse ranking without demographics", () => {
    expect(PERSONA.withoutDemographics.k).toBeGreaterThan(PERSONA.withDemographics.k)
    expect(PERSONA.withoutDemographics.rho).toBeLessThan(PERSONA.withDemographics.rho)
  })
  it("LightGBM ranks below both LLM methods", () => {
    expect(BENCHMARK[0].rho).toBeLessThan(BENCHMARK[1].rho)
    expect(BENCHMARK[1].rho).toBeLessThan(BENCHMARK[2].rho)
  })
  it("every game quote has text in both languages", () => {
    for (const q of QUOTES) {
      expect(COPY.en.game.quotes[q.key]).toBeTruthy()
      expect(COPY.fa.game.quotes[q.key]).toBeTruthy()
    }
  })
})
