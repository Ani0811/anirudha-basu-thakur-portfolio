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

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    let rafId: number | null = null;
    let isAnimating = false;
    let onMouseMove: (e: MouseEvent) => void;
    let onMouseOver: (e: MouseEvent) => void;
    let onMouseLeave: () => void;
    let onMouseEnter: () => void;

    if (mediaQuery.matches) {
      const updateGlow = () => {
        const delay = 10;
        glowX += (mouseX - glowX) / delay;
        glowY += (mouseY - glowY) / delay;

        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${glowX - 175}px, ${glowY - 175}px, 0)`;
        }

        // Idle check: stop loop when glow settles near target
        if (Math.abs(mouseX - glowX) > 0.1 || Math.abs(mouseY - glowY) > 0.1) {
          rafId = requestAnimationFrame(updateGlow);
        } else {
          isAnimating = false;
          rafId = null;
        }
      };

      const startAnimation = () => {
        if (!isAnimating) {
          isAnimating = true;
          rafId = requestAnimationFrame(updateGlow);
        }
      };

      onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        startAnimation();
      };

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      startAnimation();

      // Fast selector-based hover check without forced layout reflow (no getComputedStyle)
      onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target) return;
        
        const isClickable = !!(
          target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.tagName === 'INPUT' || 
          target.tagName === 'SELECT' || 
          target.tagName === 'TEXTAREA' || 
          target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer, [data-cursor-hover]')
        );

        if (isClickable) {
          glowRef.current?.classList.add("hovered");
        } else {
          glowRef.current?.classList.remove("hovered");
        }
      };

      window.addEventListener("mouseover", onMouseOver, { passive: true });

      // Fade out when leaving the document
      onMouseLeave = () => {
        if (glowRef.current) {
          glowRef.current.style.opacity = "0";
        }
      };
      onMouseEnter = () => {
        if (glowRef.current) {
          glowRef.current.style.opacity = "1";
        }
      };

      document.addEventListener("mouseleave", onMouseLeave);
      document.addEventListener("mouseenter", onMouseEnter);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      if (mediaQuery.matches) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseover", onMouseOver);
        document.removeEventListener("mouseleave", onMouseLeave);
        document.removeEventListener("mouseenter", onMouseEnter);
        if (rafId !== null) cancelAnimationFrame(rafId);
      }
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
