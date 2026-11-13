import { useEffect, useState } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

/** Returns the active Lenis instance, or null when smooth scrolling is disabled. */
export const getLenis = () => lenisInstance;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface SmoothScrollProps {
  paused?: boolean;
}

/**
 * Inertial smooth scrolling (Lenis). Touch keeps native scrolling, nested
 * scroll containers (modals, chat, palettes) keep native wheel behaviour.
 */
export const SmoothScroll: React.FC<SmoothScrollProps> = ({ paused = false }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      allowNestedScroll: true,
      autoRaf: true,
    });
    lenisInstance = instance;
    setLenis(instance);

    return () => {
      instance.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (paused) lenis.stop();
    else lenis.start();
  }, [lenis, paused]);

  return null;
};
