// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — 2026-02-24
// Why: Main entry page for the route
// Env / Identity: React Server Component
// ============================================================================

import Image from "next/image";
import { RegisterForm } from "./register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register | Ashavid",
    description: "Create an account to join the community.",
};

export default function RegisterPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black selection:bg-blue-500/30">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/bg-login.png" // Reusing the premium login background
                    alt="Premium Abstract Background"
                    fill
                    priority
                    className="object-cover opacity-60 mix-blend-screen scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent backdrop-blur-[1px]"></div>
            </div>

            {/* Decorative ambient glowing blobs */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse z-0 delay-500"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse z-0 delay-1000"></div>

            {/* Main Form Container */}
            <div className="w-full max-w-[440px] relative z-10 animate-in fade-in zoom-in-95 duration-700 ease-out">
                <RegisterForm />
            </div>
        </div>
    );
}
