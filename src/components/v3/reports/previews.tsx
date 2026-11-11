// ============================================================================
// File Path: src/components/v3/reports/previews.tsx
// Why: The small data preview each report shows on /reports and /fa/reports,
//      so the index reads as a sheet of figures instead of a column of text.
//      Five chart types (ratio bar, unit grid, comparison bars, sparkline,
//      clock ring), one per report. Every number is imported from that
//      report's own data.ts, never typed again here, so a correction to a
//      report corrects its preview too (the fact-check rule).
//
//      Server-rendered SVG in its finished state. Motion is opt-in: the card
//      carries data-state="armed" (start state) once preview-motion.tsx has
//      hydrated, and "in" when it scrolls into view. Without JavaScript, or
//      with reduced motion, the finished chart is what you see.
//
//      Colour rule: gold (v3-light) marks only the report's point; context
//      is v3-mute (v3-line fails 3:1 as a meaningful mark, so it is used for
//      tracks only); a second category differs by shape, not just colour.
//      Charts without a numeric axis mirror in Persian; the time series and
//      the clock do not.
// Env / Identity: React Server Component
// ============================================================================

import type { ReactNode } from "react"
import type { Locale } from "@/lib/nav"
import { localDigits } from "@/lib/digits"
import { COMPANIES, EU27_GDP } from "./eight-stocks/data"
import { EARTH_AGE, clockSeconds, eventAge } from "./deep-time-pain/data"
import { PARTNERS } from "./direct-to-cell/data"
import { TARIFFS, TWEET } from "./imessage-sms/data"
import { WORLD, YEARS } from "./migrant-stock/data"
import { FORCES, SIEGE_DAYS } from "./vienna-1683/data"
import { FUNDING } from "./startup-concentration/data"
import { SURVEY, group as pewGroup } from "./undecided-fifth/data"

const W = 280
const H = 140
const EASE = "ease-[cubic-bezier(.16,1,.3,1)]"
/** Context marks fade in first. */
const CTX = `transition-opacity duration-500 ${EASE} group-data-[state=armed]/card:opacity-0`
/** The point arrives after the context. */
const PT = `transition-opacity duration-500 delay-[450ms] ${EASE} group-data-[state=armed]/card:opacity-0`
/** Bars grow from their start edge (the right edge inside a mirrored group). */
const GROW = `origin-left [transform-box:fill-box] transition-transform duration-[900ms] ${EASE} group-data-[state=armed]/card:scale-x-0`
const GROW_PT = `${GROW} delay-[400ms]`
/** Lines and arcs draw along their length (pathLength=1). */
const DRAW = `[stroke-dasharray:1] transition-[stroke-dashoffset] duration-[1100ms] ${EASE} group-data-[state=armed]/card:[stroke-dashoffset:1]`
const DRAW_PT = `${DRAW} delay-[300ms]`

const TXT = "fill-v3-mute text-[11px] tabular-nums"
const TXT_PT = "fill-v3-light text-[11px] font-semibold tabular-nums"

type P = { locale: Locale }
const fa = (l: Locale) => l === "fa"
const d = (n: number | string, l: Locale) => localDigits(n, l)
/** Thousands separators in the reader's digits. */
const n0 = (n: number, l: Locale) => (fa(l) ? d(Math.round(n).toLocaleString("en-US"), l).replace(/,/g, "٬") : Math.round(n).toLocaleString("en-US"))
const n1 = (n: number, l: Locale) => (fa(l) ? d(n.toFixed(1), l).replace(".", "٫") : n.toFixed(1))

/**
 * The SVG frame. Text is laid out left-to-right in every locale so that x and
 * text-anchor mean the same thing; mirrored charts flip their coordinates in
 * code (mx) and the marks with a group transform.
 */
function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible [direction:ltr]" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

/** Mirror the marks of an axis-free chart in Persian. Never wrap text in this. */
function Marks({ mirror, children }: { mirror: boolean; children: ReactNode }) {
  return <g transform={mirror ? `translate(${W} 0) scale(-1 1)` : undefined}>{children}</g>
}

