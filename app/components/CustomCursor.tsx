"use client";

import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
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
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    // Smooth interpolation for the trailing ring
    let rafId: number;
    const updateRing = () => {
      const delay = 6; // Trailing delay factor (higher is slower/smoother)
      ringX += (mouseX - ringX) / delay;
      ringY += (mouseY - ringY) / delay;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(updateRing);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(updateRing);

    // Hover states for interactive elements
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
        ringRef.current?.classList.add("hovered");
        dotRef.current?.classList.add("hovered");
      } else {
        ringRef.current?.classList.remove("hovered");
        dotRef.current?.classList.remove("hovered");
      }
    };

    window.addEventListener("mouseover", onMouseOver);

    // Mouse click states
    const onMouseDown = () => {
      ringRef.current?.classList.add("clicked");
    };
    const onMouseUp = () => {
      ringRef.current?.classList.remove("clicked");
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Fade out when leaving the document
    const onMouseLeave = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = "0";
        ringRef.current.style.opacity = "0";
      }
    };
    const onMouseEnter = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = "1";
        ringRef.current.style.opacity = "1";
      }
    };

    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
      />
      {/* Outer trailing ring */}
      <div
        ref={ringRef}
        className="custom-cursor-ring"
      />
    </>
  );
}
