// Fix: Import React to resolve 'Cannot find namespace "React"' error for React.ReactNode type.
import React from 'react';

export interface QualityOfLifeData {
  value: number;
  source: string;
}

export interface QualityOfLife {
  unemploymentRate: QualityOfLifeData;
  lifeExpectancy: QualityOfLifeData;
  safetyIndex: QualityOfLifeData;
  healthCareIndex: QualityOfLifeData;
  pollutionIndex: QualityOfLifeData;
  propertyPriceToIncomeRatio: QualityOfLifeData;
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