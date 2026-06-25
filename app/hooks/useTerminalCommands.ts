import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export function useTerminalCommands() {
  const { toggleDeveloperMode, setTerminalOpen } = usePortfolio();
  
  const [history, setHistory] = useState<string[]>([
    "ANIRUDHA OS [Version 10.0.41]",
    "(c) Anirudha Basu Thakur. AI Twin Copilot Active.",
    "",
    "Type 'help' to see navigation commands.",
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
        "  projects        - Navigate to projects section",
        "  skills          - Navigate to skills section",
        "  contact         - Navigate to contact section",
        "  toggle-dev      - Toggle developer debug mode",
        "  roast           - Navigate to AI Code Roast tool",
        "  github          - Open GitHub profile",
        "  linkedin        - Open LinkedIn profile",
        "  ask [question]  - Ask Anirudha's AI Twin a question",
        "  clear           - Clear terminal history",
        "  exit / close    - Close terminal",
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
      if (scrollTo('projects')) {
        setHistory(prev => [...prev, "Navigating to Roast My Code tool...", ""]);
      } else {
        setHistory(prev => [...prev, "Error: Section not found.", ""]);
      }
    } else if (mainCommand === 'toggle-dev') {
      toggleDeveloperMode();
      setHistory(prev => [...prev, "Toggled Developer Debug Mode.", ""]);
    } else if (mainCommand === 'github') {
      window.open("https://github.com/Ani0811", "_blank");
      setHistory(prev => [...prev, "Opening GitHub profile...", ""]);
    } else if (mainCommand === 'linkedin') {
      window.open("https://linkedin.com/in/anirudha-basu-thakur-686aa8253", "_blank");
      setHistory(prev => [...prev, "Opening LinkedIn profile...", ""]);
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
          body: JSON.stringify({ message: args, history: [] })
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

  return { history, executeCommand, setHistory };
}
