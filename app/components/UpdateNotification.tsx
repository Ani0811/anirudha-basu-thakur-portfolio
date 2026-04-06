"use client";

import React, { useState } from "react";

export default function UpdateNotification() {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      {!showNotification && (
        <button
          onClick={() => setShowNotification(true)}
          className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/20 bg-slate-900/80 backdrop-blur-md text-cyan-400 transition-all duration-300 hover:bg-cyan-500/10 hover:border-cyan-400/40 hover:text-cyan-300"
          aria-label="Check updates"
        >
          <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </button>
      )}

      {showNotification && (
        <div className="fixed bottom-6 left-6 z-40 w-80 animate-fade-in-up">
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-2xl p-5 shadow-2xl shadow-black/40">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 ring-1 ring-white/10">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-base font-semibold text-white leading-tight">
                    2026 Updates Live
                  </h4>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="shrink-0 text-white/50 transition-colors hover:text-white"
                    aria-label="Close"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mt-1 text-sm text-white/70 leading-snug">
                  Explore fresh work.
                </p>

                <a
                  href="#contact"
                  onClick={() => setShowNotification(false)}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Get in touch
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
