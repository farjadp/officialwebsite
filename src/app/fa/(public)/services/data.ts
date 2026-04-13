// ============================================================================
// Hardware Source: data.ts
// Version: 1.0.0 — 2026-02-24
// Why: Static content payload provider
// Env / Identity: TypeScript Module
// ============================================================================

import { Compass, Lightbulb, Zap, Key } from "lucide-react";

export const SERVICES = [
    {
        id: "startup-visa",
        title: "Startup Visa Readiness & Strategy",
        for: "Immigrant founders preparing for or currently in the SUV program.",
        icon: Compass,
        whatYouGet: [
            "Objective audit of your concept against SUV expectations.",
            "Strategic pivot advice (if your idea lacks innovation or scale).",
            "Roadmap to early traction and customer discovery.",
            "Mock interviews and pitch deck tear-downs.",
            "Guidance on navigating the incubator/designated organization landscape."
        ],
        outcomes: [
            "A defensible, realistic business case.",
            "Higher confidence in incubator meetings.",
            "Clarity on what you actually need to build."
        ]
    },
    {
        id: "founder-advisory",
        title: "Founder Strategic Advisory",
        for: "Early-stage founders who need a sparring partner, not a cheerleader.",
        icon: Lightbulb,
        whatYouGet: [
            "Rigorous validation of your Go-To-Market (GTM) strategy.",
            "Identification of deadly assumptions in your business model.",
            "Frameworks for prioritizing product features (the MVP axe).",
            "Tactics for initial user acquisition without paid ads.",
            "Direct, unvarnished feedback on your execution speed."
        ],
        outcomes: [
            "Stop building features nobody wants.",
            "A structured, repeatable path to your first 10-100 customers.",
            "Faster decision-making cycles."
        ]
    },
    {
        id: "digital-systems",
        title: "Digital & AI Business Systems",
        for: "SME owners who are bottlenecked by manual work and poor technology.",
        icon: Zap,
        whatYouGet: [
            "Audit of your current tech stack and operational workflows.",
            "Identification of high-leverage automation opportunities.",
            "Architecture design for AI integration (Customer Service, Data Entry).",
            "Vendor selection and technology roadmapping.",
            "Risk assessment and security baseline recommendations."
        ],
        outcomes: [
            "Reclaim 10+ hours a week from repetitive tasks.",
            "A scalable digital infrastructure that supports growth.",
            "Reduced operational risk and human error."
        ]
    },
    {
        id: "private-mentorship",
        title: "Private Mentorship",
        isLimited: true,
        for: "High-potential founders requiring ongoing, deep-dive support.",
        icon: Key,
        whatYouGet: [
            "Weekly 1-on-1 strategy sessions (1 hour).",
            "Asynchronous access for quick decisions (WhatsApp/Telegram).",
            "Accountability tracking against agreed milestones.",
            "Access to my personal network (when relevant and earned).",
            "Strategic review of critical documents (contracts, investor updates)."
        ],
        outcomes: [
            "A trusted co-pilot navigating the chaos of company creation.",
            "Accelerated learning curve.",
            "Fewer expensive, existential mistakes."
        ]
    }
];

export const PROCESS_STEPS = [
    {
        step: "01",
        title: "Diagnose",
        description: "We strip away the noise. I look at your reality—not your pitch deck—to identify the actual bottlenecks."
    },
    {
        step: "02",
        title: "Design",
        description: "We build a structured, pragmatic plan. No fluff. Just the exact levers you need to pull to move forward."
    },
    {
        step: "03",
        title: "Execute",
        description: "You implement the plan. I hold you accountable, providing tactical adjustments as reality hits the strategy."
    },
    {
        step: "04",
        title: "Refine",
        description: "We measure outcomes, discard what failed, and double down on what worked. The cycle repeats."
    }
];

export const CREDIBILITY_BULLETS = [
    "Founder & CSO at AshaVid (Toronto, Jun 2025–Present)",
    "Founder & Director at DPF (Data Processing Company, Mar 2006–Jan 2023)",
    "Co-Founder at HoFin (Mental health app; released on Apple Store)",
    "Mentor at VisaRoads (MVP guidance, PMF testing, GTM support)",
    "Founder of NFTsShip (Iran’s first NFT platform & event; onboarded top artists)",
    "Former CTO at Iran's first government-backed cloud computing firm (handed over to Abararvan)",
    "Qualifications: Master’s in Software, Master’s in Anthropology, DBA (Brand Management), ISO 27001 Lead Auditor/CISO",
    "Based in Newmarket, ON, Canada"
];

export const FAQS = [
    {
        question: "Do you guarantee immigration results?",
        answer: "No. I am not an immigration lawyer or consultant. I focus strictly on the business viability, product strategy, and operational readiness that designated organizations look for. I help you build a real business; I do not process visas."
    },
    {
        question: "What industries do you work with?",
        answer: "I am industry-agnostic but heavily biased towards technology-enabled businesses, B2B SaaS, and platforms where systemic thinking and digital leverage apply."
    },
    {
        question: "How do we start?",
        answer: "You book a strategy call. We spend 30 minutes determining if your problem matches my expertise. If it's a fit, I propose an engagement model. If not, I tell you immediately."
    },
    {
        question: "What do you need from me?",
        answer: "Honesty, a willingness to be told your baby is ugly, and the discipline to execute the work we agree upon. If you want a \"yes man\" to validate your biases, do not book a call."
    },
    {
        question: "Do you work with teams outside Canada?",
        answer: "Yes. While much of my recent work focuses on the North American ecosystem and the Canadian Startup Visa program, the fundamentals of building a business apply globally."
    },
    {
        question: "What if I’m not sure which service fits?",
        answer: "Book the strategy call. The first step of any engagement is diagnosis. We will figure out what you actually need, which is rarely what you think you need."
    }
];
