import { EmissionInputs, CalculationResult, ReductionStrategy, PresentationSlideSummary } from '../types';

export const DEFAULT_EMISSION_INPUTS: EmissionInputs = {
  // Energy
  electricityKwhPerMonth: 450,
  naturalGasThermPerMonth: 25,
  cleanEnergyPercentage: 15,

  // Transport
  gasolineCarMilesPerWeek: 120,
  carFuelEfficiencyMpg: 28,
  publicTransitMilesPerWeek: 25,
  shortHaulFlightsPerYear: 2,
  longHaulFlightsPerYear: 1,

  // Lifestyle & Consumption
  dietType: 'medium_meat',
  foodWastePercentage: 20,
  clothingAndGoodsSpendPerMonth: 6500,
  recycleRatePercentage: 40,

  // Digital
  cloudStreamingHoursPerDay: 3.5,
};

/**
 * Calculate annual emissions based on EPA & GHG Protocol emission factors
 */
export function calculateEmissions(inputs: EmissionInputs): CalculationResult {
  // --- Scope 2 & Scope 1: Home Energy ---
  // US grid average factor: ~0.386 kg CO2e per kWh (EPA eGRID)
  const dirtyElectricityFraction = Math.max(0, 1 - inputs.cleanEnergyPercentage / 100);
  const annualElectricityKg = inputs.electricityKwhPerMonth * 12 * 0.386 * dirtyElectricityFraction;

  // Natural gas: ~5.3 kg CO2e per therm (EPA Greenhouse Gas Inventory)
  const annualGasKg = inputs.naturalGasThermPerMonth * 12 * 5.3;
  const totalEnergyKg = annualElectricityKg + annualGasKg;

  // --- Transport (Scope 1 direct vehicle + Scope 3 air & transit) ---
  // Gasoline: ~8.887 kg CO2 per gallon (EPA). Gallons = miles / MPG.
  const gallonsPerWeek = inputs.carFuelEfficiencyMpg > 0 ? inputs.gasolineCarMilesPerWeek / inputs.carFuelEfficiencyMpg : 0;
  const annualCarDirectKg = gallonsPerWeek * 52 * 8.887;

  // Public transit: ~0.089 kg CO2e per passenger-mile (buses/trains)
  const annualTransitKg = inputs.publicTransitMilesPerWeek * 52 * 0.089;

  // Short-haul flight (~600 miles): ~150 kg CO2e per flight
  const shortFlightKg = inputs.shortHaulFlightsPerYear * 150;
  // Long-haul flight (~3500 miles): ~750 kg CO2e per flight with radiative forcing
  const longFlightKg = inputs.longHaulFlightsPerYear * 750;
  const totalTransportKg = annualCarDirectKg + annualTransitKg + shortFlightKg + longFlightKg;

  // --- Diet & Food (Scope 3) ---
  // Baseline annual emissions per diet (Our World in Data & Poore & Nemecek 2018)
  const dietFactorsKg: Record<EmissionInputs['dietType'], number> = {
    heavy_meat: 3300,
    medium_meat: 2500,
    pescatarian: 1900,
    vegetarian: 1700,
    vegan: 1400,
  };
  const baseDietKg = dietFactorsKg[inputs.dietType];
  // Food waste penalty (1% food waste adds ~0.8% emissions due to landfill methane)
  const foodWastePenalty = 1 + (inputs.foodWastePercentage / 100) * 0.4;
  const totalDietKg = baseDietKg * foodWastePenalty;

  // --- Goods, Clothing & Waste (Scope 3) ---
  // Embedded carbon in manufacturing: ~0.0065 kg CO2e per Rupee (₹) spent on consumer merchandise (~6.5 kg / ₹1,000)
  const goodsKg = inputs.clothingAndGoodsSpendPerMonth * 12 * 0.0065;
  // Waste generation & recycling benefit
  const baseWasteKg = 380; // Average annual municipal solid waste footprint
  const recyclingCredit = 1 - (inputs.recycleRatePercentage / 100) * 0.45;
  const totalGoodsAndWasteKg = goodsKg + baseWasteKg * recyclingCredit;

  // --- Digital Footprint (Data centers, networks, display) ---
  // Video streaming + cloud services: ~0.055 kg CO2e per streaming hour (IEA 2023)
  const totalDigitalKg = inputs.cloudStreamingHoursPerDay * 365 * 0.055;

  const totalAnnualKgCO2e = totalEnergyKg + totalTransportKg + totalDietKg + totalGoodsAndWasteKg + totalDigitalKg;
  const totalAnnualTonnesCO2e = Number((totalAnnualKgCO2e / 1000).toFixed(2));

  // Scopes breakdown
  const scope1 = annualGasKg + annualCarDirectKg;
  const scope2 = annualElectricityKg;
  const scope3 = annualTransitKg + shortFlightKg + longFlightKg + totalDietKg + totalGoodsAndWasteKg + totalDigitalKg;

  // Equivalencies
  // 1 mature urban tree absorbs ~21.77 kg CO2e per year
  const treesEquivalentToOffset = Math.round(totalAnnualKgCO2e / 21.77);
  // Average passenger vehicle emits 404 grams CO2/mile (EPA)
  const carMilesEquivalent = Math.round(totalAnnualKgCO2e / 0.404);

  // Benchmarks
  const nationalAverageBenchmarkTonnes = 14.4; // US Average
  const globalTargetTonnes = 2.0; // 2030 Paris Agreement 1.5°C per-capita target

  // Percentile approximation
  const percentileRank = Math.min(
    99,
    Math.max(5, Math.round((totalAnnualTonnesCO2e / nationalAverageBenchmarkTonnes) * 50))
  );

  return {
    totalAnnualKgCO2e: Math.round(totalAnnualKgCO2e),
    totalAnnualTonnesCO2e,
    breakdown: {
      energy: Math.round(totalEnergyKg),
      transport: Math.round(totalTransportKg),
      diet: Math.round(totalDietKg),
      goodsAndWaste: Math.round(totalGoodsAndWasteKg),
      digital: Math.round(totalDigitalKg),
    },
    scopes: {
      scope1: Math.round(scope1),
      scope2: Math.round(scope2),
      scope3: Math.round(scope3),
    },
    treesEquivalentToOffset,
    carMilesEquivalent,
    nationalAverageBenchmarkTonnes,
    globalTargetTonnes,
    percentileRank,
  };
}

