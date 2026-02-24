"use client";

// ============================================================================
// Hardware Source: register-form.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Functional module
// Env / Identity: Client Component
// ============================================================================

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/app/actions/authActions";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, User, UserPlus, Loader2, ArrowRight } from "lucide-react";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters.")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: RegisterFormValues) {
        setIsPending(true);
        setGlobalError(null);

        try {
            // Register via Server Action
            const result = await registerUser(data);

            if (!result.success) {
                setGlobalError(result.error || "Registration failed. Please try again.");
                setIsPending(false);
                return;
            }

            // Immediately sign them in
            const signInResult = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (signInResult?.error) {
                setGlobalError("Account created, but couldn't log in automatically. Please log in manually.");
                setIsPending(false);
            } else {
                router.push("/profile");
                router.refresh();
            }
        } catch (error) {
            setGlobalError("An unexpected error occurred. Please try again later.");
            setIsPending(false);
        }
    }

    return (
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden group">
            {/* Subtle inner top highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="mb-10 text-center relative z-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500 ease-out">
                    <UserPlus className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-sans">
                    Create Account
                </h1>
                <p className="text-slate-400 text-sm">
                    Join us to access exclusive content and features.
                </p>
            </div>

            {globalError && (
                <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-400">
                    <AlertDescription>{globalError}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10" dir="ltr">
                <div className="space-y-2">
                    <Label className="text-slate-300 font-medium ml-1">Full Name</Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <Input
                            {...register("name")}
                            className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 pl-11 h-12 rounded-xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all hover:bg-black/30"
                            placeholder="John Doe"
                            autoComplete="name"
                            disabled={isPending}
                        />
                    </div>
                    {errors.name && (
                        <p className="text-sm text-red-400 mt-1.5 ml-1">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-300 font-medium ml-1">Email Address</Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <Input
                            {...register("email")}
                            type="email"
                            className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 pl-11 h-12 rounded-xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all hover:bg-black/30"
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isPending}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-sm text-red-400 mt-1.5 ml-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-300 font-medium ml-1">Password</Label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        </div>
                        <Input
                            {...register("password")}
                            type="password"
                            className="bg-black/20 border-white/10 text-white placeholder:text-slate-600 pl-11 h-12 rounded-xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all hover:bg-black/30"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            disabled={isPending}
                        />
                    </div>
                    {errors.password && (
                        <p className="text-sm text-red-400 mt-1.5 ml-1">{errors.password.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-white hover:bg-slate-100 text-black font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] mt-8"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        <>
                            Sign Up <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-400 relative z-10">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium">
                    Log in here
                </Link>
            </div>
        </div>
    );
}
