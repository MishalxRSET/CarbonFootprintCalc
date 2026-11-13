export type PageTab = 'overview' | 'kochi_simulation' | 'persepolis_citadel' | 'solutions' | 'calculator' | 'planner' | 'drive_findings' | 'designdoc';

export interface ScopeEmissions {
  scope1: number; // Direct emissions (fuel, vehicle)
  scope2: number; // Indirect emissions from purchased energy
  scope3: number; // Supply chain, travel, waste, consumption
}

export interface EmissionInputs {
  // Energy (Scope 2 & 1)
  electricityKwhPerMonth: number;
  naturalGasThermPerMonth: number;
  cleanEnergyPercentage: number;
  
  // Transport (Scope 1 & 3)
  gasolineCarMilesPerWeek: number;
  carFuelEfficiencyMpg: number;
  publicTransitMilesPerWeek: number;
  shortHaulFlightsPerYear: number;
  longHaulFlightsPerYear: number;
  
  // Lifestyle & Consumption (Scope 3)
  dietType: 'heavy_meat' | 'medium_meat' | 'pescatarian' | 'vegetarian' | 'vegan';
  foodWastePercentage: number; // 0 - 50%
  clothingAndGoodsSpendPerMonth: number; // ₹ INR / month
  recycleRatePercentage: number; // 0 - 100%
  
  // Digital & Misc
  cloudStreamingHoursPerDay: number;
}

export interface CalculationResult {
  totalAnnualKgCO2e: number;
  totalAnnualTonnesCO2e: number;
  breakdown: {
    energy: number;
    transport: number;
    diet: number;
    goodsAndWaste: number;
    digital: number;
  };
  scopes: ScopeEmissions;
  treesEquivalentToOffset: number;
  carMilesEquivalent: number;
  nationalAverageBenchmarkTonnes: number;
  globalTargetTonnes: number;
  percentileRank: number;
}

export interface ReductionStrategy {
  id: string;
  category: 'Energy' | 'Transport' | 'Diet & Agriculture' | 'Waste & Circularity' | 'Engineering & Tech';
  title: string;
  description: string;
  potentialReductionKgCO2e: number;
  costEstimate: 'Free' | 'Low (₹)' | 'Moderate (₹₹)' | 'High (₹₹₹)';
  paybackPeriod: string;
  implementationEase: 'Easy' | 'Medium' | 'Complex';
  pros: {
    environmental: string;
    economic: string;
    healthOrSocial: string;
    efficiency: string;
  };
  isSelected?: boolean;
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  size?: string;
  modifiedTime?: string;
  iconLink?: string;
  thumbnailLink?: string;
  owners?: { displayName: string; emailAddress: string }[];
}

export interface PresentationSlideSummary {
  slideNumber: number;
  title: string;
  subtitle: string;
  keyPoints: string[];
  highlightedPros: {
    category: string;
    benefit: string;
    metrics?: string;
  }[];
}

export interface CarbonSolution {
  id: string;
  category: 'Energy & Electrification' | 'Sustainable Mobility' | 'Diet & Agro-Ecology' | 'Circularity & Waste' | 'Built Environment' | 'Carbon Removal';
  title: string;
  problemAddressed: string;
  description: string;
  mechanism: string;
  targetScope: 'Scope 1' | 'Scope 2' | 'Scope 3' | 'Multiple Scopes' | 'Removal';
  abatementKgPerYear: number;
  scaleMultiplierUnit: string;
  costTier: 'No Cost (Free)' | 'Low (<₹10k)' | 'Moderate (₹10k–₹1L)' | 'High (>₹1L)';
  approxInvestmentINR: number;
  annualSavingsINR: number;
  approxInvestmentUSD?: number;
  annualSavingsUSD?: number;
  paybackYears: string;
  implementationEase: 'Immediate / Easy' | 'Moderate' | 'Involved / Complex';
  trlLevel: number;
  pros: {
    environmental: string;
    economic: string;
    healthOrSocial: string;
    efficiency: string;
  };
  implementationSteps: {
    phase: string;
    step: string;
    details: string;
  }[];
  coBenefits: string[];
}
