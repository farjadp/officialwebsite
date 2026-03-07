// ============================================================================
// Hardware Source: data.ts
// Version: 3.0.0 — 2026-03-07
// Why: Static content payload provider for unified portfolio
// Env / Identity: TypeScript Module
// ============================================================================

export type PortfolioCategory =
    | "My Startups"
    | "Companies & Ventures"
    | "GitHub Projects";

export const CATEGORIES: PortfolioCategory[] = [
    "My Startups",
    "Companies & Ventures",
    "GitHub Projects"
];

export type PortfolioItem = {
    id: string;
    title: string;
    category: PortfolioCategory;
    role: string;
    summary: string;
    problem?: string;
    contribution?: string;
    outcome?: string;
    techStack?: string[];
    github?: string;
    link?: string;
    visibility?: "Public" | "Private";
    tags?: string[];
    yearRange?: string;
};

export const FOUNDER_JOURNEY = [
    {
        name: "North Road AI",
        role: "Founder",
        years: "2024 — Present",
        status: "Active",
        statusLabel: "CURRENT STARTUP",
        description: [
            "North Road AI is a venture focused on building AI-powered systems that help founders make clearer strategic decisions and operate their startups more effectively.",
            "The idea emerged from years of working with early-stage startups and seeing the same structural problems repeat: unclear priorities, scattered information, weak decision frameworks, and founders overwhelmed by operational complexity.",
            "The project focuses on developing practical tools that help founders clarify strategic direction, structure complex decisions, analyze markets, manage operations, and reduce cognitive overload in early-stage teams."
        ]
    },
    {
        name: "AI Cardia",
        role: "Founder",
        years: "2025 — Present",
        status: "Building",
        statusLabel: "IN PROGRESS (HIRING CO-FOUNDER)",
        description: [
            "AI Cardia is a health technology concept focused on using artificial intelligence to improve early detection and monitoring of cardiovascular conditions.",
            "The project explores how data analysis, machine learning, and medical insight can help build tools for more proactive and preventative healthcare."
        ]
    },
    {
        name: "Rootopia",
        role: "Founder",
        years: "2025",
        status: "Dead",
        statusLabel: "DEAD — MARKET RESEARCH PHASE",
        description: [
            "Rootopia is a startup focused on vertical farming and sustainable agriculture, aiming to produce pesticide-free leafy greens using controlled indoor farming systems.",
            "The venture explores how AI, controlled environments, and modern agricultural technology can support local food production for urban markets."
        ]
    },
    {
        name: "ColonyNova",
        role: "Founder",
        years: "2024",
        status: "Dead",
        statusLabel: "DEAD — POST MVP PHASE",
        description: [
            "ColonyNova is an ongoing venture exploring new models of startup incubation, collaboration, and innovation ecosystems.",
            "The project focuses on how founders, researchers, and technologists can collaborate in structured environments to build new ventures and experimental ideas."
        ]
    },
    {
        name: "ArtOkids",
        role: "Founder",
        years: "2022 — 2023",
        status: "Dead",
        statusLabel: "DEAD — MARKET RESEARCH PHASE",
        description: [
            "ArtOkids was a creative platform designed to connect children, creativity, and digital learning environments. The idea was to provide artistic and educational tools that could help young learners develop imagination and creative thinking.",
            "This venture explored the intersection of education, creativity, and digital platforms."
        ]
    },
    {
        name: "Bleesta",
        role: "Founder",
        years: "Previous",
        status: "Done",
        statusLabel: "CONCLUDED",
        description: [
            "Bleesta was developed as a digital platform concept focused on modern online services and platform-based interactions. The project explored scalable digital product structures and user-centric platform design.",
            "Bleesta was part of a broader effort to experiment with new product ideas and digital ecosystems."
        ]
    },
    {
        name: "Arch North Land",
        role: "Founder",
        years: "Previous",
        status: "Done",
        statusLabel: "CONCLUDED",
        description: [
            "Arch North Land was designed as a project exploring the relationship between architecture, urban development, and modern digital platforms.",
            "The concept focused on combining architectural thinking with new business models for land development and urban design services."
        ]
    },
    {
        name: "2bHiTech",
        role: "Founder",
        years: "Previous",
        status: "Done",
        statusLabel: "CONCLUDED",
        description: [
            "2bHiTech was an early technology initiative focused on building digital tools and platforms during the growth of the online ecosystem. The project involved experimentation with software development, digital infrastructure, and early-stage internet services.",
            "It served as an early exploration of how technology companies are structured and operated."
        ]
    },
    {
        name: "OrganicHub",
        role: "Founder",
        years: "Previous",
        status: "Acquired",
        statusLabel: "ACQUIRED — SOLD TO INVESTOR",
        description: [
            "OrganicHub was conceived as a platform focused on sustainable food systems and healthier agricultural supply chains. The goal was to explore how local production and smarter distribution could make organic products more accessible.",
            "The project helped me explore the intersection between food systems, technology, and community-driven marketplaces."
        ]
    }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
    // --- 1. Companies & Ventures ---
    {
        id: "ashavid",
        title: "AshaVid",
        category: "Companies & Ventures",
        role: "Founder & CSO",
        summary: "A strategic mentoring platform dedicated to immigrant founders scaling operations in Canada.",
        visibility: "Public",
        contribution: "Developed the core business thesis, GTM strategy, and structured founder mentorship frameworks to intercept immigrant founders before they fall prey to predatory visa consultants.",
        outcome: "Created a profitable consulting and digital platform supporting early stage SUV companies in Toronto.",
        tags: ["Business Strategy", "SUV Focus", "Digital Transformation"],
        link: "https://ashavid.com"
    },
    {
        id: "dpf",
        title: "Developer Persian Front (DPF)",
        category: "Companies & Ventures",
        role: "Founder & Director",
        summary: "An educational platform bridging the gap between theoretical learning and practical engineering for Persian-speaking developers.",
        visibility: "Public",
        problem: "University curricula consistently failed to produce industry-ready developers in the Middle East.",
        contribution: "Designed and scaled the curriculum, developed the platform architecture, and grew a community of software engineers.",
        outcome: "Successfully trained over 3,000 developers, many of whom are now mid-to-senior engineers across international tech hubs.",
        tags: ["EdTech", "Community Scaling", "React"],
    },
    {
        id: "hofin",
        title: "HoFin",
        category: "Companies & Ventures",
        role: "Co-Founder",
        summary: "A fintech initiative creating standardized infrastructure for digital transactions.",
        visibility: "Private",
        contribution: "Architected the initial MVP payment orchestration layer and designed the security protocols.",
        outcome: "Proved initial concept viability and secured pilot partnerships before transitioning out.",
        tags: ["FinTech", "Payment Gateway", "Node.js"],
    },
    {
        id: "abr-arvan",
        title: "National Cloud Infrastructure",
        category: "Companies & Ventures",
        role: "CTO",
        summary: "The first government-backed cloud computing infrastructure initiative in Iran.",
        visibility: "Private",
        problem: "The country lacked sovereign cloud computing capabilities, relying completely on external vulnerable networks.",
        contribution: "Led a massive engineering division to design scalable object storage, distributed compute nodes, and a secure hypervisor layer from scratch.",
        outcome: "Successfully deployed the foundational network handling millions of requests daily, significantly reducing latency for domestic applications.",
        tags: ["Cloud Architecture", "Distributed Systems", "Go", "Kubernetes"],
    },
    {
        id: "raf",
        title: "RAF Advertising Agency",
        category: "Companies & Ventures",
        role: "Art Director",
        summary: "A highly prominent digital and creative agency producing national-level campaigns.",
        visibility: "Public",
        contribution: "Transitioned traditional advertising frameworks into performance-driven digital funnels, integrating UI/UX principles directly into ad creative.",
        outcome: "Increased user retention across dozens of client digital assets and modernized the agency's creative delivery pipeline.",
        tags: ["Creative Direction", "UI/UX", "Digital Strategy"],
    },
    {
        id: "ministry-industry",
        title: "Ministry of Industry & Minerals",
        category: "Companies & Ventures",
        role: "Technical Consultant",
        summary: "Digital transformation for legacy governmental logistics networks.",
        visibility: "Private",
        contribution: "Audited decades-old paper trails and monolithic IBM mainframe architectures to propose modern, agile microservices.",
        outcome: "Drastically reduced the supply-chain reporting cycle from weeks to hours.",
        tags: ["Enterprise Architecture", "Consulting", "Legacy Modernization"],
    },
    {
        id: "visaroads",
        title: "VisaRoads",
        category: "Companies & Ventures",
        role: "Startup Mentor",
        summary: "A specialized agency processing and mentoring tech founders through the Canadian Startup Visa program.",
        visibility: "Public",
        problem: "Founders were arriving with strong technical skills but zero understanding of North American go-to-market strategies or investor expectations.",
        contribution: "Developed the curriculum for Pitch Deck creation, product-market-fit validation, and North American business structuring.",
        outcome: "Successfully mentored dozens of founding teams, raising their approval odds and preparing them for real revenue generation post-landing.",
        tags: ["Mentorship", "GTM Strategy", "Pitching"],
        link: "https://visaroads.com"
    },
    {
        id: "vania-it",
        title: "VaniaIT",
        category: "Companies & Ventures",
        role: "Enterprise Solution - Develop and programming",
        summary: "Enterprise solution provider where I developed and programmed numerous prominent portals for large-scale Iranian corporations (2010 - 2015).",
        visibility: "Public",
        contribution: "Architected and programmed enterprise-grade web solutions and portals, laying the digital foundation for major corporate entities.",
        tags: ["Enterprise Software", "Web Portals", "Software Engineering"],
    },
    // --- CATEGORY: GITHUB PROJECTS ---
    {
        id: "officialwebsite",
        title: "Farjad Personal Website",
        category: "GitHub Projects",
        role: "Product Owner / Builder",
        summary: "Personal editorial platform and portfolio designed to present essays, services, and selected work.",
        problem: "Need a premium, ultra-fast platform to host my essays, projects, and portfolio with rich aesthetics.",
        techStack: ["TypeScript", "Next.js", "React", "Tailwind"],
        github: "https://github.com/farjadp/officialwebsite",
        visibility: "Public",
        tags: ["Architecture", "Frontend"]
    },
    {
        id: "course-creation-agent",
        title: "Course Creation Agent",
        category: "GitHub Projects",
        role: "Technical Project",
        summary: "Multi-agent content system using Google ADK and A2A protocol.",
        techStack: ["Python", "Google ADK", "LLMs"],
        github: "https://github.com/farjadp/course-creation-agent",
        visibility: "Public",
        tags: ["Multi-Agent", "AI"]
    },
    {
        id: "nabzx",
        title: "NabzX",
        category: "GitHub Projects",
        role: "Technical Project",
        summary: "Research-first discourse analysis system using behavioral signals and interaction structure.",
        techStack: ["TypeScript", "Data Pipelines"],
        github: "https://github.com/farjadp/nabzx",
        visibility: "Public",
        tags: ["Data Engineering", "Analysis"]
    },
    {
        id: "visachee",
        title: "VisaChee",
        category: "GitHub Projects",
        role: "Builder",
        summary: "Prototype immigration assessment bot.",
        techStack: ["Python", "Telegram API"],
        github: "https://github.com/farjadp/VisaChee",
        visibility: "Public",
        tags: ["Prototyping", "Automation"]
    },
    {
        id: "startupstoryscale",
        title: "Startup Story Scale",
        category: "GitHub Projects",
        role: "Builder",
        summary: "PR-readiness and timeline estimation concept for startups.",
        techStack: ["TypeScript", "Algorithms"],
        github: "https://github.com/farjadp/startupstoryscale",
        visibility: "Private",
        tags: ["Tooling", "PR"]
    },
    {
        id: "nft-ship",
        title: "NFTsShip Protocol",
        category: "GitHub Projects",
        role: "Core Contributor",
        summary: "An early-stage exploration into standardized NFT deployment smart contracts.",
        visibility: "Public",
        contribution: "Wrote the Solidity token standard overrides and built the React-based minting interface MVP.",
        tags: ["Web3", "Solidity", "React", "DApp"],
        github: "https://github.com/farjadp/nfts-ship"
    },
    {
        id: "parscalendar",
        title: "Pars Calendar iOS App",
        category: "GitHub Projects",
        role: "Builder & Architect",
        summary: "A native iOS application bringing historical Iranian calendar systems (Jalali, Zoroastrian) to modern devices.",
        visibility: "Public",
        problem: "Existing Persian calendars were ad-laden, clunky, or inaccurate regarding ancient Zoroastrian feast days.",
        contribution: "Built an offline-first SwiftUI application with precise astronomical calculation algorithms for leap years.",
        outcome: "Created a pure, ad-free utility providing deep cultural value with modern UX.",
        tags: ["SwiftUI", "iOS", "Algorithms"],
        github: "https://github.com/farjadp/parscalendar"
    },
    {
        id: "imedica",
        title: "iMedica Patient Dashboard",
        category: "GitHub Projects",
        role: "Lead UI Developer",
        summary: "A high-security dashboard interface for clinic patient management.",
        visibility: "Private",
        contribution: "Developed the Next.js frontend, focusing strictly on HIPAA-compliant data masking patterns on the client-side.",
        tags: ["Next.js", "Healthcare", "TailwindCSS"],
    },
    {
        id: "preventix",
        title: "Preventix Mobile MVP",
        category: "GitHub Projects",
        role: "Mobile Architect",
        summary: "A preventative health monitoring MVP designed for cross-platform deployment.",
        visibility: "Private",
        contribution: "Set up the React Native scaffolding and built the core biometric data visualization charts using D3.js.",
        tags: ["React Native", "D3.js", "HealthTech"],
    },
    {
        id: "searchnestlab",
        title: "SearchNestLab SEO Toolkit",
        category: "GitHub Projects",
        role: "Full-Stack Builder",
        summary: "An internal collection of scripts designed to automate rigorous SEO audits for agency clients.",
        visibility: "Public",
        contribution: "Wrote Python scrapers to aggregate Lighthouse scores and identify orphaned pages across large sitemaps.",
        tags: ["Python", "SEO", "Automation"],
        github: "https://github.com/farjadp/searchnestlab"
    },
    {
        id: "nextjs-boilerplate",
        title: "Enterprise Next.js Boilerplate",
        category: "GitHub Projects",
        role: "Creator",
        summary: "A battle-tested starting point for large-scale Next.js applications.",
        visibility: "Public",
        contribution: "Assembled strict ESLint rules, Prettier configs, Husky hooks, and a modular Tailwind architecture into one template.",
        tags: ["Next.js", "Tooling", "Architecture"],
        github: "https://github.com/farjadp/nextjs-boilerplate"
    },
    {
        id: "react-native-auth",
        title: "React Native Deep Linking Auth",
        category: "GitHub Projects",
        role: "Researcher",
        summary: "An experimental repo testing complex state persistence during OAuth deep link flows in iOS.",
        visibility: "Public",
        tags: ["React Native", "OAuth", "Security"],
        github: "https://github.com/farjadp/react-native-auth"
    },
    {
        id: "agentic-ai-scraper",
        title: "Agentic AI Scraper",
        category: "GitHub Projects",
        role: "Creator",
        summary: "A Python-based headless browser agent capable of navigating shadow DOMs and logging behind auth walls.",
        visibility: "Private",
        tags: ["Python", "Playwright", "AI Agents"],
    },
    {
        id: "svelte-portfolio",
        title: "Minimalist Svelte Portfolio",
        category: "GitHub Projects",
        role: "Designer & Developer",
        summary: "Experimenting with SvelteKit's performance by building a zero-JS feeling static portfolio generator.",
        visibility: "Public",
        tags: ["SvelteKit", "Performance", "UI Design"],
        github: "https://github.com/farjadp/svelte-portfolio"
    }
];
