import React from 'react';
import { PageTab } from '../types';
import { AtmosphericCanvas } from './AtmosphericCanvas';
import { ScenarioSimulator } from './ScenarioSimulator';
import { Magnet } from './reactbits';
import {
  ArrowRight,
  TrendingDown,
  Layers,
  Leaf,
  Globe2,
  BookOpen,
  Cloud,
  Sparkles,
  Zap,
  Car,
  Building2,
  Utensils,
  Trees,
  ExternalLink,
  Compass,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDesignDoc: () => void;
  onOpenCommandPalette?: () => void;
  onOpenGuidedTour?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onOpenDesignDoc,
  onOpenCommandPalette,
  onOpenGuidedTour,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-14">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION                                                 */}
      {/* ========================================================================= */}
      <div
        id="home"
        className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl border border-[#263820] text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(3,24,12,0.92) 0%, rgba(3,24,12,0.72) 55%, rgba(3,24,12,0.38) 100%), url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=90")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-3xl space-y-5 sm:space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#6bea73]/70 bg-[#09200e]/80 backdrop-blur-md text-[#7bf583] text-xs font-semibold tracking-wide shadow-xs">
            <span>🌍</span>
            <span>Science-Backed Decarbonization Platform</span>
          </div>

          {/* Core Mission Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-white leading-[1.08]">
            Our planet.<br />
            <span className="text-[#65e66d] drop-shadow-sm">Our responsibility.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#e2f2e4] text-sm sm:text-lg leading-relaxed max-w-2xl font-light">
            Measure your greenhouse gas emissions across Scopes 1, 2, and 3, explore 5 proven
            interventions from our research presentation, and build a verified decarbonization plan exportable to Google Drive.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-2">
            <Magnet padding={15} magnetStrength={1.2}>
              <button
                id="hero-explore-solutions-btn"
                onClick={() => onNavigate('solutions')}
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full bg-[#67e56e] text-[#09200e] font-bold text-xs sm:text-sm hover:bg-[#58d75f] transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                <span>Explore 5 Solutions</span>
                <ArrowRight className="w-4 h-4 text-[#09200e]" />
              </button>
            </Magnet>

            <button
              id="hero-launch-calculator-btn"
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full border border-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Carbon Calculator</span>
            </button>

            <button
              id="hero-view-planner-btn"
              onClick={() => onNavigate('planner')}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-[#243520]/80 hover:bg-[#2F472A] border border-[#3E5637] text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Reduction Planner</span>
            </button>

            <button
              id="hero-view-drive-save-btn"
              onClick={() => onNavigate('drive_save')}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-black/30 hover:bg-black/45 text-white/90 border border-white/20 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              <Cloud className="w-4 h-4 text-[#7bf583]" />
              <span>Save to Drive</span>
            </button>

            {onOpenGuidedTour && (
              <button
                id="hero-open-guided-tour-btn"
                type="button"
                onClick={onOpenGuidedTour}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-white/95 dark:bg-[#122616]/90 hover:bg-white dark:hover:bg-[#1A3821] text-[#0A200E] dark:text-[#52e35b] font-bold text-xs sm:text-sm border border-emerald-500/40 dark:border-emerald-500/50 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-emerald-700 dark:text-[#52e35b]" />
                <span>Quick Tour</span>
              </button>
            )}

            <button
              id="hero-view-designdoc-btn"
              onClick={onOpenDesignDoc}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-[#8C7851]/85 hover:bg-[#736242] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Design Doc</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE-STEP QUICK-START ROADMAP                                         */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#141E13] p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-[#E0E7DE] dark:border-[#263824] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A6741] dark:text-[#78B169] flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Recommended Pathway
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] mt-0.5">
              3 Simple Steps to Carbon Zero
            </h2>
          </div>
          {onOpenGuidedTour && (
            <button
              type="button"
              onClick={onOpenGuidedTour}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A6741] dark:text-[#78B169] hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Quick Tour →</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Step 1 */}
          <div
            onClick={() => onNavigate('calculator')}
            className="p-5 sm:p-6 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-[#4A6741] dark:hover:border-[#78B169] transition-all cursor-pointer group space-y-2.5 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#E8EFE5] dark:bg-[#203623] text-[#2E4726] dark:text-[#78B169] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <ArrowRight className="w-4 h-4 text-[#737C70] group-hover:text-[#4A6741] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
              Calculate Footprint
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Input domestic power, vehicle fuel, LPG, and transit. Generates instant Scope 1, 2 & 3 emissions breakdown using Indian CEA factors.
            </p>
            <span className="inline-block text-[11px] font-bold text-[#4A6741] dark:text-[#78B169]">
              Launch Calculator →
            </span>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onNavigate('solutions')}
            className="p-5 sm:p-6 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-[#8C7851] dark:hover:border-[#D4AF37] transition-all cursor-pointer group space-y-2.5 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#F5EFE6] dark:bg-[#2A2316] text-[#8C7851] dark:text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <ArrowRight className="w-4 h-4 text-[#737C70] group-hover:text-[#8C7851] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
              Explore 5 Flagship Solutions
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Examine the 5 core solutions from our PPT: Solar PV, Heat Pumps, Electric Vehicles, Plant-Rich Diets, and Urban Afforestation with payback data.
            </p>
            <span className="inline-block text-[11px] font-bold text-[#8C7851] dark:text-[#D4AF37]">
              Browse 5 Solutions →
            </span>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onNavigate('planner')}
            className="p-5 sm:p-6 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-[#4A6741] dark:hover:border-[#78B169] transition-all cursor-pointer group space-y-2.5 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#E8EFE5] dark:bg-[#203623] text-[#2E4726] dark:text-[#78B169] font-bold text-xs flex items-center justify-center">
                3
              </span>
              <ArrowRight className="w-4 h-4 text-[#737C70] group-hover:text-[#4A6741] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
              Plan & Save to Google Drive
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Simulate 5–10 year reduction curves, estimate financial savings (₹), and save your plan directly to Google Drive as a Google Doc.
            </p>
            <span className="inline-block text-[11px] font-bold text-[#4A6741] dark:text-[#78B169]">
              Build & Save Plan →
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PLANETARY DIAGNOSTICS ("The impact of our carbon footprint")          */}
      {/* ========================================================================= */}
      <section
        id="effects"
        className="bg-[#102B18] text-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 space-y-6 sm:space-y-8 border border-[#1E4226] shadow-xl"
      >
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6bea73]">
            <span>Planetary Diagnostics</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-tight">
            The impact of our carbon footprint
          </h2>
          <p className="text-[#b9ccb9] text-xs sm:text-sm leading-relaxed">
            Understanding systemic emissions drivers is the first step toward targeted interventions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Rising Temperatures */}
          <div
            className="min-h-[260px] sm:min-h-[300px] rounded-[20px] p-6 flex flex-col justify-end relative overflow-hidden group shadow-lg border border-white/10"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 85%), url("https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=1000&q=85")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 space-y-1.5 transform group-hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <span>🌡️</span>
                <span>Rising Temperatures</span>
              </h3>
              <p className="text-xs text-[#e2ece0] leading-relaxed">
                Atmospheric CO₂ past 426 ppm amplifies global mean temperatures and triggers severe heatwaves and climate volatility.
              </p>
            </div>
          </div>

          {/* Climate & Oceans */}
          <div
            className="min-h-[260px] sm:min-h-[300px] rounded-[20px] p-6 flex flex-col justify-end relative overflow-hidden group shadow-lg border border-white/10"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 85%), url("https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1000&q=85")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 space-y-1.5 transform group-hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <span>🌊</span>
                <span>Climate & Oceans</span>
              </h3>
              <p className="text-xs text-[#e2ece0] leading-relaxed">
                Thermal expansion and ocean acidification destabilize marine ecosystems and increase coastal vulnerability.
              </p>
            </div>
          </div>

          {/* Ecosystem Loss */}
          <div
            className="min-h-[260px] sm:min-h-[300px] rounded-[20px] p-6 flex flex-col justify-end relative overflow-hidden group shadow-lg border border-white/10"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 85%), url("https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=85")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 space-y-1.5 transform group-hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <span>🌲</span>
                <span>Ecosystem Loss</span>
              </h3>
              <p className="text-xs text-[#e2ece0] leading-relaxed">
                Loss of natural vegetative carbon sinks diminishes Earth's innate capacity to buffer surplus atmospheric carbon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REAL-TIME ATMOSPHERIC CARBON FLUX & PARTICLE DYNAMICS CANVAS           */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
                Atmospheric Dynamics
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D9E4D1] dark:bg-[#1C3320] text-[#142616] dark:text-[#52e35b] border border-[#CCD9C3] dark:border-[#2F4D33]">
                KINETIC CANVAS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] mt-0.5 tracking-tight">
              Carbon Flux & Biospheric Sinks
            </h2>
          </div>
          <p className="text-xs text-[#737C70] dark:text-[#839580] font-mono sm:text-right">
            Touch or hover to deflect particle currents
          </p>
        </div>

        <AtmosphericCanvas />
      </div>

      {/* ========================================================================= */}
      {/* 5. FOCUSED SPOTLIGHT: 5 CORE CLIMATE SOLUTIONS (FROM PPT)                  */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-[#141E13] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 border border-[#E0E7DE] dark:border-[#263824] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#E0E7DE] dark:border-[#263824]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Core Interventions (from PPT)
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] mt-0.5">
              5 Flagship Climate Solutions
            </h2>
          </div>
          <button
            onClick={() => onNavigate('solutions')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>Explore Solutions Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Solution 1 */}
          <div
            onClick={() => onNavigate('solutions')}
            className="p-4 rounded-xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-emerald-600 dark:group-hover:text-[#52e35b] transition-colors leading-tight">
              1. Rooftop Solar PV
            </h3>
            <p className="text-[11px] text-[#5C6658] dark:text-[#9DB099] line-clamp-2">
              Clean micro-generation displacing coal grid peak demand.
            </p>
            <span className="inline-block text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              -1,850 kg CO₂e/yr
            </span>
          </div>

          {/* Solution 2 */}
          <div
            onClick={() => onNavigate('solutions')}
            className="p-4 rounded-xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-emerald-600 dark:group-hover:text-[#52e35b] transition-colors leading-tight">
              2. Inverter Heat Pump
            </h3>
            <p className="text-[11px] text-[#5C6658] dark:text-[#9DB099] line-clamp-2">
              300%+ thermodynamic efficiency replacing gas/oil heating.
            </p>
            <span className="inline-block text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              -1,450 kg CO₂e/yr
            </span>
          </div>

          {/* Solution 3 */}
          <div
            onClick={() => onNavigate('solutions')}
            className="p-4 rounded-xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-emerald-600 dark:group-hover:text-[#52e35b] transition-colors leading-tight">
              3. Electric Vehicles (EV)
            </h3>
            <p className="text-[11px] text-[#5C6658] dark:text-[#9DB099] line-clamp-2">
              Zero tailpipe emissions and 70% cheaper operating costs.
            </p>
            <span className="inline-block text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              -2,200 kg CO₂e/yr
            </span>
          </div>

          {/* Solution 4 */}
          <div
            onClick={() => onNavigate('solutions')}
            className="p-4 rounded-xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-emerald-600 dark:group-hover:text-[#52e35b] transition-colors leading-tight">
              4. Plant-Rich Diet
            </h3>
            <p className="text-[11px] text-[#5C6658] dark:text-[#9DB099] line-clamp-2">
              Cuts livestock enteric methane and spares land for rewilding.
            </p>
            <span className="inline-block text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              -1,100 kg CO₂e/yr
            </span>
          </div>

          {/* Solution 5 */}
          <div
            onClick={() => onNavigate('solutions')}
            className="p-4 rounded-xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-green-500/15 text-green-600 dark:text-green-400 flex items-center justify-center">
              <Trees className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-emerald-600 dark:group-hover:text-[#52e35b] transition-colors leading-tight">
              5. Urban Afforestation
            </h3>
            <p className="text-[11px] text-[#5C6658] dark:text-[#9DB099] line-clamp-2">
              Living carbon biosequestration via native canopy micro-forests.
            </p>
            <span className="inline-block text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              -650 kg CO₂e/yr
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE SCENARIO SIMULATOR & PLANETARY DIAL                         */}
      {/* ========================================================================= */}
      <ScenarioSimulator onNavigate={onNavigate} />

      {/* ========================================================================= */}
      {/* 7. METHODOLOGY & CLIMATE STANDARDS ALIGNMENT                              */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E0E7DE] dark:border-[#263824]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Accounting Framework
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] mt-0.5">
              Methodology & Climate Standards Alignment
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#F1EFEC] dark:bg-[#1A2619] border border-[#E8E4DF] dark:border-[#263824] rounded-full text-xs font-medium text-[#5C6658] dark:text-[#9DB099]">
              Standard: <strong className="text-[#1D2B17] dark:text-[#EEF5ED]">GHG Protocol</strong>
            </span>
            <span className="px-3 py-1 bg-[#D9E4D1] dark:bg-[#284024] text-[#1D2B17] dark:text-[#D9E4D1] border border-[#CCD9C3] dark:border-[#3E5637] rounded-full text-xs font-bold font-mono">
              Scopes 1, 2 & 3
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          <div className="bg-[#F7F9F6] dark:bg-[#0E160D] p-4 rounded-xl border border-[#E0E7DE] dark:border-[#263824] space-y-1">
            <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">1. Carbon Accounting</p>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Scopes 1, 2, and 3 modeling with verified Central Electricity Authority (0.716 kg CO₂/kWh) factors.
            </p>
          </div>
          <div className="bg-[#F7F9F6] dark:bg-[#0E160D] p-4 rounded-xl border border-[#E0E7DE] dark:border-[#263824] space-y-1">
            <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">2. 5 Flagship Solutions</p>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Synthesized directly from our presentation research: Solar PV, Heat Pumps, EVs, Diets, and Afforestation.
            </p>
          </div>
          <div className="bg-[#F7F9F6] dark:bg-[#0E160D] p-4 rounded-xl border border-[#E0E7DE] dark:border-[#263824] space-y-1">
            <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">3. Decarbonization Engine</p>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Real-time calculation engine, dynamic roadmap generation, and financial savings projections.
            </p>
          </div>
          <div className="bg-[#F7F9F6] dark:bg-[#0E160D] p-4 rounded-xl border border-[#E0E7DE] dark:border-[#263824] space-y-1">
            <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">4. Google Drive Sync</p>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Direct cloud integration allowing users to export structured plans directly into Google Drive.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8C7851] mb-2.5">
            Peer-Reviewed Scientific Data Sources
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <a
              href="https://www.ipcc.ch/assessment-report/ar6/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#F7F9F6] dark:bg-[#0E160D] border border-[#E0E7DE] dark:border-[#263824] rounded-xl hover:border-emerald-500 transition-all flex items-center justify-between group"
            >
              <div className="truncate">
                <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-emerald-600 transition-colors truncate">IPCC AR6 (2023)</p>
                <p className="text-[11px] text-[#737C70] dark:text-[#839580] truncate">WG III Climate Mitigation</p>
              </div>
              <ExternalLink className="w-3 h-3 text-[#8C7851] shrink-0 ml-2" />
            </a>

            <a
              href="https://ghgprotocol.org/corporate-standard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#F7F9F6] dark:bg-[#0E160D] border border-[#E0E7DE] dark:border-[#263824] rounded-xl hover:border-emerald-500 transition-all flex items-center justify-between group"
            >
              <div className="truncate">
                <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-emerald-600 transition-colors truncate">GHG Protocol Standard</p>
                <p className="text-[11px] text-[#737C70] dark:text-[#839580] truncate">WRI & WBCSD</p>
              </div>
              <ExternalLink className="w-3 h-3 text-[#8C7851] shrink-0 ml-2" />
            </a>

            <a
              href="https://cea.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#F7F9F6] dark:bg-[#0E160D] border border-[#E0E7DE] dark:border-[#263824] rounded-xl hover:border-emerald-500 transition-all flex items-center justify-between group"
            >
              <div className="truncate">
                <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-emerald-600 transition-colors truncate">CEA India & BEE</p>
                <p className="text-[11px] text-[#737C70] dark:text-[#839580] truncate">0.716 kg CO₂/kWh Grid Factor</p>
              </div>
              <ExternalLink className="w-3 h-3 text-[#8C7851] shrink-0 ml-2" />
            </a>

            <a
              href="https://www.iea.org/reports/net-zero-roadmap-a-global-pathway-to-keep-the-15-0c-goal-in-reach"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 bg-[#F7F9F6] dark:bg-[#0E160D] border border-[#E0E7DE] dark:border-[#263824] rounded-xl hover:border-emerald-500 transition-all flex items-center justify-between group"
            >
              <div className="truncate">
                <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-emerald-600 transition-colors truncate">IEA Net Zero 2050</p>
                <p className="text-[11px] text-[#737C70] dark:text-[#839580] truncate">Technology Roadmaps</p>
              </div>
              <ExternalLink className="w-3 h-3 text-[#8C7851] shrink-0 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
