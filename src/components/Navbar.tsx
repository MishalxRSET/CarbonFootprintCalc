import React from 'react';
import { PageTab } from '../types';
import { AuthUserProfile } from '../lib/firebase';
import { ThemeToggle } from './reactbits';
import {
  Leaf,
  Calculator,
  Compass,
  FileText,
  Cloud,
  LogIn,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Sparkles,
  Search,
  Command,
  Globe2,
} from 'lucide-react';

interface NavbarProps {
  currentTab: PageTab;
  setCurrentTab: (tab: PageTab) => void;
  user: AuthUserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn: boolean;
  driveConnected: boolean;
  onOpenDesignDoc: () => void;
  onOpenCommandPalette: () => void;
  onOpenGuidedTour?: () => void;
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
  onOpenGuidedTour,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#09140C]/90 backdrop-blur-xl border-b border-[#E3EAE0] dark:border-[#1A2C1D] shadow-xs">
      {/* Top Atmospheric Telemetry Ribbon */}
      <div className="bg-[#08150B] dark:bg-[#040C07] text-[#9CB395] py-1 px-3 sm:px-4 text-[10px] sm:text-[11px] font-mono border-b border-[#1A2C1D] select-none no-scrollbar overflow-x-auto">
        <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 truncate">
            <span className="flex items-center gap-1.5 text-[#B6CCB0] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52e35b] animate-pulse" />
              <span className="hidden sm:inline text-[10px] text-[#7A9374] uppercase tracking-wider">Mauna Loa </span>
              <span className="text-[10px] text-[#7A9374] uppercase tracking-wider">CO₂</span>
              <strong className="text-white font-semibold">426.8 ppm</strong>
              <span className="text-[#8C7851] text-[10px] hidden md:inline">(+2.4/yr)</span>
            </span>

            <span className="text-[#203422]">|</span>

            <span className="flex items-center gap-1.5 text-[#B6CCB0] shrink-0">
              <span className="hidden sm:inline text-[10px] text-[#7A9374] uppercase tracking-wider">Temp Anomaly</span>
              <span className="sm:hidden text-[10px] text-[#7A9374] uppercase tracking-wider">Anomaly</span>
              <strong className="text-[#FFAAA0] font-semibold">+1.48°C</strong>
            </span>

            <span className="hidden md:inline text-[#203422]">|</span>

