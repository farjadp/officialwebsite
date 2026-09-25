"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BmLocale, StressFactor } from "@/data/business-model-stress-test/config";
import { BmUiStrings, getBmUiStrings } from "@/data/business-model-stress-test/ui";
import {
    HeatMapCell,
    ImpactColor,
    getBusinessModelContent,
} from "@/data/business-model-stress-test/logic";

// Intensity is carried by the single accent's opacity (the more severe the
// impact, the brighter the cell) plus the label written in every cell, so
// the map never depends on telling hues apart.
type ColorStyle = { cell: string; swatch: string; label: string; meaning: string };

const colorClasses: Record<ImpactColor, { cell: string; swatch: string }> = {
    red: { cell: "bg-v3-light/80 text-v3-ink hover:bg-v3-light/90", swatch: "bg-v3-light/80" },
    orange: { cell: "bg-v3-light/50 text-v3-ink hover:bg-v3-light/60", swatch: "bg-v3-light/50" },
    green: { cell: "bg-v3-light/15 text-v3-bone hover:bg-v3-light/25", swatch: "bg-v3-light/15" },
    grey: {
        cell: "border border-dashed border-v3-line bg-transparent text-v3-mute hover:border-v3-mute",
        swatch: "border border-dashed border-v3-mute",
    },
};

function colorStylesFor(ui: BmUiStrings): Record<ImpactColor, ColorStyle> {
    return {
        red: { ...colorClasses.red, label: ui.severityRed, meaning: ui.severityRedMeaning },
        orange: {
            ...colorClasses.orange,
            label: ui.severityOrange,
            meaning: ui.severityOrangeMeaning,
        },
        green: { ...colorClasses.green, label: ui.severityGreen, meaning: ui.severityGreenMeaning },
        grey: { ...colorClasses.grey, label: ui.severityGrey, meaning: ui.severityGreyMeaning },
    };
}

