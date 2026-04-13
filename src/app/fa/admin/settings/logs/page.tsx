'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { RefreshCw, Trash2, Filter } from 'lucide-react'

type SystemLog = {
    id: string
    level: string
    message: string
    source: string | null
    path: string | null
    method: string | null
    status: number | null
    data: any
    createdAt: string
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-CA', {
        dateStyle: 'medium', timeStyle: 'short'
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

export default function LogsPage() {
    const [logs, setLogs] = useState<SystemLog[]>([])
    const [loading, setLoading] = useState(true)
    const [level, setLevel] = useState('')
    const [q, setQ] = useState('')

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (level) params.set('level', level)
            if (q) params.set('q', q)
            const res = await fetch(`/api/admin/logs?${params.toString()}`)
            const data = await res.json()
            if (data.success) setLogs(data.data)
            else toast.error(data.error || 'Failed to load logs')
        } catch {
            toast.error('Failed to load logs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchLogs() }, [])

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

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        System Logs
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Centralized application event stream
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 items-center">
                    <select
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        <option value="">All levels</option>
                        <option value="info">info</option>
                        <option value="warn">warn</option>
                        <option value="error">error</option>
                    </select>
                    <input
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm w-64"
                        placeholder="Search message..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                    <Button size="sm" onClick={fetchLogs}>Apply</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Recent Logs (last 200)</CardTitle>
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
                                        <th className="text-left py-2 pr-4 font-semibold">Date</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Level</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Message</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Source</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Path</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Status</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Data</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="py-2.5 pr-4 font-mono text-xs">{formatDate(log.createdAt)}</td>
                                            <td className="py-2.5 pr-4"><LevelBadge level={log.level} /></td>
                                            <td className="py-2.5 pr-4 max-w-xs">
                                                <span className="text-xs text-stone-700 truncate block" title={log.message}>
                                                    {log.message}
                                                </span>
                                            </td>
                                            <td className="py-2.5 pr-4 text-xs text-stone-500">{log.source || '—'}</td>
                                            <td className="py-2.5 pr-4 text-xs text-stone-500">{log.path || '—'}</td>
                                            <td className="py-2.5 pr-4 text-xs">{log.status ?? '—'}</td>
                                            <td className="py-2.5 pr-4 text-xs max-w-xs">
                                                {log.data ? (
                                                    <span className="truncate block" title={JSON.stringify(log.data)}>
                                                        {JSON.stringify(log.data).slice(0, 80)}{JSON.stringify(log.data).length > 80 ? '…' : ''}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td className="py-2.5 pl-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-stone-400 hover:text-red-500"
                                                    onClick={() => deleteLog(log.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
