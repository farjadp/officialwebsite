import { salesFunnelCategories } from "./config";

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
    bottlenecks: { title: string; stage: string; description: string }[];
    recommendations: string[];
    primaryLeakStage: string | null; // Where the biggest revenue leak is
}

export function calculateSalesFunnelScore(answers: AssessmentAnswers): FinalResult {
    let totalScore = 0;
    const categoryResults: CategoryResult[] = [];

    for (const category of salesFunnelCategories) {
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
        healthLevel = "Broken Funnel";
        summarySentence = "Your sales funnel has critical structural problems. Leads are likely being lost at multiple stages and sales performance is significantly below potential.";
    } else if (totalScore <= 59) {
        healthLevel = "Weak Funnel Structure";
        summarySentence = "Your funnel is running but with significant gaps. Revenue is being left on the table due to poor qualification, inconsistent process, or weak conversion systems.";
    } else if (totalScore <= 74) {
        healthLevel = "Functional but Leaking Opportunities";
        summarySentence = "Your funnel is generating opportunities, but structural gaps are reducing conversions at one or more stages. Fixing the leaks could meaningfully increase revenue without more leads.";
    } else if (totalScore <= 89) {
        healthLevel = "Healthy Funnel with Improvement Potential";
        summarySentence = "Your sales funnel is well-structured and performing. Targeted improvements to weaker areas could unlock additional conversion and revenue growth.";
    } else {
        healthLevel = "High-Performance Sales Funnel";
        summarySentence = "Your funnel is operating at a high level across all stages. Focus on scale, optimization, and protecting what's already working.";
    }

    // ── Dynamic insights ───────────────────────────────────────────────────────
    const sorted = [...categoryResults].sort((a, b) => b.percentage - a.percentage);
    const topCategories = sorted.slice(0, 2);
    const bottomCategories = sorted.slice(-3).reverse();

    const strengths = topCategories.map((c) => ({
        title: getStrengthTitle(c.categoryId),
        description: getStrengthDescription(c.categoryId),
    }));

    const bottlenecks = bottomCategories.map((c) => ({
        title: getBottleneckTitle(c.categoryId),
        stage: getBottleneckStage(c.categoryId),
        description: getBottleneckDescription(c.categoryId),
    }));

    const recommendations: string[] = [];
    for (const weakCat of bottomCategories.slice(0, 3)) {
        recommendations.push(...getRecommendations(weakCat.categoryId));
    }

    // ── Primary leak stage (lowest single category) ────────────────────────────
    const worstCategory = sorted[sorted.length - 1];
    const primaryLeakStage = worstCategory && worstCategory.percentage < 60
        ? getBottleneckStage(worstCategory.categoryId)
        : null;

    return {
        totalScore,
        healthLevel,
        summarySentence,
        categoryResults,
        strengths,
        bottlenecks,
        recommendations: recommendations.slice(0, 5),
        primaryLeakStage,
    };
}

// ── Strength labels ────────────────────────────────────────────────────────────
function getStrengthTitle(id: string): string {
    switch (id) {
        case "lead-generation": return "Consistent and well-targeted lead generation";
        case "lead-qualification": return "Effective qualification — right prospects in pipeline";
        case "messaging-offer": return "Clear value proposition and strong offer";
        case "sales-process": return "Structured and repeatable sales process";
        case "conversion-closing": return "Strong conversion and closing capability";
        case "tracking-optimization": return "Data-driven funnel management and optimization";
        default: return "Strong funnel area";
    }
}

function getStrengthDescription(id: string): string {
    switch (id) {
        case "lead-generation":
            return "You have reliable, repeatable sources of qualified leads — the foundation of any scalable sales system.";
        case "lead-qualification":
            return "Your team focuses sales time on the right prospects, which directly protects revenue and reduces wasted effort.";
        case "messaging-offer":
            return "Prospects understand your value quickly and clearly — reducing friction at every stage of the funnel.";
        case "sales-process":
            return "A structured process means results are consistent and not dependent on individual heroics or luck.";
        case "conversion-closing":
            return "Your ability to convert qualified conversations into closed deals is the most direct driver of revenue growth.";
        case "tracking-optimization":
            return "You know where leads are and where they drop off — which means you can improve the funnel systematically instead of guessing.";
        default: return "This stage of your funnel is performing well.";
    }
}

