// ============================================================================
// Data model and English content for the Sales Funnel Health Score.
//
// Shape mirrors src/data/trl-assessment/config.ts: the types and the English
// content live here, the Persian content lives in config.fa.ts with the SAME
// ids, order and weights, and the scoring logic reads whichever content the
// locale asks for. The maths never looks at the strings.
// ============================================================================

export type SalesFunnelLocale = "en" | "fa";

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

/** Result copy for one category: what it reads as when strong, and when weak. */
export interface CategoryCopy {
    strengthTitle: string;
    strengthDescription: string;
    bottleneckTitle: string;
    bottleneckStage: string;
    bottleneckDescription: string;
    recommendations: string[];
}

export interface SalesFunnelBand {
    healthLevel: string;
    summarySentence: string;
}

/** Every string the scoring logic can return, per locale. */
export interface SalesFunnelLogicStrings {
    /** Ordered lowest to highest: <=39, <=59, <=74, <=89, else. */
    bands: [SalesFunnelBand, SalesFunnelBand, SalesFunnelBand, SalesFunnelBand, SalesFunnelBand];
    categoryCopy: Record<string, CategoryCopy>;
    fallback: Omit<CategoryCopy, "recommendations">;
}

export interface SalesFunnelContent {
    locale: SalesFunnelLocale;
    dir: "ltr" | "rtl";
    categories: Category[];
    logic: SalesFunnelLogicStrings;
}

export const salesFunnelCategories: Category[] = [
    {
        id: "lead-generation",
        title: "Lead Generation Quality",
        weight: 20,
        questions: [
            { id: "lg-1", text: "We consistently generate leads for our business." },
            { id: "lg-2", text: "Most leads match our target customer profile." },
            { id: "lg-3", text: "Our lead sources are predictable and repeatable." },
            { id: "lg-4", text: "We clearly understand where our best leads come from." },
            { id: "lg-5", text: "Our marketing attracts people who actually need our product or service." },
        ],
    },
    {
        id: "lead-qualification",
        title: "Lead Qualification Process",
        weight: 15,
        questions: [
            { id: "lq-1", text: "We have clear criteria to qualify leads before investing time." },
            { id: "lq-2", text: "Our team can quickly identify good vs. poor-fit prospects." },
            { id: "lq-3", text: "We avoid spending significant time on unqualified prospects." },
            { id: "lq-4", text: "Our lead qualification process is consistent across the team." },
            { id: "lq-5", text: "Sales conversations start with the right prospects." },
        ],
    },
    {
        id: "messaging-offer",
        title: "Sales Messaging & Offer Strength",
        weight: 15,
        questions: [
            { id: "mo-1", text: "We can clearly explain our value proposition in one sentence." },
            { id: "mo-2", text: "Prospects quickly understand why they should choose us over alternatives." },
            { id: "mo-3", text: "Our offer directly addresses an important customer problem." },
            { id: "mo-4", text: "Our pricing and perceived value are well aligned." },
            { id: "mo-5", text: "Our messaging resonates with the specific audience we are targeting." },
        ],
    },
    {
        id: "sales-process",
        title: "Sales Process Structure",
        weight: 15,
        questions: [
            { id: "sp-1", text: "We have a clear step-by-step sales process." },
            { id: "sp-2", text: "Sales conversations follow a structured and repeatable flow." },
            { id: "sp-3", text: "Follow-ups are systematic and consistently executed." },
            { id: "sp-4", text: "Sales responsibilities are clearly defined across the team." },
            { id: "sp-5", text: "We always know what the next step with a prospect should be." },
        ],
    },
    {
        id: "conversion-closing",
        title: "Conversion & Closing Effectiveness",
        weight: 20,
        questions: [
            { id: "cc-1", text: "We successfully convert a reasonable percentage of qualified leads." },
            { id: "cc-2", text: "Our sales conversations consistently move prospects toward a decision." },
            { id: "cc-3", text: "We handle objections effectively without losing deals." },
            { id: "cc-4", text: "Prospects trust our expertise and credibility during the process." },
            { id: "cc-5", text: "Our team feels confident and prepared when closing deals." },
        ],
    },
    {
        id: "tracking-optimization",
        title: "Sales Tracking & Optimization",
        weight: 15,
        questions: [
            { id: "to-1", text: "We actively track key sales metrics and conversion rates." },
            { id: "to-2", text: "We know exactly where prospects drop off in the funnel." },
            { id: "to-3", text: "Our CRM or sales tools help us manage and follow up on leads." },
            { id: "to-4", text: "We regularly analyze sales performance and review the numbers." },
            { id: "to-5", text: "We actively improve the funnel process based on data and results." },
        ],
    },
];

export const SF_TOTAL_QUESTIONS = salesFunnelCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
);

// ── English result copy ───────────────────────────────────────────────────────

