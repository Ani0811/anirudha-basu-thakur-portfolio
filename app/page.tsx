"use client";

import React, { useState, useEffect } from "react";
import { useScrollAnimation } from "./hooks/useScrollAnimation";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import UpdateNotification from "./components/UpdateNotification";

const bootMessages = [
  "Booting developer workspace...",
  "Loading libraries...",
  "Connecting APIs...",
  "Compiling components...",
  "Launching portfolio...",
];

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [bootText, setBootText] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);

  // Boot animation sequence
  useEffect(() => {
    if (bootText < bootMessages.length) {
      const timer = setTimeout(() => setBootText((prev: number) => prev + 1), 600);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setLoading(false), 800);
    }
  }, [bootText]);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [isMobileMenuOpen]);

  const scrollValues = useScrollAnimation();

  if (loading) {
    return <LoadingScreen bootText={bootText} bootMessages={bootMessages} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans selection:bg-cyan-900 selection:text-cyan-100 overflow-x-clip">
      {/* Background Ambience / Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_80%_at_50%_40%,#000_20%,transparent_100%)] opacity-30" />
      </div>

      <Navbar
        scrollY={scrollValues.scrollY}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="relative z-10 flex flex-col gap-12 sm:gap-16 pb-24 sm:pb-32">
        <HeroSection {...scrollValues} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection terminalMode={terminalMode} setTerminalMode={setTerminalMode} />
      </main>

      <Footer />
      <UpdateNotification />

      {/* Global custom animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html { scroll-behavior: smooth; }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }

        .glow-text {
          text-shadow: 0 0 15px rgba(34,211,238,0.4);
        }

        .pulse-anim {
          box-shadow: 0 0 10px rgba(34,211,238,0.8);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          animation: gradient 4s ease infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.01); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `,
        }}
      />
    </div>
  );
}
