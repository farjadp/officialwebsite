"use client";

import Link from "next/link";
import {
    AlertOctagon,
    ArrowRight,
    CheckCircle2,
    Columns3,
    Grid3x3,
    ListChecks,
    RefreshCw,
    Rows3,
    Scale,
    ShieldAlert,
} from "lucide-react";
import { METHOD_CITATION, METHOD_URL } from "@/data/business-model-stress-test/config";
import {
    HeatMapPattern,
    StressTestReport,
    describedComponentIds,
} from "@/data/business-model-stress-test/logic";
import { HeatMap, HeatMapLegend } from "./heat-map";

function ScoreRing({ score }: { score: number }) {
    return (
        <div
            className="relative grid size-32 shrink-0 place-items-center rounded-full"
            style={{ background: `conic-gradient(#D97706 ${score * 3.6}deg, #E7E5E4 0deg)` }}
        >
            <div className="grid size-[108px] place-items-center rounded-full bg-white text-center">
                <div>
                    <strong className="font-mono text-3xl text-[#0F3F35]">{score}</strong>
                    <span className="text-sm text-stone-400">/100</span>
                </div>
            </div>
        </div>
    );
}

/** `null` means nothing was assessed here — an empty track, never a full green bar. */
function RobustnessBar({ value }: { value: number | null }) {
    if (value === null)
        return <div className="h-2 w-full rounded-full border border-dashed border-stone-200" />;
    const tone = value >= 70 ? "bg-emerald-500" : value >= 45 ? "bg-amber-500" : "bg-red-500";
    return (
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
            <div className={`h-full rounded-full ${tone}`} style={{ width: `${value}%` }} />
        </div>
    );
}

const patternStyles: Record<
    HeatMapPattern["severity"],
    { border: string; badge: string; icon: typeof ShieldAlert }
> = {
    critical: {
        border: "border-red-200 bg-red-50",
        badge: "bg-red-600 text-white",
        icon: AlertOctagon,
    },
    warning: {
        border: "border-amber-200 bg-amber-50",
        badge: "bg-amber-500 text-white",
        icon: ShieldAlert,
    },
    positive: {
        border: "border-emerald-200 bg-emerald-50",
        badge: "bg-emerald-600 text-white",
        icon: CheckCircle2,
    },
};

const patternLabels: Record<HeatMapPattern["type"], string> = {
    "double-red": "Double red",
    "double-green": "Double green",
    inconsistency: "Inconsistency",
    "preferred-outcome": "Preferred outcome",
};

