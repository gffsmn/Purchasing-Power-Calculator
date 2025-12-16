
import React from 'react';
import type { ComparisonCategory, CountryData } from '../types.ts';

interface ComparisonCardProps {
    category: ComparisonCategory;
    fromCountry: CountryData;
    toCountry: CountryData;
    percentageDiff: number;
}

const ComparisonCard: React.FC<ComparisonCardProps> = ({ category, percentageDiff }) => {
    const isMoreExpensive = percentageDiff > 0;
    const isTotal = category.id === 'total';
    
    const colorClass = isMoreExpensive ? 'text-red-600' : 'text-green-600';

    // Base classes for all cards
    // If it is TOTAL, we use a thicker border and slightly larger padding
    const baseContainerClass = `rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between space-x-4 ${isTotal ? 'border-[3px] p-5' : 'border p-4'}`;
    
    // Dynamic classes based on props
    let dynamicContainerClass = '';
    if (isTotal) {
        dynamicContainerClass = isMoreExpensive 
            ? 'bg-red-100 border-red-500 shadow-md' 
            : 'bg-green-100 border-green-500 shadow-md';
    } else {
        dynamicContainerClass = isMoreExpensive 
            ? 'bg-red-50/50 border-red-200/50' 
            : 'bg-green-50/50 border-green-200/50';
    }

    const categoryNameClass = isTotal ? "font-bold text-slate-900 text-lg" : "font-semibold text-slate-800";
    const percentageClass = `font-bold ${colorClass} ${isTotal ? 'text-2xl' : 'text-xl'}`;
    
    return (
        <div className={`${baseContainerClass} ${dynamicContainerClass}`}>
            <div className="flex items-center space-x-4 flex-1">
                <div className={`${isTotal ? 'bg-white/80 p-4' : 'bg-white p-3'} rounded-lg shadow-sm flex-shrink-0`}>
                    {category.icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className={`${categoryNameClass} leading-tight`}>{category.name}</p>
                </div>
            </div>
            <div className={`${percentageClass} flex-shrink-0 ml-2`}>
                {percentageDiff > 0 ? `+${percentageDiff.toFixed(1)}%` : `${percentageDiff.toFixed(1)}%`}
            </div>
        </div>
    );
};

export default ComparisonCard;
