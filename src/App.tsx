/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { PageTab, CalculationResult } from './types';
import { calculateEmissions, DEFAULT_EMISSION_INPUTS } from './data/carbonData';
import { initAuth, googleSignIn, logoutUser, getAccessToken, requestDriveAccess, AuthUserProfile } from './lib/firebase';
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
import { Sparkles, AlertTriangle, ExternalLink, X } from 'lucide-react';

import { IntroLoader } from './components/IntroLoader';
import { SiteFooter } from './components/SiteFooter';
import { SmoothScroll, getLenis, prefersReducedMotion } from './components/fx/SmoothScroll';
import { CustomCursor } from './components/fx/CustomCursor';
import { PageCurtain, CurtainRequest } from './components/fx/PageCurtain';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<PageTab>('overview');
  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPopupBlockedModal, setShowPopupBlockedModal] = useState(false);
  const [isDesignDocOpen, setIsDesignDocOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [curtain, setCurtain] = useState<CurtainRequest | null>(null);

  const mainRef = useRef<HTMLElement>(null);

  // Helper to reliably scroll to top across window, documentElement, body, and main container
  const scrollToTop = useCallback(() => {
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, []);

  // Tab changes run behind a full-screen curtain; the page swaps once it covers the viewport
  const handleTabChange = useCallback((tab: PageTab) => {
    if (tab === currentTab || prefersReducedMotion()) {
      setCurrentTab(tab);
      scrollToTop();
      return;
    }
    setCurtain({ tab, key: Date.now() });
  }, [currentTab, scrollToTop]);

  const handleCurtainCovered = useCallback((tab: PageTab) => {
    setCurrentTab(tab);
    scrollToTop();
    window.setTimeout(() => setCurtain(null), 180);
  }, [scrollToTop]);

  const handleBackToTop = useCallback(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleIntroComplete = useCallback(() => setShowIntro(false), []);

  // Automatically scroll to the top whenever switching tabs
  useEffect(() => {
    scrollToTop();

    const rafId = requestAnimationFrame(scrollToTop);
    const timer1 = setTimeout(scrollToTop, 50);
    const timer2 = setTimeout(scrollToTop, 150);
    const timer3 = setTimeout(scrollToTop, 340);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentTab, scrollToTop]);

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
    
    // Yield to the browser to paint the loading state (fixes INP block)
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err: unknown) {
      const errMsg = (err as Error)?.message;
      if (errMsg === 'AUTH_POPUP_BLOCKED') {
        setShowPopupBlockedModal(true);
      } else if (errMsg !== 'AUTH_CANCELLED') {
        console.warn('Login notice:', err);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRequestDriveAccess = async (): Promise<string> => {
    // Yield to the browser to paint loading state if this was invoked from a button
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const token = await requestDriveAccess();
      setAccessToken(token);
      return token;
    } catch (err: unknown) {
      const errMsg = (err as Error)?.message;
      if (errMsg === 'AUTH_POPUP_BLOCKED') {
        setShowPopupBlockedModal(true);
      }
      throw err;
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
      <div className="fixed inset-0 z-0 opacity-[0.12] dark:opacity-[0.16] pointer-events-none">
        <Iridescence color={[0.1, 0.5, 0.3]} mouseReact={true} speed={0.8} amplitude={0.15} />
      </div>

      <SmoothScroll paused={showIntro} />
      <CustomCursor />
      <div className="grain-overlay" aria-hidden="true" />

      <AnimatePresence>
        {showIntro && <IntroLoader key="introLoader" onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <PageCurtain request={curtain} onCovered={handleCurtainCovered} />

      {/* React Bits Circular Theme Ripple Overlay */}
      <ThemeRippleOverlay />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
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
      <main ref={mainRef} className="relative z-10 flex-1 overflow-x-clip">
        <AnimatePresence mode="wait" onExitComplete={scrollToTop}>
          {currentTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <OverviewView
                ready={!showIntro}
                onNavigate={handleTabChange}
                onOpenDesignDoc={() => setIsDesignDocOpen(true)}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                onOpenGuidedTour={() => setIsGuidedTourOpen(true)}
              />
            </motion.div>
          )}

          {currentTab === 'solutions' && (
            <motion.div
              key="solutions"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <SolutionsView
                onNavigate={handleTabChange}
              />
            </motion.div>
          )}

          {currentTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <CalculatorView
                onNavigate={handleTabChange}
                onApplyFootprintToPlanner={handleApplyFootprintToPlanner}
              />
            </motion.div>
          )}

          {currentTab === 'planner' && (
            <motion.div
              key="planner"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <PlannerView
                currentCalculation={currentCalculation}
                onNavigate={handleTabChange}
              />
            </motion.div>
          )}

          {currentTab === 'drive_save' && (
            <motion.div
              key="drive_save"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <SavePlanToDriveView
                currentCalculation={currentCalculation}
                accessToken={accessToken}
                onLogin={handleLogin}
                onRequestDriveAccess={handleRequestDriveAccess}
                onLogout={handleLogout}
                isLoggingIn={isLoggingIn}
                onNavigate={handleTabChange}
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
        onNavigate={handleTabChange}
      />

      {/* Modern Award-Winning Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleTabChange}
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
      <SiteFooter
        onNavigate={handleTabChange}
        onOpenDesignDoc={() => setIsDesignDocOpen(true)}
        onBackToTop={handleBackToTop}
        className={currentTab === 'overview' ? '' : 'mt-24'}
      />

      {/* Browser Popup Blocked Guidance Modal */}
      <AnimatePresence>
        {showPopupBlockedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-[#152316] rounded-2xl p-6 border border-[#D5DDD2] dark:border-[#2C482A] shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#142314] dark:text-white text-base">
                      Popup Blocked by Browser
                    </h3>
                    <p className="text-xs text-[#5C6658] dark:text-[#9DB099]">
                      Google sign-in popups are often blocked inside preview frames
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPopupBlockedModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#475544] dark:text-[#CBD8C9] leading-relaxed">
                Your browser blocked the Google authorization window from opening. To connect your account or save to Drive:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#F4F7F2] dark:bg-[#1A2E1C] rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <strong className="block text-[#1D2B17] dark:text-white font-semibold">1. Open in Standalone Tab</strong>
                    <span className="text-[11px] text-[#5C6658] dark:text-[#9DB099]">Popups work reliably without iframe security restrictions</span>
                  </div>
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4A6741] text-white font-semibold rounded-lg hover:bg-[#3B5334] transition-colors shrink-0 text-[11px]"
                  >
                    <span>Open Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 bg-[#F4F7F2] dark:bg-[#1A2E1C] rounded-xl">
                  <strong className="block text-[#1D2B17] dark:text-white font-semibold">2. Or Allow Popups in Address Bar</strong>
                  <span className="text-[11px] text-[#5C6658] dark:text-[#9DB099]">Click the pop-up blocked icon in your browser URL bar and choose "Always allow pop-ups".</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPopupBlockedModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C6658] dark:text-[#CBD8C9] hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPopupBlockedModal(false);
                    handleLogin();
                  }}
                  className="px-4 py-2 text-xs font-bold bg-[#1D2B17] dark:bg-[#4A6741] text-white rounded-xl hover:bg-[#2E4726] dark:hover:bg-[#3B5334] transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <AppContent />
      </MotionConfig>
    </ThemeProvider>
  );
}

