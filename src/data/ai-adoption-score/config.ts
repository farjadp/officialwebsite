// ============================================================================
// Data model and English content for the AI Adoption Readiness Score.
//
// Persian content lives in config.fa.ts with the same ids, order, weights and
// shape. Component chrome (buttons, labels, placeholders) lives in ui.ts.
// ============================================================================

export type AiLocale = "en" | "fa";

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

/** A title + body pair used for strengths, gaps and opportunity areas. */
export interface AiInsight {
    title: string;
    description: string;
}

/** Strings consumed by the scoring logic (localized result text). */
export interface AiLogicStrings {
    // Score bands, lowest to highest.
    levelNotReady: string;
    summaryNotReady: string;
    levelEarly: string;
    summaryEarly: string;
    levelPartial: string;
    summaryPartial: string;
    levelStrong: string;
    summaryStrong: string;
    levelHighly: string;
    summaryHighly: string;

    // Foundation warning (realism rule).
    foundationWarningMultiple: string;
    foundationWarningData: string;
    foundationWarningProcess: string;
    foundationWarningExecution: string;

    // Keyed by category id, with a `default` fallback key.
    strengthTitles: Record<string, string>;
    strengthDescriptions: Record<string, string>;
    weaknessTitles: Record<string, string>;
    weaknessDescriptions: Record<string, string>;
    recommendations: Record<string, string[]>;

    // Keyed by opportunity-area id (see logic.ts).
    opportunityAreas: Record<string, AiInsight>;
}

