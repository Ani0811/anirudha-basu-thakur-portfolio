'use client';

import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function DebugWidget() {
  const { isDeveloperMode } = usePortfolio();
  const [scrollY, setScrollY] = useState(0);
  const [fps, setFps] = useState(0);
  
  // HUD toggles
  const [inspectMode, setInspectMode] = useState(false);
  const [grid, setGrid] = useState(false);

  // Monitor Scroll and FPS
  useEffect(() => {
    if (!isDeveloperMode) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const updateMetrics = () => {
      setScrollY(window.scrollY);
      frameCount++;
      
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrameId = requestAnimationFrame(updateMetrics);
    };

    animationFrameId = requestAnimationFrame(updateMetrics);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDeveloperMode]);

  // Toggle component inspector
  useEffect(() => {
    if (inspectMode && isDeveloperMode) {
      document.body.classList.add('inspect-components');
    } else {
      document.body.classList.remove('inspect-components');
    }
  }, [inspectMode, isDeveloperMode]);

  // Toggle baseline alignment grid
  useEffect(() => {
    if (grid && isDeveloperMode) {
      document.body.classList.add('baseline-grid');
    } else {
      document.body.classList.remove('baseline-grid');
    }
  }, [grid, isDeveloperMode]);

  // Cleanup body class lists when widget is destroyed or Dev Mode disabled
  useEffect(() => {
    return () => {
      document.body.classList.remove('inspect-components');
      document.body.classList.remove('baseline-grid');
    };
  }, []);

  if (!isDeveloperMode) return null;

  // Determine FPS color
  const fpsColor = fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400';

  return (
    <>
      {/* Dev Mode Custom Global Styles (Injected locally so they don't pollute static CSS files) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .inspect-components #home,
        .inspect-components #about,
        .inspect-components #skills,
        .inspect-components #projects,
        .inspect-components #sandbox,
        .inspect-components #contact {
          outline: 1px solid rgba(6, 182, 212, 0.4) !important;
          outline-offset: -2px;
          position: relative !important;
        }
        
        .inspect-components #home::before { content: "<HeroSection />"; }
        .inspect-components #about::before { content: "<AboutSection />"; }
        .inspect-components #skills::before { content: "<SkillsSection />"; }
        .inspect-components #projects::before { content: "<ProjectsSection />"; }
        .inspect-components #sandbox::before { content: "<SandboxSection />"; }
        .inspect-components #contact::before { content: "<ContactSection />"; }
        
        .inspect-components #home::before,
        .inspect-components #about::before,
        .inspect-components #skills::before,
        .inspect-components #projects::before,
        .inspect-components #sandbox::before,
        .inspect-components #contact::before {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #06b6d4;
          color: #000;
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
          padding: 3px 8px;
          border-radius: 4px;
          z-index: 50;
          pointer-events: none;
          letter-spacing: 0.05em;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        
        .baseline-grid {
          background-image: linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px) !important;
          background-size: 100% 20px !important;
        }
      `}} />

      {/* Dev diagnostics HUD widget */}
      <div className="fixed bottom-4 left-4 z-[9999] w-72 max-w-[90vw] bg-[#060c14]/95 border border-cyan-500/30 p-4 rounded-xl font-mono text-[10px] sm:text-xs text-cyan-400 shadow-[0_10px_35px_rgba(6,182,212,0.15)] backdrop-blur-md pointer-events-auto flex flex-col gap-3.5 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="font-bold tracking-wider uppercase">System Diagnostics</span>
          </div>
          <span className="text-[9px] text-slate-500 uppercase">React 19 / v4</span>
        </div>

        {/* Tech Stack Specs */}
        <div className="flex flex-col gap-1 border-b border-cyan-500/10 pb-2">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold">Tech Stack Specs</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[9px] text-slate-200">Next.js 16</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[9px] text-slate-200">React 19</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[9px] text-slate-200">Tailwind v4</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[9px] text-slate-200">TypeScript</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[9px] text-slate-200">Gemini 2.5 API</span>
          </div>
        </div>

        {/* Portfolio Audit Scores */}
        <div className="flex flex-col gap-1.5 border-b border-cyan-500/10 pb-2.5">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold">Lighthouse Core Audits</span>
          <div className="grid grid-cols-4 gap-2 text-center mt-1">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-400 font-bold bg-emerald-950/20">
                99
              </div>
              <span className="text-[8px] text-slate-400 mt-1">Perf</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-400 font-bold bg-emerald-950/20">
                100
              </div>
              <span className="text-[8px] text-slate-400 mt-1">Access</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-400 font-bold bg-emerald-950/20">
                100
              </div>
              <span className="text-[8px] text-slate-400 mt-1">Best P.</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-400 font-bold bg-emerald-950/20">
                100
              </div>
              <span className="text-[8px] text-slate-400 mt-1">SEO</span>
            </div>
          </div>
        </div>

        {/* Hardware / Scrolling Status */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex justify-between items-center border-r border-cyan-500/10 pr-2">
            <span className="text-slate-400">FPS:</span>
            <span className={`font-bold ${fpsColor}`}>{fps}</span>
          </div>
          <div className="flex justify-between items-center pl-2">
            <span className="text-slate-400">Scroll Y:</span>
            <span className="text-slate-200 font-bold">{Math.round(scrollY)}px</span>
          </div>
        </div>

        {/* Interactive HUD toggles */}
        <div className="flex flex-col gap-2 border-t border-cyan-500/10 pt-2.5">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold">Diagnostics Controls</span>
          <div className="grid grid-cols-2 gap-2 mt-0.5">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
              <input 
                type="checkbox" 
                checked={inspectMode} 
                onChange={(e) => setInspectMode(e.target.checked)}
                className="w-3.5 h-3.5 bg-black/60 rounded border-cyan-500/30 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px]">Inspect Comps</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
              <input 
                type="checkbox" 
                checked={grid} 
                onChange={(e) => setGrid(e.target.checked)}
                className="w-3.5 h-3.5 bg-black/60 rounded border-cyan-500/30 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px]">Grid Overlay</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
