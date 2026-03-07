import { aiAdoptionCategories } from "./config";

export type AssessmentAnswers = Record<string, number>;

export interface CategoryResult {
    categoryId: string;
    title: string;
    score: number;
    maxScore: number;
    percentage: number;
}

export interface AIOpportunityArea {
    title: string;
    description: string;
}

export interface FinalResult {
    totalScore: number;
    readinessLevel: string;
    summarySentence: string;
    categoryResults: CategoryResult[];
    strengths: { title: string; description: string }[];
    weaknesses: { title: string; description: string }[];
    recommendations: string[];
    aiOpportunityAreas: AIOpportunityArea[];
    foundationWarning: string | null; // Set if process/data/execution are critically weak
}

export function calculateAIAdoptionScore(answers: AssessmentAnswers): FinalResult {
    let totalScore = 0;
    const categoryResults: CategoryResult[] = [];

    for (const category of aiAdoptionCategories) {
        let categorySum = 0;
        for (const q of category.questions) {
            categorySum += answers[q.id] || 0;
        }
        const average = category.questions.length > 0 ? categorySum / category.questions.length : 0;
        const categoryScore = Math.round((average / 5) * category.weight);
        totalScore += categoryScore;

        categoryResults.push({
            categoryId: category.id,
            title: category.title,
            score: categoryScore,
            maxScore: category.weight,
            percentage: Math.round((average / 5) * 100),
        });
    }

    totalScore = Math.min(Math.round(totalScore), 100);

    // ── Score → Readiness Level ───────────────────────────────────────────────
    let readinessLevel = "";
    let summarySentence = "";

    if (totalScore <= 39) {
        readinessLevel = "Not Ready for AI Adoption";
        summarySentence = "Your business currently lacks the foundational conditions required for a productive AI implementation. Adopting AI now risks wasting budget and creating confusion — foundational work must come first.";
    } else if (totalScore <= 59) {
        readinessLevel = "Early Preparation Stage";
        summarySentence = "There are early positive signals, but critical gaps in data, processes, or team readiness will limit results. Structured preparation is needed before committing to AI implementation.";
    } else if (totalScore <= 74) {
        readinessLevel = "Partially Ready — Needs Foundations";
        summarySentence = "Your business shows meaningful readiness in several areas, but gaps in key foundations may reduce AI effectiveness or cause implementation failure if not addressed first.";
    } else if (totalScore <= 89) {
        readinessLevel = "Strong Readiness for Pilot Implementation";
        summarySentence = "Your business is well-positioned to launch focused AI pilots. Addressing the remaining gaps will significantly increase the probability of real, measurable value.";
    } else {
        readinessLevel = "Highly Ready for AI Adoption";
        summarySentence = "Your business has strong structural, operational, and team readiness for AI. You are positioned to implement AI systematically and generate measurable impact across multiple areas.";
    }

    // ── Foundation warning (Realism Rule) ─────────────────────────────────────
    // If process, data, or execution score critically low, surface explicit warning
    const processResult = categoryResults.find((c) => c.categoryId === "process-readiness");
    const dataResult = categoryResults.find((c) => c.categoryId === "data-readiness");
    const executionResult = categoryResults.find((c) => c.categoryId === "execution-readiness");

    const criticallyWeak = [processResult, dataResult, executionResult].filter(
        (c) => c && c.percentage < 45
    );

    let foundationWarning: string | null = null;
    if (criticallyWeak.length >= 2) {
        foundationWarning =
            "AI should improve a business — not hide messy operations. Your assessment shows critical gaps in process clarity, data quality, or execution readiness. Implementing AI before addressing these foundations will likely produce poor results and wasted investment. Fix the foundations first.";
    } else if (criticallyWeak.length === 1) {
        const weakArea = criticallyWeak[0]!.categoryId;
        if (weakArea === "data-readiness") {
            foundationWarning =
                "Poor or scattered data is one of the most common causes of failed AI projects. Before implementing AI, prioritize organizing and centralizing your key business data.";
        } else if (weakArea === "process-readiness") {
            foundationWarning =
                "Automation cannot fix a broken process — it only makes a bad process faster. Document and stabilize your workflows before layering AI on top of them.";
        } else if (weakArea === "execution-readiness") {
            foundationWarning =
                "AI initiatives without clear ownership, measurement, and governance almost always stay experimental. Assign ownership and define success metrics before starting.";
        }
    }

    // ── Dynamic insights ───────────────────────────────────────────────────────
    const sorted = [...categoryResults].sort((a, b) => b.percentage - a.percentage);
    const topCategories = sorted.slice(0, 2);
    const bottomCategories = sorted.slice(-3).reverse();

    const strengths = topCategories.map((c) => ({
        title: getStrengthTitle(c.categoryId),
        description: getStrengthDescription(c.categoryId),
    }));

    const weaknesses = bottomCategories.map((c) => ({
        title: getWeaknessTitle(c.categoryId),
        description: getWeaknessDescription(c.categoryId),
    }));

    const recommendations: string[] = [];
    for (const weakCat of bottomCategories.slice(0, 3)) {
        recommendations.push(...getRecommendations(weakCat.categoryId));
    }

    // ── AI Opportunity Areas ───────────────────────────────────────────────────
    const aiOpportunityAreas = deriveOpportunityAreas(categoryResults, answers);

    return {
        totalScore,
        readinessLevel,
        summarySentence,
        categoryResults,
        strengths,
        weaknesses,
        recommendations: recommendations.slice(0, 5),
        aiOpportunityAreas,
        foundationWarning,
    };
}

