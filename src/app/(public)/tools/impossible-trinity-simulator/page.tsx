"use client"

import React, { useState, useEffect } from 'react';
import { ShieldAlert, TrendingUp, Zap, Activity, RefreshCcw, AlertTriangle, ArrowLeft, ArrowRight, Target, Bot } from 'lucide-react';
import Link from 'next/link';

export default function ImpossibleTrinitySimulator() {
    const [profit, setProfit] = useState(50);
    const [safety, setSafety] = useState(50);
    const [speed, setSpeed] = useState(50);
    const [isCrashed, setIsCrashed] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);

    const CRITICAL_POINT = 220;
    const DANGER_ZONE = 180;
    const WARNING_ZONE = 150;
    const total = profit + safety + speed;

    useEffect(() => {
        if (total >= CRITICAL_POINT && !isCrashed) {
            setIsGlitching(true);
            const timer = setTimeout(() => {
                setIsGlitching(false);
                setIsCrashed(true);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [total, isCrashed]);

    const resetSystem = () => {
        setIsCrashed(false);
        setIsGlitching(false);
        setProfit(50);
        setSafety(50);
        setSpeed(50);
    };

    const percentage = Math.min((total / CRITICAL_POINT) * 100, 100);

    let pressureBarClass = 'h-full transition-all duration-500 ease-out ';
    let statusBoxClass = 'mt-10 p-5 rounded-xl border transition-colors duration-300 ';
    let statusTextClass = 'text-sm leading-relaxed font-medium ';
    let statusText = '';
    let mainCardClass = 'relative w-full max-w-xl mx-auto bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 ';

    if (total > DANGER_ZONE) {
        pressureBarClass += 'bg-red-600';
        statusBoxClass += 'bg-red-50 border-red-200';
        statusText = 'CRITICAL WARNING: Unsustainable pressure on the team. Complete project collapse is imminent!';
        statusTextClass += 'text-red-700 font-bold';
        mainCardClass += 'border-red-300 shadow-[0_0_40px_rgba(220,38,38,0.15)] scale-[1.02] ';
    } else if (total > WARNING_ZONE) {
        pressureBarClass += 'bg-[#D97706]';
        statusBoxClass += 'bg-[#D97706]/5 border-[#D97706]/20';
        statusText = 'Quality degradation detected. Resources are stretched, but the project is moving forward.';
        statusTextClass += 'text-[#D97706]';
    } else {
        pressureBarClass += 'bg-[#0F3F35]';
        statusBoxClass += 'bg-stone-50 border-stone-200';
        statusText = 'Equilibrium maintained. The project scope is safe and logical.';
        statusTextClass += 'text-stone-600';
    }

    if (isGlitching) {
        mainCardClass += 'animate-glitch ';
    }

    return (
        <div className="bg-[#FDFBF7] min-h-screen p-6 md:p-12 text-[#1C1917] font-sans selection:bg-[#0F3F35] selection:text-white pb-24">
            <style dangerouslySetInnerHTML={{__html: `
                input[type=range] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                }
                input[type=range]:focus { outline: none; }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 6px;
                    cursor: pointer;
                    background: #E7E5E4;
                    border-radius: 999px;
                }
                input[type=range]::-webkit-slider-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    cursor: pointer;
                    -webkit-appearance: none;
                    margin-top: -7px;
                    background: #0F3F35;
                    border: 2px solid #FDFBF7;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    transition: transform 0.15s ease, background 0.15s ease;
                }
                input[type=range]:disabled::-webkit-slider-thumb {
                    background: #A8A29E;
                    cursor: not-allowed;
                }
                input[type=range]:active::-webkit-slider-thumb { 
                    transform: scale(1.2); 
                    background: #D97706;
                }
                
                @keyframes glitch {
                    0% { transform: translate(0) }
                    20% { transform: translate(-5px, 5px) rotate(-1deg) }
                    40% { transform: translate(-5px, -5px) rotate(1deg) }
                    60% { transform: translate(5px, 5px) rotate(-1deg) }
                    80% { transform: translate(5px, -5px) rotate(1deg) }
                    100% { transform: translate(0) }
                }
                .animate-glitch { animation: glitch 0.2s ease-in-out infinite; }
            `}} />

            <div className="max-w-3xl mx-auto space-y-12">
                {/* Back Button */}
                <div>
                    <Link href="/tools" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#0F3F35] transition-colors font-medium text-sm group">
                        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                        Back to Tools Library
                    </Link>
                </div>

                {/* Simulator Card */}
                <div className={mainCardClass}>
                    {isCrashed && (
                        <div className="absolute inset-0 z-50 bg-[#0F3F35]/95 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md rounded-3xl animate-in fade-in zoom-in duration-300">
                            <AlertTriangle className="w-20 h-20 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-tight drop-shadow-md">
                                System Collapsed
                            </h2>
                            <p className="text-stone-300 text-lg mb-10 max-w-sm font-medium leading-relaxed">
                                You demanded the impossible. The framework shattered under compounding constraints before reaching deployment.
                            </p>
                            <button 
                                onClick={resetSystem} 
                                className="group flex items-center gap-2 px-8 py-4 bg-[#D97706] hover:bg-[#B45309] text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.6)] cursor-pointer"
                            >
                                <RefreshCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" />
                                Reboot with Logic
                            </button>
                        </div>
                    )}

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D97706]/30 bg-[#D97706]/5 text-[#D97706] text-xs font-bold uppercase tracking-widest mb-4">
                            Interactive Diagnostic
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl leading-tight text-[#0F3F35] mb-3">
                            Impossible Trinity <span className="text-[#D97706]">Simulator</span>
                        </h1>
                        <p className="text-stone-500 text-sm md:text-base font-medium max-w-sm mx-auto">
                            Break the constraints, but anticipate the consequences.
                        </p>
                    </div>

                    <div className="mb-10 bg-stone-50 p-6 rounded-2xl border border-stone-100">
                        <div className="flex justify-between items-center text-xs font-bold mb-3">
                            <span className="text-stone-500 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[#0F3F35]" />
                                Structural Stress
                            </span>
                            <span className={`font-mono tracking-widest px-2 py-1 rounded-md ${total > DANGER_ZONE ? 'bg-red-100 text-red-700' : total > WARNING_ZONE ? 'bg-amber-100 text-amber-700' : 'bg-[#0F3F35]/10 text-[#0F3F35]'}`}>
                                {total} / {CRITICAL_POINT}
                            </span>
                        </div>
                        <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                            <div className={pressureBarClass} style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="group">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[#1C1917] font-bold text-sm flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-[#0F3F35]" />
                                    Profit Margin
                                </label>
                                <span className="font-mono font-bold bg-stone-100 text-[#0F3F35] px-3 py-1 rounded-lg text-sm min-w-[3.5rem] text-center border border-stone-200 transition-colors group-hover:border-[#0F3F35]/30">
                                    {profit}%
                                </span>
                            </div>
                            <input type="range" id="profit" min="0" max="100" value={profit} onChange={(e) => setProfit(parseInt(e.target.value))} disabled={isCrashed} />
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[#1C1917] font-bold text-sm flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-[#0F3F35]" />
                                    Risk Mitigation
                                </label>
                                <span className="font-mono font-bold bg-stone-100 text-[#0F3F35] px-3 py-1 rounded-lg text-sm min-w-[3.5rem] text-center border border-stone-200 transition-colors group-hover:border-[#0F3F35]/30">
                                    {safety}%
                                </span>
                            </div>
                            <input type="range" id="safety" min="0" max="100" value={safety} onChange={(e) => setSafety(parseInt(e.target.value))} disabled={isCrashed} />
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[#1C1917] font-bold text-sm flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-[#0F3F35]" />
                                    Execution Velocity
                                </label>
                                <span className="font-mono font-bold bg-stone-100 text-[#0F3F35] px-3 py-1 rounded-lg text-sm min-w-[3.5rem] text-center border border-stone-200 transition-colors group-hover:border-[#0F3F35]/30">
                                    {speed}%
                                </span>
                            </div>
                            <input type="range" id="speed" min="0" max="100" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} disabled={isCrashed} />
                        </div>
                    </div>

                    <div className={statusBoxClass}>
                        <h3 className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                            Real-time Diagnostics
                        </h3>
                        <p className={statusTextClass}>
                            {statusText}
                        </p>
                    </div>
                </div>

                {/* Philosophy Section */}
                <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
                    <h2 className="font-serif text-2xl md:text-3xl text-[#0F3F35] mb-6">The Philosophy of Constraints</h2>
                    <p className="text-stone-600 leading-relaxed text-sm md:text-base mb-4 font-medium">
                        In engineering and business logic, the <strong>Impossible Trinity</strong> dictates that you can optimize for only two of three constraints: <strong className="text-[#D97706]">Speed</strong>, <strong className="text-[#D97706]">Safety</strong>, and <strong className="text-[#D97706]">Profit</strong>. 
                    </p>
                    <p className="text-stone-600 leading-relaxed text-sm md:text-base font-medium">
                        When clients or stakeholders demand all three simultaneously—zero risk, maximum speed, and aggressive cost-cutting—the structural integrity of the project breaks down. This simulator visualizes the compounding pressure that leads to system collapse. True engineering leadership is having the courage to define trade-offs, not ignoring them.
                    </p>
                </div>

                {/* Other Tools Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/tools/npi-assessment" className="group bg-white border border-stone-200 rounded-3xl p-8 transition-all hover:border-[#D97706] hover:shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F3F35]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                        <div className="p-3 bg-stone-100 rounded-lg text-[#0F3F35] w-fit mb-6 group-hover:bg-[#0F3F35] group-hover:text-white transition-colors duration-300">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-[#0F3F35] mb-2 leading-tight">NPI Brand Assessment</h3>
                        <p className="text-stone-600 text-sm mb-6 leading-relaxed">Evaluate the 3 core pillars of your brand: Narrative, Presence, and Impact.</p>
                        <div className="flex items-center justify-between text-[#0F3F35] font-medium text-sm border-t border-stone-100 pt-5">
                            <span className="group-hover:text-[#D97706] transition-colors">Diagnose Brand</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform text-[#D97706]" />
                        </div>
                    </Link>

                    <Link href="/tools/ai-adoption-score" className="group bg-white border border-stone-200 rounded-3xl p-8 transition-all hover:border-[#D97706] hover:shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#0F3F35]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                        <div className="p-3 bg-stone-100 rounded-lg text-[#0F3F35] w-fit mb-6 group-hover:bg-[#0F3F35] group-hover:text-white transition-colors duration-300">
                            <Bot className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-[#0F3F35] mb-2 leading-tight">AI Adoption Readiness</h3>
                        <p className="text-stone-600 text-sm mb-6 leading-relaxed">Determine if your business is structurally ready for true AI integration.</p>
                        <div className="flex items-center justify-between text-[#0F3F35] font-medium text-sm border-t border-stone-100 pt-5">
                            <span className="group-hover:text-[#D97706] transition-colors">Take Assessment</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform text-[#D97706]" />
                        </div>
                    </Link>
                </div>

                {/* Most Read Articles */}
                <div className="bg-white border border-stone-200 rounded-3xl p-8 md:p-10 shadow-sm transition-all hover:shadow-md">
                    <h2 className="font-serif text-2xl text-[#0F3F35] mb-6">Trending Insights</h2>
                    <div className="space-y-3">
                        <Link href="/blog" className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group">
                            <div className="mb-2 md:mb-0">
                                <span className="text-[10px] font-bold tracking-widest text-[#D97706] uppercase mb-2 block">Engineering Systems</span>
                                <h4 className="font-bold text-[#1C1917] group-hover:text-[#0F3F35] transition-colors">Why Your MVP is Over-Engineered by Developers Who've Never Sold Anything</h4>
                            </div>
                            <span className="text-xs font-bold text-stone-400 flex items-center gap-1 group-hover:text-[#D97706] transition-colors">
                                Read Article <ArrowRight className="w-3 h-3" />
                            </span>
                        </Link>
                        <Link href="/blog" className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group">
                            <div className="mb-2 md:mb-0">
                                <span className="text-[10px] font-bold tracking-widest text-[#D97706] uppercase mb-2 block">Leadership</span>
                                <h4 className="font-bold text-[#1C1917] group-hover:text-[#0F3F35] transition-colors">The True Cost of Avoiding Hard Technical Conversations with Clients</h4>
                            </div>
                            <span className="text-xs font-bold text-stone-400 flex items-center gap-1 group-hover:text-[#D97706] transition-colors">
                                Read Article <ArrowRight className="w-3 h-3" />
                            </span>
                        </Link>
                        <Link href="/blog" className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100 group">
                            <div className="mb-2 md:mb-0">
                                <span className="text-[10px] font-bold tracking-widest text-[#D97706] uppercase mb-2 block">Business Models</span>
                                <h4 className="font-bold text-[#1C1917] group-hover:text-[#0F3F35] transition-colors">Stop Selling Features, Start Selling Leverage and Reliability</h4>
                            </div>
                            <span className="text-xs font-bold text-stone-400 flex items-center gap-1 group-hover:text-[#D97706] transition-colors">
                                Read Article <ArrowRight className="w-3 h-3" />
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
