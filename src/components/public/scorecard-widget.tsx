"use client"

// ============================================================================
// File Path: src/components/public/scorecard-widget.tsx
// Why: The Business Autonomy Score, in the v3 "Light" look. It sits inside
//      the dark article column (and on /scorecard), so it is built out of the
//      v3 tool kit — the same field, button, panel and score ring the ten
//      self-assessment tools use — instead of the old white slate cards.
//
//      The questions, the scoring, the /api/leads POST and the result tiers
//      are the v2 widget's, carried over untouched. Only the look changed,
//      plus one fix: a failed submit now tells the visitor instead of
//      silently leaving the button idle.
// Env / Identity: Client Component (framer-motion)
// ============================================================================

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Factory, MonitorUp, Zap } from "lucide-react"
import { ScoreRing, StepIn, ToolButton, ToolField, ToolPanel } from "@/components/v3/tool-kit"

const quizData = {
    title: "The Business Autonomy Score",
    questions: [
        {
            q: "How do you currently handle customer inquiries after hours?",
            options: [
                { text: "We don't. They wait until morning.", score: 1 },
                { text: "We have an auto-responder or FAQ link.", score: 5 },
                { text: "An AI agent handles 80% of them instantly and routes the rest.", score: 10 }
            ]
        },
        {
            q: "If a key operational employee called in sick for two weeks, what would happen?",
            options: [
                { text: "Total panic. Critical processes exist only in their head.", score: 1 },
                { text: "Things would slow down, but we'd manage using our basic SOPs.", score: 5 },
                { text: "Not much. Automated systems and documented workflows keep things moving.", score: 10 }
            ]
        },
        {
            q: "How does data move between your sales CRM and your fulfillment/accounting software?",
            options: [
                { text: "Someone physically copies and pastes or re-enters the data.", score: 1 },
                { text: "We use basic Zapier/Make automations, but they break occasionally.", score: 5 },
                { text: "A robust, automated pipeline orchestrates the entire data flow seamlessly.", score: 10 }
            ]
        },
        {
            q: "How much time does leadership spend on recurring, predictable admin tasks every week?",
            options: [
                { text: "More than 15 hours. We are bogged down in the weeds.", score: 1 },
                { text: "5 to 15 hours. We've delegated some, but still oversee too much.", score: 5 },
                { text: "Less than 5 hours. We focus almost entirely on strategy, growth, and leverage.", score: 10 }
            ]
        },
        {
            q: "How do you track the status of current projects or client deliverables?",
            options: [
                { text: "Through chaotic Slack channels, long email threads, and verbal updates.", score: 1 },
                { text: "Using a project management tool, but it requires manual updating by the team.", score: 5 },
                { text: "Through a centralized dashboard that updates automatically based on system triggers.", score: 10 }
            ]
        },
        {
            q: "When onboarding a new client, what does the process look like?",
            options: [
                { text: "Custom emails, manual document creation, and a lot of back-and-forth.", score: 1 },
                { text: "A standardized email sequence and some templated forms.", score: 5 },
                { text: "A frictionless, automated portal that handles intake, contracts, and provisioning.", score: 10 }
            ]
        },
        {
            q: "How does your business handle lead qualification?",
            options: [
                { text: "We get on calls with almost everyone, regardless of fit.", score: 1 },
                { text: "We have a website form that filters out the obvious bad fits.", score: 5 },
                { text: "An intelligent bot pre-qualifies, answers initial questions, and only routes hot leads to sales.", score: 10 }
            ]
        },
        {
            q: "Where does your company's core knowledge and standard operating procedures (SOPs) live?",
            options: [
                { text: "Scattered across Google Docs, personal hard drives, and people's brains.", score: 1 },
                { text: "In a centralized system (like Notion), but it's updated sporadically.", score: 5 },
                { text: "In a living knowledge base that an internal AI assistant can instantly query across.", score: 10 }
            ]
        },
        {
            q: "When organizing financial data or invoices for month-end reconciliation, your team typically:",
            options: [
                { text: "Spends days manually cross-checking Excel sheets, PDFs, and emails.", score: 1 },
                { text: "Uses modern software, but still relies on manual categorization and entry.", score: 5 },
                { text: "Has an automated pipeline where invoices are parsed, categorized, and synced instantly.", score: 10 }
            ]
        },
        {
            q: "What is your primary stance on integrating AI into your business today?",
            options: [
                { text: "I don't know where to start, and I'm worried about breaking what we have.", score: 1 },
                { text: "My team uses ChatGPT occasionally, but we lack a cohesive infrastructure strategy.", score: 5 },
                { text: "We are actively looking to deploy custom AI agents to replace complex manual workflows.", score: 10 }
            ]
        }
    ],
    results: [
        {
            maxScore: 40,
            title: "The Operator",
            icon: <Factory className="mx-auto mb-5 h-10 w-10 text-v3-light" strokeWidth={1.5} aria-hidden />,
            headline: "You are the bottleneck in your own business.",
            description: "Right now, your business runs on sheer brute force. You are relying on human memory, scattered spreadsheets, and manual data entry just to keep the lights on. This is why scaling feels impossible—you aren't scaling systems; you are just scaling stress. Before we can even talk about deploying AI, we need to stop the bleeding. It is time to digitize your operations and build actual infrastructure."
        },
        {
            maxScore: 75,
            title: "The Scaler",
            icon: <MonitorUp className="mx-auto mb-5 h-10 w-10 text-v3-light" strokeWidth={1.5} aria-hidden />,
            headline: "You have a foundation, but your systems are disconnected.",
            description: "You aren't starting from zero. You use modern tools, you have some SOPs in place, and you are actively trying to be efficient. But your tools aren't talking to each other. You have fragmented funnels, isolated software, and your team is still acting as the 'glue' between different systems. You don't need another SaaS subscription—you need orchestration. It's time to connect your infrastructure so it runs on its own."
        },
        {
            maxScore: 100,
            title: "The Optimizer",
            icon: <Zap className="mx-auto mb-5 h-10 w-10 text-v3-light" strokeWidth={1.5} aria-hidden />,
            headline: "Ready for True Autonomy.",
            description: "Your infrastructure is solid. You have removed the obvious manual bottlenecks, your team follows clear SOPs, and your data flows smoothly. You are the exact type of founder who will see massive ROI from AI Automation. It's time to stop using humans for repetitive tasks that a machine can do perfectly 24/7. We need to look at deploying custom AI agents to handle your customer support, complex data parsing, and high-level workflow orchestration."
        }
    ]
}

