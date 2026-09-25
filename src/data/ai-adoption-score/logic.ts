// ============================================================================
// Scoring for the AI Adoption Readiness Score.
//
// The maths is locale-independent: same weights, same thresholds, same
// numbers. Only the returned strings change with the locale — they are looked
// up from config.ts (en) or config.fa.ts (fa).
// ============================================================================

import { AiContent, AiInsight, AiLocale, aiContentEn, aiLogicStringsEn } from "./config";
import { aiContentFa } from "./config.fa";

export type AssessmentAnswers = Record<string, number>;

export function getAiContent(locale: AiLocale): AiContent {
    return locale === "fa" ? aiContentFa : aiContentEn;
}

export interface CategoryResult {
    categoryId: string;
    title: string;
    score: number;
    maxScore: number;
    percentage: number;
}

export type AIOpportunityArea = AiInsight;

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

/** Record lookup with the shared `default` fallback used by every label map. */
function pick(map: Record<string, string>, id: string): string {
    return map[id] ?? map.default ?? "";
}

export function calculateAIAdoptionScore(
    answers: AssessmentAnswers,
    locale: AiLocale = "en"
): FinalResult {
    const content = getAiContent(locale);
    const categories = content.categories;
    const logic = content.logic;

    let totalScore = 0;
    const categoryResults: CategoryResult[] = [];

    for (const category of categories) {
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
        readinessLevel = logic.levelNotReady;
        summarySentence = logic.summaryNotReady;
    } else if (totalScore <= 59) {
        readinessLevel = logic.levelEarly;
        summarySentence = logic.summaryEarly;
    } else if (totalScore <= 74) {
        readinessLevel = logic.levelPartial;
        summarySentence = logic.summaryPartial;
    } else if (totalScore <= 89) {
        readinessLevel = logic.levelStrong;
        summarySentence = logic.summaryStrong;
    } else {
        readinessLevel = logic.levelHighly;
        summarySentence = logic.summaryHighly;
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
        foundationWarning = logic.foundationWarningMultiple;
    } else if (criticallyWeak.length === 1) {
        const weakArea = criticallyWeak[0]!.categoryId;
        if (weakArea === "data-readiness") {
            foundationWarning = logic.foundationWarningData;
        } else if (weakArea === "process-readiness") {
            foundationWarning = logic.foundationWarningProcess;
        } else if (weakArea === "execution-readiness") {
            foundationWarning = logic.foundationWarningExecution;
        }
    }

    // ── Dynamic insights ───────────────────────────────────────────────────────
    const sorted = [...categoryResults].sort((a, b) => b.percentage - a.percentage);
    const topCategories = sorted.slice(0, 2);
    const bottomCategories = sorted.slice(-3).reverse();

    const strengths = topCategories.map((c) => ({
        title: pick(logic.strengthTitles, c.categoryId),
        description: pick(logic.strengthDescriptions, c.categoryId),
    }));

    const weaknesses = bottomCategories.map((c) => ({
        title: pick(logic.weaknessTitles, c.categoryId),
        description: pick(logic.weaknessDescriptions, c.categoryId),
    }));

    const recommendations: string[] = [];
    for (const weakCat of bottomCategories.slice(0, 3)) {
        recommendations.push(...(logic.recommendations[weakCat.categoryId] ?? []));
    }

    // ── AI Opportunity Areas ───────────────────────────────────────────────────
    const aiOpportunityAreas = deriveOpportunityAreas(categoryResults, answers, locale);

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
    answers: AssessmentAnswers,
    locale: AiLocale
): AIOpportunityArea[] {
    const map = getAiContent(locale).logic.opportunityAreas;
    const area = (id: string): AIOpportunityArea =>
        map[id] ?? aiLogicStringsEn.opportunityAreas[id];

    const areas: AIOpportunityArea[] = [];

    const get = (id: string) => answers[id] ?? 0;

    // Strong process readiness + identifies repetitive tasks → automation
    const processResult = categoryResults.find((c) => c.categoryId === "process-readiness");
    if (processResult && processResult.percentage >= 55 && get("pr-2") >= 4) {
        areas.push(area("automation"));
    }

    // Strong data readiness → analytics and reporting
    const dataResult = categoryResults.find((c) => c.categoryId === "data-readiness");
    if (dataResult && dataResult.percentage >= 55 && get("dr-2") >= 3) {
        areas.push(area("reporting"));
    }

    // Strong use case clarity + understands customer value → customer-facing AI
    const useCaseResult = categoryResults.find((c) => c.categoryId === "use-case-clarity");
    if (useCaseResult && useCaseResult.percentage >= 60 && get("uc-4") >= 4) {
        areas.push(area("customer"));
    }

    // Strong tech readiness → integration / copilots
    const techResult = categoryResults.find((c) => c.categoryId === "technology-readiness");
    if (techResult && techResult.percentage >= 60 && get("tech-2") >= 4) {
        areas.push(area("copilots"));
    }

    // High team readiness → internal knowledge and onboarding
    const teamResult = categoryResults.find((c) => c.categoryId === "team-readiness");
    if (teamResult && teamResult.percentage >= 65 && get("tr-1") >= 4) {
        areas.push(area("knowledge"));
    }

    // Execution readiness + can measure → lead qualification or sales follow-up
    const executionResult = categoryResults.find((c) => c.categoryId === "execution-readiness");
    if (executionResult && executionResult.percentage >= 60 && get("ex-3") >= 4) {
        areas.push(area("sales"));
    }

    // Cap at 3, fallback if none qualify
    if (areas.length === 0) {
        areas.push(area("documents"));
    }

    return areas.slice(0, 3);
}
