"use client"

// ============================================================================
// Hardware Source: import-panel.tsx
// Version: 1.0.0 — 2026-08-23
// Why: Four import paths with a shared result summary
// Env / Identity: Client Component
// ============================================================================

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Upload, ClipboardPaste, Database, Loader2, Check, AlertTriangle, Download, Users, X } from "lucide-react"
import {
    previewImportBatch,
    importContactBatch,
    finishImport,
    importPastedContacts,
    importSiteContacts,
    listMailchimpAudiences,
    importMailchimpAudience,
} from "@/lib/actions/email"
import {
    normalizeRows,
    parseCsv,
    rowsToContacts,
    describeHeaderFailure,
    type ParsedRow,
} from "@/lib/email/csv"
import type { ImportSummary, ImportPreview, ConflictStrategy } from "@/lib/email/import"
import { cn } from "@/lib/utils"

const inputClass =
    "w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"

function Summary({ summary }: { summary: ImportSummary }) {
    return (
        <div className="space-y-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                <Check className="h-4 w-4" />
                Import finished
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
                {[
                    { label: "Rows", value: summary.total },
                    { label: "Created", value: summary.created },
                    { label: "Updated", value: summary.updated },
                    { label: "Already in list", value: summary.alreadyInList },
                    { label: "Left alone", value: summary.skipped },
                    { label: "Suppressed", value: summary.suppressed },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-md bg-white/70 px-2.5 py-2 text-center">
                        <div className="text-lg font-bold tabular-nums text-slate-900">{stat.value}</div>
                        <div className="text-[11px] text-slate-500">{stat.label}</div>
                    </div>
                ))}
            </div>
            {summary.invalidSamples.length > 0 && (
                <p className="text-xs text-emerald-800">
                    Skipped examples: {summary.invalidSamples.join(", ")}
                </p>
            )}
            {summary.suppressed > 0 && (
                <p className="text-xs text-emerald-800">
                    {summary.suppressed} addresses were skipped because they previously bounced, complained or
                    unsubscribed. Re-importing them would put your domain reputation at risk.
                </p>
            )}
            {summary.alreadyInList > 0 && (
                <p className="text-xs text-emerald-800">
                    {summary.alreadyInList.toLocaleString()} were already in this list, so nothing was written for them.
                    A contact can belong to several lists but never appears twice in one.
                </p>
            )}
            {summary.invalid > 0 && (
                <p className="text-xs text-emerald-800">
                    {summary.invalid.toLocaleString()} rows were dropped as invalid or repeated within the file.
                </p>
            )}
        </div>
    )
}

function Card({
    title,
    description,
    icon: Icon,
    children,
}: {
    title: string
    description: string
    icon: typeof Upload
    children: React.ReactNode
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-3">
                <div className="rounded-lg bg-violet-50 p-2">
                    <Icon className="h-4 w-4 text-violet-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-slate-900">{title}</h2>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
                    <div className="mt-4 space-y-3">{children}</div>
                </div>
            </div>
        </div>
    )
}

