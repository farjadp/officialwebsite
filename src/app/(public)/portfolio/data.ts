// ============================================================================
// Hardware Source: data.ts
// Version: 1.0.0 — 2026-02-24
// Why: Static content payload provider
// Env / Identity: TypeScript Module
// ============================================================================

export type Category = "All" | "Startups I Founded" | "Strategic Engagements" | "Technical & GitHub Projects" | "AI & Automation Systems" | "Experimental Lab";

export const CATEGORIES: Category[] = [
    "All",
    "Startups I Founded",
    "Strategic Engagements",
    "Technical & GitHub Projects",
    "AI & Automation Systems",
    "Experimental Lab"
];

// --- 1. Startups I Founded ---
export const STARTUPS_FOUNDED = [
    {
        id: "ashavid",
        name: "AshaVid",
        role: "Founder & CSO",
        problem: "Founders and SMEs lack structured strategic guidance and robust digital/AI systems to scale reliably.",
        built: "A hybrid advisory and product development lab offering high-level strategy and system automation.",
        outcome: "Active operations in Toronto, guiding immigrant-led startups and standardizing SME workflows.",
        link: "https://ashavid.com", // Placeholder
        tags: ["Advisory", "Product lab", "Systems"]
    },
    {
        id: "dpf",
        name: "DPF (Farjad Data Processing Company)",
        role: "Founder & Director",
        problem: "Enterprises required reliable, secure data processing and IT infrastructure solutions.",
        built: "A long-standing data processing firm delivering enterprise IT and infrastructure services for nearly two decades.",
        outcome: "Successfully directed operations for 17 years (Mar 2006–Jan 2023).",
        link: "#",
        tags: ["Enterprise IT", "Data Processing", "B2B"]
    },
    {
        id: "hofin",
        name: "HoFin",
        role: "Co-Founder",
        problem: "Lack of accessible, structured mental health tracking and intervention tools for mobile users.",
        built: "A comprehensive mental health application focused on psychological well-being and habit tracking.",
        outcome: "Successfully launched and released on the Apple App Store.",
        link: "#",
        tags: ["Mental Health", "Mobile App", "B2C"]
    },
    {
        id: "nftsship",
        name: "NFTsShip",
        role: "Founder",
        problem: "No localized infrastructure existed in Iran for artists to mint, trade, and showcase verifiable digital assets.",
        built: "Iran’s first NFT platform and digital art marketplace.",
        outcome: "Onboarded well-known artists, hosted the first national NFT event, and established early Web3 infrastructure.",
        link: "#",
        tags: ["Web3", "Marketplace", "NFT"]
    },
    {
        id: "startupvisaroad",
        name: "StartupVisaRoad",
        role: "Founder / Architect",
        problem: "Immigrant founders struggled with navigating Canada's SUV program requirements and building viable MVPs.",
        built: "A structured platform and framework for MVP readiness, pitch development, and compliance.",
        outcome: "Empowered multiple candidates to achieve PMF testing and secure letters of support.",
        link: "#",
        tags: ["Immigration", "EdTech", "SaaS"]
    },
    {
        id: "northroadai",
        name: "North Road AI",
        role: "Founder",
        problem: "Businesses needed tailored generative AI solutions to automate unstructured text and data workflows.",
        built: "A specialized AI automation platform integrating LLMs directly into everyday business processes.",
        outcome: "Currently in deployment, driving workflow automation for early adopters.",
        link: "#",
        tags: ["AI", "Automation", "B2B"]
    },
];

// --- 2. Strategic Engagements ---
export const STRATEGIC_ENGAGEMENTS = [
    {
        id: "visaroads-mentor",
        organization: "VisaRoads",
        role: "Mentor & Strategist",
        challenge: "Startup candidates lacked proven Go-To-Market strategies and robust MVP testing before entering the SUV ecosystem.",
        contribution: "Delivered hands-on MVP guidance, PMF testing frameworks, and tactical go-to-market support.",
        outcome: "Increased candidate success rates and significantly improved the business viability of their startups.",
        tags: ["Mentorship", "GTM Strategy", "MVP"]
    },
    {
        id: "iran-cloud",
        organization: "First Iranian Cloud Computing Company (Gov-backed)",
        role: "Chief Technology Officer (CTO)",
        challenge: "Building a scalable, secure national cloud infrastructure from the ground up under strict regulatory requiredments.",
        contribution: "Architected the core cloud infrastructure and directed the engineering teams to achieve high availability.",
        outcome: "Successfully launched and eventually completed a structured handover to Abararvan (ArvanCloud).",
        tags: ["Cloud Infrastructure", "Government", "CTO"]
    },
];

// --- 3. Technical & GitHub Projects ---
export const TECHNICAL_PROJECTS = [
    {
        id: "nextjs-boilerplate",
        name: "Enterprise Architecture Boilerplate",
        description: "A secure, scalable Next.js 14 template utilizing App Router, Prisma, and NextAuth.",
        techStack: ["Next.js", "TypeScript", "Tailwind", "Prisma"],
        problem: "Teams wasted weeks configuring secure auth, RBAC, and database schemas for new enterprise projects.",
        github: "https://github.com/farjadp",
        demo: "#",
        tags: ["Architecture", "Open Source"]
    },
    {
        id: "rapid-api-twitter",
        name: "RapidAPI Unofficial Wrapper",
        description: "A robust GraphQL parsing pipeline for complex RapidAPI Twitter endpoints.",
        techStack: ["TypeScript", "Node.js", "GraphQL"],
        problem: "Standard REST data from Twitter was locked; alternative GraphQL endpoints returned deeply nested, unstable JSON schemas.",
        github: "https://github.com/farjadp",
        demo: "#",
        tags: ["Data Pipeline", "API"]
    }
];

// --- 4. AI & Automation Systems ---
export const AI_SYSTEMS = [
    {
        id: "rag-engine",
        name: "Contextual RAG Knowledge Engine",
        description: "Retrieval-Augmented Generation pipeline built for legal and compliance documents.",
        techStack: ["Python", "LangChain", "Pinecone", "OpenAI"],
        problem: "Professionals spent hours searching through massive PDFs for specific compliance clauses.",
        github: "https://github.com/farjadp",
        demo: "#",
        tags: ["AI", "LLM", "RAG"]
    }
];

// --- 5. Experimental Lab ---
export const EXPERIMENTAL_LAB = [
    {
        id: "pars-calendar",
        name: "ParsCalendar (Ancient Iranian Algorithm)",
        description: "A programmatic implementation of the ancient Zoroastrian calendar, mapping Farvashi/Asha Vahishta months to modern standard time structures.",
        techStack: ["React Native", "TypeScript", "Algorithms"],
        problem: "No accurate programmatic implementation existed for computing ancient Persian feast days against the modern Gregorian calendar.",
        github: "https://github.com/farjadp",
        tags: ["Mobile", "Algorithms", "Culture"]
    }
];