// ── Bottleneck labels ──────────────────────────────────────────────────────────
function getBottleneckTitle(id: string): string {
    switch (id) {
        case "lead-generation": return "Insufficient or poorly targeted lead generation";
        case "lead-qualification": return "Unqualified prospects entering the pipeline";
        case "messaging-offer": return "Weak messaging — prospects don't see the value";
        case "sales-process": return "Inconsistent, unstructured sales process";
        case "conversion-closing": return "Deals stalling — low closing effectiveness";
        case "tracking-optimization": return "Blind funnel — no visibility into performance";
        default: return "Funnel gap identified";
    }
}

function getBottleneckStage(id: string): string {
    switch (id) {
        case "lead-generation": return "Top of Funnel";
        case "lead-qualification": return "Entry Stage";
        case "messaging-offer": return "Middle of Funnel";
        case "sales-process": return "Process Layer";
        case "conversion-closing": return "Bottom of Funnel";
        case "tracking-optimization": return "Optimization Layer";
        default: return "Unknown Stage";
    }
}

function getBottleneckDescription(id: string): string {
    switch (id) {
        case "lead-generation":
            return "The problem starts at the top. If lead flow is inconsistent or poorly targeted, every downstream stage suffers regardless of how good the process is.";
        case "lead-qualification":
            return "Unqualified prospects waste sales time, distort conversion metrics, and demoralize teams. Most businesses don't have a lead problem — they have a qualification problem.";
        case "messaging-offer":
            return "If prospects can't quickly understand why your offer matters to them, they disengage before trust is built. Weak messaging is often invisible to insiders but immediately felt by prospects.";
        case "sales-process":
            return "Inconsistent follow-up and undefined next steps are where most deals silently die. Without a process, sales depends on individual effort and memory — neither of which scales.";
        case "conversion-closing":
            return "A prospect who reaches the closing stage represents significant invested effort. Losing them here is the most expensive failure point in the funnel — and often the most fixable.";
        case "tracking-optimization":
            return "You cannot improve what you cannot see. Without tracking drop-off points and conversion rates, every improvement is a guess — and problems get fixed after they've already cost significant revenue.";
        default:
            return "This area needs attention.";
    }
}

// ── Recommendations ────────────────────────────────────────────────────────────
function getRecommendations(id: string): string[] {
    switch (id) {
        case "lead-generation":
            return [
                "Identify your top 2 highest-converting lead sources and double investment there before exploring new channels.",
                "Define your Ideal Customer Profile (ICP) precisely — job title, company size, pain trigger — and audit whether current marketing targets it.",
            ];
        case "lead-qualification":
            return [
                "Build a simple qualification scorecard: define 4–5 criteria that separate a good lead from a time-waster.",
                "Introduce a brief discovery question sequence at the start of every sales conversation to qualify before investing time.",
            ];
        case "messaging-offer":
            return [
                "Rewrite your core value proposition by completing this sentence: 'We help [specific person] achieve [specific outcome] without [common frustration].'",
                "Test your messaging with 5 real prospects — if they can't repeat your value back to you, it's not clear enough.",
            ];
        case "sales-process":
            return [
                "Document your sales process as a simple 5–7 step flowchart. Every step must have a clear 'next action' that can be handed off.",
                "Build a follow-up sequence template: 3 touchpoints over 10 days for every prospect who doesn't respond after the first contact.",
            ];
        case "conversion-closing":
            return [
                "List the top 5 objections you hear most often and write a clear, confident response to each before your next sales conversation.",
                "Add a clear close question to every sales call — never end a conversation without an explicit next step or decision.",
            ];
        case "tracking-optimization":
            return [
                "Start tracking 3 core metrics weekly: number of new leads, number of active conversations, and number of closed deals.",
                "Review your pipeline at the start of every week and identify any prospect that has been stalled for more than 7 days.",
            ];
        default:
            return [];
    }
}
