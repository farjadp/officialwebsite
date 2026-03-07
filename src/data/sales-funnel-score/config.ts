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
