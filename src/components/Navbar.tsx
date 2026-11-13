import React, { useState, useEffect } from 'react';
import { PageTab } from '../types';
import { User } from 'firebase/auth';
import { ambientSound } from '../utils/ambientAudio';
import {
  Leaf,
  Calculator,
  Compass,
  FileText,
  HardDrive,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  Command,
  Globe2,
} from 'lucide-react';

interface NavbarProps {
  currentTab: PageTab;
  setCurrentTab: (tab: PageTab) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  driveConnected: boolean;
  onOpenDesignDoc: () => void;
  onOpenCommandPalette: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogin,
  onLogout,
  isLoggingIn,
  driveConnected,
  onOpenDesignDoc,
  onOpenCommandPalette,
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(ambientSound.getIsPlaying());

  useEffect(() => {
    return ambientSound.subscribe((playing) => setIsPlayingSound(playing));
  }, []);

  const toggleSound = () => {
    ambientSound.toggle();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E0E7DE] shadow-xs">
      {/* Top Atmospheric Telemetry Ribbon */}
      <div className="bg-[#0F190D] text-white py-1.5 px-4 text-[10px] sm:text-[11px] font-mono border-b border-[#263820] overflow-x-auto select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5 text-[#9CB395]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#78B169] animate-pulse" />
              <span>MAUNA LOA CO₂:</span>
              <strong className="text-white font-bold">426.8 ppm</strong>
              <span className="text-[#8C7851] text-[10px]">(+2.4 ppm/yr)</span>
            </span>

            <span className="hidden md:inline text-[#2B3E24]">|</span>

            <span className="hidden md:flex items-center gap-1.5 text-[#9CB395]">
              <span>GLOBAL TEMP ANOMALY:</span>
              <strong className="text-[#FFB5A7] font-bold">+1.48°C</strong>
              <span className="text-[#737C70] text-[10px]">(vs Pre-Industrial)</span>
            </span>

            <span className="hidden lg:inline text-[#2B3E24]">|</span>

