
import React, { useState, useEffect } from 'react';
import type { CountryData } from '../types.ts';

interface AiRelocationAssistantProps {
    fromCountry: CountryData;
    toCountry: CountryData;
}

const AiRelocationAssistant: React.FC<AiRelocationAssistantProps> = ({ fromCountry, toCountry }) => {
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState<{
        difficulty: number; // 1-10
        summary: string;
        requirements: string[];
        visaType: string;
    } | null>(null);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setInsight(generateRelocationLogic(fromCountry, toCountry));
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [fromCountry.code, toCountry.code]);

    // Themes for Light Mode (High Contrast)
    const getTheme = (score: number) => {
         if (score > 7) return { 
             text: 'text-rose-600', 
             bar: 'bg-rose-500',
             bg: 'bg-rose-50'
         };
         if (score > 3) return { 
             text: 'text-amber-600', 
             bar: 'bg-amber-500',
             bg: 'bg-amber-50'
         };
         return { 
             text: 'text-emerald-600', 
             bar: 'bg-emerald-500',
             bg: 'bg-emerald-50'
         };
    };

    return (
        <div className="mt-8 mb-4 relative group w-full">
            {/* Soft decorative shadow/glow behind */}
            <div className="absolute -inset-1 bg-indigo-50 rounded-2xl -z-10 blur-sm opacity-50"></div>
            
            <div className="relative rounded-xl bg-white border border-indigo-100/80 overflow-hidden shadow-lg shadow-indigo-100/40">
                {/* Header - Light & Clean */}
                <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        {/* Status Dot */}
                        <div className="relative flex h-2.5 w-2.5">
                            {loading && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${loading ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                        </div>
                        <span className="text-xs font-bold tracking-wide text-indigo-900 uppercase">AI Mobility Insight</span>
                    </div>
                    {!loading && insight && (
                         <span className="text-xs font-medium text-slate-400 font-mono tracking-tight">{fromCountry.code} &rarr; {toCountry.code}</span>
                    )}
                </div>

                <div className="p-5 md:p-6 min-h-[140px] flex flex-col justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-4">
                            <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm font-medium text-slate-500 animate-pulse">Analyzing Immigration Protocols...</span>
                        </div>
                    ) : insight ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fadeIn">
                            {(() => {
                                const theme = getTheme(insight.difficulty);
                                return (
                                    <>
                                        {/* COL 1: HERO METRICS (Visa & Difficulty) */}
                                        <div className="md:col-span-4 flex flex-col justify-center h-full border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Required Access</span>
                                            
                                            {/* High Contrast Title */}
                                            <h3 className="text-2xl md:text-3xl font-extrabold text-indigo-950 leading-tight mb-3">
                                                {insight.visaType}
                                            </h3>
                                            
                                            <div className="mt-auto pt-2">
                                                <div className="flex items-end justify-between text-[11px] font-bold leading-none mb-2">
                                                    <span className="text-slate-400 uppercase tracking-wider">Complexity Level</span>
                                                    <span className={`${theme.text}`}>LVL {insight.difficulty}/10</span>
                                                </div>
                                                
                                                {/* Clean Progress Bar */}
                                                <div className="flex gap-1 h-2 w-full">
                                                    {[...Array(10)].map((_, i) => (
                                                        <div 
                                                            key={i} 
                                                            className={`flex-1 rounded-sm transition-all duration-500 ${
                                                                i < insight.difficulty 
                                                                ? theme.bar
                                                                : 'bg-slate-200'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* COL 2: CONTEXT (Summary) */}
                                        <div className="md:col-span-5 flex flex-col justify-between h-full space-y-3">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Analysis Protocol</span>
                                            
                                            {/* Readable Body Text */}
                                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                {insight.summary}
                                            </p>
                                            
                                            <div className="pt-2 mt-auto">
                                                <p className="text-[10px] text-slate-400 italic">
                                                    *Estimation based on standard 2025 frameworks.
                                                </p>
                                            </div>
                                        </div>

                                        {/* COL 3: CHECKLIST (Requirements) */}
                                        <div className="md:col-span-3 h-full pl-0 md:pl-2">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 block">Key Requirements</span>
                                            <ul className="space-y-2">
                                                {insight.requirements.slice(0, 4).map((req, i) => (
                                                    <li key={i} className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                                                        <span className="text-indigo-500 mt-0.5">•</span>
                                                        <span className="leading-tight">{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

// --- LOGIC ENGINE ---

const generateRelocationLogic = (from: CountryData, to: CountryData) => {
    const fromCodeMain = from.code.split('-')[0];
    const toCodeMain = to.code.split('-')[0];
    const isDomestic = fromCodeMain === toCodeMain;
    const isEUtoEU = from.isEU && to.isEU;
    
    // Default values
    let difficulty = 5;
    let summary = "";
    let requirements = ["Valid Passport"];
    let visaType = "Work Visa";

    // 1. DOMESTIC (e.g. US State to US State)
    if (isDomestic) {
        difficulty = 1;
        summary = `Seamless internal relocation. No immigration checkpoints. Maintain federal rights/benefits.`;
        requirements = ["Proof of Address", "ID Update", "Utility Setup"];
        visaType = "Domestic Move"; // Shortened for compact UI
    }
    // 2. EU -> EU (Freedom of Movement)
    else if (isEUtoEU) {
        difficulty = 2;
        summary = `Freedom of Movement applies. Right to live/work without a visa. Only local registration required.`;
        requirements = ["ID / Passport", "Municipality Reg.", "Employment Proof"]; // Shortened
        visaType = "Free Movement";
    }
    // 3. NON-EU -> EU (e.g. US -> DE)
    else if (!from.isEU && to.isEU) {
        difficulty = 8;
        summary = `Sponsored work permit required. Process is bureaucratic. High-skill routes (Blue Card) recommended.`;
        requirements = ["Job Sponsorship", "Degree Recognition", "Health Insurance", "Residence Permit"];
        visaType = "Work Permit / Blue Card";
    }
    // 4. EU -> USA
    else if (from.isEU && toCodeMain === 'US') {
        difficulty = 9;
        summary = `Strict entry. Requires employer sponsorship (H-1B) or intra-company transfer (L-1).`;
        requirements = ["Sponsorship (H-1B/L-1)", "Petition Approval", "Embassy Interview"];
        visaType = "H-1B / L-1 Visa";
    }
    // 5. EU -> UK (Post-Brexit)
    else if (from.isEU && toCodeMain === 'GB') {
        difficulty = 7;
        summary = `Points-based system. Visa required post-Brexit. Must meet salary & skill thresholds.`;
        requirements = ["Skilled Worker Visa", "Sponsorship Cert.", "Healthcare Surcharge"];
        visaType = "Skilled Worker Visa";
    }
    // 6. Generic International
    else {
        difficulty = 7;
        summary = `Standard international relocation. Work visa mandatory. Salary must meet local foreigner thresholds.`;
        requirements = ["Valid Passport", "Work Visa", "Criminal Record", "Medical Check"];
        visaType = "Standard Work Visa";
    }

    // Specific adjustment for Switzerland (CH)
    if (toCodeMain === 'CH') {
        if (from.isEU) {
            difficulty = 3;
            summary = "Bilateral agreements apply. Easy access with job offer, but Residence Permit (B/L) is mandatory.";
            visaType = "Permit B / L";
        } else {
            difficulty = 9;
            summary = "Strict quotas for non-EU. Employer must prove no local talent available. High scrutiny.";
        }
    }

    return { difficulty, summary, requirements, visaType };
};

export default AiRelocationAssistant;
