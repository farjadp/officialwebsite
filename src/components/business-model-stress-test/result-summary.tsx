"use client";

import Link from "next/link";
import type { ReactNode } from "react";
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
import { BmLocale, METHOD_URL } from "@/data/business-model-stress-test/config";
import { getBmUiStrings } from "@/data/business-model-stress-test/ui";
import {
    HeatMapPattern,
    StressTestReport,
    describedComponentIds,
} from "@/data/business-model-stress-test/logic";
import { Meter, ScoreRing, StepIn, ToolButton } from "@/components/v3/tool-kit";
import { HeatMap, HeatMapLegend } from "./heat-map";

// Severity is told apart by icon shape and how bright the frame is — never
// by red/amber/green.
const patternStyles: Record<
    HeatMapPattern["severity"],
    { border: string; badge: string; icon: typeof ShieldAlert }
> = {
    critical: {
        border: "border-v3-light/70 bg-v3-light/[0.07]",
        badge: "bg-v3-light text-v3-ink",
        icon: AlertOctagon,
    },
    warning: {
        border: "border-v3-light/35",
        badge: "border border-v3-light/60 text-v3-light",
        icon: ShieldAlert,
    },
    positive: {
        border: "border-v3-line/80",
        badge: "border border-v3-line text-v3-soft",
        icon: CheckCircle2,
    },
};

function SectionHeader({
    icon,
    step,
    title,
    lead,
}: {
    icon: ReactNode;
    step: string;
    title: string;
    lead: string;
}) {
    return (
        <header className="mb-8 flex items-start gap-4">
            <div
                aria-hidden
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-v3-line text-v3-light"
            >
                {icon}
            </div>
            <div>
                <p className="text-sm text-v3-light">{step}</p>
                <h3 className="mt-1 font-v3-display text-2xl font-light md:text-3xl rtl:leading-snug">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-v3-mute rtl:leading-loose">{lead}</p>
            </div>
        </header>
    );
}

const panel = "rounded-3xl border border-v3-line/80 bg-v3-raise p-7 md:p-10";

