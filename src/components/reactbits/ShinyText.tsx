import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

/**
 * React Bits - ShinyText (https://reactbits.dev/components/shiny-text)
 * Creates a gleaming metallic / iridescent light sweep over typography.
 */
export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`relative inline-block overflow-hidden ${
        disabled
          ? ''
          : 'bg-clip-text text-transparent bg-[linear-gradient(120deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,1)_35%,rgba(138,206,120,1)_50%,rgba(255,255,255,1)_65%,rgba(255,255,255,0.7)_100%)] bg-[length:200%_100%] animate-[shine_5s_linear_infinite]'
      } ${className}`}
      style={{
        animationDuration: disabled ? undefined : animationDuration,
      }}
    >
      {text}
    </span>
  );
};
