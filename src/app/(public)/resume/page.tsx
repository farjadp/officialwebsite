// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-05-29
// Why: Online resume / CV page — viewable and downloadable as PDF
// Env / Identity: React Server Component
// ============================================================================

import type { Metadata } from "next";
import Link from "next/link";
import { DownloadResumeButton } from "./download-button";

export const metadata: Metadata = {
  title: "Resume — Farjad P.D. | Strategy Thinker & Systems Builder",
  description:
    "Full professional resume of Farjad Pour Mohammad — Founder, CTO, Startup Mentor, ISO 27001 Lead Auditor, and Systems Builder with 17+ years of experience across Iran and Canada.",
};

// ─── Resume Data ─────────────────────────────────────────────────────────────

const WORK_EXPERIENCE = [
  {
    company: "AshaVid",
    location: "Toronto, ON",
    period: "Jun 2025 – Present",
    duration: "Current",
    role: "Founder & CSO",
    bullets: [
      "Defined and refined the long-term scientific vision to align with overall company strategy and evolving market needs.",
      "Led the design and execution of the R&D roadmap, prioritizing programs based on scientific merit and commercial potential.",
      "Built, mentored, and retained high-performing scientific teams across multiple disciplines and geographies.",
      "Established and managed strategic collaborations with academic institutions, biotech and pharma companies, and technology partners.",
    ],
  },
  {
    company: "DPF (Farjad Data Processing Company)",
    location: "Tehran",
    period: "Mar 2006 – Jan 2023",
    duration: "16 yrs 11 mos",
    role: "Founder and Director",
    bullets: [
      "Founded Iran's first dedicated website design and programming company, pioneering the organization's entry into a new digital market.",
      "Built strong, trust-based client relationships, positioning the company as a reliable long-term technology partner.",
      "Recruited, mentored, and developed a high-caliber technical team, fostering a collaborative and high-performance culture.",
      "Led the company's growth through strategic planning, effective leadership, and hands-on operational guidance.",
      "Transitioned into the role of board director, contributing to governance and strategic direction as former employees assumed ownership.",
    ],
  },
  {
    company: "HoFin",
    location: "Toronto, ON",
    period: "Jan 2020 – Present",
    duration: "6 yrs 2 mos",
    role: "Co-Founder",
    bullets: [
      "Founded a startup focused on providing mental health support solutions.",
      "Led the design and development of the initial product version released on the Apple Store.",
      "Defined the go-to-market approach and prepared marketing initiatives for the Canadian market.",
      "Oversaw core business activities, including product vision, basic operations, and early-stage brand positioning.",
    ],
  },
  {
    company: "VisaRoads",
    location: "Remote",
    period: "Jan 2022 – Present",
    duration: "4 yrs 2 mos",
    role: "Mentor",
    bullets: [
      "Assisted startup teams in identifying suitable accelerator programs aligned with their stage, industry, and strategic objectives.",
      "Guided founders in defining and building an optimal MVP, focusing on core features, user needs, and resource constraints.",
      "Helped teams assess product-market fit through user feedback, iterative testing, and analysis of market signals.",
      "Supported startups in securing initial clients by refining value propositions, prospecting strategies, and sales narratives.",
      "Conducted market analysis to clarify competitive landscapes, target segments, and positioning opportunities.",
      "Advised on team structure, roles, and collaboration practices to improve operational efficiency and execution capacity.",
      "Collaborated with founders to establish a go-to-market strategy, including channel selection, pricing approach, and launch planning.",
    ],
  },
  {
    company: "NFTsShip",
    location: "Tehran",
    period: "Jan 2022 – Feb 2026",
    duration: "4 yrs 2 mos",
    role: "Founder",
    bullets: [
      "Founded Iran's first NFT platform, overseeing product vision, strategy and overall operations.",
      "Organized and led Iran's first NFT-focused event, building awareness and education around digital art and blockchain technology.",
      "Attracted and onboarded well-known artists to the platform, positioning it as a credible space for NFT creation and trading.",
      "Navigated complex market, regulatory and social conditions until suspension of operations due to internal team issues and the national uprising.",
    ],
  },
  {
    company: "First Iranian Cloud Computing Company (Gov-Backed)",
    location: "Tehran",
    period: "Jan 2017 – Jan 2020",
    duration: "3 yrs 1 mo",
    role: "CTO",
    bullets: [
      "Served as CTO, establishing and leading the technical team from inception.",
      "Managed network infrastructure and ensured reliable connectivity and operations.",
      "Facilitated collaboration between R&D, software development, and network teams to align on technical solutions.",
      "Oversaw system design and architecture for multiple organizational platforms.",
      "Coordinated end-to-end technical delivery of the project and supervised its handover to Abararvan company.",
    ],
  },
  {
    company: "Rayan Andishan Faraz (RAF)",
    location: "Tehran",
    period: "Jan 2010 – Dec 2010",
    duration: "1 yr",
    role: "IT Department Manager",
    bullets: [
      "Managed the IT department and ensured day-to-day operational continuity and service delivery.",
      "Led and coordinated a team of IT staff, organizing tasks and responsibilities across the department.",
      "Identified and addressed initial team cooperation issues, implementing actions to improve collaboration.",
      "Facilitated communication within the team to resolve conflicts and align members on common objectives.",
      "Worked closely with team members to support their work, provide guidance, and maintain a productive environment.",
    ],
  },
  {
    company: "Ministry of Industry of Iran",
    location: "Tehran",
    period: "Jan 2008 – Dec 2009",
    duration: "2 yrs",
    role: "Cooperation with Ministry of Industry of Iran",
    bullets: [
      "Identified timing issues and lack of coordination that led to energy wastage within projects.",
      "Managed projects with a focus on improving scheduling, coordination and resource efficiency.",
      "Regularly updated knowledge of project management methods and best practices to enhance project outcomes.",
    ],
  },
  {
    company: "Fibo Group",
    location: "Remote",
    period: "Jan 2005 – Jun 2005",
    duration: "6 mos",
    role: "Supporter of Farsi Language Website",
    bullets: [
      "Supported the website of the Farsi language department of the English company Fibo Group.",
    ],
  },
];

