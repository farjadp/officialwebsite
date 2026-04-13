// ============================================================================
// Hardware Source: page.tsx
// Version: 1.0.0 — Booking Page
// Why: Online consultation booking with charity donation flow
// Env / Identity: React Server Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    Clock,
    Video,
    FileText,
    Link as LinkIcon,
    MapPin,
    Globe,
    ShieldAlert,
    Handshake,
    Scale
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
    {
        q: "Can I bring my co-founder?",
        a: "Yes. We actually encourage all key decision-makers (up to 3 people) to join the call so everyone is aligned."
    },
    {
        q: "What if I don't have a charity receipt yet?",
        a: "You can book the slot first to secure it, but you must send the receipt within 6 hours to confirm."
    },
    {
        q: "Is the fee refundable?",
        a: "Since it is a direct donation to charity, we cannot refund it. However, we can reschedule your call if you notify us 24 hours in advance."
    },
    {
        q: "Do you speak Farsi?",
        a: "Yes. The session can be conducted in your preferred language (Farsi or English)."
    },
];

export default function BookingPage() {
    return (
        // ROOT: Warm Paper Background with Noise Texture (Matching other pages)
        <div className="min-h-screen bg-[#FDFCF8] text-[#1C1917] font-sans relative selection:bg-[#1B4B43] selection:text-white pb-24">

            {/* Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>



            <main className="relative z-10">

                {/* --- 1. HERO SECTION --- */}
                <section className="pt-24 pb-16 px-6 md:px-12 max-w-6xl mx-auto text-center border-b border-[#1B4B43]/10">
                    <Badge className="mb-6 bg-[#1B4B43]/10 text-[#1B4B43] hover:bg-[#1B4B43]/20 border-none uppercase tracking-widest px-3 py-1 rounded-sm text-xs">
                        Strategy Session
                    </Badge>
                    <h1 className="font-serif text-5xl md:text-7xl text-[#111827] leading-[1.1] mb-6">
                        Secure Your Slot
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-600 font-light leading-relaxed max-w-3xl mx-auto mb-16">
                        We donate 100% of the session fee to verified charities. We value commitment over profit.
                    </p>

                    {/* Core Info Boxes */}
                    <div className="grid md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">

                        {/* Box 1: Fee */}
                        <div className="bg-white p-8 border border-stone-200 shadow-sm rounded-sm hover:border-[#1B4B43] hover:shadow-md transition-all">
                            <h3 className="font-serif text-xl font-bold text-[#111827] mb-2">Social Impact Fee</h3>
                            <div className="my-6 p-4 bg-[#F5F5F4] rounded-sm text-center">
                                <p className="text-3xl font-bold text-[#1B4B43]">
                                    144 <span className="text-lg font-normal text-stone-500">USD</span>
                                </p>
                            </div>
                            <p className="text-sm text-stone-500 leading-relaxed">
                                Pay directly to a charity of your choice. Send us the receipt to confirm your booking.
                            </p>
                        </div>

                        {/* Box 2: Details */}
                        <div className="bg-white p-8 border border-stone-200 shadow-sm rounded-sm hover:border-[#1B4B43] hover:shadow-md transition-all">
                            <h3 className="font-serif text-xl font-bold text-[#111827] mb-6">Session Details</h3>
                            <ul className="space-y-4 text-sm text-stone-600">
                                <li className="flex justify-between items-center border-b border-stone-100 pb-2">
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#1B4B43]/70" /> Duration:</span>
                                    <strong className="text-[#111827]">60-90 Mins</strong>
                                </li>
                                <li className="flex justify-between items-center border-b border-stone-100 pb-2">
                                    <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-[#1B4B43]/70" /> Platform:</span>
                                    <strong className="text-[#111827]">Google Meet</strong>
                                </li>
                                <li className="flex justify-between items-center border-b border-stone-100 pb-2">
                                    <span className="flex items-center gap-2"><Video className="w-4 h-4 text-[#1B4B43]/70" /> Recording:</span>
                                    <strong className="text-[#111827]">Included</strong>
                                </li>
                            </ul>
                        </div>

                        {/* Box 3: Tech Check */}
                        <div className="bg-[#1B4B43] text-white p-8 shadow-md rounded-sm relative overflow-hidden flex flex-col justify-between">
                            <div className="relative z-10 w-full">
                                <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                                    Tech Check
                                </h3>
                                <p className="text-sm font-bold mb-2 text-[#F2B95E]">Calendar Not Loading?</p>
                                <p className="text-sm leading-relaxed opacity-90 mb-6">
                                    Due to internet restrictions, you likely need a <strong>VPN</strong> to see the Google Calendar embedded below.
                                </p>
                                <Link
                                    href="https://t.me/startupvisamentor"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-sm font-bold border-b border-[#F2B95E] text-[#F2B95E] hover:text-white hover:border-white transition-colors pb-0.5"
                                >
                                    Book manually via Telegram <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-12 pointer-events-none">
                                🗓️
                            </div>
                        </div>

                    </div>
                </section>

                {/* --- 2. THE CALENDAR EMBED --- */}
                <section className="py-16 px-6 md:px-12 bg-[#F5F5F4] border-b border-stone-200">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="sr-only">Schedule your appointment</h2>
                        <div className="bg-white rounded-md shadow-xl border border-stone-200 overflow-hidden h-[800px] relative">
                            <iframe
                                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0c9kl9WXgD2feLxqByk8S1fPcngsfXdvOISc-dWrbhXnhNx7uVuM1RyLJfWKkT2l5XX7I3wNLf?gv=true"
                                style={{ border: 0 }}
                                width="100%"
                                height="100%"
                                title="Google Calendar Appointment Scheduling"
                                className="w-full h-full bg-white"
                            />
                        </div>
                        {/* Fallback link if iframe is blocked */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-stone-500">
                                Having trouble viewing the calendar? <Link href="https://calendar.app.google/WNH5NUDujf7qDbAs6" target="_blank" className="font-bold text-[#1B4B43] hover:underline">Open in new tab</Link>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- 3. THE WAR ROOM (Process) & PROTOCOLS --- */}
                <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* The War Room Process */}
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-[#111827]">Inside the "War Room"</h2>
                                <p className="text-stone-600 font-light mt-3 leading-relaxed text-lg">
                                    This is not a casual chat. It is a structured strategic audit. Here is the breakdown of our 60-90 minute session:
                                </p>
                            </div>

                            {/* Timeline Items */}
                            <div className="space-y-8 relative pl-8 border-l-2 border-[#1B4B43]/20">

                                <div className="relative">
                                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#1B4B43] border-4 border-[#FDFCF8] shadow-sm" />
                                    <h4 className="font-bold text-[#111827] text-lg">Min 0-15: The Diagnostic</h4>
                                    <p className="text-stone-600 mt-2 leading-relaxed">
                                        We stress-test your current status. Capital verification, team structure analysis, and identifying immediate "red flags" in your profile.
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#1B4B43] border-4 border-[#FDFCF8] shadow-sm" />
                                    <h4 className="font-bold text-[#111827] text-lg">Min 15-45: The Pivot Strategy</h4>
                                    <p className="text-stone-600 mt-2 leading-relaxed">
                                        We re-engineer your business concept. We explain exactly how to position your product to satisfy specific requirements and market gaps.
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#F2B95E] border-4 border-[#FDFCF8] shadow-sm" />
                                    <h4 className="font-bold text-[#111827] text-lg">Min 45-60: The Execution Plan</h4>
                                    <p className="text-stone-600 mt-2 leading-relaxed">
                                        You leave with a clear roadmap: Which path to approach, specific budget parameters, and the estimated timeline for your goals.
                                    </p>
                                </div>

                            </div>

                            {/* What You Receive Card */}
                            <div className="bg-[#F5F5F4] p-8 border border-stone-200 mt-8">
                                <p className="text-xs font-bold text-[#1B4B43] uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> What you receive
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                                        <span className="text-[#1B4B43]">✓</span> Video Recording
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                                        <span className="text-[#1B4B43]">✓</span> Audio Transcript
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                                        <span className="text-[#1B4B43]">✓</span> PDF Action Plan
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                                        <span className="text-[#1B4B43]">✓</span> Resource Links
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms of Engagement & NDA */}
                        <div className="space-y-8">

                            {/* NDA Card */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#F2B95E] transform rotate-1 rounded-sm opacity-20 transition-transform hover:rotate-2"></div>
                                <div className="bg-white p-8 rounded-sm border border-stone-200 shadow-xl relative z-10 transition-transform origin-bottom-left hover:-translate-y-1 hover:translate-x-1">
                                    <div className="flex flex-col gap-2 border-b border-stone-100 pb-6 mb-6">
                                        <div className="w-12 h-12 bg-[#1B4B43]/10 rounded-full flex items-center justify-center mb-3">
                                            <ShieldAlert className="w-6 h-6 text-[#1B4B43]" />
                                        </div>
                                        <h3 className="text-2xl font-bold font-serif text-[#111827]">Mutual NDA Protocol</h3>
                                        <p className="text-sm font-medium tracking-widest uppercase text-stone-500">Non-Disclosure Agreement</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <Video className="w-5 h-5 text-[#1B4B43] shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-[#111827] text-sm mb-1">Strictly Confidential</h4>
                                                <p className="text-sm text-stone-600 leading-relaxed">
                                                    The session recording is for your <strong>personal review only</strong>. It is strictly forbidden to publish, share, or upload any part of this meeting to social media.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Handshake className="w-5 h-5 text-[#1B4B43] shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-[#111827] text-sm mb-1">Two-Way Privacy</h4>
                                                <p className="text-sm text-stone-600 leading-relaxed">
                                                    We respect your trade secrets. In return, you respect our intellectual property. We do not share your data, and you do not share our internal strategies publicly.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <Scale className="w-5 h-5 text-red-600 shrink-0 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-red-700 text-sm mb-1">Legal Consequence</h4>
                                                <p className="text-sm text-stone-600 leading-relaxed">
                                                    Violation of this privacy policy by either party will result in immediate legal action and blacklisting from future opportunities.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                                        <p className="text-xs text-stone-400 font-mono tracking-wider">
                                            By booking a session, you automatically agree to these terms.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Terms Box */}
                            <div className="bg-[#111827] text-white p-8 rounded-sm shadow-md">
                                <h3 className="font-serif text-xl font-bold mb-6 text-[#F2B95E]">Engagement Rules</h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <span className="text-[#F2B95E] font-bold">01.</span>
                                        <div>
                                            <strong className="block text-sm mb-1">No-Show Policy</strong>
                                            <span className="text-sm text-stone-400">Missed calls without 24h notice are burned. No reschedules.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="text-[#F2B95E] font-bold">02.</span>
                                        <div>
                                            <strong className="block text-sm mb-1">Donation Verification</strong>
                                            <span className="text-sm text-stone-400">Email/TG the charity receipt within 6 hours of booking to avoid auto-cancellation.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- 4. FAQ: Accordions --- */}
                <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto border-t border-stone-200">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl text-[#111827] mb-4">Booking FAQ</h2>
                        <div className="w-12 h-1 bg-[#1B4B43]/40 mx-auto rounded-full mt-6"></div>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {FAQS.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border border-stone-200 bg-white rounded-md px-6 py-2 data-[state=open]:border-[#1B4B43] data-[state=open]:shadow-sm transition-all duration-300"
                            >
                                <AccordionTrigger className="text-left text-lg md:text-xl font-medium text-[#111827] hover:no-underline hover:text-[#1B4B43] transition-colors py-6">
                                    {faq.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-stone-600 pb-8 text-base md:text-lg leading-relaxed font-light">
                                    <div className="pl-0 border-l-2 border-[#1B4B43]/20 pt-2 px-4">
                                        {faq.a}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

            </main>
        </div>
    );
}