/**
 * Persian labels are set right-to-left so mixed runs ("۵۱٪", "۱۶ هزار نفر · ۶۰ روز")
 * keep their order. In RTL text, "start" is the right edge, so the anchor of a
 * left-to-right layout flips.
 */
const ta = (l: Locale, a: "start" | "end" | "middle") => (l !== "fa" || a === "middle" ? a : a === "start" ? "end" : "start")
const dirOf = (l: Locale) => (l === "fa" ? "rtl" : "ltr")

const mxFor = (mirror: boolean) => (x: number) => (mirror ? W - x : x)
const anchorFor = (mirror: boolean) => (a: "start" | "end" | "middle") => (!mirror || a === "middle" ? a : a === "start" ? "end" : "start")

// ── 08 · Unit grid: 44 / 36 / 20 of 100 registered voters ──────────────────

function UndecidedPreview({ locale }: P) {
  const all = pewGroup("all")
  const m = fa(locale)
  const mx = mxFor(m)
  const an = anchorFor(m)
  const PITCH = 13
  const X0 = 10
  const Y0 = 30
  const cells = Array.from({ length: 100 }, (_, k) => ({ col: Math.floor(k / 5), row: k % 5, kind: k < all.dem ? "dem" : k < all.dem + all.rep ? "rep" : "und" }))
  const colOf = (k: number) => X0 + Math.floor(k / 5) * PITCH
  const label = m
    ? `یک ماه مانده، از هر پنج رأی‌دهنده‌ی ثبت‌نام‌شده یکی هیچ‌کدام از دو حزب را انتخاب نکرده بود: ${d(all.dem, locale)} دموکرات، ${d(all.rep, locale)} جمهوری‌خواه، ${d(all.und, locale)} هیچ‌کدام.`
    : `A month out, one registered voter in five picked neither party: ${all.dem} Democratic, ${all.rep} Republican, ${all.und} neither.`
  return (
    <Frame label={label}>
      <text x={mx(X0)} y={20} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `${d(all.dem, locale)} دموکرات` : `${all.dem} Democratic`}
      </text>
      <text x={mx(colOf(all.dem) + 4)} y={20} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `${d(all.rep, locale)} جمهوری‌خواه` : `${all.rep} Republican`}
      </text>
      <text x={mx(W - 10)} y={20} textAnchor={ta(locale, an("end"))} direction={dirOf(locale)} className={TXT_PT}>
        {m ? `${d(all.und, locale)} هیچ‌کدام` : `${all.und} neither`}
      </text>
      <Marks mirror={m}>
        <g className={CTX}>
          {cells
            .filter((c) => c.kind !== "und")
            .map((c, i) =>
              c.kind === "dem" ? (
                <rect key={i} x={X0 + c.col * PITCH} y={Y0 + c.row * PITCH} width={10} height={10} rx={1.5} className="fill-v3-mute" />
              ) : (
                <rect key={i} x={X0 + c.col * PITCH + 0.75} y={Y0 + c.row * PITCH + 0.75} width={8.5} height={8.5} rx={1.5} className="fill-none stroke-v3-mute" strokeWidth={1.5} />
              ),
            )}
        </g>
        <g className={PT}>
          {cells
            .filter((c) => c.kind === "und")
            .map((c, i) => (
              <rect key={i} x={X0 + c.col * PITCH} y={Y0 + c.row * PITCH} width={10} height={10} rx={1.5} className="fill-v3-light" />
            ))}
        </g>
      </Marks>
      <text x={mx(X0)} y={118} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `رأی‌دهندگان ثبت‌نام‌شده، پیو، اکتبر ${d(2026, locale)}` : "Registered voters, Pew, Oct 2026"}
      </text>
    </Frame>
  )
}

// ── 07 · Ratio bar: 86% of AI late-stage money to North America ─────────────

