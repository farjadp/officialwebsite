import { Question } from "@/data/investor-readiness/config";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: Question;
    value: number | undefined;
    onChange: (value: number) => void;
    index: number;
}

const scaleOptions = [
    { value: 1, label: "Not at all true" },
    { value: 2, label: "Mostly false" },
    { value: 3, label: "Partially true" },
    { value: 4, label: "Mostly true" },
    { value: 5, label: "Completely true" },
];

export function QuestionCard({ question, value, onChange, index }: QuestionCardProps) {
    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm mb-4 transition-all hover:shadow-md">
            <h3 className="text-lg font-medium text-slate-800 mb-4">
                <span className="text-slate-400 mr-2">{index + 1}.</span>
                {question.text}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-3">
                {scaleOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-center",
                            value === option.value
                                ? "border-primary bg-primary/5 text-primary scale-[1.02]"
                                : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-slate-100"
                        )}
                    >
                        <span className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">{option.value}</span>
                        <span className="text-[11px] sm:text-xs font-medium leading-tight max-w-[90%] mx-auto">{option.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
