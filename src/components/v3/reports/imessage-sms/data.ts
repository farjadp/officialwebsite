// ============================================================================
// File Path: src/components/v3/reports/imessage-sms/data.ts
// Why: Every figure in report 04, in one place. Two tariffs are the tweets'
//      own numbers; the third is MCI's official rate for an SMS to a UK
//      mobile, read from mci.ir/international-call on 11 Oct 2026. The bill
//      simulator derives everything else from these at render time.
// ============================================================================

/** Rial per international SMS: the two tweets' figures, and MCI's official rate (45,000 toman). */
export const TARIFFS = { low: 167, high: 447, mci: 450_000 }
export type TariffKey = keyof typeof TARIFFS

/** The tweet's own figures: about 100,000 toman, and "90 SMS". */
export const TWEET = { toman: 100_000, sms: 90 }

export const RIAL_PER_TOMAN = 10

/** Bill simulator defaults and ranges. */
export const SIM = {
  retriesPerDay: { min: 1, max: 48, default: 1 },
  days: { min: 1, max: 60, default: 3 },
  tariff: { min: 100, max: 500_000, step: 100, default: TARIFFS.mci },
}

/** Apple's published push-notification network facts. */
export const APNS = { ports: [5223, 443, 2197], block: "17.0.0.0/8" }

export type LaneKey = "activation" | "messaging"

/** The two paths, each four hops. Labels live in copy.ts. */
export const LANES: Record<LaneKey, { hops: 4; hot: boolean }> = {
  activation: { hops: 4, hot: true },
  messaging: { hops: 4, hot: false },
}

export type VisibilityKey = "subscriber" | "appleServers" | "volume" | "service" | "recipient" | "content"

/**
 * What the operator can see, 0–1, for an iMessage and for an ordinary SMS.
 * Qualitative levels from the architecture, not measurements; the page says so.
 */
export const VISIBILITY: { key: VisibilityKey; imessage: number; sms: number }[] = [
  { key: "subscriber", imessage: 1, sms: 1 },
  { key: "appleServers", imessage: 0.9, sms: 0 },
  { key: "volume", imessage: 0.9, sms: 1 },
  { key: "service", imessage: 0.5, sms: 1 },
  { key: "recipient", imessage: 0.12, sms: 1 },
  { key: "content", imessage: 0.02, sms: 1 },
]

export type Verdict = "true" | "likely" | "half" | "false"

export const CLAIM_KINDS: Verdict[] = ["true", "likely", "false", "false", "true", "half", "likely", "true"]

export const FIX_STEPS = 5
