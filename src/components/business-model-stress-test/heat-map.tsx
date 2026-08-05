"use client";

import { useState } from "react";
import { StressFactor, businessModelComponents } from "@/data/business-model-stress-test/config";
import { HeatMapCell, ImpactColor } from "@/data/business-model-stress-test/logic";

const colorStyles: Record<ImpactColor, { cell: string; dot: string; label: string; meaning: string }> =
    {
        red: {
            cell: "bg-red-500 hover:bg-red-600",
            dot: "bg-red-500",
            label: "Not feasible",
            meaning: "The component can no longer be implemented — a potential showstopper.",
        },
        orange: {
            cell: "bg-amber-500 hover:bg-amber-600",
            dot: "bg-amber-500",
            label: "Not viable",
            meaning: "It can still be done, but the choices behind it no longer pay off.",
        },
        green: {
            cell: "bg-emerald-500 hover:bg-emerald-600",
            dot: "bg-emerald-500",
            label: "Holds up",
            meaning: "Affected, but not negatively — it may even get stronger.",
        },
        grey: {
            cell: "bg-stone-200 hover:bg-stone-300",
            dot: "bg-stone-300",
            label: "No impact",
            meaning: "No causal relationship between this outcome and this component.",
        },
    };

export function HeatMapLegend() {
    return (
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(colorStyles) as ImpactColor[]).map((color) => (
                <div key={color} className="rounded-2xl border border-stone-200 bg-white p-4">
                    <dt className="flex items-center gap-2 text-sm font-bold text-[#0F3F35]">
                        <span className={`size-3 rounded-sm ${colorStyles[color].dot}`} />
                        {colorStyles[color].label}
                    </dt>
                    <dd className="mt-1.5 text-xs leading-relaxed text-stone-500">
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
}

export function HeatMap({ factors, componentIds, cells }: HeatMapProps) {
    const [selected, setSelected] = useState<HeatMapCell | null>(null);

    const componentName = (id: string) =>
        businessModelComponents.find((item) => item.id === id)?.name ?? id;
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
        <div>
            <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
                <table className="w-full min-w-[720px] border-collapse text-left">
                    <thead>
                        <tr>
                            <th
                                rowSpan={2}
                                className="sticky left-0 z-10 w-48 border-b border-stone-200 bg-white p-4 align-bottom text-xs font-bold tracking-wider text-stone-400 uppercase"
                            >
                                Business model
                            </th>
                            {factors.map((factor) => (
                                <th
                                    key={factor.id}
                                    colSpan={2}
                                    className="border-b border-l border-stone-200 bg-stone-50 p-3 text-center text-xs font-bold text-[#0F3F35]"
                                >
                                    {factor.name}
                                    <span className="mt-0.5 block text-[10px] font-medium tracking-wider text-stone-400 uppercase">
                                        {factor.perspective}
                                    </span>
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {factors.flatMap((factor) =>
                                factor.outcomes.map((outcome, index) => (
                                    <th
                                        key={`${factor.id}-${outcome.id}`}
                                        className={`w-28 border-b border-stone-200 p-2 align-bottom text-[11px] leading-snug font-medium text-stone-600 ${
                                            index === 0 ? "border-l" : ""
                                        }`}
                                    >
                                        {outcome.label}
                                    </th>
                                ))
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {componentIds.map((componentId) => (
                            <tr key={componentId} className="group">
                                <th
                                    scope="row"
                                    className="sticky left-0 z-10 border-b border-stone-100 bg-white p-4 text-sm font-bold text-[#0F3F35] group-last:border-b-0"
                                >
                                    {componentName(componentId)}
                                </th>
                                {factors.flatMap((factor) =>
                                    factor.outcomes.map((outcome, index) => {
                                        const cell = cellAt(componentId, factor.id, outcome.id);
                                        if (!cell) return null;
                                        const isSelected =
                                            selected?.componentId === cell.componentId &&
                                            selected?.factorId === cell.factorId &&
                                            selected?.outcomeId === cell.outcomeId;
                                        return (
                                            <td
                                                key={`${componentId}-${factor.id}-${outcome.id}`}
                                                className={`border-b border-stone-100 p-1.5 group-last:border-b-0 ${
                                                    index === 0 ? "border-l border-l-stone-200" : ""
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setSelected(isSelected ? null : cell)}
                                                    aria-label={`${componentName(componentId)} under ${factor.name}, ${outcome.label}: ${colorStyles[cell.color].label}`}
                                                    className={`h-10 w-full cursor-pointer rounded-md transition-all ${
                                                        colorStyles[cell.color].cell
                                                    } ${isSelected ? "ring-2 ring-[#0F3F35] ring-offset-2" : ""}`}
                                                />
                                            </td>
                                        );
                                    })
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-5">
                {selected && selectedFactor && selectedOutcome ? (
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white ${colorStyles[selected.color].cell.split(" ")[0]}`}
                            >
                                {colorStyles[selected.color].label}
                            </span>
                            <span className="text-sm font-bold text-[#0F3F35]">
                                {componentName(selected.componentId)}
                            </span>
                            <span className="text-sm text-stone-400">under</span>
                            <span className="text-sm font-medium text-stone-600">
                                {selectedFactor.name} → {selectedOutcome.label}
                            </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-stone-600">
                            {selected.reasoning}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-stone-500">
                        Select any square to read why it was coloured that way. The reasoning behind each
                        cell — not the colour itself — is what the redesign is built on.
                    </p>
                )}
            </div>
        </div>
    );
}
