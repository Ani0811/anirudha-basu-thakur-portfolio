"use client";

import React, { useRef, useEffect } from "react";
import { ScrollValues, getCachedImage, frameSources } from "../hooks/useScrollAnimation";

interface Props extends ScrollValues { }

export default function HeroSection({
  scrollY,
  currentFrameSrc,
  currentFrameImage,
  heroScale,
  heroObjectPosition,
  topOverlayOpacity,
  bottomOverlayOpacity,
  badgeReveal,
  nameReveal,
  roleReveal,
  introReveal,
  actionReveal,
  textTranslateY,
  statementOpacity,
  isLoaded,
  heroStartFrameIndex,
  heroEndFrameIndex,
  heroScrollRangeFactor,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafId = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const canvasSize = useRef({ width: 0, height: 0, dpr: 1 });

  // Drawing logic for the canvas - high performance RAF loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvasSize.current = { width: canvas.width, height: canvas.height, dpr };
    };

    const drawFrame = (scrollY: number) => {
      const scrollRange = window.innerHeight * heroScrollRangeFactor;
      const progress = Math.max(0, Math.min(scrollY / scrollRange, 1));
      const playableFrameCount = (heroEndFrameIndex - heroStartFrameIndex) + 1;
      const frameIndex = heroStartFrameIndex + Math.min(playableFrameCount - 1, Math.floor(progress * playableFrameCount));
      
      const img = getCachedImage(frameIndex);
      if (!img) return;

      const { width: canvasWidth, height: canvasHeight } = canvasSize.current;
      const imgWidth = img.width;
      const imgHeight = img.height;

      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const x = (canvasWidth / 2) - (imgWidth / 2) * scale;
      const y = (canvasHeight / 2) - (imgHeight / 2) * scale;

      context.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    };

    const animate = () => {
      // Linear interpolation (lerping) for ultra-smooth movement
      // factor: 0.1 for very smooth/weighted, 0.2-0.3 for snappier
      const lerpFactor = 0.12; 
      const targetScroll = window.scrollY;
      
      currentScrollY.current += (targetScroll - currentScrollY.current) * lerpFactor;
      
      // Only redraw if the interpolated scroll has moved significantly or initially
      if (Math.abs(currentScrollY.current - lastScrollY.current) > 0.1 || lastScrollY.current === 0) {
        drawFrame(currentScrollY.current);
        lastScrollY.current = currentScrollY.current;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isLoaded, heroStartFrameIndex]);

  // Typewriter effect logic
  const roles = React.useMemo(() => ["Full Stack Developer", "Software Engineer"], []);
  const [text, setText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [loopNum, setLoopNum] = React.useState(0);
  const [showScrollPrompt, setShowScrollPrompt] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowScrollPrompt(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    const i = loopNum % roles.length;
    const fullText = roles[i];

    const handleType = () => {
      setText((prev) =>
        isDeleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );
    };

    let typingSpeed = isDeleting ? 50 : 135;

    if (!isDeleting && text === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setLoopNum((prev) => prev + 1);
      timer = setTimeout(() => { }, 500);
    } else {
      timer = setTimeout(handleType, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, roles]);

  return (
    <>
      {/* HERO SECTION – scroll controls frame playback */}
      <section id="home" className="relative w-full" style={{ height: `${(heroScrollRangeFactor + 1.5) * 100}vh` }}>
        {/* Sticky Hero Frame Background */}
        <div className="sticky top-0 w-full h-screen overflow-hidden z-0 bg-[radial-gradient(circle_at_50%_30%,#1a2442_0%,#0a0a0c_75%)]">
          {/* Ambient background layer - using CSS blur on the same source or a static glow */}
          <div className="absolute inset-0 bg-cyan-950/20 blur-3xl opacity-50" />
          
          {/* Sharp foreground layer - using Canvas for performance */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover transform-gpu will-change-transform"
            style={{
              opacity: isLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
              transform: `scale(${heroScale})`,
            }}
          />

          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0c]/60 backdrop-blur-sm z-50">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                <span className="text-cyan-400 font-mono text-xs tracking-widest animate-pulse">SYNCHRONIZING FRAMES...</span>
              </div>
            </div>
          )}

          {/* Vignette overlays */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0c_0%,transparent_30%,transparent_100%)]"
            style={{ opacity: topOverlayOpacity }}
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_60%,#0a0a0c_100%)]"
            style={{ opacity: bottomOverlayOpacity }}
          />

          {/* Hero text (sticky, scrolls with the section) */}
          <div className="absolute inset-0 flex items-center w-full max-w-7xl mx-auto px-4 sm:px-6 z-10 pointer-events-none">
            <div
              className="max-w-2xl py-6 sm:py-8 lg:pl-8 transition-transform duration-75 transform-gpu pointer-events-auto will-change-transform text-center lg:text-left mx-auto lg:mx-0"
              style={{ transform: `translateY(${textTranslateY}px)` }}
            >
              {/* Badge */}
              <div
                className="inline-flex items-center px-4 sm:px-5 py-1.5 sm:py-2 mb-5 sm:mb-6 rounded-full bg-black/20 backdrop-blur-md text-slate-200 text-xs sm:text-sm font-mono tracking-[0.12em] border border-white/10 transition-all duration-300"
                style={{ opacity: badgeReveal, transform: `translateY(${(1 - badgeReveal) * 20}px)` }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" /> SYSTEM ONLINE
              </div>

              {/* Name */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-2 sm:mb-4 drop-shadow-md transition-all duration-300"
                style={{ opacity: nameReveal, transform: `translateY(${(1 - nameReveal) * 22}px)` }}
              >
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient bg-size-[200%_auto] pb-1">
                  Anirudha
                </span>
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-emerald-400 to-indigo-400 animate-gradient bg-size-[200%_auto] pb-1">
                  Basu Thakur
                </span>
              </h1>

              {/* Role */}
              <h2
                className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6 sm:mb-5 tracking-tight text-cyan-300 drop-shadow-md transition-all duration-300 flex items-center justify-center lg:justify-start min-h-6 sm:min-h-10"
                style={{ opacity: roleReveal, transform: `translateY(${(1 - roleReveal) * 24}px)` }}
              >
                <span>{text || "\u00A0"}</span>
                <span className="w-[1.5px] sm:w-0.5 h-[1em] bg-cyan-400 ml-1.5 animate-pulse" />
              </h2>

              {/* CTA Buttons */}
              <div
                className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 transition-all duration-300 w-full mx-auto md:mx-0"
                style={{ opacity: actionReveal, transform: `translateY(${(1 - actionReveal) * 28}px)` }}
              >
                <a
                  href="#projects"
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-linear-to-r from-cyan-500 to-blue-500 text-white text-sm sm:text-base font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300 text-center"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-white/5 border border-white/10 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-white/10 hover:border-cyan-500/50 hover:scale-105 active:scale-95 backdrop-blur-md transition-all duration-300 text-center"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>

          {/* Redesigned Scroll prompt */}
          <div
            className={`absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000 ${
              showScrollPrompt && scrollY < 50 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="w-6 h-10 border-2 border-cyan-500/30 rounded-full flex justify-center p-1.5 backdrop-blur-sm">
              <div className="w-1 h-2 bg-cyan-400 rounded-full animate-scroll-wheel" />
            </div>
            <span className="text-cyan-400 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase opacity-70">
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* CINEMATIC TRANSITION STATEMENT */}
      <section className="py-20 sm:py-32 flex items-center justify-center relative mt-[-5vh] sm:mt-[-10vh]">
        <div className="absolute top-1/2 left-0 w-full h-px bg-[linear-gradient(to_right,transparent,var(--tw-gradient-stops),transparent)] from-cyan-500/50 to-transparent animate-pulse" />
        <h2
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-center text-white/90 tracking-tight relative z-10 px-4 sm:px-6 transition-all duration-500 animate-float"
          style={{ 
            opacity: statementOpacity,
            textShadow: '0 0 30px rgba(34,211,238,0.35), 0 0 70px rgba(34,211,238,0.2)',
          }}
        >
          <span className="inline-block animate-gradient bg-linear-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-size-[200%_auto]">
            Crafting Modern Experiences
          </span>
        </h2>
      </section>
    </>
  );
}