const EDUCATION = [
  {
    degree: "PhD (Partially Completed) in Anthropology",
    institution: "Tehran Azad University, Center",
    year: "2019",
    notes: [],
  },
  {
    degree: "BBA — Doctor of Business Administration",
    institution: "Brand Academy of Iran",
    year: "2019",
    notes: [
      "Doctor of Business Administration (DBA) with a focus on Brand Management",
      "Specialized in Sensory Branding to enhance brand perception and customer engagement",
      "Experienced in developing and implementing brand-building strategies",
    ],
  },
  {
    degree: "Master of Anthropology",
    institution: "Tehran Azad University, Center",
    year: "2016",
    notes: [],
  },
  {
    degree: "Master's Degree in Software Engineering",
    institution: "Azad University, Roudhen Branch",
    year: "2014",
    notes: [],
  },
  {
    degree: "BA in Anthropology",
    institution: "Azad University, Tehran Branch",
    year: "2014",
    notes: [],
  },
  {
    degree: "Diploma in Mathematics",
    institution: "Tehran",
    year: "2008",
    notes: [],
  },
];

const CERTIFICATIONS_COURSES = [
  { title: "Digital Transformation", institution: "York University", date: "Mar 2026" },
  { title: "Venture Talent Masterclass", institution: "Schulich", date: "Dec 2024 – Mar 2025" },
  { title: "Fundamentals of Digital Marketing", institution: "Google", date: "Feb 2023 – Nov 2023" },
  { title: "Business Model", institution: "marsdd", date: "Oct 2023" },
  { title: "Digital Strategy", institution: "LinkedIn", date: "Jan 2022 – Oct 2022" },
  { title: "Chief Technology Officer Career Guide", institution: "LinkedIn", date: "Jan 2020" },
  { title: "Metaverse and NFTs for Marketing", institution: "LinkedIn", date: "Mar 2019 – Jul 2019" },
  { title: "Blockchain Basics", institution: "LinkedIn", date: "Feb 2019" },
  { title: "Scrum: The Basics", institution: "LinkedIn", date: "Jan 2018 – May 2018" },
];

const ISO_CERT = {
  title: "International Chief Auditor of Information Security Management System",
  institution: "International Standard Institute",
  year: "2018",
  bullets: [
    "Holder of ISO 27001 Lead Implementer certification",
    "Holder of ISO 27001 Lead Auditor certification",
    "Certified Chief Information Security Officer (CISO) ISO 27001",
    "Expertise in implementing and auditing Information Security Management Systems (ISMS)",
    "Proven capability in managing information security risks aligned with internationally recognized ISO 27001 standards",
  ],
};

