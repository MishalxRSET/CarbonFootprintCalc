import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: (event?: React.MouseEvent | MouseEvent) => void;
  setTheme: (theme: ThemeMode, event?: React.MouseEvent | MouseEvent) => void;
  transitionOrigin: { x: number; y: number } | null;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'carbonzero_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      // Default to system preference if available, otherwise 'light'
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Fallback
    }
    return 'light';
  });

  const [transitionOrigin, setTransitionOrigin] = useState<{ x: number; y: number } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  // Synchronize DOM root class whenever theme changes
  const applyThemeToDOM = useCallback((newTheme: ThemeMode) => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
  }, []);

  // Run on mount to ensure correct initial class
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme, applyThemeToDOM]);

  // Execute animated transition
  const executeThemeChange = useCallback(
    (targetTheme: ThemeMode, event?: React.MouseEvent | MouseEvent) => {
      if (targetTheme === theme) return;

      const clickX = event?.clientX ?? window.innerWidth / 2;
      const clickY = event?.clientY ?? window.innerHeight / 2;
      setTransitionOrigin({ x: clickX, y: clickY });
      setIsTransitioning(true);

      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      // Check for native View Transitions API support
      const doc = document as unknown as {
        startViewTransition?: (callback: () => void) => {
          ready: Promise<void>;
          finished: Promise<void>;
        };
      };

      if (typeof doc.startViewTransition === 'function') {
        const endRadius = Math.hypot(
          Math.max(clickX, window.innerWidth - clickX),
          Math.max(clickY, window.innerHeight - clickY)
        );

        const transition = doc.startViewTransition(() => {
          setThemeState(targetTheme);
          applyThemeToDOM(targetTheme);
          try {
            localStorage.setItem(STORAGE_KEY, targetTheme);
          } catch {
            // ignore
          }
        });

        transition.ready
          .then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${clickX}px ${clickY}px)`,
                  `circle(${endRadius}px at ${clickX}px ${clickY}px)`,
                ],
              },
              {
                duration: 520,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                pseudoElement: '::view-transition-new(root)',
              }
            );
          })
          .catch(() => {
            // fallback
          });

        transition.finished.finally(() => {
          setIsTransitioning(false);
          setTransitionOrigin(null);
        });
      } else {
        // Fallback with React state & ripple
        setThemeState(targetTheme);
        applyThemeToDOM(targetTheme);
        try {
          localStorage.setItem(STORAGE_KEY, targetTheme);
        } catch {
          // ignore
        }

        transitionTimeoutRef.current = window.setTimeout(() => {
          setIsTransitioning(false);
          setTransitionOrigin(null);
        }, 550);
      }
    },
    [theme, applyThemeToDOM]
  );

  const toggleTheme = useCallback(
    (event?: React.MouseEvent | MouseEvent) => {
      const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
      executeThemeChange(nextTheme, event);
    },
    [theme, executeThemeChange]
  );

  const setTheme = useCallback(
    (newTheme: ThemeMode, event?: React.MouseEvent | MouseEvent) => {
      executeThemeChange(newTheme, event);
    },
    [executeThemeChange]
  );

  // Global 'T' key shortcut when not typing in form inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === 't' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target as HTMLElement)?.isContentEditable
      ) {
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
        transitionOrigin,
        isTransitioning,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
