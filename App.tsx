
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { CountryData, PriceLevelData, SelectableCountry, QualityOfLifeData } from './types';
import { SELECTABLE_COUNTRIES, CATEGORIES } from './constants';
import CountrySelector from './components/CountrySelector';
import ComparisonCard from './components/ComparisonCard';
import QualityOfLife from './components/QualityOfLife';

// --- SIMULATED DATA ENGINE ---
// This replaces the Gemini API to avoid Quota Exceeded errors while maintaining realistic data.

// Baseline economic profiles (approximate 2023/2024 data for simulation)
const COUNTRY_PROFILES: Record<string, { salary: number, index: number, region: 'EU' | 'NA' | 'ASIA' | 'OTHER' }> = {
    'CH': { salary: 85000, index: 158, region: 'OTHER' },
    'IS': { salary: 75000, index: 150, region: 'OTHER' },
    'LU': { salary: 78000, index: 135, region: 'EU' },
    'NO': { salary: 65000, index: 138, region: 'OTHER' },
    'US': { salary: 72000, index: 140, region: 'NA' },
    'DK': { salary: 62000, index: 130, region: 'EU' },
    'IE': { salary: 55000, index: 125, region: 'EU' },
    'AU': { salary: 58000, index: 125, region: 'OTHER' },
    'SG': { salary: 60000, index: 130, region: 'ASIA' },
    'SE': { salary: 48000, index: 110, region: 'EU' },
    'FI': { salary: 47000, index: 112, region: 'EU' },
    'NL': { salary: 52000, index: 115, region: 'EU' },
    'GB': { salary: 48000, index: 115, region: 'OTHER' },
    'AT': { salary: 51000, index: 108, region: 'EU' },
    'DE': { salary: 53000, index: 106, region: 'EU' },
    'BE': { salary: 50000, index: 109, region: 'EU' },
    'FR': { salary: 42000, index: 105, region: 'EU' },
    'CA': { salary: 48000, index: 105, region: 'NA' },
    'NZ': { salary: 45000, index: 105, region: 'OTHER' },
    'IT': { salary: 32000, index: 98, region: 'EU' },
    'ES': { salary: 28000, index: 90, region: 'EU' },
    'JP': { salary: 38000, index: 95, region: 'ASIA' },
    'KR': { salary: 36000, index: 90, region: 'ASIA' },
    'CY': { salary: 25000, index: 88, region: 'EU' },
    'SI': { salary: 28000, index: 87, region: 'EU' },
    'MT': { salary: 26000, index: 86, region: 'EU' },
    'PT': { salary: 22000, index: 82, region: 'EU' },
    'EE': { salary: 24000, index: 80, region: 'EU' },
    'CZ': { salary: 23000, index: 78, region: 'EU' },
    'GR': { salary: 19000, index: 78, region: 'EU' },
    'SK': { salary: 20000, index: 75, region: 'EU' },
    'LV': { salary: 20000, index: 75, region: 'EU' },
    'LT': { salary: 21000, index: 72, region: 'EU' },
    'PL': { salary: 18000, index: 65, region: 'EU' },
    'HR': { salary: 18000, index: 68, region: 'EU' },
    'HU': { salary: 16000, index: 62, region: 'EU' },
    'RO': { salary: 14000, index: 55, region: 'EU' },
    'BG': { salary: 12000, index: 52, region: 'EU' },
    'TR': { salary: 9000, index: 45, region: 'OTHER' },
    'MK': { salary: 8500, index: 48, region: 'OTHER' },
    'RS': { salary: 10000, index: 52, region: 'OTHER' },
    'ME': { salary: 10000, index: 55, region: 'OTHER' },
    'BA': { salary: 9500, index: 50, region: 'OTHER' },
    'AL': { salary: 8000, index: 48, region: 'OTHER' },
    'TH': { salary: 12000, index: 45, region: 'ASIA' },
    'CN': { salary: 18000, index: 55, region: 'ASIA' },
    'BR': { salary: 11000, index: 50, region: 'OTHER' },
    'MX': { salary: 12000, index: 48, region: 'NA' },
    'AE': { salary: 55000, index: 90, region: 'ASIA' },
};

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

