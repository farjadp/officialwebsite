"use client";

// ============================================================================
// Hardware Source: login-form.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Functional module
// Env / Identity: Client Component
// ============================================================================

// کامپوننت فرم ورود با طراحی پریمیوم
// Premium Login Form Component
// این کامپوننت فرم ورود را با استایل‌های شیشه‌ای (Glassmorphism) و حاشیه‌های درخشان پیاده‌سازی می‌کند.
// This component implements the login form with glassmorphism styles and glowing borders.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// اسکیمای اعتبارسنجی فرم
// Form validation schema
const formSchema = z.object({
    email: z.string().email({ message: "لطفاً یک پست الکترونیک معتبر وارد کنید." }),
    password: z.string().min(1, { message: "رمز عبور نمی‌تواند خالی باشد." }),
});

export function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // راه‌اندازی فرم
    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // هندلر ارسال فرم
    // Form submission handler
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (res?.error) {
                setError("ایمیل یا رمز عبور اشتباه است.");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch {
            setError("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="border-white/10 bg-black/40 text-neutral-50 shadow-[0_0_80px_-15px_rgba(0,0,0,1)] backdrop-blur-2xl rounded-[2rem] overflow-hidden">
            {/* افکت نوری داخل کارت (Inner card gradient glow) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />

            <CardHeader className="space-y-4 text-center pb-8 pt-12 relative z-10">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center p-[2px] shadow-[0_0_30px_rgba(59,130,246,0.3)] rotate-3 hover:rotate-6 transition-transform duration-500">
                        <div className="w-full h-full bg-black/80 backdrop-blur-xl rounded-[14px] flex items-center justify-center -rotate-3 hover:-rotate-6 transition-transform duration-500">
                            <Lock className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <CardTitle className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        ورود مدیران
                    </CardTitle>
                    <CardDescription className="text-neutral-400 font-medium text-base">
                        سیستم مدیریت محتوای پیشرفته
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-10 pb-12 relative z-10">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">

                        {/* فیلد ایمیل */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-300 font-medium text-sm ml-1">پست الکترونیک</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-500 group-focus-within:text-blue-400 transition-colors z-10">
                                                <Mail className="h-5 w-5" />
                                            </div>
                                            <Input
                                                placeholder="admin@ashavid.com"
                                                className="bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 text-neutral-100 pr-12 h-14 rounded-2xl text-left placeholder:text-neutral-600 transition-all hover:border-white/20 hover:bg-black/70 text-lg"
                                                autoComplete="email"
                                                autoFocus
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* فیلد رمز عبور */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-neutral-300 font-medium text-sm ml-1">رمز عبور</FormLabel>
                                    </div>
                                    <FormControl>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-500 group-focus-within:text-blue-400 transition-colors z-10">
                                                <Lock className="h-5 w-5" />
                                            </div>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="bg-black/50 border-white/10 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 text-neutral-100 pr-12 h-14 rounded-2xl text-left tracking-widest placeholder:tracking-normal placeholder:text-neutral-600 transition-all hover:border-white/20 hover:bg-black/70 text-lg"
                                                autoComplete="current-password"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-400 text-xs font-medium" />
                                </FormItem>
                            )}
                        />

                        {/* پیغام خطا */}
                        {error && (
                            <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400 rounded-2xl py-3 px-4 flex items-center">
                                <AlertCircle className="h-5 w-5 ml-2 mt-0" />
                                <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* دکمه ورود */}
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-lg h-14 rounded-2xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-[0.98] mt-4 group relative overflow-hidden border border-white/10"
                            disabled={isLoading}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                            <span className="relative flex items-center justify-center">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="ml-2 h-6 w-6 animate-spin" />
                                        در حال احراز هویت...
                                    </>
                                ) : (
                                    <>
                                        ورود به پنل <ArrowRight className="mr-3 h-6 w-6 transition-transform group-hover:-translate-x-2" />
                                    </>
                                )}
                            </span>
                        </Button>

                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
