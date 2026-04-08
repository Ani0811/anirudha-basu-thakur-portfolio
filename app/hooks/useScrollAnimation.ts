"use client";

import { useState, useEffect, useMemo, useRef } from "react";

export interface ScrollValues {
  scrollY: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  scrollProgress: number;
  heroScale: number;
  heroObjectPosition: string;
  topOverlayOpacity: number;
  bottomOverlayOpacity: number;
  currentFrameSrc: string; // Keep for initial render/pre-loading
  currentFrameImage: HTMLImageElement | null; // Keep for initial render
  badgeReveal: number;
  nameReveal: number;
  roleReveal: number;
  introReveal: number;
  actionReveal: number;
  textTranslateY: number;
  statementOpacity: number;
  isLoaded: boolean;
  heroStartFrameIndex: number;
  heroEndFrameIndex: number;
  heroScrollRangeFactor: number;
}

const framesFolder = "hero-frames";
export const frameSources = Array.from(
  { length: 73 },
  (_, index) => `/${framesFolder}/${String(index + 8).padStart(3, "0")}.webp`
);

// Global cache for images and initialization status to persist across re-renders
const imageCache = new Map<number, HTMLImageElement>();
let globalIsLoaded = false;
let globalHeroStartFrameIndex = 0;
let globalHeroEndFrameIndex = 72; // Default to last index

export const HERO_SCROLL_RANGE_FACTOR = 6.5; // Optimized for 73 frames

