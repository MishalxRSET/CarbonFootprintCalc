/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { PageTab, CalculationResult } from './types';
import { calculateEmissions, DEFAULT_EMISSION_INPUTS } from './data/carbonData';
import { initAuth, googleSignIn, logoutUser, requestDriveAccess, invalidateAccessToken, AuthUserProfile } from './lib/firebase';
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
import { Sparkles } from 'lucide-react';

import { IntroLoader } from './components/IntroLoader';
import { SiteFooter } from './components/SiteFooter';
import { AuthProblemModal, AuthProblem, authProblemFromError } from './components/AuthProblemModal';
import { SmoothScroll, getLenis, prefersReducedMotion } from './components/fx/SmoothScroll';
import { CustomCursor } from './components/fx/CustomCursor';
import { PageCurtain, CurtainRequest } from './components/fx/PageCurtain';

// Stable identity: Iridescence rebuilds its WebGL context whenever this array changes
const IRIDESCENCE_COLOR: [number, number, number] = [0.1, 0.5, 0.3];

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<PageTab>('overview');
  const [user, setUser] = useState<AuthUserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authProblem, setAuthProblem] = useState<AuthProblem | null>(null);
  const [isDesignDocOpen, setIsDesignDocOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [heroVisualReady, setHeroVisualReady] = useState(false);
  // Becomes true when the intro starts opening onto the hero, slightly before it unmounts
  const [heroRevealed, setHeroRevealed] = useState(false);
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

  const handleIntroComplete = useCallback(() => {
    setHeroRevealed(true);
    setShowIntro(false);
  }, []);
  const handleIntroReveal = useCallback(() => setHeroRevealed(true), []);
  const handleHeroVisualReady = useCallback(() => setHeroVisualReady(true), []);

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
      // Every failure other than a deliberately closed popup gets an explanation
      setAuthProblem(authProblemFromError(err));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRequestDriveAccess = async (forceRefresh = false): Promise<string> => {
    // Yield to the browser to paint loading state if this was invoked from a button
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const token = await requestDriveAccess({ forceRefresh });
      setAccessToken(token);
      return token;
    } catch (err: unknown) {
      // Popup and domain problems get the explanatory modal; the caller still shows its own inline state
      const problem = authProblemFromError(err);
      if (problem && problem.kind !== 'other') setAuthProblem(problem);
      throw err;
    }
  };

  // Google rejected the token (expired, revoked or missing the Drive scope): forget it
  const handleDriveTokenInvalid = useCallback(() => {
    invalidateAccessToken();
    setAccessToken(null);
  }, []);

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
    <div className={`min-h-screen bg-[#F7F9F6] dark:bg-[#0D140C] text-[#2D332B] dark:text-[#E2ECE0] flex flex-col font-sans selection:bg-[#D9E4D1] dark:selection:bg-[#284024] selection:text-[#1D2B17] dark:selection:text-[#D9E4D1] ${heroRevealed ? '' : 'h-screen overflow-hidden'}`}>
      {/* Global Iridescence Background */}
      <div className="fixed inset-0 z-0 opacity-[0.12] dark:opacity-[0.16] pointer-events-none">
        <Iridescence color={IRIDESCENCE_COLOR} mouseReact={true} speed={0.8} amplitude={0.15} />
      </div>

      <SmoothScroll paused={!heroRevealed} />
      <CustomCursor />
      <div className="grain-overlay" aria-hidden="true" />

      <AnimatePresence>
        {showIntro && <IntroLoader
            key="introLoader"
            assetsReady={heroVisualReady}
            onReveal={handleIntroReveal}
            onComplete={handleIntroComplete}
          />}
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
                ready={heroRevealed}
                onHeroVisualReady={handleHeroVisualReady}
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
                onDriveTokenInvalid={handleDriveTokenInvalid}
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

      {/* Google sign-in problem explanations (popup blocked, unauthorized domain, other failures) */}
      <AuthProblemModal
        problem={authProblem}
        onClose={() => setAuthProblem(null)}
        onRetry={() => {
          setAuthProblem(null);
          handleLogin();
        }}
        onDownloadInstead={() => {
          setAuthProblem(null);
          if (currentTab !== 'drive_save') handleTabChange('drive_save');
        }}
      />

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

