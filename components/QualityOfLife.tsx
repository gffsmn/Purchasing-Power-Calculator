
import React, { useState } from 'react';
import type { CountryData, QualityOfLife, QualityOfLifeData } from '../types.ts';

interface QualityOfLifeProps {
    fromCountry: CountryData;
    toCountry: CountryData;
}

interface Indicator {
    label: string;
    key: keyof QualityOfLife;
    // 'higher' means a higher value is better, 'lower' means a lower value is better
    preference: 'higher' | 'lower';
    formatter: (data: QualityOfLifeData) => string;
    icon: string;
}

const INDICATORS: Indicator[] = [
    { label: 'Employment Rate', key: 'employmentRate', preference: 'higher', formatter: (d) => `${d.value.toFixed(1)}%`, icon: '💼' },
    { label: 'Life Expectancy', key: 'lifeExpectancy', preference: 'higher', formatter: (d) => `${d.value.toFixed(1)} yrs`, icon: '❤️' },
    // Show only Rank by default for Safety Index
    { label: 'Safety Index (GPI)', key: 'safetyIndex', preference: 'lower', formatter: (d) => `Rank: ${d.rank || '-'}`, icon: '🛡️' },
    { label: 'Health Care Access (HAQ)', key: 'healthCareIndex', preference: 'higher', formatter: (d) => d.value.toFixed(1), icon: '⚕️' },
    { label: 'Pollution Index (PM2.5)', key: 'pollutionIndex', preference: 'lower', formatter: (d) => `${d.value.toFixed(1)} µg/m³`, icon: '💨' },
    { label: 'Foreign Residents', key: 'foreignResidentsPercentage', preference: 'higher', formatter: (d) => `${d.value.toFixed(1)}%`, icon: '🌍' },
];

const EU_AVERAGES: Partial<Record<keyof QualityOfLife, string>> = {
    employmentRate: '75.3%', // Eurostat 2023 (Age 20-64)
    lifeExpectancy: '81.5 yrs', // Eurostat 2023
    healthCareIndex: '89.5', // Approx EU Weighted Average (HAQ)
    foreignResidentsPercentage: '8.5%', // Approx EU Weighted Average (Non-nationals)
};

const SAFETY_TOOLTIP = (
    <div className="space-y-3">
        <div>
            <div className="mb-1">
                <span className="font-bold text-slate-800 text-lg">Global Peace Index (GPI)</span>
            </div>
            <p><span className="font-semibold">Source:</span> Institute for Economics and Peace (IEP).</p>
            <p><span className="font-semibold">Reliability:</span> Very high. It is the most cited and authoritative index in this field.</p>
        </div>
        <div>
            <p className="font-semibold">What It Measures:</p>
            <p>The peacefulness of a country across 23 indicators grouped into three domains:</p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Societal Safety and Security (e.g., homicide rate, perceived criminality).</li>
                <li>Ongoing Domestic and International Conflict.</li>
                <li>Militarisation (e.g., military expenditure).</li>
            </ul>
        </div>
        <div>
            <p className="font-semibold">Advantage:</p>
            <p>Offers a comprehensive view that goes beyond simple crime rates, including political stability and militarization.</p>
        </div>
        <div className="bg-indigo-50 p-2 rounded border border-indigo-100 text-indigo-800 font-medium">
            Remember: The official GPI uses a scale where a LOWER score (closer to 1) is BETTER (more peaceful/safe).
        </div>
    </div>
);

const WHO_TOOLTIP = (
    <div className="space-y-3">
        <div>
            <div className="mb-1">
                <span className="font-bold text-slate-800 text-lg">Life Expectancy at Birth</span>
            </div>
            <p><span className="font-semibold">Source:</span> World Health Organization (WHO).</p>
            <p><span className="font-semibold">Reliability:</span> Gold Standard. WHO is the directing and coordinating authority on international health within the United Nations system.</p>
        </div>
        <div>
            <p className="font-semibold">What It Measures:</p>
            <p>The average number of years that a newborn could expect to live, if he or she were to pass through life subject to the age-specific mortality rates of a given period.</p>
        </div>
        <div className="bg-indigo-50 p-2 rounded border border-indigo-100 text-indigo-800 font-medium">
             It reflects the overall mortality level of a population and summarizes the mortality pattern that prevails across all age groups.
        </div>
    </div>
);

