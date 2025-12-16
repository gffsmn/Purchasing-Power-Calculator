
import React, { useEffect, useState } from 'react';

interface ExchangeRateChartProps {
    fromCurrency: string;
    toCurrency: string;
}

const ExchangeRateChart: React.FC<ExchangeRateChartProps> = ({ fromCurrency, toCurrency }) => {
    const [history, setHistory] = useState<{ date: string; rate: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (fromCurrency === toCurrency) {
            setHistory([]);
            return;
        }

        const fetchHistory = async () => {
            setLoading(true);
            setError(false);
            
            // Calculate date range for the last 12 months
            const endDate = new Date();
            const startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 1);
            
            const formatDate = (d: Date) => d.toISOString().split('T')[0];
            const endStr = formatDate(endDate);
            const startStr = formatDate(startDate);

            try {
                // Frankfurter API is a free, open-source API for current and historical exchange rates published by the ECB.
                // It does not support all currencies (e.g. ALL, BAM, MKD, RSD might fail).
                const res = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${fromCurrency}&to=${toCurrency}`);
                
                if (!res.ok) {
                    // Silent fail for unsupported currencies
                    throw new Error('API Error or Currency Not Supported');
                }
                
                const data = await res.json();
                
                if (!data.rates) throw new Error('No data');

                // Transform data { "2024-01-01": { "USD": 1.1 } } -> Array
                const points = Object.entries(data.rates).map(([date, rates]: [string, any]) => ({
                    date,
                    rate: rates[toCurrency]
                }));
                
                setHistory(points);
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [fromCurrency, toCurrency]);

    if (fromCurrency === toCurrency) return null;
    if (loading) return <div className="text-xs text-indigo-200 mt-4 text-center animate-pulse">Loading historical trend...</div>;
    if (error || history.length < 2) return null;

    // SVG Graph Calculation
    const width = 100;
    const height = 30;
    const padding = 2;

    const minRate = Math.min(...history.map(d => d.rate));
    const maxRate = Math.max(...history.map(d => d.rate));
    const range = maxRate - minRate || 1;

    // Generate Polyline
    const points = history.map((d, i) => {
        const x = padding + (i / (history.length - 1)) * (width - 2 * padding);
        const y = height - padding - ((d.rate - minRate) / range) * (height - 2 * padding);
        return `${x},${y}`;
    }).join(' ');

    const startRate = history[0].rate;
    const endRate = history[history.length - 1].rate;
    const change = ((endRate - startRate) / startRate) * 100;
    const isPositive = change >= 0;

    return (
        <div className="mt-6 pt-4 border-t border-indigo-500/30">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-medium text-indigo-200">1 Year Trend</span>
                <span className={`text-xs font-bold ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
                    {isPositive ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
                </span>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-12 overflow-visible">
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Area under curve */}
                <polygon 
                    points={`${padding},${height} ${points} ${width-padding},${height}`} 
                    fill="url(#chartGradient)" 
                />
                
                {/* Line */}
                <polyline
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1.5"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <div className="flex justify-between text-[10px] text-indigo-300/60 mt-1 font-mono">
                <span>{history[0].date}</span>
                <span>{history[history.length - 1].date}</span>
            </div>
        </div>
    );
};

export default ExchangeRateChart;
