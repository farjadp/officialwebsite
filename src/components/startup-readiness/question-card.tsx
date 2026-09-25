"use client";

import { Question, ReadinessLocale } from "@/data/startup-readiness/config";
import { getReadinessUiStrings } from "@/data/startup-readiness/ui";
import { QuestionBlock, ScaleOptions } from "@/components/v3/tool-kit";

interface QuestionCardProps {
    question: Question;
    value: number | undefined;
    onChange: (value: number) => void;
    index: number;
    locale?: ReadinessLocale;
}

export function QuestionCard({ question, value, onChange, index, locale = "en" }: QuestionCardProps) {
    const scaleOptions = getReadinessUiStrings(locale).scaleLabels.map((label, i) => ({
        value: i + 1,
        label,
    }));

    return (
        <QuestionBlock locale={locale} index={`${index + 1}.`} text={question.text}>
            <ScaleOptions locale={locale}
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
