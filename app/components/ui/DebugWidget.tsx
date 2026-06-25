'use client';

import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

interface ApiLog {
  url: string;
  status: number;
  duration: number;
  timestamp: number;
}

export default function DebugWidget() {
  const { isDeveloperMode } = usePortfolio();
  const [scrollY, setScrollY] = useState(0);
  const [fps, setFps] = useState(0);
  const [domCount, setDomCount] = useState(0);
  const [memory, setMemory] = useState<string>('N/A');
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
  
  // Custom dev widget toggles
  const [wireframes, setWireframes] = useState(false);
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

  // Monitor DOM Element Count & Memory Usage
  useEffect(() => {
    if (!isDeveloperMode) return;

    const updateSystemStats = () => {
      setDomCount(document.getElementsByTagName('*').length);

      const perf = window.performance as any;
      if (perf && perf.memory) {
        const usedMB = Math.round(perf.memory.usedJSHeapSize / (1024 * 1024));
        const totalMB = Math.round(perf.memory.totalJSHeapSize / (1024 * 1024));
        setMemory(`${usedMB}MB / ${totalMB}MB`);
      }
    };

    updateSystemStats();
    const interval = setInterval(updateSystemStats, 2000);

    return () => clearInterval(interval);
  }, [isDeveloperMode]);

  // Override Fetch for API Latency Monitor
  useEffect(() => {
    if (!isDeveloperMode) return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const urlStr = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      const parsedUrl = urlStr.startsWith('http') ? new URL(urlStr).pathname : urlStr;
      
      try {
        const response = await originalFetch(...args);
        const duration = Math.round(performance.now() - startTime);
        setApiLogs(prev => [
          { url: parsedUrl, status: response.status, duration, timestamp: Date.now() },
          ...prev.slice(0, 2)
        ]);
        return response;
      } catch (error) {
        const duration = Math.round(performance.now() - startTime);
        setApiLogs(prev => [
          { url: parsedUrl, status: 500, duration, timestamp: Date.now() },
          ...prev.slice(0, 2)
        ]);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [isDeveloperMode]);

  // Toggle wireframes outline
  useEffect(() => {
    if (wireframes && isDeveloperMode) {
      document.body.classList.add('outline-elements');
    } else {
      document.body.classList.remove('outline-elements');
    }
  }, [wireframes, isDeveloperMode]);

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
      document.body.classList.remove('outline-elements');
      document.body.classList.remove('baseline-grid');
    };
  }, []);

  const handleResetStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert('Local and session storage cleared!');
  };

  if (!isDeveloperMode) return null;

  // Determine FPS color
  const fpsColor = fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400';

  return (
    <>
      {/* Dev Mode Custom Global Styles (Injected locally so they don't pollute static CSS files) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .outline-elements * {
          outline: 1px solid rgba(6, 182, 212, 0.25) !important;
        }
        .outline-elements *:hover {
          outline: 1px dashed rgba(244, 63, 94, 0.6) !important;
          background-color: rgba(6, 182, 212, 0.02) !important;
        }
        .baseline-grid {
          background-image: linear-gradient(rgba(6, 182, 212, 0.04) 1px, transparent 1px) !important;
          background-size: 100% 20px !important;
        }
      `}} />

      {/* Dev diagnostics HUD widget */}
      <div className="fixed bottom-4 left-4 z-[9999] w-72 max-w-[90vw] bg-[#060c14]/95 border border-cyan-500/30 p-4 rounded-xl font-mono text-[10px] sm:text-xs text-cyan-400 shadow-[0_10px_35px_rgba(6,182,212,0.15)] backdrop-blur-md pointer-events-auto flex flex-col gap-3 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="font-bold tracking-wider uppercase">System Diagnostics</span>
          </div>
          <span className="text-[9px] text-slate-500 uppercase">React 19 / v4</span>
        </div>

        {/* Environment and Hardware health metrics */}
        <div className="grid grid-cols-2 gap-2 text-[10px] border-b border-cyan-500/10 pb-2.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-500 uppercase text-[8px] tracking-wider">Engine Status</span>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">FPS:</span>
              <span className={`font-bold ${fpsColor}`}>{fps}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">JS Heap:</span>
              <span className="text-slate-200">{memory}</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5 border-l border-cyan-500/10 pl-2">
            <span className="text-slate-500 uppercase text-[8px] tracking-wider">Layout Stats</span>
            <div className="flex justify-between border-b border-white/5 pb-1">
              <span className="text-slate-400">DOM Nodes:</span>
              <span className="text-slate-200 font-bold">{domCount}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Viewport:</span>
              <span className="text-slate-200">{window.innerWidth}x{window.innerHeight}</span>
            </div>
          </div>
        </div>

        {/* Real-time Scrolling Tracker */}
        <div className="flex justify-between items-center text-[10px] border-b border-cyan-500/10 pb-2.5">
          <span className="text-slate-400">Scroll Coordinates:</span>
          <span className="text-slate-200 font-bold">Y: {Math.round(scrollY)}px</span>
        </div>

        {/* Network Monitor */}
        <div className="flex flex-col gap-1 border-b border-cyan-500/10 pb-2.5">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold">API Network Monitor</span>
          {apiLogs.length === 0 ? (
            <span className="text-slate-600 italic text-[9px] py-1">No requests tracked yet...</span>
          ) : (
            <div className="space-y-1 mt-1">
              {apiLogs.map((log, index) => (
                <div key={index} className="flex justify-between items-center text-[9px] gap-2">
                  <span className="text-slate-400 truncate max-w-[140px]">{log.url}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={log.status === 200 ? 'text-green-500' : 'text-red-500'}>{log.status}</span>
                    <span className="text-slate-500 font-normal">({log.duration}ms)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive HUD toggles */}
        <div className="flex flex-col gap-2">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold">Diagnostic Toggles</span>
          <div className="grid grid-cols-2 gap-2 mt-0.5">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
              <input 
                type="checkbox" 
                checked={wireframes} 
                onChange={(e) => setWireframes(e.target.checked)}
                className="w-3.5 h-3.5 bg-black/60 rounded border-cyan-500/30 text-cyan-400 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px]">Wireframes</span>
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
          
          <button
            onClick={handleResetStorage}
            className="w-full mt-1.5 py-1.5 rounded bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-black font-bold uppercase text-[9px] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            Clear Local Storage
          </button>
        </div>
      </div>
    </>
  );
}
