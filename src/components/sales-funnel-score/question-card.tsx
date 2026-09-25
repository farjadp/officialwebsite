"use client";

import { Question } from "@/data/sales-funnel-score/config";
import { QuestionBlock, ScaleOptions, type ScaleOption } from "@/components/v3/tool-kit";

interface QuestionCardProps {
    question: Question;
    value: number | undefined;
    onChange: (value: number) => void;
    index: number;
}

const scaleOptions: ScaleOption<number>[] = [
    { value: 1, mark: 1, label: "Not true at all" },
    { value: 2, mark: 2, label: "Mostly false" },
    { value: 3, mark: 3, label: "Partly true" },
    { value: 4, mark: 4, label: "Mostly true" },
    { value: 5, mark: 5, label: "Completely true" },
];

export function QuestionCard({ question, value, onChange, index }: QuestionCardProps) {
    return (
        <QuestionBlock index={`${index + 1}.`} text={question.text}>
            <ScaleOptions options={scaleOptions} value={value} onChange={onChange} label={question.text} />
        </QuestionBlock>
    );
}
