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
import { DriveFindingsView } from './components/DriveFindingsView';
import { DesignDocModal } from './components/DesignDocModal';
import { CommandPalette } from './components/CommandPalette';
import { FileCode, HardDrive, Leaf, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<PageTab>('overview');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDesignDocOpen, setIsDesignDocOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

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
    <div className="min-h-screen bg-[#F7F9F6] text-[#2D332B] flex flex-col font-sans selection:bg-[#D9E4D1] selection:text-[#1D2B17]">
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

          {currentTab === 'drive_findings' && (
            <motion.div
              key="drive_findings"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <DriveFindingsView
                user={user}
                accessToken={accessToken}
                onLogin={handleLogin}
                isLoggingIn={isLoggingIn}
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

      {/* Modern Award-Winning Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenDesignDoc={() => setIsDesignDocOpen(true)}
      />

      {/* Global Project Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-[#E0E7DE] mt-16 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737C70]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center shadow-xs">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-[#1D2B17]">
              CarbonZero • Carbon Footprint Reduction & Climate Action Platform
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setCurrentTab('solutions')}
              className="text-[#4A6741] hover:text-[#1D2B17] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solutions Hub</span>
            </button>
            <button
              onClick={() => setIsDesignDocOpen(true)}
              className="text-[#4A6741] hover:text-[#1D2B17] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Project Design Document</span>
            </button>
            <button
              onClick={() => setCurrentTab('drive_findings')}
              className="text-[#4A6741] hover:text-[#1D2B17] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>CARBON FOOTPRINT REDUCTION.pptx</span>
            </button>
            <span className="text-[#737C70] font-medium text-[11px]">GHG Protocol Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
