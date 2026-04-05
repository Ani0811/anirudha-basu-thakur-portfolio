"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0c] py-8 relative z-10 pt-10 sm:pt-12 mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
        <div className="text-xl font-black text-white glow-text opacity-90">ANIRUDHA.DEV</div>
        <div className="text-sm font-mono text-slate-500 flex flex-wrap justify-center gap-6">
          <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
          <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
          <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>
        <div className="text-xs text-slate-600 font-mono tracking-widest">
          © {new Date().getFullYear()} INITIALIZED.
        </div>
      </div>
    </footer>
  );
}
