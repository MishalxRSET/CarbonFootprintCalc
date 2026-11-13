import React from 'react';
import { motion } from 'motion/react';

interface FluidGlassProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * React Bits - Fluid Glass
 * A beautiful, animated glassmorphism component with fluid, organic gradient blobs moving behind the glass layer.
 */
export const FluidGlassButton: React.FC<FluidGlassProps> = ({ 
  children, 
  className = '', 
  containerClassName = '', 
  ...props 
}) => {
  return (
    <button
      className={`group relative overflow-hidden rounded-full bg-white/20 dark:bg-[#1A2C1D]/40 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all hover:shadow-[0_8px_32px_rgba(74,103,65,0.25)] hover:-translate-y-1 ${containerClassName}`}
      {...props}
    >
      {/* Fluid glowing blobs behind the glass */}
      <div className="absolute inset-0 -z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            x: ['-10%', '10%', '-10%'],
            y: ['-10%', '10%', '-10%']
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[50%] -left-[50%] w-[150%] h-[150%] bg-gradient-to-r from-emerald-400/40 to-teal-400/40 dark:from-emerald-500/40 dark:to-teal-600/40 blur-xl rounded-full mix-blend-overlay"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.4, 1],
            x: ['10%', '-10%', '10%'],
            y: ['10%', '-10%', '10%']
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[50%] -right-[50%] w-[150%] h-[150%] bg-gradient-to-r from-green-300/40 to-lime-400/40 dark:from-green-600/40 dark:to-lime-600/40 blur-xl rounded-full mix-blend-overlay"
        />
      </div>

      {/* Glossy overlay reflection */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-white/10 via-white/5 to-white/30 dark:from-white/0 dark:via-white/0 dark:to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className={`relative z-10 h-full w-full flex items-center justify-center ${className}`}>
        {children}
      </div>
    </button>
  );
};
