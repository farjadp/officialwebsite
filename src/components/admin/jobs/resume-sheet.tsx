// The printed résumé and cover letter. Pure markup, shared by the server page
// and the editor's live preview, so what is previewed is what prints.

import type { Resume } from "@/lib/jobs/documents"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mt-5 break-inside-avoid-page">
            <h2 className="border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700">{title}</h2>
            <div className="mt-2.5">{children}</div>
        </section>
    )
}

export function ResumeSheet({ resume }: { resume: Resume }) {
    return (
        <article className="text-[13px] leading-snug text-slate-900 print:text-[10.5pt]">
            <header>
                <h1 className="text-[26px] font-bold tracking-tight print:text-[20pt]">{resume.name}</h1>
                {resume.headline && <p className="mt-0.5 text-[15px] text-slate-700 print:text-[11.5pt]">{resume.headline}</p>}
                <p className="mt-1.5 text-[12px] text-slate-600 print:text-[9.5pt]">{resume.contact.join("  ·  ")}</p>
            </header>

            {resume.summary && (
                <Section title="Summary">
                    <p>{resume.summary}</p>
                </Section>
            )}

            <Section title="Experience">
                <div className="space-y-3.5">
                    {resume.roles.map((role) => (
                        <div key={`${role.company}-${role.span}`} className="break-inside-avoid">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                                <p>
                                    <span className="font-bold">{role.title}</span>
                                    <span className="text-slate-700">, {role.company}</span>
                                    {role.location && <span className="text-slate-500"> · {role.location}</span>}
                                </p>
                                <p className="tabular-nums text-slate-600">{role.span}</p>
                            </div>
                            {role.bullets.filter((b) => b.trim()).length > 0 && (
                                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                                    {role.bullets.filter((b) => b.trim()).map((bullet, index) => <li key={index}>{bullet}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            {resume.skills.filter((s) => s.trim()).length > 0 && (
                <Section title="Skills">
                    <p>{resume.skills.filter((s) => s.trim()).join(" · ")}</p>
                </Section>
            )}

            {resume.education.length > 0 && (
                <Section title="Education">
                    <ul className="space-y-0.5">
                        {resume.education.map((item) => (
                            <li key={`${item.degree}-${item.school}`} className="flex justify-between gap-4">
                                <span>
                                    <span className="font-semibold">{item.degree}</span>
                                    {item.school && <span className="text-slate-700">, {item.school}</span>}
                                </span>
                                <span className="tabular-nums text-slate-600">{item.year}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            {resume.certifications.length > 0 && (
                <Section title="Certifications and courses">
                    <ul className="space-y-0.5">
                        {resume.certifications.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </Section>
            )}
        </article>
    )
}

export function CoverSheet({ resume, company, letter, date }: { resume: Resume; company: string; letter: string; date: string }) {
    return (
        <article className="max-w-[65ch] whitespace-pre-wrap text-[14px] leading-relaxed text-slate-900 print:text-[11pt]">
            <p className="mb-6 text-slate-600">{resume.contact.join("  ·  ")}</p>
            <p className="mb-5">{date}</p>
            <p className="mb-5">Hiring team, {company}</p>
            {letter}
            {"\n\n"}
            {resume.name}
        </article>
    )
}
