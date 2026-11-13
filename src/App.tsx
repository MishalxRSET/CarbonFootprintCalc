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
import { ThemeRippleOverlay } from './components/reactbits';
import { ThemeProvider } from './context/ThemeContext';
import { FileCode, Cloud, Leaf, Sparkles, HelpCircle } from 'lucide-react';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<PageTab>('overview');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDesignDocOpen, setIsDesignDocOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState(false);

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
    <div className="min-h-screen bg-[#F7F9F6] dark:bg-[#0D140C] text-[#2D332B] dark:text-[#E2ECE0] flex flex-col font-sans selection:bg-[#D9E4D1] dark:selection:bg-[#284024] selection:text-[#1D2B17] dark:selection:text-[#D9E4D1] transition-colors duration-300">
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
      <main className="flex-1 overflow-hidden">
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
      <div className="fixed bottom-6 right-6 z-30">
        <button
          id="floating-quick-tour-btn"
          type="button"
          onClick={() => setIsGuidedTourOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1D2B17] dark:bg-[#2E4726] text-white hover:bg-[#2F472A] dark:hover:bg-[#3E5C34] shadow-xl hover:shadow-2xl border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs font-bold group"
          title="Start interactive guided tour"
        >
          <Sparkles className="w-4 h-4 text-[#78B169] group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Guided Tour</span>
        </button>
      </div>

      {/* Global Project Footer */}
      <footer className="bg-[#081E11] dark:bg-[#06120A] text-[#c7d8ca] border-t border-[#193822] dark:border-[#14281A] mt-20 py-12 transition-colors">
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

          <div className="pt-4 border-t border-white/10 text-xs text-[#8ca890] flex flex-col sm:flex-row items-center justify-between gap-2 max-w-4xl mx-auto">
            <span>© 2026 Carbon Zero | For a sustainable future</span>
            <span className="font-mono text-[11px] text-[#789d7d]">Aligned with GHG Protocol Scopes 1, 2 & 3</span>
          </div>
        </div>
      </footer>
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