export function ScorecardWidget() {
    const [started, setStarted] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState("")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [finalResult, setFinalResult] = useState<any>(null)

    const handleStart = () => setStarted(true)

    const handleSelectOption = (score: number) => {
        const newAnswers = [...answers, score]
        setAnswers(newAnswers)
        if (currentStep < quizData.questions.length) {
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
            const resultTier = quizData.results.find(r => totalScore <= r.maxScore) || quizData.results[2]
            setFinalResult({ ...resultTier, score: totalScore })
        } catch (error) {
            console.error("Failed to submit score", error)
            setSubmitError("Something went wrong. Please try again.")
        }
        setIsSubmitting(false)
    }

    if (!started) {
        return (
            <div className="my-8 flex w-full flex-col items-center gap-5 rounded-2xl border border-v3-line/80 bg-v3-raise p-8 text-center transition-colors duration-500 hover:border-v3-light/50 md:p-10">
                <span className="inline-flex rounded-full border border-v3-light/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-v3-light">
                    Diagnostic Tool
                </span>
                <h3 className="font-v3-display text-2xl font-light leading-tight tracking-[-0.015em] text-v3-bone md:text-3xl rtl:leading-snug rtl:tracking-normal">
                    Is your business ready for AI?
                </h3>
                <p className="max-w-lg text-sm leading-relaxed text-v3-soft md:text-base rtl:leading-loose">
                    Take this 2-minute assessment to find out if your operations are built for massive scale, or if you are quietly losing capital to manual chaos.
                </p>
                <ToolButton onClick={handleStart} className="py-4">
                    Start the Assessment
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                </ToolButton>
            </div>
        )
    }

    if (finalResult) {
        return (
            <div className="my-8 w-full">
                <ToolPanel className="flex flex-col items-center gap-6 text-center">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-v3-mute">Your Autonomy Score</p>
                    <ScoreRing score={finalResult.score} max={100} label={`Profile: ${finalResult.title}`} />
                    <div className="flex flex-col items-center">
                        {finalResult.icon}
                        <h4 className="font-v3-display text-xl font-light leading-tight text-v3-bone md:text-2xl">
                            {finalResult.headline}
                        </h4>
                    </div>
                    <p className="max-w-lg text-sm leading-relaxed text-v3-soft md:text-base rtl:leading-loose">
                        {finalResult.description}
                    </p>
                    <ToolButton onClick={() => window.location.href = '/contact'} className="w-full py-4 sm:w-auto">
                        Schedule a Strategy Call
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
                    </ToolButton>
                </ToolPanel>
            </div>
        )
    }

    // Lead Capture Step
    if (currentStep === quizData.questions.length) {
        return (
            <div className="my-8 w-full">
                <ToolPanel className="flex flex-col gap-7">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <CheckCircle2 className="h-9 w-9 text-v3-light" strokeWidth={1.5} aria-hidden />
                        <h3 className="font-v3-display text-xl font-light leading-tight text-v3-bone md:text-2xl">
                            Analysis Complete
                        </h3>
                        <p className="text-sm text-v3-soft md:text-base">
                            Where should we send your detailed technical blueprint?
                        </p>
                    </div>
                    <form onSubmit={handleSubmitEmail} className="mx-auto flex w-full max-w-sm flex-col gap-4">
                        <ToolField
                            label="Work Email Address"
                            type="email"
                            dir="ltr"
                            required
                            placeholder="founder@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={submitError || undefined}
                        />
                        <ToolButton type="submit" loading={isSubmitting} className="w-full py-4">
                            {isSubmitting ? "Calculating Results..." : "Unlock My Score"}
                        </ToolButton>
                        <p className="text-center text-xs text-v3-mute">We respect your privacy. No spam.</p>
                    </form>
                </ToolPanel>
            </div>
        )
    }

    const question = quizData.questions[currentStep]
    const progress = ((currentStep) / quizData.questions.length) * 100

    return (
        <div className="my-8 w-full rounded-2xl border border-v3-line/80 bg-v3-raise p-6 md:p-8">
            <div className="mb-8 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em]">
                    <span className="text-v3-mute">Question {currentStep + 1} of {quizData.questions.length}</span>
                    <span className="tabular-nums text-v3-light">{Math.round(progress)}% Completed</span>
                </div>
                <div
                    className="relative h-px bg-v3-line"
                    role="progressbar"
                    aria-label="Assessment progress"
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
