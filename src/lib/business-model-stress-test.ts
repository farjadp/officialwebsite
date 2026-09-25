// ============================================================================
// Business Model Stress Test — server-side engine
// Implements steps 3, 4 and 6 of Haaker, Bouwman, Janssen & De Reuver (2017),
// "Business model stress testing", Futures 89, 14-25, with an LLM standing in for
// the facilitated workshop session the paper describes. Steps 5a and 5b (sub-views
// and pattern analysis) are computed deterministically in the data layer.
// ============================================================================

import OpenAI from "openai";
import { z } from "zod";
import {
    BmLocale,
    MAX_STRESS_FACTORS,
    MIN_DESCRIBED_COMPONENTS,
    MIN_STRESS_FACTORS,
    StressFactor,
    businessModelComponents,
} from "@/data/business-model-stress-test/config";
import {
    BusinessModelDescription,
    HeatMapCell,
    ImpactColor,
    StressTestAction,
    StressTestReport,
    StressTestResult,
    analyzeHeatMap,
    describedComponentIds,
    getBusinessModelContent,
} from "@/data/business-model-stress-test/logic";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" });

const MODEL = "gpt-4o";
const MAX_COMPONENT_CHARS = 700;

export type { StressTestReport };

// ─── Input validation ────────────────────────────────────────────────────────

const outcomeSchema = z.object({
    id: z.enum(["a", "b"]),
    label: z.string().trim().min(2).max(120),
    description: z.string().trim().max(400).default(""),
});

const factorSchema = z.object({
    id: z.string().trim().min(1).max(60),
    perspective: z.enum([
        "Political",
        "Economic",
        "Social",
        "Technological",
        "Legal",
        "Environmental",
    ]),
    name: z.string().trim().min(3).max(120),
    description: z.string().trim().max(400).default(""),
    outcomes: z.tuple([outcomeSchema, outcomeSchema]),
    custom: z.boolean().optional(),
});

export const stressTestRequestSchema = z.object({
    businessModel: z.record(z.string(), z.string().trim().max(MAX_COMPONENT_CHARS)),
    factors: z.array(factorSchema).min(MIN_STRESS_FACTORS).max(MAX_STRESS_FACTORS),
    locale: z.enum(["en", "fa"]).default("en"),
});

export type StressTestRequest = z.infer<typeof stressTestRequestSchema>;

/**
 * Library factors are re-read from the server-side definition so a tampered client
 * cannot rewrite what an outcome means; only custom factors are taken from the request.
 */
function resolveFactors(
    requested: StressTestRequest["factors"],
    locale: BmLocale
): StressFactor[] {
    const library = getBusinessModelContent(locale).factors;
    const seen = new Set<string>();
    const resolved: StressFactor[] = [];
    for (const factor of requested) {
        if (seen.has(factor.id)) continue;
        seen.add(factor.id);
        const known = library.find((item) => item.id === factor.id);
        resolved.push(known ?? { ...factor, custom: true });
    }
    if (resolved.length < MIN_STRESS_FACTORS)
        throw new Error(
            getBusinessModelContent(locale).logic.errorTooFewFactors(MIN_STRESS_FACTORS)
        );
    return resolved;
}

function sanitizeBusinessModel(
    input: Record<string, string>,
    locale: BmLocale
): BusinessModelDescription {
    const content = getBusinessModelContent(locale);
    const model: BusinessModelDescription = {};
    for (const component of businessModelComponents) {
        const value = (input[component.id] || "").trim().slice(0, MAX_COMPONENT_CHARS);
        if (value) model[component.id] = value;
    }
    const missingRequired = content.components.filter(
        (component) => component.required && !model[component.id]
    );
    if (missingRequired.length)
        throw new Error(
            content.logic.errorMissingRequired(missingRequired.map((item) => item.name))
        );
    if (Object.keys(model).length < MIN_DESCRIBED_COMPONENTS)
        throw new Error(content.logic.errorTooThin(MIN_DESCRIBED_COMPONENTS));
    return model;
}

