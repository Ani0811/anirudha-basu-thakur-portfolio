import React from "react";

interface Props {
  scrollY: number;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const navLinks = ["Home", "About", "Skills", "Projects", "Contact"];

export default function Navbar({ scrollY, isMobileMenuOpen, setIsMobileMenuOpen }: Props) {
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
          ANI.DEV
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-center gap-1 lg:gap-2 text-base lg:text-lg font-medium absolute left-1/2 -translate-x-1/2">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative inline-block text-slate-300 py-2 px-4 rounded-full glass-hover-effect group"
            >
              {item}
              <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-[55%] rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 sm:gap-8 relative z-50">
          <a
            href="/resume.pdf"
            className="hidden sm:block relative text-sm font-medium text-slate-300 hover:text-white hover:-translate-y-0.5 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all duration-300 py-1 group"
          >
            View My Resume
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
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
        className={`fixed inset-0 bg-[#0a0a0c] z-40 flex flex-col overflow-hidden transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.06)_0%,transparent_65%)] pointer-events-none" />

        {/* Nav Links — fill remaining space, vertically centred */}
        <div
          className={`flex-1 flex items-center justify-center transition-all duration-500 ${
            isMobileMenuOpen ? "opacity-100 translate-y-0 delay-100" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col items-center gap-1 w-full px-8">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative block w-full max-w-xs text-center text-xl font-bold tracking-wide text-slate-300 px-6 py-3.5 rounded-full glass-hover-effect group"
              >
                {item}
                <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-1/3 group-active:w-1/3 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </a>
            ))}
          </div>
        </div>

        {/* CTAs — pinned to the bottom of the screen */}
        <div
          className={`px-6 pb-10 pt-3 flex flex-col gap-3 transition-all duration-500 delay-150 ${
            isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-2" />

          <a
            href="/resume.pdf"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-4 text-center text-sm font-semibold rounded-2xl
              bg-white/[0.05] backdrop-blur-md
              border border-white/[0.1]
              text-slate-200
              shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]
              hover:bg-white/[0.1] hover:border-cyan-500/40
              hover:text-cyan-300
              hover:shadow-[0_0_22px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(34,211,238,0.08)]
              active:scale-[0.97] active:bg-white/[0.1]
              transition-all duration-300"
          >
            View My Resume
          </a>

          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-4 text-center text-sm font-bold rounded-2xl
              bg-cyan-500/[0.12] backdrop-blur-md
              border border-cyan-500/40
              text-cyan-300
              shadow-[0_0_22px_rgba(34,211,238,0.12),inset_0_1px_0_rgba(34,211,238,0.1)]
              hover:bg-cyan-500 hover:text-black hover:border-cyan-400
              hover:shadow-[0_0_32px_rgba(34,211,238,0.45)]
              active:scale-[0.97] active:bg-cyan-500 active:text-black
              transition-all duration-300"
          >
            Connect Now
          </a>
        </div>
      </div>
    </nav>
  );
}
