"use client";

import { useState, useEffect, useMemo } from "react";

export interface ScrollValues {
  scrollY: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  scrollProgress: number;
  videoScale: number;
  videoObjectPosition: string;
  topOverlayOpacity: number;
  bottomOverlayOpacity: number;
  currentFrameSrc: string;
  badgeReveal: number;
  nameReveal: number;
  roleReveal: number;
  introReveal: number;
  actionReveal: number;
  textTranslateY: number;
  statementOpacity: number;
}

const framesFolder = "hero-frames";
export const frameSources = Array.from(
  { length: 70 },
  (_, index) => `/${framesFolder}/${String(index + 1).padStart(2, "0")}.png`
);

export function useScrollAnimation(): ScrollValues {
  const [scrollY, setScrollY] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [heroStartFrameIndex, setHeroStartFrameIndex] = useState(9);
  const [frameIndex, setFrameIndex] = useState(9);

  // Listen to scroll and resize
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setViewportWidth(window.innerWidth);

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Detect the first non-black frame and preload all frames
  useEffect(() => {
    let isCancelled = false;
    let preloadTimer: ReturnType<typeof setTimeout> | undefined;

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
      let detectedStart = 0;

      for (let i = 0; i < frameSources.length; i++) {
        const brightness = await getFrameBrightness(frameSources[i]);
        if (brightness > 14) {
          detectedStart = i;
          break;
        }
      }

      if (isCancelled) return;

      setHeroStartFrameIndex(detectedStart);
      setFrameIndex(detectedStart);

      if (typeof window !== "undefined") {
        const firstFrame = new window.Image();
        firstFrame.src = frameSources[detectedStart];

        preloadTimer = setTimeout(() => {
          for (let i = 0; i < frameSources.length; i++) {
            if (i === detectedStart) continue;
            const image = new window.Image();
            image.src = frameSources[i];
          }
        }, 50);
      }
    };

    bootstrapFrames();

    return () => {
      isCancelled = true;
      if (preloadTimer !== undefined) {
        clearTimeout(preloadTimer);
      }
    };
  }, []);

  // Advance frame index based on scroll position
  useEffect(() => {
    if (typeof window === "undefined") return;
    const scrollRange = window.innerHeight * 5.5;
    const progress = Math.max(0, Math.min(scrollY / scrollRange, 1));
    const playableFrameCount = frameSources.length - heroStartFrameIndex;
    const nextIndex =
      heroStartFrameIndex +
      Math.min(playableFrameCount - 1, Math.floor(progress * playableFrameCount));

    setFrameIndex(nextIndex);
  }, [scrollY, heroStartFrameIndex]);

  // --- Derived values ---
  const isDesktop = viewportWidth >= 1024;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const isMobile = viewportWidth < 640;

  const maxScroll = useMemo(() => {
    if (typeof window === "undefined") return 3200;
    return window.innerHeight * (isDesktop ? 4 : 3);
  }, [isDesktop]);

  const scrollProgress = Math.min(scrollY / maxScroll, 1);

  const videoScale = isMobile
    ? 0.96 + scrollProgress * 0.025
    : isTablet
    ? 1 + scrollProgress * 0.05
    : 1 + scrollProgress * 0.07;

  const videoObjectPosition = isMobile
    ? "center 30%"
    : isTablet
    ? "center 30%"
    : "center center";

  const topOverlayOpacity = 0.18 + scrollProgress * 0.22;
  const bottomOverlayOpacity = 0.22 + scrollProgress * 0.2;
  const currentFrameSrc = frameSources[frameIndex];

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
    videoScale,
    videoObjectPosition,
    topOverlayOpacity,
    bottomOverlayOpacity,
    currentFrameSrc,
    badgeReveal,
    nameReveal,
    roleReveal,
    introReveal,
    actionReveal,
    textTranslateY,
    statementOpacity,
  };
}

