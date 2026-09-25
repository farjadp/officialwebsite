"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Check,
    FlaskConical,
    Layers,
    Plus,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import {
    StepIn,
    ToolButton,
    ToolField,
    ToolIntro,
    ToolPanel,
    ToolProgress,
    ToolShell,
} from "@/components/v3/tool-kit";
import {
    MAX_STRESS_FACTORS,
    MIN_DESCRIBED_COMPONENTS,
    MIN_STRESS_FACTORS,
    PestlePerspective,
    StressFactor,
    businessModelComponents,
    pestleOrder,
    stressFactorLibrary,
} from "@/data/business-model-stress-test/config";
import type {
    BusinessModelDescription,
    StressTestReport,
} from "@/data/business-model-stress-test/logic";
import { ResultSummary } from "./result-summary";

type Step = "intro" | "model" | "factors" | "lead" | "result";

const TOOL_ID = "business-model-stress-test";

const loadingStages = [
    "Reading your business model…",
    "Mapping which components each uncertainty actually touches…",
    "Colouring the heat map, outcome by outcome…",
    "Looking for double-red and inconsistent patterns…",
    "Writing the redesign actions…",
];

/** Scroll to the top; instant when the visitor prefers reduced motion. */
function scrollToTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
}

const fieldClass =
    "w-full rounded-xl border border-v3-line bg-v3-raise px-4 text-base text-v3-bone placeholder:text-v3-mute/70 transition-colors focus:border-v3-light/60 focus:outline-none focus:ring-2 focus:ring-v3-light/70";

const emptyCustom = {
    name: "",
    perspective: "Technological" as PestlePerspective,
    description: "",
    outcomeA: "",
    outcomeB: "",
};

