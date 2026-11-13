import React, { useEffect, useRef, useState } from 'react';
import { animate, AnimatePresence, motion } from 'motion/react';
import { prefersReducedMotion } from './fx/SmoothScroll';
import { EASE_IN_OUT, EASE_OUT_EXPO } from './fx/Kinetic';

interface IntroLoaderProps {
  onComplete: () => void;
  /** True once the heavy hero visuals have rendered; the curve waits for it (up to a cap). */
  assetsReady?: boolean;
}

const MIN_HOLD_MS = 450;
const MAX_HOLD_MS = 1800;

/* ------------------------------------------------------------------------- */
/* Data: atmospheric CO₂ (ice cores, then Mauna Loa) and a net-zero pathway   */
/* ------------------------------------------------------------------------- */

const YEAR_START = 1750;
const YEAR_NOW = 2026;
const YEAR_END = 2050;
const PPM_MIN = 260;
const PPM_MAX = 440;

const RECORD: [number, number][] = [
  [1750, 280],
  [1800, 282.5],
  [1850, 285],
  [1900, 296],
  [1920, 303],
  [1940, 310],
  [1958, 315],
  [1970, 325.5],
  [1980, 338.5],
  [1990, 354],
  [2000, 369.5],
  [2010, 389],
  [2015, 400.8],
  [2020, 414],
  [2023, 421],
  [2026, 426.8],
];

// Illustrative pathway: concentrations peak and slowly fall once emissions reach net zero
const PATHWAY: [number, number][] = [
  [2026, 426.8],
  [2030, 429.4],
  [2035, 430.6],
  [2040, 429.6],
  [2045, 426.8],
  [2050, 422.5],
];

const MILESTONES = [
  { year: 1850, label: 'Industrial era' },
  { year: 1958, label: 'Mauna Loa record begins' },
  { year: 1988, label: 'IPCC founded' },
  { year: 2015, label: 'Paris Agreement' },
];

const AXIS_PPM = [280, 320, 360, 400, 440];
const AXIS_YEARS = [1750, 1850, 1950, 2050];