function ConcentrationPreview({ locale }: P) {
  const m = fa(locale)
  const mx = mxFor(m)
  const an = anchorFor(m)
  const X0 = 8
  const BW = 264
  const whole = FUNDING.late.now
  const ai = FUNDING.aiLate
  const na = ai * FUNDING.aiNorthAmerica
  const sc = (v: number) => (v / whole) * BW
  const pct = (v: number) => (m ? `${d(Math.round(v * 100), locale)}٪` : `${Math.round(v * 100)}%`)
  const label = m
    ? `نیمی از سرمایه‌ی مرحله‌ی رشد (${d(ai, locale)} از ${d(whole, locale)} میلیارد دلار) به هوش مصنوعی رفت و ${pct(FUNDING.aiNorthAmerica)} آن به آمریکای شمالی.`
    : `Half of late-stage money ($${ai}B of $${whole}B) went to AI, and ${pct(FUNDING.aiNorthAmerica)} of that to North America.`
  return (
    <Frame label={label}>
      <text x={mx(X0)} y={30} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `هوش مصنوعی: ${d(ai, locale)} میلیارد دلار · ${pct(ai / whole)}` : `AI-native $${ai}B · ${pct(ai / whole)}`}
      </text>
      <Marks mirror={m}>
        <path d={`M${X0} 46 V40 H${X0 + sc(ai)} V46`} className={`fill-none stroke-v3-mute ${CTX}`} strokeWidth={1} />
        <rect x={X0 + 0.5} y={52.5} width={BW - 1} height={27} rx={2} className={`fill-none stroke-v3-mute ${CTX}`} strokeWidth={1} strokeDasharray="4 3" />
        <rect x={X0} y={52} width={sc(ai)} height={28} rx={2} className={`fill-v3-mute ${GROW}`} />
        <rect x={X0} y={52} width={sc(na)} height={28} rx={2} className={`fill-v3-light ${GROW_PT}`} />
      </Marks>
      <text x={mx(X0)} y={100} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT_PT}>
        {m ? `${pct(FUNDING.aiNorthAmerica)} به آمریکای شمالی` : `${pct(FUNDING.aiNorthAmerica)} to North America`}
      </text>
      <text x={mx(X0 + BW)} y={100} textAnchor={ta(locale, an("end"))} direction={dirOf(locale)} className={TXT}>
        {m ? `از ${d(whole, locale)} میلیارد دلار مرحله‌ی رشد` : `of $${whole}B late-stage`}
      </text>
    </Frame>
  )
}

// ── 06 · Comparison bars: the claimed army, the real one, the defenders ─────

function ViennaPreview({ locale }: P) {
  const m = fa(locale)
  const mx = mxFor(m)
  const an = anchorFor(m)
  const X0 = 8
  const BW = 264
  const max = FORCES.ottomanClaim
  const sc = (v: number) => (v / max) * BW
  const [lo, hi] = FORCES.ottomanTotal
  const def = FORCES.defendersSoldiers + FORCES.defendersCitizens
  const k = (v: number) => (m ? `${d(v / 1000, locale)} هزار` : `${(v / 1000).toLocaleString("en-US")},000`)
  const label = m
    ? `نه ${k(max)}؛ حدود ${d(lo / 1000, locale)} تا ${k(hi)} نفر آمدند. ${k(def)} نفر ${d(SIEGE_DAYS, locale)} روز دیوارها را نگه داشتند.`
    : `Not ${k(max)}: about ${k(lo)}–${k(hi)} marched. ${k(def)} held the walls for ${SIEGE_DAYS} days.`
  return (
    <Frame label={label}>
      <text x={mx(X0)} y={22} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `ارتش عثمانی: ادعا ${k(max)}، واقعی ${d(lo / 1000, locale)} تا ${k(hi)}` : `Ottoman army: ${k(max)} claimed, ${lo / 1000}–${hi / 1000}k marched`}
      </text>
      <Marks mirror={m}>
        <rect x={X0 + 0.5} y={30.5} width={BW - 1} height={21} rx={2} className={`fill-none stroke-v3-mute ${CTX}`} strokeWidth={1} strokeDasharray="4 3" />
        <rect x={X0} y={30} width={sc(hi)} height={22} rx={2} className={`fill-v3-mute/45 ${GROW}`} />
        <rect x={X0} y={30} width={sc(lo)} height={22} rx={2} className={`fill-v3-mute ${GROW}`} />
        <rect x={X0} y={86} width={Math.max(sc(def), 4)} height={22} rx={2} className={`fill-v3-light ${GROW_PT}`} />
      </Marks>
      <text x={mx(X0)} y={78} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? "مدافعان وین" : "Defenders of Vienna"}
      </text>
      <text x={mx(X0 + sc(def) + 8)} y={101} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={`${TXT_PT} ${PT}`}>
        {m ? `${k(def)} نفر · ${d(SIEGE_DAYS, locale)} روز` : `${k(def)} · held ${SIEGE_DAYS} days`}
      </text>
    </Frame>
  )
}

