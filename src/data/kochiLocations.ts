export interface KochiLocationSimulationParam {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  co2FactorPerUnit: number; // kg CO2e saved per unit per year
  inrSavingsFactorPerUnit: number; // ₹ INR saved per unit per year
}

export interface KochiLocation {
  id: string;
  number: number;
  title: string;
  malayalamTitle: string;
  subtitle: string;
  zone: string;
  realCoordinates: {
    lat: string;
    lon: string;
    altitude: string;
    locationDesc: string;
  };
  position3D: [number, number, number]; // [x, y, z] in Three.js world space
  cameraPosition: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
  color: string;
  badgeColor: string;
  narrativeChapter: string;
  category: string;
  primarySolution: string;
  detailedCaseStudy: string;
  telemetry: {
    baselineCo2AbatementTonnes: number;
    baselineInvestmentINR: string;
    baselineAnnualSavingsINR: string;
    paybackYears: string;
    targetScope: string;
    trlLevel: number;
  };
  simulationParams: KochiLocationSimulationParam[];
  pastVsPresent: {
    pastLabel: string;
    pastMetric: string;
    pastDescription: string;
    presentLabel: string;
    presentMetric: string;
    presentDescription: string;
  };
  engineeringHighlights: string[];
  localImpactFeatures: string[];
}

