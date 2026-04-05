"use client";

import React from "react";
import { ScrollValues } from "../hooks/useScrollAnimation";

interface Props extends ScrollValues {}

export default function HeroSection({
  scrollY,
  currentFrameSrc,
  videoScale,
  videoObjectPosition,
  topOverlayOpacity,
  bottomOverlayOpacity,
  badgeReveal,
  nameReveal,
  roleReveal,
  introReveal,
  actionReveal,
  textTranslateY,
  statementOpacity,
}: Props) {
  // Typewriter effect logic
  const roles = React.useMemo(() => ["Full Stack Developer", "Software Engineer"], []);
  const [text, setText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [loopNum, setLoopNum] = React.useState(0);

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

    let typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && text === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setLoopNum((prev) => prev + 1);
      timer = setTimeout(() => {}, 500);
    } else {
      timer = setTimeout(handleType, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, roles]);

  return (
    <>
      {/* HERO SECTION – scroll controls frame playback */}
      <section id="home" className="relative w-full h-[560vh] sm:h-[600vh] lg:h-[700vh]">
        {/* Sticky Video Background */}
        <div className="sticky top-0 w-full h-screen overflow-hidden z-0 bg-[radial-gradient(circle_at_50%_30%,#1a2442_0%,#0a0a0c_75%)]">
          {/* Blurred background layer */}
          <img
            src={currentFrameSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-70 transform-gpu"
            loading="eager"
          />
          {/* Sharp foreground layer */}
          <img
            src={currentFrameSrc}
            alt="Scrolling frame sequence"
            className="absolute inset-0 w-full h-full object-cover object-center transform-gpu will-change-[transform,opacity,filter]"
            loading="eager"
            fetchPriority="high"
            style={{
              opacity: 1,
              objectPosition: videoObjectPosition,
              transform: `scale(${videoScale})`,
            }}
          />

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
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.95] mb-4 sm:mb-5 drop-shadow-md transition-all duration-300"
                style={{ opacity: nameReveal, transform: `translateY(${(1 - nameReveal) * 22}px)` }}
              >
                <span className="block drop-shadow-lg">Anirudha</span>
                <span className="block text-slate-200 drop-shadow-lg">Basu Thakur</span>
              </h1>

              {/* Role */}
              <h2
                className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 tracking-tight text-cyan-300 drop-shadow-md transition-all duration-300 flex items-center justify-center lg:justify-start min-h-[40px] sm:min-h-[48px]"
                style={{ opacity: roleReveal, transform: `translateY(${(1 - roleReveal) * 24}px)` }}
              >
                <span>{text || "\u00A0"}</span>
                <span className="w-[2px] sm:w-[3px] h-[1em] bg-cyan-400 ml-1.5 animate-pulse" />
              </h2>

              {/* Intro */}
              <p
                className="text-base sm:text-lg md:text-xl text-slate-200 font-light mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0 drop-shadow-md transition-all duration-300 leading-relaxed"
                style={{ opacity: introReveal, transform: `translateY(${(1 - introReveal) * 26}px)` }}
              >
                Building modern web systems. <br />
                <span className="text-slate-400 mt-2 block text-sm sm:text-base md:text-lg">
                  I construct interactive web experiences, scalable backend structures, and
                  high-performance tools driving today&apos;s web ecosystems.
                </span>
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 transition-all duration-300"
                style={{ opacity: actionReveal, transform: `translateY(${(1 - actionReveal) * 28}px)` }}
              >
                <a
                  href="#projects"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-white text-black font-bold rounded-lg hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-[#0a0a0c]/80 text-white font-bold rounded-lg hover:bg-[#111116] backdrop-blur-md transition-all shadow-xl"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>

          {/* Scroll prompt */}
          <div
            className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 text-cyan-400 font-mono text-xs sm:text-sm tracking-[0.25em] sm:tracking-widest flex flex-col items-center gap-2 animate-bounce transition-opacity duration-300"
            style={{ opacity: scrollY > 50 ? 0 : 1 }}
          >
            SCROLL <span className="w-px h-8 bg-cyan-500/50 block" />
          </div>
        </div>
      </section>

      {/* CINEMATIC TRANSITION STATEMENT */}
      <section className="py-20 sm:py-32 flex items-center justify-center relative mt-[-16vh] sm:mt-[-20vh]">
        <div className="absolute top-1/2 left-0 w-full h-px bg-[linear-gradient(to_right,transparent,var(--tw-gradient-stops),transparent)] from-cyan-500/50 to-transparent" />
        <h2
          className="text-3xl sm:text-4xl md:text-7xl font-black text-center text-white/90 tracking-tight relative z-10 px-4 sm:px-6 glow-text transition-opacity duration-500"
          style={{ opacity: statementOpacity }}
        >
          Crafting modern web experiences.
        </h2>
      </section>
    </>
  );
}

