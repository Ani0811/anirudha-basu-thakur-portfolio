'use client';

import React, { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface GithubEvent {
  id: string;
  type: string;
  repo: string;
  title: string;
  detail: string;
  timestamp: string;
  url: string;
}

export default function CurrentWorkSection() {
  const [events, setEvents] = useState<GithubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch('/api/github/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'Ani0811' }),
        });

        if (!response.ok) throw new Error('Failed to fetch activity');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Could not load recent activity');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <section 
      id="activity" 
      ref={sectionRef} 
      className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 relative overflow-hidden"
    >
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-3">
          <div className="inline-flex flex-col">
            <h3 className={`text-xs sm:text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase font-semibold transition-all ${isVisible ? 'animate-h-reveal' : 'opacity-0'}`}>
              LIVE STREAM
            </h3>
            <div className={`h-px w-full mt-2 bg-linear-to-r from-transparent via-cyan-500 to-transparent transition-all duration-1000 ${isVisible ? 'animate-u-grow' : 'scale-x-0 opacity-0'}`} />
          </div>
          <h2 className={`text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Currently Working On
          </h2>
          <p className={`text-slate-400 max-w-2xl transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            A real-time snapshot of my latest GitHub activity, commits, and project updates.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Timeline */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {loading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center backdrop-blur-sm">
                {error}
              </div>
            ) : events.length === 0 ? (
              <div className="p-12 bg-white/5 border border-white/10 rounded-2xl text-slate-400 text-center backdrop-blur-sm italic">
                No recent activity found. Code is cooking... 🍳
              </div>
            ) : (
              <div 
                className={`flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar transition-all duration-700 delay-400 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}
              >
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(34, 211, 238, 0.3);
                    border-radius: 10px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(34, 211, 238, 0.5);
                  }
                `}</style>
                {events.map((event, i) => (
                  <div 
                    key={event.id}
                    className="group relative p-5 sm:p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-500 hover:-translate-x-1"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex-shrink-0 w-10 h-10 border border-cyan-500/20 rounded-xl bg-cyan-500/5 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all duration-500">
                          {event.type === 'PushEvent' ? '🚀' : event.type === 'CreateEvent' ? '✨' : '📝'}
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                            {event.title}
                          </h4>
                          <p className="text-sm font-mono text-cyan-500/70 mb-1">
                            {event.repo}
                          </p>
                          <p className="text-slate-400 text-sm line-clamp-2">
                            {event.detail}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-widest">
                          {new Date(event.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <a 
                          href={event.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-[11px] font-bold text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300"
                        >
                          VIEW COMMIT
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side teaser */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div 
              className={`p-8 bg-linear-to-br from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-500/20 rounded-3xl backdrop-blur-xl relative overflow-hidden transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-white/20">
                  🔥
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                  Always <span className="text-cyan-400">Building</span>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  I believe the best way to learn is by doing. I'm constantly pushing code to explore new patterns, optimize performance, and solve complex problems.
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-xs font-mono text-cyan-500/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 
                    COMMITTING DAILY
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-cyan-500/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> 
                    OPEN SOURCE FOCUS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