export const KOCHI_LOCATIONS: KochiLocation[] = [
  {
    id: 'rset_kakkanad',
    number: 1,
    title: 'Rajagiri School of Engineering & Technology',
    malayalamTitle: 'രാജഗിരി എഞ്ചിനീയറിംഗ് കോളേജ് (കാക്കനാട്)',
    subtitle: 'Green Academic Campus, Microgrid & Circular Bio-Waste',
    zone: 'Rajagiri Valley, Chittethukara, Kakkanad, Kochi',
    realCoordinates: {
      lat: '9.9934° N',
      lon: '76.3582° E',
      altitude: '32m AMSL (Kakkanad Valley)',
      locationDesc: 'Academic Hillside Campus along Kadambrayar River Basin',
    },
    position3D: [16, 2.2, -4],
    cameraPosition: { x: 11, y: 8, z: 7 },
    cameraTarget: { x: 16, y: 2.2, z: -4 },
    color: '#22C55E', // Lush academic emerald
    badgeColor: '#15803D',
    narrativeChapter: 'Case Study 1 • Campus as a Living Lab',
    category: 'Educational Institutions & Microgrids',
    primarySolution: 'Rooftop Solar Canopy, Anaerobic Canteen Digester & Campus EV Shuttle',
    detailedCaseStudy:
      'Situated in the picturesque Rajagiri Valley in Kakkanad, Rajagiri School of Engineering & Technology (RSET) serves as the quintessential institutional case study for holistic campus decarbonization. By uniting student-driven IoT power monitoring, 450 kWp of monocrystalline solar rooftop arrays, and a closed-loop biomethanation plant converting daily canteen food waste into biogas for mess cooking, RSET demonstrates how Kerala colleges can reach operational net-zero while training the next generation of climate engineers.',
    telemetry: {
      baselineCo2AbatementTonnes: 680,
      baselineInvestmentINR: '₹1.45 Crores',
      baselineAnnualSavingsINR: '₹28.5 Lakhs/yr',
      paybackYears: '5.1 Years',
      targetScope: 'Scope 1 & 2',
      trlLevel: 9,
    },
    simulationParams: [
      {
        id: 'solarKwp',
        name: 'Rooftop Solar PV Capacity',
        unit: 'kWp',
        min: 100,
        max: 800,
        step: 50,
        defaultValue: 450,
        co2FactorPerUnit: 1150, // 1 kWp saves ~1,150 kg CO2e/yr in Kerala grid
        inrSavingsFactorPerUnit: 5200, // ₹5,200 saved per kWp/yr at KSEB institutional tariff
      },
      {
        id: 'canteenBiogasPct',
        name: 'Food Waste Diversion to Biogas',
        unit: '%',
        min: 20,
        max: 100,
        step: 5,
        defaultValue: 85,
        co2FactorPerUnit: 1800, // per % diversion (avoids methane + displaces LPG)
        inrSavingsFactorPerUnit: 6400, // per % diversion in LPG cylinder savings
      },
      {
        id: 'evCampusShuttles',
        name: 'Electric Campus Feeder Shuttles',
        unit: 'EVs',
        min: 2,
        max: 15,
        step: 1,
        defaultValue: 6,
        co2FactorPerUnit: 8200, // per EV shuttle substituting diesel mini-bus
        inrSavingsFactorPerUnit: 145000, // per EV shuttle in diesel & maintenance savings
      },
    ],
    pastVsPresent: {
      pastLabel: 'Historical Baseline (Diesel & Grid)',
      pastMetric: '920 tCO₂e/yr • ₹42L Annual Power Bill',
      pastDescription:
        'Continuous 125 kVA diesel generators during grid outages, unsegregated cafeteria food waste dispatched to municipal landfill with fugitive methane, 100% fossil grid electricity dependence.',
      presentLabel: 'Decarbonized Campus Living Lab',
      presentMetric: '240 tCO₂e/yr • 74% Net Carbon Cut',
      presentDescription:
        'Net-metered monocrystalline solar covering academic blocks, automated anaerobic digester producing 35 kg LPG equivalent daily, Level-2 EV charging bays powered by campus solar.',
    },
    engineeringHighlights: [
      'IoT smart microgrid with real-time sub-metering across electrical & mechanical engineering labs',
      'Rainwater harvesting capacity of 2.8 million liters replenishing the Kadambrayar aquifer',
      'Passive architectural cross-ventilation in academic quads minimizing HVAC load by 38%',
      'Biodiverse botanical sanctuary sequestering ~45 tonnes CO2 annually in Rajagiri Valley',
    ],
    localImpactFeatures: [
      'Curriculum-integrated energy audits conducted bi-annually by B.Tech Sustainable Energy students',
      'Elimination of 28 tonnes of food waste entering local municipal dumpsites each year',
      'Safe solar EV charging stations for 200+ day-scholar electric two-wheelers and staff cars',
    ],
  },
  {
    id: 'cial_airport',
    number: 2,
    title: 'Cochin International Airport (CIAL)',
    malayalamTitle: 'കൊച്ചി അന്താരാഷ്ട്ര വിമാനത്താവളം (നെടുമ്പാശ്ശേരി)',
    subtitle: "World's First 100% Solar-Powered Airport & Agrivoltaic Fields",
    zone: 'Nedumbassery, Ernakulam District, Kochi',
    realCoordinates: {
      lat: '10.1518° N',
      lon: '76.3930° E',
      altitude: '9m AMSL (Periyar Basin)',
      locationDesc: 'Greenfield Aviation Hub with Ground-Mounted & Floating Solar Arrays',
    },
    position3D: [14, 1.2, -26],
    cameraPosition: { x: 10, y: 9, z: -15 },
    cameraTarget: { x: 14, y: 1.2, z: -26 },
    color: '#EAB308', // Solar golden amber
    badgeColor: '#CA8A04',
    narrativeChapter: 'Case Study 2 • Pioneer of Global Clean Aviation',
    category: 'Renewable Infrastructure & Aviation',
    primarySolution: '50 MWp Agrivoltaics, Floating Solar on Canal Reservoirs & BESS',
    detailedCaseStudy:
      'In 2015, Cochin International Airport Limited (CIAL) made global history by becoming the world’s first completely solar-powered airport, earning the United Nations Champions of the Earth Award. Across 130,000+ solar panels spanning airside fields and canal reservoir surfaces, CIAL generates over 250,000 units of green electricity every single day—powering all passenger terminals, conveyor systems, and air traffic operations while harvesting over 120 tonnes of organic vegetables beneath the panels.',
    telemetry: {
      baselineCo2AbatementTonnes: 45000,
      baselineInvestmentINR: '₹62.0 Crores',
      baselineAnnualSavingsINR: '₹14.8 Crores/yr',
      paybackYears: '4.2 Years',
      targetScope: 'Scope 1 & 2',
      trlLevel: 9,
    },
    simulationParams: [
      {
        id: 'solarCapacityMw',
        name: 'Airside Solar PV Farm Capacity',
        unit: 'MWp',
        min: 30,
        max: 85,
        step: 5,
        defaultValue: 50,
        co2FactorPerUnit: 900000, // 1 MWp saves 900 tonnes CO2e/yr
        inrSavingsFactorPerUnit: 2960000, // ₹29.6 Lakhs saved per MWp/yr
      },
      {
        id: 'bessMwh',
        name: 'Battery Storage Capacity',
        unit: 'MWh',
        min: 5,
        max: 40,
        step: 5,
        defaultValue: 20,
        co2FactorPerUnit: 140000, // saves peaker emissions
        inrSavingsFactorPerUnit: 1200000, // peak tariff arbitrage
      },
      {
        id: 'agrivoltaicProduceTonnes',
        name: 'Agrivoltaic Vegetable Cultivation',
        unit: 'Tonnes/yr',
        min: 50,
        max: 250,
        step: 10,
        defaultValue: 120,
        co2FactorPerUnit: 850, // soil organic carbon sequestration & local food miles
        inrSavingsFactorPerUnit: 45000, // value of organic produce sales
      },
    ],
    pastVsPresent: {
      pastLabel: 'Pre-2015 Fossil Grid Baseline',
      pastMetric: '48,000 tCO₂e/yr • ₹15Cr Electricity Bill',
      pastDescription:
        'Daily consumption of over 48,000 units of grid fossil power, burning tens of thousands of liters of backup diesel during summer load shedding.',
      presentLabel: '100% Solar-Powered Net Positive Airport',
      presentMetric: 'Net Negative • Zero Grid Power Bills',
      presentDescription:
        'Generating 1.6x more green electricity than total airport consumption, exporting millions of surplus kWh back to the Kerala State Electricity Board (KSEB) grid.',
    },
    engineeringHighlights: [
      '50 MWp ground-mounted solar farm with anti-glare coatings safe for landing aircraft',
      'Floating solar array installed over flood prevention stormwater balancing reservoirs',
      'Agrivoltaic micro-sprinkler irrigation maximizing solar panel thermal efficiency by 1.8%',
      '12 MW hydro-electric dam integration at Arippara providing complementary monsoon energy',
    ],
    localImpactFeatures: [
      'Equivalent to planting 3.8 million trees or taking 32,000 passenger vehicles off Kochi roads',
      'Employed 150+ local organic farmers to manage agro-vegetable crops beneath solar panels',
      'Serves as an international blueprint copied by airport authorities from New Zealand to South Africa',
    ],
  },
  {
    id: 'water_metro',
    number: 3,
    title: 'Kochi Water Metro & Marine Drive',
    malayalamTitle: 'കൊച്ചി വാട്ടർ മെട്രോ & മറൈൻ ഡ്രൈവ് (എറണാകുളം)',
    subtitle: "India's First Integrated Electric-Hybrid Waterway Transit System",
    zone: 'Marine Drive Jetty, Vembanad Backwaters, Ernakulam',
    realCoordinates: {
      lat: '9.9816° N',
      lon: '76.2753° E',
      altitude: '4m AMSL (Backwater Coastline)',
      locationDesc: 'High Court & Marine Drive Terminal connecting 10 Backwater Islands',
    },
    position3D: [-1, 1.0, -1],
    cameraPosition: { x: -3, y: 7, z: 9 },
    cameraTarget: { x: -1, y: 1.0, z: -1 },
    color: '#06B6D4', // Water turquoise cyan
    badgeColor: '#0891B2',
    narrativeChapter: 'Case Study 3 • Silent Zero-Emission Waterways',
    category: 'Urban Mobility & Waterway Electrification',
    primarySolution: 'LFP Battery Catamarans, Floating Pontoon Fast-Chargers & Multimodal Ticketing',
    detailedCaseStudy:
      'Connecting 10 island communities spread across 78 route kilometers of the Vembanad backwaters, the Kochi Water Metro is the world’s largest electric water transit fleet. Designed with lightweight aluminum catamaran hulls and powered by lithium iron phosphate (LFP) battery banks, these air-conditioned 100-passenger boats silently glide at 8 knots, replacing smoky single-cylinder diesel ferries and diverting thousands of daily commuters away from gridlocked coastal roads.',
    telemetry: {
      baselineCo2AbatementTonnes: 16500,
      baselineInvestmentINR: '₹113.0 Crores',
      baselineAnnualSavingsINR: '₹19.2 Crores/yr',
      paybackYears: '5.9 Years',
      targetScope: 'Scope 1 (Urban Transit)',
      trlLevel: 9,
    },
    simulationParams: [
      {
        id: 'electricBoatCount',
        name: 'Electric Catamaran Fleet Size',
        unit: 'Boats',
        min: 10,
        max: 78,
        step: 2,
        defaultValue: 23,
        co2FactorPerUnit: 680000, // each boat saves ~680 tCO2e/yr vs diesel ferry & road traffic
        inrSavingsFactorPerUnit: 780000, // diesel fuel displacement per boat
      },
      {
        id: 'chargingDocksCount',
        name: 'Solar Pontoon Charging Stations',
        unit: 'Stations',
        min: 6,
        max: 38,
        step: 2,
        defaultValue: 15,
        co2FactorPerUnit: 45000, // per solar dock displacement
        inrSavingsFactorPerUnit: 340000,
      },
      {
        id: 'commuterShiftPct',
        name: 'Island Road Traffic Modal Shift',
        unit: '%',
        min: 15,
        max: 70,
        step: 5,
        defaultValue: 42,
        co2FactorPerUnit: 120000, // per % shift away from two-wheelers & cars
        inrSavingsFactorPerUnit: 850000,
      },
    ],
    pastVsPresent: {
      pastLabel: 'Pre-Metro Diesel Ferry & Bridge Jams',
      pastMetric: '22,400 tCO₂e/yr • High Water Pollution',
      pastDescription:
        'Venting exhaust soot and unburned diesel oil directly into the backwater estuary, 90-minute road delays on narrow bridges connecting Vypeen and Ernakulam.',
      presentLabel: 'Integrated Clean Water Metro Transit',
      presentMetric: '5,900 tCO₂e/yr • 73% Transit Decarbonization',
      presentDescription:
        'Ultra-quiet battery electric catamarans fast-charged in 15 minutes at floating pontoon berths, integrated single ticketing with Kochi Metro Rail (KMRL).',
    },
    engineeringHighlights: [
      'Twin electric propulsion motors (2x 50 kW) with precision azimuthing thrusters for tight dockings',
      'Advanced Lithium Iron Phosphate (LFP) chemistry ensuring thermal stability in tropical humid heat',
      'Universal floating pontoons automatically adjusting to high and low tidal variations (up to 1.5m)',
      'Wave-piercing hull hydrodynamics drastically lowering wake wash to protect delicate shoreline mudflats',
    ],
    localImpactFeatures: [
      'Drastically shortened commute times: Vypeen to High Court reduced from 45 mins on road to 18 mins by water',
      'Zero diesel bilge leaks into Vembanad Lake, protecting backwater fisheries and migratory birds',
      'Full disabled accessibility with step-free automated boarding gangways across all terminals',
    ],
  },
  {
    id: 'infopark_kakkanad',
    number: 4,
    title: 'Infopark & SmartCity IT Tech Corridor',
    malayalamTitle: 'ഇൻഫോപാർക്ക് & സ്മാർട്ട്സിറ്റി (കാക്കനാട്)',
    subtitle: 'LEED Platinum High-Rises, AI Chilled-Water Cooling & Microgrids',
    zone: 'Kakkanad IT Zone, Adjacent to Rajagiri Valley, Kochi',
    realCoordinates: {
      lat: '10.0090° N',
      lon: '76.3662° E',
      altitude: '40m AMSL (Kakkanad IT Ridge)',
      locationDesc: '75,000+ IT Professionals across 8.5M sq ft Modern Commercial Space',
    },
    position3D: [18, 2.8, -9],
    cameraPosition: { x: 13, y: 9, z: 2 },
    cameraTarget: { x: 18, y: 2.8, z: -9 },
    color: '#8B5CF6', // High-tech royal purple
    badgeColor: '#7C3AED',
    narrativeChapter: 'Case Study 4 • Smart Digital Workplaces',
    category: 'Commercial Buildings & District Cooling',
    primarySolution: 'District Chilled-Water Storage, BIPV Solar Facades & Corporate EV Feeder Buses',
    detailedCaseStudy:
      'Occupying the high ridge immediately northeast of Rajagiri School of Engineering & Technology, Infopark Kochi and SmartCity form the economic nerve center of Kerala’s knowledge economy. With over 75,000 tech professionals and sprawling data centers, the corridor tackled its greatest energy drain—air conditioning and computing heat—by deploying district thermal energy storage tanks, AI-governed variable refrigerant flow (VRF) chillers, and captive renewable power purchase agreements (PPAs).',
    telemetry: {
      baselineCo2AbatementTonnes: 28400,
      baselineInvestmentINR: '₹48.0 Crores',
      baselineAnnualSavingsINR: '₹11.6 Crores/yr',
      paybackYears: '4.1 Years',
      targetScope: 'Scope 2 & 3',
      trlLevel: 9,
    },
    simulationParams: [
      {
        id: 'districtCoolingTr',
        name: 'Thermal Chilled-Water Storage',
        unit: 'TR',
        min: 2000,
        max: 14000,
        step: 1000,
        defaultValue: 8000,
        co2FactorPerUnit: 2200, // per TR cooling displaced from peak tariff
        inrSavingsFactorPerUnit: 820,
      },
      {
        id: 'renewablePpaPct',
        name: 'Green Power Open Access PPA',
        unit: '%',
        min: 30,
        max: 100,
        step: 5,
        defaultValue: 75,
        co2FactorPerUnit: 145000, // per % grid decarbonization
        inrSavingsFactorPerUnit: 980000,
      },
      {
        id: 'corporateEvBusCount',
        name: 'Electric Employee Feeder Buses',
        unit: 'Buses',
        min: 20,
        max: 200,
        step: 10,
        defaultValue: 120,
        co2FactorPerUnit: 18500, // per EV bus substituting single-occupant cars
        inrSavingsFactorPerUnit: 210000,
      },
    ],
    pastVsPresent: {
      pastLabel: 'Peak Grid Chillers & Diesel Fleet',
      pastMetric: '42,000 tCO₂e/yr • High Peak Demand Tariffs',
      pastDescription:
        'Standard rooftop chillers running during Kerala peak tariff hours (6 PM - 10 PM), diesel employee commuter vans packing the Seaport-Airport Road.',
      presentLabel: 'Smart Energy Grid & District Storage',
      presentMetric: '13,600 tCO₂e/yr • 67% Emissions Abatement',
      presentDescription:
        'Chilled water produced overnight using off-peak clean hydro power, building-integrated solar facades, fleet of 100+ electric buses syncing with Kochi Metro at Palarivattom.',
    },
    engineeringHighlights: [
      'AI thermal load forecasting dynamically modulating compressor speeds to outdoor humidity levels',
      'Dual-glazed low-emissivity ceramic frit facade glass reducing solar thermal gain by 52%',
      'Rainwater detention ponds supporting zero-liquid discharge (ZLD) tertiary wastewater recycling',
      'Tier-III green data centers cooled with water-side economizers operating at PUE of 1.28',
    ],
    localImpactFeatures: [
      'Eliminates 3,200 personal vehicles from the congested Kakkanad-Civil Station traffic bottlenecks daily',
      '100% recycled STP water used for campus landscaping and cooling tower makeup',
      'Direct collaboration with neighboring RSET engineering faculty on smart building energy analytics',
    ],
  },
  {
    id: 'cochin_port',
    number: 5,
    title: 'Cochin Port & Vallarpadam ICTT',
    malayalamTitle: 'കൊച്ചി തുറമുഖം & വല്ലാർപാടം കണ്ടെയ്നർ ടെർമിനൽ',
    subtitle: 'Green Maritime Hub, Shore-to-Ship Cold Ironing & Gantry Electrification',
    zone: 'Willingdon Island & Vallarpadam Island, Cochin Harbor',
    realCoordinates: {
      lat: '9.9723° N',
      lon: '76.2625° E',
      altitude: '3m AMSL (Deepwater Shipping Channel)',
      locationDesc: 'International Container Transshipment Terminal along Arabian Sea Gateway',
    },
    position3D: [-8, 1.2, 2],
    cameraPosition: { x: -12, y: 7, z: 12 },
    cameraTarget: { x: -8, y: 1.2, z: 2 },
    color: '#F97316', // Maritime industrial amber
    badgeColor: '#EA580C',
    narrativeChapter: 'Case Study 5 • Decarbonizing Global Supply Chains',
    category: 'Maritime Ports & Heavy Industrial Freight',
    primarySolution: 'High-Voltage Shore Connection (HVSC), Electric RMG Cranes & LNG Tugboats',
    detailedCaseStudy:
      'Positioned strategically just 11 nautical miles off the primary East-West international shipping route, the Cochin Port and Vallarpadam ICTT handle millions of tonnes of containerized cargo annually. Ships historically burned hundreds of tonnes of heavy fuel oil (HFO) while berthed just to power their auxiliary generators. Cochin Port pioneered "Cold Ironing"—plugging massive docked container vessels directly into land-based clean electricity, while electrifying rail-mounted gantry cranes with regenerative lowering brakes.',
    telemetry: {
      baselineCo2AbatementTonnes: 34200,
      baselineInvestmentINR: '₹84.5 Crores',
      baselineAnnualSavingsINR: '₹16.4 Crores/yr',
      paybackYears: '5.2 Years',
      targetScope: 'Scope 1 & 3 (Freight Logistics)',
      trlLevel: 8,
    },
    simulationParams: [
      {
        id: 'coldIroningBerths',
        name: 'Shore-to-Ship Cold Ironing Berths',
        unit: 'Berths',
        min: 1,
        max: 8,
        step: 1,
        defaultValue: 4,
        co2FactorPerUnit: 5800000, // 5,800 tCO2e eliminated per deepwater electrified berth/yr
        inrSavingsFactorPerUnit: 24000000, // bunker fuel displacement value
      },
      {
        id: 'electricGantryCranes',
        name: 'Electric Rail Gantry Cranes (RMG)',
        unit: 'Cranes',
        min: 6,
        max: 30,
        step: 2,
        defaultValue: 18,
        co2FactorPerUnit: 420000, // each crane saves diesel generator runtime
        inrSavingsFactorPerUnit: 1850000,
      },
      {
        id: 'hybridTugsCount',
        name: 'Hybrid Electric Harbor Tugs',
        unit: 'Tugs',
        min: 1,
        max: 8,
        step: 1,
        defaultValue: 4,
        co2FactorPerUnit: 850000, // per harbor tugboat electrification
        inrSavingsFactorPerUnit: 3900000,
      },
    ],
    pastVsPresent: {
      pastLabel: 'Dirty Bunker Fuel Auxiliary Burn',
      pastMetric: '52,000 tCO₂e/yr • High PM2.5 & SOx',
      pastDescription:
        'Container ships running high-sulfur diesel generators continuously at berth, 24/7 particulate matter plume blowing across Ernakulam and Mattancherry.',
      presentLabel: 'Clean Zero-Emission Port Berths',
      presentMetric: '17,800 tCO₂e/yr • 66% Port Abatement',
      presentDescription:
        'Vessels plugged into 6.6 kV / 11 kV grid shore power within 30 minutes of mooring, zero auxiliary stack emissions, fully electrified internal container yard tractors.',
    },
    engineeringHighlights: [
      'Substation-backed 11 kV shore connection with frequency converter (50 Hz grid to 60 Hz marine ships)',
      'Automated cable-reel positioning arm safely transferring marine power in tidal harbor currents',
      'Regenerative braking on RMG container cranes capturing kinetic descent energy to feed terminal grid',
      '2.5 MW solar PV installations atop port transit warehouses and Willingdon workshops',
    ],
    localImpactFeatures: [
      'Drastic reduction in coastal air pollution for 300,000 residents living downwind in Fort Kochi and Ernakulam',
      'Elimination of 92% of port berth noise pollution, allowing marine life in Cochin harbor estuary to recover',
      'Provides significant compliance advantage under International Maritime Organization (IMO) Tier III caps',
    ],
  },
  {
    id: 'fort_kochi',
    number: 6,
    title: 'Fort Kochi Heritage Quarter & Fishing Nets',
    malayalamTitle: 'ഫോർട്ട് കൊച്ചി & ചീനവലകൾ (പൈതൃക തീരം)',
    subtitle: 'Zero-Emission Heritage Tourism, Passive Cooling & Mangrove Bio-Shields',
    zone: 'Fort Kochi Beach Promenade & Mattancherry Heritage Corridor',
    realCoordinates: {
      lat: '9.9658° N',
      lon: '76.2421° E',
      altitude: '2m AMSL (Arabian Sea Coastline)',
      locationDesc: 'Colonial Heritage Enclave & Iconic Cantilever Chinese Fishing Nets',
    },
    position3D: [-18, 1.0, 6],
    cameraPosition: { x: -22, y: 6, z: 15 },
    cameraTarget: { x: -18, y: 1.0, z: 6 },
    color: '#EC4899', // Coral terracotta & heritage pink
    badgeColor: '#DB2777',
    narrativeChapter: 'Case Study 6 • Sustainable Heritage & Cultural Ecology',
    category: 'Cultural Heritage & Coastal Regeneration',
    primarySolution: 'Pedestrianized Historic Zone, Decentralized Wet-Waste Composting & Mangroves',
    detailedCaseStudy:
      'Dating back over 500 years with Portuguese, Dutch, and British architectural influences, Fort Kochi is Kerala’s premier cultural tourism landmark. Facing severe vulnerability from Arabian Sea tidal surges, plastic debris, and diesel vehicle smog trapped in narrow historic lanes, Fort Kochi underwent a community-led ecological turnaround: pedestrianizing the beach precinct, electrifying tourist tuk-tuks, installing solar counterweights on traditional Chinese fishing nets (Cheena Vala), and restoring 28 hectares of native mangrove coastal bio-shields.',
    telemetry: {
      baselineCo2AbatementTonnes: 5200,
      baselineInvestmentINR: '₹12.8 Crores',
      baselineAnnualSavingsINR: '₹3.4 Crores/yr',
      paybackYears: '3.8 Years',
      targetScope: 'Scope 1 & 3 (Tourism & Nature)',
      trlLevel: 9,
    },
    simulationParams: [
      {
        id: 'pedestrianZoneKm2',
        name: 'Low-Emission Pedestrian Heritage Zone',
        unit: 'sq km',
        min: 1,
        max: 6,
        step: 0.5,
        defaultValue: 3.2,
        co2FactorPerUnit: 620000, // per sq km traffic restriction
        inrSavingsFactorPerUnit: 420000,
      },
      {
        id: 'compostingUnits',
        name: 'Decentralized Hotel Micro-Composters',
        unit: 'Units',
        min: 10,
        max: 80,
        step: 5,
        defaultValue: 45,
        co2FactorPerUnit: 28000, // per unit food waste diverted
        inrSavingsFactorPerUnit: 65000,
      },
      {
        id: 'mangroveHectares',
        name: 'Restored Coastal Mangrove Bio-Shield',
        unit: 'Hectares',
        min: 10,
        max: 60,
        step: 2,
        defaultValue: 28,
        co2FactorPerUnit: 48000, // blue carbon sequestration per hectare of mangrove
        inrSavingsFactorPerUnit: 38000, // avoided coastal flood damage
      },
    ],
    pastVsPresent: {
      pastLabel: 'Vehicular Gridlock & Coastal Waste',
      pastMetric: '7,800 tCO₂e/yr • Severe Coastal Erosion',
      pastDescription:
        'Diesel tour buses idling in 4-meter wide alleys, open litter heaps attracting pests along tourist walkways, degraded mudflats without wave buffers.',
      presentLabel: 'Zero-Emission Walkable Heritage Eco-Zone',
      presentMetric: '2,600 tCO₂e/yr • 66% Carbon Reduction',
      presentDescription:
        'Cobblestone streets reserved for electric autos, solar lighting on iconic Cheena Vala fishing nets, thriving mangrove roots protecting historic seawalls from monsoon storms.',
    },
    engineeringHighlights: [
      'Solar-powered mechanical counterweight winches assisting artisanal fishermen operating Chinese nets',
      'Porous eco-cobblestone paving enabling 90% rainwater infiltration to replenish shallow coastal water lenses',
      'Traditional Kerala clay tile (Odu) roofs integrated with concealed sub-tile ventilation gaps for passive cooling',
      'Rhizophora and Avicennia mangrove restoration binding soft tidal silt and creating nursery grounds for fish',
    ],
    localImpactFeatures: [
      'Preserves 14th-century artisanal Chinese fishing net heritage while reducing operating fatigue for local fishermen',
      'Enhanced air quality and pedestrian safety for 1.2 million domestic and international tourists annually',
      'Natural blue-carbon sponge providing storm-surge absorption during extreme Arabian Sea cyclones',
    ],
  },
];
