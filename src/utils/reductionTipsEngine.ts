import { CalculationResult } from '../types';

export interface SmartReductionTip {
  id: string;
  rank: number;
  category: 'Transport' | 'Energy' | 'Diet & Agriculture' | 'Waste & Circularity' | 'Digital';
  title: string;
  priority: 'High Priority' | 'Medium Priority' | 'Quick Win';
  impactPercentage: number; // Share of the user's total carbon
  estimatedReductionKg: number;
  estimatedSavingsINR: number;
  roiMonths: string;
  tacticalAction: string;
  scientificReasoning: string;
}

/**
 * Intelligent prioritization engine that inspects the user's specific calculation
 * breakdown and generates ranked, contextual emission reduction advice.
 */
export function generatePrioritizedTips(calculation: CalculationResult): SmartReductionTip[] {
  const { breakdown, totalAnnualKgCO2e } = calculation;
  const safeTotal = Math.max(1, totalAnnualKgCO2e);

  // Calculate percentage weight of each category in the user's actual footprint
  const shares = {
    transport: (breakdown.transport / safeTotal) * 100,
    energy: (breakdown.energy / safeTotal) * 100,
    diet: (breakdown.diet / safeTotal) * 100,
    goodsAndWaste: (breakdown.goodsAndWaste / safeTotal) * 100,
    digital: (breakdown.digital / safeTotal) * 100,
  };

  const pool: SmartReductionTip[] = [];

  // Transport interventions
  if (breakdown.transport > 800) {
    pool.push({
      id: 'tip-transport-transit',
      rank: 1,
      category: 'Transport',
      title: 'Electrify Commute & Shift 2 Days to Metro/Rail',
      priority: 'High Priority',
      impactPercentage: Math.round(shares.transport),
      estimatedReductionKg: Math.round(breakdown.transport * 0.42),
      estimatedSavingsINR: Math.round(breakdown.transport * 0.42 * 22),
      roiMonths: 'Immediate',
      tacticalAction: 'Replacing solo ICE commutes with electric 2-wheelers or rapid rail transit removes ~8.89 kg CO₂ per gallon saved.',
      scientificReasoning: 'ICE automobiles suffer 75-80% thermal energy losses in urban traffic. Electrified or shared transit reduces per-passenger emissions by up to 78%.',
    });
  }

  // Energy interventions
  if (breakdown.energy > 600) {
    pool.push({
      id: 'tip-energy-solar-bipv',
      rank: 2,
      category: 'Energy',
      title: 'Rooftop Solar PV & Inverter Heat Pump',
      priority: 'High Priority',
      impactPercentage: Math.round(shares.energy),
      estimatedReductionKg: Math.round(breakdown.energy * 0.65),
      estimatedSavingsINR: Math.round(breakdown.energy * 0.65 * 12),
      roiMonths: '3.5–4 years',
      tacticalAction: 'Install grid-tied rooftop solar (3–5 kWp). Net-metering offsets the 0.82 kg/kWh thermal grid factor.',
      scientificReasoning: 'Central coal/gas generation loses substantial power over long transmission. Local rooftop solar generates zero-marginal-cost renewable power during peak daytime hours.',
    });

    pool.push({
      id: 'tip-energy-thermostat',
      rank: 4,
      category: 'Energy',
      title: 'Programmable HVAC Inverter & 24°C Comfort Setting',
      priority: 'Quick Win',
      impactPercentage: Math.round(shares.energy * 0.3),
      estimatedReductionKg: Math.round(breakdown.energy * 0.22),
      estimatedSavingsINR: Math.round(breakdown.energy * 0.22 * 10),
      roiMonths: 'Immediate',
      tacticalAction: 'Setting cooling to 24°C instead of 20°C reduces compressor work by ~6% per degree Celsius in hot-humid climates.',
      scientificReasoning: 'Each degree higher indoor setpoint drastically reduces refrigeration cycle enthalpy load without compromising dehumidification.',
    });
  }

  // Diet & Food Waste interventions
  if (breakdown.diet > 600) {
    pool.push({
      id: 'tip-diet-plant-rich',
      rank: 3,
      category: 'Diet & Agriculture',
      title: 'Plant-Forward Dietary Shift (3+ Days/Week)',
      priority: 'Medium Priority',
      impactPercentage: Math.round(shares.diet),
      estimatedReductionKg: Math.round(breakdown.diet * 0.38),
      estimatedSavingsINR: Math.round(breakdown.diet * 0.38 * 16),
      roiMonths: 'Immediate',
      tacticalAction: 'Replace high-trophic ruminant animal protein with legumes, millets, and pulses to slash upstream agricultural land use.',
      scientificReasoning: 'Ruminant livestock entails severe enteric methane emissions and 10:1 feed-to-protein conversion ratios compared to direct crop consumption.',
    });
  }

  // Waste & Goods interventions
  if (breakdown.goodsAndWaste > 300) {
    pool.push({
      id: 'tip-waste-compost',
      rank: 5,
      category: 'Waste & Circularity',
      title: 'Zero-Organics Landfill Diversion & Home Composting',
      priority: 'Quick Win',
      impactPercentage: Math.round(shares.goodsAndWaste),
      estimatedReductionKg: Math.round(breakdown.goodsAndWaste * 0.45),
      estimatedSavingsINR: Math.round(breakdown.goodsAndWaste * 0.45 * 8),
      roiMonths: '1 month',
      tacticalAction: 'Divert kitchen scraps into decentralized anaerobic or aerobic bin composting to prevent methane fermentation at municipal dumps.',
      scientificReasoning: 'Organic waste buried in municipal dumps undergoes anaerobic digestion producing fugitive CH₄ (28x more potent than CO₂ over 100 years).',
    });
  }

  // Digital efficiency
  if (breakdown.digital > 100) {
    pool.push({
      id: 'tip-digital-cooling',
      rank: 6,
      category: 'Digital',
      title: 'Green Cloud Computing & Low-Power Standby',
      priority: 'Quick Win',
      impactPercentage: Math.round(shares.digital),
      estimatedReductionKg: Math.round(breakdown.digital * 0.35),
      estimatedSavingsINR: Math.round(breakdown.digital * 0.35 * 6),
      roiMonths: 'Immediate',
      tacticalAction: 'Power down vampire appliances via smart strips and host cloud compute in 100% renewable-matched regions.',
      scientificReasoning: 'Idle standby power accounts for up to 8–10% of residential electric baseload with zero functional utility.',
    });
  }

  // Sort by highest potential emissions reduction (biggest impact areas)
  pool.sort((a, b) => b.estimatedReductionKg - a.estimatedReductionKg);

  // Assign clean rank numbers
  return pool.map((tip, idx) => ({
    ...tip,
    rank: idx + 1,
  }));
}
