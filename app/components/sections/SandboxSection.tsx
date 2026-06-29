'use client';

import { useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import SystemSandbox from '../features/SystemSandbox';
import RoastMyCode from '../features/RoastMyCode';

export default function SandboxSection() {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [activeTab, setActiveTab] = useState<'simulator' | 'roast'>('simulator');

  return (
    <section id="sandbox" ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-8 sm:pt-10">
      <div className="relative overflow-hidden bg-linear-to-br from-[#0f1420]/80 to-[#0a0c14]/80 border border-cyan-500/20 rounded-3xl p-6 sm:p-10 md:p-16 backdrop-blur-xl shadow-[0_0_80px_rgba(34,211,238,0.1)]">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Section Header */}
        <div className="mb-10 text-center space-y-4 relative z-10">
          <div className="inline-flex flex-col items-center">
            <h3 className={`text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase transition-all ${isVisible ? 'animate-h-reveal' : 'opacity-0'}`}>
              {activeTab === 'simulator' ? 'ARCHITECTURE' : 'CRITIC PLAYGROUND'}
            </h3>
            <div className={`h-px w-full mt-2 bg-linear-to-r from-transparent via-cyan-500 to-transparent transition-all duration-1000 ${isVisible ? 'animate-u-grow' : 'scale-x-0 opacity-0'}`} />
          </div>
          
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {activeTab === 'simulator' ? (
              <>Interactive System <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400 animate-gradient bg-size-[200%_auto]">Sandbox</span></>
            ) : (
              <>AI Code Roast <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-red-500 animate-gradient bg-size-[200%_auto]">Station</span></>
            )}
          </h2>
          
          <p className={`max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {activeTab === 'simulator' 
              ? "Adjust the upgrade items to stabilize the network. Watch how caching and load balancing filter malicious spam traffic under heavy DDoS load."
              : "Paste any raw JS, TS, or Python code below. Select an AI personality and click Roast to receive a funny, critical, yet educational code review."
            }
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="inline-flex bg-black/40 border border-white/5 rounded-full p-1 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-linear-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              🛡️ DDoS Defender
            </button>
            <button
              onClick={() => setActiveTab('roast')}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === 'roast'
                  ? 'bg-linear-to-r from-orange-500 to-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              🔥 AI Roast Station
            </button>
          </div>
        </div>

        {/* Dynamic content rendering */}
        <div className={`relative z-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {activeTab === 'simulator' ? <SystemSandbox /> : <RoastMyCode />}
        </div>
      </div>
    </section>
  );
}
