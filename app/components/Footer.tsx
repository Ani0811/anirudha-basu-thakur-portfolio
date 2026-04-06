"use client";

import React, { useState } from "react";

const socialLinks = [
  { 
    name: "GitHub", 
    url: "https://github.com/Ani0811",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  },
  { 
    name: "LinkedIn", 
    url: "https://linkedin.com/in/anirudha-basu-thakur-686aa8253",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  { 
    name: "Instagram", 
    url: "https://www.instagram.com/this_is_ringo_here/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  { 
    name: "Email", 
    url: "mailto:anirudha.basuthakur@gmail.com",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
];

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const updates = [
  { date: "Apr 6, 2026", title: "Portfolio Ready for 2026 Opportunities", description: "My 2026-ready portfolio is now live, showcasing cutting-edge work designed for tomorrow, and it's connected to build the future, together." },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 sm:mt-24">
      {/* Top gradient line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="bg-[#030508] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute bottom-0 left-1/4 w-125 h-75 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-100 h-62.5 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
            {/* Main content - two column split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              
              {/* Left side - Brand */}
              <div className="space-y-5">
                <div className="animate-fade-in-up">
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    <span className="text-white inline-block animate-fade-in-up animate-text-glow" style={{ animationDelay: '0.1s' }}>ANIRUDHA</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400 inline-block animate-fade-in-up animate-gradient-shift" style={{ animationDelay: '0.2s' }}>BASU THAKUR</span>
                  </h2>
                  <div className="mt-4 w-16 h-1 bg-linear-to-r from-cyan-500 to-purple-500 rounded-full animate-expand-width animate-glow-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
                
                <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-md animate-fade-in-up animate-text-shimmer" style={{ animationDelay: '0.4s' }}>
                  Software Engineer & AI Engineer crafting intelligent solutions with clean code and innovative technology.
                </p>
                
                {/* Social icons */}
                <div className="flex items-center gap-3 pt-2">
                  {socialLinks.map((social, index) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target={social.url.startsWith("mailto") ? undefined : "_blank"}
                      rel={social.url.startsWith("mailto") ? undefined : "noopener noreferrer"}
                      className="group w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-all duration-300 animate-scale-in hover:rotate-12 hover:scale-110"
                      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                      aria-label={social.name}
                    >
                      <span className="text-slate-400 group-hover:text-cyan-400 group-hover:scale-125 transition-all duration-300">
                        {social.icon}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Right side - Navigation & Contact */}
              <div className="grid grid-cols-2 gap-8">
                {/* Navigate */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase mb-5 animate-pulse-subtle">
                    Navigate
                  </h3>
                  <ul className="space-y-4">
                    {navLinks.map((link, index) => (
                      <li key={link.name} className="animate-slide-in-right" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                        <a
                          href={link.href}
                          className="group flex items-center gap-2 text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2"
                        >
                          <span className="text-cyan-500/60 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all duration-300 text-base">→</span>
                          <span className="text-base font-medium">{link.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Connect */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <h3 className="text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase mb-5 animate-pulse-subtle">
                    Connect
                  </h3>
                  <div className="space-y-4">
                    <a 
                      href="mailto:anirudha.basuthakur@gmail.com"
                      className="block text-slate-300 hover:text-white text-sm transition-all duration-300 break-all leading-relaxed hover:translate-x-2 animate-fade-in-up"
                      style={{ animationDelay: '0.6s' }}
                    >
                      anirudha.basuthakur<br className="sm:hidden" />@gmail.com
                    </a>
                    <a 
                      href="tel:+919875417275"
                      className="block text-slate-300 hover:text-white text-sm transition-all duration-300 hover:translate-x-2 animate-fade-in-up"
                      style={{ animationDelay: '0.7s' }}
                    >
                      +91-9875417275
                    </a>
                    <div className="flex items-center gap-2 pt-1 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                      {/* Location pin icon */}
                      <svg className="w-5 h-5 text-cyan-400 animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400 font-bold text-sm tracking-wide">
                        KOLKATA, INDIA
                      </span>
                      {/* Indian flag */}
                      <svg className="w-6 h-5 animate-wave" viewBox="0 0 225 150" xmlns="http://www.w3.org/2000/svg">
                        <rect width="225" height="150" fill="#f93"/>
                        <rect width="225" height="50" y="50" fill="#fff"/>
                        <rect width="225" height="50" y="100" fill="#128807"/>
                        <circle cx="112.5" cy="75" r="20" fill="none" stroke="#000080" strokeWidth="2"/>
                        <g fill="#000080">
                          {[...Array(24)].map((_, i) => (
                            <line key={i} x1="112.5" y1="75" x2={112.5 + 20 * Math.cos(i * Math.PI / 12)} y2={75 + 20 * Math.sin(i * Math.PI / 12)} stroke="#000080" strokeWidth="0.5" />
                          ))}
                          <circle cx="112.5" cy="75" r="2" fill="#000080"/>
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom bar */}
          <div className="border-t border-white/5 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="max-w-6xl mx-auto px-6 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <p className="text-slate-400 font-mono animate-fade-in-up" style={{ animationDelay: '1s' }}>
                  Acknowledgement: Built with ❤️. Thanks to everyone who supported this project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
