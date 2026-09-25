// ============================================================================
// Business Model Stress Test — configuration
// Method: Haaker, T., Bouwman, H., Janssen, W., & De Reuver, M. (2017).
// "Business model stress testing: A practical approach to test the robustness
// of a business model." Futures, 89, 14-25. https://doi.org/10.1016/j.futures.2017.04.003
// Published under CC BY 4.0.
//
// Step 1 of the method describes the business model in a structured ontology.
// The paper is ontology-agnostic; we use the Business Model Canvas, as the paper does.
// Step 2 selects up to five trends/uncertainties ("stress factors"), each with two
// extreme outcomes, covering multiple PESTLE perspectives.
// ============================================================================

export type PestlePerspective =
    | "Political"
    | "Economic"
    | "Social"
    | "Technological"
    | "Legal"
    | "Environmental";

export interface BusinessModelComponent {
    id: string;
    name: string;
    question: string;
    placeholder: string;
    /** Required components: without these the business model is too thin to stress test. */
    required: boolean;
}

/** Step 1 — Business Model Canvas components, in canvas reading order. */
export const businessModelComponents: BusinessModelComponent[] = [
    {
        id: "customer-segments",
        name: "Customer segments",
        question: "Who exactly do you serve?",
        placeholder:
            "e.g. Dutch families with 1-5 insurance policies, mostly aged 35-55, who prefer advice over comparison sites.",
        required: true,
    },
    {
        id: "value-proposition",
        name: "Value proposition",
        question: "What value do you promise them?",
        placeholder:
            "e.g. Peace of mind: being properly insured and being cared for when a claim actually happens.",
        required: true,
    },
    {
        id: "channels",
        name: "Channels",
        question: "How do you reach and deliver to customers?",
        placeholder:
            "e.g. Face-to-face meetings at our office and at the customer's home, plus a portal and phone support.",
        required: true,
    },
    {
        id: "customer-relationships",
        name: "Customer relationships",
        question: "What kind of relationship do you maintain?",
        placeholder:
            "e.g. Long-term personal relationship with a named advisor; annual review call; proactive contact after life events.",
        required: false,
    },
    {
        id: "revenue-streams",
        name: "Revenue streams",
        question: "How do you actually get paid?",
        placeholder:
            "e.g. Commission paid by insurers per policy sold (85% of revenue), plus hourly consultancy fees for complex advice.",
        required: true,
    },
    {
        id: "key-resources",
        name: "Key resources",
        question: "What assets does the model depend on?",
        placeholder:
            "e.g. 12 licensed advisors, our CRM and policy database, 20 years of local reputation, insurer contracts.",
        required: false,
    },
    {
        id: "key-activities",
        name: "Key activities",
        question: "What do you have to do well, every day?",
        placeholder:
            "e.g. Advising customers, placing and administering policies, handling claims on the customer's behalf.",
        required: true,
    },
    {
        id: "key-partners",
        name: "Key partners",
        question: "Who do you depend on outside your own walls?",
        placeholder:
            "e.g. 14 insurance companies we are contracted with, a software vendor, an independent compliance auditor.",
        required: false,
    },
    {
        id: "cost-structure",
        name: "Cost structure",
        question: "Where does the money go?",
        placeholder:
            "e.g. Personnel 80% of total cost, IT and office ~12%, marketing ~8%. Costs are largely fixed.",
        required: false,
    },
];

/** A business model this thin cannot produce a meaningful heat map. */
export const MIN_DESCRIBED_COMPONENTS = 6;

/** The paper: "up to five trends and uncertainties keep the approach manageable." */
export const MIN_STRESS_FACTORS = 3;
export const MAX_STRESS_FACTORS = 5;

export interface StressFactorOutcome {
    id: "a" | "b";
    label: string;
    description: string;
}

export interface StressFactor {
    id: string;
    perspective: PestlePerspective;
    name: string;
    description: string;
    /** Two *extreme* outcomes, as scenario planning prescribes. */
    outcomes: [StressFactorOutcome, StressFactorOutcome];
    custom?: boolean;
}

