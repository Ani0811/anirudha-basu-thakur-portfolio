"use client";

import React, { useState } from "react";

export default function UpdateNotification() {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowNotification((value) => !value)}
        className="fixed bottom-6 left-6 z-40 flex h-7 w-7 items-center justify-center rounded-full bg-transparent text-cyan-400 transition-all duration-300 hover:scale-110 hover:text-cyan-300"
        aria-label="Check updates"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      </button>

      {showNotification && (
        <div className="fixed bottom-20 left-8 z-40 w-[320px] animate-fade-in-up">
          <div className="rounded-2xl border border-cyan-500/20 bg-[#0d1829]/95 p-4 shadow-[0_0_30px_rgba(34,211,238,0.12)] backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-500/25 bg-cyan-500/10 text-cyan-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">
                    Portfolio Ready for 2026 Opportunities
                  </h3>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="text-slate-500 transition-colors hover:text-cyan-300"
                    aria-label="Close updates"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  My 2026-ready portfolio is now live, showcasing cutting-edge work designed for tomorrow.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
