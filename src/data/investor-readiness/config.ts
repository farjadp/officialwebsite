export interface Question {
    id: string;
    text: string;
}

export interface Category {
    id: string;
    title: string;
    weight: number;
    questions: Question[];
}

export const investorCategories: Category[] = [
    {
        id: "market-opportunity",
        title: "Market Opportunity",
        weight: 20,
        questions: [
            { id: "mo-1", text: "The problem we solve is clear and important." },
            { id: "mo-2", text: "Our target market is clearly defined." },
            { id: "mo-3", text: "The market opportunity is large enough for a scalable business." },
            { id: "mo-4", text: "We understand the competitive landscape." },
            { id: "mo-5", text: "We can clearly explain why now is the right time for this solution." },
        ],
    },
    {
        id: "product-solution",
        title: "Product & Solution Strength",
        weight: 15,
        questions: [
            { id: "ps-1", text: "Our product clearly solves the identified problem." },
            { id: "ps-2", text: "We have built a working prototype or MVP." },
            { id: "ps-3", text: "Our product has a clear differentiation from competitors." },
            { id: "ps-4", text: "Users or customers understand the value of our solution quickly." },
            { id: "ps-5", text: "The product vision is clear for the next 12–24 months." },
        ],
    },
    {
        id: "traction-validation",
        title: "Traction & Validation",
        weight: 20,
        questions: [
            { id: "tv-1", text: "We have early users, customers, or pilots." },
            { id: "tv-2", text: "We have received strong feedback from real users." },
            { id: "tv-3", text: "Key product metrics are improving." },
            { id: "tv-4", text: "We have proof that users are willing to pay or engage." },
            { id: "tv-5", text: "We can demonstrate early traction or momentum." },
        ],
    },
    {
        id: "team-capability",
        title: "Team Capability",
        weight: 15,
        questions: [
            { id: "tc-1", text: "The founding team has relevant domain knowledge." },
            { id: "tc-2", text: "The team has the skills required to execute." },
            { id: "tc-3", text: "Team roles and responsibilities are clearly defined." },
            { id: "tc-4", text: "The team has worked together effectively." },
            { id: "tc-5", text: "The founders demonstrate strong commitment and resilience." },
        ],
    },
    {
        id: "business-model",
        title: "Business Model & Economics",
        weight: 15,
        questions: [
            { id: "bm-1", text: "The startup has a clear revenue model." },
            { id: "bm-2", text: "Pricing logic is realistic and defensible." },
            { id: "bm-3", text: "Customer acquisition strategy is understood." },
            { id: "bm-4", text: "We understand our key costs and financial structure." },
            { id: "bm-5", text: "The business model can scale efficiently." },
        ],
    },
    {
        id: "fundraising-preparedness",
        title: "Fundraising Preparedness",
        weight: 15,
        questions: [
            { id: "fp-1", text: "We have a clear fundraising goal and amount." },
            { id: "fp-2", text: "We have prepared a strong pitch deck." },
            { id: "fp-3", text: "We can clearly explain our growth strategy." },
            { id: "fp-4", text: "We know what investors expect at our stage." },
            { id: "fp-5", text: "We have identified potential investors." },
        ],
    },
];

export const INVESTOR_TOTAL_QUESTIONS = investorCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
);

// ============================================================================
// Locale plumbing. Mirrors src/data/trl-assessment: the English content above
// stays the default, the Persian content lives in config.fa.ts with identical
// ids, order and weights, and logic.ts picks between them.
// ============================================================================

export type InvestorLocale = "en" | "fa";

/** Every string the scoring in logic.ts hands back, per locale. */
export interface InvestorLogicStrings {
    bands: {
        notReady: { level: string; summary: string };
        earlyPrep: { level: string; summary: string };
        promising: { level: string; summary: string };
        minorGaps: { level: string; summary: string };
        stronglyReady: { level: string; summary: string };
    };
    strengthTitles: Record<string, string>;
    strengthTitleDefault: string;
    strengthDescription: string;
    /** Wraps a category title into the "key investor concern" headline. */
    weaknessTitle: (categoryTitle: string) => string;
    weaknessDescriptions: Record<string, string>;
    weaknessDefault: string;
    recommendations: Record<string, string[]>;
}

export const investorLogicStringsEn: InvestorLogicStrings = {
    bands: {
        notReady: {
            level: "Not Investor Ready",
            summary: "Your startup currently lacks the foundational elements required to successfully pitch investors. Focus on building core business value first.",
        },
        earlyPrep: {
            level: "Early Preparation Stage",
            summary: "You are laying the groundwork, but crucial structural pieces are missing. Address your weakest areas before beginning outreach.",
        },
        promising: {
            level: "Promising but Not Fundraising Ready",
            summary: "Your startup shows promising signals for investors, but several areas still require strengthening before beginning an active fundraising process.",
        },
        minorGaps: {
            level: "Investor Ready with Minor Gaps",
            summary: "You are generally well-prepared for fundraising. Refining a few remaining gaps will significantly increase your chances of closing capital.",
        },
        stronglyReady: {
            level: "Strongly Investor Ready",
            summary: "Your startup is in an excellent position to raise funds. You have strong market, product, and traction signals with clear preparation.",
        },
    },
    strengthTitles: {
        "market-opportunity": "Strong early market understanding",
        "product-solution": "Clear product differentiation and solution strength",
        "traction-validation": "Demonstrable early traction and validation",
        "team-capability": "Solid founding team capability and domain expertise",
        "business-model": "Clear business model and scalable economics",
        "fundraising-preparedness": "Excellent fundraising preparation and strategy",
    },
    strengthTitleDefault: "Strong performance area",
    strengthDescription: "Evaluated as a core asset for fundraising.",
    weaknessTitle: (title) => `${title} represents a key investor concern`,
    weaknessDescriptions: {
        "market-opportunity": "Ambiguity around the target market or competitive landscape makes it hard to justify venture-scale returns.",
        "product-solution": "Lack of a validated, differentiated product raises concerns about long-term user adoption.",
        "traction-validation": "Limited early traction or pilots makes it very difficult for investors to justify your valuation.",
        "team-capability": "Gaps in the founding team’s skills or domain expertise increase perceived execution risk.",
        "business-model": "Unclear revenue models or misaligned pricing logic could raise serious concerns about scalability and profitability.",
        "fundraising-preparedness": "Lack of a cohesive pitch narrative, deck, or clear capital allocation plan signals unreadiness for the process.",
    },
    weaknessDefault: "Requires improvement to pass investor due diligence.",
    recommendations: {
        "market-opportunity": [
            "Clearly define your Total Addressable Market (TAM), SAM, and SOM.",
            "Refine your target customer segment to a highly specific, reachable audience.",
        ],
        "product-solution": [
            "Build a functional MVP or interactive prototype if not already complete.",
            "Strengthen product validation through rigorous usability testing and feedback loops.",
        ],
        "traction-validation": [
            "Focus entirely on acquiring early users, customers, or LOIs before seeking capital.",
            "Define metrics to prove demand (e.g., waitlist signups, pilot engagement, early MRR).",
        ],
        "team-capability": [
            "Clearly map out founding team capabilities and identify critical skill gaps.",
            "Bring on key advisors or strategic hires to cover missing domain expertise.",
        ],
        "business-model": [
            "Clarify your pricing and revenue model based on real customer feedback.",
            "Prepare basic financial projections and unit economics estimates (CAC vs LTV).",
        ],
        "fundraising-preparedness": [
            "Build a stronger, tighter investor pitch narrative and review it with peers.",
            "Research and build a targeted list of 50+ investors who fund your exact stage and industry.",
        ],
    },
};