/**
 * Reduction Strategies with detailed Pros (Environmental, Economic, Social/Health, Efficiency)
 * Referenced from the research findings & "CARBON FOOTPRINT REDUCTION.pptx"
 */
export const REDUCTION_STRATEGIES: ReductionStrategy[] = [
  {
    id: 'solar_pv_rooftop',
    category: 'Energy',
    title: 'Rooftop Solar PV & Clean Energy Sourcing',
    description: 'Transition home or institutional electricity to residential solar panels or green power tariffs (100% clean grid contracts).',
    potentialReductionKgCO2e: 1850,
    costEstimate: 'Moderate (₹₹)',
    paybackPeriod: '4 - 7 Years',
    implementationEase: 'Medium',
    pros: {
      environmental: 'Directly displaces coal and natural gas generation; saves ~1.85 tonnes CO2e/year with zero localized criteria air pollutants.',
      economic: 'Dramatically shields against escalating utility grid rates, yields net-metering energy credits, and saves ₹40,000–₹65,000 annually.',
      healthOrSocial: 'Mitigates respiratory illnesses from particulate matter (PM2.5) and nitrogen oxides (NOx) produced by thermal power plants.',
      efficiency: 'High modern panel efficiency (21–23%) with decentralized distribution, eliminating transmission and line-loss dissipation.',
    },
  },
  {
    id: 'heat_pump_hvac',
    category: 'Energy',
    title: 'Smart Inverter Heat Pump & Electrification',
    description: 'Replace fossil fuel natural gas boilers and inefficient resistance heating with high-efficiency air-source heat pumps (SEER 20+).',
    potentialReductionKgCO2e: 1200,
    costEstimate: 'Moderate (₹₹)',
    paybackPeriod: '3 - 5 Years',
    implementationEase: 'Medium',
    pros: {
      environmental: 'Delivers 300% to 400% coefficient of performance (COP); reduces heating greenhouse gas emissions by up to 65%.',
      economic: 'Cuts winter space heating bills by 30–50% compared to baseboard and old fuel oil/propane systems.',
      healthOrSocial: 'Completely eliminates indoor carbon monoxide (CO) risk and nitrogen dioxide (NO2) associated with gas combustion appliances.',
      efficiency: 'Transfers thermal heat rather than creating it via combustion, operating with optimal thermodynamic thermodynamic cycle efficiency.',
    },
  },
  {
    id: 'led_smart_controls',
    category: 'Energy',
    title: 'IoT Smart Thermostats & LED Retrofit',
    description: 'Deploy automated setback thermostats (Nest/Ecobee), occupancy sensors, and 100% solid-state LED fixtures.',
    potentialReductionKgCO2e: 450,
    costEstimate: 'Low (₹)',
    paybackPeriod: '< 1 Year',
    implementationEase: 'Easy',
    pros: {
      environmental: 'Reduces passive vampire load and nocturnal electricity waste by 12–18% per household/office.',
      economic: 'Immediate ROI within 6 to 9 months; annual recurring utility bill savings of ₹8,000–₹16,000.',
      healthOrSocial: 'Delivers circadian-friendly lighting spectrums and customized thermal comfort without manual micromanagement.',
      efficiency: 'Solid-state LEDs convert 90% of electricity directly into photons rather than waste thermal heat.',
    },
  },
  {
    id: 'ev_or_hybrid_transition',
    category: 'Transport',
    title: 'Electric Vehicle (EV) or E-Mobility Transition',
    description: 'Switch primary commuting from internal combustion engines (ICE) to electric vehicles, plug-in hybrids, or electric two-wheelers.',
    potentialReductionKgCO2e: 2100,
    costEstimate: 'High (₹₹₹)',
    paybackPeriod: '3 - 6 Years',
    implementationEase: 'Medium',
    pros: {
      environmental: 'Lifetime lifecycle emission reductions of 60–75% compared to gasoline vehicles, even factoring in current grid generation mixes.',
      economic: 'Operating costs per km are roughly 70% cheaper than petrol (₹1.20/km vs ₹6.50/km); virtually zero oil/transmission maintenance.',
      healthOrSocial: 'Zero tailpipe emissions radically improves urban street-level air quality and reduces acoustic noise pollution.',
      efficiency: 'EV electric motors achieve 85–90% wheel efficiency compared to ICE thermodynamic efficiency capped below 25–30%.',
    },
  },
  {
    id: 'multimodal_transit_carpool',
    category: 'Transport',
    title: 'Active Commute, Metro Transit & Carpooling',
    description: 'Substitute 2 solo driving days per week with commuter rail, bus rapid transit (BRT), cycling, or high-occupancy carpooling.',
    potentialReductionKgCO2e: 980,
    costEstimate: 'Free',
    paybackPeriod: 'Immediate',
    implementationEase: 'Easy',
    pros: {
      environmental: 'Cuts per-passenger transportation footprint by 75% compared to single-occupant vehicle commuting.',
      economic: 'Saves between ₹45,000 and ₹95,000 annually on petrol/diesel, parking fees, highway tolls, and vehicular wear-and-tear.',
      healthOrSocial: 'Active cycling/walking satisfies daily cardiovascular exercise targets; reduces traffic congestion stress and urban gridlock.',
      efficiency: 'Optimizes seat utilization factor from typical 1.15 persons/car to high-efficiency mass transport corridors.',
    },
  },
  {
    id: 'plant_rich_dietary_shift',
    category: 'Diet & Agriculture',
    title: 'Plant-Rich & Low-Ruminant Dietary Transition',
    description: 'Reduce beef and lamb consumption by 60% in favor of legumes, nuts, grains, and plant-based protein alternatives.',
    potentialReductionKgCO2e: 1100,
    costEstimate: 'Free',
    paybackPeriod: 'Immediate (Net Savings)',
    implementationEase: 'Easy',
    pros: {
      environmental: 'Substantially curbs enteric methane (CH4, 28x GWP of CO2) and saves ~1,200 m² of tropical deforestation and pasture land.',
      economic: 'Lowers average weekly grocery bills by 15–25% as whole grains and legumes are significantly cheaper than red meats.',
      healthOrSocial: 'Clinically correlated with lower incidence of ischemic heart disease, hypertension, type 2 diabetes, and colorectal cancers.',
      efficiency: 'Bypasses the 10:1 trophic calorie loss in feed-to-meat conversion, allowing direct human consumption of agricultural yield.',
    },
  },
  {
    id: 'food_waste_diversion_compost',
    category: 'Waste & Circularity',
    title: 'Food Waste Prevention & Aerobic Composting',
    description: 'Implement meal planning, strict FIFO pantry management, and divert organic kitchen scraps away from anaerobic municipal landfills.',
    potentialReductionKgCO2e: 420,
    costEstimate: 'Free',
    paybackPeriod: 'Immediate',
    implementationEase: 'Easy',
    pros: {
      environmental: 'Prevents landfill anaerobic decomposition which produces potent fugitive methane gas; produces nutrient-dense soil humus.',
      economic: 'The average household reclaims ₹25,000 to ₹40,000 worth of edible food that is otherwise discarded unconsumed annually.',
      healthOrSocial: 'Supports local community gardens, builds soil microbial biodiversity, and preserves water embedded in food production.',
      efficiency: 'Closes the nutrient loop by recycling essential soil nitrogen, phosphorus, and potassium without synthetic petrochemical fertilizers.',
    },
  },
  {
    id: 'circular_consumption_repair',
    category: 'Waste & Circularity',
    title: 'Circular Apparel, Right-to-Repair & Zero Single-Use',
    description: 'Adopt circular economy practices: thrift apparel, repair electronics, eliminate single-use plastics, and enforce reuse cycles.',
    potentialReductionKgCO2e: 360,
    costEstimate: 'Low (₹)',
    paybackPeriod: 'Immediate',
    implementationEase: 'Easy',
    pros: {
      environmental: 'Mitigates the massive embodied carbon of fast fashion manufacturing, microplastic shedding, and raw mineral extraction.',
      economic: 'Lowers discretionary lifestyle expenditures while preserving durable high-quality goods through repair and maintenance.',
      healthOrSocial: 'Reduces toxic dye effluents in developing nation river systems and combats exploitative labor conditions in fast manufacturing.',
      efficiency: 'Maintains materials at their highest utility and value phase, bypassing energy-intensive extraction and smelting stages.',
    },
  },
];

