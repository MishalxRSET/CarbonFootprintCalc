import React, { useState, useMemo } from 'react';
import { PageTab, CarbonSolution } from '../types';
import { COMPREHENSIVE_SOLUTIONS } from '../data/solutionsData';
import { formatINR } from '../utils/currency';
import { SpotlightCard, CountUp, ShinyText, Magnet } from './reactbits';
import {
  Search,
  SlidersHorizontal,
  CheckCircle2,
  TrendingDown,
  DollarSign,
  Clock,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf,
  Building2,
  Car,
  Utensils,
  Recycle,
  Trees,
  Check,
  X,
  FileDown,
  Printer,
  ChevronDown,
  ChevronUp,
  Scale,
  Compass,
  BookOpen,
} from 'lucide-react';

interface SolutionsViewProps {
  onNavigate: (tab: PageTab) => void;
}

type CategoryFilter = 'All' | 'Energy & Electrification' | 'Sustainable Mobility' | 'Diet & Agro-Ecology' | 'Circularity & Waste' | 'Built Environment' | 'Carbon Removal';
type ScopeFilter = 'All' | 'Scope 1' | 'Scope 2' | 'Scope 3' | 'Removal';

const SCALE_PRESETS = [
  { id: 'household', label: '1 Household / Person', multiplier: 1, desc: 'Single residential domicile or individual baseline' },
  { id: 'apartment', label: '10-Unit Apartment Block', multiplier: 10, desc: 'Multi-family residential complex' },
  { id: 'campus_dorm', label: '250-Student Campus Dorm', multiplier: 250, desc: 'University residential hall / collegiate housing' },
  { id: 'enterprise', label: '1,000-Member Organization', multiplier: 1000, desc: 'Corporate headquarters or municipal division' },
];

