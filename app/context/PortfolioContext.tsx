'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PortfolioContextType {
  isDeveloperMode: boolean;
  toggleDeveloperMode: () => void;
  isTerminalOpen: boolean;
  toggleTerminal: () => void;
  setTerminalOpen: (open: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [isTerminalOpen, setTerminalOpen] = useState(false);

  const toggleDeveloperMode = () => {
    setIsDeveloperMode(prev => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        if (next) {
          document.body.classList.add('developer-mode');
        } else {
          document.body.classList.remove('developer-mode');
        }
      }
      return next;
    });
  };

  const toggleTerminal = () => setTerminalOpen(prev => !prev);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (
        ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName) &&
        e.key !== '\`' && e.key !== 'Escape' // allow Escape to close, backtick to toggle even in inputs maybe? No, let's just ignore if in input.
      ) {
        return;
      }

      // Toggle terminal with backtick (`)
      if (e.key === '\`') {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
      }
      
      // Close terminal with Escape
      if (e.key === 'Escape') {
        setTerminalOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PortfolioContext.Provider value={{
      isDeveloperMode,
      toggleDeveloperMode,
      isTerminalOpen,
      toggleTerminal,
      setTerminalOpen
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
