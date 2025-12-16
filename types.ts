
// Fix: Import React to resolve 'Cannot find namespace "React"' error for React.ReactNode type.
import React from 'react';

export interface QualityOfLifeData {
  value: number;
  source: string;
  rank?: number;
  breakdown?: {
    eu: number;
    nonEu: number;
  };
}

export interface QualityOfLife {
  employmentRate: QualityOfLifeData;
  lifeExpectancy: QualityOfLifeData;
  safetyIndex: QualityOfLifeData;
  healthCareIndex: QualityOfLifeData;
  pollutionIndex: QualityOfLifeData;
  foreignResidentsPercentage: QualityOfLifeData;
}

export interface SelectableCountry {
  code: string;
  name: string;
  currency: string;
}

export interface CountryData {
  code: string;
  name: string;
  currency: string;
  isEU: boolean;
  priceIndex: number;
  averageSalaryEUR: number;
  qualityOfLife: QualityOfLife;
  categoryPrices: Record<string, number>;
  metadata: {
    economicDataSource: string;
    dataSourceUrl?: string;
    lastUpdate: string;
  };
}


export interface ComparisonCategory {
  id: string;
  name:string;
  icon: React.ReactNode;
}

export interface PriceLevelData {
  categoryId: string;
  percentageDiff: number;
}