export interface AiContent {
    locale: AiLocale;
    dir: "ltr" | "rtl";
    categories: Category[];
    logic: AiLogicStrings;
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

export const aiLogicStringsEn: AiLogicStrings = {
    levelNotReady: "Not Ready for AI Adoption",
    summaryNotReady: "Your business currently lacks the foundational conditions required for a productive AI implementation. Adopting AI now risks wasting budget and creating confusion — foundational work must come first.",
    levelEarly: "Early Preparation Stage",
    summaryEarly: "There are early positive signals, but critical gaps in data, processes, or team readiness will limit results. Structured preparation is needed before committing to AI implementation.",
    levelPartial: "Partially Ready — Needs Foundations",
    summaryPartial: "Your business shows meaningful readiness in several areas, but gaps in key foundations may reduce AI effectiveness or cause implementation failure if not addressed first.",
    levelStrong: "Strong Readiness for Pilot Implementation",
    summaryStrong: "Your business is well-positioned to launch focused AI pilots. Addressing the remaining gaps will significantly increase the probability of real, measurable value.",
    levelHighly: "Highly Ready for AI Adoption",
    summaryHighly: "Your business has strong structural, operational, and team readiness for AI. You are positioned to implement AI systematically and generate measurable impact across multiple areas.",

    foundationWarningMultiple: "AI should improve a business — not hide messy operations. Your assessment shows critical gaps in process clarity, data quality, or execution readiness. Implementing AI before addressing these foundations will likely produce poor results and wasted investment. Fix the foundations first.",
    foundationWarningData: "Poor or scattered data is one of the most common causes of failed AI projects. Before implementing AI, prioritize organizing and centralizing your key business data.",
    foundationWarningProcess: "Automation cannot fix a broken process — it only makes a bad process faster. Document and stabilize your workflows before layering AI on top of them.",
    foundationWarningExecution: "AI initiatives without clear ownership, measurement, and governance almost always stay experimental. Assign ownership and define success metrics before starting.",

    strengthTitles: {
        "use-case-clarity": "Clear AI use cases and business focus",
        "process-readiness": "Well-understood workflows and process visibility",
        "data-readiness": "Organized and accessible business data",
        "team-readiness": "Receptive leadership and team mindset",
        "technology-readiness": "Solid digital infrastructure and tool stack",
        "execution-readiness": "Structured approach to governance and measurement",
        default: "Strong readiness area",
    },
    strengthDescriptions: {
        "use-case-clarity": "You have specific, practical AI use cases in mind and are evaluating AI as a business tool — not as a trend to chase. This focus dramatically increases the chance of real ROI.",
        "process-readiness": "Your processes are documented and understood well enough to identify automation targets. This is a prerequisite many businesses skip — and then blame AI for failing.",
        "data-readiness": "Clean, organized data is the raw material of useful AI. Your readiness here gives you a significant advantage over businesses trying to implement AI on fragmented or unreliable data.",
        "team-readiness": "Leadership buy-in and team willingness to adapt are among the most underestimated readiness factors. Without them, the best AI implementation fails at the adoption stage.",
        "technology-readiness": "A modern digital stack significantly reduces the friction and cost of AI integration. You are not starting from scratch, which limits implementation complexity.",
        "execution-readiness": "The ability to pilot, measure, and govern AI initiatives is what separates businesses that extract real value from those that run experiments with no outcome.",
        default: "This area shows strong readiness.",
    },
    weaknessTitles: {
        "use-case-clarity": "No clear AI use cases or business value target",
        "process-readiness": "Unclear or undocumented workflows",
        "data-readiness": "Scattered, low-quality, or inaccessible data",
        "team-readiness": "Low adoption mindset or leadership resistance",
        "technology-readiness": "Digital infrastructure not ready for AI integration",
        "execution-readiness": "No clear ownership, measurement, or governance plan",
        default: "Critical readiness gap",
    },
    weaknessDescriptions: {
        "use-case-clarity": "Adopting AI without a clear value case leads to tool purchases that gather dust. The business may be attracted to AI as a concept without a practical reason to implement it today.",
        "process-readiness": "AI cannot fix a broken process — it can only automate it. Messy, undocumented workflows result in AI that automates errors, creates inconsistency, or produces outputs nobody trusts.",
        "data-readiness": "Poor or scattered data is the most common cause of failed AI projects. If the inputs are unreliable, the AI outputs will be too — and users will stop trusting the system within weeks.",
        "team-readiness": "Resistance, confusion, or lack of internal champions will slow or kill adoption regardless of tool quality. AI implementation is a change management challenge, not just a technical one.",
        "technology-readiness": "Heavy reliance on offline, fragmented, or legacy systems creates integration barriers that make AI implementation expensive, slow, and fragile.",
        "execution-readiness": "Without clear ownership, a pilot structure, and success metrics, AI initiatives remain permanent experiments with no measurable business impact and no accountability.",
        default: "This area requires attention before serious AI adoption.",
    },
    recommendations: {
        "use-case-clarity": [
            "List 3 specific business problems that cost you time or money — these are your AI starting points.",
            "Define one measurable outcome for each potential use case before evaluating tools.",
        ],
        "process-readiness": [
            "Document your 3 most critical operational workflows before touching any AI tools.",
            "Identify the top 5 repetitive manual tasks and estimate their weekly time cost.",
        ],
        "data-readiness": [
            "Audit where your key business data lives — CRM, spreadsheets, emails, shared drives — and consolidate it.",
            "Identify one high-priority data set, clean it, and centralize it as a starting point.",
        ],
        "team-readiness": [
            "Assign one internal AI champion per department — someone curious and willing to experiment.",
            "Run a 2-hour team session on practical AI tools and realistic limitations, not hype.",
        ],
        "technology-readiness": [
            "Map your current software stack and identify which tools have existing AI features or API access.",
            "Reduce dependence on email threads and spreadsheets for critical workflows — this is a prerequisite for AI leverage.",
        ],
        "execution-readiness": [
            "Assign one person as the internal owner of the first AI pilot — with clear accountability.",
            "Define 2–3 measurable KPIs for the pilot before launch, and review results after 30 days.",
        ],
    },
    opportunityAreas: {
        automation: {
            title: "Workflow & Task Automation",
            description: "You have visible, repetitive processes that are good candidates for automation — from data entry and reporting to scheduling and follow-up tasks.",
        },
        reporting: {
            title: "Data Summarization & Reporting",
            description: "Your organized data infrastructure supports AI-driven reporting, analytics summarization, and pattern detection — without building complex pipelines from scratch.",
        },
        customer: {
            title: "Customer Support & Communication Workflows",
            description: "You understand customer touchpoints clearly — making AI assistants, response drafting, and FAQ automation viable starting points with measurable impact.",
        },
        copilots: {
            title: "AI Copilots & Tool Integration",
            description: "Your existing digital stack makes it feasible to add AI capabilities — copilot assistants, smart search, or content generation — directly into tools your team already uses.",
        },
        knowledge: {
            title: "Internal Knowledge Search & Onboarding",
            description: "A willing and informed team can adopt AI-powered internal knowledge tools, policy Q&A systems, and onboarding assistants with lower change-management resistance.",
        },
        sales: {
            title: "Sales Follow-Up & Lead Qualification",
            description: "With clear measurement capability, AI-assisted lead scoring, follow-up sequencing, and outreach personalization can be piloted with a defined success metric from day one.",
        },
        documents: {
            title: "Document Processing & Summarization",
            description: "Regardless of current readiness level, AI document summarization and basic text extraction are low-risk starting points that require minimal infrastructure.",
        },
    },
};

export const aiContentEn: AiContent = {
    locale: "en",
    dir: "ltr",
    categories: aiAdoptionCategories,
    logic: aiLogicStringsEn,
};

export const AI_TOTAL_QUESTIONS = aiAdoptionCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
);
