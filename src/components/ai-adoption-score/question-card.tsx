"use client";

import { Question } from "@/data/ai-adoption-score/config";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: Question;
    value: number | undefined;
    onChange: (value: number) => void;
    index: number;
}

const scaleOptions = [
    { value: 1, label: "Not true at all" },
    { value: 2, label: "Mostly not true" },
    { value: 3, label: "Partly true" },
    { value: 4, label: "Mostly true" },
    { value: 5, label: "Completely true" },
];

export function QuestionCard({ question, value, onChange, index }: QuestionCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-base font-medium text-slate-800 mb-5 leading-snug">
                <span className="text-slate-300 mr-2 font-bold">{index + 1}.</span>
                {question.text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {scaleOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 text-center",
                            value === option.value
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700 scale-[1.03]"
                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                        )}
                    >
                        <span className="text-xl font-bold mb-1">{option.value}</span>
                        <span className="text-[10px] font-medium leading-tight">{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
