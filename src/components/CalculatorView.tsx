import React, { useState, useMemo } from 'react';
import { EmissionInputs, CalculationResult, PageTab } from '../types';
import { calculateEmissions, DEFAULT_EMISSION_INPUTS } from '../data/carbonData';
import { SpotlightCard, CountUp, ShinyText, Magnet } from './reactbits';
import { fireCelebrationConfetti } from '../utils/confetti';
import {
  Zap,
  Car,
  Utensils,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  TreeDeciduous,
  CarFront,
  Sliders,
  Check,
  Info,
  HelpCircle,
  Sparkles,
  TrendingDown,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Compute results dynamically with memoization
  const result: CalculationResult = useMemo(() => {
    return calculateEmissions(inputs);
  }, [inputs]);

  const updateInput = <K extends keyof EmissionInputs>(key: K, value: EmissionInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Preset profiles for rapid testing & comparison (Calibrated for India)
  const applyPreset = (presetName: 'eco' | 'average' | 'high') => {
    if (presetName === 'eco') {
      setInputs({
        electricityKwhPerMonth: 90,
        naturalGasThermPerMonth: 0.5,
        cleanEnergyPercentage: 80,
        gasolineCarMilesPerWeek: 25,
        carFuelEfficiencyMpg: 55,
        publicTransitMilesPerWeek: 70,
        shortHaulFlightsPerYear: 0,
        longHaulFlightsPerYear: 0,
        dietType: 'vegan',
        foodWastePercentage: 5,
        clothingAndGoodsSpendPerMonth: 1500,
        recycleRatePercentage: 85,
        cloudStreamingHoursPerDay: 1.5,
      });
      fireCelebrationConfetti();
    } else if (presetName === 'average') {
      setInputs(DEFAULT_EMISSION_INPUTS);
    } else {
      setInputs({
        electricityKwhPerMonth: 650,
        naturalGasThermPerMonth: 2,
        cleanEnergyPercentage: 0,
        gasolineCarMilesPerWeek: 280,
        carFuelEfficiencyMpg: 12,
        publicTransitMilesPerWeek: 10,
        shortHaulFlightsPerYear: 4,
        longHaulFlightsPerYear: 2,
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
    fireCelebrationConfetti();
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

  // Status rating calibrated for Indian per-capita benchmarks (India Avg ~2.1 tCO2e)
  const getRating = (tonnes: number) => {
    if (tonnes <= 2.1)
      return {
        label: 'Low Impact (Within 1.5°C Budget)',
        color: 'text-[#1D2B17] dark:text-[#A8C7A0] bg-[#D9E4D1] dark:bg-[#1A2E19] border-[#CCD9C3] dark:border-[#2C482A]',
      };
    if (tonnes <= 4.5)
      return {
        label: 'Moderate Impact (Urban Average)',
        color: 'text-[#5C4D26] dark:text-[#E6D5B8] bg-[#F5F2EC] dark:bg-[#2A241A] border-[#D6CBB8] dark:border-[#423927]',
      };
    return {
      label: 'High Carbon Intensity',
      color: 'text-[#8C3A27] dark:text-[#F3ABA0] bg-[#FDF2F0] dark:bg-[#2B1714] border-[#E8C5BE] dark:border-[#4D2620]',
    };
  };

  const rating = getRating(result.totalAnnualTonnesCO2e);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-24">
      {/* View Header & Preset Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8EFE5] dark:bg-[#1F2E1D] text-[#2E4726] dark:text-[#A8C7A0] text-xs font-bold rounded-full border border-[#D0DFCB] dark:border-[#2F442C] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Carbon Accounting</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] tracking-tight">
            Personal Carbon Footprint Calculator
          </h1>
          <p className="text-sm text-[#5C6658] dark:text-[#9DB099] mt-1 max-w-2xl">
            Quantify annual greenhouse gas emissions across domestic energy, transport logistics, and lifestyle supply chains calibrated for Indian and global benchmarks.
          </p>
        </div>

        {/* Quick Presets for Easy Exploration */}
        <div className="flex flex-wrap items-center gap-2 bg-[#F1EFEC] dark:bg-[#1A2619] p-1.5 rounded-full border border-[#E8E4DF] dark:border-[#2E442B]">
          <span className="text-xs font-semibold text-[#5C6658] dark:text-[#9DB099] px-2 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-[#8C7851] dark:text-[#A8C7A0]" /> 1-Click Presets:
          </span>
          <button
            id="preset-eco-btn"
            type="button"
            onClick={() => applyPreset('eco')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-[#141E13] text-[#1D2B17] dark:text-[#EEF5ED] border border-[#E0E7DE] dark:border-[#263824] hover:bg-[#E8EFE5] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            🌱 Eco-Minimalist
          </button>
          <button
            id="preset-avg-btn"
            type="button"
            onClick={() => applyPreset('average')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-[#141E13] text-[#5C6658] dark:text-[#9DB099] border border-[#E0E7DE] dark:border-[#263824] hover:text-[#1D2B17] dark:hover:text-white transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            🏙️ Urban Indian
          </button>
          <button
            id="preset-high-btn"
            type="button"
            onClick={() => applyPreset('high')}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white dark:bg-[#141E13] text-[#8C3A27] dark:text-[#F3ABA0] border border-[#E8C5BE] dark:border-[#4D2620] hover:bg-[#FDF2F0] dark:hover:bg-[#2B1714] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            🚗 High Commuter
          </button>
          <button
            id="reset-inputs-btn"
            type="button"
            onClick={() => setInputs(DEFAULT_EMISSION_INPUTS)}
            title="Reset to default baseline"
            className="p-1.5 text-[#737C70] dark:text-[#839580] hover:text-[#1D2B17] dark:hover:text-white hover:bg-white dark:hover:bg-[#141E13] rounded-full transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Input Modules (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Tabs with Step Numbers */}
          <div className="flex border-b border-[#E0E7DE] dark:border-[#263824] gap-2 overflow-x-auto pb-1">
            <button
              id="calc-tab-energy"
              type="button"
              onClick={() => setActiveCategory('energy')}
              className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-2xl transition-all whitespace-nowrap cursor-pointer relative ${
                activeCategory === 'energy'
                  ? 'border-b-2 border-[#4A6741] text-[#1D2B17] dark:text-[#EEF5ED] bg-[#D9E4D1]/30 dark:bg-[#1F2E1D] font-bold shadow-xs'
                  : 'text-[#5C6658] dark:text-[#9DB099] hover:text-[#1D2B17] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4 text-[#8C7851] dark:text-[#D4AF37]" />
              <span>Step 1: Home & Energy</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E0E7DE] dark:bg-[#263824] text-[#5C6658] dark:text-[#9DB099]">
                Scope 1 & 2
              </span>
            </button>

            <button
              id="calc-tab-transport"
              type="button"
              onClick={() => setActiveCategory('transport')}
              className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-2xl transition-all whitespace-nowrap cursor-pointer relative ${
                activeCategory === 'transport'
                  ? 'border-b-2 border-[#4A6741] text-[#1D2B17] dark:text-[#EEF5ED] bg-[#D9E4D1]/30 dark:bg-[#1F2E1D] font-bold shadow-xs'
                  : 'text-[#5C6658] dark:text-[#9DB099] hover:text-[#1D2B17] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Car className="w-4 h-4 text-[#4A6741] dark:text-[#78B169]" />
              <span>Step 2: Transportation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E0E7DE] dark:bg-[#263824] text-[#5C6658] dark:text-[#9DB099]">
                Fuel & Flights
              </span>
            </button>

            <button
              id="calc-tab-lifestyle"
              type="button"
              onClick={() => setActiveCategory('lifestyle')}
              className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold rounded-t-2xl transition-all whitespace-nowrap cursor-pointer relative ${
                activeCategory === 'lifestyle'
                  ? 'border-b-2 border-[#4A6741] text-[#1D2B17] dark:text-[#EEF5ED] bg-[#D9E4D1]/30 dark:bg-[#1F2E1D] font-bold shadow-xs'
                  : 'text-[#5C6658] dark:text-[#9DB099] hover:text-[#1D2B17] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              <Utensils className="w-4 h-4 text-[#8C7851] dark:text-[#D4AF37]" />
              <span>Step 3: Food & Goods</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E0E7DE] dark:bg-[#263824] text-[#5C6658] dark:text-[#9DB099]">
                Scope 3
              </span>
            </button>
          </div>

          {/* Form Content Card */}
          <div className="bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-[28px] p-6 sm:p-8 shadow-xs space-y-7 transition-colors">
            <AnimatePresence mode="wait">
              {activeCategory === 'energy' && (
                <motion.div
                  key="energy-category"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Electricity Input */}
                  <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                      <div className="flex items-center gap-1.5">
                        <label htmlFor="input-electricity" className="cursor-pointer">
                          Monthly Electricity Consumption
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(activeTooltip === 'electricity' ? null : 'electricity')}
                          className="text-[#737C70] hover:text-[#4A6741] transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] bg-white dark:bg-[#141E13] px-3 py-1 rounded-full border border-[#E0E7DE] dark:border-[#263824] shadow-2xs font-mono">
                        {inputs.electricityKwhPerMonth} kWh / mo
                      </span>
                    </div>

                    {activeTooltip === 'electricity' && (
                      <div className="p-2.5 bg-[#E8EFE5] dark:bg-[#1F2E1D] text-[11px] text-[#2E4726] dark:text-[#A8C7A0] rounded-xl border border-[#CCD9C3] dark:border-[#2F442C]">
                        Calculated using Central Electricity Authority (CEA India) baseline emissions factor of <strong>0.716 kg CO₂e/kWh</strong>. 
                        A typical 2BHK urban Indian household uses ~200–350 kWh/mo.
                      </div>
                    )}

                    <input
                      id="input-electricity"
                      type="range"
                      min="30"
                      max="1200"
                      step="10"
                      value={inputs.electricityKwhPerMonth}
                      onChange={(e) => updateInput('electricityKwhPerMonth', Number(e.target.value))}
                      className="w-full h-2 bg-[#E0E7DE] dark:bg-[#263824] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                    />

                    <div className="flex justify-between text-[11px] text-[#737C70] dark:text-[#839580] pt-1">
                      <span>30 kWh (Minimal)</span>
                      <span>250 kWh (Avg India)</span>
                      <span>1,200 kWh (Heavy AC)</span>
                    </div>
                  </div>

                  {/* LPG Cylinder Input */}
                  <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                      <div className="flex items-center gap-1.5">
                        <label htmlFor="input-gas" className="cursor-pointer">
                          Monthly Cooking Gas (LPG Cylinders / PNG)
                        </label>
                      </div>
                      <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] bg-white dark:bg-[#141E13] px-3 py-1 rounded-full border border-[#E0E7DE] dark:border-[#263824] shadow-2xs font-mono">
                        {inputs.naturalGasThermPerMonth} Cylinder(s) / mo
                      </span>
                    </div>

                    <input
                      id="input-gas"
                      type="range"
                      min="0"
                      max="4"
                      step="0.25"
                      value={inputs.naturalGasThermPerMonth}
                      onChange={(e) => updateInput('naturalGasThermPerMonth', Number(e.target.value))}
                      className="w-full h-2 bg-[#E0E7DE] dark:bg-[#263824] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                    />
                    <div className="flex justify-between text-[11px] text-[#737C70] dark:text-[#839580]">
                      <span>0 (All-Electric Induction)</span>
                      <span>1 Cylinder (Standard Household)</span>
                      <span>4 Cylinders</span>
                    </div>
                  </div>

                  {/* Clean Energy Share */}
                  <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                      <label htmlFor="input-clean-energy" className="cursor-pointer">
                        Rooftop Solar or Green Power Share
                      </label>
                      <span className="font-bold text-[#4A6741] dark:text-[#88B080] bg-[#E8EFE5] dark:bg-[#1F2E1D] px-3 py-1 rounded-full border border-[#CCD9C3] dark:border-[#2F442C] shadow-2xs font-mono">
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
                      className="w-full h-2 bg-[#E0E7DE] dark:bg-[#263824] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                    />
                    <p className="text-[11px] text-[#737C70] dark:text-[#839580]">
                      Rooftop solar PV net-metering abates Scope 2 thermal grid emissions directly.
                    </p>
                  </div>

                  {/* Step Navigation Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveCategory('transport')}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1D2B17] dark:bg-[#4A6741] hover:bg-[#2E4726] text-white text-xs font-bold rounded-full transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Next: Step 2 Transportation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeCategory === 'transport' && (
                <motion.div
                  key="transport-category"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Driving Commute */}
                  <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                      <label htmlFor="input-car-miles" className="cursor-pointer">
                        Weekly Commute Driving (Petrol/Diesel Car or Bike)
                      </label>
                      <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] bg-white dark:bg-[#141E13] px-3 py-1 rounded-full border border-[#E0E7DE] dark:border-[#263824] shadow-2xs font-mono">
                        {inputs.gasolineCarMilesPerWeek} km / week
                      </span>
                    </div>

                    <input
                      id="input-car-miles"
                      type="range"
                      min="0"
                      max="600"
                      step="5"
                      value={inputs.gasolineCarMilesPerWeek}
                      onChange={(e) => updateInput('gasolineCarMilesPerWeek', Number(e.target.value))}
                      className="w-full h-2 bg-[#E0E7DE] dark:bg-[#263824] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                    />
                    <div className="flex justify-between text-[11px] text-[#737C70] dark:text-[#839580]">
                      <span>0 km (Public Transit/WFH)</span>
                      <span>80 km (Urban Commute)</span>
                      <span>600 km</span>
                    </div>
                  </div>

                  {/* Vehicle Mileage */}
                  <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                      <label htmlFor="input-mpg" className="cursor-pointer">
                        Vehicle Fuel Mileage
                      </label>
                      <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] bg-white dark:bg-[#141E13] px-3 py-1 rounded-full border border-[#E0E7DE] dark:border-[#263824] shadow-2xs font-mono">
                        {inputs.carFuelEfficiencyMpg} km/L
                      </span>
                    </div>

                    <input
                      id="input-mpg"
                      type="range"
                      min="8"
                      max="70"
                      step="1"
                      value={inputs.carFuelEfficiencyMpg}
                      onChange={(e) => updateInput('carFuelEfficiencyMpg', Number(e.target.value))}
                      className="w-full h-2 bg-[#E0E7DE] dark:bg-[#263824] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                    />
                    <div className="flex justify-between text-[11px] text-[#737C70] dark:text-[#839580]">
                      <span>SUV (~11 km/L)</span>
                      <span>Sedan (~16 km/L)</span>
                      <span>Two-Wheeler (~55 km/L)</span>
                    </div>
                  </div>

                  {/* Public Transit */}
                  <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                      <label htmlFor="input-transit" className="cursor-pointer">
                        Weekly Public Transit (Metro, Bus, Suburban Rail)
                      </label>
                      <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] bg-white dark:bg-[#141E13] px-3 py-1 rounded-full border border-[#E0E7DE] dark:border-[#263824] shadow-2xs font-mono">
                        {inputs.publicTransitMilesPerWeek} km / week
                      </span>
                    </div>

                    <input
                      id="input-transit"
                      type="range"
                      min="0"
                      max="400"
                      step="5"
                      value={inputs.publicTransitMilesPerWeek}
                      onChange={(e) => updateInput('publicTransitMilesPerWeek', Number(e.target.value))}
                      className="w-full h-2 bg-[#E0E7DE] dark:bg-[#263824] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                    />
                  </div>

                  {/* Flights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-1.5">
                      <label htmlFor="input-short-flights" className="block text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                        Domestic Flights (Roundtrips/yr)
                      </label>
                      <input
                        id="input-short-flights"
                        type="number"
                        min="0"
                        max="30"
                        value={inputs.shortHaulFlightsPerYear}
                        onChange={(e) => updateInput('shortHaulFlightsPerYear', Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-xl text-xs font-semibold text-[#1D2B17] dark:text-[#EEF5ED] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                      />
                      <span className="text-[10px] text-[#737C70] dark:text-[#839580] block">~140 kg CO₂e each roundtrip</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-1.5">
                      <label htmlFor="input-long-flights" className="block text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                        International Flights (Roundtrips/yr)
                      </label>
                      <input
                        id="input-long-flights"
                        type="number"
                        min="0"
                        max="15"
                        value={inputs.longHaulFlightsPerYear}
                        onChange={(e) => updateInput('longHaulFlightsPerYear', Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-xl text-xs font-semibold text-[#1D2B17] dark:text-[#EEF5ED] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                      />
                      <span className="text-[10px] text-[#737C70] dark:text-[#839580] block">~750 kg CO₂e each roundtrip</span>
                    </div>
                  </div>

                  {/* Step Navigation Buttons */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveCategory('energy')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F1EFEC] dark:bg-[#1F2E1D] hover:bg-[#E0E7DE] text-[#5C6658] dark:text-[#9DB099] text-xs font-bold rounded-full transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back: Home Energy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveCategory('lifestyle')}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1D2B17] dark:bg-[#4A6741] hover:bg-[#2E4726] text-white text-xs font-bold rounded-full transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Next: Step 3 Diet & Lifestyle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeCategory === 'lifestyle' && (
                <motion.div
                  key="lifestyle-category"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Diet Patterns */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE] mb-2.5">
                      Primary Diet Pattern (Trophic Layer & Methane Footprint)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { key: 'heavy_meat', label: '🥩 Heavy Meat', desc: 'Frequent meat' },
                        { key: 'medium_meat', label: '🍗 Omnivore', desc: 'Moderate poultry/fish' },
                        { key: 'pescatarian', label: '🐟 Pescatarian', desc: 'Seafood & plants' },
                        { key: 'vegetarian', label: '🥗 Vegetarian', desc: 'Dairy, pulses, vegetables' },
                        { key: 'vegan', label: '🌱 Plant-Based', desc: '100% plant sourced' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          id={`diet-btn-${item.key}`}
                          type="button"
                          onClick={() => updateInput('dietType', item.key as EmissionInputs['dietType'])}
                          className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                            inputs.dietType === item.key
                              ? 'border-[#4A6741] bg-[#D9E4D1]/40 dark:bg-[#1F2E1D] text-[#1D2B17] dark:text-[#EEF5ED] font-bold ring-1 ring-[#4A6741]'
                              : 'border-[#E0E7DE] dark:border-[#263824] hover:border-[#CCD9C3] text-[#5C6658] dark:text-[#9DB099] bg-[#F7F9F6] dark:bg-[#1A2619]'
                          }`}
                        >
                          <p className="text-xs font-bold">{item.label}</p>
                          <p className="text-[10px] text-[#737C70] dark:text-[#839580] mt-0.5">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Food Waste */}
                  <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                      <label htmlFor="input-food-waste" className="cursor-pointer">
                        Food Waste Percentage
                      </label>
                      <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] bg-white dark:bg-[#141E13] px-3 py-1 rounded-full border border-[#E0E7DE] dark:border-[#263824] shadow-2xs font-mono">
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
                      className="w-full h-2 bg-[#E0E7DE] dark:bg-[#263824] rounded-lg appearance-none cursor-pointer accent-[#4A6741]"
                    />
                    <p className="text-[11px] text-[#737C70] dark:text-[#839580]">
                      Discarded food generates anaerobic methane in municipal landfills.
                    </p>
                  </div>

                  {/* Goods Spend & Recycling */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-1.5">
                      <label htmlFor="input-goods-spend" className="block text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
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
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-xl text-xs font-semibold text-[#1D2B17] dark:text-[#EEF5ED] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                      />
                      <span className="text-[10px] text-[#737C70] dark:text-[#839580]">Embodied manufacturing footprint</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#2E442B] space-y-1.5">
                      <label htmlFor="input-recycle-rate" className="block text-xs font-semibold text-[#2D332B] dark:text-[#D1E0CE]">
                        Compost & Recycling Rate (%)
                      </label>
                      <input
                        id="input-recycle-rate"
                        type="number"
                        min="0"
                        max="100"
                        step="5"
                        value={inputs.recycleRatePercentage}
                        onChange={(e) => updateInput('recycleRatePercentage', Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-xl text-xs font-semibold text-[#1D2B17] dark:text-[#EEF5ED] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
                      />
                      <span className="text-[10px] text-[#737C70] dark:text-[#839580]">Diverted from landfills</span>
                    </div>
                  </div>

                  {/* Step Navigation Buttons */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveCategory('transport')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F1EFEC] dark:bg-[#1F2E1D] hover:bg-[#E0E7DE] text-[#5C6658] dark:text-[#9DB099] text-xs font-bold rounded-full transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back: Transportation</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTransferToPlanner}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4A6741] hover:bg-[#3B5334] text-white text-xs font-bold rounded-full transition-all shadow-md cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Transfer Footprint to Planner</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Live Emissions Dashboard & Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Total Card with Spotlight & Animated Numbers */}
          <SpotlightCard
            spotlightColor="rgba(74, 103, 65, 0.12)"
            className="bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-[32px] p-6 sm:p-7 shadow-xs space-y-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851] dark:text-[#A8C7A0]">
                  Annual Estimated Footprint
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-serif font-medium text-[#1D2B17] dark:text-[#EEF5ED] tracking-tight">
                    <CountUp to={result.totalAnnualTonnesCO2e} decimals={2} duration={0.6} />
                  </span>
                  <span className="text-sm font-semibold text-[#5C6658] dark:text-[#9DB099]">Tonnes CO₂e / yr</span>
                </div>
              </div>

              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${rating.color}`}>
                {rating.label}
              </span>
            </div>

            {/* Visual Multi-Segment Category Bar */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-xs font-medium text-[#5C6658] dark:text-[#9DB099]">
                <span>Emission Distribution</span>
                <span className="font-semibold text-[#1D2B17] dark:text-[#EEF5ED]">{result.totalAnnualKgCO2e.toLocaleString()} kg total</span>
              </div>
              <div className="w-full h-3 bg-[#E0E7DE] dark:bg-[#263824] rounded-full overflow-hidden flex">
                <div style={{ width: `${energyPercent}%` }} className="bg-[#8C7851] transition-all duration-300" title={`Energy: ${energyPercent}%`} />
                <div style={{ width: `${transportPercent}%` }} className="bg-[#4A6741] transition-all duration-300" title={`Transport: ${transportPercent}%`} />
                <div style={{ width: `${dietPercent}%` }} className="bg-[#5C6658] transition-all duration-300" title={`Diet: ${dietPercent}%`} />
                <div style={{ width: `${goodsPercent}%` }} className="bg-[#A3ADA0] transition-all duration-300" title={`Goods/Waste: ${goodsPercent}%`} />
                <div style={{ width: `${digitalPercent}%` }} className="bg-[#C2B9A7] transition-all duration-300" title={`Digital: ${digitalPercent}%`} />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="flex items-center gap-2 text-[#2D332B] dark:text-[#D1E0CE]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C7851]"></span>
                  <span>Energy: <strong>{result.breakdown.energy.toLocaleString()} kg</strong> ({energyPercent}%)</span>
                </div>
                <div className="flex items-center gap-2 text-[#2D332B] dark:text-[#D1E0CE]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4A6741]"></span>
                  <span>Transport: <strong>{result.breakdown.transport.toLocaleString()} kg</strong> ({transportPercent}%)</span>
                </div>
                <div className="flex items-center gap-2 text-[#2D332B] dark:text-[#D1E0CE]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5C6658]"></span>
                  <span>Diet: <strong>{result.breakdown.diet.toLocaleString()} kg</strong> ({dietPercent}%)</span>
                </div>
                <div className="flex items-center gap-2 text-[#2D332B] dark:text-[#D1E0CE]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A3ADA0]"></span>
                  <span>Goods/Waste: <strong>{result.breakdown.goodsAndWaste.toLocaleString()} kg</strong></span>
                </div>
              </div>
            </div>

            {/* Scope 1, 2, 3 Breakdown Box */}
            <div className="p-4 bg-[#F7F9F6] dark:bg-[#1A2619] rounded-2xl border border-[#E0E7DE] dark:border-[#2E442B] space-y-2.5 text-xs">
              <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] uppercase tracking-wider text-[11px] block">
                GHG Protocol Scope Classification
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white dark:bg-[#141E13] p-2.5 rounded-xl border border-[#E0E7DE] dark:border-[#263824]">
                  <p className="text-[#737C70] dark:text-[#839580] text-[10px]">Scope 1 (Direct Fuel)</p>
                  <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] mt-0.5">{(result.scopes.scope1 / 1000).toFixed(2)} t</p>
                </div>
                <div className="bg-white dark:bg-[#141E13] p-2.5 rounded-xl border border-[#E0E7DE] dark:border-[#263824]">
                  <p className="text-[#737C70] dark:text-[#839580] text-[10px]">Scope 2 (Grid Power)</p>
                  <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] mt-0.5">{(result.scopes.scope2 / 1000).toFixed(2)} t</p>
                </div>
                <div className="bg-white dark:bg-[#141E13] p-2.5 rounded-xl border border-[#E0E7DE] dark:border-[#263824]">
                  <p className="text-[#737C70] dark:text-[#839580] text-[10px]">Scope 3 (Supply Chain)</p>
                  <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] mt-0.5">{(result.scopes.scope3 / 1000).toFixed(2)} t</p>
                </div>
              </div>
            </div>

            {/* Real-world Equivalencies */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#D9E4D1]/40 dark:bg-[#1F2E1D] border border-[#CCD9C3] dark:border-[#2F442C] rounded-2xl">
                <div className="flex items-center gap-2 text-[#1D2B17] dark:text-[#EEF5ED] text-xs font-semibold">
                  <TreeDeciduous className="w-4 h-4 text-[#4A6741] dark:text-[#78B169]" />
                  <span>Trees to Absorb</span>
                </div>
                <p className="text-2xl font-serif font-medium text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
                  {result.treesEquivalentToOffset.toLocaleString()}
                </p>
                <p className="text-[10px] text-[#4A6741] dark:text-[#A8C7A0] mt-0.5">mature trees for 1 full year</p>
              </div>

              <div className="p-3.5 bg-[#F1EFEC] dark:bg-[#1A2619] border border-[#E8E4DF] dark:border-[#2E442B] rounded-2xl">
                <div className="flex items-center gap-2 text-[#5C6658] dark:text-[#9DB099] text-xs font-semibold">
                  <CarFront className="w-4 h-4 text-[#8C7851] dark:text-[#D4AF37]" />
                  <span>Petrol Car Equiv.</span>
                </div>
                <p className="text-2xl font-serif font-medium text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
                  {(result.carKmEquivalent ?? result.carMilesEquivalent).toLocaleString()}
                </p>
                <p className="text-[10px] text-[#737C70] dark:text-[#839580] mt-0.5">km driven in passenger vehicle</p>
              </div>
            </div>

            {/* National & Paris Climate Target Benchmark */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#5C6658] dark:text-[#9DB099]">Paris 1.5°C Cap (2.0 t):</span>
                <span className={`font-bold ${result.totalAnnualTonnesCO2e <= 2.1 ? 'text-[#4A6741] dark:text-[#88B080]' : 'text-[#8C7851] dark:text-[#D4AF37]'}`}>
                  {result.totalAnnualTonnesCO2e <= 2.1
                    ? 'Within National Average & 1.5°C Cap'
                    : `+${(result.totalAnnualTonnesCO2e - 2.1).toFixed(1)} t above India avg`}
                </span>
              </div>
              <div className="w-full bg-[#E0E7DE] dark:bg-[#263824] h-2.5 rounded-full overflow-hidden relative">
                <div
                  className="bg-[#4A6741] dark:bg-[#78B169] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (result.totalAnnualTonnesCO2e / 6.0) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#737C70] dark:text-[#839580]">
                <span>0 t</span>
                <span className="font-semibold text-[#4A6741] dark:text-[#88B080]">2.0 t (1.5°C Cap)</span>
                <span className="font-semibold text-[#1D2B17] dark:text-[#EEF5ED]">2.1 t (India Avg)</span>
                <span>4.7 t (Global Avg)</span>
              </div>
            </div>

            {/* Action CTA: Transfer to Reduction Planner */}
            <button
              id="transfer-to-planner-btn"
              type="button"
              onClick={handleTransferToPlanner}
              className="w-full py-3.5 px-5 rounded-full bg-[#4A6741] hover:bg-[#3B5334] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-4 h-4 text-[#D9E4D1]" />
                  <span>Footprint Transferred into Planner!</span>
                </>
              ) : (
                <>
                  <span>Create Decarbonization Plan for This Footprint</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </SpotlightCard>
        </div>
      </div>

      {/* Floating Interactive Sticky Quick Summary Bar */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white/90 dark:bg-[#141E13]/90 backdrop-blur-md border border-[#CCD9C3] dark:border-[#2E442B] p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E8EFE5] dark:bg-[#1F2E1D] flex items-center justify-center text-[#4A6741] dark:text-[#78B169] shrink-0">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#737C70] dark:text-[#839580] uppercase">
              Current Baseline
            </span>
            <p className="text-sm font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
              {result.totalAnnualTonnesCO2e} tCO₂e / yr
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTransferToPlanner}
          className="px-4 py-2 bg-[#1D2B17] dark:bg-[#4A6741] hover:bg-[#2E4726] text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <span>Plan Reductions</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </motion.div>
    </div>
  );
};
