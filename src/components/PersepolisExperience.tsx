import React, { useState, useEffect } from 'react';
import { PageTab } from '../types';
import { CITADEL_MONUMENTS, CitadelMonument } from '../data/citadelMonuments';
import { CitadelThreeScene, TimeOfDay } from './CitadelThreeScene';
import { ambientSound } from '../utils/ambientAudio';
import {
  Compass,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunrise,
  Moon,
  Info,
  X,
  Layers,
  ArrowRight,
  TrendingDown,
  RotateCcw,
  CheckCircle2,
  Share2,
  Sliders,
  Award,
} from 'lucide-react';

interface PersepolisExperienceProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDesignDoc: () => void;
}

export const PersepolisExperience: React.FC<PersepolisExperienceProps> = ({
  onNavigate,
  onOpenDesignDoc,
}) => {
  // Active monument (null = panoramic overview)
  const [activeMonumentIndex, setActiveMonumentIndex] = useState<number>(0);
  const [isGuidedMode, setIsGuidedMode] = useState<boolean>(true);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('golden_hour');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // Past vs Present slider (0-100%)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(!ambientSound.getIsPlaying());
  const [soundVolume, setSoundVolume] = useState<number>(0.2);

  const currentMonument: CitadelMonument = CITADEL_MONUMENTS[activeMonumentIndex];

  // Sync ambient sound
  useEffect(() => {
    return ambientSound.subscribe((playing) => setIsSoundMuted(!playing));
  }, []);

  const handleToggleSound = () => {
    ambientSound.toggle();
  };

  const handleSelectMonument = (monument: CitadelMonument) => {
    const idx = CITADEL_MONUMENTS.findIndex((m) => m.id === monument.id);
    if (idx !== -1) {
      setActiveMonumentIndex(idx);
      setIsDrawerOpen(true);
      ambientSound.playBellStrike(432);
    }
  };

  const handleNextChapter = () => {
    setActiveMonumentIndex((prev) => (prev + 1) % CITADEL_MONUMENTS.length);
    ambientSound.playBellStrike(480);
  };

  const handlePrevChapter = () => {
    setActiveMonumentIndex((prev) => (prev - 1 + CITADEL_MONUMENTS.length) % CITADEL_MONUMENTS.length);
    ambientSound.playBellStrike(392);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextChapter();
      } else if (e.key === 'ArrowLeft') {
        handlePrevChapter();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] bg-[#0A0E0A] text-[#EDE8DF] flex flex-col select-none overflow-hidden font-sans">
      {/* 3D WebGL Three.js Canvas Container */}
      <div className="absolute inset-0 z-0">
        <CitadelThreeScene
          activeMonument={currentMonument}
          onSelectMonument={handleSelectMonument}
          isGuidedMode={isGuidedMode}
          timeOfDay={timeOfDay}
          isReducedMotion={isReducedMotion}
        />
      </div>

      {/* Cinematic Letterbox Vignette & Atmospheric Fog Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-radial-[circle_at_center,transparent_40%,rgba(7,11,7,0.7)_95%]" />

      {/* ========================================================================= */}
      {/* TOP PERSEPOLIS HUD: Monument Name, Coordinates, Mode & Controls */}
      {/* ========================================================================= */}
      <header className="relative z-20 flex items-center justify-between p-4 sm:px-8 border-b border-white/10 bg-black/40 backdrop-blur-md">
        {/* Left: Roman Chapter & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center font-serif text-[#D4AF37] font-bold text-sm shadow-md">
            {currentMonument.romanNumeral}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-serif font-medium tracking-wide text-white">
                {currentMonument.title}
              </h2>
              <span className="hidden sm:inline text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#D4AF37] border border-white/10">
                {currentMonument.ancientInspiration.split(' ')[2] || 'Apadana'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#9CB395] tracking-wider hidden md:block">
              COORD: {currentMonument.coordinates.lat}, {currentMonument.coordinates.lon} • ALT: {currentMonument.coordinates.altitude}
            </p>
          </div>
        </div>

        {/* Center: Dual Mode Switcher (Guided Odyssey vs Free Explore) */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-black/60 border border-white/15">
          <button
            id="btn-mode-guided"
            onClick={() => {
              setIsGuidedMode(true);
              ambientSound.playBellStrike(432);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
              isGuidedMode
                ? 'bg-[#D4AF37] text-[#121810] font-bold shadow-md'
                : 'text-[#A3ADA0] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guided Odyssey</span>
          </button>

          <button
            id="btn-mode-free"
            onClick={() => {
              setIsGuidedMode(false);
              ambientSound.playBellStrike(380);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
              !isGuidedMode
                ? 'bg-white text-[#121810] font-bold shadow-md'
                : 'text-[#A3ADA0] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Free Orbit</span>
          </button>
        </div>

        {/* Right: Atmosphere Time-of-Day, Audio & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Time of Day Switcher */}
          <div className="flex items-center bg-black/50 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setTimeOfDay('dawn')}
              title="Dawn Mist (Cool morning rays)"
              className={`p-1.5 rounded-full transition-colors ${
                timeOfDay === 'dawn' ? 'bg-[#78B169] text-white' : 'text-[#737C70] hover:text-white'
              }`}
            >
              <Sunrise className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('golden_hour')}
              title="Golden Hour (Persepolis ancient sunset)"
              className={`p-1.5 rounded-full transition-colors ${
                timeOfDay === 'golden_hour' ? 'bg-[#D4AF37] text-[#121810]' : 'text-[#737C70] hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              title="Midnight Aurora (Obsidian & starfield)"
              className={`p-1.5 rounded-full transition-colors ${
                timeOfDay === 'night' ? 'bg-[#38BDF8] text-[#121810]' : 'text-[#737C70] hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Soundscape Control */}
          <button
            onClick={handleToggleSound}
            title={isSoundMuted ? 'Unmute ancient ambient soundscape' : 'Mute soundscape'}
            className="p-2 rounded-full bg-black/50 border border-white/10 text-[#D4AF37] hover:bg-white/10 transition-colors"
          >
            {!isSoundMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[#737C70]" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Cinematic Fullscreen (F)"
            className="p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Open Artifact Deep Dive */}
          <button
            id="btn-open-monument-drawer"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isDrawerOpen
                ? 'bg-[#D4AF37] text-[#121810] border-[#D4AF37]'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inspect Artifact</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* FLOATING TOP-RIGHT CITADEL RADAR / COMPASS HUD */}
      {/* ========================================================================= */}
      <div className="absolute top-20 right-6 z-20 hidden md:block">
        <div className="bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 w-44 shadow-2xl space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#9CB395]">
            <span>CITADEL RADAR</span>
            <span className="text-[#D4AF37]">360° WEBGL</span>
          </div>

          {/* Visual Mini Citadel Compass Radar */}
          <div className="relative w-full h-24 rounded-xl bg-[#121812] border border-white/10 flex items-center justify-center overflow-hidden">
            {/* Concentric rings */}
            <div className="absolute w-20 h-20 rounded-full border border-white/10" />
            <div className="absolute w-12 h-12 rounded-full border border-white/10" />
            <div className="absolute w-1 h-full border-r border-dashed border-white/10" />
            <div className="absolute w-full h-1 border-b border-dashed border-white/10" />

            {/* Radar Sweep Needle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#78B169]/10 to-[#D4AF37]/25 animate-spin origin-center duration-3000" />

            {/* 6 Monument Nodes on Radar */}
            {CITADEL_MONUMENTS.map((mon, i) => {
              const angle = (i / CITADEL_MONUMENTS.length) * Math.PI * 2;
              const radius = 30;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isSelected = i === activeMonumentIndex;

              return (
                <button
                  key={mon.id}
                  onClick={() => {
                    setActiveMonumentIndex(i);
                    ambientSound.playBellStrike(432);
                  }}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  title={mon.title}
                  className={`absolute w-2.5 h-2.5 rounded-full transition-all ${
                    isSelected
                      ? 'bg-[#D4AF37] ring-4 ring-[#D4AF37]/40 scale-125 z-10'
                      : 'bg-[#9CB395] hover:scale-110 opacity-70'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#737C70]">
            <span>ALT: 210m</span>
            <span>LAT: 27°32'N</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GUIDED ODYSSEY CHAPTER NARRATIVE CARD (Bottom-Left) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-24 left-4 sm:left-8 z-20 max-w-xl pointer-events-auto">
        <div className="bg-[#0D120D]/90 backdrop-blur-xl border border-white/15 p-6 rounded-[28px] shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
              {currentMonument.narrativeChapter}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevChapter}
                title="Previous Chapter (Arrow Left)"
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextChapter}
                title="Next Chapter (Arrow Right)"
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-medium text-white tracking-tight leading-snug">
            {currentMonument.subtitle}
          </h3>

          <p className="text-xs sm:text-sm text-[#C2CDBE] leading-relaxed line-clamp-3 sm:line-clamp-4">
            {currentMonument.detailedStory}
          </p>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#737C70] block">ABATEMENT</span>
                <span className="text-[#78B169] font-bold">{currentMonument.telemetry.co2AbatementTonnes}</span>
              </div>
              <div className="h-6 w-px bg-white/15" />
              <div>
                <span className="text-[10px] text-[#737C70] block">INVESTMENT</span>
                <span className="text-[#D4AF37] font-bold">{currentMonument.telemetry.investmentINR}</span>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#121810] hover:bg-[#D4AF37] text-xs font-bold transition-all shadow-md"
            >
              <span>Explore Reconstruction & Past/Present</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM MONUMENT TIMELINE & CHAPTER SCRUBBER */}
      {/* ========================================================================= */}
      <footer className="relative z-20 mt-auto bg-black/75 backdrop-blur-md border-t border-white/10 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider font-bold">
              CITADEL ODYSSEY:
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {CITADEL_MONUMENTS.map((mon, index) => {
              const isActive = index === activeMonumentIndex;
              return (
                <button
                  key={mon.id}
                  id={`scrubber-monument-${mon.id}`}
                  onClick={() => {
                    setActiveMonumentIndex(index);
                    ambientSound.playBellStrike(432);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#121810] font-bold shadow-lg scale-105'
                      : 'bg-white/5 text-[#9CB395] hover:bg-white/15 hover:text-white border border-white/10'
                  }`}
                >
                  <span className="font-mono text-[10px]">{mon.romanNumeral}</span>
                  <span className="hidden md:inline whitespace-nowrap">{mon.title.replace('The ', '')}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0 text-xs font-mono text-[#737C70]">
            <span>CO900G AAM</span>
            <span>•</span>
            <button
              onClick={() => onNavigate('solutions')}
              className="text-[#78B169] hover:underline"
            >
              Back to Standard Hub
            </button>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* PERSEPOLIS ARTIFACT & "PAST VS. PRESENT" COMPARISON DRAWER */}
      {/* ========================================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-2xl bg-[#0F150F] border-l border-white/15 shadow-2xl flex flex-col backdrop-blur-2xl animate-in slide-in-from-right duration-300 overflow-hidden">
          {/* Drawer Top Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center font-serif font-bold text-[#D4AF37] text-xs">
                {currentMonument.romanNumeral}
              </span>
              <div>
                <h3 className="text-lg font-serif font-medium text-white">
                  {currentMonument.title}
                </h3>
                <p className="text-xs font-mono text-[#9CB395]">{currentMonument.ancientInspiration}</p>
              </div>
            </div>

            <button
              id="btn-close-monument-drawer"
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Audio Voiceover Transcript Player */}
            <div className="bg-[#182318] p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsPlayingAudio(!isPlayingAudio);
                    ambientSound.playBellStrike(432);
                  }}
                  className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#121810] flex items-center justify-center font-bold shadow-md hover:scale-105 transition-transform"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37] block font-bold">
                    ARCHIVAL NARRATION
                  </span>
                  <span className="text-xs text-[#C2CDBE]">Listen to Monument Curatorial Transcription</span>
                </div>
              </div>

              {/* Simulated visual sound wave */}
              <div className="flex items-center gap-1 h-6">
                {[40, 70, 30, 85, 60, 95, 45, 80].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: isPlayingAudio ? `${h}%` : '20%' }}
                    className="w-1 bg-[#78B169] rounded-full transition-all duration-300"
                  />
                ))}
              </div>
            </div>

            {/* Past vs. Present Interactive Reconstruction Slider (Persepolis Signature) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                  PAST VS. PRESENT RECONSTRUCTION
                </span>
                <span className="text-[11px] text-[#737C70] font-mono">Drag slider to compare</span>
              </div>

              <div className="relative h-64 rounded-2xl overflow-hidden border border-white/15 bg-black">
                {/* Present / Decarbonized Layer (Right/Background) */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A2E1A] to-[#142314] p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#78B169]/20 text-[#78B169] border border-[#78B169]/40 text-xs font-bold font-mono">
                      {currentMonument.pastVsPresent.presentLabel}
                    </span>
                    <span className="text-xl font-serif font-bold text-white">
                      {currentMonument.pastVsPresent.presentMetric}
                    </span>
                  </div>
                  <p className="text-xs text-[#D9E4D1] leading-relaxed max-w-sm">
                    {currentMonument.pastVsPresent.presentDescription}
                  </p>
                </div>

                {/* Past / Fossil Reality Layer (Left/Foreground, clipped by sliderPosition) */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#2D1B17] to-[#1F1311] p-6 flex flex-col justify-between border-r border-[#D4AF37]"
                  style={{ width: `${sliderPosition}%`, overflow: 'hidden' }}
                >
                  <div className="flex items-center justify-between min-w-[280px]">
                    <span className="px-2.5 py-1 rounded-full bg-[#EF4444]/20 text-[#FCA5A5] border border-[#EF4444]/40 text-xs font-bold font-mono">
                      {currentMonument.pastVsPresent.pastLabel}
                    </span>
                    <span className="text-xl font-serif font-bold text-[#FCA5A5]">
                      {currentMonument.pastVsPresent.pastMetric}
                    </span>
                  </div>
                  <p className="text-xs text-[#FCA5A5]/90 leading-relaxed min-w-[280px] max-w-sm">
                    {currentMonument.pastVsPresent.pastDescription}
                  </p>
                </div>

                {/* Draggable Divider Handle */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                />

                <div
                  className="absolute top-0 bottom-0 pointer-events-none z-10 flex items-center justify-center"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-[#121810] flex items-center justify-center shadow-2xl font-bold text-xs">
                    ↔
                  </div>
                </div>
              </div>
            </div>

            {/* Economic Telemetry Ledger in Indian Rupees (₹) */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                ECONOMIC IMPACT LEDGER (INR ₹)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#162016] p-3.5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#737C70] block">CAPEX</span>
                  <span className="font-serif font-bold text-white text-sm">{currentMonument.telemetry.investmentINR}</span>
                </div>

                <div className="bg-[#162016] p-3.5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#737C70] block">ANNUAL SAVINGS</span>
                  <span className="font-serif font-bold text-[#78B169] text-sm">{currentMonument.telemetry.annualSavingsINR}</span>
                </div>

                <div className="bg-[#162016] p-3.5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#737C70] block">PAYBACK</span>
                  <span className="font-serif font-bold text-[#D4AF37] text-sm">{currentMonument.telemetry.paybackYears}</span>
                </div>

                <div className="bg-[#162016] p-3.5 rounded-xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#737C70] block">MATURITY</span>
                  <span className="font-serif font-bold text-white text-sm">TRL {currentMonument.telemetry.trlLevel}</span>
                </div>
              </div>
            </div>

            {/* Key Engineering Insights */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                ENGINEERING SPECIFICATIONS
              </span>

              <ul className="space-y-2.5">
                {currentMonument.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#C2CDBE] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#78B169] shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architectural Elements */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                ARCHITECTURAL DETAILS
              </span>

              <div className="space-y-2">
                {currentMonument.architecturalElements.map((elem, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-[#9CB395]">
                    {elem}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Bottom Action: Bridges to Technical Modules */}
          <div className="p-6 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onNavigate('solutions')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1D2B17] text-white hover:bg-[#283C21] text-xs font-semibold border border-white/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Open in Solutions Directory</span>
            </button>

            <button
              onClick={() => onNavigate('calculator')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4AF37] text-[#121810] hover:bg-[#F59E0B] text-xs font-bold transition-all shadow-md"
            >
              <span>Simulate in Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
