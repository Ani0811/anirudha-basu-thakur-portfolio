# CLI Shell & Canvas Graphics Engine

This document explains the command parsing framework and canvas-rendering components of the Terminal Overlay shell.

---

## ⌨️ CLI Command Parser

* **Location:** [hooks/useTerminalCommands.ts](file:///c:/GitHub/anirudha-basu-thakur-portfolio/hooks/useTerminalCommands.ts)
* **Design Pattern:** Command Dispatcher.
* **Flow:**
  1. Accepts user raw input string `cmd`.
  2. Appends input line to shell history list (`history` state array) to emulate command echo.
  3. Trims input and splits into parts:
     * `mainCommand` (first word, case-insensitive).
     * `args` (rest of the command string).
  4. Triggers corresponding conditional routine:
     * **Navigation (`projects`, `skills`, `contact`, `roast`):** Locates DOM element, scrolls smoothly, and triggers a pulsing cyan border highlight.
     * **Hacking (`roast-github [user/repo]`):** Performs secondary resolver calls if target is a simple username, then hits the backend code roaster, appending streaming AI results to CLI history.
     * **AI Twin Assistant (`ask [question]`):** Hits the AI Twin endpoint with the active `personality` mode.
     * **Personality Switcher (`personality [mode]`):** Updates the AI Twin model system prompt state.
     * **Graphics Modes (`matrix`, `snake`):** Toggles `terminalMode` state out of `'shell'`.

---

## ⚡ Canvas Graphics Engines

Both graphics sub-systems are integrated directly inside [TerminalOverlay.tsx](file:///c:/GitHub/anirudha-basu-thakur-portfolio/components/ui/TerminalOverlay.tsx) as dynamic helper components.

```
                      ┌─────────────────┐
                      │ TerminalOverlay │
                      └────────┬────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
      [terminalMode]     [terminalMode]     [terminalMode]
        == 'shell'         == 'matrix'        == 'snake'
            │                  │                  │
    Normal CLI Shell       MatrixRain         SnakeGame
```

---

### 1. Matrix Digital Rain Mode
* **Render Loop:** Triggered on interval every 33ms (approx. 30FPS).
* **Grid Computation:**
  * Divides canvas width by a fixed character `fontSize` (14px) to determine column count.
  * Tracks vertical offsets for columns using an array `rainDrops`.
* **Rendering Mechanics:**
  1. On each tick, draws a semi-transparent black rectangle (`rgba(5, 11, 20, 0.08)`) across the canvas. This creates the trailing decay/fade-out effect for falling characters.
  2. Iterates over columns, selecting a random Katakana/Alphanumeric character on each step.
  3. Fills characters down the grid in cyan (`#06b6d4`).
  4. If a drop reaches the canvas bottom, has a small random chance ($2.5\%$) of resetting its offset to `0`.
* **Exit Logic:** Escapes immediately upon clicking the canvas or pressing any key, restoring `'shell'` mode.

---

### 2. Retro Snake Game Mode
* **Render Loop:** Triggered on interval every 100ms (10FPS) to replicate classic arcade speed feel.
* **Coordinate Grid:** Tracks coordinate grids using a cell size of 16px.
* **Logic Calculations:**
  * **Input Capture:** Standard keydown event listener capturing Arrow keys and WASD inputs. Prevents reversing straight into the snake's own neck segment.
  * **Snake Movement:** Inserts a new head segment shifted in the direction of travel. Pop/removes the tail unless food coordinate matches head coordinate.
  * **Food Placement:** Generates a random coordinate inside columns and rows, avoiding overlapping snake segments.
  * **Collisions:** Sets `gameOver` to `true` if head coordinate falls outside canvas boundary columns/rows, or matches any of the snake's body coordinates.
* **Shell Integration:** Clicking "Exit to Shell" or exiting after game-over pushes the final score directly to the shell history:
  `"[GAME] Snake game exited. Final score: X points."`