export function useScrollAnimation(): ScrollValues {
  const [scrollY, setScrollY] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [heroStartFrameIndex, setHeroStartFrameIndex] = useState(globalHeroStartFrameIndex);
  const [frameIndex, setFrameIndex] = useState(globalHeroStartFrameIndex);
  const [isLoaded, setIsLoaded] = useState(globalIsLoaded);
  
  const scrollRef = useRef<number>(0);
  const rafId = useRef<number | null>(null);

  // Listen to scroll and resize with RAF throttling
  useEffect(() => {
    const updateScroll = () => {
      setScrollY(window.scrollY);
      rafId.current = null;
    };

    const handleScroll = () => {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateScroll);
      }
    };

    const handleResize = () => setViewportWidth(window.innerWidth);

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Preload all frames into cache with skipping on mobile
  useEffect(() => {
    let isCancelled = false;

    const bootstrapFrames = async () => {
      if (globalIsLoaded) {
        setHeroStartFrameIndex(globalHeroStartFrameIndex);
        setFrameIndex(globalHeroStartFrameIndex);
        setIsLoaded(true);
        return;
      }

      // Pre-calculated values to avoid expensive brightness detection on every mount
      // These should match the frames known to be non-black
      const detectedStart = 0; 
      globalHeroStartFrameIndex = 0;
      globalHeroEndFrameIndex = 72;

      if (isCancelled) return;

      setHeroStartFrameIndex(detectedStart);
      setFrameIndex(detectedStart);

      // Determine step based on device capability (simple heuristic)
      // Mobile: Load every 3rd frame (roughly 24 frames total)
      // Tablet: Load every 2nd frame
      const isMobileDevice = window.innerWidth < 640;
      const isTabletDevice = window.innerWidth < 1024 && window.innerWidth >= 640;
      const step = isMobileDevice ? 3 : isTabletDevice ? 2 : 1;

      // Preload frames into the imageCache Map with stepping
      const preloadPromises = [];
      for (let i = 0; i < frameSources.length; i += step) {
        const index = i;
        const src = frameSources[index];
        
        preloadPromises.push(new Promise<void>((resolve) => {
          if (imageCache.has(index)) {
            resolve();
            return;
          }

          const img = new Image();
          img.onload = async () => {
            try {
              if ('decode' in img) await img.decode();
            } catch (e) {
              console.warn("Failed to decode image:", src);
            }
            imageCache.set(index, img);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = src;
        }));
      }

      await Promise.all(preloadPromises);
      if (!isCancelled) {
        globalIsLoaded = true;
        setIsLoaded(true);
      }
    };

    bootstrapFrames();
    
    const safetyTimeout = setTimeout(() => {
      if (!isCancelled && !isLoaded) setIsLoaded(true);
    }, 1500);

    return () => {
      isCancelled = true;
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Advance frame index based on scroll position - gated by isLoaded
  // Note: We only update the state-based frame index for "low-frequency" UI logic.
  // The high-frequency canvas drawing will happen directly in the HeroSection loop.
  useEffect(() => {
    if (typeof window === "undefined" || !isLoaded) return;
    
    // Throttled update for UI reveals at roughly 15-20fps to keep React happy
    const throttleDelay = 50; 
    let lastUpdate = 0;

    const updateFrameState = () => {
      const now = Date.now();
      if (now - lastUpdate < throttleDelay) return;

    const scrollRange = window.innerHeight * HERO_SCROLL_RANGE_FACTOR;
    const progress = Math.max(0, Math.min(window.scrollY / scrollRange, 1));
    const playableFrameCount = (globalHeroEndFrameIndex - globalHeroStartFrameIndex) + 1;
    const nextIndex =
      heroStartFrameIndex +
      Math.min(playableFrameCount - 1, Math.floor(progress * playableFrameCount));

    if (nextIndex !== frameIndex && nextIndex < frameSources.length) {
      // Find the nearest available index (stepping backward to find the last loaded one)
      const isMobileDevice = window.innerWidth < 640;
      const isTabletDevice = window.innerWidth < 1024 && window.innerWidth >= 640;
      const step = isMobileDevice ? 3 : isTabletDevice ? 2 : 1;
      
      const adjustedIndex = step === 1 ? nextIndex : Math.floor(nextIndex / step) * step;
      
      if (adjustedIndex !== frameIndex) {
        setFrameIndex(adjustedIndex);
        lastUpdate = now;
      }
    }
  };

    window.addEventListener("scroll", updateFrameState, { passive: true });
    return () => window.removeEventListener("scroll", updateFrameState);
  }, [heroStartFrameIndex, frameIndex, isLoaded]);

  // --- Derived values ---
  const isDesktop = viewportWidth >= 1024;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const isMobile = viewportWidth < 640;

  const maxScroll = useMemo(() => {
    if (typeof window === "undefined") return 3200;
    return window.innerHeight * HERO_SCROLL_RANGE_FACTOR;
  }, []);

  const scrollProgress = Math.min(scrollY / maxScroll, 1);

  // Cinematic Zoom Reveal - starts slightly zoomed in and "settles" on scroll
  const videoScale = isMobile
    ? 1.05 - scrollProgress * 0.03
    : isTablet
    ? 1.06 - scrollProgress * 0.04
    : 1.08 - scrollProgress * 0.08;

  const videoObjectPosition = isMobile
    ? "center 30%"
    : isTablet
    ? "center 30%"
    : "center center";

  const topOverlayOpacity = 0.18 + scrollProgress * 0.22;
  const bottomOverlayOpacity = 0.22 + scrollProgress * 0.2;
  const currentFrameSrc = frameSources[frameIndex];
  const currentFrameImage = imageCache.get(frameIndex) || null;

  const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
  const revealByProgress = (start: number, end: number) => {
    if (scrollProgress <= start) return 0;
    if (scrollProgress >= end) return 1;
    return clamp01((scrollProgress - start) / (end - start));
  };

  const badgeReveal = revealByProgress(isMobile ? 0.02 : 0.05, isMobile ? 0.12 : 0.18);
  const nameReveal = revealByProgress(isMobile ? 0.10 : 0.15, isMobile ? 0.22 : 0.30);
  const roleReveal = revealByProgress(isMobile ? 0.20 : 0.28, isMobile ? 0.35 : 0.45);
  const introReveal = revealByProgress(isMobile ? 0.32 : 0.42, isMobile ? 0.48 : 0.60);
  const actionReveal = revealByProgress(isMobile ? 0.45 : 0.58, isMobile ? 0.65 : 0.75);

  const textStartOffset = isMobile ? 120 : isTablet ? 150 : 200;
  const textScrollFactor = isMobile ? 0.34 : isTablet ? 0.42 : 0.5;
  const textTranslateY = Math.max(0, textStartOffset - scrollY * textScrollFactor);

  const statementOpacity =
    scrollProgress > 0.8 ? Math.min((scrollProgress - 0.8) * 5, 1) : 0;

  return {
    scrollY,
    isMobile,
    isTablet,
    isDesktop,
    scrollProgress,
    heroScale: videoScale,
    heroObjectPosition: videoObjectPosition,
    topOverlayOpacity,
    bottomOverlayOpacity,
    currentFrameSrc,
    currentFrameImage,
    badgeReveal,
    nameReveal,
    roleReveal,
    introReveal,
    actionReveal,
    textTranslateY,
    statementOpacity,
    isLoaded,
    heroStartFrameIndex,
    heroEndFrameIndex: globalHeroEndFrameIndex,
    heroScrollRangeFactor: HERO_SCROLL_RANGE_FACTOR,
  };
}

export function getCachedImage(index: number): HTMLImageElement | null {
  return imageCache.get(index) || null;
}

