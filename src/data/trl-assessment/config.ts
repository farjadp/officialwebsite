// ============================================================================
// Data model and configuration for the TRL (Technology Readiness Level) Assessment
//
// Grounded in:
// - NASA TRL 1-9 definitions (nasa.gov, SCaN program)
// - ISED Canada program guides (e.g. Cyber Security Innovation Network), which
//   group TRL 1-6 as research/development and TRL 7-9 as pre-commercialization
// - Startup Readiness Level literature (AIP Conf. Proc. 3174; J. Technology
//   Transfer 2024) — TRL measures technology maturity only, and must be paired
//   with market/investment readiness for ventures
//
// Methodology: evidence-gate calculator (AFRL/NASA "TRL calculator" style).
// Each level has concrete evidence criteria; a level counts as achieved only
// when its criteria are substantially met AND every lower level is achieved.
// ============================================================================

export interface TrlCriterion {
    id: string;
    text: string;
}

export interface TrlLevel {
    level: number; // 1-9
    name: string;
    nasaDefinition: string; // canonical, technology-neutral paraphrase
    startupTranslation: string; // what this looks like for a venture
    criteria: TrlCriterion[];
    advanceHint: string; // what it takes to move past this level
}

export interface TrlPhase {
    id: string;
    title: string;
    trlRange: string;
    description: string;
    levels: number[];
}

export const trlPhases: TrlPhase[] = [
    {
        id: "research",
        title: "Research",
        trlRange: "TRL 1–3",
        description: "From observed principles to an experimental proof of concept.",
        levels: [1, 2, 3],
    },
    {
        id: "development",
        title: "Development",
        trlRange: "TRL 4–6",
        description: "From lab validation to a working prototype in a relevant environment.",
        levels: [4, 5, 6],
    },
    {
        id: "deployment",
        title: "Demonstration & Deployment",
        trlRange: "TRL 7–9",
        description: "From operational demonstration to a system proven in real operations.",
        levels: [7, 8, 9],
    },
];

