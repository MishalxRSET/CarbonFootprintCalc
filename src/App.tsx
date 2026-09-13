/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTab, CalculationResult } from './types';
import { calculateEmissions, DEFAULT_EMISSION_INPUTS } from './data/carbonData';
import { initAuth, googleSignIn, logoutUser, getAccessToken } from './lib/firebase';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { OverviewView } from './components/OverviewView';
import { SolutionsView } from './components/SolutionsView';
import { CalculatorView } from './components/CalculatorView';
import { PlannerView } from './components/PlannerView';
import { SavePlanToDriveView } from './components/SavePlanToDriveView';
import { DesignDocModal } from './components/DesignDocModal';
import { CommandPalette } from './components/CommandPalette';
import { GuidedTourModal } from './components/GuidedTourModal';
import { Chatbot } from './components/Chatbot';
import { ThemeRippleOverlay, FluidGlassButton, Iridescence } from './components/reactbits';
import { ThemeProvider } from './context/ThemeContext';
import { FileCode, Cloud, Leaf, Sparkles, HelpCircle, Instagram } from 'lucide-react';

import { IntroLoader } from './components/IntroLoader';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<PageTab>('overview');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDesignDocOpen, setIsDesignDocOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Maintain the active carbon footprint calculation state
  const [currentCalculation, setCurrentCalculation] = useState<CalculationResult>(() =>
    calculateEmissions(DEFAULT_EMISSION_INPUTS)
  );

  // Global shortcut listener for Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Firebase Auth listener on app load
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err) {
      console.error('Login flow failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setAccessToken(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleApplyFootprintToPlanner = (res: CalculationResult) => {
    setCurrentCalculation(res);
  };

  return (
    <div className={`min-h-screen bg-[#F7F9F6] dark:bg-[#0D140C] text-[#2D332B] dark:text-[#E2ECE0] flex flex-col font-sans selection:bg-[#D9E4D1] dark:selection:bg-[#284024] selection:text-[#1D2B17] dark:selection:text-[#D9E4D1] ${showIntro ? 'h-screen overflow-hidden' : ''}`}>
      {/* Global Iridescence Background */}
      <div className="fixed inset-0 z-0 opacity-20 dark:opacity-40 pointer-events-none">
        <Iridescence color={[0.1, 0.5, 0.3]} mouseReact={true} speed={0.8} amplitude={0.15} />
      </div>

      <AnimatePresence>
        {showIntro && <IntroLoader key="introLoader" onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* React Bits Circular Theme Ripple Overlay */}
      <ThemeRippleOverlay />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        driveConnected={Boolean(accessToken)}
        onOpenDesignDoc={() => setIsDesignDocOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenGuidedTour={() => setIsGuidedTourOpen(true)}
      />

      {/* Main View Container with Subtle Framer Motion Transitions */}
      <main className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <OverviewView
                onNavigate={(tab) => setCurrentTab(tab)}
                onOpenDesignDoc={() => setIsDesignDocOpen(true)}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                onOpenGuidedTour={() => setIsGuidedTourOpen(true)}
              />
            </motion.div>
          )}

          {currentTab === 'solutions' && (
            <motion.div
              key="solutions"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <SolutionsView
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            </motion.div>
          )}

          {currentTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <CalculatorView
                onNavigate={(tab) => setCurrentTab(tab)}
                onApplyFootprintToPlanner={handleApplyFootprintToPlanner}
              />
            </motion.div>
          )}

          {currentTab === 'planner' && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <PlannerView
                currentCalculation={currentCalculation}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            </motion.div>
          )}

          {currentTab === 'drive_save' && (
            <motion.div
              key="drive_save"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <SavePlanToDriveView
                currentCalculation={currentCalculation}
                accessToken={accessToken}
                onLogin={handleLogin}
                onLogout={handleLogout}
                isLoggingIn={isLoggingIn}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 1-2 Page Assessment Design Document Modal */}
      <DesignDocModal
        isOpen={isDesignDocOpen}
        onClose={() => setIsDesignDocOpen(false)}
      />

      {/* Interactive Step-by-Step Guided Tour Modal */}
      <GuidedTourModal
        isOpen={isGuidedTourOpen}
        onClose={() => setIsGuidedTourOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
      />

      {/* Modern Award-Winning Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenDesignDoc={() => setIsDesignDocOpen(true)}
      />

      {/* Floating Quick Tour & Help Button */}
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom)+1rem)] sm:bottom-6 right-[5.5rem] sm:right-24 z-30">
        <FluidGlassButton
          id="floating-quick-tour-btn"
          type="button"
          onClick={() => setIsGuidedTourOpen(true)}
          className="flex items-center gap-2 px-4 py-3 sm:py-2.5 text-white transition-transform group"
          containerClassName="hover:scale-105 active:scale-95 text-[11px] sm:text-xs font-bold"
          title="Start interactive guided tour"
        >
          <Sparkles className="w-4 h-4 text-[#78B169] group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Guided Tour</span>
        </FluidGlassButton>
      </div>

      {/* Global Project Footer */}
      <footer className="relative z-10 bg-[#081E11] dark:bg-[#06120A] text-[#c7d8ca] border-t border-[#193822] dark:border-[#14281A] mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#65e66d] text-[#081E11] flex items-center justify-center font-bold shadow-xs">
              <Leaf className="w-4 h-4 text-[#081E11]" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              Carbon<span className="text-[#65e66d]">Zero</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#c7d8ca] font-medium tracking-wide">
            Reduce today. Restore tomorrow. Sustain forever.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs">
            <button
              onClick={() => setCurrentTab('overview')}
              className="text-[#e2ece0] hover:text-[#65e66d] font-semibold transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('calculator')}
              className="text-[#e2ece0] hover:text-[#65e66d] font-semibold transition-colors cursor-pointer"
            >
              Carbon Calculator
            </button>
            <button
              onClick={() => setCurrentTab('solutions')}
              className="text-[#e2ece0] hover:text-[#65e66d] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#65e66d]" />
              <span>Solutions Hub</span>
            </button>
            <button
              onClick={() => setCurrentTab('planner')}
              className="text-[#e2ece0] hover:text-[#65e66d] font-semibold transition-colors cursor-pointer"
            >
              Reduction Planner
            </button>
            <button
              onClick={() => setIsDesignDocOpen(true)}
              className="text-[#e2ece0] hover:text-[#65e66d] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-[#65e66d]" />
              <span>Project Design Document</span>
            </button>
            <button
              onClick={() => setCurrentTab('drive_save')}
              className="text-[#e2ece0] hover:text-[#65e66d] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5 text-[#65e66d]" />
              <span>Save Plan to Google Drive</span>
            </button>
          </div>

          <div className="pt-8 border-t border-white/10 text-xs text-[#8ca890] flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
            <span className="hidden md:inline-block">© 2026 CarbonZero | For a sustainable future</span>
            
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#0A2414] dark:bg-[#07160B] border border-[#193822] dark:border-[#1A2C1D] px-4 py-2 rounded-full shadow-inner">
                <span>Built with <span className="text-emerald-400">♥</span> by</span>
                <span className="text-white font-semibold tracking-wide">Team Nigeshhh</span>
                <span className="font-mono text-[10px] text-[#4A6741]">[GROUP 8]</span>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 max-w-[320px] sm:max-w-none">
                {[
                  '@gearshift.overdrive',
                  '@blurdragon2007',
                  '@bossdk.himself',
                  '@mukthabinu',
                  '@ak_nike12',
                  '@steve20072025'
                ].map(handle => (
                  <a key={handle} href={`https://instagram.com/${handle.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer group">
                    <Instagram className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-[10px]">{handle}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <span className="font-mono text-[11px] text-[#789d7d]">Aligned with GHG Protocol Scopes 1, 2 & 3</span>
              <span className="md:hidden">© 2026 CarbonZero</span>
            </div>
          </div>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

