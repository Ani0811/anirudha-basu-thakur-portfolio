"use client";

import React from "react";
import { ScrollValues } from "../hooks/useScrollAnimation";

interface Props extends ScrollValues { }

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
