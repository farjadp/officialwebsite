import { readinessCategories } from "./config";

export type AssessmentAnswers = Record<string, number>; // questionId -> score (1-5)

export interface CategoryResult {
    categoryId: string;
    title: string;
    score: number;       // scaled score (e.g., out of 20 or 15)
    maxScore: number;    // weight of the category
    percentage: number;  // 0-100%
}

export interface ReadinessResult {
    totalScore: number;
    readinessLevel: string;
    summarySentence: string;
    categoryResults: CategoryResult[];
    strengths: { title: string; description: string }[];
    weaknesses: { title: string; description: string }[];
    recommendations: string[];
}

export function calculateReadinessScore(answers: AssessmentAnswers): ReadinessResult {
    let totalScore = 0;
    const categoryResults: CategoryResult[] = [];

    // Calculate scores per category
    for (const category of readinessCategories) {
        const questionsInCategory = category.questions;
        let categorySum = 0;

        // Sum all answered questions for this category
        for (const q of questionsInCategory) {
            categorySum += answers[q.id] || 0; // fallback to 0 if unanswered, though validation should prevent this
        }

        // Average (out of 5)
        // Avoid division by zero
        const average = questionsInCategory.length > 0 ? categorySum / questionsInCategory.length : 0;

        // Convert to weighted score: (avg / 5) * weight
        let categoryScore = (average / 5) * category.weight;

        // Round to nearest whole number as specified
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

    // Ensure total score is capped at 100
    totalScore = Math.min(Math.round(totalScore), 100);

    // Map readiness level
    let readinessLevel = "";
    let summarySentence = "";

    if (totalScore <= 39) {
        readinessLevel = "Very Early Stage";
        summarySentence = "Your startup idea is in its infancy. Focus on foundational validation before writing code or spending money.";
    } else if (totalScore <= 59) {
        readinessLevel = "Needs Serious Work";
        summarySentence = "You have pieces of the puzzle, but crucial gaps remain. Address weaknesses in your core model before attempting to scale.";
    } else if (totalScore <= 74) {
        readinessLevel = "Promising but Not Ready";
        summarySentence = "Your startup shows good potential, but needs more validation or execution clarity to be truly launch-ready.";
    } else if (totalScore <= 89) {
        readinessLevel = "Strong Early Readiness";
        summarySentence = "Your startup shows strong early readiness, but important gaps still exist before scale or fundraising.";
    } else {
        readinessLevel = "Launch Ready";
        summarySentence = "Your startup is in an excellent position to launch, acquire customers, or raise capital. Keep up the momentum.";
    }

    // Determine strengths and weaknesses
    // Sort category results by percentage descending
    const sortedCategories = [...categoryResults].sort((a, b) => b.percentage - a.percentage);

    const topCategories = sortedCategories.slice(0, 2); // Top 2
    const bottomCategories = sortedCategories.slice(-2).reverse(); // Bottom 2, lowest first

    const strengths = topCategories.map((c) => ({
        title: c.title,
        description: getStrengthDescription(c.categoryId),
    }));

    const weaknesses = bottomCategories.filter(c => c.percentage < 80).map((c) => ({
        title: c.title,
        description: getWeaknessDescription(c.categoryId),
    }));

    // If no category is below 80%, maybe they are all strengths, just show the lowest relatively
    if (weaknesses.length === 0) {
        weaknesses.push(...bottomCategories.map(c => ({
            title: c.title + " (Relative Weakness)",
            description: getWeaknessDescription(c.categoryId)
        })));
    }

    // Recommendations based on the weakest categories
    const recommendations: string[] = [];

    for (const weakCat of bottomCategories) {
        recommendations.push(...getRecommendations(weakCat.categoryId));
    }

    // Limit to top 4 recommendations
    const finalRecommendations = recommendations.slice(0, 4);

    return {
        totalScore,
        readinessLevel,
        summarySentence,
        categoryResults,
        strengths,
        weaknesses,
        recommendations: finalRecommendations,
    };
}

// Helpers for dynamic text based on the user's requirements

function getStrengthDescription(categoryId: string): string {
    switch (categoryId) {
        case "problem-market":
            return "Strong understanding of the market problem and clear target customer definition.";
        case "solution-product":
            return "Product concept is well-defined and has meaningful advantages.";
        case "founder-team":
            return "The team shows strong commitment, complimentary skills, and alignment.";
        case "business-model":
            return "Clear and realistic path to revenue and sustainable unit economics.";
        case "go-to-market":
            return "Solid plan for reaching customers and testing demand.";
        case "execution-momentum":
            return "Excellent execution momentum, clear priorities, and consistent progress.";
        default:
            return "Strong performance in this area.";
    }
}

function getWeaknessDescription(categoryId: string): string {
    switch (categoryId) {
        case "problem-market":
            return "The startup may be building on assumptions rather than validated demand.";
        case "solution-product":
            return "The idea may still be too abstract or underdeveloped compared to market needs.";
        case "founder-team":
            return "Execution risk is high due to unclear ownership, missing skills, or alignment issues.";
        case "business-model":
            return "Long-term sustainability is uncertain due to unclear revenue logic or high costs.";
        case "go-to-market":
            return "The team may struggle to get traction and acquire customers, even with a good product.";
        case "execution-momentum":
            return "The startup risks staying stuck in planning mode without tangible progress.";
        default:
            return "Requires improvement to ensure startup success.";
    }
}

function getRecommendations(categoryId: string): string[] {
    switch (categoryId) {
        case "problem-market":
            return [
                "Conduct 10-15 deep-dive interviews with your target users in the next 2 weeks.",
                "Clearly define the specific pain point you are solving before writing more code.",
            ];
        case "solution-product":
            return [
                "Create a simple MVP or functional prototype and test it with real users.",
                "Refine your value proposition to be easily explainable in under 30 seconds."
            ];
        case "founder-team":
            return [
                "Map out team capabilities and explicitly define roles and responsibilities.",
                "Address any missing core skills through advisors, hires, or learning."
            ];
        case "business-model":
            return [
                "Clarify your pricing model and validate it with potential customers.",
                "Review your unit economics (Customer Acquisition Cost vs Lifetime Value)."
            ];
        case "go-to-market":
            return [
                "Define a simple, low-cost customer acquisition experiment for a specific channel.",
                "Develop a clear message or offer that will attract your first batch of users."
            ];
        case "execution-momentum":
            return [
                "Build a concrete 30-day action plan with specific, measurable deliverables.",
                "Set up a weekly accountability structure to track progress against your top priorities."
            ];
        default:
            return [];
    }
}
