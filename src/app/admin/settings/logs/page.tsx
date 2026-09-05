'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { RefreshCw, Trash2, Filter, ChevronDown, ChevronRight, Eraser, Radio } from 'lucide-react'
import { cn } from '@/lib/utils'

type SystemLog = {
    id: string
    level: string
    message: string
    source: string | null
    path: string | null
    method: string | null
    status: number | null
    ip: string | null
    userAgent: string | null
    userId: string | null
    data: Record<string, unknown> | null
    createdAt: string
}

const AUTO_REFRESH_MS = 10_000

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-CA', {
        dateStyle: 'medium', timeStyle: 'medium'
    })
}

function LevelBadge({ level }: { level: string }) {
    const map: Record<string, string> = {
        info: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        warn: 'bg-amber-100 text-amber-700 border-amber-200',
        error: 'bg-red-100 text-red-700 border-red-200',
    }
    const cls = map[level] || 'bg-stone-100 text-stone-600 border-stone-200'
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
            {level}
        </span>
    )
}

function LogDetail({ log }: { log: SystemLog }) {
    const meta: [string, string | number | null][] = [
        ['Method', log.method],
        ['Status', log.status],
        ['IP', log.ip],
        ['User', log.userId],
        ['User Agent', log.userAgent],
    ]
    return (
        <div className="bg-stone-50 border-t border-stone-100 px-4 py-3 space-y-3 text-xs">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
                {meta.filter(([, v]) => v !== null && v !== undefined && v !== '').map(([k, v]) => (
                    <div key={k}>
                        <span className="text-stone-400 font-semibold">{k}: </span>
                        <span className="text-stone-600 break-all">{v}</span>
                    </div>
                ))}
            </div>
            {log.data && (
                <pre className="bg-white border border-stone-200 rounded-lg p-3 overflow-x-auto text-[11px] leading-relaxed text-stone-700 max-h-64 overflow-y-auto">
                    {JSON.stringify(log.data, null, 2)}
                </pre>
            )}
        </div>
    )
}

