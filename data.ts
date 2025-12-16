
// Baseline economic profiles (approximate 2024/2025 data for simulation)
// Index reference: EU Avg ~ 100. US Avg ~ 140.
export const COUNTRY_PROFILES: Record<string, { salary: number, index: number, region: 'EU' | 'OTHER' | 'US' }> = {
    // --- EU / EUROPE ---
    'CH': { salary: 85000, index: 162, region: 'OTHER' }, 
    'IS': { salary: 75000, index: 154, region: 'OTHER' },
    'LU': { salary: 78000, index: 135, region: 'EU' },
    'NO': { salary: 65000, index: 142, region: 'OTHER' },
    'DK': { salary: 64000, index: 132, region: 'EU' },
    'IE': { salary: 58000, index: 128, region: 'EU' },
    'SE': { salary: 49000, index: 112, region: 'EU' },
    'FI': { salary: 48000, index: 114, region: 'EU' },
    'NL': { salary: 54000, index: 118, region: 'EU' },
    'AT': { salary: 52000, index: 110, region: 'EU' },
    'DE': { salary: 54000, index: 108, region: 'EU' },
    'BE': { salary: 51000, index: 111, region: 'EU' },
    'FR': { salary: 44000, index: 107, region: 'EU' },
    'GB': { salary: 47000, index: 116, region: 'OTHER' },
    'IT': { salary: 33000, index: 99, region: 'EU' },
    'ES': { salary: 29000, index: 92, region: 'EU' },
    'CY': { salary: 26000, index: 89, region: 'EU' },
    'SI': { salary: 29000, index: 88, region: 'EU' },
    'MT': { salary: 27000, index: 87, region: 'EU' },
    'PT': { salary: 23000, index: 83, region: 'EU' },
    'EE': { salary: 25000, index: 82, region: 'EU' },
    'CZ': { salary: 24000, index: 80, region: 'EU' },
    'GR': { salary: 20000, index: 79, region: 'EU' },
    'SK': { salary: 21000, index: 77, region: 'EU' },
    'LV': { salary: 21000, index: 77, region: 'EU' },
    'LT': { salary: 22000, index: 74, region: 'EU' },
    'PL': { salary: 19000, index: 68, region: 'EU' },
    'HR': { salary: 19000, index: 70, region: 'EU' },
    'HU': { salary: 17000, index: 65, region: 'EU' },
    'RO': { salary: 15000, index: 58, region: 'EU' },
    'BG': { salary: 13000, index: 55, region: 'EU' },
    'TR': { salary: 9000, index: 48, region: 'OTHER' },
    'MK': { salary: 9000, index: 50, region: 'OTHER' },
    'RS': { salary: 10500, index: 54, region: 'OTHER' },
    'ME': { salary: 10500, index: 57, region: 'OTHER' },
    'BA': { salary: 9800, index: 52, region: 'OTHER' },
    'AL': { salary: 8500, index: 50, region: 'OTHER' },

    // --- USA & STATES (Specific realistic data based on BEA RPP & BLS) ---
    'US': { salary: 70000, index: 140, region: 'US' }, // National Average
    'US-AL': { salary: 55000, index: 120, region: 'US' }, // Alabama (Low cost)
    'US-AK': { salary: 68000, index: 150, region: 'US' }, // Alaska (High cost due to imports)
    'US-AZ': { salary: 62000, index: 138, region: 'US' },
    'US-AR': { salary: 52000, index: 118, region: 'US' }, // Arkansas (Very low cost)
    'US-CA': { salary: 88000, index: 175, region: 'US' }, // California (Very High)
    'US-CO': { salary: 72000, index: 145, region: 'US' },
    'US-CT': { salary: 78000, index: 150, region: 'US' },
    'US-DE': { salary: 68000, index: 135, region: 'US' },
    'US-DC': { salary: 92000, index: 170, region: 'US' }, // DC (High Salaries)
    'US-FL': { salary: 62000, index: 142, region: 'US' }, // Florida (Rising costs)
    'US-GA': { salary: 64000, index: 130, region: 'US' },
    'US-HI': { salary: 65000, index: 185, region: 'US' }, // Hawaii (Highest Cost)
    'US-ID': { salary: 58000, index: 132, region: 'US' },
    'US-IL': { salary: 69000, index: 138, region: 'US' },
    'US-IN': { salary: 56000, index: 122, region: 'US' },
    'US-IA': { salary: 55000, index: 120, region: 'US' },
    'US-KS': { salary: 56000, index: 121, region: 'US' },
    'US-KY': { salary: 54000, index: 120, region: 'US' },
    'US-LA': { salary: 55000, index: 125, region: 'US' },
    'US-ME': { salary: 59000, index: 138, region: 'US' },
    'US-MD': { salary: 76000, index: 152, region: 'US' },
    'US-MA': { salary: 86000, index: 168, region: 'US' }, // Mass (High Tech/Bio)
    'US-MI': { salary: 60000, index: 125, region: 'US' },
    'US-MN': { salary: 66000, index: 135, region: 'US' },
    'US-MS': { salary: 48000, index: 116, region: 'US' }, // Mississippi (Lowest)
    'US-MO': { salary: 57000, index: 122, region: 'US' },
    'US-MT': { salary: 56000, index: 135, region: 'US' },
    'US-NE': { salary: 58000, index: 123, region: 'US' },
    'US-NV': { salary: 61000, index: 136, region: 'US' },
    'US-NH': { salary: 70000, index: 142, region: 'US' },
    'US-NJ': { salary: 80000, index: 158, region: 'US' },
    'US-NM': { salary: 56000, index: 124, region: 'US' },
    'US-NY': { salary: 85000, index: 172, region: 'US' }, // New York
    'US-NC': { salary: 62000, index: 130, region: 'US' },
    'US-ND': { salary: 60000, index: 125, region: 'US' },
    'US-OH': { salary: 58000, index: 122, region: 'US' },
    'US-OK': { salary: 54000, index: 119, region: 'US' },
    'US-OR': { salary: 65000, index: 148, region: 'US' },
    'US-PA': { salary: 64000, index: 134, region: 'US' },
    'US-RI': { salary: 68000, index: 145, region: 'US' },
    'US-SC': { salary: 56000, index: 128, region: 'US' },
    'US-SD': { salary: 57000, index: 122, region: 'US' },
    'US-TN': { salary: 58000, index: 125, region: 'US' },
    'US-TX': { salary: 66000, index: 132, region: 'US' }, // Texas
    'US-UT': { salary: 62000, index: 138, region: 'US' },
    'US-VT': { salary: 61000, index: 140, region: 'US' },
    'US-VA': { salary: 72000, index: 138, region: 'US' },
    'US-WA': { salary: 82000, index: 155, region: 'US' }, // Washington (Tech)
    'US-WV': { salary: 50000, index: 118, region: 'US' },
    'US-WI': { salary: 59000, index: 126, region: 'US' },
    'US-WY': { salary: 62000, index: 128, region: 'US' },

    // --- OTHER WORLDWIDE ---
    'JP': { salary: 42000, index: 105, region: 'OTHER' }, 
    'CA': { salary: 58000, index: 125, region: 'OTHER' }, 
    'AU': { salary: 62000, index: 130, region: 'OTHER' }, 
    'BR': { salary: 16000, index: 65, region: 'OTHER' }, 
    'HK': { salary: 48000, index: 160, region: 'OTHER' }, 
    'SG': { salary: 52000, index: 155, region: 'OTHER' }, 
    'AE': { salary: 50000, index: 125, region: 'OTHER' }, 
    'KR': { salary: 37000, index: 98, region: 'OTHER' }, 
    'CN': { salary: 20000, index: 65, region: 'OTHER' }, 
    'IN': { salary: 9000, index: 38, region: 'OTHER' }, 
    'RU': { salary: 13000, index: 55, region: 'OTHER' }, 
    'ZA': { salary: 16000, index: 58, region: 'OTHER' }, 
    'MX': { salary: 15000, index: 55, region: 'OTHER' },
};

