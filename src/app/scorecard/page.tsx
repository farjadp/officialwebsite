"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle2, Factory, MonitorUp, Zap } from "lucide-react"

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
            icon: <Factory className="w-12 h-12 text-rose-500 mb-4" />,
            headline: "You are the bottleneck in your own business.",
            description: "Right now, your business runs on sheer brute force. You are relying on human memory, scattered spreadsheets, and manual data entry just to keep the lights on. This is why scaling feels impossible—you aren't scaling systems; you are just scaling stress. Before we can even talk about deploying AI, we need to stop the bleeding. It is time to digitize your operations and build actual infrastructure."
        },
        {
            maxScore: 75,
            title: "The Scaler",
            icon: <MonitorUp className="w-12 h-12 text-amber-500 mb-4" />,
            headline: "You have a foundation, but your systems are disconnected.",
            description: "You aren't starting from zero. You use modern tools, you have some SOPs in place, and you are actively trying to be efficient. But your tools aren't talking to each other. You have fragmented funnels, isolated software, and your team is still acting as the 'glue' between different systems. You don't need another SaaS subscription—you need orchestration. It's time to connect your infrastructure so it runs on its own."
        },
        {
            maxScore: 100,
            title: "The Optimizer",
            icon: <Zap className="w-12 h-12 text-emerald-500 mb-4" />,
            headline: "Ready for True Autonomy.",
            description: "Your infrastructure is solid. You have removed the obvious manual bottlenecks, your team follows clear SOPs, and your data flows smoothly. You are the exact type of founder who will see massive ROI from AI Automation. It's time to stop using humans for repetitive tasks that a machine can do perfectly 24/7. We need to look at deploying custom AI agents to handle your customer support, complex data parsing, and high-level workflow orchestration."
        }
    ]
}

export default function ScorecardPage() {
    const [started, setStarted] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
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
        }
        setIsSubmitting(false)
    }

    if (!started) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">
                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-6">
                    Diagnostic Scorecard
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                    Is your business ready for AI?
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                    Take this 2-minute assessment to find out if your operations are built for massive scale, or if you are quietly losing capital to manual chaos.
                </p>
                <Button size="lg" className="h-14 px-8 text-lg bg-[#1B4B43] hover:bg-[#123630] transition-colors" onClick={handleStart}>
                    Start the Assessment <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        )
    }

    if (finalResult) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
                    <Card className="border-0 shadow-2xl overflow-hidden">
                        <div className="bg-[#1B4B43] p-8 text-center text-white">
                            <h2 className="text-sm font-medium uppercase tracking-wider mb-2 opacity-80">Your Autonomy Score</h2>
                            <div className="text-7xl font-black mb-2">{finalResult.score} <span className="text-2xl font-normal opacity-50">/ 100</span></div>
                            <p className="text-xl font-medium">Profile: {finalResult.title}</p>
                        </div>
                        <CardContent className="p-10 text-center flex flex-col items-center">
                            {finalResult.icon}
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{finalResult.headline}</h3>
                            <p className="text-slate-600 leading-relaxed text-lg mb-8">
                                {finalResult.description}
                            </p>
                            <Button size="lg" className="w-full h-14 text-lg bg-[#1B4B43]" onClick={() => window.location.href = '/contact'}>
                                Schedule a Strategy Call
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    // Lead Capture Step
    if (currentStep === quizData.questions.length) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                    <Card className="border-0 shadow-xl overflow-hidden">
                        <div className="bg-[#1B4B43] p-6 text-white text-center">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-90" />
                            <h2 className="text-2xl font-bold">Analysis Complete</h2>
                            <p className="text-sm opacity-80 mt-2">Where should we send your detailed technical blueprint?</p>
                        </div>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmitEmail} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Work Email Address</label>
                                    <Input
                                        type="email"
                                        required
                                        placeholder="founder@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12"
                                    />
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-[#1B4B43]">
                                    {isSubmitting ? "Calculating Results..." : "Unlock My Score"}
                                </Button>
                                <p className="text-xs text-center text-slate-400 mt-4">We respect your privacy. No spam.</p>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
    }

    const question = quizData.questions[currentStep]
    const progress = ((currentStep) / quizData.questions.length) * 100

    return (
        <div className="min-h-[80vh] flex flex-col items-center py-20 p-6">
            <div className="w-full max-w-3xl mb-12">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-4">
                    <span>Question {currentStep + 1} of {quizData.questions.length}</span>
                    <span>{Math.round(progress)}% Completed</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-100" />
            </div>

            <div className="w-full max-w-3xl relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 leading-tight">
                            {question.q}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {question.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectOption(opt.score)}
                                    className="text-left w-full p-6 rounded-xl border-2 border-slate-100 bg-white hover:border-[#1B4B43] hover:bg-emerald-50/30 transition-all font-medium text-lg text-slate-700 shadow-sm"
                                >
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
