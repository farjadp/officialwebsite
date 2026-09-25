"use client"

// ============================================================================
// File Path: src/components/public/scorecard-widget.tsx
// Why: The Business Autonomy Score, in the v3 "Light" look. It sits inside
//      the dark article column (and on /scorecard and /fa/scorecard), so it is
//      built out of the v3 tool kit — the same field, button, panel and score
//      ring the ten self-assessment tools use — instead of the old white
//      slate cards.
//
//      The questions, the scoring, the /api/leads POST and the result tiers
//      are the v2 widget's, carried over untouched. What changed since: the
//      look, a failed submit that now tells the visitor, and — as of this
//      pass — the copy living in src/data/scorecard so the widget can be read
//      in Persian. Scoring is per-widget, not per-locale: same questions,
//      same weights, same thresholds.
// Env / Identity: Client Component (framer-motion)
// ============================================================================

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Factory, MonitorUp, Zap } from "lucide-react"
import { ScoreRing, StepIn, ToolButton, ToolField, ToolPanel } from "@/components/v3/tool-kit"
import { ScorecardLocale, ScorecardTier, ScorecardTierId } from "@/data/scorecard/config"
import { getScorecardQuestions, getScorecardTiers, getScorecardUiStrings } from "@/data/scorecard/ui"
import { localePath } from "@/lib/nav"

/** The tier icons live here, not in the data: they are the same in both locales. */
const TIER_ICONS: Record<ScorecardTierId, React.ReactNode> = {
    operator: <Factory className="mx-auto mb-5 h-10 w-10 text-v3-light" strokeWidth={1.5} aria-hidden />,
    scaler: <MonitorUp className="mx-auto mb-5 h-10 w-10 text-v3-light" strokeWidth={1.5} aria-hidden />,
    optimizer: <Zap className="mx-auto mb-5 h-10 w-10 text-v3-light" strokeWidth={1.5} aria-hidden />,
}

export function ScorecardWidget({ locale = "en" }: { locale?: ScorecardLocale }) {
    const t = getScorecardUiStrings(locale)
    const questions = getScorecardQuestions(locale)
    const tiers = getScorecardTiers(locale)

    const [started, setStarted] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [finalResult, setFinalResult] = useState<(ScorecardTier & { score: number }) | null>(null)

    const handleStart = () => setStarted(true)

    const handleSelectOption = (score: number) => {
        const newAnswers = [...answers, score]
        setAnswers(newAnswers)
        if (currentStep < questions.length) {
            setCurrentStep(currentStep + 1)
        }
    }

    const calculateScore = () => answers.reduce((a, b) => a + b, 0)

    const handleSubmitEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsSubmitting(true)
        setSubmitError("")
        const totalScore = calculateScore()

        try {
            await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    score: totalScore,
                    answers,
                }),
            })

            // Determine result Tier based on score
            const resultTier = tiers.find(r => totalScore <= r.maxScore) || tiers[2]
            setFinalResult({ ...resultTier, score: totalScore })
        } catch (error) {
            console.error("Failed to submit score", error)
            setSubmitError(t.submitError)
        }
        setIsSubmitting(false)
    }

    if (!started) {
        return (
            <div className="my-8 flex w-full flex-col items-center gap-5 rounded-2xl border border-v3-line/80 bg-v3-raise p-8 text-center transition-colors duration-500 hover:border-v3-light/50 md:p-10">
                <span className="inline-flex rounded-full border border-v3-light/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-v3-light">
                    {t.introBadge}
                </span>
                <h3 className="font-v3-display text-2xl font-light leading-tight tracking-[-0.015em] text-v3-bone md:text-3xl rtl:leading-snug rtl:tracking-normal">
                    {t.introTitle}
                </h3>
                <p className="max-w-lg text-sm leading-relaxed text-v3-soft md:text-base rtl:leading-loose">
                    {t.introLead}
                </p>
                <ToolButton onClick={handleStart} className="py-4">
                    {t.startButton}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </ToolButton>
            </div>
        )
    }

    if (finalResult) {
        return (
            <div className="my-8 w-full">
                <ToolPanel className="flex flex-col items-center gap-6 text-center">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-v3-mute">{t.resultKicker}</p>
                    <ScoreRing locale={locale} score={finalResult.score} max={100} label={t.profileLabel(finalResult.title)} />
                    <div className="flex flex-col items-center">
                        {TIER_ICONS[finalResult.id]}
                        <h4 className="font-v3-display text-xl font-light leading-tight text-v3-bone md:text-2xl">
                            {finalResult.headline}
                        </h4>
                    </div>
                    <p className="max-w-lg text-sm leading-relaxed text-v3-soft md:text-base rtl:leading-loose">
                        {finalResult.description}
                    </p>
                    <ToolButton onClick={() => { window.location.href = localePath(locale, "/contact") }} className="w-full py-4 sm:w-auto">
                        {t.resultCta}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                    </ToolButton>
                </ToolPanel>
            </div>
        )
    }

    // Lead Capture Step
    if (currentStep === questions.length) {
        return (
            <div className="my-8 w-full">
                <ToolPanel className="flex flex-col gap-7">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <CheckCircle2 className="h-9 w-9 text-v3-light" strokeWidth={1.5} aria-hidden />
                        <h3 className="font-v3-display text-xl font-light leading-tight text-v3-bone md:text-2xl">
                            {t.leadTitle}
                        </h3>
                        <p className="text-sm text-v3-soft md:text-base">
                            {t.leadBody}
                        </p>
                    </div>
                    <form onSubmit={handleSubmitEmail} className="mx-auto flex w-full max-w-sm flex-col gap-4">
                        <ToolField
                            label={t.emailLabel}
                            type="email"
                            dir="ltr"
                            required
                            placeholder={t.emailPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={submitError || undefined}
                        />
                        <ToolButton type="submit" loading={isSubmitting} className="w-full py-4">
                            {isSubmitting ? t.submitting : t.submit}
                        </ToolButton>
                        <p className="text-center text-xs text-v3-mute">{t.noSpam}</p>
                    </form>
                </ToolPanel>
            </div>
        )
    }

    const question = questions[currentStep]
    const progress = ((currentStep) / questions.length) * 100

    return (
        <div className="my-8 w-full rounded-2xl border border-v3-line/80 bg-v3-raise p-6 md:p-8">
            <div className="mb-8 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em]">
                    <span className="text-v3-mute">{t.questionOf(currentStep + 1, questions.length)}</span>
                    <span className="tabular-nums text-v3-light">{t.completed(Math.round(progress))}</span>
                </div>
                <div
                    className="relative h-px bg-v3-line"
                    role="progressbar"
                    aria-label={t.progressLabel}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                >
                    <motion.div
                        className="absolute inset-y-0 start-0 w-full origin-left bg-v3-light shadow-[0_0_10px_rgba(232,196,138,0.7)] rtl:origin-right"
                        initial={false}
                        animate={{ scaleX: progress / 100 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>
            </div>

            <div className="relative">
                <StepIn key={currentStep}>
                        <h4 className="mb-6 font-v3-display text-xl font-light leading-snug text-v3-bone md:text-2xl">
                            {question.q}
                        </h4>
                        <div className="flex flex-col gap-2.5">
                            {question.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectOption(opt.score)}
                                    className="flex min-h-14 w-full items-center rounded-xl border border-v3-line bg-v3-ink px-4 py-3.5 text-start text-sm leading-relaxed text-v3-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-v3-light/60 hover:text-v3-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v3-light md:text-base"
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                </StepIn>
            </div>
        </div>
    )
}