export const salesFunnelLogicEn: SalesFunnelLogicStrings = {
    bands: [
        {
            healthLevel: "Broken Funnel",
            summarySentence: "Your sales funnel has critical structural problems. Leads are likely being lost at multiple stages and sales performance is significantly below potential.",
        },
        {
            healthLevel: "Weak Funnel Structure",
            summarySentence: "Your funnel is running but with significant gaps. Revenue is being left on the table due to poor qualification, inconsistent process, or weak conversion systems.",
        },
        {
            healthLevel: "Functional but Leaking Opportunities",
            summarySentence: "Your funnel is generating opportunities, but structural gaps are reducing conversions at one or more stages. Fixing the leaks could meaningfully increase revenue without more leads.",
        },
        {
            healthLevel: "Healthy Funnel with Improvement Potential",
            summarySentence: "Your sales funnel is well-structured and performing. Targeted improvements to weaker areas could unlock additional conversion and revenue growth.",
        },
        {
            healthLevel: "High-Performance Sales Funnel",
            summarySentence: "Your funnel is operating at a high level across all stages. Focus on scale, optimization, and protecting what's already working.",
        },
    ],
    categoryCopy: {
        "lead-generation": {
            strengthTitle: "Consistent and well-targeted lead generation",
            strengthDescription: "You have reliable, repeatable sources of qualified leads — the foundation of any scalable sales system.",
            bottleneckTitle: "Insufficient or poorly targeted lead generation",
            bottleneckStage: "Top of Funnel",
            bottleneckDescription: "The problem starts at the top. If lead flow is inconsistent or poorly targeted, every downstream stage suffers regardless of how good the process is.",
            recommendations: [
                "Identify your top 2 highest-converting lead sources and double investment there before exploring new channels.",
                "Define your Ideal Customer Profile (ICP) precisely — job title, company size, pain trigger — and audit whether current marketing targets it.",
            ],
        },
        "lead-qualification": {
            strengthTitle: "Effective qualification — right prospects in pipeline",
            strengthDescription: "Your team focuses sales time on the right prospects, which directly protects revenue and reduces wasted effort.",
            bottleneckTitle: "Unqualified prospects entering the pipeline",
            bottleneckStage: "Entry Stage",
            bottleneckDescription: "Unqualified prospects waste sales time, distort conversion metrics, and demoralize teams. Most businesses don't have a lead problem — they have a qualification problem.",
            recommendations: [
                "Build a simple qualification scorecard: define 4–5 criteria that separate a good lead from a time-waster.",
                "Introduce a brief discovery question sequence at the start of every sales conversation to qualify before investing time.",
            ],
        },
        "messaging-offer": {
            strengthTitle: "Clear value proposition and strong offer",
            strengthDescription: "Prospects understand your value quickly and clearly — reducing friction at every stage of the funnel.",
            bottleneckTitle: "Weak messaging — prospects don't see the value",
            bottleneckStage: "Middle of Funnel",
            bottleneckDescription: "If prospects can't quickly understand why your offer matters to them, they disengage before trust is built. Weak messaging is often invisible to insiders but immediately felt by prospects.",
            recommendations: [
                "Rewrite your core value proposition by completing this sentence: 'We help [specific person] achieve [specific outcome] without [common frustration].'",
                "Test your messaging with 5 real prospects — if they can't repeat your value back to you, it's not clear enough.",
            ],
        },
        "sales-process": {
            strengthTitle: "Structured and repeatable sales process",
            strengthDescription: "A structured process means results are consistent and not dependent on individual heroics or luck.",
            bottleneckTitle: "Inconsistent, unstructured sales process",
            bottleneckStage: "Process Layer",
            bottleneckDescription: "Inconsistent follow-up and undefined next steps are where most deals silently die. Without a process, sales depends on individual effort and memory — neither of which scales.",
            recommendations: [
                "Document your sales process as a simple 5–7 step flowchart. Every step must have a clear 'next action' that can be handed off.",
                "Build a follow-up sequence template: 3 touchpoints over 10 days for every prospect who doesn't respond after the first contact.",
            ],
        },
        "conversion-closing": {
            strengthTitle: "Strong conversion and closing capability",
            strengthDescription: "Your ability to convert qualified conversations into closed deals is the most direct driver of revenue growth.",
            bottleneckTitle: "Deals stalling — low closing effectiveness",
            bottleneckStage: "Bottom of Funnel",
            bottleneckDescription: "A prospect who reaches the closing stage represents significant invested effort. Losing them here is the most expensive failure point in the funnel — and often the most fixable.",
            recommendations: [
                "List the top 5 objections you hear most often and write a clear, confident response to each before your next sales conversation.",
                "Add a clear close question to every sales call — never end a conversation without an explicit next step or decision.",
            ],
        },
        "tracking-optimization": {
            strengthTitle: "Data-driven funnel management and optimization",
            strengthDescription: "You know where leads are and where they drop off — which means you can improve the funnel systematically instead of guessing.",
            bottleneckTitle: "Blind funnel — no visibility into performance",
            bottleneckStage: "Optimization Layer",
            bottleneckDescription: "You cannot improve what you cannot see. Without tracking drop-off points and conversion rates, every improvement is a guess — and problems get fixed after they've already cost significant revenue.",
            recommendations: [
                "Start tracking 3 core metrics weekly: number of new leads, number of active conversations, and number of closed deals.",
                "Review your pipeline at the start of every week and identify any prospect that has been stalled for more than 7 days.",
            ],
        },
    },
    fallback: {
        strengthTitle: "Strong funnel area",
        strengthDescription: "This stage of your funnel is performing well.",
        bottleneckTitle: "Funnel gap identified",
        bottleneckStage: "Unknown Stage",
        bottleneckDescription: "This area needs attention.",
    },
};

export const salesFunnelContentEn: SalesFunnelContent = {
    locale: "en",
    dir: "ltr",
    categories: salesFunnelCategories,
    logic: salesFunnelLogicEn,
};
