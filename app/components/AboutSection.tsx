"use client";

const stats = [
  { label: "Projects Built", value: "38+", color: "from-cyan-500/10" },
  { label: "Technologies Used", value: "24+", color: "from-blue-500/10" },
  { label: "Years Learning", value: "5+", color: "from-indigo-500/10" },
  { label: "Commits", value: "2K+", color: "from-purple-500/10" },
];

import React from "react";

export default function AboutSection() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 w-full fade-in-section">
      <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">
        {/* Left column – bio */}
        <div>
          <div className="w-12 h-1 bg-linear-to-r from-cyan-500 to-blue-500 mb-8 rounded-full" />
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            Developer focused on building <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
              interactive modern web experiences.
            </span>
          </h3>
          <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
            Entry-level Software Engineer with experience building scalable full-stack applications using React.js, Node.js, Express, and MongoDB. Skilled in REST API development, authentication systems, and database design. Experience integrating payment gateways and deploying applications to cloud platforms. Familiar with machine learning using Python and PyTorch and interested in building intelligent, scalable software systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href="/docs/Anirudha_Basu_Thakur_Resume.pdf" download="Anirudha_Basu_Thakur_Resume.pdf" className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-cyan-500/50 transition-all text-white font-medium shadow-sm text-center">
              Download Resume
            </a>
            <a href="https://github.com/Ani0811" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-cyan-500/50 transition-all text-white font-medium shadow-sm text-center">
              View GitHub
            </a>
          </div>
        </div>

        {/* Right column – stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`p-6 sm:p-8 rounded-xl border border-white/5 bg-linear-to-br ${stat.color} to-transparent backdrop-blur-md hover:border-cyan-500/30 transition-all hover:-translate-y-1 group shadow-[inset_0_1px_rgba(255,255,255,0.1)]`}
            >
              <div className="text-3xl sm:text-4xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors glow-text">
                {stat.value}
              </div>
              <div className="text-sm font-mono text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