/**
 * Step 2 — a curated long list of trends and uncertainties to select from.
 * Collecting factors from an independent list (rather than only brainstorming)
 * is the paper's recommended way to avoid the blind spots of familiarity bias.
 */
export const stressFactorLibrary: StressFactor[] = [
    {
        id: "ai-substitution",
        perspective: "Technological",
        name: "AI substitution of expert work",
        description:
            "How far machine systems take over the judgement work that people currently pay you for.",
        outcomes: [
            {
                id: "a",
                label: "AI assists practitioners",
                description:
                    "Models speed up experts but the human stays accountable and in the loop; buyers still pay for the human.",
            },
            {
                id: "b",
                label: "AI performs the work end to end",
                description:
                    "Buyers get an acceptable answer directly from a machine, without hiring a person at all.",
            },
        ],
    },
    {
        id: "platform-disintermediation",
        perspective: "Technological",
        name: "Platform disintermediation",
        description:
            "Whether you keep a direct relationship with the customer or a platform steps between you.",
        outcomes: [
            {
                id: "a",
                label: "You keep the direct relationship",
                description: "Customers find, choose, and re-buy from you directly.",
            },
            {
                id: "b",
                label: "Marketplaces own the customer",
                description:
                    "Discovery, comparison, and payment run through a platform that sets the rules and takes a cut.",
            },
        ],
    },
    {
        id: "diy-self-service",
        perspective: "Social",
        name: "Shift to DIY and self-service",
        description:
            "Whether buyers still want a guided, advised purchase or prefer to compare and configure it themselves.",
        outcomes: [
            {
                id: "a",
                label: "Buyers still want guidance",
                description:
                    "The advised, high-touch channel stays the default for this kind of decision.",
            },
            {
                id: "b",
                label: "Buyers self-serve",
                description:
                    "Customers research, compare, and buy on their own and treat advice as an avoidable cost.",
            },
        ],
    },
    {
        id: "data-privacy-regulation",
        perspective: "Legal",
        name: "Personal data regulation",
        description: "How much of your model depends on collecting and using customer data.",
        outcomes: [
            {
                id: "a",
                label: "Current consent rules hold",
                description: "Today's consent-based regime continues largely unchanged.",
            },
            {
                id: "b",
                label: "Strict purpose limits arrive",
                description:
                    "Tight purpose limitation, data minimisation, and localisation duties, with real enforcement.",
            },
        ],
    },
    {
        id: "fee-transparency",
        perspective: "Legal",
        name: "Fee and commission transparency",
        description:
            "Rules on how intermediated or referral-based revenue may be earned and disclosed.",
        outcomes: [
            {
                id: "a",
                label: "Disclosure only",
                description: "You must publish how you are paid, but the mechanism stays legal.",
            },
            {
                id: "b",
                label: "Commissions banned",
                description:
                    "Third-party commission or referral revenue is prohibited; the customer must pay you directly.",
            },
        ],
    },
    {
        id: "licensing-burden",
        perspective: "Legal",
        name: "Licensing and compliance burden",
        description: "What it costs, in time and money, to be allowed to operate at all.",
        outcomes: [
            {
                id: "a",
                label: "Light-touch self-certification",
                description: "You declare compliance; audits are rare and cheap.",
            },
            {
                id: "b",
                label: "Mandatory certification and audit",
                description:
                    "Formal accreditation, recurring external audits, and named accountable officers become table stakes.",
            },
        ],
    },
    {
        id: "capital-cost",
        perspective: "Economic",
        name: "Cost and availability of capital",
        description: "Whether growth can be financed or has to be self-funded from cash flow.",
        outcomes: [
            {
                id: "a",
                label: "Capital stays available",
                description: "Funding and credit remain accessible on today's terms.",
            },
            {
                id: "b",
                label: "Capital is scarce and expensive",
                description:
                    "Investors and lenders retreat; only models that fund themselves from margin survive.",
            },
        ],
    },
    {
        id: "budget-pressure",
        perspective: "Economic",
        name: "Customer budget pressure",
        description: "Whether customers buy on value or are pushed into price-led procurement.",
        outcomes: [
            {
                id: "a",
                label: "Value-based buying holds",
                description: "Budgets are stable and buyers pay for outcomes and trust.",
            },
            {
                id: "b",
                label: "Procurement compresses price",
                description:
                    "Budgets are cut, purchasing is centralised, and every line item is benchmarked on price.",
            },
        ],
    },
    {
        id: "acquisition-cost",
        perspective: "Economic",
        name: "Cost of acquiring customers",
        description: "What it costs to put your offer in front of the right buyer.",
        outcomes: [
            {
                id: "a",
                label: "Acquisition cost stays stable",
                description: "Current channels keep working at roughly today's cost per customer.",
            },
            {
                id: "b",
                label: "Channels close or double in price",
                description:
                    "Paid reach becomes unaffordable, or answer engines absorb the traffic before it reaches you.",
            },
        ],
    },
    {
        id: "talent-access",
        perspective: "Economic",
        name: "Access to skilled people",
        description: "Whether the people your model needs are available at the cost you assumed.",
        outcomes: [
            {
                id: "a",
                label: "Talent available at planned cost",
                description: "You can hire and keep the skills the model depends on.",
            },
            {
                id: "b",
                label: "Key skills scarce and expensive",
                description:
                    "Salaries rise sharply, hiring takes months, and key-person dependency becomes acute.",
            },
        ],
    },
    {
        id: "trust-proof",
        perspective: "Social",
        name: "What buyers accept as proof",
        description:
            "Whether reputation still sells, or buyers demand independently verifiable evidence.",
        outcomes: [
            {
                id: "a",
                label: "Reputation carries weight",
                description: "Referrals, brand, and personal authority remain sufficient proof.",
            },
            {
                id: "b",
                label: "Verifiable proof required",
                description:
                    "AI-generated claims flood the market; buyers only trust audited results, references, and hard data.",
            },
        ],
    },
    {
        id: "delivery-mode",
        perspective: "Social",
        name: "Expected mode of delivery",
        description:
            "Whether customers expect presence and synchronous contact, or fully remote and asynchronous service.",
        outcomes: [
            {
                id: "a",
                label: "In-person and hybrid persist",
                description: "Being physically present remains part of the perceived value.",
            },
            {
                id: "b",
                label: "Remote and asynchronous by default",
                description:
                    "Customers expect 24/7 self-service and treat scheduled meetings as friction.",
            },
        ],
    },
    {
        id: "public-funding",
        perspective: "Political",
        name: "Public funding and incentive policy",
        description:
            "Whether grants, subsidies, or public programmes support the demand you rely on.",
        outcomes: [
            {
                id: "a",
                label: "Programmes continue",
                description: "Current subsidies, grants, and incentives stay in place.",
            },
            {
                id: "b",
                label: "Support is withdrawn",
                description:
                    "Eligibility narrows or funding stops; customers must pay from their own budget.",
            },
        ],
    },
    {
        id: "cross-border",
        perspective: "Political",
        name: "Cross-border trade and mobility",
        description:
            "Whether you can serve, staff, and invoice across borders as freely as you do today.",
        outcomes: [
            {
                id: "a",
                label: "Borders stay open",
                description: "Cross-border work, hiring, and data transfer continue as now.",
            },
            {
                id: "b",
                label: "Restrictions tighten",
                description:
                    "Visa, tax, data-residency, or sanctions rules cut off part of your market or workforce.",
            },
        ],
    },
    {
        id: "sustainability-duty",
        perspective: "Environmental",
        name: "Sustainability reporting duties",
        description:
            "Whether environmental impact stays a marketing matter or becomes a reporting obligation.",
        outcomes: [
            {
                id: "a",
                label: "Voluntary reporting",
                description: "Disclosure is optional and mostly used for positioning.",
            },
            {
                id: "b",
                label: "Mandatory chain-wide disclosure",
                description:
                    "You and your suppliers must measure and report footprint to keep enterprise customers.",
            },
        ],
    },
    {
        id: "input-costs",
        perspective: "Environmental",
        name: "Energy and input costs",
        description:
            "Whether the physical or compute inputs behind your offering stay affordable.",
        outcomes: [
            {
                id: "a",
                label: "Input costs stable",
                description: "Energy, compute, materials, and logistics stay near today's prices.",
            },
            {
                id: "b",
                label: "Costs spike and stay volatile",
                description:
                    "Input prices rise sharply and unpredictably, and cannot be fully passed on to customers.",
            },
        ],
    },
];