export default function LogsPage() {
    const [logs, setLogs] = useState<SystemLog[]>([])
    const [counts, setCounts] = useState<Record<string, number>>({})
    const [sources, setSources] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [level, setLevel] = useState('')
    const [source, setSource] = useState('')
    const [q, setQ] = useState('')
    const [take, setTake] = useState(100)
    const [autoRefresh, setAutoRefresh] = useState(false)
    const [expanded, setExpanded] = useState<string | null>(null)

    // Keep latest filters available to the polling interval without re-arming it
    const filtersRef = useRef({ level, source, q, take })
    filtersRef.current = { level, source, q, take }

    const fetchLogs = useCallback(async (silent = false) => {
        if (!silent) setLoading(true)
        try {
            const f = filtersRef.current
            const params = new URLSearchParams()
            if (f.level) params.set('level', f.level)
            if (f.source) params.set('source', f.source)
            if (f.q) params.set('q', f.q)
            params.set('take', String(f.take))
            const res = await fetch(`/api/admin/logs?${params.toString()}`)
            const data = await res.json()
            if (data.success) {
                setLogs(data.data)
                setCounts(data.counts || {})
                if (data.sources) setSources(data.sources)
            } else if (!silent) {
                toast.error(data.error || 'Failed to load logs')
            }
        } catch {
            if (!silent) toast.error('Failed to load logs')
        } finally {
            if (!silent) setLoading(false)
        }
    }, [])

    useEffect(() => { fetchLogs() }, [fetchLogs])

    // Refetch when dropdown filters change (search applies on Enter/Apply)
    useEffect(() => { fetchLogs() }, [level, source, take, fetchLogs])

    useEffect(() => {
        if (!autoRefresh) return
        const t = setInterval(() => fetchLogs(true), AUTO_REFRESH_MS)
        return () => clearInterval(t)
    }, [autoRefresh, fetchLogs])

    const deleteLog = async (id: string) => {
        if (!confirm('Delete this log entry?')) return
        try {
            await fetch(`/api/admin/logs?id=${id}`, { method: 'DELETE' })
            setLogs(prev => prev.filter(l => l.id !== id))
            toast.success('Log entry deleted')
        } catch {
            toast.error('Failed to delete entry')
        }
    }

    const clearOld = async () => {
        if (!confirm('Delete all log entries older than 7 days?')) return
        try {
            const res = await fetch('/api/admin/logs?olderThanDays=7', { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                toast.success(`Deleted ${data.deleted} old entries`)
                fetchLogs()
            } else {
                toast.error(data.error || 'Failed to clear old logs')
            }
        } catch {
            toast.error('Failed to clear old logs')
        }
    }

    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0)
    const levelChips: { key: string; label: string; cls: string; active: string }[] = [
        { key: '', label: `All · ${totalCount}`, cls: 'bg-stone-100 text-stone-600 border-stone-200', active: 'ring-2 ring-stone-400' },
        { key: 'info', label: `info · ${counts.info || 0}`, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', active: 'ring-2 ring-emerald-400' },
        { key: 'warn', label: `warn · ${counts.warn || 0}`, cls: 'bg-amber-50 text-amber-700 border-amber-200', active: 'ring-2 ring-amber-400' },
        { key: 'error', label: `error · ${counts.error || 0}`, cls: 'bg-red-50 text-red-700 border-red-200', active: 'ring-2 ring-red-400' },
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        System Logs
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Centralized application event stream — API, UI, client errors, jobs
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={autoRefresh ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAutoRefresh(v => !v)}
                        title="Refresh every 10 seconds"
                    >
                        <Radio className={cn('w-4 h-4 mr-1', autoRefresh && 'animate-pulse')} />
                        {autoRefresh ? 'Live' : 'Live off'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearOld} className="text-stone-500 hover:text-red-600">
                        <Eraser className="w-4 h-4 mr-1" />
                        Clear &gt; 7d
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => fetchLogs()} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Level chips */}
            <div className="flex flex-wrap gap-2">
                {levelChips.map(chip => (
                    <button
                        key={chip.key}
                        onClick={() => setLevel(chip.key)}
                        className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                            chip.cls,
                            level === chip.key && chip.active
                        )}
                    >
                        {chip.label}
                    </button>
                ))}
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 items-center">
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    >
                        <option value="">All sources</option>
                        {sources.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={take}
                        onChange={(e) => setTake(parseInt(e.target.value, 10))}
                    >
                        <option value={50}>50 rows</option>
                        <option value={100}>100 rows</option>
                        <option value={200}>200 rows</option>
                    </select>
                    <input
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm w-72"
                        placeholder="Search message or path… (Enter)"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') fetchLogs() }}
                    />
                    <Button size="sm" onClick={() => fetchLogs()}>Apply</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                        Recent Logs {logs.length > 0 && <span className="text-muted-foreground font-normal">— showing {logs.length}</span>}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-muted-foreground gap-2">
                            <RefreshCw className="w-5 h-5 animate-spin" /> Loading...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-sm">No logs found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs text-muted-foreground">
                                        <th className="w-6" />
                                        <th className="text-left py-2 pr-4 font-semibold">Date</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Level</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Message</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Source</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Path</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Status</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => {
                                        const isOpen = expanded === log.id
                                        return [
                                            <tr
                                                key={log.id}
                                                className={cn(
                                                    'border-b hover:bg-muted/30 transition-colors cursor-pointer',
                                                    log.level === 'error' && 'bg-red-50/40',
                                                    isOpen && 'bg-muted/40'
                                                )}
                                                onClick={() => setExpanded(isOpen ? null : log.id)}
                                            >
                                                <td className="py-2.5 pl-1 text-stone-400">
                                                    {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                                </td>
                                                <td className="py-2.5 pr-4 font-mono text-xs whitespace-nowrap">{formatDate(log.createdAt)}</td>
                                                <td className="py-2.5 pr-4"><LevelBadge level={log.level} /></td>
                                                <td className="py-2.5 pr-4 max-w-sm">
                                                    <span className="text-xs text-stone-700 truncate block" title={log.message}>
                                                        {log.message}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 pr-4 text-xs text-stone-500">{log.source || '—'}</td>
                                                <td className="py-2.5 pr-4 text-xs text-stone-500 max-w-[180px] truncate" title={log.path || undefined}>{log.path || '—'}</td>
                                                <td className={cn('py-2.5 pr-4 text-xs font-mono', (log.status ?? 0) >= 400 && 'text-red-600 font-semibold')}>{log.status ?? '—'}</td>
                                                <td className="py-2.5 pl-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-stone-400 hover:text-red-500"
                                                        onClick={(e) => { e.stopPropagation(); deleteLog(log.id) }}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>,
                                            isOpen ? (
                                                <tr key={`${log.id}-detail`}>
                                                    <td colSpan={8} className="p-0">
                                                        <LogDetail log={log} />
                                                    </td>
                                                </tr>
                                            ) : null,
                                        ]
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
