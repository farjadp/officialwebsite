// ============================================================================
// Hardware Source: brand.ts
// Version: 1.0.0 — 2026-09-25
// Why: The one table of facts the content engine may assert about Farjad. The
//      reviewer treats it as the only permissible source of biographical
//      truth, so a figure that is wrong here is published as "verified".
//
//      It is built from what the live site already publishes, not from the
//      older prompts. Checked on 25 Sep 2026:
//        · The site standardised on 22+ years on 21 Sep (components/home/v3/
//          copy.ts). The three older AI prompts — generate-post,
//          content-waterfall and social-publisher — still say "17+", so they
//          have been generating a figure the site itself contradicts.
//        · "3,000+ online meetings" and "$70K raised personally" appear in the
//          old VERIFIED_BIO but nowhere on the public site. They are left OUT
//          until Farjad confirms them: a fact table must not be the first
//          place a claim is made. (The only "3,000" the site prints is the DPF
//          "3,000 developers trained", itself an open unsourced-claim item.)
// Env / Identity: Pure data.
// ============================================================================

/** Each fact carries the wording the engine may use and where the site says it. */
export type Fact = {
    claim: string
    /** Where the public site already states this — the reason it is allowed. */
    publishedAt: string
}

export const FACTS = {
    years: {
        claim: "22+ years building companies and technology",
        publishedAt: "home (components/home/v3/copy.ts), since the 21 Sep standardisation",
    },
    startups: {
        claim: "25 startups mentored",
        publishedAt: "home, /startups",
    },
    raised: {
        claim: "$3M raised",
        publishedAt: "21 Sep standardisation (components/home/v3/copy.ts)",
    },
    phd: {
        claim: "PhD in Anthropology",
        publishedAt: "/about (about/data.ts)",
    },
    msc: {
        claim: "MSc in Software Engineering",
        publishedAt: "/services",
    },
    iso: {
        claim: "ISO 27001 Lead Auditor",
        publishedAt: "/resume, /about",
    },
    roles: {
        claim: "software engineer, CTO, startup founder, product strategist",
        publishedAt: "/resume",
    },
    story: {
        claim: "immigrant founder: built companies in Iran, now works from Toronto",
        publishedAt: "home, /about",
    },
} as const satisfies Record<string, Fact>

export type FactKey = keyof typeof FACTS

/**
 * Numbers the engine may print about Farjad. Anything numeric in a draft that
 * is neither here nor attributed to a cited source is a fabrication.
 */
export const PERMITTED_FIGURES = ["22+", "25", "$3M", "27001"] as const

/** The facts as prompt text, one line each. */
export function factsForPrompt(): string {
    return Object.values(FACTS)
        .map((fact) => `- ${fact.claim}`)
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
- His own failures are cited as freely as his wins.

Never:
- Invent a number, a client, a result or a quote.
- Use hype ("unlock your potential", "skyrocket", "game-changer").
- Use corporate filler ("synergy", "paradigm shift", "in today's fast-paced world").
- Focus on immigration or visas unless the brief makes that the topic.

Offers he may reference naturally, never as a pitch:
- 0-to-1 business launch: product and go-to-market strategy, technical architecture
- Team mentorship: a strategic sparring partner
- AI and custom systems: workflow automation, LLM integration, custom software
`.trim()
