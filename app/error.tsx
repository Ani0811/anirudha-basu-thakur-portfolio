"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console or error reporter
    console.error("Runtime exception caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 flex items-center justify-center p-6 relative overflow-hidden font-sans select-none">
      {/* Background ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-red-950/15 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-8 p-8 sm:p-12 rounded-3xl border border-red-500/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
        {/* Glowing Header */}
        <div className="space-y-2">
          <h1 className="text-7xl sm:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-linear-to-r from-red-400 to-orange-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            500
          </h1>
          <p className="text-xs sm:text-sm font-mono text-red-400 tracking-[0.25em] uppercase font-bold">
            ERROR // SYSTEM_CRASH
          </p>
        </div>

        {/* Divider line */}
        <div className="w-24 h-0.5 bg-linear-to-r from-transparent via-red-500 to-transparent mx-auto" />

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            Critical Runtime Exception
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            The application thread encountered an unhandled instruction. A system dump has been logged.
          </p>
        </div>

        {/* Error Code Info */}
        {error.digest && (
          <div className="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-xs text-red-300 text-left max-w-sm mx-auto overflow-x-auto select-text">
            <span className="text-slate-500 font-bold block mb-1">DIGEST_ID:</span>
            {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-red-500 text-white text-sm sm:text-base font-bold rounded-xl hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            Reset Runtime
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 text-white text-sm sm:text-base font-bold rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