const interpolate = (series: [number, number][], year: number) => {
  if (year <= series[0][0]) return series[0][1];
  for (let i = 1; i < series.length; i++) {
    const [x1, y1] = series[i];
    if (year <= x1) {
      const [x0, y0] = series[i - 1];
      const t = (year - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return series[series.length - 1][1];
};

/** Recorded curve value, including the seasonal "breathing" once direct measurement begins. */
const recordAt = (year: number) =>
  interpolate(RECORD, year) + (year >= 1958 ? Math.sin((year - 1958) * Math.PI * 2) * 3 : 0);

const sx = (year: number) => ((year - YEAR_START) / (YEAR_END - YEAR_START)) * 1000;
const sy = (ppm: number) => 1000 - ((ppm - PPM_MIN) / (PPM_MAX - PPM_MIN)) * 1000;

const SAMPLES: number[] = (() => {
  const years: number[] = [];
  for (let y = YEAR_START; y < 1958; y += 2) years.push(y);
  for (let y = 1958; y <= YEAR_NOW + 1e-6; y += 0.125) years.push(y);
  return years;
})();

const linePath = (upTo: number) => {
  let d = '';
  for (const year of SAMPLES) {
    if (year > upTo) break;
    d += `${d ? 'L' : 'M'}${sx(year).toFixed(2)} ${sy(recordAt(year)).toFixed(2)}`;
  }
  return `${d || 'M0 ' + sy(280).toFixed(2)}L${sx(upTo).toFixed(2)} ${sy(recordAt(upTo)).toFixed(2)}`;
};

const pathwayPath = (upTo: number) => {
  let d = `M${sx(YEAR_NOW)} ${sy(PATHWAY[0][1])}`;
  for (let year = YEAR_NOW + 0.5; year < upTo; year += 0.5) {
    d += `L${sx(year).toFixed(2)} ${sy(interpolate(PATHWAY, year)).toFixed(2)}`;
  }
  return `${d}L${sx(upTo).toFixed(2)} ${sy(interpolate(PATHWAY, upTo)).toFixed(2)}`;
};

/* ------------------------------------------------------------------------- */

type Phase = 'draw' | 'bend';
const COLUMNS = 5;

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete, assetsReady = false }) => {
  const [phase, setPhase] = useState<Phase>('draw');
  const [started, setStarted] = useState(false);
  const mountedAt = useRef(performance.now());
  const [passed, setPassed] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const lineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const pathwayRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const tipLabelRef = useRef<HTMLSpanElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const ppmRef = useRef<HTMLSpanElement>(null);
  const deltaRef = useRef<HTMLSpanElement>(null);

  // Hold on 1750 while the hero finishes its first render, so the curve draws on an idle main thread
  useEffect(() => {
    if (started) return;
    const elapsed = performance.now() - mountedAt.current;
    const wait = assetsReady ? Math.max(0, MIN_HOLD_MS - elapsed) : Math.max(0, MAX_HOLD_MS - elapsed);
    const id = window.setTimeout(() => setStarted(true), wait);
    return () => window.clearTimeout(id);
  }, [assetsReady, started]);

  useEffect(() => {
    if (!started) return;
    const reduce = prefersReducedMotion();
    let finished = false;
    const timers: number[] = [];
    const finish = () => {
      if (finished) return;
      finished = true;
      onCompleteRef.current();
    };

    const placeTip = (year: number, ppm: number, labelPpm: number) => {
      const left = `${sx(year) / 10}%`;
      const top = `${sy(ppm) / 10}%`;
      if (tipRef.current) {
        tipRef.current.style.left = left;
        tipRef.current.style.top = top;
      }
      if (scanRef.current) scanRef.current.style.left = left;
      if (tipLabelRef.current) {
        tipLabelRef.current.textContent = `${labelPpm.toFixed(1)} ppm`;
        // Keep the readout inside the chart: it hangs left of the tip on the right-hand side
        const flip = sx(year) > 600;
        tipLabelRef.current.style.left = flip ? 'auto' : '16px';
        tipLabelRef.current.style.right = flip ? '16px' : 'auto';
      }
      if (yearRef.current) yearRef.current.textContent = String(Math.floor(year));
      if (ppmRef.current) ppmRef.current.textContent = labelPpm.toFixed(1);
    };

    let lastPassed = 0;
    let bend: ReturnType<typeof animate> | null = null;
    const draw = animate(0, 1, {
      duration: reduce ? 0.4 : 2.5,
      ease: [0.6, 0.02, 0.28, 1],
      onUpdate: (v) => {
        const year = YEAR_START + (YEAR_NOW - YEAR_START) * v;
        const d = linePath(year);
        lineRef.current?.setAttribute('d', d);
        areaRef.current?.setAttribute('d', `${d}L${sx(year).toFixed(2)} 1000L0 1000Z`);
        const trend = interpolate(RECORD, year);
        placeTip(year, recordAt(year), trend);
        if (deltaRef.current) deltaRef.current.textContent = `+${((trend / 280 - 1) * 100).toFixed(1)}% since 1750`;
        const count = MILESTONES.filter((m) => year >= m.year).length;
        if (count !== lastPassed) {
          lastPassed = count;
          setPassed(count);
        }
      },
      onComplete: () => {
        setPhase('bend');
        bend = animate(0, 1, {
          duration: reduce ? 0.3 : 1.4,
          delay: reduce ? 0 : 0.2,
          ease: EASE_OUT_EXPO,
          onUpdate: (v) => {
            const year = YEAR_NOW + (YEAR_END - YEAR_NOW) * v;
            pathwayRef.current?.setAttribute('d', pathwayPath(year));
            const ppm = interpolate(PATHWAY, year);
            placeTip(year, ppm, ppm);
          },
        });
        if (deltaRef.current) deltaRef.current.textContent = 'Net-zero pathway → 2050';
        timers.push(window.setTimeout(finish, reduce ? 500 : 2100));
      },
    });

    return () => {
      draw.stop();
      bend?.stop();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [started]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onCompleteRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Park the tip on 1750 before the curve starts
  useEffect(() => {
    const left = `${sx(YEAR_START) / 10}%`;
    if (tipRef.current) {
      tipRef.current.style.left = left;
      tipRef.current.style.top = `${sy(280) / 10}%`;
    }
    if (scanRef.current) scanRef.current.style.left = left;
  }, []);

  const bending = phase === 'bend';

  return (
    <motion.div className="fixed inset-0 z-[100] overflow-hidden text-white" role="status" aria-label="Loading CarbonZero">
      {/* Shutter columns: they hold the backdrop, then lift away one after another */}
      {Array.from({ length: COLUMNS }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 bottom-0 bg-[#040805] border-b-2 border-[#65e66d]"
          style={{ left: `${(i * 100) / COLUMNS}%`, width: `calc(${100 / COLUMNS}% + 1px)` }}
          initial={{ y: '0%' }}
          exit={{ y: '-100%', transition: { duration: 0.95, ease: EASE_IN_OUT, delay: 0.18 + i * 0.07 } }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        exit={{ opacity: 0, y: -60, transition: { duration: 0.45, ease: EASE_IN_OUT } }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(255,120,80,0.10),transparent_55%),radial-gradient(ellipse_at_20%_80%,rgba(46,140,70,0.16),transparent_60%)]" />

        {/* Corner labels */}
        <motion.div
          className="type-label absolute inset-x-5 top-5 flex items-start justify-between text-white/55 sm:inset-x-8 sm:top-8 lg:inset-x-12 lg:top-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span>
            Carbon<span className="text-[#65e66d]">Zero</span>®
          </span>
          <span className="text-right">
            Atmospheric CO₂ · ppm
            <br />
            <span className="text-white/35">Ice cores + Mauna Loa</span>
          </span>
        </motion.div>

        {/* Headline that changes with the story */}
        <div className="absolute left-5 right-5 top-[13%] sm:left-8 lg:left-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={phase}
              className="type-mega text-[clamp(2.2rem,6.2vw,6.5rem)]"
              initial="hidden"
              animate="shown"
              exit="gone"
            >
              {(bending
                ? ['Now let’s bend', <span key="a" className="font-editorial text-[#65e66d]">the curve.</span>]
                : ['Carbon in our air,', <span key="b" className="font-editorial text-[#ffb36b]">since 1750.</span>]
              ).map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em] pr-[0.12em]">
                  <motion.span
                    className="block"
                    variants={{
                      hidden: { y: '110%' },
                      shown: { y: '0%', transition: { duration: 0.75, ease: EASE_OUT_EXPO, delay: i * 0.08 } },
                      gone: { y: '-110%', transition: { duration: 0.3, ease: EASE_IN_OUT } },
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Chart */}
        <div
          className="absolute left-5 right-5 top-[36%] bottom-[33%] sm:left-8 sm:right-8 lg:left-12 lg:right-12 lg:top-[33%]"
          style={{ clipPath: 'inset(-40% -4% -12% -4%)' }}
        >
          {/* Camera: pushes in on the present day while the curve bends */}
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: '100% 12%' }}
            initial={{ scale: 1 }}
            animate={bending ? { scale: 1.85 } : { scale: 1 }}
            transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
          >
          {/* Axes */}
          {AXIS_PPM.map((ppm, i) => (
            <motion.div
              key={ppm}
              className="absolute inset-x-0 h-px origin-left bg-white/[0.07]"
              style={{ top: `${sy(ppm) / 10}%` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.1 + i * 0.06 }}
            >
              <span className="absolute -top-4 left-0 font-mono text-[10px] text-white/30">{ppm}</span>
            </motion.div>
          ))}
          {AXIS_YEARS.map((year, i) => (
            <span
              key={year}
              className={`absolute -bottom-6 font-mono text-[10px] text-white/30 ${
                i === 0 ? '' : i === AXIS_YEARS.length - 1 ? '-translate-x-full' : '-translate-x-1/2'
              }`}
              style={{ left: `${sx(year) / 10}%` }}
            >
              {year}
            </span>
          ))}

          <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="intro-co2-stroke" gradientUnits="userSpaceOnUse" x1="0" y1="1000" x2="0" y2="0">
                <stop offset="0" stopColor="#65e66d" />
                <stop offset="0.42" stopColor="#9be86d" />
                <stop offset="0.68" stopColor="#ffb36b" />
                <stop offset="1" stopColor="#ff5c5c" />
              </linearGradient>
              <linearGradient id="intro-co2-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ff7a50" stopOpacity="0.28" />
                <stop offset="1" stopColor="#ff7a50" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path ref={areaRef} fill="url(#intro-co2-fill)" />
            <path
              ref={lineRef}
              fill="none"
              stroke="url(#intro-co2-stroke)"
              strokeWidth={2}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={pathwayRef}
              fill="none"
              stroke="#65e66d"
              strokeWidth={2}
              strokeDasharray="6 6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Milestones */}
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.year}
              className="absolute bottom-0 top-[-14%]"
              data-row={MILESTONES.length - 1 - i}
              style={{ left: `${sx(m.year) / 10}%` }}
              initial={{ opacity: 0 }}
              animate={passed > i ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="absolute w-px bg-gradient-to-b from-white/40 to-transparent"
                style={{ top: 0, height: `${(14 + sy(interpolate(RECORD, m.year)) / 10) / 1.14}%` }}
              />
              <motion.span
                className="absolute left-0 hidden whitespace-nowrap rounded-sm bg-[#040805]/85 py-0.5 pl-2 pr-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70 sm:block"
                style={{ top: `${(MILESTONES.length - 1 - i) * 20}px` }}
                initial={{ y: 8 }}
                animate={passed > i ? { y: 0 } : { y: 8 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
              >
                <span className="text-white/40">{m.year}</span> {m.label}
              </motion.span>
            </motion.div>
          ))}

          {/* Scan line + tip */}
          <div ref={scanRef} className="pointer-events-none absolute -top-[18%] -bottom-[10%] left-0 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent" />
          <div ref={tipRef} className="pointer-events-none absolute left-0 top-full">
            <span
              className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-700 ${
                bending ? 'bg-[#65e66d] shadow-[0_0_24px_6px_rgba(101,230,109,0.55)]' : 'bg-[#ff7a50] shadow-[0_0_24px_6px_rgba(255,122,80,0.55)]'
              }`}
            />
            <span
              className={`absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border ${
                bending ? 'border-[#65e66d]/60' : 'border-[#ff7a50]/60'
              }`}
            />
            <span
              ref={tipLabelRef}
              className={`absolute -top-7 whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold transition-colors duration-700 ${
                bending ? 'bg-[#65e66d] text-[#04110a]' : 'bg-[#ff7a50] text-[#1a0700]'
              }`}
            >
              280.0 ppm
            </span>
          </div>
          </motion.div>
        </div>

        {/* Readouts */}
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-6 sm:inset-x-8 sm:bottom-8 lg:inset-x-12 lg:bottom-10">
          <span
            ref={yearRef}
            className={`type-mega tabular-nums text-[clamp(4.5rem,20vw,18rem)] leading-[0.78] transition-colors duration-700 ${
              bending ? 'text-[#65e66d]' : 'text-white'
            }`}
          >
            1750
          </span>
          <div className="mb-1 text-right">
            <div className="font-display text-[clamp(1.6rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">
              <span ref={ppmRef}>280.0</span>
              <span className="ml-1 text-[0.45em] font-medium text-white/50">ppm</span>
            </div>
            <span
              ref={deltaRef}
              className={`mt-2 block font-mono text-[11px] transition-colors duration-700 ${bending ? 'text-[#65e66d]' : 'text-[#ffb36b]'}`}
            >
              +0.0% since 1750
            </span>
            <button
              type="button"
              onClick={() => onCompleteRef.current()}
              className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 underline-offset-4 transition-colors hover:text-white hover:underline cursor-pointer"
            >
              Skip intro ↵
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
