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
