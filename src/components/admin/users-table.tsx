"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Search, Shield, ShieldCheck, ShieldAlert, User as UserIcon,
    Trash2, CheckCircle, XCircle, MoreHorizontal, UserPlus, RefreshCw,
    Mail, Crown, Edit
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type UserRow = {
    id: string
    name: string | null
    email: string
    role: "OWNER" | "EDITOR" | "USER"
    isActive: boolean
    emailVerified: Date | null
    createdAt: Date
    image: string | null
}

const roleBadge = {
    OWNER: { label: "Owner", className: "bg-violet-500/20 text-violet-300 border-violet-500/30", icon: Crown },
    EDITOR: { label: "Editor", className: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: ShieldCheck },
    USER: { label: "Member", className: "bg-slate-500/20 text-slate-300 border-slate-500/30", icon: UserIcon },
}

export function UsersTable({ users: initialUsers, isOwner }: { users: UserRow[]; isOwner: boolean }) {
    const router = useRouter()
    const [users, setUsers] = useState(initialUsers)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("ALL")
    const [editUser, setEditUser] = useState<UserRow | null>(null)
    const [editRole, setEditRole] = useState<string>("")
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "USER" })

    const filtered = users.filter(u => {
        const matchSearch = !search ||
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === "ALL" || u.role === roleFilter
        return matchSearch && matchRole
    })

    async function handleRoleUpdate() {
        if (!editUser) return
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/admin/users/${editUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: editRole }),
            })
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, role: editRole as UserRow["role"] } : u))
                setEditUser(null)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleToggleActive(user: UserRow) {
        const res = await fetch(`/api/admin/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !user.isActive }),
        })
        if (res.ok) {
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u))
        }
    }

    async function handleDelete() {
        if (!deleteUserId) return
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/admin/users/${deleteUserId}`, { method: "DELETE" })
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== deleteUserId))
                setDeleteUserId(null)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleAddUser() {
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            })
            if (res.ok) {
                router.refresh()
                setAddOpen(false)
                setNewUser({ name: "", email: "", password: "", role: "USER" })
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex gap-3 flex-1 max-w-lg">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-600"
                        />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-32 bg-white/5 border-white/10 text-slate-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                            <SelectItem value="ALL" className="text-slate-300">All Roles</SelectItem>
                            <SelectItem value="OWNER" className="text-slate-300">Owners</SelectItem>
                            <SelectItem value="EDITOR" className="text-slate-300">Editors</SelectItem>
                            <SelectItem value="USER" className="text-slate-300">Members</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {isOwner && (
                    <Button onClick={() => setAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                        <UserPlus className="h-4 w-4 mr-2" />Add User
                    </Button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="text-left px-4 py-3 text-slate-400 font-medium">User</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-medium hidden sm:table-cell">Role</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Status</th>
                            <th className="text-left px-4 py-3 text-slate-400 font-medium hidden lg:table-cell">Joined</th>
                            <th className="text-right px-4 py-3 text-slate-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-500">No users found</td>
                            </tr>
                        )}
                        {filtered.map(user => {
                            const RoleIcon = roleBadge[user.role].icon
                            return (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                                                {(user.name || user.email)[0].toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-medium truncate">{user.name || "(No Name)"}</p>
                                                <p className="text-slate-500 text-xs truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <Badge className={`text-xs border ${roleBadge[user.role].className}`}>
                                            <RoleIcon className="h-3 w-3 mr-1" />
                                            {roleBadge[user.role].label}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <div className="flex items-center gap-2">
                                            {user.isActive ? (
                                                <span className="flex items-center gap-1 text-emerald-400 text-xs">
                                                    <CheckCircle className="h-3.5 w-3.5" /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-400 text-xs">
                                                    <XCircle className="h-3.5 w-3.5" /> Inactive
                                                </span>
                                            )}
                                            {user.emailVerified && (
                                                <span className="flex items-center gap-1 text-blue-400 text-xs">
                                                    <Mail className="h-3 w-3" /> Verified
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-slate-500 text-xs">
                                        {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {isOwner && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-slate-200 w-44">
                                                    <DropdownMenuLabel className="text-slate-400 text-xs">Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem
                                                        className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                                                        onClick={() => { setEditUser(user); setEditRole(user.role) }}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2 text-blue-400" />Change Role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                                                        onClick={() => handleToggleActive(user)}
                                                    >
                                                        <RefreshCw className="h-4 w-4 mr-2 text-amber-400" />
                                                        {user.isActive ? "Deactivate" : "Activate"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem
                                                        className="cursor-pointer hover:bg-red-500/20 focus:bg-red-500/20 text-red-400"
                                                        onClick={() => setDeleteUserId(user.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-slate-600 text-xs">{filtered.length} of {users.length} users</p>

            {/* Edit Role Dialog */}
            <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
                <DialogContent className="bg-slate-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Update the role for <span className="text-white">{editUser?.email}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label className="text-slate-300">New Role</Label>
                        <Select value={editRole} onValueChange={setEditRole}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                                <SelectItem value="OWNER" className="text-slate-200">Owner — Full access</SelectItem>
                                <SelectItem value="EDITOR" className="text-slate-200">Editor — Content access</SelectItem>
                                <SelectItem value="USER" className="text-slate-200">Member — Limited access</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setEditUser(null)} className="text-slate-400 hover:text-white">Cancel</Button>
                        <Button onClick={handleRoleUpdate} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500">
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
                <DialogContent className="bg-slate-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-400">Delete User</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            This action is permanent and cannot be undone. All data associated with this user will be deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteUserId(null)} className="text-slate-400">Cancel</Button>
                        <Button onClick={handleDelete} disabled={isSubmitting} className="bg-red-600 hover:bg-red-500">
                            {isSubmitting ? "Deleting..." : "Delete User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="bg-slate-900 border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription className="text-slate-400">Create a new user account. The email won't need verification.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {[
                            { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                            { label: "Email Address", key: "email", type: "email", placeholder: "john@example.com" },
                            { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
                        ].map(f => (
                            <div key={f.key} className="space-y-1.5">
                                <Label className="text-slate-300">{f.label}</Label>
                                <Input
                                    type={f.type}
                                    placeholder={f.placeholder}
                                    value={(newUser as any)[f.key]}
                                    onChange={e => setNewUser(prev => ({ ...prev, [f.key]: e.target.value }))}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
                                />
                            </div>
                        ))}
                        <div className="space-y-1.5">
                            <Label className="text-slate-300">Role</Label>
                            <Select value={newUser.role} onValueChange={v => setNewUser(prev => ({ ...prev, role: v }))}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10">
                                    <SelectItem value="OWNER" className="text-slate-200">Owner</SelectItem>
                                    <SelectItem value="EDITOR" className="text-slate-200">Editor</SelectItem>
                                    <SelectItem value="USER" className="text-slate-200">Member</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setAddOpen(false)} className="text-slate-400">Cancel</Button>
                        <Button onClick={handleAddUser} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-500">
                            {isSubmitting ? "Creating..." : "Create User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
