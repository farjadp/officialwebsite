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

export const BMS_TOTAL_QUESTIONS = businessModelCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
);