// ── 05 · Sparkline: the count doubled, the share barely moved ───────────────

function MigrantsPreview({ locale }: P) {
  const m = fa(locale)
  const X0 = 12
  const PW = 180
  const Y0 = 20
  const PH = 96
  const idx = (s: readonly number[]) => s.map((v) => (v / s[0]) * 100)
  const stock = idx(WORLD.stock)
  const share = idx(WORLD.pct)
  const lo = 90
  const hi = Math.max(...stock) + 4
  const x = (yr: number) => X0 + ((yr - YEARS[0]) / (YEARS[YEARS.length - 1] - YEARS[0])) * PW
  const y = (v: number) => Y0 + PH - ((v - lo) / (hi - lo)) * PH
  const path = (s: number[]) => s.map((v, i) => `${i ? "L" : "M"}${x(YEARS[i]).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")
  const last = YEARS.length - 1
  const ratio = WORLD.stock[last] / WORLD.stock[0]
  const label = m
    ? `تعداد مهاجران از ${n1(WORLD.stock[0] / 1e6, locale)} به ${d(Math.round(WORLD.stock[last] / 1e6), locale)} میلیون رسید؛ سهمشان از جمعیت جهان فقط از ${n1(WORLD.pct[0], locale)}٪ به ${n1(WORLD.pct[last], locale)}٪.`
    : `Migrants went from ${(WORLD.stock[0] / 1e6).toFixed(1)}M to ${Math.round(WORLD.stock[last] / 1e6)}M; their share of humanity only from ${WORLD.pct[0].toFixed(1)}% to ${WORLD.pct[last].toFixed(1)}%.`
  return (
    <Frame label={label}>
      <line x1={X0} y1={Y0 + PH} x2={X0 + PW} y2={Y0 + PH} className="stroke-v3-line" strokeWidth={1} />
      <path d={path(share)} pathLength={1} className={`fill-none stroke-v3-soft ${DRAW}`} strokeWidth={2} strokeLinejoin="round" />
      <path d={path(stock)} pathLength={1} className={`fill-none stroke-v3-light ${DRAW_PT}`} strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={x(YEARS[last])} cy={y(stock[last])} r={3.5} className={`fill-v3-light ${PT}`} />
      <circle cx={x(YEARS[last])} cy={y(share[last])} r={3} className={`fill-v3-soft ${CTX}`} />
      <text textAnchor={ta(locale, "start")} direction={dirOf(locale)} x={x(YEARS[last]) + 8} y={y(stock[last]) + 4} className={`${TXT_PT} ${PT}`}>
        {m ? `${d(Math.round(WORLD.stock[last] / 1e6), locale)} میلیون` : `${Math.round(WORLD.stock[last] / 1e6)}M`}
      </text>
      <text textAnchor={ta(locale, "start")} direction={dirOf(locale)} x={x(YEARS[last]) + 8} y={y(stock[last]) + 18} className={`${TXT} ${PT}`}>
        {m ? `${n1(ratio, locale)} برابر` : `×${n1(ratio, locale)}`}
      </text>
      <text textAnchor={ta(locale, "start")} direction={dirOf(locale)} x={x(YEARS[last]) + 8} y={y(share[last]) + 4} className={`${TXT} ${CTX}`}>
        {m ? `${n1(WORLD.pct[last], locale)}٪ جهان` : `${WORLD.pct[last].toFixed(1)}% of people`}
      </text>
      <text textAnchor={ta(locale, "start")} direction={dirOf(locale)} x={X0} y={134} className={TXT}>
        {d(YEARS[0], locale)}
      </text>
      <text x={X0 + PW} y={134} textAnchor={ta(locale, "end")} direction={dirOf(locale)} className={TXT}>
        {d(YEARS[last], locale)}
      </text>
    </Frame>
  )
}

// ── 04 · Sequence: 90 messages claimed, about 2.2 activation attempts real ──

function ImessagePreview({ locale }: P) {
  const m = fa(locale)
  const mx = mxFor(m)
  const an = anchorFor(m)
  const tomanPerSms = TARIFFS.mci / 10
  const attempts = TWEET.toman / tomanPerSms
  const full = Math.floor(attempts)
  const part = attempts - full
  const label = m
    ? `توییت گفت ${d(TWEET.sms, locale)} پیامک. با نرخ همراه اول، ${n0(TWEET.toman, locale)} تومان یعنی حدود ${n1(attempts, locale)} تلاش برای فعال‌سازی.`
    : `The tweet said ${TWEET.sms} messages. At MCI's rate, ${n0(TWEET.toman, locale)} toman is about ${attempts.toFixed(1)} activation attempts.`
  return (
    <Frame label={label}>
      <text x={mx(10)} y={18} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `توییت: ${d(TWEET.sms, locale)} پیامک` : `The tweet: ${TWEET.sms} messages`}
      </text>
      <Marks mirror={m}>
        <g className={CTX}>
          {Array.from({ length: TWEET.sms }, (_, i) => (
            <circle key={i} cx={12 + (i % 30) * 8.9} cy={30 + Math.floor(i / 30) * 9} r={2.4} className="fill-v3-mute" />
          ))}
        </g>
        <g className={PT}>
          {Array.from({ length: full }, (_, i) => (
            <circle key={i} cx={19 + i * 23} cy={106} r={9} className="fill-v3-light" />
          ))}
          <circle cx={19 + full * 23} cy={106} r={8.25} className="fill-none stroke-v3-light" strokeWidth={1.5} strokeDasharray="3 2.5" />
          <clipPath id="imessage-part">
            <rect x={10 + full * 23} y={96} width={18 * part} height={20} />
          </clipPath>
          <circle cx={19 + full * 23} cy={106} r={9} className="fill-v3-light" clipPath="url(#imessage-part)" />
        </g>
      </Marks>
      <text x={mx(10)} y={82} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `همراه اول، ${n0(tomanPerSms, locale)} تومان هر پیامک: ${n0(TWEET.toman, locale)} تومان یعنی` : `MCI, ${n0(tomanPerSms, locale)} toman each: ${n0(TWEET.toman, locale)} buys`}
      </text>
      <text x={mx(19 + (full + 1) * 23 + 4)} y={110} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={`${TXT_PT} ${PT}`}>
        ≈ {n1(attempts, locale)}
      </text>
    </Frame>
  )
}

