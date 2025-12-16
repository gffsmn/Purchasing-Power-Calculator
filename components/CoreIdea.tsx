
import React from 'react';

interface CoreIdeaProps {
    onBack: () => void;
}

const CoreIdea: React.FC<CoreIdeaProps> = ({ onBack }) => {
    return (
        <div className="relative max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl -z-10 opacity-60"></div>

            <div className="text-center mb-20 relative z-10 pt-12 md:pt-0">
                <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 tracking-tight sm:text-6xl mb-6 drop-shadow-sm">
                    The Core Idea
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Bridging the gap between <span className="font-semibold text-slate-800">salary numbers</span> and <span className="font-semibold text-slate-800">real life</span>.
                </p>
            </div>

            <div className="space-y-12 relative z-10">
                
                {/* Section 1: The Context */}
                <div className="group relative bg-white rounded-3xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="md:flex items-start gap-8">
                        <div className="flex-shrink-0 mb-6 md:mb-0">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="uppercase tracking-wider text-xs font-bold text-indigo-500 mb-2">The Context</h3>
                            <h4 className="text-3xl font-bold text-slate-900 mb-4">A Mobile Workforce</h4>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                In Austria and across Europe, professionals are increasingly mobile. The single market has made moving for work easier than ever, creating a dynamic environment where talent flows freely across borders. We live in an era where your next desk could be in Berlin, Vienna, or Lisbon.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: The Challenge */}
                <div className="group relative bg-white rounded-3xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                    <div className="md:flex items-start gap-8">
                        <div className="flex-shrink-0 mb-6 md:mb-0">
                            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="uppercase tracking-wider text-xs font-bold text-orange-500 mb-2">The Challenge</h3>
                            <h4 className="text-3xl font-bold text-slate-900 mb-4">Is the offer really better?</h4>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                <span className="italic text-slate-800 font-medium">"Money illusion"</span> is real. Expats and job seekers often receive offers that look numerically higher but fail to account for the local cost of living. A <span className="font-semibold text-slate-800">€60k</span> salary in Vienna buys a completely different lifestyle than €60k in Dublin, Zurich, or Munich. Without context, a number is just a number.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 3: The Solution */}
                <div className="group relative bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl hover:shadow-xl transition-all duration-300 overflow-hidden text-white">
                    {/* Decorative blurred circles for dark card */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
                    
                    <div className="relative md:flex items-start gap-8">
                         <div className="flex-shrink-0 mb-6 md:mb-0">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="uppercase tracking-wider text-xs font-bold text-emerald-400 mb-2">The Solution</h3>
                            <h4 className="text-3xl font-bold text-white mb-4">Transparency & Data</h4>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                This tool empowers you to make informed decisions. By comparing purchasing power, detailed category costs, and quality of life indicators, we help you understand the <span className="text-white font-bold border-b-2 border-emerald-500">real value</span> of a job offer abroad. We don't just compare currencies; we compare lifestyles.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            
            <div className="mt-16 text-center">
                 <button 
                    onClick={onBack}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                 >
                    Start Comparing Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                 </button>
            </div>
        </div>
    );
};

export default CoreIdea;
