
import React from 'react';
import type { SelectableCountry, ComparisonCategory } from './types.ts';

// This list includes countries.
// Sorted alphabetically by name.
export const SELECTABLE_COUNTRIES: SelectableCountry[] = [
  // --- EUROSTAT NATIONS (EU, EFTA, Candidates) ---
  { code: 'AL', name: 'Albania', currency: 'ALL' },
  { code: 'AT', name: 'Austria', currency: 'EUR' },
  { code: 'BE', name: 'Belgium', currency: 'EUR' },
  { code: 'BA', name: 'Bosnia and Herzegovina', currency: 'BAM' },
  { code: 'BG', name: 'Bulgaria', currency: 'BGN' },
  { code: 'HR', name: 'Croatia', currency: 'EUR' },
  { code: 'CY', name: 'Cyprus', currency: 'EUR' },
  { code: 'CZ', name: 'Czechia', currency: 'CZK' },
  { code: 'DK', name: 'Denmark', currency: 'DKK' },
  { code: 'EE', name: 'Estonia', currency: 'EUR' },
  { code: 'FI', name: 'Finland', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'GR', name: 'Greece', currency: 'EUR' },
  { code: 'HU', name: 'Hungary', currency: 'HUF' },
  { code: 'IS', name: 'Iceland', currency: 'ISK' },
  { code: 'IE', name: 'Ireland', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'LV', name: 'Latvia', currency: 'EUR' },
  { code: 'LT', name: 'Lithuania', currency: 'EUR' },
  { code: 'LU', name: 'Luxembourg', currency: 'EUR' },
  { code: 'MT', name: 'Malta', currency: 'EUR' },
  { code: 'ME', name: 'Montenegro', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'MK', name: 'North Macedonia', currency: 'MKD' },
  { code: 'NO', name: 'Norway', currency: 'NOK' },
  { code: 'PL', name: 'Poland', currency: 'PLN' },
  { code: 'PT', name: 'Portugal', currency: 'EUR' },
  { code: 'RO', name: 'Romania', currency: 'RON' },
  { code: 'RS', name: 'Serbia', currency: 'RSD' },
  { code: 'SK', name: 'Slovakia', currency: 'EUR' },
  { code: 'SI', name: 'Slovenia', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'TR', name: 'Türkiye', currency: 'TRY' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
].sort((a, b) => a.name.localeCompare(b.name));

// Comprehensive World List for Beta
export const WORLDWIDE_COUNTRIES: SelectableCountry[] = [
    ...SELECTABLE_COUNTRIES,
    { code: 'AR', name: 'Argentina', currency: 'ARS' },
    { code: 'AU', name: 'Australia', currency: 'AUD' },
    { code: 'BR', name: 'Brazil', currency: 'BRL' },
    { code: 'CA', name: 'Canada', currency: 'CAD' },
    { code: 'CN', name: 'China', currency: 'CNY' },
    { code: 'CO', name: 'Colombia', currency: 'COP' },
    { code: 'EG', name: 'Egypt', currency: 'EGP' },
    { code: 'HK', name: 'Hong Kong', currency: 'HKD' },
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'ID', name: 'Indonesia', currency: 'IDR' },
    { code: 'IL', name: 'Israel', currency: 'ILS' },
    { code: 'JP', name: 'Japan', currency: 'JPY' },
    { code: 'MY', name: 'Malaysia', currency: 'MYR' },
    { code: 'MX', name: 'Mexico', currency: 'MXN' },
    { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
    { code: 'PH', name: 'Philippines', currency: 'PHP' },
    { code: 'QA', name: 'Qatar', currency: 'QAR' },
    { code: 'RU', name: 'Russia', currency: 'RUB' },
    { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
    { code: 'SG', name: 'Singapore', currency: 'SGD' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'KR', name: 'South Korea', currency: 'KRW' },
    { code: 'TW', name: 'Taiwan', currency: 'TWD' },
    { code: 'TH', name: 'Thailand', currency: 'THB' },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'VN', name: 'Vietnam', currency: 'VND' },
].sort((a, b) => a.name.localeCompare(b.name));

// US States Data
export const US_STATES = [
    { code: 'US-AL', name: 'Alabama' }, { code: 'US-AK', name: 'Alaska' }, { code: 'US-AZ', name: 'Arizona' },
    { code: 'US-AR', name: 'Arkansas' }, { code: 'US-CA', name: 'California' }, { code: 'US-CO', name: 'Colorado' },
    { code: 'US-CT', name: 'Connecticut' }, { code: 'US-DE', name: 'Delaware' }, { code: 'US-FL', name: 'Florida' },
    { code: 'US-GA', name: 'Georgia' }, { code: 'US-HI', name: 'Hawaii' }, { code: 'US-ID', name: 'Idaho' },
    { code: 'US-IL', name: 'Illinois' }, { code: 'US-IN', name: 'Indiana' }, { code: 'US-IA', name: 'Iowa' },
    { code: 'US-KS', name: 'Kansas' }, { code: 'US-KY', name: 'Kentucky' }, { code: 'US-LA', name: 'Louisiana' },
    { code: 'US-ME', name: 'Maine' }, { code: 'US-MD', name: 'Maryland' }, { code: 'US-MA', name: 'Massachusetts' },
    { code: 'US-MI', name: 'Michigan' }, { code: 'US-MN', name: 'Minnesota' }, { code: 'US-MS', name: 'Mississippi' },
    { code: 'US-MO', name: 'Missouri' }, { code: 'US-MT', name: 'Montana' }, { code: 'US-NE', name: 'Nebraska' },
    { code: 'US-NV', name: 'Nevada' }, { code: 'US-NH', name: 'New Hampshire' }, { code: 'US-NJ', name: 'New Jersey' },
    { code: 'US-NM', name: 'New Mexico' }, { code: 'US-NY', name: 'New York' }, { code: 'US-NC', name: 'North Carolina' },
    { code: 'US-ND', name: 'North Dakota' }, { code: 'US-OH', name: 'Ohio' }, { code: 'US-OK', name: 'Oklahoma' },
    { code: 'US-OR', name: 'Oregon' }, { code: 'US-PA', name: 'Pennsylvania' }, { code: 'US-RI', name: 'Rhode Island' },
    { code: 'US-SC', name: 'South Carolina' }, { code: 'US-SD', name: 'South Dakota' }, { code: 'US-TN', name: 'Tennessee' },
    { code: 'US-TX', name: 'Texas' }, { code: 'US-UT', name: 'Utah' }, { code: 'US-VT', name: 'Vermont' },
    { code: 'US-VA', name: 'Virginia' }, { code: 'US-WA', name: 'Washington' }, { code: 'US-WV', name: 'West Virginia' },
    { code: 'US-WI', name: 'Wisconsin' }, { code: 'US-WY', name: 'Wyoming' }, { code: 'US-DC', name: 'District of Columbia' }
];


export const CATEGORIES: ComparisonCategory[] = [
    { id: 'food', name: 'Food & Non-alcoholic Beverages', icon: <span className="text-3xl">🍽️</span> },
    { id: 'alcohol-beverages', name: 'Alcoholic Beverages & Tobacco', icon: <span className="text-3xl">🍷</span> },
    { id: 'clothing', name: 'Clothing & Footwear', icon: <span className="text-3xl">👕</span> },
    { id: 'housing', name: 'Housing & Utilities', icon: <span className="text-3xl">🏠</span> },
    { id: 'furnishings', name: 'Furnishings & Household Equipment', icon: <span className="text-3xl">🛋️</span> },
    { id: 'health', name: 'Health', icon: <span className="text-3xl">⚕️</span> },
    { id: 'transport', name: 'Transport', icon: <span className="text-3xl">🚆</span> },
    { id: 'communication', name: 'Communication', icon: <span className="text-3xl">📡</span> },
    { id: 'recreation-culture', name: 'Recreation & Culture', icon: <span className="text-3xl">🏖️</span> },
    { id: 'education', name: 'Education', icon: <span className="text-3xl">🎓</span> },
    { id: 'restaurants', name: 'Restaurants & Hotels', icon: <span className="text-3xl">🍜</span> },
    { id: 'total', name: 'TOTAL (All Products)', icon: <span className="text-3xl">🛒</span> },
];

// --- LANGUAGE DATA ---

// Approximate dominant/native language for mapping (Single string for backward compatibility)
export const COUNTRY_LANGUAGES: Record<string, string> = {
    'AL': 'Albanian', 'AT': 'German', 'BE': 'French', 'BA': 'Bosnian', 'BG': 'Bulgarian',
    'HR': 'Croatian', 'CY': 'Greek', 'CZ': 'Czech', 'DK': 'Danish', 'EE': 'Estonian',
    'FI': 'Finnish', 'FR': 'French', 'DE': 'German', 'GR': 'Greek', 'HU': 'Hungarian',
    'IS': 'Icelandic', 'IE': 'English', 'IT': 'Italian', 'LV': 'Latvian', 'LT': 'Lithuanian',
    'LU': 'French', 'MT': 'English', 'ME': 'Montenegrin', 'NL': 'Dutch', 'MK': 'Macedonian',
    'NO': 'Norwegian', 'PL': 'Polish', 'PT': 'Portuguese', 'RO': 'Romanian', 'RS': 'Serbian',
    'SK': 'Slovak', 'SI': 'Slovenian', 'ES': 'Spanish', 'SE': 'Swedish', 'CH': 'German',
    'TR': 'Turkish', 'GB': 'English',
    // Worldwide
    'US': 'English', 'CA': 'English', 'AU': 'English', 'JP': 'Japanese', 'BR': 'Portuguese',
    'CN': 'Chinese', 'IN': 'Hindi', 'RU': 'Russian', 'ZA': 'English', 'MX': 'Spanish',
    'KR': 'Korean', 'SG': 'English', 'AE': 'Arabic', 'IL': 'Hebrew', 'TH': 'Thai',
    'VN': 'Vietnamese', 'ID': 'Indonesian', 'MY': 'Malay', 'PH': 'Filipino', 
    'NZ': 'English', 'AR': 'Spanish', 'CO': 'Spanish', 'EG': 'Arabic', 'HK': 'Cantonese',
    'QA': 'Arabic', 'SA': 'Arabic', 'TW': 'Chinese'
};

// Full list of official/national languages per country for display
export const OFFICIAL_LANGUAGES: Record<string, string[]> = {
    'BE': ['Dutch', 'French', 'German'],
    'CH': ['German', 'French', 'Italian'],
    'CY': ['Greek', 'Turkish'],
    'FI': ['Finnish', 'Swedish'],
    'IE': ['English', 'Irish'],
    'LU': ['French', 'German', 'Luxembourgish'],
    'MT': ['Maltese', 'English'],
    'BA': ['Bosnian', 'Croatian', 'Serbian'],
    // Default single languages for others
    'AL': ['Albanian'], 'AT': ['German'], 'BG': ['Bulgarian'], 'HR': ['Croatian'],
    'CZ': ['Czech'], 'DK': ['Danish'], 'EE': ['Estonian'], 'FR': ['French'],
    'DE': ['German'], 'GR': ['Greek'], 'HU': ['Hungarian'], 'IS': ['Icelandic'],
    'IT': ['Italian'], 'LV': ['Latvian'], 'LT': ['Lithuanian'], 'ME': ['Montenegrin'],
    'NL': ['Dutch'], 'MK': ['Macedonian'], 'NO': ['Norwegian'], 'PL': ['Polish'],
    'PT': ['Portuguese'], 'RO': ['Romanian'], 'RS': ['Serbian'], 'SK': ['Slovak'],
    'SI': ['Slovenian'], 'ES': ['Spanish'], 'SE': ['Swedish'], 'TR': ['Turkish'],
    'GB': ['English'],
    // Worldwide
    'CA': ['English', 'French'], 'US': ['English'], 'AU': ['English'], 'JP': ['Japanese'], 'BR': ['Portuguese'],
    'CN': ['Mandarin'], 'IN': ['Hindi', 'English'], 'RU': ['Russian'], 'ZA': ['English', 'Zulu', 'Xhosa', 'Afrikaans'],
    'MX': ['Spanish'], 'KR': ['Korean'], 'SG': ['English', 'Malay', 'Mandarin', 'Tamil'], 'AE': ['Arabic'],
    'IL': ['Hebrew'], 'TH': ['Thai'], 'VN': ['Vietnamese'], 'ID': ['Indonesian'], 'MY': ['Malay'],
    'PH': ['Filipino', 'English'], 'NZ': ['English', 'Maori'], 'AR': ['Spanish'], 'CO': ['Spanish'],
    'EG': ['Arabic'], 'HK': ['Chinese', 'English'], 'QA': ['Arabic'], 'SA': ['Arabic'], 'TW': ['Mandarin']
};

// Returns a dictionary of { Language: Percentage_Speakers }
export const getCountryLanguageStats = (countryCode: string): Record<string, number> => {
    // Check if US State
    if (countryCode.startsWith('US-')) return { 'English': 100 };

    switch(countryCode) {
        // High Proficiency (Native or >80%)
        case 'GB': return { 'English': 99 };
        case 'IE': return { 'English': 99 };
        case 'MT': return { 'English': 89 };
        case 'NL': return { 'Dutch': 100, 'English': 90, 'German': 71 };
        case 'NO': return { 'Norwegian': 100, 'English': 90, 'German': 20 };
        case 'SE': return { 'Swedish': 100, 'English': 86, 'German': 26 };
        case 'DK': return { 'Danish': 100, 'English': 86, 'German': 47 };
        
        // Good Proficiency (60-80%)
        case 'CY': return { 'Greek': 80, 'Turkish': 20, 'English': 73 };
        case 'AT': return { 'German': 100, 'English': 73 };
        case 'FI': return { 'Finnish': 100, 'English': 70, 'Swedish': 45 };
        
        // Moderate Proficiency (40-60%)
        case 'SI': return { 'Slovenian': 100, 'English': 59, 'German': 48 };
        case 'LU': return { 'French': 98, 'German': 75, 'English': 56 };
        case 'DE': return { 'German': 100, 'English': 56 };
        case 'BE': return { 'French': 40, 'Dutch': 60, 'English': 52 };
        case 'GR': return { 'Greek': 100, 'English': 51 };
        case 'EE': return { 'Estonian': 100, 'English': 50, 'Russian': 30 };
        case 'CH': return { 'German': 63, 'French': 23, 'Italian': 8, 'English': 45 };
        case 'HR': return { 'Croatian': 100, 'English': 49, 'German': 34 };
        case 'LV': return { 'Latvian': 100, 'English': 46, 'Russian': 30 };

        // Lower Proficiency (<40%)
        case 'FR': return { 'French': 100, 'English': 39 };
        case 'PL': return { 'Polish': 100, 'English': 37 };
        case 'IT': return { 'Italian': 100, 'English': 34, 'French': 16 };
        case 'RO': return { 'Romanian': 100, 'English': 31 };
        case 'LT': return { 'Lithuanian': 100, 'English': 30, 'Russian': 60 };
        case 'PT': return { 'Portuguese': 100, 'English': 27 };
        case 'CZ': return { 'Czech': 100, 'English': 27 };
        case 'BG': return { 'Bulgarian': 100, 'English': 25 };
        case 'SK': return { 'Slovak': 100, 'English': 26 };
        case 'ES': return { 'Spanish': 100, 'English': 22 };
        case 'HU': return { 'Hungarian': 100, 'English': 20, 'German': 18 };
        case 'TR': return { 'Turkish': 100, 'English': 17 };
        
        // Candidates / Others (Estimated)
        case 'IS': return { 'Icelandic': 100, 'English': 98 };
        case 'RS': return { 'Serbian': 100, 'English': 40 }; 
        case 'BA': return { 'Bosnian': 100, 'English': 35 };
        case 'MK': return { 'Macedonian': 100, 'English': 35 };
        case 'ME': return { 'Montenegrin': 100, 'English': 35 };
        case 'AL': return { 'Albanian': 100, 'English': 25 }; 
        
        // Worldwide
        case 'US': case 'AU': case 'CA': case 'NZ': case 'GB': return { 'English': 100 };
        case 'SG': return { 'English': 100, 'Mandarin': 35 };
        case 'PH': return { 'Filipino': 100, 'English': 60 };
        case 'ZA': return { 'English': 90, 'Zulu': 22 };
        case 'IN': return { 'Hindi': 43, 'English': 10 };
        case 'JP': return { 'Japanese': 100, 'English': 20 };
        case 'BR': return { 'Portuguese': 100, 'English': 5 };
        case 'CN': return { 'Mandarin': 100, 'English': 1 };
        case 'RU': return { 'Russian': 100, 'English': 5 };
        case 'MX': case 'AR': case 'CO': return { 'Spanish': 100, 'English': 10 };
        case 'AE': case 'QA': case 'SA': case 'EG': return { 'Arabic': 100, 'English': 70 }; // High expat English use

        default:
            return { 
                [COUNTRY_LANGUAGES[countryCode] || 'Local']: 100,
                'English': 35,
                'German': 5,
                'Spanish': 5
            };
    }
};

const getRegion = (code: string) => {
    if (['NO', 'SE', 'DK', 'FI', 'IS'].includes(code)) return 'Nordic';
    if (['DE', 'AT', 'CH', 'LI'].includes(code)) return 'DACH';
    if (['IT', 'ES', 'PT', 'FR', 'GR', 'CY', 'MT'].includes(code)) return 'South';
    return 'Other';
};
