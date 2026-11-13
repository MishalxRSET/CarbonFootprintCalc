import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  useIndianLocale?: boolean;
}

/**
 * React Bits - CountUp (https://reactbits.dev/components/count-up)
 * Smoothly animates numerical increments with easing and locale formatting.
 */
export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1.2,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  useIndianLocale = true,
}) => {
  const [value, setValue] = useState(from);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = from + (to - from) * easedProgress;
      setValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setValue(to);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [to, from, duration]);

  const formattedNumber = useIndianLocale
    ? new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)
    : value.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