export function ResultSummary({
    report,
    onReset,
    locale = "en",
}: {
    report: StressTestReport;
    onReset: () => void;
    locale?: BmLocale;
}) {
    const ui = getBmUiStrings(locale);
    const { result, factors, cells, businessModel } = report;
    const componentIds = describedComponentIds(businessModel);
    const patternLabels = ui.patternLabels;

    return (
        <div className="flex flex-col gap-8">
            <StepIn className={`${panel} shadow-[0_40px_120px_-60px_rgba(232,196,138,0.35)]`}>
                <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
                    <ScoreRing locale={locale} score={result.robustnessIndex} />
                    <div className="flex flex-col items-start gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-v3-light/60 px-3 py-1 text-xs font-medium tracking-wider text-v3-light uppercase">
                                {result.grade}
                            </span>
                            <span className="text-xs text-v3-mute">
                                {new Date(report.generatedAt).toLocaleString(
                                    locale === "fa" ? "fa-IR" : "en-CA"
                                )}
                            </span>
                        </div>
                        <h2 className="font-v3-display text-3xl font-light md:text-4xl rtl:leading-snug">
                            {ui.robustnessTitle}
                        </h2>
                        <p className="max-w-2xl leading-relaxed text-v3-soft rtl:leading-loose">
                            {result.verdict}
                        </p>
                        <ToolButton variant="secondary" onClick={onReset} className="mt-2">
                            <RefreshCw className="size-4" aria-hidden /> {ui.testAnother}
                        </ToolButton>
                    </div>
                </div>

                <dl className="mt-10 grid gap-3 border-t border-v3-line/60 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: ui.statShowstoppers, value: result.counts.red, tone: "text-v3-light" },
                        { label: ui.statWarnings, value: result.counts.orange, tone: "text-v3-bone" },
                        { label: ui.statHoldsUp, value: result.counts.green, tone: "text-v3-bone" },
                        {
                            label: ui.statAssessed,
                            value: `${result.assessedCells}/${result.totalCells}`,
                            tone: "text-v3-soft",
                        },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-v3-line/60 p-4">
                            <dt className="text-xs tracking-wider text-v3-mute uppercase">{item.label}</dt>
                            <dd
                                className={`mt-2 font-v3-display text-3xl font-light tabular-nums ${item.tone}`}
                                dir="ltr"
                            >
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </StepIn>

            <section className={panel}>
                <SectionHeader
                    icon={<Grid3x3 className="size-5" />}
                    step={ui.step4Label}
                    title={ui.step4Title}
                    lead={ui.step4Lead}
                />
                <HeatMap
                    factors={factors}
                    componentIds={componentIds}
                    cells={cells}
                    locale={locale}
                />
                <div className="mt-6">
                    <HeatMapLegend locale={locale} />
                </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-2">
                <section className={panel}>
                    <SectionHeader
                        icon={<Rows3 className="size-5" />}
                        step={ui.step5aLabel}
                        title={ui.componentsTitle}
                        lead={ui.componentsLead}
                    />
                    <ul className="flex flex-col gap-6">
                        {[...result.componentSubViews]
                            .sort((a, b) => a.robustness - b.robustness)
                            .map((view) => (
                                <li key={view.componentId} className="flex flex-col gap-2">
                                    <Meter
                            locale={locale}
                                        label={view.name}
                                        value={view.assessed ? view.robustness : 0}
                                        display={
                                            view.assessed
                                                ? ui.outOf100(view.robustness)
                                                : ui.componentUntouched
                                        }
                                    />
                                    <p className="text-xs text-v3-mute">
                                        {view.assessed
                                            ? ui.componentCounts(view.red, view.orange, view.green)
                                            : ui.componentUntested}
                                    </p>
                                </li>
                            ))}
                    </ul>
                </section>

                <section className={panel}>
                    <SectionHeader
                        icon={<Columns3 className="size-5" />}
                        step={ui.step5aLabel}
                        title={ui.outcomesTitle}
                        lead={ui.outcomesLead}
                    />
                    <ul className="flex flex-col gap-6">
                        {[...result.outcomeSubViews]
                            .sort((a, b) => a.robustness - b.robustness)
                            .map((view) => (
                                <li key={`${view.factorId}-${view.outcomeId}`} className="flex flex-col gap-2">
                                    <Meter
                            locale={locale}
                                        label={view.outcomeLabel}
                                        value={view.assessed ? view.robustness : 0}
                                        display={
                                            view.assessed
                                                ? ui.outOf100(view.robustness)
                                                : ui.outcomeNoImpact
                                        }
                                    />
                                    <p className="text-xs text-v3-mute">{view.factorName}</p>
                                </li>
                            ))}
                    </ul>
                </section>
            </div>

            {!!result.patterns.length && (
                <section className={panel}>
                    <SectionHeader
                        icon={<Scale className="size-5" />}
                        step={ui.step5bLabel}
                        title={ui.patternsTitle}
                        lead={ui.patternsLead}
                    />
                    <ul className="grid gap-4 md:grid-cols-2">
                        {result.patterns.map((pattern, index) => {
                            const style = patternStyles[pattern.severity];
                            const Icon = style.icon;
                            return (
                                <li
                                    key={`${pattern.type}-${index}`}
                                    className={`rounded-2xl border p-6 ${style.border}`}
                                >
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase ${style.badge}`}
                                        >
                                            <Icon className="size-3" aria-hidden />
                                            {patternLabels[pattern.type]}
                                        </span>
                                    </div>
                                    <p className="font-medium text-v3-bone">{pattern.title}</p>
                                    <p className="mt-2 text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                                        {pattern.detail}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            <section className={`${panel} border-v3-light/30`}>
                <SectionHeader
                    icon={<ListChecks className="size-5" />}
                    step={ui.step6Label}
                    title={ui.actionsTitle}
                    lead={ui.actionsLead}
                />
                <ol className="grid gap-3 md:grid-cols-2">
                    {result.actions.map((action, index) => (
                        <li
                            key={action.title}
                            className="flex gap-4 rounded-2xl border border-v3-line/60 bg-v3-ink/40 p-5"
                        >
                            <span
                                aria-hidden
                                className="font-v3-display text-2xl leading-none font-light text-v3-light tabular-nums"
                            >
                                {index + 1}
                            </span>
                            <div>
                                <p className="font-medium text-v3-bone">{action.title}</p>
                                <p className="mt-1.5 text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                                    {action.detail}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="rounded-3xl border border-v3-light/30 p-7 md:p-10">
                <h3 className="font-v3-display text-3xl font-light rtl:leading-snug">{ui.ctaTitle}</h3>
                <p className="mt-4 max-w-2xl leading-relaxed text-v3-soft rtl:leading-loose">
                    {ui.ctaBody}
                </p>
                <Link
                    href={ui.bookingHref}
                    className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-v3-bone px-7 font-semibold text-v3-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-v3-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink"
                >
                    {ui.ctaButton} <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden />
                </Link>
            </section>

            <div className="flex flex-col gap-3 rounded-2xl border border-v3-line/60 p-6 text-xs leading-relaxed text-v3-mute rtl:leading-loose">
                <p>
                    <strong className="font-medium text-v3-soft">{ui.methodLabel}</strong>
                    <span dir="ltr">{ui.methodBodyPrefix}</span>{" "}
                    <a
                        href={METHOD_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-v3-light underline-offset-4 hover:underline"
                    >
                        {ui.readPaper}
                    </a>{" "}
                    {ui.methodBodySuffix}
                </p>
                <p>
                    <strong className="font-medium text-v3-soft">{ui.oursLabel}</strong>
                    {ui.oursBody}
                </p>
                <p>
                    <strong className="font-medium text-v3-soft">{ui.limitsLabel}</strong>
                    {ui.limitsBody}
                </p>
            </div>
        </div>
    );
}
