# Anirudha Basu Thakur - Premium Portfolio 2026

Welcome to the source code of my high-performance, cinematic portfolio. Built with a focus on immersive aesthetics and technical excellence, this project showcases modern web development patterns and deep-level performance optimizations.

## 🚀 Key Features

- **Cinematic Hero Animation**: A frame-by-frame background animation synchronized with the user's scroll.
- **Glassmorphism UI**: A consistent design language using frosted-glass effects, blurred backdrops, and vibrant glows.
- **Interactive Typewriter**: A progressive role reveal with smooth, character-by-character animation.
- **AI-Powered "Roast My Code"**: Integration with Gemini AI to provide playful, real-time feedback on project codebases.
- **Responsive & Optimized**: Fully responsive layout designed to maintain high performance across mobile, tablet, and desktop.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Logic**: TypeScript
- **Animations**: Custom `requestAnimationFrame` hooks & CSS Transitions

## ⚡ The Scroll Animation Engine (Technical Deep Dive)

The standout feature of this portfolio is the Hero background animation. Achieving 60FPS fluid motion while loading high-quality image frames required a custom-built rendering engine.

### 1. Decoupled Rendering (The RAF Loop)
Unlike traditional React-based animations that rely on state updates (which trigger re-renders and React reconciliation overhead), this portfolio uses a **Direct DOM/Canvas Injection** approach.
- Scroll values are tracked via `window.scrollY`.
- A recursive `requestAnimationFrame` loop in the `HeroSection` bypasses React's render cycle to draw frames directly to a `<canvas>`.
- This ensures that even high-frequency scrolling doesn't "jitter" or lag due to React's scheduler.

### 2. Linear Interpolation (Lerping)
To create a weighted, cinematic feel, we implemented **Lerp** logic:
`currentScroll = currentScroll + (targetScroll - currentScroll) * lerpFactor`
- The animation "follows" your scroll with a smooth easing effect.
- This smooths out jerky mouse-wheel inputs and provides a professional "momentum" feel.

### 3. Intelligent Asset Caching
- **Frame Pre-decoding**: Every frame uses `img.decode()` before being cached, ensuring that the GPU is ready to draw without blocking the main browser thread.
- **Global Memory Map**: Images are stored in a singleton `imageCache` to survive component remounts and prevent redundant memory allocations.
- **End-Frame Detection**: The engine automatically scans for dark/empty trailing frames to ensure the animation maps perfectly to the visual content.

### 4. Synchronization
- All UI elements (zoom level, text reveals, frame progression) are unified under a single `HERO_SCROLL_RANGE_FACTOR`. Adjusting this one constant scales the entire cinematic experience.

## ⚙️ Development

### Local Setup
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### Adjusting Animation "Weight"
You can tune the "weight" of the scroll animation in `app/hooks/useScrollAnimation.ts`:
- Lower `lerpFactor` (e.g., `0.08`): More "heavy/cinematic" momentum.
- Higher `lerpFactor` (e.g., `0.2`): More "snappy/instant" response.

---
Built with 🔥 by Anirudha Basu Thakur.