            <span className="hidden lg:flex items-center gap-1.5 text-[#9CB395]">
              <span>1.5°C BUDGET:</span>
              <strong className="text-[#D9E4D1] font-bold">215 GtCO₂e</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Ambient Soundscape Button */}
            <button
              onClick={toggleSound}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#182414] hover:bg-[#263820] border border-[#2B3E24] text-[#D9E4D1] transition-all cursor-pointer"
              title={isPlayingSound ? 'Mute biospheric soundscape' : 'Listen to generative ambient soundscape'}
            >
              {isPlayingSound ? (
                <>
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-[#78B169] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 h-3 bg-[#78B169] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-1.5 bg-[#78B169] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] font-semibold text-[#78B169]">SOUND ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-[#737C70]" />
                  <span className="text-[10px] text-[#9CB395]">AMBIENT DRONE</span>
                </>
              )}
            </button>

            {/* Quick Cmd+K Pill */}
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-[#182414] hover:bg-[#263820] border border-[#2B3E24] text-[#9CB395] hover:text-white transition-colors"
              title="Open Command HUD (Cmd+K)"
            >
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              id="nav-logo-btn"
              onClick={() => setCurrentTab('overview')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#1D2B17] text-white flex items-center justify-center shadow-xs group-hover:bg-[#2D4428] transition-colors border border-[#4A6741]/30">
                <Leaf className="w-5 h-5 text-[#78B169]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-[#1D2B17] text-2xl tracking-tight">
                    CarbonZero
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#D9E4D1] text-[#1D2B17] border border-[#4A6741]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    IPCC AR6
                  </span>
                </div>
                <p className="text-[11px] text-[#737C70] hidden sm:block font-medium">
                  Environmental Science & Sustainable Engineering
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F1EFEC]/80 p-1.5 rounded-full border border-[#E0E7DE]">
            <button
              id="tab-btn-overview"
              onClick={() => setCurrentTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'overview'
                  ? 'bg-white text-[#1D2B17] shadow-xs font-bold border border-[#E0E7DE]'
                  : 'text-[#5C6658] hover:text-[#1D2B17] hover:bg-white/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#8C7851]" />
              Overview & Brief
            </button>

            {/* Kochi Decarbonization Immersive 3D Experience Tab */}
            <button
              id="tab-btn-kochi"
              onClick={() => setCurrentTab('kochi_simulation')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative ${
                currentTab === 'kochi_simulation' || currentTab === 'persepolis_citadel'
                  ? 'bg-[#121810] text-[#4ADE80] shadow-md font-bold border border-[#22C55E]/50 ring-1 ring-[#22C55E]/30'
                  : 'text-[#2E7D32] hover:text-[#1D2B17] hover:bg-white/60 font-semibold'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-[#22C55E] animate-pulse" />
              <span>Kochi 3D Odyssey</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            </button>

            <button
              id="tab-btn-solutions"
              onClick={() => setCurrentTab('solutions')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'solutions'
                  ? 'bg-white text-[#1D2B17] shadow-xs font-bold border border-[#E0E7DE]'
                  : 'text-[#5C6658] hover:text-[#1D2B17] hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4A6741]" />
              Solutions Hub (12)
            </button>

            <button
              id="tab-btn-calculator"
              onClick={() => setCurrentTab('calculator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'calculator'
                  ? 'bg-white text-[#1D2B17] shadow-xs font-bold border border-[#E0E7DE]'
                  : 'text-[#5C6658] hover:text-[#1D2B17] hover:bg-white/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-[#4A6741]" />
              Calculator
            </button>

            <button
              id="tab-btn-planner"
              onClick={() => setCurrentTab('planner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === 'planner'
                  ? 'bg-white text-[#1D2B17] shadow-xs font-bold border border-[#E0E7DE]'
                  : 'text-[#5C6658] hover:text-[#1D2B17] hover:bg-white/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#8C7851]" />
              Roadmap Planner
            </button>

            <button
              id="tab-btn-drive"
              onClick={() => setCurrentTab('drive_findings')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative ${
                currentTab === 'drive_findings'
                  ? 'bg-[#1D2B17] text-white shadow-xs font-bold'
                  : 'text-[#5C6658] hover:text-[#1D2B17] hover:bg-white/60'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Drive Findings</span>
              {driveConnected ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#78B169]"></span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C7851]"></span>
              )}
            </button>
          </nav>

          {/* Right Action: Search HUD, Design Doc & Google Drive Sign-in */}
          <div className="flex items-center gap-2">
            <button
              id="btn-search-hud"
              onClick={onOpenCommandPalette}
              title="Search and Jump (Cmd+K)"
              className="p-2 text-[#5C6658] hover:text-[#1D2B17] hover:bg-[#F1EFEC] rounded-full transition-colors border border-[#E0E7DE] bg-white shadow-2xs"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              id="btn-open-designdoc"
              onClick={onOpenDesignDoc}
              title="View 1-2 Page Assessment Design Document"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1D2B17] bg-[#F1EFEC] border border-[#E0E7DE] rounded-full hover:bg-[#E8E4DF] transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-[#8C7851]" />
              <span>Design Document</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#E0E7DE]">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-[#CCD9C3]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#D9E4D1] text-[#1D2B17] font-bold text-xs flex items-center justify-center border border-[#CCD9C3]">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="hidden xl:block text-left text-xs">
                    <p className="font-semibold text-[#1D2B17] leading-tight truncate max-w-[100px]">
                      {user.displayName || 'Connected'}
                    </p>
                    <p className="text-[10px] text-[#4A6741] flex items-center gap-1 font-medium font-mono">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Drive Ready
                    </p>
                  </div>
                </div>

                <button
                  id="btn-user-logout"
                  onClick={onLogout}
                  title="Sign out of Google"
                  className="p-2 text-[#737C70] hover:text-[#1D2B17] hover:bg-[#F1EFEC] rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-google-signin"
                onClick={onLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E0E7DE] hover:border-[#CCD9C3] text-[#1D2B17] hover:bg-[#F1EFEC] rounded-full text-xs font-semibold shadow-2xs transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isLoggingIn ? 'Connecting...' : 'Connect Drive'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#E0E7DE] overflow-x-auto gap-1 text-[11px]">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              currentTab === 'overview' ? 'bg-[#D9E4D1] text-[#1D2B17] font-bold' : 'text-[#5C6658]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('kochi_simulation')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
              currentTab === 'kochi_simulation' || currentTab === 'persepolis_citadel' ? 'bg-[#121810] text-[#4ADE80]' : 'text-[#2E7D32]'
            }`}
          >
            <Globe2 className="w-3 h-3 text-[#22C55E]" />
            <span>Kochi 3D</span>
          </button>
          <button
            onClick={() => setCurrentTab('solutions')}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              currentTab === 'solutions' ? 'bg-[#D9E4D1] text-[#1D2B17] font-bold' : 'text-[#5C6658]'
            }`}
          >
            Solutions (12)
          </button>
          <button
            onClick={() => setCurrentTab('calculator')}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              currentTab === 'calculator' ? 'bg-[#D9E4D1] text-[#1D2B17] font-bold' : 'text-[#5C6658]'
            }`}
          >
            Calculator
          </button>
          <button
            onClick={() => setCurrentTab('planner')}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              currentTab === 'planner' ? 'bg-[#D9E4D1] text-[#1D2B17] font-bold' : 'text-[#5C6658]'
            }`}
          >
            Planner
          </button>
          <button
            onClick={() => setCurrentTab('drive_findings')}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap flex items-center gap-1 transition-colors ${
              currentTab === 'drive_findings' ? 'bg-[#1D2B17] text-white font-bold' : 'text-[#4A6741] font-semibold'
            }`}
          >
            Drive PPTX
          </button>
        </div>
      </div>
    </header>
  );
};