// ─── Step 3 + 4: mapping and heat map ────────────────────────────────────────

const HEATMAP_SYSTEM = `You are facilitating a business model stress test, following the method of Haaker, Bouwman, Janssen and De Reuver (2017), "Business model stress testing", Futures 89, 14-25.

You receive a business model described in Business Model Canvas components, and a set of stress factors. Each stress factor has two extreme outcomes.

Your job has two parts, in order:

STEP 3 — MAPPING. For each outcome, walk through every business model component and decide which ones are CAUSALLY affected by it. Include a component whenever you can name the causal link, even when the link runs through another component — a revenue mechanism that disappears also reaches the partners who paid it and the cost base it funded. Leave a component out only when the outcome genuinely changes nothing about it. Most outcomes touch 2 to 5 components; listing every component for every outcome means you have stopped discriminating.

STEP 4 — COLOURING. For every component you listed, assign exactly one colour, using these definitions verbatim from the method:
- "red": the outcome makes this component NO LONGER FEASIBLE. It cannot be implemented or operated at all — a potential showstopper for the business model.
- "orange": the outcome makes this component NO LONGER VIABLE. It can still be implemented, but the choices behind it no longer pay off and must be revisited.
- "green": the outcome affects this component but NOT negatively. It may even strengthen it.
Components you do not list are treated as grey (no impact), so leaving something out is a real judgement, not a shortcut.

For every coloured component, give the reasoning — the specific mechanism by which this outcome hits this component in THIS business. The method insists the reasoning is recorded, because it is the input to the recommendations.

RULES:
- Judge the business model as actually described, not an idealised version. Quote its own specifics (its revenue mechanism, its channel, its dependency) in the reasoning.
- Do not soften. A revenue stream that becomes illegal is red, not orange. Being uncomfortable is not the same as being unfeasible.
- Do not invent facts about the business that are not in the description.
- Reasoning: one or two sentences, under 220 characters, plain and concrete. No hype, no jargon, no invented numbers.
- Every componentId and factorId you output must be one that was given to you.

Respond with ONLY valid JSON in this shape:
{
  "assessments": [
    {
      "factorId": "string",
      "outcomes": [
        {
          "outcomeId": "a",
          "impacts": [
            { "componentId": "string", "color": "red" | "orange" | "green", "reasoning": "string" }
          ]
        },
        { "outcomeId": "b", "impacts": [] }
      ]
    }
  ]
}`;

const heatMapResponseSchema = z.object({
    assessments: z
        .array(
            z.object({
                factorId: z.string(),
                outcomes: z
                    .array(
                        z.object({
                            outcomeId: z.enum(["a", "b"]),
                            impacts: z
                                .array(
                                    z.object({
                                        componentId: z.string(),
                                        color: z.enum(["red", "orange", "green"]),
                                        reasoning: z.string().trim().default(""),
                                    })
                                )
                                .default([]),
                        })
                    )
                    .default([]),
            })
        )
        .default([]),
});

function describeInput(
    businessModel: BusinessModelDescription,
    factors: StressFactor[],
    locale: BmLocale = "en"
) {
    const content = getBusinessModelContent(locale);
    const componentIds = describedComponentIds(businessModel);
    const modelText = componentIds
        .map((id) => {
            const component = content.components.find((item) => item.id === id)!;
            return `- ${component.id} (${component.name}): ${businessModel[id]}`;
        })
        .join("\n");
    const factorText = factors
        .map(
            (factor) =>
                `- ${factor.id} (${factor.perspective} — ${factor.name}): ${factor.description}\n    outcome a — "${factor.outcomes[0].label}": ${factor.outcomes[0].description}\n    outcome b — "${factor.outcomes[1].label}": ${factor.outcomes[1].description}`
        )
        .join("\n");
    return { componentIds, modelText, factorText };
}