// Real 2024 Employment Rates
export const REAL_EMPLOYMENT_DATA: Record<string, number> = {
    'IS': 85.9, 'NL': 83.5, 'SE': 82.6, 'CH': 81.1, 'EE': 82.1, 'CZ': 81.7, 'DE': 81.1,
    'HU': 80.7, 'MT': 81.3, 'NO': 80.4, 'DK': 80.1, 'GB': 78.0, 'CY': 78.9, 'PT': 78.3,
    'SI': 78.6, 'IE': 78.2, 'FI': 78.2, 'SK': 77.7, 'LT': 77.4, 'AT': 77.3, 'PL': 77.2,
    'BG': 76.2, 'LV': 75.5, 'FR': 74.4, 'BE': 72.1, 'ES': 69.8, 'HR': 68.8, 'RO': 68.7,
    'GR': 67.4, 'IT': 66.3, 'TR': 55.0, 'RS': 65.0, 'ME': 60.0, 'MK': 58.0, 'BA': 50.0,
    'AL': 66.0, 'LU': 75.0,
    // WORLD / STATES (Approximations based on BLS/WorldBank)
    'US': 72.0, 
    'US-ND': 78.0, 'US-UT': 77.0, 'US-NE': 77.5, 'US-SD': 77.0, // High Emp States
    'US-MS': 64.0, 'US-WV': 62.0, 'US-NM': 66.0, // Low Emp States
    'US-CA': 71.0, 'US-NY': 70.0, 'US-TX': 74.0, 'US-FL': 71.5,
    'JP': 77.0, 'CA': 75.0, 'AU': 76.0, 'BR': 65.0,
    'HK': 75.0, 'SG': 80.0, 'AE': 82.0, 'KR': 72.0, 'CN': 70.0, 'IN': 55.0,
};