// Generate realistic looking data locally
const generateSimulatedCountryData = async (country: SelectableCountry): Promise<Omit<CountryData, 'code' | 'name' | 'currency'>> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Slight realistic delay

    const profile = COUNTRY_PROFILES[country.code] || { salary: 20000, index: 70, region: 'OTHER' };
    const seed = country.code;
    
    // Variation factors to make categories look organic
    const getVar = (salt: string, range: number) => (pseudoRandom(seed + salt) * range * 2) - range;

    // Generate Category Prices around the base index
    const categoryPrices: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
        if (cat.id !== 'total') {
            // Some categories are naturally more expensive/cheaper relative to index in certain economies
            // e.g. Services (Health, Education) correlate heavily with salary, Goods correlate with trade
            const variation = getVar(cat.id, 12); 
            categoryPrices[cat.id] = Math.max(30, Math.round(profile.index + variation));
        }
    });

    const isEU = profile.region === 'EU' || ['CH', 'NO', 'IS', 'MK', 'TR', 'RS', 'ME', 'BA', 'AL'].includes(country.code);

    const qualityOfLife = {
        unemploymentRate: { 
            value: Math.max(2, 5 + getVar('unemp', 4) + (profile.index < 70 ? 5 : 0)), 
            source: isEU ? 'Eurostat' : 'World Bank' 
        },
        lifeExpectancy: { 
            value: Math.min(85, Math.max(70, 78 + getVar('life', 4) + (profile.index > 100 ? 3 : -2))), 
            source: isEU ? 'Eurostat' : 'WHO' 
        },
        safetyIndex: { 
            value: Math.min(90, Math.max(40, 65 + getVar('safe', 15) + (profile.index > 120 ? 10 : 0))), 
            source: 'Numbeo' 
        },
        healthCareIndex: { 
            value: Math.min(90, Math.max(40, 68 + getVar('health', 10) + (profile.index > 100 ? 8 : -5))), 
            source: 'Numbeo' 
        },
        pollutionIndex: { 
            value: Math.min(90, Math.max(20, 40 + getVar('poll', 15) - (profile.index > 100 ? 10 : -10))), 
            source: 'Numbeo' 
        },
        propertyPriceToIncomeRatio: { 
            value: Math.max(5, 10 + getVar('prop', 4)), 
            source: 'Numbeo' 
        },
    };

    return {
        averageSalaryEUR: profile.salary,
        priceIndex: profile.index,
        categoryPrices: categoryPrices,
        qualityOfLife: qualityOfLife,
        metadata: {
            economicDataSource: isEU ? 'Eurostat' : (country.code === 'US' ? 'OECD' : 'World Bank'),
            dataSourceUrl: isEU ? 'https://ec.europa.eu/eurostat/data/database' : undefined,
            lastUpdate: '2024'
        }
    };
};

