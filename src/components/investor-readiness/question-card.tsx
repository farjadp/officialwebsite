"use client";

import { InvestorLocale, Question } from "@/data/investor-readiness/config";
import { getInvestorUiStrings } from "@/data/investor-readiness/ui";
import { QuestionBlock, ScaleOptions } from "@/components/v3/tool-kit";

interface QuestionCardProps {
    question: Question;
    value: number | undefined;
    onChange: (value: number) => void;
    index: number;
    locale?: InvestorLocale;
}

export function QuestionCard({ question, value, onChange, index, locale = "en" }: QuestionCardProps) {
    const scaleOptions = getInvestorUiStrings(locale).scaleLabels.map((label, i) => ({
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
