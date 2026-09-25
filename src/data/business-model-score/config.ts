// ============================================================================
// Data model and English content for the Business Model Strength Score.
//
// Persian content lives in config.fa.ts with the same ids, order, weights and
// shape. Component chrome (buttons, labels, placeholders) lives in ui.ts.
// ============================================================================

export type BmsLocale = "en" | "fa";

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

/** Strings consumed by the scoring logic (localized result text). */
export interface BmsLogicStrings {
    // Score bands, lowest to highest.
    levelWeak: string;
    summaryWeak: string;
    levelRedesign: string;
    summaryRedesign: string;
    levelPromising: string;
    summaryPromising: string;
    levelStrong: string;
    summaryStrong: string;
    levelScalable: string;
    summaryScalable: string;

    // Keyed by category id, with a `default` fallback key.
    strengthTitles: Record<string, string>;
    strengthDescriptions: Record<string, string>;
    weaknessTitles: Record<string, string>;
    weaknessDescriptions: Record<string, string>;
    recommendations: Record<string, string[]>;
}

export interface BmsContent {
    locale: BmsLocale;
    dir: "ltr" | "rtl";
    categories: Category[];
    logic: BmsLogicStrings;
}

export const businessModelCategories: Category[] = [
    {
        id: "value-proposition",
        title: "Value Proposition Strength",
        weight: 20,
        questions: [
            { id: "vp-1", text: "Our business solves a clear and meaningful problem." },
            { id: "vp-2", text: "Customers can quickly understand the value we offer." },
            { id: "vp-3", text: "Our solution is meaningfully better than current alternatives." },
            { id: "vp-4", text: "We can explain our value proposition simply and clearly." },
            { id: "vp-5", text: "Our offer addresses a real customer pain, not just a nice-to-have." },
        ],
    },
    {
        id: "customer-market-fit",
        title: "Customer & Market Fit",
        weight: 15,
        questions: [
            { id: "cm-1", text: "We clearly know who our ideal customer is." },
            { id: "cm-2", text: "We understand the needs and behavior of our target market." },
            { id: "cm-3", text: "There is proven or visible demand for this solution." },
            { id: "cm-4", text: "Our target market is large enough or valuable enough to support growth." },
            { id: "cm-5", text: "We have validated the problem or demand through real market feedback." },
        ],
    },
    {
        id: "revenue-model",
        title: "Revenue Model Logic",
        weight: 20,
        questions: [
            { id: "rm-1", text: "We have a clear and realistic way to generate revenue." },
            { id: "rm-2", text: "Our pricing logic makes sense for our market." },
            { id: "rm-3", text: "Customers are likely to pay for this solution." },
            { id: "rm-4", text: "Revenue can grow in a repeatable way." },
            { id: "rm-5", text: "The business model has healthy long-term earning potential." },
        ],
    },
    {
        id: "cost-structure",
        title: "Cost Structure & Sustainability",
        weight: 15,
        questions: [
            { id: "cs-1", text: "We understand the major costs of running the business." },
            { id: "cs-2", text: "Our current or expected margins are reasonable." },
            { id: "cs-3", text: "The business can operate without unsustainable spending." },
            { id: "cs-4", text: "Key operational activities are manageable and efficient." },
            { id: "cs-5", text: "The business model is not overly dependent on fragile assumptions." },
        ],
    },
    {
        id: "scalability",
        title: "Scalability & Growth Potential",
        weight: 15,
        questions: [
            { id: "sc-1", text: "The business can grow without costs rising at the same rate." },
            { id: "sc-2", text: "We can serve more customers without major operational breakdown." },
            { id: "sc-3", text: "The model can be expanded to new markets or segments." },
            { id: "sc-4", text: "Growth opportunities are realistic and identifiable." },
            { id: "sc-5", text: "The business has the potential to become significantly larger over time." },
        ],
    },
    {
        id: "competitive-defensibility",
        title: "Competitive Defensibility",
        weight: 15,
        questions: [
            { id: "cd-1", text: "We understand the main competitors and substitutes." },
            { id: "cd-2", text: "We have a meaningful differentiator." },
            { id: "cd-3", text: "It would be difficult for others to copy our model quickly." },
            { id: "cd-4", text: "Our positioning in the market is clear." },
            { id: "cd-5", text: "The business has some defensible advantage or strategic leverage." },
        ],
    },
];

