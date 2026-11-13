import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ReductionStrategy, CalculationResult, PageTab } from '../types';
import { REDUCTION_STRATEGIES } from '../data/carbonData';
import { formatINR } from '../utils/currency';
import { SpotlightCard, CountUp, ShinyText, Magnet } from './reactbits';
import { SmartReductionTipsSidebar } from './SmartReductionTipsSidebar';
import { fireCelebrationConfetti } from '../utils/confetti';
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
  FileDown,
  Cloud,
  Loader2,
  LineChart as LineChartIcon,
  Search,
  Zap,
  Leaf,
  Sliders,
  DollarSign,
  PartyPopper,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { exportCarbonReductionPdf, TrajectoryPoint } from '../utils/pdfExport';
import { motion, AnimatePresence } from 'motion/react';

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
  const [strategySearch, setStrategySearch] = useState<string>('');
  const [projectionHorizon, setProjectionHorizon] = useState<5 | 10>(5);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [pdfExportSuccess, setPdfExportSuccess] = useState<boolean>(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>([
    'solar_pv_rooftop',
    'plant_rich_dietary_shift',
    'multimodal_transit_carpool',
    'food_waste_diversion_compost',
  ]);
  const [expandedStrategyId, setExpandedStrategyId] = useState<string | null>('solar_pv_rooftop');
  const [hasCelebratedTarget, setHasCelebratedTarget] = useState(false);

  // Toggle strategy selection
  const toggleStrategy = (id: string) => {
    setSelectedStrategyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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

  // Trigger celebration confetti when 100% target is hit
  useEffect(() => {
    if (percentAchieved >= 100 && !hasCelebratedTarget) {
      fireCelebrationConfetti();
      setHasCelebratedTarget(true);
    } else if (percentAchieved < 100 && hasCelebratedTarget) {
      setHasCelebratedTarget(false);
    }
  }, [percentAchieved, hasCelebratedTarget]);

  // Filter strategies by category and search
  const filteredStrategies = useMemo(() => {
    return REDUCTION_STRATEGIES.filter((s) => {
      if (categoryFilter !== 'All' && s.category !== categoryFilter) return false;
      if (strategySearch.trim()) {
        const q = strategySearch.toLowerCase();
        return (
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [categoryFilter, strategySearch]);

  // Scenario presets
  const applyScenario = (type: 'quick_wins' | 'clean_energy' | 'paris_fast' | 'all') => {
    if (type === 'quick_wins') {
      // Zero or low capex quick wins
      setSelectedStrategyIds([
        'plant_rich_dietary_shift',
        'food_waste_diversion_compost',
        'multimodal_transit_carpool',
        'appliance_efficiency_phantom_load',
      ]);
      setTargetPercent(30);
    } else if (type === 'clean_energy') {
      setSelectedStrategyIds([
        'solar_pv_rooftop',
        'induction_cooking_transition',
        'heat_pump_water_heater',
        'appliance_efficiency_phantom_load',
      ]);
      setTargetPercent(50);
    } else if (type === 'paris_fast') {
      setSelectedStrategyIds([
        'solar_pv_rooftop',
        'electric_vehicle_transition',
        'plant_rich_dietary_shift',
        'heat_pump_water_heater',
        'food_waste_diversion_compost',
        'multimodal_transit_carpool',
      ]);
      setTargetPercent(60);
    } else {
      setSelectedStrategyIds(REDUCTION_STRATEGIES.map((s) => s.id));
      setTargetPercent(75);
    }
    fireCelebrationConfetti();
  };

  // Currently active strategy objects
  const selectedStrategies = useMemo(() => {
    return REDUCTION_STRATEGIES.filter((s) => selectedStrategyIds.includes(s.id));
  }, [selectedStrategyIds]);

  // Projected emissions trajectory data over time (Recharts data)
  const projectionData = useMemo<TrajectoryPoint[]>(() => {
    const yearsCount = projectionHorizon;
    const currentYear = new Date().getFullYear();

    // Group selected strategies by rollout phase to compute phased ramp-up
    const phase1AbatementKg = selectedStrategies
      .filter((s) => s.implementationEase === 'Easy' || s.costEstimate === 'Free' || s.costEstimate === 'Low (₹)')
      .reduce((acc, s) => acc + s.potentialReductionKgCO2e, 0);

    const phase2AbatementKg = selectedStrategies
      .filter((s) => s.implementationEase === 'Medium' || s.costEstimate === 'Moderate (₹₹)')
      .reduce((acc, s) => acc + s.potentialReductionKgCO2e, 0);

    const phase3AbatementKg = selectedStrategies
      .filter((s) => s.implementationEase === 'Complex' || s.costEstimate === 'High (₹₹₹)')
      .reduce((acc, s) => acc + s.potentialReductionKgCO2e, 0);

    const points: TrajectoryPoint[] = [];

    for (let i = 0; i <= yearsCount; i++) {
      const yearLabel = i === 0 ? 'Baseline (Now)' : `Year ${i} (${currentYear + i})`;
      const shortLabel = i === 0 ? 'Now' : `Yr ${i}`;

      const bauVal = Number((baselineTonnes * Math.pow(1.012, i)).toFixed(2));

      let activeFraction = 0;
      if (i === 0) {
        activeFraction = 0;
      } else if (i === 1) {
        activeFraction = totalAbatedKg > 0 ? (phase1AbatementKg * 0.75 + phase2AbatementKg * 0.3) / totalAbatedKg : 0.3;
      } else if (i === 2) {
        activeFraction = totalAbatedKg > 0 ? (phase1AbatementKg * 1.0 + phase2AbatementKg * 0.75 + phase3AbatementKg * 0.35) / totalAbatedKg : 0.65;
      } else if (i === 3) {
        activeFraction = totalAbatedKg > 0 ? (phase1AbatementKg * 1.0 + phase2AbatementKg * 1.0 + phase3AbatementKg * 0.8) / totalAbatedKg : 0.85;
      } else {
        const efficiencyCompound = Math.min(1.15, 1.0 + (i - 3) * 0.02);
        activeFraction = Math.min(1.0, efficiencyCompound);
      }

      const activeAbatementTonnes = Number(((totalAbatedKg * activeFraction) / 1000).toFixed(2));
      const projectedTonnes = Math.max(0, Number((baselineTonnes - activeAbatementTonnes).toFixed(2)));
      const cumulativeSaved = Number(
        (i === 0 ? 0 : points.reduce((sum, p) => sum + (p.bau - p.projected), 0) + (bauVal - projectedTonnes)).toFixed(2)
      );

      points.push({
        year: yearLabel,
        shortYear: shortLabel,
        bau: bauVal,
        projected: projectedTonnes,
        abatedThisYear: activeAbatementTonnes,
        cumulativeSaved: cumulativeSaved,
      });
    }

    return points;
  }, [projectionHorizon, baselineTonnes, totalAbatedKg, selectedStrategies]);

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setPdfExportSuccess(false);

    try {
      await exportCarbonReductionPdf({
        calculation: currentCalculation,
        selectedStrategies,
        totalAbatedTonnes,
        netRemainingTonnes,
        percentAchieved,
        targetPercent,
        annualSavingsINR: annualFinancialSavingsEstimate,
        projectionData,
      });

      setPdfExportSuccess(true);
      fireCelebrationConfetti();
      setTimeout(() => setPdfExportSuccess(false), 3500);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in pb-20">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8EFE5] dark:bg-[#1F2E1D] text-[#2E4726] dark:text-[#A8C7A0] text-xs font-bold rounded-full border border-[#D0DFCB] dark:border-[#2F442C] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Roadmap Modeler</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-semibold text-[#1D2B17] dark:text-[#EEF5ED] tracking-[-0.045em] leading-[0.98]">
            Climate Action & Decarbonization Planner
          </h1>
          <p className="text-sm text-[#5C6658] dark:text-[#9DB099] mt-1 max-w-2xl">
            Model actionable emissions abatement strategies, simulate phased capital rollouts, and project cumulative multi-year financial returns.
          </p>
        </div>

        {/* Global Action CTA Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Save to Google Drive Button */}
          <button
            id="planner-save-to-drive-btn"
            type="button"
            onClick={() => onNavigate('drive_save')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm bg-[#E8EFE5] dark:bg-[#1F2E1D] hover:bg-[#D9E6D4] text-[#1D2B17] dark:text-[#EEF5ED] border border-[#CCD9C3] dark:border-[#2F442C] transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Cloud className="w-4 h-4 text-[#4A6741] dark:text-[#78B169]" />
            <span>Save Plan to Google Drive</span>
          </button>

          {/* Download PDF Report Button */}
          <button
            id="download-reduction-plan-pdf-btn"
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
              pdfExportSuccess
                ? 'bg-[#2E7D32] text-white ring-2 ring-[#2E7D32]/40'
                : 'bg-[#1D2B17] dark:bg-[#4A6741] hover:bg-[#2F472A] text-white hover:shadow-lg'
            }`}
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating...</span>
              </>
            ) : pdfExportSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D9E4D1]" />
                <span>PDF Exported!</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4 text-[#78B169]" />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Target Goal Selector & Scenario Presets Bar */}
      <div className="p-5 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-3xl shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C6658] dark:text-[#9DB099] flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#4A6741] dark:text-[#78B169]" /> Abatement Target:
            </span>
            <div className="flex items-center gap-1.5">
              {[25, 40, 50, 65, 80].map((pct) => (
                <button
                  key={pct}
                  id={`target-btn-${pct}`}
                  type="button"
                  onClick={() => setTargetPercent(pct)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    targetPercent === pct
                      ? 'bg-[#4A6741] text-white shadow-xs scale-105'
                      : 'bg-[#F1EFEC] dark:bg-[#1A2619] text-[#5C6658] dark:text-[#9DB099] hover:bg-[#E0E7DE] hover:text-[#1D2B17]'
                  }`}
                >
                  -{pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Quick Scenario Bundles */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#737C70] dark:text-[#839580] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#8C7851] dark:text-[#D4AF37]" /> 1-Click Bundles:
            </span>
            <button
              id="bundle-quick-wins"
              type="button"
              onClick={() => applyScenario('quick_wins')}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] text-[#1D2B17] dark:text-[#EEF5ED] hover:bg-[#E8EFE5] transition-all cursor-pointer"
            >
              ⚡ Quick Wins (₹0 Upfront)
            </button>
            <button
              id="bundle-clean-energy"
              type="button"
              onClick={() => applyScenario('clean_energy')}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] text-[#1D2B17] dark:text-[#EEF5ED] hover:bg-[#E8EFE5] transition-all cursor-pointer"
            >
              ☀️ Clean Power Pack
            </button>
            <button
              id="bundle-paris"
              type="button"
              onClick={() => applyScenario('paris_fast')}
              className="px-3 py-1 text-xs font-semibold rounded-full bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] text-[#4A6741] dark:text-[#78B169] hover:bg-[#E8EFE5] transition-all cursor-pointer font-bold"
            >
              🌿 Paris 1.5°C Fast Track
            </button>
          </div>
        </div>

        {/* Target Progress Bar & Celebratory Callout */}
        <div className="space-y-2 pt-2 border-t border-[#F1EFEC] dark:border-[#263824]">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-[#2D332B] dark:text-[#D1E0CE] flex items-center gap-2">
              <span>Goal: Reduce {((baselineKg * targetPercent) / 100000).toFixed(2)} tonnes CO₂e</span>
              {percentAchieved >= 100 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D9E4D1] dark:bg-[#1A2E19] text-[#1D2B17] dark:text-[#A8C7A0] text-[10px] animate-bounce">
                  <PartyPopper className="w-3 h-3 text-[#4A6741]" /> Target Achieved!
                </span>
              )}
            </span>
            <span className={percentAchieved >= 100 ? 'text-[#4A6741] dark:text-[#78B169] font-extrabold' : 'text-[#8C7851] dark:text-[#D4AF37] font-extrabold'}>
              {percentAchieved}% of Target Met
            </span>
          </div>

          <div className="w-full bg-[#E0E7DE] dark:bg-[#263824] rounded-full h-3 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, percentAchieved)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                percentAchieved >= 100 ? 'bg-[#4A6741] dark:bg-[#78B169]' : 'bg-[#4A6741]/80 dark:bg-[#78B169]/80'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Progress & Target Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard
          spotlightColor="rgba(140, 120, 81, 0.12)"
          className="bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-[28px] p-6 shadow-xs space-y-1"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851] dark:text-[#D4AF37]">Current Baseline</span>
          <p className="text-3xl font-serif font-medium text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
            {baselineTonnes} <span className="text-xs font-bold text-[#737C70] dark:text-[#839580]">tCO₂e/yr</span>
          </p>
          <p className="text-[11px] text-[#737C70] dark:text-[#839580] pt-1">From interactive footprint model</p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(74, 103, 65, 0.15)"
          className="bg-[#D9E4D1] dark:bg-[#1A2E19] border border-[#CCD9C3] dark:border-[#2F442C] rounded-[28px] p-6 shadow-xs space-y-1"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4A6741] dark:text-[#78B169] flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Total Carbon Abated
          </span>
          <p className="text-3xl font-serif font-medium text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
            -{totalAbatedTonnes} <span className="text-xs font-bold text-[#4A6741] dark:text-[#78B169]">tCO₂e/yr</span>
          </p>
          <p className="text-[11px] text-[#3E5637] dark:text-[#A8C7A0] pt-1">
            {selectedStrategyIds.length} active initiatives selected
          </p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(92, 102, 88, 0.12)"
          className="bg-[#F1EFEC] dark:bg-[#1A2619] border border-[#E8E4DF] dark:border-[#263824] rounded-[28px] p-6 shadow-xs space-y-1"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5C6658] dark:text-[#9DB099]">Projected Net Emissions</span>
          <p className="text-3xl font-serif font-medium text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
            {netRemainingTonnes} <span className="text-xs font-bold text-[#737C70] dark:text-[#839580]">tCO₂e/yr</span>
          </p>
          <p className="text-[11px] text-[#737C70] dark:text-[#839580] pt-1">
            {Math.round((totalAbatedKg / baselineKg) * 100)}% overall footprint reduction
          </p>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor="rgba(140, 120, 81, 0.15)"
          className="bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-[28px] p-6 shadow-xs space-y-1"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851] dark:text-[#D4AF37] flex items-center gap-1">
            <span className="font-bold text-sm">₹</span> Annual Financial Savings
          </span>
          <p className="text-3xl font-serif font-medium text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
            {formatINR(annualFinancialSavingsEstimate)}
          </p>
          <p className="text-[11px] text-[#737C70] dark:text-[#839580] pt-1">Fuel, utility & food waste savings</p>
        </SpotlightCard>
      </div>

      {/* Dynamic Multi-Year Reduction Trajectory (Recharts Line Graph) */}
      <div
        id="recharts-carbon-trajectory-card"
        className="bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6"
      >
        {/* Chart Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#F1EFEC] dark:border-[#263824]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#D9E4D1] dark:bg-[#1A2E19] text-[#1D2B17] dark:text-[#EEF5ED]">
                <LineChartIcon className="w-4 h-4 text-[#4A6741] dark:text-[#78B169]" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] tracking-tight">
                Emissions Reduction Trajectory Over Time
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5C6658] dark:text-[#9DB099] mt-1">
              Dynamic multi-year simulation comparing Business-As-Usual (BAU) versus your selected decarbonization strategy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Horizon Toggle */}
            <div className="bg-[#F1EFEC] dark:bg-[#1A2619] border border-[#E8E4DF] dark:border-[#263824] rounded-full p-1 flex items-center gap-1">
              <button
                id="horizon-5yr-btn"
                type="button"
                onClick={() => setProjectionHorizon(5)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                  projectionHorizon === 5
                    ? 'bg-white dark:bg-[#141E13] text-[#1D2B17] dark:text-[#EEF5ED] shadow-2xs'
                    : 'text-[#5C6658] dark:text-[#9DB099]'
                }`}
              >
                5-Year Horizon
              </button>
              <button
                id="horizon-10yr-btn"
                type="button"
                onClick={() => setProjectionHorizon(10)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                  projectionHorizon === 10
                    ? 'bg-white dark:bg-[#141E13] text-[#1D2B17] dark:text-[#EEF5ED] shadow-2xs'
                    : 'text-[#5C6658] dark:text-[#9DB099]'
                }`}
              >
                10-Year Horizon
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Container */}
        <div ref={chartContainerRef} className="h-72 sm:h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E7DE" opacity={0.6} />
              <XAxis dataKey="shortYear" stroke="#737C70" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis
                stroke="#737C70"
                tick={{ fontSize: 12 }}
                tickLine={false}
                unit=" t"
                domain={[0, 'dataMax + 0.5']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#CCD9C3',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="bau"
                name="Business-As-Usual (BAU)"
                stroke="#E53935"
                strokeWidth={2.5}
                strokeDasharray="6 6"
                dot={{ r: 4, fill: '#E53935', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#C62828' }}
              />
              <Line
                type="monotone"
                dataKey="projected"
                name="Projected with Active Plan"
                stroke="#2E7D32"
                strokeWidth={3.5}
                dot={{ r: 4.5, fill: '#2E7D32', strokeWidth: 0 }}
                activeDot={{ r: 7, fill: '#1B5E20' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Area: Left Strategies & Right AI Smart Reduction Tips Sidebar */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Column: Strategy Search, Filters & Cards */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-[#737C70] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search strategies (e.g., solar, transit)..."
                value={strategySearch}
                onChange={(e) => setStrategySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-full text-xs text-[#1D2B17] dark:text-[#EEF5ED] focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
              />
            </div>

            {/* Quick Action: Select All / Clear All */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedStrategyIds(REDUCTION_STRATEGIES.map((s) => s.id))}
                className="text-xs font-semibold text-[#4A6741] dark:text-[#78B169] hover:underline px-2 py-1 cursor-pointer"
              >
                Select All
              </button>
              <span className="text-[#E0E7DE] dark:text-[#263824]">|</span>
              <button
                type="button"
                onClick={() => setSelectedStrategyIds([])}
                className="text-xs font-semibold text-[#737C70] dark:text-[#839580] hover:underline px-2 py-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[#5C6658] dark:text-[#9DB099] font-medium flex items-center gap-1 pr-1">
              <Filter className="w-3.5 h-3.5 text-[#8C7851] dark:text-[#D4AF37]" /> Filter:
            </span>
            {['All', 'Energy', 'Transport', 'Diet & Agriculture', 'Waste & Circularity'].map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/[^a-z]/g, '-')}-btn`}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#4A6741] text-white shadow-xs'
                    : 'bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] text-[#5C6658] dark:text-[#9DB099] hover:text-[#1D2B17] hover:bg-[#F1EFEC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Strategies List */}
          <div className="space-y-4">
            {filteredStrategies.map((strategy) => {
              const isSelected = selectedStrategyIds.includes(strategy.id);
              const isExpanded = expandedStrategyId === strategy.id;

              return (
                <motion.div
                  key={strategy.id}
                  layout
                  className={`bg-white dark:bg-[#141E13] rounded-[24px] border transition-all shadow-xs ${
                    isSelected
                      ? 'border-[#4A6741] ring-1 ring-[#4A6741]/30'
                      : 'border-[#E0E7DE] dark:border-[#263824] hover:border-[#CCD9C3]'
                  }`}
                >
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <button
                        id={`toggle-strategy-${strategy.id}-btn`}
                        type="button"
                        onClick={() => toggleStrategy(strategy.id)}
                        className={`mt-0.5 rounded-full p-2 transition-transform active:scale-90 cursor-pointer ${
                          isSelected
                            ? 'bg-[#4A6741] text-white shadow-xs'
                            : 'bg-[#F1EFEC] dark:bg-[#1A2619] text-[#737C70] hover:text-[#4A6741] hover:bg-[#D9E4D1]/40'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-semibold px-3 py-0.5 rounded-full bg-[#F1EFEC] dark:bg-[#1A2619] text-[#5C6658] dark:text-[#9DB099] border border-[#E8E4DF] dark:border-[#263824]">
                            {strategy.category}
                          </span>
                          <h2 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED]">{strategy.title}</h2>
                        </div>
                        <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed max-w-3xl">
                          {strategy.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:pl-5 sm:border-l border-[#E0E7DE] dark:border-[#263824] shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#4A6741] dark:text-[#78B169] block">
                          -{(strategy.potentialReductionKgCO2e / 1000).toFixed(2)} t CO₂e
                        </span>
                        <p className="text-[11px] text-[#737C70] dark:text-[#839580]">Payback: {strategy.paybackPeriod}</p>
                      </div>

                      <button
                        id={`expand-strategy-${strategy.id}-btn`}
                        type="button"
                        onClick={() => setExpandedStrategyId(isExpanded ? null : strategy.id)}
                        className="px-4 py-2 text-xs font-semibold rounded-full bg-[#F1EFEC] dark:bg-[#1A2619] hover:bg-[#E8E4DF] text-[#1D2B17] dark:text-[#EEF5ED] border border-[#E8E4DF] dark:border-[#263824] transition-colors cursor-pointer"
                      >
                        {isExpanded ? 'Hide Pros' : 'Inspect Pros'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded "PROS & ADVANTAGES" Panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6 pt-3 border-t border-[#E0E7DE] dark:border-[#263824] bg-[#F7F9F6] dark:bg-[#1A2619] rounded-b-[24px]"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldCheck className="w-4 h-4 text-[#4A6741] dark:text-[#78B169]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1D2B17] dark:text-[#EEF5ED]">
                            Evaluated Pros & Strategic Co-Benefits
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                          <div className="p-4 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl space-y-1 shadow-2xs">
                            <span className="font-bold text-[#4A6741] dark:text-[#78B169] block">1. Environmental Pro</span>
                            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">{strategy.pros.environmental}</p>
                          </div>

                          <div className="p-4 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl space-y-1 shadow-2xs">
                            <span className="font-bold text-[#8C7851] dark:text-[#D4AF37] block">2. Economic / ROI Pro</span>
                            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">{strategy.pros.economic}</p>
                          </div>

                          <div className="p-4 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl space-y-1 shadow-2xs">
                            <span className="font-bold text-[#4A6741] dark:text-[#78B169] block">3. Health & Social Pro</span>
                            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">{strategy.pros.healthOrSocial}</p>
                          </div>

                          <div className="p-4 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl space-y-1 shadow-2xs">
                            <span className="font-bold text-[#8C7851] dark:text-[#D4AF37] block">4. Efficiency & Tech Pro</span>
                            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">{strategy.pros.efficiency}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Smart Reduction Tips AI-Generated Sidebar */}
        <SmartReductionTipsSidebar
          calculation={currentCalculation}
          onApplyStrategy={(category) => {
            if (category.includes('Transport')) setCategoryFilter('Transport');
            else if (category.includes('Energy')) setCategoryFilter('Energy');
            else if (category.includes('Diet')) setCategoryFilter('Diet & Agriculture');
            else if (category.includes('Waste')) setCategoryFilter('Waste & Circularity');
            else setCategoryFilter('All');
          }}
        />
      </div>

      {/* Phased Roadmap Timeline Card */}
      <div className="bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-[32px] p-8 shadow-xs space-y-6">
        <h3 className="text-2xl font-serif text-[#1D2B17] dark:text-[#EEF5ED]">
          3-Phase Strategic Decarbonization Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="p-5 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">Phase 1: Operational Quick-Wins</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D9E4D1] dark:bg-[#1A2E19] text-[#1D2B17] dark:text-[#A8C7A0] font-bold text-[10px]">Months 1–3</span>
            </div>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              LED retrofitting, smart programmable thermostats, FIFO food inventory to eliminate food spoilage, and active carpool pairing.
            </p>
            <p className="text-[11px] font-semibold text-[#4A6741] dark:text-[#78B169]">Expected reduction: 12–18%</p>
          </div>

          <div className="p-5 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">Phase 2: Efficiency Upgrades</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F1EFEC] dark:bg-[#1A2619] text-[#5C6658] dark:text-[#9DB099] border border-[#E8E4DF] dark:border-[#263824] font-bold text-[10px]">Months 4–12</span>
            </div>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Heat pump space & water heating transition, plant-rich dietary defaults, public transit pass subsidies, and circular electronic repairs.
            </p>
            <p className="text-[11px] font-semibold text-[#4A6741] dark:text-[#78B169]">Expected reduction: 25–40%</p>
          </div>

          <div className="p-5 bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">Phase 3: Deep Decarbonization</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#4A6741] text-white font-bold text-[10px]">Years 2–5</span>
            </div>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Rooftop solar PV installation with net-metering, commercial/fleet EV transition, on-site aerobic composting, and institutional microgrid storage.
            </p>
            <p className="text-[11px] font-semibold text-[#4A6741] dark:text-[#78B169]">Expected reduction: 60–85% (Net Zero pathway)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
