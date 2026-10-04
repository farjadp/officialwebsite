// ============================================================================
// File Path: src/components/v3/reports/direct-to-cell/data.ts
// Why: Every figure in report 03, in one place. The partner list feeds the
//      globe, the city and beam figures feed the capacity calculator, and the
//      switchboard says what a country needs before the service can run.
//      Sources for each are printed on the page (copy.ts → method.sources).
// ============================================================================

/** world-atlas country ids are ISO 3166-1 numeric codes, zero-padded. */
export const ISO_NUM: Record<string, string> = {
  US: "840", CA: "124", NZ: "554", AU: "036", JP: "392", CH: "756", CL: "152", PE: "604",
  UA: "804", KZ: "398", IR: "364", GB: "826", MX: "484", ES: "724", BR: "076", PH: "608",
  ID: "360", TR: "792", DE: "276", AT: "040", CO: "170", EC: "218", AR: "032", PR: "630",
  ZA: "710", KE: "404", MY: "458", VN: "704", MN: "496", KG: "417", UZ: "860", GE: "268",
  OM: "512", AE: "784", SA: "682", IL: "376", JO: "400", EG: "818", IN: "356", PK: "586",
  IT: "380", CR: "188", PA: "591", UG: "800", ZM: "894", BD: "050", CD: "180",
}

export const IRAN_ID = ISO_NUM.IR

export type PartnerStatus = "live" | "announced"

export type Partner = {
  code: string
  id: string
  operator: string
  status: PartnerStatus
  /** Year-month the service went live (or was announced). */
  since: string
}

const p = (code: string, operator: string, status: PartnerStatus, since: string): Partner => ({
  code,
  id: ISO_NUM[code],
  operator,
  status,
  since,
})

/**
 * Starlink Direct to Cell ("Starlink Mobile") partners, as of 4 Oct 2026.
 * The list of operators is Starlink's own (starlink.com/business/mobile);
 * "live" is used only where public commercial service was confirmed in an
 * operator or trade source. Everything else — announced, in trial, or live
 * but unconfirmed here — is "announced", which is the cautious reading.
 */
export const PARTNERS: Partner[] = [
  p("US", "T-Mobile", "live", "2025-07"),
  p("CA", "Rogers", "live", "2025-12"),
  p("NZ", "One NZ", "live", "2024-12"),
  p("AU", "Telstra", "live", "2025-06"),
  p("JP", "KDDI · Docomo · SoftBank", "live", "2025-04"),
  p("PH", "Globe", "live", "2026-06"),
  p("CL", "Entel", "live", "2025-11"),
  p("PE", "Entel", "live", "2025-12"),
  p("CR", "Liberty", "live", "2026-08"),
  p("PA", "Liberty", "live", "2026-09"),
  p("KZ", "Beeline", "live", "2026-09"),
  p("UA", "Kyivstar", "live", "2025-11"),
  p("GB", "Virgin Media O2", "live", "2026-02"),
  p("CD", "Airtel", "live", "2026-08"),
  p("CH", "Salt", "announced", ""),
  p("ES", "MasOrange", "announced", ""),
  p("IT", "Fastweb", "announced", ""),
  p("UG", "Airtel", "live", "2026-09"),
  p("KE", "Airtel", "announced", ""),
  p("DE", "Deutsche Telekom", "announced", ""),
  p("ZM", "MTN", "announced", ""),
  p("BD", "Banglalink", "announced", ""),
  p("MN", "Gmobile · Mobicom", "announced", ""),
]

export type FocusKey = "iran" | "kazakhstan" | "americas" | "pacific"

/** Median received signal, dBm (UPM / WePlan field study). */
export const SIGNAL = { dtc: -121, lte: -97 }

/**
 * Estimated shared capacity of one beam, outdoors, Mbps — the published
 * version of the same study (IEEE Communications Magazine, June 2026). An
 * earlier preprint said 4; the final paper says about 3.
 */
export const BEAM_MBPS = 3

/** City populations, Iran 2016 census (Statistical Centre of Iran). */
export const CITIES: { key: string; pop: number }[] = [
  { key: "tehran", pop: 8_693_706 },
  { key: "mashhad", pop: 3_001_184 },
  { key: "isfahan", pop: 1_961_260 },
  { key: "karaj", pop: 1_592_492 },
  { key: "shiraz", pop: 1_565_572 },
  { key: "tabriz", pop: 1_558_693 },
]

/**
 * What each everyday use needs, in kilobits per second. Deliberately rough
 * and on the low side — the point is the order of magnitude, and the
 * calculator says so.
 */
export const USES: { key: string; kbps: number }[] = [
  { key: "sms", kbps: 0.1 },
  { key: "text", kbps: 2 },
  { key: "voice", kbps: 24 },
  { key: "photo", kbps: 50 },
  { key: "web", kbps: 500 },
  { key: "video", kbps: 1500 },
]

/** What has to be true before the service runs in a country. */
export type NeedKey = "satellites" | "phones" | "operator" | "spectrum" | "regulator" | "core"

export const NEEDS: NeedKey[] = ["satellites", "phones", "operator", "spectrum", "regulator", "core"]

export type Country = "kazakhstan" | "us" | "iran"

export const SWITCHBOARD: Record<Country, Record<NeedKey, boolean>> = {
  kazakhstan: { satellites: true, phones: true, operator: true, spectrum: true, regulator: true, core: true },
  us: { satellites: true, phones: true, operator: true, spectrum: true, regulator: true, core: true },
  iran: { satellites: true, phones: true, operator: false, spectrum: false, regulator: false, core: false },
}

/** First generation vs the announced second, as multiples of the first. */
export const GENERATIONS = { perSatellite: 20, system: 100, nextYear: 2027 }
