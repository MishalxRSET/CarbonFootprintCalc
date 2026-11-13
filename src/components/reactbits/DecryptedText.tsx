import React, { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

/**
 * React Bits - DecryptedText (https://reactbits.dev/components/decrypted-text)
 * High-tech decrypting character animation for technical & telemetry readouts.
 */
export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 40,
  maxIterations = 10,
  sequential = true,
  characters = DEFAULT_CHARS,
  className = '',
  parentClassName = '',
  animateOn = 'hover',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const totalChars = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (sequential) {
              const solvedLimit = Math.floor((iteration / maxIterations) * totalChars);
              if (index <= solvedLimit) return char;
            } else {
              if (iteration >= maxIterations) return char;
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      iteration += 1;
      if (iteration > maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view') {
      startScramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, animateOn]);

  return (
    <span
      className={`inline-block ${parentClassName}`}
      onMouseEnter={() => {
        setIsHovering(true);
        if (animateOn === 'hover') startScramble();
      }}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
};
