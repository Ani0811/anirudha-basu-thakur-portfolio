"use client";

import React, { useState, useEffect } from "react";
import { usePortfolio } from "../../context/PortfolioContext";

interface Props {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const navLinks = ["Home", "About", "Skills", "Projects", "Contact"];

export default function Navbar({ isMobileMenuOpen, setIsMobileMenuOpen }: Props) {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { setTerminalOpen } = usePortfolio();

  const searchItems = [
    // Sections
    { name: "Home Section", type: "Section", targetId: "home" },
    { name: "About Section", type: "Section", targetId: "about" },
    { name: "Skills Section", type: "Section", targetId: "skills" },
    { name: "Projects Section", type: "Section", targetId: "projects" },
    { name: "Contact Section", type: "Section", targetId: "contact" },
    { name: "Feedback (Rate Portfolio)", type: "Section", targetId: "rate-portfolio" },
    // Projects
    { name: "Foodie Frenzy Project", type: "Project", targetId: "project-foodie-frenzy" },
    { name: "Rimberio Real Estate Project", type: "Project", targetId: "project-rimberio-real-estate" },
    { name: "Console BMS Project", type: "Project", targetId: "project-console-bms-bank-management-system" },
    { name: "User Management System Project", type: "Project", targetId: "project-user-management-system-php" },
    // Specializations
    { name: "Full-Stack Development Specialist", type: "Skill", targetId: "skills" },
    { name: "Backend Architecture Specialist", type: "Skill", targetId: "skills" },
    { name: "UI/UX Design Specialist", type: "Skill", targetId: "skills" },
    { name: "Payment Integration Specialist", type: "Skill", targetId: "skills" },
    { name: "Middleware Development Specialist", type: "Skill", targetId: "skills" },
    { name: "AI Development Specialist", type: "Skill", targetId: "skills" },
    // Links / Actions
    { name: "Download Resume PDF", type: "Action", action: () => {
      const link = document.createElement('a');
      link.href = "/docs/Anirudha_Basu_Thakur_Resume.pdf";
      link.download = "Anirudha_Basu_Thakur_Resume.pdf";
      link.click();
    }},
    { name: "GitHub Profile Link", type: "Link", url: "https://github.com/Ani0811" },
    { name: "LinkedIn Profile Link", type: "Link", url: "https://linkedin.com/in/anirudha-basu-thakur-686aa8253" },
    { name: "Roast My Code Tool", type: "Action", action: () => {
      const el = document.getElementById("projects");
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }},
    { name: "Developer CLI Terminal (Hacker Console)", type: "Action", action: () => {
      setTerminalOpen(true);
    }}
  ];

  const filteredItems = searchItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  // Listen for Ctrl+K and arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        setSearchQuery("");
        setSelectedIndex(0);
      }
      
      if (!isSearchOpen) return;
      
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          handleItemSelect(filteredItems[selectedIndex]);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, filteredItems, selectedIndex]);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (targetId === "home") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleItemSelect = (item: any) => {
    setIsSearchOpen(false);
    
    if (item.action) {
      item.action();
      return;
    }
    
    if (item.url) {
      window.open(item.url, "_blank");
      return;
    }
    
    if (item.targetId) {
      const el = document.getElementById(item.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add dynamic ring pulse highlight
        el.classList.add("ring-4", "ring-cyan-400/80", "shadow-[0_0_40px_rgba(34,211,238,0.6)]");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-cyan-400/80", "shadow-[0_0_40px_rgba(34,211,238,0.6)]");
        }, 2200);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        isMobileMenuOpen
          ? "bg-[#0a0a0c] border-transparent"
          : isScrolled
          ? "bg-[#0a0a0c]/90 backdrop-blur-xl border-white/5 shadow-lg"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4 relative">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-base sm:text-lg lg:text-xl font-black tracking-tighter bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient bg-size-[200%_auto] hover:scale-105 active:scale-95 transition-all duration-300 relative z-50 cursor-pointer drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] shrink-0"
        >
          Anirudha Basu Thakur
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <div className="flex items-center gap-1 xl:gap-2 text-sm xl:text-base font-medium">
            {navLinks.map((item) => {
              const isActive = activeSection === item.toLowerCase();
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => handleNavLinkClick(e, item.toLowerCase())}
                  className={`relative inline-block py-2 px-3 xl:px-4 rounded-full transition-all duration-300 group ${
                    isActive 
                      ? 'text-cyan-300 bg-white/10 backdrop-blur-md border border-cyan-500/30' 
                      : 'text-slate-300 border border-transparent hover:text-white'
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
        </div>

        <div className="flex items-center gap-2 xl:gap-4 shrink-0 relative z-50">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer sm:w-auto sm:px-4 sm:py-2 sm:gap-2 sm:rounded-full"
            aria-label="Open search engine"
          >
            <span>🔍</span>
            <span className="hidden sm:inline text-xs font-semibold">Search</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] bg-white/10 rounded-md text-slate-400 font-sans border border-white/5 uppercase font-medium">Ctrl K</kbd>
          </button>


          <a
            href="/docs/Anirudha_Basu_Thakur_Resume.pdf"
            target="_blank"
            download="Anirudha_Basu_Thakur_Resume.pdf"
            className="hidden xl:flex items-center justify-center px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-semibold rounded-full
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
            onClick={(e) => handleNavLinkClick(e, "contact")}
            className="hidden lg:flex px-5 py-2 sm:px-6 sm:py-2.5 text-sm font-bold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full hover:bg-cyan-500 hover:text-black hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300"
          >
            Connect Now
          </a>

          {/* Hamburger Toggle */}
          <button
            className="lg:hidden text-white p-2"
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
        className={`fixed inset-0 bg-[#0a0a0c] z-40 flex flex-col overflow-hidden transition-all duration-700 lg:hidden ${
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
                  onClick={(e) => handleNavLinkClick(e, item.toLowerCase())}
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
            onClick={(e) => handleNavLinkClick(e, "contact")}
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

      {/* Command Palette / Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#030508]/80 backdrop-blur-md" 
            onClick={() => setIsSearchOpen(false)}
          />
          
          {/* Search Box Card */}
          <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-[#0f1420]/95 shadow-[0_0_50px_rgba(34,211,238,0.25)] overflow-hidden flex flex-col max-h-[60vh] animate-scale-in">
            {/* Input Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
              <span className="text-xl text-cyan-400">🔍</span>
              <input
                type="text"
                placeholder="Search sections, projects, skills..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none border-none font-mono"
                autoFocus
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-slate-500 hover:text-white text-xs font-mono border border-white/10 rounded px-1.5 py-0.5"
              >
                ESC
              </button>
            </div>
            
            {/* List Items */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleItemSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all font-mono text-sm cursor-pointer ${
                        isSelected 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 pl-6' 
                          : 'text-slate-300 border border-transparent hover:bg-white/2'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-500 uppercase tracking-widest text-[9px]">
                          {item.type}
                        </span>
                        <span>{item.name}</span>
                      </div>
                      {isSelected && <span className="text-cyan-400 text-xs">ENTER ↵</span>}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500 font-mono text-xs">
                  No results found matching "{searchQuery}"
                </div>
              )}
            </div>
            
            {/* Footer tips */}
            <div className="px-4 py-3 border-t border-white/5 bg-black/20 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
