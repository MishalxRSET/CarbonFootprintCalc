import React from 'react';
import { PageTab } from '../types';
import { AtmosphericCanvas } from './AtmosphericCanvas';
import { ScenarioSimulator } from './ScenarioSimulator';
import { SpotlightCard, ShinyText, Magnet } from './reactbits';
import {
  ArrowRight,
  TrendingDown,
  Layers,
  Users,
  Leaf,
  Globe2,
  BookOpen,
  CheckCircle,
  Cloud,
  Cpu,
  Sparkles,
  Zap,
  Car,
  Building2,
  Utensils,
  Recycle,
  ExternalLink,
  Sun,
  Trees,
  Droplets,
  Lightbulb,
  Compass,
  ArrowUpRight,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION (With Nature Backdrop & High-Impact Copy)       */}
      {/* ========================================================================= */}
      <div
        id="home"
        className="relative rounded-[36px] overflow-hidden shadow-2xl border border-[#263820] text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(3,24,12,0.92) 0%, rgba(3,24,12,0.72) 55%, rgba(3,24,12,0.38) 100%), url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=90")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-3xl space-y-6">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#6bea73] bg-[#09200e]/80 backdrop-blur-md text-[#7bf583] text-xs font-semibold tracking-wide shadow-xs">
            <span className="text-sm">🌍</span>
            <span>Building a sustainable tomorrow</span>
          </div>

          {/* Core Mission Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-white leading-[1.05]">
            Our planet.<br />
            <span className="text-[#65e66d] drop-shadow-sm">Our responsibility.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[#e2f2e4] text-base sm:text-xl leading-relaxed max-w-2xl font-light">
            Carbon Zero is a vision for a cleaner world where technology, people and nature
            work together to reduce carbon emissions and protect future generations.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-4">
            <Magnet padding={20} magnetStrength={1.5}>
              <button
                id="hero-explore-solutions-btn"
                onClick={() => onNavigate('solutions')}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#67e56e] text-[#09200e] font-bold text-xs sm:text-sm hover:bg-[#58d75f] transition-all shadow-lg hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Solutions</span>
                <ArrowRight className="w-4 h-4 text-[#09200e]" />
              </button>
            </Magnet>

            <button
              id="hero-launch-calculator-btn"
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>Carbon Calculator</span>
            </button>

            <button
              id="hero-view-planner-btn"
              onClick={() => onNavigate('planner')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#243520]/80 hover:bg-[#2F472A] border border-[#3E5637] text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>Reduction Planner</span>
            </button>

            <button
              id="hero-view-drive-save-btn"
              onClick={() => onNavigate('drive_save')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-black/30 hover:bg-black/45 text-white/90 border border-white/20 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <Cloud className="w-4 h-4 text-[#7bf583]" />
              <span>Save Plan to Drive</span>
            </button>

            {onOpenGuidedTour && (
              <button
                id="hero-open-guided-tour-btn"
                type="button"
                onClick={onOpenGuidedTour}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/95 dark:bg-[#122616]/90 hover:bg-white dark:hover:bg-[#1A3821] text-[#0A200E] dark:text-[#52e35b] font-bold text-xs sm:text-sm border border-emerald-500/40 dark:border-emerald-500/50 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-700 dark:text-[#52e35b]" />
                <span className="text-[#0A200E] dark:text-[#52e35b] font-bold">Quick Tour</span>
              </button>
            )}

            <button
              id="hero-view-designdoc-btn"
              onClick={onOpenDesignDoc}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#8C7851]/85 hover:bg-[#736242] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Design Doc</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1.5. INTERACTIVE 3-STEP QUICK-START ROADMAP                               */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#141E13] p-6 sm:p-8 rounded-[32px] border border-[#E0E7DE] dark:border-[#263824] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A6741] dark:text-[#78B169] flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Recommended Pathway
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] mt-0.5">
              How to Use Carbon Zero in 3 Simple Steps
            </h2>
          </div>
          {onOpenGuidedTour && (
            <button
              type="button"
              onClick={onOpenGuidedTour}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A6741] dark:text-[#78B169] hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Step-by-Step Tour →</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div
            onClick={() => onNavigate('calculator')}
            className="p-6 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-[#4A6741] dark:hover:border-[#78B169] transition-all cursor-pointer group space-y-3 hover:-translate-y-1"
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
              Input domestic power, vehicle fuel, LPG, and flights. Instant Scope 1, 2 & 3 emissions calculated using Indian CEA factors.
            </p>
            <span className="inline-block text-[11px] font-bold text-[#4A6741] dark:text-[#78B169]">
              Launch Calculator →
            </span>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => onNavigate('solutions')}
            className="p-6 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-[#8C7851] dark:hover:border-[#D4AF37] transition-all cursor-pointer group space-y-3 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#F5EFE6] dark:bg-[#2A2316] text-[#8C7851] dark:text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <ArrowRight className="w-4 h-4 text-[#737C70] group-hover:text-[#8C7851] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
              Explore Solutions
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Compare 16+ vetted interventions including solar PV, heat pumps, EV transition, and food waste composting with full payback data.
            </p>
            <span className="inline-block text-[11px] font-bold text-[#8C7851] dark:text-[#D4AF37]">
              Browse 16+ Solutions →
            </span>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => onNavigate('planner')}
            className="p-6 rounded-2xl bg-[#F7F9F6] dark:bg-[#1A2619] border border-[#E0E7DE] dark:border-[#263824] hover:border-[#4A6741] dark:hover:border-[#78B169] transition-all cursor-pointer group space-y-3 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-full bg-[#E8EFE5] dark:bg-[#203623] text-[#2E4726] dark:text-[#78B169] font-bold text-xs flex items-center justify-center">
                3
              </span>
              <ArrowRight className="w-4 h-4 text-[#737C70] group-hover:text-[#4A6741] group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED]">
              Build Roadmap & Save
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Simulate dynamic trajectories over 5–10 years, calculate annual financial ROI (₹), and save your plan directly to Google Drive.
            </p>
            <span className="inline-block text-[11px] font-bold text-[#4A6741] dark:text-[#78B169]">
              Simulate Trajectory →
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS & CORE PILLARS (Bridging Hero with Essential Metrics)             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => onNavigate('calculator')}
          className="bg-white dark:bg-[#141E13] p-6 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-sm hover:shadow-md hover:border-[#4A6741] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl font-serif font-bold text-[#1e9b43] group-hover:scale-105 transition-transform">
              CO₂
            </span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#F1EFEC] dark:bg-[#1A2619] text-[#5C6658] dark:text-[#9DB099]">
              &gt;426 ppm
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-1">Atmospheric Carbon</h3>
          <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
            Major greenhouse gas driving climate change. Quantified using Central Electricity Authority (CEA India) & GHG Protocol emission factors.
          </p>
        </div>

        <div
          onClick={() => onNavigate('solutions')}
          className="bg-white dark:bg-[#141E13] p-6 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-sm hover:shadow-md hover:border-[#4A6741] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl group-hover:scale-105 transition-transform">🌳</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#D9E4D1] dark:bg-[#284024] text-[#1D2B17] dark:text-[#D9E4D1]">
              ~30% Sinks
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-1">Living Carbon Sinks</h3>
          <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
            Healthy forests and biospheres absorb biological carbon and support essential global biodiversity.
          </p>
        </div>

        <div
          onClick={() => onNavigate('solutions')}
          className="bg-white dark:bg-[#141E13] p-6 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-sm hover:shadow-md hover:border-[#4A6741] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl group-hover:scale-105 transition-transform">♻️</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#F1EFEC] dark:bg-[#1A2619] text-[#5C6658] dark:text-[#9DB099]">
              Scope 3
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-1">Circular Economy</h3>
          <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
            Reuse, repair, and organic composting eliminate landfill methanogenesis and reduce resource waste.
          </p>
        </div>

        <div
          onClick={() => onNavigate('calculator')}
          className="bg-white dark:bg-[#141E13] p-6 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-sm hover:shadow-md hover:border-[#4A6741] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl group-hover:scale-105 transition-transform">⚡</span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#D9E4D1] dark:bg-[#284024] text-[#1D2B17] dark:text-[#D9E4D1]">
              Zero-Emission
            </span>
          </div>
          <h3 className="text-sm font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-1">Clean Energy Transition</h3>
          <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
            Rooftop solar and grid electrification decouple energy generation from fossil fuel emissions.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CLIMATE EFFECTS SHOWCASE ("The impact of our carbon footprint")          */}
      {/* ========================================================================= */}
      <section
        id="effects"
        className="bg-[#102B18] text-white rounded-[36px] p-8 sm:p-12 space-y-8 border border-[#1E4226] shadow-xl"
      >
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6bea73]">
            <span>Planetary Diagnostics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
            The impact of our carbon footprint
          </h2>
          <p className="text-[#b9ccb9] text-sm sm:text-base leading-relaxed">
            Human activities release unprecedented quantities of greenhouse gases into the atmosphere.
            Understanding their systemic effects is the first step toward engineering effective solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Rising Temperatures */}
          <div
            className="min-h-[340px] rounded-[24px] p-7 flex flex-col justify-end relative overflow-hidden group shadow-lg border border-white/10"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 85%), url("https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?auto=format&fit=crop&w=1000&q=85")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 space-y-2 transform group-hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <span>🌡️</span>
                <span>Rising Temperatures</span>
              </h3>
              <p className="text-sm text-[#e2ece0] leading-relaxed">
                Increasing greenhouse-gas concentrations contribute to long-term global warming, intensified heat waves, and climate volatility.
              </p>
            </div>
          </div>

          {/* Card 2: Climate & Oceans */}
          <div
            className="min-h-[340px] rounded-[24px] p-7 flex flex-col justify-end relative overflow-hidden group shadow-lg border border-white/10"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 85%), url("https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=1000&q=85")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 space-y-2 transform group-hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <span>🌊</span>
                <span>Climate & Oceans</span>
              </h3>
              <p className="text-sm text-[#e2ece0] leading-relaxed">
                Thermal expansion, ice sheet melting, and ocean acidification destabilize marine habitats and coastal communities worldwide.
              </p>
            </div>
          </div>

          {/* Card 3: Ecosystem Loss */}
          <div
            className="min-h-[340px] rounded-[24px] p-7 flex flex-col justify-end relative overflow-hidden group shadow-lg border border-white/10"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.88) 85%), url("https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1000&q=85")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="relative z-10 space-y-2 transform group-hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <span>🌲</span>
                <span>Ecosystem Loss</span>
              </h3>
              <p className="text-sm text-[#e2ece0] leading-relaxed">
                Changing biomes and severe drought place compounding pressure on ancient forests, wildlife corridors, and ecological stability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. REAL-TIME ATMOSPHERIC CARBON FLUX & PARTICLE DYNAMICS CANVAS           */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
                Interactive Atmospheric Model
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D9E4D1] dark:bg-[#1C3320] text-[#142616] dark:text-[#52e35b] border border-[#CCD9C3] dark:border-[#2F4D33]">
                60 FPS KINETIC CANVAS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] mt-1 tracking-tight">
              Real-Time Atmospheric Carbon Flux & Boundary Dynamics
            </h2>
          </div>
          <p className="text-xs text-[#737C70] dark:text-[#839580] font-mono max-w-sm sm:text-right">
            Visualizing biospheric sinks vs. anthropogenic emissions. Move cursor to deflect particle vectors.
          </p>
        </div>

        <AtmosphericCanvas />
      </div>

      {/* ========================================================================= */}
      {/* 5. CURATED SOLUTIONS SHOWCASE ("How can we reduce our carbon footprint?") */}
      {/* ========================================================================= */}
      <section id="solutions-curated" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Decarbonization Pathways
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
              How can we reduce our carbon footprint?
            </h2>
            <p className="text-sm text-[#5C6658] dark:text-[#9DB099] mt-1.5 max-w-2xl">
              Sustainable development is about meeting today's needs while protecting the ability
              of future generations to meet theirs.
            </p>
          </div>

          <button
            id="curated-explore-all-solutions-btn"
            onClick={() => onNavigate('solutions')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A6741] hover:bg-[#3E5637] text-white rounded-full text-xs font-bold transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open All 12 Solutions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Solution 1: Clean Energy */}
          <div
            onClick={() => onNavigate('solutions')}
            className="bg-white dark:bg-[#141E13] rounded-[24px] overflow-hidden border border-[#E0E7DE] dark:border-[#263824] shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-56 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=90"
                alt="Clean Energy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                Scope 2 Intervention
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-[#4A6741] transition-colors flex items-center gap-2">
                <span>☀️</span>
                <span>Clean Energy</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
                Expand renewable energy such as rooftop solar PV, wind generation, and distributed storage while improving facility energy efficiency.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#4A6741]">
                <span>Abate up to 1,850 kg CO₂e/yr</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Solution 2: Restore Nature */}
          <div
            onClick={() => onNavigate('solutions')}
            className="bg-white dark:bg-[#141E13] rounded-[24px] overflow-hidden border border-[#E0E7DE] dark:border-[#263824] shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-56 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=90"
                alt="Restore Nature"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                Carbon Sinks & Soils
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-[#4A6741] transition-colors flex items-center gap-2">
                <span>🌳</span>
                <span>Restore Nature</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
                Protect old-growth forests, restore native wetland ecosystems, and expand urban greenery to maximize biological carbon sequestration.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#4A6741]">
                <span>Biodiversity & Watershed Protection</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Solution 3: Sustainable Transport */}
          <div
            onClick={() => onNavigate('solutions')}
            className="bg-white dark:bg-[#141E13] rounded-[24px] overflow-hidden border border-[#E0E7DE] dark:border-[#263824] shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-56 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=90"
                alt="Sustainable Transport"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                Scope 1 Electrification
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-[#4A6741] transition-colors flex items-center gap-2">
                <span>🚲</span>
                <span>Sustainable Transport</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
                Encourage walking, protected cycling infrastructure, electric public mass transit, and electric vehicle fleet conversions.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#4A6741]">
                <span>Abate ~2,200 kg CO₂e/vehicle</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Solution 4: Circular Economy */}
          <div
            onClick={() => onNavigate('solutions')}
            className="bg-white dark:bg-[#141E13] rounded-[24px] overflow-hidden border border-[#E0E7DE] dark:border-[#263824] shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="h-56 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=90"
                alt="Circular Economy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                Scope 3 Waste Diversion
              </span>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-serif font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-[#4A6741] transition-colors flex items-center gap-2">
                <span>♻️</span>
                <span>Circular Economy</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
                Eliminate landfill waste through cradle-to-cradle product design, local reuse centers, food waste recovery, and responsible material recycling.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#4A6741]">
                <span>Zero-CapEx immediate impact</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE SCENARIO SIMULATOR & PLANETARY DIAL                         */}
      {/* ========================================================================= */}
      <ScenarioSimulator onNavigate={onNavigate} />

      {/* ========================================================================= */}
      {/* 7. CINEMATIC FUTURE VISION BANNER ("The future we create today")           */}
      {/* ========================================================================= */}
      <section
        id="future"
        className="relative rounded-[36px] overflow-hidden shadow-2xl p-10 sm:p-16 text-center text-white border border-[#263820]"
        style={{
          backgroundImage: `linear-gradient(rgba(5,30,14,0.85), rgba(5,30,14,0.92)), url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=90")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#65e66d] text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Planetary Horizon</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-medium text-white tracking-tight leading-tight">
            The future we create today
          </h2>

          <p className="text-base sm:text-lg text-[#d5e5d7] font-light leading-relaxed">
            Sustainable development is more than reducing emissions. It means creating healthier communities,
            protecting biodiversity, using resources responsibly and building resilient societies for generations to come.
          </p>

          <p className="text-base sm:text-xl font-medium text-white pt-2">
            A Carbon Zero future begins with the choices we make today.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('planner')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#67e56e] text-[#09200e] font-bold text-xs sm:text-sm hover:bg-[#58d75f] transition-all shadow-lg cursor-pointer"
            >
              <span>Build Your Decarbonization Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <span>Calculate Baseline Footprint</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. START YOUR CARBON ZERO JOURNEY (Action Cards Grid)                      */}
      {/* ========================================================================= */}
      <section id="action" className="space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
            Everyday Interventions
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
            Start your Carbon Zero journey
          </h2>
          <p className="text-sm text-[#5C6658] dark:text-[#9DB099] mt-1.5">
            Small actions become powerful when millions of people participate together.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Action 1: Use Energy Wisely */}
          <div
            onClick={() => onNavigate('calculator')}
            className="bg-white dark:bg-[#141E13] p-7 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all cursor-pointer group"
          >
            <div className="text-3xl mb-3">💡</div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-2 group-hover:text-[#4A6741] transition-colors">
              Use Energy Wisely
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Switch off unused devices, program smart setback thermostats, and choose clean electricity providers where available.
            </p>
          </div>

          {/* Action 2: Protect Nature */}
          <div
            onClick={() => onNavigate('solutions')}
            className="bg-white dark:bg-[#141E13] p-7 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all cursor-pointer group"
          >
            <div className="text-3xl mb-3">🌱</div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-2 group-hover:text-[#4A6741] transition-colors">
              Protect Nature
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Plant native trees, support biodiversity corridors, and participate in responsible local ecosystem restoration.
            </p>
          </div>

          {/* Action 3: Consume Responsibly */}
          <div
            onClick={() => onNavigate('calculator')}
            className="bg-white dark:bg-[#141E13] p-7 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all cursor-pointer group"
          >
            <div className="text-3xl mb-3">♻️</div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-2 group-hover:text-[#4A6741] transition-colors">
              Consume Responsibly
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Reduce unnecessary consumption, favor repairable durable items, and recycle single-stream materials correctly.
            </p>
          </div>

          {/* Action 4: Choose Green Mobility */}
          <div
            onClick={() => onNavigate('solutions')}
            className="bg-white dark:bg-[#141E13] p-7 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all cursor-pointer group"
          >
            <div className="text-3xl mb-3">🚲</div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-2 group-hover:text-[#4A6741] transition-colors">
              Choose Green Mobility
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Walk, bicycle, carpool with zero-emission electric vehicles, or use municipal mass transit whenever practical.
            </p>
          </div>

          {/* Action 5: Save Resources */}
          <div
            onClick={() => onNavigate('solutions')}
            className="bg-white dark:bg-[#141E13] p-7 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all cursor-pointer group"
          >
            <div className="text-3xl mb-3">💧</div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-2 group-hover:text-[#4A6741] transition-colors">
              Save Resources
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Conserve potable water through low-flow fixtures and reduce food waste through mindful culinary habits.
            </p>
          </div>

          {/* Action 6: Inspire Others */}
          <div
            onClick={onOpenDesignDoc}
            className="bg-white dark:bg-[#141E13] p-7 rounded-[24px] border border-[#E0E7DE] dark:border-[#263824] shadow-xs hover:shadow-md hover:-translate-y-1.5 transition-all cursor-pointer group"
          >
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-base font-bold text-[#1D2B17] dark:text-[#EEF5ED] mb-2 group-hover:text-[#4A6741] transition-colors">
              Inspire Others
            </h3>
            <p className="text-xs text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Share your audited emission reductions, champion institutional green policies, and build community climate awareness.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. METHODOLOGY & CLIMATE STANDARDS ALIGNMENT                              */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-[32px] p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E0E7DE] dark:border-[#263824]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Accounting Framework
            </span>
            <h3 className="text-2xl font-serif text-[#1D2B17] dark:text-[#EEF5ED] mt-1">
              Methodology & Climate Standards Alignment
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 bg-[#F1EFEC] dark:bg-[#1A2619] border border-[#E8E4DF] dark:border-[#263824] rounded-full text-xs font-medium text-[#5C6658] dark:text-[#9DB099]">
              Standard: <strong className="text-[#1D2B17] dark:text-[#EEF5ED]">GHG Protocol</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-[#F1EFEC] dark:bg-[#1A2619] border border-[#E8E4DF] dark:border-[#263824] rounded-full text-xs font-medium text-[#5C6658] dark:text-[#9DB099]">
              Target: <strong className="text-[#1D2B17] dark:text-[#EEF5ED]">Net-Zero 2030</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-[#D9E4D1] dark:bg-[#284024] text-[#1D2B17] dark:text-[#D9E4D1] border border-[#CCD9C3] dark:border-[#3E5637] rounded-full text-xs font-bold font-mono">
              Scopes 1, 2 & 3
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#F7F9F6] dark:bg-[#0E160D] p-5 rounded-2xl border border-[#E0E7DE] dark:border-[#263824] space-y-1.5">
            <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">1. Carbon Accounting & Scopes</p>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Mathematical modeling across Scopes 1, 2, and 3 with verified CEA (India), BEE, and GHG Protocol factors.
            </p>
          </div>
          <div className="bg-[#F7F9F6] dark:bg-[#0E160D] p-5 rounded-2xl border border-[#E0E7DE] dark:border-[#263824] space-y-1.5">
            <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">2. Decarbonization Engine</p>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Real-time calculation engine, dynamic roadmap generation, and actionable intervention strategies.
            </p>
          </div>
          <div className="bg-[#F7F9F6] dark:bg-[#0E160D] p-5 rounded-2xl border border-[#E0E7DE] dark:border-[#263824] space-y-1.5">
            <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">3. Usability & Interactivity</p>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Dedicated functional views, responsive inputs, live visual breakdown charts, and scenario simulation.
            </p>
          </div>
          <div className="bg-[#F7F9F6] dark:bg-[#0E160D] p-5 rounded-2xl border border-[#E0E7DE] dark:border-[#263824] space-y-1.5">
            <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED]">4. Research Reference</p>
            <p className="text-[#5C6658] dark:text-[#9DB099] leading-relaxed">
              Direct ingestion and synthesis of the team's "CARBON FOOTPRINT REDUCTION.pptx" presentation.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 10. SCIENTIFIC DATA SOURCES & STANDARDS LINKS                             */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
          Peer-Reviewed Scientific Data Sources & Methodological Standards
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <a
            href="https://www.ipcc.ch/assessment-report/ar6/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl hover:border-[#4A6741] hover:shadow-xs transition-all flex items-start justify-between group"
          >
            <div className="space-y-1">
              <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-[#4A6741] transition-colors">IPCC AR6 (2023)</p>
              <p className="text-[#737C70] dark:text-[#839580]">Working Group III: Mitigation of Climate Change</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7851] mt-1 shrink-0" />
          </a>

          <a
            href="https://ghgprotocol.org/corporate-standard"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl hover:border-[#4A6741] hover:shadow-xs transition-all flex items-start justify-between group"
          >
            <div className="space-y-1">
              <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-[#4A6741] transition-colors">GHG Protocol Standard</p>
              <p className="text-[#737C70] dark:text-[#839580]">World Resources Institute (WRI) & WBCSD</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7851] mt-1 shrink-0" />
          </a>

          <a
            href="https://cea.nic.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl hover:border-[#4A6741] hover:shadow-xs transition-all flex items-start justify-between group"
          >
            <div className="space-y-1">
              <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-[#4A6741] transition-colors">CEA India & BEE</p>
              <p className="text-[#737C70] dark:text-[#839580]">Central Electricity Authority CO₂ Baseline Database & BEE India</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7851] mt-1 shrink-0" />
          </a>

          <a
            href="https://www.iea.org/reports/net-zero-roadmap-a-global-pathway-to-keep-the-15-0c-goal-in-reach"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white dark:bg-[#141E13] border border-[#E0E7DE] dark:border-[#263824] rounded-2xl hover:border-[#4A6741] hover:shadow-xs transition-all flex items-start justify-between group"
          >
            <div className="space-y-1">
              <p className="font-bold text-[#1D2B17] dark:text-[#EEF5ED] group-hover:text-[#4A6741] transition-colors">IEA Net Zero 2050</p>
              <p className="text-[#737C70] dark:text-[#839580]">Global Decarbonization Technology Roadmaps</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7851] mt-1 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};