// ── Opportunity area derivation ────────────────────────────────────────────────
// Suggests 2–3 practical areas where AI is most likely to create value,
// based on which categories score high and which specific answers signal readiness
function deriveOpportunityAreas(
    categoryResults: CategoryResult[],
    answers: AssessmentAnswers
): AIOpportunityArea[] {
    const areas: AIOpportunityArea[] = [];

    const get = (id: string) => answers[id] ?? 0;

    // Strong process readiness + identifies repetitive tasks → automation
    const processResult = categoryResults.find((c) => c.categoryId === "process-readiness");
    if (processResult && processResult.percentage >= 55 && get("pr-2") >= 4) {
        areas.push({
            title: "Workflow & Task Automation",
            description: "You have visible, repetitive processes that are good candidates for automation — from data entry and reporting to scheduling and follow-up tasks.",
        });
    }

    // Strong data readiness → analytics and reporting
    const dataResult = categoryResults.find((c) => c.categoryId === "data-readiness");
    if (dataResult && dataResult.percentage >= 55 && get("dr-2") >= 3) {
        areas.push({
            title: "Data Summarization & Reporting",
            description: "Your organized data infrastructure supports AI-driven reporting, analytics summarization, and pattern detection — without building complex pipelines from scratch.",
        });
    }

    // Strong use case clarity + understands customer value → customer-facing AI
    const useCaseResult = categoryResults.find((c) => c.categoryId === "use-case-clarity");
    if (useCaseResult && useCaseResult.percentage >= 60 && get("uc-4") >= 4) {
        areas.push({
            title: "Customer Support & Communication Workflows",
            description: "You understand customer touchpoints clearly — making AI assistants, response drafting, and FAQ automation viable starting points with measurable impact.",
        });
    }

    // Strong tech readiness → integration / copilots
    const techResult = categoryResults.find((c) => c.categoryId === "technology-readiness");
    if (techResult && techResult.percentage >= 60 && get("tech-2") >= 4) {
        areas.push({
            title: "AI Copilots & Tool Integration",
            description: "Your existing digital stack makes it feasible to add AI capabilities — copilot assistants, smart search, or content generation — directly into tools your team already uses.",
        });
    }

    // High team readiness → internal knowledge and onboarding
    const teamResult = categoryResults.find((c) => c.categoryId === "team-readiness");
    if (teamResult && teamResult.percentage >= 65 && get("tr-1") >= 4) {
        areas.push({
            title: "Internal Knowledge Search & Onboarding",
            description: "A willing and informed team can adopt AI-powered internal knowledge tools, policy Q&A systems, and onboarding assistants with lower change-management resistance.",
        });
    }

    // Execution readiness + can measure → lead qualification or sales follow-up
    const executionResult = categoryResults.find((c) => c.categoryId === "execution-readiness");
    if (executionResult && executionResult.percentage >= 60 && get("ex-3") >= 4) {
        areas.push({
            title: "Sales Follow-Up & Lead Qualification",
            description: "With clear measurement capability, AI-assisted lead scoring, follow-up sequencing, and outreach personalization can be piloted with a defined success metric from day one.",
        });
    }

    // Cap at 3, fallback if none qualify
    if (areas.length === 0) {
        areas.push({
            title: "Document Processing & Summarization",
            description: "Regardless of current readiness level, AI document summarization and basic text extraction are low-risk starting points that require minimal infrastructure.",
        });
    }

    return areas.slice(0, 3);
}

