import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DecryptedText, ShinyText, StrokeText } from './reactbits';
import { Leaf } from 'lucide-react';

interface IntroLoaderProps {
  onComplete: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  useEffect(() => {
    // 4.5 seconds total intro time
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-[#060A06] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background radial organic glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(46,84,59,0.15)_0%,transparent_50%)]" />
      
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Main Logo & Title */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 z-10"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#65e66d] flex items-center justify-center font-bold shadow-[0_0_60px_rgba(101,230,109,0.5)]">
          <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-[#081E11]" />
        </div>
        
        <div className="relative w-[300px] sm:w-[450px] flex justify-center">
          <StrokeText
            text="CarbonZero"
            strokeColor="#4A6741"
            fillColor="#ffffff"
            strokeWidth={1.2}
            drawDuration={1.8}
            fillDelay={0.4}
            stagger={0.08}
            ease="power3.inOut"
            trigger="mount"
            fillMode="fade"
            fontSize={64}
            fontWeight={800}
            letterSpacing={-2}
          />
        </div>
      </motion.div>

      {/* High-Tech Telemetry Decrypting Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="mt-8 sm:mt-10 z-10 h-6 flex items-center justify-center"
      >
        <DecryptedText
          text="INITIALIZING BIOSPHERIC ENGINES..."
          animateOn="view"
          speed={45}
          maxIterations={25}
          className="font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[#8ca890]"
        />
      </motion.div>
      
      {/* Progress / Power Bar */}
      <div className="relative mt-6 z-10 w-[200px] sm:w-[280px] h-[2px] bg-[#1A2C1D] rounded-full overflow-hidden">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ delay: 0.5, duration: 2.2, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full bg-[#65e66d] shadow-[0_0_10px_#65e66d]"
        />
      </div>
      
      {/* Subtle ShinyText Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 z-10"
      >
        <ShinyText 
          text="Connecting to Global Flux Data" 
          speed={3} 
          className="text-[#4A6741] font-mono text-[10px] tracking-widest uppercase" 
        />
      </motion.div>
    </motion.div>
  );
};
