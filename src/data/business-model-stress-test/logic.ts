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

import { businessModelComponents, StressFactor } from "./config";

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

function componentName(componentId: string) {
    return businessModelComponents.find((item) => item.id === componentId)?.name ?? componentId;
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
    outcomeSubViews: OutcomeSubView[]
): HeatMapPattern[] {
    const patterns: HeatMapPattern[] = [];

    for (const factor of factors) {
        for (const componentId of componentIds) {
            const first = cellAt(cells, componentId, factor.id, "a");
            const second = cellAt(cells, componentId, factor.id, "b");
            if (!first || !second) continue;

            if (first.color === "red" && second.color === "red") {
                patterns.push({
                    type: "double-red",
                    severity: "critical",
                    title: `${componentName(componentId)} fails under both outcomes of "${factor.name}"`,
                    detail: `Whichever way this uncertainty resolves, ${componentName(
                        componentId
                    ).toLowerCase()} stops being feasible. This is not a risk to monitor — it is a redesign you already owe yourself. ${first.reasoning}`,
                });
            } else if (first.color === "green" && second.color === "green") {
                patterns.push({
                    type: "double-green",
                    severity: "positive",
                    title: `${componentName(componentId)} holds under both outcomes of "${factor.name}"`,
                    detail: `This part of the model is robust to this uncertainty either way, so it is a safe anchor to build the redesign around. ${first.reasoning}`,
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
                title: `"${factor.name}" pulls your model in two directions`,
                detail: `${favouredByFirst
                    .map(componentName)
                    .join(", ")} need "${factor.outcomes[0].label}", while ${favouredBySecond
                    .map(componentName)
                    .join(", ")} need "${
                    factor.outcomes[1].label
                }". No future outcome leaves the model whole, which points to an internal inconsistency between these choices rather than to bad luck.`,
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
            title: `Your model is betting on "${better.outcomeLabel}"`,
            detail: `Across the components it touches, "${better.outcomeLabel}" scores ${better.robustness}/100 while "${worse.outcomeLabel}" scores ${worse.robustness}/100. That is a ${gap}-point dependency on one future. Either build a hedge for the unfavourable outcome, or act deliberately to make the favourable one more likely.`,
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
    componentSubViews: ComponentSubView[]
): StressTestAction[] {
    const actions: StressTestAction[] = [];

    for (const pattern of patterns.filter((item) => item.type === "double-red").slice(0, 3)) {
        actions.push({
            title: `Redesign now: ${pattern.title.split(" fails under")[0]}`,
            detail: `${pattern.detail} Define at least two alternative designs for this component and test which one survives both outcomes.`,
        });
    }

    for (const view of componentSubViews
        .filter((item) => item.assessed > 0 && item.robustness < 50)
        .slice(0, 3)) {
        if (actions.some((action) => action.title.includes(view.name))) continue;
        actions.push({
            title: `Strengthen ${view.name.toLowerCase()}`,
            detail: `${view.name} scores ${view.robustness}/100 across the futures you tested (${view.red} showstoppers, ${view.orange} viability warnings). Work through the reasoning in those cells and decide what would have to be true for this component to survive.`,
        });
    }

    for (const pattern of patterns.filter((item) => item.type === "inconsistency").slice(0, 2)) {
        actions.push({
            title: "Resolve the internal inconsistency",
            detail: pattern.detail,
        });
    }

    if (!actions.length) {
        actions.push({
            title: "Widen the stress test",
            detail:
                "No component failed under the factors you selected. Either the model is genuinely robust, or the factors chosen were too close to your comfort zone. Re-run with the uncertainties you were most tempted to skip.",
        });
    }

    return actions.slice(0, 6);
}

function gradeFor(index: number, doubleReds: number) {
    const base =
        index >= 80
            ? "Robust"
            : index >= 65
              ? "Resilient"
              : index >= 50
                ? "Exposed"
                : index >= 35
                  ? "Fragile"
                  : "Critical";
    // A component that fails under both outcomes of a factor cannot be called robust,
    // however well the rest of the matrix scores.
    if (doubleReds > 0 && (base === "Robust" || base === "Resilient")) return "Exposed";
    return base;
}

function verdictFor(grade: string, doubleReds: number) {
    if (doubleReds > 0)
        return `${doubleReds} component${doubleReds > 1 ? "s" : ""} in your model fail${
            doubleReds > 1 ? "" : "s"
        } under both outcomes of a stress factor. That is a design problem, not a forecasting problem: no future scenario rescues it, so it has to be redesigned.`;
    switch (grade) {
        case "Robust":
            return "The model held up across the futures you tested. Keep the reasoning behind each green cell — those assumptions are what you are actually betting on.";
        case "Resilient":
            return "The model survives most of the tested futures with contained damage. The orange cells are where choices need revisiting before you scale.";
        case "Exposed":
            return "Meaningful parts of the model stop working in plausible futures. This is the stage to run design alternatives, not to commit capital.";
        case "Fragile":
            return "Most of the model depends on the environment staying roughly as it is today. Treat the red cells as the redesign backlog.";
        default:
            return "The model does not survive the futures you selected as plausible. Rework the weakest components before investing further in implementation.";
    }
}

export function analyzeHeatMap(
    cells: HeatMapCell[],
    factors: StressFactor[],
    businessModel: BusinessModelDescription,
    aiActions: StressTestAction[] = []
): StressTestResult {
    const componentIds = describedComponentIds(businessModel);

    const componentSubViews: ComponentSubView[] = componentIds.map((componentId) => {
        const stats = indexOf(cells.filter((cell) => cell.componentId === componentId));
        return { componentId, name: componentName(componentId), ...stats };
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

    const patterns = findPatterns(cells, factors, componentIds, outcomeSubViews);
    const doubleReds = patterns.filter((pattern) => pattern.type === "double-red").length;

    const overall = indexOf(cells);
    const grade = gradeFor(overall.robustness, doubleReds);

    return {
        robustnessIndex: overall.robustness,
        grade,
        verdict: verdictFor(grade, doubleReds),
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
        actions: aiActions.length ? aiActions : fallbackActions(patterns, componentSubViews),
    };
}
