"use client"

// ============================================================================
// /admin/intake/[id] — full startup intake submission view
// ============================================================================

import { useCallback, useEffect, useState } from "react"
import { use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"
import {
    ArrowLeft,
    CheckCircle2,
    ExternalLink,
    FileText,
    Globe,
    Linkedin,
    Loader2,
    Mail,
    Paperclip,
    Phone,
    Save,
    Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    COUNTRIES,
    INTAKE_SECTIONS,
    questionText,
    type IntakeCountry,
    type IntakeFile,
    type IntakeFounder,
} from "@/data/startup-intake/config"

interface SubmissionDetail {
    id: string
    startupName: string
    website: string | null
    country: string
    founders: IntakeFounder[]
    answers: Record<string, string>
    files: { logo?: IntakeFile; pitchDeck?: IntakeFile; documents?: IntakeFile[] }
    status: string
    reviewNote: string | null
    createdAt: string
    user: { name: string | null; email: string } | null
}

export default function IntakeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [submission, setSubmission] = useState<SubmissionDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [note, setNote] = useState("")
    const [savingNote, setSavingNote] = useState(false)
    const [togglingStatus, setTogglingStatus] = useState(false)

    const load = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/intake/submissions?id=${id}`)
            const data = await res.json()
            if (!res.ok || !data.success) throw new Error()
            setSubmission(data.data)
            setNote(data.data.reviewNote || "")
        } catch {
            toast.error("Failed to load submission")
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => { load() }, [load])

    async function toggleStatus() {
        if (!submission) return
        setTogglingStatus(true)
        try {
            const next = submission.status === "REVIEWED" ? "SUBMITTED" : "REVIEWED"
            const res = await fetch("/api/admin/intake/submissions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: submission.id, status: next }),
            })
            if (!res.ok) throw new Error()
            setSubmission({ ...submission, status: next })
            toast.success(next === "REVIEWED" ? "Marked as reviewed" : "Marked as new")
        } catch {
            toast.error("Failed to update status")
        } finally {
            setTogglingStatus(false)
        }
    }

    async function saveNote() {
        if (!submission) return
        setSavingNote(true)
        try {
            const res = await fetch("/api/admin/intake/submissions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: submission.id, reviewNote: note }),
            })
            if (!res.ok) throw new Error()
            toast.success("Note saved")
        } catch {
            toast.error("Failed to save note")
        } finally {
            setSavingNote(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
        )
    }

    if (!submission) {
        return (
            <div className="max-w-3xl py-16 text-center">
                <p className="text-slate-500">Submission not found.</p>
                <Link href="/admin/intake" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1B4B43] hover:underline">
                    <ArrowLeft className="w-4 h-4" /> Back to Intake
                </Link>
            </div>
        )
    }

    const countryData = COUNTRIES.find((c) => c.id === submission.country)
    const country = (countryData?.id ?? null) as IntakeCountry | null
    const files = submission.files || {}
    const documents = files.documents ?? []

    return (
        <div className="max-w-4xl space-y-8">
            {/* Back + header */}
            <div>
                <Link href="/admin/intake" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Intake
                </Link>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {files.logo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={files.logo.url} alt="" className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200" />
                            ) : (
                                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300">
                                    <FileText className="w-6 h-6" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900" dir="auto">{submission.startupName}</h1>
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                                    <span>{countryData ? `${countryData.flag} ${countryData.nameFa}` : submission.country}</span>
                                    {submission.website && (
                                        <a href={submission.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#1B4B43] hover:underline">
                                            <Globe className="w-3.5 h-3.5" />
                                            Website
                                        </a>
                                    )}
                                    <span className="text-xs text-slate-400">{format(new Date(submission.createdAt), "MMM d, yyyy · HH:mm")}</span>
                                </div>
                                <div className="mt-2 text-sm text-slate-600">
                                    Applicant: {submission.user?.name || "—"} ({submission.user?.email || "—"})
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={toggleStatus}
                            disabled={togglingStatus}
                            variant={submission.status === "REVIEWED" ? "outline" : "default"}
                            className={submission.status === "REVIEWED" ? "" : "bg-[#1B4B43] hover:bg-[#143a34]"}
                        >
                            {togglingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            {submission.status === "REVIEWED" ? "Reviewed ✓ (undo)" : "Mark Reviewed"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Founders */}
            <section className="space-y-3">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> Founders</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {submission.founders.map((f, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex gap-4">
                            {f.photoUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={f.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0" />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 shrink-0">
                                    <Users className="w-5 h-5" />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="font-bold text-slate-900" dir="auto">{f.name}</p>
                                <p className="text-xs text-slate-500 mb-2" dir="auto">{f.role}</p>
                                <div className="space-y-1 text-xs">
                                    <a href={`mailto:${f.email}`} className="flex items-center gap-1.5 text-[#1B4B43] hover:underline">
                                        <Mail className="w-3 h-3" /> <span dir="ltr">{f.email}</span>
                                    </a>
                                    {f.phone && (
                                        <span className="flex items-center gap-1.5 text-slate-500">
                                            <Phone className="w-3 h-3" /> <span dir="ltr">{f.phone}</span>
                                        </span>
                                    )}
                                    {f.linkedin && (
                                        <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#1B4B43] hover:underline">
                                            <Linkedin className="w-3 h-3" /> LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Files */}
            {(files.logo || files.pitchDeck || documents.length > 0) && (
                <section className="space-y-3">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2"><Paperclip className="w-4 h-4 text-slate-400" /> Files</h2>
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
                        {files.logo && <FileRow label="Logo" file={files.logo} />}
                        {files.pitchDeck && <FileRow label="Pitch Deck" file={files.pitchDeck} />}
                        {documents.map((doc, i) => (
                            <FileRow key={i} label={`Document ${i + 1}`} file={doc} />
                        ))}
                    </div>
                </section>
            )}

            {/* Answers */}
            <section className="space-y-4">
                <h2 className="font-bold text-slate-900 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /> Answers</h2>
                {INTAKE_SECTIONS.map((section) => (
                    <div key={section.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-[#1B4B43] mb-5 text-right" dir="rtl">{section.title}</h3>
                        <div className="space-y-5">
                            {section.questions.map((q) => (
                                <div key={q.id}>
                                    <p className="text-xs font-bold text-slate-400 mb-1.5 text-right" dir="rtl">
                                        {questionText(q, country)}
                                    </p>
                                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl px-4 py-3" dir="auto">
                                        {submission.answers[q.id] || "—"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* Review note */}
            <section className="space-y-3">
                <h2 className="font-bold text-slate-900">Private Review Note</h2>
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        placeholder="Internal notes about this team (not visible to the applicant)..."
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-[#1B4B43] focus:ring-1 focus:ring-[#1B4B43]/20 resize-y"
                    />
                    <div className="flex justify-end">
                        <Button onClick={saveNote} disabled={savingNote} className="bg-[#1B4B43] hover:bg-[#143a34]">
                            {savingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Note
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

function FileRow({ label, file }: { label: string; file: IntakeFile }) {
    const sizeMb = file.size > 0 ? (file.size / (1024 * 1024)).toFixed(1) + " MB" : ""
    return (
        <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3 hover:bg-slate-50 transition-colors group"
        >
            <div className="flex items-center gap-3 min-w-0">
                <Paperclip className="w-4 h-4 text-[#1B4B43] shrink-0" />
                <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-400">{label}</p>
                    <p className="text-sm text-slate-800 truncate" dir="ltr">{file.name}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                {sizeMb && <span>{sizeMb}</span>}
                <ExternalLink className="w-3.5 h-3.5 group-hover:text-[#1B4B43] transition-colors" />
            </div>
        </a>
    )
}
