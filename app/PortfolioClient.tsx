"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "./components/ui/LoadingScreen";
import Navbar from "./components/ui/Navbar";
import CustomCursor from "./components/ui/CustomCursor";

// Dynamic imports for sections below the fold to improve LCP and TBT
const HeroSection = dynamic(() => import("./components/sections/HeroSection"), { ssr: true });
const AboutSection = dynamic(() => import("./components/sections/AboutSection"), { ssr: true });
const SkillsSection = dynamic(() => import("./components/sections/SkillsSection"), { ssr: false });
const ProjectsSection = dynamic(() => import("./components/sections/ProjectsSection"), { ssr: false });
const CurrentWorkSection = dynamic(() => import("./components/sections/CurrentWorkSection"), { ssr: false });
const ContactSection = dynamic(() => import("./components/sections/ContactSection"), { ssr: false });
const Footer = dynamic(() => import("./components/ui/Footer"), { ssr: true });
const UpdateNotification = dynamic(() => import("./components/ui/UpdateNotification"), { ssr: false });
const RainBackground = dynamic(() => import("./components/effects/RainBackground"), { ssr: false });
const ScrollToTopButton = dynamic(() => import("./components/ui/ScrollToTopButton"), { ssr: false });
const TerminalOverlay = dynamic(() => import("@/app/components/ui/TerminalOverlay"), { ssr: false }); // Developer CLI
const SandboxSection = dynamic(() => import("@/app/components/sections/SandboxSection"), { ssr: false }); // Interactive Sandbox
const DebugWidget = dynamic(() => import("@/app/components/ui/DebugWidget"), { ssr: false }); // Performance Monitor
const TerminalWidget = dynamic(() => import("@/app/components/ui/TerminalWidget"), { ssr: false }); // Terminal Floating Button

import { PortfolioProvider } from "./context/PortfolioContext";

const bootCategories = [
  [
    "Booting developer workspace...",
    "Spinning up core workspace...",
    "Initializing kernel runtime...",
    "Establishing system handshake...",
  ],
  [
    "Loading modules and packages...",
    "Resolving node_modules gravity well...",
    "Injecting custom styling variables...",
    "Hydrating local configurations...",
  ],
  [
    "Connecting database adapters...",
    "Establishing secure GitHub endpoints...",
    "Synchronizing Gemini AI engines...",
    "Warming up server action handlers...",
  ],
  [
    "Compiling Next.js layouts...",
    "Optimizing scroll animation buffers...",
    "Minifying CSS compilation bundles...",
    "Preloading webp graphics assets...",
  ],
  [
    "Launching portfolio interface...",
    "Starting primary interface threads...",
    "Mounting component DOM branches...",
    "Opening developer system...",
  ]
];

export default function PortfolioClient() {
  const [loading, setLoading] = useState(true);
  const [bootText, setBootText] = useState(0);
  const [bootMessages, setBootMessages] = useState<string[]>([
    "Booting developer workspace...",
    "Loading libraries...",
    "Connecting APIs...",
    "Compiling components...",
    "Launching portfolio...",
  ]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);

  // Generate randomized messages on mount to prevent SSR hydration mismatch
  useEffect(() => {
    const randomized = bootCategories.map(cat => cat[Math.floor(Math.random() * cat.length)]);
    setBootMessages(randomized);
  }, []);

  // Boot animation sequence
  useEffect(() => {
    if (bootText < bootMessages.length) {
      const timer = setTimeout(() => setBootText((prev: number) => prev + 1), 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [bootText, bootMessages]);

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

  if (loading) {
    return <LoadingScreen bootText={bootText} bootMessages={bootMessages} />;
  }

  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans selection:bg-cyan-900 selection:text-cyan-100 overflow-x-clip">
        {/* Custom trailing cursor */}
        <CustomCursor />

      {/* Background Ambience / Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_80%_at_50%_40%,#000_20%,transparent_100%)] opacity-30" />
        
        {/* Dynamic Rain Effect */}
        <RainBackground />
      </div>

      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="relative z-10 flex flex-col gap-12 sm:gap-16 pb-24 sm:pb-32">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <SandboxSection />
        <CurrentWorkSection />
        <ContactSection terminalMode={terminalMode} setTerminalMode={setTerminalMode} />
      </main>

      <Footer />
      <UpdateNotification />
      <ScrollToTopButton />
      <TerminalOverlay />
      <TerminalWidget />
      <DebugWidget />

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
    </PortfolioProvider>
  );
}
