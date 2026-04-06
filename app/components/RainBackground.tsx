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

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // --- Lightning Effect ---
      if (lightningOpacity > 0) {
        ctx.fillStyle = `rgba(200, 240, 255, ${lightningOpacity})`;
        ctx.fillRect(0, 0, width, height);
        
        lightningOpacity -= 0.015; // Subtle fade out
        
        // Random strobe effect during a flash
        if (Math.random() < 0.2 && lightningOpacity > 0.03) {
          lightningOpacity += 0.05;
        }
      } else {
        lightningTimer--;
        if (lightningTimer <= 0) {
          // Trigger new subtle lightning strike
          lightningOpacity = Math.random() * 0.12 + 0.05; // max ~0.17 opacity
          lightningTimer = Math.random() * 600 + 300; // Wait 300-900 frames for next strike (~5-15s)
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

        // Update position
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.1; // match the tilt angle

        // Respawn when out of bounds
        if (drop.y > height || drop.x < 0) {
          drop.y = -drop.length;
          drop.x = Math.random() * (width + 200); // give some right margin to combat wind drift
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("resize", setSize);

    return () => {
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
    />
  );
}