/** The reasoning is shown verbatim to the visitor, so it must be in their language. */
const LANGUAGE_RULE: Record<BmLocale, string> = {
    en: "Write every string you output in English.",
    fa: "Write every string you output in formal but human Persian (Farsi). Use «گیومه» for quotes, Persian digits, and correct نیم‌فاصله. Do not use English words where a common Persian term exists, and never mix English sentences into the Persian text.",
};

async function buildHeatMap(
    businessModel: BusinessModelDescription,
    factors: StressFactor[],
    locale: BmLocale
): Promise<HeatMapCell[]> {
    const content = getBusinessModelContent(locale);
    const { componentIds, modelText, factorText } = describeInput(businessModel, factors, locale);

    const completion = await openai.chat.completions.create({
        model: MODEL,
        temperature: 0.3,
        messages: [
            { role: "system", content: `${HEATMAP_SYSTEM}\n\nLANGUAGE: ${LANGUAGE_RULE[locale]}` },
            {
                role: "user",
                content: `BUSINESS MODEL COMPONENTS (these componentIds are the only ones you may use):\n${modelText}\n\nSTRESS FACTORS (these factorIds are the only ones you may use):\n${factorText}\n\nMap and colour every stress factor outcome against this business model.`,
            },
        ],
        response_format: { type: "json_object" },
    });

    const parsed = heatMapResponseSchema.safeParse(
        JSON.parse(completion.choices[0]?.message?.content || "{}")
    );
    if (!parsed.success) throw new Error(content.logic.errorGeneric);

    // Start from a fully grey grid: anything the model did not causally relate stays grey.
    const cells: HeatMapCell[] = [];
    const colored = new Map<string, { color: ImpactColor; reasoning: string }>();
    for (const assessment of parsed.data.assessments) {
        if (!factors.some((factor) => factor.id === assessment.factorId)) continue;
        for (const outcome of assessment.outcomes) {
            for (const impact of outcome.impacts) {
                if (!componentIds.includes(impact.componentId)) continue;
                colored.set(`${impact.componentId}|${assessment.factorId}|${outcome.outcomeId}`, {
                    color: impact.color,
                    reasoning: impact.reasoning.slice(0, 400),
                });
            }
        }
    }

    for (const componentId of componentIds) {
        for (const factor of factors) {
            for (const outcome of factor.outcomes) {
                const hit = colored.get(`${componentId}|${factor.id}|${outcome.id}`);
                cells.push({
                    componentId,
                    factorId: factor.id,
                    outcomeId: outcome.id,
                    color: hit?.color ?? "grey",
                    reasoning: hit?.reasoning || content.logic.greyReasoning,
                });
            }
        }
    }

    if (!cells.some((cell) => cell.color !== "grey"))
        throw new Error(content.logic.errorNoCausalLink);

    return cells;
}

// ─── Step 6: improvements and actions ────────────────────────────────────────

const ACTIONS_SYSTEM = `You are writing step 6 of a business model stress test (Haaker et al., 2017): "formulate improvements and actions".

You receive the completed heat map analysis: which components broke, under which future outcomes, and why. Turn it into concrete actions the owner of this business model can start this quarter.

RULES:
- Ground every action in the specific evidence given to you. Refer to the actual component and the actual outcome that caused the problem.
- Prioritise: double-red findings first (the component fails whichever way the uncertainty resolves — that is a redesign, not a risk to monitor), then internal inconsistencies, then the weakest components.
- Say what to change, not what to "consider" or "leverage". Each action should be something a person can start on Monday.
- No hype, no consultant vocabulary, no invented numbers or deadlines.
- 4 to 6 actions. Title under 70 characters. Detail 2 to 3 sentences.

Respond with ONLY valid JSON:
{ "actions": [ { "title": "string", "detail": "string" } ] }`;