export const trlLevels: TrlLevel[] = [
    {
        level: 1,
        name: "Basic Principles Observed",
        nasaDefinition: "Scientific research is beginning and results are being translated into future research and development.",
        startupTranslation: "You have observed a phenomenon or capability that could become a technology — but it is still science, not engineering.",
        criteria: [
            { id: "t1-1", text: "The basic scientific or technical principles behind the technology have been observed and reported." },
            { id: "t1-2", text: "Findings are documented (literature review, research notes, publications) — not just an idea in someone's head." },
            { id: "t1-3", text: "Potential application areas for the principle have been identified, at least at a high level." },
        ],
        advanceHint: "Formulate a concrete practical application and support it with analysis.",
    },
    {
        level: 2,
        name: "Technology Concept Formulated",
        nasaDefinition: "Basic principles have been studied and practical applications can be applied to those initial findings; still speculative, with little to no experimental proof of concept.",
        startupTranslation: "You can describe a specific application and back it with analysis — calculations, models, desk research — but nothing has been proven experimentally yet.",
        criteria: [
            { id: "t2-1", text: "A specific practical application or use case for the technology has been formulated." },
            { id: "t2-2", text: "The concept is supported by analysis (calculations, models, simulations on paper, desk research)." },
            { id: "t2-3", text: "The key assumptions and unknowns that still have to be proven are explicitly written down." },
        ],
        advanceHint: "Design and run first experiments that test the critical functions of the concept.",
    },
    {
        level: 3,
        name: "Experimental Proof of Concept",
        nasaDefinition: "Active research and design begin; analytical and laboratory studies assess viability, and a proof-of-concept model is constructed.",
        startupTranslation: "Critical pieces of the technology have been shown to work in isolation — a lab experiment, a simulation, or a code proof of concept.",
        criteria: [
            { id: "t3-1", text: "Critical functions or components have been tested experimentally (lab experiments, simulations, or working proof-of-concept code)." },
            { id: "t3-2", text: "Experimental results confirm the key analytical predictions made earlier." },
            { id: "t3-3", text: "A proof of concept exists that demonstrates core feasibility, even if nothing is integrated yet." },
        ],
        advanceHint: "Integrate the core components and validate them together in a controlled environment.",
    },
    {
        level: 4,
        name: "Validated in Lab",
        nasaDefinition: "The proof-of-concept technology advances to testing where multiple component pieces are tested with one another.",
        startupTranslation: "The core components work together as a low-fidelity system in your lab or development environment.",
        criteria: [
            { id: "t4-1", text: "Core components have been integrated and validated together in a lab or development environment." },
            { id: "t4-2", text: "Performance has been measured against defined target metrics, not just observed informally." },
            { id: "t4-3", text: "Test results show the integrated system is feasible (low fidelity is acceptable at this stage)." },
        ],
        advanceHint: "Raise fidelity and test the integrated system under realistic conditions, data, and interfaces.",
    },
    {
        level: 5,
        name: "Validated in Relevant Environment",
        nasaDefinition: "A continuation of TRL 4: breadboard technology undergoes more rigorous testing, including simulations in realistic environments.",
        startupTranslation: "The system has been tested under realistic conditions — real-world data, realistic loads, actual interface constraints — not just clean lab inputs.",
        criteria: [
            { id: "t5-1", text: "The integrated system has been tested in a relevant or simulated real environment (realistic data, users, or operating conditions)." },
            { id: "t5-2", text: "The fidelity of the prototype has increased significantly compared to the lab version." },
            { id: "t5-3", text: "Interfaces with external systems and real-world constraints have been identified and tested." },
        ],
        advanceHint: "Build a fully functional prototype and demonstrate it end-to-end in a relevant environment.",
    },
    {
        level: 6,
        name: "Prototype Demonstrated in Relevant Environment",
        nasaDefinition: "A fully functional prototype or representational model is developed and demonstrated.",
        startupTranslation: "A complete, working prototype (or beta) has been demonstrated end-to-end — pilot users, staging with production-like data, or field trials.",
        criteria: [
            { id: "t6-1", text: "A fully functional prototype or beta has been demonstrated end-to-end in a relevant environment (pilot users, staging with real data, field trial)." },
            { id: "t6-2", text: "Prototype performance approaches the requirements of real operational use." },
            { id: "t6-3", text: "Remaining engineering risks are identified, with a clear plan to close them." },
        ],
        advanceHint: "Move the prototype into the actual operational environment, at or near real scale.",
    },
    {
        level: 7,
        name: "Demonstrated in Operational Environment",
        nasaDefinition: "The working model or prototype is demonstrated in its target operational environment.",
        startupTranslation: "Real customers or field conditions — the prototype runs where the product will actually live, at or near real scale.",
        criteria: [
            { id: "t7-1", text: "The prototype has been demonstrated in the actual operational environment (real customers, real field conditions)." },
            { id: "t7-2", text: "The demonstration ran at or near real scale and load." },
            { id: "t7-3", text: "Operational feedback is being captured and is driving refinement." },
        ],
        advanceHint: "Complete and qualify the system: reliability, security, compliance, documentation, support.",
    },
    {
        level: 8,
        name: "System Complete & Qualified",
        nasaDefinition: "The technology has been tested and qualified, and is ready for implementation.",
        startupTranslation: "The product is finished and qualified — hardened, documented, supported — and early customers are running it in production.",
        criteria: [
            { id: "t8-1", text: "The system is complete and has been qualified through test and demonstration (reliability, security, compliance or certification as applicable)." },
            { id: "t8-2", text: "Documentation, support, and operating processes are in place." },
            { id: "t8-3", text: "Early or pilot customers are using the system successfully in production." },
        ],
        advanceHint: "Prove the system through sustained, successful real operations.",
    },
    {
        level: 9,
        name: "Proven in Operations",
        nasaDefinition: "The technology is proven through successful operations (\"flight proven\" in NASA terms).",
        startupTranslation: "The technology runs continuously in real operations with real customers, with stable, monitored performance.",
        criteria: [
            { id: "t9-1", text: "The system is proven through continuous, successful operation with real customers or missions." },
            { id: "t9-2", text: "Performance in production is stable and actively monitored." },
            { id: "t9-3", text: "Support, maintenance, and improvement cycles are running as an ongoing operation." },
        ],
        advanceHint: "Technology maturity is complete — the frontier is now market, scale, and business readiness.",
    },
];

export const TOTAL_CRITERIA = trlLevels.reduce((sum, l) => sum + l.criteria.length, 0);
