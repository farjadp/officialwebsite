// ============================================================================
// Business Model Stress Test — heat map analysis (steps 4, 5 and the fallback for 6)
// Method: Haaker, Bouwman, Janssen & De Reuver (2017), Futures 89, 14-25.
//
// Colour semantics are taken verbatim from the paper (section 3.1.4):
//   red    — the outcome makes the component no longer FEASIBLE (potential showstopper)
//   orange — the outcome makes the component no longer VIABLE (choices must be revisited)
//   green  — the outcome affects feasibility/viability, but not negatively
//   grey   — the outcome does not affect the component at all (step 3 found no causality)
//
// The paper's method is qualitative and deliberately produces no number. The
// robustness index below is our own quantification, added so the result can be
// tracked over time and compared between models; the heat map remains the primary output.
// ============================================================================

import {
    BmLocale,
    BmLogicStrings,
    BusinessModelContent,
    StressFactor,
    businessModelComponents,
    businessModelContentEn,
} from "./config";
import { businessModelContentFa } from "./config.fa";

export function getBusinessModelContent(locale: BmLocale): BusinessModelContent {
    return locale === "fa" ? businessModelContentFa : businessModelContentEn;
}

export type ImpactColor = "red" | "orange" | "green" | "grey";

export interface HeatMapCell {
    componentId: string;
    factorId: string;
    outcomeId: "a" | "b";
    color: ImpactColor;
    /** Why this colour — the paper insists the reasoning is recorded, not just the colour. */
    reasoning: string;
}

export interface BusinessModelDescription {
    /** componentId -> the founder's own description. Empty strings mean "not described". */
    [componentId: string]: string;
}

/** Step 5a — sub-view accumulating one component across all stress factor outcomes. */
export interface ComponentSubView {
    componentId: string;
    name: string;
    robustness: number;
    assessed: number;
    red: number;
    orange: number;
    green: number;
}

/** Step 5a — sub-view accumulating one outcome across all business model components. */
export interface OutcomeSubView {
    factorId: string;
    outcomeId: "a" | "b";
    factorName: string;
    outcomeLabel: string;
    robustness: number;
    assessed: number;
    red: number;
    orange: number;
    green: number;
}

export type PatternType =
    | "double-red"
    | "double-green"
    | "inconsistency"
    | "preferred-outcome";

/** Step 5b — patterns of colouring the paper tells you to look for. */
export interface HeatMapPattern {
    type: PatternType;
    /** The component the pattern is about, when it has one — used to title the action. */
    subject?: string;
    title: string;
    detail: string;
    severity: "critical" | "warning" | "positive";
}

export interface StressTestAction {
    title: string;
    detail: string;
}

export interface StressTestResult {
    robustnessIndex: number;
    grade: string;
    verdict: string;
    assessedCells: number;
    totalCells: number;
    counts: { red: number; orange: number; green: number; grey: number };
    componentSubViews: ComponentSubView[];
    outcomeSubViews: OutcomeSubView[];
    patterns: HeatMapPattern[];
    actions: StressTestAction[];
}

/** The full payload the API returns and the result UI renders. */
export interface StressTestReport {
    generatedAt: string;
    factors: StressFactor[];
    businessModel: BusinessModelDescription;
    cells: HeatMapCell[];
    result: StressTestResult;
}

const COLOR_WEIGHT: Record<Exclude<ImpactColor, "grey">, number> = {
    green: 1,
    orange: 0.5,
    red: 0,
};

function indexOf(cells: HeatMapCell[]) {
    const assessed = cells.filter((cell) => cell.color !== "grey");
    if (!assessed.length) return { robustness: 100, assessed: 0, red: 0, orange: 0, green: 0 };
    const points = assessed.reduce(
        (total, cell) => total + COLOR_WEIGHT[cell.color as Exclude<ImpactColor, "grey">],
        0
    );
    return {
        robustness: Math.round((points / assessed.length) * 100),
        assessed: assessed.length,
        red: assessed.filter((cell) => cell.color === "red").length,
        orange: assessed.filter((cell) => cell.color === "orange").length,
        green: assessed.filter((cell) => cell.color === "green").length,
    };
}

export function describedComponentIds(businessModel: BusinessModelDescription) {
    return businessModelComponents
        .filter((component) => (businessModel[component.id] || "").trim().length > 0)
        .map((component) => component.id);
}

function componentNameIn(content: BusinessModelContent, componentId: string) {
    return content.components.find((item) => item.id === componentId)?.name ?? componentId;
}

