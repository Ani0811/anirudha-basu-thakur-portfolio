"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Only run on desktop/fine pointer devices
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsMobile(!mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(!e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    if (!mediaQuery.matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Smooth interpolation for the trailing ambient glow (lerp)
    let rafId: number;
    const updateGlow = () => {
      const delay = 10; // Smooth delay trailing factor
      glowX += (mouseX - glowX) / delay;
      glowY += (mouseY - glowY) / delay;

      if (glowRef.current) {
        // Offset by half of orb width (350px / 2 = 175px) to center it
        glowRef.current.style.transform = `translate3d(${glowX - 175}px, ${glowY - 175}px, 0)`;
      }
      rafId = requestAnimationFrame(updateGlow);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(updateGlow);

    // Hover states for interactive elements to shift the ambient glow color/brightness
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (isClickable) {
        glowRef.current?.classList.add("hovered");
      } else {
        glowRef.current?.classList.remove("hovered");
      }
    };

    window.addEventListener("mouseover", onMouseOver);

    // Fade out when leaving the document
    const onMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
    };
    const onMouseEnter = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "1";
      }
    };

    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={glowRef}
      className="custom-cursor-glow-orb"
    />
  );
}
