import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Volume2,
  VolumeX,
  Eye,
  Sliders,
  Sun,
  CloudRain,
  Moon,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  Minimize2,
  Building2,
  MapPin,
  Leaf,
  Layers,
  IndianRupee,
  Navigation,
} from 'lucide-react';
import { KOCHI_LOCATIONS, KochiLocation, KochiLocationSimulationParam } from '../data/kochiLocations';
import { KochiThreeScene, KochiTimeOfDay } from './KochiThreeScene';
import { PageTab } from '../types';

interface KochiSimulationExperienceProps {
  onNavigateTab: (tab: PageTab) => void;
}

export const KochiSimulationExperience: React.FC<KochiSimulationExperienceProps> = ({ onNavigateTab }) => {
  const [activeLocationIndex, setActiveLocationIndex] = useState<number>(0);
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(true);
  const [timeOfDay, setTimeOfDay] = useState<KochiTimeOfDay>('golden_hour');
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [sliderSplit, setSliderSplit] = useState<number>(50); // Past vs Present slider %
  const [isExpandedCard, setIsExpandedCard] = useState<boolean>(false);

  // Dynamic user simulation parameter overrides for the active location
  const [userSimValues, setUserSimValues] = useState<{ [paramId: string]: number }>({});

  const activeLocation = KOCHI_LOCATIONS[activeLocationIndex];

  // Web Audio Synthesizer for resonant Kerala bronze chimes and ambient soundscape
  const audioCtxRef = useRef<AudioContext | null>(null);
  const chimeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTempleChime = () => {
    if (!isAudioActive) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      // Kerala temple bronze chime frequencies (Harmonic bell resonance)
      const rootFreq = 280; // D4 base
      const harmonics = [rootFreq, rootFreq * 1.5, rootFreq * 2.05, rootFreq * 2.76];

      harmonics.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const volume = (0.12 / (idx + 1)) * (idx === 0 ? 1 : 0.6);
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.3);
      });
    } catch {
      // Audio context policy fallback
    }
  };

  const toggleAudio = () => {
    const next = !isAudioActive;
    setIsAudioActive(next);
    if (next) {
      playTempleChime();
    }
  };

  // Switch location handler
  const handleSelectLocation = (loc: KochiLocation) => {
    const idx = KOCHI_LOCATIONS.findIndex((l) => l.id === loc.id);
    if (idx !== -1 && idx !== activeLocationIndex) {
      setActiveLocationIndex(idx);
      setUserSimValues({}); // reset local slider overrides for next location
      setIsGuidedMode(true);
      playTempleChime();
    }
  };

  const handleNextLocation = () => {
    const nextIdx = (activeLocationIndex + 1) % KOCHI_LOCATIONS.length;
    setActiveLocationIndex(nextIdx);
    setUserSimValues({});
    setIsGuidedMode(true);
    playTempleChime();
  };

  const handlePrevLocation = () => {
    const prevIdx = (activeLocationIndex - 1 + KOCHI_LOCATIONS.length) % KOCHI_LOCATIONS.length;
    setActiveLocationIndex(prevIdx);
    setUserSimValues({});
    setIsGuidedMode(true);
    playTempleChime();
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNextLocation();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrevLocation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLocationIndex, isAudioActive]);

  // "Fun to Scroll" Wheel Event Handler
  // Smoothly advances locations when scrolling up or down on the page
  const scrollCooldownRef = useRef<boolean>(false);
  const handleWheel = (e: React.WheelEvent) => {
    // Avoid triggering if interacting with inner scrollable panels or sliders
    if ((e.target as HTMLElement).closest('.prevent-wheel-advance')) return;

    if (scrollCooldownRef.current) return;

    if (Math.abs(e.deltaY) > 40) {
      scrollCooldownRef.current = true;
      if (e.deltaY > 0) {
        handleNextLocation();
      } else {
        handlePrevLocation();
      }
      setTimeout(() => {
        scrollCooldownRef.current = false;
      }, 700); // 700ms cooldown for silky smooth cinematic pacing
    }
  };

  // Calculate live simulation metrics based on active sliders
  const calculateLiveTelemetry = () => {
    let deltaCo2Tonnes = 0;
    let deltaSavingsINR = 0;

    activeLocation.simulationParams.forEach((param) => {
      const currentVal = userSimValues[param.id] ?? param.defaultValue;
      const valDiff = currentVal - param.defaultValue;
      deltaCo2Tonnes += (valDiff * param.co2FactorPerUnit) / 1000;
      deltaSavingsINR += valDiff * param.inrSavingsFactorPerUnit;
    });

    const netCo2Tonnes = Math.max(10, activeLocation.telemetry.baselineCo2AbatementTonnes + deltaCo2Tonnes);
    const baselineSavingsRaw = parseFloat(activeLocation.telemetry.baselineAnnualSavingsINR.replace(/[^0-9.]/g, ''));
    const isCrores = activeLocation.telemetry.baselineAnnualSavingsINR.includes('Crores');
    const baselineSavingsRupees = isCrores ? baselineSavingsRaw * 10000000 : baselineSavingsRaw * 100000;
    const netSavingsRupees = Math.max(100000, baselineSavingsRupees + deltaSavingsINR);

    const formattedSavings =
      netSavingsRupees >= 10000000
        ? `₹${(netSavingsRupees / 10000000).toFixed(1)} Crores/yr`
        : `₹${(netSavingsRupees / 100000).toFixed(1)} Lakhs/yr`;

    return {
      netCo2Tonnes: Math.round(netCo2Tonnes),
      formattedSavings,
    };
  };

  const { netCo2Tonnes, formattedSavings } = calculateLiveTelemetry();

  return (
    <div
      onWheel={handleWheel}
      className="relative w-full h-[calc(100vh-4rem)] bg-zinc-950 text-white overflow-hidden select-none font-sans"
    >
      {/* ========================================================================= */}
      {/* 3D WEBGL KOCHI TERRAIN & CITADEL CANVAS */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <KochiThreeScene
          activeLocation={activeLocation}
          onSelectLocation={handleSelectLocation}
          isGuidedMode={isGuidedMode}
          timeOfDay={timeOfDay}
        />
      </div>

      {/* Atmospheric Vignette & Subtle Grid Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-1 bg-radial from-transparent via-black/20 to-black/80" />

      {/* ========================================================================= */}
      {/* TOP FLOATING HUD & NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Mission Title & GPS Radar */}
        <div className="flex items-center gap-3 bg-zinc-900/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-zinc-800/80 shadow-2xl">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Kochi Decarbonization Odyssey
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {activeLocation.number} / 6
              </span>
            </div>
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>{activeLocation.title}</span>
              <span className="text-zinc-400 text-xs font-normal">({activeLocation.realCoordinates.lat}, {activeLocation.realCoordinates.lon})</span>
            </h1>
          </div>
        </div>

        {/* Center: Interactive Waypoint Dots */}
        <div className="hidden lg:flex items-center gap-1.5 bg-zinc-900/85 backdrop-blur-md px-3 py-2 rounded-2xl border border-zinc-800/80 shadow-xl">
          {KOCHI_LOCATIONS.map((loc, idx) => {
            const isCurrent = idx === activeLocationIndex;
            return (
              <button
                key={loc.id}
                onClick={() => handleSelectLocation(loc)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold shadow-lg shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: isCurrent ? loc.color : '#71717a' }}
                />
                <span className="font-mono text-[11px]">{idx + 1}</span>
                <span className="max-w-[110px] truncate">{loc.id === 'rset_kakkanad' ? 'RSET Kakkanad' : loc.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Controls & Time-of-Day Toggles */}
        <div className="flex items-center gap-2 bg-zinc-900/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-zinc-800/80 shadow-xl">
          {/* Audio Chimes Switch */}
          <button
            onClick={toggleAudio}
            title={isAudioActive ? 'Mute Resonant Kerala Chimes' : 'Enable Kerala Temple & Backwaters Audio'}
            className={`p-2 rounded-xl transition-all ${
              isAudioActive ? 'text-amber-400 bg-amber-400/15' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Time of Day Presets */}
          <div className="flex items-center bg-zinc-950/70 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setTimeOfDay('golden_hour')}
              title="Kerala Golden Hour (Sunset)"
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'golden_hour' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('monsoon_mist')}
              title="Monsoon Mist (Lush Greenery)"
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'monsoon_mist' ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('midnight_glow')}
              title="Midnight City Glow (Starlight)"
              className={`p-1.5 rounded-lg transition-colors ${
                timeOfDay === 'midnight_glow' ? 'bg-sky-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switch: Guided Scroll vs Free 360 Orbit */}
          <button
            onClick={() => setIsGuidedMode(!isGuidedMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all font-medium ${
              isGuidedMode
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            {isGuidedMode ? (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guided Scroll</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Free Orbit</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* FLOATING LATERAL NARRATIVE & SIMULATION CARD (LEFT / BOTTOM OVERLAY) */}
      {/* ========================================================================= */}
      <div className="absolute left-4 bottom-20 top-24 z-20 w-full max-w-md pointer-events-none flex flex-col justify-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLocation.id}
            initial={{ opacity: 0, x: -30, y: 15 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 10 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`pointer-events-auto prevent-wheel-advance bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 rounded-3xl p-5 shadow-2xl flex flex-col transition-all duration-300 ${
              isExpandedCard ? 'max-h-[80vh] overflow-y-auto' : 'max-h-[68vh] overflow-y-auto'
            }`}
          >
            {/* Location Header Badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: activeLocation.badgeColor }}
                >
                  LOCATION {activeLocation.number} OF 6
                </span>
                <span className="text-xs text-zinc-400 font-mono tracking-tight">
                  {activeLocation.zone.split(',')[0]}
                </span>
              </div>
              <button
                onClick={() => setIsExpandedCard(!isExpandedCard)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title={isExpandedCard ? 'Collapse Details' : 'Expand Full Case Study'}
              >
                {isExpandedCard ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Title & Malayalam Script */}
            <h2 className="text-xl font-extrabold text-white leading-tight mb-0.5">
              {activeLocation.title}
            </h2>
            <div className="text-xs text-emerald-400 font-medium mb-3 flex items-center justify-between">
              <span>{activeLocation.malayalamTitle}</span>
              <span className="text-[11px] text-zinc-400 font-mono">Alt: {activeLocation.realCoordinates.altitude}</span>
            </div>

            {/* Primary Solution Pill */}
            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800/70 mb-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Primary Engineering Solution</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {activeLocation.primarySolution}
              </p>
            </div>

            {/* ===================================================================== */}
            {/* LIVE SIMULATION SLIDERS & TELEMETRY */}
            {/* ===================================================================== */}
            <div className="space-y-3 mb-4 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800/60">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300 pb-1 border-b border-zinc-800">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Sliders className="w-3.5 h-3.5" />
                  Interactive Simulation Levers
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Real-time Model</span>
              </div>

              {activeLocation.simulationParams.map((param) => {
                const val = userSimValues[param.id] ?? param.defaultValue;
                return (
                  <div key={param.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-300">{param.name}</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {val.toLocaleString()} {param.unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={val}
                      onChange={(e) =>
                        setUserSimValues({
                          ...userSimValues,
                          [param.id]: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-emerald-500 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                );
              })}

              {/* Dynamic Telemetry Results in Indian Rupees & tCO2 */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-emerald-400" />
                    CO₂e Abated
                  </div>
                  <div className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5">
                    {netCo2Tonnes.toLocaleString()} <span className="text-[10px] font-normal text-zinc-300">t/yr</span>
                  </div>
                </div>

                <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-800">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <IndianRupee className="w-3 h-3 text-amber-400" />
                    Annual Savings
                  </div>
                  <div className="text-sm font-extrabold text-amber-300 font-mono mt-0.5 truncate">
                    {formattedSavings}
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================================== */}
            {/* PAST (FOSSIL) VS PRESENT (DECARBONIZED) INTERACTIVE COMPARISON SLIDER */}
            {/* ===================================================================== */}
            <div className="mb-4 bg-zinc-900/70 p-3 rounded-2xl border border-zinc-800/70">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-zinc-400">Past vs. Present Reality</span>
                <span className="text-[10px] font-mono text-emerald-400">Drag to Compare</span>
              </div>

              {/* Split view container */}
              <div className="relative rounded-xl p-3 bg-zinc-950 border border-zinc-800 overflow-hidden text-xs">
                {sliderSplit < 50 ? (
                  <div>
                    <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      {activeLocation.pastVsPresent.pastLabel}
                    </div>
                    <div className="text-zinc-400 font-mono text-[11px] mb-1.5">
                      {activeLocation.pastVsPresent.pastMetric}
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      {activeLocation.pastVsPresent.pastDescription}
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {activeLocation.pastVsPresent.presentLabel}
                    </div>
                    <div className="text-emerald-300 font-mono text-[11px] mb-1.5">
                      {activeLocation.pastVsPresent.presentMetric}
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      {activeLocation.pastVsPresent.presentDescription}
                    </p>
                  </div>
                )}

                <div className="mt-2.5 pt-2 border-t border-zinc-800 flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">Historical Fossil</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderSplit}
                    onChange={(e) => setSliderSplit(parseInt(e.target.value))}
                    className="flex-1 accent-emerald-400 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] text-emerald-400 font-medium">Decarbonized</span>
                </div>
              </div>
            </div>

            {/* Extended Technical Insights & Local Impact */}
            {isExpandedCard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 pt-1 mb-4 text-xs"
              >
                <div>
                  <h4 className="font-bold text-zinc-200 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    Engineering Specifications
                  </h4>
                  <ul className="space-y-1 text-zinc-400 text-[11px]">
                    {activeLocation.engineeringHighlights.map((spec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-mono mt-0.5">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-zinc-200 mb-1.5 flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    Local Kerala Co-Benefits
                  </h4>
                  <ul className="space-y-1 text-zinc-400 text-[11px]">
                    {activeLocation.localImpactFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Action Buttons to cross-connect to Calculator and Solutions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => onNavigateTab('calculator')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate in Calc</span>
              </button>
              <button
                onClick={() => onNavigateTab('solutions')}
                className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View 15+ Solutions</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM CENTER: SCROLL / ODYSSEY STEPPER BAR */}
      {/* ========================================================================= */}
      <footer className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        {/* Left: Scroll Prompt */}
        <div className="hidden sm:flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-zinc-800 text-xs text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Scroll mouse or swipe to fly across Kochi</span>
        </div>

        {/* Center: Previous / Next Navigation Arrows */}
        <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-zinc-800 shadow-2xl mx-auto sm:mx-0">
          <button
            onClick={handlePrevLocation}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
            title="Previous Location (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-medium hidden md:inline">Previous</span>
          </button>

          <div className="h-4 w-px bg-zinc-700" />

          <span className="text-xs font-mono text-emerald-400 font-bold px-2">
            0{activeLocation.number} / 06
          </span>

          <div className="h-4 w-px bg-zinc-700" />

          <button
            onClick={handleNextLocation}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
            title="Next Location (Right Arrow)"
          >
            <span className="text-xs font-medium hidden md:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Quick Switch to Other Views */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('overview')}
            className="bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3 py-2 rounded-xl border border-zinc-800 text-xs transition-colors"
          >
            Exit 3D to Dashboard
          </button>
        </div>
      </footer>
    </div>
  );
};
