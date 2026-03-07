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
