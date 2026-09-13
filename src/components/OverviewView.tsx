import React from 'react';
import { PageTab } from '../types';
import { AtmosphericCanvas } from './AtmosphericCanvas';
import { ScenarioSimulator } from './ScenarioSimulator';
import { SpotlightCard, ShinyText, DecryptedText, Magnet } from './reactbits';
import { formatINR } from '../utils/currency';
import {
  ArrowRight,
  TrendingDown,
  Layers,
  Users,
  Award,
  Globe2,
  BookOpen,
  CheckCircle,
  HardDrive,
  Cpu,
  Sparkles,
  Zap,
  Car,
  Building2,
  Utensils,
  Recycle,
  Orbit,
  ExternalLink,
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDesignDoc: () => void;
  onOpenCommandPalette?: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onOpenDesignDoc,
  onOpenCommandPalette,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Editorial Header */}
      <div className="bg-[#131E10] text-white rounded-[36px] p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-[#263820]">
        {/* Ambient atmospheric glow in corner */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#4A6741]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#8C7851]/15 blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#D9E4D1] text-xs font-mono font-medium tracking-wide">
            <Award className="w-3.5 h-3.5 text-[#78B169]" />
            <ShinyText
              text="CO900G Alternative Assessment Method (AAM) • Modules 3 & 4"
              speed={3}
              className="text-[#D9E4D1]"
            />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-white leading-[1.08]">
            Atmospheric Carbon Modeling & Engineering Decarbonization
          </h1>

          <p className="text-[#C5D3C1] text-base sm:text-lg leading-relaxed max-w-2xl font-light">
            An engineering and IT-enabled sustainability platform designed to model, audit, and systematically
            decarbonize anthropogenic greenhouse gas emissions across institutional, domestic, and industrial systems.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Magnet padding={20} magnetStrength={1.5}>
              <button
                id="hero-enter-persepolis-btn"
                onClick={() => onNavigate('persepolis_citadel')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-[#121810] font-bold text-xs sm:text-sm hover:brightness-110 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ring-2 ring-[#D4AF37]/50"
              >
                <Globe2 className="w-4 h-4 text-[#121810]" />
                <span>Enter Persepolis 3D Citadel</span>
                <ArrowRight className="w-4 h-4 text-[#121810]" />
              </button>
            </Magnet>

            <button
              id="hero-explore-solutions-btn"
              onClick={() => onNavigate('solutions')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#1D2B17] font-bold text-xs sm:text-sm hover:bg-[#F1EFEC] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-[#4A6741]" />
              <span>Solutions Directory</span>
            </button>

            <button
              id="hero-launch-calculator-btn"
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#243520] text-white border border-[#3E5637] font-semibold text-xs sm:text-sm hover:bg-[#2F472A] transition-all"
            >
              <span>Carbon Calculator</span>
            </button>

            <button
              id="hero-view-drive-pptx-btn"
              onClick={() => onNavigate('drive_findings')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/10 text-white border border-white/20 font-semibold text-xs sm:text-sm hover:bg-white/20 transition-colors"
            >
              <HardDrive className="w-4 h-4 text-[#D9E4D1]" />
              <span>Drive Findings</span>
            </button>

            <button
              id="hero-view-designdoc-btn"
              onClick={onOpenDesignDoc}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#8C7851] hover:bg-[#736242] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Design Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kochi Decarbonization 3D Interactive Case Study Gateway Banner */}
      <div className="relative rounded-[36px] bg-[#0E1710] border border-[#22C55E]/40 p-8 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#22C55E]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#06B6D4]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#4ADE80] text-xs font-mono font-bold tracking-wider uppercase">
                INTERACTIVE 3D CASE STUDY
              </span>
              <span className="text-xs text-[#9CB395] font-mono">KOCHI, KERALA • ZERO-CARBON ODYSSEY</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-medium text-white tracking-tight">
              Kochi Decarbonization: A Simulated 3D Aerial Odyssey
            </h2>

            <p className="text-sm sm:text-base text-[#C2CDBE] leading-relaxed font-light">
              Experience an immersive, fun-to-scroll 3D flight across Kochi simulating real-world engineering solutions.
              Explore 6 accurately positioned landmarks: <strong>Rajagiri School of Engineering & Technology (RSET)</strong> green campus microgrid,
              the world-famous 100% solar CIAL Airport, silent electric Water Metro catamarans, Infopark tech towers, Cochin Port cold-ironing berths, and Fort Kochi heritage.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-[#4ADE80]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                RSET Kakkanad & 5 Key Locations
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                Fun Scroll-Driven Aerial Flight
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                Interactive Sliders & ₹ INR Telemetry
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Magnet padding={25} magnetStrength={2}>
              <button
                id="btn-launch-kochi-banner"
                onClick={() => onNavigate('kochi_simulation')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#22C55E] via-[#10B981] to-[#06B6D4] text-[#0A160C] font-serif font-bold text-sm tracking-wide hover:brightness-110 transition-all shadow-xl hover:scale-105"
              >
                <Globe2 className="w-4 h-4 text-[#0A160C]" />
                <span>Launch Kochi 3D Simulation</span>
                <ArrowRight className="w-4 h-4 text-[#0A160C]" />
              </button>
            </Magnet>
          </div>
        </div>
      </div>

      {/* Atmospheric Carbon Simulation & Orbit Canvas Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
                Interactive Atmospheric Simulation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D9E4D1] text-[#1D2B17]">
                60 FPS KINETIC CANVAS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1D2B17] mt-1 tracking-tight">
              Real-Time Atmospheric Carbon Flux & Boundary Simulation
            </h2>
          </div>
          <p className="text-xs text-[#737C70] font-mono max-w-sm sm:text-right">
            Visualizing biospheric sinks vs. anthropogenic emissions. Interact with the particle field to simulate flow deflections.
          </p>
        </div>

        {/* Interactive Atmospheric Canvas Component */}
        <AtmosphericCanvas />
      </div>

      {/* 3 Core Scientific & Protocol Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E0E7DE] rounded-[32px] p-8 shadow-xs space-y-4 hover:border-[#4A6741]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Atmospheric Science
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#F1EFEC] text-[#8C7851] flex items-center justify-center font-bold">
              <Globe2 className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-2xl font-serif text-[#1D2B17]">The Climate Challenge</h2>
          <p className="text-sm text-[#5C6658] leading-relaxed">
            Atmospheric CO₂ concentrations have reached historically unprecedented levels (&gt;426 ppm).
            Global anthropogenic greenhouse gas emissions must decline by 45% by 2030 to stabilize the global mean
            temperature anomaly below the 1.5°C threshold identified in IPCC AR6.
          </p>
          <div className="pt-2 text-xs font-semibold text-[#4A6741] flex items-center gap-1.5 font-mono">
            <TrendingDown className="w-4 h-4" />
            <span>Target: Reduce per-capita emissions to &lt;2 tCO₂e/yr</span>
          </div>
        </div>

        <div className="bg-[#F1EFEC] border border-[#E8E4DF] rounded-[32px] p-8 shadow-xs space-y-4 hover:border-[#8C7851]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Accounting Protocol
            </span>
            <div className="w-10 h-10 rounded-2xl bg-white text-[#4A6741] flex items-center justify-center font-bold shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-2xl font-serif text-[#1D2B17]">Scope 1, 2 & 3 Framework</h2>
          <p className="text-sm text-[#5C6658] leading-relaxed">
            Standardized in the GHG Protocol, our engine quantifies:
            <strong className="text-[#1D2B17]"> Scope 1</strong> (direct combustion in furnaces & vehicles),
            <strong className="text-[#1D2B17]"> Scope 2</strong> (purchased grid electricity), and
            <strong className="text-[#1D2B17]"> Scope 3</strong> (upstream food systems, aviation, supply chain, and solid waste).
          </p>
          <div className="pt-2 text-xs font-semibold text-[#4A6741] flex items-center gap-1.5 font-mono">
            <CheckCircle className="w-4 h-4" />
            <span>Multi-tier granular emission factor auditing</span>
          </div>
        </div>

        <div className="bg-[#D9E4D1] border border-[#CCD9C3] rounded-[32px] p-8 shadow-xs space-y-4 hover:border-[#4A6741] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#4A6741]">
              Target Community
            </span>
            <div className="w-10 h-10 rounded-2xl bg-white text-[#4A6741] flex items-center justify-center font-bold shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-2xl font-serif text-[#1D2B17]">Target Stakeholders</h2>
          <p className="text-sm text-[#3E5637] leading-relaxed">
            Engineered for university campus facility administrators, engineering researchers, academic dormitories,
            and small-to-medium enterprises (SMEs) seeking actionable, cost-effective abatement roadmaps with verified
            return-on-investment (ROI).
          </p>
          <div className="pt-2 text-xs font-semibold text-[#1D2B17] flex items-center gap-1.5 font-mono">
            <Cpu className="w-4 h-4 text-[#4A6741]" />
            <span>Decision-support & engineering optimization</span>
          </div>
        </div>
      </div>

      {/* Interactive Decarbonization Pathway Simulator & Planetary Dial */}
      <ScenarioSimulator onNavigate={onNavigate} />

      {/* Engineered Solutions for the Problem Given */}
      <div className="bg-white border border-[#E0E7DE] rounded-[36px] p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E0E7DE]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
                Intervention Strategy
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D9E4D1] text-[#1D2B17]">
                12 Technical Solutions
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1D2B17] mt-1">
              Engineered Solutions for the Problem Given
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6658] mt-1 max-w-2xl">
              Concrete technical, operational, and behavioral solutions directly mitigating the fossil fuel and supply-chain
              drivers identified in the research presentation.
            </p>
          </div>

          <button
            id="overview-view-all-solutions-btn"
            onClick={() => onNavigate('solutions')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A6741] hover:bg-[#3E5637] text-white rounded-full text-xs font-bold transition-colors shadow-xs shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Solutions Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Key Solutions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 text-xs">
          <SpotlightCard
            onClick={() => onNavigate('solutions')}
            spotlightColor="rgba(74, 103, 65, 0.15)"
            className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] hover:border-[#4A6741] hover:bg-white hover:shadow-xs transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#F1EFEC] text-[#8C7851] flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7851]">Scope 2</span>
            </div>
            <h3 className="font-bold text-sm text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">
              Rooftop Solar PV & Distributed Microgeneration
            </h3>
            <p className="text-[#5C6658] leading-relaxed text-[11px]">
              Replaces fossil fuel peaking power plants with on-site monocrystalline solar harvesting, yielding 1,850 kg CO₂e annual abatement per installation.
            </p>
            <div className="pt-2 border-t border-[#E0E7DE] flex items-center justify-between text-[11px]">
              <span className="text-[#4A6741] font-semibold">Payback: 4.4 yrs</span>
              <span className="text-[#8C7851] font-semibold">Save ~₹75,000/yr</span>
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() => onNavigate('solutions')}
            spotlightColor="rgba(74, 103, 65, 0.15)"
            className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] hover:border-[#4A6741] hover:bg-white hover:shadow-xs transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#F1EFEC] text-[#4A6741] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A6741]">Scope 1</span>
            </div>
            <h3 className="font-bold text-sm text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">
              Cold-Climate Inverter Heat Pump Retrofit
            </h3>
            <p className="text-[#5C6658] leading-relaxed text-[11px]">
              Eliminates natural gas and heating oil combustion furnaces with thermodynamic vapor-compression yielding &gt;300% seasonal efficiency (COP 3.5).
            </p>
            <div className="pt-2 border-t border-[#E0E7DE] flex items-center justify-between text-[11px]">
              <span className="text-[#4A6741] font-semibold">Payback: 5.2 yrs</span>
              <span className="text-[#8C7851] font-semibold">Save ~₹58,000/yr</span>
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() => onNavigate('solutions')}
            spotlightColor="rgba(74, 103, 65, 0.15)"
            className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] hover:border-[#4A6741] hover:bg-white hover:shadow-xs transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#F1EFEC] text-[#4A6741] flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A6741]">Scope 1</span>
            </div>
            <h3 className="font-bold text-sm text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">
              Electric Mobility & Smart Level 2 Charging
            </h3>
            <p className="text-[#5C6658] leading-relaxed text-[11px]">
              Substitutes internal combustion engines (ICE) with permanent magnet BEVs, eliminating 2,200 kg CO₂e/yr and hazardous localized NOx/PM2.5.
            </p>
            <div className="pt-2 border-t border-[#E0E7DE] flex items-center justify-between text-[11px]">
              <span className="text-[#4A6741] font-semibold">Payback: 5.5 yrs</span>
              <span className="text-[#8C7851] font-semibold">Save ~₹1,10,000/yr</span>
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() => onNavigate('solutions')}
            spotlightColor="rgba(74, 103, 65, 0.15)"
            className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] hover:border-[#4A6741] hover:bg-white hover:shadow-xs transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#F1EFEC] text-[#8C7851] flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7851]">Scope 3</span>
            </div>
            <h3 className="font-bold text-sm text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">
              Plant-Rich & Low-Ruminant Dietary Transition
            </h3>
            <p className="text-[#5C6658] leading-relaxed text-[11px]">
              Eliminates enteric methane fermentation and deforestation drivers, abating 1,100 kg CO₂e per person with immediate zero-CapEx grocery savings.
            </p>
            <div className="pt-2 border-t border-[#E0E7DE] flex items-center justify-between text-[11px]">
              <span className="text-[#4A6741] font-semibold">Payback: Immediate</span>
              <span className="text-[#8C7851] font-semibold">Save ~₹52,000/yr</span>
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() => onNavigate('solutions')}
            spotlightColor="rgba(74, 103, 65, 0.15)"
            className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] hover:border-[#4A6741] hover:bg-white hover:shadow-xs transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#F1EFEC] text-[#4A6741] flex items-center justify-center">
                <Recycle className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A6741]">Scope 3</span>
            </div>
            <h3 className="font-bold text-sm text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">
              Food Waste Diversion & Aerobic Composting
            </h3>
            <p className="text-[#5C6658] leading-relaxed text-[11px]">
              Prevents anaerobic landfill decomposition methanogenesis while generating high-fertility soil humus that sequesters biological carbon.
            </p>
            <div className="pt-2 border-t border-[#E0E7DE] flex items-center justify-between text-[11px]">
              <span className="text-[#4A6741] font-semibold">Payback: &lt;2 mos</span>
              <span className="text-[#8C7851] font-semibold">Save ~₹62,000/yr</span>
            </div>
          </SpotlightCard>

          <SpotlightCard
            onClick={() => onNavigate('solutions')}
            spotlightColor="rgba(74, 103, 65, 0.15)"
            className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] hover:border-[#4A6741] hover:bg-white hover:shadow-xs transition-all cursor-pointer space-y-2.5 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#F1EFEC] text-[#5C6658] flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C6658]">Scope 2</span>
            </div>
            <h3 className="font-bold text-sm text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">
              IoT Predictive Controls & Deep Building Envelope
            </h3>
            <p className="text-[#5C6658] leading-relaxed text-[11px]">
              Automated smart setbacks, GaN solid-state lighting, and dense-pack cellulose insulation suppressing baseline facility thermodynamic leakage.
            </p>
            <div className="pt-2 border-t border-[#E0E7DE] flex items-center justify-between text-[11px]">
              <span className="text-[#4A6741] font-semibold">Payback: 1.1 yrs</span>
              <span className="text-[#8C7851] font-semibold">Save ~₹18,000/yr</span>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Course Alignment & Rubric Fulfillment Card */}
      <div className="bg-white border border-[#E0E7DE] rounded-[32px] p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E0E7DE]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Academic Alignment & Syllabus Criteria
            </span>
            <h3 className="text-2xl font-serif text-[#1D2B17] mt-1">
              CO900G Environmental Science & Sustainable Engineering
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-[#F1EFEC] border border-[#E8E4DF] rounded-full text-xs font-medium text-[#5C6658]">
              Outcome: <strong className="text-[#1D2B17]">CO4 (Primary)</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-[#F1EFEC] border border-[#E8E4DF] rounded-full text-xs font-medium text-[#5C6658]">
              Supports: <strong className="text-[#1D2B17]">CO3</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-[#D9E4D1] text-[#1D2B17] border border-[#CCD9C3] rounded-full text-xs font-bold font-mono">
              10 Marks AAM
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] space-y-1.5">
            <p className="font-bold text-[#1D2B17]">1. Problem Understanding</p>
            <p className="text-[#5C6658] leading-relaxed">
              Mathematical modeling of emissions across Scopes 1, 2, and 3 with verified EPA factors.
            </p>
          </div>
          <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] space-y-1.5">
            <p className="font-bold text-[#1D2B17]">2. Engineering & IT Solution</p>
            <p className="text-[#5C6658] leading-relaxed">
              Real-time interactive calculation engine, dynamic roadmap generation, and Google Drive cloud integration.
            </p>
          </div>
          <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] space-y-1.5">
            <p className="font-bold text-[#1D2B17]">3. Usability & Interactivity</p>
            <p className="text-[#5C6658] leading-relaxed">
              4 distinct functional screens, responsive inputs, live visual breakdown charts, and scenario simulation.
            </p>
          </div>
          <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] space-y-1.5">
            <p className="font-bold text-[#1D2B17]">4. Research Reference</p>
            <p className="text-[#5C6658] leading-relaxed">
              Direct ingestion and synthesis of the team's "CARBON FOOTPRINT REDUCTION.pptx" slide deck.
            </p>
          </div>
        </div>
      </div>

      {/* External Standards & Scientific References */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
          Peer-Reviewed Scientific Data Sources & Methodological Standards
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <a
            href="https://www.ipcc.ch/assessment-report/ar6/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white border border-[#E0E7DE] rounded-2xl hover:border-[#4A6741] hover:bg-[#F7F9F6] hover:shadow-xs transition-all flex items-start justify-between group"
          >
            <div className="space-y-1">
              <p className="font-bold text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">IPCC AR6 (2023)</p>
              <p className="text-[#737C70]">Working Group III: Mitigation of Climate Change</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7851] mt-1 shrink-0" />
          </a>

          <a
            href="https://ghgprotocol.org/corporate-standard"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white border border-[#E0E7DE] rounded-2xl hover:border-[#4A6741] hover:bg-[#F7F9F6] hover:shadow-xs transition-all flex items-start justify-between group"
          >
            <div className="space-y-1">
              <p className="font-bold text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">GHG Protocol Standard</p>
              <p className="text-[#737C70]">World Resources Institute (WRI) & WBCSD</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7851] mt-1 shrink-0" />
          </a>

          <a
            href="https://www.epa.gov/egrid"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white border border-[#E0E7DE] rounded-2xl hover:border-[#4A6741] hover:bg-[#F7F9F6] hover:shadow-xs transition-all flex items-start justify-between group"
          >
            <div className="space-y-1">
              <p className="font-bold text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">EPA eGRID & GHG Hub</p>
              <p className="text-[#737C70]">Subregion Grid Loss & Combustion Factors</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7851] mt-1 shrink-0" />
          </a>

          <a
            href="https://www.iea.org/reports/net-zero-roadmap-a-global-pathway-to-keep-the-15-0c-goal-in-reach"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-white border border-[#E0E7DE] rounded-2xl hover:border-[#4A6741] hover:bg-[#F7F9F6] hover:shadow-xs transition-all flex items-start justify-between group"
          >
            <div className="space-y-1">
              <p className="font-bold text-[#1D2B17] group-hover:text-[#4A6741] transition-colors">IEA Net Zero 2050</p>
              <p className="text-[#737C70]">Global Decarbonization Technology Roadmaps</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#8C7851] mt-1 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
