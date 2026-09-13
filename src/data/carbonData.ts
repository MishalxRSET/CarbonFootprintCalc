import { EmissionInputs, CalculationResult, ReductionStrategy, PresentationSlideSummary } from '../types';

export const DEFAULT_EMISSION_INPUTS: EmissionInputs = {
  // Energy (Indian Household Baseline - Bureau of Energy Efficiency / CEA)
  electricityKwhPerMonth: 200, // Typical Indian urban household (~150-250 kWh/mo)
  naturalGasThermPerMonth: 1, // 1 domestic 14.2 kg LPG cylinder per month
  cleanEnergyPercentage: 10,

  // Transport (Metric - km / week and km/L)
  gasolineCarMilesPerWeek: 75, // 75 km/week weekly commute
  carFuelEfficiencyMpg: 16, // 16 km/L fuel mileage (standard petrol car)
  publicTransitMilesPerWeek: 40, // 40 km/week on Metro, Indian Railways, or City Bus
  shortHaulFlightsPerYear: 1, // Domestic flight within India (< 2.5 hrs, e.g. Delhi-Mumbai)
  longHaulFlightsPerYear: 0, // International flight (> 3 hrs)

  // Lifestyle & Consumption (Indian Urban Context)
  dietType: 'vegetarian', // Common Indian lacto-vegetarian baseline
  foodWastePercentage: 15,
  clothingAndGoodsSpendPerMonth: 6000, // ₹6,000 INR / month
  recycleRatePercentage: 45,

  // Digital
  cloudStreamingHoursPerDay: 2.5,
};

/**
 * Calculate annual emissions based on Central Electricity Authority (CEA India),
 * Bureau of Energy Efficiency (BEE), and GHG Protocol standards.
 */
