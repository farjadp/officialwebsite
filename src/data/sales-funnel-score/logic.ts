// ============================================================================
// Scoring for the Sales Funnel Health Score.
//
// The maths is locale-independent: weights, averages, the 0-100 total, the
// band cut-offs and which categories count as strengths or bottlenecks are
// identical in every language. Only the strings that come back are localized,
// exactly as src/data/trl-assessment/logic.ts does it.
// ============================================================================

import {
    CategoryCopy,
    SalesFunnelContent,
    SalesFunnelLocale,
    salesFunnelContentEn,
} from "./config";
import { salesFunnelContentFa } from "./config.fa";

export type AssessmentAnswers = Record<string, number>;

export function getSalesFunnelContent(locale: SalesFunnelLocale): SalesFunnelContent {
    return locale === "fa" ? salesFunnelContentFa : salesFunnelContentEn;
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
    bottlenecks: { title: string; stage: string; description: string }[];
    recommendations: string[];
    primaryLeakStage: string | null; // Where the biggest revenue leak is
}

export function calculateSalesFunnelScore(
    answers: AssessmentAnswers,
    locale: SalesFunnelLocale = "en"
): FinalResult {
    const { categories, logic } = getSalesFunnelContent(locale);

    /** Result copy for a category id, falling back to the generic wording. */
    const copyFor = (id: string): CategoryCopy =>
        logic.categoryCopy[id] ?? { ...logic.fallback, recommendations: [] };

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
    const bandIndex =
        totalScore <= 39 ? 0 : totalScore <= 59 ? 1 : totalScore <= 74 ? 2 : totalScore <= 89 ? 3 : 4;
    const { healthLevel, summarySentence } = logic.bands[bandIndex];

    // ── Dynamic insights ───────────────────────────────────────────────────────
    const sorted = [...categoryResults].sort((a, b) => b.percentage - a.percentage);
    const topCategories = sorted.slice(0, 2);
    const bottomCategories = sorted.slice(-3).reverse();

    const strengths = topCategories.map((c) => {
        const copy = copyFor(c.categoryId);
        return { title: copy.strengthTitle, description: copy.strengthDescription };
    });

    const bottlenecks = bottomCategories.map((c) => {
        const copy = copyFor(c.categoryId);
        return {
            title: copy.bottleneckTitle,
            stage: copy.bottleneckStage,
            description: copy.bottleneckDescription,
        };
    });

    const recommendations: string[] = [];
    for (const weakCat of bottomCategories.slice(0, 3)) {
        recommendations.push(...copyFor(weakCat.categoryId).recommendations);
    }

    // ── Primary leak stage (lowest single category) ────────────────────────────
    const worstCategory = sorted[sorted.length - 1];
    const primaryLeakStage =
        worstCategory && worstCategory.percentage < 60
            ? copyFor(worstCategory.categoryId).bottleneckStage
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
