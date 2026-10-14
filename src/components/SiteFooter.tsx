import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Instagram } from 'lucide-react';
import { PageTab } from '../types';
import { EASE_OUT_EXPO, UNDERLINE_WIPE } from './fx/Kinetic';

const HANDLES = ['@gearshift.overdrive', '@blurdragon2007', '@bossdk.himself', '@mukthabinu', '@ak_nike12', '@steve20072025'];

interface SiteFooterProps {
  onNavigate: (tab: PageTab) => void;
  onOpenDesignDoc: () => void;
  onBackToTop: () => void;
  className?: string;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ onNavigate, onOpenDesignDoc, onBackToTop, className = '' }) => {
  const links: { label: string; onClick: () => void }[] = [
    { label: 'Overview', onClick: () => onNavigate('overview') },
    { label: 'Carbon Calculator', onClick: () => onNavigate('calculator') },
    { label: 'Solutions Hub', onClick: () => onNavigate('solutions') },
    { label: 'Reduction Planner', onClick: () => onNavigate('planner') },
    { label: 'Save Plan to Google Drive', onClick: () => onNavigate('drive_save') },
    { label: 'Project Design Document', onClick: onOpenDesignDoc },
  ];

  return (
    <footer data-nav-theme="dark" className={`dark relative z-10 overflow-hidden bg-[#040805] text-[#c7d8ca] ${className}`}>
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-24 sm:px-8 lg:px-12 lg:pt-32">
        <div className="grid gap-14 border-t border-white/10 pt-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
              Reduce today. Restore tomorrow.{' '}
              <span className="font-editorial font-normal text-[#65e66d]">Sustain forever.</span>
            </p>
            <button
              type="button"
              onClick={onBackToTop}
              className="group mt-10 inline-flex items-center gap-3 text-sm text-white/70 hover:text-white cursor-pointer"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-[#65e66d] group-hover:bg-[#65e66d] group-hover:text-[#04110a]">
                <ArrowUp className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
              </span>
              Back to top
            </button>
          </div>

          <nav className="lg:col-span-3" aria-label="Footer">
            <span className="type-label text-white/40">Navigate</span>
            <ul className="mt-5 space-y-2.5">
              {links.map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={l.onClick}
                    className={`${UNDERLINE_WIPE} text-[15px] font-medium text-[#e2ece0] transition-colors hover:text-[#65e66d] cursor-pointer`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <span className="type-label text-white/40">Crew</span>
            <p className="mt-5 text-[15px]">
              Built with <span className="text-[#65e66d]">♥</span> by{' '}
              <span className="font-semibold text-white">Team Nigeshhh</span>{' '}
              <span className="font-mono text-[11px] text-[#6f9a76]">[GROUP 8]</span>
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {HANDLES.map((handle) => (
                <li key={handle}>
                  <a
                    href={`https://instagram.com/${handle.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 font-mono text-[11px] text-[#9fbaa3] transition-colors hover:text-[#65e66d]"
                  >
                    <Instagram className="h-3 w-3 transition-transform group-hover:scale-110" />
                    {handle}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-editorial text-xl text-[#A6C3A9]">For Mr. Sanjay Gireeshan with Love</p>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="relative mt-16 select-none overflow-hidden px-3 sm:px-6" aria-hidden="true">
        <motion.p
          initial={{ y: '45%' }}
          whileInView={{ y: '0%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
          className="type-mega whitespace-nowrap text-center text-[19.2vw] leading-[0.78] text-white"
        >
          Carbon<span className="font-editorial font-normal text-[#65e66d]">Zero</span>
        </motion.p>
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 border-t border-white/10 px-5 py-6 font-mono text-[11px] text-[#8ca890] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>© 2026 CarbonZero | For a sustainable future</span>
        <span className="text-[#789d7d]">Aligned with GHG Protocol Scopes 1, 2 & 3</span>
      </div>
    </footer>
  );
};
