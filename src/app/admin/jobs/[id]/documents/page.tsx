// ============================================================================
// Route: /admin/jobs/[id]/documents?doc=…&view=resume|cover
// Role: One generated résumé or cover letter, laid out to print. "Save as PDF"
//       in the browser's print dialog is the export: no PDF library, and the
//       text stays selectable for applicant-tracking systems.
// Note: Owner only (see ../../layout.tsx). Everything shown is rendered as
//       text; nothing the model wrote is ever treated as HTML.
// ============================================================================

import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { CopyButton, PrintButton } from "@/components/admin/jobs/document-buttons"
import type { Resume } from "@/lib/jobs/documents"

export const dynamic = "force-dynamic"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mt-5 break-inside-avoid-page">
            <h2 className="border-b border-slate-300 pb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700">{title}</h2>
            <div className="mt-2.5">{children}</div>
        </section>
    )
}

function ResumeSheet({ resume }: { resume: Resume }) {
    return (
        <article className="text-[13px] leading-snug text-slate-900 print:text-[10.5pt]">
            <header>
                <h1 className="text-[26px] font-bold tracking-tight print:text-[20pt]">{resume.name}</h1>
                <p className="mt-0.5 text-[15px] text-slate-700 print:text-[11.5pt]">{resume.headline}</p>
                <p className="mt-1.5 text-[12px] text-slate-600 print:text-[9.5pt]">{resume.contact.join("  ·  ")}</p>
            </header>

            <Section title="Summary">
                <p>{resume.summary}</p>
            </Section>

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
                            {role.bullets.length > 0 && (
                                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                                    {role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            {resume.skills.length > 0 && (
                <Section title="Skills">
                    <p>{resume.skills.join(" · ")}</p>
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

export default async function DocumentsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ doc?: string; view?: string }>
}) {
    const { id } = await params
    const { doc, view } = await searchParams

    const document = await prisma.jobDocument.findFirst({
        where: { postingId: id, ...(doc ? { id: doc } : {}) },
        orderBy: { createdAt: "desc" },
        include: { posting: { select: { title: true, company: true } } },
    })
    if (!document) notFound()

    const resume = document.resume as unknown as Resume
    const showCover = view === "cover"
    const letter = `${document.coverLetter}\n\n${resume.name}`
    const tab = (active: boolean) =>
        `rounded-lg px-3.5 py-1.5 text-sm font-semibold ${active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`

    return (
        <div className="space-y-5 print:space-y-0">
            <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                <div>
                    <Link href={`/admin/jobs/${id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900">
                        <ArrowLeft className="h-4 w-4" /> {document.posting.title}, {document.posting.company}
                    </Link>
                    <p className="mt-1 text-xs text-slate-400">
                        Written {format(document.createdAt, "d MMM yyyy, HH:mm")} by {document.model}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`?doc=${document.id}`} className={tab(!showCover)}>Résumé</Link>
                    <Link href={`?doc=${document.id}&view=cover`} className={tab(showCover)}>Cover letter</Link>
                    {showCover && <CopyButton text={letter} />}
                    <PrintButton />
                </div>
            </div>

            {document.notes.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 print:hidden">
                    <p className="font-semibold">Corrected before saving</p>
                    <ul className="mt-1 list-disc pl-4">
                        {document.notes.map((note) => <li key={note}>{note}</li>)}
                    </ul>
                </div>
            )}

            <p className="text-xs text-slate-500 print:hidden">
                Read every line before you send it. In the print dialog choose “Save as PDF”, Letter size, margins Default.
            </p>

            <div className="mx-auto max-w-[8.5in] rounded-sm bg-white p-[0.7in] shadow-sm ring-1 ring-slate-200 print:max-w-none print:p-0 print:shadow-none print:ring-0">
                {showCover ? (
                    <article className="max-w-[65ch] whitespace-pre-wrap text-[14px] leading-relaxed text-slate-900 print:text-[11pt]">
                        <p className="mb-6 text-slate-600">{resume.contact.join("  ·  ")}</p>
                        <p className="mb-5">{format(new Date(), "d MMMM yyyy")}</p>
                        <p className="mb-5">Hiring team, {document.posting.company}</p>
                        {letter}
                    </article>
                ) : (
                    <ResumeSheet resume={resume} />
                )}
            </div>
        </div>
    )
}