// ── 03 · Unit grid: live and announced partners, and Iran's empty slot ──────

function DirectToCellPreview({ locale }: P) {
  const m = fa(locale)
  const mx = mxFor(m)
  const an = anchorFor(m)
  const live = PARTNERS.filter((p) => p.status === "live").length
  const announced = PARTNERS.filter((p) => p.status === "announced").length
  const slots = [...Array(live).fill("live"), ...Array(announced).fill("announced"), "iran"] as ("live" | "announced" | "iran")[]
  const COLS = 8
  const cx = (i: number) => 24 + (i % COLS) * 33
  const cy = (i: number) => 22 + Math.floor(i / COLS) * 28
  const iranAt = slots.length - 1
  const label = m
    ? `Direct to Cell در ${d(live, locale)} کشور فعال است و در ${d(announced, locale)} کشور اعلام شده. برای ایران: صفر.`
    : `Direct to Cell runs in ${live} countries and is announced in ${announced}. For Iran: none.`
  return (
    <Frame label={label}>
      <Marks mirror={m}>
        <g className={CTX}>
          {slots.map((s, i) =>
            s === "live" ? (
              <circle key={i} cx={cx(i)} cy={cy(i)} r={8} className="fill-v3-mute" />
            ) : s === "announced" ? (
              <circle key={i} cx={cx(i)} cy={cy(i)} r={7.25} className="fill-none stroke-v3-mute" strokeWidth={1.5} />
            ) : null,
          )}
        </g>
        <circle cx={cx(iranAt)} cy={cy(iranAt)} r={7.25} className={`fill-none stroke-v3-light ${PT}`} strokeWidth={1.75} strokeDasharray="3 2.5" />
      </Marks>
      <text x={mx(cx(iranAt))} y={cy(iranAt) + 24} textAnchor={ta(locale, "middle")} direction={dirOf(locale)} className={`${TXT_PT} ${PT}`}>
        {m ? "ایران · صفر" : "Iran · 0"}
      </text>
      <text x={mx(16)} y={126} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `● فعال ${d(live, locale)}   ○ اعلام‌شده ${d(announced, locale)}` : `● live ${live}   ○ announced ${announced}`}
      </text>
    </Frame>
  )
}