const EUROSTAT_EMPLOYMENT_TOOLTIP = (
    <div className="space-y-3">
        <div>
            <div className="mb-1">
                <span className="font-bold text-slate-800 text-lg">Employment Rate (20-64)</span>
            </div>
            <p><span className="font-semibold">Source:</span> Eurostat.</p>
            <p><span className="font-semibold">Reliability:</span> Official EU Statistics. It is the headline indicator for the European Pillar of Social Rights.</p>
        </div>
        <div>
            <p className="font-semibold">What It Measures:</p>
            <p>The percentage of the population aged 20 to 64 who are employed. This age group is used to monitor the Europe 2030 target.</p>
        </div>
        <div className="bg-indigo-50 p-2 rounded border border-indigo-100 text-indigo-800 font-medium">
             A higher rate indicates a stronger labor market and higher economic participation.
        </div>
    </div>
);

const HAQ_TOOLTIP = (
    <div className="space-y-3">
        <div>
            <div className="mb-1">
                <span className="font-bold text-slate-800 text-lg">HAQ Index (Lancet/IHME)</span>
            </div>
            <p><span className="font-semibold">Source:</span> The Lancet Global Health (GBD Study).</p>
            <p><span className="font-semibold">Reliability:</span> Gold Standard for healthcare quality comparison.</p>
        </div>
        <div>
            <p className="font-semibold">What It Measures:</p>
            <p>Healthcare Access and Quality based on <strong>Amenable Mortality</strong> (deaths from causes that should not occur in the presence of effective medical care, using WHO mortality data).</p>
        </div>
        <div>
            <p className="font-semibold">Why this ranking is useful:</p>
            <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>It is based on <strong>real health outcomes</strong> and preventable mortality, not on subjective perceptions or healthcare spending.</li>
                <li>It is <strong>comparable across countries</strong> and allows for robust assessments of health system performance.</li>
                <li>It is widely used in <strong>peer-reviewed studies</strong> and international policy analysis.</li>
            </ul>
        </div>
        <div className="bg-indigo-50 p-2 rounded border border-indigo-100 text-indigo-800 font-medium">
             Scale 0-100. Higher values indicate lower rates of amenable mortality and better access to quality healthcare.
        </div>
    </div>
);

const EUROSTAT_MIGRATION_TOOLTIP = (
    <div className="space-y-3">
        <div>
            <div className="mb-1">
                <span className="font-bold text-slate-800 text-lg">Foreign Residents</span>
            </div>
            <p><span className="font-semibold">Source:</span> Eurostat - Statistics Explained (PDF).</p>
            <p><span className="font-semibold">Reliability:</span> Very High. Based on official population statistics reported by Member States.</p>
        </div>
        <div>
            <p className="font-semibold">What It Measures:</p>
            <p>The percentage of the resident population with a citizenship different from the reporting country. This includes both EU citizens and non-EU citizens residing in the country.</p>
            <p className="text-xs text-slate-500 mt-1">Reflects openness, diversity, and international attractiveness.</p>
        </div>
         <div className="bg-indigo-50 p-2 rounded border border-indigo-100 text-indigo-800 font-medium">
             Higher percentage often indicates a more international environment and attractiveness to expats.
        </div>
    </div>
);

const IQAIR_POLLUTION_TOOLTIP = (
    <div className="space-y-3">
        <div>
            <div className="mb-1">
                <span className="font-bold text-slate-800 text-lg">World Air Quality Report</span>
            </div>
            <p><span className="font-semibold">Source:</span> IQAir / Greenpeace.</p>
            <p><span className="font-semibold">Reliability:</span> Global standard for PM2.5 air quality data.</p>
        </div>
        <div>
            <p className="font-semibold">What It Measures:</p>
            <p>Annual average PM2.5 concentration (μg/m³). PM2.5 are fine particulate matter that pose the greatest risk to health.</p>
        </div>
        <div className="bg-indigo-50 p-2 rounded border border-indigo-100 text-indigo-800 font-medium">
             A LOWER score indicates cleaner air. High scores indicate increased pollution levels.
        </div>
    </div>
);

const getPollutionLevel = (value: number) => {
    if (value <= 5) return { label: 'Excellent', color: 'text-emerald-600' };
    if (value <= 10) return { label: 'Good', color: 'text-green-600' };
    if (value <= 15) return { label: 'Moderate', color: 'text-yellow-600' };
    if (value <= 25) return { label: 'Unhealthy', color: 'text-orange-600' };
    return { label: 'Very Unhealthy', color: 'text-red-600' };
};