// Real Life Expectancy Data
export const REAL_LIFE_EXPECTANCY_DATA: Record<string, number> = {
    'CH': 84.2, 'ES': 83.8, 'IT': 83.7, 'IS': 83.4, 'MT': 83.3, 'SE': 83.5, 'NO': 83.3,
    'FR': 83.2, 'CY': 82.9, 'IE': 82.7, 'LU': 83.1, 'NL': 82.1, 'BE': 82.4, 'AT': 82.3,
    'DK': 81.9, 'FI': 82.4, 'PT': 82.3, 'DE': 81.2, 'SI': 81.6, 'GR': 81.8, 'GB': 81.4,
    'CZ': 79.8, 'EE': 78.9, 'HR': 79.2, 'PL': 78.6, 'SK': 78.1, 'TR': 78.6, 'AL': 79.1,
    'HU': 76.9, 'LT': 76.4, 'ME': 77.2, 'RS': 76.3, 'RO': 76.1, 'BG': 75.8, 'LV': 75.9,
    'MK': 76.4, 'BA': 77.6,
    // WORLD / STATES (CDC 2022/2023)
    'US': 77.5, 
    'US-HI': 80.7, 'US-WA': 80.2, 'US-MN': 80.0, 'US-CA': 79.8, 'US-MA': 79.6, 'US-NY': 78.5, // Top
    'US-MS': 71.9, 'US-WV': 72.8, 'US-AL': 73.2, 'US-LA': 73.2, // Bottom
    'JP': 84.6, 'CA': 82.5, 'AU': 83.2, 'BR': 76.0,
    'HK': 85.5, 'SG': 83.1, 'AE': 78.0, 'KR': 83.5, 'CN': 78.0, 'IN': 70.0,
};

