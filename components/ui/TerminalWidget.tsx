'use client';

import { useState, useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';

export default function TerminalWidget() {
  const { isTerminalOpen, setTerminalOpen } = usePortfolio();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        // Show button when scrolled into or past the about section
        const aboutTop = aboutSection.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY >= aboutTop - window.innerHeight / 2) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        // Fallback
        if (window.scrollY > window.innerHeight) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-24 right-6 md:bottom-28 md:right-8 z-50 flex items-center gap-3 select-none transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sleek Tooltip Manual Hint (Hidden on mobile to save screen width) */}
      <div 
        className={`hidden sm:flex px-4 py-2.5 rounded-xl bg-[#050b14]/90 border border-cyan-500/25 text-xs text-slate-300 font-mono backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 pointer-events-none items-center gap-2 ${
          isHovered && !isTerminalOpen
            ? 'opacity-100 translate-x-0 scale-100' 
            : 'opacity-0 translate-x-4 scale-95'
        }`}
      >
        <span className="text-cyan-400 font-bold animate-pulse">&gt;_</span>
        <span>Developer Terminal (Press</span>
        <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/5 text-slate-300 font-sans font-semibold text-[10px]">`</kbd>
        <span>) | Try:</span>
        <span className="text-cyan-300 font-semibold italic">ask skills</span>
      </div>

      {/* Floating Console Button (Slightly smaller on mobile, fits above ScrollToTop) */}
      <button
        onClick={() => setTerminalOpen(!isTerminalOpen)}
        className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[#050b14]/90 border text-cyan-400 backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer ${
          isTerminalOpen 
            ? 'border-cyan-500/50 shadow-[0_0_25px_rgba(34,211,238,0.3)] rotate-90 scale-0 opacity-0 pointer-events-none' 
            : 'border-cyan-500/20 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'
        }`}
        aria-label="Toggle developer terminal console"
        title="Open Developer Console (Press `)"
      >
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 transform transition-transform group-hover:translate-x-0.5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </button>
    </div>
  );
}
