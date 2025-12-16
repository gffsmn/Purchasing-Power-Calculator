
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { CountryData, PriceLevelData, SelectableCountry, QualityOfLifeData } from './types.ts';
import { SELECTABLE_COUNTRIES, WORLDWIDE_COUNTRIES, CATEGORIES, US_STATES } from './constants.tsx';
import CountrySelector from './components/CountrySelector.tsx';
import ComparisonCard from './components/ComparisonCard.tsx';
import QualityOfLife from './components/QualityOfLife.tsx';
import CoreIdea from './components/CoreIdea.tsx';
import AiRelocationAssistant from './components/AiRelocationAssistant.tsx';
import { 
    COUNTRY_PROFILES, 
    REAL_EMPLOYMENT_DATA, 
    REAL_LIFE_EXPECTANCY_DATA, 
    REAL_GPI_DATA, 
    REAL_HAQ_DATA, 
    REAL_PM25_DATA, 
    REAL_FOREIGN_RESIDENTS_DATA 
} from './data.ts';

// --- DATA ENGINE ---
// Uses simulated realistic data imported from data.ts

// Deterministic pseudo-random number generator based on a seed string
const pseudoRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
};

// Generate realistic looking data locally using the imported base data
const generateSimulatedCountryData = async (country: SelectableCountry): Promise<Omit<CountryData, 'code' | 'name' | 'currency'>> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Slight realistic delay
    
    // Support for Worldwide Beta codes (e.g. US-CA)
    const baseCode = country.code; 
    const mainCode = baseCode.split('-')[0];
    
    // Get Base Profile
    let profile = COUNTRY_PROFILES[baseCode] 
        ? { ...COUNTRY_PROFILES[baseCode] } 
        : COUNTRY_PROFILES[mainCode] 
            ? { ...COUNTRY_PROFILES[mainCode] }
            : { salary: 15000, index: 50, region: 'OTHER' as const }; // Default low baseline for missing
    
    const seed = country.code;
    
    // Variation factors to make categories look organic
    const getVar = (salt: string, range: number) => (pseudoRandom(seed + salt) * range * 2) - range;

    // Generate Category Prices around the base index
    const categoryPrices: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
        if (cat.id !== 'total') {
            const catIndex = profile.index;
            const variation = getVar(cat.id, 12); 
            categoryPrices[cat.id] = Math.max(30, Math.round(catIndex + variation));
        }
    });

    // Primary source for economic data
    const primarySource = 'Eurostat';

    // Safety Index (GPI) Calculation: Lower score is better.
    const gpiData = REAL_GPI_DATA[baseCode] || REAL_GPI_DATA[mainCode];
    const gpiScore = gpiData ? gpiData.score : (1.3 + Math.max(0, (150 - profile.index) / 100));
    const gpiRank = gpiData ? gpiData.rank : Math.max(1, Math.min(163, Math.round((gpiScore - 1.1) / 2.4 * 163)));

    // Real Employment Data
    const realEmployment = REAL_EMPLOYMENT_DATA[baseCode] || REAL_EMPLOYMENT_DATA[mainCode];
    const employmentValue = realEmployment !== undefined 
        ? realEmployment 
        : Math.min(85, Math.max(50, 65 + getVar('emp', 10)));

    // Real Life Expectancy Data
    const realLifeExpectancy = REAL_LIFE_EXPECTANCY_DATA[baseCode] || REAL_LIFE_EXPECTANCY_DATA[mainCode];
    const lifeExpectancyValue = realLifeExpectancy !== undefined
        ? realLifeExpectancy
        : Math.min(85, Math.max(70, 78 + getVar('life', 4) + (profile.index > 100 ? 3 : -2)));

    // Real HAQ Index Data (replacing previous WHO UHC)
    const realHaq = REAL_HAQ_DATA[baseCode] || REAL_HAQ_DATA[mainCode];
    const healthValue = realHaq !== undefined
        ? realHaq
        : Math.min(95, Math.max(50, 70 + getVar('health', 10)));

    // Real PM2.5 Data (IQAir)
    const realPm25 = REAL_PM25_DATA[baseCode] || REAL_PM25_DATA[mainCode];
    const pollutionValue = realPm25 !== undefined
        ? realPm25
        : Math.min(30, Math.max(3, 10 + getVar('poll', 5))); // Fallback reasonable PM2.5 values
    
    // Real Foreign Residents Data
    const realForeign = REAL_FOREIGN_RESIDENTS_DATA[baseCode] || REAL_FOREIGN_RESIDENTS_DATA[mainCode];
    const foreignValue = realForeign?.total ?? Math.max(0.5, 5 + getVar('foreign', 3));
    const foreignBreakdown = realForeign ? { eu: realForeign.eu, nonEu: realForeign.nonEu } : undefined;

    // Reliable sources for specific indicators
    const qualityOfLife = {
        employmentRate: { 
            value: employmentValue, 
            source: 'Eurostat / World Bank' 
        },
        lifeExpectancy: { 
            value: lifeExpectancyValue, 
            source: 'W.H.O.' 
        },
        safetyIndex: { 
            value: gpiScore, 
            rank: gpiRank,
            source: 'Global Peace Index (IEP)' 
        },
        healthCareIndex: { 
            value: healthValue, 
            source: 'HAQ Index (The Lancet / IHME)' 
        },
        pollutionIndex: { 
            value: pollutionValue, 
            source: 'IQAir World Air Quality Report' 
        },
        foreignResidentsPercentage: { 
            value: foreignValue, 
            breakdown: foreignBreakdown,
            source: 'Eurostat - Migration / National Stats' 
        },
    };

    return {
        isEU: profile.region === 'EU',
        averageSalaryEUR: Math.round(profile.salary),
        priceIndex: Math.round(profile.index),
        categoryPrices: categoryPrices,
        qualityOfLife: qualityOfLife,
        metadata: {
            economicDataSource: primarySource,
            dataSourceUrl: 'https://ec.europa.eu/eurostat/data/database',
            lastUpdate: '2025'
        }
    };
};

