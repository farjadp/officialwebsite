// ============================================================================
// File Path: src/components/v3/reports/startup-concentration/copy.ts
// Why: Every word of report 07 in both locales, one structure for both. The
//      English follows Farjad's own report ("Concentration, Not
//      Diversification") and keeps its thesis and its discipline: every
//      figure labelled by the report it comes from, derived numbers marked,
//      the interpretation section labelled as opinion with a falsification
//      condition for each read. The Persian says the same thing.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { ClaimKey, ReadKey, RoundRegion, RoundStage } from "./data"

export type MedalKey = "factcheck" | "stage" | "dollar" | "catchup" | "unicorns" | "bets"

type Copy = {
  hero: { kicker: string; lead: string; kpis: { n: string; l: string; d: string }[]; medals: string }
  check: {
    kicker: string
    title: string
    lead: string
    claimLabel: string
    yourCall: string
    calls: Record<"true" | "false" | "half", string>
    reveal: string
    right: string
    wrong: string
    score: (got: string, n: string) => string
    verdictNote: string
    items: Record<ClaimKey, { claim: string; truth: string; source: string }>
    lesson: string
  }
  stage: {
    kicker: string
    title: string
    lead: string
    blended: string
    split: string
    blendedLabel: string
    late: string
    seriesA: string
    yoy: string
    blendedNote: string
    prevLegend: string
    signal: { title: string; body: string }
    callout: { title: string; body: string }
  }
  dollar: {
    kicker: string
    title: string
    lead: string
    steps: { label: string; note: string }[]
    next: string
    again: string
    derived: string
    callout: { title: string; body: string }
  }
  base: {
    kicker: string
    title: string
    lead: string
    scoreAxis: string
    gainsTitle: string
    gainsSub: string
    gainsVerdict: string
    pts: string
    before: string
    now: string
    calc: {
      title: string
      lead: string
      sgGrowth: string
      usGrowth: string
      never: string
      years: (y: string, year: string) => string
      note: string
    }
    callout: { title: string; body: string }
  }
  unicorns: {
    kicker: string
    title: string
    lead: string
    byCountry: string
    usVsRest: string
    nextNine: string
    names: Record<string, string>
    verdict: (us: string, rest: string) => string
    callout: { title: string; body: string }
  }
  moves: { kicker: string; title: string; lead: string; items: { title: string; stat: string; data: string; why: string }[] }
  reads: {
    kicker: string
    title: string
    lead: string
    agree: string
    disagree: string
    reasoning: string
    falsify: string
    watch: string
    tally: (a: string, n: string) => string
    items: Record<ReadKey, { read: string; reasoning: string; falsify: string; watch?: string }>
  }
  round: {
    kicker: string
    title: string
    lead: string
    stage: string
    region: string
    stages: Record<RoundStage, string>
    regions: Record<RoundRegion, string>
    answers: Record<RoundStage, Record<RoundRegion, string>>
  }
  notes: { kicker: string; title: string; items: { t: string; b: string }[] }
  medals: { title: string; hint: string; names: Record<MedalKey, string>; complete: string; open: string; close: string }
  method: { sourcesTitle: string; sources: { label: string; href: string }[] }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

const SOURCES = [
  { label: "StartupBlink, Global Startup Ecosystem Index 2026 (PDF)", href: "https://www.start-up.ma/wp-content/uploads/2026/05/startupecosystemreport-2026.pdf" },
  { label: "Startup Genome, Global Startup Ecosystem Report 2026, Introduction", href: "https://startupgenome.com/report/the-global-startup-ecosystem-report-2026/introduction" },
  { label: "Startup Genome, GSER 2026, Global Startup Ecosystem Ranking: Top 40", href: "https://startupgenome.com/report/the-global-startup-ecosystem-report-2026/global-startup-ecosystem-ranking-2026-top-40" },
  { label: "StartupBlink, Top Unicorn Cities and Countries 2026", href: "https://www.startupblink.com/blog/top-unicorn-cities-and-countries/" },
  { label: "Crunchbase News, Q1 2026 global venture funding (context only)", href: "https://news.crunchbase.com/venture/record-breaking-funding-ai-global-q1-2026/" },
]

export const COPY: Record<Locale, Copy> = {
  en: {
    hero: {
      kicker: "Reports",
      lead: "The 2026 startup reports are usually read as proof that the map is being redrawn. Read carefully, they say something closer to the opposite. In 2025 capital recovered, but only at the top of the stack, and the fastest-growing ecosystems are growing from small bases while the gap to the leader widens. Every figure here was checked against the source report before it was drawn.",
      kpis: [
        { n: "+17%", l: "Late-stage funding", d: "to ~US$210B in 2025" },
        { n: "+2%", l: "Series A funding", d: "to US$46.5B in 2025, near flat" },
        { n: "86%", l: "of late-stage AI-native funding", d: "went to North America" },
        { n: "3.9×", l: "US score vs the UK", d: "the #1 and #2 countries" },
      ],
      medals: "Earn a fact-checker's badge in each interactive section. There are six.",
    },
    check: {
      kicker: "Before anything else",
      title: "Can you spot the wrong numbers?",
      lead: "Before writing this report I checked a summary post of both reports, line by line, and then checked my own check against the source text. Eight of its claims are below. Call each one: true, false or half-true. Then see what the reports actually say.",
      claimLabel: "The post said",
      yourCall: "Your call",
      calls: { true: "True", false: "False", half: "Half-true" },
      reveal: "What the report says",
      right: "Correct",
      wrong: "Not quite",
      score: (got, n) => `You called ${got} of ${n} correctly.`,
      verdictNote: "",
      items: {
        late: { claim: "\"Late-stage funding grew roughly 17% to US$210B.\"", truth: "True. Startup Genome: late-stage funding grew 17% to about US$210B in 2025.", source: "GSER 2026" },
        seriesA: { claim: "\"Q1 2026 Series A rounds surged 28%.\"", truth: "True, and my first check got this one wrong. GSER's key insights say it: Q1 2026 Series A is up 28% over the 2025 quarterly average. It is one quarter, measured against an average, while the full-year 2025 figure is +2%.", source: "GSER 2026" },
        aiNa: { claim: "\"North America captured 86% of late-stage global AI funding.\"", truth: "True, in GSER's sentence on AI-native funding: North American startups received 86% of it at late stage (73% at early stage). Don't confuse it with North America's share of all late-stage funding, which is 64%.", source: "GSER 2026" },
        coverage: { claim: "\"The Index benchmarks 1,500+ cities across 120 countries.\"", truth: "Half-true. 1,556 cities is right; the countries are 100, not 120.", source: "StartupBlink 2026" },
        singapore: { claim: "\"Singapore ranks 4th globally per capita.\"", truth: "False. Singapore ranks 4th globally, full stop. StartupBlink publishes no per-capita table.", source: "StartupBlink 2026" },
        unicorns: { claim: "\"StartupBlink tracks 1,213 unicorns.\"", truth: "False. The 2026 index gives no global total. The 1,113 often quoted instead comes from StartupBlink's 2023 unicorn map, so every percentage built on either number is built on sand.", source: "StartupBlink 2026" },
        us: { claim: "\"United States: 633 unicorns (52%).\"", truth: "False. The US page of the 2026 index says 620. The older 594 is from the 2023 unicorn map.", source: "StartupBlink 2026" },
        riyadh: { claim: "\"Riyadh is now the Gulf's top-ranked hub, backed by Saudi Arabia's 97% growth.\"", truth: "True. Riyadh is 42nd, Dubai 48th, and Riyadh was named City of the Year.", source: "StartupBlink 2026" },
      },
      lesson: "The dangerous errors were not the wild ones. 41% of 1,213 really is about 497: the arithmetic was consistent, just built on a denominator that does not exist. And the claim that looked most like an invention, Series A +28%, turned out to be in the report. Check the source text, including against your own fact-check.",
    },
    stage: {
      kicker: "1 · The recovery",
      title: "The recovery is real, and it is top-heavy",
      lead: "\"Funding has recovered\" is true. What gets dropped is where it recovered. Switch between the averaged headline and the split by stage.",
      blended: "The headline",
      split: "By stage",
      blendedLabel: "Late-stage and Series A, averaged",
      late: "Late-stage",
      seriesA: "Series A",
      yoy: "year on year",
      blendedNote: "Averaging the two stages gives about +14%. It is a true number that describes nobody.",
      prevLegend: "Dashed outline: the 2024 level, back-calculated from the growth rate.",
      signal: {
        title: "The first signal from 2026",
        body: "GSER adds that Q1 2026 Series A was up 28% over the 2025 quarterly average. One quarter against an average is not a trend, but it is the first sign that the bottom of the stack may be catching up. It is the number to watch.",
      },
      callout: {
        title: "What this meant for anyone raising in 2025",
        body: "A company already at scale is raising into a market with 17% more capital than last year. A company raising its first institutional round is raising into a market that barely moved. The recovery narrative is most useful to the companies that needed it least.",
      },
    },
    dollar: {
      kicker: "2 · Follow the dollar",
      title: "AI is not a sector in this data. It is most of the late stage.",
      lead: "Follow one late-stage dollar of 2025 down through the data. Each step is one click.",
      steps: [
        { label: "All late-stage funding, 2025", note: "~US$210B · Startup Genome" },
        { label: "Into AI-native companies", note: "US$108B · about half of it" },
        { label: "Into North America", note: "86% of the AI-native money · about US$93B" },
        { label: "Left for every other region", note: "about US$15B of late-stage AI-native money" },
      ],
      next: "Next step",
      again: "Start again",
      derived: "The ~51% share and the ~US$93B are calculated from the reported totals; GSER says \"over half\". The 86% is from GSER's sentence on AI-native funding. North America's share of all late-stage funding is a different number: 64%.",
      callout: {
        title: "The compounding effect",
        body: "These two facts multiply rather than sit side by side. If roughly half of late-stage capital goes to AI-native companies, and 86% of that flows to one region, then the largest pool of growth capital in the world is also the most geographically concentrated. Every ecosystem competing for late-stage AI rounds is competing for the 14% that is left.",
      },
    },
    base: {
      kicker: "3 · Fast growth, small base",
      title: "Near-identical growth rates, very different absolute gains",
      lead: "Saudi Arabia grew 97%, Taiwan 41.1%, Singapore 24.4%. The United States grew 23.6%, the slowest of that group. But growth rates and absolute gains are different quantities, and here they point in opposite directions.",
      scoreAxis: "StartupBlink composite score, 2026",
      gainsTitle: "Score points added in one year",
      gainsSub: "Derived: last year's score = this year's ÷ (1 + growth), then subtracted.",
      gainsVerdict: "The US alone added about as many points as the next nine countries put together.",
      pts: "pts",
      before: "before",
      now: "now",
      calc: {
        title: "Catch-up calculator",
        lead: "How fast would Singapore have to grow, every year, to catch the United States? Move the sliders.",
        sgGrowth: "Singapore's yearly score growth",
        usGrowth: "US yearly score growth",
        never: "Never: at these rates the gap only widens.",
        years: (y, year) => `Catch-up in about ${y} years, around ${year}.`,
        note: "Illustrative arithmetic on index scores, not a forecast. Scores also move with methodology changes between editions.",
      },
      callout: {
        title: "The arithmetic that undercuts the \"multipolar\" reading",
        body: "Singapore grew faster than the United States, 24.4% against 23.6%, and added about 13 points of score. The United States added about 60. On these numbers the gap between the leader and everyone else widened in 2026, even though the leader posted the lower growth rate. Reporting growth rates alone makes convergence look like it is happening when it is not.",
      },
    },
    unicorns: {
      kicker: "4 · Unicorns",
      title: "Unicorn concentration says the same thing",
      lead: "Each square is one unicorn, as printed on each country's page of the 2026 index. Switch between the ten countries side by side and the US against the next nine put together.",
      byCountry: "Country by country",
      usVsRest: "US vs the next nine",
      nextNine: "The next nine combined",
      names: { US: "United States", CN: "China", IN: "India", GB: "United Kingdom", DE: "Germany", FR: "France", IL: "Israel", CA: "Canada", BR: "Brazil", SG: "Singapore" },
      verdict: (us, rest) => `The United States has ${us} unicorns; the next nine countries together have ${rest}.`,
      callout: {
        title: "Treat every unicorn count as soft",
        body: "The 2026 index lists unicorns country by country but publishes no global total, and the totals that circulate (1,113, 1,213) come from older or different snapshots. CB Insights, Hurun and Dealroom publish materially different totals for the same week. The concentration pattern holds across all of them. The specific integers do not.",
      },
    },
    moves: {
      kicker: "5 · Where the map does move",
      title: "Three shifts that are structural, not cyclical",
      lead: "Concentration is the dominant story, but not the only one. These three are worth tracking precisely because they do not reverse when interest rates move.",
      items: [
        { title: "The Gulf's centre moved", stat: "Riyadh 42nd · Dubai 48th", data: "Riyadh climbed 30 places, passed Dubai and was named StartupBlink's City of the Year. Saudi Arabia grew 97% and now leads the GCC.", why: "State-directed capital allocation, not a funding cycle." },
        { title: "Taiwan entered the top 20", stat: "20th · +41.1%", data: "Up 5 places, with the fastest growth in the top 20.", why: "Hardware and semiconductor depth: the one asset base that cannot be copied quickly elsewhere." },
        { title: "DefenseTech broke out", stat: "Series A value +60%", data: "Deal counts up about 15% over the past year.", why: "Geopolitical procurement demand with long contract cycles: the least rate-sensitive category in the report." },
      ],
    },
    reads: {
      kicker: "6 · What follows",
      title: "Five reads, and what would prove each one wrong",
      lead: "This section is interpretation, not a finding of either report. The figures above are theirs; the reading is mine. Take a side on each, then see what would falsify it.",
      agree: "I agree",
      disagree: "I don't",
      reasoning: "Reasoning from the data",
      falsify: "What would falsify it",
      watch: "Watch",
      tally: (a, n) => `You agreed with ${a} of ${n}.`,
      items: {
        centre: { read: "The centre holds, the edges diversify", reasoning: "The US added ~60 score points while the fastest-growing peer added ~13. Concentration is rising in absolute terms even as more ecosystems appear on the board.", falsify: "Series A growth outside North America outpacing the US for two years in a row." },
        early: { read: "Early-stage is the real bottleneck", reasoning: "Series A at +2% against late-stage at +17% in 2025. The constraint on new ecosystems is first-round capital, not growth capital.", falsify: "A Series A recovery that tracks late-stage within a few points.", watch: "GSER's Q1 2026 signal (Series A +28% over the 2025 quarterly average) is the first evidence against this read. If it holds for the year, this read is wrong." },
        ai: { read: "\"AI company\" stops being a category", reasoning: "If AI-native already takes about half of late-stage capital, the label has stopped telling companies apart.", falsify: "AI-native's share falling back below a third of late-stage." },
        hardware: { read: "Hardware's share should rise", reasoning: "DefenseTech Series A +60%, and Taiwan's climb rests on hardware depth. Both point the same way.", falsify: "DefenseTech Series A growth back in single digits as geopolitical demand eases." },
        state: { read: "State capital is now an ecosystem input", reasoning: "Saudi Arabia's 97% growth and Riyadh's 30-place climb are not explained by a market cycle.", falsify: "Riyadh's rank stalling or reversing once the current programme spend plateaus." },
      },
    },
    round: {
      kicker: "For founders",
      title: "Where is your next round?",
      lead: "Pick your stage and your region. The answer is what this data says about the market you are walking into.",
      stage: "Stage",
      region: "Region",
      stages: { seed: "Pre-seed / seed", seriesA: "Series A", late: "Growth / late-stage" },
      regions: { na: "North America", elsewhere: "Elsewhere" },
      answers: {
        seed: {
          na: "The reports say little about seed directly, but the next step after seed, Series A, barely grew (+2%). Plan for a long road from seed to A, and raise enough to reach real traction.",
          elsewhere: "The hardest corner of this data: first-institutional money barely grew, and most new capital went to late-stage North America. Build for a long runway, and look at state programmes where they exist.",
        },
        seriesA: {
          na: "Through 2025 you were raising into a market that grew 2%, not 17%. Q1 2026 looks better (+28% over the 2025 quarterly average), but one quarter is not a trend: plan for a selective round.",
          elsewhere: "Flat Series A capital, outside the region that took 86% of late-stage AI money. Your local ecosystem's depth matters more than the global headline.",
        },
        late: {
          na: "This is where the recovery is: late-stage +17%, and most AI-native late-stage money flows to you. The market is on your side; the competition for it is too.",
          elsewhere: "Late-stage capital grew, but the AI-native slice of it went 86% to North America. You are competing for the remaining 14%.",
        },
      },
    },
    notes: {
      kicker: "Data notes",
      title: "Read these before quoting any number",
      items: [
        { t: "Two reports, two methods", b: "StartupBlink ranks 1,556 cities and 100 countries on a composite score of startup quantity, quality and business environment. Startup Genome ranks about 40 ecosystems and focuses on funding and ecosystem value. Figures are labelled by source and are not interchangeable." },
        { t: "Calculated figures are marked", b: "Two numbers here are mine, not the reports': the AI-native share of late-stage funding (US$108B ÷ ~US$210B) and the absolute score gains (score ÷ (1 + growth), subtracted). Both are shown with their inputs." },
        { t: "Score growth is not output growth", b: "StartupBlink's growth percentages measure change in a composite score, which also moves with methodology and coverage changes. They are not funding, revenue or company formation." },
        { t: "Funding figures are 2025 full-year", b: "GSER 2026 reports on 2025. Crunchbase put Q1 2026 global venture funding near US$300B, but that is a different source on a different basis and is not mixed in here." },
        { t: "Checked twice", b: "A second check against the source text changed three things: Series A +28% in Q1 2026 is in GSER after all; the 86% belongs to AI-native funding, while North America's share of all late-stage funding is 64%; and the unicorn counts here are the 2026 index's own, not the 2023 unicorn map." },
      ],
    },
    medals: {
      title: "Fact-checker badges",
      hint: "Earn a badge in each interactive section.",
      names: { factcheck: "Fact-checker", stage: "Stage split", dollar: "Money trail", catchup: "Catch-up maths", unicorns: "Herd counter", bets: "Placed your bets" },
      complete: "All six badges. You now read startup headlines the way an analyst does.",
      open: "Open badges",
      close: "Close",
    },
    method: { sourcesTitle: "Sources", sources: SOURCES },
    colophon: {
      shareTitle: "Concentration, not diversification: what the 2026 startup reports really say",
      disclaimer: "StartupBlink and Startup Genome figures remain their publishers' copyright; the analysis and interpretation are mine. Not investment advice.",
      cta: "Talk to Farjad",
    },
  },

  fa: {
    hero: {
      kicker: "گزارش‌ها",
      lead: "گزارش‌های استارتاپی ۲۰۲۶ را معمولاً این‌طور می‌خوانند که نقشه‌ی استارتاپی جهان دارد از نو کشیده می‌شود. اگر دقیق بخوانی، تقریباً برعکسش را می‌گویند. در ۲۰۲۵ سرمایه برگشت، اما فقط در طبقه‌های بالا؛ و اکوسیستم‌هایی که سریع‌تر رشد می‌کنند از پایه‌ی کوچکی رشد می‌کنند، در حالی که فاصله‌شان با نفر اول بیشتر می‌شود. همه‌ی ارقام این صفحه پیش از رسم با خود گزارش‌ها چک شده‌اند.",
      kpis: [
        { n: "+۱۷٪", l: "سرمایه‌گذاری مرحله‌ی رشد", d: "به حدود ۲۱۰ میلیارد دلار در ۲۰۲۵" },
        { n: "+۲٪", l: "سرمایه‌گذاری سری A", d: "به ۴۶٫۵ میلیارد دلار در ۲۰۲۵؛ تقریباً ثابت" },
        { n: "۸۶٪", l: "از سرمایه‌ی مرحله‌ی رشد شرکت‌های AI-محور", d: "به آمریکای شمالی رفت" },
        { n: "۳٫۹×", l: "امتیاز آمریکا در برابر بریتانیا", d: "رتبه‌ی اول و دوم" },
      ],
      medals: "در هر بخش تعاملی یک نشان راستی‌آزما بگیر. شش نشان در این صفحه هست.",
    },
    check: {
      kicker: "پیش از هر چیز",
      title: "می‌توانی عددهای غلط را پیدا کنی؟",
      lead: "پیش از نوشتن این گزارش، یک پست خلاصه از این دو گزارش را خط‌به‌خط چک کردم و بعد چکِ خودم را هم با متن اصلی گزارش‌ها دوباره سنجیدم. هشت ادعایش این‌جاست. درباره‌ی هر کدام نظر بده: درست، غلط یا نیمه‌درست. بعد ببین گزارش‌ها واقعاً چه می‌گویند.",
      claimLabel: "پست گفته بود",
      yourCall: "نظر تو",
      calls: { true: "درست", false: "غلط", half: "نیمه‌درست" },
      reveal: "گزارش چه می‌گوید",
      right: "درست گفتی",
      wrong: "نه دقیقاً",
      score: (got, n) => `${got} از ${n} را درست تشخیص دادی.`,
      verdictNote: "",
      items: {
        late: { claim: "«سرمایه‌گذاری مرحله‌ی رشد حدود ۱۷٪ رشد کرد و به ۲۱۰ میلیارد دلار رسید.»", truth: "درست. استارتاپ ژنوم: سرمایه‌ی مرحله‌ی رشد در ۲۰۲۵ با ۱۷٪ رشد به حدود ۲۱۰ میلیارد دلار رسید.", source: "GSER 2026" },
        seriesA: { claim: "«دورهای سری A در سه‌ماهه‌ی اول ۲۰۲۶، ۲۸٪ جهش کردند.»", truth: "درست؛ و چک اولِ من این یکی را اشتباه گرفته بود. در یافته‌های کلیدی GSER آمده: سری A در سه‌ماهه‌ی اول ۲۰۲۶، ۲۸٪ بالاتر از میانگین فصلی ۲۰۲۵ بود. یک فصل است در برابر یک میانگین؛ رقم کل ۲۰۲۵ همان +۲٪ است.", source: "GSER 2026" },
        aiNa: { claim: "«آمریکای شمالی ۸۶٪ سرمایه‌ی جهانی هوش مصنوعی در مرحله‌ی رشد را گرفت.»", truth: "درست، در جمله‌ی GSER درباره‌ی سرمایه‌ی شرکت‌های AI-محور: ۸۶٪ آن در مرحله‌ی رشد (و ۷۳٪ در مرحله‌ی اولیه) به استارتاپ‌های آمریکای شمالی رسید. با سهم آمریکای شمالی از کل سرمایه‌ی مرحله‌ی رشد قاطی نشود که ۶۴٪ است.", source: "GSER 2026" },
        coverage: { claim: "«این شاخص بیش از ۱٬۵۰۰ شهر در ۱۲۰ کشور را می‌سنجد.»", truth: "نیمه‌درست. ۱٬۵۵۶ شهر درست است؛ کشورها ۱۰۰ تا هستند، نه ۱۲۰.", source: "StartupBlink 2026" },
        singapore: { claim: "«سنگاپور به نسبت جمعیت، رتبه‌ی چهارم جهان است.»", truth: "غلط. سنگاپور رتبه‌ی چهارم جهان است، بی‌قید. استارتاپ‌بلینک جدولی به نسبت جمعیت منتشر نمی‌کند.", source: "StartupBlink 2026" },
        unicorns: { claim: "«استارتاپ‌بلینک ۱٬۲۱۳ یونیکورن را دنبال می‌کند.»", truth: "غلط. شاخص ۲۰۲۶ اصلاً جمع جهانی منتشر نمی‌کند. عدد ۱٬۱۱۳ که به جایش نقل می‌شود مال نقشه‌ی یونیکورن ۲۰۲۳ استارتاپ‌بلینک است؛ پس هر درصدی که روی هر کدام ساخته شود، روی شن ساخته شده.", source: "StartupBlink 2026" },
        us: { claim: "«آمریکا: ۶۳۳ یونیکورن (۵۲٪).»", truth: "غلط. صفحه‌ی آمریکا در شاخص ۲۰۲۶ می‌گوید ۶۲۰. عدد قدیمی‌تر ۵۹۴ مال نقشه‌ی یونیکورن ۲۰۲۳ است.", source: "StartupBlink 2026" },
        riyadh: { claim: "«ریاض حالا اول خلیج فارس است، با پشتوانه‌ی رشد ۹۷٪ عربستان.»", truth: "درست. ریاض رتبه‌ی ۴۲ است، دبی ۴۸، و ریاض «شهر سال» شد.", source: "StartupBlink 2026" },
      },
      lesson: "خطرناک‌ترین خطاها خطاهای عجیب نبودند. ۴۱٪ از ۱٬۲۱۳ واقعاً حدود ۴۹۷ می‌شود: حساب درست بود، فقط روی مخرجی که وجود ندارد. و ادعایی که بیشتر از همه ساختگی به نظر می‌رسید، سری A +۲۸٪، در خود گزارش بود. متن منبع را چک کن، حتی در برابر راستی‌آزمایی خودت.",
    },
    stage: {
      kicker: "۱ · بازگشت سرمایه",
      title: "بازگشت سرمایه واقعی است، اما سنگینی‌اش در بالاست",
      lead: "«سرمایه برگشته» درست است. چیزی که گم می‌شود این است که کجا برگشته. بین تیتر میانگین‌گرفته و تفکیک مرحله‌ها جابه‌جا شو.",
      blended: "تیتر",
      split: "به تفکیک مرحله",
      blendedLabel: "مرحله‌ی رشد و سری A، میانگین‌گرفته",
      late: "مرحله‌ی رشد",
      seriesA: "سری A",
      yoy: "نسبت به سال قبل",
      blendedNote: "میانگین دو مرحله حدود +۱۴٪ می‌شود. عددی درست که حال هیچ‌کس را توصیف نمی‌کند.",
      prevLegend: "خط‌چین: سطح ۲۰۲۴، که از نرخ رشد برگردانده شده.",
      signal: {
        title: "اولین نشانه از ۲۰۲۶",
        body: "GSER اضافه می‌کند که سری A در سه‌ماهه‌ی اول ۲۰۲۶، ۲۸٪ بالاتر از میانگین فصلی ۲۰۲۵ بود. یک فصل در برابر یک میانگین، روند نیست؛ اما اولین نشانه است که پایین هرم شاید دارد به بالا می‌رسد. عددی است که باید دنبالش کرد.",
      },
      callout: {
        title: "معنایش برای کسی که در ۲۰۲۵ جذب سرمایه می‌کرد",
        body: "شرکتی که به مقیاس رسیده، در بازاری سرمایه جذب می‌کند که ۱۷٪ بیشتر از پارسال پول دارد. شرکتی که اولین دور نهادی‌اش را جذب می‌کند، وارد بازاری می‌شود که تقریباً تکان نخورده. روایت «بازگشت سرمایه» بیشتر به درد کسانی می‌خورد که کمتر از همه به آن نیاز داشتند.",
      },
    },
    dollar: {
      kicker: "۲ · رد دلار را بگیر",
      title: "در این داده‌ها هوش مصنوعی یک بخش نیست؛ بیشترِ مرحله‌ی رشد است",
      lead: "یک دلار سرمایه‌ی مرحله‌ی رشد در ۲۰۲۵ را در داده‌ها دنبال کن. هر قدم یک کلیک است.",
      steps: [
        { label: "کل سرمایه‌ی مرحله‌ی رشد، ۲۰۲۵", note: "حدود ۲۱۰ میلیارد دلار · استارتاپ ژنوم" },
        { label: "به شرکت‌های AI-محور", note: "۱۰۸ میلیارد دلار · حدود نصف" },
        { label: "به آمریکای شمالی", note: "۸۶٪ از پول AI-محور · حدود ۹۳ میلیارد دلار" },
        { label: "برای همه‌ی مناطق دیگر", note: "حدود ۱۵ میلیارد دلار از پول AI-محور مرحله‌ی رشد" },
      ],
      next: "قدم بعد",
      again: "از اول",
      derived: "سهم حدود ۵۱٪ و رقم حدود ۹۳ میلیارد را من از ارقام گزارش‌شده حساب کرده‌ام؛ GSER می‌گوید «بیش از نصف». عدد ۸۶٪ از جمله‌ی GSER درباره‌ی سرمایه‌ی AI-محور است. سهم آمریکای شمالی از کل سرمایه‌ی مرحله‌ی رشد عدد دیگری است: ۶۴٪.",
      callout: {
        title: "اثر ضربی",
        body: "این دو واقعیت کنار هم نمی‌نشینند؛ در هم ضرب می‌شوند. اگر حدود نیمی از سرمایه‌ی مرحله‌ی رشد به شرکت‌های AI-محور برود و ۸۶٪ آن به یک منطقه، آن‌وقت بزرگ‌ترین استخر سرمایه‌ی رشد در جهان، متمرکزترینش هم هست. هر اکوسیستمی که برای دورهای AI مرحله‌ی رشد رقابت می‌کند، سر همان ۱۴٪ باقی‌مانده رقابت می‌کند.",
      },
    },
    base: {
      kicker: "۳ · رشد سریع، پایه‌ی کوچک",
      title: "نرخ رشد تقریباً یکسان، افزایش مطلق کاملاً متفاوت",
      lead: "عربستان ۹۷٪ رشد کرد، تایوان ۴۱٫۱٪، سنگاپور ۲۴٫۴٪. آمریکا ۲۳٫۶٪؛ کندترین در این گروه. اما نرخ رشد و افزایش مطلق دو کمیت متفاوت‌اند و این‌جا در دو جهت مخالف اشاره می‌کنند.",
      scoreAxis: "امتیاز ترکیبی استارتاپ‌بلینک، ۲۰۲۶",
      gainsTitle: "امتیازی که در یک سال اضافه شد",
      gainsSub: "محاسبه‌شده: امتیاز پارسال = امتیاز امسال ÷ (۱ + رشد)، بعد تفریق.",
      gainsVerdict: "آمریکا به‌تنهایی تقریباً به اندازه‌ی نُه کشور بعدی روی هم امتیاز اضافه کرد.",
      pts: "امتیاز",
      before: "پیش‌تر",
      now: "اکنون",
      calc: {
        title: "ماشین‌حساب رسیدن",
        lead: "سنگاپور باید هر سال با چه سرعتی رشد کند تا به آمریکا برسد؟ لغزنده‌ها را جابه‌جا کن.",
        sgGrowth: "رشد سالانه‌ی امتیاز سنگاپور",
        usGrowth: "رشد سالانه‌ی امتیاز آمریکا",
        never: "هرگز: با این نرخ‌ها فاصله فقط بیشتر می‌شود.",
        years: (y, year) => `رسیدن در حدود ${y} سال، نزدیک ${year}.`,
        note: "این یک حساب ساده روی امتیاز شاخص است، نه پیش‌بینی. امتیازها با تغییر روش‌شناسی بین نسخه‌ها هم جابه‌جا می‌شوند.",
      },
      callout: {
        title: "حسابی که روایت «جهان چندقطبی» را زیر سؤال می‌برد",
        body: "سنگاپور سریع‌تر از آمریکا رشد کرد، ۲۴٫۴٪ در برابر ۲۳٫۶٪، و حدود ۱۳ امتیاز اضافه کرد. آمریکا حدود ۶۰. با این اعداد، فاصله‌ی نفر اول با بقیه در ۲۰۲۶ بیشتر شد، با اینکه نفر اول نرخ رشد کمتری داشت. اگر فقط نرخ رشد را گزارش کنی، به نظر می‌رسد همگرایی در جریان است؛ در حالی که نیست.",
      },
    },
    unicorns: {
      kicker: "۴ · یونیکورن‌ها",
      title: "تمرکز یونیکورن‌ها هم همین را می‌گوید",
      lead: "هر مربع یک یونیکورن است، همان‌طور که در صفحه‌ی هر کشور در شاخص ۲۰۲۶ آمده. بین «کشور به کشور» و «آمریکا در برابر نُه کشور بعدی روی هم» جابه‌جا شو.",
      byCountry: "کشور به کشور",
      usVsRest: "آمریکا در برابر نُه کشور بعدی",
      nextNine: "نُه کشور بعدی روی هم",
      names: { US: "آمریکا", CN: "چین", IN: "هند", GB: "بریتانیا", DE: "آلمان", FR: "فرانسه", IL: "اسرائیل", CA: "کانادا", BR: "برزیل", SG: "سنگاپور" },
      verdict: (us, rest) => `آمریکا ${us} یونیکورن دارد؛ نُه کشور بعدی روی هم ${rest}.`,
      callout: {
        title: "هر عدد یونیکورن را نرم بگیر",
        body: "شاخص ۲۰۲۶ یونیکورن‌ها را کشور به کشور می‌آورد اما جمع جهانی منتشر نمی‌کند، و جمع‌هایی که دست‌به‌دست می‌شوند (۱٬۱۱۳ یا ۱٬۲۱۳) از عکس‌های قدیمی‌تر یا متفاوت آمده‌اند. CB Insights و Hurun و Dealroom برای همان هفته جمع‌های متفاوتی منتشر می‌کنند. الگوی تمرکز در همه‌شان پابرجاست. عددهای دقیق نه.",
      },
    },
    moves: {
      kicker: "۵ · جایی که نقشه واقعاً تکان می‌خورد",
      title: "سه تغییر ساختاری، نه چرخه‌ای",
      lead: "تمرکز داستان اصلی است، اما تنها داستان نیست. این سه ارزش دنبال کردن دارند، دقیقاً چون با تغییر نرخ بهره برنمی‌گردند.",
      items: [
        { title: "مرکز ثقل خلیج فارس جابه‌جا شد", stat: "ریاض ۴۲ · دبی ۴۸", data: "ریاض ۳۰ پله بالا رفت، از دبی گذشت و «شهر سال» استارتاپ‌بلینک شد. عربستان ۹۷٪ رشد کرد و حالا اول شورای همکاری خلیج است.", why: "تخصیص سرمایه با هدایت دولت، نه یک چرخه‌ی سرمایه‌گذاری." },
        { title: "تایوان وارد ۲۰ کشور اول شد", stat: "رتبه‌ی ۲۰ · +۴۱٫۱٪", data: "۵ پله صعود، با سریع‌ترین رشد میان ۲۰ کشور اول.", why: "عمق سخت‌افزار و نیمه‌رسانا؛ تنها پایه‌ی دارایی که جای دیگر به‌سرعت قابل تکرار نیست." },
        { title: "فناوری دفاعی جهش کرد", stat: "ارزش سری A +۶۰٪", data: "تعداد معامله‌ها هم در سال گذشته حدود ۱۵٪ بیشتر شد.", why: "تقاضای خرید ژئوپلیتیک با قراردادهای بلندمدت؛ کم‌حساس‌ترین دسته به نرخ بهره در گزارش." },
      ],
    },
    reads: {
      kicker: "۶ · از این چه نتیجه می‌شود",
      title: "پنج برداشت، و اینکه چه چیزی هر کدام را رد می‌کند",
      lead: "این بخش برداشت من است، نه یافته‌ی گزارش‌ها. عددهای بالا مال آن‌هاست؛ تفسیر مال من. درباره‌ی هر کدام موضع بگیر، بعد ببین چه چیزی ردش می‌کند.",
      agree: "موافقم",
      disagree: "مخالفم",
      reasoning: "استدلال از داده",
      falsify: "چه چیزی ردش می‌کند",
      watch: "زیر نظر",
      tally: (a, n) => `با ${a} از ${n} موافق بودی.`,
      items: {
        centre: { read: "مرکز می‌ماند، حاشیه‌ها متنوع می‌شوند", reasoning: "آمریکا حدود ۶۰ امتیاز اضافه کرد و سریع‌ترین رقیبش حدود ۱۳. تمرکز به‌طور مطلق بیشتر می‌شود، حتی وقتی اکوسیستم‌های بیشتری روی نقشه می‌آیند.", falsify: "رشد سری A بیرون از آمریکای شمالی، دو سال پشت سر هم از آمریکا جلو بزند." },
        early: { read: "گلوگاه واقعی، مرحله‌ی اولیه است", reasoning: "سری A با +۲٪ در برابر مرحله‌ی رشد با +۱۷٪ در ۲۰۲۵. محدودیت شکل‌گیری اکوسیستم‌های تازه، سرمایه‌ی دور اول است نه سرمایه‌ی رشد.", falsify: "بازگشت سری A که با فاصله‌ی چند واحد درصد پابه‌پای مرحله‌ی رشد بیاید.", watch: "نشانه‌ی سه‌ماهه‌ی اول ۲۰۲۶ در GSER (سری A، ۲۸٪ بالاتر از میانگین فصلی ۲۰۲۵) اولین شاهد علیه این برداشت است. اگر تا آخر سال بماند، این برداشت غلط است." },
        ai: { read: "«شرکت هوش مصنوعی» دیگر یک دسته نیست", reasoning: "وقتی شرکت‌های AI-محور همین حالا حدود نیمی از سرمایه‌ی مرحله‌ی رشد را می‌گیرند، این برچسب دیگر شرکت‌ها را از هم جدا نمی‌کند.", falsify: "سهم AI-محور دوباره زیر یک‌سوم مرحله‌ی رشد برگردد." },
        hardware: { read: "سهم سخت‌افزار باید بالا برود", reasoning: "سری A فناوری دفاعی +۶۰٪، و صعود تایوان بر عمق سخت‌افزار تکیه دارد. هر دو به یک سمت اشاره می‌کنند.", falsify: "رشد سری A فناوری دفاعی با آرام شدن تقاضای ژئوپلیتیک تک‌رقمی شود." },
        state: { read: "سرمایه‌ی دولتی حالا یک ورودی اکوسیستم است", reasoning: "رشد ۹۷٪ عربستان و صعود ۳۰ پله‌ای ریاض با چرخه‌ی بازار توضیح‌پذیر نیست.", falsify: "رتبه‌ی ریاض با ثابت ماندن هزینه‌ی برنامه‌های فعلی متوقف شود یا برگردد." },
      },
    },
    round: {
      kicker: "برای بنیان‌گذاران",
      title: "دور بعدی‌ات کجاست؟",
      lead: "مرحله و منطقه‌ات را انتخاب کن. جواب، چیزی است که این داده‌ها درباره‌ی بازاری که واردش می‌شوی می‌گویند.",
      stage: "مرحله",
      region: "منطقه",
      stages: { seed: "پیش‌بذری / بذری", seriesA: "سری A", late: "رشد / مرحله‌ی پایانی" },
      regions: { na: "آمریکای شمالی", elsewhere: "جای دیگر" },
      answers: {
        seed: {
          na: "گزارش‌ها مستقیم درباره‌ی بذری چیز زیادی نمی‌گویند، اما قدم بعدش، سری A، تقریباً رشد نکرد (+۲٪). برای مسیر طولانی از بذری تا A برنامه بریز و آن‌قدر جذب کن که به کشش واقعی برسی.",
          elsewhere: "سخت‌ترین گوشه‌ی این داده‌ها: پول نهادیِ دور اول تقریباً رشد نکرد و بیشتر سرمایه‌ی تازه به مرحله‌ی رشد در آمریکای شمالی رفت. برای مسیر طولانی بساز و هر جا برنامه‌ی دولتی هست، جدی بگیر.",
        },
        seriesA: {
          na: "در طول ۲۰۲۵ وارد بازاری می‌شدی که ۲٪ رشد کرد، نه ۱۷٪. سه‌ماهه‌ی اول ۲۰۲۶ بهتر است (۲۸٪ بالاتر از میانگین فصلی ۲۰۲۵)، اما یک فصل روند نیست: برای یک دور سخت‌گیرانه برنامه بریز.",
          elsewhere: "سرمایه‌ی سری A ثابت مانده، و تو بیرون از منطقه‌ای هستی که ۸۶٪ پول AI مرحله‌ی رشد را گرفت. عمق اکوسیستم محلی‌ات از تیتر جهانی مهم‌تر است.",
        },
        late: {
          na: "بازگشت سرمایه همین‌جاست: مرحله‌ی رشد +۱۷٪، و بیشتر پول AI-محور مرحله‌ی رشد به سمت تو می‌آید. بازار طرف توست؛ رقابت بر سرش هم.",
          elsewhere: "سرمایه‌ی مرحله‌ی رشد بیشتر شد، اما ۸۶٪ سهم AI-محورش به آمریکای شمالی رفت. تو سر ۱۴٪ باقی‌مانده رقابت می‌کنی.",
        },
      },
    },
    notes: {
      kicker: "یادداشت داده",
      title: "پیش از نقل هر عدد این‌ها را بخوان",
      items: [
        { t: "دو گزارش، دو روش", b: "استارتاپ‌بلینک ۱٬۵۵۶ شهر و ۱۰۰ کشور را با یک امتیاز ترکیبی از کمیت، کیفیت و محیط کسب‌وکار رتبه می‌دهد. استارتاپ ژنوم حدود ۴۰ اکوسیستم را رتبه می‌دهد و روی جریان سرمایه و ارزش اکوسیستم تمرکز دارد. ارقام به اسم منبع برچسب خورده‌اند و جای هم به کار نمی‌روند." },
        { t: "ارقام محاسبه‌شده علامت دارند", b: "دو عدد این صفحه مال من است، نه گزارش‌ها: سهم AI-محور از سرمایه‌ی مرحله‌ی رشد (۱۰۸ ÷ حدود ۲۱۰ میلیارد) و افزایش مطلق امتیاز (امتیاز ÷ (۱ + رشد)، بعد تفریق). هر دو با ورودی‌هایشان نشان داده شده‌اند." },
        { t: "رشد امتیاز، رشد خروجی نیست", b: "درصدهای رشد استارتاپ‌بلینک تغییر یک امتیاز ترکیبی است که با تغییر روش و پوشش هم جابه‌جا می‌شود. نه سرمایه است، نه درآمد، نه تعداد شرکت تازه." },
        { t: "ارقام سرمایه مال کل ۲۰۲۵ است", b: "GSER 2026 درباره‌ی ۲۰۲۵ است. کرانچ‌بیس سرمایه‌گذاری جهانی سه‌ماهه‌ی اول ۲۰۲۶ را نزدیک ۳۰۰ میلیارد دلار اعلام کرد، اما آن منبع و پایه‌ی دیگری است و این‌جا قاطی نشده." },
        { t: "دو بار چک شد", b: "چک دوم با متن اصلی سه چیز را عوض کرد: سری A +۲۸٪ در سه‌ماهه‌ی اول ۲۰۲۶ واقعاً در GSER هست؛ ۸۶٪ مال سرمایه‌ی AI-محور است و سهم آمریکای شمالی از کل مرحله‌ی رشد ۶۴٪ است؛ و ارقام یونیکورن این‌جا مال خود شاخص ۲۰۲۶ است، نه نقشه‌ی یونیکورن ۲۰۲۳." },
      ],
    },
    medals: {
      title: "نشان‌های راستی‌آزما",
      hint: "در هر بخش تعاملی یک نشان بگیر.",
      names: { factcheck: "راستی‌آزما", stage: "تفکیک مرحله", dollar: "رد پول", catchup: "حساب رسیدن", unicorns: "شمارش گله", bets: "موضع گرفتی" },
      complete: "هر شش نشان را گرفتی. حالا تیترهای استارتاپی را مثل یک تحلیل‌گر می‌خوانی.",
      open: "باز کردن نشان‌ها",
      close: "بستن",
    },
    method: { sourcesTitle: "منابع", sources: SOURCES },
    colophon: {
      shareTitle: "تمرکز، نه پراکندگی: گزارش‌های استارتاپی ۲۰۲۶ واقعاً چه می‌گویند",
      disclaimer: "ارقام استارتاپ‌بلینک و استارتاپ ژنوم متعلق به ناشرانشان است؛ تحلیل و تفسیر از من است. این توصیه‌ی سرمایه‌گذاری نیست.",
      cta: "گفت‌وگو با فرجاد",
    },
  },
}
