// ============================================================================
// File Path: src/data/scorecard/config.ts
// Why: The Business Autonomy Score used to carry its questions, its options
//      and its result tiers inside the widget, in English only. Lifted out
//      here so the Persian copy (config.fa.ts) can be held to the same ids,
//      the same order and the same weights, and the two locales cannot drift.
//
//      Scoring is untouched: ten questions, options worth 1 / 5 / 10, and
//      three tiers at 40 / 75 / 100.
// ============================================================================

export type ScorecardLocale = "en" | "fa";

export interface ScorecardOption {
    /** The weight. Identical across locales — only `text` is translated. */
    score: number;
    text: string;
}

export interface ScorecardQuestion {
    id: string;
    q: string;
    options: ScorecardOption[];
}

/** Tier ids also pick the icon, which stays in the component. */
export type ScorecardTierId = "operator" | "scaler" | "optimizer";

export interface ScorecardTier {
    id: ScorecardTierId;
    /** Inclusive upper bound of the tier. Identical across locales. */
    maxScore: number;
    title: string;
    headline: string;
    description: string;
}

export const scorecardQuestions: ScorecardQuestion[] = [
    {
        id: "q1",
        q: "How do you currently handle customer inquiries after hours?",
        options: [
            { text: "We don't. They wait until morning.", score: 1 },
            { text: "We have an auto-responder or FAQ link.", score: 5 },
            { text: "An AI agent handles 80% of them instantly and routes the rest.", score: 10 },
        ],
    },
    {
        id: "q2",
        q: "If a key operational employee called in sick for two weeks, what would happen?",
        options: [
            { text: "Total panic. Critical processes exist only in their head.", score: 1 },
            { text: "Things would slow down, but we'd manage using our basic SOPs.", score: 5 },
            { text: "Not much. Automated systems and documented workflows keep things moving.", score: 10 },
        ],
    },
    {
        id: "q3",
        q: "How does data move between your sales CRM and your fulfillment/accounting software?",
        options: [
            { text: "Someone physically copies and pastes or re-enters the data.", score: 1 },
            { text: "We use basic Zapier/Make automations, but they break occasionally.", score: 5 },
            { text: "A robust, automated pipeline orchestrates the entire data flow seamlessly.", score: 10 },
        ],
    },
    {
        id: "q4",
        q: "How much time does leadership spend on recurring, predictable admin tasks every week?",
        options: [
            { text: "More than 15 hours. We are bogged down in the weeds.", score: 1 },
            { text: "5 to 15 hours. We've delegated some, but still oversee too much.", score: 5 },
            { text: "Less than 5 hours. We focus almost entirely on strategy, growth, and leverage.", score: 10 },
        ],
    },
    {
        id: "q5",
        q: "How do you track the status of current projects or client deliverables?",
        options: [
            { text: "Through chaotic Slack channels, long email threads, and verbal updates.", score: 1 },
            { text: "Using a project management tool, but it requires manual updating by the team.", score: 5 },
            { text: "Through a centralized dashboard that updates automatically based on system triggers.", score: 10 },
        ],
    },
    {
        id: "q6",
        q: "When onboarding a new client, what does the process look like?",
        options: [
            { text: "Custom emails, manual document creation, and a lot of back-and-forth.", score: 1 },
            { text: "A standardized email sequence and some templated forms.", score: 5 },
            { text: "A frictionless, automated portal that handles intake, contracts, and provisioning.", score: 10 },
        ],
    },
    {
        id: "q7",
        q: "How does your business handle lead qualification?",
        options: [
            { text: "We get on calls with almost everyone, regardless of fit.", score: 1 },
            { text: "We have a website form that filters out the obvious bad fits.", score: 5 },
            { text: "An intelligent bot pre-qualifies, answers initial questions, and only routes hot leads to sales.", score: 10 },
        ],
    },
    {
        id: "q8",
        q: "Where does your company's core knowledge and standard operating procedures (SOPs) live?",
        options: [
            { text: "Scattered across Google Docs, personal hard drives, and people's brains.", score: 1 },
            { text: "In a centralized system (like Notion), but it's updated sporadically.", score: 5 },
            { text: "In a living knowledge base that an internal AI assistant can instantly query across.", score: 10 },
        ],
    },
    {
        id: "q9",
        q: "When organizing financial data or invoices for month-end reconciliation, your team typically:",
        options: [
            { text: "Spends days manually cross-checking Excel sheets, PDFs, and emails.", score: 1 },
            { text: "Uses modern software, but still relies on manual categorization and entry.", score: 5 },
            { text: "Has an automated pipeline where invoices are parsed, categorized, and synced instantly.", score: 10 },
        ],
    },
    {
        id: "q10",
        q: "What is your primary stance on integrating AI into your business today?",
        options: [
            { text: "I don't know where to start, and I'm worried about breaking what we have.", score: 1 },
            { text: "My team uses ChatGPT occasionally, but we lack a cohesive infrastructure strategy.", score: 5 },
            { text: "We are actively looking to deploy custom AI agents to replace complex manual workflows.", score: 10 },
        ],
    },
];

export const scorecardTiers: ScorecardTier[] = [
    {
        id: "operator",
        maxScore: 40,
        title: "The Operator",
        headline: "You are the bottleneck in your own business.",
        description: "Right now, your business runs on sheer brute force. You are relying on human memory, scattered spreadsheets, and manual data entry just to keep the lights on. This is why scaling feels impossible—you aren't scaling systems; you are just scaling stress. Before we can even talk about deploying AI, we need to stop the bleeding. It is time to digitize your operations and build actual infrastructure.",
    },
    {
        id: "scaler",
        maxScore: 75,
        title: "The Scaler",
        headline: "You have a foundation, but your systems are disconnected.",
        description: "You aren't starting from zero. You use modern tools, you have some SOPs in place, and you are actively trying to be efficient. But your tools aren't talking to each other. You have fragmented funnels, isolated software, and your team is still acting as the 'glue' between different systems. You don't need another SaaS subscription—you need orchestration. It's time to connect your infrastructure so it runs on its own.",
    },
    {
        id: "optimizer",
        maxScore: 100,
        title: "The Optimizer",
        headline: "Ready for True Autonomy.",
        description: "Your infrastructure is solid. You have removed the obvious manual bottlenecks, your team follows clear SOPs, and your data flows smoothly. You are the exact type of founder who will see massive ROI from AI Automation. It's time to stop using humans for repetitive tasks that a machine can do perfectly 24/7. We need to look at deploying custom AI agents to handle your customer support, complex data parsing, and high-level workflow orchestration.",
    },
];
