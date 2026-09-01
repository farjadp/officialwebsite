import { trlLevels, trlPhases, TrlLevel } from "./config";

// criterionId -> 0 (No) | 1 (Partially) | 2 (Yes)
export type TrlAnswers = Record<string, number>;

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

export function calculateTrl(answers: TrlAnswers): TrlResult {
    const levelResults: TrlLevelResult[] = trlLevels.map((l) => {
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

    const achievedLevel = trl > 0 ? trlLevels[trl - 1] : null;
    const workingLevel = trl < 9 ? trlLevels[trl] : null;
    const workingLevelResult = workingLevel ? levelResults[workingLevel.level - 1] : null;

    const phase = trl > 0
        ? trlPhases.find((p) => p.levels.includes(trl))!
        : trlPhases[0];

    const trlLabel = trl > 0 ? `TRL ${trl}` : "Pre-TRL 1";

    let summarySentence: string;
    if (trl === 0) {
        summarySentence = "The underlying principles of your technology are not yet observed and documented. You are at the idea stage — the immediate task is turning the idea into reported, reviewable findings.";
    } else if (trl <= 3) {
        summarySentence = `Your technology is in the research phase (${trlLabel}). The core question is still scientific feasibility — prove the critical functions before investing in integration or productization.`;
    } else if (trl <= 6) {
        summarySentence = `Your technology is in the development phase (${trlLabel}). Feasibility is established; the work now is raising fidelity and demonstrating a complete prototype under realistic conditions.`;
    } else if (trl < 9) {
        summarySentence = `Your technology is in the demonstration and deployment phase (${trlLabel}). You are crossing the pre-commercialization gap — the distance between a working prototype and a qualified, operating product.`;
    } else {
        summarySentence = "Your technology is fully mature (TRL 9): proven in continuous real operations. The frontier is no longer technology readiness — it is market, investment, and organizational readiness.";
    }

    // Recommendations: close gaps at the working level first, then look ahead.
    const recommendations: string[] = [];
    if (workingLevel && workingLevelResult) {
        for (const gap of workingLevelResult.gaps.slice(0, 3)) {
            recommendations.push(`To reach TRL ${workingLevel.level} (${workingLevel.name}): ${gap}`);
        }
        // The achieved level's advanceHint describes the path to the working level.
        recommendations.push(achievedLevel ? achievedLevel.advanceHint : workingLevel.advanceHint);
    }
    if (trl >= 4) {
        recommendations.push(
            "TRL measures technology maturity only. Pair this result with a market and investment readiness check — a TRL 7 technology with TRL 2 market evidence is still an unfundable venture."
        );
    }

    // Funding context, following ISED Canada's grouping (e.g. the Cyber
    // Security Innovation Network guide): TRL 1-6 research & development,
    // TRL 7-9 the pre-commercialization gap.
    let fundingNote: string;
    if (trl <= 3) {
        fundingNote = "At TRL 1–3, the natural funding sources are research grants, university partnerships, and early innovation programs. Government programs (e.g. ISED Canada initiatives) typically class this range as early-stage R&D, and often measure success as advancing at least two TRLs.";
    } else if (trl <= 6) {
        fundingNote = "At TRL 4–6, you fit development-stage innovation funding: R&D grants, innovation networks, and technical co-development with industry partners. Many programs fund projects that commit to advancing a minimum of two TRLs.";
    } else {
        fundingNote = "At TRL 7–9, you are in what program guides call the pre-commercialization gap. Funding shifts from research grants toward commercialization programs, strategic partners, and private capital — and investors will now weigh market and business readiness at least as heavily as technology.";
    }

    return {
        trl,
        trlLabel,
        phaseTitle: phase.title,
        levelName: achievedLevel ? achievedLevel.name : "Idea Stage",
        nasaDefinition: achievedLevel ? achievedLevel.nasaDefinition : "Basic principles not yet observed and reported.",
        summarySentence,
        workingLevel,
        workingLevelGaps: workingLevelResult ? workingLevelResult.gaps : [],
        levelResults,
        recommendations: recommendations.slice(0, 5),
        fundingNote,
        score: Math.round((trl / 9) * 100),
    };
}
