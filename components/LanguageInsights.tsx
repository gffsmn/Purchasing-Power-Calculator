
import React from 'react';
import type { SelectableCountry } from '../types.ts';
import { getCountryLanguageStats, COUNTRY_LANGUAGES, OFFICIAL_LANGUAGES } from '../constants.tsx';

interface LanguageInsightsProps {
    fromCountry: SelectableCountry;
    toCountry: SelectableCountry;
}

const LanguageInsights: React.FC<LanguageInsightsProps> = ({ fromCountry, toCountry }) => {
    // Official languages of the destination (Comparison) country (Array)
    const toOfficialLangs = OFFICIAL_LANGUAGES[toCountry.code] || [COUNTRY_LANGUAGES[toCountry.code] || 'Local'];
    
    // Helper to format list naturally: "A, B, and C"
    const formatLanguageList = (langs: string[]) => {
        if (langs.length === 0) return 'Local Language';
        if (langs.length === 1) return langs[0];
        if (langs.length === 2) return `${langs[0]} and ${langs[1]}`;
        return `${langs.slice(0, -1).join(', ')}, and ${langs[langs.length - 1]}`;
    };

    const toLangText = formatLanguageList(toOfficialLangs);

    // Get language stats for the destination country
    const toStats = getCountryLanguageStats(toCountry.code);
    const englishPct = toStats['English'] || 0;

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
             <div className="flex items-center mb-4">
                <span className="text-xl mr-2">🗣️</span>
                <h3 className="text-lg font-bold text-slate-800">Language Insights</h3>
            </div>
            
            <div className="text-sm text-slate-600 space-y-2">
                <p>
                    People in <span className="font-semibold">{toCountry.name}</span> speak <span className="font-semibold">{toLangText}</span>.
                </p>
                <p>
                    The percentage of people who speak <span className="font-bold text-indigo-600">English</span> is <span className="font-bold text-slate-900">{englishPct}%</span>.
                </p>
            </div>

             <div className="mt-4 pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-right italic">
                Source: <a href="https://languageknowledge.eu/languages/english?utm" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 hover:underline">LanguageKnowledge.eu</a>
            </div>
        </div>
    );
};

export default LanguageInsights;
