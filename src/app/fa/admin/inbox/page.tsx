"use client"

import { useState, useEffect } from "react"
import { Mail, Check, Trash2, MailOpen, MailQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { logUiEvent } from '@/lib/ui-log'

interface Message {
    id: string
    name: string
    email: string
    subject: string | null
    content: string
    read: boolean
    createdAt: string
}

export default function InboxAdminPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)

    async function fetchMessages() {
        try {
            const res = await fetch("/api/admin/messages")
            const data = await res.json()
            if (data.success) {
                setMessages(data.data)
            }
        } catch (error) {
            toast.error("Failed to load messages")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    async function toggleReadStatus(id: string, currentReadStatus: boolean) {
        try {
            const res = await fetch(`/api/admin/messages`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, read: !currentReadStatus })
            })
            const data = await res.json()
            if (data.success) {
                setMessages(messages.map(m => m.id === id ? { ...m, read: !currentReadStatus } : m))
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this message?")) return

        try {
            const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" })
            const data = await res.json()
            if (data.success) {
                toast.success("Message deleted")
                logUiEvent('Message deleted', { id })
                setMessages(messages.filter(m => m.id !== id))
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error("Failed to delete")
        }
    }

    const unreadCount = messages.filter(m => !m.read).length

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100 flex items-center gap-3">
                        <Mail className="h-8 w-8 text-blue-500" />
                        Inbox
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your contact form submissions and direct messages.</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-3">
                    <span className="text-slate-400 text-sm font-medium">Unread</span>
                    <Badge variant={unreadCount > 0 ? "default" : "secondary"} className={unreadCount > 0 ? "bg-blue-600 hover:bg-blue-600" : ""}>
                        {unreadCount}
                    </Badge>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading messages...</div>
            ) : messages.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                    <div className="mx-auto w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                        <MailQuestion className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-300">Your inbox is empty</h3>
                    <p className="text-slate-500 mt-1 mb-6 text-sm">You have no new contact form submissions.</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="divide-y divide-slate-800/60">
                        {messages.map((message) => (
                            <div key={message.id} className={`p-5 transition-colors ${message.read ? 'bg-slate-900/40' : 'bg-slate-800/20'}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className={`text-base truncate ${message.read ? 'font-medium text-slate-300' : 'font-bold text-slate-100'}`}>
                                                {message.name}
                                            </h3>
                                            {!message.read && <Badge className="bg-blue-500/20 text-blue-400 border-0 h-5 px-1.5 text-[10px]">NEW</Badge>}
                                            <span className="text-xs text-slate-500">{new Date(message.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <a href={`mailto:${message.email}`} className="text-sm text-blue-400 hover:underline mb-3 block">
                                            {message.email}
                                        </a>
                                        {message.subject && (
                                            <p className="text-sm font-semibold text-slate-200 mb-2">{message.subject}</p>
                                        )}
                                        <p className="text-sm text-slate-400 whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => toggleReadStatus(message.id, message.read)}
                                            className={`h-8 w-8 ${message.read ? 'text-slate-500 hover:text-slate-300' : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'}`}
                                            title={message.read ? "Mark as unread" : "Mark as read"}
                                        >
                                            {message.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleDelete(message.id)} 
                                            className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                                            title="Delete message"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
