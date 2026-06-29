'use client';

import { useState } from 'react';
import { FaFire, FaTimes } from 'react-icons/fa';

type Personality = 'toxic' | 'gordon_ramsay' | 'sarcastic' | 'cyberpunk';

const PERSONALITIES: { id: Personality; name: string; icon: string; desc: string; color: string }[] = [
  {
    id: 'toxic',
    name: 'Toxic Senior Dev',
    icon: '☠️',
    desc: 'Brutally honest, hyper-critical review of your code smells and algorithms.',
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 'gordon_ramsay',
    name: 'Gordon Ramsay',
    icon: '👨‍🍳',
    desc: 'IT\'S RAW! Yells at your code choices using cooking analogies.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'sarcastic',
    name: 'Sarcastic Dev',
    icon: '🙄',
    desc: 'Passive-aggressive, witty, and deeply unimpressed by your coding logic.',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Hacker',
    icon: '⚡',
    desc: 'Netrunner review criticizing security leaks and megacorp standards.',
    color: 'from-cyan-400 to-blue-600',
  },
];

export default function RoastMyCode() {
  const [code, setCode] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [personality, setPersonality] = useState<Personality>('toxic');

  const handleRoast = async () => {
    if (!code.trim()) {
      setError('Please paste some code first!');
      return;
    }

    setLoading(true);
    setError('');
    setRoast('');

    try {
      const response = await fetch('/api/ai/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, personality }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to roast code');
      }

      setRoast(data.roast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const activeColor = PERSONALITIES.find(p => p.id === personality)?.color || 'from-cyan-500 to-blue-500';

  return (
    <div className="w-full flex flex-col gap-6 font-mono text-slate-300">
      
      {/* Personality Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PERSONALITIES.map((p) => {
          const isSelected = personality === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setPersonality(p.id);
                if (roast) setRoast(''); // reset roast on personality change to prompt fresh roast
              }}
              className={`flex flex-col items-start text-left p-4 rounded-xl border text-xs gap-1.5 transition-all select-none duration-300 relative ${
                isSelected
                  ? `bg-linear-to-br ${p.color}/10 border-${p.id === 'cyberpunk' ? 'cyan-500' : p.id === 'sarcastic' ? 'purple-500' : 'orange-500'}/40 text-white shadow-[0_0_15px_rgba(249,115,22,0.1)]`
                  : 'bg-black/20 border-white/5 text-slate-400 hover:border-white/10 hover:bg-black/30 cursor-pointer hover:scale-[1.02] active:scale-95'
              }`}
            >
              <div className="flex justify-between w-full font-bold">
                <span>{p.icon} {p.name}</span>
                {isSelected && <span className="text-[9px] px-1 bg-white/10 border border-white/10 rounded uppercase font-bold">ACTIVE</span>}
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400">
                {p.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Editor & Results Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Editor Side */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#060c14] p-4 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2 text-slate-400">
            <span>💻 EDITOR // PASTE CODE BELOW</span>
            {code.trim() && (
              <button 
                onClick={() => setCode('')} 
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FaTimes /> Clear
              </button>
            )}
          </div>
          <div className="relative flex-1 min-h-[260px] flex">
            {/* Editor Line Numbers mockup */}
            <div className="w-8 select-none text-slate-600 text-xs text-right pr-2.5 font-mono pt-3.5 border-r border-white/5 space-y-0.5 leading-6">
              {[...Array(11)].map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              id="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your JS/TS/Python code here to get roasted...\nfunction messyCode() {\n  let x = 1;\n  setTimeout(() => {\n    x = x + 1;\n    console.log("callback hell starts here...");\n  }, 1000);\n}`}
              className="flex-1 min-h-[260px] p-3 pt-3.5 font-mono text-xs sm:text-sm bg-transparent border-none outline-none resize-none text-slate-200 placeholder-slate-600 focus:ring-0 leading-6"
              disabled={loading}
              spellCheck={false}
            />
          </div>

          <button
            onClick={handleRoast}
            disabled={loading || !code.trim()}
            className={`w-full py-3 px-6 rounded-lg bg-linear-to-r ${activeColor} text-white font-bold transition-all text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.15)] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95 cursor-pointer`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Compiling Roast...
              </span>
            ) : (
              <>
                <FaFire className="text-sm animate-pulse" /> COMPILER ENGINE: ROAST CODE
              </>
            )}
          </button>
        </div>

        {/* Roast Results Side */}
        <div className="flex flex-col rounded-2xl border border-white/5 bg-[#060c14] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 bg-black/40 flex justify-between items-center">
            <span className="text-xs text-slate-400">🔥 THE VERDICT</span>
            {roast && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20 font-bold uppercase tracking-widest animate-pulse">
                ROASTED
              </span>
            )}
          </div>
          
          <div className="flex-1 p-6 flex flex-col justify-center relative min-h-[300px]">
            {loading && (
              <div className="absolute inset-0 bg-[#060c14]/90 flex flex-col items-center justify-center gap-3 z-10">
                <span className="text-4xl animate-bounce">🔥</span>
                <span className="text-xs text-orange-400 font-bold tracking-widest animate-pulse uppercase">FEEDING THE AI CRITIC...</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-950/20 border border-red-500/30 text-red-400 rounded-xl text-xs leading-relaxed">
                <h5 className="font-bold mb-1">☠️ PIPELINE_ERROR</h5>
                <p>{error}</p>
              </div>
            )}

            {!roast && !error && !loading && (
              <div className="text-center text-slate-600 text-xs py-10 space-y-2">
                <div className="text-3xl opacity-30 select-none">🔎</div>
                <p className="max-w-xs mx-auto">Paste a code snippet on the left and hit Compile. Let's see what the critic thinks of your clean code dreams.</p>
              </div>
            )}

            {roast && (
              <div className="space-y-4 animate-fade-in">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-slate-200 text-sm sm:text-base leading-relaxed italic border-l-2 border-orange-500/40 pl-4 font-sans py-1">
                    "{roast}"
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