// Real 2024 Global Peace Index Data
// For US States: Scaled roughly by Violent Crime Rate (FBI).
// Lower Score = Safer.
export const REAL_GPI_DATA: Record<string, { rank: number, score: number }> = {
    'IS': { rank: 1, score: 1.095 }, 'IE': { rank: 2, score: 1.26 }, 'AT': { rank: 4, score: 1.294 },
    'CH': { rank: 4, score: 1.294 }, 'PT': { rank: 7, score: 1.371 }, 'DK': { rank: 8, score: 1.393 },
    'SI': { rank: 9, score: 1.409 }, 'FI': { rank: 10, score: 1.42 }, 'CZ': { rank: 11, score: 1.435 },
    'NL': { rank: 14, score: 1.491 }, 'BE': { rank: 16, score: 1.492 }, 'HU': { rank: 17, score: 1.5 },
    'HR': { rank: 19, score: 1.519 }, 'DE': { rank: 20, score: 1.533 }, 'LT': { rank: 22, score: 1.558 },
    'LV': { rank: 22, score: 1.558 }, 'EE': { rank: 24, score: 1.559 }, 'ES': { rank: 25, score: 1.578 },
    'SK': { rank: 28, score: 1.609 }, 'BG': { rank: 29, score: 1.61 }, 'GB': { rank: 30, score: 1.634 },
    'NO': { rank: 32, score: 1.644 }, 'IT': { rank: 33, score: 1.662 }, 'ME': { rank: 34, score: 1.685 },
    'SE': { rank: 35, score: 1.709 }, 'PL': { rank: 36, score: 1.713 }, 'RO': { rank: 38, score: 1.721 },
    'GR': { rank: 45, score: 1.764 }, 'MK': { rank: 51, score: 1.799 }, 'AL': { rank: 52, score: 1.812 },
    'BA': { rank: 59, score: 1.895 }, 'RS': { rank: 64, score: 1.914 }, 'CY': { rank: 68, score: 1.933 },
    'FR': { rank: 74, score: 1.967 }, 'TR': { rank: 146, score: 2.852 }, 'LU': { rank: 11, score: 1.4 }, 
    'MT': { rank: 25, score: 1.62 },
    // WORLD / STATES
    'US': { rank: 131, score: 2.44 }, 
    'US-ME': { rank: 90, score: 2.0 }, 'US-NH': { rank: 90, score: 2.0 }, 'US-VT': { rank: 85, score: 1.9 }, // Safe States
    'US-LA': { rank: 145, score: 2.8 }, 'US-MS': { rank: 140, score: 2.7 }, 'US-NM': { rank: 142, score: 2.75 }, // Higher Crime
    'JP': { rank: 15, score: 1.5 }, 'CA': { rank: 11, score: 1.35 }, 'AU': { rank: 22, score: 1.52 }, 'BR': { rank: 132, score: 2.46 },
    'HK': { rank: 18, score: 1.55 }, 'SG': { rank: 6, score: 1.33 }, 'AE': { rank: 40, score: 1.75 }, 'KR': { rank: 43, score: 1.78 },
};

// Real HAQ Index (Healthcare Access and Quality)
export const REAL_HAQ_DATA: Record<string, number> = {
    'IS': 97, 'NO': 97, 'NL': 96, 'CH': 96, 'SE': 96, 'FI': 95, 'IT': 95, 'LU': 95,
    'IE': 94, 'AT': 93, 'DK': 93, 'FR': 92, 'DE': 92, 'ES': 92, 'BE': 91, 'GB': 90,
    'SI': 87, 'MT': 86, 'CZ': 85, 'PT': 85, 'CY': 83, 'EE': 81, 'GR': 81, 'HR': 77,
    'PL': 76, 'SK': 75, 'HU': 74, 'LV': 73, 'LT': 73, 'RO': 70, 'BG': 68, 'TR': 66,
    'RS': 65, 'MK': 64, 'AL': 60, 'ME': 62, 'BA': 58,
    // WORLD / STATES (IHME GBD)
    'US': 88, 
    'US-MA': 94, 'US-CT': 93, 'US-NY': 91, 'US-CA': 90, // Top Health
    'US-MS': 78, 'US-WV': 79, 'US-OK': 80, // Lower Health
    'JP': 94, 'CA': 93, 'AU': 94, 'BR': 65,
    'HK': 91, 'SG': 92, 'AE': 75, 'KR': 90, 'CN': 76, 'IN': 45,
};

// Real PM2.5 Data
export const REAL_PM25_DATA: Record<string, number> = {
    'BA': 27.5, 'MK': 25.2, 'ME': 21.3, 'RS': 24.7, 'TR': 20.3, 'GR': 17.4, 'AL': 16.7,
    'CY': 15.6, 'IT': 15.0, 'HR': 14.8, 'PL': 14.1, 'RO': 13.7, 'SI': 13.1, 'BG': 13.2,
    'CZ': 10.4, 'SK': 10.5, 'HU': 11.2, 'FR': 9.5, 'DE': 9.0, 'BE': 9.4, 'NL': 9.0,
    'AT': 9.4, 'ES': 9.9, 'CH': 8.8, 'LU': 8.5, 'GB': 7.7, 'IE': 7.4, 'DK': 7.4,
    'PT': 6.8, 'SE': 6.6, 'NO': 6.3, 'FI': 5.8, 'EE': 4.7, 'IS': 4.0, 'MT': 12.0,
    'LV': 7.6, 'LT': 8.1,
    // WORLD / STATES
    'US': 8.8, 'US-CA': 12.5, 'US-NY': 7.5, 'US-TX': 9.2, 'US-MT': 4.5,
    'JP': 9.1, 'CA': 4.5, 'AU': 4.2, 'BR': 12.0,
    'HK': 26.0, 'SG': 13.0, 'AE': 35.0, 'KR': 18.0, 'CN': 30.0, 'IN': 50.0,
};