export const pestleOrder: PestlePerspective[] = [
    "Political",
    "Economic",
    "Social",
    "Technological",
    "Legal",
    "Environmental",
];

export const METHOD_CITATION =
    "Haaker, T., Bouwman, H., Janssen, W., & De Reuver, M. (2017). Business model stress testing: A practical approach to test the robustness of a business model. Futures, 89, 14-25.";

export const METHOD_URL = "https://doi.org/10.1016/j.futures.2017.04.003";

// ============================================================================
// Locale plumbing. Persian content lives in config.fa.ts with the same ids,
// the same order and the same limits; only the strings differ.
// ============================================================================

export type BmLocale = "en" | "fa";

/** Strings the scoring/pattern logic returns, per locale. Scoring itself never varies. */
export interface BmLogicStrings {
    gradeRobust: string;
    gradeResilient: string;
    gradeExposed: string;
    gradeFragile: string;
    gradeCritical: string;

    verdictDoubleReds: (count: number) => string;
    verdictRobust: string;
    verdictResilient: string;
    verdictExposed: string;
    verdictFragile: string;
    verdictCritical: string;

    doubleRedTitle: (component: string, factor: string) => string;
    doubleRedDetail: (component: string, reasoning: string) => string;
    doubleGreenTitle: (component: string, factor: string) => string;
    doubleGreenDetail: (reasoning: string) => string;
    inconsistencyTitle: (factor: string) => string;
    inconsistencyDetail: (
        favouredByFirst: string[],
        firstLabel: string,
        favouredBySecond: string[],
        secondLabel: string
    ) => string;
    preferredTitle: (betterLabel: string) => string;
    preferredDetail: (
        betterLabel: string,
        betterScore: number,
        worseLabel: string,
        worseScore: number,
        gap: number
    ) => string;

