'use client';

import { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export default function DebugWidget() {
  const { isDeveloperMode } = usePortfolio();
  const [scrollY, setScrollY] = useState(0);
  const [fps, setFps] = useState(0);

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

  if (!isDeveloperMode) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 backdrop-blur-md border border-cyan-500/50 p-4 rounded-lg font-mono text-xs text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] pointer-events-none">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-cyan-500/30">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-bold tracking-wider">DEV MODE ACTIVE</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">FPS</span>
          <span>{fps}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Scroll Y</span>
          <span>{Math.round(scrollY)}px</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Viewport</span>
          <span>{typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '...'}</span>
        </div>
      </div>
    </div>
  );
}
