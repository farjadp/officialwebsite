import { investorCategories } from "./config";

export type AssessmentAnswers = Record<string, number>;

export interface CategoryResult {
    categoryId: string;
    title: string;
    score: number;
    maxScore: number;
    percentage: number;
}

export interface FinalResult {
    totalScore: number;
    readinessLevel: string;
    summarySentence: string;
    categoryResults: CategoryResult[];
    strengths: { title: string; description: string }[];
    weaknesses: { title: string; description: string }[];
    recommendations: string[];
}

export function calculateInvestorScore(answers: AssessmentAnswers): FinalResult {
    let totalScore = 0;
    const categoryResults: CategoryResult[] = [];

    for (const category of investorCategories) {
        const questions = category.questions;
        let categorySum = 0;

        for (const q of questions) {
            categorySum += answers[q.id] || 0;
        }

        const average = questions.length > 0 ? categorySum / questions.length : 0;
        let categoryScore = (average / 5) * category.weight;
        categoryScore = Math.round(categoryScore);

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

    let readinessLevel = "";
    let summarySentence = "";

    if (totalScore <= 39) {
        readinessLevel = "Not Investor Ready";
        summarySentence = "Your startup currently lacks the foundational elements required to successfully pitch investors. Focus on building core business value first.";
    } else if (totalScore <= 59) {
        readinessLevel = "Early Preparation Stage";
        summarySentence = "You are laying the groundwork, but crucial structural pieces are missing. Address your weakest areas before beginning outreach.";
    } else if (totalScore <= 74) {
        readinessLevel = "Promising but Not Fundraising Ready";
        summarySentence = "Your startup shows promising signals for investors, but several areas still require strengthening before beginning an active fundraising process.";
    } else if (totalScore <= 89) {
        readinessLevel = "Investor Ready with Minor Gaps";
        summarySentence = "You are generally well-prepared for fundraising. Refining a few remaining gaps will significantly increase your chances of closing capital.";
    } else {
        readinessLevel = "Strongly Investor Ready";
        summarySentence = "Your startup is in an excellent position to raise funds. You have strong market, product, and traction signals with clear preparation.";
    }

    const sortedCategories = [...categoryResults].sort((a, b) => b.percentage - a.percentage);
    const topCategories = sortedCategories.slice(0, 3); // Top 3
    const bottomCategories = sortedCategories.slice(-3).reverse(); // Bottom 3

    const strengths = topCategories.map((c) => ({
        title: getStrengthTitle(c.categoryId),
        description: "Evaluated as a core asset for fundraising.",
    }));

    const weaknesses = bottomCategories.map((c) => ({
        title: c.title + " represents a key investor concern",
        description: getWeaknessDescription(c.categoryId),
    }));

    const recommendations: string[] = [];
    for (const weakCat of bottomCategories.slice(0, 2)) {
        recommendations.push(...getRecommendations(weakCat.categoryId));
    }

    return {
        totalScore,
        readinessLevel,
        summarySentence,
        categoryResults,
        strengths,
        weaknesses,
        recommendations: recommendations.slice(0, 4), // Cap at top 4 actionable steps
    };
}

function getStrengthTitle(categoryId: string): string {
    switch (categoryId) {
        case "market-opportunity": return "Strong early market understanding";
        case "product-solution": return "Clear product differentiation and solution strength";
        case "traction-validation": return "Demonstrable early traction and validation";
        case "team-capability": return "Solid founding team capability and domain expertise";
        case "business-model": return "Clear business model and scalable economics";
        case "fundraising-preparedness": return "Excellent fundraising preparation and strategy";
        default: return "Strong performance area";
    }
}

function getWeaknessDescription(categoryId: string): string {
    switch (categoryId) {
        case "market-opportunity":
            return "Ambiguity around the target market or competitive landscape makes it hard to justify venture-scale returns.";
        case "product-solution":
            return "Lack of a validated, differentiated product raises concerns about long-term user adoption.";
        case "traction-validation":
            return "Limited early traction or pilots makes it very difficult for investors to justify your valuation.";
        case "team-capability":
            return "Gaps in the founding team’s skills or domain expertise increase perceived execution risk.";
        case "business-model":
            return "Unclear revenue models or misaligned pricing logic could raise serious concerns about scalability and profitability.";
        case "fundraising-preparedness":
            return "Lack of a cohesive pitch narrative, deck, or clear capital allocation plan signals unreadiness for the process.";
        default:
            return "Requires improvement to pass investor due diligence.";
    }
}

function getRecommendations(categoryId: string): string[] {
    switch (categoryId) {
        case "market-opportunity":
            return [
                "Clearly define your Total Addressable Market (TAM), SAM, and SOM.",
                "Refine your target customer segment to a highly specific, reachable audience."
            ];
        case "product-solution":
            return [
                "Build a functional MVP or interactive prototype if not already complete.",
                "Strengthen product validation through rigorous usability testing and feedback loops."
            ];
        case "traction-validation":
            return [
                "Focus entirely on acquiring early users, customers, or LOIs before seeking capital.",
                "Define metrics to prove demand (e.g., waitlist signups, pilot engagement, early MRR)."
            ];
        case "team-capability":
            return [
                "Clearly map out founding team capabilities and identify critical skill gaps.",
                "Bring on key advisors or strategic hires to cover missing domain expertise."
            ];
        case "business-model":
            return [
                "Clarify your pricing and revenue model based on real customer feedback.",
                "Prepare basic financial projections and unit economics estimates (CAC vs LTV)."
            ];
        case "fundraising-preparedness":
            return [
                "Build a stronger, tighter investor pitch narrative and review it with peers.",
                "Research and build a targeted list of 50+ investors who fund your exact stage and industry."
            ];
        default:
            return [];
    }
}