export const bmsLogicStringsEn: BmsLogicStrings = {
    levelWeak: "Weak and Unstable",
    summaryWeak: "Your business model lacks the fundamental logic needed to sustain a viable business. Significant structural redesign is required before moving forward.",
    levelRedesign: "Needs Major Redesign",
    summaryRedesign: "There are meaningful signals in your model, but critical structural weaknesses will limit growth or profitability without significant rethinking.",
    levelPromising: "Promising but Structurally Incomplete",
    summaryPromising: "Your business model shows promising fundamentals, but a few structural gaps may limit long-term growth or profitability if left unaddressed.",
    levelStrong: "Strong Model with Some Gaps",
    summaryStrong: "This is a well-structured business model. Targeted improvements to the weaker areas will meaningfully increase resilience and scalability.",
    levelScalable: "Highly Strong and Scalable",
    summaryScalable: "Your business model demonstrates strong fundamentals across all critical dimensions. You are well-positioned to build, scale, and defend your position.",

    strengthTitles: {
        "value-proposition": "Clear and compelling value proposition",
        "customer-market-fit": "Strong customer and market understanding",
        "revenue-model": "Logical and repeatable revenue structure",
        "cost-structure": "Controlled cost base and healthy margins",
        scalability: "Scalable model with identifiable growth paths",
        "competitive-defensibility": "Defensible position and clear differentiation",
        default: "Strong performance area",
    },
    strengthDescriptions: {
        "value-proposition": "Your offer addresses a real pain point and communicates value clearly — a critical foundation for sustainable growth.",
        "customer-market-fit": "You understand your customers well and have validated demand, reducing the risk of building for a market that doesn't exist.",
        "revenue-model": "Your model has clear monetization logic with realistic pricing — essential for generating consistent, scalable revenue.",
        "cost-structure": "You have a realistic handle on your cost base, making the model more resilient against margin pressure.",
        scalability: "The model is structured to grow without proportional cost increases — a key indicator of long-term business health.",
        "competitive-defensibility": "You have a defined differentiator and strategic advantage that gives the business room to compete and defend its position.",
        default: "This area is performing well.",
    },
    weaknessTitles: {
        "value-proposition": "Value proposition is unclear or undifferentiated",
        "customer-market-fit": "Customer fit and market demand are unvalidated",
        "revenue-model": "Revenue model lacks clarity or repeatability",
        "cost-structure": "Cost structure may threaten long-term sustainability",
        scalability: "Limited scalability may cap growth potential",
        "competitive-defensibility": "Weak defensibility exposes the business to competition",
        default: "Area requires improvement",
    },
    weaknessDescriptions: {
        "value-proposition": "The business may not be solving a strong enough problem, or it's communicating value poorly. Without a sharp value proposition, customer acquisition becomes expensive and conversion suffers.",
        "customer-market-fit": "The model may be based on assumptions rather than tested market demand. Building on unvalidated assumptions is one of the most common causes of early business failure.",
        "revenue-model": "The business may struggle to monetize consistently. Without a clear, repeatable path to revenue, the model cannot support sustainable growth or attract capital.",
        "cost-structure": "The model may be vulnerable to margin pressure or inefficient operations. Uncontrolled costs erode value, reduce runway, and limit investment capacity.",
        scalability: "The business may work only at a small scale and face difficulty expanding without proportional cost increases. This limits both growth potential and investor attractiveness.",
        "competitive-defensibility": "The business may be too easy to copy or too weakly positioned in the market. Without a defensible advantage, competitors can undercut quickly and erode market share.",
        default: "This area requires attention before scaling.",
    },
    recommendations: {
        "value-proposition": [
            "Clarify your core customer pain and rewrite your value proposition around it.",
            "Test your messaging with 10 real potential customers — measure how quickly they understand the offer.",
        ],
        "customer-market-fit": [
            "Conduct at least 20 structured customer interviews to validate the problem and willingness to pay.",
            "Narrow your target segment to a specific, reachable group before expanding market scope.",
        ],
        "revenue-model": [
            "Define and document your primary and secondary revenue streams clearly.",
            "Test pricing assumptions with real buyers — use pilots, early access offers, or landing page experiments.",
        ],
        "cost-structure": [
            "Map your fixed and variable cost structure in detail and identify the top 3 cost drivers.",
            "Build a break-even model to understand the minimum revenue needed to sustain operations.",
        ],
        scalability: [
            "Identify which parts of your delivery can be standardized, automated, or templated.",
            "Reduce service-heavy bottlenecks and map channels that can serve more customers without proportional headcount growth.",
        ],
        "competitive-defensibility": [
            "Define your moat clearly: is it data, network effects, switching costs, brand, or distribution?",
            "Reposition against competitors by emphasizing what you do better or differently — make it specific, not vague.",
        ],
    },
};

export const bmsContentEn: BmsContent = {
    locale: "en",
    dir: "ltr",
    categories: businessModelCategories,
    logic: bmsLogicStringsEn,
};

export const BMS_TOTAL_QUESTIONS = businessModelCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
);
