import { Suspense } from "react"
import { RegisterForm } from "./register-form"

export const metadata = {
    title: "Create Account | farjadp.info",
    description: "Sign up for a new account.",
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex bg-[#030712]">
            {/* Left panel */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col items-start justify-end p-16">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-[#0f0c29] to-[#030712]" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                <div className="relative z-10 mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                        farjadp.info
                    </div>
                    <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                        Start your<br />journey here.
                    </h2>
                    <p className="text-slate-400 text-base leading-relaxed max-w-xs">
                        Create a free account to explore all content, tools, and resources available on the platform.
                    </p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center px-6 py-16 relative">
                <div className="absolute inset-0 lg:hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-violet-700/15 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-700/10 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 w-full max-w-sm">
                    <div className="mb-8 lg:hidden text-center">
                        <span className="text-xl font-bold text-white">farjadp.info</span>
                    </div>
                    <Suspense>
                        <RegisterForm />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