// ── 02 · Clock ring: 500 million years as the last minutes of Earth's day ───

function DeepTimePreview({ locale }: P) {
  const m = fa(locale)
  const age = eventAge("lamprey")
  const deg = (age / EARTH_AGE) * 360
  const left = 86400 - clockSeconds(age)
  const hh = Math.floor(left / 3600)
  const mm = Math.round((left % 3600) / 60)
  const CX = 64
  const CY = 72
  const R = 48
  const pt = (a: number) => {
    const r = ((a - 90) * Math.PI) / 180
    return `${(CX + R * Math.cos(r)).toFixed(2)} ${(CY + R * Math.sin(r)).toFixed(2)}`
  }
  const arc = `M${pt(360 - deg)} A${R} ${R} 0 0 1 ${pt(359.99)}`
  const label = m
    ? `اگر تاریخ زمین یک روز بود، محور استرس در ${d(hh, locale)} ساعت و ${d(mm, locale)} دقیقه‌ی آخرش کار کرده است.`
    : `If Earth's history were one day, the stress axis has run for its last ${hh} h ${mm} min.`
  return (
    <Frame label={label}>
      <circle cx={CX} cy={CY} r={R} className="fill-none stroke-v3-line" strokeWidth={10} />
      <path d={arc} pathLength={1} className={`fill-none stroke-v3-light ${DRAW_PT}`} strokeWidth={10} />
      <line x1={CX} y1={CY - R - 9} x2={CX} y2={CY - R + 9} className={`stroke-v3-bone ${CTX}`} strokeWidth={1.5} />
      <text x={CX} y={CY - R - 13} textAnchor={ta(locale, "middle")} direction={dirOf(locale)} className={TXT}>
        {d("24:00", locale)}
      </text>
      <text x={CX} y={CY + 4} textAnchor={ta(locale, "middle")} direction={dirOf(locale)} className={TXT}>
        {m ? "یک روز" : "one day"}
      </text>
      <text textAnchor={ta(locale, "start")} direction={dirOf(locale)} x={132} y={60} className={`${TXT_PT} ${PT}`}>
        {m ? `${d(Math.round(age / 1e6), locale)} میلیون سال آخر =` : `The last ${Math.round(age / 1e6)}M years =`}
      </text>
      <text textAnchor={ta(locale, "start")} direction={dirOf(locale)} x={132} y={76} className={`${TXT_PT} ${PT}`}>
        {m ? `${d(hh, locale)} ساعت و ${d(mm, locale)} دقیقه‌ی آخر` : `the last ${hh} h ${mm} min`}
      </text>
      <text textAnchor={ta(locale, "start")} direction={dirOf(locale)} x={132} y={92} className={TXT}>
        {m ? "از روز ۲۴ ساعته‌ی زمین" : "of Earth's 24-hour day"}
      </text>
    </Frame>
  )
}

