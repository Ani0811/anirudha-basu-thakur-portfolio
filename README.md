# Anirudha Basu Thakur - Premium Interactive Portfolio

Welcome to the source code of my high-performance, interactive developer portfolio. Built with a focus on immersive, aesthetic UI, playful AI integrations, and real-time simulations, this project showcases modern React, Next.js page routers, and custom performance optimization patterns.

---

## 🕹️ Interactive Features

### 1. Standalone AI Code Roast Station
* **What it does:** Paste any raw JavaScript, TypeScript, or Python code snippet to receive funny, savage, yet constructively educational code reviews.
* **Selectable Personalities:**
  * **Toxic Senior Dev ☠️:** Hyper-critical analysis pointing out code smells and naming violations.
  * **Gordon Ramsay 👨‍🍳:** Yells in caps using cooking metaphors (*"THIS CALLBACK HELL IS RAW!"*).
  * **Sarcastic Dev 🙄:** Deeply unimpressed and passive-aggressive senior developer feedback.
  * **Cyberpunk Hacker ⚡:** Netrunner review highlighting security flaws and megacorp standards.

### 2. DDoS Sandbox Telemetry Dashboard
* **DDoS Game:** Slide values and purchase infrastructure upgrades (Rate Limiter, Edge Cache, Pod Auto-scaling, Read Replicas) to protect database health from escalating DDoS traffic.
* **Sparklines Panel:** Real-time visual metrics tracking **Traffic Load (QPS)**, **Database Latency (ms)**, and **Cache Hit Rate (%)**.
* **Syslog Terminal:** Aggregate streaming log files outputting cache hits, packet drops, database loads, and upgrade reports.
* **Alarm Siren:** Glowing strobe border alerts that flash across the panel when database health drops below 35%.

### 3. Developer CLI Console Hacking Modes
* Access via the floating widget or press the backtick (`` ` ``) key to open the interactive shell.
* **Commands:**
  * `help` - Show available commands.
  * `matrix` - Launch a retro cyan Matrix rain cascading visual canvas overlay. Press any key to exit.
  * `snake` - Launch a fully playable WASD/Arrow key retro Snake game directly in the console. Exiting logs your score.
  * `roast-github [user/repo]` - Resolves a user or repository, analyzes the code files/README, and streams a custom AI roast to the shell.
  * `personality [professional | sarcastic | cyberpunk]` - Toggle Anirudha's AI Twin personality mode.
  * `ask [question]` - Query Anirudha's dynamic AI Twin clone.

---

## 📂 Optimized Folder Structure

To align with Next.js App Router guidelines and improve Turbopack route indexing performance, non-routing folders have been moved to the root level. All relative paths have been refactored to use absolute path aliases:

* `components/` - Glassmorphism sections, effects, and reusable UI nodes.
* `hooks/` - Custom rendering hooks, scroll animations, and terminal command parsers.
* `context/` - Context providers (e.g. `PortfolioContext` for terminal overlay state).
* `app/` - Dedicated strictly to layouts, sitemaps, page segments, and API routes (`/api/ai/*`, `/api/github/*`, `/api/contact`).
* `public/` - Media files, project thumbnails, and resume documents.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (React 19, App Router)
* **Styling:** Tailwind CSS v4 (Vanilla CSS tokens, custom gradients)
* **Logic:** TypeScript
* **Animations:** Custom `requestAnimationFrame` canvas rendering, CSS Transitions
* **APIs:** Gemini API (`gemini-2.5-flash`), GitHub REST APIs, Nodemailer

---

## ⚡ Technical Achievements

1. **60FPS Scroll Animation Engine:** A Decoupled RAF loop that bypasses React's render/reconciliation cycle to draw frames directly to canvas with Linear Interpolation (lerping) and image pre-decoding.
2. **Two-Stage GitHub Activity Resolution:** Discovery stage queries the public GitHub event feed, then triggers parallel secondary lookups to the Commits API to resolve full messages.
3. **Telemetry & Log Pipelines:** Zero-bloat CSS sparkline charts and throttled event logging to ensure the DDoS game runs smoothly at 60FPS.

---

## ⚙️ Development

### Local Setup
```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

---

## 📖 Systems Architecture
For deep-dive descriptions, sequence flows, and logic details, explore the [Root Architecture Folder](./architecture).

* [AI Integrations & Personalities](./architecture/AI_INTEGRATION.md)
* [DDoS Simulator & Telemetry Engine](./architecture/DDOS_SIMULATOR.md)
* [CLI Shell & Canvas Graphics](./architecture/CLI_SHELL.md)

---
Built with 🔥 by Anirudha Basu Thakur.
