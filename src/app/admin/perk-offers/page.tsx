// ============================================================================
// Route: /admin/perk-offers
// Role: Review perk offers submitted from /fa/lab/perks.
// Why:  Offers previously existed only as a database row and a notification
//       email, so a bounced or deleted email meant an offer nobody could find.
// Note: Behind the admin login, like the rest of /admin.
// ============================================================================

import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { Gift, Globe, Handshake, Inbox, MailWarning } from "lucide-react"
import { COUNTRIES, MARKETS, PERK_TYPES, labelOf } from "@/lib/perk-offer"
import { StatusSelect } from "./status-select"

export const dynamic = "force-dynamic"

function Stat({ icon: Icon, tint, value, label }: {
    icon: typeof Gift
    tint: string
    value: number
    label: string
}) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tint}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
            </div>
        </div>
    )
}

export default async function AdminPerkOffersPage() {
    const offers = await prisma.perkOffer.findMany({ orderBy: { createdAt: "desc" } })

    const newCount = offers.filter((o) => o.status === "NEW").length
    // An offer whose notification bounced is one Farjad may never have seen.
    const unnotified = offers.filter((o) => !o.emailOk).length

    return (
        <div className="max-w-6xl space-y-8">
            <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-slate-400" />
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Perk Offers</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Astaneh partner offers, submitted via /fa/lab/perks
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Stat icon={Handshake} tint="bg-[#1B4B43]/10 text-[#1B4B43]" value={offers.length} label="Total Offers" />
                <Stat icon={Inbox} tint="bg-blue-50 text-blue-600" value={newCount} label="Awaiting Review" />
                <Stat icon={MailWarning} tint="bg-rose-50 text-rose-600" value={unnotified} label="Notification Failed" />
            </div>

            {unnotified > 0 && (
                <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3">
                    {unnotified} offer{unnotified === 1 ? "" : "s"} saved without a notification email
                    reaching you. They are listed below and are not lost — check PERK_NOTIFY_EMAIL.
                </p>
            )}

            {offers.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
                    <Gift className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="font-semibold text-slate-500">No offers yet</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Submissions from the perk partner form will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <h3 className="font-bold text-slate-900">{offer.companyName}</h3>
                                        <span className="text-xs font-semibold bg-[#1B4B43]/8 text-[#1B4B43] px-2.5 py-1 rounded-full">
                                            {labelOf(PERK_TYPES, offer.perkType)}
                                        </span>
                                        {!offer.emailOk && (
                                            <span
                                                className="text-xs font-semibold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full"
                                                title="The notification email for this offer was not delivered"
                                            >
                                                Email failed
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-slate-500">
                                        <span>{offer.contactName}</span>
                                        <a href={`mailto:${offer.email}`} className="hover:text-[#1B4B43] hover:underline">
                                            {offer.email}
                                        </a>
                                        <a
                                            href={offer.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="hover:text-[#1B4B43] hover:underline truncate max-w-[240px]"
                                        >
                                            {offer.website}
                                        </a>
                                        {offer.telegram && (
                                            <a
                                                href={`https://t.me/${offer.telegram.replace(/^@/, "")}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                dir="ltr"
                                                className="hover:text-[#1B4B43] hover:underline"
                                            >
                                                {offer.telegram}
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-xs text-slate-400 whitespace-nowrap">
                                        {format(new Date(offer.createdAt), "MMM d, yyyy · HH:mm")}
                                    </span>
                                    <StatusSelect id={offer.id} status={offer.status} />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Perk</p>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap" dir="auto">
                                    {offer.description}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4 text-sm border-t border-slate-100 pt-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Registered in</p>
                                    <p className="text-slate-700">{labelOf(COUNTRIES, offer.country)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Est. value</p>
                                    <p className="text-slate-700" dir="auto">{offer.valueEstimate || "—"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Valid for</p>
                                    <p className="text-slate-700" dir="auto">{offer.validity || "—"}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Globe className="w-3.5 h-3.5 text-slate-400" />
                                {offer.markets.map((m) => (
                                    <span key={m} className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                        {labelOf(MARKETS, m)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