            <span className="hidden md:flex items-center gap-1.5 text-[#B6CCB0] shrink-0">
              <span className="text-[10px] text-[#7A9374] uppercase tracking-wider">1.5°C Budget</span>
              <strong className="text-white font-semibold">215 GtCO₂e</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Cmd+K Pill */}
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#132014] hover:bg-[#1E301F] border border-[#243825] text-[#8EA689] hover:text-white transition-colors cursor-pointer text-[10px]"
              title="Open Command HUD (Cmd+K)"
            >
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="nav-logo-btn"
              onClick={() => setCurrentTab('overview')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform border border-emerald-500/30">
                <Leaf className="w-4.5 h-4.5 text-emerald-600 dark:text-[#52e35b]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-[#142314] dark:text-white text-xl tracking-tight">
                  Carbon<span className="text-emerald-600 dark:text-[#52e35b]">Zero</span>
                </span>
                <span className="hidden xl:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  Platform
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs - Airy, Single-line, No Wrapping */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F4F6F2]/90 dark:bg-[#111C13]/90 p-1.5 rounded-full border border-[#DFE6DC] dark:border-[#1E3021] shadow-2xs backdrop-blur-md">
            <button
              id="tab-btn-overview"
              onClick={() => setCurrentTab('overview')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'overview'
                  ? 'bg-white dark:bg-[#1C3320] text-[#142314] dark:text-white shadow-xs font-bold border border-black/5 dark:border-white/10'
                  : 'text-[#475544] dark:text-[#CBD8C9] hover:text-[#142314] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#8C7851] dark:text-[#E2C792]" />
              <span>Overview</span>
            </button>

            <button
              id="tab-btn-solutions"
              onClick={() => setCurrentTab('solutions')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'solutions'
                  ? 'bg-white dark:bg-[#1C3320] text-[#142314] dark:text-white shadow-xs font-bold border border-black/5 dark:border-white/10'
                  : 'text-[#475544] dark:text-[#CBD8C9] hover:text-[#142314] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#52e35b]" />
              <span>Solutions</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-bold">
                16
              </span>
            </button>

            <button
              id="tab-btn-calculator"
              onClick={() => setCurrentTab('calculator')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'calculator'
                  ? 'bg-white dark:bg-[#1C3320] text-[#142314] dark:text-white shadow-xs font-bold border border-black/5 dark:border-white/10'
                  : 'text-[#475544] dark:text-[#CBD8C9] hover:text-[#142314] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-600 dark:text-[#52e35b]" />
              <span>Calculator</span>
            </button>

            <button
              id="tab-btn-planner"
              onClick={() => setCurrentTab('planner')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                currentTab === 'planner'
                  ? 'bg-white dark:bg-[#1C3320] text-[#142314] dark:text-white shadow-xs font-bold border border-black/5 dark:border-white/10'
                  : 'text-[#475544] dark:text-[#CBD8C9] hover:text-[#142314] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#8C7851] dark:text-[#E2C792]" />
              <span>Planner</span>
            </button>

            <button
              id="tab-btn-drive"
              onClick={() => setCurrentTab('drive_save')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer relative ${
                currentTab === 'drive_save'
                  ? 'bg-[#142314] dark:bg-[#52e35b] text-white dark:text-[#061408] shadow-xs font-bold'
                  : 'text-[#475544] dark:text-[#CBD8C9] hover:text-[#142314] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Drive Sync</span>
              {driveConnected ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#52e35b] dark:bg-[#061408]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C7851] dark:bg-[#E2C792]" />
              )}
            </button>
          </nav>

          {/* Right Actions: Compact, Responsive, No Text-Wrapping or Viewport Cutoff */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Quick Tour Button */}
            {onOpenGuidedTour && (
              <button
                id="btn-nav-guided-tour"
                type="button"
                onClick={onOpenGuidedTour}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-700/50 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                title="Open Interactive Guided Tour"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-[#52e35b] animate-pulse" />
                <span className="text-emerald-800 dark:text-emerald-300 font-bold">Tour</span>
              </button>
            )}

            {/* React Bits Theme Toggle with Magnetic Physics & Circular Ripple Transition */}
            <ThemeToggle variant="compact" magnetic={true} />

            {/* Search HUD Button */}
            <button
              id="btn-search-hud"
              onClick={onOpenCommandPalette}
              title="Search and Jump (Cmd+K)"
              className="p-1.5 sm:p-2 text-[#556252] dark:text-[#96A893] hover:text-[#142314] dark:hover:text-white hover:bg-[#F1EFEC] dark:hover:bg-[#1E3320] rounded-full transition-colors border border-[#DFE6DC] dark:border-[#223926] bg-white dark:bg-[#132216] shadow-2xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Design Document Pill Button */}
            <button
              id="btn-open-designdoc"
              onClick={onOpenDesignDoc}
              title="View 1-2 Page Assessment Design Document"
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#142314] dark:text-[#EEF5ED] bg-[#F4F6F2] dark:bg-[#162719] border border-[#DFE6DC] dark:border-[#263D2B] rounded-full hover:bg-[#EAEFE8] dark:hover:bg-[#203623] transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileCode className="w-3.5 h-3.5 text-[#8C7851]" />
              <span>Design Doc</span>
            </button>

            {/* Google Drive Status / Connect Button */}
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-[#DFE6DC] dark:border-[#223926]">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-emerald-500/30"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] sm:text-xs flex items-center justify-center border border-emerald-500/30">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="hidden 2xl:block text-xs font-semibold text-[#142314] dark:text-white truncate max-w-[90px] whitespace-nowrap">
                    {user.displayName || 'Drive Ready'}
                  </span>
                </div>

                <button
                  id="btn-user-logout"
                  onClick={onLogout}
                  title="Sign out of Google"
                  className="p-1 sm:p-1.5 text-[#6B7868] dark:text-[#96A893] hover:text-[#142314] dark:hover:text-white hover:bg-[#F1EFEC] dark:hover:bg-[#1E3320] rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="btn-google-signin"
                onClick={onLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-white dark:bg-[#132216] border border-[#DFE6DC] dark:border-[#263D2B] hover:border-emerald-500/40 text-[#142314] dark:text-white hover:bg-[#F4F6F2] dark:hover:bg-[#1A2E1C] rounded-full text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
                <span className="hidden sm:inline">{isLoggingIn ? 'Connecting...' : 'Connect Drive'}</span>
                <span className="sm:hidden text-[11px] font-medium">{isLoggingIn ? '...' : 'Drive'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row (under lg screens) */}
        <div className="grid lg:hidden grid-cols-5 items-center py-2 landscape:py-1 px-0.5 sm:px-1 border-t border-[#DFE6DC] dark:border-[#1E3021] gap-1 sm:gap-1.5 text-[10.5px] sm:text-xs select-none w-full">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`w-full py-1.5 landscape:py-1 px-1 rounded-lg sm:rounded-full font-medium whitespace-nowrap text-center transition-colors cursor-pointer truncate ${
              currentTab === 'overview'
                ? 'bg-emerald-600 dark:bg-[#1C3320] text-white dark:text-[#52e35b] font-bold border border-transparent dark:border-[#38663E]'
                : 'text-[#475544] dark:text-[#CBD8C9] hover:text-[#1D2B17] dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('solutions')}
            className={`w-full py-1.5 landscape:py-1 px-1 rounded-lg sm:rounded-full font-medium whitespace-nowrap text-center transition-colors cursor-pointer truncate ${
              currentTab === 'solutions'
                ? 'bg-emerald-600 dark:bg-[#1C3320] text-white dark:text-[#52e35b] font-bold border border-transparent dark:border-[#38663E]'
                : 'text-[#475544] dark:text-[#CBD8C9] hover:text-[#1D2B17] dark:hover:text-white'
            }`}
          >
            Solutions
          </button>
          <button
            onClick={() => setCurrentTab('calculator')}
            className={`w-full py-1.5 landscape:py-1 px-1 rounded-lg sm:rounded-full font-medium whitespace-nowrap text-center transition-colors cursor-pointer truncate ${
              currentTab === 'calculator'
                ? 'bg-emerald-600 dark:bg-[#1C3320] text-white dark:text-[#52e35b] font-bold border border-transparent dark:border-[#38663E]'
                : 'text-[#475544] dark:text-[#CBD8C9] hover:text-[#1D2B17] dark:hover:text-white'
            }`}
          >
            <span className="hidden sm:inline">Calculator</span>
            <span className="sm:hidden">Calc</span>
          </button>
          <button
            onClick={() => setCurrentTab('planner')}
            className={`w-full py-1.5 landscape:py-1 px-1 rounded-lg sm:rounded-full font-medium whitespace-nowrap text-center transition-colors cursor-pointer truncate ${
              currentTab === 'planner'
                ? 'bg-emerald-600 dark:bg-[#1C3320] text-white dark:text-[#52e35b] font-bold border border-transparent dark:border-[#38663E]'
                : 'text-[#475544] dark:text-[#CBD8C9] hover:text-[#1D2B17] dark:hover:text-white'
            }`}
          >
            Planner
          </button>
          <button
            onClick={() => setCurrentTab('drive_save')}
            className={`w-full py-1.5 landscape:py-1 px-1 rounded-lg sm:rounded-full font-medium whitespace-nowrap flex items-center justify-center gap-1 transition-colors cursor-pointer truncate ${
              currentTab === 'drive_save'
                ? 'bg-[#142314] dark:bg-[#52e35b] text-white dark:text-[#061408] font-bold shadow-xs'
                : 'text-emerald-700 dark:text-emerald-400 font-semibold hover:text-emerald-800 dark:hover:text-emerald-300'
            }`}
          >
            <Cloud className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline">Drive Sync</span>
            <span className="sm:hidden">Drive</span>
          </button>
        </div>
      </div>
    </header>
  );
};