export const SolutionsView: React.FC<SolutionsViewProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [selectedScope, setSelectedScope] = useState<ScopeFilter>('All');
  const [selectedCostTier, setSelectedCostTier] = useState<string>('All');
  const [selectedEase, setSelectedEase] = useState<string>('All');
  const [activeScalePreset, setActiveScalePreset] = useState(SCALE_PRESETS[0]);
  const [expandedSolutionId, setExpandedSolutionId] = useState<string | null>('sol_solar_pv');
  const [compareIds, setCompareIds] = useState<string[]>(['sol_solar_pv', 'sol_heat_pump']);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Category list with counts
  const categories: CategoryFilter[] = [
    'All',
    'Energy & Electrification',
    'Sustainable Mobility',
    'Built Environment',
    'Diet & Agro-Ecology',
    'Circularity & Waste',
    'Carbon Removal',
  ];

  const getCategoryIcon = (category: CarbonSolution['category']) => {
    switch (category) {
      case 'Energy & Electrification':
        return <Zap className="w-4 h-4 text-[#8C7851]" />;
      case 'Sustainable Mobility':
        return <Car className="w-4 h-4 text-[#4A6741]" />;
      case 'Built Environment':
        return <Building2 className="w-4 h-4 text-[#5C6658]" />;
      case 'Diet & Agro-Ecology':
        return <Utensils className="w-4 h-4 text-[#8C7851]" />;
      case 'Circularity & Waste':
        return <Recycle className="w-4 h-4 text-[#4A6741]" />;
      case 'Carbon Removal':
        return <Trees className="w-4 h-4 text-[#4A6741]" />;
      default:
        return <Leaf className="w-4 h-4 text-[#4A6741]" />;
    }
  };

  // Filter solutions
  const filteredSolutions = useMemo(() => {
    return COMPREHENSIVE_SOLUTIONS.filter((sol) => {
      // Category
      if (selectedCategory !== 'All' && sol.category !== selectedCategory) {
        return false;
      }
      // Scope
      if (selectedScope !== 'All' && sol.targetScope !== selectedScope) {
        return false;
      }
      // Cost Tier
      if (selectedCostTier !== 'All' && sol.costTier !== selectedCostTier) {
        return false;
      }
      // Ease
      if (selectedEase !== 'All' && sol.implementationEase !== selectedEase) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = sol.title.toLowerCase().includes(q);
        const matchDesc = sol.description.toLowerCase().includes(q);
        const matchProblem = sol.problemAddressed.toLowerCase().includes(q);
        const matchMechanism = sol.mechanism.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchProblem && !matchMechanism) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedScope, selectedCostTier, selectedEase]);

  // Aggregate stats across current filtered solutions based on selected scale
  const aggregateStats = useMemo(() => {
    const totalAbatementTonnes = filteredSolutions.reduce(
      (acc, s) => acc + (s.abatementKgPerYear * activeScalePreset.multiplier) / 1000,
      0
    );
    const totalCapEx = filteredSolutions.reduce(
      (acc, s) => acc + (s.approxInvestmentINR ?? (s.approxInvestmentUSD * 85)) * activeScalePreset.multiplier,
      0
    );
    const totalAnnualSavings = filteredSolutions.reduce(
      (acc, s) => acc + (s.annualSavingsINR ?? (s.annualSavingsUSD * 85)) * activeScalePreset.multiplier,
      0
    );
    return {
      count: filteredSolutions.length,
      totalAbatementTonnes: Math.round(totalAbatementTonnes),
      totalCapEx: Math.round(totalCapEx),
      totalAnnualSavings: Math.round(totalAnnualSavings),
    };
  }, [filteredSolutions, activeScalePreset]);

  // Handle comparison toggle
  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((item) => item !== id));
    } else {
      if (compareIds.length >= 3) {
        // Keep max 3
        setCompareIds([...compareIds.slice(1), id]);
      } else {
        setCompareIds([...compareIds, id]);
      }
    }
  };

  const comparedSolutions = useMemo(() => {
    return COMPREHENSIVE_SOLUTIONS.filter((s) => compareIds.includes(s.id));
  }, [compareIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header Banner */}
      <div className="bg-white border border-[#E0E7DE] rounded-[32px] p-8 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Technical Interventions & Blueprints
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#D9E4D1] text-[#1D2B17] border border-[#CCD9C3] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6741]" />
              12 Quantified Climate Solutions
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#F1EFEC] text-[#5C6658] border border-[#E8E4DF]">
              IPCC AR6 & GHG Protocol Aligned
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1D2B17] tracking-tight leading-tight">
            Solutions for the Problem Given: Carbon Footprint Reduction
          </h1>

          <p className="text-sm sm:text-base text-[#5C6658] leading-relaxed max-w-3xl">
            A comprehensive catalog of engineering, operational, and behavioral solutions directly answering the
            decarbonization challenges analyzed in our primary presentation deck{' '}
            <strong className="text-[#1D2B17] font-mono bg-[#F1EFEC] px-1.5 py-0.5 rounded-md border border-[#E8E4DF]">
              CARBON FOOTPRINT REDUCTION.pptx
            </strong>
            . Each solution pairs thermodynamic mechanics with verified emissions abatement and return-on-investment metrics.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="solutions-open-planner-btn"
              onClick={() => onNavigate('planner')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A6741] hover:bg-[#3E5637] text-white rounded-full text-xs font-bold transition-colors shadow-xs"
            >
              <Compass className="w-4 h-4" />
              <span>Assemble in Reduction Planner</span>
            </button>
            <button
              id="solutions-open-calculator-btn"
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F1EFEC] hover:bg-[#E8E4DF] text-[#1D2B17] border border-[#E8E4DF] rounded-full text-xs font-semibold transition-colors"
            >
              <TrendingDown className="w-4 h-4 text-[#4A6741]" />
              <span>Audit Baseline Emissions First</span>
            </button>
            <button
              id="solutions-print-dossier-btn"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F7F9F6] text-[#5C6658] border border-[#E0E7DE] rounded-full text-xs font-medium transition-colors"
            >
              <Printer className="w-4 h-4 text-[#8C7851]" />
              <span>Print Technical Dossier</span>
            </button>
          </div>
        </div>

        {/* Decorative corner ring */}
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#D9E4D1]/20 pointer-events-none" />
      </div>

      {/* Dynamic Scale & Context Selector */}
      <div className="bg-[#F7F9F6] border border-[#E0E7DE] rounded-[32px] p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Scale Multiplier & Deployment Context
            </span>
            <h2 className="text-lg font-serif font-bold text-[#1D2B17] mt-0.5">
              Simulate Solutions for Different Operational Scales
            </h2>
          </div>
          <div className="text-xs text-[#5C6658] sm:text-right">
            Selected: <strong className="text-[#1D2B17]">{activeScalePreset.label}</strong> ({activeScalePreset.multiplier}x base)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCALE_PRESETS.map((preset) => {
            const isSelected = activeScalePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                id={`scale-preset-${preset.id}-btn`}
                onClick={() => setActiveScalePreset(preset)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white border-[#4A6741] shadow-xs ring-2 ring-[#4A6741]/20'
                    : 'bg-white/70 border-[#E0E7DE] hover:bg-white text-[#5C6658]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#1D2B17]' : 'text-[#2D332B]'}`}>
                    {preset.label}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#4A6741]" />}
                </div>
                <p className="text-[11px] text-[#737C70] leading-snug">{preset.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Live Aggregated Impact at Selected Scale */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E0E7DE] text-xs">
          <div className="bg-white p-4 rounded-xl border border-[#E0E7DE]">
            <span className="text-[#737C70] text-[11px] uppercase tracking-wider block">Solutions Matching</span>
            <span className="text-xl font-bold font-serif text-[#1D2B17]">{aggregateStats.count} Solutions</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E0E7DE]">
            <span className="text-[#737C70] text-[11px] uppercase tracking-wider block">Combined Abatement</span>
            <span className="text-xl font-bold font-serif text-[#4A6741]">
              {aggregateStats.totalAbatementTonnes.toLocaleString()} tCO₂e/yr
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E0E7DE]">
            <span className="text-[#737C70] text-[11px] uppercase tracking-wider block">Estimated Initial CapEx</span>
            <span className="text-xl font-bold font-serif text-[#1D2B17]">
              {formatINR(aggregateStats.totalCapEx)}
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-[#E0E7DE]">
            <span className="text-[#737C70] text-[11px] uppercase tracking-wider block">Annual Utility Savings</span>
            <span className="text-xl font-bold font-serif text-[#8C7851]">
              {formatINR(aggregateStats.totalAnnualSavings)}/yr
            </span>
          </div>
        </div>
      </div>

      {/* Filter Matrix & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Keyword Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#737C70] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="solutions-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solutions (e.g., heat pump, solar, methane, EV, transit, compost)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0E7DE] rounded-full text-xs text-[#1D2B17] placeholder-[#A3ADA0] focus:outline-none focus:ring-2 focus:ring-[#4A6741]/20 focus:border-[#4A6741]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737C70] hover:text-[#1D2B17]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Scope Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-[11px] font-bold text-[#8C7851] uppercase tracking-wider mr-1">Scope:</span>
            {(['All', 'Scope 1', 'Scope 2', 'Scope 3', 'Removal'] as ScopeFilter[]).map((scope) => (
              <button
                key={scope}
                onClick={() => setSelectedScope(scope)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                  selectedScope === scope
                    ? 'bg-[#1D2B17] text-white font-bold'
                    : 'bg-white border border-[#E0E7DE] text-[#5C6658] hover:bg-[#F1EFEC]'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#4A6741] text-white font-bold shadow-xs'
                    : 'bg-white border border-[#E0E7DE] text-[#5C6658] hover:bg-[#F1EFEC]'
                }`}
              >
                {cat !== 'All' && getCategoryIcon(cat as CarbonSolution['category'])}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="space-y-6">
        {filteredSolutions.length === 0 ? (
          <div className="bg-white border border-[#E0E7DE] rounded-[32px] p-12 text-center space-y-3">
            <p className="text-base font-serif font-bold text-[#1D2B17]">No matching solutions found</p>
            <p className="text-xs text-[#737C70]">
              Try clearing your search query or adjusting your scope and sector filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedScope('All');
              }}
              className="px-4 py-2 bg-[#F1EFEC] text-[#1D2B17] rounded-full text-xs font-semibold hover:bg-[#E8E4DF]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredSolutions.map((sol) => {
            const isExpanded = expandedSolutionId === sol.id;
            const isCompared = compareIds.includes(sol.id);
            const scaledAbatementKg = sol.abatementKgPerYear * activeScalePreset.multiplier;
            const scaledAbatementTonnes = (scaledAbatementKg / 1000).toFixed(1);
            const scaledCapEx = (sol.approxInvestmentINR ?? (sol.approxInvestmentUSD * 85)) * activeScalePreset.multiplier;
            const scaledSavings = (sol.annualSavingsINR ?? (sol.annualSavingsUSD * 85)) * activeScalePreset.multiplier;

            return (
              <SpotlightCard
                key={sol.id}
                id={`solution-card-${sol.id}`}
                spotlightColor="rgba(74, 103, 65, 0.12)"
                className="bg-white border border-[#E0E7DE] rounded-[32px] overflow-hidden shadow-xs transition-all hover:border-[#CCD9C3]"
              >
                {/* Top Solution Overview Bar */}
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F1EFEC] text-[#8C7851] border border-[#E8E4DF] flex items-center gap-1.5">
                          {getCategoryIcon(sol.category)}
                          <span>{sol.category}</span>
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D9E4D1] text-[#1D2B17] border border-[#CCD9C3]">
                          {sol.targetScope}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F7F9F6] text-[#5C6658] border border-[#E0E7DE]">
                          TRL {sol.trlLevel} Commercial
                        </span>
                      </div>

                      <h2 className="text-2xl font-serif font-bold text-[#1D2B17] tracking-tight">
                        {sol.title}
                      </h2>

                      {/* Problem Statement Box */}
                      <div className="bg-[#FDF2F0] border border-[#E8C5BE] rounded-xl p-3.5 text-xs text-[#8C3A27] leading-relaxed">
                        <strong className="font-bold">Problem Addressed: </strong>
                        {sol.problemAddressed}
                      </div>

                      <p className="text-xs sm:text-sm text-[#5C6658] leading-relaxed">
                        {sol.description}
                      </p>
                    </div>

                    {/* Action buttons: Compare & Expand */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                      <button
                        id={`btn-compare-${sol.id}`}
                        onClick={() => toggleCompare(sol.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors border ${
                          isCompared
                            ? 'bg-[#1D2B17] text-white border-[#1D2B17]'
                            : 'bg-white text-[#5C6658] border-[#E0E7DE] hover:bg-[#F1EFEC]'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{isCompared ? 'Compared' : 'Compare'}</span>
                      </button>

                      <button
                        id={`btn-expand-${sol.id}`}
                        onClick={() => setExpandedSolutionId(isExpanded ? null : sol.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#F1EFEC] hover:bg-[#E8E4DF] text-[#1D2B17] rounded-full text-xs font-bold transition-colors border border-[#E8E4DF]"
                      >
                        <span>{isExpanded ? 'Hide Blueprint' : 'View Blueprint'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Quantified Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                    <div className="bg-[#F7F9F6] p-4 rounded-2xl border border-[#E0E7DE] space-y-1">
                      <div className="flex items-center gap-1 text-[#737C70] text-[11px] uppercase tracking-wider">
                        <TrendingDown className="w-3.5 h-3.5 text-[#4A6741]" />
                        <span>Abatement</span>
                      </div>
                      <p className="text-lg font-serif font-bold text-[#4A6741]">
                        {Number(scaledAbatementTonnes) < 1
                          ? `${scaledAbatementKg.toLocaleString()} kg`
                          : `${scaledAbatementTonnes} tonnes`}{' '}
                        <span className="text-[11px] font-sans font-normal text-[#737C70]">CO₂e/yr</span>
                      </p>
                    </div>

                    <div className="bg-[#F7F9F6] p-4 rounded-2xl border border-[#E0E7DE] space-y-1">
                      <div className="flex items-center gap-1 text-[#737C70] text-[11px] uppercase tracking-wider">
                        <span className="font-bold text-[#8C7851] text-xs">₹</span>
                        <span>Investment</span>
                      </div>
                      <p className="text-lg font-serif font-bold text-[#1D2B17]">
                        {formatINR(scaledCapEx)}
                        <span className="text-[11px] font-sans font-normal text-[#737C70] block">
                          Tier: {sol.costTier}
                        </span>
                      </p>
                    </div>

                    <div className="bg-[#F7F9F6] p-4 rounded-2xl border border-[#E0E7DE] space-y-1">
                      <div className="flex items-center gap-1 text-[#737C70] text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[#8C7851]" />
                        <span>Annual Savings</span>
                      </div>
                      <p className="text-lg font-serif font-bold text-[#8C7851]">
                        {formatINR(scaledSavings)}{' '}
                        <span className="text-[11px] font-sans font-normal text-[#737C70]">/ year</span>
                      </p>
                    </div>

                    <div className="bg-[#F7F9F6] p-4 rounded-2xl border border-[#E0E7DE] space-y-1">
                      <div className="flex items-center gap-1 text-[#737C70] text-[11px] uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-[#4A6741]" />
                        <span>Payback Period</span>
                      </div>
                      <p className="text-lg font-serif font-bold text-[#1D2B17]">
                        {sol.paybackYears}
                        <span className="text-[11px] font-sans font-normal text-[#737C70] block">
                          Ease: {sol.implementationEase}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expandable Technical Blueprint & Action Steps */}
                {isExpanded && (
                  <div className="border-t border-[#E0E7DE] bg-[#F7F9F6] p-6 sm:p-8 space-y-6">
                    {/* Mechanism & Science */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
                        Engineering & Thermodynamic Principle
                      </span>
                      <p className="text-xs sm:text-sm text-[#2D332B] leading-relaxed bg-white p-4 rounded-2xl border border-[#E0E7DE]">
                        {sol.mechanism}
                      </p>
                    </div>

                    {/* Step-by-Step 3-Phase Implementation Guide */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
                        3-Phase Engineering Implementation Blueprint
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {sol.implementationSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-5 rounded-2xl border border-[#E0E7DE] space-y-2 relative"
                          >
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#D9E4D1] text-[#1D2B17] font-bold text-xs">
                              {idx + 1}
                            </span>
                            <h3 className="text-xs font-bold text-[#1D2B17] leading-snug">
                              {step.phase}
                            </h3>
                            <p className="text-[11px] font-semibold text-[#4A6741]">{step.step}</p>
                            <p className="text-xs text-[#5C6658] leading-relaxed">{step.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4-Pillar Pros Matrix for this Solution */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#4A6741]" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1D2B17]">
                          Multi-Dimensional Pros (Presentation Slide Deck Alignment)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div className="bg-white p-4 rounded-2xl border border-[#E0E7DE] space-y-1.5">
                          <p className="font-bold text-[#1D2B17]">1. Environmental</p>
                          <p className="text-[#5C6658] text-[11px] leading-relaxed">{sol.pros.environmental}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-[#E0E7DE] space-y-1.5">
                          <p className="font-bold text-[#1D2B17]">2. Economic & ROI</p>
                          <p className="text-[#5C6658] text-[11px] leading-relaxed">{sol.pros.economic}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-[#E0E7DE] space-y-1.5">
                          <p className="font-bold text-[#1D2B17]">3. Public Health</p>
                          <p className="text-[#5C6658] text-[11px] leading-relaxed">{sol.pros.healthOrSocial}</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-[#E0E7DE] space-y-1.5">
                          <p className="font-bold text-[#1D2B17]">4. Thermodynamic Efficiency</p>
                          <p className="text-[#5C6658] text-[11px] leading-relaxed">{sol.pros.efficiency}</p>
                        </div>
                      </div>
                    </div>

                    {/* Co-Benefits & Adoption CTA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#E0E7DE]">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C6658]">
                        <span className="font-bold text-[#1D2B17]">Key Co-Benefits:</span>
                        {sol.coBenefits.map((cb, cbIdx) => (
                          <span
                            key={cbIdx}
                            className="px-2.5 py-0.5 rounded-full bg-white border border-[#E0E7DE] text-[11px]"
                          >
                            ✓ {cb}
                          </span>
                        ))}
                      </div>

                      <button
                        id={`btn-plan-solution-${sol.id}`}
                        onClick={() => onNavigate('planner')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A6741] hover:bg-[#3E5637] text-white rounded-full text-xs font-bold transition-colors shadow-xs shrink-0"
                      >
                        <span>Select in Reduction Planner</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </SpotlightCard>
            );
          })
        )}
      </div>

      {/* Floating Comparison Dock (if solutions selected) */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-[#1D2B17] text-white px-5 py-3.5 rounded-full shadow-2xl border border-[#3E5637] flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Scale className="w-4 h-4 text-[#D9E4D1]" />
            <span>
              <strong className="font-bold text-[#D9E4D1]">{compareIds.length}</strong> solutions selected to compare
            </span>
          </div>

          <button
            id="btn-open-comparison-modal"
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-1.5 bg-[#4A6741] hover:bg-[#3E5637] text-white font-bold text-xs rounded-full transition-colors shadow-xs"
          >
            Compare Side-by-Side
          </button>

          <button
            onClick={() => setCompareIds([])}
            className="text-white/60 hover:text-white text-xs underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D332B]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-[32px] max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E0E7DE] overflow-hidden">
            <div className="p-6 border-b border-[#E0E7DE] flex items-center justify-between bg-[#F7F9F6]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#4A6741] text-white flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#1D2B17]">
                    Side-by-Side Solution Comparison Matrix
                  </h2>
                  <p className="text-xs text-[#5C6658]">
                    Evaluated at scale: {activeScalePreset.label}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 text-[#737C70] hover:text-[#1D2B17] hover:bg-[#E8E4DF] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#2D332B]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparedSolutions.map((sol) => {
                  const scaledAbatement = (sol.abatementKgPerYear * activeScalePreset.multiplier) / 1000;
                  const scaledCapEx = (sol.approxInvestmentINR ?? (sol.approxInvestmentUSD * 85)) * activeScalePreset.multiplier;
                  const scaledSavings = (sol.annualSavingsINR ?? (sol.annualSavingsUSD * 85)) * activeScalePreset.multiplier;

                  return (
                    <div
                      key={sol.id}
                      className="bg-[#F7F9F6] p-6 rounded-2xl border border-[#E0E7DE] space-y-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7851]">
                          {sol.category} • {sol.targetScope}
                        </span>
                        <h3 className="text-base font-serif font-bold text-[#1D2B17] leading-snug">
                          {sol.title}
                        </h3>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-[#E0E7DE]">
                        <div className="flex justify-between">
                          <span className="text-[#737C70]">Annual Abatement:</span>
                          <strong className="text-[#4A6741]">{scaledAbatement.toFixed(1)} tCO₂e/yr</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#737C70]">Initial CapEx:</span>
                          <strong className="text-[#1D2B17]">{formatINR(scaledCapEx)}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#737C70]">Annual Savings:</span>
                          <strong className="text-[#8C7851]">{formatINR(scaledSavings)}/yr</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#737C70]">Payback Timeline:</span>
                          <strong className="text-[#1D2B17]">{sol.paybackYears}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#737C70]">Feasibility:</span>
                          <strong className="text-[#1D2B17]">{sol.implementationEase}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#737C70]">TRL Level:</span>
                          <strong className="text-[#1D2B17]">TRL {sol.trlLevel}</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E0E7DE] space-y-1">
                        <p className="font-bold text-[#1D2B17] text-[11px]">Primary Mechanism:</p>
                        <p className="text-[11px] text-[#5C6658] leading-relaxed">{sol.mechanism}</p>
                      </div>

                      <div className="pt-2 border-t border-[#E0E7DE] space-y-1">
                        <p className="font-bold text-[#1D2B17] text-[11px]">Environmental Pro:</p>
                        <p className="text-[11px] text-[#5C6658] leading-relaxed">{sol.pros.environmental}</p>
                      </div>

                      <button
                        onClick={() => {
                          setIsCompareModalOpen(false);
                          onNavigate('planner');
                        }}
                        className="w-full py-2 bg-[#4A6741] hover:bg-[#3E5637] text-white rounded-full text-xs font-bold transition-colors"
                      >
                        Select in Planner
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-[#E0E7DE] bg-[#F7F9F6] flex justify-end">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2 bg-[#1D2B17] text-white rounded-full text-xs font-semibold hover:bg-[#2D332B]"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