const SKILLS = [
  "Problem Solving",
  "Critical Thinking",
  "Conflict Resolution",
  "Adaptability",
  "Leadership",
  "Communication",
  "Brand Management",
  "Technical Leadership",
  "Product Development",
  "Web Development",
  "Project Management",
  "Startup Mentorship",
  "Strategic Thinking",
  "Software Architecture",
  "AI & Automation",
  "Digital Transformation",
];

const LANGUAGES = [
  { name: "Farsi", level: "Native", percent: 100 },
  { name: "English", level: "Professional", percent: 75 },
];

const LINKS = [
  { label: "LinkedIn", value: "farjadpourmohammad", href: "https://www.linkedin.com/in/farjadpourmohammad/" },
  { label: "Website", value: "farjadp.info", href: "https://farjadp.info" },
  { label: "Twitter/X", value: "FarjadTalks", href: "https://twitter.com/FarjadTalks" },
  { label: "Telegram", value: "FarjadTalks", href: "https://t.me/FarjadTalks" },
  { label: "GitHub", value: "Farjadp", href: "https://github.com/Farjadp" },
  { label: "YouTube", value: "Farjadtalks", href: "https://youtube.com/@Farjadtalks" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[#F4F3EF] text-[#1C1917]">

      {/* ── Sticky Action Bar ── */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold text-[#0F3F35]">Farjad P.D.</span>
            <span className="text-stone-400 text-xs hidden sm:block">— Strategy Thinker & Systems Builder</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#0F3F35] border border-[#0F3F35] rounded-full hover:bg-[#0F3F35] hover:text-white transition-all"
            >
              Hire Me
            </Link>
            <DownloadResumeButton />
          </div>
        </div>
      </div>

      {/* ── Main Resume Container ── */}
      <div id="resume-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 print:py-0 print:px-0 print:max-w-none">

        {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
        <div className="bg-[#0F2B47] text-white rounded-2xl print:rounded-none overflow-hidden mb-6 print:mb-4">
          {/* Top monogram bar */}
          <div className="flex items-center justify-center pt-8 pb-2">
            <span className="text-[#C9A84C] font-mono text-sm tracking-[0.4em] uppercase">F | P</span>
          </div>

          <div className="text-center pb-8 px-8">
            <h1 className="font-serif text-5xl sm:text-6xl font-black tracking-tight text-white leading-none mb-3">
              FARJAD P.D
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.4em]">Strategy Thinker</span>
              <div className="h-px w-16 bg-[#C9A84C]" />
            </div>

            {/* Contact strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-stone-300 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C9A84C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span>Newmarket, ON, Canada</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C9A84C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                <span>+1 437 661 1674</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C9A84C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <span>farjadp@live.com</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C9A84C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
                <span>farjadp.info</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ TWO-COLUMN LAYOUT ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 print:grid-cols-[220px_1fr] print:gap-4">

          {/* ─── LEFT SIDEBAR ──────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Photo */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#C9A84C]/30 shadow-xl mb-4">
                {/* Using a profile-style placeholder in brand colors */}
                <div className="w-full h-full bg-gradient-to-br from-[#0F2B47] to-[#0F3F35] flex items-center justify-center">
                  <span className="text-white font-serif text-4xl font-bold">F</span>
                </div>
              </div>
              <p className="text-center text-xs text-stone-500 font-mono uppercase tracking-widest">Farjad Pour Mohammad</p>
            </div>

            {/* About Me */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2B47] mb-4 pb-2 border-b border-stone-100">
                About Me
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                With 17+ years of experience, my career has evolved from foundational IT roles to leading organizations as Founder, CTO & CSO. I hold dual Masters in Software Engineering and Anthropology — a rare combination that shapes how I build systems and lead people.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed mt-3">
                I've mentored 25+ startups, co-founded 4 companies across Iran and Canada, and helped raise $3M+ for teams I believed in. I build with clarity, systems, and brutal honesty.
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2B47] mb-4 pb-2 border-b border-stone-100">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-medium px-2 py-1 bg-[#0F2B47]/5 text-[#0F2B47] rounded border border-[#0F2B47]/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2B47] mb-4 pb-2 border-b border-stone-100">
                Languages
              </h2>
              <div className="space-y-4">
                {LANGUAGES.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-[#0F2B47]">{lang.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{lang.level}</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A84C] rounded-full"
                        style={{ width: `${lang.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2B47] mb-4 pb-2 border-b border-stone-100">
                Links
              </h2>
              <div className="space-y-2">
                {LINKS.map((link) => (
                  <div key={link.label} className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider w-16 shrink-0 mt-0.5">{link.label}:</span>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-stone-600 hover:text-[#0F3F35] transition-colors break-all"
                    >
                      {link.value}
                    </a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ─── RIGHT MAIN CONTENT ────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Work Experience */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 sm:p-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2B47] mb-6 pb-3 border-b-2 border-[#C9A84C]">
                Work Experience
              </h2>

              <div className="space-y-8">
                {WORK_EXPERIENCE.map((job, idx) => (
                  <div key={idx} className="group">
                    <div className="grid grid-cols-[1fr_auto] gap-4 mb-3">
                      <div>
                        <h3 className="font-bold text-[#0F2B47] text-sm leading-tight">{job.company}</h3>
                        <p className="text-[#C9A84C] text-xs font-mono mt-0.5">{job.period}</p>
                        <p className="text-stone-400 text-[10px] mt-0.5">{job.location} · {job.duration}</p>
                      </div>
                      <div className="flex items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0F2B47] bg-[#0F2B47]/5 px-2 py-1 rounded border border-[#0F2B47]/10 text-right leading-tight max-w-[120px]">
                          {job.role}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 ml-3">
                      {job.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed">
                          <span className="w-1 h-1 rounded-full bg-[#C9A84C] mt-2 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {idx < WORK_EXPERIENCE.length - 1 && (
                      <div className="mt-6 h-px bg-stone-100" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 sm:p-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2B47] mb-6 pb-3 border-b-2 border-[#C9A84C]">
                Education
              </h2>
              <div className="space-y-5">
                {EDUCATION.map((edu, idx) => (
                  <div key={idx}>
                    <h3 className="font-bold text-[#0F2B47] text-sm uppercase tracking-wide leading-tight">{edu.degree}</h3>
                    <p className="text-[#C9A84C] text-xs font-mono mt-1">{edu.institution} / {edu.year}</p>
                    {edu.notes.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {edu.notes.map((note, nIdx) => (
                          <li key={nIdx} className="flex items-start gap-2 text-xs text-stone-600">
                            <span className="w-1 h-1 rounded-full bg-[#C9A84C] mt-2 shrink-0" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    )}
                    {idx < EDUCATION.length - 1 && <div className="mt-4 h-px bg-stone-100" />}
                  </div>
                ))}
              </div>
            </div>

            {/* ISO Certification */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 sm:p-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2B47] mb-6 pb-3 border-b-2 border-[#C9A84C]">
                Professional Certification
              </h2>
              <h3 className="font-bold text-[#0F2B47] text-sm uppercase tracking-wide leading-tight">{ISO_CERT.title}</h3>
              <p className="text-[#C9A84C] text-xs font-mono mt-1">{ISO_CERT.institution} / {ISO_CERT.year}</p>
              <ul className="mt-3 space-y-1.5">
                {ISO_CERT.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-600 leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-[#C9A84C] mt-2 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-2xl print:rounded-none p-6 print:p-4 sm:p-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#0F2B47] mb-6 pb-3 border-b-2 border-[#C9A84C]">
                Courses & Continuous Learning
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CERTIFICATIONS_COURSES.map((course, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xs font-bold text-[#0F2B47] uppercase tracking-wide leading-tight">{course.title}</span>
                    <span className="text-[#C9A84C] text-[10px] font-mono mt-0.5">{course.institution}</span>
                    <span className="text-stone-400 text-[10px] mt-0.5">{course.date}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Print Footer ── */}
        <div className="hidden print:block mt-8 pt-4 border-t border-stone-200 text-center text-[9px] text-stone-400 font-mono">
          farjadp.info · farjadp@live.com · +1 437 661 1674 · linkedin.com/in/farjadpourmohammad
        </div>

      </div>

      {/* ── Bottom CTA (screen only) ── */}
      <div className="print:hidden bg-[#0F2B47] mt-12 py-16 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-white mb-4">Ready to work together?</h2>
          <p className="text-stone-300 text-sm mb-8 leading-relaxed">
            Whether you need a strategic partner, a technical co-founder, or a startup mentor — let's talk.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="px-8 py-3 rounded-full bg-[#C9A84C] text-[#0F2B47] font-bold text-sm uppercase tracking-widest hover:bg-[#b8963e] transition-colors"
            >
              Book a Strategy Call
            </Link>
            <DownloadResumeButton variant="outline" />
          </div>
        </div>
      </div>

    </div>
  );
}
