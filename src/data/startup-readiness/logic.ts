import {
    Category,
    ReadinessLocale,
    ReadinessLogicStrings,
    readinessCategories,
    readinessLogicStringsEn,
} from "./config";
import { readinessCategoriesFa, readinessLogicStringsFa } from "./config.fa";

export type AssessmentAnswers = Record<string, number>; // questionId -> score (1-5)

export function getReadinessCategories(locale: ReadinessLocale): Category[] {
    return locale === "fa" ? readinessCategoriesFa : readinessCategories;
}

function getStrings(locale: ReadinessLocale): ReadinessLogicStrings {
    return locale === "fa" ? readinessLogicStringsFa : readinessLogicStringsEn;
}

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

export function calculateReadinessScore(
    answers: AssessmentAnswers,
    locale: ReadinessLocale = "en"
): ReadinessResult {
    const categories = getReadinessCategories(locale);
    const strings = getStrings(locale);

    let totalScore = 0;
    const categoryResults: CategoryResult[] = [];

    // Calculate scores per category
    for (const category of categories) {
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
        readinessLevel = strings.bands.veryEarly.level;
        summarySentence = strings.bands.veryEarly.summary;
    } else if (totalScore <= 59) {
        readinessLevel = strings.bands.needsWork.level;
        summarySentence = strings.bands.needsWork.summary;
    } else if (totalScore <= 74) {
        readinessLevel = strings.bands.promising.level;
        summarySentence = strings.bands.promising.summary;
    } else if (totalScore <= 89) {
        readinessLevel = strings.bands.strongEarly.level;
        summarySentence = strings.bands.strongEarly.summary;
    } else {
        readinessLevel = strings.bands.launchReady.level;
        summarySentence = strings.bands.launchReady.summary;
    }

    // Determine strengths and weaknesses
    // Sort category results by percentage descending
    const sortedCategories = [...categoryResults].sort((a, b) => b.percentage - a.percentage);

    const topCategories = sortedCategories.slice(0, 2); // Top 2
    const bottomCategories = sortedCategories.slice(-2).reverse(); // Bottom 2, lowest first

    const strengths = topCategories.map((c) => ({
        title: c.title,
        description: strings.strengthDescriptions[c.categoryId] ?? strings.strengthDefault,
    }));

    const weaknesses = bottomCategories.filter(c => c.percentage < 80).map((c) => ({
        title: c.title,
        description: strings.weaknessDescriptions[c.categoryId] ?? strings.weaknessDefault,
    }));

    // If no category is below 80%, maybe they are all strengths, just show the lowest relatively
    if (weaknesses.length === 0) {
        weaknesses.push(...bottomCategories.map(c => ({
            title: c.title + strings.relativeWeaknessSuffix,
            description: strings.weaknessDescriptions[c.categoryId] ?? strings.weaknessDefault,
        })));
    }

    // Recommendations based on the weakest categories
    const recommendations: string[] = [];

    for (const weakCat of bottomCategories) {
        recommendations.push(...(strings.recommendations[weakCat.categoryId] ?? []));
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