    actionRedesignTitle: (component: string) => string;
    actionRedesignDetail: (patternDetail: string) => string;
    actionStrengthenTitle: (component: string) => string;
    actionStrengthenDetail: (
        component: string,
        robustness: number,
        red: number,
        orange: number
    ) => string;
    actionInconsistencyTitle: string;
    actionWidenTitle: string;
    actionWidenDetail: string;

    /** Server-side strings: the grey-cell placeholder and the input errors. */
    greyReasoning: string;
    errorMissingRequired: (components: string[]) => string;
    errorTooThin: (min: number) => string;
    errorTooFewFactors: (min: number) => string;
    errorNoCausalLink: string;
    errorGeneric: string;
    errorRateLimited: string;
    errorIncomplete: (min: number, max: number) => string;
}

export interface BusinessModelContent {
    components: BusinessModelComponent[];
    factors: StressFactor[];
    perspectiveLabels: Record<PestlePerspective, string>;
    logic: BmLogicStrings;
}

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);

export const businessModelLogicEn: BmLogicStrings = {
    gradeRobust: "Robust",
    gradeResilient: "Resilient",
    gradeExposed: "Exposed",
    gradeFragile: "Fragile",
    gradeCritical: "Critical",

    verdictDoubleReds: (count) =>
        `${count} ${plural(count, "component", "components")} in your model ${plural(
            count,
            "fails",
            "fail"
        )} under both outcomes of a stress factor. That is a design problem, not a forecasting problem: no future scenario rescues it, so it has to be redesigned.`,
    verdictRobust:
        "The model held up across the futures you tested. Keep the reasoning behind each green cell — those assumptions are what you are actually betting on.",
    verdictResilient:
        "The model survives most of the tested futures with contained damage. The orange cells are where choices need revisiting before you scale.",
    verdictExposed:
        "Meaningful parts of the model stop working in plausible futures. This is the stage to run design alternatives, not to commit capital.",
    verdictFragile:
        "Most of the model depends on the environment staying roughly as it is today. Treat the red cells as the redesign backlog.",
    verdictCritical:
        "The model does not survive the futures you selected as plausible. Rework the weakest components before investing further in implementation.",

    doubleRedTitle: (component, factor) => `${component} fails under both outcomes of "${factor}"`,
    doubleRedDetail: (component, reasoning) =>
        `Whichever way this uncertainty resolves, ${component.toLowerCase()} stops being feasible. This is not a risk to monitor — it is a redesign you already owe yourself. ${reasoning}`,
    doubleGreenTitle: (component, factor) => `${component} holds under both outcomes of "${factor}"`,
    doubleGreenDetail: (reasoning) =>
        `This part of the model is robust to this uncertainty either way, so it is a safe anchor to build the redesign around. ${reasoning}`,
    inconsistencyTitle: (factor) => `"${factor}" pulls your model in two directions`,
    inconsistencyDetail: (favouredByFirst, firstLabel, favouredBySecond, secondLabel) =>
        `${favouredByFirst.join(", ")} need "${firstLabel}", while ${favouredBySecond.join(
            ", "
        )} need "${secondLabel}". No future outcome leaves the model whole, which points to an internal inconsistency between these choices rather than to bad luck.`,
    preferredTitle: (betterLabel) => `Your model is betting on "${betterLabel}"`,
    preferredDetail: (betterLabel, betterScore, worseLabel, worseScore, gap) =>
        `Across the components it touches, "${betterLabel}" scores ${betterScore}/100 while "${worseLabel}" scores ${worseScore}/100. That is a ${gap}-point dependency on one future. Either build a hedge for the unfavourable outcome, or act deliberately to make the favourable one more likely.`,

    actionRedesignTitle: (component) => `Redesign now: ${component}`,
    actionRedesignDetail: (patternDetail) =>
        `${patternDetail} Define at least two alternative designs for this component and test which one survives both outcomes.`,
    actionStrengthenTitle: (component) => `Strengthen ${component.toLowerCase()}`,
    actionStrengthenDetail: (component, robustness, red, orange) =>
        `${component} scores ${robustness}/100 across the futures you tested (${red} showstoppers, ${orange} viability warnings). Work through the reasoning in those cells and decide what would have to be true for this component to survive.`,
    actionInconsistencyTitle: "Resolve the internal inconsistency",
    actionWidenTitle: "Widen the stress test",
    actionWidenDetail:
        "No component failed under the factors you selected. Either the model is genuinely robust, or the factors chosen were too close to your comfort zone. Re-run with the uncertainties you were most tempted to skip.",

    greyReasoning: "No causal relationship was identified between this outcome and this component.",
    errorMissingRequired: (components) =>
        `Describe your ${components.map((item) => item.toLowerCase()).join(", ")} before running the test.`,
    errorTooThin: (min) =>
        `Describe at least ${min} business model components — a thinner description cannot be stress tested meaningfully.`,
    errorTooFewFactors: (min) => `Select at least ${min} distinct stress factors.`,
    errorNoCausalLink:
        "No causal link was found between your business model and the selected stress factors. Try factors that touch how you earn, deliver, or reach customers.",
    errorGeneric: "The stress test could not be completed. Please try again.",
    errorRateLimited: "You have run several stress tests recently. Please try again later.",
    errorIncomplete: (min, max) =>
        `Complete your business model and select ${min}-${max} stress factors.`,
};

export const perspectiveLabelsEn: Record<PestlePerspective, string> = {
    Political: "Political",
    Economic: "Economic",
    Social: "Social",
    Technological: "Technological",
    Legal: "Legal",
    Environmental: "Environmental",
};

export const businessModelContentEn: BusinessModelContent = {
    components: businessModelComponents,
    factors: stressFactorLibrary,
    perspectiveLabels: perspectiveLabelsEn,
    logic: businessModelLogicEn,
};