export function ResultSummary({
    report,
    onReset,
}: {
    report: StressTestReport;
    onReset: () => void;
}) {
    const { result, factors, cells, businessModel } = report;
    const componentIds = describedComponentIds(businessModel);

    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm md:p-10">
                <div className="grid items-center gap-8 md:grid-cols-[auto_1fr_auto]">
                    <ScoreRing score={result.robustnessIndex} />
                    <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#0F3F35] px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
                                {result.grade}
                            </span>
                            <span className="text-xs text-stone-400">
                                {new Date(report.generatedAt).toLocaleString()}
                            </span>
                        </div>
                        <h2 className="font-serif text-3xl text-[#0F3F35] md:text-4xl">
                            Business model robustness
                        </h2>
                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-600">
                            {result.verdict}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm font-bold text-[#0F3F35] transition-colors hover:border-[#D97706] hover:text-[#D97706]"
                    >
                        <RefreshCw className="size-4" /> Test another model
                    </button>
                </div>

                <div className="mt-9 grid gap-3 border-t border-stone-100 pt-7 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Showstoppers", value: result.counts.red, tone: "text-red-600" },
                        { label: "Viability warnings", value: result.counts.orange, tone: "text-amber-600" },
                        { label: "Holds up", value: result.counts.green, tone: "text-emerald-600" },
                        {
                            label: "Assessed cells",
                            value: `${result.assessedCells}/${result.totalCells}`,
                            tone: "text-[#0F3F35]",
                        },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl bg-stone-50 p-4">
                            <p className="text-xs font-bold tracking-wider text-stone-500 uppercase">
                                {item.label}
                            </p>
                            <p className={`mt-2 font-mono text-2xl font-bold ${item.tone}`}>{item.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-3xl border border-stone-200 bg-white p-7 md:p-9">
                <header className="mb-6 flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#0F3F35] text-white">
                        <Grid3x3 className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold tracking-widest text-[#D97706] uppercase">Step 4</p>
                        <h3 className="text-xl font-bold text-[#0F3F35]">The heat map</h3>
                        <p className="mt-1 text-sm text-stone-500">
                            Every business model component you described, confronted with both extreme
                            outcomes of each stress factor.
                        </p>
                    </div>
                </header>
                <HeatMap factors={factors} componentIds={componentIds} cells={cells} />
                <div className="mt-6">
                    <HeatMapLegend />
                </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-2">
                <section className="rounded-3xl border border-stone-200 bg-white p-7 md:p-9">
                    <header className="mb-6 flex items-start gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-stone-100 text-[#0F3F35]">
                            <Rows3 className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#D97706] uppercase">
                                Step 5a
                            </p>
                            <h3 className="text-xl font-bold text-[#0F3F35]">Which components are weak</h3>
                            <p className="mt-1 text-sm text-stone-500">
                                Each component accumulated across every future you tested.
                            </p>
                        </div>
                    </header>
                    <ul className="space-y-4">
                        {[...result.componentSubViews]
                            .sort((a, b) => a.robustness - b.robustness)
                            .map((view) => (
                                <li key={view.componentId}>
                                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                                        <span className="text-sm font-bold text-[#0F3F35]">{view.name}</span>
                                        <span className="font-mono text-sm text-stone-500">
                                            {view.assessed ? `${view.robustness}/100` : "untouched"}
                                        </span>
                                    </div>
                                    <RobustnessBar value={view.assessed ? view.robustness : null} />
                                    <p className="mt-1.5 text-xs text-stone-400">
                                        {view.assessed
                                            ? `${view.red} showstopper${view.red === 1 ? "" : "s"}, ${view.orange} warning${view.orange === 1 ? "" : "s"}, ${view.green} favourable`
                                            : "Untested — no selected stress factor touches this component."}
                                    </p>
                                </li>
                            ))}
                    </ul>
                </section>

                <section className="rounded-3xl border border-stone-200 bg-white p-7 md:p-9">
                    <header className="mb-6 flex items-start gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-stone-100 text-[#0F3F35]">
                            <Columns3 className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#D97706] uppercase">
                                Step 5a
                            </p>
                            <h3 className="text-xl font-bold text-[#0F3F35]">Which futures hurt most</h3>
                            <p className="mt-1 text-sm text-stone-500">
                                Each outcome accumulated across your whole business model.
                            </p>
                        </div>
                    </header>
                    <ul className="space-y-4">
                        {[...result.outcomeSubViews]
                            .sort((a, b) => a.robustness - b.robustness)
                            .map((view) => (
                                <li key={`${view.factorId}-${view.outcomeId}`}>
                                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                                        <span className="text-sm font-bold text-[#0F3F35]">
                                            {view.outcomeLabel}
                                        </span>
                                        <span className="font-mono text-sm text-stone-500">
                                            {view.assessed ? `${view.robustness}/100` : "no impact"}
                                        </span>
                                    </div>
                                    <RobustnessBar value={view.assessed ? view.robustness : null} />
                                    <p className="mt-1.5 text-xs text-stone-400">{view.factorName}</p>
                                </li>
                            ))}
                    </ul>
                </section>
            </div>

            {!!result.patterns.length && (
                <section className="rounded-3xl border border-stone-200 bg-white p-7 md:p-9">
                    <header className="mb-6 flex items-start gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-stone-100 text-[#0F3F35]">
                            <Scale className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-widest text-[#D97706] uppercase">
                                Step 5b
                            </p>
                            <h3 className="text-xl font-bold text-[#0F3F35]">Patterns in the map</h3>
                            <p className="mt-1 text-sm text-stone-500">
                                Colour patterns that say more than any single cell does.
                            </p>
                        </div>
                    </header>
                    <ul className="grid gap-4 md:grid-cols-2">
                        {result.patterns.map((pattern, index) => {
                            const style = patternStyles[pattern.severity];
                            const Icon = style.icon;
                            return (
                                <li
                                    key={`${pattern.type}-${index}`}
                                    className={`rounded-2xl border p-5 ${style.border}`}
                                >
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase ${style.badge}`}
                                        >
                                            <Icon className="size-3" />
                                            {patternLabels[pattern.type]}
                                        </span>
                                    </div>
                                    <p className="font-bold text-[#0F3F35]">{pattern.title}</p>
                                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                                        {pattern.detail}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            <section className="rounded-3xl border border-[#D97706]/20 bg-[#D97706]/5 p-7 md:p-9">
                <header className="mb-6 flex items-start gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#D97706] text-white">
                        <ListChecks className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold tracking-widest text-[#D97706] uppercase">Step 6</p>
                        <h3 className="text-xl font-bold text-[#0F3F35]">What to actually change</h3>
                        <p className="mt-1 text-sm text-stone-600">
                            Ordered by what breaks the model soonest.
                        </p>
                    </div>
                </header>
                <ol className="grid gap-3 md:grid-cols-2">
                    {result.actions.map((action, index) => (
                        <li
                            key={action.title}
                            className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-5"
                        >
                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#0F3F35] font-mono text-xs font-bold text-white">
                                {index + 1}
                            </span>
                            <div>
                                <p className="font-bold text-[#0F3F35]">{action.title}</p>
                                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">
                                    {action.detail}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="rounded-3xl border border-[#0F3F35]/15 bg-[#0F3F35] p-7 text-white md:p-9">
                <h3 className="font-serif text-2xl">Want a second pair of eyes on the redesign?</h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                    The stress test tells you which components break. Deciding what to replace them with
                    is the harder half, and it is the work I do with founders every week.
                </p>
                <Link
                    href="/booking"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#0F3F35]"
                >
                    Book a working session <ArrowRight className="size-4" />
                </Link>
            </section>

            <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 text-xs leading-relaxed text-stone-500">
                <p>
                    <strong className="text-[#0F3F35]">Method: </strong>
                    {METHOD_CITATION}{" "}
                    <a
                        href={METHOD_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-[#D97706] hover:underline"
                    >
                        Read the paper
                    </a>{" "}
                    (open access, CC BY 4.0). The six-step method, the four-colour scheme, the sub-views
                    and the pattern analysis are the authors&apos;.
                </p>
                <p>
                    <strong className="text-[#0F3F35]">What is ours: </strong>
                    the paper&apos;s method is qualitative and produces no score. The robustness index above
                    is our own quantification (holds up = 1, not viable = 0.5, not feasible = 0, averaged over
                    the cells that were assessed) so results can be compared and tracked. The heat map and the
                    reasoning behind each cell remain the real output.
                </p>
                <p>
                    <strong className="text-[#0F3F35]">Limits: </strong>
                    the original method runs as a facilitated session with people who know the business and an
                    outside domain expert. Here a model plays that role from your written description, so the
                    result is only as good as that description and the factors you chose. It assesses impact,
                    not likelihood. Treat it as a structured argument to challenge, not a verdict.
                </p>
            </div>
        </div>
    );
}
