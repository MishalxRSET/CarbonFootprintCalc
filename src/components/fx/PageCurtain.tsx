import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PageTab } from '../../types';
import { EASE_IN_OUT, EASE_OUT_EXPO } from './Kinetic';

const TITLES: Record<PageTab, { index: string; lead: string; accent: string }> = {
  overview: { index: '01', lead: 'Our', accent: 'planet' },
  solutions: { index: '02', lead: 'Five', accent: 'solutions' },
  calculator: { index: '03', lead: 'Your', accent: 'footprint' },
  planner: { index: '04', lead: 'The', accent: 'plan' },
  drive_save: { index: '05', lead: 'Save to', accent: 'Drive' },
  designdoc: { index: '06', lead: 'Design', accent: 'doc' },
};

export interface CurtainRequest {
  tab: PageTab;
  key: number;
}

interface PageCurtainProps {
  request: CurtainRequest | null;
  /** Called once the curtain fully covers the viewport; swap the page here. */
  onCovered: (tab: PageTab) => void;
}

/** Full-screen wipe shown between tabs, titled with the destination page. */
export const PageCurtain: React.FC<PageCurtainProps> = ({ request, onCovered }) => {
  const coveredKey = useRef<number | null>(null);

  return (
    <AnimatePresence>
      {request && (
        <motion.div
          key={request.key}
          className="fixed inset-0 z-[90] flex flex-col justify-between overflow-hidden bg-[#040805] p-5 text-white sm:p-8 lg:p-12"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.65, ease: EASE_IN_OUT } }}
          transition={{ duration: 0.5, ease: EASE_IN_OUT }}
          onAnimationComplete={() => {
            if (coveredKey.current === request.key) return;
            coveredKey.current = request.key;
            onCovered(request.tab);
          }}
          aria-hidden="true"
        >
          <div className="type-label flex justify-between text-white/50">
            <span>CarbonZero</span>
            <span>({TITLES[request.tab].index})</span>
          </div>
          <div className="overflow-hidden pb-[0.08em]">
            <motion.p
              className="type-mega text-[clamp(3.5rem,14vw,15rem)]"
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-40%', opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.08 }}
            >
              {TITLES[request.tab].lead}{' '}
              <span className="font-editorial text-[#65e66d]">{TITLES[request.tab].accent}.</span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
