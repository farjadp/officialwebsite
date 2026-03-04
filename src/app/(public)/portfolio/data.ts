// ============================================================================
// Hardware Source: data.ts
// Version: 2.0.0 — 2026-03-02
// Why: Static content payload provider
// Env / Identity: TypeScript Module
// ============================================================================

export type Category = "All" | "Startups I Founded" | "Strategic Engagements" | "Technical Software" | "AI & Automation Systems" | "GitHub Repositories" | "Experimental Lab";

export const CATEGORIES: Category[] = [
    "All",
    "Startups I Founded",
    "Strategic Engagements",
    "Technical Software",
    "AI & Automation Systems",
    "GitHub Repositories",
    "Experimental Lab"
];

// --- 1. Startups I Founded ---
export const STARTUPS_FOUNDED = [
    {
        id: "ashavid",
        name: "AshaVid",
        role: "Founder",
        problem: "Founders and SMEs lack structured strategic guidance and robust digital/AI systems to scale reliably.",
        built: "A hybrid advisory and product development lab offering high-level strategy and system automation.",
        outcome: "Guiding immigrant-led startups and standardizing SME workflows through Digital Transformation.",
        link: "https://github.com/farjadp/Ashavid",
        tags: ["TypeScript", "Private", "Advisory"]
    },
    {
        id: "startupvisaroads",
        name: "Startup Visa Roads",
        role: "Founder / Mentor",
        problem: "Need for structured mentorship and readiness programs for immigrant founders.",
        built: "A comprehensive mentorship and startup readiness platform for Startup Visa and global migration programs.",
        outcome: "Empowering candidates to achieve readiness and secure backing.",
        link: "https://github.com/farjadp/startupvisaroads",
        tags: ["TypeScript", "Public", "Mentorship"]
    },
    {
        id: "searchnestlab",
        name: "SearchNestLab",
        role: "Founder",
        problem: "Non-technical SMEs struggle with fragmented SEO tools and compliance.",
        built: "A Canada-first SEO and website optimization plugin bundling keywords, sitemap, analytics, and privacy in one place.",
        outcome: "Currently simplifying SEO for SMEs.",
        link: "https://github.com/farjadp/SearchNestLab",
        tags: ["TypeScript", "Public", "SEO"]
    },
    {
        id: "imedica",
        name: "iMedica",
        role: "Founder",
        problem: "Healthcare professionals lack immersive, practical Basic Life Support training.",
        built: "AI-enhanced and VR-based Basic Life Support (BLS) training systems designed for medical pros.",
        outcome: "Revolutionizing emergency training with VR and AI.",
        link: "https://github.com/farjadp/imedica",
        tags: ["TypeScript", "Public", "MedTech", "VR"]
    },
    {
        id: "northroadai",
        name: "North Road AI",
        role: "Founder",
        problem: "Founders need honest, clear, and direct support.",
        built: "The North Road Protocol, integrating automation directly into business workflows for structured scaling.",
        outcome: "Driving workflow efficiency through serious, transparent protocols.",
        link: "https://github.com/farjadp/northroadai",
        tags: ["TypeScript", "Private", "AI"]
    },
    {
        id: "preventixapp",
        name: "Preventix",
        role: "Founder",
        problem: "Lack of deep, networked physical device integration in preventive systems.",
        built: "Hardware-first operational networks focused on physical devices rather than consumer apps.",
        outcome: "Building robust physical tracking networks.",
        link: "https://github.com/farjadp/preventixapp",
        tags: ["TypeScript", "Public", "Hardware"]
    }
];

// --- 2. Strategic Engagements ---
export const STRATEGIC_ENGAGEMENTS = [
    {
        id: "iran-cloud",
        organization: "First Iranian Cloud Computing Company (Gov-backed)",
        role: "Chief Technology Officer (CTO)",
        challenge: "Building a scalable, secure national cloud infrastructure from the ground up under strict regulatory requiredments.",
        contribution: "Architected the core cloud infrastructure and directed the engineering teams to achieve high availability.",
        outcome: "Successfully launched and eventually completed a structured handover.",
        tags: ["Cloud Infrastructure", "Government", "CTO"]
    },
];

// --- 3. Technical Software ---
export const TECHNICAL_PROJECTS = [
    {
        id: "officialwebsite",
        name: "Farjad Personal Idea Library",
        description: "The source code for my personal editorial platform and portfolio.",
        techStack: ["TypeScript", "Next.js", "React"],
        problem: "Need a premium, ultra-fast platform to host my essays, projects, and portfolio with rich aesthetics.",
        github: "https://github.com/farjadp/officialwebsite",
        demo: "http://localhost:3000",
        tags: ["Architecture", "Public"]
    }
];

