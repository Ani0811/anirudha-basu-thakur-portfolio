"use client";

import React from "react";

const projects = [
  {
    title: "Foodie Frenzy",
    desc: "A full-stack restaurant platform supporting user accounts, secure JWT-based login, order management, and Razorpay payment integration.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Razorpay", "Firebase"],
    github: "https://github.com/Ani0811/foodie-frenzy-5656323623",
    live: "https://foodie-frenzy-frontend-hpkf.onrender.com"
  },
  {
    title: "Rimberio Real Estate",
    desc: "A property listing platform for real estate browsing and management. Features relational database design, secure session handling, and deployments on Azure.",
    tags: ["React.js", "Node.js", "Express.js", "SQL", "Azure", "Razorpay"],
    github: "https://github.com/Ani0811/realestate-frontend-react",
    live: "https://realstate-e7bfchdfftbee4c6.centralindia-01.azurewebsites.net"
  }
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-12 sm:pt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h3 className="text-sm font-mono text-cyan-400 tracking-[0.2em] mb-4">SELECTED WORK</h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            System Case Studies
          </h2>
        </div>
        <a
          href="https://github.com/Ani0811"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm hover:underline underline-offset-4"
        >
          VIEW GITHUB ARCHIVE →
        </a>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="group relative rounded-2xl border border-white/5 bg-[#111116] overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(34,211,238,0.2)] block"
          >
            {/* Project thumbnail placeholder */}
            <div className="aspect-video bg-[#0a0a0c] overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-t from-[#111116] to-transparent z-10 opacity-90" />
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10 duration-500" />
              <div className="w-full h-full bg-[linear-gradient(45deg,#0a0a0c_25%,#111116_25%,#111116_50%,#0a0a0c_50%,#0a0a0c_75%,#111116_75%,#111116_100%)] bg-size-[20px_20px] opacity-40 group-hover:scale-105 transition-transform duration-700 flex items-center justify-center">
                <span className="text-white/20 font-black text-base sm:text-2xl tracking-[0.22em] sm:tracking-[0.5em] px-3 text-center">
                  {proj.title.toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-0 left-10 w-32 h-1 bg-cyan-500/50 blur-md z-20" />
            </div>

            {/* Project details */}
            <div className="p-6 sm:p-8 relative z-20 bg-[#111116]">
              <div className="flex flex-wrap gap-2 mb-5">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2 py-1 bg-white/5 text-cyan-300 border border-cyan-500/20 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {proj.title}
              </h4>
              <p className="text-slate-400 mb-8 leading-relaxed text-sm">{proj.desc}</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-lg font-medium text-white hover:bg-white/10 hover:border-cyan-500/30 transition-all text-center shadow-sm"
                >
                  GitHub
                </a>
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg font-medium text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all text-center shadow-sm"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
