import React, { useState, useMemo } from 'react';
import { EmissionInputs, CalculationResult, PageTab } from '../types';
import { calculateEmissions, DEFAULT_EMISSION_INPUTS } from '../data/carbonData';
import { SpotlightCard, CountUp, ShinyText, Magnet } from './reactbits';
import { formatINR } from '../utils/currency';
import {
  Zap,
  Car,
  Utensils,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  TreeDeciduous,
  CarFront,
  Flame,
  Globe,
  Sliders,
  Check,
} from 'lucide-react';

interface CalculatorViewProps {
  onNavigate: (tab: PageTab) => void;
  onApplyFootprintToPlanner: (res: CalculationResult) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  onNavigate,
  onApplyFootprintToPlanner,
}) => {
  const [inputs, setInputs] = useState<EmissionInputs>(DEFAULT_EMISSION_INPUTS);
  const [activeCategory, setActiveCategory] = useState<'energy' | 'transport' | 'lifestyle'>('energy');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Compute results dynamically with memoization
  const result: CalculationResult = useMemo(() => {
    return calculateEmissions(inputs);
  }, [inputs]);

  const updateInput = <K extends keyof EmissionInputs>(key: K, value: EmissionInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Preset profiles for rapid testing & comparison
  const applyPreset = (presetName: 'eco' | 'average' | 'high') => {
    if (presetName === 'eco') {
      setInputs({
        electricityKwhPerMonth: 220,
        naturalGasThermPerMonth: 8,
        cleanEnergyPercentage: 80,
        gasolineCarMilesPerWeek: 20,
        carFuelEfficiencyMpg: 45,
        publicTransitMilesPerWeek: 80,
        shortHaulFlightsPerYear: 0,
        longHaulFlightsPerYear: 0,
        dietType: 'vegan',
        foodWastePercentage: 5,
        clothingAndGoodsSpendPerMonth: 1500,
        recycleRatePercentage: 85,
        cloudStreamingHoursPerDay: 1.5,
      });
    } else if (presetName === 'average') {
      setInputs(DEFAULT_EMISSION_INPUTS);
    } else {
      setInputs({
        electricityKwhPerMonth: 950,
        naturalGasThermPerMonth: 65,
        cleanEnergyPercentage: 0,
        gasolineCarMilesPerWeek: 350,
        carFuelEfficiencyMpg: 20,
        publicTransitMilesPerWeek: 0,
        shortHaulFlightsPerYear: 6,
        longHaulFlightsPerYear: 3,
        dietType: 'heavy_meat',
        foodWastePercentage: 35,
        clothingAndGoodsSpendPerMonth: 35000,
        recycleRatePercentage: 15,
        cloudStreamingHoursPerDay: 6,
      });
    }
  };

  const handleTransferToPlanner = () => {
    onApplyFootprintToPlanner(result);
    setCopiedNotification(true);
    setTimeout(() => {
      setCopiedNotification(false);
      onNavigate('planner');
    }, 600);
  };

  // Compute breakdown percentages
  const energyPercent = Math.round((result.breakdown.energy / result.totalAnnualKgCO2e) * 100) || 0;
  const transportPercent = Math.round((result.breakdown.transport / result.totalAnnualKgCO2e) * 100) || 0;
  const dietPercent = Math.round((result.breakdown.diet / result.totalAnnualKgCO2e) * 100) || 0;
  const goodsPercent = Math.round((result.breakdown.goodsAndWaste / result.totalAnnualKgCO2e) * 100) || 0;
  const digitalPercent = Math.max(0, 100 - energyPercent - transportPercent - dietPercent - goodsPercent);

  // Status rating
  const getRating = (tonnes: number) => {
    if (tonnes <= 4.0) return { label: 'Low Impact (Climate Aligned)', color: 'text-[#1D2B17] bg-[#D9E4D1] border-[#CCD9C3]' };
    if (tonnes <= 9.0) return { label: 'Moderate Impact', color: 'text-[#5C4D26] bg-[#F5F2EC] border-[#D6CBB8]' };
    return { label: 'High Carbon Intensity', color: 'text-[#8C3A27] bg-[#FDF2F0] border-[#E8C5BE]' };
  };

  const rating = getRating(result.totalAnnualTonnesCO2e);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header & Preset Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
            Standardized Carbon Accounting
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1D2B17] tracking-tight mt-1">
            Carbon Footprint Calculator
          </h1>
          <p className="text-sm text-[#5C6658] mt-1 max-w-2xl">
            Quantify annual greenhouse gas emissions across domestic utilities, transport logistics, and lifestyle supply chains.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 bg-[#F1EFEC] p-1.5 rounded-full border border-[#E8E4DF]">
          <span className="text-xs font-semibold text-[#5C6658] px-2 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-[#8C7851]" /> Presets:
          </span>
          <button
            id="preset-eco-btn"
            onClick={() => applyPreset('eco')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white text-[#1D2B17] border border-[#E0E7DE] hover:bg-[#F7F9F6] transition-colors shadow-2xs"
          >
            Eco-Campus
          </button>
          <button
            id="preset-avg-btn"
            onClick={() => applyPreset('average')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white text-[#5C6658] border border-[#E0E7DE] hover:text-[#1D2B17] hover:bg-[#F7F9F6] transition-colors shadow-2xs"
          >
            Typical Domestic
          </button>
          <button
            id="preset-high-btn"
            onClick={() => applyPreset('high')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white text-[#8C3A27] border border-[#E8C5BE] hover:bg-[#FDF2F0] transition-colors shadow-2xs"
          >
            High Intensity
          </button>
          <button
            id="reset-inputs-btn"
            onClick={() => setInputs(DEFAULT_EMISSION_INPUTS)}
            title="Reset to default baseline"
            className="p-1.5 text-[#737C70] hover:text-[#1D2B17] hover:bg-white rounded-full transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Input Modules (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Tabs */}
          <div className="flex border-b border-[#E0E7DE] gap-1 overflow-x-auto">
            <button
              id="calc-tab-energy"
              onClick={() => setActiveCategory('energy')}
              className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-2xl transition-colors whitespace-nowrap ${
                activeCategory === 'energy'
                  ? 'border-b-2 border-[#4A6741] text-[#1D2B17] bg-[#D9E4D1]/30 font-bold'
                  : 'text-[#5C6658] hover:text-[#1D2B17] hover:bg-white/50'
              }`}
            >
              <Zap className="w-4 h-4 text-[#8C7851]" />
              <span>1. Home & Energy (Scope 1 & 2)</span>
            </button>

            <button
              id="calc-tab-transport"
              onClick={() => setActiveCategory('transport')}
              className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-2xl transition-colors whitespace-nowrap ${
                activeCategory === 'transport'
                  ? 'border-b-2 border-[#4A6741] text-[#1D2B17] bg-[#D9E4D1]/30 font-bold'
                  : 'text-[#5C6658] hover:text-[#1D2B17] hover:bg-white/50'
              }`}
            >
              <Car className="w-4 h-4 text-[#4A6741]" />
              <span>2. Transportation</span>
            </button>

            <button
              id="calc-tab-lifestyle"
              onClick={() => setActiveCategory('lifestyle')}
              className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-2xl transition-colors whitespace-nowrap ${
                activeCategory === 'lifestyle'
                  ? 'border-b-2 border-[#4A6741] text-[#1D2B17] bg-[#D9E4D1]/30 font-bold'
                  : 'text-[#5C6658] hover:text-[#1D2B17] hover:bg-white/50'
              }`}
            >
              <Utensils className="w-4 h-4 text-[#8C7851]" />
              <span>3. Diet & Lifestyle</span>
            </button>
          </div>

          {/* Form Content per Category */}
          <div className="bg-white border border-[#E0E7DE] rounded-[28px] p-7 shadow-xs space-y-6">
            {activeCategory === 'energy' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2D332B] mb-2">
                    <label htmlFor="input-electricity">Monthly Electricity Consumption</label>
                    <span className="font-bold text-[#1D2B17] bg-[#F1EFEC] px-2.5 py-0.5 rounded-full border border-[#E8E4DF]">
                      {inputs.electricityKwhPerMonth} kWh / month
                    </span>
                  </div>
                  <input
                    id="input-electricity"
                    type="range"
                    min="50"
                    max="2000"
                    step="25"
                    value={inputs.electricityKwhPerMonth}
                    onChange={(e) => updateInput('electricityKwhPerMonth', Number(e.target.value))}
                    className="w-full h-2 bg-[#E0E7DE] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                  />
                  <p className="text-[11px] text-[#737C70] mt-1.5">
                    US household average: ~890 kWh/mo. Dorm or shared apartment: ~250–400 kWh/mo.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2D332B] mb-2">
                    <label htmlFor="input-gas">Monthly Natural Gas Heating</label>
                    <span className="font-bold text-[#1D2B17] bg-[#F1EFEC] px-2.5 py-0.5 rounded-full border border-[#E8E4DF]">
                      {inputs.naturalGasThermPerMonth} therms / month
                    </span>
                  </div>
                  <input
                    id="input-gas"
                    type="range"
                    min="0"
                    max="150"
                    step="5"
                    value={inputs.naturalGasThermPerMonth}
                    onChange={(e) => updateInput('naturalGasThermPerMonth', Number(e.target.value))}
                    className="w-full h-2 bg-[#E0E7DE] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                  />
                  <p className="text-[11px] text-[#737C70] mt-1.5">
                    Direct on-site combustion (Scope 1). Zero if all-electric or heat pump powered.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2D332B] mb-2">
                    <label htmlFor="input-clean-energy">Renewable / Clean Energy Share</label>
                    <span className="font-bold text-[#1D2B17] bg-[#D9E4D1] px-2.5 py-0.5 rounded-full border border-[#CCD9C3]">
                      {inputs.cleanEnergyPercentage}% Clean
                    </span>
                  </div>
                  <input
                    id="input-clean-energy"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={inputs.cleanEnergyPercentage}
                    onChange={(e) => updateInput('cleanEnergyPercentage', Number(e.target.value))}
                    className="w-full h-2 bg-[#E0E7DE] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                  />
                  <p className="text-[11px] text-[#737C70] mt-1.5">
                    Solar panels or utility green tariff contracts abate Scope 2 grid emissions.
                  </p>
                </div>
              </div>
            )}

            {activeCategory === 'transport' && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2D332B] mb-2">
                    <label htmlFor="input-car-miles">Weekly Driving Distance (Gasoline Car)</label>
                    <span className="font-bold text-[#1D2B17] bg-[#F1EFEC] px-2.5 py-0.5 rounded-full border border-[#E8E4DF]">
                      {inputs.gasolineCarMilesPerWeek} miles / week
                    </span>
                  </div>
                  <input
                    id="input-car-miles"
                    type="range"
                    min="0"
                    max="700"
                    step="10"
                    value={inputs.gasolineCarMilesPerWeek}
                    onChange={(e) => updateInput('gasolineCarMilesPerWeek', Number(e.target.value))}
                    className="w-full h-2 bg-[#E0E7DE] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2D332B] mb-2">
                    <label htmlFor="input-mpg">Vehicle Fuel Economy (MPG)</label>
                    <span className="font-bold text-[#1D2B17] bg-[#F1EFEC] px-2.5 py-0.5 rounded-full border border-[#E8E4DF]">
                      {inputs.carFuelEfficiencyMpg} MPG
                    </span>
                  </div>
                  <input
                    id="input-mpg"
                    type="range"
                    min="12"
                    max="60"
                    step="1"
                    value={inputs.carFuelEfficiencyMpg}
                    onChange={(e) => updateInput('carFuelEfficiencyMpg', Number(e.target.value))}
                    className="w-full h-2 bg-[#E0E7DE] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                  />
                  <p className="text-[11px] text-[#737C70] mt-1.5">
                    Standard sedan: ~28–32 MPG. SUV/Truck: ~18–22 MPG. Hybrid: ~45–55 MPG.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2D332B] mb-2">
                    <label htmlFor="input-transit">Weekly Public Transit / Train Distance</label>
                    <span className="font-bold text-[#1D2B17] bg-[#F1EFEC] px-2.5 py-0.5 rounded-full border border-[#E8E4DF]">
                      {inputs.publicTransitMilesPerWeek} miles / week
                    </span>
                  </div>
                  <input
                    id="input-transit"
                    type="range"
                    min="0"
                    max="300"
                    step="5"
                    value={inputs.publicTransitMilesPerWeek}
                    onChange={(e) => updateInput('publicTransitMilesPerWeek', Number(e.target.value))}
                    className="w-full h-2 bg-[#E0E7DE] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E0E7DE]">
                  <div>
                    <label htmlFor="input-short-flights" className="block text-xs font-semibold text-[#2D332B] mb-1">
                      Short-Haul Flights (Roundtrips/yr)
                    </label>
                    <input
                      id="input-short-flights"
                      type="number"
                      min="0"
                      max="30"
                      value={inputs.shortHaulFlightsPerYear}
                      onChange={(e) => updateInput('shortHaulFlightsPerYear', Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 bg-[#F7F9F6] border border-[#E0E7DE] rounded-xl text-xs font-semibold text-[#1D2B17] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                    />
                    <span className="text-[10px] text-[#737C70]">&lt; 3 hours (~150 kg CO₂e each)</span>
                  </div>

                  <div>
                    <label htmlFor="input-long-flights" className="block text-xs font-semibold text-[#2D332B] mb-1">
                      Long-Haul Flights (Roundtrips/yr)
                    </label>
                    <input
                      id="input-long-flights"
                      type="number"
                      min="0"
                      max="15"
                      value={inputs.longHaulFlightsPerYear}
                      onChange={(e) => updateInput('longHaulFlightsPerYear', Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 bg-[#F7F9F6] border border-[#E0E7DE] rounded-xl text-xs font-semibold text-[#1D2B17] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                    />
                    <span className="text-[10px] text-[#737C70]">&gt; 3 hours (~750 kg CO₂e each)</span>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'lifestyle' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-[#2D332B] mb-2.5">
                    Primary Diet Pattern (Trophic Layer & Methane Footprint)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { key: 'heavy_meat', label: 'Heavy Meat', desc: 'Daily beef/pork' },
                      { key: 'medium_meat', label: 'Omnivore', desc: 'Poultry/moderate meat' },
                      { key: 'pescatarian', label: 'Pescatarian', desc: 'Seafood & plants' },
                      { key: 'vegetarian', label: 'Vegetarian', desc: 'Dairy, eggs, plants' },
                      { key: 'vegan', label: 'Plant-Based', desc: '100% plant sourced' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        id={`diet-btn-${item.key}`}
                        type="button"
                        onClick={() => updateInput('dietType', item.key as EmissionInputs['dietType'])}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          inputs.dietType === item.key
                            ? 'border-[#4A6741] bg-[#D9E4D1]/40 text-[#1D2B17] font-bold ring-1 ring-[#4A6741]'
                            : 'border-[#E0E7DE] hover:border-[#CCD9C3] text-[#5C6658] bg-[#F7F9F6]'
                        }`}
                      >
                        <p className="text-xs font-bold">{item.label}</p>
                        <p className="text-[10px] text-[#737C70] mt-0.5">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#2D332B] mb-2">
                    <label htmlFor="input-food-waste">Food Waste Percentage</label>
                    <span className="font-bold text-[#1D2B17] bg-[#F1EFEC] px-2.5 py-0.5 rounded-full border border-[#E8E4DF]">
                      {inputs.foodWastePercentage}% Discarded
                    </span>
                  </div>
                  <input
                    id="input-food-waste"
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={inputs.foodWastePercentage}
                    onChange={(e) => updateInput('foodWastePercentage', Number(e.target.value))}
                    className="w-full h-2 bg-[#E0E7DE] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                  />
                  <p className="text-[11px] text-[#737C70] mt-1.5">
                    Unconsumed discarded food generates anaerobic methane in municipal landfills.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="input-goods-spend" className="block text-xs font-semibold text-[#2D332B] mb-1">
                      Goods & Apparel Spend (₹/mo)
                    </label>
                    <input
                      id="input-goods-spend"
                      type="number"
                      min="0"
                      max="150000"
                      step="500"
                      value={inputs.clothingAndGoodsSpendPerMonth}
                      onChange={(e) => updateInput('clothingAndGoodsSpendPerMonth', Math.max(0, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 bg-[#F7F9F6] border border-[#E0E7DE] rounded-xl text-xs font-semibold text-[#1D2B17] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                    />
                    <span className="text-[10px] text-[#737C70]">Embodied manufacturing & shipping footprint</span>
                  </div>

                  <div>
                    <label htmlFor="input-recycle-rate" className="block text-xs font-semibold text-[#2D332B] mb-1">
                      Recycling & Compost Diversion Rate (%)
                    </label>
                    <input
                      id="input-recycle-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={inputs.recycleRatePercentage}
                      onChange={(e) => updateInput('recycleRatePercentage', Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-full px-3.5 py-2.5 bg-[#F7F9F6] border border-[#E0E7DE] rounded-xl text-xs font-semibold text-[#1D2B17] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                    />
                    <span className="text-[10px] text-[#737C70]">Materials diverted from landfills</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Emissions Dashboard & Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Total Card */}
          <SpotlightCard
            spotlightColor="rgba(74, 103, 65, 0.12)"
            className="bg-white border border-[#E0E7DE] rounded-[32px] p-7 shadow-xs space-y-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
                  Annual Estimated Emissions
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-serif font-medium text-[#1D2B17] tracking-tight">
                    <CountUp to={result.totalAnnualTonnesCO2e} decimals={2} duration={0.8} />
                  </span>
                  <span className="text-sm font-semibold text-[#5C6658]">Tonnes CO₂e / yr</span>
                </div>
              </div>

              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${rating.color}`}>
                {rating.label}
              </span>
            </div>

            {/* Visual Multi-Segment Category Bar */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-medium text-[#5C6658]">
                <span>Emission Distribution</span>
                <span className="font-semibold text-[#1D2B17]">{result.totalAnnualKgCO2e.toLocaleString()} kg total</span>
              </div>
              <div className="w-full h-3 bg-[#E0E7DE] rounded-full overflow-hidden flex">
                <div style={{ width: `${energyPercent}%` }} className="bg-[#8C7851]" title={`Energy: ${energyPercent}%`} />
                <div style={{ width: `${transportPercent}%` }} className="bg-[#4A6741]" title={`Transport: ${transportPercent}%`} />
                <div style={{ width: `${dietPercent}%` }} className="bg-[#5C6658]" title={`Diet: ${dietPercent}%`} />
                <div style={{ width: `${goodsPercent}%` }} className="bg-[#A3ADA0]" title={`Goods/Waste: ${goodsPercent}%`} />
                <div style={{ width: `${digitalPercent}%` }} className="bg-[#C2B9A7]" title={`Digital: ${digitalPercent}%`} />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center gap-2 text-[#2D332B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C7851]"></span>
                  <span>Energy: <strong>{result.breakdown.energy.toLocaleString()} kg</strong> ({energyPercent}%)</span>
                </div>
                <div className="flex items-center gap-2 text-[#2D332B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A6741]"></span>
                  <span>Transport: <strong>{result.breakdown.transport.toLocaleString()} kg</strong> ({transportPercent}%)</span>
                </div>
                <div className="flex items-center gap-2 text-[#2D332B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5C6658]"></span>
                  <span>Diet: <strong>{result.breakdown.diet.toLocaleString()} kg</strong> ({dietPercent}%)</span>
                </div>
                <div className="flex items-center gap-2 text-[#2D332B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A3ADA0]"></span>
                  <span>Goods/Waste: <strong>{result.breakdown.goodsAndWaste.toLocaleString()} kg</strong></span>
                </div>
              </div>
            </div>

            {/* Scope 1, 2, 3 Breakdown Box */}
            <div className="p-4 bg-[#F7F9F6] rounded-2xl border border-[#E0E7DE] space-y-2.5 text-xs">
              <span className="font-bold text-[#1D2B17] uppercase tracking-wider text-[11px] block">
                GHG Protocol Scopes Breakdown
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-[#E0E7DE]">
                  <p className="text-[#737C70] text-[10px]">Scope 1 (Direct)</p>
                  <p className="font-bold text-[#1D2B17] mt-0.5">{(result.scopes.scope1 / 1000).toFixed(2)} t</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E0E7DE]">
                  <p className="text-[#737C70] text-[10px]">Scope 2 (Grid)</p>
                  <p className="font-bold text-[#1D2B17] mt-0.5">{(result.scopes.scope2 / 1000).toFixed(2)} t</p>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-[#E0E7DE]">
                  <p className="text-[#737C70] text-[10px]">Scope 3 (Chain)</p>
                  <p className="font-bold text-[#1D2B17] mt-0.5">{(result.scopes.scope3 / 1000).toFixed(2)} t</p>
                </div>
              </div>
            </div>

            {/* Real-world Equivalencies */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#D9E4D1]/50 border border-[#CCD9C3] rounded-2xl">
                <div className="flex items-center gap-2 text-[#1D2B17] text-xs font-semibold">
                  <TreeDeciduous className="w-4 h-4 text-[#4A6741]" />
                  <span>Trees to Offset</span>
                </div>
                <p className="text-2xl font-serif font-medium text-[#1D2B17] mt-1">
                  {result.treesEquivalentToOffset.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#4A6741] mt-0.5">mature trees needed for 1 year</p>
              </div>

              <div className="p-3.5 bg-[#F1EFEC] border border-[#E8E4DF] rounded-2xl">
                <div className="flex items-center gap-2 text-[#5C6658] text-xs font-semibold">
                  <CarFront className="w-4 h-4 text-[#8C7851]" />
                  <span>Gas Car Equiv.</span>
                </div>
                <p className="text-2xl font-serif font-medium text-[#1D2B17] mt-1">
                  {result.carMilesEquivalent.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#737C70] mt-0.5">passenger miles driven</p>
              </div>
            </div>

            {/* Paris Climate Target Benchmark */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#5C6658]">Paris Agreement Target (2.0 t):</span>
                <span className={`font-bold ${result.totalAnnualTonnesCO2e <= 2.0 ? 'text-[#4A6741]' : 'text-[#8C7851]'}`}>
                  {result.totalAnnualTonnesCO2e <= 2.0
                    ? 'Target Achieved'
                    : `+${(result.totalAnnualTonnesCO2e - 2.0).toFixed(1)} t over target`}
                </span>
              </div>
              <div className="w-full bg-[#E0E7DE] h-2.5 rounded-full overflow-hidden relative">
                <div
                  className="bg-[#4A6741] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (result.totalAnnualTonnesCO2e / 14.4) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#737C70]">
                <span>0 t</span>
                <span className="font-semibold text-[#4A6741]">2.0 t (1.5°C Budget)</span>
                <span>14.4 t (US Average)</span>
              </div>
            </div>

            {/* Action CTA: Transfer to Reduction Planner */}
            <button
              id="transfer-to-planner-btn"
              onClick={handleTransferToPlanner}
              className="w-full py-3.5 px-5 rounded-full bg-[#4A6741] hover:bg-[#3E5637] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-4 h-4 text-[#D9E4D1]" />
                  <span>Footprint Loaded Into Planner!</span>
                </>
              ) : (
                <>
                  <span>Create Reduction Plan for this Footprint</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
