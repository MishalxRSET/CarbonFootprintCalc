import React, { useState, useMemo } from 'react';
import { ReductionStrategy, CalculationResult, PageTab } from '../types';
import { REDUCTION_STRATEGIES } from '../data/carbonData';
import { formatINR } from '../utils/currency';
import { SpotlightCard, CountUp, ShinyText, Magnet } from './reactbits';
import { SmartReductionTipsSidebar } from './SmartReductionTipsSidebar';
import {
  Target,
  CheckCircle2,
  PlusCircle,
  Clock,
  Sparkles,
  TrendingDown,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface PlannerViewProps {
  currentCalculation: CalculationResult;
  onNavigate: (tab: PageTab) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ currentCalculation, onNavigate }) => {
  // Baseline tonnes from calculation
  const baselineKg = currentCalculation.totalAnnualKgCO2e;
  const baselineTonnes = currentCalculation.totalAnnualTonnesCO2e;

  // Reduction target percentage (e.g., 30%, 50%, 75%)
  const [targetPercent, setTargetPercent] = useState<number>(40);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>([
    'solar_pv_rooftop',
    'plant_rich_dietary_shift',
    'multimodal_transit_carpool',
    'food_waste_diversion_compost',
  ]);
  const [expandedStrategyId, setExpandedStrategyId] = useState<string | null>('solar_pv_rooftop');

  // Toggle strategy selection
  const toggleStrategy = (id: string) => {
    setSelectedStrategyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter strategies
  const filteredStrategies = useMemo(() => {
    if (categoryFilter === 'All') return REDUCTION_STRATEGIES;
    return REDUCTION_STRATEGIES.filter((s) => s.category === categoryFilter);
  }, [categoryFilter]);

  // Aggregate selected reductions
  const { totalAbatedKg, totalAbatedTonnes, netRemainingTonnes, percentAchieved, annualFinancialSavingsEstimate } =
    useMemo(() => {
      const selected = REDUCTION_STRATEGIES.filter((s) => selectedStrategyIds.includes(s.id));
      const abatedKg = selected.reduce((sum, s) => sum + s.potentialReductionKgCO2e, 0);
      const abatedTonnes = Number((abatedKg / 1000).toFixed(2));
      const remainingKg = Math.max(0, baselineKg - abatedKg);
      const remainingTonnes = Number((remainingKg / 1000).toFixed(2));

      const targetKgReduction = baselineKg * (targetPercent / 100);
      const achieved = targetKgReduction > 0 ? Math.min(100, Math.round((abatedKg / targetKgReduction) * 100)) : 0;

      // Approximate financial savings in India (~₹18.5/kg for fuel, utility tariff reduction & food waste prevention)
      const approxSavingsINR = Math.round(abatedKg * 18.5);

      return {
        totalAbatedKg: abatedKg,
        totalAbatedTonnes: abatedTonnes,
        netRemainingTonnes: remainingTonnes,
        percentAchieved: achieved,
        annualFinancialSavingsEstimate: approxSavingsINR,
      };
    }, [selectedStrategyIds, baselineKg, targetPercent]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Engineering Roadmaps
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#D9E4D1] text-[#1D2B17] border border-[#CCD9C3]">
              Active Simulator
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1D2B17] tracking-tight mt-1">
            Carbon Reduction Planner & Action Roadmap
          </h1>
          <p className="text-sm text-[#5C6658] mt-1 max-w-2xl">
            Formulate an evidence-based decarbonization plan. Select modular interventions and inspect verified pros & ROI from the team's Drive research.
          </p>
        </div>

        {/* Target Slider Control */}
        <div className="bg-white border border-[#E0E7DE] rounded-full px-4 py-2 shadow-2xs flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#4A6741]" />
            <span className="text-xs font-semibold text-[#5C6658]">Target Reduction:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[25, 40, 60, 80].map((pct) => (
              <button
                key={pct}
                id={`target-pct-${pct}-btn`}
                onClick={() => setTargetPercent(pct)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                  targetPercent === pct
                    ? 'bg-[#4A6741] text-white shadow-xs'
                    : 'bg-[#F1EFEC] text-[#5C6658] hover:text-[#1D2B17]'
                }`}
              >
                -{pct}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress & Target Summary Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SpotlightCard
          spotlightColor="rgba(140, 120, 81, 0.12)"
          className="bg-white border border-[#E0E7DE] rounded-[28px] p-6 shadow-xs space-y-1"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">Current Baseline</span>
          <p className="text-3xl font-serif font-medium text-[#1D2B17] mt-1">
            {baselineTonnes} <span className="text-xs font-bold text-[#737C70]">tCO₂e/yr</span>
          </p>
          <p className="text-[11px] text-[#737C70] pt-1">From interactive calculator</p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(74, 103, 65, 0.15)"
          className="bg-[#D9E4D1] border border-[#CCD9C3] rounded-[28px] p-6 shadow-xs space-y-1"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4A6741] flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Total Carbon Abated
          </span>
          <p className="text-3xl font-serif font-medium text-[#1D2B17] mt-1">
            -{totalAbatedTonnes} <span className="text-xs font-bold text-[#4A6741]">tCO₂e/yr</span>
          </p>
          <p className="text-[11px] text-[#3E5637] pt-1">
            {selectedStrategyIds.length} active initiatives selected
          </p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(92, 102, 88, 0.12)"
          className="bg-[#F1EFEC] border border-[#E8E4DF] rounded-[28px] p-6 shadow-xs space-y-1"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C6658]">Projected Net Emissions</span>
          <p className="text-3xl font-serif font-medium text-[#1D2B17] mt-1">
            {netRemainingTonnes} <span className="text-xs font-bold text-[#737C70]">tCO₂e/yr</span>
          </p>
          <p className="text-[11px] text-[#737C70] pt-1">
            {Math.round((totalAbatedKg / baselineKg) * 100)}% overall footprint reduction
          </p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(140, 120, 81, 0.15)"
          className="bg-white border border-[#E0E7DE] rounded-[28px] p-6 shadow-xs space-y-1"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851] flex items-center gap-1">
            <span className="font-bold text-sm">₹</span> Estimated Annual Savings
          </span>
          <p className="text-3xl font-serif font-medium text-[#1D2B17] mt-1">
            {formatINR(annualFinancialSavingsEstimate)}
          </p>
          <p className="text-[11px] text-[#737C70] pt-1">Direct fuel, utility & waste savings</p>
        </SpotlightCard>
      </div>

      {/* Target Progress Bar */}
      <div className="bg-white border border-[#E0E7DE] rounded-[24px] p-6 shadow-xs space-y-3">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-[#2D332B]">
            Progress toward {targetPercent}% Abatement Goal ({((baselineKg * targetPercent) / 100000).toFixed(2)} tonnes)
          </span>
          <span className={percentAchieved >= 100 ? 'text-[#4A6741] font-extrabold' : 'text-[#8C7851] font-extrabold'}>
            {percentAchieved}% of Target Goal Met
          </span>
        </div>
        <div className="w-full bg-[#E0E7DE] rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              percentAchieved >= 100 ? 'bg-[#4A6741]' : 'bg-[#4A6741]/80'
            }`}
            style={{ width: `${Math.min(100, percentAchieved)}%` }}
          />
        </div>
      </div>

      {/* Main Content Area: Left Strategies & Right AI Smart Reduction Tips Sidebar */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Column: Strategy Filter & Cards */}
        <div className="flex-1 w-full space-y-6">
          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#5C6658] font-medium flex items-center gap-1 pr-1">
              <Filter className="w-3.5 h-3.5 text-[#8C7851]" /> Category:
            </span>
            {['All', 'Energy', 'Transport', 'Diet & Agriculture', 'Waste & Circularity'].map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/[^a-z]/g, '-')}-btn`}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#4A6741] text-white shadow-xs'
                    : 'bg-white border border-[#E0E7DE] text-[#5C6658] hover:text-[#1D2B17] hover:bg-[#F1EFEC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Strategies List with Granular "PROS" Breakdown */}
          <div className="space-y-4">
            {filteredStrategies.map((strategy) => {
              const isSelected = selectedStrategyIds.includes(strategy.id);
              const isExpanded = expandedStrategyId === strategy.id;

              return (
                <div
                  key={strategy.id}
                  className={`bg-white rounded-[24px] border transition-all shadow-xs ${
                    isSelected ? 'border-[#4A6741] ring-1 ring-[#4A6741]/30' : 'border-[#E0E7DE] hover:border-[#CCD9C3]'
                  }`}
                >
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <button
                        id={`toggle-strategy-${strategy.id}-btn`}
                        onClick={() => toggleStrategy(strategy.id)}
                        className={`mt-0.5 rounded-full p-2 transition-colors ${
                          isSelected
                            ? 'bg-[#4A6741] text-white shadow-xs'
                            : 'bg-[#F1EFEC] text-[#737C70] hover:text-[#4A6741] hover:bg-[#D9E4D1]/40'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-semibold px-3 py-0.5 rounded-full bg-[#F1EFEC] text-[#5C6658] border border-[#E8E4DF]">
                            {strategy.category}
                          </span>
                          <h2 className="text-base font-bold text-[#1D2B17]">{strategy.title}</h2>
                        </div>
                        <p className="text-xs text-[#5C6658] leading-relaxed max-w-3xl">
                          {strategy.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:pl-5 sm:border-l border-[#E0E7DE] shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#4A6741] block">
                          -{(strategy.potentialReductionKgCO2e / 1000).toFixed(2)} t CO₂e
                        </span>
                        <p className="text-[11px] text-[#737C70]">Payback: {strategy.paybackPeriod}</p>
                      </div>

                      <button
                        id={`expand-strategy-${strategy.id}-btn`}
                        onClick={() => setExpandedStrategyId(isExpanded ? null : strategy.id)}
                        className="px-4 py-2 text-xs font-semibold rounded-full bg-[#F1EFEC] hover:bg-[#E8E4DF] text-[#1D2B17] border border-[#E8E4DF] transition-colors"
                      >
                        {isExpanded ? 'Hide Pros' : 'Inspect Pros'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded "PROS & ADVANTAGES" Panel (Directly addressing user prompt) */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-3 border-t border-[#E0E7DE] bg-[#F7F9F6] rounded-b-[24px]">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-4 h-4 text-[#4A6741]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1D2B17]">
                          Evaluated Pros & Engineering Advantages (From Drive Research Deck)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                        <div className="p-4 bg-white border border-[#E0E7DE] rounded-2xl space-y-1 shadow-2xs">
                          <span className="font-bold text-[#4A6741] block">1. Environmental Pro</span>
                          <p className="text-[#5C6658] leading-relaxed">{strategy.pros.environmental}</p>
                        </div>

                        <div className="p-4 bg-white border border-[#E0E7DE] rounded-2xl space-y-1 shadow-2xs">
                          <span className="font-bold text-[#8C7851] block">2. Economic / ROI Pro</span>
                          <p className="text-[#5C6658] leading-relaxed">{strategy.pros.economic}</p>
                        </div>

                        <div className="p-4 bg-white border border-[#E0E7DE] rounded-2xl space-y-1 shadow-2xs">
                          <span className="font-bold text-[#4A6741] block">3. Health & Social Pro</span>
                          <p className="text-[#5C6658] leading-relaxed">{strategy.pros.healthOrSocial}</p>
                        </div>

                        <div className="p-4 bg-white border border-[#E0E7DE] rounded-2xl space-y-1 shadow-2xs">
                          <span className="font-bold text-[#8C7851] block">4. Efficiency & Tech Pro</span>
                          <p className="text-[#5C6658] leading-relaxed">{strategy.pros.efficiency}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Smart Reduction Tips AI-Generated Sidebar */}
        <SmartReductionTipsSidebar
          calculation={currentCalculation}
          onApplyStrategy={(category) => {
            // Map tip categories to strategy filter categories
            if (category.includes('Transport')) setCategoryFilter('Transport');
            else if (category.includes('Energy')) setCategoryFilter('Energy');
            else if (category.includes('Diet')) setCategoryFilter('Diet & Agriculture');
            else if (category.includes('Waste')) setCategoryFilter('Waste & Circularity');
            else setCategoryFilter('All');
          }}
        />
      </div>

      {/* Phased Roadmap Timeline Card */}
      <div className="bg-white border border-[#E0E7DE] rounded-[32px] p-8 shadow-xs space-y-6">
        <h3 className="text-2xl font-serif text-[#1D2B17]">
          3-Phase Strategic Decarbonization Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-5 bg-[#F7F9F6] border border-[#E0E7DE] rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1D2B17]">Phase 1: Operational Quick-Wins</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D9E4D1] text-[#1D2B17] font-bold text-[10px]">Months 1–3</span>
            </div>
            <p className="text-[#5C6658] leading-relaxed">
              LED retrofitting, smart programmable thermostats, FIFO food inventory to eliminate food spoilage, and active carpool pairing.
            </p>
            <p className="text-[11px] font-semibold text-[#4A6741]">Expected reduction: 12–18%</p>
          </div>

          <div className="p-5 bg-[#F7F9F6] border border-[#E0E7DE] rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1D2B17]">Phase 2: Efficiency Upgrades</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F1EFEC] text-[#5C6658] border border-[#E8E4DF] font-bold text-[10px]">Months 4–12</span>
            </div>
            <p className="text-[#5C6658] leading-relaxed">
              Heat pump space & water heating transition, plant-rich dietary defaults, public transit pass subsidies, and circular electronic repairs.
            </p>
            <p className="text-[11px] font-semibold text-[#4A6741]">Expected reduction: 25–40%</p>
          </div>

          <div className="p-5 bg-[#F7F9F6] border border-[#E0E7DE] rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1D2B17]">Phase 3: Deep Decarbonization</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#4A6741] text-white font-bold text-[10px]">Years 2–5</span>
            </div>
            <p className="text-[#5C6658] leading-relaxed">
              Rooftop solar PV installation with net-metering, commercial/fleet EV transition, on-site aerobic composting, and institutional microgrid storage.
            </p>
            <p className="text-[11px] font-semibold text-[#4A6741]">Expected reduction: 60–85% (Net Zero pathway)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
