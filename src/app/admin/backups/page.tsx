'use client'

// src/app/admin/backups/page.tsx
// Backup management dashboard

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { HardDrive, Database, Archive, Play, Trash2, RefreshCw, CheckCircle2, XCircle, Loader2, Clock } from 'lucide-react'

type BackupLog = {
    id: string
    date: string
    status: string
    type: string
    dbFile: string | null
    codeFile: string | null
    dbSizeBytes: string | null
    codeSizeBytes: string | null
    durationMs: number | null
    error: string | null
}

function formatBytes(bytes: string | null): string {
    if (!bytes) return '—'
    const n = parseInt(bytes)
    if (n < 1024) return `${n} B`
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
    if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`
    return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-CA', {
        dateStyle: 'medium', timeStyle: 'short'
    })
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { icon: React.ReactNode; cls: string }> = {
        success: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        failed: { icon: <XCircle className="w-3.5 h-3.5" />, cls: 'bg-red-100 text-red-700 border-red-200' },
        running: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    }
    const s = map[status] || { icon: <Clock className="w-3.5 h-3.5" />, cls: 'bg-stone-100 text-stone-600 border-stone-200' }
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
            {s.icon} {status}
        </span>
    )
}

export default function BackupsPage() {
    const [logs, setLogs] = useState<BackupLog[]>([])
    const [loading, setLoading] = useState(true)
    const [triggering, setTriggering] = useState(false)

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/backups')
            const data = await res.json()
            if (data.success) setLogs(data.data)
        } catch {
            toast.error('Failed to load backup logs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchLogs() }, [])

    const triggerBackup = async (type: 'full' | 'db-only' | 'code-only') => {
        setTriggering(true)
        try {
            const res = await fetch('/api/admin/backups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
            })
            const data = await res.json()
            if (data.success) {
                toast.success(`${data.message} — check logs in a moment`)
                setTimeout(fetchLogs, 3000)
            } else {
                toast.error(data.error || 'Backup failed')
            }
        } catch {
            toast.error('Failed to trigger backup')
        } finally {
            setTriggering(false)
        }
    }

    const deleteLog = async (id: string) => {
        if (!confirm('Delete this log entry? (Does not delete the backup file)')) return
        try {
            await fetch(`/api/admin/backups?id=${id}`, { method: 'DELETE' })
            setLogs(prev => prev.filter(l => l.id !== id))
            toast.success('Log entry deleted')
        } catch {
            toast.error('Failed to delete entry')
        }
    }

    const successCount = logs.filter(l => l.status === 'success').length
    const failCount = logs.filter(l => l.status === 'failed').length
    const lastSuccess = logs.find(l => l.status === 'success')

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <HardDrive className="w-6 h-6 text-violet-600" />
                        Backup Manager
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        30-day rolling backups — DB + codebase
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-4">
                        <p className="text-2xl font-bold text-emerald-600">{successCount}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Successful backups</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <p className="text-2xl font-bold text-red-500">{failCount}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Failed backups</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <p className="text-sm font-semibold truncate">
                            {lastSuccess ? formatDate(lastSuccess.date) : '—'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Last successful backup</p>
                    </CardContent>
                </Card>
            </div>

            {/* Trigger buttons */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Manual Trigger</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    <Button
                        onClick={() => triggerBackup('full')}
                        disabled={triggering}
                        className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                    >
                        {triggering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Full Backup (DB + Code)
                    </Button>
                    <Button
                        onClick={() => triggerBackup('db-only')}
                        disabled={triggering}
                        variant="outline"
                        className="gap-2"
                    >
                        <Database className="w-4 h-4 text-blue-600" />
                        DB Only
                    </Button>
                    <Button
                        onClick={() => triggerBackup('code-only')}
                        disabled={triggering}
                        variant="outline"
                        className="gap-2"
                    >
                        <Archive className="w-4 h-4 text-orange-600" />
                        Code Only
                    </Button>

                    <div className="w-full mt-1 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                        ⚠️ <strong>Local backups only.</strong> Files are saved to <code className="font-mono bg-amber-100 px-1 rounded">~/Backups/officialwebsite/</code> on this machine.
                        The automatic backup runs every <strong>24 hours</strong> via launchd.
                        To set it up: <code className="font-mono bg-amber-100 px-1 rounded">bash scripts/setup-cron.sh</code>
                    </div>
                </CardContent>
            </Card>

            {/* Backup logs table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Backup History (last 60)</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-muted-foreground gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <HardDrive className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No backups yet.</p>
                            <p className="text-xs mt-1">Click “Full Backup” to create the first one.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-xs text-muted-foreground">
                                        <th className="text-left py-2 pr-4 font-semibold">Date</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Status</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Type</th>
                                        <th className="text-left py-2 pr-4 font-semibold">DB Size</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Code Size</th>
                                        <th className="text-left py-2 pr-4 font-semibold">Duration</th>
                                        <th className="text-left py-2 font-semibold">Error</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="py-2.5 pr-4 font-mono text-xs">{formatDate(log.date)}</td>
                                            <td className="py-2.5 pr-4"><StatusBadge status={log.status} /></td>
                                            <td className="py-2.5 pr-4">
                                                <span className="text-xs text-stone-500 font-medium">{log.type}</span>
                                            </td>
                                            <td className="py-2.5 pr-4 font-mono text-xs">{formatBytes(log.dbSizeBytes)}</td>
                                            <td className="py-2.5 pr-4 font-mono text-xs">{formatBytes(log.codeSizeBytes)}</td>
                                            <td className="py-2.5 pr-4 text-xs">
                                                {log.durationMs ? `${(log.durationMs / 1000).toFixed(1)}s` : '—'}
                                            </td>
                                            <td className="py-2.5 max-w-xs">
                                                {log.error ? (
                                                    <span className="text-xs text-red-500 truncate block" title={log.error}>
                                                        {log.error.slice(0, 60)}{log.error.length > 60 ? '…' : ''}
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
