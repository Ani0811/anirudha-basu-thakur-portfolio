'use client';

import { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useTerminalCommands } from '../../hooks/useTerminalCommands';

export default function TerminalOverlay() {
  const { isTerminalOpen, setTerminalOpen } = usePortfolio();
  const { history, executeCommand } = useTerminalCommands();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isTerminalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isTerminalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput("");
  };

  if (!isTerminalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-fade-in bg-black/60 backdrop-blur-sm">
      <div 
        className="absolute inset-0" 
        onClick={() => setTerminalOpen(false)}
      />
      
      <div className="relative w-full max-w-4xl h-[70vh] max-h-[800px] flex flex-col bg-[#050b14]/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_80px_rgba(34,211,238,0.2)] overflow-hidden animate-scale-in">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-black/40">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setTerminalOpen(false)}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-slate-400 font-mono text-xs select-none">
            anirudha@portfolio:~
          </div>
          <div className="w-14" /> {/* Spacer for balance */}
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-sm sm:text-base space-y-1"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, i) => (
            <div 
              key={i} 
              className={`whitespace-pre-wrap break-words ${
                line.startsWith('anirudha@portfolio:~$') 
                  ? 'text-cyan-400' 
                  : line.startsWith('Error:') 
                    ? 'text-red-400'
                    : 'text-slate-300'
              }`}
            >
              {line}
            </div>
          ))}
          
          <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
            <span className="text-cyan-400 shrink-0">anirudha@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-100 caret-cyan-400"
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
