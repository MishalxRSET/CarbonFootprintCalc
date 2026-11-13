import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { generatePrioritizedTips, SmartReductionTip } from '../utils/reductionTipsEngine';
import { formatINR } from '../utils/currency';
import {
  Sparkles,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  Zap,
  Leaf,
  IndianRupee,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface SmartReductionTipsSidebarProps {
  calculation: CalculationResult;
  onApplyStrategy?: (category: string) => void;
}

export const SmartReductionTipsSidebar: React.FC<SmartReductionTipsSidebarProps> = ({
  calculation,
  onApplyStrategy,
}) => {
  const [expandedTipId, setExpandedTipId] = useState<string | null>('tip-transport-transit');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [isAiSynthesizing, setIsAiSynthesizing] = useState<boolean>(false);
  const [aiCustomInsight, setAiCustomInsight] = useState<string | null>(null);

  // Generate prioritized tips based on user's highest emissions
  const prioritizedTips = React.useMemo(() => {
    const tips = generatePrioritizedTips(calculation);
    if (filterPriority === 'All') return tips;
    return tips.filter((t) => t.priority === filterPriority);
  }, [calculation, filterPriority]);

  // Identify the single biggest impact category
  const dominantArea = React.useMemo(() => {
    const b = calculation.breakdown;
    const entries = [
      { name: 'Transport', val: b.transport },
      { name: 'Home Energy', val: b.energy },
      { name: 'Diet & Agriculture', val: b.diet },
      { name: 'Goods & Waste', val: b.goodsAndWaste },
      { name: 'Digital', val: b.digital },
    ];
    entries.sort((a, b) => b.val - a.val);
    const top = entries[0];
    const total = Math.max(1, calculation.totalAnnualKgCO2e);
    const pct = Math.round((top.val / total) * 100);
    return { name: top.name, pct, val: top.val };
  }, [calculation]);

  // Simulate on-demand AI refinement
  const handleRegenerateAiInsight = () => {
    setIsAiSynthesizing(true);
    setTimeout(() => {
      setAiCustomInsight(
        `Analysis indicates that ${dominantArea.name} drives ${dominantArea.pct}% of your ${calculation.totalAnnualTonnesCO2e} tCO₂e/yr footprint. Front-loading high-efficiency electrification and transit modal shifts can abate over ${(dominantArea.val * 0.45 / 1000).toFixed(2)} tonnes in 12 months.`
      );
      setIsAiSynthesizing(false);
    }, 600);
  };

  return (
    <aside className="w-full lg:w-96 shrink-0 space-y-4">
      {/* Sidebar Header Card */}
      <div className="bg-gradient-to-br from-[#121810] via-[#1D2B17] to-[#152313] text-white rounded-[28px] p-6 shadow-md border border-[#2E3F27] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              AI Smart Reduction
            </span>
          </div>

          <button
            onClick={handleRegenerateAiInsight}
            disabled={isAiSynthesizing}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 transition-colors"
            title="Recalculate AI Priority Model"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAiSynthesizing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <h3 className="text-lg font-serif font-medium text-white mb-1.5">
          Prioritized Action Blueprint
        </h3>

        <p className="text-xs text-emerald-100/80 leading-relaxed mb-4 font-light">
          Synthesized from your <strong>{calculation.totalAnnualTonnesCO2e} tCO₂e</strong> calculation. Top emissions driver is{' '}
          <span className="font-semibold text-white underline decoration-emerald-400 underline-offset-2">
            {dominantArea.name} ({dominantArea.pct}%)
          </span>.
        </p>

        {/* AI Insight Box */}
        {aiCustomInsight && (
          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-[11px] text-emerald-200 leading-relaxed mb-4">
            <span className="font-bold text-emerald-300 block mb-0.5">Custom Footprint Evaluation:</span>
            {aiCustomInsight}
          </div>
        )}

        {/* Impact Distribution Pill */}
        <div className="bg-black/30 rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Primary Target</span>
            <span className="font-bold text-white text-sm">{dominantArea.name}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400 block">Impact Share</span>
            <span className="font-mono font-bold text-emerald-300 text-sm">{dominantArea.pct}%</span>
          </div>
        </div>
      </div>

      {/* Priority Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-[#E0E7DE] text-xs">
        {['All', 'High Priority', 'Quick Win'].map((priority) => (
          <button
            key={priority}
            onClick={() => setFilterPriority(priority)}
            className={`flex-1 py-1.5 px-2 rounded-xl font-medium text-center transition-all text-[11px] ${
              filterPriority === priority
                ? 'bg-[#4A6741] text-white shadow-xs font-semibold'
                : 'text-[#5C6658] hover:text-[#1D2B17] hover:bg-[#F1EFEC]'
            }`}
          >
            {priority}
          </button>
        ))}
      </div>

      {/* Prioritized Tips Accordion Cards */}
      <div className="space-y-3">
        {prioritizedTips.map((tip) => {
          const isExpanded = expandedTipId === tip.id;

          return (
            <div
              key={tip.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                isExpanded ? 'border-[#4A6741] ring-1 ring-[#4A6741]/20' : 'border-[#E0E7DE] hover:border-[#CCD9C3]'
              }`}
            >
              {/* Card Header (Always visible) */}
              <button
                onClick={() => setExpandedTipId(isExpanded ? null : tip.id)}
                className="w-full text-left p-4 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5 ${
                      tip.priority === 'High Priority'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {tip.rank}
                  </span>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          tip.priority === 'High Priority'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-[#D9E4D1] text-[#1D2B17]'
                        }`}
                      >
                        {tip.priority}
                      </span>
                      <span className="text-[11px] text-[#737C70] font-medium">{tip.category}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1D2B17] leading-tight">
                      {tip.title}
                    </h4>

                    {/* Quick Metric Bar */}
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="font-mono font-bold text-[#4A6741] flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3" />
                        -{(tip.estimatedReductionKg / 1000).toFixed(2)} t/yr
                      </span>
                      <span className="text-[#737C70] font-mono text-[11px]">
                        Save ~{formatINR(tip.estimatedSavingsINR)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-[#737C70] mt-1">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>

              {/* Collapsible Deep-Dive Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-[#F1EFEC] bg-[#F7F9F6] space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-[#1D2B17] block mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-[#8C7851]" /> Tactical Action
                    </span>
                    <p className="text-[#5C6658] leading-relaxed text-[11px]">
                      {tip.tacticalAction}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#E0E7DE] space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#737C70] block">
                      Scientific Justification
                    </span>
                    <p className="text-[#5C6658] text-[11px] leading-relaxed">
                      {tip.scientificReasoning}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#5C6658] pt-1">
                    <span>Payback period: <strong className="text-[#1D2B17]">{tip.roiMonths}</strong></span>
                    {onApplyStrategy && (
                      <button
                        onClick={() => onApplyStrategy(tip.category)}
                        className="text-[#4A6741] hover:text-[#3E5637] font-bold flex items-center gap-1 hover:underline"
                      >
                        <span>Inspect in Planner</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Kerala & Microgrid Engineering Callout */}
      <div className="bg-[#F1EFEC] rounded-2xl p-4 border border-[#E8E4DF] text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-[#1D2B17]">
          <Leaf className="w-3.5 h-3.5 text-[#4A6741]" />
          <span>Regional Benchmark</span>
        </div>
        <p className="text-[#5C6658] text-[11px] leading-relaxed">
          Matches decarbonization frameworks demonstrated at <strong>RSET Kakkanad (250 kWp solar microgrid)</strong> and <strong>CIAL 100% solar airport</strong>.
        </p>
      </div>
    </aside>
  );
};