export default function BusinessModelStressTestTool() {
    const [step, setStep] = useState<Step>("intro");
    const [businessModel, setBusinessModel] = useState<BusinessModelDescription>({});
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [customFactors, setCustomFactors] = useState<StressFactor[]>([]);
    const [customDraft, setCustomDraft] = useState(emptyCustom);
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [report, setReport] = useState<StressTestReport | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState(0);

    useEffect(() => {
        if (!loading) return;
        setStage(0);
        const timer = setInterval(
            () => setStage((current) => Math.min(current + 1, loadingStages.length - 1)),
            6000
        );
        return () => clearInterval(timer);
    }, [loading]);

    const allFactors = useMemo(
        () => [...stressFactorLibrary, ...customFactors],
        [customFactors]
    );
    const selectedFactors = useMemo(
        () => selectedIds.map((id) => allFactors.find((factor) => factor.id === id)!).filter(Boolean),
        [selectedIds, allFactors]
    );

    const describedCount = businessModelComponents.filter((component) =>
        (businessModel[component.id] || "").trim()
    ).length;
    const missingRequired = businessModelComponents.filter(
        (component) => component.required && !(businessModel[component.id] || "").trim()
    );
    const modelReady = !missingRequired.length && describedCount >= MIN_DESCRIBED_COMPONENTS;
    const factorsReady =
        selectedIds.length >= MIN_STRESS_FACTORS && selectedIds.length <= MAX_STRESS_FACTORS;

    function toggleFactor(id: string) {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : current.length >= MAX_STRESS_FACTORS
                  ? current
                  : [...current, id]
        );
    }

    function addCustomFactor(event: FormEvent) {
        event.preventDefault();
        if (
            customDraft.name.trim().length < 3 ||
            customDraft.outcomeA.trim().length < 2 ||
            customDraft.outcomeB.trim().length < 2
        )
            return;
        const factor: StressFactor = {
            id: `custom-${Date.now()}`,
            perspective: customDraft.perspective,
            name: customDraft.name.trim(),
            description: customDraft.description.trim(),
            outcomes: [
                { id: "a", label: customDraft.outcomeA.trim(), description: "" },
                { id: "b", label: customDraft.outcomeB.trim(), description: "" },
            ],
            custom: true,
        };
        setCustomFactors((current) => [...current, factor]);
        if (selectedIds.length < MAX_STRESS_FACTORS)
            setSelectedIds((current) => [...current, factor.id]);
        setCustomDraft(emptyCustom);
        setShowCustomForm(false);
    }

    function removeCustomFactor(id: string) {
        setCustomFactors((current) => current.filter((factor) => factor.id !== id));
        setSelectedIds((current) => current.filter((item) => item !== id));
    }

    async function runTest(event: FormEvent) {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await fetch(`/api/tools/${TOOL_ID}`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ businessModel, factors: selectedFactors }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "The stress test could not be completed.");

            setReport(data as StressTestReport);
            setStep("result");
            scrollToTop();

            const score = (data as StressTestReport).result.robustnessIndex;
            fetch("/api/tool-usage", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ toolId: TOOL_ID, score }),
            }).catch(() => {});
            fetch("/api/leads", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    name: name.trim() || undefined,
                    toolId: TOOL_ID,
                    score,
                    answers: {
                        businessModel,
                        factors: selectedFactors.map((factor) => factor.name),
                        grade: (data as StressTestReport).result.grade,
                    },
                }),
            }).catch(() => {});
        } catch (runError) {
            setError(
                runError instanceof Error ? runError.message : "The stress test could not be completed."
            );
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setStep("intro");
        setBusinessModel({});
        setSelectedIds([]);
        setCustomFactors([]);
        setReport(null);
        setError("");
        scrollToTop();
    }

    const stepItems = [
        { id: "model", label: "1 · Business model" },
        { id: "factors", label: "2 · Stress factors" },
        { id: "lead", label: "3 · Run the test" },
    ];
    const stepIndex = stepItems.findIndex((item) => item.id === step);

    return (
        <ToolShell wide={step === "result"}>
            <Link
                href="/tools"
                className="group mb-6 inline-flex items-center gap-2 text-sm text-v3-mute transition-colors hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
            >
                <ArrowLeft
                    aria-hidden
                    className="size-4 transition-transform group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1"
                />{" "}
                Back to Tools Library
            </Link>

            {step === "intro" && (
                <>
                    <ToolIntro
                        kicker={
                            <span className="inline-flex items-center gap-2">
                                <FlaskConical className="size-4" aria-hidden /> Scenario diagnostic
                            </span>
                        }
                        title={
                            <>
                                Would your business model <span className="text-v3-light">survive?</span>
                            </>
                        }
                        lead="Most business models are validated against today. This one puts yours against the futures that could break it — one component at a time — and shows you exactly where it snaps."
                        action={
                            <ToolButton onClick={() => setStep("model")}>
                                Start the stress test{" "}
                                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
                            </ToolButton>
                        }
                        meta="Takes about 10 minutes to fill in · Free · No account needed"
                    />

                    <StepIn delay={0.32} className="flex flex-col gap-8">
                        <div className="rounded-3xl border border-v3-line/80 bg-v3-raise p-7">
                            <div className="mb-6 flex items-center gap-3">
                                <div
                                    aria-hidden
                                    className="grid size-10 place-items-center rounded-xl border border-v3-line text-v3-light"
                                >
                                    <Layers className="size-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-v3-bone">Peer-reviewed method</p>
                                    <p className="text-xs text-v3-mute">Haaker et al., Futures (2017)</p>
                                </div>
                            </div>
                            <ol className="grid gap-2 text-sm text-v3-soft sm:grid-cols-2">
                                {[
                                    "Describe your business model",
                                    "Pick 3-5 uncertainties",
                                    "Map what each one touches",
                                    "Build the heat map",
                                    "Read the patterns",
                                    "Fix what breaks",
                                ].map((label, index) => (
                                    <li
                                        key={label}
                                        className="flex items-center gap-3 rounded-xl border border-v3-line/60 px-3 py-2.5"
                                    >
                                        <span
                                            aria-hidden
                                            className="font-v3-display text-lg leading-none text-v3-light tabular-nums"
                                        >
                                            {index + 1}
                                        </span>
                                        {label}
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {[
                                {
                                    title: "It tests components, not vibes",
                                    body: "Your revenue streams, channels, key partners and cost structure are each judged separately. A model rarely fails everywhere at once — it fails at one joint.",
                                },
                                {
                                    title: "Both extremes, every time",
                                    body: "Each uncertainty is tested at both ends. When a component fails at both ends, no scenario saves you: that is a redesign you already owe yourself.",
                                },
                                {
                                    title: "Impact, not prediction",
                                    body: "The method deliberately ignores how likely a future is. It asks what happens to you if it arrives — which is the part you can act on.",
                                },
                            ].map((card) => (
                                <div key={card.title} className="rounded-2xl border border-v3-line/80 p-6">
                                    <h2 className="font-medium text-v3-bone">{card.title}</h2>
                                    <div aria-hidden className="my-4 h-px w-8 bg-v3-light" />
                                    <p className="text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                                        {card.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </StepIn>
                </>
            )}

            {step !== "intro" && step !== "result" && (
                <>
                    <ToolProgress
                        label={
                            <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                {stepItems.map((item) => (
                                    <span
                                        key={item.id}
                                        aria-current={step === item.id ? "step" : undefined}
                                        className={step === item.id ? "text-v3-bone" : "text-v3-mute"}
                                    >
                                        {item.label}
                                    </span>
                                ))}
                            </span>
                        }
                        percent={((stepIndex + 1) / stepItems.length) * 100}
                    />
                    <StepIn key={step} className="pt-10">
                        <h1 className="font-v3-display text-4xl font-light leading-tight md:text-5xl rtl:leading-snug">
                            {step === "model" && "Describe the business model"}
                            {step === "factors" && "Choose what to stress it with"}
                            {step === "lead" && "Run the stress test"}
                        </h1>
                        <p className="mt-4 max-w-3xl leading-relaxed text-v3-soft rtl:leading-loose">
                            {step === "model" &&
                                "Be specific and honest — the test can only stress what you actually write down. Vague answers produce a vague heat map."}
                            {step === "factors" &&
                                `Pick the ${MIN_STRESS_FACTORS}-${MAX_STRESS_FACTORS} uncertainties with the highest impact on your model. Each one is tested at both extremes, because a future that only ever goes your way is not a test.`}
                            {step === "lead" &&
                                "Your heat map takes up to a minute to build. Tell us where to say it is ready."}
                        </p>
                    </StepIn>
                </>
            )}

            {step === "result" && report && (
                <StepIn className="pb-10">
                    <p className="mb-4 inline-flex items-center gap-2 text-sm text-v3-light">
                        <Sparkles className="size-4" aria-hidden /> Stress test complete
                    </p>
                    <h1 className="font-v3-display text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-[1.04] tracking-[-0.02em] rtl:leading-[1.4] rtl:tracking-normal">
                        Where your model breaks
                    </h1>
                </StepIn>
            )}

            {error && (
                <div
                    role="alert"
                    className="mt-6 flex items-start gap-3 rounded-2xl border border-v3-light/60 bg-v3-light/[0.07] p-4 text-sm text-v3-bone"
                >
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-v3-light" aria-hidden />
                    <span>{error}</span>
                </div>
            )}

            <div className="mt-10">
                {step === "model" && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            {businessModelComponents.map((component) => (
                                <StepIn
                                    key={component.id}
                                    className="flex flex-col gap-2 border-b border-v3-line/60 pb-6"
                                >
                                    <label
                                        htmlFor={component.id}
                                        className="flex items-baseline justify-between gap-3"
                                    >
                                        <span className="text-lg text-v3-bone">{component.name}</span>
                                        <span className="text-[11px] tracking-wider text-v3-mute uppercase">
                                            {component.required ? "Required" : "Optional"}
                                        </span>
                                    </label>
                                    <p id={`${component.id}-hint`} className="text-sm text-v3-mute">
                                        {component.question}
                                    </p>
                                    <textarea
                                        id={component.id}
                                        rows={3}
                                        maxLength={700}
                                        aria-describedby={`${component.id}-hint`}
                                        aria-required={component.required || undefined}
                                        value={businessModel[component.id] || ""}
                                        onChange={(event) =>
                                            setBusinessModel((current) => ({
                                                ...current,
                                                [component.id]: event.target.value,
                                            }))
                                        }
                                        placeholder={component.placeholder}
                                        className={`${fieldClass} mt-1 resize-y py-3 text-sm leading-relaxed`}
                                    />
                                </StepIn>
                            ))}
                        </div>

                        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-v3-line bg-v3-raise/95 p-5 backdrop-blur-md">
                            <p className="text-sm text-v3-soft" aria-live="polite">
                                <strong className="font-medium text-v3-light tabular-nums">
                                    {describedCount}/{businessModelComponents.length}
                                </strong>{" "}
                                components described
                                {!modelReady && (
                                    <span className="block text-xs text-v3-mute">
                                        {missingRequired.length
                                            ? `Still needed: ${missingRequired.map((item) => item.name.toLowerCase()).join(", ")}.`
                                            : `Describe at least ${MIN_DESCRIBED_COMPONENTS} components to run a meaningful test.`}
                                    </span>
                                )}
                            </p>
                            <ToolButton
                                disabled={!modelReady}
                                onClick={() => {
                                    setStep("factors");
                                    scrollToTop();
                                }}
                            >
                                Choose stress factors{" "}
                                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
                            </ToolButton>
                        </div>
                    </div>
                )}

                {step === "factors" && (
                    <div className="flex flex-col gap-10">
                        {pestleOrder.map((perspective) => {
                            const factors = allFactors.filter(
                                (factor) => factor.perspective === perspective
                            );
                            if (!factors.length) return null;
                            return (
                                <StepIn key={perspective}>
                                    <h2 className="mb-4 text-xs tracking-widest text-v3-mute uppercase">
                                        {perspective}
                                    </h2>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {factors.map((factor) => {
                                            const isSelected = selectedIds.includes(factor.id);
                                            const isFull =
                                                !isSelected && selectedIds.length >= MAX_STRESS_FACTORS;
                                            return (
                                                <div
                                                    key={factor.id}
                                                    className={`relative rounded-2xl border p-5 transition-all duration-300 ${
                                                        isSelected
                                                            ? "border-v3-light bg-v3-light/10 shadow-[0_0_30px_-12px_rgba(232,196,138,0.8)]"
                                                            : "border-v3-line bg-v3-raise hover:border-v3-mute"
                                                    } ${isFull ? "opacity-50" : ""}`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleFactor(factor.id)}
                                                        disabled={isFull}
                                                        aria-pressed={isSelected}
                                                        aria-label={`Stress factor: ${factor.name}`}
                                                        className="flex w-full cursor-pointer items-start gap-3 rounded-lg pe-7 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-4 focus-visible:ring-offset-v3-raise disabled:cursor-not-allowed"
                                                    >
                                                        <span
                                                            aria-hidden
                                                            className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border ${
                                                                isSelected
                                                                    ? "border-v3-light bg-v3-light text-v3-ink"
                                                                    : "border-v3-mute"
                                                            }`}
                                                        >
                                                            {isSelected && <Check className="size-3.5" />}
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block font-medium text-v3-bone">
                                                                {factor.name}
                                                            </span>
                                                            {factor.description && (
                                                                <span className="mt-1 block text-xs leading-relaxed text-v3-mute">
                                                                    {factor.description}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </button>
                                                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                                        {factor.outcomes.map((outcome) => (
                                                            <div
                                                                key={outcome.id}
                                                                className="rounded-xl border border-v3-line/60 p-3"
                                                            >
                                                                <p className="text-xs font-medium text-v3-soft">
                                                                    {outcome.label}
                                                                </p>
                                                                {outcome.description && (
                                                                    <p className="mt-1 text-[11px] leading-relaxed text-v3-mute">
                                                                        {outcome.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {factor.custom && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCustomFactor(factor.id)}
                                                            aria-label={`Remove ${factor.name}`}
                                                            className="absolute end-4 top-4 cursor-pointer rounded text-v3-mute transition-colors hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                                                        >
                                                            <Trash2 className="size-4" aria-hidden />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </StepIn>
                            );
                        })}

                        {showCustomForm ? (
                            <StepIn>
                                <form
                                    onSubmit={addCustomFactor}
                                    className="flex flex-col gap-4 rounded-2xl border border-v3-light/40 bg-v3-raise p-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="font-v3-display text-xl font-light text-v3-bone">
                                            Add your own uncertainty
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => setShowCustomForm(false)}
                                            aria-label="Cancel"
                                            className="cursor-pointer rounded text-v3-mute transition-colors hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                                        >
                                            <X className="size-4" aria-hidden />
                                        </button>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-[1fr_200px]">
                                        <input
                                            value={customDraft.name}
                                            onChange={(event) =>
                                                setCustomDraft((current) => ({
                                                    ...current,
                                                    name: event.target.value,
                                                }))
                                            }
                                            maxLength={120}
                                            aria-label="What is uncertain? e.g. Our largest client's renewal policy"
                                            placeholder="What is uncertain? e.g. Our largest client's renewal policy"
                                            className={`${fieldClass} h-12 text-sm`}
                                        />
                                        <select
                                            value={customDraft.perspective}
                                            aria-label="Perspective"
                                            onChange={(event) =>
                                                setCustomDraft((current) => ({
                                                    ...current,
                                                    perspective: event.target.value as PestlePerspective,
                                                }))
                                            }
                                            className={`${fieldClass} h-12 cursor-pointer text-sm`}
                                        >
                                            {pestleOrder.map((perspective) => (
                                                <option key={perspective} value={perspective}>
                                                    {perspective}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <input
                                            value={customDraft.outcomeA}
                                            onChange={(event) =>
                                                setCustomDraft((current) => ({
                                                    ...current,
                                                    outcomeA: event.target.value,
                                                }))
                                            }
                                            maxLength={120}
                                            aria-label="Extreme outcome 1 — e.g. They renew at current volume"
                                            placeholder="Extreme outcome 1 — e.g. They renew at current volume"
                                            className={`${fieldClass} h-12 text-sm`}
                                        />
                                        <input
                                            value={customDraft.outcomeB}
                                            onChange={(event) =>
                                                setCustomDraft((current) => ({
                                                    ...current,
                                                    outcomeB: event.target.value,
                                                }))
                                            }
                                            maxLength={120}
                                            aria-label="Extreme outcome 2 — e.g. They leave entirely"
                                            placeholder="Extreme outcome 2 — e.g. They leave entirely"
                                            className={`${fieldClass} h-12 text-sm`}
                                        />
                                    </div>
                                    <div>
                                        <ToolButton type="submit" variant="secondary">
                                            <Plus className="size-4" aria-hidden /> Add uncertainty
                                        </ToolButton>
                                    </div>
                                </form>
                            </StepIn>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowCustomForm(true)}
                                className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl border border-dashed border-v3-line px-5 py-3 text-sm text-v3-soft transition-colors hover:border-v3-light hover:text-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light"
                            >
                                <Plus className="size-4" aria-hidden /> Add an uncertainty specific to your business
                            </button>
                        )}

                        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-v3-line bg-v3-raise/95 p-5 backdrop-blur-md">
                            <p className="text-sm text-v3-soft" aria-live="polite">
                                <strong className="font-medium text-v3-light tabular-nums">
                                    {selectedIds.length}/{MAX_STRESS_FACTORS}
                                </strong>{" "}
                                selected
                                {!factorsReady && (
                                    <span className="block text-xs text-v3-mute">
                                        Select at least {MIN_STRESS_FACTORS}.
                                    </span>
                                )}
                            </p>
                            <div className="flex items-center gap-3">
                                <ToolButton variant="quiet" onClick={() => setStep("model")}>
                                    Back
                                </ToolButton>
                                <ToolButton
                                    disabled={!factorsReady}
                                    onClick={() => {
                                        setStep("lead");
                                        scrollToTop();
                                    }}
                                >
                                    Continue <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
                                </ToolButton>
                            </div>
                        </div>
                    </div>
                )}

                {step === "lead" && (
                    <div className="flex flex-col gap-8">
                        <ToolPanel>
                            <form onSubmit={runTest} className="flex flex-col gap-5">
                                <ToolField
                                    id="stress-name"
                                    label="First name (optional)"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    disabled={loading}
                                    placeholder="Sara"
                                />
                                <ToolField
                                    id="stress-email"
                                    label="Work email"
                                    type="email"
                                    dir="ltr"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    disabled={loading}
                                    placeholder="sara@company.com"
                                />

                                <ToolButton
                                    type="submit"
                                    loading={loading}
                                    disabled={!email.trim()}
                                    className="mt-2 w-full"
                                >
                                    {loading ? (
                                        "Building your heat map…"
                                    ) : (
                                        <>
                                            Run the stress test{" "}
                                            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
                                        </>
                                    )}
                                </ToolButton>

                                {loading ? (
                                    <div
                                        className="rounded-2xl border border-v3-line/60 p-5"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        <p className="text-sm text-v3-bone">{loadingStages[stage]}</p>
                                        <div className="relative mt-4 h-px overflow-hidden bg-v3-line">
                                            <div className="absolute inset-y-0 start-0 w-2/3 animate-pulse bg-v3-light motion-reduce:animate-none" />
                                        </div>
                                        <p className="mt-3 text-xs text-v3-mute">
                                            This usually takes 30-60 seconds. Please keep this tab open.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <ToolButton variant="quiet" onClick={() => setStep("factors")} className="-ms-3">
                                            Back to stress factors
                                        </ToolButton>
                                    </div>
                                )}
                            </form>
                        </ToolPanel>

                        <StepIn delay={0.1}>
                            <aside className="rounded-3xl border border-v3-line/80 p-6 md:p-8">
                                <h2 className="text-xs tracking-widest text-v3-mute uppercase">
                                    What will be tested
                                </h2>
                                <p className="mt-3 font-v3-display text-2xl font-light text-v3-bone">
                                    {describedCount} business model components
                                </p>
                                <ul className="mt-5 flex flex-col">
                                    {selectedFactors.map((factor) => (
                                        <li
                                            key={factor.id}
                                            className="border-b border-v3-line/60 py-3 last:border-b-0"
                                        >
                                            <p className="text-sm font-medium text-v3-bone">{factor.name}</p>
                                            <p className="mt-1 text-xs text-v3-mute">
                                                {factor.outcomes[0].label} ↔ {factor.outcomes[1].label}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-4 text-xs leading-relaxed text-v3-mute">
                                    {describedCount * selectedFactors.length * 2} cells will be mapped and
                                    coloured.
                                </p>
                            </aside>
                        </StepIn>
                    </div>
                )}

                {step === "result" && report && <ResultSummary report={report} onReset={reset} />}
            </div>
        </ToolShell>
    );
}