// ── Labels ─────────────────────────────────────────────────────────────────────
function getStrengthTitle(id: string): string {
    switch (id) {
        case "use-case-clarity": return "Clear AI use cases and business focus";
        case "process-readiness": return "Well-understood workflows and process visibility";
        case "data-readiness": return "Organized and accessible business data";
        case "team-readiness": return "Receptive leadership and team mindset";
        case "technology-readiness": return "Solid digital infrastructure and tool stack";
        case "execution-readiness": return "Structured approach to governance and measurement";
        default: return "Strong readiness area";
    }
}

function getStrengthDescription(id: string): string {
    switch (id) {
        case "use-case-clarity":
            return "You have specific, practical AI use cases in mind and are evaluating AI as a business tool — not as a trend to chase. This focus dramatically increases the chance of real ROI.";
        case "process-readiness":
            return "Your processes are documented and understood well enough to identify automation targets. This is a prerequisite many businesses skip — and then blame AI for failing.";
        case "data-readiness":
            return "Clean, organized data is the raw material of useful AI. Your readiness here gives you a significant advantage over businesses trying to implement AI on fragmented or unreliable data.";
        case "team-readiness":
            return "Leadership buy-in and team willingness to adapt are among the most underestimated readiness factors. Without them, the best AI implementation fails at the adoption stage.";
        case "technology-readiness":
            return "A modern digital stack significantly reduces the friction and cost of AI integration. You are not starting from scratch, which limits implementation complexity.";
        case "execution-readiness":
            return "The ability to pilot, measure, and govern AI initiatives is what separates businesses that extract real value from those that run experiments with no outcome.";
        default: return "This area shows strong readiness.";
    }
}

function getWeaknessTitle(id: string): string {
    switch (id) {
        case "use-case-clarity": return "No clear AI use cases or business value target";
        case "process-readiness": return "Unclear or undocumented workflows";
        case "data-readiness": return "Scattered, low-quality, or inaccessible data";
        case "team-readiness": return "Low adoption mindset or leadership resistance";
        case "technology-readiness": return "Digital infrastructure not ready for AI integration";
        case "execution-readiness": return "No clear ownership, measurement, or governance plan";
        default: return "Critical readiness gap";
    }
}

function getWeaknessDescription(id: string): string {
    switch (id) {
        case "use-case-clarity":
            return "Adopting AI without a clear value case leads to tool purchases that gather dust. The business may be attracted to AI as a concept without a practical reason to implement it today.";
        case "process-readiness":
            return "AI cannot fix a broken process — it can only automate it. Messy, undocumented workflows result in AI that automates errors, creates inconsistency, or produces outputs nobody trusts.";
        case "data-readiness":
            return "Poor or scattered data is the most common cause of failed AI projects. If the inputs are unreliable, the AI outputs will be too — and users will stop trusting the system within weeks.";
        case "team-readiness":
            return "Resistance, confusion, or lack of internal champions will slow or kill adoption regardless of tool quality. AI implementation is a change management challenge, not just a technical one.";
        case "technology-readiness":
            return "Heavy reliance on offline, fragmented, or legacy systems creates integration barriers that make AI implementation expensive, slow, and fragile.";
        case "execution-readiness":
            return "Without clear ownership, a pilot structure, and success metrics, AI initiatives remain permanent experiments with no measurable business impact and no accountability.";
        default:
            return "This area requires attention before serious AI adoption.";
    }
}

function getRecommendations(id: string): string[] {
    switch (id) {
        case "use-case-clarity":
            return [
                "List 3 specific business problems that cost you time or money — these are your AI starting points.",
                "Define one measurable outcome for each potential use case before evaluating tools.",
            ];
        case "process-readiness":
            return [
                "Document your 3 most critical operational workflows before touching any AI tools.",
                "Identify the top 5 repetitive manual tasks and estimate their weekly time cost.",
            ];
        case "data-readiness":
            return [
                "Audit where your key business data lives — CRM, spreadsheets, emails, shared drives — and consolidate it.",
                "Identify one high-priority data set, clean it, and centralize it as a starting point.",
            ];
        case "team-readiness":
            return [
                "Assign one internal AI champion per department — someone curious and willing to experiment.",
                "Run a 2-hour team session on practical AI tools and realistic limitations, not hype.",
            ];
        case "technology-readiness":
            return [
                "Map your current software stack and identify which tools have existing AI features or API access.",
                "Reduce dependence on email threads and spreadsheets for critical workflows — this is a prerequisite for AI leverage.",
            ];
        case "execution-readiness":
            return [
                "Assign one person as the internal owner of the first AI pilot — with clear accountability.",
                "Define 2–3 measurable KPIs for the pilot before launch, and review results after 30 days.",
            ];
        default:
            return [];
    }
}