// Real Foreign Residents Percentage Data
export const REAL_FOREIGN_RESIDENTS_DATA: Record<string, { total: number, eu: number, nonEu: number }> = {
    'LU': { total: 47.4, eu: 38.0, nonEu: 9.4 },
    'MT': { total: 25.5, eu: 12.0, nonEu: 13.5 },
    'CH': { total: 26.3, eu: 17.5, nonEu: 8.8 },
    'CY': { total: 19.3, eu: 13.0, nonEu: 6.3 },
    'AT': { total: 18.7, eu: 9.5, nonEu: 9.2 },
    'IS': { total: 19.5, eu: 12.0, nonEu: 7.5 },
    'IE': { total: 14.4, eu: 8.0, nonEu: 6.4 },
    'EE': { total: 14.7, eu: 1.3, nonEu: 13.4 },
    'DE': { total: 14.6, eu: 5.2, nonEu: 9.4 },
    'BE': { total: 13.5, eu: 8.0, nonEu: 5.5 },
    'LV': { total: 13.3, eu: 0.3, nonEu: 13.0 },
    'ES': { total: 12.7, eu: 4.5, nonEu: 8.2 },
    'NO': { total: 12.0, eu: 6.5, nonEu: 5.5 },
    'DK': { total: 10.5, eu: 4.5, nonEu: 6.0 },
    'GB': { total: 10.0, eu: 5.0, nonEu: 5.0 },
    'SE': { total: 10.0, eu: 3.5, nonEu: 6.5 },
    'SI': { total: 9.0, eu: 1.0, nonEu: 8.0 },
    'NL': { total: 8.8, eu: 3.8, nonEu: 5.0 },
    'IT': { total: 8.7, eu: 2.5, nonEu: 6.2 },
    'FR': { total: 8.2, eu: 2.5, nonEu: 5.7 },
    'FI': { total: 7.6, eu: 2.6, nonEu: 5.0 },
    'PT': { total: 7.5, eu: 2.0, nonEu: 5.5 },
    'GR': { total: 7.3, eu: 1.5, nonEu: 5.8 },
    'CZ': { total: 6.8, eu: 2.5, nonEu: 4.3 },
    'HR': { total: 3.5, eu: 1.0, nonEu: 2.5 },
    'SK': { total: 3.0, eu: 1.2, nonEu: 1.8 },
    'LT': { total: 3.0, eu: 0.5, nonEu: 2.5 },
    'PL': { total: 2.5, eu: 0.3, nonEu: 2.2 },
    'HU': { total: 2.4, eu: 1.0, nonEu: 1.4 },
    'TR': { total: 2.0, eu: 0.2, nonEu: 1.8 },
    'BG': { total: 1.6, eu: 0.4, nonEu: 1.2 },
    'RO': { total: 1.1, eu: 0.3, nonEu: 0.8 },
    'MK': { total: 1.5, eu: 0.1, nonEu: 1.4 },
    'RS': { total: 1.0, eu: 0.1, nonEu: 0.9 },
    'BA': { total: 1.0, eu: 0.1, nonEu: 0.9 },
    'AL': { total: 0.5, eu: 0.1, nonEu: 0.4 },
    'ME': { total: 5.0, eu: 1.0, nonEu: 4.0 },
    // WORLD
    'US': { total: 13.5, eu: 1, nonEu: 12.5 },
    'US-CA': { total: 27.0, eu: 2, nonEu: 25.0 },
    'US-FL': { total: 21.0, eu: 2, nonEu: 19.0 },
    'JP': { total: 2.3, eu: 0.1, nonEu: 2.2 },
    'CA': { total: 21.0, eu: 2, nonEu: 19.0 },
    'AU': { total: 29.0, eu: 5, nonEu: 24.0 },
    'BR': { total: 0.5, eu: 0.1, nonEu: 0.4 },
    'HK': { total: 9.5, eu: 1.5, nonEu: 8.0 },
    'SG': { total: 30.0, eu: 5.0, nonEu: 25.0 },
    'AE': { total: 88.0, eu: 10.0, nonEu: 78.0 },
};
