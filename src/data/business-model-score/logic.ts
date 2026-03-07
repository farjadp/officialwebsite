import { businessModelCategories } from "./config";

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
    healthLevel: string;
    summarySentence: string;
    categoryResults: CategoryResult[];
    strengths: { title: string; description: string }[];
    weaknesses: { title: string; description: string }[];
    recommendations: string[];
}

export function calculateBusinessModelScore(answers: AssessmentAnswers): FinalResult {
    let totalScore = 0;
    const categoryResults: CategoryResult[] = [];

    for (const category of businessModelCategories) {
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

    // ── Score → Health Level ───────────────────────────────────────────────────
    let healthLevel = "";
    let summarySentence = "";

    if (totalScore <= 39) {
        healthLevel = "Weak and Unstable";
        summarySentence = "Your business model lacks the fundamental logic needed to sustain a viable business. Significant structural redesign is required before moving forward.";
    } else if (totalScore <= 59) {
        healthLevel = "Needs Major Redesign";
        summarySentence = "There are meaningful signals in your model, but critical structural weaknesses will limit growth or profitability without significant rethinking.";
    } else if (totalScore <= 74) {
        healthLevel = "Promising but Structurally Incomplete";
        summarySentence = "Your business model shows promising fundamentals, but a few structural gaps may limit long-term growth or profitability if left unaddressed.";
    } else if (totalScore <= 89) {
        healthLevel = "Strong Model with Some Gaps";
        summarySentence = "This is a well-structured business model. Targeted improvements to the weaker areas will meaningfully increase resilience and scalability.";
    } else {
        healthLevel = "Highly Strong and Scalable";
        summarySentence = "Your business model demonstrates strong fundamentals across all critical dimensions. You are well-positioned to build, scale, and defend your position.";
    }

    // ── Dynamic insights from category performance ─────────────────────────────
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

    return {
        totalScore,
        healthLevel,
        summarySentence,
        categoryResults,
        strengths,
        weaknesses,
        recommendations: recommendations.slice(0, 5),
    };
}

// ── Strength labels ────────────────────────────────────────────────────────────
function getStrengthTitle(id: string): string {
    switch (id) {
        case "value-proposition": return "Clear and compelling value proposition";
        case "customer-market-fit": return "Strong customer and market understanding";
        case "revenue-model": return "Logical and repeatable revenue structure";
        case "cost-structure": return "Controlled cost base and healthy margins";
        case "scalability": return "Scalable model with identifiable growth paths";
        case "competitive-defensibility": return "Defensible position and clear differentiation";
        default: return "Strong performance area";
    }
}

function getStrengthDescription(id: string): string {
    switch (id) {
        case "value-proposition": return "Your offer addresses a real pain point and communicates value clearly — a critical foundation for sustainable growth.";
        case "customer-market-fit": return "You understand your customers well and have validated demand, reducing the risk of building for a market that doesn't exist.";
        case "revenue-model": return "Your model has clear monetization logic with realistic pricing — essential for generating consistent, scalable revenue.";
        case "cost-structure": return "You have a realistic handle on your cost base, making the model more resilient against margin pressure.";
        case "scalability": return "The model is structured to grow without proportional cost increases — a key indicator of long-term business health.";
        case "competitive-defensibility": return "You have a defined differentiator and strategic advantage that gives the business room to compete and defend its position.";
        default: return "This area is performing well.";
    }
}

// ── Weakness labels ────────────────────────────────────────────────────────────
function getWeaknessTitle(id: string): string {
    switch (id) {
        case "value-proposition": return "Value proposition is unclear or undifferentiated";
        case "customer-market-fit": return "Customer fit and market demand are unvalidated";
        case "revenue-model": return "Revenue model lacks clarity or repeatability";
        case "cost-structure": return "Cost structure may threaten long-term sustainability";
        case "scalability": return "Limited scalability may cap growth potential";
        case "competitive-defensibility": return "Weak defensibility exposes the business to competition";
        default: return "Area requires improvement";
    }
}

function getWeaknessDescription(id: string): string {
    switch (id) {
        case "value-proposition":
            return "The business may not be solving a strong enough problem, or it's communicating value poorly. Without a sharp value proposition, customer acquisition becomes expensive and conversion suffers.";
        case "customer-market-fit":
            return "The model may be based on assumptions rather than tested market demand. Building on unvalidated assumptions is one of the most common causes of early business failure.";
        case "revenue-model":
            return "The business may struggle to monetize consistently. Without a clear, repeatable path to revenue, the model cannot support sustainable growth or attract capital.";
        case "cost-structure":
            return "The model may be vulnerable to margin pressure or inefficient operations. Uncontrolled costs erode value, reduce runway, and limit investment capacity.";
        case "scalability":
            return "The business may work only at a small scale and face difficulty expanding without proportional cost increases. This limits both growth potential and investor attractiveness.";
        case "competitive-defensibility":
            return "The business may be too easy to copy or too weakly positioned in the market. Without a defensible advantage, competitors can undercut quickly and erode market share.";
        default:
            return "This area requires attention before scaling.";
    }
}

// ── Recommendations ────────────────────────────────────────────────────────────
function getRecommendations(id: string): string[] {
    switch (id) {
        case "value-proposition":
            return [
                "Clarify your core customer pain and rewrite your value proposition around it.",
                "Test your messaging with 10 real potential customers — measure how quickly they understand the offer.",
            ];
        case "customer-market-fit":
            return [
                "Conduct at least 20 structured customer interviews to validate the problem and willingness to pay.",
                "Narrow your target segment to a specific, reachable group before expanding market scope.",
            ];
        case "revenue-model":
            return [
                "Define and document your primary and secondary revenue streams clearly.",
                "Test pricing assumptions with real buyers — use pilots, early access offers, or landing page experiments.",
            ];
        case "cost-structure":
            return [
                "Map your fixed and variable cost structure in detail and identify the top 3 cost drivers.",
                "Build a break-even model to understand the minimum revenue needed to sustain operations.",
            ];
        case "scalability":
            return [
                "Identify which parts of your delivery can be standardized, automated, or templated.",
                "Reduce service-heavy bottlenecks and map channels that can serve more customers without proportional headcount growth.",
            ];
        case "competitive-defensibility":
            return [
                "Define your moat clearly: is it data, network effects, switching costs, brand, or distribution?",
                "Reposition against competitors by emphasizing what you do better or differently — make it specific, not vague.",
            ];
        default:
            return [];
    }
}
