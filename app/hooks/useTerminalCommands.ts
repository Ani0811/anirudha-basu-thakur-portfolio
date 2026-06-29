import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export function useTerminalCommands() {
  const { setTerminalOpen } = usePortfolio();
  const [terminalMode, setTerminalMode] = useState<'shell' | 'matrix' | 'snake'>('shell');
  const [personality, setPersonality] = useState<'professional' | 'sarcastic' | 'cyberpunk'>('professional');
  
  const [history, setHistory] = useState<string[]>([
    "ANIRUDHA OS [Version 10.0.41]",
    "(c) Anirudha Basu Thakur. AI Twin Copilot Active.",
    "",
    "Type 'help' to see navigation and hacking commands.",
    "Try 'ask what is Anirudha's background?' to talk to the AI.",
    "",
  ]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setTerminalOpen(false); // Close terminal
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Add dynamic ring pulse highlight
        el.classList.add("ring-4", "ring-cyan-400/80", "shadow-[0_0_40px_rgba(34,211,238,0.6)]");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-cyan-400/80", "shadow-[0_0_40px_rgba(34,211,238,0.6)]");
        }, 2200);
      }, 100);
      return true;
    }
    return false;
  };

  const executeCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // Append user input line to history immediately
    setHistory(prev => [...prev, `anirudha@portfolio:~$ ${cmd}`]);

    const parts = trimmed.split(" ");
    const mainCommand = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    if (mainCommand === 'help') {
      const helpLines = [
        "Available commands:",
        "  projects              - Navigate to projects section",
        "  skills                - Navigate to skills section",
        "  contact               - Navigate to contact section",
        "  roast                 - Navigate to AI Code Roast tool",
        "  github                - Open GitHub profile",
        "  linkedin              - Open LinkedIn profile",
        "  ask [question]        - Ask Anirudha's AI Twin a question",
        "  roast-github [target] - Roast a GitHub user's top repo or owner/repo",
        "  personality [mode]    - Change AI personality (professional, sarcastic, cyberpunk)",
        "  matrix                - Launch Matrix rain visual mode",
        "  snake                 - Launch retro snake game",
        "  clear                 - Clear terminal history",
        "  exit / close          - Close terminal",
        "",
      ];
      setHistory(prev => [...prev, ...helpLines]);
    } else if (mainCommand === 'clear') {
      setHistory([]);
    } else if (mainCommand === 'exit' || mainCommand === 'close') {
      setTerminalOpen(false);
    } else if (mainCommand === 'projects') {
      if (scrollTo('projects')) {
        setHistory(prev => [...prev, "Navigating to Projects...", ""]);
      } else {
        setHistory(prev => [...prev, "Error: Section not found.", ""]);
      }
    } else if (mainCommand === 'skills') {
      if (scrollTo('skills')) {
        setHistory(prev => [...prev, "Navigating to Skills...", ""]);
      } else {
        setHistory(prev => [...prev, "Error: Section not found.", ""]);
      }
    } else if (mainCommand === 'contact') {
      if (scrollTo('contact')) {
        setHistory(prev => [...prev, "Navigating to Contact...", ""]);
      } else {
        setHistory(prev => [...prev, "Error: Section not found.", ""]);
      }
    } else if (mainCommand === 'roast') {
      if (scrollTo('sandbox')) {
        setHistory(prev => [...prev, "Navigating to AI Code Roast tool...", ""]);
      } else {
        setHistory(prev => [...prev, "Error: Section not found.", ""]);
      }
    } else if (mainCommand === 'github') {
      window.open("https://github.com/Ani0811", "_blank");
      setHistory(prev => [...prev, "Opening GitHub profile...", ""]);
    } else if (mainCommand === 'linkedin') {
      window.open("https://linkedin.com/in/anirudha-basu-thakur-686aa8253", "_blank");
      setHistory(prev => [...prev, "Opening LinkedIn profile...", ""]);
    } else if (mainCommand === 'matrix') {
      setTerminalMode('matrix');
      setHistory(prev => [...prev, "Launching Matrix Rain Mode... Press any key to return.", ""]);
    } else if (mainCommand === 'snake') {
      setTerminalMode('snake');
      setHistory(prev => [...prev, "Launching Retro Snake Game...", ""]);
    } else if (mainCommand === 'personality' || mainCommand === 'set-personality') {
      const mode = args.trim().toLowerCase();
      if (mode === 'professional' || mode === 'sarcastic' || mode === 'cyberpunk') {
        setPersonality(mode as any);
        setHistory(prev => [...prev, `System personality updated to: ${mode.toUpperCase()}`, ""]);
      } else {
        setHistory(prev => [...prev, "Error: Invalid personality. Available: professional, sarcastic, cyberpunk", ""]);
      }
    } else if (mainCommand === 'roast-github') {
      if (!args.trim()) {
        setHistory(prev => [...prev, "Error: Please provide a GitHub username or repo. Usage: roast-github <username> or roast-github <owner>/<repo>", ""]);
        return;
      }

      setHistory(prev => [...prev, "Analyzing GitHub repository...", ""]);
      
      try {
        let repoUrl = args.trim();
        // If it's a username (no slashes), fetch repos and choose first non-fork
        if (!repoUrl.includes('/')) {
          setHistory(prev => [...prev, `Fetching public repositories for user ${repoUrl}...`]);
          const reposResp = await fetch(`https://api.github.com/users/${repoUrl}/repos?sort=updated&per_page=5`);
          if (!reposResp.ok) {
            throw new Error(`GitHub user not found or API rate limit exceeded.`);
          }
          const repos = await reposResp.json();
          const mainRepo = repos.find((r: any) => !r.fork);
          if (!mainRepo) {
            throw new Error(`No non-fork repositories found for user ${repoUrl}.`);
          }
          repoUrl = mainRepo.full_name;
          setHistory(prev => [...prev, `Target resolved to active repository: ${repoUrl}. Commencing roast...`]);
        }

        // Add a loading line
        setHistory(prev => [...prev, "Thinking..."]);

        const res = await fetch('/api/ai/roast-github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl, projectName: repoUrl.split('/')[1] })
        });
        const data = await res.json();

        setHistory(prev => {
          const updated = [...prev];
          const lastIdx = updated.lastIndexOf("Thinking...");
          const reply = data.roast || data.error || "No response received.";
          if (lastIdx !== -1) {
            updated[lastIdx] = reply;
          } else {
            updated.push(reply);
          }
          updated.push(""); // empty line spacer
          return updated;
        });
      } catch (err: any) {
        setHistory(prev => {
          const updated = [...prev];
          const lastIdx = updated.lastIndexOf("Thinking...");
          const errMsg = err.message || "An error occurred.";
          if (lastIdx !== -1) {
            updated[lastIdx] = `Error: ${errMsg}`;
          } else {
            updated.push(`Error: ${errMsg}`);
          }
          updated.push("");
          return updated;
        });
      }
    } else if (mainCommand === 'ask') {
      if (!args.trim()) {
        setHistory(prev => [...prev, "Error: Please provide a question. Usage: ask <your question>", ""]);
        return;
      }

      // Add a loading line
      setHistory(prev => [...prev, "Thinking..."]);

      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: args, history: [], personality })
        });
        const data = await res.json();
        
        // Replace 'Thinking...' with the actual reply
        setHistory(prev => {
          const updated = [...prev];
          const lastIdx = updated.lastIndexOf("Thinking...");
          if (lastIdx !== -1) {
            updated[lastIdx] = data.reply || "No response received.";
          } else {
            updated.push(data.reply || "No response received.");
          }
          updated.push(""); // empty line spacer
          return updated;
        });
      } catch (err: any) {
        setHistory(prev => {
          const updated = [...prev];
          const lastIdx = updated.lastIndexOf("Thinking...");
          const errMsg = err.message || "An error occurred.";
          if (lastIdx !== -1) {
            updated[lastIdx] = `Error: ${errMsg}`;
          } else {
            updated.push(`Error: ${errMsg}`);
          }
          updated.push("");
          return updated;
        });
      }
    } else {
      setHistory(prev => [...prev, `Command not found: ${trimmed}. Type 'help' for available commands.`, ""]);
    }
  };

  return { history, executeCommand, setHistory, terminalMode, setTerminalMode, personality, setPersonality };
}
