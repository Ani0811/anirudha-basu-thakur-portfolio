"use client";

import React, { useState } from "react";
import Image from "next/image";

const PROJECTS_PER_PAGE = 4;

const liveProjects = [
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

const legacyProjects = [
  {
    title: "Console BMS (Bank Management System)",
    desc: "A console-based banking management system written in Python. Supports account creation, balance queries, deposits/withdrawals and batch processing through CSV files for automated transactions.",
    tags: ["Python", "CSV", "CLI", "File I/O"],
    github: "",
    live: "",
    image: ""
  },
  {
    title: "User Management System (PHP)",
    desc: "A classic web-based user management panel built in PHP. Implements user registration, login (sessions), role-based access, and CRUD operations for user profiles. Designed for LAMP/XAMPP deployments.",
    tags: ["PHP", "MySQL", "Sessions", "CRUD"],
    github: "",
    live: "",
    image: ""
  }
];

export default function ProjectsSection() {
  const [roastingProject, setRoastingProject] = useState<string | null>(null);
  const [roastResults, setRoastResults] = useState<Record<string, string>>({});
  const [requestingProject, setRequestingProject] = useState<string | null>(null);

  const handleRoastCode = async (project: any) => {
    if (!project.github) return;
    
    setRoastingProject(project.title);
    setRoastResults(prev => ({ ...prev, [project.title]: '' }));

    try {
      // Fetch code from GitHub repo
      const repoUrl = project.github.replace('https://github.com/', '');
      console.log('Roasting project:', project.title, 'Repo URL:', repoUrl);
      
      const response = await fetch(`/api/ai/roast-github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl, projectName: project.title }),
      });

      const data = await response.json();
      console.log('Roast response:', data);

      if (response.ok) {
        setRoastResults(prev => ({ ...prev, [project.title]: data.roast }));
      } else {
        setRoastResults(prev => ({ ...prev, [project.title]: `Error: ${data.error || 'Unknown error'}` }));
      }
    } catch (error) {
      console.error('Roast error:', error);
      setRoastResults(prev => ({ ...prev, [project.title]: 'Failed to roast code. Please try again.' }));
    } finally {
      setRoastingProject(null);
    }
  };

  const handleRequestCode = async (project: any) => {
    setRequestingProject(project.title);

    try {
      // Simulate network request delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      const PRE_DEFINED_MESSAGES = [
        "Hi Anirudha! I loved exploring your PORTFOLIO_NAME project and would really appreciate learning from your approach. Could you please share the source code with me?",
        "Hey there! I was really impressed by what you built with PORTFOLIO_NAME. Would it be possible to get access to the repository to see how you structured the code?",
        "Hello Anirudha, your work on PORTFOLIO_NAME is fantastic! I am trying to build something similar and would love to study your source code if you're open to sharing it.",
        "Hi! I came across your PORTFOLIO_NAME project and was blown away. Could you kindly share the code so I can understand your TECH_STACK implementation better?",
        "Hey Anirudha, amazing work on PORTFOLIO_NAME! I'm very interested in learning from your coding style. Would you mind sharing the source codebase with me?"
      ];

      const randomIndex = Math.floor(Math.random() * PRE_DEFINED_MESSAGES.length);
      const rawMessage = PRE_DEFINED_MESSAGES[randomIndex];
      
      const techStackStr = project.tags?.join(", ") || "tech";
      const message = rawMessage
        .replace(/PORTFOLIO_NAME/g, project.title || "project")
        .replace(/TECH_STACK/g, techStackStr);

      // Auto-fill contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const messageTextarea = contactSection.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
        if (messageTextarea) {
          // Trigger React's onChange event to update state
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(messageTextarea, message);
          }
          const event = new Event('input', { bubbles: true });
          messageTextarea.dispatchEvent(event);
          messageTextarea.focus();
          messageTextarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    } catch (error) {
      console.error('Failed to generate message:', error);
    } finally {
      setRequestingProject(null);
    }
  };

  const renderProjectCard = (proj: any, i: number) => {
    const hasRoast = roastResults[proj.title];
    const isRoasting = roastingProject === proj.title;
    const isRequesting = requestingProject === proj.title;

    return (
      <div
        key={i}
        className="group relative rounded-xl sm:rounded-2xl border border-white/8 bg-linear-to-br from-[#0f1420] to-[#0a0c14] overflow-hidden hover:border-cyan-500/40 transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_25px_50px_-12px_rgba(34,211,238,0.25)]"
      >
        {/* Project Thumbnail */}
        <div className="relative w-full h-64 sm:h-80 bg-linear-to-br from-[#0d1117] via-[#0a0d14] to-[#060810] overflow-hidden flex items-center justify-center">
          {proj.image ? (
            <Image
              src={proj.image}
              alt={proj.title}
              fill
              className="object-contain transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i < 2}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full opacity-50 group-hover:opacity-100 transition-opacity duration-500">
              <svg className="w-12 h-12 mb-4 text-cyan-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span className="text-sm font-mono text-cyan-400/80 tracking-widest uppercase">Legacy Application</span>
            </div>
          )}
        </div>

        {/* Project Details */}
        <div className="p-6 sm:p-8 relative z-20 bg-linear-to-b from-[#0f1420] to-[#0a0c14]">
          {/* Technology Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {proj.tags.map((tag: string) => (
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

          {/* Roast Result */}
          {hasRoast && (
            <div className="relative mb-6 p-4 bg-linear-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
              <button
                onClick={() => setRoastResults(prev => ({ ...prev, [proj.title]: '' }))}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/40 flex items-center justify-center text-orange-300 hover:text-white transition-all duration-200 text-xs"
                aria-label="Close roast"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🔥</span>
                <h5 className="font-bold text-orange-400">The Verdict</h5>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pr-6">{hasRoast}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            {(!proj.github && !proj.live) ? (
              <button
                onClick={() => handleRequestCode(proj)}
                disabled={isRequesting}
                className="flex-1 py-3 px-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg font-medium text-cyan-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all duration-300 text-center backdrop-blur-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRequesting ? 'Generating...' : 'Request Code'}
              </button>
            ) : (
              <>
                {proj.github && (
                  <>
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 bg-white/4 border border-white/10 rounded-lg font-medium text-white hover:bg-white/8 hover:border-cyan-500/30 transition-all duration-300 text-center backdrop-blur-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                    >
                      GitHub
                    </a>
                    <button
                      onClick={() => handleRoastCode(proj)}
                      disabled={isRoasting}
                      className="flex-1 py-3 px-4 bg-linear-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg font-medium text-orange-300 hover:from-orange-500 hover:to-red-500 hover:text-white transition-all duration-300 text-center backdrop-blur-sm hover:shadow-[0_0_30px_rgba(234,88,12,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRoasting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Roasting...
                        </span>
                      ) : (
                        <>🔥 Roast My Code</>
                      )}
                    </button>
                  </>
                )}
                {proj.live && (
                  <a
                    href={proj.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg font-medium text-cyan-300 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all duration-300 text-center backdrop-blur-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                  >
                    Live Demo
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
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

      {/* Live Projects */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          Live Projects
        </h3>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {liveProjects.map(renderProjectCard)}
        </div>
      </div>

      {/* Legacy Projects */}
      <div className="mt-20">
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-3 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
          Older / Legacy Projects
        </h3>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {legacyProjects.map(renderProjectCard)}
        </div>
      </div>
    </section>
  );
}
