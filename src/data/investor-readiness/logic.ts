import {
    Category,
    InvestorLocale,
    InvestorLogicStrings,
    investorCategories,
    investorLogicStringsEn,
} from "./config";
import { investorCategoriesFa, investorLogicStringsFa } from "./config.fa";

export type AssessmentAnswers = Record<string, number>;

export function getInvestorCategories(locale: InvestorLocale): Category[] {
    return locale === "fa" ? investorCategoriesFa : investorCategories;
}

function getStrings(locale: InvestorLocale): InvestorLogicStrings {
    return locale === "fa" ? investorLogicStringsFa : investorLogicStringsEn;
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
    readinessLevel: string;
    summarySentence: string;
    categoryResults: CategoryResult[];
    strengths: { title: string; description: string }[];
    weaknesses: { title: string; description: string }[];
    recommendations: string[];
}

export function calculateInvestorScore(
    answers: AssessmentAnswers,
    locale: InvestorLocale = "en"
): FinalResult {
    const categories = getInvestorCategories(locale);
    const strings = getStrings(locale);

    let totalScore = 0;
    const categoryResults: CategoryResult[] = [];

    for (const category of categories) {
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
        readinessLevel = strings.bands.notReady.level;
        summarySentence = strings.bands.notReady.summary;
    } else if (totalScore <= 59) {
        readinessLevel = strings.bands.earlyPrep.level;
        summarySentence = strings.bands.earlyPrep.summary;
    } else if (totalScore <= 74) {
        readinessLevel = strings.bands.promising.level;
        summarySentence = strings.bands.promising.summary;
    } else if (totalScore <= 89) {
        readinessLevel = strings.bands.minorGaps.level;
        summarySentence = strings.bands.minorGaps.summary;
    } else {
        readinessLevel = strings.bands.stronglyReady.level;
        summarySentence = strings.bands.stronglyReady.summary;
    }

    const sortedCategories = [...categoryResults].sort((a, b) => b.percentage - a.percentage);
    const topCategories = sortedCategories.slice(0, 3); // Top 3
    const bottomCategories = sortedCategories.slice(-3).reverse(); // Bottom 3

    const strengths = topCategories.map((c) => ({
        title: strings.strengthTitles[c.categoryId] ?? strings.strengthTitleDefault,
        description: strings.strengthDescription,
    }));

    const weaknesses = bottomCategories.map((c) => ({
        title: strings.weaknessTitle(c.title),
        description: strings.weaknessDescriptions[c.categoryId] ?? strings.weaknessDefault,
    }));

    const recommendations: string[] = [];
    for (const weakCat of bottomCategories.slice(0, 2)) {
        recommendations.push(...(strings.recommendations[weakCat.categoryId] ?? []));
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
