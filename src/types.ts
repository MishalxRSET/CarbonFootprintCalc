export type PageTab = 'overview' | 'solutions' | 'calculator' | 'planner' | 'drive_save' | 'designdoc';

export interface ScopeEmissions {
  scope1: number; // Direct emissions (fuel, vehicle)
  scope2: number; // Indirect emissions from purchased energy
  scope3: number; // Supply chain, travel, waste, consumption
}

export interface EmissionInputs {
  // Energy (Scope 2 & 1) - Calibrated for Indian Households
  electricityKwhPerMonth: number;
  naturalGasThermPerMonth: number; // In India: Monthly domestic cooking gas (LPG 14.2kg cylinders / PNG SCM)
  cleanEnergyPercentage: number;
  
  // Transport (Scope 1 & 3) - Metric (km & km/L)
  gasolineCarMilesPerWeek: number; // In India: Weekly commute distance in km
  carFuelEfficiencyMpg: number; // In India: Fuel economy in km/L (kilometres per litre / mileage)
  publicTransitMilesPerWeek: number; // In India: Weekly Metro/Rail/Bus transit in km
  shortHaulFlightsPerYear: number; // Domestic flights within India (< 2.5 hrs)
  longHaulFlightsPerYear: number; // International flights (> 3 hrs)
  
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
  carKmEquivalent?: number;
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
  targetScope?: string;
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
