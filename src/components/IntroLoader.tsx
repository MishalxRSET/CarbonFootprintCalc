import React, { useEffect, useRef, useState } from 'react';
import { animate, AnimatePresence, motion } from 'motion/react';
import { prefersReducedMotion } from './fx/SmoothScroll';
import { EASE_IN_OUT, EASE_OUT_EXPO } from './fx/Kinetic';

interface IntroLoaderProps {
  onComplete: () => void;
}

const WORDS = ['Measure', 'Reduce', 'Restore', 'Sustain'];

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const reduce = prefersReducedMotion();
    const total = reduce ? 0.6 : 2.4;
    const controls = animate(0, 100, {
      duration: total,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        setCount(Math.round(v));
        setWordIndex(Math.min(WORDS.length - 1, Math.floor((v / 100) * WORDS.length)));
      },
    });
    const done = window.setTimeout(() => onCompleteRef.current(), (total + (reduce ? 0.1 : 0.35)) * 1000);
    return () => {
      controls.stop();
      window.clearTimeout(done);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#040805] text-white"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 1.05, ease: EASE_IN_OUT }}
      role="status"
      aria-label="Loading CarbonZero"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(46,140,70,0.22),transparent_60%)]" />

      <motion.div
        className="relative flex h-full flex-col justify-between p-5 sm:p-8 lg:p-12"
        exit={{ opacity: 0, y: -60 }}
        transition={{ duration: 0.7, ease: EASE_IN_OUT }}
      >
        <div className="type-label flex items-start justify-between text-white/55">
          <span>
            Carbon<span className="text-[#65e66d]">Zero</span>®
          </span>
          <span className="text-right">
            Reduce today
            <br />
            Restore tomorrow
          </span>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative h-[1.1em] overflow-hidden font-display text-[clamp(2.5rem,7vw,6.5rem)] font-semibold tracking-[-0.045em]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={WORDS[wordIndex]}
                className="block"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
              >
                {wordIndex === WORDS.length - 1 ? (
                  <span className="font-editorial font-normal text-[#65e66d]">{WORDS[wordIndex]}.</span>
                ) : (
                  WORDS[wordIndex]
                )}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <span className="type-mega tabular-nums text-[clamp(5rem,24vw,22rem)] leading-[0.78] text-white">
            {String(count).padStart(3, '0')}
          </span>
          <span className="type-label mb-3 hidden text-right text-white/50 sm:block">
            Initializing
            <br />
            biospheric engines
          </span>
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
        <div className="h-full origin-left bg-[#65e66d]" style={{ transform: `scaleX(${count / 100})` }} />
      </div>
    </motion.div>
  );
};
