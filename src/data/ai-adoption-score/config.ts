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

export const aiAdoptionCategories: Category[] = [
    {
        id: "use-case-clarity",
        title: "Business Need & Use Case Clarity",
        weight: 20,
        questions: [
            { id: "uc-1", text: "We know which business problems AI could help us solve." },
            { id: "uc-2", text: "We can identify at least one process where AI could save time, reduce cost, or improve quality." },
            { id: "uc-3", text: "We are focused on practical business outcomes, not just AI trends." },
            { id: "uc-4", text: "We understand how AI could create value for our customers or team." },
            { id: "uc-5", text: "We can prioritize where AI should be tested first." },
        ],
    },
    {
        id: "process-readiness",
        title: "Process & Workflow Readiness",
        weight: 15,
        questions: [
            { id: "pr-1", text: "Our core workflows are already documented or clearly understood." },
            { id: "pr-2", text: "We know which tasks are repetitive, manual, or inefficient." },
            { id: "pr-3", text: "Our team can clearly describe current process bottlenecks." },
            { id: "pr-4", text: "Our workflows are stable enough to improve with automation." },
            { id: "pr-5", text: "We understand where human judgment is still required." },
        ],
    },
    {
        id: "data-readiness",
        title: "Data Readiness",
        weight: 20,
        questions: [
            { id: "dr-1", text: "We have access to the data needed for useful AI applications." },
            { id: "dr-2", text: "Our business data is reasonably organized and usable." },
            { id: "dr-3", text: "Key information is stored in systems, not scattered across messages or files." },
            { id: "dr-4", text: "We trust the quality of our important business data." },
            { id: "dr-5", text: "We can identify what data should and should not be used in AI workflows." },
        ],
    },
    {
        id: "team-readiness",
        title: "Team Capability & Adoption Mindset",
        weight: 15,
        questions: [
            { id: "tr-1", text: "Leadership is open to using AI in practical ways." },
            { id: "tr-2", text: "Team members are willing to learn and adapt to new tools." },
            { id: "tr-3", text: "We have people who can lead or support AI-related changes." },
            { id: "tr-4", text: "The team understands basic AI opportunities and limitations." },
            { id: "tr-5", text: "There is willingness to change existing ways of working." },
        ],
    },
    {
        id: "technology-readiness",
        title: "Technology & Systems Readiness",
        weight: 15,
        questions: [
            { id: "tech-1", text: "Our main systems and tools are digital enough to support AI integration." },
            { id: "tech-2", text: "We already use software that could connect with AI features or automation." },
            { id: "tech-3", text: "Our important workflows are not fully dependent on offline or fragmented systems." },
            { id: "tech-4", text: "We can test new tools without major technical disruption." },
            { id: "tech-5", text: "We understand basic requirements for tool integration, privacy, and access control." },
        ],
    },
    {
        id: "execution-readiness",
        title: "Execution, Governance & Change Readiness",
        weight: 15,
        questions: [
            { id: "ex-1", text: "We can assign clear ownership for AI initiatives." },
            { id: "ex-2", text: "We are able to run a small pilot before full implementation." },
            { id: "ex-3", text: "We can measure whether an AI use case actually creates value." },
            { id: "ex-4", text: "We understand key risks such as privacy, accuracy, and misuse." },
            { id: "ex-5", text: "We are ready to manage change instead of expecting instant transformation." },
        ],
    },
];

export const AI_TOTAL_QUESTIONS = aiAdoptionCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
);
