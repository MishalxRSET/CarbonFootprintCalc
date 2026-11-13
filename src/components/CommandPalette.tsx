import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PageTab } from '../types';
import { COMPREHENSIVE_SOLUTIONS } from '../data/solutionsData';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  Sparkles,
  Calculator,
  Compass,
  Cloud,
  FileCode,
  ArrowRight,
  Zap,
  Printer,
  X,
  Command,
  Globe2,
  Sun,
  Moon,
  CornerDownLeft,
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

  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Keep references to latest values for keydown listeners
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;

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
  }, [onNavigate, onOpenDesignDoc, onClose, isDark, toggleTheme]);

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

  const filteredCommandsRef = useRef(filteredCommands);
  filteredCommandsRef.current = filteredCommands;

  // Ensure selectedIndex stays valid when filter changes
  useEffect(() => {
    if (selectedIndex >= filteredCommands.length && filteredCommands.length > 0) {
      setSelectedIndex(0);
    }
  }, [filteredCommands.length, selectedIndex]);

  // Reset and auto-focus when palette opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [isOpen]);

  // Comprehensive keyboard navigation: ArrowUp, ArrowDown, Enter, Esc, Home, End
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes palette
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      const list = filteredCommandsRef.current;
      if (list.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev + 1) % list.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) => (prev - 1 + list.length) % list.length);
      } else if (e.key === 'Home' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex(0);
      } else if (e.key === 'End' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex(list.length - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        const currentIdx = selectedIndexRef.current;
        const currentItem = list[currentIdx] || list[0];
        if (currentItem) {
          currentItem.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, onClose]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (isOpen && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-start justify-center pt-6 sm:pt-16 landscape:pt-3 p-2 sm:p-4 landscape-compact-py cursor-default"
    >
      <div className="bg-white dark:bg-[#0C170E] rounded-2xl sm:rounded-[28px] max-w-2xl w-full shadow-2xl border border-[#E0E7DE] dark:border-[#1E3021] overflow-hidden animate-in fade-in zoom-in-95 duration-150 modal-landscape-viewport cursor-auto">
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-5 border-b border-[#E0E7DE] dark:border-[#1E3021] flex items-center gap-2.5 sm:gap-3 bg-[#F7F9F6] dark:bg-[#111F13]">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#737C70] dark:text-[#8EA689] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={filteredCommands.length > 0}
            aria-autocomplete="list"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, solution (e.g. heat pump, solar), or page..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#1D2B17] dark:text-white placeholder-[#A3ADA0] dark:placeholder-[#5C725A] focus:outline-none font-medium"
          />
          <button
            onClick={onClose}
            aria-label="Close command palette"
            className="p-1 text-[#737C70] dark:text-[#8EA689] hover:text-[#1D2B17] dark:hover:text-white hover:bg-[#E8E4DF] dark:hover:bg-[#1E3320] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div
          ref={listContainerRef}
          role="listbox"
          className="max-h-[380px] landscape:max-h-[220px] overflow-y-auto p-2 sm:p-3 space-y-1"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#737C70] dark:text-[#8EA689]">
              No commands or solutions matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={cmd.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  role="option"
                  aria-selected={isSelected}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EAEFE8] dark:bg-[#1C3220] ring-1.5 ring-[#4A6741]/50 dark:ring-[#52e35b]/60 text-[#1D2B17] dark:text-white shadow-xs'
                      : 'text-[#5C6658] dark:text-[#CBD8C9] hover:bg-[#F7F9F6] dark:hover:bg-[#142317]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs border transition-colors ${
                        isSelected
                          ? 'bg-[#DCE7D9] dark:bg-[#25422B] border-[#4A6741]/40 dark:border-[#52e35b]/50'
                          : 'bg-white dark:bg-[#111F13] border-[#E0E7DE] dark:border-[#223926]'
                      }`}
                    >
                      {cmd.icon}
                    </div>
                    <div className="min-w-0 truncate">
                      <p className="text-xs font-bold text-[#1D2B17] dark:text-white leading-snug truncate">
                        {cmd.title}
                      </p>
                      {cmd.subtitle && (
                        <p className="text-[10px] sm:text-[11px] text-[#737C70] dark:text-[#8EA689] truncate max-w-md">
                          {cmd.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#4A6741] dark:text-[#52e35b] bg-[#DCE7D9]/70 dark:bg-[#142618] px-1.5 py-0.5 rounded border border-[#4A6741]/20 dark:border-[#52e35b]/30">
                        <CornerDownLeft className="w-2.5 h-2.5" />
                        <span>Select</span>
                      </span>
                    )}
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#8C7851] dark:text-[#D1B880] bg-white dark:bg-[#111F13] px-1.5 sm:px-2 py-0.5 rounded border border-[#E0E7DE] dark:border-[#223926]">
                      {cmd.category}
                    </span>
                    <ArrowRight
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
                        isSelected ? 'text-[#4A6741] dark:text-[#52e35b]' : 'text-[#A3ADA0] dark:text-[#5C725A]'
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 sm:p-3 border-t border-[#E0E7DE] dark:border-[#1E3021] bg-[#F7F9F6] dark:bg-[#111F13] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#737C70] dark:text-[#8EA689]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-[#192B1C] border border-[#E0E7DE] dark:border-[#263D2B] rounded shadow-2xs">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-[#192B1C] border border-[#E0E7DE] dark:border-[#263D2B] rounded shadow-2xs">↵</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 bg-white dark:bg-[#192B1C] border border-[#E0E7DE] dark:border-[#263D2B] rounded shadow-2xs">esc</kbd> close</span>
          </div>
          <span className="text-[#4A6741] dark:text-[#52e35b] hidden sm:inline">CarbonZero HUD v2.4</span>
        </div>
      </div>
    </div>
  );
};