const actionsResponseSchema = z.object({
    actions: z
        .array(z.object({ title: z.string().trim().min(3), detail: z.string().trim().min(10) }))
        .default([]),
});

function summarizeForActions(result: StressTestResult, cells: HeatMapCell[], factors: StressFactor[]) {
    const factorName = (id: string) => factors.find((factor) => factor.id === id)?.name ?? id;
    const outcomeLabel = (id: string, outcomeId: "a" | "b") =>
        factors.find((factor) => factor.id === id)?.outcomes.find((item) => item.id === outcomeId)
            ?.label ?? outcomeId;

    const problems = cells
        .filter((cell) => cell.color === "red" || cell.color === "orange")
        .map(
            (cell) =>
                `- [${cell.color.toUpperCase()}] ${
                    result.componentSubViews.find((view) => view.componentId === cell.componentId)?.name ??
                    cell.componentId
                } under "${factorName(cell.factorId)} → ${outcomeLabel(cell.factorId, cell.outcomeId)}": ${cell.reasoning}`
        )
        .join("\n");

    const patterns = result.patterns
        .map((pattern) => `- [${pattern.type}] ${pattern.title} — ${pattern.detail}`)
        .join("\n");

    const components = result.componentSubViews
        .map(
            (view) =>
                `- ${view.name}: robustness ${view.robustness}/100 (${view.red} red, ${view.orange} orange, ${view.green} green)`
        )
        .join("\n");

    return `OVERALL: robustness index ${result.robustnessIndex}/100, grade "${result.grade}".\n\nCOMPONENT SUB-VIEWS:\n${components}\n\nPATTERNS DETECTED:\n${patterns || "- none"}\n\nPROBLEM CELLS AND REASONING:\n${problems || "- none"}`;
}

async function buildActions(
    businessModel: BusinessModelDescription,
    factors: StressFactor[],
    cells: HeatMapCell[],
    result: StressTestResult,
    locale: BmLocale
): Promise<StressTestAction[]> {
    const { modelText } = describeInput(businessModel, factors, locale);
    const completion = await openai.chat.completions.create({
        model: MODEL,
        temperature: 0.5,
        messages: [
            { role: "system", content: `${ACTIONS_SYSTEM}\n\nLANGUAGE: ${LANGUAGE_RULE[locale]}` },
            {
                role: "user",
                content: `BUSINESS MODEL:\n${modelText}\n\nSTRESS TEST RESULT:\n${summarizeForActions(result, cells, factors)}`,
            },
        ],
        response_format: { type: "json_object" },
    });

    const parsed = actionsResponseSchema.safeParse(
        JSON.parse(completion.choices[0]?.message?.content || "{}")
    );
    if (!parsed.success) return [];
    return parsed.data.actions.slice(0, 6).map((action) => ({
        title: action.title.slice(0, 120),
        detail: action.detail.slice(0, 600),
    }));
}

// ─── Orchestration ───────────────────────────────────────────────────────────

export async function runStressTest(request: StressTestRequest): Promise<StressTestReport> {
    const locale = request.locale ?? "en";
    const businessModel = sanitizeBusinessModel(request.businessModel, locale);
    const factors = resolveFactors(request.factors, locale);

    const cells = await buildHeatMap(businessModel, factors, locale);
    const draft = analyzeHeatMap(cells, factors, businessModel, [], locale);

    // Step 6 is written from the completed analysis. If it fails, the deterministic
    // recommendations already in `draft` stand in rather than failing the whole run.
    let actions: StressTestAction[] = [];
    try {
        actions = await buildActions(businessModel, factors, cells, draft, locale);
    } catch (error) {
        console.error("[BM Stress Test] action generation failed", error);
    }

    return {
        generatedAt: new Date().toISOString(),
        factors,
        businessModel,
        cells,
        result: actions.length
            ? analyzeHeatMap(cells, factors, businessModel, actions, locale)
            : draft,
    };
}
