// ============================================================================
// Route: /admin/jobs/[id]/documents?doc=…&view=resume|cover
// Role: Edit one generated résumé and cover letter, with AI help and an ATS /
//       AI-writing review, beside the page exactly as it prints. "Save as PDF"
//       in the print dialog is the export, so the text stays selectable for
//       applicant-tracking systems.
// Note: Owner only (see ../../layout.tsx). Everything is rendered as text;
//       nothing the model wrote is ever treated as HTML.
// ============================================================================

import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ResumeEditor } from "@/components/admin/jobs/resume-editor"
import { sourceText, type Resume } from "@/lib/jobs/documents"
import { allowedTitles } from "@/lib/jobs/editor"
import { loadProfile } from "@/lib/jobs/profile"

export const dynamic = "force-dynamic"
// AI help and the review are server actions on this page: one model call each.
export const maxDuration = 120

export default async function DocumentsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ doc?: string; view?: string }>
}) {
    const { id } = await params
    const { doc, view } = await searchParams

    const [document, profile] = await Promise.all([
        prisma.jobDocument.findFirst({
            where: { postingId: id, ...(doc ? { id: doc } : {}) },
            orderBy: { createdAt: "desc" },
            include: { posting: { select: { title: true, company: true } } },
        }),
        loadProfile(),
    ])
    if (!document) notFound()

    const resume = document.resume as unknown as Resume

    return (
        <div className="space-y-4 print:space-y-0">
            <div className="print:hidden">
                <Link href={`/admin/jobs/${id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="h-4 w-4" /> {document.posting.title}, {document.posting.company}
                </Link>
                <p className="mt-1 text-xs text-slate-400">
                    Written {format(document.createdAt, "d MMM yyyy, HH:mm")} by {document.model}
                    {document.editedAt ? ` · edited ${format(document.editedAt, "d MMM, HH:mm")}` : ""}
                </p>
            </div>

            {document.notes.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 print:hidden">
                    <p className="font-semibold">Corrected when it was written</p>
                    <ul className="mt-1 list-disc pl-4">
                        {document.notes.map((note) => <li key={note}>{note}</li>)}
                    </ul>
                </div>
            )}

            <ResumeEditor
                key={document.id}
                documentId={document.id}
                company={document.posting.company}
                initialResume={resume}
                initialCoverLetter={document.coverLetter}
                titleOptions={resume.roles.map((role) => allowedTitles(role, profile.history))}
                source={sourceText(profile)}
                today={format(new Date(), "d MMMM yyyy")}
                initialView={view === "cover" ? "cover" : "resume"}
            />
        </div>
    )
}
