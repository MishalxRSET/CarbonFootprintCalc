import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { Magnet } from './Magnet';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'compact' | 'pill' | 'expanded';
  showLabel?: boolean;
  magnetic?: boolean;
}

/**
 * React Bits - Animated Theme Toggle (https://reactbits.dev)
 * Features magnetic physics on hover, smooth spring icon morphing,
 * and circular expanding wave transition.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'compact',
  showLabel = false,
  magnetic = true,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e);
  };

  const buttonContent = (
    <motion.button
      id="reactbits-theme-toggle-btn"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode (Press T)`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode (Press T)`}
      className={`relative flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#78B169] select-none cursor-pointer ${
        variant === 'compact'
          ? 'w-9 h-9 rounded-full border border-[#E0E7DE] dark:border-[#2D422B] bg-white/90 dark:bg-[#152214] text-[#1D2B17] dark:text-[#E8F3E5] shadow-xs hover:border-[#CCD9C3] dark:hover:border-[#425F3F]'
          : variant === 'pill'
          ? 'px-3 py-1.5 rounded-full border border-[#E0E7DE] dark:border-[#2D422B] bg-white/90 dark:bg-[#152214] text-[#1D2B17] dark:text-[#E8F3E5] gap-2 text-xs font-semibold shadow-xs'
          : 'px-4 py-2 rounded-2xl border border-[#E0E7DE] dark:border-[#2D422B] bg-white/90 dark:bg-[#152214] text-[#1D2B17] dark:text-[#E8F3E5] gap-2.5 text-xs font-semibold shadow-xs'
      } ${className}`}
    >
      {/* Dynamic Aura Glow */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.35 : 0.15,
          scale: isHovered ? 1.2 : 0.9,
        }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 rounded-full blur-md pointer-events-none ${
          isDark
            ? 'bg-gradient-to-tr from-[#4A6741] to-[#78B169]'
            : 'bg-gradient-to-tr from-amber-400 to-yellow-300'
        }`}
      />

      {/* Animated Icon Container */}
      <div className="relative w-4 h-4 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="dark-moon"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 22,
              }}
              className="absolute inset-0 flex items-center justify-center text-[#78B169]"
            >
              <Moon className="w-4 h-4 fill-[#78B169]/20 stroke-[#78B169]" />
              {/* Twinkling micro stars */}
              <motion.span
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut',
                }}
                className="absolute -top-1 -right-1 text-[8px] text-[#A6E398]"
              >
                ✦
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="light-sun"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 22,
              }}
              className="absolute inset-0 flex items-center justify-center text-amber-600 dark:text-amber-400"
            >
              <Sun className="w-4 h-4 stroke-amber-500 fill-amber-400/20" />
              {/* Sun rays pulse animation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 16,
                  ease: 'linear',
                }}
                className="absolute inset-0 border border-dashed border-amber-300/40 rounded-full scale-125 pointer-events-none"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Optional Text Label */}
      {(showLabel || variant !== 'compact') && (
        <span className="relative z-10 text-[11px] tracking-wide font-medium">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}

      {/* Keyboard Shortcut Hint in Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#1D2B17] dark:bg-[#0D140C] text-white text-[10px] font-mono whitespace-nowrap shadow-lg border border-white/10 pointer-events-none z-50 flex items-center gap-1"
          >
            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
            <kbd className="px-1 py-0.2 rounded bg-white/20 text-[9px]">T</kbd>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  if (magnetic) {
    return (
      <Magnet padding={25} magnetStrength={3}>
        {buttonContent}
      </Magnet>
    );
  }

  return buttonContent;
};

/**
 * Visual expanding wave ripple overlay
 * Fallback for browser view transitions to provide a smooth, organic expanding circle effect.
 */
export const ThemeRippleOverlay: React.FC = () => {
  const { isTransitioning, transitionOrigin, isDark } = useTheme();

  if (!isTransitioning || !transitionOrigin) return null;

  // Compute maximum distance to cover the screen
  const maxRadius = Math.hypot(
    Math.max(transitionOrigin.x, window.innerWidth - transitionOrigin.x),
    Math.max(transitionOrigin.y, window.innerHeight - transitionOrigin.y)
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <motion.div
        initial={{
          width: 0,
          height: 0,
          opacity: 0.45,
          x: transitionOrigin.x,
          y: transitionOrigin.y,
        }}
        animate={{
          width: maxRadius * 2.2,
          height: maxRadius * 2.2,
          opacity: 0,
          x: transitionOrigin.x - maxRadius * 1.1,
          y: transitionOrigin.y - maxRadius * 1.1,
        }}
        transition={{
          duration: 0.48,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          borderRadius: '50%',
          backgroundColor: isDark ? '#0D140C' : '#F7F9F6',
          boxShadow: isDark
            ? '0 0 100px rgba(120, 177, 105, 0.25)'
            : '0 0 100px rgba(230, 154, 11, 0.25)',
        }}
      />
    </div>
  );
};
