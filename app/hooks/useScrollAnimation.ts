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

  // Detect the first non-black frame and preload all frames into cache
  useEffect(() => {
    let isCancelled = false;

    const getFrameBrightness = (src: string): Promise<number> =>
      new Promise((resolve) => {
        if (typeof window === "undefined") {
          resolve(0);
          return;
        }
        const image = new window.Image();
        image.decoding = "async";
        image.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const sampleWidth = 24;
            const sampleHeight = 24;
            canvas.width = sampleWidth;
            canvas.height = sampleHeight;
            const context = canvas.getContext("2d", { willReadFrequently: true });

            if (!context) {
              resolve(0);
              return;
            }

            context.drawImage(image, 0, 0, sampleWidth, sampleHeight);
            const imageData = context.getImageData(0, 0, sampleWidth, sampleHeight);
            const data = imageData.data;
            let sum = 0;

            for (let i = 0; i < data.length; i += 4) {
              sum += data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
            }

            resolve(sum / (data.length / 4));
          } catch {
            resolve(0);
          }
        };
        image.onerror = () => resolve(0);
        image.src = src;
      });

    const bootstrapFrames = async () => {
      // If already initialized globally, just update state and return
      if (globalIsLoaded) {
        setHeroStartFrameIndex(globalHeroStartFrameIndex);
        setFrameIndex(globalHeroStartFrameIndex);
        setIsLoaded(true);
        return;
      }

      let detectedStart = 0;

      // Find start frame - skip if already checked
      if (globalHeroStartFrameIndex === 0) {
        for (let i = 0; i < frameSources.length; i++) {
          const brightness = await getFrameBrightness(frameSources[i]);
          if (brightness > 5) {
            detectedStart = i;
            globalHeroStartFrameIndex = i;
            break;
          }
        }
      } else {
        detectedStart = globalHeroStartFrameIndex;
      }

      // Find end frame - scan backwards from the end to skip trailing black frames
      if (globalHeroEndFrameIndex === 72) {
        for (let i = frameSources.length - 1; i >= detectedStart; i--) {
          const brightness = await getFrameBrightness(frameSources[i]);
          if (brightness > 2) { // Slightly lower threshold for trail-off
            globalHeroEndFrameIndex = i;
            break;
          }
        }
      }

      if (isCancelled) return;

      // Update both simultaneously to prevent any jumps from defaults
      setHeroStartFrameIndex(detectedStart);
      setFrameIndex(detectedStart);

      // Preload all frames into the imageCache Map
      const preloadPromises = frameSources.map((src, index) => {
        return new Promise<void>((resolve) => {
          // SKIP if already in cache
          if (imageCache.has(index)) {
            resolve();
            return;
          }

          const img = new Image();
          img.onload = async () => {
            try {
              // Ensure image is decoded before adding to cache
              if ('decode' in img) {
                await img.decode();
              }
            } catch (e) {
              console.warn("Failed to decode image:", src);
            }
            imageCache.set(index, img);
            resolve();
          };
          img.onerror = () => resolve(); // Keep going even if one fails
          img.src = src;
        });
      });

      await Promise.all(preloadPromises);
      if (!isCancelled) {
        globalIsLoaded = true;
        setIsLoaded(true);
      }
    };

    bootstrapFrames();
    
    // Safety timeout to ensure site doesn't stay stuck if detection takes too long
    const safetyTimeout = setTimeout(() => {
      if (!isCancelled && !isLoaded) {
        setIsLoaded(true);
      }
    }, 2000);

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
      setFrameIndex(nextIndex);
      lastUpdate = now;
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

