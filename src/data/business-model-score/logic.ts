// ============================================================================
// Scoring for the Business Model Strength Score.
//
// The maths is locale-independent: same weights, same thresholds, same
// numbers. Only the returned strings change with the locale — they are looked
// up from config.ts (en) or config.fa.ts (fa).
// ============================================================================

import { BmsContent, BmsLocale, bmsContentEn } from "./config";
import { bmsContentFa } from "./config.fa";

export type AssessmentAnswers = Record<string, number>;

export function getBmsContent(locale: BmsLocale): BmsContent {
    return locale === "fa" ? bmsContentFa : bmsContentEn;
}

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

/** Record lookup with the shared `default` fallback used by every label map. */
function pick(map: Record<string, string>, id: string): string {
    return map[id] ?? map.default ?? "";
}

export function calculateBusinessModelScore(
    answers: AssessmentAnswers,
    locale: BmsLocale = "en"
): FinalResult {
    const content = getBmsContent(locale);
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

    // ── Score → Health Level ───────────────────────────────────────────────────
    let healthLevel = "";
    let summarySentence = "";

    if (totalScore <= 39) {
        healthLevel = logic.levelWeak;
        summarySentence = logic.summaryWeak;
    } else if (totalScore <= 59) {
        healthLevel = logic.levelRedesign;
        summarySentence = logic.summaryRedesign;
    } else if (totalScore <= 74) {
        healthLevel = logic.levelPromising;
        summarySentence = logic.summaryPromising;
    } else if (totalScore <= 89) {
        healthLevel = logic.levelStrong;
        summarySentence = logic.summaryStrong;
    } else {
        healthLevel = logic.levelScalable;
        summarySentence = logic.summaryScalable;
    }

    // ── Dynamic insights from category performance ─────────────────────────────
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
