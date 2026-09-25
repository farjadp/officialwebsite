// ============================================================================
// Hardware Source: brand.ts
// Version: 1.1.0 — 2026-09-25
// Why: The one table of facts the content engine may assert about Farjad. The
//      reviewer treats it as the only permissible source of biographical
//      truth, so a figure that is wrong here is published as "verified".
//
//      History, kept because it explains the shape:
//        · v1.0 was rebuilt from what the site publishes (22+ years, 25
//          startups, $3M), and left out two figures the old AI prompts made
//          that no page did ("3,000+ meetings", "$70K raised personally").
//        · v1.1 (this version) replaces the mentoring and fundraising figures
//          with the ones Farjad gave directly on 25 Sep 2026. They are LARGER
//          than what the site still prints — the homepage, /startups and the
//          resume say "25 startups" and "$3M", and the resume says "co-founded
//          4 companies" against his "about 10". Until that copy is updated,
//          an article using these figures will be right and the homepage
//          wrong. The two unconfirmed figures stay out: he did not confirm them.
// Env / Identity: Pure data.
// ============================================================================

export type Fact = {
    /** English wording the engine may use. Conservative figure first. */
    claim: string
    /** The same fact in natural Persian, Persian digits, correct ZWNJ. */
    claimFa: string
    /** Why this is allowed: the page that says it, or Farjad's own statement. */
    source: string
}

const FARJAD_25_SEP = "Farjad, directly, 25 Sep 2026"

export const FACTS = {
    years: {
        claim: "22+ years building companies and technology",
        claimFa: "بیش از ۲۲ سال ساختن شرکت و فناوری",
        source: "site: components/home/v3/copy.ts, the 21 Sep standardisation",
    },
    mentoring: {
        claim: "has mentored more than 50 startup teams over the past seven years — close to 100",
        claimFa: "در هفت سال گذشته بیش از ۵۰ تیم استارتاپی را منتور کرده است؛ نزدیک به ۱۰۰ تیم",
        source: FARJAD_25_SEP,
    },
    funding: {
        claim: "has helped the teams he works with secure nearly $5M in funding",
        claimFa: "به تیم‌هایی که با آن‌ها کار کرده در جذب نزدیک به ۵ میلیون دلار سرمایه کمک کرده است",
        source: FARJAD_25_SEP,
    },
    grants: {
        claim: "has helped those teams secure nearly $5M more in in-kind service grants",
        claimFa: "نزدیک به ۵ میلیون دلار دیگر هم گرنت خدماتی برای همین تیم‌ها گرفته است",
        source: FARJAD_25_SEP,
    },
    accelerators: {
        claim:
            "has worked B2B with about 20 accelerators: preparing startup teams and introducing them to those programmes",
        claimFa: "به‌صورت B2B با حدود ۲۰ شتاب‌دهنده کار کرده است: تیم‌های استارتاپی را آماده کرده و به این شتاب‌دهنده‌ها معرفی کرده است",
        source: FARJAD_25_SEP,
    },
    ownStartups: {
        claim: "has founded about 10 startups of his own: 3 succeeded and were sold, the rest failed, and he learned a great deal from them",
        claimFa: "خودش حدود ۱۰ استارتاپ راه انداخته است: ۳ تا موفق شدند و فروخته شدند، بقیه شکست خوردند و از آن‌ها بسیار آموخت",
        source: FARJAD_25_SEP,
    },
    phd: {
        claim: "PhD in Anthropology",
        claimFa: "دکترای انسان‌شناسی",
        source: "site: /about (about/data.ts)",
    },
    msc: {
        claim: "MSc in Software Engineering",
        claimFa: "کارشناسی ارشد مهندسی نرم‌افزار",
        source: "site: /services",
    },
    iso: {
        claim: "ISO 27001 Lead Auditor",
        claimFa: "سرممیز ISO 27001",
        source: "site: /resume, /about",
    },
    roles: {
        claim: "software engineer, CTO, startup founder, product strategist",
        claimFa: "مهندس نرم‌افزار، مدیر ارشد فنی، بنیان‌گذار استارتاپ، استراتژیست محصول",
        source: "site: /resume",
    },
    story: {
        claim: "immigrant founder: built companies in Iran, now works from Toronto",
        claimFa: "بنیان‌گذار مهاجر: در ایران شرکت ساخت و اکنون از تورنتو کار می‌کند",
        source: "site: home, /about",
    },
} as const satisfies Record<string, Fact>

export type FactKey = keyof typeof FACTS

/**
 * Figures that describe Farjad himself. The reviewer checks that any figure
 * attributed to him in a draft is one of these; a figure about the world
 * ("3 reasons", "a 20% churn rate") is not his and is judged separately.
 */
export const BIOGRAPHICAL_FIGURES = ["22", "50", "100", "7", "5", "20", "10", "3", "27001"] as const

/** The facts as prompt text, one line each, in the article's language. */
export function factsForPrompt(locale: "en" | "fa" = "en"): string {
    return Object.values(FACTS)
        .map((fact) => `- ${locale === "fa" ? fact.claimFa : fact.claim}`)
        .join("\n")
}

/**
 * Who is writing and how. Shared by the brief, the writers and the reviewers
 * so the voice cannot drift between agents.
 */
export const VOICE = `
You write as Farjad, in the first person, from lived experience.

Voice:
- Brutally honest. No sugarcoating failure, no hyping success.
- No "startup theatre": pitching without building, networking without knowledge.
- Systems over hustle, execution over passion.
- Warm but direct — a mentor who respects founders enough to tell them hard truths.
- His own failures are cited as freely as his wins: most of the startups he
  founded failed, and that is where much of what he teaches comes from.

Figures:
- Use the conservative number and do not round up: "more than 50 teams", not
  "100 teams"; "nearly $5M", not "$5M+".
- Funding raised and service grants are separate figures. Never add them into
  one combined total — no total was ever stated.

Never:
- Invent a number, a client, a company name, a result or a quote.
- Name the three startups that were sold, or say who bought them — that has not
  been given.
- Use hype ("unlock your potential", "skyrocket", "game-changer").
- Use corporate filler ("synergy", "paradigm shift", "in today's fast-paced world").
- Focus on immigration or visas unless the brief makes that the topic.

Offers he may reference naturally, never as a pitch:
- 0-to-1 business launch: product and go-to-market strategy, technical architecture
- Team mentorship: a strategic sparring partner
- AI and custom systems: workflow automation, LLM integration, custom software
`.trim()
