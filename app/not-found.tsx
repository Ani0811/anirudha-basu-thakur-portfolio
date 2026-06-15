"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 flex items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      {/* Background ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-cyan-900/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8 p-8 sm:p-12 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
        {/* Glowing Glitch-like header */}
        <div className="space-y-2">
          <h1 className="text-7xl sm:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            404
          </h1>
          <p className="text-xs sm:text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase font-bold">
            ERROR // PAGE_NOT_FOUND
          </p>
        </div>

        {/* Divider line */}
        <div className="w-24 h-0.5 bg-linear-to-r from-transparent via-cyan-500 to-transparent mx-auto" />

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            Lost in Cyberspace?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            The resource you are attempting to compile does not exist or has been relocated to another node.
          </p>
        </div>

        {/* Action Button */}
        <div>
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white text-sm sm:text-base font-bold rounded-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Return to Systems</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
