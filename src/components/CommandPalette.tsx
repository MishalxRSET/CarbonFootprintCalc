import React, { useState, useEffect, useMemo } from 'react';
import { PageTab } from '../types';
import { COMPREHENSIVE_SOLUTIONS } from '../data/solutionsData';
import { ambientSound } from '../utils/ambientAudio';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  Sparkles,
  Calculator,
  Compass,
  Cloud,
  FileCode,
  Volume2,
  VolumeX,
  ArrowRight,
  Zap,
  Printer,
  X,
  Command,
  Globe2,
  Sun,
  Moon,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: PageTab) => void;
  onOpenDesignDoc: () => void;
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Solutions' | 'Actions' | 'Tools';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenDesignDoc,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(ambientSound.getIsPlaying());

  useEffect(() => {
    return ambientSound.subscribe((playing) => setIsAudioPlaying(playing));
  }, []);

  // Keyboard shortcut listener for Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle handled by caller or state
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build command index
  const allCommands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      {
        id: 'nav-overview',
        category: 'Navigation',
        title: 'Overview & Mission Brief',
        subtitle: 'Executive decarbonization dashboard & IPCC benchmarks',
        icon: <Sparkles className="w-4 h-4 text-[#4A6741]" />,
        action: () => {
          onNavigate('overview');
          onClose();
        },
      },
      {
        id: 'nav-solutions',
        category: 'Navigation',
        title: 'Solutions Directory (12 Interventions)',
        subtitle: 'Technical engineering blueprints & ROI metrics',
        icon: <Zap className="w-4 h-4 text-[#8C7851]" />,
        action: () => {
          onNavigate('solutions');
          onClose();
        },
      },
      {
        id: 'nav-calculator',
        category: 'Navigation',
        title: 'GHG Emissions Calculator',
        subtitle: 'Audit Scope 1, Scope 2, and Scope 3 personal & facility footprints',
        icon: <Calculator className="w-4 h-4 text-[#4A6741]" />,
        action: () => {
          onNavigate('calculator');
          onClose();
        },
      },
      {
        id: 'nav-planner',
        category: 'Navigation',
        title: 'Decarbonization Roadmap Planner',
        subtitle: 'Interactive milestone simulator & payback timeline',
        icon: <Compass className="w-4 h-4 text-[#4A6741]" />,
        action: () => {
          onNavigate('planner');
          onClose();
        },
      },
      {
        id: 'nav-drive',
        category: 'Navigation',
        title: 'Save Plan to Google Drive',
        subtitle: 'Export your decarbonization plan to Google Docs, Markdown, or JSON',
        icon: <Cloud className="w-4 h-4 text-[#4A6741]" />,
        action: () => {
          onNavigate('drive_save');
          onClose();
        },
      },
      {
        id: 'action-designdoc',
        category: 'Actions',
        title: 'Open Project Design Document',
        subtitle: 'Comprehensive 1–2 page technical report & reduction framework',
        icon: <FileCode className="w-4 h-4 text-[#4A6741]" />,
        action: () => {
          onOpenDesignDoc();
          onClose();
        },
      },
      {
        id: 'action-theme-toggle',
        category: 'Actions',
        title: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        subtitle: 'Toggle theme with React Bits circular ripple transition (Shortcut: T)',
        icon: isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-[#78B169]" />,
        shortcut: 'T',
        action: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: 'action-soundscape',
        category: 'Actions',
        title: isAudioPlaying ? 'Mute Biospheric Soundscape' : 'Enable Biospheric Ambient Soundscape',
        subtitle: 'Organic harmonic drone generated in real-time with Web Audio API',
        icon: isAudioPlaying ? <VolumeX className="w-4 h-4 text-[#8C7851]" /> : <Volume2 className="w-4 h-4 text-[#4A6741]" />,
        action: () => {
          ambientSound.toggle();
          onClose();
        },
      },
      {
        id: 'action-print',
        category: 'Actions',
        title: 'Print Technical Decarbonization Dossier',
        subtitle: 'Export active page to PDF / printer format',
        icon: <Printer className="w-4 h-4 text-[#5C6658]" />,
        action: () => {
          window.print();
          onClose();
        },
      },
    ];

    // Add each of the 12 solutions to the command palette
    COMPREHENSIVE_SOLUTIONS.forEach((sol) => {
      items.push({
        id: `sol-${sol.id}`,
        category: 'Solutions',
        title: sol.title,
        subtitle: `${sol.category} • ${sol.abatementKgPerYear} kg CO₂e/yr abatement`,
        icon: <Zap className="w-4 h-4 text-[#8C7851]" />,
        action: () => {
          onNavigate('solutions');
          onClose();
        },
      });
    });

    return items;
  }, [onNavigate, onOpenDesignDoc, onClose, isAudioPlaying, isDark, toggleTheme]);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(q) ||
        (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q)) ||
        cmd.category.toLowerCase().includes(q)
    );
  }, [allCommands, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E170C]/60 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-[28px] max-w-2xl w-full shadow-2xl border border-[#E0E7DE] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E0E7DE] flex items-center gap-3 bg-[#F7F9F6]">
          <Search className="w-5 h-5 text-[#737C70] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, solution (e.g. heat pump, solar), or page..."
            className="w-full bg-transparent text-sm text-[#1D2B17] placeholder-[#A3ADA0] focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#737C70] hover:text-[#1D2B17] hover:bg-[#E8E4DF] rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#737C70]">
              No commands or solutions matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  selectedIndex === idx
                    ? 'bg-[#F1EFEC] text-[#1D2B17]'
                    : 'text-[#5C6658] hover:bg-[#F7F9F6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E0E7DE] flex items-center justify-center shrink-0 shadow-2xs">
                    {cmd.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1D2B17] leading-snug">{cmd.title}</p>
                    {cmd.subtitle && (
                      <p className="text-[11px] text-[#737C70] truncate max-w-md">{cmd.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7851] bg-white px-2 py-0.5 rounded border border-[#E0E7DE]">
                    {cmd.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A3ADA0]" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#E0E7DE] bg-[#F7F9F6] flex items-center justify-between text-[11px] font-mono text-[#737C70]">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white border border-[#E0E7DE] rounded shadow-2xs">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-[#E0E7DE] rounded shadow-2xs">↵</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-[#E0E7DE] rounded shadow-2xs">esc</kbd> close</span>
          </div>
          <span className="text-[#4A6741]">CarbonZero HUD v2.4</span>
        </div>
      </div>
    </div>
  );
};
