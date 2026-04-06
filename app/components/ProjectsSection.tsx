"use client";

import React, { useState } from "react";
import Image from "next/image";

const PROJECTS_PER_PAGE = 4;

const projects = [
  {
    title: "Foodie Frenzy",
    desc: "A full-stack restaurant platform supporting user accounts, secure JWT-based login, order management, and Razorpay payment integration.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Razorpay", "Firebase"],
    github: "https://github.com/Ani0811/foodie-frenzy-5656323623",
    live: "https://foodie-frenzy-frontend-hpkf.onrender.com",
    image: "/projects/FoodieFrenzy.jpeg"
  },
  {
    title: "Rimberio Real Estate",
    desc: "A property listing platform for real estate browsing and management. Features relational database design, secure session handling, and deployments on Azure.",
    tags: ["React.js", "Node.js", "Express.js", "SQL", "Azure", "Razorpay"],
    github: "https://github.com/Ani0811/realestate-frontend-react",
    live: "https://realstate-e7bfchdfftbee4c6.centralindia-01.azurewebsites.net",
    image: "/projects/Rimberio.jpeg"
  }
];

export default function ProjectsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      // Scroll to projects section
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-16 sm:pt-24 pb-8 sm:pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-3">
          <h3 className="text-xs sm:text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase font-semibold">
            PORTFOLIO
          </h3>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Featured Projects
          </h2>
        </div>
        <a
          href="https://github.com/Ani0811"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all duration-300 font-mono text-xs sm:text-sm tracking-wider self-start md:self-auto"
        >
          <span className="group-hover:mr-1 transition-all duration-300">VIEW GITHUB ARCHIVE</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
        </a>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        {currentProjects.map((proj, i) => (
          <div
            key={i}
            className="group relative rounded-xl sm:rounded-2xl border border-white/8 bg-linear-to-br from-[#0f1420] to-[#0a0c14] overflow-hidden hover:border-cyan-500/40 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(34,211,238,0.25)] cursor-pointer"
          >
            {/* Project Thumbnail */}
            <div className="relative w-full h-64 sm:h-80 bg-linear-to-br from-[#0d1117] via-[#0a0d14] to-[#060810] overflow-hidden">
              {/* Image */}
              {proj.image && (
                <Image
                  src={proj.image}
                  alt={proj.title}
                  fill
                  className="object-contain transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={i < 2}
                />
              )}
            </div>

            {/* Project Details */}
            <div className="p-6 sm:p-8 relative z-20 bg-linear-to-b from-[#0f1420] to-[#0a0c14]">
              {/* Technology Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {proj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.7rem] sm:text-xs font-mono px-2.5 py-1 bg-white/3 text-cyan-300/90 border border-cyan-500/20 rounded-md backdrop-blur-sm hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Project Title */}
              <h4 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300 leading-tight">
                {proj.title}
              </h4>

              {/* Project Description */}
              <p className="text-slate-400/90 mb-8 leading-relaxed text-sm sm:text-base">
                {proj.desc}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-white/4 border border-white/10 rounded-lg font-medium text-white hover:bg-white/8 hover:border-cyan-500/30 transition-all duration-300 text-center backdrop-blur-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                >
                  GitHub
                </a>
                <a
                  href={proj.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg font-medium text-cyan-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all duration-300 text-center backdrop-blur-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-medium text-white hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`w-10 h-10 rounded-lg font-mono text-sm transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-cyan-500 text-black border border-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-cyan-500/30'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-lg font-medium text-white hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10"
          >
            <span>Next</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
      )}
    </section>
  );
}
