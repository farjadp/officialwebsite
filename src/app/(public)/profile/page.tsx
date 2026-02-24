// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Main entry page for the route
// Env / Identity: Server Action / Module
// ============================================================================

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { User, Mail, Calendar, LogOut, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { signOut } from "@/auth"; // If using server-side signOut, else client-side wrapper

export default async function ProfilePage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login");
    }

    // Fetch fresh user data just to ensure we have the join date
    const userData = await prisma.user.findUnique({
        where: { email: session.user.email as string },
        select: { createdAt: true, role: true }
    });

    const isPrivileged = userData?.role === "OWNER" || userData?.role === "EDITOR";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your Profile</h1>
                        <p className="text-slate-500 mt-1 text-sm">Manage your account and view your status.</p>
                    </div>
                    {isPrivileged && (
                        <Link href="/admin">
                            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Go to Admin Panel
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="grid gap-6">
                    <Card className="border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                        Name
                                    </dt>
                                    <dd className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                        {session.user.name || "Not provided"}
                                    </dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </dt>
                                    <dd className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                        {session.user.email}
                                    </dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" />
                                        Account Role
                                    </dt>
                                    <dd className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPrivileged ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                            }`}>
                                            {userData?.role || "USER"}
                                        </span>
                                    </dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Member Since
                                    </dt>
                                    <dd className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                        {userData?.createdAt ? format(new Date(userData.createdAt), 'MMMM d, yyyy') : "Unknown"}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/20 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-lg text-red-800 dark:text-red-400">Danger Zone</CardTitle>
                            <CardDescription className="text-red-600/80 dark:text-red-400/80">Manage your active session across the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={async () => {
                                'use server';
                                await signOut({ redirectTo: "/login" });
                            }}>
                                <Button variant="destructive" type="submit" className="w-full sm:w-auto">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out Securely
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
