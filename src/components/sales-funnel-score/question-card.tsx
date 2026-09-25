"use client";

import { Question, SalesFunnelLocale } from "@/data/sales-funnel-score/config";
import { getSalesFunnelUiStrings } from "@/data/sales-funnel-score/ui";
import { QuestionBlock, ScaleOptions, type ScaleOption } from "@/components/v3/tool-kit";

interface QuestionCardProps {
    question: Question;
    value: number | undefined;
    onChange: (value: number) => void;
    index: number;
    locale?: SalesFunnelLocale;
}

export function QuestionCard({ question, value, onChange, index, locale = "en" }: QuestionCardProps) {
    const ui = getSalesFunnelUiStrings(locale);

    const scaleOptions: ScaleOption<number>[] = ui.scaleLabels.map((label, i) => ({
        value: i + 1,
        mark: ui.num(i + 1),
        label,
    }));

    return (
        <QuestionBlock locale={locale} index={`${ui.num(index + 1)}.`} text={question.text}>
            <ScaleOptions locale={locale} options={scaleOptions} value={value} onChange={onChange} label={question.text} />
        </QuestionBlock>
    );
}
