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
  Leaf,
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
            <Leaf className="w-3.5 h-3.5 text-[#78B169]" />
            <ShinyText
              text="GHG Protocol Accounting & Systematic Decarbonization Platform"
              speed={3}
              className="text-[#D9E4D1]"
            />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-white leading-[1.08]">
            Carbon Footprint Modeling & Systematic Decarbonization
          </h1>

          <p className="text-[#C5D3C1] text-base sm:text-lg leading-relaxed max-w-2xl font-light">
            A comprehensive sustainability platform designed to model, audit, and systematically
            decarbonize greenhouse gas emissions across domestic, institutional, and organizational systems.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Magnet padding={20} magnetStrength={1.5}>
              <button
                id="hero-explore-solutions-btn"
                onClick={() => onNavigate('solutions')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#1D2B17] font-bold text-xs sm:text-sm hover:bg-[#F1EFEC] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-[#4A6741]" />
                <span>Solutions Directory</span>
                <ArrowRight className="w-4 h-4 text-[#1D2B17]" />
              </button>
            </Magnet>

            <button
              id="hero-launch-calculator-btn"
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#243520] text-white border border-[#3E5637] font-semibold text-xs sm:text-sm hover:bg-[#2F472A] transition-all"
            >
              <span>Carbon Calculator</span>
            </button>

            <button
              id="hero-view-planner-btn"
              onClick={() => onNavigate('planner')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#3E5637] text-white font-semibold text-xs sm:text-sm hover:bg-[#4A6741] transition-all shadow-xs"
            >
              <span>Reduction Planner</span>
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

      {/* Atmospheric Carbon Flux & Particle Dynamics Canvas Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
                Interactive Atmospheric Model
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D9E4D1] text-[#1D2B17]">
                60 FPS KINETIC CANVAS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1D2B17] mt-1 tracking-tight">
              Real-Time Atmospheric Carbon Flux & Boundary Dynamics
            </h2>
          </div>
          <p className="text-xs text-[#737C70] font-mono max-w-sm sm:text-right">
            Visualizing biospheric sinks vs. anthropogenic emissions. Interact with the particle field to observe flow deflections.
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
            Designed for facility managers, sustainability coordinators, households, and organizations
            seeking actionable, cost-effective carbon abatement roadmaps with verified return-on-investment (ROI).
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

      {/* Carbon Reduction Framework & Standards Card */}
      <div className="bg-white border border-[#E0E7DE] rounded-[32px] p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E0E7DE]">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7851]">
              Frameworks & Accounting Standards
            </span>
            <h3 className="text-2xl font-serif text-[#1D2B17] mt-1">
              Methodology & Climate Standards Alignment
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-[#F1EFEC] border border-[#E8E4DF] rounded-full text-xs font-medium text-[#5C6658]">
              Standard: <strong className="text-[#1D2B17]">GHG Protocol</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-[#F1EFEC] border border-[#E8E4DF] rounded-full text-xs font-medium text-[#5C6658]">
              Target: <strong className="text-[#1D2B17]">Net-Zero 2030</strong>
            </span>
            <span className="px-3.5 py-1.5 bg-[#D9E4D1] text-[#1D2B17] border border-[#CCD9C3] rounded-full text-xs font-bold font-mono">
              Scopes 1, 2 & 3
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] space-y-1.5">
            <p className="font-bold text-[#1D2B17]">1. Carbon Accounting & Scopes</p>
            <p className="text-[#5C6658] leading-relaxed">
              Mathematical modeling of emissions across Scopes 1, 2, and 3 with verified EPA emission factors.
            </p>
          </div>
          <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] space-y-1.5">
            <p className="font-bold text-[#1D2B17]">2. Decarbonization Engine</p>
            <p className="text-[#5C6658] leading-relaxed">
              Real-time calculation engine, dynamic roadmap generation, and actionable intervention strategies.
            </p>
          </div>
          <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] space-y-1.5">
            <p className="font-bold text-[#1D2B17]">3. Usability & Interactivity</p>
            <p className="text-[#5C6658] leading-relaxed">
              Dedicated functional views, responsive inputs, live visual breakdown charts, and scenario simulation.
            </p>
          </div>
          <div className="bg-[#F7F9F6] p-5 rounded-2xl border border-[#E0E7DE] space-y-1.5">
            <p className="font-bold text-[#1D2B17]">4. Research Reference</p>
            <p className="text-[#5C6658] leading-relaxed">
              Direct ingestion and synthesis of the team's "CARBON FOOTPRINT REDUCTION.pptx" research presentation.
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