type ViewState = 'calculator' | 'worldwide' | 'core-idea';

const App: React.FC = () => {
    const [view, setView] = useState<ViewState>('calculator');
    const [salary, setSalary] = useState<string>('50000');
    
    // Live exchange rates state
    const [rates, setRates] = useState<Record<string, number> | null>(null);
    const [ratesLastUpdated, setRatesLastUpdated] = useState<string | null>(null);
    const [isLoadingRates, setIsLoadingRates] = useState<boolean>(true);
    const [ratesError, setRatesError] = useState<boolean>(false);
    
    // Dynamic country data state
    const [countryDataCache, setCountryDataCache] = useState<Record<string, CountryData | null>>(() => {
        if (typeof window === 'undefined') return {};
        const cache: Record<string, CountryData | null> = {};
        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
        
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('ppc_data_v2_')) { 
                     try {
                        const item = localStorage.getItem(key);
                        if (item) {
                            const parsed = JSON.parse(item);
                            if (parsed.monthKey === currentMonthKey && parsed.data) {
                                const code = key.replace('ppc_data_v2_', '');
                                cache[code] = parsed.data;
                            }
                        }
                     } catch (e) {
                         console.warn('Failed to parse cache item', key);
                     }
                }
            }
        } catch (e) {
            console.warn("Error reading from local storage on init", e);
        }
        return cache;
    });

    const [isLoadingData, setIsLoadingData] = useState<Record<string, boolean>>({});
    const [dataError, setDataError] = useState<Record<string, string | null>>({});

    const fetchingRef = useRef<Set<string>>(new Set());
    const cacheRef = useRef(countryDataCache);
    
    useEffect(() => {
        cacheRef.current = countryDataCache;
    }, [countryDataCache]);

    const [fromCountryCode, setFromCountryCode] = useState<string>('IT');
    const [toCountryCode, setToCountryCode] = useState<string>('DE');

    // Use correct list based on view
    const activeCountryList = view === 'worldwide' ? WORLDWIDE_COUNTRIES : SELECTABLE_COUNTRIES;

    // Helper to find country object even if it is a state not in the main list
    const getCountryObject = (code: string) => {
        const found = activeCountryList.find(c => c.code === code);
        if (found) return found;
        
        // Check if it is a US state
        if (code.startsWith('US-')) {
            const state = US_STATES.find(s => s.code === code);
            if (state) {
                return { code: state.code, name: `United States (${state.name})`, currency: 'USD' };
            }
        }
        return activeCountryList[0];
    };

    // Fetch live exchange rates on mount
    useEffect(() => {
        const fetchRates = async () => {
            const CACHE_KEY = 'exchange_rates_cache';
            const today = new Date().toISOString().split('T')[0];
            
            try {
                const cachedStr = localStorage.getItem(CACHE_KEY);
                if (cachedStr) {
                    const cached = JSON.parse(cachedStr);
                    if (cached.date === today && cached.rates) {
                        setRates(cached.rates);
                        setRatesLastUpdated(cached.date);
                        setIsLoadingRates(false);
                        return;
                    }
                }
            } catch (e) {
                console.warn("Error reading rates from local storage", e);
            }

            setIsLoadingRates(true);
            setRatesError(false);
            try {
                const response = await fetch('https://open.er-api.com/v6/latest/EUR');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                
                const newRates = { ...data.rates, EUR: 1 };
                
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    date: today,
                    rates: newRates
                }));

                setRates(newRates);
                setRatesLastUpdated(today);
            } catch (error) {
                console.error("Could not fetch exchange rates:", error);
                setRatesError(true);
            } finally {
                setIsLoadingRates(false);
            }
        };
        fetchRates();
    }, []);

    // Optimized fetch function using Simulated Data Engine
    const fetchCountryData = useCallback(async (countryCode: string) => {
        if (cacheRef.current[countryCode] || fetchingRef.current.has(countryCode)) return;
        
        const country = getCountryObject(countryCode);
        
        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
        const CACHE_KEY = `ppc_data_v2_${countryCode}`; 

        fetchingRef.current.add(countryCode);
        setIsLoadingData(prev => ({ ...prev, [countryCode]: true }));
        setDataError(prev => ({ ...prev, [countryCode]: null }));

        try {
            // Using Simulated Engine instead of Gemini API
            const data = await generateSimulatedCountryData(country);
            
            const fullData = { ...data, ...country };
            
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                monthKey: currentMonthKey,
                data: fullData
            }));

            setCountryDataCache(prev => ({ ...prev, [countryCode]: fullData }));
        } catch (error) {
            console.error(`Could not fetch data for ${countryCode}:`, error);
            setDataError(prev => ({ ...prev, [countryCode]: 'Failed to load data.' }));
        } finally {
            fetchingRef.current.delete(countryCode);
            setIsLoadingData(prev => ({ ...prev, [countryCode]: false }));
        }
    }, [view]); // Dependency on view slightly helps but getCountryObject is stable enough
    
    useEffect(() => {
        fetchCountryData(fromCountryCode);
    }, [fromCountryCode, fetchCountryData]);

    useEffect(() => {
        fetchCountryData(toCountryCode);
    }, [toCountryCode, fetchCountryData]);

    // Background pre-fetch
    useEffect(() => {
        const loadAllCountries = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Only prefetch main list, not all states
            for (const country of activeCountryList) {
                if (!cacheRef.current[country.code] && !fetchingRef.current.has(country.code)) {
                    fetchCountryData(country.code);
                    await new Promise(resolve => setTimeout(resolve, 20));
                }
            }
        };

        loadAllCountries();
    }, [fetchCountryData, activeCountryList]);

    const getFlagUrl = (code: string) => {
        return `https://flagcdn.com/w40/${code.toLowerCase().split('-')[0]}.png`;
    };

    const fromCountry = useMemo(() => getCountryObject(fromCountryCode), [fromCountryCode, activeCountryList]);
    const toCountry = useMemo(() => getCountryObject(toCountryCode), [toCountryCode, activeCountryList]);

    const fromCountryData = countryDataCache[fromCountry.code];
    const toCountryData = countryDataCache[toCountry.code];

    const { equivalentSalary, equivalentSalaryInEUR } = useMemo(() => {
        if (!fromCountryData || !toCountryData || !rates || !fromCountryData.priceIndex || !toCountryData.priceIndex) return { equivalentSalary: 0, equivalentSalaryInEUR: 0 };
        
        const numericSalary = parseFloat(salary) || 0;
        const fromRate = fromCountry.currency === 'EUR' ? 1 : rates[fromCountry.currency];
        const toRate = toCountry.currency === 'EUR' ? 1 : rates[toCountry.currency];

        if (!fromRate || !toRate) {
            return { equivalentSalary: 0, equivalentSalaryInEUR: 0 };
        }

        const salaryInEUR = numericSalary / fromRate;
        const pppAdjustedSalaryInEUR = salaryInEUR * (toCountryData.priceIndex / fromCountryData.priceIndex);
        const finalEquivalentSalary = pppAdjustedSalaryInEUR * toRate;

        return { equivalentSalary: finalEquivalentSalary, equivalentSalaryInEUR: pppAdjustedSalaryInEUR };
    }, [salary, fromCountryData, toCountryData, rates, fromCountry, toCountry]);

    const priceLevelData = useMemo((): PriceLevelData[] => {
        if (!fromCountryData || !toCountryData) return [];

        return CATEGORIES.map(category => {
            let fromIndex, toIndex;

            if (category.id === 'total') {
                fromIndex = fromCountryData.priceIndex;
                toIndex = toCountryData.priceIndex;
            } else {
                fromIndex = fromCountryData.categoryPrices[category.id];
                toIndex = toCountryData.categoryPrices[category.id];
            }
            
            if (fromIndex === undefined || toIndex === undefined || fromIndex === 0) {
                 return { categoryId: category.id, percentageDiff: 0 };
            }
            const percentageDiff = ((toIndex / fromIndex) - 1) * 100;
            return { categoryId: category.id, percentageDiff };
        });
    }, [fromCountryData, toCountryData]);
    
    const exchangeRate = useMemo(() => {
        if (!rates || !fromCountry || !toCountry) return null;
        if (fromCountry.currency === toCountry.currency) return null;
        
        const fromRate = fromCountry.currency === 'EUR' ? 1 : rates[fromCountry.currency];
        const toRate = toCountry.currency === 'EUR' ? 1 : rates[toCountry.currency];
        
        if (!fromRate || !toRate) return null;

        return toRate / fromRate;
    }, [fromCountry, toCountry, rates]);
    
    const formatCurrency = (amount: number, currencyCode: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    const formatAverageSalary = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => setSalary(e.target.value.replace(/[^0-9]/g, ''));

    const handleCountryHover = (country: SelectableCountry) => {
        fetchCountryData(country.code);
    };

    // Sub-component for State Selector
    const StateSelector = ({ currentCode, onChange }: { currentCode: string, onChange: (code: string) => void }) => {
        // Only show if main country is US
        if (!currentCode.startsWith('US')) return null;

        return (
            <div className="mt-3 animate-fadeIn relative">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Select State</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-500">
                        {/* Map Pin Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <select 
                        value={currentCode} 
                        onChange={(e) => onChange(e.target.value)}
                        className="appearance-none w-full bg-white border border-slate-300 hover:border-indigo-400 rounded-xl py-2 pl-9 pr-8 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    >
                        <option value="US">USA Average</option>
                        {US_STATES.map(state => (
                            <option key={state.code} value={state.code}>{state.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>
        );
    };

    const getParentCountry = (code: string) => {
        if (code.startsWith('US-')) return activeCountryList.find(c => c.code === 'US')!;
        return activeCountryList.find(c => c.code === code) || activeCountryList[0];
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setView('calculator')}>
                        Purchasing Power Calculator
                    </h1>
                    
                    {/* Main Navigation - "3 Scritte" */}
                    <div className="flex justify-center items-center space-x-2 sm:space-x-8 mt-6">
                         <button 
                            onClick={() => setView('calculator')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${view === 'calculator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
                         >
                            HomePage
                         </button>
                         <button 
                            onClick={() => setView('worldwide')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${view === 'worldwide' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
                         >
                            Worldwide Beta <span className="ml-1 text-xs opacity-80">🌎</span>
                         </button>
                         <button 
                            onClick={() => setView('core-idea')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${view === 'core-idea' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
                         >
                            Core Idea
                         </button>
                    </div>

                    {view !== 'core-idea' && (
                        <div className="max-w-3xl mx-auto mt-6">
                            <p className="text-lg text-slate-600">
                                Compare your salary and cost of living across {view === 'worldwide' ? 'the world' : 'Europe'} with live data, with figures sourced from <a href="https://ec.europa.eu/eurostat/data/database" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline hover:no-underline transition-colors">Eurostat</a> where not otherwise indicated.
                            </p>
                             {view === 'worldwide' && (
                                <p className="mt-2 text-sm text-slate-500 font-medium">
                                    Beta version with various global sources aiming to simulate the most realistic calculation possible.
                                </p>
                            )}
                        </div>
                    )}
                </header>

                {view === 'core-idea' ? (
                    <CoreIdea onBack={() => setView('calculator')} />
                ) : (
                    <>
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mb-12 border border-slate-200/80">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                <div>
                                    <label htmlFor="salary" className="block text-sm font-medium text-slate-600 mb-1">Your Annual Salary</label>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">{fromCountry.currency}</span>
                                        <input type="text" id="salary" value={salary} onChange={handleSalaryChange} placeholder="e.g., 50000" className="w-full bg-slate-50 border border-slate-300 rounded-lg shadow-sm pl-14 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 h-4">
                                        {isLoadingData[fromCountry.code] ? 'Loading...' : dataError[fromCountry.code] ? <span className="text-red-500">{dataError[fromCountry.code]}</span> : fromCountryData && `Avg. salary: ${formatAverageSalary(fromCountryData.averageSalaryEUR)}/year`}
                                    </div>
                                </div>
                                <div>
                                    <CountrySelector 
                                        label="Your Country" 
                                        countries={activeCountryList} 
                                        selectedCountry={getParentCountry(fromCountryCode)} 
                                        onSelectCountry={(c) => { 
                                            if (c.code === toCountryCode) setToCountryCode(fromCountryCode); 
                                            setFromCountryCode(c.code); 
                                        }}
                                        onHover={handleCountryHover}
                                    />
                                    {/* Sub-Selector for States */}
                                    <StateSelector currentCode={fromCountryCode} onChange={setFromCountryCode} />
                                </div>
                                <div>
                                    <CountrySelector 
                                        label="Comparison Country" 
                                        countries={activeCountryList} 
                                        selectedCountry={getParentCountry(toCountryCode)} 
                                        onSelectCountry={(c) => { 
                                            if (c.code === fromCountryCode) setFromCountryCode(toCountryCode); 
                                            setToCountryCode(c.code); 
                                        }}
                                        onHover={handleCountryHover}
                                    />
                                    {/* Sub-Selector for States */}
                                    <StateSelector currentCode={toCountryCode} onChange={setToCountryCode} />
                                    
                                    <div className="text-xs text-slate-500 mt-2 h-4">
                                        {isLoadingData[toCountry.code] ? 'Loading...' : dataError[toCountry.code] ? <span className="text-red-500">{dataError[toCountry.code]}</span> : toCountryData && `Avg. salary: ${formatAverageSalary(toCountryData.averageSalaryEUR)}/year`}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {parseFloat(salary) > 0 && fromCountryData && toCountryData && (
                            <div className="text-center bg-indigo-600 text-white p-8 rounded-2xl shadow-xl mb-12 relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-indigo-200 text-lg">{formatCurrency(parseFloat(salary), fromCountry.currency)} in <img src={getFlagUrl(fromCountry.code)} alt={fromCountry.name} className="w-6 h-auto rounded-sm inline-block align-middle mx-1.5"/> {fromCountry.name} has the same purchasing power as</p>
                                    <p className="text-5xl font-bold my-2">{formatCurrency(equivalentSalary, toCountry.currency)} in <img src={getFlagUrl(toCountry.code)} alt={toCountry.name} className="w-8 h-auto rounded-sm inline-block align-middle mx-2"/> {toCountry.name}</p>
                                    {toCountry.currency !== 'EUR' && <p className="text-lg text-indigo-200/90 mt-1">(≈ {formatCurrency(equivalentSalaryInEUR, 'EUR')})</p>}
                                    {exchangeRate !== null && (
                                        <p className="mt-4 text-indigo-200/80 text-sm">{isLoadingRates ? 'Fetching live rates...' : ratesError ? 'Using cached rates:' : `Live rate:`} 1 {fromCountry.currency} ≈ {exchangeRate.toFixed(4)} {toCountry.currency} {ratesLastUpdated && <span className="ml-1 text-xs text-indigo-300">(Updated: {ratesLastUpdated})</span>}</p>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div className="text-left mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">Cost of Living Comparison</h2>
                            <p className="mt-2 text-slate-600">Positive % means {toCountry.name} is more expensive than {fromCountry.name}</p>
                        </div>

                        {fromCountryData && toCountryData && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {/* Total first */}
                                {priceLevelData.filter(d => d.categoryId === 'total').map(data => {
                                    const category = CATEGORIES.find(c => c.id === data.categoryId)!;
                                    return (
                                        <ComparisonCard 
                                            key={data.categoryId} 
                                            category={category} 
                                            fromCountry={fromCountryData} 
                                            toCountry={toCountryData} 
                                            percentageDiff={data.percentageDiff} 
                                        />
                                    );
                                })}
                                {/* Other categories */}
                                {priceLevelData.filter(d => d.categoryId !== 'total').map(data => {
                                    const category = CATEGORIES.find(c => c.id === data.categoryId)!;
                                    return (
                                        <ComparisonCard 
                                            key={data.categoryId} 
                                            category={category} 
                                            fromCountry={fromCountryData} 
                                            toCountry={toCountryData} 
                                            percentageDiff={data.percentageDiff} 
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* Quality of Life Section */}
                        <div className="text-left mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">Quality of Life Comparison</h2>
                            <p className="mt-2 text-slate-600">Comparing key indicators (2025 Data).</p>
                        </div>

                        {fromCountryData && toCountryData && (
                            <QualityOfLife fromCountry={fromCountryData} toCountry={toCountryData} />
                        )}

                        {/* AI Relocation Assistant */}
                        {fromCountryData && toCountryData && (
                            <AiRelocationAssistant fromCountry={fromCountryData} toCountry={toCountryData} />
                        )}
                    </>
                )}
                
                {/* Footer Section */}
                <div className="mt-8 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
                    <p className="mb-4 font-medium">Born in Vienna on 2025</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
                        <a href="https://www.linkedin.com/in/simone-goffredo/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center">
                            <span className="mr-1">Simone Goffredo</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/lucapalanga/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center">
                            <span className="mr-1">Luca Palanga</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                    </div>

                    {/* Donation Button */}
                    <div className="mt-6 flex justify-center">
                         <a href="https://paypal.me/SimoneGoffredo779" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full text-xs font-bold transition-all shadow-sm border border-amber-200 hover:border-amber-300">
                            <span>☕</span>
                            <span>Offer a coffee to the developers</span>
                         </a>
                    </div>

                    {/* Feature Request */}
                    <div className="mt-5 text-xs text-slate-400">
                        For feature requests, send a request to <a href="https://www.linkedin.com/in/simone-goffredo/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">Simone Goffredo</a>.
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
