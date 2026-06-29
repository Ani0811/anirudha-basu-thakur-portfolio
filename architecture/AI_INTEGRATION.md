# AI Integration & Personality Engine

This document details how Gemini AI (`gemini-2.5-flash`) powers Anirudha's AI clone, the standalone code roaster, and the GitHub repository analyzer.

---

## 🔌 API Routes Layout

```
                  ┌──────────────────────┐
                  │   User Request       │
                  └──────────┬───────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
    /api/ai/chat       /api/ai/roast     /api/ai/roast-github
    (AI Twin Chat)    (Custom Snippet)   (GitHub Repositories)
```

---

## 🧠 System Configurations & Prompt Injection

### 1. `/api/ai/chat` (AI Twin Assistant)
* **Location:** [app/api/ai/chat/route.ts](file:///c:/GitHub/anirudha-basu-thakur-portfolio/app/api/ai/chat/route.ts)
* **Goal:** Emulate Anirudha's technical background, relocation preferences, and co-founder history.
* **Flow:**
  1. Receives `{ message, history, personality }`.
  2. Injects a global biography context (`BIO_CONTEXT`) into the system instructions.
  3. Modifies prompt formatting based on `personality`:
     * **`professional` (Default):** Helpful, recruiter-friendly tone, answering in first person.
     * **`sarcastic`:** Cynical senior developer who is annoyed to answer queries, using emojis (🙄, 💻, 🧠).
     * **`cyberpunk`:** Cyber-hacker netrunner slang (mainframes, ICE, matrix, corps).
  4. Feeds histories to `model.startChat()` to maintain short-term memory inside the shell conversation.

### 2. `/api/ai/roast` (Standalone Code Roasting)
* **Location:** [app/api/ai/roast/route.ts](file:///c:/GitHub/anirudha-basu-thakur-portfolio/app/api/ai/roast/route.ts)
* **Goal:** Roast arbitrary pasted snippets.
* **Flow:**
  1. Receives `{ code, personality }`.
  2. Formulates custom prompts containing technical guidelines:
     * **Toxic Senior Dev:** Criticizes standard naming patterns, nested loops, and memory overheads.
     * **Gordon Ramsay:** Shouts in uppercase caps, focusing on raw quality using food analogies.
     * **Sarcastic Dev:** Passive-aggressive developer feedback.
     * **Cyberpunk Hacker:** Critiques code security and netrunner vulnerability.
  3. Demands Gemini return a concise, 3-4 sentence roast focusing on a real flaw, wrapped with funny emojis.

### 3. `/api/ai/roast-github` (Recursive Repository Analyzer)
* **Location:** [app/api/ai/roast-github/route.ts](file:///c:/GitHub/anirudha-basu-thakur-portfolio/app/api/ai/roast-github/route.ts)
* **Goal:** Connect to a GitHub repository, download codebase assets, and summarize engineering flaws.
* **Traversal Strategy:**
  1. Requests repository items list via GitHub Contents API (`https://api.github.com/repos/{owner/repo}/contents`).
  2. If root files are missing, starts a **BFS Traversal** across directories.
  3. Traverses subdirectories recursively to download up to **5 key code files** matching common formats (`.js`, `.ts`, `.py`, `.php`, `.tsx`).
  4. Reads files and combines them with README contents (capped to prevent API token overflow limits).
  5. Passes code logs to Gemini to generate a savage but educational architectural critique.
