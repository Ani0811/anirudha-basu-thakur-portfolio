"use client";

import React from "react";

interface Props {
  scrollY: number;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const navLinks = ["Home", "About", "Skills", "Projects", "Contact"];

export default function Navbar({ scrollY, isMobileMenuOpen, setIsMobileMenuOpen }: Props) {
  const [activeSection, setActiveSection] = React.useState("home");

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.toLowerCase());
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        isMobileMenuOpen
          ? "bg-[#0a0a0c] border-transparent"
          : scrollY > 50
          ? "bg-[#0a0a0c]/90 backdrop-blur-xl border-white/5 shadow-lg"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between relative">
        <div className="text-base sm:text-xl font-bold tracking-tighter text-white glow-text relative z-50">
          ANIRUDHA.DEV
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-center gap-1 lg:gap-2 text-base lg:text-lg font-medium absolute left-1/2 -translate-x-1/2">
          {navLinks.map((item) => {
            const isActive = activeSection === item.toLowerCase();
            return (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`relative inline-block py-2 px-4 rounded-full transition-all duration-300 group ${
                  isActive 
                    ? 'text-cyan-300 bg-white/10 backdrop-blur-md border border-cyan-500/30' 
                    : 'text-slate-300 border border-transparent'
                }`}
              >
                {item}
                <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-300 ${
                  isActive ? 'w-[55%]' : 'w-0 group-hover:w-[55%]'
                }`} />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-4 sm:gap-8 relative z-50">
          <a
            href="/docs/Anirudha_Basu_Thakur_Resume.pdf"
            target="_blank"
            download="Anirudha_Basu_Thakur_Resume.pdf"
            className="hidden sm:flex items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-semibold rounded-full
              bg-white/5 backdrop-blur-md border border-white/10 text-slate-200
              shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]
              hover:bg-white/10 hover:border-cyan-500/40 hover:text-cyan-300
              hover:shadow-[0_0_22px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(34,211,238,0.08)]
              active:scale-[0.97] transition-all duration-300"
          >
            View My Resume
          </a>
          <a
            href="#contact"
            className="hidden sm:flex px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full hover:bg-cyan-500 hover:text-black hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300"
          >
            Connect Now
          </a>

          {/* Hamburger Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 flex flex-col gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-full h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <div
        className={`fixed inset-0 bg-[#0a0a0c] z-40 flex flex-col overflow-hidden transition-all duration-700 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Animated background gradient */}
        <div className={`absolute inset-0 transition-all duration-1000 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15)_0%,transparent_70%)] blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.1)_0%,transparent_70%)] blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Nav Links — fill remaining space, vertically centred */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 w-full px-8">
            {navLinks.map((item, index) => {
              const isActive = activeSection === item.toLowerCase();
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative block w-full max-w-xs text-center text-2xl font-bold tracking-wide px-8 py-4 rounded-xl transition-all duration-500 hover:scale-105 active:scale-95 ${
                    isMobileMenuOpen 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-8'
                  } ${
                    isActive 
                      ? 'text-cyan-300 bg-white/10 backdrop-blur-md border border-cyan-500/30' 
                      : 'text-slate-200 border border-transparent hover:bg-white/5'
                  }`}
                  style={{ 
                    transitionDelay: isMobileMenuOpen ? `${index * 80 + 150}ms` : '0ms'
                  }}
                >
                  <span className="relative z-10">{item}</span>
                  <span className={`absolute inset-0 rounded-xl bg-linear-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                  }`} />
                  <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent transition-all duration-300 shadow-[0_0_12px_rgba(34,211,238,0.8)] ${
                    isActive ? 'w-1/2' : 'w-0 hover:w-1/2'
                  }`} />
                </a>
              );
            })}
          </div>
        </div>

        {/* CTAs — pinned to the bottom of the screen */}
        <div
          className={`px-6 pb-10 pt-3 flex flex-col gap-4 transition-all duration-700 ${
            isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? '500ms' : '0ms' }}
        >
          <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent mb-2" />

          <a
            href="/docs/Anirudha_Basu_Thakur_Resume.pdf"
            download="Anirudha_Basu_Thakur_Resume.pdf"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-4 text-center text-base font-semibold rounded-2xl
              bg-white/5 backdrop-blur-md
              border border-white/10
              text-slate-200
              shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]
              hover:bg-white/10 hover:border-cyan-500/50
              hover:text-cyan-300
              hover:shadow-[0_0_25px_rgba(34,211,238,0.25),inset_0_1px_0_rgba(34,211,238,0.1)]
              active:scale-[0.97] active:bg-white/10
              transition-all duration-300"
          >
            View My Resume
          </a>

          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-4 text-center text-base font-bold rounded-2xl
              bg-linear-to-r from-cyan-500/15 to-blue-500/15 backdrop-blur-md
              border border-cyan-500/40
              text-cyan-300
              shadow-[0_0_25px_rgba(34,211,238,0.15),inset_0_1px_0_rgba(34,211,238,0.15)]
              hover:from-cyan-500 hover:to-blue-500 hover:text-black hover:border-cyan-400
              hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]
              active:scale-[0.97]
              transition-all duration-300"
          >
            Connect Now
          </a>
        </div>
      </div>
    </nav>
  );
}
