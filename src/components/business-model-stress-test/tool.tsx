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
    LoaderCircle,
    Plus,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
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
            window.scrollTo({ top: 0, behavior: "smooth" });

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
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <main className="min-h-screen bg-[#FDFBF7] pb-24 text-[#1C1917] selection:bg-[#0F3F35] selection:text-white">
            <section className="mx-auto max-w-6xl px-6 pt-28 pb-10 md:px-12 md:pt-36">
                <Link
                    href="/tools"
                    className="group mb-10 inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-[#0F3F35]"
                >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> Back to
                    Tools Library
                </Link>

                {step === "intro" && (
                    <div className="grid items-end gap-10 lg:grid-cols-[1fr_380px]">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#D97706]/5 px-3 py-1 text-xs font-bold tracking-widest text-[#D97706] uppercase">
                                <FlaskConical className="size-3.5" /> Scenario diagnostic
                            </div>
                            <h1 className="max-w-4xl font-serif text-5xl leading-[1.05] text-[#0F3F35] md:text-7xl">
                                Would your business model <span className="text-[#D97706]">survive?</span>
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-relaxed font-medium text-stone-600 md:text-xl">
                                Most business models are validated against today. This one puts yours against
                                the futures that could break it — one component at a time — and shows you
                                exactly where it snaps.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_18px_50px_-30px_rgba(15,63,53,0.35)]">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="grid size-10 place-items-center rounded-xl bg-[#0F3F35] text-white">
                                    <Layers className="size-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#0F3F35]">Peer-reviewed method</p>
                                    <p className="text-xs text-stone-500">Haaker et al., Futures (2017)</p>
                                </div>
                            </div>
                            <ol className="space-y-2 text-xs font-medium text-stone-600">
                                {[
                                    "Describe your business model",
                                    "Pick 3-5 uncertainties",
                                    "Map what each one touches",
                                    "Build the heat map",
                                    "Read the patterns",
                                    "Fix what breaks",
                                ].map((label, index) => (
                                    <li key={label} className="flex items-center gap-2 rounded-lg bg-stone-50 px-3 py-2">
                                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#0F3F35] font-mono text-[10px] text-white">
                                            {index + 1}
                                        </span>
                                        {label}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}

                {step !== "intro" && step !== "result" && (
                    <div>
                        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold tracking-widest uppercase">
                            {[
                                { id: "model", label: "1 · Business model" },
                                { id: "factors", label: "2 · Stress factors" },
                                { id: "lead", label: "3 · Run the test" },
                            ].map((item) => (
                                <span
                                    key={item.id}
                                    className={`rounded-full px-3 py-1 ${
                                        step === item.id
                                            ? "bg-[#0F3F35] text-white"
                                            : "bg-stone-100 text-stone-400"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            ))}
                        </div>
                        <h1 className="font-serif text-4xl text-[#0F3F35] md:text-5xl">
                            {step === "model" && "Describe the business model"}
                            {step === "factors" && "Choose what to stress it with"}
                            {step === "lead" && "Run the stress test"}
                        </h1>
                        <p className="mt-4 max-w-3xl text-base leading-relaxed text-stone-600">
                            {step === "model" &&
                                "Be specific and honest — the test can only stress what you actually write down. Vague answers produce a vague heat map."}
                            {step === "factors" &&
                                `Pick the ${MIN_STRESS_FACTORS}-${MAX_STRESS_FACTORS} uncertainties with the highest impact on your model. Each one is tested at both extremes, because a future that only ever goes your way is not a test.`}
                            {step === "lead" &&
                                "Your heat map takes up to a minute to build. Tell us where to say it is ready."}
                        </p>
                    </div>
                )}

                {step === "result" && report && (
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#D97706]/5 px-3 py-1 text-xs font-bold tracking-widest text-[#D97706] uppercase">
                            <Sparkles className="size-3.5" /> Stress test complete
                        </div>
                        <h1 className="font-serif text-4xl text-[#0F3F35] md:text-5xl">
                            Where your model breaks
                        </h1>
                    </div>
                )}

                {error && (
                    <div
                        role="alert"
                        className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <AlertCircle className="mt-0.5 size-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </section>

            <section className="mx-auto max-w-6xl px-6 md:px-12">
                {step === "intro" && (
                    <div className="space-y-8">
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
                                <div
                                    key={card.title}
                                    className="rounded-2xl border border-stone-200 bg-white p-6"
                                >
                                    <h2 className="font-bold text-[#0F3F35]">{card.title}</h2>
                                    <div className="my-3 h-1 w-8 bg-[#D97706]" />
                                    <p className="text-sm leading-relaxed text-stone-600">{card.body}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setStep("model")}
                            className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0F3F35] px-8 font-bold text-white transition-colors hover:bg-[#D97706]"
                        >
                            Start the stress test <ArrowRight className="size-4" />
                        </button>
                        <p className="text-sm text-stone-500">
                            Takes about 10 minutes to fill in · Free · No account needed
                        </p>
                    </div>
                )}

                {step === "model" && (
                    <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            {businessModelComponents.map((component) => (
                                <div
                                    key={component.id}
                                    className="rounded-2xl border border-stone-200 bg-white p-5"
                                >
                                    <label
                                        htmlFor={component.id}
                                        className="flex items-baseline justify-between gap-3"
                                    >
                                        <span className="font-bold text-[#0F3F35]">{component.name}</span>
                                        <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                                            {component.required ? "Required" : "Optional"}
                                        </span>
                                    </label>
                                    <p className="mt-1 text-xs text-stone-500">{component.question}</p>
                                    <textarea
                                        id={component.id}
                                        rows={3}
                                        maxLength={700}
                                        value={businessModel[component.id] || ""}
                                        onChange={(event) =>
                                            setBusinessModel((current) => ({
                                                ...current,
                                                [component.id]: event.target.value,
                                            }))
                                        }
                                        placeholder={component.placeholder}
                                        className="mt-3 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm text-[#1C1917] outline-none transition-colors placeholder:text-stone-400 focus:border-[#D97706] focus:bg-white"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5">
                            <p className="text-sm text-stone-600">
                                <strong className="text-[#0F3F35]">
                                    {describedCount}/{businessModelComponents.length}
                                </strong>{" "}
                                components described
                                {!modelReady && (
                                    <span className="block text-xs text-stone-400">
                                        {missingRequired.length
                                            ? `Still needed: ${missingRequired.map((item) => item.name.toLowerCase()).join(", ")}.`
                                            : `Describe at least ${MIN_DESCRIBED_COMPONENTS} components to run a meaningful test.`}
                                    </span>
                                )}
                            </p>
                            <button
                                type="button"
                                disabled={!modelReady}
                                onClick={() => {
                                    setStep("factors");
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-[#0F3F35] px-6 font-bold text-white transition-colors hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Choose stress factors <ArrowRight className="size-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === "factors" && (
                    <div className="space-y-8">
                        {pestleOrder.map((perspective) => {
                            const factors = allFactors.filter(
                                (factor) => factor.perspective === perspective
                            );
                            if (!factors.length) return null;
                            return (
                                <div key={perspective}>
                                    <h2 className="mb-3 text-xs font-bold tracking-widest text-stone-400 uppercase">
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
                                                    className={`relative rounded-2xl border p-5 transition-colors ${
                                                        isSelected
                                                            ? "border-[#0F3F35] bg-white shadow-sm"
                                                            : "border-stone-200 bg-white"
                                                    } ${isFull ? "opacity-50" : ""}`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleFactor(factor.id)}
                                                        disabled={isFull}
                                                        aria-pressed={isSelected}
                                                        aria-label={`Stress factor: ${factor.name}`}
                                                        className="flex w-full cursor-pointer items-start gap-3 text-left disabled:cursor-not-allowed"
                                                    >
                                                        <span
                                                            className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border ${
                                                                isSelected
                                                                    ? "border-[#0F3F35] bg-[#0F3F35] text-white"
                                                                    : "border-stone-300"
                                                            }`}
                                                        >
                                                            {isSelected && <Check className="size-3.5" />}
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block font-bold text-[#0F3F35]">
                                                                {factor.name}
                                                            </span>
                                                            {factor.description && (
                                                                <span className="mt-1 block text-xs leading-relaxed text-stone-500">
                                                                    {factor.description}
                                                                </span>
                                                            )}
                                                        </span>
                                                    </button>
                                                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                                        {factor.outcomes.map((outcome) => (
                                                            <div
                                                                key={outcome.id}
                                                                className="rounded-xl bg-stone-50 p-3"
                                                            >
                                                                <p className="text-xs font-bold text-[#0F3F35]">
                                                                    {outcome.label}
                                                                </p>
                                                                {outcome.description && (
                                                                    <p className="mt-1 text-[11px] leading-relaxed text-stone-500">
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
                                                            className="absolute top-4 right-4 cursor-pointer text-stone-300 transition-colors hover:text-red-500"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}

                        {showCustomForm ? (
                            <form
                                onSubmit={addCustomFactor}
                                className="space-y-4 rounded-2xl border border-[#D97706]/30 bg-[#D97706]/5 p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="font-bold text-[#0F3F35]">Add your own uncertainty</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowCustomForm(false)}
                                        aria-label="Cancel"
                                        className="cursor-pointer text-stone-400 hover:text-[#0F3F35]"
                                    >
                                        <X className="size-4" />
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
                                        placeholder="What is uncertain? e.g. Our largest client's renewal policy"
                                        className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-[#D97706]"
                                    />
                                    <select
                                        value={customDraft.perspective}
                                        onChange={(event) =>
                                            setCustomDraft((current) => ({
                                                ...current,
                                                perspective: event.target.value as PestlePerspective,
                                            }))
                                        }
                                        className="h-12 w-full cursor-pointer rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-[#D97706]"
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
                                        placeholder="Extreme outcome 1 — e.g. They renew at current volume"
                                        className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-[#D97706]"
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
                                        placeholder="Extreme outcome 2 — e.g. They leave entirely"
                                        className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-[#D97706]"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#0F3F35] px-5 text-sm font-bold text-white transition-colors hover:bg-[#D97706]"
                                >
                                    <Plus className="size-4" /> Add uncertainty
                                </button>
                            </form>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowCustomForm(true)}
                                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-stone-300 px-5 py-3 text-sm font-bold text-stone-500 transition-colors hover:border-[#D97706] hover:text-[#D97706]"
                            >
                                <Plus className="size-4" /> Add an uncertainty specific to your business
                            </button>
                        )}

                        <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_18px_50px_-30px_rgba(15,63,53,0.45)]">
                            <p className="text-sm text-stone-600">
                                <strong className="text-[#0F3F35]">
                                    {selectedIds.length}/{MAX_STRESS_FACTORS}
                                </strong>{" "}
                                selected
                                {!factorsReady && (
                                    <span className="block text-xs text-stone-400">
                                        Select at least {MIN_STRESS_FACTORS}.
                                    </span>
                                )}
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep("model")}
                                    className="cursor-pointer text-sm font-medium text-stone-500 hover:text-[#0F3F35]"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    disabled={!factorsReady}
                                    onClick={() => {
                                        setStep("lead");
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-[#0F3F35] px-6 font-bold text-white transition-colors hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Continue <ArrowRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === "lead" && (
                    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                        <form
                            onSubmit={runTest}
                            className="rounded-3xl border border-stone-200 bg-white p-7 md:p-9"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="stress-name"
                                        className="text-sm font-medium text-stone-700"
                                    >
                                        First name (optional)
                                    </label>
                                    <input
                                        id="stress-name"
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        disabled={loading}
                                        placeholder="Sara"
                                        className="mt-2 h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none focus:border-[#D97706] focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="stress-email"
                                        className="text-sm font-medium text-stone-700"
                                    >
                                        Work email
                                    </label>
                                    <input
                                        id="stress-email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        disabled={loading}
                                        placeholder="sara@company.com"
                                        className="mt-2 h-12 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 text-sm outline-none focus:border-[#D97706] focus:bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email.trim()}
                                className="mt-6 flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#0F3F35] px-7 font-bold text-white transition-colors hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle className="size-5 animate-spin" /> Building your heat
                                        map…
                                    </>
                                ) : (
                                    <>
                                        Run the stress test <ArrowRight className="size-4" />
                                    </>
                                )}
                            </button>

                            {loading ? (
                                <div className="mt-6 rounded-2xl bg-stone-50 p-5">
                                    <p className="text-sm font-medium text-[#0F3F35]">
                                        {loadingStages[stage]}
                                    </p>
                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-stone-200">
                                        <div className="h-full w-2/3 animate-pulse rounded-full bg-[#D97706]" />
                                    </div>
                                    <p className="mt-3 text-xs text-stone-400">
                                        This usually takes 30-60 seconds. Please keep this tab open.
                                    </p>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setStep("factors")}
                                    className="mt-4 cursor-pointer text-sm font-medium text-stone-500 hover:text-[#0F3F35]"
                                >
                                    Back to stress factors
                                </button>
                            )}
                        </form>

                        <aside className="rounded-3xl border border-stone-200 bg-white p-6">
                            <h2 className="text-xs font-bold tracking-widest text-stone-400 uppercase">
                                What will be tested
                            </h2>
                            <p className="mt-3 text-sm font-bold text-[#0F3F35]">
                                {describedCount} business model components
                            </p>
                            <ul className="mt-4 space-y-2">
                                {selectedFactors.map((factor) => (
                                    <li key={factor.id} className="rounded-xl bg-stone-50 p-3">
                                        <p className="text-sm font-bold text-[#0F3F35]">{factor.name}</p>
                                        <p className="mt-1 text-xs text-stone-500">
                                            {factor.outcomes[0].label} ↔ {factor.outcomes[1].label}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-xs leading-relaxed text-stone-400">
                                {describedCount * selectedFactors.length * 2} cells will be mapped and
                                coloured.
                            </p>
                        </aside>
                    </div>
                )}

                {step === "result" && report && <ResultSummary report={report} onReset={reset} />}
            </section>
        </main>
    );
}