// --- 4. GitHub Repositories ---
export const GITHUB_REPOS = [
    {
        id: "course-creation-agent",
        name: "course-creation-agent",
        description: "A multi-agent system built with Google's Agent Development Kit (ADK) and Agent-to-Agent (A2A) protocol. It features a team of microservice agents that research, judge, and build content.",
        language: "Python",
        visibility: "Public",
        github: "https://github.com/farjadp/course-creation-agent"
    },
    {
        id: "officialwebsite",
        name: "officialwebsite",
        description: "“Help me write a clear prompt for GitHub Copilot to generate the base for my personal website repository.”",
        language: "TypeScript",
        visibility: "Public",
        github: "https://github.com/farjadp/officialwebsite"
    },
    {
        id: "startupvisaroads",
        name: "startupvisaroads",
        description: "Startup Visa Roads – mentorship & startup readiness for Startup Visa and global migration programs.",
        language: "TypeScript",
        visibility: "Public",
        github: "https://github.com/farjadp/startupvisaroads"
    },
    {
        id: "visachee",
        name: "VisaChee",
        description: "Fully functional Telegram Bot for Immigration Assessment with the following specifications. The code must be modular, clean, and ready to run.",
        language: "Python",
        visibility: "Public",
        github: "https://github.com/farjadp/VisaChee"
    },
    {
        id: "ashavid",
        name: "Ashavid",
        description: "Digital Transformation advisory and product development lab.",
        language: "TypeScript",
        visibility: "Private",
        github: "https://github.com/farjadp/Ashavid"
    },
    {
        id: "nabzx",
        name: "nabzx",
        description: "A research-first system for analyzing discourse patterns on X (Twitter) using behavioral signals such as hashtag co-occurrence and interaction structure.",
        language: "TypeScript",
        visibility: "Public",
        github: "https://github.com/farjadp/nabzx"
    },
    {
        id: "gheychee-lightversion",
        name: "gheychee-lightversion",
        description: "A lightweight, modular Telegram bot for downloading open-source videos, designed to demonstrate Node.js backend architecture.",
        language: "JavaScript",
        visibility: "Public",
        github: "https://github.com/farjadp/gheychee-lightversion"
    },
    {
        id: "imedica",
        name: "imedica",
        description: "The company offers AI-enhanced and VR-based Basic Life Support (BLS) training for healthcare professionals.",
        language: "TypeScript",
        visibility: "Public",
        github: "https://github.com/farjadp/imedica"
    },
    {
        id: "Gheychee",
        name: "Gheychee",
        description: "✂️ Gheychee | Source code of a Telegram bot for downloading videos from social media. Built with Python.",
        language: "Python",
        visibility: "Public",
        github: "https://github.com/farjadp/Gheychee"
    },
    {
        id: "preventixapp",
        name: "preventixapp",
        description: "Preventix operates through networked physical devices, not consumer apps.",
        language: "TypeScript",
        visibility: "Public",
        github: "https://github.com/farjadp/preventixapp"
    },
    {
        id: "searchnestlab",
        name: "SearchNestLab",
        description: "SearchNestLab is a Canada-first SEO and website optimization plugin for non-technical SMEs.",
        language: "TypeScript",
        visibility: "Public",
        github: "https://github.com/farjadp/SearchNestLab"
    },
    {
        id: "northroadai",
        name: "northroadai",
        description: "At North Road AI, we treat every founder’s time and attention as something serious.",
        language: "TypeScript",
        visibility: "Private",
        github: "https://github.com/farjadp/northroadai"
    },
    {
        id: "startupstoryscale",
        name: "startupstoryscale",
        description: "Startup Story Scale — PR readiness & timeline estimator for startup teams.",
        language: "TypeScript",
        visibility: "Private",
        github: "https://github.com/farjadp/startupstoryscale"
    },
    {
        id: "hamteami",
        name: "Hamteami",
        description: "Collaborative project. Updated on Jul 30, 2024.",
        language: "TypeScript",
        visibility: "Public",
        github: "https://github.com/farjadp/Hamteami"
    }
];

// --- 5. AI & Automation Systems ---
export const AI_SYSTEMS = [
    {
        id: "course-creation-agent",
        name: "Course Creation Agent (ADK)",
        description: "A multi-agent system built with Google's Agent Development Kit (ADK) and Agent-to-Agent (A2A) protocol.",
        techStack: ["Python", "Google ADK", "LLMs"],
        problem: "Automating curriculum development with a team of microservice agents that research, judge, and build content.",
        github: "https://github.com/farjadp/course-creation-agent",
        demo: "#",
        tags: ["Multi-Agent", "AI", "Public"]
    },
    {
        id: "nabzx",
        name: "NabzX Discourse Analysis",
        description: "A research-first system for analyzing discourse patterns on X (Twitter).",
        techStack: ["TypeScript", "Data Pipeline", "Analysis"],
        problem: "Need for ethical, non-profiling analysis using behavioral signals like hashtag co-occurrence and interaction structures.",
        github: "https://github.com/farjadp/nabzx",
        demo: "#",
        tags: ["Data Engineering", "Public"]
    }
];

// --- 6. Experimental Lab ---
export const EXPERIMENTAL_LAB = [
    {
        id: "visachee",
        name: "VisaChee",
        description: "Fully functional Telegram Bot for Immigration Assessment.",
        techStack: ["Python", "Telegram API", "Modular"],
        problem: "Need an automated, clean, and modular system to initially assess candidate immigration viability.",
        github: "https://github.com/farjadp/VisaChee",
        tags: ["Prototyping", "Public"]
    },
    {
        id: "startupstoryscale",
        name: "Startup Story Scale",
        description: "PR readiness & timeline estimator designed for startup teams.",
        techStack: ["TypeScript", "Algorithms"],
        problem: "Startups often engage PR too early with unrealistic expectations. Need a systematic readiness check.",
        github: "https://github.com/farjadp/startupstoryscale",
        tags: ["Tooling", "Private"]
    },
    {
        id: "pars-calendar",
        name: "ParsCalendar Algorithm",
        description: "Programmatic implementation of the ancient Zoroastrian calendar, mapping Farvashi/Asha Vahishta months.",
        techStack: ["TypeScript", "Algorithms"],
        problem: "No accurate programmatic implementation existed for computing ancient Persian feast days against the modern Gregorian calendar.",
        github: "https://github.com/farjadp",
        tags: ["Culture", "Math"]
    }
];