function cellAt(cells: HeatMapCell[], componentId: string, factorId: string, outcomeId: "a" | "b") {
    return cells.find(
        (cell) =>
            cell.componentId === componentId &&
            cell.factorId === factorId &&
            cell.outcomeId === outcomeId
    );
}

/** Step 5b — double red, double green, inconsistencies, and outcomes worth enacting. */
function findPatterns(
    cells: HeatMapCell[],
    factors: StressFactor[],
    componentIds: string[],
    outcomeSubViews: OutcomeSubView[],
    content: BusinessModelContent
): HeatMapPattern[] {
    const patterns: HeatMapPattern[] = [];
    const logic = content.logic;
    const componentName = (id: string) => componentNameIn(content, id);

    for (const factor of factors) {
        for (const componentId of componentIds) {
            const first = cellAt(cells, componentId, factor.id, "a");
            const second = cellAt(cells, componentId, factor.id, "b");
            if (!first || !second) continue;

            if (first.color === "red" && second.color === "red") {
                patterns.push({
                    type: "double-red",
                    severity: "critical",
                    subject: componentName(componentId),
                    title: logic.doubleRedTitle(componentName(componentId), factor.name),
                    detail: logic.doubleRedDetail(componentName(componentId), first.reasoning),
                });
            } else if (first.color === "green" && second.color === "green") {
                patterns.push({
                    type: "double-green",
                    severity: "positive",
                    subject: componentName(componentId),
                    title: logic.doubleGreenTitle(componentName(componentId), factor.name),
                    detail: logic.doubleGreenDetail(first.reasoning),
                });
            }
        }

        // Inconsistency: one outcome favours some components while the other favours others,
        // so no single future leaves the whole model intact.
        const favouredByFirst = componentIds.filter((componentId) => {
            const first = cellAt(cells, componentId, factor.id, "a");
            const second = cellAt(cells, componentId, factor.id, "b");
            return first?.color === "green" && (second?.color === "red" || second?.color === "orange");
        });
        const favouredBySecond = componentIds.filter((componentId) => {
            const first = cellAt(cells, componentId, factor.id, "a");
            const second = cellAt(cells, componentId, factor.id, "b");
            return second?.color === "green" && (first?.color === "red" || first?.color === "orange");
        });
        if (favouredByFirst.length && favouredBySecond.length) {
            patterns.push({
                type: "inconsistency",
                severity: "warning",
                title: logic.inconsistencyTitle(factor.name),
                detail: logic.inconsistencyDetail(
                    favouredByFirst.map(componentName),
                    factor.outcomes[0].label,
                    favouredBySecond.map(componentName),
                    factor.outcomes[1].label
                ),
            });
        }
    }

    // Preferred outcomes: a clear favourite is worth preparing for — or lobbying for,
    // since the paper notes businesses often enact their environment rather than only absorb it.
    // Only the strongest dependencies are reported: a mild lean on every factor is noise,
    // because almost every model prefers one side of almost every uncertainty.
    const preferred = factors
        .map((factor) => {
            const views = outcomeSubViews.filter((view) => view.factorId === factor.id);
            if (views.length !== 2) return null;
            const [first, second] = views;
            if (first.assessed < 2 || second.assessed < 2) return null;
            const gap = Math.abs(first.robustness - second.robustness);
            const better = first.robustness > second.robustness ? first : second;
            const worse = first.robustness > second.robustness ? second : first;
            if (gap < 34 && !worse.red) return null;
            return { gap, better, worse };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 3);

    for (const { gap, better, worse } of preferred) {
        patterns.push({
            type: "preferred-outcome",
            severity: "warning",
            title: logic.preferredTitle(better.outcomeLabel),
            detail: logic.preferredDetail(
                better.outcomeLabel,
                better.robustness,
                worse.outcomeLabel,
                worse.robustness,
                gap
            ),
        });
    }

    const order: Record<PatternType, number> = {
        "double-red": 0,
        inconsistency: 1,
        "preferred-outcome": 2,
        "double-green": 3,
    };
    return patterns.sort((a, b) => order[a.type] - order[b.type]);
}

/** Step 6 fallback — used only when AI-written recommendations are unavailable. */
function fallbackActions(
    patterns: HeatMapPattern[],
    componentSubViews: ComponentSubView[],
    logic: BmLogicStrings
): StressTestAction[] {
    const actions: StressTestAction[] = [];

    for (const pattern of patterns.filter((item) => item.type === "double-red").slice(0, 3)) {
        actions.push({
            title: logic.actionRedesignTitle(pattern.subject ?? pattern.title),
            detail: logic.actionRedesignDetail(pattern.detail),
        });
    }

    for (const view of componentSubViews
        .filter((item) => item.assessed > 0 && item.robustness < 50)
        .slice(0, 3)) {
        if (actions.some((action) => action.title.includes(view.name))) continue;
        actions.push({
            title: logic.actionStrengthenTitle(view.name),
            detail: logic.actionStrengthenDetail(
                view.name,
                view.robustness,
                view.red,
                view.orange
            ),
        });
    }

    for (const pattern of patterns.filter((item) => item.type === "inconsistency").slice(0, 2)) {
        actions.push({
            title: logic.actionInconsistencyTitle,
            detail: pattern.detail,
        });
    }

    if (!actions.length) {
        actions.push({
            title: logic.actionWidenTitle,
            detail: logic.actionWidenDetail,
        });
    }

    return actions.slice(0, 6);
}

type GradeKey = "robust" | "resilient" | "exposed" | "fragile" | "critical";

function gradeFor(index: number, doubleReds: number): GradeKey {
    const base: GradeKey =
        index >= 80
            ? "robust"
            : index >= 65
              ? "resilient"
              : index >= 50
                ? "exposed"
                : index >= 35
                  ? "fragile"
                  : "critical";
    // A component that fails under both outcomes of a factor cannot be called robust,
    // however well the rest of the matrix scores.
    if (doubleReds > 0 && (base === "robust" || base === "resilient")) return "exposed";
    return base;
}

function gradeLabel(grade: GradeKey, logic: BmLogicStrings) {
    switch (grade) {
        case "robust":
            return logic.gradeRobust;
        case "resilient":
            return logic.gradeResilient;
        case "exposed":
            return logic.gradeExposed;
        case "fragile":
            return logic.gradeFragile;
        default:
            return logic.gradeCritical;
    }
}

function verdictFor(grade: GradeKey, doubleReds: number, logic: BmLogicStrings) {
    if (doubleReds > 0) return logic.verdictDoubleReds(doubleReds);
    switch (grade) {
        case "robust":
            return logic.verdictRobust;
        case "resilient":
            return logic.verdictResilient;
        case "exposed":
            return logic.verdictExposed;
        case "fragile":
            return logic.verdictFragile;
        default:
            return logic.verdictCritical;
    }
}

export function analyzeHeatMap(
    cells: HeatMapCell[],
    factors: StressFactor[],
    businessModel: BusinessModelDescription,
    aiActions: StressTestAction[] = [],
    locale: BmLocale = "en"
): StressTestResult {
    const content = getBusinessModelContent(locale);
    const logic = content.logic;
    const componentIds = describedComponentIds(businessModel);

    const componentSubViews: ComponentSubView[] = componentIds.map((componentId) => {
        const stats = indexOf(cells.filter((cell) => cell.componentId === componentId));
        return { componentId, name: componentNameIn(content, componentId), ...stats };
    });

    const outcomeSubViews: OutcomeSubView[] = factors.flatMap((factor) =>
        factor.outcomes.map((outcome) => {
            const stats = indexOf(
                cells.filter((cell) => cell.factorId === factor.id && cell.outcomeId === outcome.id)
            );
            return {
                factorId: factor.id,
                outcomeId: outcome.id,
                factorName: factor.name,
                outcomeLabel: outcome.label,
                ...stats,
            };
        })
    );

    const patterns = findPatterns(cells, factors, componentIds, outcomeSubViews, content);
    const doubleReds = patterns.filter((pattern) => pattern.type === "double-red").length;

    const overall = indexOf(cells);
    const grade = gradeFor(overall.robustness, doubleReds);

    return {
        robustnessIndex: overall.robustness,
        grade: gradeLabel(grade, logic),
        verdict: verdictFor(grade, doubleReds, logic),
        assessedCells: overall.assessed,
        totalCells: componentIds.length * factors.length * 2,
        counts: {
            red: overall.red,
            orange: overall.orange,
            green: overall.green,
            grey: cells.filter((cell) => cell.color === "grey").length,
        },
        componentSubViews,
        outcomeSubViews,
        patterns,
        actions: aiActions.length ? aiActions : fallbackActions(patterns, componentSubViews, logic),
    };
}
