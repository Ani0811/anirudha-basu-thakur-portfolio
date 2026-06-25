'use client';

import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function DebugWidget() {
  const { isDeveloperMode } = usePortfolio();
  const [scrollY, setScrollY] = useState(0);
  const [fps, setFps] = useState(0);
  
  // Real Lighthouse Metrics
  const [fcp, setFcp] = useState<number | null>(null);
  const [lcp, setLcp] = useState<number | null>(null);
  const [cls, setCls] = useState<number>(0);
  const [ttfb, setTtfb] = useState<number | null>(null);
  const [consoleErrorsCount, setConsoleErrorsCount] = useState(0);

  // Computed Audit Scores
  const [perfScore, setPerfScore] = useState(100);
  const [accessScore, setAccessScore] = useState(100);
  const [bestScore, setBestScore] = useState(100);
  const [seoScore, setSeoScore] = useState(100);

  // HUD toggles
  const [inspectMode, setInspectMode] = useState(false);
  const [grid, setGrid] = useState(false);

  // Listen for console/window errors
  useEffect(() => {
    if (!isDeveloperMode) return;
    const handleError = () => {
      setConsoleErrorsCount(prev => prev + 1);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [isDeveloperMode]);

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

  // Gather Real Web Vitals Performance Metrics via PerformanceObserver
  useEffect(() => {
    if (!isDeveloperMode) return;

    let lcpObserver: PerformanceObserver | null = null;
    let fcpObserver: PerformanceObserver | null = null;
    let clsObserver: PerformanceObserver | null = null;

    try {
      // 1. Observe Paint Events (FCP)
      fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            setFcp(entry.startTime);
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      // 2. Observe Largest Contentful Paint (LCP)
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setLcp(lastEntry.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // 3. Observe Cumulative Layout Shift (CLS)
      clsObserver = new PerformanceObserver((list) => {
        let currentCls = 0;
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            currentCls += entry.value;
          }
        }
        setCls(currentCls);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn("PerformanceObserver not fully supported.", e);
    }

    // 4. Measure Time To First Byte (TTFB)
    const [navEntry] = performance.getEntriesByType('navigation') as any[];
    if (navEntry) {
      setTtfb(navEntry.responseStart);
    } else {
      const timing = performance.timing;
      if (timing) {
        setTtfb(Math.max(0, timing.responseStart - timing.navigationStart));
      }
    }

    return () => {
      fcpObserver?.disconnect();
      lcpObserver?.disconnect();
      clsObserver?.disconnect();
    };
  }, [isDeveloperMode]);

  // Calculate Real Accessibility, SEO, and Best Practices
  useEffect(() => {
    if (!isDeveloperMode) return;

    const runAudits = () => {
      // 1. ACCESSIBILITY SCAN
      const images = Array.from(document.querySelectorAll('img'));
      const buttons = Array.from(document.querySelectorAll('button'));
      const links = Array.from(document.querySelectorAll('a'));

      let accessPassed = 0;
      let accessTotal = 0;

      images.forEach(img => {
        accessTotal++;
        if (img.alt && img.alt.trim().length > 0) accessPassed++;
      });

      buttons.forEach(btn => {
        accessTotal++;
        if (btn.innerText.trim().length > 0 || btn.getAttribute('aria-label') || btn.getAttribute('title')) {
          accessPassed++;
        }
      });

      links.forEach(a => {
        accessTotal++;
        if (a.innerText.trim().length > 0 || a.getAttribute('aria-label') || a.getAttribute('title') || a.querySelector('svg')) {
          accessPassed++;
        }
      });

      const accessibility = accessTotal > 0 ? Math.round((accessPassed / accessTotal) * 100) : 100;
      setAccessScore(accessibility);

      // 2. SEO AUDIT
      let seoPoints = 0;
      let seoChecks = 0;

      // Document title check
      seoChecks++;
      if (document.title && document.title.trim().length > 5) seoPoints += 100;

      // Meta Description check
      seoChecks++;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && metaDesc.getAttribute('content')?.trim() && (metaDesc.getAttribute('content')?.trim().length || 0) > 20) {
        seoPoints += 100;
      }

      // Single h1 tag check
      seoChecks++;
      const h1s = document.querySelectorAll('h1');
      if (h1s.length === 1) seoPoints += 100;

      // Image alts SEO check
      seoChecks++;
      const unlabelledImgs = images.filter(img => !img.alt || img.alt.trim().length === 0);
      if (unlabelledImgs.length === 0) seoPoints += 100;
      else seoPoints += Math.max(0, Math.round((1 - unlabelledImgs.length / Math.max(1, images.length)) * 100));

      const seo = Math.round(seoPoints / seoChecks);
      setSeoScore(seo);

      // 3. BEST PRACTICES AUDIT
      let bpPoints = 100;
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isSecure) bpPoints -= 30; // Deduct for non-HTTPS
      
      bpPoints = Math.max(50, bpPoints - Math.min(50, consoleErrorsCount * 10)); // Deduct 10 per runtime error
      setBestScore(bpPoints);
    };

    runAudits();
    const auditInterval = setInterval(runAudits, 3000); // Re-run audits every 3s to reflect DOM changes

    return () => clearInterval(auditInterval);
  }, [isDeveloperMode, consoleErrorsCount]);

  // Compute Performance Score based on Web Vitals
  useEffect(() => {
    if (!isDeveloperMode) return;

    // FCP: good <= 1.8s (1800ms), poor >= 3.0s (3000ms)
    const fcpVal = fcp ?? 800; // default/fallback if not painted yet
    const fcpScore = fcpVal <= 1800 ? 100 : fcpVal >= 3000 ? 0 : Math.round((1 - (fcpVal - 1800) / 1200) * 100);

    // LCP: good <= 2.5s (2500ms), poor >= 4.0s (4000ms)
    const lcpVal = lcp ?? 1200;
    const lcpScore = lcpVal <= 2500 ? 100 : lcpVal >= 4000 ? 0 : Math.round((1 - (lcpVal - 2500) / 1500) * 100);

    // CLS: good <= 0.1, poor >= 0.25
    const clsScore = cls <= 0.1 ? 100 : cls >= 0.25 ? 0 : Math.round((1 - (cls - 0.1) / 0.15) * 100);

    // TTFB: good <= 800ms, poor >= 1800ms
    const ttfbVal = ttfb ?? 100;
    const ttfbScore = ttfbVal <= 800 ? 100 : ttfbVal >= 1800 ? 0 : Math.round((1 - (ttfbVal - 800) / 1000) * 100);

    // Weighted performance score matching Lighthouse formula
    const totalPerf = Math.round((fcpScore * 0.3) + (lcpScore * 0.4) + (clsScore * 0.2) + (ttfbScore * 0.1));
    setPerfScore(Math.min(100, Math.max(10, totalPerf)));
  }, [fcp, lcp, cls, ttfb, isDeveloperMode]);

  // Toggle component inspector class
  useEffect(() => {
    if (inspectMode && isDeveloperMode) {
      document.body.classList.add('inspect-components');
    } else {
      document.body.classList.remove('inspect-components');
    }
  }, [inspectMode, isDeveloperMode]);

  // Toggle baseline alignment grid class
  useEffect(() => {
    if (grid && isDeveloperMode) {
      document.body.classList.add('baseline-grid');
    } else {
      document.body.classList.remove('baseline-grid');
    }
  }, [grid, isDeveloperMode]);

  // Cleanup classes
  useEffect(() => {
    return () => {
      document.body.classList.remove('inspect-components');
      document.body.classList.remove('baseline-grid');
    };
  }, []);

  if (!isDeveloperMode) return null;

  // Audit Color Utilities
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return 'border-emerald-500 text-emerald-400 bg-emerald-950/20';
    if (score >= 50) return 'border-yellow-500 text-yellow-400 bg-yellow-950/20';
    return 'border-red-500 text-red-400 bg-red-950/20';
  };

  const fpsColor = fps >= 55 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400';

  return (
    <>
      {/* Dev diagnostics HUD widget */}
      <div className="fixed bottom-4 left-4 z-[9999] w-76 max-w-[90vw] bg-[#060c14]/95 border border-cyan-500/30 p-4 rounded-xl font-mono text-[10px] sm:text-xs text-cyan-400 shadow-[0_10px_35px_rgba(6,182,212,0.15)] backdrop-blur-md pointer-events-auto flex flex-col gap-3.5 transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="font-bold tracking-wider uppercase">System Diagnostics</span>
          </div>
          <span className="text-[9px] text-slate-500 uppercase">React 19 / v4</span>
        </div>

        {/* Real Audit Scores */}
        <div className="flex flex-col gap-1.5 border-b border-cyan-500/10 pb-2.5">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold">Lighthouse Core Audits</span>
          <div className="grid grid-cols-4 gap-2 text-center mt-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${getScoreColorClass(perfScore)}`}>
                {perfScore}
              </div>
              <span className="text-[8px] text-slate-400 mt-1">Perf</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${getScoreColorClass(accessScore)}`}>
                {accessScore}
              </div>
              <span className="text-[8px] text-slate-400 mt-1">Access</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${getScoreColorClass(bestScore)}`}>
                {bestScore}
              </div>
              <span className="text-[8px] text-slate-400 mt-1">Best P.</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${getScoreColorClass(seoScore)}`}>
                {seoScore}
              </div>
              <span className="text-[8px] text-slate-400 mt-1">SEO</span>
            </div>
          </div>
        </div>

        {/* Real-time Web Vitals metrics */}
        <div className="flex flex-col gap-1.5 border-b border-cyan-500/10 pb-2.5">
          <span className="text-slate-500 uppercase text-[8px] tracking-wider font-bold">Real-time Web Vitals</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] mt-0.5">
            <div className="flex justify-between border-b border-white/5 py-0.5">
              <span className="text-slate-500">LCP:</span>
              <span className="text-slate-200">{lcp ? `${(lcp / 1000).toFixed(2)}s` : 'measuring...'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 py-0.5">
              <span className="text-slate-500">FCP:</span>
              <span className="text-slate-200">{fcp ? `${(fcp / 1000).toFixed(2)}s` : 'measuring...'}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">CLS:</span>
              <span className="text-slate-200">{cls.toFixed(3)}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-slate-500">TTFB:</span>
              <span className="text-slate-200">{ttfb ? `${ttfb.toFixed(0)}ms` : 'measuring...'}</span>
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
