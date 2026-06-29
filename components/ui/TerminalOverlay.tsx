'use client';

import { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { useTerminalCommands } from '@/hooks/useTerminalCommands';

export default function TerminalOverlay() {
  const { isTerminalOpen, setTerminalOpen } = usePortfolio();
  const { history, executeCommand, setHistory, terminalMode, setTerminalMode } = useTerminalCommands();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isTerminalOpen && terminalMode === 'shell') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isTerminalOpen, terminalMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput("");
  };

  if (!isTerminalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-fade-in bg-black/60 backdrop-blur-sm">
      <div 
        className="absolute inset-0" 
        onClick={() => setTerminalOpen(false)}
      />
      
      <div className="relative w-full max-w-4xl h-[70vh] max-h-[800px] flex flex-col bg-[#050b14]/95 border border-cyan-500/30 rounded-2xl shadow-[0_0_80px_rgba(34,211,238,0.2)] overflow-hidden animate-scale-in">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-black/40">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setTerminalOpen(false)}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-slate-400 font-mono text-xs select-none">
            anirudha@portfolio:~
          </div>
          <div className="w-14" /> {/* Spacer for balance */}
        </div>

        {/* Terminal Body */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {terminalMode === 'matrix' && (
            <MatrixRain onClose={() => setTerminalMode('shell')} />
          )}

          {terminalMode === 'snake' && (
            <SnakeGame onExit={(score) => {
              setTerminalMode('shell');
              setHistory(prev => [...prev, `[GAME] Snake game exited. Final score: ${score} points.`, ""]);
            }} />
          )}

          {terminalMode === 'shell' && (
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-sm sm:text-base space-y-1"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((line, i) => (
                <div 
                  key={i} 
                  className={`whitespace-pre-wrap break-words ${
                    line.startsWith('anirudha@portfolio:~$') 
                      ? 'text-cyan-400 font-bold' 
                      : line.startsWith('Error:') 
                        ? 'text-red-400'
                        : line.startsWith('[SYSTEM]')
                          ? 'text-cyan-300/80 font-semibold'
                          : line.startsWith('[GAME]')
                            ? 'text-emerald-400 font-bold'
                            : 'text-slate-300'
                  }`}
                >
                  {line}
                </div>
              ))}
              
              <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                <span className="text-cyan-400 shrink-0 font-bold">anirudha@portfolio:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-slate-100 caret-cyan-400 font-mono"
                  spellCheck={false}
                  autoComplete="off"
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MATRIX DIGITAL RAIN COMPONENT
   ========================================================================== */
function MatrixRain({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = katakana.split('');

    const fontSize = 14;
    const columns = canvas.width / fontSize;

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 11, 20, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#06b6d4'; // Cyan rain
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    const handleKeyDown = () => {
      onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 bg-[#050b14] overflow-hidden flex flex-col font-mono">
      <div className="flex justify-between items-center px-4 py-2 border-b border-cyan-500/20 bg-black/40 text-xs font-mono text-cyan-400 select-none z-10">
        <span>⚡ MATRIX OVERFLOW MODE // PRESS ANY KEY OR CLICK TO RETURN</span>
        <button onClick={onClose} className="px-2 py-0.5 border border-cyan-500/30 rounded hover:bg-cyan-500 hover:text-black transition-colors cursor-pointer">
          CLOSE
        </button>
      </div>
      <canvas 
        ref={canvasRef} 
        onClick={onClose}
        className="flex-1 w-full h-full cursor-pointer"
      />
    </div>
  );
}

/* ==========================================================================
   RETRO SNAKE GAME COMPONENT
   ========================================================================== */
interface SnakeGameProps {
  onExit: (score: number) => void;
}

function SnakeGame({ onExit }: SnakeGameProps) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game state references
  const snakeRef = useRef<{x: number, y: number}[]>([]);
  const foodRef = useRef<{x: number, y: number}>({ x: 5, y: 5 });
  const dirRef = useRef<{x: number, y: number}>({ x: 1, y: 0 });
  const lastDirRef = useRef<{x: number, y: number}>({ x: 1, y: 0 });
  const gridSize = 16;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);
    
    snakeRef.current = [
      { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
      { x: Math.floor(cols / 2) - 1, y: Math.floor(rows / 2) },
      { x: Math.floor(cols / 2) - 2, y: Math.floor(rows / 2) }
    ];
    
    const placeFood = () => {
      foodRef.current = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows)
      };
    };
    placeFood();

    const handleKeyDown = (e: KeyboardEvent) => {
      const lastDir = lastDirRef.current;
      
      if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && lastDir.y === 0) {
        dirRef.current = { x: 0, y: -1 };
      } else if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && lastDir.y === 0) {
        dirRef.current = { x: 0, y: 1 };
      } else if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && lastDir.x === 0) {
        dirRef.current = { x: -1, y: 0 };
      } else if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && lastDir.x === 0) {
        dirRef.current = { x: 1, y: 0 };
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = () => {
      if (gameOver) return;

      const snake = [...snakeRef.current];
      const dir = dirRef.current;
      lastDirRef.current = dir;

      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      // Check food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => s + 10);
        placeFood();
      } else {
        snake.pop();
      }

      snakeRef.current = snake;

      // Draw Screen
      ctx.fillStyle = '#050b14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle grids
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.02)';
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(foodRef.current.x * gridSize + gridSize/2, foodRef.current.y * gridSize + gridSize/2, gridSize/2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw snake
      snake.forEach((segment, idx) => {
        ctx.fillStyle = idx === 0 ? '#22d3ee' : '#0891b2';
        ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        
        if (idx === 0) {
          ctx.shadowColor = '#22d3ee';
          ctx.shadowBlur = 10;
          ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
          ctx.shadowBlur = 0;
        }
      });
    };

    const interval = setInterval(gameLoop, 100);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  return (
    <div className="absolute inset-0 z-50 bg-[#050b14] overflow-hidden flex flex-col font-mono text-cyan-400">
      <div className="flex justify-between items-center px-4 py-2 border-b border-cyan-500/20 bg-black/40 text-xs font-bold select-none">
        <span>🎮 SNAKE TERMINAL // MOVE WITH WASD OR ARROWS</span>
        <div className="flex gap-4">
          <span>SCORE: <strong className="text-white text-sm">{score}</strong></span>
          <button onClick={() => onExit(score)} className="px-2 py-0.5 border border-cyan-500/30 rounded hover:bg-cyan-500 hover:text-black transition-colors cursor-pointer">
            EXIT
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        {gameOver ? (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-black text-red-500 animate-pulse">GAME OVER</h3>
            <p className="text-slate-300">Final Score: <strong className="text-white">{score}</strong></p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => {
                  setScore(0);
                  setGameOver(false);
                }}
                className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                PLAY AGAIN
              </button>
              <button 
                onClick={() => onExit(score)}
                className="px-4 py-2 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 text-cyan-400 transition-colors cursor-pointer"
              >
                EXIT TO SHELL
              </button>
            </div>
          </div>
        ) : (
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={320} 
            className="border border-cyan-500/20 rounded-lg bg-black/45 max-w-full"
          />
        )}
      </div>
    </div>
  );
}