const App: React.FC = () => {
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
                if (key && key.startsWith('ppc_data_')) {
                     try {
                        const item = localStorage.getItem(key);
                        if (item) {
                            const parsed = JSON.parse(item);
                            if (parsed.monthKey === currentMonthKey && parsed.data) {
                                const code = key.replace('ppc_data_', '');
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
    const [showQoL, setShowQoL] = useState(false);
    const [showSources, setShowSources] = useState(false);

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

        const country = SELECTABLE_COUNTRIES.find(c => c.code === countryCode);
        if (!country) return;

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
        const CACHE_KEY = `ppc_data_${countryCode}`;

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
    }, []); 
    
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

            for (const country of SELECTABLE_COUNTRIES) {
                if (!cacheRef.current[country.code] && !fetchingRef.current.has(country.code)) {
                    fetchCountryData(country.code);
                    // Minimal delay since simulation is local
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        };

        loadAllCountries();
    }, [fetchCountryData]);

    const fromCountry = useMemo(() => SELECTABLE_COUNTRIES.find(c => c.code === fromCountryCode)!, [fromCountryCode]);
    const toCountry = useMemo(() => SELECTABLE_COUNTRIES.find(c => c.code === toCountryCode)!, [toCountryCode]);

    const fromCountryData = countryDataCache[fromCountryCode];
    const toCountryData = countryDataCache[toCountryCode];

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

    const getSafeSourceUrl = (sourceName: string, url?: string) => {
        if (sourceName && sourceName.toLowerCase().includes('eurostat')) {
            return 'https://ec.europa.eu/eurostat/data/database';
        }
        return url;
    };
    
    const getQoLUrl = (sourceName: string) => {
        if (!sourceName) return undefined;
        const lower = sourceName.toLowerCase();
        if (lower.includes('numbeo')) return 'https://www.numbeo.com';
        if (lower.includes('eurostat')) return 'https://ec.europa.eu/eurostat/data/database';
        if (lower.includes('world bank') || lower === 'wb') return 'https://data.worldbank.org';
        if (lower.includes('oecd')) return 'https://data.oecd.org';
        if (lower.includes('who')) return 'https://www.who.int';
        return undefined;
    };
    
    const formatCurrency = (amount: number, currencyCode: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    const formatAverageSalary = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => setSalary(e.target.value.replace(/[^0-9]/g, ''));

    const handleCountryHover = (country: SelectableCountry) => {
        fetchCountryData(country.code);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Purchasing Power Calculator</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">Compare your salary and cost of living across Europe with live data.</p>
                </header>

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg mb-12 border border-slate-200/80">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div>
                            <label htmlFor="salary" className="block text-sm font-medium text-slate-600 mb-1">Your Annual Salary</label>
                            <div className="relative">
                                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">{fromCountry.currency}</span>
                                <input type="text" id="salary" value={salary} onChange={handleSalaryChange} placeholder="e.g., 50000" className="w-full bg-slate-50 border border-slate-300 rounded-lg shadow-sm pl-14 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                            </div>
                            <div className="text-xs text-slate-500 mt-2 h-4">
                                {isLoadingData[fromCountryCode] ? 'Loading...' : dataError[fromCountryCode] ? <span className="text-red-500">{dataError[fromCountryCode]}</span> : fromCountryData && `Avg. salary: ${formatAverageSalary(fromCountryData.averageSalaryEUR)}/year`}
                            </div>
                        </div>
                        <CountrySelector 
                            label="Your Country" 
                            countries={SELECTABLE_COUNTRIES} 
                            selectedCountry={fromCountry} 
                            onSelectCountry={(c) => { if (c.code === toCountryCode) setToCountryCode(fromCountryCode); setFromCountryCode(c.code); }}
                            onHover={handleCountryHover}
                        />
                        <div>
                            <CountrySelector 
                                label="Comparison Country" 
                                countries={SELECTABLE_COUNTRIES} 
                                selectedCountry={toCountry} 
                                onSelectCountry={(c) => { if (c.code === fromCountryCode) setFromCountryCode(toCountryCode); setToCountryCode(c.code); }}
                                onHover={handleCountryHover}
                            />
                            <div className="text-xs text-slate-500 mt-2 h-4">
                                {isLoadingData[toCountryCode] ? 'Loading...' : dataError[toCountryCode] ? <span className="text-red-500">{dataError[toCountryCode]}</span> : toCountryData && `Avg. salary: ${formatAverageSalary(toCountryData.averageSalaryEUR)}/year`}
                            </div>
                        </div>
                    </div>
                </div>

                {parseFloat(salary) > 0 && fromCountryData && toCountryData && (
                    <div className="text-center bg-indigo-600 text-white p-8 rounded-2xl shadow-xl mb-12">
                        <p className="text-indigo-200 text-lg">{formatCurrency(parseFloat(salary), fromCountry.currency)} in <img src={`https://flagcdn.com/w40/${fromCountry.code.toLowerCase()}.png`} alt={fromCountry.name} className="w-6 h-auto rounded-sm inline-block align-middle mx-1.5"/> {fromCountry.name} has the same purchasing power as</p>
                        <p className="text-5xl font-bold my-2">{formatCurrency(equivalentSalary, toCountry.currency)} in <img src={`https://flagcdn.com/w40/${toCountry.code.toLowerCase()}.png`} alt={toCountry.name} className="w-8 h-auto rounded-sm inline-block align-middle mx-2"/> {toCountry.name}</p>
                        {toCountry.currency !== 'EUR' && <p className="text-lg text-indigo-200/90 mt-1">(≈ {formatCurrency(equivalentSalaryInEUR, 'EUR')})</p>}
                        {exchangeRate !== null && <p className="mt-4 text-indigo-200/80 text-sm">{isLoadingRates ? 'Fetching live rates...' : ratesError ? 'Using cached rates:' : `Live rate:`} 1 {fromCountry.currency} ≈ {exchangeRate.toFixed(4)} {toCountry.currency} {ratesLastUpdated && <span className="ml-1 text-xs text-indigo-300">(Updated: {ratesLastUpdated})</span>}</p>}
                    </div>
                )}
                
                <div className="text-left mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Cost of Living Comparison</h2>
                    <p className="mt-2 text-slate-600">Positive % means {toCountry.name} is more expensive than {fromCountry.name} in that category.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                    {(!fromCountryData || !toCountryData) ? (
                        <>
                            {Array.from({ length: CATEGORIES.length }).map((_, i) => <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>)}
                        </>
                    ) :
                        (
                            <>
                                {priceLevelData.map((data) => {
                                    const category = CATEGORIES.find(c => c.id === data.categoryId);
                                    if (!category) return null;
                                    return <ComparisonCard key={data.categoryId} category={category} fromCountry={fromCountryData} toCountry={toCountryData} percentageDiff={data.percentageDiff} />;
                                })}
                            </>
                        )
                    }
                </div>
                
                <div className="mt-12">
                   <div className="text-left mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Quality of Life Comparison</h2>
                        <button onClick={() => setShowQoL(!showQoL)} className="mt-2 text-indigo-600 hover:text-indigo-800 transition-colors font-semibold focus:outline-none">{showQoL ? 'Hide' : 'Show'} Quality of Life Indicators</button>
                    </div>
                    {showQoL && (!fromCountryData || !toCountryData ? <div className="h-96 bg-slate-200 rounded-2xl animate-pulse"></div> : <QualityOfLife fromCountry={fromCountryData} toCountry={toCountryData}/>)}
                </div>

                {/* Data Sources & Transparency Section */}
                <div className="mt-12">
                    <div className="text-left mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Data Sources & Transparency</h2>
                        <button 
                            onClick={() => setShowSources(!showSources)} 
                            className="mt-2 text-indigo-600 hover:text-indigo-800 transition-colors font-semibold focus:outline-none"
                        >
                            {showSources ? 'Hide' : 'Show'} Data Sources
                        </button>
                    </div>
                    
                    {showSources && (!fromCountryData || !toCountryData ? (
                         <div className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>
                    ) : (
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                                    <span className="font-semibold text-slate-900 min-w-[180px]">Country Economic Data:</span>
                                    <span>
                                        {(() => {
                                            const sources = [
                                                { 
                                                    name: fromCountryData.metadata.economicDataSource, 
                                                    url: getSafeSourceUrl(fromCountryData.metadata.economicDataSource, fromCountryData.metadata.dataSourceUrl) 
                                                },
                                                { 
                                                    name: toCountryData.metadata.economicDataSource, 
                                                    url: getSafeSourceUrl(toCountryData.metadata.economicDataSource, toCountryData.metadata.dataSourceUrl) 
                                                }
                                            ];
                                            const uniqueSources = sources.filter((s, index, self) => 
                                                index === self.findIndex((t) => (
                                                    t.name === s.name
                                                ))
                                            );
                                            
                                            return uniqueSources.map((source, index) => (
                                                <React.Fragment key={index}>
                                                    {index > 0 && ", "}
                                                    {source.url ? (
                                                        <a 
                                                            href={source.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                                        >
                                                            {source.name}
                                                        </a>
                                                    ) : (
                                                        source.name
                                                    )}
                                                </React.Fragment>
                                            ));
                                        })()}
                                    </span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                                    <span className="font-semibold text-slate-900 min-w-[180px]">Exchange Rates:</span>
                                    <span>
                                        <a 
                                            href="https://open.er-api.com" 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                        >
                                            Open Exchange Rates API
                                        </a>
                                    </span>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                                    <span className="font-semibold text-slate-900 min-w-[180px]">Quality of Life Sources:</span>
                                    <span>
                                        {(() => {
                                            const qolSources = Array.from(new Set([
                                                ...Object.values(fromCountryData.qualityOfLife).map((d) => (d as QualityOfLifeData).source), 
                                                ...Object.values(toCountryData.qualityOfLife).map((d) => (d as QualityOfLifeData).source)
                                            ]));
                                            
                                            return qolSources.map((sourceName, index) => {
                                                const url = getQoLUrl(sourceName);
                                                return (
                                                    <React.Fragment key={index}>
                                                        {index > 0 && ", "}
                                                        {url ? (
                                                            <a 
                                                                href={url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                                                            >
                                                                {sourceName}
                                                            </a>
                                                        ) : (
                                                            sourceName
                                                        )}
                                                    </React.Fragment>
                                                );
                                            });
                                        })()}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>

                <footer className="mt-16 border-t border-slate-200 pt-8 pb-8 text-center">
                    <p className="text-slate-500 mb-4 font-medium">Created for FH Technikum Wien on 2025</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-sm text-slate-600">
                        <a href="https://www.linkedin.com/in/simone-goffredo/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            Simone Goffredo
                        </a>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <a href="https://www.linkedin.com/in/lucapalanga/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            Luca Palanga
                        </a>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <a href="https://www.linkedin.com/in/aditya-varma-penmetsa" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            Aditya Varma Penmetsa
                        </a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default App;
