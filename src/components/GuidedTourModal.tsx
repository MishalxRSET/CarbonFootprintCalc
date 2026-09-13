import React, { useState } from 'react';
import { PageTab } from '../types';
import {
  X,
  Sparkles,
  Calculator,
  Compass,
  Sliders,
  Cloud,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Zap,
  TrendingDown,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: PageTab) => void;
}

interface Step {
  id: string;
  title: string;
  subtitle: string;
  tab: PageTab;
  icon: React.ReactNode;
  badge: string;
  color: string;
  bgLight: string;
  description: string;
  features: string[];
  actionLabel: string;
}

const TOUR_STEPS: Step[] = [
  {
    id: 'calculator',
    title: '1. Calculate Your Baseline Footprint',
    subtitle: 'Transparent, empirical carbon accounting',
    tab: 'calculator',
    icon: <Calculator className="w-6 h-6 text-emerald-600" />,
    badge: 'Step 1: Discover',
    color: '#4A6741',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    description:
      'Adjust domestic electricity, cooking LPG, vehicle mileage, flights, and dietary patterns. The engine calculates your exact Scope 1 (direct fuel), Scope 2 (grid electricity via CEA India factors), and Scope 3 emissions in real time.',
    features: [
      '1-click presets: Eco-Minimalist, Urban Apartment, or High-Intensity',
      'Instant comparison against Indian (2.1t) & Global (4.7t) averages',
      'One-tap transfer of your baseline directly into the Reduction Planner',
    ],
    actionLabel: 'Go to Footprint Calculator',
  },
  {
    id: 'solutions',
    title: '2. Explore 16+ Verified Solutions',
    subtitle: 'High-impact interventions from IPCC & Project Drawdown',
    tab: 'solutions',
    icon: <Compass className="w-6 h-6 text-amber-600" />,
    badge: 'Step 2: Learn',
    color: '#8C7851',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    description:
      'Browse deeply researched mitigation pathways spanning rooftop solar PV, heat pumps, electric mobility, plant-rich diets, and regenerative composting—complete with capital costs, ROI, and payback timelines.',
    features: [
      'Multi-scale multiplier: estimate impact for 1 home up to a 1,000-person firm',
      'Interactive Side-by-Side Solution Comparison tool',
      'Direct filter for Quick Wins (Zero/Low cost with immediate payback)',
    ],
    actionLabel: 'Browse Solutions Catalog',
  },
  {
    id: 'planner',
    title: '3. Build Your Phased Action Plan',
    subtitle: 'Interactive multi-year trajectory simulator',
    tab: 'planner',
    icon: <Sliders className="w-6 h-6 text-emerald-700" />,
    badge: 'Step 3: Strategize',
    color: '#2E4726',
    bgLight: 'bg-[#E8EFE5] dark:bg-[#1F2E1D]',
    description:
      'Select and toggle interventions to build your roadmap. Watch the interactive Recharts trajectory compare your Business-As-Usual (BAU) pathway against your target decarbonization curve over a 3, 5, or 10-year horizon.',
    features: [
      'Dynamic abatement meter with financial savings estimations (₹)',
      'Scenario presets: Net-Zero Fast Track, Zero-Capex, or Clean Energy',
      'Download print-ready official executive PDF reports',
    ],
    actionLabel: 'Open Roadmap Planner',
  },
  {
    id: 'drive_save',
    title: '4. Save & Sync to Google Drive',
    subtitle: 'Seamless cloud export to Google Workspace',
    tab: 'drive_save',
    icon: <Cloud className="w-6 h-6 text-blue-600" />,
    badge: 'Step 4: Execute & Share',
    color: '#2563EB',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    description:
      'Connect your Google Drive account with OAuth 2.0 to export your customized action plan into native Google Docs, formatted Markdown (.md), or raw JSON schemas ready for team review and ESG tracking.',
    features: [
      'Editable Google Docs with styled executive tables and milestones',
      'Automatic sync to your Drive with direct "Open in Google Drive" links',
      'History list of all previously exported decarbonization roadmaps',
    ],
    actionLabel: 'Visit Drive Integration',
  },
];

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[activeStepIndex];

  const handleNext = () => {
    if (activeStepIndex < TOUR_STEPS.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const handleJumpToTab = (tab: PageTab) => {
    onNavigate(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative my-8"
        >
          {/* Top Decorative Header */}
          <div className="p-6 sm:p-7 border-b border-[#E0E7DE] dark:border-[#263824] flex items-center justify-between bg-[#F7F9F6] dark:bg-[#1A2619]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#4A6741]/10 dark:bg-[#4A6741]/20 flex items-center justify-center text-[#4A6741] dark:text-[#78B169]">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
                  How This Platform Works
                </h2>
                <p className="text-xs text-[#5C6658] dark:text-[#9DB099]">
                  A 4-step interactive guide to climate action
                </p>
              </div>
            </div>

            <button
              id="close-guide-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#737C70] hover:text-[#1D2B17] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Selector Tabs */}
          <div className="grid grid-cols-4 border-b border-[#E0E7DE] dark:border-[#263824] bg-white dark:bg-[#141E13]">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`py-3 px-2 text-center text-xs font-semibold transition-all relative border-r last:border-r-0 border-[#E0E7DE] dark:border-[#263824] ${
                  activeStepIndex === idx
                    ? 'text-[#1D2B17] dark:text-[#EEF5ED] bg-[#F7F9F6] dark:bg-[#1A2619] font-bold'
                    : 'text-[#737C70] dark:text-[#839580] hover:text-[#1D2B17] dark:hover:text-[#EEF5ED]'
                }`}
              >
                <span className="block sm:inline font-mono mr-1">#{idx + 1}</span>
                <span className="truncate block sm:inline">{step.id.toUpperCase()}</span>
                {activeStepIndex === idx && (
                  <motion.div
                    layoutId="tour-active-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A6741] dark:bg-[#78B169]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl shrink-0 ${currentStep.bgLight}`}
              >
                {currentStep.icon}
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A6741] dark:text-[#78B169]">
                  {currentStep.badge}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
                  {currentStep.title}
                </h3>
                <p className="text-xs text-[#737C70] dark:text-[#839580]">
                  {currentStep.subtitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#3D473B] dark:text-[#C5D6C2] leading-relaxed">
              {currentStep.description}
            </p>

            {/* Feature Highlights */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C6658] dark:text-[#9DB099]">
                Key Highlights:
              </span>
              <ul className="space-y-2">
                {currentStep.features.map((feature, i) => (
                  <li
                    key={i}
                    className="text-xs text-[#2D332B] dark:text-[#D1E0CE] flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6741] dark:text-[#78B169] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleJumpToTab(currentStep.tab)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1D2B17] dark:bg-[#4A6741] text-white hover:bg-[#2E4726] dark:hover:bg-[#3B5334] text-xs font-bold transition-all shadow-xs"
              >
                <span>{currentStep.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={activeStepIndex === 0}
                  className="px-3.5 py-2 rounded-full border border-[#E0E7DE] dark:border-[#263824] text-xs font-semibold text-[#5C6658] dark:text-[#9DB099] hover:bg-[#F1EFEC] dark:hover:bg-[#1F2E1D] disabled:opacity-40 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-full border border-[#CCD9C3] dark:border-[#384E34] text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED] hover:bg-[#F1EFEC] dark:hover:bg-[#1F2E1D] transition-colors"
                >
                  {activeStepIndex === TOUR_STEPS.length - 1 ? 'Finish Guide' : 'Next Step'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
