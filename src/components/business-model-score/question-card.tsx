"use client";

import { BmsLocale, Question } from "@/data/business-model-score/config";
import { getBmsUiStrings } from "@/data/business-model-score/ui";
import { QuestionBlock, ScaleOptions } from "@/components/v3/tool-kit";

interface QuestionCardProps {
    question: Question;
    value: number | undefined;
    onChange: (value: number) => void;
    index: number;
    locale?: BmsLocale;
}

export function QuestionCard({ question, value, onChange, index, locale = "en" }: QuestionCardProps) {
    const ui = getBmsUiStrings(locale);
    const scaleOptions = ui.scaleLabels.map((label, i) => ({ value: i + 1, label }));

    return (
        <QuestionBlock locale={locale} index={`${index + 1}.`} text={question.text}>
            <ScaleOptions locale={locale}
                label={question.text}
                value={value}
                onChange={onChange}
                options={scaleOptions.map((o) => ({ value: o.value, label: o.label, mark: o.value }))}
            />
        </QuestionBlock>
    );
}
