import React, { useEffect, useRef } from 'react';
import {
  animate,
  motion,
  MotionValue,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useInView,
  useTransform,
  useVelocity,
} from 'motion/react';

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

interface MaskLineProps {
  children: React.ReactNode;
  delay?: number;
  /** When provided, the line animates on this flag instead of on scroll-into-view. */
  show?: boolean;
  className?: string;
  innerClassName?: string;
}

/** A single line of type that slides up from behind a mask. */
export const MaskLine: React.FC<MaskLineProps> = ({ children, delay = 0, show, className = '', innerClassName = '' }) => {
  // Observe the mask itself: the moving line starts fully clipped, so it can never report as visible
  const maskRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(maskRef, { once: true, margin: '0px 0px -12% 0px' });
  const visible = show === undefined ? inView : show;

  return (
    <span ref={maskRef} className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] pr-[0.12em] -mr-[0.12em] ${className}`}>
      <motion.span
        className={`block origin-top-left ${innerClassName}`}
        initial={{ y: '115%', rotate: 2.5 }}
        animate={visible ? { y: '0%', rotate: 0 } : { y: '115%', rotate: 2.5 }}
        transition={{ duration: 1.15, ease: EASE_OUT_EXPO, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
};

/** Fades and lifts a block of content once it scrolls into view. */
export const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string; y?: number }> = ({
  children,
  delay = 0,
  className = '',
  y = 28,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    transition={{ duration: 1, ease: EASE_OUT_EXPO, delay }}
  >
    {children}
  </motion.div>
);

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

interface VelocityMarqueeProps {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}

/**
 * Infinite marquee whose speed, direction and skew follow scroll velocity.
 */
export const VelocityMarquee: React.FC<VelocityMarqueeProps> = ({ children, baseVelocity = -2, className = '' }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2000, 0, 2000], [8, 0, -8]);
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap flex flex-nowrap ${className}`}>
      <motion.div className="flex flex-nowrap whitespace-nowrap" style={{ x, skewX }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex flex-nowrap items-center shrink-0" aria-hidden={i > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const ScrollWord: React.FC<{ progress: MotionValue<number>; range: [number, number]; children: React.ReactNode; accent?: boolean }> = ({
  progress,
  range,
  children,
  accent,
}) => {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, ['0.25em', '0em']);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block mr-[0.24em] ${accent ? 'font-editorial text-[#2E7D32] dark:text-[#65e66d]' : ''}`}
    >
      {children}
    </motion.span>
  );
};

/**
 * Paragraph whose words light up one by one as it is scrolled through.
 * Wrap a word in *asterisks* to render it as an italic accent.
 */
export const ScrollWords: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');

  return (
    <p ref={ref} className={className} aria-label={text.replace(/\*/g, '')}>
      {words.map((word, i) => {
        const start = i / words.length;
        const accent = word.startsWith('*');
        return (
          <ScrollWord key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]} accent={accent}>
            {word.replace(/\*/g, '')}
          </ScrollWord>
        );
      })}
    </p>
  );
};

/** Circular rotating text badge, e.g. wrapped around a call-to-action arrow. */
export const RotatingBadge: React.FC<{ text: string; className?: string; children?: React.ReactNode }> = ({
  text,
  className = '',
  children,
}) => (
  <span className={`inline-flex items-center justify-center ${className || 'relative'}`}>
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-spin-slow" aria-hidden="true">
      <defs>
        <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <text className="fill-current" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 15, letterSpacing: 5 }}>
        <textPath href="#badge-circle">{text}</textPath>
      </text>
    </svg>
    <span className="relative">{children}</span>
  </span>
);

const formatNumber = (v: number, decimals: number) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(v);

/** Number that counts up the first time it scrolls into view (and `start` is true). */
export const InViewCount: React.FC<{ to: number; decimals?: number; className?: string; start?: boolean; duration?: number }> = ({
  to,
  decimals = 0,
  className = '',
  start = true,
  duration = 1.8,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || !start) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => {
        el.textContent = formatNumber(v, decimals);
      },
    });
    return () => controls.stop();
  }, [inView, start, to, decimals, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formatNumber(0, decimals)}
    </span>
  );
};

/** Label that rolls up to a duplicate of itself when its `group` parent is hovered. */
export const RollText: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => (
  <span className={`relative inline-flex overflow-hidden ${className}`}>
    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
      {children}
    </span>
    <span
      aria-hidden="true"
      className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
    >
      {children}
    </span>
  </span>
);

/** Shared underline-wipe link styling. */
export const UNDERLINE_WIPE =
  'relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-current after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)]';
