import React, { useState, useMemo } from 'react';
import { PageTab } from '../types';
import {
  Sliders,
  TrendingDown,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Zap,
  Building2,
  Car,
  Utensils,
  Trees,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

interface ScenarioSimulatorProps {
  onNavigate: (tab: PageTab) => void;
}

interface LeverState {
  cleanGrid: number; // 0 - 100%
  heatPumps: number; // 0 - 100%
  cleanMobility: number; // 0 - 100%
  plantDiet: number; // 0 - 100%
  carbonRemoval: number; // 0 - 100%
}

const DEFAULT_LEVERS: LeverState = {
  cleanGrid: 42,
  heatPumps: 25,
  cleanMobility: 30,
  plantDiet: 20,
  carbonRemoval: 15,
};

const PRESETS: { label: string; desc: string; levers: LeverState }[] = [
  {
    label: 'Current 2025 Baseline',
    desc: 'Existing global policy momentum and fossil reliance',
    levers: { cleanGrid: 32, heatPumps: 18, cleanMobility: 16, plantDiet: 14, carbonRemoval: 8 },
  },
  {
    label: 'IPCC 1.5°C Pathway',
    desc: 'Targeted net-zero halving by 2030 and full decarbonization by 2050',
    levers: { cleanGrid: 85, heatPumps: 75, cleanMobility: 80, plantDiet: 65, carbonRemoval: 50 },
  },
  {
    label: 'Full Tech & Nature Marshall Plan',
    desc: 'Aggressive rapid deployment of all 12 engineered solutions',
    levers: { cleanGrid: 100, heatPumps: 95, cleanMobility: 90, plantDiet: 85, carbonRemoval: 80 },
  },
];

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ onNavigate }) => {
  const [levers, setLevers] = useState<LeverState>(DEFAULT_LEVERS);
  const [targetYear, setTargetYear] = useState<2025 | 2030 | 2040 | 2050>(2035);

  const updateLever = (key: keyof LeverState, val: number) => {
    setLevers((prev) => ({ ...prev, [key]: val }));
  };

  // Thermodynamic & Climate Projection Calculations
  const calculated = useMemo(() => {
    // Weighted abatement score (0 - 100)
    const compositeScore =
      levers.cleanGrid * 0.3 +
      levers.heatPumps * 0.2 +
      levers.cleanMobility * 0.25 +
      levers.plantDiet * 0.15 +
      levers.carbonRemoval * 0.1;

    // Projected Global Emissions by 2050 (Current ~ 40 GtCO2e/yr)
    const residualEmissionsGt = Math.max(0, 42 * (1 - compositeScore / 100)).toFixed(1);

    // Projected Peak Atmospheric Concentration (ppm)
    // 426.8 ppm baseline; without action reaches ~560 ppm; with 100% action stabilizes at ~380-410 ppm
    const projectedPpm = Math.round(560 - (compositeScore / 100) * 160);

    // Projected 2100 Temperature Anomaly above pre-industrial
    const warmingAnomaly = (2.9 - (compositeScore / 100) * 1.5).toFixed(2);

    // Planetary boundary status
    const isParisCompliant = Number(warmingAnomaly) <= 1.6;
    const isCriticalRisk = Number(warmingAnomaly) > 2.2;

    // Avoided economic climate damages (Stern Review ₹15,700/tonne / $185/t social cost of carbon)
    const annualAvoidedGt = Math.max(0, 42 - Number(residualEmissionsGt));
    const annualAvoidedLakhCroreINR = (annualAvoidedGt * 15.7).toFixed(1);

    return {
      compositeScore: Math.round(compositeScore),
      residualEmissionsGt,
      projectedPpm,
      warmingAnomaly,
      isParisCompliant,
      isCriticalRisk,
      annualAvoidedLakhCroreINR,
    };
  }, [levers]);

  return (
    <div className="bg-white dark:bg-[#111C13] border border-[#E0E7DE] dark:border-[#1E3021] rounded-[36px] p-6 sm:p-10 shadow-xs space-y-8 transition-colors">
      {/* Header & Mission */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E0E7DE] dark:border-[#1E3021]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851] dark:text-[#B59F76]">
              Interactive Atmospheric Modeling Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#D9E4D1] dark:bg-[#1C3320] text-[#142616] dark:text-[#52e35b] border border-[#CCD9C3] dark:border-[#2F4D33]">
              IPCC AR6 INTEGRATED
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] tracking-tight">
            Decarbonization Pathway & Planetary Warming Dial
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6658] dark:text-[#9CB395] leading-relaxed">
            Adjust the 5 core decarbonization levers to simulate how scaling our 12 engineering solutions
            shifts atmospheric CO₂ ppm, stabilizes global warming, and protects the biosphere.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setLevers(p.levers)}
              className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#F7F9F6] dark:bg-[#162418] border border-[#E0E7DE] dark:border-[#243827] hover:bg-[#F1EFEC] dark:hover:bg-[#1E3020] hover:text-[#1D2B17] dark:hover:text-white text-[#5C6658] dark:text-[#9CB395] transition-all cursor-pointer"
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setLevers(DEFAULT_LEVERS)}
            className="p-2 text-[#737C70] dark:text-[#9CB395] hover:text-[#1D2B17] dark:hover:text-white hover:bg-[#F1EFEC] dark:hover:bg-[#1E3020] rounded-full transition-colors cursor-pointer"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Grid: Levers on Left, Real-Time Projection on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 5 Tactile Levers (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1D2B17] dark:text-[#EEF5ED] flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-[#52e35b]" />
              <span>Technology & Behavioral Adoption Levers</span>
            </h3>
            <span className="text-xs font-mono text-[#8C7851] dark:text-[#B59F76]">Global Scale Multiplier</span>
          </div>

          <div className="space-y-4">
            {/* Lever 1: Clean Grid */}
            <div className="bg-[#F7F9F6] dark:bg-[#142216] p-4.5 rounded-2xl border border-[#E0E7DE] dark:border-[#203422] space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#1A2C1D] border border-[#E0E7DE] dark:border-[#2B422F] flex items-center justify-center text-[#8C7851] dark:text-[#B59F76]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED]">Grid Decarbonization & BESS Storage</p>
                    <p className="text-[11px] text-[#737C70] dark:text-[#8E9F8B]">Solar PV, wind microgrids & LiFePO4 peak shaving</p>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-[#1D2B17] dark:text-white">{levers.cleanGrid}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={levers.cleanGrid}
                onChange={(e) => updateLever('cleanGrid', Number(e.target.value))}
                className="w-full accent-emerald-600 dark:accent-[#52e35b] cursor-pointer"
              />
            </div>

            {/* Lever 2: Building Electrification */}
            <div className="bg-[#F7F9F6] dark:bg-[#142216] p-4.5 rounded-2xl border border-[#E0E7DE] dark:border-[#203422] space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#1A2C1D] border border-[#E0E7DE] dark:border-[#2B422F] flex items-center justify-center text-emerald-600 dark:text-[#52e35b]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED]">Heat Pump Retrofits & Deep Insulation</p>
                    <p className="text-[11px] text-[#737C70] dark:text-[#8E9F8B]">Vapor-compression heating (COP &gt;3.5) & envelope air-sealing</p>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-[#1D2B17] dark:text-white">{levers.heatPumps}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={levers.heatPumps}
                onChange={(e) => updateLever('heatPumps', Number(e.target.value))}
                className="w-full accent-emerald-600 dark:accent-[#52e35b] cursor-pointer"
              />
            </div>

            {/* Lever 3: Clean Mobility */}
            <div className="bg-[#F7F9F6] dark:bg-[#142216] p-4.5 rounded-2xl border border-[#E0E7DE] dark:border-[#203422] space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#1A2C1D] border border-[#E0E7DE] dark:border-[#2B422F] flex items-center justify-center text-emerald-600 dark:text-[#52e35b]">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED]">Electric Fleet, Rail & Micromobility</p>
                    <p className="text-[11px] text-[#737C70] dark:text-[#8E9F8B]">Tailpipe elimination, electric bus transit & rail substitution</p>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-[#1D2B17] dark:text-white">{levers.cleanMobility}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={levers.cleanMobility}
                onChange={(e) => updateLever('cleanMobility', Number(e.target.value))}
                className="w-full accent-emerald-600 dark:accent-[#52e35b] cursor-pointer"
              />
            </div>

            {/* Lever 4: Plant-Rich Diet */}
            <div className="bg-[#F7F9F6] dark:bg-[#142216] p-4.5 rounded-2xl border border-[#E0E7DE] dark:border-[#203422] space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#1A2C1D] border border-[#E0E7DE] dark:border-[#2B422F] flex items-center justify-center text-[#8C7851] dark:text-[#B59F76]">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED]">Low-Ruminant Diet & Food Waste Diversion</p>
                    <p className="text-[11px] text-[#737C70] dark:text-[#8E9F8B]">Halving enteric methane & 100% aerobic food scrap composting</p>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-[#1D2B17] dark:text-white">{levers.plantDiet}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={levers.plantDiet}
                onChange={(e) => updateLever('plantDiet', Number(e.target.value))}
                className="w-full accent-emerald-600 dark:accent-[#52e35b] cursor-pointer"
              />
            </div>

            {/* Lever 5: Carbon Removal */}
            <div className="bg-[#F7F9F6] dark:bg-[#142216] p-4.5 rounded-2xl border border-[#E0E7DE] dark:border-[#203422] space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white dark:bg-[#1A2C1D] border border-[#E0E7DE] dark:border-[#2B422F] flex items-center justify-center text-emerald-600 dark:text-[#52e35b]">
                    <Trees className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED]">Urban Afforestation & Biochar Sequestration</p>
                    <p className="text-[11px] text-[#737C70] dark:text-[#8E9F8B]">Deep mycorrhizal root systems & durable soil organic carbon</p>
                  </div>
                </div>
                <span className="font-mono text-sm font-bold text-[#1D2B17] dark:text-white">{levers.carbonRemoval}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={levers.carbonRemoval}
                onChange={(e) => updateLever('carbonRemoval', Number(e.target.value))}
                className="w-full accent-emerald-600 dark:accent-[#52e35b] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Real-Time Outcome Gauges & Trajectory Visualizer (5 cols) */}
        <div className="lg:col-span-5 bg-[#0F190D] rounded-3xl p-6 sm:p-7 text-white border border-[#2B3E24] flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
          {/* Subtle atmospheric gradient in background */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#4A6741]/20 blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider text-[#9CB395] uppercase">
                CLIMATE TRAJECTORY OUTCOME
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                  calculated.isParisCompliant
                    ? 'bg-[#2E543B] text-[#D9E4D1]'
                    : calculated.isCriticalRisk
                    ? 'bg-[#5A241C] text-[#FFC4BA]'
                    : 'bg-[#524424] text-[#EAD8B0]'
                }`}
              >
                {calculated.isParisCompliant ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-[#78B169]" />
                    <span>PARIS 1.5°C ALIGNED</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-[#FF9B8A]" />
                    <span>OVERSHOOT TRAJECTORY</span>
                  </>
                )}
              </span>
            </div>

            {/* Big Temperature Metric */}
            <div className="space-y-1">
              <p className="text-xs text-[#9CB395] font-mono">PROJECTED 2100 WARMING ANOMALY</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                  +{calculated.warmingAnomaly}°C
                </span>
                <span className="text-xs text-[#9CB395] font-mono">above pre-industrial</span>
              </div>
            </div>

            {/* Dynamic SVG Trajectory Arc */}
            <div className="bg-[#182414] p-4 rounded-2xl border border-[#2B3E24] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#9CB395]">Stabilization CO₂ Level:</span>
                <span className="text-white font-bold">{calculated.projectedPpm} ppm</span>
              </div>

              {/* Progress bar comparing 350ppm (safe) -> 430ppm (1.5C) -> 560ppm (dangerous) */}
              <div className="w-full h-2.5 bg-[#263820] rounded-full overflow-hidden relative">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    calculated.isParisCompliant
                      ? 'bg-gradient-to-r from-[#4A6741] to-[#78B169]'
                      : calculated.isCriticalRisk
                      ? 'bg-gradient-to-r from-[#8C7851] to-[#D9534F]'
                      : 'bg-gradient-to-r from-[#78B169] to-[#8C7851]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(15, (calculated.projectedPpm - 350) / 2.1))}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#737C70] pt-1">
                <span>350 ppm (Safe)</span>
                <span>430 ppm (1.5°C limit)</span>
                <span>560 ppm (2.9°C)</span>
              </div>
            </div>

            {/* Statistical Impact Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="bg-[#182414] p-3 rounded-xl border border-[#2B3E24] space-y-0.5">
                <span className="text-[10px] text-[#737C70] block">RESIDUAL EMISSIONS</span>
                <span className="text-lg font-bold text-white">{calculated.residualEmissionsGt} Gt/yr</span>
              </div>
              <div className="bg-[#182414] p-3 rounded-xl border border-[#2B3E24] space-y-0.5">
                <span className="text-[10px] text-[#737C70] block">AVOIDED DAMAGES</span>
                <span className="text-lg font-bold text-[#D9E4D1]">₹{calculated.annualAvoidedLakhCroreINR} Lakh Cr/yr</span>
              </div>
            </div>
          </div>

          {/* Action to Implement in Planner */}
          <div className="pt-4 border-t border-[#2B3E24] relative z-10">
            <button
              onClick={() => onNavigate('solutions')}
              className="w-full py-3 bg-[#4A6741] hover:bg-[#3E5637] text-white rounded-full text-xs font-bold font-sans flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Deploy Solutions from Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