/**
 * Slide-by-slide synthesis of the findings in "CARBON FOOTPRINT REDUCTION.pptx"
 * Explicitly highlighting the PROS and engineering feasibility requested by user.
 */
export const PRESENTATION_FINDINGS_DATA: PresentationSlideSummary[] = [
  {
    slideNumber: 1,
    title: 'Executive Overview & Problem Statement',
    subtitle: 'CO900G Modules 3 & 4: Atmospheric CO2 Trends & Anthropogenic Drivers',
    keyPoints: [
      'Atmospheric CO2 concentration surpassed 424 ppm in 2024, driving global temperature anomalies above +1.45°C.',
      'Scope 1 direct fossil fuel burning and Scope 2 thermal electricity generation constitute over 70% of organizational and domestic carbon footprints.',
      'Achieving the Paris Climate Accord requires reducing individual per-capita emissions from 14.4 tCO2e to under 2.0 tCO2e by 2030.',
    ],
    highlightedPros: [
      {
        category: 'Climate Stability',
        benefit: 'Prevents irreversible tipping points in Antarctic ice sheet collapse and coral bleaching ecosystems.',
        metrics: 'Limits global warming delta to < 1.5°C threshold',
      },
      {
        category: 'Policy Compliance',
        benefit: 'Ensures compliance with national decarbonization mandates, ESG ratings, and carbon tax mechanisms.',
        metrics: 'Prevents future carbon tax liabilities (₹4,200–₹8,500/tCO2e)',
      },
    ],
  },
  {
    slideNumber: 2,
    title: 'Scope 1, 2, and 3 Emission Factor Dissection',
    subtitle: 'Quantitative Audit Methodology & Standard Calculation Protocols',
    keyPoints: [
      'Scope 1 (Direct): On-site heating fuels, corporate fleets, and refrigeration refrigerant leaks (HFCs).',
      'Scope 2 (Indirect Energy): Purchased electricity from regional grids with thermal-heavy generation profiles.',
      'Scope 3 (Value Chain): Food systems (enteric fermentation + deforestation), air transportation, and manufacturing life-cycle.',
    ],
    highlightedPros: [
      {
        category: 'Audit Precision',
        benefit: 'Pinpoints highest-intensity hotspots rather than relying on guesswork or generic greenwashing claims.',
        metrics: 'Reduces reporting variance from ±35% down to ±4%',
      },
      {
        category: 'Operational Visibility',
        benefit: 'Enables data-driven benchmarking across facilities, campuses, and domestic units.',
        metrics: 'Enables targeted interventions with high ROI',
      },
    ],
  },
  {
    slideNumber: 3,
    title: 'Technological & Renewable Interventions (Pros & ROI)',
    subtitle: 'Solar PV, Heat Pumps, Battery Storage & Microgrid Integration',
    keyPoints: [
      'Solar Photovoltaics levelized cost of energy (LCOE) has plunged 88% over the past decade, making it the cheapest electricity source in history.',
      'Inverter heat pumps deliver high Seasonal Coefficient of Performance (SCOP > 3.8), outperforming gas boilers by a factor of 4.',
      'Smart microgrid load shifting enables peak demand shaving, reducing stress on national grid transformers.',
    ],
    highlightedPros: [
      {
        category: 'Financial Yield',
        benefit: 'Rapid amortization period (3–7 years) with guaranteed 25-year manufacturer panel warranties.',
        metrics: 'IRR of 14–22% on capital investment',
      },
      {
        category: 'Energy Independence',
        benefit: 'Protection against fossil fuel market volatility, geopolitical disruptions, and utility peak pricing.',
        metrics: 'Zero ongoing fuel costs for operational life',
      },
    ],
  },
  {
    slideNumber: 4,
    title: 'Sustainable Mobility & Multimodal Transit (Pros & Impact)',
    subtitle: 'EV Fleet Decarbonization, Micro-Mobility & Transit Corridor Optimization',
    keyPoints: [
      'Electric drivetrains achieve 85%+ thermal efficiency compared to internal combustion engines capped below 28%.',
      'Commuter rail and Bus Rapid Transit (BRT) emit only 35–45g CO2e per passenger-kilometer vs 192g for single-occupancy SUVs.',
      'E-cargo bikes and active transit corridors eliminate last-mile delivery bottlenecks and urban particulate emissions.',
    ],
    highlightedPros: [
      {
        category: 'Urban Air Quality',
        benefit: 'Eliminates carcinogenic nitrogen dioxide (NO2), ground-level ozone precursors, and PM2.5 emissions.',
        metrics: 'Over 40% reduction in urban respiratory morbidity',
      },
      {
        category: 'Macroeconomic Savings',
        benefit: 'Lowers commuter expenses, reduces municipal roadway maintenance expenditures, and frees parking land for green parks.',
        metrics: '₹45,000+ annual savings per commuting worker',
      },
    ],
  },
  {
    slideNumber: 5,
    title: 'Agrifood Systems & Circular Economy (Pros & Biomass)',
    subtitle: 'Ruminant Methane Mitigation, Food Rescue & Composting Thermodynamics',
    keyPoints: [
      'Animal agriculture accounts for 14.5% of anthropogenic GHG emissions; beef emits 60 kg CO2e per kg protein produced.',
      'One third of all food produced is lost or wasted globally, generating 8–10% of total annual emissions.',
      'Aerobic thermophilic composting transforms volatile organics into stable humic matter without fugitive methane emissions.',
    ],
    highlightedPros: [
      {
        category: 'Land & Biodiversity',
        benefit: 'Frees up millions of hectares of agricultural land for rewilding, reforestation, and ecological restoration.',
        metrics: '75% reduction in agricultural land requirements',
      },
      {
        category: 'Public Health Benefit',
        benefit: 'Diets rich in diverse plant whole-foods significantly lower cardiovascular risks and healthcare burdens.',
        metrics: 'Reduced chronic inflammatory disease incidence',
      },
    ],
  },
  {
    slideNumber: 6,
    title: 'Synthesis, Engineering Roadmap & Implementation Plan',
    subtitle: 'Actionable Framework for Educational, Institutional & Residential Campuses',
    keyPoints: [
      'Phase 1 (Months 1–3): Baseline measurement via interactive calculator, quick-win behavioral adjustments and LED upgrades.',
      'Phase 2 (Months 4–12): Energy efficiency retrofits, HVAC heat pump deployment, smart building IoT sensors.',
      'Phase 3 (Years 2–5): On-site renewables, EV charging infrastructure, closed-loop food waste composting, circular procurement.',
    ],
    highlightedPros: [
      {
        category: 'Scalability',
        benefit: 'Modular framework adaptable from single student dormitories up to entire university campuses and city districts.',
        metrics: 'Achieves verified 50% carbon reduction in 3 years',
      },
      {
        category: 'Educational Value',
        benefit: 'Engages engineering students directly in hands-on sustainability data science, sensor telemetry, and environmental stewardship.',
        metrics: 'Directly fulfills CO900G Course Outcomes CO3 & CO4',
      },
    ],
  },
];

