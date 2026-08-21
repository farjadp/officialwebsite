import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { FileText, Inbox, Rocket, Users } from "lucide-react"
import { StatusSelect } from "./status-select"

export const dynamic = "force-dynamic"

const STAGE_LABEL: Record<string, string> = {
    idea: "💡 Idea",
    validation: "🔍 Validation",
    "pre-mvp": "⚙️ Pre-MVP",
}

export default async function AdminLabApplicationsPage() {
    const applications = await prisma.labApplication.findMany({
        orderBy: { createdAt: "desc" },
    })

    const total = applications.length
    const newCount = applications.filter((a) => a.status === "NEW").length
    const withDeck = applications.filter((a) => a.deckUrl).length

    return (
        <div className="max-w-6xl space-y-8">

            {/* Header */}
            <div className="flex items-center gap-3">
                <Rocket className="w-6 h-6 text-slate-400" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Lab Applications</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Founder Development Lab applications, submitted via /fa/lab</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-[#1B4B43]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#1B4B43]" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{total}</p>
                        <p className="text-xs text-slate-500">Total Applications</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Inbox className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{newCount}</p>
                        <p className="text-xs text-slate-500">Awaiting Review</p>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{withDeck}</p>
                        <p className="text-xs text-slate-500">With Pitch Deck</p>
                    </div>
                </div>
            </div>

            {/* List */}
            {applications.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <Rocket className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="font-semibold text-slate-500">No applications yet</p>
                    <p className="text-sm text-slate-400 mt-1">Submissions from the Lab application form will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <h3 className="font-bold text-slate-900">{app.name}</h3>
                                        <span className="text-xs font-semibold bg-[#1B4B43]/8 text-[#1B4B43] px-2.5 py-1 rounded-full">
                                            {STAGE_LABEL[app.stage] ?? app.stage}
                                        </span>
                                        {!app.telegramOk && (
                                            <span
                                                className="text-xs font-semibold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full"
                                                title="Telegram notification failed to send for this application"
                                            >
                                                Telegram failed
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-slate-500">
                                        <a href={`mailto:${app.email}`} className="hover:text-[#1B4B43] hover:underline">{app.email}</a>
                                        <a href={`tel:${app.phone}`} dir="ltr" className="hover:text-[#1B4B43] hover:underline">{app.phone}</a>
                                        <span dir="ltr">{app.telegram}</span>
                                        {app.social && (
                                            <a href={app.social.startsWith("http") ? app.social : `https://${app.social}`} target="_blank" rel="noreferrer" className="hover:text-[#1B4B43] hover:underline truncate max-w-[220px]">
                                                {app.social}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-xs text-slate-400 whitespace-nowrap">
                                        {format(new Date(app.createdAt), "MMM d, yyyy · HH:mm")}
                                    </span>
                                    <StatusSelect id={app.id} status={app.status} />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Problem / Idea</p>
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{app.problem}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Why this program?</p>
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{app.why}</p>
                                </div>
                            </div>

                            {app.deckUrl && (
                                <a
                                    href={app.deckUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B4B43] bg-[#1B4B43]/8 hover:bg-[#1B4B43]/15 transition-colors px-3.5 py-2 rounded-lg"
                                >
                                    <FileText className="w-4 h-4" />
                                    {app.deckName || "Download pitch deck"}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
