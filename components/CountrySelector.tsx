
import React, { useState, useRef, useEffect } from 'react';
import type { SelectableCountry } from '../types.ts';

interface CountrySelectorProps {
  countries: SelectableCountry[];
  selectedCountry: SelectableCountry;
  onSelectCountry: (country: SelectableCountry) => void;
  label: string;
  onHover?: (country: SelectableCountry) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ countries, selectedCountry, onSelectCountry, label, onHover }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
        // Small timeout to ensure render is complete
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 50);
    } else {
        // Reset search when closed
        setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelect = (country: SelectableCountry) => {
    onSelectCountry(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getFlagUrl = (code: string) => {
    const countryCode = code.split('-')[0].toLowerCase();
    return `https://flagcdn.com/w40/${countryCode}.png`;
  };

  // Filter countries based on search
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <button
        type="button"
        className="relative w-full bg-white border border-slate-300 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <img src={getFlagUrl(selectedCountry.code)} alt={`${selectedCountry.name} flag`} className="w-6 h-auto rounded-sm shadow-sm" />
          <span className="ml-3 block truncate text-slate-800">{selectedCountry.name}</span>
        </span>
        <span className="absolute top-1/2 right-0 -translate-y-1/2 pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-20 max-h-80 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-100 sticky top-0 bg-white z-10">
            <input
                ref={searchInputRef}
                type="text"
                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking input
            />
          </div>

          <ul className="py-1 overflow-auto flex-1">
            {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                    <li
                        key={country.code}
                        className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                        onClick={() => handleSelect(country)}
                        onMouseEnter={() => onHover && onHover(country)}
                    >
                        <div className="flex items-center">
                            <img src={getFlagUrl(country.code)} alt={`${country.name} flag`} className="w-6 h-auto rounded-sm shadow-sm" />
                            <span className="font-normal ml-3 block truncate">{country.name}</span>
                            {selectedCountry.code === country.code && (
                                <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                        </div>
                    </li>
                ))
            ) : (
                <li className="py-4 text-center text-sm text-gray-500">
                    No results found
                </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