export function calculateEmissions(inputs: EmissionInputs): CalculationResult {
  // --- Scope 2 & Scope 1: Home Energy ---
  // India National Grid Average Factor: ~0.716 kg CO2e per kWh (Central Electricity Authority - CEA User Guide)
  const dirtyElectricityFraction = Math.max(0, 1 - inputs.cleanEnergyPercentage / 100);
  const annualElectricityKg = inputs.electricityKwhPerMonth * 12 * 0.716 * dirtyElectricityFraction;

  // Domestic Cooking Gas in India: 1 domestic 14.2 kg LPG cylinder = ~42.4 kg CO2e (or PNG at ~1.9 kg CO2/SCM)
  // Input represents LPG Cylinders/month
  const annualGasKg = inputs.naturalGasThermPerMonth * 12 * 42.4;
  const totalEnergyKg = annualElectricityKg + annualGasKg;

  // --- Transport (Scope 1 direct vehicle + Scope 3 air & transit in India) ---
  // In India: Distance in km/week, efficiency in km/L.
  // 1 litre of Petrol in India = ~2.31 kg CO2e (MoEFCC & GHG Protocol emission factor)
  const litresPerWeek = inputs.carFuelEfficiencyMpg > 0 ? inputs.gasolineCarMilesPerWeek / inputs.carFuelEfficiencyMpg : 0;
  const annualCarDirectKg = litresPerWeek * 52 * 2.31;

  // Public transit: Metro rail, electrified Indian Railways, and city CNG/electric buses
  // Weighted emission factor: ~0.048 kg CO2e per passenger-km
  const annualTransitKg = inputs.publicTransitMilesPerWeek * 52 * 0.048;

  // Domestic short-haul flight in India (~1,000–1,200 km, e.g. Delhi-Bengaluru/Mumbai): ~140 kg CO2e per flight
  const shortFlightKg = inputs.shortHaulFlightsPerYear * 140;
  // International long-haul flight (> 3 hours): ~750 kg CO2e per flight with radiative forcing
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
  // Waste generation & recycling benefit (Indian municipal solid waste baseline)
  const baseWasteKg = 240; // Average annual municipal solid waste footprint per capita in urban India
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

  // Equivalencies for India
  // 1 mature native tree (Neem, Peepal, Banyan) absorbs ~21.77 kg CO2e per year
  const treesEquivalentToOffset = Math.round(totalAnnualKgCO2e / 21.77);
  // Average Indian passenger petrol car (e.g. Maruti/Hyundai) emits ~140 grams CO2/km (0.14 kg CO2/km)
  const carKmEquivalent = Math.round(totalAnnualKgCO2e / 0.14);
  const carMilesEquivalent = carKmEquivalent;

  // Benchmarks for India & Paris Agreement
  const nationalAverageBenchmarkTonnes = 2.1; // India National Per-Capita Average (MoEFCC / CEA / IEA)
  const globalTargetTonnes = 2.0; // 2030 Paris Agreement 1.5°C per-capita target

  // Percentile approximation against Indian population distribution
  // Median urban Indian is ~2.1t; low rural is ~1.2t; affluent high-consumption is 5-8t+
  const percentileRank = Math.min(
    99,
    Math.max(5, Math.round((totalAnnualTonnesCO2e / (nationalAverageBenchmarkTonnes * 2.5)) * 50))
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
    carKmEquivalent,
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
    description: 'Transition residential or facility electricity to rooftop photovoltaic solar panels paired with high-efficiency inverters or 100% clean grid contracts.',
    potentialReductionKgCO2e: 1850,
    costEstimate: 'Moderate (₹₹)',
    targetScope: 'Scope 2',
    paybackPeriod: '4.4 Years',
    implementationEase: 'Medium',
    pros: {
      environmental: 'Displaces marginal thermal coal generation; saves ~1.85 tonnes CO2e/year with zero localized criteria air pollutants.',
      economic: 'Dramatically shields against escalating utility tariffs, yields net-metering energy credits, and saves ₹40,000–₹65,000 annually.',
      healthOrSocial: 'Mitigates respiratory illnesses from particulate matter (PM2.5) and nitrogen oxides (NOx) produced by thermal power plants.',
      efficiency: 'High modern panel efficiency (21–23%) with decentralized distribution, eliminating transmission and line-loss dissipation.',
    },
  },
  {
    id: 'heat_pump_hvac',
    category: 'Engineering & Tech',
    title: 'Cold-Climate Inverter Heat Pump Retrofit',
    description: 'Replace fossil fuel boilers, furnaces, and resistive heaters with high-efficiency variable-refrigerant inverter heat pumps delivering year-round thermal comfort.',
    potentialReductionKgCO2e: 1450,
    costEstimate: 'Moderate (₹₹)',
    targetScope: 'Scope 1',
    paybackPeriod: '5.2 Years',
    implementationEase: 'Medium',
    pros: {
      environmental: 'Delivers 300% to 400% seasonal Coefficient of Performance (COP); eliminates direct Scope 1 fossil fuel combustion.',
      economic: 'Cuts heating and cooling bills by 30–50% compared to legacy fuel systems, saving ₹18,000–₹35,000 annually.',
      healthOrSocial: 'Completely eliminates indoor carbon monoxide (CO) risk and toxic nitrogen dioxide (NO2) associated with gas combustion appliances.',
      efficiency: 'Transfers latent thermal heat rather than creating it via combustion, operating with optimal thermodynamic thermodynamic cycle efficiency.',
    },
  },
  {
    id: 'ev_or_hybrid_transition',
    category: 'Transport',
    title: 'Electric Vehicle (EV) Transition & Clean Mobility',
    description: 'Switch passenger commuting and fleet vehicles from fossil internal combustion engines (ICE) to battery electric vehicles with off-peak charging.',
    potentialReductionKgCO2e: 2200,
    costEstimate: 'High (₹₹₹)',
    targetScope: 'Scope 1',
    paybackPeriod: '5.5 Years',
    implementationEase: 'Medium',
    pros: {
      environmental: 'Delivers 65–80% lifecycle emission reductions compared to gasoline/diesel vehicles as the electrical grid decarbonizes.',
      economic: 'Operating costs per km are ~70% cheaper than petrol (₹1.20/km vs ₹6.50/km); eliminates spark plugs, engine oil, and exhaust maintenance.',
      healthOrSocial: 'Zero tailpipe emissions eliminates localized nitrogen oxides (NOx) and carcinogenic diesel particulate matter in neighborhoods.',
      efficiency: 'Electric powertrains achieve 87–91% tank-to-wheel thermodynamic efficiency compared to ICE engines losing 70–75% of fuel energy as heat.',
    },
  },
  {
    id: 'plant_rich_dietary_shift',
    category: 'Diet & Agriculture',
    title: 'Plant-Rich Dietary Shift & Low-Carbon Food Systems',
    description: 'Shift dietary patterns toward whole-food plant-rich proteins (lentils, legumes, nuts, seeds, seasonal produce) and eliminate ruminant livestock overconsumption.',
    potentialReductionKgCO2e: 1100,
    costEstimate: 'Free',
    targetScope: 'Scope 3',
    paybackPeriod: 'Immediate (Net Savings)',
    implementationEase: 'Easy',
    pros: {
      environmental: 'Substantially curbs enteric methane (CH4, 28x GWP of CO2) and saves up to 75% of agricultural land for biological rewilding.',
      economic: 'Lowers average weekly grocery bills by 15–25% as whole grains and legumes are significantly cheaper than red meats.',
      healthOrSocial: 'Clinically correlated with lower incidence of ischemic heart disease, hypertension, type 2 diabetes, and colorectal cancers.',
      efficiency: 'Bypasses the 10:1 trophic calorie loss in feed-to-meat conversion, allowing direct human consumption of agricultural yield.',
    },
  },
  {
    id: 'urban_forestry_biosequestration',
    category: 'Waste & Circularity',
    title: 'Urban Micro-Afforestation & Soil Carbon Sinks',
    description: 'Plant native deep-root canopy trees (Miyawaki micro-forests), bioswales, and apply biochar soil amendments to draw down atmospheric carbon dioxide.',
    potentialReductionKgCO2e: 650,
    costEstimate: 'Low (₹)',
    targetScope: 'Removal',
    paybackPeriod: '1.3 Years',
    implementationEase: 'Easy',
    pros: {
      environmental: 'Draws down 650+ kg CO2e per micro-forest cluster annually; creates living wildlife corridors for native pollinators and bird species.',
      economic: 'Strategic canopy tree shading on south and west building walls lowers summer air conditioning electricity bills by 15–30%.',
      healthOrSocial: 'Reduces urban surface temperatures by up to 5°C; filters airborne PM2.5 particulate matter and significantly reduces neighborhood stress levels.',
      efficiency: 'Self-sustaining biological solar collectors with zero mechanical wear-and-tear; deep root networks naturally recharge subterranean aquifers.',
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
    subtitle: 'Atmospheric CO2 Trends, Anthropogenic Drivers & Decarbonization Targets',
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
        category: 'Actionable Impact',
        benefit: 'Engages participants directly in hands-on sustainability data tracking, emission audits, and carbon reduction stewardship.',
        metrics: 'Provides clear path to net-zero carbon reduction',
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