const ARRIVE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeatMapLegend({ locale = "en" }: { locale?: BmLocale }) {
    const colorStyles = colorStylesFor(getBmUiStrings(locale));
    return (
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(colorStyles) as ImpactColor[]).map((color) => (
                <div key={color} className="rounded-2xl border border-v3-line/80 p-4">
                    <dt className="flex items-center gap-2 text-sm font-medium text-v3-bone">
                        <span aria-hidden className={`size-3.5 shrink-0 rounded-sm ${colorStyles[color].swatch}`} />
                        {colorStyles[color].label}
                    </dt>
                    <dd className="mt-1.5 text-xs leading-relaxed text-v3-mute rtl:leading-loose">
                        {colorStyles[color].meaning}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

interface HeatMapProps {
    factors: StressFactor[];
    componentIds: string[];
    cells: HeatMapCell[];
    locale?: BmLocale;
}

export function HeatMap({ factors, componentIds, cells, locale = "en" }: HeatMapProps) {
    const ui = getBmUiStrings(locale);
    const content = getBusinessModelContent(locale);
    const colorStyles = colorStylesFor(ui);
    const [selected, setSelected] = useState<HeatMapCell | null>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const inView = useInView(wrapRef, { once: true, margin: "0px 0px -10% 0px" });
    const reduce = useReducedMotion();
    const columns = factors.reduce((total, factor) => total + factor.outcomes.length, 0);

    const componentName = (id: string) =>
        content.components.find((item) => item.id === id)?.name ?? id;
    const cellAt = (componentId: string, factorId: string, outcomeId: "a" | "b") =>
        cells.find(
            (cell) =>
                cell.componentId === componentId &&
                cell.factorId === factorId &&
                cell.outcomeId === outcomeId
        );

    const selectedFactor = selected
        ? factors.find((factor) => factor.id === selected.factorId)
        : null;
    const selectedOutcome = selectedFactor?.outcomes.find(
        (outcome) => outcome.id === selected?.outcomeId
    );

    return (
        <div ref={wrapRef}>
            <div className="overflow-x-auto rounded-2xl border border-v3-line/80">
                <table className="w-full min-w-[720px] border-collapse text-start">
                    <thead>
                        <tr>
                            <th
                                rowSpan={2}
                                className="sticky start-0 z-10 w-48 border-b border-v3-line bg-v3-raise p-4 text-start align-bottom text-xs font-medium tracking-wider text-v3-mute uppercase"
                            >
                                {ui.heatMapColumnHeader}
                            </th>
                            {factors.map((factor) => (
                                <th
                                    key={factor.id}
                                    colSpan={2}
                                    className="border-b border-s border-v3-line p-3 text-center text-xs font-medium text-v3-bone"
                                >
                                    {factor.name}
                                    <span className="mt-0.5 block text-[10px] font-normal tracking-wider text-v3-mute uppercase">
                                        {content.perspectiveLabels[factor.perspective]}
                                    </span>
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {factors.flatMap((factor) =>
                                factor.outcomes.map((outcome, index) => (
                                    <th
                                        key={`${factor.id}-${outcome.id}`}
                                        className={`w-28 border-b border-v3-line p-2 text-start align-bottom text-[11px] leading-snug font-normal text-v3-soft ${
                                            index === 0 ? "border-s" : ""
                                        }`}
                                    >
                                        {outcome.label}
                                    </th>
                                ))
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {componentIds.map((componentId, rowIndex) => {
                            let columnIndex = -1;
                            return (
                                <tr key={componentId} className="group">
                                    <th
                                        scope="row"
                                        className="sticky start-0 z-10 border-b border-v3-line/60 bg-v3-raise p-4 text-start text-sm font-medium text-v3-bone group-last:border-b-0"
                                    >
                                        {componentName(componentId)}
                                    </th>
                                    {factors.flatMap((factor) =>
                                        factor.outcomes.map((outcome, index) => {
                                            columnIndex += 1;
                                            const cell = cellAt(componentId, factor.id, outcome.id);
                                            if (!cell) return null;
                                            const isSelected =
                                                selected?.componentId === cell.componentId &&
                                                selected?.factorId === cell.factorId &&
                                                selected?.outcomeId === cell.outcomeId;
                                            const order = rowIndex * columns + columnIndex;
                                            return (
                                                <td
                                                    key={`${componentId}-${factor.id}-${outcome.id}`}
                                                    className={`border-b border-v3-line/60 p-1.5 group-last:border-b-0 ${
                                                        index === 0 ? "border-s border-s-v3-line" : ""
                                                    }`}
                                                >
                                                    <motion.button
                                                        type="button"
                                                        onClick={() => setSelected(isSelected ? null : cell)}
                                                        aria-pressed={isSelected}
                                                        aria-label={ui.cellAria(
                                                            componentName(componentId),
                                                            factor.name,
                                                            outcome.label,
                                                            colorStyles[cell.color].label
                                                        )}
                                                        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                                                        animate={
                                                            reduce || inView
                                                                ? { opacity: 1, scale: 1 }
                                                                : { opacity: 0, scale: 0.85 }
                                                        }
                                                        transition={
                                                            reduce
                                                                ? { duration: 0 }
                                                                : {
                                                                      duration: 0.45,
                                                                      ease: ARRIVE,
                                                                      delay: Math.min(order * 0.018, 1.4),
                                                                  }
                                                        }
                                                        className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-md px-1 text-center text-[11px] leading-tight font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-bone focus-visible:ring-offset-2 focus-visible:ring-offset-v3-ink ${
                                                            colorStyles[cell.color].cell
                                                        } ${isSelected ? "ring-2 ring-v3-bone ring-offset-2 ring-offset-v3-ink" : ""}`}
                                                    >
                                                        <span aria-hidden>{colorStyles[cell.color].label}</span>
                                                    </motion.button>
                                                </td>
                                            );
                                        })
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div aria-live="polite" className="mt-4 rounded-2xl border border-v3-line/80 bg-v3-ink/40 p-5">
                {selected && selectedFactor && selectedOutcome ? (
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${colorStyles[selected.color].cell}`}
                            >
                                {colorStyles[selected.color].label}
                            </span>
                            <span className="text-sm font-medium text-v3-bone">
                                {componentName(selected.componentId)}
                            </span>
                            <span className="text-sm text-v3-mute">{ui.under}</span>
                            <span className="text-sm text-v3-soft">
                                {selectedFactor.name} → {selectedOutcome.label}
                            </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-v3-soft rtl:leading-loose">
                            {selected.reasoning}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-v3-mute">{ui.reasoningPlaceholder}</p>
                )}
            </div>
        </div>
    );
}
