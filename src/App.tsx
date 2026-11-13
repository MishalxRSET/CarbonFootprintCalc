/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageTab, CalculationResult } from './types';
import { calculateEmissions, DEFAULT_EMISSION_INPUTS } from './data/carbonData';
import { initAuth, googleSignIn, logoutUser, getAccessToken } from './lib/firebase';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { OverviewView } from './components/OverviewView';
import { KochiSimulationExperience } from './components/KochiSimulationExperience';
import { PersepolisExperience } from './components/PersepolisExperience';
import { SolutionsView } from './components/SolutionsView';
import { CalculatorView } from './components/CalculatorView';
import { PlannerView } from './components/PlannerView';
import { DriveFindingsView } from './components/DriveFindingsView';
import { DesignDocModal } from './components/DesignDocModal';
import { CommandPalette } from './components/CommandPalette';
import { FileCode, Globe, HardDrive, Leaf, Sparkles } from 'lucide-react';

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

      {/* Main View Container */}
      <main className="flex-1">
        {currentTab === 'overview' && (
          <OverviewView
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDesignDoc={() => setIsDesignDocOpen(true)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        )}

        {(currentTab === 'kochi_simulation' || currentTab === 'persepolis_citadel') && (
          <KochiSimulationExperience
            onNavigateTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'solutions' && (
          <SolutionsView
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'calculator' && (
          <CalculatorView
            onNavigate={(tab) => setCurrentTab(tab)}
            onApplyFootprintToPlanner={handleApplyFootprintToPlanner}
          />
        )}

        {currentTab === 'planner' && (
          <PlannerView
            currentCalculation={currentCalculation}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'drive_findings' && (
          <DriveFindingsView
            user={user}
            accessToken={accessToken}
            onLogin={handleLogin}
            isLoggingIn={isLoggingIn}
          />
        )}
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

      {/* Global Academic & Engineering Footer (Hidden during Kochi 3D Immersive Fullscreen Mode) */}
      {currentTab !== 'kochi_simulation' && currentTab !== 'persepolis_citadel' && (
        <footer className="bg-white/80 backdrop-blur-md border-t border-[#E0E7DE] mt-16 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737C70]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#4A6741] text-white flex items-center justify-center shadow-xs">
                <Leaf className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-[#1D2B17]">
                CarbonZero • CO900G Environmental Science & Sustainable Engineering
              </span>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => setCurrentTab('persepolis_citadel')}
                className="text-[#8C7851] hover:text-[#1D2B17] font-bold flex items-center gap-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Persepolis 3D Citadel</span>
              </button>
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
                <span>Assessment Design Document</span>
              </button>
              <button
                onClick={() => setCurrentTab('drive_findings')}
                className="text-[#4A6741] hover:text-[#1D2B17] font-semibold flex items-center gap-1.5 transition-colors"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>CARBON FOOTPRINT REDUCTION.pptx</span>
              </button>
              <span className="text-[#A3ADA0] uppercase tracking-wider text-[11px]">Modules 3 & 4 (CO4 / CO3)</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
