"use client";

import { Question } from "@/data/startup-readiness/config";
import { QuestionBlock, ScaleOptions } from "@/components/v3/tool-kit";

interface QuestionCardProps {
    question: Question;
    value: number | undefined;
    onChange: (value: number) => void;
    index: number;
}

const scaleOptions = [
    { value: 1, label: "Strongly No" },
    { value: 2, label: "Mostly No" },
    { value: 3, label: "Partly / Unclear" },
    { value: 4, label: "Mostly Yes" },
    { value: 5, label: "Strongly Yes" },
];

export function QuestionCard({ question, value, onChange, index }: QuestionCardProps) {
    return (
        <QuestionBlock index={`${index + 1}.`} text={question.text}>
            <ScaleOptions
                label={question.text}
                value={value}
                onChange={onChange}
                options={scaleOptions.map((option) => ({
                    value: option.value,
                    mark: option.value,
                    label: option.label,
                }))}
            />
        </QuestionBlock>
    );
}