// ── 01 · Comparison bars: eight stocks against the EU-27 economy ────────────

function EightStocksPreview({ locale }: P) {
  const m = fa(locale)
  const mx = mxFor(m)
  const an = anchorFor(m)
  const X0 = 8
  const BW = 264
  const total = COMPANIES.reduce((s, c) => s + c.cap, 0)
  const max = Math.max(total, EU27_GDP) * 1.0
  const sc = (v: number) => (v / max) * BW
  const t = (b: number) => (m ? `${n1(b / 1000, locale)} تریلیون دلار` : `$${(b / 1000).toFixed(1)}T`)
  let acc = 0
  const label = m
    ? `ارزش بازار ${d(COMPANIES.length, locale)} سهم فناوری آمریکا (${t(total)}) از کل GDP سالانه‌ی اتحادیه‌ی اروپا (${t(EU27_GDP)}) بیشتر است.`
    : `Eight US tech stocks (${t(total)}) are valued above the EU's whole annual GDP (${t(EU27_GDP)}).`
  return (
    <Frame label={label}>
      <text x={mx(X0)} y={26} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `${d(COMPANIES.length, locale)} سهم فناوری آمریکا` : `${COMPANIES.length} US tech stocks · market value`}
      </text>
      <text x={mx(X0 + BW)} y={26} textAnchor={ta(locale, an("end"))} direction={dirOf(locale)} className={TXT_PT}>
        {t(total)}
      </text>
      <Marks mirror={m}>
        <g className={GROW_PT}>
          {COMPANIES.map((c) => {
            const x = X0 + sc(acc)
            acc += c.cap
            return <rect key={c.key} x={x} y={34} width={Math.max(sc(c.cap) - 1.5, 1)} height={24} rx={1.5} className="fill-v3-light" />
          })}
        </g>
        <rect x={X0} y={94} width={sc(EU27_GDP)} height={24} rx={1.5} className={`fill-v3-mute ${GROW}`} />
      </Marks>
      <text x={mx(X0)} y={86} textAnchor={ta(locale, an("start"))} direction={dirOf(locale)} className={TXT}>
        {m ? `GDP اتحادیه‌ی اروپا، ${d(2026, locale)}` : "EU-27 GDP, 2026"}
      </text>
      <text x={mx(X0 + BW)} y={86} textAnchor={ta(locale, an("end"))} direction={dirOf(locale)} className={TXT}>
        {t(EU27_GDP)}
      </text>
    </Frame>
  )
}

/** One preview per report slug. A slug missing here simply shows no chart. */
export const REPORT_PREVIEWS: Record<string, (p: P) => ReactNode> = {
  "undecided-fifth-2026-midterms": UndecidedPreview,
  "startup-ecosystems-2026-concentration": ConcentrationPreview,
  "siege-of-vienna-1683-scarce-resources": ViennaPreview,
  "international-migrants-304-million": MigrantsPreview,
  "imessage-hidden-sms-cost": ImessagePreview,
  "starlink-direct-to-cell-iran": DirectToCellPreview,
  "deep-time-pain": DeepTimePreview,
  "eight-stocks-twenty-economies": EightStocksPreview,
}

/** For the tests: the numbers each preview draws, from the same imports. */
export const PREVIEW_FACTS = {
  undecided: { und: pewGroup("all").und, notSure: SURVEY.notSure, other: SURVEY.other },
  concentrationNA: FUNDING.aiLate * FUNDING.aiNorthAmerica,
  viennaDefenders: FORCES.defendersSoldiers + FORCES.defendersCitizens,
  imessageAttempts: TWEET.toman / (TARIFFS.mci / 10),
  dtc: { live: PARTNERS.filter((p) => p.status === "live").length, announced: PARTNERS.filter((p) => p.status === "announced").length },
  deepTimeDeg: (eventAge("lamprey") / EARTH_AGE) * 360,
  eightStocksTotal: COMPANIES.reduce((s, c) => s + c.cap, 0),
  eu27: EU27_GDP,
}
