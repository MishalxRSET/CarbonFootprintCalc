export interface CitadelMonument {
  id: string;
  romanNumeral: string;
  title: string;
  subtitle: string;
  ancientInspiration: string; // The Persepolis architectural counterpart
  coordinates: {
    lat: string;
    lon: string;
    altitude: string;
  };
  cameraTarget: {
    x: number;
    y: number;
    z: number;
  };
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
  position3D: [number, number, number];
  color: string;
  emblemColor: string;
  narrativeChapter: string;
  detailedStory: string;
  keyInsights: string[];
  pastVsPresent: {
    pastLabel: string;
    pastDescription: string;
    pastMetric: string;
    presentLabel: string;
    presentDescription: string;
    presentMetric: string;
  };
  telemetry: {
    co2AbatementTonnes: string;
    investmentINR: string;
    annualSavingsINR: string;
    paybackYears: string;
    trlLevel: number;
  };
  architecturalElements: string[];
  audioTranscript: string;
}

export const CITADEL_MONUMENTS: CitadelMonument[] = [
  {
    id: 'bhadla-solar',
    romanNumeral: 'I',
    title: 'The Great Solar Terrace of Bhadla',
    subtitle: 'Photovoltaic Monolith & Crystalline Grid',
    ancientInspiration: 'Inspired by the Apadana Grand Terrace & Colonnade of Darius I',
    coordinates: {
      lat: "27°32'N",
      lon: "71°55'E",
      altitude: '210m AMSL (Thar Desert)',
    },
    position3D: [-18, 2, -10],
    cameraPosition: { x: -12, y: 14, z: 18 },
    cameraTarget: { x: -18, y: 2, z: -10 },
    color: '#D4AF37', // Burnished gold
    emblemColor: '#F59E0B',
    narrativeChapter: 'Chapter I • Harnessing the Solar Monolith',
    detailedStory:
      'Rising from the arid expanse of the Thar Desert, the Bhadla Solar Park stands as humanity’s largest concentrated solar sanctuary, commanding 2,245 MW of capacity across 14,000 acres. Much like the colossal limestone terrace of the Apadana that greeted envoys from across the ancient world, Bhadla receives 320 days of direct solar irradiance annually, converting pure celestial flux into high-voltage direct current.',
    keyInsights: [
      'Displaces over 4.2 million tonnes of coal-derived CO₂e each year from the Northern Regional Grid.',
      'Ultra-low levelized tariff of ₹2.44/kWh achieved through robotic dry cleaning and bifacial PERC modules.',
      'Grid stabilization supported by 15-minute predictive solar forecasting and regional HVDC lines.',
    ],
    pastVsPresent: {
      pastLabel: '1970–2010 Fossil Grid Baseline',
      pastDescription:
        'Over 72% dependence on subcritical pulverised coal-fired plants emitting 0.92 kg CO₂/kWh with severe particulate pollution.',
      pastMetric: '0.92 kg CO₂/kWh',
      presentLabel: 'Decarbonized Solar Sanctuary',
      presentDescription:
        'Zero-emission photovoltaic generation with automated bifacial tracking, eliminating grid sulfur and carbon effluents.',
      presentMetric: '0.04 kg CO₂/kWh',
    },
    telemetry: {
      co2AbatementTonnes: '4,200,000 tCO₂e / yr',
      investmentINR: '₹9,850 Crores',
      annualSavingsINR: '₹1,240 Crores / yr',
      paybackYears: '4.5 Years',
      trlLevel: 9,
    },
    architecturalElements: [
      'Bifacial monocrystalline solar arrays with dual-axis automated astronomical tracking',
      'Sandstone drainage aqueducts preventing desert flash-flood silt erosion',
      'Central 765 kV Green Energy Corridor step-up substation with sulfur hexafluoride capture',
    ],
    audioTranscript:
      'You stand before the Solar Terrace of Bhadla. Across fourteen thousand acres of Rajasthan sands, crystalline silicon panels gather the solar fire, transforming what was once inhospitable desert heat into clean current powering three million homes.',
  },
  {
    id: 'atmospheric-obelisk',
    romanNumeral: 'II',
    title: 'The Keeling Obelisk & Atmospheric Sphere',
    subtitle: 'Planetary Boundary Monitoring & Flux Telemetry',
    ancientInspiration: 'Inspired by the Inscription Tablets of Xerxes & Persian Monumental Pillars',
    coordinates: {
      lat: "19°32'N",
      lon: "155°35'W",
      altitude: '3,397m (Mauna Loa Calibration)',
    },
    position3D: [0, 4, -22],
    cameraPosition: { x: 0, y: 16, z: 8 },
    cameraTarget: { x: 0, y: 6, z: -22 },
    color: '#78B169', // Atmospheric emerald
    emblemColor: '#10B981',
    narrativeChapter: 'Chapter II • The Ledger of the Skies',
    detailedStory:
      'At the epicenter of the citadel rises the Keeling Obelisk, flanked by a translucent geodesic atmospheric sphere. Encaved within its crystalline obsidian walls is the continuous record of Earth’s tropospheric chemistry. In 1958, Charles David Keeling recorded 315 ppm; today, the obelisk registers 426.8 ppm, climbing at +2.4 ppm per year. It serves as our planetary conscience and scientific beacon.',
    keyInsights: [
      'Continuous spectroscopic absorption tracking CO₂, CH₄ (methane), and N₂O in real time.',
      'Planetary carbon budget countdown calibrated against the IPCC AR6 remaining budget of 215 Gt.',
      'Aerosol optical depth integration correlating clean air indexes with local thermal cooling.',
    ],
    pastVsPresent: {
      pastLabel: 'Pre-Industrial Holocene (1750)',
      pastDescription:
        'Stable atmospheric equilibrium at 280 ppm CO₂ with natural biospheric carbon exchange and balanced cryosphere.',
      pastMetric: '280 ppm CO₂',
      presentLabel: 'Anthropocene Reality (2026)',
      presentDescription:
        'Tropospheric concentration exceeding 426 ppm with +1.48°C planetary warming anomaly demanding rapid mitigation.',
      presentMetric: '426.8 ppm CO₂',
    },
    telemetry: {
      co2AbatementTonnes: '215 Gt Budget Remaining',
      investmentINR: '₹420 Crores (Observatory Network)',
      annualSavingsINR: '₹15.7 Lakh Cr (Avoided Tipping Points)',
      paybackYears: 'Immediate Vital Value',
      trlLevel: 9,
    },
    architecturalElements: [
      'Carved black basalt obelisk etched with historical CO₂ isotope ratios (¹³C/¹²C)',
      'Levitating geodesic atmospheric sphere pulsing with dynamic air mass streamlines',
      'Dual laser spectrometer pods sampling particulate optical depth PM2.5 and tropospheric ozone',
    ],
    audioTranscript:
      'Look upon the Keeling Obelisk. Every breath exhaled by civilization is inscribed upon these stone faces. We have altered the thermal envelope of the Earth; now engineering and ecological restoration must write the return to balance.',
  },
  {
    id: 'transit-gateway',
    romanNumeral: 'III',
    title: 'The Gateway of Clean Velocity',
    subtitle: 'High-Speed Electrified Rail & Urban Micro-Mobility',
    ancientInspiration: 'Inspired by the Gate of All Nations (Xerxes’ Grand Portal)',
    coordinates: {
      lat: "28°36'N",
      lon: "77°12'E",
      altitude: '216m (Delhi Urban Corridor)',
    },
    position3D: [18, 3, -12],
    cameraPosition: { x: 12, y: 15, z: 15 },
    cameraTarget: { x: 18, y: 3, z: -12 },
    color: '#38BDF8', // Electrified cyan
    emblemColor: '#0284C7',
    narrativeChapter: 'Chapter III • The Artery of Movement',
    detailedStory:
      'Where the colossal winged bull colossi once guarded the Gate of All Nations at Persepolis, welcoming visitors from twenty-eight satrapies, the Gateway of Clean Velocity welcomes thousands of travelers into an emission-free transit network. Dedicated viaducts carry 100% electrified regenerative braking trains and smart bi-directional EV charging hubs.',
    keyInsights: [
      'Dedicated Freight Corridors (DFC) shift 400 billion tonne-kilometres from diesel highways to 25 kV AC overhead electric rail.',
      'Urban metro systems in Delhi, Mumbai, and Bengaluru eliminate over 3.8 million daily single-occupancy vehicle trips.',
      'Electric 2-wheelers and 3-wheelers (auto-rickshaws) deploy swap batteries powered by rooftop microgrids.',
    ],
    pastVsPresent: {
      pastLabel: 'Internal Combustion Gridlock',
      pastDescription:
        'Diesel and petrol tailpipe emissions causing dangerous PM2.5 smog exceeding 250 µg/m³ and massive oil import bills.',
      pastMetric: '175 g CO₂/passenger-km',
      presentLabel: 'Electrified Rail & Micro-EV Fleet',
      presentDescription:
        'Regenerative kinetic energy recovery returning 28% of braking power to overhead catenary cables.',
      presentMetric: '28 g CO₂/passenger-km',
    },
    telemetry: {
      co2AbatementTonnes: '1,850,000 tCO₂e / yr',
      investmentINR: '₹14,50,000 (Per Commercial Fleet Unit)',
      annualSavingsINR: '₹1,10,000 / yr / vehicle',
      paybackYears: '4.8 Years',
      trlLevel: 9,
    },
    architecturalElements: [
      'Twin monumental sandstone pylons bridging magnetic induction transit tracks',
      'Integrated solar canopy overhead providing shade and 1.8 MW of clean station power',
      'Automated battery-swap carousel with 90-second automated robot replacement arms',
    ],
    audioTranscript:
      'Through this gate passes the circulation of human civilization. By replacing burning petroleum with clean electrons, our cities regain clean blue horizons and our children breathe without harm.',
  },
  {
    id: 'biosphere-terraces',
    romanNumeral: 'IV',
    title: 'The Hanging Biosphere Terraces',
    subtitle: 'Regenerative Soil, Miyawaki Forests & Agro-Ecology',
    ancientInspiration: 'Inspired by the Royal Gardens & Paradise Enclosures (Pairi-Daeza)',
    coordinates: {
      lat: "11°40'N",
      lon: "76°30'E",
      altitude: '920m (Western Ghats Biosphere)',
    },
    position3D: [-14, 2.5, 14],
    cameraPosition: { x: -8, y: 13, z: 28 },
    cameraTarget: { x: -14, y: 2.5, z: 14 },
    color: '#84CC16', // Flora vibrant green
    emblemColor: '#4ADE80',
    narrativeChapter: 'Chapter IV • The Living Soil & Sacred Canopy',
    detailedStory:
      'The ancient Persians invented the concept of the Pairi-Daeza (walled garden/paradise), balancing water canals with fruit trees. Reimagined today, the Hanging Biosphere Terraces combine high-density Miyawaki urban afforestation, biochar pyrolysis kilns, and regenerative zero-budget natural farming (ZBNF) to store atmospheric carbon deep in living humus.',
    keyInsights: [
      'Biochar application locks organic carbon in topsoil for 500+ years while boosting water retention by 24%.',
      'Direct-seeded rice (DSR) and alternate wetting and drying (AWD) suppress methane emissions by 40%.',
      'Indigenous multi-tier agroforestry sequesters between 3.5 and 6.8 tonnes of CO₂ per hectare annually.',
    ],
    pastVsPresent: {
      pastLabel: 'Synthetic Chemical Monoculture',
      pastDescription:
        'Stubble burning in northern plains generating severe seasonal smoke; high synthetic nitrogen runoff causing soil acidification.',
      pastMetric: '+3.2 tCO₂e/ha emissions',
      presentLabel: 'Regenerative Biochar Agro-Forestry',
      presentDescription:
        'Soil microbiome restoration with beneficial mycorrhizal fungi, converting carbon into durable humic substances.',
      presentMetric: '-4.8 tCO₂e/ha net sink',
    },
    telemetry: {
      co2AbatementTonnes: '2,400,000 tCO₂e / yr',
      investmentINR: '₹8,500 / acre',
      annualSavingsINR: '₹22,000 / acre / yr',
      paybackYears: '< 6 Months',
      trlLevel: 8,
    },
    architecturalElements: [
      'Terraced sandstone planters with automated gravity-fed subsurface drip irrigation',
      'Continuous-feed biochar pyrolysis retorts with heat-recuperation exchangers',
      'Canopy bird and pollinator corridors reconnecting fragmented ecological sanctuaries',
    ],
    audioTranscript:
      'The soil under our feet is the original carbon capture machine. When we treat the earth not as a quarry to extract from, but as a living tapestry to steward, every root and fungal filament becomes a partner in planetary healing.',
  },
  {
    id: 'circular-foundry',
    romanNumeral: 'V',
    title: 'The Circular Foundry & Thermal Engine',
    subtitle: 'Industrial Heat Pumps, Thermal Storage & Circular Economy',
    ancientInspiration: 'Inspired by the Persian Qanat Geothermal Channels & Ancient Kilns',
    coordinates: {
      lat: "22°18'N",
      lon: "73°12'E",
      altitude: '185m (Gujarat Industrial Belt)',
    },
    position3D: [15, 2.5, 12],
    cameraPosition: { x: 10, y: 14, z: 25 },
    cameraTarget: { x: 15, y: 2.5, z: 12 },
    color: '#FB923C', // Warm foundry amber
    emblemColor: '#F97316',
    narrativeChapter: 'Chapter V • The Hearth of Zero Waste',
    detailedStory:
      'Thousands of years ago, Persian engineers channeled mountain thermal breezes through subterranean qanats to cool palatial chambers. Today, the Circular Foundry repurposes that thermal mastery. Industrial high-temperature heat pumps extract low-grade waste heat, concentrating it to 160°C for manufacturing, completely bypassing fossil gas boilers.',
    keyInsights: [
      'Coefficient of Performance (COP) of 3.8: every 1 kWh of electricity yields 3.8 kWh of clean process heat.',
      'Phase-change thermal energy storage holds surplus solar heat for round-the-clock nighttime industrial processes.',
      'Circular material reclamation captures aluminum, copper, and slag, reducing embodied carbon by 85%.',
    ],
    pastVsPresent: {
      pastLabel: 'Fossil Gas & Diesel Boilers',
      pastDescription:
        'Combustion boilers with 75% thermal efficiency venting 25% of heat directly into local urban air sheds.',
      pastMetric: '78 kg CO₂/GJ heat',
      presentLabel: 'Industrial Heat Pump Loop',
      presentDescription:
        'Closed-loop thermodynamic refrigeration cycle powered by rooftop solar, emitting zero direct on-site fumes.',
      presentMetric: '12 kg CO₂/GJ heat',
    },
    telemetry: {
      co2AbatementTonnes: '890,000 tCO₂e / yr',
      investmentINR: '₹3,20,000 (Commercial Modular Unit)',
      annualSavingsINR: '₹58,000 / yr',
      paybackYears: '5.2 Years',
      trlLevel: 8,
    },
    architecturalElements: [
      'Domed sandstone rotunda housing concentric helical heat exchangers',
      'Molten salt and phase-change thermal storage vessels wrapped in ceramic aerogel insulation',
      'Automated optical material sorting chutes routing metals and polymers into closed loops',
    ],
    audioTranscript:
      'Within the Circular Foundry, waste is an obsolete concept. Thermal energy is circulated like blood in an organism, and matter is infinitely re-forged with the clean power of the sun.',
  },
  {
    id: 'treasury-vault',
    romanNumeral: 'VI',
    title: 'The Imperial Treasury of Climate Capital',
    subtitle: 'Social Cost of Carbon & Just Transition Ledgers',
    ancientInspiration: 'Inspired by the Royal Treasury of Persepolis (Where the Cuneiform Tablets Lay)',
    coordinates: {
      lat: "18°55'N",
      lon: "72°50'E",
      altitude: '15m (Financial Capital Vault)',
    },
    position3D: [0, 3, 16],
    cameraPosition: { x: 0, y: 15, z: 30 },
    cameraTarget: { x: 0, y: 3, z: 16 },
    color: '#A855F7', // Imperial amethyst & gold
    emblemColor: '#C084FC',
    narrativeChapter: 'Chapter VI • The Ledger of Social Value',
    detailedStory:
      'In the Treasury of Persepolis, archeologists discovered thousands of clay administrative tablets documenting fair wages, maternity allowances, and ration ledgers for artisans. The Imperial Treasury of Climate Capital holds our modern ledger: measuring not merely GDP, but the Social Cost of Carbon (₹15,700/tonne), green sovereign bonds, and the equitable distribution of transition funds to coal-dependent communities.',
    keyInsights: [
      'Directs sovereign green bond capital toward decentralized rural solar mini-grids and clean irrigation.',
      'Calculates avoided economic damages of ₹15.7 Lakh Crores annually by steering clear of runaway tipping points.',
      'Guarantees reskilling endowments for mineworkers transitioning into solar, battery, and forestry careers.',
    ],
    pastVsPresent: {
      pastLabel: 'Externalized Climate Damage',
      pastDescription:
        'Fossil fuel pollution treated as an uncounted free externality while extreme weather devastates smallholder farmers.',
      pastMetric: '₹0 carbon price',
      presentLabel: 'Internalized True Cost of Carbon',
      presentDescription:
        'Shadow carbon pricing of ₹3,500/t guiding public tenders and prioritizing high-abatement civil engineering.',
      presentMetric: '₹3,500–₹15,700/t SCC',
    },
    telemetry: {
      co2AbatementTonnes: 'Economy-Wide Decarbonization',
      investmentINR: '₹35,000 Crores (National Clean Energy Fund)',
      annualSavingsINR: '₹8,90,000 Crores in Public Health Benefits',
      paybackYears: 'Transformational',
      trlLevel: 9,
    },
    architecturalElements: [
      'Classical vaulted archive hall lined with illuminated crystalline data tablets',
      'Central reflecting pool mirroring the atmospheric projection overhead',
      'Dual stone podiums where fiscal policy and scientific climate models converge',
    ],
    audioTranscript:
      'True wealth is measured by what we preserve for those who inherit the earth after us. The Treasury records every tonne abated as an investment in human flourishing and civilizational longevity.',
  },
];