export function ImportPanel({
    lists,
    siteCounts,
    mailchimpConfigured,
}: {
    lists: { id: string; name: string }[]
    siteCounts: { subscribers: number; leads: number }
    mailchimpConfigured: boolean
}) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [summary, setSummary] = useState<ImportSummary | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [audiences, setAudiences] = useState<{ id: string; name: string; memberCount: number }[]>([])
    const [mcTarget, setMcTarget] = useState("")

    const [fileListId, setFileListId] = useState("")
    const [fileDoubleOptIn, setFileDoubleOptIn] = useState(false)
    const [progress, setProgress] = useState<{ label: string; done: number; total: number } | null>(null)
    const [busy, setBusy] = useState(false)

    // Held between the preview and the confirmed import
    const [staged, setStaged] = useState<{ rows: ParsedRow[]; fileName: string; listId: string } | null>(null)
    const [preview, setPreview] = useState<ImportPreview | null>(null)
    const [strategy, setStrategy] = useState<ConflictStrategy>("enrich")

    /** Rows per request. Small enough to stay well inside the body limit and to
     *  keep any single request far below the function timeout. */
    const BATCH = 500

    const targetListName = lists.find((l) => l.id === (staged?.listId ?? fileListId))?.name ?? null

    const readFile = async (file: File): Promise<ParsedRow[]> => {
        const name = file.name.toLowerCase()

        // exceljs reads the modern OOXML format only; .xls is a different,
        // binary format and fails with an opaque error if we try
        if (name.endsWith(".xls")) {
            throw new Error(
                "This is the old .xls format, which cannot be read here. Open it in Excel or Sheets and save as .xlsx or .csv."
            )
        }
        if (name.endsWith(".numbers") || name.endsWith(".pdf") || name.endsWith(".docx")) {
            throw new Error(`${file.name} is not a spreadsheet. Export it as .csv or .xlsx first.`)
        }

        const grid = await readGrid(file)
        const rows = rowsToContacts(grid)
        // A file that parsed into a grid but yielded no contacts has a header
        // problem, and the message should say which columns were actually there
        if (!rows.length) throw new Error(describeHeaderFailure(grid))
        return rows
    }

    const readGrid = async (file: File): Promise<string[][]> => {
        if (file.name.toLowerCase().endsWith(".xlsx")) {
            // Loaded on demand — the workbook parser is far too large to ship
            // to every visitor who opens the admin
            const ExcelJS = (await import("exceljs")).default
            const workbook = new ExcelJS.Workbook()
            await workbook.xlsx.load(await file.arrayBuffer())
            const sheet = workbook.worksheets[0]
            if (!sheet) throw new Error("The workbook has no sheets")
            const grid: string[][] = []
            sheet.eachRow((row) => {
                const cells: string[] = []
                row.eachCell({ includeEmpty: true }, (cell) => {
                    const value = cell.value
                    if (value == null) cells.push("")
                    else if (typeof value === "object" && "text" in value) cells.push(String(value.text))
                    else if (typeof value === "object" && "result" in value) cells.push(String(value.result ?? ""))
                    else cells.push(String(value))
                })
                grid.push(cells)
            })
            return grid
        }
        return parseCsv(await file.text())
    }

    /** Phase one: read the file and report what an import would do. Writes nothing. */
    const runPreview = async (file: File) => {
        setBusy(true)
        setError(null)
        setSummary(null)
        setPreview(null)
        setStaged(null)
        setProgress({ label: "Reading file…", done: 0, total: 0 })

        try {
            const rows = await readFile(file)
            const { valid } = normalizeRows(rows)
            if (!valid.length) throw new Error("Every row in this file was rejected as invalid.")

            setProgress({ label: "Checking against existing contacts…", done: 0, total: valid.length })

            const totals: ImportPreview = {
                total: 0, invalid: 0, duplicatesInFile: 0, unique: 0,
                brandNew: 0, existingElsewhere: 0, alreadyInList: 0, suppressed: 0,
                existingSamples: [], invalidSamples: [],
            }

            for (let i = 0; i < rows.length; i += BATCH) {
                const result = await previewImportBatch(rows.slice(i, i + BATCH), { listId: fileListId || undefined })
                if (!result.success || !result.data) throw new Error(result.error ?? "Preview failed")
                const d = result.data
                totals.total += d.total
                totals.invalid += d.invalid
                totals.duplicatesInFile += d.duplicatesInFile
                totals.unique += d.unique
                totals.brandNew += d.brandNew
                totals.existingElsewhere += d.existingElsewhere
                totals.alreadyInList += d.alreadyInList
                totals.suppressed += d.suppressed
                if (totals.existingSamples.length < 8) {
                    totals.existingSamples.push(...d.existingSamples.slice(0, 8 - totals.existingSamples.length))
                }
                if (totals.invalidSamples.length < 10) {
                    totals.invalidSamples.push(...d.invalidSamples.slice(0, 10 - totals.invalidSamples.length))
                }
                setProgress({ label: "Checking against existing contacts…", done: Math.min(i + BATCH, rows.length), total: rows.length })
            }

            setPreview(totals)
            setStaged({ rows, fileName: file.name, listId: fileListId })
            setProgress(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not read the file")
            setProgress(null)
        } finally {
            setBusy(false)
        }
    }

    /** Phase two: the user has seen the collisions and chosen what to do. */
    const runImport = async () => {
        if (!staged) return
        setBusy(true)
        setError(null)
        setProgress({ label: "Importing…", done: 0, total: staged.rows.length })

        try {
            const totals: ImportSummary = {
                total: 0, created: 0, updated: 0, invalid: 0,
                suppressed: 0, alreadyInList: 0, skipped: 0, invalidSamples: [],
            }

            for (let i = 0; i < staged.rows.length; i += BATCH) {
                const result = await importContactBatch(staged.rows.slice(i, i + BATCH), {
                    listId: staged.listId || undefined,
                    source: "csv",
                    doubleOptIn: fileDoubleOptIn,
                    onConflict: strategy,
                })
                if (!result.success || !result.data) {
                    throw new Error(
                        `${result.error ?? "Import failed"} (stopped after ${totals.created + totals.updated} contacts)`
                    )
                }
                const d = result.data
                totals.total += d.total
                totals.created += d.created
                totals.updated += d.updated
                totals.invalid += d.invalid
                totals.suppressed += d.suppressed
                totals.alreadyInList += d.alreadyInList
                totals.skipped += d.skipped
                setProgress({ label: "Importing…", done: Math.min(i + BATCH, staged.rows.length), total: staged.rows.length })
            }

            await finishImport()
            setSummary(totals)
            setPreview(null)
            setStaged(null)
            setProgress(null)
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Import failed")
            setProgress(null)
        } finally {
            setBusy(false)
        }
    }

    const handle = (fn: () => Promise<{ success: boolean; error?: string; data?: ImportSummary }>) =>
        startTransition(async () => {
            setError(null)
            setSummary(null)
            const result = await fn()
            if (result.success && result.data) {
                setSummary(result.data)
                router.refresh()
            } else {
                setError(result.error ?? "Import failed")
            }
        })

    const ListSelect = ({ name }: { name: string }) => (
        <select name={name} className={inputClass} defaultValue="">
            <option value="">No list (contacts only)</option>
            {lists.map((list) => (
                <option key={list.id} value={list.id}>
                    Add to: {list.name}
                </option>
            ))}
        </select>
    )

    const DoubleOptIn = () => (
        <label className="flex items-start gap-2 text-xs text-slate-600">
            <input type="checkbox" name="doubleOptIn" className="mt-0.5 h-4 w-4 accent-violet-600" />
            <span>
                Require double opt-in — contacts land as <strong>PENDING</strong> and must confirm before they can be
                mailed. Slower, and the single biggest protection against spam foldering.
            </span>
        </label>
    )

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-semibold text-slate-900">Import contacts</h1>
                <p className="text-sm text-slate-500">
                    Suppressed addresses are filtered out of every import automatically.
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </div>
            )}
            {summary && <Summary summary={summary} />}
            {(pending || busy) && (
                <div className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-800">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing — large lists can take a minute.
                </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
                <Card
                    title="CSV or Excel file"
                    description="Needs a header row with an 'email' column. first_name, last_name, company and locale are recognised; any other column becomes a custom merge field. Large files are parsed here in the browser and uploaded in batches, so size is not a limit."
                    icon={Upload}
                >
                    <div className="space-y-3">
                        <input
                            type="file"
                            accept=".csv,.tsv,.txt,.xlsx"
                            onChange={(event) => {
                                const file = event.target.files?.[0]
                                if (file) void runPreview(file)
                                event.target.value = ""
                            }}
                            disabled={busy}
                            className="w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-violet-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-violet-700"
                        />
                        <select
                            value={fileListId}
                            onChange={(e) => setFileListId(e.target.value)}
                            // Locked once a file is staged: changing it mid-run is
                            // what left the last import only partly categorised
                            disabled={busy || !!staged}
                            className={cn(inputClass, (busy || !!staged) && "cursor-not-allowed opacity-60")}
                        >
                            <option value="">No list (contacts only)</option>
                            {lists.map((list) => (
                                <option key={list.id} value={list.id}>
                                    Add to: {list.name}
                                </option>
                            ))}
                        </select>
                        <label className="flex items-start gap-2 text-xs text-slate-600">
                            <input
                                type="checkbox"
                                checked={fileDoubleOptIn}
                                onChange={(e) => setFileDoubleOptIn(e.target.checked)}
                                className="mt-0.5 h-4 w-4 accent-violet-600"
                            />
                            <span>
                                Require double opt-in — contacts land as <strong>PENDING</strong> and must confirm
                                before they can be mailed. Slower, and the single biggest protection against spam
                                foldering.
                            </span>
                        </label>

                        {preview && staged && (
                            <div className="space-y-4 rounded-lg border border-amber-300 bg-amber-50/70 p-4">
                                <div>
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                                        <Users className="h-4 w-4" />
                                        Nothing has been imported yet
                                    </h3>
                                    <p className="mt-0.5 text-xs text-amber-900/80">
                                        Here is what <strong>{staged.fileName}</strong> would do.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {[
                                        { label: "Brand new", value: preview.brandNew, tone: "text-emerald-700" },
                                        { label: "Already exist", value: preview.existingElsewhere, tone: "text-amber-700" },
                                        {
                                            label: targetListName ? `Already in ${targetListName}` : "Already in list",
                                            value: preview.alreadyInList,
                                            tone: "text-slate-600",
                                        },
                                        { label: "Suppressed", value: preview.suppressed, tone: "text-rose-700" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="rounded-md bg-white/80 px-2.5 py-2 text-center">
                                            <div className={cn("text-lg font-bold tabular-nums", stat.tone)}>
                                                {stat.value.toLocaleString()}
                                            </div>
                                            <div className="text-[11px] leading-tight text-slate-500">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-xs leading-relaxed text-amber-900/80">
                                    {preview.invalid > 0 && <>{preview.invalid.toLocaleString()} invalid addresses and </>}
                                    {preview.duplicatesInFile.toLocaleString()} repeats inside the file were removed before
                                    this check. Suppressed addresses are excluded no matter what you choose — they bounced,
                                    complained or unsubscribed.
                                </p>

                                {preview.existingSamples.length > 0 && (
                                    <details className="rounded-md bg-white/80 p-2.5">
                                        <summary className="cursor-pointer text-xs font-medium text-slate-700">
                                            Examples of addresses already on file
                                        </summary>
                                        <ul className="mt-2 space-y-1">
                                            {preview.existingSamples.map((sample) => (
                                                <li key={sample.email} className="text-xs text-slate-600">
                                                    <span className="font-mono">{sample.email}</span>
                                                    {sample.lists.length > 0 && (
                                                        <span className="text-slate-400"> — in {sample.lists.join(", ")}</span>
                                                    )}
                                                    {sample.lists.length === 0 && (
                                                        <span className="text-slate-400"> — in no list</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                )}

                                {preview.existingElsewhere > 0 ? (
                                    <fieldset className="space-y-2">
                                        <legend className="text-xs font-semibold text-amber-900">
                                            What should happen to the {preview.existingElsewhere.toLocaleString()} that
                                            already exist?
                                        </legend>
                                        {([
                                            {
                                                value: "enrich",
                                                title: "Update their details and add to this list",
                                                detail: "Fills in blanks and merges new columns. Never overwrites data you already have, and never changes their subscribed status.",
                                            },
                                            {
                                                value: "keep",
                                                title: "Add to this list, leave their details alone",
                                                detail: "Membership only. Use this when the new file is less trustworthy than what is already on file.",
                                            },
                                            {
                                                value: "skip",
                                                title: "Ignore them entirely",
                                                detail: "Only the brand-new addresses are imported. Existing contacts are not touched and not added to the list.",
                                            },
                                        ] as const).map((option) => (
                                            <label
                                                key={option.value}
                                                className={cn(
                                                    "flex cursor-pointer items-start gap-2.5 rounded-md border bg-white/80 p-2.5 transition-colors",
                                                    strategy === option.value
                                                        ? "border-violet-400 ring-1 ring-violet-200"
                                                        : "border-slate-200 hover:border-slate-300"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name="conflict"
                                                    value={option.value}
                                                    checked={strategy === option.value}
                                                    onChange={() => setStrategy(option.value)}
                                                    className="mt-0.5 h-4 w-4 accent-violet-600"
                                                />
                                                <span>
                                                    <span className="block text-xs font-medium text-slate-900">
                                                        {option.title}
                                                    </span>
                                                    <span className="block text-[11px] leading-snug text-slate-500">
                                                        {option.detail}
                                                    </span>
                                                </span>
                                            </label>
                                        ))}
                                    </fieldset>
                                ) : (
                                    <p className="rounded-md bg-white/80 p-2.5 text-xs text-slate-600">
                                        No collisions — every address in this file is new.
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-2">
                                    <button
                                        type="button"
                                        disabled={busy}
                                        onClick={() => void runImport()}
                                        className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                                    >
                                        Import {(strategy === "skip" ? preview.brandNew : preview.brandNew + preview.existingElsewhere).toLocaleString()} contacts
                                    </button>
                                    <button
                                        type="button"
                                        disabled={busy}
                                        onClick={() => {
                                            setPreview(null)
                                            setStaged(null)
                                        }}
                                        className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600 hover:border-slate-400"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {progress && (
                            <div className="space-y-1.5 rounded-lg border border-violet-200 bg-violet-50 p-3">
                                <div className="flex items-center justify-between text-xs font-medium text-violet-900">
                                    <span>{progress.label}</span>
                                    <span className="tabular-nums">
                                        {progress.done.toLocaleString()} / {progress.total.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-violet-200">
                                    <div
                                        className="h-full rounded-full bg-violet-600 transition-all duration-200"
                                        style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                <Card
                    title="Paste addresses"
                    description="Paste raw email addresses one per line, or a full CSV block copied from a spreadsheet."
                    icon={ClipboardPaste}
                >
                    <form action={(formData) => handle(() => importPastedContacts(formData))} className="space-y-3">
                        <textarea
                            name="content"
                            rows={6}
                            required
                            placeholder={"someone@example.com\nanother@example.com"}
                            className={cn(inputClass, "font-mono text-xs")}
                        />
                        <ListSelect name="listId" />
                        <DoubleOptIn />
                        <button
                            type="submit"
                            disabled={pending}
                            className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                        >
                            Import pasted
                        </button>
                    </form>
                </Card>

                <Card
                    title="Mailchimp"
                    description="One-way migration. Subscribed members become contacts; unsubscribed and cleaned members go straight to the suppression list so they can never be mailed again."
                    icon={Download}
                >
                    {!mailchimpConfigured ? (
                        <p className="rounded-md bg-amber-50 p-2.5 text-xs text-amber-800">
                            Set <code className="font-mono">MAILCHIMP_API_KEY</code> to enable this.
                        </p>
                    ) : (
                        <>
                            <button
                                type="button"
                                disabled={pending}
                                onClick={() =>
                                    startTransition(async () => {
                                        setError(null)
                                        const result = await listMailchimpAudiences()
                                        if (result.success) setAudiences(result.data ?? [])
                                        else setError(result.error ?? "Could not reach Mailchimp")
                                    })
                                }
                                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-violet-400"
                            >
                                Load audiences
                            </button>

                            {audiences.length > 0 && (
                                <>
                                    <select value={mcTarget} onChange={(e) => setMcTarget(e.target.value)} className={inputClass}>
                                        <option value="">No list (contacts only)</option>
                                        {lists.map((list) => (
                                            <option key={list.id} value={list.id}>
                                                Add to: {list.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="space-y-2">
                                        {audiences.map((audience) => (
                                            <div
                                                key={audience.id}
                                                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{audience.name}</p>
                                                    <p className="text-xs text-slate-400">
                                                        {audience.memberCount.toLocaleString()} members
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={pending}
                                                    onClick={() =>
                                                        handle(() => importMailchimpAudience(audience.id, mcTarget || undefined))
                                                    }
                                                    className="rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                                                >
                                                    Import
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </Card>

                <Card
                    title="This site's own tables"
                    description="Migrates the existing Subscriber and Lead records into the contact database. Safe to run more than once — existing contacts are enriched, not duplicated."
                    icon={Database}
                >
                    <p className="text-sm text-slate-600">
                        {siteCounts.subscribers.toLocaleString()} subscribers · {siteCounts.leads.toLocaleString()} leads
                    </p>
                    <select value={mcTarget} onChange={(e) => setMcTarget(e.target.value)} className={inputClass}>
                        <option value="">No list (contacts only)</option>
                        {lists.map((list) => (
                            <option key={list.id} value={list.id}>
                                Add to: {list.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => handle(() => importSiteContacts(mcTarget || undefined))}
                        className="rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                    >
                        Migrate site contacts
                    </button>
                </Card>
            </div>
        </div>
    )
}
