"use client";

import React, { useState } from "react";

export default function UpdateNotification() {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowNotification((value) => !value)}
        className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/15 bg-transparent p-0 text-cyan-400/70 backdrop-blur-sm transition-colors duration-300 hover:bg-cyan-500/10 hover:text-cyan-300"
        aria-label="Check updates"
      >
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      </button>

      {showNotification && (
        <div className="fixed bottom-16 left-6 z-40 w-72 animate-fade-in-up">
          <div className="rounded-xl border border-cyan-500/20 bg-[#0a0f1a]/95 p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white leading-tight">
                    Portfolio Ready for 2026
                  </h4>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="shrink-0 text-slate-500 transition-colors hover:text-slate-300"
                    aria-label="Close"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  Check out my latest work and let&apos;s build the future together.
                </p>

                <a
                  href="#contact"
                  onClick={() => setShowNotification(false)}
                  className="mt-3 inline-flex items-center text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Get in touch
                  <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
