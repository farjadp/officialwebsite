// Data model and configuration for the Startup Readiness Score Assessment

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

export const readinessCategories: Category[] = [
    {
        id: "problem-market",
        title: "Problem & Market Clarity",
        weight: 20,
        questions: [
            { id: "pm-1", text: "We clearly understand the problem we are solving." },
            { id: "pm-2", text: "The problem is painful and important for a specific customer group." },
            { id: "pm-3", text: "We can clearly define our target customer." },
            { id: "pm-4", text: "We have spoken with potential users or customers." },
            { id: "pm-5", text: "We have evidence that this problem already exists in the market." },
        ],
    },
    {
        id: "solution-product",
        title: "Solution & Product Readiness",
        weight: 20,
        questions: [
            { id: "sp-1", text: "Our solution clearly addresses the target problem." },
            { id: "sp-2", text: "Our product or MVP is already built, partially built, or clearly designed." },
            { id: "sp-3", text: "We can explain our solution simply in under 30 seconds." },
            { id: "sp-4", text: "Our product has at least one meaningful advantage over alternatives." },
            { id: "sp-5", text: "We have received feedback on the product or concept from real users." },
        ],
    },
    {
        id: "founder-team",
        title: "Founder & Team Capability",
        weight: 15,
        questions: [
            { id: "ft-1", text: "The founder or team understands this market well." },
            { id: "ft-2", text: "The team has the skills needed to move forward." },
            { id: "ft-3", text: "Roles and responsibilities are clear." },
            { id: "ft-4", text: "The team can make decisions and execute without major confusion." },
            { id: "ft-5", text: "The founder or team shows resilience and consistency." },
        ],
    },
    {
        id: "business-model",
        title: "Business Model & Revenue Logic",
        weight: 15,
        questions: [
            { id: "bm-1", text: "We know how this startup will make money." },
            { id: "bm-2", text: "Our pricing or revenue model is realistic." },
            { id: "bm-3", text: "We understand the economics of customer acquisition and value." },
            { id: "bm-4", text: "We have identified the key costs of running the business." },
            { id: "bm-5", text: "The business model appears scalable or repeatable." },
        ],
    },
    {
        id: "go-to-market",
        title: "Go-To-Market Readiness",
        weight: 15,
        questions: [
            { id: "gtm-1", text: "We know how we will reach our first customers." },
            { id: "gtm-2", text: "We have identified the best channels for customer acquisition." },
            { id: "gtm-3", text: "We understand what message or offer will attract users." },
            { id: "gtm-4", text: "We have a realistic plan for testing demand." },
            { id: "gtm-5", text: "We are ready to start outreach, sales, or user acquisition." },
        ],
    },
    {
        id: "execution-momentum",
        title: "Execution Capacity & Momentum",
        weight: 15,
        questions: [
            { id: "em-1", text: "We are actively working on this startup consistently." },
            { id: "em-2", text: "We have clear short-term priorities." },
            { id: "em-3", text: "We can execute the next 30 to 90 days of work." },
            { id: "em-4", text: "We have enough time, energy, or resources to move forward." },
            { id: "em-5", text: "We are making progress, not just planning." },
        ],
    },
];

export const TOTAL_QUESTIONS = readinessCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
);

// ============================================================================
// Locale plumbing. Mirrors src/data/trl-assessment: the English content above
// stays the default export, the Persian content lives in config.fa.ts with
// identical ids, order and weights, and logic.ts picks between them.
// ============================================================================

export type ReadinessLocale = "en" | "fa";

/** Every string the scoring in logic.ts hands back, per locale. */
export interface ReadinessLogicStrings {
    bands: {
        veryEarly: { level: string; summary: string };
        needsWork: { level: string; summary: string };
        promising: { level: string; summary: string };
        strongEarly: { level: string; summary: string };
        launchReady: { level: string; summary: string };
    };
    /** Appended to a category title when nothing scored below the 80% gate. */
    relativeWeaknessSuffix: string;
    strengthDescriptions: Record<string, string>;
    strengthDefault: string;
    weaknessDescriptions: Record<string, string>;
    weaknessDefault: string;
    recommendations: Record<string, string[]>;
}

export const readinessLogicStringsEn: ReadinessLogicStrings = {
    bands: {
        veryEarly: {
            level: "Very Early Stage",
            summary: "Your startup idea is in its infancy. Focus on foundational validation before writing code or spending money.",
        },
        needsWork: {
            level: "Needs Serious Work",
            summary: "You have pieces of the puzzle, but crucial gaps remain. Address weaknesses in your core model before attempting to scale.",
        },
        promising: {
            level: "Promising but Not Ready",
            summary: "Your startup shows good potential, but needs more validation or execution clarity to be truly launch-ready.",
        },
        strongEarly: {
            level: "Strong Early Readiness",
            summary: "Your startup shows strong early readiness, but important gaps still exist before scale or fundraising.",
        },
        launchReady: {
            level: "Launch Ready",
            summary: "Your startup is in an excellent position to launch, acquire customers, or raise capital. Keep up the momentum.",
        },
    },
    relativeWeaknessSuffix: " (Relative Weakness)",
    strengthDescriptions: {
        "problem-market": "Strong understanding of the market problem and clear target customer definition.",
        "solution-product": "Product concept is well-defined and has meaningful advantages.",
        "founder-team": "The team shows strong commitment, complimentary skills, and alignment.",
        "business-model": "Clear and realistic path to revenue and sustainable unit economics.",
        "go-to-market": "Solid plan for reaching customers and testing demand.",
        "execution-momentum": "Excellent execution momentum, clear priorities, and consistent progress.",
    },
    strengthDefault: "Strong performance in this area.",
    weaknessDescriptions: {
        "problem-market": "The startup may be building on assumptions rather than validated demand.",
        "solution-product": "The idea may still be too abstract or underdeveloped compared to market needs.",
        "founder-team": "Execution risk is high due to unclear ownership, missing skills, or alignment issues.",
        "business-model": "Long-term sustainability is uncertain due to unclear revenue logic or high costs.",
        "go-to-market": "The team may struggle to get traction and acquire customers, even with a good product.",
        "execution-momentum": "The startup risks staying stuck in planning mode without tangible progress.",
    },
    weaknessDefault: "Requires improvement to ensure startup success.",
    recommendations: {
        "problem-market": [
            "Conduct 10-15 deep-dive interviews with your target users in the next 2 weeks.",
            "Clearly define the specific pain point you are solving before writing more code.",
        ],
        "solution-product": [
            "Create a simple MVP or functional prototype and test it with real users.",
            "Refine your value proposition to be easily explainable in under 30 seconds.",
        ],
        "founder-team": [
            "Map out team capabilities and explicitly define roles and responsibilities.",
            "Address any missing core skills through advisors, hires, or learning.",
        ],
        "business-model": [
            "Clarify your pricing model and validate it with potential customers.",
            "Review your unit economics (Customer Acquisition Cost vs Lifetime Value).",
        ],
        "go-to-market": [
            "Define a simple, low-cost customer acquisition experiment for a specific channel.",
            "Develop a clear message or offer that will attract your first batch of users.",
        ],
        "execution-momentum": [
            "Build a concrete 30-day action plan with specific, measurable deliverables.",
            "Set up a weekly accountability structure to track progress against your top priorities.",
        ],
    },
};