/**
 * Quiz questions for interactive sustainability knowledge check
 */
export const SUSTAINABILITY_QUIZ = [
  {
    question: 'Which scope covers indirect greenhouse gas emissions resulting from purchased grid electricity?',
    options: ['Scope 1 (Direct)', 'Scope 2 (Indirect Energy)', 'Scope 3 (Value Chain)', 'Scope 4 (Avoided)'],
    correctIndex: 1,
    explanation: 'Scope 2 emissions are indirect emissions caused by the generation of electricity, steam, heating, or cooling purchased and consumed by the reporting entity.',
  },
  {
    question: 'Why does an air-source heat pump achieve over 300% efficiency (COP > 3)?',
    options: [
      'It burns clean hydrogen gas',
      'It creates heat through high-temperature nuclear reactions',
      'It moves existing thermal energy from ambient air rather than generating heat from fuel combustion',
      'It operates purely on perpetual motion',
    ],
    correctIndex: 2,
    explanation: 'Heat pumps use a thermodynamic vapor-compression cycle to move existing ambient thermal energy into or out of a space, delivering 3 to 4 units of thermal energy per 1 unit of electrical input.',
  },
  {
    question: 'According to the IPCC 1.5°C benchmark, what is the sustainable annual per-capita carbon budget?',
    options: ['~14.4 tonnes CO2e', '~9.2 tonnes CO2e', '~2.0 tonnes CO2e', '~0.1 tonnes CO2e'],
    correctIndex: 2,
    explanation: 'To limit global warming to 1.5°C above pre-industrial levels, global individual emissions must converge toward roughly 2.0 to 2.5 tonnes CO2e/year by 2030.',
  },
];
