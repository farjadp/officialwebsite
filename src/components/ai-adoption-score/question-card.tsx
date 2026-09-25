"use client";

import { Question } from "@/data/ai-adoption-score/config";
import { QuestionBlock, ScaleOptions } from "@/components/v3/tool-kit";

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
        <QuestionBlock index={`${index + 1}.`} text={question.text}>
            <ScaleOptions
                label={question.text}
                value={value}
                onChange={onChange}
                options={scaleOptions.map((o) => ({ value: o.value, label: o.label, mark: o.value }))}
            />
        </QuestionBlock>
    );
}
