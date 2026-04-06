"use client";

import React, { useEffect, useRef } from "react";

export default function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setSize();

    // Adjust drop count based on screen size for performance
    const maxDrops = width < 768 ? 70 : 150;
    
    // Initialize drops
    const drops = Array.from({ length: maxDrops }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 20 + 15,
      length: Math.random() * 30 + 10,
      opacity: Math.random() * 0.3 + 0.05,
      width: Math.random() * 1.5 + 0.5,
    }));

    let animationFrameId: number;

    // Lightning state
    let lightningTimer = Math.random() * 400 + 200;
    let lightningOpacity = 0;
    let lightningActive = false;
    let lightningEndTime = 0; // in ms

    let lastTime = performance.now();

    const draw = (time: number) => {
      // Calculate delta to keep animation smooth even if frames drop
      const deltaTime = time - lastTime || 16;
      lastTime = time;
      // Normalizing speed multiplier (assuming 60fps ~ 16ms per frame)
      const speedMult = deltaTime / 16;

      ctx.clearRect(0, 0, width, height);

      // --- Lightning Effect ---
      if (lightningActive) {
        // Draw current flash (capped so it never fully whites out the UI)
        const drawOpacity = Math.min(lightningOpacity, 0.45);
        ctx.fillStyle = `rgba(200, 240, 255, ${drawOpacity})`;
        ctx.fillRect(0, 0, width, height);

        // While active and before the end time, allow small flickers
        if (time < lightningEndTime) {
          if (Math.random() < 0.15 && lightningOpacity < 0.45) {
            lightningOpacity += 0.04; // small strobe bump
          }
          // keep baseline (no fast fade) while within the 2s window
        } else {
          // after the designated window, fade out quickly
          lightningOpacity -= 0.06 * speedMult;
        }

        // If opacity falls below threshold, end the active flash
        if (lightningOpacity <= 0.01) {
          lightningOpacity = 0;
          lightningActive = false;
        }
      } else {
        // countdown to next potential strike
        lightningTimer -= speedMult;
        if (lightningTimer <= 0) {
          // 10% chance to actually trigger a lightning flash when timer elapses
          if (Math.random() < 0.1) {
            lightningActive = true;
            lightningOpacity = Math.random() * 0.15 + 0.15; // 0.15 - 0.3 starting opacity
            lightningEndTime = time + 2000; // stay up to 2 seconds
          }
          // Reset timer regardless so we retry later
          lightningTimer = Math.random() * 400 + 200;
        }
      }

      ctx.lineCap = "round";

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];

        ctx.beginPath();
        // Slight tilt effect for wind
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.length * 0.1, drop.y + drop.length);
        
        ctx.strokeStyle = `rgba(34, 211, 238, ${drop.opacity})`; // Cyan colored rain
        ctx.lineWidth = drop.width;
        ctx.stroke();

        // Update position using deltaTime multiplier so speed remains constant over time
        drop.y += drop.speed * speedMult;
        drop.x -= drop.speed * 0.1 * speedMult; // match the tilt angle

        // Respawn when out of bounds
        if (drop.y > height || drop.x < 0) {
          drop.y = -drop.length;
          drop.x = Math.random() * (width + 200); // give some right margin to combat wind drift
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    window.addEventListener("resize", setSize, { passive: true });

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
      style={{ transform: "translateZ(0)" }}
    />
  );
}