const QualityOfLife: React.FC<QualityOfLifeProps> = ({ fromCountry, toCountry }) => {
    const [hoveredSource, setHoveredSource] = useState<string | null>(null);

    const getQoLUrl = (sourceName: string) => {
        if (!sourceName) return undefined;
        const lower = sourceName.toLowerCase();
        // Remove periods to handle 'W.H.O.' as 'who'
        const cleanName = lower.replace(/\./g, '');
        
        if (lower.includes('eurostat') && (lower.includes('migration') || lower.includes('statistics explained'))) return 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Migration_and_migrant_population_statistics';
        if (lower.includes('eurostat')) return 'https://ec.europa.eu/eurostat/data/database';
        if (lower.includes('eea') || lower.includes('european air quality')) return 'https://airindex.eea.europa.eu/Map/AQI/Viewer/';
        if (lower.includes('iqair') || lower.includes('world air quality') || lower.includes('greenpeace')) return 'https://www.iqair.com/world-air-quality-report';
        
        if (cleanName.includes('who') && cleanName.includes('pollution')) return 'https://www.who.int/data/gho/data/themes/air-pollution';
        if (cleanName.includes('who')) return 'https://www.who.int/data/gho/publications/world-health-statistics';
        
        if (lower.includes('oecd')) return 'https://data.oecd.org';
        if (lower.includes('eea')) return 'https://www.eea.europa.eu/data-and-maps';
        // Updated HAQ link
        if (lower.includes('lancet') || lower.includes('ihme') || lower.includes('haq')) return 'https://www.thelancet.com/journals/langlo/article/PIIS2214-109X(22)00429-6/fulltext';
        if (lower.includes('ilo')) return 'https://ilostat.ilo.org';
        if (lower.includes('peace') || lower.includes('iep')) return 'https://www.visionofhumanity.org/maps/#/';
        if (lower.includes('worldometer')) return 'https://www.worldometers.info/';
        if (lower.includes('ehci') || lower.includes('health consumer')) return 'https://healthpowerhouse.com/publications/euro-health-consumer-index';
        if (lower.includes('numbeo')) return 'https://www.numbeo.com';
        if (lower.includes('world bank')) return 'https://data.worldbank.org';
        return undefined;
    };

    const renderIndicator = (indicator: Indicator) => {
        const fromData = fromCountry.qualityOfLife[indicator.key];
        const toData = toCountry.qualityOfLife[indicator.key];

        if (!fromData || !toData) return null;
        
        const fromValue = fromData.value;
        const toValue = toData.value;

        let fromClass = 'bg-slate-100';
        let toClass = 'bg-slate-100';

        const isFromBetter = indicator.preference === 'higher' ? fromValue > toValue : fromValue < toValue;
        const isToBetter = indicator.preference === 'higher' ? toValue > fromValue : toValue < fromValue;

        if (isFromBetter) {
            fromClass = 'bg-green-100';
            toClass = 'bg-red-100';
        } else if (isToBetter) {
            toClass = 'bg-green-100';
            fromClass = 'bg-red-100';
        }

        const sourceUrl = getQoLUrl(fromData.source);
        const isSafety = indicator.key === 'safetyIndex';
        const hasTooltip = indicator.key === 'safetyIndex' || indicator.key === 'lifeExpectancy' || indicator.key === 'employmentRate' || indicator.key === 'healthCareIndex' || indicator.key === 'pollutionIndex' || indicator.key === 'foreignResidentsPercentage';
        
        // Show EU Average if relevant and available
        const showEUAvg = (fromCountry.isEU || toCountry.isEU) && EU_AVERAGES[indicator.key];

        const renderValueWithTooltip = (data: QualityOfLifeData) => {
            const text = indicator.formatter(data);
            if (isSafety) {
                return (
                    <div className="group relative inline-block cursor-help">
                        <span>{text}</span>
                        <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                            Score: {data.value.toFixed(3)}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                    </div>
                );
            }
            return text;
        };

        return (
            <div key={indicator.key} className="p-4 bg-white rounded-lg shadow-sm border border-slate-200/60 relative flex flex-col h-full">
                <div className="flex items-center mb-4">
                    <span className="text-2xl mr-2">{indicator.icon}</span>
                    <p className="font-semibold text-slate-700">{indicator.label}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-center mb-4 flex-grow">
                    <div className={`${fromClass} p-3 rounded-md flex flex-col justify-center`}>
                        <p className="text-sm text-slate-500 mb-1">{fromCountry.name}</p>
                        <p className="text-lg font-bold text-slate-800">
                            {renderValueWithTooltip(fromData)}
                        </p>
                        {/* Pollution Level Visual Scale */}
                        {indicator.key === 'pollutionIndex' && (
                            <div className="mt-3 w-full">
                                <div className="h-2 w-full rounded-full bg-slate-200 relative overflow-hidden">
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #4ade80 0%, #facc15 33%, #fb923c 66%, #ef4444 100%)' }}></div>
                                </div>
                                <div className="relative h-2 w-full -mt-2">
                                     <div
                                        className="absolute top-0 w-1 h-3 bg-slate-800 border border-white transform -translate-x-1/2 shadow-sm"
                                        style={{ left: `${Math.min((fromData.value / 30) * 100, 100)}%` }}
                                     ></div>
                                </div>
                                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                                    <span>0</span>
                                    <span>30+</span>
                                </div>
                                <div className={`text-xs font-bold mt-1 text-center ${getPollutionLevel(fromData.value).color}`}>
                                    {getPollutionLevel(fromData.value).label}
                                </div>
                            </div>
                        )}
                        {/* Breakdown for Foreign Residents */}
                        {indicator.key === 'foreignResidentsPercentage' && fromData.breakdown && (
                            <div className="mt-2 pt-2 border-t border-black/10 flex justify-between text-xs font-medium opacity-80">
                                <div className="flex flex-col items-center">
                                    <span title="EU Citizens">🇪🇺 EU</span>
                                    <span>{fromData.breakdown.eu.toFixed(1)}%</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span title="Non-EU Citizens">🌐 Non-EU</span>
                                    <span>{fromData.breakdown.nonEu.toFixed(1)}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`${toClass} p-3 rounded-md flex flex-col justify-center`}>
                        <p className="text-sm text-slate-500 mb-1">{toCountry.name}</p>
                        <p className="text-lg font-bold text-slate-800">
                             {renderValueWithTooltip(toData)}
                        </p>
                        {/* Pollution Level Visual Scale */}
                         {indicator.key === 'pollutionIndex' && (
                            <div className="mt-3 w-full">
                                <div className="h-2 w-full rounded-full bg-slate-200 relative overflow-hidden">
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #4ade80 0%, #facc15 33%, #fb923c 66%, #ef4444 100%)' }}></div>
                                </div>
                                <div className="relative h-2 w-full -mt-2">
                                     <div
                                        className="absolute top-0 w-1 h-3 bg-slate-800 border border-white transform -translate-x-1/2 shadow-sm"
                                        style={{ left: `${Math.min((toData.value / 30) * 100, 100)}%` }}
                                     ></div>
                                </div>
                                <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                                    <span>0</span>
                                    <span>30+</span>
                                </div>
                                <div className={`text-xs font-bold mt-1 text-center ${getPollutionLevel(toData.value).color}`}>
                                    {getPollutionLevel(toData.value).label}
                                </div>
                            </div>
                        )}
                        {/* Breakdown for Foreign Residents */}
                        {indicator.key === 'foreignResidentsPercentage' && toData.breakdown && (
                            <div className="mt-2 pt-2 border-t border-black/10 flex justify-between text-xs font-medium opacity-80">
                                <div className="flex flex-col items-center">
                                    <span title="EU Citizens">🇪🇺 EU</span>
                                    <span>{toData.breakdown.eu.toFixed(1)}%</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span title="Non-EU Citizens">🌐 Non-EU</span>
                                    <span>{toData.breakdown.nonEu.toFixed(1)}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-auto">
                     {/* Left side: EU Average if applicable */}
                    <div className="text-xs text-slate-400 font-medium">
                         {showEUAvg && (
                             <span title="European Union Average">🇪🇺 EU Avg: {EU_AVERAGES[indicator.key]}</span>
                         )}
                    </div>

                    {/* Right side: Source Link & Tooltips */}
                    <div 
                        className="relative group/tooltip"
                        onMouseEnter={() => hasTooltip && setHoveredSource(indicator.key)}
                        onMouseLeave={() => hasTooltip && setHoveredSource(null)}
                    >
                         {sourceUrl ? (
                             <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-indigo-600 font-mono underline hover:no-underline transition-colors block text-right">
                                Source: {fromData.source}
                             </a>
                         ) : (
                             <span className="text-xs text-slate-400 font-mono cursor-help text-right block">Source: {fromData.source}</span>
                         )}
                         
                         {/* Tooltips */}
                         {/* Common Tooltip Container Style */}
                         {hoveredSource === indicator.key && (
                            <div className="absolute right-0 bottom-full mb-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4 text-xs text-slate-600 leading-relaxed pointer-events-none transform transition-all duration-200 opacity-100">
                                 {indicator.key === 'safetyIndex' && SAFETY_TOOLTIP}
                                 {indicator.key === 'lifeExpectancy' && WHO_TOOLTIP}
                                 {indicator.key === 'employmentRate' && EUROSTAT_EMPLOYMENT_TOOLTIP}
                                 {indicator.key === 'healthCareIndex' && HAQ_TOOLTIP}
                                 {indicator.key === 'foreignResidentsPercentage' && EUROSTAT_MIGRATION_TOOLTIP}
                                 {indicator.key === 'pollutionIndex' && IQAIR_POLLUTION_TOOLTIP}
                                 
                                 {/* Arrow */}
                                 <div className="absolute top-full right-4 -mt-1 w-2 h-2 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INDICATORS.map(renderIndicator)}
            </div>
        </div>
    );
};

export default QualityOfLife;
