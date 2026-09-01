import { trlContentEn, TrlContent, TrlLevel, TrlLocale } from "./config";
import { trlContentFa } from "./config.fa";

// criterionId -> 0 (No) | 1 (Partially) | 2 (Yes)
export type TrlAnswers = Record<string, number>;

export function getTrlContent(locale: TrlLocale): TrlContent {
    return locale === "fa" ? trlContentFa : trlContentEn;
}

// A level is "achieved" when its evidence score is at least 80% of maximum.
// With 3 criteria (max 6 points) that means all Yes, or two Yes and one
// Partially — mirroring the ~85% gate used by AFRL/NASA TRL calculators
// while allowing one piece of evidence to be in progress.
const LEVEL_GATE = 0.8;

export interface TrlLevelResult {
    level: number;
    name: string;
    score: number;      // points earned
    maxScore: number;   // points possible
    percentage: number; // 0-100
    achieved: boolean;
    gaps: string[];     // criteria not fully met (answered No or Partially)
}

export interface TrlResult {
    trl: number; // 0 = pre-TRL 1
    trlLabel: string;
    phaseTitle: string;
    levelName: string;
    nasaDefinition: string;
    summarySentence: string;
    workingLevel: TrlLevel | null; // the next level being worked toward
    workingLevelGaps: string[];    // unmet criteria at the working level
    levelResults: TrlLevelResult[];
    recommendations: string[];
    fundingNote: string;
    score: number; // 0-100 for analytics (trl / 9 * 100)
}

export function calculateTrl(answers: TrlAnswers, locale: TrlLocale = "en"): TrlResult {
    const content = getTrlContent(locale);
    const { levels, phases, logic } = content;

    const levelResults: TrlLevelResult[] = levels.map((l) => {
        const maxScore = l.criteria.length * 2;
        let score = 0;
        const gaps: string[] = [];
        for (const c of l.criteria) {
            const v = answers[c.id] ?? 0;
            score += v;
            if (v < 2) gaps.push(c.text);
        }
        const percentage = Math.round((score / maxScore) * 100);
        return {
            level: l.level,
            name: l.name,
            score,
            maxScore,
            percentage,
            achieved: score >= maxScore * LEVEL_GATE,
            gaps,
        };
    });

    // Achieved TRL = highest CONSECUTIVE achieved level starting from 1.
    // TRL is a ladder: an unmet lower level caps maturity regardless of
    // evidence claimed at higher levels.
    let trl = 0;
    for (const r of levelResults) {
        if (r.achieved) trl = r.level;
        else break;
    }

    const achievedLevel = trl > 0 ? levels[trl - 1] : null;
    const workingLevel = trl < 9 ? levels[trl] : null;
    const workingLevelResult = workingLevel ? levelResults[workingLevel.level - 1] : null;

    const phase = trl > 0
        ? phases.find((p) => p.levels.includes(trl))!
        : phases[0];

    const trlLabel = trl > 0 ? logic.trlLabel(trl) : logic.preTrl1Label;

    let summarySentence: string;
    if (trl === 0) {
        summarySentence = logic.summaryPreTrl1;
    } else if (trl <= 3) {
        summarySentence = logic.summaryResearch(trlLabel);
    } else if (trl <= 6) {
        summarySentence = logic.summaryDevelopment(trlLabel);
    } else if (trl < 9) {
        summarySentence = logic.summaryDeployment(trlLabel);
    } else {
        summarySentence = logic.summaryTrl9;
    }

    // Recommendations: close gaps at the working level first, then look ahead.
    const recommendations: string[] = [];
    if (workingLevel && workingLevelResult) {
        for (const gap of workingLevelResult.gaps.slice(0, 3)) {
            recommendations.push(logic.reachRecommendation(workingLevel.level, workingLevel.name, gap));
        }
        // The achieved level's advanceHint describes the path to the working level.
        recommendations.push(achievedLevel ? achievedLevel.advanceHint : workingLevel.advanceHint);
    }
    if (trl >= 4) {
        recommendations.push(logic.pairingRecommendation);
    }

    // Funding context, following ISED Canada's grouping (e.g. the Cyber
    // Security Innovation Network guide): TRL 1-6 research & development,
    // TRL 7-9 the pre-commercialization gap.
    const fundingNote = trl <= 3 ? logic.fundingEarly : trl <= 6 ? logic.fundingMid : logic.fundingLate;

    return {
        trl,
        trlLabel,
        phaseTitle: phase.title,
        levelName: achievedLevel ? achievedLevel.name : logic.preTrl1LevelName,
        nasaDefinition: achievedLevel ? achievedLevel.nasaDefinition : logic.preTrl1NasaDefinition,
        summarySentence,
        workingLevel,
        workingLevelGaps: workingLevelResult ? workingLevelResult.gaps : [],
        levelResults,
        recommendations: recommendations.slice(0, 5),
        fundingNote,
        score: Math.round((trl / 9) * 100),
    };
}
